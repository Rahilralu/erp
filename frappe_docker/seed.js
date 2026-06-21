/**
 * ERPNext HRMS Full Seed Script — Cognifyr v4
 * Usage: node seed-hrms.js
 */

import axios from "axios";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
const client = axios.create({ baseURL: BASE_URL, withCredentials: true, headers: { "Content-Type": "application/json" } });

let sessionCookie = "";
let opCount = 0;

client.interceptors.request.use((c) => { if (sessionCookie) c.headers["Cookie"] = sessionCookie; return c; });
client.interceptors.response.use((res) => {
  const c = res.headers["set-cookie"];
  if (c) sessionCookie = c.map((x) => x.split(";")[0]).join("; ");
  return res;
});

async function login() {
  try {
    const res = await client.post("/api/method/login", { usr: "Administrator", pwd: "admin" });
    console.log("✅ Logged in:", res.data.message);
  } catch (e) {
    console.log("⚠️  Re-login failed, continuing");
  }
}

async function create(doctype, data) {
  opCount++;
  if (opCount % 20 === 0) await login();
  const doPost = () => client.post(`/api/resource/${encodeURIComponent(doctype)}`, data);
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await doPost();
      return res.data.data;
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.exception || err.response?.data?.message || err.message || "";
      if (msg.includes("Duplicate") || msg.includes("already exists") || msg.includes("duplicate")) {
        return { name: data.name || data.employee_name || "existing" };
      }
      if ((status === 500 || status === 404) && attempt === 1) { await login(); continue; }
      console.error(`  ⚠️  ${doctype} — ${msg.split("\n")[0]}`);
      return null;
    }
  }
}

async function getList(doctype, params = {}) {
  const res = await client.get(`/api/resource/${encodeURIComponent(doctype)}`, { params: { limit_page_length: 100, ...params } });
  return res.data.data;
}

async function patch(path, data) {
  try {
    const res = await client.put(`/api/resource/${path}`, data);
    return res.data.data;
  } catch (e) {
    console.error(`  ⚠️  PATCH ${path} — ${(e.response?.data?.exception || e.message || "").split("\n")[0]}`);
    return null;
  }
}

function log(s) { console.log(`\n── ${s} ${"─".repeat(50 - s.length)}`); }

const COMPANY = "Cognifyr";
const ABBR = "Co";
const DEPT = {
  engineering: `Research & Development - ${ABBR}`,
  hr:          `Human Resources - ${ABBR}`,
  sales:       `Sales - ${ABBR}`,
  marketing:   `Marketing - ${ABBR}`,
  finance:     `Accounts - ${ABBR}`,
  ops:         `Operations - ${ABBR}`,
  mgmt:        `Management - ${ABBR}`,
};

// ── 1. Designations ───────────────────────────────────────────────────────────

async function seedDesignations() {
  log("Designations");
  const list = ["Software Engineer","Senior Software Engineer","Engineering Manager",
    "HR Manager","HR Executive","Sales Executive","Sales Manager",
    "Marketing Analyst","Finance Manager","Product Manager","Operations Executive","Intern"];
  for (const d of list) {
    const r = await create("Designation", { designation_name: d });
    if (r) console.log(`  + ${d}`);
  }
}

// ── 2. Employees ──────────────────────────────────────────────────────────────

const EMPLOYEE_DATA = [
  { first: "Arjun",   last: "Menon",    dept: DEPT.engineering, desig: "Software Engineer",        doj: "2023-01-15", gender: "Male",   dob: "1997-03-10" },
  { first: "Priya",   last: "Nair",     dept: DEPT.engineering, desig: "Senior Software Engineer", doj: "2022-06-01", gender: "Female", dob: "1995-07-22" },
  { first: "Rohan",   last: "Sharma",   dept: DEPT.engineering, desig: "Engineering Manager",      doj: "2021-03-10", gender: "Male",   dob: "1990-11-05" },
  { first: "Sneha",   last: "Pillai",   dept: DEPT.hr,          desig: "HR Manager",               doj: "2020-09-01", gender: "Female", dob: "1992-04-18" },
  { first: "Kiran",   last: "Das",      dept: DEPT.hr,          desig: "HR Executive",             doj: "2023-07-20", gender: "Male",   dob: "1998-01-30" },
  { first: "Ananya",  last: "Iyer",     dept: DEPT.sales,       desig: "Sales Manager",            doj: "2022-11-05", gender: "Female", dob: "1993-09-14" },
  { first: "Vivek",   last: "Kumar",    dept: DEPT.sales,       desig: "Sales Executive",          doj: "2023-04-01", gender: "Male",   dob: "1999-06-25" },
  { first: "Meera",   last: "Rajan",    dept: DEPT.marketing,   desig: "Marketing Analyst",        doj: "2023-02-14", gender: "Female", dob: "1998-12-08" },
  { first: "Aditya",  last: "Verma",    dept: DEPT.finance,     desig: "Finance Manager",          doj: "2021-08-01", gender: "Male",   dob: "1991-02-17" },
  { first: "Lakshmi", last: "Krishnan", dept: DEPT.mgmt,        desig: "Product Manager",          doj: "2022-01-10", gender: "Female", dob: "1994-05-29" },
];

let employeeIds = [];

async function seedEmployees() {
  log("Employees");
  for (const emp of EMPLOYEE_DATA) {
    const r = await create("Employee", {
      first_name: emp.first, last_name: emp.last,
      employee_name: `${emp.first} ${emp.last}`,
      company: COMPANY, department: emp.dept, designation: emp.desig,
      date_of_joining: emp.doj, gender: emp.gender,
      status: "Active", date_of_birth: emp.dob,
    });
    if (r) { console.log(`  + ${emp.first} ${emp.last} (${r.name})`); employeeIds.push(r.name); }
  }
  const all = await getList("Employee");
  employeeIds = all.map((e) => e.name);
  console.log(`  → Total employees: ${employeeIds.length}`);
}

// ── 3. Holiday List ───────────────────────────────────────────────────────────

async function seedHolidayList() {
  log("Holiday List");
  await login();
  const r = await create("Holiday List", {
    holiday_list_name: "Cognifyr Holidays 2025",
    from_date: "2025-01-01",
    to_date: "2025-12-31",
    holidays: [
      { holiday_date: "2025-01-26", description: "Republic Day" },
      { holiday_date: "2025-04-14", description: "Ambedkar Jayanti" },
      { holiday_date: "2025-08-15", description: "Independence Day" },
      { holiday_date: "2025-10-02", description: "Gandhi Jayanti" },
      { holiday_date: "2025-10-24", description: "Dussehra" },
      { holiday_date: "2025-11-01", description: "Kerala Piravi" },
      { holiday_date: "2025-12-25", description: "Christmas" },
    ],
  });
  if (r) {
    console.log(`  + Created: Cognifyr Holidays 2025`);
    await patch(`Company/${encodeURIComponent(COMPANY)}`, { default_holiday_list: "Cognifyr Holidays 2025" });
    console.log(`  + Set as company default`);
  }
}

// ── 4. Leave Types ────────────────────────────────────────────────────────────

async function seedLeaveTypes() {
  log("Leave Types");
  const types = [
    { name: "Annual Leave", max: 18, paid: 1 }, { name: "Sick Leave", max: 12, paid: 1 },
    { name: "Casual Leave", max: 6, paid: 1 },  { name: "Maternity Leave", max: 90, paid: 1 },
    { name: "Paternity Leave", max: 15, paid: 1 }, { name: "Unpaid Leave", max: 30, paid: 0 },
    { name: "Compensatory Off", max: 10, paid: 1 },
  ];
  for (const t of types) {
    const r = await create("Leave Type", { leave_type_name: t.name, max_days_allowed: t.max, is_paid_leave: t.paid, allow_negative: 0 });
    if (r) console.log(`  + ${t.name}`);
  }
}

// ── 5. Leave Allocations ──────────────────────────────────────────────────────

async function seedLeaveAllocations() {
  log("Leave Allocations");
  await login();
  const types = [
    { name: "Annual Leave", days: 18 },
    { name: "Sick Leave", days: 12 },
    { name: "Casual Leave", days: 6 },
  ];
  for (const empId of employeeIds.slice(0, 6)) {
    for (const lt of types) {
      const r = await create("Leave Allocation", {
        employee: empId, leave_type: lt.name,
        from_date: "2025-01-01", to_date: "2025-12-31",
        new_leaves_allocated: lt.days, docstatus: 1,
      });
      if (r) console.log(`  + ${empId} — ${lt.name}`);
    }
  }
}

// ── 6. Leave Applications ─────────────────────────────────────────────────────

async function seedLeaveApplications() {
  log("Leave Applications");
  if (employeeIds.length < 5) return;
  await login();
  const apps = [
    { i: 1, type: "Sick Leave",   from: "2025-06-10", to: "2025-06-12", reason: "Fever and cold" },
    { i: 2, type: "Casual Leave", from: "2025-06-20", to: "2025-06-20", reason: "Personal work" },
    { i: 4, type: "Sick Leave",   from: "2025-06-03", to: "2025-06-04", reason: "Medical appointment" },
  ];
  for (const a of apps) {
    const r = await create("Leave Application", {
      employee: employeeIds[a.i], leave_type: a.type,
      from_date: a.from, to_date: a.to,
      description: a.reason, status: "Open", docstatus: 0,
    });
    if (r) console.log(`  + ${employeeIds[a.i]} — ${a.type}`);
  }
}

// ── 7. Job Openings ───────────────────────────────────────────────────────────

let jobOpeningIds = [];

async function seedJobOpenings() {
  log("Job Openings");
  await login();
  const openings = [
    { title: "Backend Engineer",         dept: DEPT.engineering, desig: "Software Engineer" },
    { title: "Frontend Engineer",        dept: DEPT.engineering, desig: "Software Engineer" },
    { title: "HR Business Partner",      dept: DEPT.hr,          desig: "HR Manager" },
    { title: "Growth Marketing Manager", dept: DEPT.marketing,   desig: "Marketing Analyst" },
    { title: "Sales Development Rep",    dept: DEPT.sales,       desig: "Sales Executive" },
    { title: "Senior Product Manager",   dept: DEPT.mgmt,        desig: "Product Manager" },
  ];
  for (const o of openings) {
    const r = await create("Job Opening", {
      job_title: o.title, department: o.dept,
      designation: o.desig, company: COMPANY, status: "Open",
    });
    if (r && r.name !== "existing") {
      console.log(`  + ${o.title} (${r.name})`);
      jobOpeningIds.push(r.name);
    }
  }
  // If all were duplicates, fetch existing ones
  if (jobOpeningIds.length === 0) {
    const existing = await getList("Job Opening");
    jobOpeningIds = existing.map((j) => j.name);
    console.log(`  → Using ${jobOpeningIds.length} existing job openings`);
  }
}

// ── 8. Job Applicants ─────────────────────────────────────────────────────────

async function seedJobApplicants() {
  log("Job Applicants");
  if (jobOpeningIds.length === 0) return;
  await login();
  const applicants = [
    { name: "Rahul Gupta",   email: "rahul.gupta@example.com",   job: jobOpeningIds[0] },
    { name: "Divya Menon",   email: "divya.menon@example.com",   job: jobOpeningIds[0] },
    { name: "Sanjay Pillai", email: "sanjay.pillai@example.com", job: jobOpeningIds[1] || jobOpeningIds[0] },
    { name: "Kavya Nair",    email: "kavya.nair@example.com",    job: jobOpeningIds[2] || jobOpeningIds[0] },
    { name: "Nikhil Sharma", email: "nikhil.sharma@example.com", job: jobOpeningIds[3] || jobOpeningIds[0] },
    { name: "Pooja Iyer",    email: "pooja.iyer@example.com",    job: jobOpeningIds[4] || jobOpeningIds[0] },
  ];
  for (const a of applicants) {
    const r = await create("Job Applicant", { applicant_name: a.name, email_id: a.email, job_title: a.job, status: "Open" });
    if (r) console.log(`  + ${a.name}`);
  }
}

// ── 9. Attendance ─────────────────────────────────────────────────────────────

async function seedAttendance() {
  log("Attendance");
  if (employeeIds.length === 0) return;
  await login();
  const statuses = ["Present","Present","Present","Present","Absent","Half Day","Present"];
  const dates = [];
  let d = new Date("2025-06-01");
  while (dates.length < 14) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) dates.push(d.toISOString().split("T")[0]);
    d.setDate(d.getDate() + 1);
  }
  for (const empId of employeeIds.slice(0, 5)) {
    await login();
    for (let i = 0; i < dates.length; i++) {
      await create("Attendance", {
        employee: empId, attendance_date: dates[i],
        status: statuses[i % statuses.length],
        company: COMPANY, docstatus: 1,
      });
      process.stdout.write(".");
    }
  }
  console.log(`\n  + Done (${Math.min(5, employeeIds.length)} employees × 14 days)`);
}

// ── 10. Salary Structure ──────────────────────────────────────────────────────

let salaryStructureName = "";

async function seedSalaryStructure() {
  log("Salary Structure");
  await login();
  const r = await create("Salary Structure", {
    name: "Standard Monthly - Co",
    company: COMPANY, payroll_frequency: "Monthly",
    currency: "INR", is_active: "Yes", docstatus: 1,
    earnings: [
      { salary_component: "Basic",                abbr: "B",   formula: "base * 0.5", amount_based_on_formula: 1 },
      { salary_component: "House Rent Allowance", abbr: "HRA", formula: "base * 0.2", amount_based_on_formula: 1 },
    ],
    deductions: [
      { salary_component: "Provident Fund",   abbr: "PF", formula: "base * 0.12", amount_based_on_formula: 1 },
      { salary_component: "Professional Tax", abbr: "PT", amount: 200, amount_based_on_formula: 0 },
    ],
  });
  if (r) { salaryStructureName = r.name || "Standard Monthly - Co"; console.log(`  + ${salaryStructureName}`); }
}

// ── 11. Salary Structure Assignments ─────────────────────────────────────────

async function seedSalaryAssignments() {
  log("Salary Structure Assignments");
  if (!salaryStructureName || employeeIds.length === 0) return;
  await login();
  for (const empId of employeeIds.slice(0, 6)) {
    const r = await create("Salary Structure Assignment", {
      employee: empId, salary_structure: salaryStructureName,
      from_date: "2025-01-01", base: 50000,
      company: COMPANY, docstatus: 1,
    });
    if (r) console.log(`  + ${empId}`);
  }
}

// ── 12. Expense Claim Type setup ──────────────────────────────────────────────

async function seedExpenseClaimType() {
  log("Expense Claim Type");
  await login();
  // Find default payable account
  try {
    const res = await client.get("/api/resource/Account", {
      params: {
        filters: JSON.stringify([["company","=",COMPANY],["account_type","=","Payable"],["is_group","=",0]]),
        limit_page_length: 5,
      },
    });
    const accounts = res.data.data;
    if (!accounts.length) { console.log("  ⚠️  No payable account found"); return; }
    const acct = accounts[0].name;
    await patch(`Expense%20Claim%20Type/Travel`, { accounts: [{ company: COMPANY, default_account: acct }] });
    console.log(`  + Travel → ${acct}`);
  } catch (e) {
    console.log(`  ⚠️  ${e.message}`);
  }
}

// ── 13. Expense Claims ────────────────────────────────────────────────────────

async function seedExpenseClaims() {
  log("Expense Claims");
  if (employeeIds.length < 4) return;
  await login();
  const claims = [
    { i: 0, total: 2500, desc: "Client dinner - Bangalore trip" },
    { i: 1, total: 1800, desc: "Conference registration fee" },
    { i: 2, total: 5200, desc: "Team offsite travel expenses" },
    { i: 3, total: 950,  desc: "Office supplies purchase" },
  ];
  for (const c of claims) {
    const r = await create("Expense Claim", {
      employee: employeeIds[c.i], company: COMPANY,
      posting_date: "2025-06-15", expense_approver: "Administrator",
      expenses: [{ expense_date: "2025-06-15", expense_type: "Travel", description: c.desc, amount: c.total, sanctioned_amount: c.total }],
      total_claimed_amount: c.total, total_sanctioned_amount: c.total, docstatus: 0,
    });
    if (r) console.log(`  + ${employeeIds[c.i]} — Rs.${c.total}`);
  }
}

// ── 14. Appraisals ────────────────────────────────────────────────────────────

async function seedAppraisals() {
  log("Appraisals");
  if (employeeIds.length < 3) return;
  await login();
  // HRMS v15 Appraisal uses appraisal_cycle — skip that, use simple fields
  for (const empId of employeeIds.slice(0, 4)) {
    const r = await create("Appraisal", {
      employee: empId,
      company: COMPANY,
      start_date: "2025-01-01",
      end_date: "2025-06-30",
      status: "Draft",
    });
    if (r) console.log(`  + ${empId}`);
  }
}

// ── 15. Shift Types ───────────────────────────────────────────────────────────

async function seedShiftTypes() {
  log("Shift Types");
  const shifts = [
    { name: "Morning Shift",   start: "09:00:00", end: "18:00:00" },
    { name: "Afternoon Shift", start: "14:00:00", end: "22:00:00" },
    { name: "Night Shift",     start: "22:00:00", end: "06:00:00" },
  ];
  for (const s of shifts) {
    const r = await create("Shift Type", { name: s.name, start_time: s.start, end_time: s.end });
    if (r) console.log(`  + ${s.name}`);
  }
}

// ── 16. Shift Assignments ─────────────────────────────────────────────────────

async function seedShiftAssignments() {
  log("Shift Assignments");
  if (employeeIds.length < 3) return;
  await login();
  for (const empId of employeeIds.slice(0, 4)) {
    const r = await create("Shift Assignment", {
      employee: empId, company: COMPANY,
      shift_type: "Morning Shift", start_date: "2025-06-01", status: "Active",
    });
    if (r) console.log(`  + ${empId}`);
  }
}

// ── 17. Training Events ───────────────────────────────────────────────────────

async function seedTrainingEvents() {
  log("Training Events");
  await login();
  const events = [
    { name: "Onboarding Bootcamp Q3 2025",    trainer: "Sneha Pillai",    start: "2025-07-01 09:00:00", end: "2025-07-01 17:00:00", location: "Kochi Office", intro: "Onboarding program for new joiners." },
    { name: "Leadership Development Program", trainer: "Rohan Sharma",    start: "2025-08-15 09:00:00", end: "2025-08-15 17:00:00", location: "Bangalore",    intro: "Leadership skills for managers." },
    { name: "Security Awareness Training",    trainer: "External Vendor", start: "2025-06-25 10:00:00", end: "2025-06-25 13:00:00", location: "Virtual",      intro: "Cybersecurity awareness training." },
    { name: "Agile and Scrum Certification",  trainer: "Arjun Menon",     start: "2025-09-10 09:00:00", end: "2025-09-10 17:00:00", location: "Kochi Office", intro: "Agile methodology and Scrum certification." },
  ];
  for (const e of events) {
    const r = await create("Training Event", {
      event_name: e.name, trainer_name: e.trainer,
      start_time: e.start, end_time: e.end,
      location: e.location, introduction: e.intro,
      status: "Scheduled",
    });
    if (r) console.log(`  + ${e.name}`);
  }
}

// ── 18. Exit Interview ────────────────────────────────────────────────────────

async function seedExitInterviews() {
  log("Exit Interviews");
  if (employeeIds.length < 1) return;
  await login();
  // Set relieving date on last employee first
  const empId = employeeIds[employeeIds.length - 1];
  await patch(`Employee/${empId}`, { relieving_date: "2025-06-30", status: "Left" });
  console.log(`  + Set relieving date for ${empId}`);
  const r = await create("Exit Interview", {
    employee: empId, company: COMPANY, date: "2025-06-30",
    interview_summary: "Employee leaving for higher studies. Overall positive experience.",
    reason_for_leaving: "Better Prospects", status: "Pending",
  });
  if (r) console.log(`  + Exit Interview: ${empId}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  ERPNext HRMS Seed Script — Cognifyr v4");
  console.log(`    Target: ${BASE_URL}\n`);
  await login();
  await seedDesignations();
  await seedEmployees();
  await seedHolidayList();
  await seedLeaveTypes();
  await seedLeaveAllocations();
  await seedLeaveApplications();
  await seedJobOpenings();
  await seedJobApplicants();
  await seedAttendance();
  await seedSalaryStructure();
  await seedSalaryAssignments();
  await seedExpenseClaimType();
  await seedExpenseClaims();
  await seedAppraisals();
  await seedShiftTypes();
  await seedShiftAssignments();
  await seedTrainingEvents();
  await seedExitInterviews();
  console.log("\n\n✅  All HRMS modules seeded!");
}

main().catch((err) => { console.error("\n❌ Seed failed:", err.message); process.exit(1); });