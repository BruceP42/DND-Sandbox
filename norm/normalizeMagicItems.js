/* ---------------------------------------------------------
   normalizeMagicItems.js
   Canonical normalizer for Magic Items (Schema v1.0)
--------------------------------------------------------- */

import crypto from "crypto";

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

function generateId(item) {
  const source =
    Array.isArray(item.sources) && item.sources.length > 0
      ? item.sources[0].source
      : "UNKNOWN";

  const hash = crypto
    .createHash("md5")
    .update(`${item.name}-${source}`)
    .digest("hex")
    .slice(0, 8);

  return `mi-${source}-${hash}`;
}

function ensureArray(value, fieldName) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  return value;
}

function ensureString(value, fieldName, required = false) {
  if (value === undefined || value === null || value === "") {
    if (required) {
      throw new Error(`Missing required field: ${fieldName}`);
    }
    return undefined;
  }
  return String(value);
}

function ensureBoolean(value, defaultValue = false) {
  if (value === undefined || value === null) return defaultValue;
  return Boolean(value);
}

/* ---------------------------------------------------------
   NORMALIZER
--------------------------------------------------------- */

export default function normalizeMagicItems(legacyItems) {
  if (!Array.isArray(legacyItems)) {
    throw new Error("Magic item dataset must be an array");
  }

  return legacyItems.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Invalid magic item at index ${index}`);
    }

    /* -----------------------------------------------------
       REQUIRED METADATA
    ----------------------------------------------------- */

    const name = ensureString(item.name, "name", true);

    const sources = ensureArray(item.sources, "sources");
    if (sources.length === 0) {
      throw new Error(`Magic item "${name}" is missing sources[]`);
    }

    const id = ensureString(item.id, "id") || generateId(item);

    /* -----------------------------------------------------
       REQUIRED MAGIC ITEM FIELDS
    ----------------------------------------------------- */

    const magic_item_category = ensureString(
      item.magic_item_category,
      "magic_item_category",
      true
    );

    const rarity = ensureString(item.rarity, "rarity", true);

    // LEGACY → SCHEMA MAPPING
    const item_desc = ensureArray(item.item_desc ?? item.desc, "item_desc");
    if (item_desc.length === 0) {
      throw new Error(`Magic item "${name}" must have item_desc[]`);
    }

    /* -----------------------------------------------------
       OPTIONAL FIELDS (LEGACY-AWARE)
    ----------------------------------------------------- */

    const magic_item_type = ensureString(
      item.magic_item_type ?? item.item_type,
      "magic_item_type"
    );

    const attunement = ensureBoolean(item.attunement, false);

    const attunement_restrictions = ensureArray(
      item.attunement_restrictions,
      "attunement_restrictions"
    );

    const properties = ensureArray(item.properties, "properties");

    const bonus = ensureString(item.bonus, "bonus");

    const last_updated = ensureString(item.last_updated, "last_updated");

    /* -----------------------------------------------------
       FINAL CANONICAL OBJECT
    ----------------------------------------------------- */

    const normalized = {
      id,
      name,
      sources,
      magic_item_category,
      rarity,
      item_desc
    };

    if (magic_item_type) normalized.magic_item_type = magic_item_type;
    if (attunement) normalized.attunement = attunement;
    if (attunement_restrictions.length > 0) {
      normalized.attunement_restrictions = attunement_restrictions;
    }
    if (properties.length > 0) normalized.properties = properties;
    if (bonus) normalized.bonus = bonus;
    if (last_updated) normalized.last_updated = last_updated;

    return normalized;
  });
}
