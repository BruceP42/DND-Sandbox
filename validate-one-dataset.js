// validate-one-dataset.js
import fs from "fs";
import path from "path";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import stripJsonComments from "strip-json-comments";
import { pathToFileURL } from "url";

// ---------------------------
// CONFIG
// ---------------------------
const LOG_FILE = "validation-errors.log";
fs.writeFileSync(LOG_FILE, "=== Validation Errors ===\n\n");

function logError(msg) {
  console.error(msg);
  fs.appendFileSync(LOG_FILE, msg + "\n");
}

// ---------------------------
// ARGUMENTS
// ---------------------------
if (process.argv.length < 3) {
  console.error("Usage: node validate-one-dataset.js <dataset-file>");
  process.exit(1);
}

const datasetPath = path.resolve(process.argv[2]);

// Determine dataset type
let datasetType;
if (/spell/i.test(datasetPath)) datasetType = "spell";
else if (/monster/i.test(datasetPath)) datasetType = "monster";
else if (/magic[-_]item/i.test(datasetPath)) datasetType = "magic-item";
else {
  console.error("Unable to infer dataset type from filename.");
  process.exit(1);
}

// ---------------------------
// LOAD DATASET (ESM-safe)
// ---------------------------
let dataset;
try {
  const fileUrl = pathToFileURL(datasetPath).href;
  const mod = await import(fileUrl);
  dataset = mod.default;
  if (!Array.isArray(dataset)) {
    throw new Error("Dataset is not an array.");
  }
} catch (err) {
  console.error(`Failed to load dataset: ${datasetPath}`);
  console.error(err.message);
  process.exit(1);
}

// ---------------------------
// LOAD FULL SCHEMA
// ---------------------------
let schema;
try {
  const raw = fs.readFileSync("./schema.jsonc", "utf8");
  schema = JSON.parse(stripJsonComments(raw));
} catch (err) {
  console.error("Failed to load schema.jsonc");
  console.error(err.message);
  process.exit(1);
}

// ---------------------------
// AJV SETUP
// ---------------------------
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

let validate;
try {
  validate = ajv.compile(schema); // IMPORTANT: compile full schema
} catch (err) {
  console.error("Failed to compile schema:");
  console.error(err.message);
  process.exit(1);
}

// ---------------------------
// VALIDATION
// ---------------------------
console.log(`Validating ${datasetType} dataset: ${datasetPath}`);

let hasErrors = false;

dataset.forEach((entry, index) => {
  if (entry.type !== datasetType) return;

  const valid = validate(entry);

  if (!valid) {
    // Filter errors to only those related to the active schema branch
    const relevantErrors = validate.errors.filter(err =>
      err.schemaPath.includes(`$defs/${datasetType.replace("-", "")}`)
    );

    if (relevantErrors.length > 0) {
      hasErrors = true;
      logError(`--- [${index}] ${entry.name || "(no name)"} ---`);
      relevantErrors.forEach(err => {
        logError(` • ${err.instancePath} ${err.message}`);
      });
      logError("");
    }
  }
});

if (!hasErrors) {
  console.log(`✓ All ${datasetType} entries are valid.`);
} else {
  console.log(`✗ Validation errors found. See ${LOG_FILE}.`);
}
