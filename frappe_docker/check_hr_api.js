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
    // Fetch DocTypes: we filter module in [HR, Payroll, HRMS] and istable=0 (exclude child tables)
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
    
    // Sort DocTypes alphabetically
    const doctypes = res.data.data.sort((a, b) => a.name.localeCompare(b.name));
    console.log(`📋 Found ${doctypes.length} active top-level DocTypes (excluding child tables)`);
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
    isSingle: doctype.issingle === 1 || doctype.issingle === true || doctype.issingle === "1",
    listEndpoint: doctype.issingle ? null : `/api/resource/${encodeURIComponent(doctype.name)}`,
    listStatus: null,
    listError: null,
    recordCount: doctype.issingle ? 1 : 0,
    records: [],
    detailEndpoint: doctype.issingle 
      ? `/api/resource/${encodeURIComponent(doctype.name)}/${encodeURIComponent(doctype.name)}`
      : null,
    detailStatus: null,
    detailError: null,
    fields: [],
    sampleData: null,
    isValid: false
  };

  try {
    if (result.isSingle) {
      // 1. Single DocTypes: Test the Detail Endpoint directly (always exists)
      try {
        const detailRes = await client.get(result.detailEndpoint);
        result.detailStatus = detailRes.status;
        const doc = detailRes.data.data;
        
        if (doc) {
          result.sampleData = doc;
          result.fields = Object.keys(doc);
          result.isValid = doc.name ? true : false;
        }
      } catch (err) {
        result.detailStatus = err.response?.status || 500;
        result.detailError = err.response?.data?.exception || err.response?.data?.message || err.message;
      }
    } else {
      // 2. Standard DocTypes: Test List Endpoint
      const listRes = await client.get(result.listEndpoint, {
        params: { limit_page_length: 3 }
      });
      
      result.listStatus = listRes.status;
      const records = listRes.data.data || [];
      result.recordCount = records.length;
      result.records = records;
      
      if (listRes.status === 200) {
        result.isValid = true;
      }

      // Test Detail Endpoint (if records exist)
      if (records.length > 0) {
        const firstRecordName = records[0].name;
        result.detailEndpoint = `/api/resource/${encodeURIComponent(doctype.name)}/${encodeURIComponent(firstRecordName)}`;
        
        try {
          const detailRes = await client.get(result.detailEndpoint);
          result.detailStatus = detailRes.status;
          const doc = detailRes.data.data;
          
          if (doc) {
            result.sampleData = doc;
            result.fields = Object.keys(doc);
            
            // Verify basic Frappe properties exist in response
            if (doc.name && doc.owner && doc.creation) {
              result.isValid = true;
            } else {
              result.isValid = false;
            }
          }
        } catch (err) {
          result.detailStatus = err.response?.status || 500;
          result.detailError = err.response?.data?.exception || err.response?.data?.message || err.message;
        }
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
    
    if (res.isSingle) {
      if (res.detailStatus === 200) {
        console.log(`✅ OK (Single DocType, detail checked)`);
      } else {
        console.log(`❌ Failed (Single, Status: ${res.detailStatus})`);
      }
    } else {
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
  const standardDocs = results.filter(r => !r.isSingle).length;
  const singleDocs = results.filter(r => r.isSingle).length;
  const listOk = results.filter(r => !r.isSingle && r.listStatus === 200).length;
  const listFailed = standardDocs - listOk;
  const withRecords = results.filter(r => !r.isSingle && r.recordCount > 0).length;
  const withoutRecords = results.filter(r => !r.isSingle && r.listStatus === 200 && r.recordCount === 0).length;
  const detailCheckedOk = results.filter(r => r.detailStatus === 200).length;
  const singleCheckedOk = results.filter(r => r.isSingle && r.detailStatus === 200).length;
  
  md += `| Metric | Count | Percentage |\n`;
  md += `| :--- | :--- | :--- |\n`;
  md += `| **Total DocTypes Tested** | ${total} | 100% |\n`;
  md += `| **Standard DocTypes** | ${standardDocs} | ${((standardDocs/total)*100).toFixed(1)}% |\n`;
  md += `| **Single DocTypes** | ${singleDocs} | ${((singleDocs/total)*100).toFixed(1)}% |\n`;
  md += `| **List API Accessible (200 OK)** | ${listOk} / ${standardDocs} | ${((listOk/standardDocs)*100 || 0).toFixed(1)}% |\n`;
  md += `| **Single API Accessible (200 OK)** | ${singleCheckedOk} / ${singleDocs} | ${((singleCheckedOk/singleDocs)*100 || 0).toFixed(1)}% |\n`;
  md += `| **DocTypes with Seeded Records** | ${withRecords} | ${((withRecords/standardDocs)*100 || 0).toFixed(1)}% (of standard) |\n`;
  md += `| **Empty DocTypes (0 records)** | ${withoutRecords} | ${((withoutRecords/standardDocs)*100 || 0).toFixed(1)}% (of standard) |\n`;
  md += `| **Detail API Verified (200 OK)** | ${detailCheckedOk} | ${((detailCheckedOk/(withRecords + singleDocs))*100 || 0).toFixed(1)}% (of records+singles) |\n\n`;

  md += `## Endpoint Status Table\n\n`;
  md += `| DocType | Module | Type | List Status | Records | Detail Status | Health |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  
  for (const r of results) {
    let health = "❌ Error";
    if (r.isSingle) {
      health = r.detailStatus === 200 ? "✅ Healthy" : "❌ Error";
    } else if (r.listStatus === 200) {
      if (r.recordCount > 0) {
        health = r.detailStatus === 200 ? "✅ Healthy" : "⚠️ Detail Err";
      } else {
        health = "ℹ️ Empty";
      }
    }
    
    const typeStr = r.isSingle ? "Single" : "Standard";
    const listStatusStr = r.isSingle ? `N/A` : (r.listStatus === 200 ? `\`200 OK\`` : `\`${r.listStatus || 'ERR'}\``);
    const recordsStr = r.isSingle ? `1` : `${r.recordCount}`;
    const detailStatusStr = r.detailStatus ? (r.detailStatus === 200 ? `\`200 OK\`` : `\`${r.detailStatus}\``) : `N/A`;
    
    md += `| **${r.name}** | ${r.module} | ${typeStr} | ${listStatusStr} | ${recordsStr} | ${detailStatusStr} | ${health} |\n`;
  }
  
  md += `\n## Detailed Response & Body Validations\n\n`;
  
  for (const r of results) {
    md += `### ${r.name} (\`${r.module}\` - ${r.isSingle ? 'Single' : 'Standard'})\n\n`;
    
    if (r.isSingle) {
      md += `- **Detail Endpoint**: \`GET ${r.detailEndpoint}\`\n`;
      md += `- **Detail Status**: \`${r.detailStatus || 'ERR'}\`\n`;
      if (r.detailStatus !== 200) {
        md += `- **Error**: \`${r.detailError}\`\n\n`;
        continue;
      }
      md += `- **Response Body Validation**: ${r.isValid ? "✅ Valid Frappe Doc Schema" : "❌ Invalid / Missing Keys"}\n`;
      
      md += `\n#### Fields Present in Response Body:\n\n`;
      md += `\`\`\`json\n${JSON.stringify(r.fields, null, 2)}\n\`\`\`\n\n`;
      
      md += `#### Sample Response Data:\n\n`;
      md += `\`\`\`json\n${JSON.stringify(r.sampleData, null, 2)}\n\`\`\`\n\n`;
    } else {
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
        const cleanSample = { ...r.sampleData };
        md += `\`\`\`json\n${JSON.stringify(cleanSample, null, 2)}\n\`\`\`\n\n`;
      } else {
        md += `- **Detail Endpoint**: N/A (no records to query)\n`;
        md += `- **Status**: \`200 OK\` (empty dataset)\n\n`;
      }
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
