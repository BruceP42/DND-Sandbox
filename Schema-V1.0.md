# D&D Reference - Schema v1.0 Enhanced

**Version:** 1.0  
**Status:** Locked for normalization  
**Purpose:** Canonical schema for all SRD + custom datasets (spells, monsters, magic items)  
**Notes:**  
- All datasets must conform to this schema until normalization is complete.  
- Optional fields are marked with ⚪, required fields with ✅.  
- Field types follow JavaScript conventions (string, integer, boolean, array, object).

---

## 1. Shared Metadata (Required)

| Field           | Type    | Required | Notes |
|-----------------|---------|----------|-------|
| `id`            | string  | ✅       | Unique identifier for each entry, e.g., "mo-SRD-1364" |
| `sources`       | array   | ✅       | Array of source objects: `{source: string, page: string}` |
| `last_updated`  | string  | ⚪       | ISO date string, e.g., "2025-12-09" |

---

## 2. Spells

| Field          | Type    | Required | Notes |
|----------------|---------|----------|-------|
| `name`         | string  | ✅       | Spell name |
| `level`        | integer | ✅       | Spell level (0–9) |
| `school`       | string  | ✅       | e.g., Evocation, Necromancy |
| `casting_time` | string  | ✅       | e.g., "1 action" |
| `range`        | string  | ✅       | e.g., "30 ft" |
| `components`   | array   | ✅       | List: ["V","S","M"] |
| `material`     | string  | ⚪       | Only required if components include M |
| `duration`     | string  | ✅       | e.g., "Concentration, up to 1 minute" |
| `concentration`| boolean | ✅       | true/false |
| `ritual`       | boolean | ✅       | true/false |
| `spell_desc`   | array   | ✅       | Array of description strings |
| `higher_level` | array   | ⚪       | Optional array of effects at higher levels |
| `classes`      | array   | ✅       | List of class names able to cast |
| `damage`       | array   | ⚪       | Optional structured damage: `[{"damage_type":"acid","damage_dice":"4d4","scaling":"2d4 at 5th level, 3d4 at 11th, 4d4 at 17th","dc":object ⚪}]` |
| `damage.dc`    | object  | ⚪       | Optional saving throw info per damage entry `{dc_type, dc_value, success_type}` |

---

## 3. Monsters

| Field             | Type    | Required | Notes |
|-------------------|---------|----------|-------|
| `name`            | string  | ✅       | Monster name |
| `creature_type`   | string  | ✅       | e.g., Beast, Undead |
| `subtype`         | string  | ⚪       | e.g., "any race" |
| `size`            | string  | ✅       | e.g., Medium, Large |
| `alignment`       | string  | ✅       | e.g., Lawful Evil |
| `ac`              | integer | ✅       | Armor Class |
| `armor_type`      | string  | ⚪       | e.g., "Natural Armor" |
| `hp`              | integer | ✅       | Hit points |
| `hit_dice`        | string  | ✅       | e.g., "3d6+5" |
| `speed`           | object  | ✅       | e.g., `{walk:"30 ft", fly:"60 ft"}` |
| `stats`           | object  | ✅       | `{str,dex,con,int,wis,cha}` |
| `saving_throws`   | object  | ⚪       | Optional `{str,dex,con,int,wis,cha}` |
| `skills`          | object  | ⚪       | Optional `{skill_name: bonus}` |
| `damage_vulnerabilities` | array | ⚪   | Optional list of damage types |
| `damage_resistances`     | array | ⚪   | Optional list of damage types |
| `damage_immunities`      | array | ⚪   | Optional list of damage types |
| `condition_immunities`   | array | ⚪   | Optional list of conditions |
| `senses`          | object  | ⚪       | e.g., `{darkvision:"120 ft", passive_perception:20}` |
| `languages`       | array   | ⚪       | e.g., ["Common", "Telepathy 120 ft"] |
| `cr`              | number  | ✅       | Challenge rating |
| `traits`          | array   | ⚪       | Array of objects `{name:string, desc:array of strings, type:string ⚪, dc:object ⚪}` |
| `actions`         | array   | ⚪       | Array of objects `{name:string, desc:array of strings, attack_bonus:int ⚪, damage:array ⚪, usage:object ⚪, dc:object ⚪, multiattack_type:string ⚪, actions:array ⚪}` |
| `legendary_actions` | array | ⚪       | Same object structure as `actions` |
| `reactions`       | array   | ⚪       | Same object structure as `actions` |
| `lair_actions`    | array   | ⚪       | Same object structure as `actions` |
| `regional_effects`| array   | ⚪       | Same object structure as `actions` |

---

## 4. Magic Items

| Field                  | Type    | Required | Notes |
|------------------------|---------|----------|-------|
| `name`                 | string  | ✅       | Item name |
| `magic_item_category`  | string  | ✅       | e.g., Weapon, Armor, Wondrous Item |
| `magic_item_type`      | string  | ⚪       | Sub-type, e.g., "Longsword", "Shield" |
| `rarity`               | string  | ✅       | Common, Uncommon, Rare, Very Rare, Legendary, Artifact |
| `attunement`           | boolean | ⚪       | true/false |
| `attunement_restrictions` | array | ⚪      | Optional array of restrictions |
| `properties`           | array   | ⚪       | Optional properties or bonuses |
| `bonus`                | string  | ⚪       | Optional bonus, e.g., "+1" |
| `item_desc`            | array   | ✅       | Array of description strings |

---

**Notes for Developers:**

1. All datasets loaded into the sandbox must conform to this schema before any normalization scripts are applied.  
2. Optional fields are indicated ⚪ and should be filled when information is available.  
3. Structured `damage` fields allow automated calculations and filtering.  
4. Monster `actions` and `traits` objects have a consistent internal structure for parsing.  
5. Magic items support clean hierarchy with `category` → `type` → optional `bonus` and `attunement`.  
6. Future schema changes must be versioned (e.g., v1.1) and documented.  
