// norm/normalize-spells.js

import fs from "fs";
import path from "path";
import normalizeSpells from "./normalizeSpells.js";          // default export: normalization function
import loadDataset from "../loadDataset.js";                 // default export: dataset loader
import normalizationHeader from "./normalizationHeader.js";  // standard header added to normalized files

/* ---------------------------------------------------------
   PATHS
--------------------------------------------------------- */
const INPUT_PATH_SRD = path.resolve("./data/spells-SRD.js");
const INPUT_PATH_CUSTOM = path.resolve("./data/spells-custom.js");

const OUTPUT_PATH_SRD = path.resolve("./data/spells.normalized.js");
const OUTPUT_PATH_CUSTOM = path.resolve("./data/spells-custom.normalized.js");

/* ---------------------------------------------------------
   LOAD LEGACY DATA
--------------------------------------------------------- */
let legacySpellsSRD, legacySpellsCustom;

try {
  legacySpellsSRD = loadDataset(INPUT_PATH_SRD);
} catch (err) {
  console.error(`Failed to load SRD dataset: ${err.message}`);
  process.exit(1);
}

try {
  legacySpellsCustom = loadDataset(INPUT_PATH_CUSTOM);
} catch (err) {
  console.error(`Failed to load Custom dataset: ${err.message}`);
  process.exit(1);
}

/* ---------------------------------------------------------
   NORMALIZE
--------------------------------------------------------- */
let normalizedSpellsSRD, normalizedSpellsCustom;

try {
  normalizedSpellsSRD = normalizeSpells(legacySpellsSRD);
} catch (err) {
  console.error(`Normalization error (SRD): ${err.message}`);
  process.exit(1);
}

try {
  normalizedSpellsCustom = normalizeSpells(legacySpellsCustom);
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
      generator: "norm/normalize-spells.js",
      source: "spells-SRD.js"
    }) +
    `export default ${JSON.stringify(normalizedSpellsSRD, null, 2)};\n`;

  fs.writeFileSync(OUTPUT_PATH_SRD, outputSRD, "utf8");
  console.log(`✓ Spells SRD normalized → ${OUTPUT_PATH_SRD}`);

  const outputCustom =
    normalizationHeader({
      generator: "norm/normalize-spells.js",
      source: "spells-custom.js"
    }) +
    `export default ${JSON.stringify(normalizedSpellsCustom, null, 2)};\n`;

  fs.writeFileSync(OUTPUT_PATH_CUSTOM, outputCustom, "utf8");
  console.log(`✓ Spells Custom normalized → ${OUTPUT_PATH_CUSTOM}`);
} catch (err) {
  console.error(`Failed to write output files: ${err.message}`);
  process.exit(1);
}
