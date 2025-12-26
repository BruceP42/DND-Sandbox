import fs from "fs";
import path from "path";
import normalizeMagicItems from "./normalizeMagicItems.js";    // default export: normalization function
import loadDataset from "../loadDataset.js";                   // default export: dataset loader
import normalizationHeader from "./normalizationHeader.js";    //standard header added to normalized files.


/* ---------------------------------------------------------
   PATHS
--------------------------------------------------------- */
const INPUT_PATH_SRD = path.resolve("./data/magic-items-SRD.js");
const INPUT_PATH_CUSTOM = path.resolve("./data/magic-items-custom.js");

const OUTPUT_PATH_SRD = path.resolve("./data/magic-items.normalized.js");
const OUTPUT_PATH_CUSTOM = path.resolve("./data/magic-items-custom.normalized.js");

/* ---------------------------------------------------------
   LOAD LEGACY DATA
--------------------------------------------------------- */
let legacyMagicItemsSRD, legacyMagicItemsCustom;

try {
  legacyMagicItemsSRD = loadDataset(INPUT_PATH_SRD);
} catch (err) {
  console.error(`Failed to load SRD dataset: ${err.message}`);
  process.exit(1);
}

try {
  legacyMagicItemsCustom = loadDataset(INPUT_PATH_CUSTOM);
} catch (err) {
  console.error(`Failed to load Custom dataset: ${err.message}`);
  process.exit(1);
}

/* ---------------------------------------------------------
   NORMALIZE
--------------------------------------------------------- */
let normalizedMagicItemsSRD, normalizedMagicItemsCustom;

try {
  normalizedMagicItemsSRD = normalizeMagicItems(legacyMagicItemsSRD);
} catch (err) {
  console.error(`Normalization error (SRD): ${err.message}`);
  process.exit(1);
}

try {
  normalizedMagicItemsCustom = normalizeMagicItems(legacyMagicItemsCustom);
} catch (err) {
  console.error(`Normalization error (Custom): ${err.message}`);
  process.exit(1);
}

/* ---------------------------------------------------------
   WRITE OUTPUT (NON-DESTRUCTIVE)
--------------------------------------------------------- */
try {
  const outputSRD =
    normalizationHeader({
      generator: "norm/normalize-magic-items.js",
      source: "magic-items-SRD.js"
    }) +
    `export default ${JSON.stringify(normalizedMagicItemsSRD, null, 2)};\n`;
  
  fs.writeFileSync(OUTPUT_PATH_SRD, outputSRD, "utf8");
  console.log(`✓ Magic Items SRD normalized → ${OUTPUT_PATH_SRD}`);

  const outputCustom =
    normalizationHeader({
      generator: "norm/normalize-magic-items.js",
      source: "magic-items-custom.js"
    }) +
    `export default ${JSON.stringify(normalizedMagicItemsCustom, null, 2)};\n`;
  
  fs.writeFileSync(OUTPUT_PATH_CUSTOM, outputCustom, "utf8");
  console.log(`✓ Magic Items Custom normalized → ${OUTPUT_PATH_CUSTOM}`);
} catch (err) {
  console.error(`Failed to write output files: ${err.message}`);
  process.exit(1);
}
