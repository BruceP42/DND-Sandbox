/**
 * diff-normalized.js
 *
 * Generates a breaking-changes report by comparing:
 *  - Legacy baseline datasets (browser-style globals: var jsonXData = [...])
 *  - Current normalized datasets (ES modules: export default [...])
 *
 * This script is intentionally asymmetric:
 *  - Baseline files are PARSED
 *  - Normalized files are IMPORTED
 */

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

/* -------------------------
 * Path setup
 * ------------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASELINE_DIR = path.resolve(__dirname, "../data/_baseline");
const CURRENT_DIR = path.resolve(__dirname, "../data");
const REPORT_DIR = path.resolve(__dirname, "../reports");

/* -------------------------
 * Dataset registry
 * ------------------------- */

const DATASETS = [
  { key: "Spells SRD", file: "spells-SRD.normalized.js" },
  { key: "Spells Custom", file: "spells-custom.normalized.js" },
  { key: "Monsters SRD", file: "monsters-SRD.normalized.js" },
  { key: "Monsters Custom", file: "monsters-custom.normalized.js" },
  { key: "Magic Items SRD", file: "magic-items-SRD.normalized.js" },
  { key: "Magic Items Custom", file: "magic-items-custom.normalized.js" }
];

/* -------------------------
 * Legacy loader
 * ------------------------- */

function loadLegacyDataset(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Baseline file not found: ${path.basename(filePath)}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");

  // Match: var something = [ ... ];
  const match = raw.match(/=\s*(\[[\s\S]*\]);?\s*$/);

  if (!match) {
    throw new Error(`Unable to parse legacy dataset: ${path.basename(filePath)}`);
  }

  const data = JSON.parse(match[1]);

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`Baseline dataset invalid or empty: ${path.basename(filePath)}`);
  }

  return data;
}

/* -------------------------
 * Normalized loader
 * ------------------------- */

async function loadNormalizedDataset(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Normalized file not found: ${path.basename(filePath)}`);
  }

  const mod = await import(pathToFileURL(filePath).href);

  if (!Array.isArray(mod.default) || mod.default.length === 0) {
    throw new Error(`Normalized dataset invalid or empty: ${path.basename(filePath)}`);
  }

  return mod.default;
}

/* -------------------------
 * Field summarization
 * ------------------------- */

function summarizeFields(entry) {
  const summary = {};

  for (const [key, value] of Object.entries(entry)) {
    summary[key] = Array.isArray(value)
      ? "array"
      : value === null
        ? "null"
        : typeof value;
  }

  return summary;
}

/* -------------------------
 * Dataset diff
 * ------------------------- */

async function diffDataset(name, file) {
  const baselinePath = path.join(BASELINE_DIR, file);
  const currentPath = path.join(CURRENT_DIR, file);

  const baseline = loadLegacyDataset(baselinePath);
  const current = await loadNormalizedDataset(currentPath);

  const baseFields = summarizeFields(baseline[0]);
  const currFields = summarizeFields(current[0]);

  const added = [];
  const removed = [];
  const changed = [];

  for (const key of Object.keys(currFields)) {
    if (!(key in baseFields)) {
      added.push(key);
    } else if (baseFields[key] !== currFields[key]) {
      changed.push(`${key}: ${baseFields[key]} → ${currFields[key]}`);
    }
  }

  for (const key of Object.keys(baseFields)) {
    if (!(key in currFields)) {
      removed.push(key);
    }
  }

  return { name, added, removed, changed };
}

/* -------------------------
 * Runner
 * ------------------------- */

async function run() {
  try {
    if (!fs.existsSync(REPORT_DIR)) {
      fs.mkdirSync(REPORT_DIR, { recursive: true });
    }

    let report = `# Breaking Changes Report — Schema v2.0\n\n`;
    report += `> Baseline datasets are legacy browser-style globals (\`var jsonXData = [...]\`).\n`;
    report += `> Current datasets are schema-normalized ES modules (\`export default [...]\`).\n\n`;

    for (const ds of DATASETS) {
      const diff = await diffDataset(ds.key, ds.file);

      report += `## ${diff.name}\n\n`;

      report += `**Added fields:**\n`;
      report += diff.added.length
        ? diff.added.map(f => `- ${f}`).join("\n")
        : "- None";
      report += `\n\n`;

      report += `**Removed fields:**\n`;
      report += diff.removed.length
        ? diff.removed.map(f => `- ${f}`).join("\n")
        : "- None";
      report += `\n\n`;

      report += `**Type changes:**\n`;
      report += diff.changed.length
        ? diff.changed.map(f => `- ${f}`).join("\n")
        : "- None";
      report += `\n\n`;
    }

    const outPath = path.join(REPORT_DIR, "breaking-changes-v2.0.md");
    fs.writeFileSync(outPath, report, "utf8");

    console.log("Breaking changes report generated:");
    console.log(outPath);

  } catch (err) {
    console.error("Failed to generate breaking changes report:");
    console.error(err.message);
  }
}

run();
