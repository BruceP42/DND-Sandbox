# Breaking Changes Report — Schema v2.0

> Baseline datasets are legacy browser-style globals (`var jsonXData = [...]`).
> Current datasets are schema-normalized ES modules (`export default [...]`).

## Spells SRD

**Added fields:**
- type
- spell_desc
- higher_level

**Removed fields:**
- desc

**Type changes:**
- None

## Spells Custom

**Added fields:**
- type
- spell_desc
- higher_level

**Removed fields:**
- desc

**Type changes:**
- None

## Monsters SRD

**Added fields:**
- stats

**Removed fields:**
- subtype
- str
- dex
- con
- int
- wis
- cha
- saving_throws
- skills
- damage_vulnerabilities
- damage_resistances
- damage_immunities
- condition_immunities
- reactions
- lair_actions
- regional_effects

**Type changes:**
- None

## Monsters Custom

**Added fields:**
- armor_type
- stats

**Removed fields:**
- str
- dex
- con
- int
- wis
- cha
- damage_vulnerabilities
- damage_immunities
- condition_immunities
- bonus_actions
- legendary_actions
- reactions
- lair_actions
- regional_effects

**Type changes:**
- None

## Magic Items SRD

**Added fields:**
- item_desc

**Removed fields:**
- item_type
- attunement
- attunement_restrictions
- desc

**Type changes:**
- None

## Magic Items Custom

**Added fields:**
- item_desc

**Removed fields:**
- item_type
- desc

**Type changes:**
- None

