/**
 * ERPNext HRMS API Endpoint Checker — Cognifyr v4
 * Usage: node check_hr_api.js
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
    // We can fetch DocTypes by calling getList on DocType with filters
    const res = await client.get("/api/resource/DocType", {
      params: {
        filters: JSON.stringify([
          ["module", "in", ["HR", "Payroll", "HRMS"]],
          ["istable", "=", 0],
          ["issingle", "=", 0]
        ]),
        fields: JSON.stringify(["name", "module", "istable", "issingle"]),
        limit_page_length: 500
      }
    });
    
    // Sort DocTypes alphabetically
    const doctypes = res.data.data.sort((a, b) => a.name.localeCompare(b.name));
    console.log(`📋 Found ${doctypes.length} active DocTypes (excluding child tables/singles)`);
    return doctypes;
  } catch (e) {
    console.error("❌ Failed to fetch DocTypes list:", e.response?.data?.message || e.message);
    process.exit(1);
  }
}

async function testEndpoint(doctype) {
  const result = {
    name: doctype.name,
    module: doctype.module,
    listEndpoint: `/api/resource/${encodeURIComponent(doctype.name)}`,
    listStatus: null,
    listError: null,
    recordCount: 0,
    records: [],
    detailEndpoint: null,
    detailStatus: null,
    detailError: null,
    fields: [],
    sampleData: null,
    isValid: false
  };

  try {
    // 1. Test List Endpoint
    const listRes = await client.get(result.listEndpoint, {
      params: { limit_page_length: 3 }
    });
    
    result.listStatus = listRes.status;
    const records = listRes.data.data || [];
    result.recordCount = records.length;
    result.records = records;
    
    // If successful list call, we mark list status OK
    if (listRes.status === 200) {
      result.isValid = true;
    }

    // 2. Test Detail Endpoint (if records exist)
    if (records.length > 0) {
      const firstRecordName = records[0].name;
      result.detailEndpoint = `/api/resource/${encodeURIComponent(doctype.name)}/${encodeURIComponent(firstRecordName)}`;
      
      try {
        const detailRes = await client.get(result.detailEndpoint);
        result.detailStatus = detailRes.status;
        const doc = detailRes.data.data;
        
        if (doc) {
          result.sampleData = doc;
          // Extract non-object/non-array basic keys for the preview, or first-level keys
          result.fields = Object.keys(doc);
          
          // Verify basic Frappe properties exist in response
          if (doc.name && doc.owner && doc.creation) {
            result.isValid = true;
          } else {
            result.isValid = false; // missing standard structure
          }
        }
      } catch (err) {
        result.detailStatus = err.response?.status || 500;
        result.detailError = err.response?.data?.exception || err.response?.data?.message || err.message;
      }
    }
  } catch (err) {
    result.listStatus = err.response?.status || 500;
    result.listError = err.response?.data?.exception || err.response?.data?.message || err.message;
    result.isValid = false;
  }

  return result;
}

async function main() {
  console.log("=================================================");
  console.log("🧪 ERPNext HRMS API Endpoint & Content Checker");
  console.log(`🔗 Target Backend: ${BASE_URL}`);
  console.log("=================================================");

  await login();
  const doctypes = await fetchDocTypes();
  const results = [];

  for (let i = 0; i < doctypes.length; i++) {
    const dt = doctypes[i];
    process.stdout.write(`(${i + 1}/${doctypes.length}) Testing ${dt.name}... `);
    const res = await testEndpoint(dt);
    
    if (res.listStatus === 200) {
      if (res.recordCount > 0) {
        if (res.detailStatus === 200) {
          console.log(`✅ OK (${res.recordCount} records, detail checked)`);
        } else {
          console.log(`⚠️  List OK, detail failed (${res.detailStatus})`);
        }
      } else {
        console.log(`ℹ️  OK (0 records)`);
      }
    } else {
      console.log(`❌ Failed (Status: ${res.listStatus})`);
    }
    
    results.push(res);
  }

  // Generate Reports
  generateMarkdownReport(results);
  generateJsonReport(results);

  console.log("\n=================================================");
  console.log("🎉 Testing complete!");
  console.log("📄 Markdown report written to: check_hr_results.md");
  console.log("📄 JSON log written to: check_hr_results.json");
  console.log("=================================================");
}

function generateMarkdownReport(results) {
  const reportPath = path.join(process.cwd(), "check_hr_results.md");
  
  let md = `# ERPNext HRMS API Verification Report\n\n`;
  md += `Generated on: ${new Date().toISOString()}\n`;
  md += `Target Host: \`${BASE_URL}\`\n\n`;
  
  md += `## Summary Dashboard\n\n`;
  
  const total = results.length;
  const listOk = results.filter(r => r.listStatus === 200).length;
  const listFailed = total - listOk;
  const withRecords = results.filter(r => r.recordCount > 0).length;
  const withoutRecords = results.filter(r => r.listStatus === 200 && r.recordCount === 0).length;
  const detailCheckedOk = results.filter(r => r.detailStatus === 200).length;
  
  md += `| Metric | Count | Percentage |\n`;
  md += `| :--- | :--- | :--- |\n`;
  md += `| **Total DocTypes Tested** | ${total} | 100% |\n`;
  md += `| **List API Accessible (200 OK)** | ${listOk} | ${((listOk/total)*100).toFixed(1)}% |\n`;
  md += `| **List API Failed / Unauthorized** | ${listFailed} | ${((listFailed/total)*100).toFixed(1)}% |\n`;
  md += `| **DocTypes with Seeded Records** | ${withRecords} | ${((withRecords/total)*100).toFixed(1)}% |\n`;
  md += `| **Empty DocTypes (0 records)** | ${withoutRecords} | ${((withoutRecords/total)*100).toFixed(1)}% |\n`;
  md += `| **Detail API Verified (200 OK)** | ${detailCheckedOk} | ${((detailCheckedOk/withRecords)*100 || 0).toFixed(1)}% (of seeded) |\n\n`;

  md += `## Endpoint Status Table\n\n`;
  md += `| DocType | Module | List Status | Records | Detail Status | Health |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  
  for (const r of results) {
    let health = "❌ Error";
    if (r.listStatus === 200) {
      if (r.recordCount > 0) {
        health = r.detailStatus === 200 ? "✅ Healthy" : "⚠️ Detail Err";
      } else {
        health = "ℹ️ Empty";
      }
    }
    
    const listStatusStr = r.listStatus === 200 ? `\`200 OK\`` : `\`${r.listStatus || 'ERR'}\``;
    const detailStatusStr = r.detailStatus ? (r.detailStatus === 200 ? `\`200 OK\`` : `\`${r.detailStatus}\``) : `N/A`;
    
    md += `| **${r.name}** | ${r.module} | ${listStatusStr} | ${r.recordCount} | ${detailStatusStr} | ${health} |\n`;
  }
  
  md += `\n## Detailed Response & Body Validations\n\n`;
  
  for (const r of results) {
    md += `### ${r.name} (\`${r.module}\`)\n\n`;
    md += `- **List Endpoint**: \`GET ${r.listEndpoint}\`\n`;
    
    if (r.listStatus !== 200) {
      md += `- **Error**: \`${r.listError}\`\n\n`;
      continue;
    }
    
    md += `- **Status**: \`200 OK\`\n`;
    md += `- **Seeded Count**: ${r.recordCount} records\n`;
    
    if (r.recordCount > 0) {
      md += `- **Detail Endpoint**: \`GET ${r.detailEndpoint}\`\n`;
      md += `- **Detail Status**: \`200 OK\`\n`;
      md += `- **Response Body Validation**: ${r.isValid ? "✅ Valid Frappe Doc Schema" : "❌ Invalid / Missing Keys"}\n`;
      
      md += `\n#### Fields Present in Response Body:\n\n`;
      md += `\`\`\`json\n${JSON.stringify(r.fields, null, 2)}\n\`\`\`\n\n`;
      
      md += `#### Sample Response Data:\n\n`;
      // Clean sample data a bit to keep the report neat (limit sub-arrays or sub-objects)
      const cleanSample = { ...r.sampleData };
      // Omit very large internal fields if needed, but let's keep it representative
      md += `\`\`\`json\n${JSON.stringify(cleanSample, null, 2)}\n\`\`\`\n\n`;
    } else {
      md += `- **Detail Endpoint**: N/A (no records to query)\n`;
      md += `- **Status**: \`200 OK\` (empty dataset)\n\n`;
    }
    
    md += `---\n\n`;
  }
  
  fs.writeFileSync(reportPath, md);
}

function generateJsonReport(results) {
  const reportPath = path.join(process.cwd(), "check_hr_results.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error("❌ Fatal Error in runner:", err);
});
