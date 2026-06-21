/**
 * ERPNext HRMS Postman Collection Generator matching User's Exact Schema
 * Usage: node generate_postman.js
 */

import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
const AUTH_TOKEN = "token 9466ea0f2b54a8d:0efa2f0653f2d41";

const client = axios.create({ 
  baseURL: BASE_URL, 
  withCredentials: true, 
  headers: { 
    "Content-Type": "application/json",
    "Authorization": AUTH_TOKEN
  } 
});

const LINK_FALLBACKS = {
  "Company": "Cognifyr",
  "Department": "Research & Development - Co",
  "Designation": "Software Engineer",
  "Leave Type": "Annual Leave",
  "Holiday List": "Cognifyr Holidays 2025",
  "Shift Type": "Morning Shift",
  "Salary Structure": "Standard Monthly - Co",
  "Expense Claim Type": "Travel",
  "Employment Type": "Full-time",
  "Salary Component": "Basic",
  "Trainer": "Sneha Pillai",
  "Training Program": "Onboarding Bootcamp Q3 2025"
};

function getLowName(dtName) {
  return dtName.toLowerCase();
}

function getPluralName(dtName) {
  const low = dtName.toLowerCase();
  if (low.endsWith("y")) {
    return low.slice(0, -1) + "ies";
  }
  if (low.endsWith("s") || low.endsWith("ch") || low.endsWith("sh")) {
    return low + "es";
  }
  return low + "s";
}

async function fetchDocTypes() {
  console.log("🔍 Fetching HR/Payroll/HRMS DocTypes from backend...");
  try {
    const res = await client.get("/api/resource/DocType", {
      params: {
        filters: JSON.stringify([
          ["module", "in", ["HR", "Payroll", "HRMS"]],
          ["istable", "=", 0]
        ]),
        fields: JSON.stringify(["name", "module", "istable", "issingle"]),
        limit_page_length: 500
      }
    });
    
    return res.data.data.sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    console.error("❌ Failed to fetch DocTypes list:", e.response?.data?.message || e.message);
    process.exit(1);
  }
}

async function getLinkValue(linkDocType) {
  try {
    const res = await client.get(`/api/resource/${encodeURIComponent(linkDocType)}`, {
      params: { limit_page_length: 1 }
    });
    if (res.data.data && res.data.data.length > 0) {
      return res.data.data[0].name;
    }
  } catch (e) {
    // Ignore and fallback
  }
  if (LINK_FALLBACKS[linkDocType]) {
    return LINK_FALLBACKS[linkDocType];
  }
  return `Test ${linkDocType}`;
}

async function generateMockPayload(doctypeName) {
  try {
    const res = await client.get(`/api/resource/DocType/${encodeURIComponent(doctypeName)}`);
    const docFields = res.data.data.fields || [];
    const payload = {
      doctype: doctypeName
    };
    
    const hasNamingSeries = docFields.some(f => f.fieldname === "naming_series");
    if (hasNamingSeries) {
      payload.naming_series = "HR-";
    }

    for (const field of docFields) {
      if (field.reqd === 1 && field.read_only === 0) {
        const fieldname = field.fieldname;
        const type = field.fieldtype;
        const options = field.options;

        if (type === "Link") {
          payload[fieldname] = await getLinkValue(options);
        } else if (type === "Select") {
          const choices = options ? options.split("\n").map(c => c.trim()).filter(Boolean) : [];
          payload[fieldname] = choices.length > 0 ? choices[0] : "";
        } else if (type === "Date") {
          payload[fieldname] = "2025-06-21";
        } else if (type === "Datetime") {
          payload[fieldname] = "2025-06-21 12:00:00";
        } else if (type === "Time") {
          payload[fieldname] = "09:00:00";
        } else if (type === "Check") {
          payload[fieldname] = 0;
        } else if (["Int", "Float", "Percent", "Currency"].includes(type)) {
          payload[fieldname] = 10;
        } else {
          payload[fieldname] = `Test ${fieldname}`;
        }
      }
    }
    
    if (doctypeName === "Employee") {
      payload.first_name = "John";
      payload.last_name = "Doe";
      payload.employee_name = "John Doe";
      payload.gender = "Male";
      payload.date_of_birth = "1995-01-15";
      payload.date_of_joining = "2024-06-01";
      payload.company = "Cognifyr";
      payload.department = "Research & Development - Co";
      payload.designation = "Software Engineer";
      payload.status = "Active";
    } else if (doctypeName === "Leave Application") {
      payload.from_date = "2026-07-01";
      payload.to_date = "2026-07-02";
      payload.half_day = 0;
      payload.description = "Personal work";
      payload.company = "Cognifyr";
      payload.leave_type = "Casual Leave";
      payload.employee = "HR-EMP-00001";
    } else if (doctypeName === "Attendance") {
      payload.attendance_date = "2026-06-21";
      payload.status = "Present";
      payload.company = "Cognifyr";
      payload.employee = "HR-EMP-00001";
    } else if (doctypeName === "Expense Claim") {
      payload.posting_date = "2026-06-21";
      payload.employee = "HR-EMP-00001";
      payload.company = "Cognifyr";
      payload.expenses = [{
        expense_date: "2026-06-20",
        expense_type: "Travel",
        amount: 500,
        description: "Client visit"
      }];
    } else if (doctypeName === "Job Applicant") {
      payload.applicant_name = "Rahil Moosa";
      payload.email_id = "rahil@example.com";
      payload.job_title = "Backend Engineer";
      payload.status = "Open";
      payload.source = "Website";
    } else if (doctypeName === "Job Opening") {
      payload.job_title = "Backend Engineer";
      payload.department = "Research & Development - Co";
      payload.company = "Cognifyr";
      payload.no_of_positions = 2;
      payload.status = "Open";
    } else if (doctypeName === "Shift Assignment") {
      payload.employee = "HR-EMP-00001";
      payload.shift_type = "Morning";
      payload.start_date = "2026-07-01";
      payload.company = "Cognifyr";
      payload.status = "Active";
    } else if (doctypeName === "Employee Checkin") {
      payload.employee = "HR-EMP-00001";
      payload.log_type = "IN";
      payload.time = "2026-06-21 09:00:00";
      payload.device_id = "MAIN-GATE";
    } else if (doctypeName === "Leave Allocation") {
      payload.employee = "HR-EMP-00001";
      payload.leave_type = "Casual Leave";
      payload.from_date = "2026-01-01";
      payload.to_date = "2026-12-31";
      payload.new_leaves_allocated = 12;
      payload.company = "Cognifyr";
    } else if (doctypeName === "Appraisal") {
      payload.employee = "HR-EMP-00001";
      payload.company = "Cognifyr";
      payload.start_date = "2026-04-01";
      payload.end_date = "2026-06-30";
    } else if (doctypeName === "Employee Onboarding") {
      payload.employee = "HR-EMP-00001";
      payload.date_of_joining = "2026-07-01";
      payload.company = "Cognifyr";
      payload.department = "Research & Development - Co";
    }
    
    return payload;
  } catch (e) {
    return {};
  }
}

function getPostmanUrl(dtName, isSingle, action, sampleRecordName = "") {
  let raw = "";
  let pathParts = ["api", "resource", dtName];
  let query = [];

  if (action === "list") {
    if (isSingle) {
      raw = `http://localhost:8080/api/resource/${encodeURIComponent(dtName)}/${encodeURIComponent(dtName)}`;
      pathParts.push(dtName);
    } else {
      raw = `http://localhost:8080/api/resource/${encodeURIComponent(dtName)}?limit_page_length=20`;
      query.push({ key: "limit_page_length", value: "20" });
    }
  } else if (action === "create") {
    raw = `http://localhost:8080/api/resource/${encodeURIComponent(dtName)}`;
  } else {
    raw = `http://localhost:8080/api/resource/${encodeURIComponent(dtName)}/${encodeURIComponent(sampleRecordName)}`;
    pathParts.push(sampleRecordName);
  }

  return {
    raw: raw,
    protocol: "http",
    host: ["localhost"],
    port: "8080",
    path: pathParts,
    query: query
  };
}

async function main() {
  console.log("=================================================");
  console.log("🚀 Generating Postman Collection (Exact User Schema)");
  console.log("=================================================");

  const doctypes = await fetchDocTypes();

  const collection = {
    info: {
      _postman_id: crypto.randomUUID(),
      name: "ERPNext HRMS API — Documented",
      description: "HR portal API with real field names from Cognifyr ERPNext instance. All POST/PUT bodies use actual field names.",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      _exporter_id: "0"
    },
    item: [],
    auth: {
      type: "apikey",
      apikey: [
        {
          key: "key",
          value: "Authorization",
          type: "string"
        },
        {
          key: "value",
          value: AUTH_TOKEN,
          type: "string"
        },
        {
          key: "in",
          value: "header",
          type: "string"
        }
      ]
    }
  };

  const headersStandard = [
    {
      key: "Authorization",
      value: AUTH_TOKEN
    }
  ];

  const headersWrite = [
    {
      key: "Authorization",
      value: AUTH_TOKEN
    },
    {
      key: "Content-Type",
      value: "application/json"
    }
  ];

  for (let i = 0; i < doctypes.length; i++) {
    const dt = doctypes[i];
    const isSingle = dt.issingle === 1 || dt.issingle === true || dt.issingle === "1";
    process.stdout.write(`(${i + 1}/${doctypes.length}) Processing Postman requests for ${dt.name}... `);

    let sampleRecordName = "HR-EMP-00001";
    if (dt.name === "Attendance") sampleRecordName = "ATT-00001";
    else if (dt.name === "Leave Application") sampleRecordName = "HR-LAP-00001";
    else if (dt.name === "Leave Type") sampleRecordName = "Casual Leave";
    else if (dt.name === "Leave Allocation") sampleRecordName = "HR-LAL-00001";
    else if (dt.name === "Employee Checkin") sampleRecordName = "ECI-00001";
    else if (dt.name === "Shift Assignment") sampleRecordName = "SA-00001";
    else if (dt.name === "Expense Claim") sampleRecordName = "EXP-00001";
    else if (dt.name === "Job Opening") sampleRecordName = "HR-JOB-00001";
    else if (dt.name === "Job Applicant") sampleRecordName = "HR-APP-00001";
    else if (dt.name === "Appraisal") sampleRecordName = "HR-APR-00001";
    else if (dt.name === "Employee Onboarding") sampleRecordName = "HR-ONB-00001";
    else {
      // Dynamic lookup from database
      try {
        if (!isSingle) {
          const res = await client.get(`/api/resource/${encodeURIComponent(dt.name)}`, {
            params: { limit_page_length: 1 }
          });
          if (res.data.data && res.data.data.length > 0) {
            sampleRecordName = res.data.data[0].name;
          } else {
            sampleRecordName = `SAMPLE-${dt.name.toUpperCase().replace(/\s+/g, "-")}-001`;
          }
        } else {
          sampleRecordName = dt.name;
        }
      } catch (e) {
        sampleRecordName = `SAMPLE-${dt.name.toUpperCase().replace(/\s+/g, "-")}-001`;
      }
    }

    const mockPayload = isSingle ? {} : await generateMockPayload(dt.name);
    
    // Custom body values for updates to match user's custom PUT schema
    let updatePayload = { description: "Updated value" };
    if (dt.name === "Employee") {
      updatePayload = {
        department: "Engineering - Co",
        designation: "Senior Software Engineer",
        status: "Active"
      };
    } else if (dt.name === "Attendance") {
      updatePayload = { status: "Half Day" };
    } else if (dt.name === "Leave Application") {
      updatePayload = { status: "Approved" };
    } else if (dt.name === "Leave Type") {
      updatePayload = { max_days_allowed: 12 };
    } else if (dt.name === "Leave Allocation") {
      updatePayload = { new_leaves_allocated: 15 };
    } else if (dt.name === "Employee Checkin") {
      updatePayload = { time: "2026-06-21 09:05:00" };
    } else if (dt.name === "Shift Assignment") {
      updatePayload = { status: "Inactive" };
    } else if (dt.name === "Expense Claim") {
      updatePayload = { approval_status: "Approved" };
    } else if (dt.name === "Job Opening") {
      updatePayload = { status: "Closed" };
    } else if (dt.name === "Job Applicant") {
      updatePayload = { status: "Accepted" };
    } else if (dt.name === "Appraisal") {
      updatePayload = { status: "Completed" };
    } else if (dt.name === "Employee Onboarding") {
      updatePayload = { status: "Completed" };
    }

    const folder = {
      name: dt.name,
      id: crypto.randomUUID(),
      item: []
    };

    const lowSingular = getLowName(dt.name);
    const lowPlural = getPluralName(dt.name);

    if (isSingle) {
      // GET Single
      folder.item.push({
        id: crypto.randomUUID(),
        name: `Get ${lowSingular}`,
        request: {
          method: "GET",
          header: headersStandard,
          url: getPostmanUrl(dt.name, true, "list"),
          description: `Get ${lowSingular}`
        },
        response: []
      });

      // PUT Update
      folder.item.push({
        id: crypto.randomUUID(),
        name: `Update ${lowSingular}`,
        request: {
          method: "PUT",
          header: headersWrite,
          url: getPostmanUrl(dt.name, true, "list"),
          description: `Update ${lowSingular}`,
          body: {
            mode: "raw",
            raw: JSON.stringify(updatePayload, null, 2),
            options: {
              raw: {
                language: "json"
              }
            }
          }
        },
        response: []
      });
    } else {
      // Standard DocType: GET List, GET Detail, POST Create, PUT Update, DELETE
      
      // 1. List
      folder.item.push({
        id: crypto.randomUUID(),
        name: `List ${lowPlural}`,
        request: {
          method: "GET",
          header: headersStandard,
          url: getPostmanUrl(dt.name, false, "list"),
          description: `List ${lowPlural}`
        },
        response: []
      });

      // 2. Get Detail
      folder.item.push({
        id: crypto.randomUUID(),
        name: `Get ${lowSingular} by ID`,
        request: {
          method: "GET",
          header: headersStandard,
          url: getPostmanUrl(dt.name, false, "detail", sampleRecordName),
          description: `Get ${lowSingular} by ID`
        },
        response: []
      });

      // 3. Create
      folder.item.push({
        id: crypto.randomUUID(),
        name: `Create ${lowSingular}`,
        request: {
          method: "POST",
          header: headersWrite,
          url: getPostmanUrl(dt.name, false, "create"),
          description: `Create ${lowSingular}`,
          body: {
            mode: "raw",
            raw: JSON.stringify(mockPayload, null, 2),
            options: {
              raw: {
                language: "json"
              }
            }
          }
        },
        response: []
      });

      // 4. Update
      folder.item.push({
        id: crypto.randomUUID(),
        name: `Update ${lowSingular}`,
        request: {
          method: "PUT",
          header: headersWrite,
          url: getPostmanUrl(dt.name, false, "update", sampleRecordName),
          description: `Update ${lowSingular}`,
          body: {
            mode: "raw",
            raw: JSON.stringify(updatePayload, null, 2),
            options: {
              raw: {
                language: "json"
              }
            }
          }
        },
        response: []
      });

      // 5. Delete
      folder.item.push({
        id: crypto.randomUUID(),
        name: `Delete ${lowSingular}`,
        request: {
          method: "DELETE",
          header: headersStandard,
          url: getPostmanUrl(dt.name, false, "delete", sampleRecordName),
          description: `Delete ${lowSingular}`
        },
        response: []
      });
    }

    collection.item.push(folder);
    console.log("✅ Added Folder");
  }

  const outputPath = path.join(process.cwd(), "erpnext_hrms_postman_collection.json");
  fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));

  console.log("\n=================================================");
  console.log("🎉 Documented Postman collection generated successfully!");
  console.log(`📄 Saved to: erpnext_hrms_postman_collection.json`);
  console.log("=================================================");
}

main().catch((err) => {
  console.error("❌ Fatal collection generation error:", err);
});
