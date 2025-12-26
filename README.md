# Normalization Scripts

## Overview

This folder contains scripts to normalize raw D&D datasets (spells, monsters, magic items) into a consistent format for use across the project.

**Normalization does:**

- Enforce the unified schema (`schema.jsonc`) on datasets.
- Generate `*.normalized.js` files from raw data.
- Add missing fields required by the schema.
- Ensure all datasets validate cleanly using `validate-schema.js`.

**Normalization does NOT:**

- Fix incorrect game data (spelling, stats, lore).
- Merge duplicate entries.
- Handle user-customized datasets outside the designated `*-custom.js` files.

## Schema Version

- Locked schema version for normalization: **v2.0** (`schema.jsonc`).

## How to Re-run Normalization

1. Update or add raw dataset in `data/`.
2. Run the appropriate normalization script from `norm/`:
   ```bash
   node norm/normalize-spells.js
   node norm/normalize-monsters.js
   node norm/normalize-magic-items.js
