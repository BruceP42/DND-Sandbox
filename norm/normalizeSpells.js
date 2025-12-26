/**
 * Normalize a legacy spell dataset to schema v1.0
 * @param {Array} legacySpells
 * @returns {Array} normalizedSpells
 */
export default function normalizeSpells(legacySpells) {
  if (!Array.isArray(legacySpells)) {
    throw new Error("Expected an array of spells.");
  }

  return legacySpells.map(spell => {
    // Deep copy to avoid mutating original
    const s = { ...spell };

    // Add required fields if missing
    if (!s.type) s.type = "spell";
    
    // Rename desc → spell_desc
    if (s.desc) {
      s.spell_desc = s.desc;
      delete s.desc;
    }

    if (!s.higher_level) s.higher_level = ""; // blank string if missing

    // Ensure sources array exists and page is a string
    if (!Array.isArray(s.sources)) s.sources = [{ source: "Unknown", page: "" }];
    s.sources = s.sources.map(src => ({
      source: src.source || "Unknown",
      page: typeof src.page === "string" ? src.page : ""
    }));

    // Ensure classes is an array
    if (!Array.isArray(s.classes)) s.classes = [];

    // Ensure components array exists
    if (!Array.isArray(s.components)) s.components = [];

    // Ensure material field exists
    if (!s.material) s.material = "";

    // Ensure ritual and concentration are booleans
    s.ritual = !!s.ritual;
    s.concentration = !!s.concentration;

    return s;
  });
}
