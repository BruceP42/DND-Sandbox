// norm/normalize-monsters.js

import fs from "fs";
import path from "path";
import normalizeMonsters from "./normalizeMonsters.js";        // default export: normalization function
import loadDataset from "../loadDataset.js";                   // default export: dataset loader
import normalizationHeader from "./normalizationHeader.js";    //standard header added to normalized files.


/* ---------------------------------------------------------
   PATHS
--------------------------------------------------------- */
const INPUT_PATH_SRD = path.resolve("./data/monsters-SRD.js");
const INPUT_PATH_CUSTOM = path.resolve("./data/monsters-custom.js");

const OUTPUT_PATH_SRD = path.resolve("./data/monsters.normalized.js");
const OUTPUT_PATH_CUSTOM = path.resolve("./data/monsters-custom.normalized.js");

/* ---------------------------------------------------------
   LOAD LEGACY DATA
--------------------------------------------------------- */
let legacyMonstersSRD, legacyMonstersCustom;

try {
  legacyMonstersSRD = loadDataset(INPUT_PATH_SRD);
} catch (err) {
  console.error(`Failed to load SRD dataset: ${err.message}`);
  process.exit(1);
}

try {
  legacyMonstersCustom = loadDataset(INPUT_PATH_CUSTOM);
} catch (err) {
  console.error(`Failed to load Custom dataset: ${err.message}`);
  process.exit(1);
}

/* ---------------------------------------------------------
   NORMALIZE
--------------------------------------------------------- */
let normalizedMonstersSRD, normalizedMonstersCustom;

try {
  normalizedMonstersSRD = normalizeMonsters(legacyMonstersSRD);
} catch (err) {
  console.error(`Normalization error (SRD): ${err.message}`);
  process.exit(1);
}

try {
  normalizedMonstersCustom = normalizeMonsters(legacyMonstersCustom);
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
      generator: "norm/normalize-monsters.js",
      source: "monsters-SRD.js"
    }) +
    `export default ${JSON.stringify(normalizedMonstersSRD, null, 2)};\n`;
  fs.writeFileSync(OUTPUT_PATH_SRD, outputSRD, "utf8");
  console.log(`✓ Monsters SRD normalized → ${OUTPUT_PATH_SRD}`);

  const outputCustom =
    normalizationHeader({
      generator: "norm/normalize-monsters.js",
      source: "monsters-custom.js"
    }) +
    `export default ${JSON.stringify(normalizedMonstersCustom, null, 2)};\n`;

  fs.writeFileSync(OUTPUT_PATH_CUSTOM, outputCustom, "utf8");
  console.log(`✓ Monsters Custom normalized → ${OUTPUT_PATH_CUSTOM}`);
} catch (err) {
  console.error(`Failed to write output files: ${err.message}`);
  process.exit(1);
}
