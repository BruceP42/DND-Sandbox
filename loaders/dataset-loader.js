// dataset-loader.js
// Unified loader for all SRD + Custom dataset pairs
// Supports optional normalization / schema enforcement

/**
 * Load and merge datasets from global variables and optionally normalize each entry.
 *
 * @param {string} baseVarName   Global SRD variable name (e.g. "jsonSpells")
 * @param {string} customVarName Global Custom variable name (e.g. "SpellsCustom")
 * @param {function} [normalizeFn] Optional per-entry normalizer function
 * @returns {Array} Merged + normalized array
 */
function loadDataset(baseVarName, customVarName, normalizeFn = null) {

  const baseRaw = Array.isArray(window[baseVarName]) ? window[baseVarName] : [];
  const customRaw = Array.isArray(window[customVarName]) ? window[customVarName] : [];

  if (!window[baseVarName]) 
    console.warn(`[dataset-loader] Dataset not found: ${baseVarName}`);
  if (!window[customVarName]) 
    console.warn(`[dataset-loader] Dataset not found: ${customVarName}`);

  const merged = [...baseRaw, ...customRaw];

  // --- Normalization phase ----------------------------------------------
  let normalized = merged;

  if (typeof normalizeFn === "function") {
    normalized = merged.map((entry, i) => {
      try {
        return normalizeFn(entry);
      } catch (err) {
        console.warn(`[dataset-loader] Normalization error in ${baseVarName}/${customVarName} index ${i}`, err, entry);
        return entry; // keep it raw, but warn
      }
    });
  }

  console.log(`[dataset-loader] Loaded "${baseVarName}" + "${customVarName}": `
    + `${baseRaw.length} SRD + ${customRaw.length} custom = ${merged.length} total`
    + `${normalizeFn ? " (normalized)" : ""}`);

  return normalized;
}

/* ============================================================
   CONVENIENCE LOADERS — using normalization rules per dataset
   ============================================================ */

function loadSpells() {
  return loadDataset(
    "jsonSpells",
    "SpellsCustom",
    DnDHelpers.normalizeSpellEntry || null
  );
}

function loadMagicItems() {
  return loadDataset(
    "jsonMagicItems",
    "MagicItemsCustom",
    DnDHelpers.normalizeMagicItemEntry || null
  );
}

function loadMonsters() {
  return loadDataset(
    "jsonMonsters",
    "MonstersCustom",
    DnDHelpers.normalizeMonsterEntry || null
  );
}

// Future datasets can use the same structure:
/*
function loadNpcs() {
  return loadDataset("jsonNpcs", "NpcsCustom", DnDHelpers.normalizeNpcEntry);
}
function loadFeats() {
  return loadDataset("jsonFeats", "FeatsCustom", DnDHelpers.normalizeFeatEntry);
}
function loadRaces() {
  return loadDataset("jsonRaces", "RacesCustom", DnDHelpers.normalizeRaceEntry);
}
*/
