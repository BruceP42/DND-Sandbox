/**
 * Phase 2.3 Aggregation Smoke Test
 * Checks:
 * - Duplicates
 * - Custom overrides SRD
 * - Basic error handling
 */

import spells from "./data/spells.normalized.js";
import monsters from "./data/monsters.normalized.js";
import magicItems from "./data/magic-items.normalized.js";
import { aggregateDomain } from "./norm/aggregate-domain.js";

function checkDuplicates(domainArray, domainName) {
  const ids = new Set();
  const duplicates = [];
  for (const entry of domainArray) {
    if (ids.has(entry.id)) duplicates.push(entry.id);
    else ids.add(entry.id);
  }
  if (duplicates.length) {
    console.error(`[${domainName}] Duplicate IDs found:`, duplicates);
  } else {
    console.log(`[${domainName}] No duplicate IDs`);
  }
}

function checkCustomOverrides(domainName, srdArray, customArray, aggregatedArray) {
  // Pick one ID from customArray and verify it replaced SRD
  if (!customArray.length) return console.log(`[${domainName}] No custom entries to check`);
  const testEntry = customArray[0];
  const found = aggregatedArray.find(e => e.id === testEntry.id);
  if (!found) {
    console.error(`[${domainName}] Custom entry with id ${testEntry.id} not found in aggregated`);
  } else if (found !== testEntry) {
    console.log(`[${domainName}] Custom entry with id ${testEntry.id} correctly overrides SRD`);
  } else {
    console.log(`[${domainName}] Custom entry override check passed`);
  }
}

function checkErrorHandling() {
  let errorCaught = false;
  try {
    aggregateDomain({ srd: [], custom: [] }); // missing domain
  } catch (e) {
    console.log("Error caught as expected for missing domain:", e.message);
    errorCaught = true;
  }
  if (!errorCaught) console.error("Missing domain error not thrown");

  errorCaught = false;
  try {
    aggregateDomain({ domain: "test", srd: null, custom: [] }); // invalid input
  } catch (e) {
    console.log("Error caught as expected for invalid SRD input:", e.message);
    errorCaught = true;
  }
  if (!errorCaught) console.error("Invalid SRD input error not thrown");

  errorCaught = false;
  try {
    aggregateDomain({ domain: "test", srd: [], custom: [{}] }); // missing id
  } catch (e) {
    console.log("Error caught as expected for missing ID:", e.message);
    errorCaught = true;
  }
  if (!errorCaught) console.error("Missing ID error not thrown");
}

// Run checks
console.log("=== Aggregation Smoke Test ===");

checkDuplicates(spells, "spells");
checkDuplicates(monsters, "monsters");
checkDuplicates(magicItems, "magic-items");

// For custom override check, we need SRD + custom arrays
// Import SRD and custom directly
import srdSpells from "./data/spells-srd.normalized.js";
import customSpells from "./data/spells-custom.normalized.js";

checkCustomOverrides("spells", srdSpells, customSpells, spells);

// Monsters
import srdMonsters from "./data/monsters-srd.normalized.js";
import customMonsters from "./data/monsters-custom.normalized.js";

checkCustomOverrides("monsters", srdMonsters, customMonsters, monsters);

// Magic Items
import srdMagicItems from "./data/magic-items-srd.normalized.js";
import customMagicItems from "./data/magic-items-custom.normalized.js";

checkCustomOverrides("magic-items", srdMagicItems, customMagicItems, magicItems);

// Error handling can remain once at the bottom
checkErrorHandling();

console.log("=== Smoke Test Complete ===");
