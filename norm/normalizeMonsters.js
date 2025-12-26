// norm/normalizeMonsters.js

/**
 * Normalize a legacy monster dataset into the canonical monster schema.
 * @param {Array<Object>} monsters
 * @returns {Array<Object>}
 */
export default function normalizeMonsters(monsters) {
  if (!Array.isArray(monsters)) {
    throw new Error("Monster dataset must be an array");
  }

  return monsters.map((monster, index) => normalizeMonster(monster, index));
}

/* ---------------------------------------------------------
   SINGLE MONSTER NORMALIZATION
--------------------------------------------------------- */

function normalizeMonster(monster, index) {
  if (!monster || typeof monster !== "object") {
    throw new Error(`Invalid monster entry at index ${index}`);
  }

  const normalized = {};

  /* -----------------------------------------------------
     REQUIRED – UNIVERSAL
  ----------------------------------------------------- */

  normalized.id = normalizeId(monster.id, index);
  normalized.sources = normalizeSources(monster.sources);
  if (monster.last_updated) {
    normalized.last_updated = monster.last_updated;
  }

  /* -----------------------------------------------------
     CORE IDENTITY
  ----------------------------------------------------- */

  normalized.name = requireString(monster.name, "name");
  normalized.creature_type = requireString(monster.creature_type, "creature_type");
  if (monster.subtype) normalized.subtype = monster.subtype;
  normalized.size = requireString(monster.size, "size");
  normalized.alignment = requireString(monster.alignment, "alignment");

  /* -----------------------------------------------------
     DEFENSE
  ----------------------------------------------------- */

  normalized.ac = normalizeAC(monster.ac);
  normalized.armor_type = normalizeArmorType(monster.armor_type);
  normalized.hp = normalizeNumber(monster.hp, "hp");
  normalized.hit_dice = requireString(monster.hit_dice, "hit_dice");

  /* -----------------------------------------------------
     SPEED
  ----------------------------------------------------- */

  normalized.speed = normalizeSpeed(monster.speed);

  /* -----------------------------------------------------
     ABILITIES & PROFICIENCIES
  ----------------------------------------------------- */

  normalized.stats = normalizeStats(monster.stats, monster);

  if (monster.saving_throws && Object.keys(monster.saving_throws).length) {
    normalized.saving_throws = monster.saving_throws;
  }

  if (monster.skills && Object.keys(monster.skills).length) {
    normalized.skills = monster.skills;
  }

  /* -----------------------------------------------------
     DAMAGE & CONDITIONS
  ----------------------------------------------------- */

  copyIfArray(normalized, monster, "damage_vulnerabilities");
  copyIfArray(normalized, monster, "damage_resistances");
  copyIfArray(normalized, monster, "damage_immunities");
  copyIfArray(normalized, monster, "condition_immunities");

  /* -----------------------------------------------------
     SENSES & LANGUAGES
  ----------------------------------------------------- */

  if (monster.senses && Object.keys(monster.senses).length) {
    normalized.senses = monster.senses;
  }

  if (Array.isArray(monster.languages) && monster.languages.length) {
    normalized.languages = monster.languages;
  }

  /* -----------------------------------------------------
     CR & XP
  ----------------------------------------------------- */

  normalized.cr = normalizeNumber(monster.cr, "cr");
  if (monster.xp !== undefined) {
    normalized.xp = monster.xp === "" ? "" : normalizeNumber(monster.xp, "xp");
  }

  /* -----------------------------------------------------
     TRAITS & ACTIONS
  ----------------------------------------------------- */

  copyIfArray(normalized, monster, "traits");
  copyIfArray(normalized, monster, "actions");
  copyIfArray(normalized, monster, "legendary_actions");
  copyIfArray(normalized, monster, "reactions");
  copyIfArray(normalized, monster, "lair_actions");
  copyIfArray(normalized, monster, "regional_effects");

  return normalized;
}

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

function normalizeId(id, index) {
  if (typeof id === "string" && id.trim() !== "") {
    return id;
  }
  // Fallback – deterministic but clearly synthetic
  return `mo-UNKNOWN-${String(index).padStart(4, "0")}`;
}

function normalizeSources(sources) {
  if (!Array.isArray(sources) || sources.length === 0) {
    throw new Error("Monster is missing required 'sources' array");
  }
  return sources;
}

function requireString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Monster is missing required string field '${field}'`);
  }
  return value;
}

function normalizeNumber(value, field) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Monster field '${field}' must be a number`);
  }
  return value;
}

function normalizeAC(ac) {
  if (typeof ac !== "number" || Number.isNaN(ac)) {
    throw new Error("Armor Class (ac) must be a number");
  }
  return ac;
}

function normalizeArmorType(armorType) {
  // Required field, but empty string is allowed
  if (armorType === undefined || armorType === null) {
    return "";
  }
  if (typeof armorType !== "string") {
    throw new Error("armor_type must be a string");
  }
  return armorType;
}

function normalizeSpeed(speed) {
  if (!speed || typeof speed !== "object") {
    throw new Error("Monster is missing required 'speed' object");
  }
  if (Object.keys(speed).length === 0) {
    throw new Error("Speed object must contain at least one movement mode");
  }
  return speed;
}

function normalizeStats(stats, monster) {
  // 1. Canonical form
  if (stats && typeof stats === "object") {
    validateStats(stats);
    return stats;
  }

  // 2. Legacy form: abilities object
  if (monster.abilities && typeof monster.abilities === "object") {
    validateStats(monster.abilities);
    return monster.abilities;
  }

  // 3. Legacy form: top-level ability scores
  const topLevelStats = extractTopLevelStats(monster);
  if (topLevelStats) {
    return topLevelStats;
  }

  throw new Error("Monster is missing required 'stats' object");
}

function extractTopLevelStats(monster) {
  const keys = ["str", "dex", "con", "int", "wis", "cha"];

  // All six must exist and be numbers
  for (const key of keys) {
    if (typeof monster[key] !== "number") {
      return null;
    }
  }

  return {
    str: monster.str,
    dex: monster.dex,
    con: monster.con,
    int: monster.int,
    wis: monster.wis,
    cha: monster.cha
  };
}

function validateStats(stats) {
  const required = ["str", "dex", "con", "int", "wis", "cha"];
  for (const key of required) {
    if (typeof stats[key] !== "number") {
      throw new Error(`Stat '${key}' must be a number`);
    }
  }
}
function copyIfArray(target, source, field) {
  if (Array.isArray(source[field]) && source[field].length) {
    target[field] = source[field];
  }
}
