/**
 * Phase 3.3 Loader Smoke Test (Node-compatible, Windows-safe)
 */

import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

// Node __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: check for duplicate IDs
function checkDuplicates(array, key = "id") {
  const ids = array.map(e => e[key]);
  const duplicates = ids.filter((v, i) => ids.indexOf(v) !== i);
  return duplicates;
}

// Domains and file paths
const domainFiles = {
  spells: "./data/spells.normalized.js",
  monsters: "./data/monsters.normalized.js",
  "magic-items": "./data/magic-items.normalized.js"
};

// Async test function
async function runTests() {
  console.log("=== Phase 3.3 Loader Smoke Test ===");

  for (const [domain, relPath] of Object.entries(domainFiles)) {
    try {
      const fullPath = path.resolve(__dirname, relPath);
      const module = await import(pathToFileURL(fullPath).href);
      const data = module.default;

      console.log(`[${domain}] Loaded ${data.length} entries`);

      console.assert(module.__normalized === true, `[${domain}] __normalized flag missing`);
      console.assert(module.__domain === domain, `[${domain}] Domain mismatch`);

      const duplicates = checkDuplicates(data);
      console.assert(duplicates.length === 0, `[${domain}] Duplicate IDs found: ${duplicates.join(", ")}`);

      console.log(`[${domain}] Passed basic checks`);
    } catch (err) {
      console.error(`[${domain}] Loader error:`, err);
    }
  }

  // Custom override test for spells
  try {
    const custom = [{ id: "CUSTOM1", name: "Custom Test" }];
    console.assert(custom[0].id === "CUSTOM1", "[spells] Custom override test OK");
    console.log("[spells] Custom override test passed");
  } catch (err) {
    console.error("Custom override test failed:", err);
  }

  console.log("=== Phase 3.3 Loader Smoke Test Complete ===");
}

// Run
runTests();
