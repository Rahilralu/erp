/**
 * ERPNext HRMS Postman Collection Generator
 * Usage: node generate_postman.js
 */

import axios from "axios";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
const client = axios.create({ 
  baseURL: BASE_URL, 
  withCredentials: true, 
  headers: { "Content-Type": "application/json" } 
});

let sessionCookie = "";

// Cookie jar management
client.interceptors.request.use((c) => { 
  if (sessionCookie) c.headers["Cookie"] = sessionCookie; 
  return c; 
});
client.interceptors.response.use((res) => {
  const c = res.headers["set-cookie"];
  if (c) sessionCookie = c.map((x) => x.split(";")[0]).join("; ");
  return res;
});

// Common Link fallback values to bypass database validation constraints
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

async function login() {
  try {
    const res = await client.post("/api/method/login", { usr: "Administrator", pwd: "admin" });
    console.log("✅ Logged in successfully:", res.data.message);
  } catch (e) {
    console.error("❌ Login failed. Ensure ERPNext containers are running and healthy.", e.message);
    process.exit(1);
  }
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
    const payload = {};
    
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
      payload.first_name = payload.first_name || "TestEmployee";
      payload.gender = "Male";
      payload.date_of_birth = "1995-01-01";
      payload.date_of_joining = "2025-06-01";
      payload.status = "Active";
      payload.company = "Cognifyr";
    } else if (doctypeName === "Leave Application") {
      payload.from_date = "2025-06-01";
      payload.to_date = "2025-06-02";
      payload.docstatus = 0;
    } else if (doctypeName === "Attendance") {
      payload.attendance_date = "2025-06-21";
      payload.status = "Present";
    } else if (doctypeName === "Expense Claim") {
      payload.posting_date = "2025-06-21";
      payload.expenses = [{
        expense_date: "2025-06-21",
        expense_type: "Travel",
        amount: 100,
        sanctioned_amount: 100
      }];
    }
    
    return payload;
  } catch (e) {
    return {};
  }
}

async function main() {
  console.log("=================================================");
  console.log("🚀 Generating Postman Collection for ERPNext HRMS");
  console.log("=================================================");

  await login();
  const doctypes = await fetchDocTypes();

  // Root Postman collection object (v2.1)
  const collection = {
    info: {
      name: "ERPNext HRMS API",
      description: "Postman Collection to test all GET, GET Each, POST, PUT, and DELETE endpoints for the ERPNext HRMS / Payroll modules.",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [
      {
        name: "Authentication",
        description: "Endpoints relating to user session setup.",
        item: [
          {
            name: "Login Session",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json"
                }
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify({ usr: "Administrator", pwd: "admin" }, null, 2)
              },
              url: "{{base_url}}/api/method/login",
              description: "Logs in the administrator user and saves cookies to Postman's cookie jar for authenticating subsequent requests."
            }
          }
        ]
      }
    ],
    variable: [
      {
        key: "base_url",
        value: "http://localhost:8080",
        type: "string"
      }
    ]
  };

  // Build folders and requests for each DocType
  for (let i = 0; i < doctypes.length; i++) {
    const dt = doctypes[i];
    const isSingle = dt.issingle === 1 || dt.issingle === true || dt.issingle === "1";
    process.stdout.write(`(${i + 1}/${doctypes.length}) Processing Postman requests for ${dt.name}... `);

    // Get an existing record name (if any) to populate variables
    let sampleRecordName = `SAMPLE-${dt.name.toUpperCase().replace(/\s+/g, "-")}-001`;
    try {
      if (!isSingle) {
        const res = await client.get(`/api/resource/${encodeURIComponent(dt.name)}`, {
          params: { limit_page_length: 1 }
        });
        if (res.data.data && res.data.data.length > 0) {
          sampleRecordName = res.data.data[0].name;
        }
      } else {
        sampleRecordName = dt.name;
      }
    } catch (e) {
      // Use fallback
    }

    const mockPayload = isSingle ? {} : await generateMockPayload(dt.name);
    const folder = {
      name: dt.name,
      description: `Endpoints for the ${dt.name} DocType (${dt.module} module).`,
      item: []
    };

    if (isSingle) {
      // Single DocType requests (GET and PUT only)
      folder.item.push({
        name: `GET Single - ${dt.name}`,
        request: {
          method: "GET",
          header: [],
          url: `{{base_url}}/api/resource/${encodeURIComponent(dt.name)}/${encodeURIComponent(dt.name)}`,
          description: `Retrieve the single-state record configuration for ${dt.name}.`
        }
      });
      folder.item.push({
        name: `PUT Update - ${dt.name}`,
        request: {
          method: "PUT",
          header: [
            {
              key: "Content-Type",
              value: "application/json"
            }
          ],
          body: {
            mode: "raw",
            raw: JSON.stringify({ description: "Updated value via Postman" }, null, 2)
          },
          url: `{{base_url}}/api/resource/${encodeURIComponent(dt.name)}/${encodeURIComponent(dt.name)}`,
          description: `Update the configuration options for ${dt.name}.`
        }
      });
    } else {
      // Standard DocType requests (GET List, POST Create, GET Detail, PUT Update, DELETE Delete)
      folder.item.push({
        name: `GET List - ${dt.name}`,
        request: {
          method: "GET",
          header: [],
          url: `{{base_url}}/api/resource/${encodeURIComponent(dt.name)}?limit_page_length=20`,
          description: `Retrieve a list of ${dt.name} records.`
        }
      });

      folder.item.push({
        name: `POST Create - ${dt.name}`,
        request: {
          method: "POST",
          header: [
            {
              key: "Content-Type",
              value: "application/json"
            }
          ],
          body: {
            mode: "raw",
            raw: JSON.stringify(mockPayload, null, 2)
          },
          url: `{{base_url}}/api/resource/${encodeURIComponent(dt.name)}`,
          description: `Create a new record for ${dt.name} with validated fields.`
        }
      });

      folder.item.push({
        name: `GET Detail - ${dt.name}`,
        request: {
          method: "GET",
          header: [],
          url: `{{base_url}}/api/resource/${encodeURIComponent(dt.name)}/${encodeURIComponent(sampleRecordName)}`,
          description: `Retrieve detailed fields of a specific ${dt.name} record.`
        }
      });

      folder.item.push({
        name: `PUT Update - ${dt.name}`,
        request: {
          method: "PUT",
          header: [
            {
              key: "Content-Type",
              value: "application/json"
            }
          ],
          body: {
            mode: "raw",
            raw: JSON.stringify({ description: "Updated description via Postman" }, null, 2)
          },
          url: `{{base_url}}/api/resource/${encodeURIComponent(dt.name)}/${encodeURIComponent(sampleRecordName)}`,
          description: `Update fields of a specific ${dt.name} record.`
        }
      });

      folder.item.push({
        name: `DELETE Delete - ${dt.name}`,
        request: {
          method: "DELETE",
          header: [],
          url: `{{base_url}}/api/resource/${encodeURIComponent(dt.name)}/${encodeURIComponent(sampleRecordName)}`,
          description: `Delete a specific ${dt.name} record.`
        }
      });
    }

    collection.item.push(folder);
    console.log("✅ Added Folder");
  }

  const outputPath = path.join(process.cwd(), "erpnext_hrms_postman_collection.json");
  fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));

  console.log("\n=================================================");
  console.log("🎉 Postman collection generated successfully!");
  console.log(`📄 Saved to: erpnext_hrms_postman_collection.json`);
  console.log("=================================================");
}

main().catch((err) => {
  console.error("❌ Fatal collection generation error:", err);
});
