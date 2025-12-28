import fs from "fs";
import path from "path";

const datasets = [
  { label: "Spells SRD", file: "../data/spells.normalized.js" },
  { label: "Spells Custom", file: "../data/spells-custom.normalized.js" },
  { label: "Monsters SRD", file: "../data/monsters.normalized.js" },
  { label: "Monsters Custom", file: "../data/monsters-custom.normalized.js" },
  { label: "Magic Items SRD", file: "../data/magic-items.normalized.js" },
  { label: "Magic Items Custom", file: "../data/magic-items-custom.normalized.js" }
];

let output = "";

for (const { label, file } of datasets) {
  const fullPath = new URL(file, import.meta.url); // <- resolves relative to this script
  const datasetModule = await import(fullPath);

  const dataVarName = Object.keys(datasetModule)[0];
  const items = datasetModule[dataVarName];

  output += `${label}: ${items.length}\n`;
}

const snapshotFile = path.resolve("norm/dataset-snapshot.txt");
fs.writeFileSync(snapshotFile, output, "utf8");

console.log(`Snapshot counts written to ${snapshotFile}`);
console.log(output);
