// validate-schema.js
import fs from "fs";
import path from "path";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import stripJsonComments from "strip-json-comments";

// ---------------------------
// CONFIG
// ---------------------------
const LOG_FILE = "validation-errors.log";
const ajv = new Ajv({
  allErrors: true,
  strict: false
});
addFormats(ajv);

// Overwrite old log file
fs.writeFileSync(LOG_FILE, "=== Validation Errors ===\n\n");

function logError(msg) {
  console.error(msg);
  fs.appendFileSync(LOG_FILE, msg + "\n");
}

// ---------------------------
// LOAD SCHEMA
// ---------------------------
const schemaPath = path.resolve("./schema.jsonc");
const rawSchema = fs.readFileSync(schemaPath, "utf8");
const schema = JSON.parse(stripJsonComments(rawSchema));

const validate = ajv.compile(schema);


// ---------------------------
// HELPER: Validate a dataset
// ---------------------------
function validateDataset(name, data) {
  console.log(`\nValidating: ${name}`);

  let hasErrors = false;

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    const ok = validate(entry);

    if (!ok) {
      hasErrors = true;

      logError(`--- ${name}[${i}] : ${entry.name || "(no name)"} ---`);
      validate.errors.forEach(err => {
        logError(` • ${err.instancePath} ${err.message}`);
      });
      logError(""); // blank line between entries
    }
  }

  if (!hasErrors) {
    console.log(`✓ ${name}: All entries valid.`);
  } else {
    console.log(`✗ ${name}: Errors found. Check ${LOG_FILE}.`);
  }
}

// ---------------------------
// LOAD DATASETS
// ---------------------------

import loadDataset from "./loadDataset.js";

// Spells

const spells = loadDataset("./data/spells-SRD.js");
const spellsCustom = loadDataset("./data/spells-custom.js");

// Monsters
const monsters = loadDataset("./data/monsters-SRD.js");
const monstersCustom = loadDataset("./data/monsters-custom.js");

// Magic Items
const items = loadDataset("./data/magic-items-SRD.js");
const itemsCustom = loadDataset("./data/magic-items-custom.js");


// ---------------------------
// RUN VALIDATION
// ---------------------------
validateDataset("spells", spells);
validateDataset("spells-custom", spellsCustom);

validateDataset("monsters", monsters);
validateDataset("monsters-custom", monstersCustom);

validateDataset("magic-items", items);
validateDataset("magic-items-custom", itemsCustom);

console.log(`\nDone. See ${LOG_FILE} for details.\n`);
