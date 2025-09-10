// scripts/audit-npm-attack.js
import fs from "fs";
import path from "path";

// List of compromised versions known from the 09/08/2025 attack
const compromised = [
  { name: "chalk", version: "5.6.1" },
  { name: "debug", version: "4.4.2" },
  { name: "ansi-styles", version: "6.2.1" },
  { name: "duckdb", version: "1.3.3" },
  { name: "color", version: "4.3.0" },
  { name: "supports-color", version: "9.0.1" },
  // you can add more as the list grows
];

// Load lockfile
const lockFilePath = path.resolve(process.cwd(), "package-lock.json");
if (!fs.existsSync(lockFilePath)) {
  console.error("❌ Could not find package-lock.json, make sure it exists.");
  process.exit(1);
}

const lockData = JSON.parse(fs.readFileSync(lockFilePath, "utf-8"));

// Recursively check dependencies
function checkDeps(deps, findings) {
  for (const [pkg, info] of Object.entries(deps)) {
    const hit = compromised.find((c) => c.name === pkg && info.version === c.version);
    if (hit) {
      findings.push({ name: pkg, version: info.version });
    }
    if (info.dependencies) {
      checkDeps(info.dependencies, findings);
    }
  }
}

const findings = [];
checkDeps(lockData.packages?.[""]?.dependencies || lockData.dependencies, findings);

if (findings.length === 0) {
  console.log("✅ No compromised packages found in the project.");
} else {
  console.log("⚠️ Warning! Compromised packages detected:");
  findings.forEach((f) => {
    console.log(`- ${f.name}@${f.version}`);
  });
  console.log("👉 Please update or replace these packages as soon as possible.");
}
