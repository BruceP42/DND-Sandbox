// ============================================================================
// helpers09.js — Unified Generic Helper Library (Corrected + Consolidated)
// Option B: unified edit URL behavior + compatibility support
// ============================================================================

// -------------------------------------------------------------
// 1. Basic Utility: Safe value formatting
// -------------------------------------------------------------
function safe(text) {
  return (text == null) ? "" : text.toString().trim();
}

// -------------------------------------------------------------
// 2. Standard block for monster stat sections (Traits, Actions, etc.)
// -------------------------------------------------------------
function toNamedBlock(name, text) {
  return `
    <div class="item">
      <div class="item-name">${safe(name)}.</div>
      <div class="item-description">${safe(text)}</div>
    </div>
  `;
}

// -------------------------------------------------------------
// 3. CR Helpers
// -------------------------------------------------------------
function formatCRValue(cr) {
  if (cr == null) return "—";
  return cr === 0.125 ? "1/8"
       : cr === 0.25  ? "1/4"
       : cr === 0.5   ? "1/2"
       : cr.toString();
}

function formatCRXP(crString, xpValue) {
  return `${crString} (${xpValue} XP)`;
}

// -------------------------------------------------------------
// 4. Ability Modifier Helper
// -------------------------------------------------------------
function formatAbilityMod(score) {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// -------------------------------------------------------------
// 5. Array Normalizer for Monster Stat Fields
// -------------------------------------------------------------
function ensureArrayField(obj, key) {
  if (!obj[key] || !Array.isArray(obj[key])) obj[key] = [];
}

// -------------------------------------------------------------
// 6. FIELD_HELPERS — formatting for monster statblock fields
// -------------------------------------------------------------
const FIELD_HELPERS = {

  simple(arr) {
    if (!arr) return "";
    return Array.isArray(arr) ? arr.join(", ") : arr.toString();
  },

  languages(arr) { return FIELD_HELPERS.simple(arr); },

  // Senses object {darkvision: "60 ft.", passive_perception: 15} -> "darkvision 60 ft., passive Perception 15"
  senses(obj) {
    if (!obj || Object.keys(obj).length === 0) return "";
    return Object.entries(obj).map(([k, v]) => {
      if (k === "passive_perception" || k === "passivePerception") return `Passive Perception ${v}`;
      return `${k} ${v}`;
    }).join(", ");
  },

  ability_scores(obj) {
    if (!obj) return "";
    return Object.entries(obj)
      .map(([k, v]) => `${k} ${v}`)
      .join(", ");
  },

  ac(value) {
    if (!value) return "—";
    if (typeof value === "object") {
      return value.type ? `${value.value} (${value.type})` : `${value.value}`;
    }
    return String(value);
  },

  hp(value) {
    if (!value) return "—";
    if (typeof value === "object") {
      return value.dice ? `${value.value} (${value.dice})` : `${value.value}`;
    }
    return String(value);
  },

  // Speed object {walk: "30 ft.", fly: "60 ft. (hover)"} -> "walk 30 ft., fly 60 ft. (hover)"
  speed(obj) {
    if (!obj || Object.keys(obj).length === 0) return "";
    return Object.entries(obj).map(([k, v]) => `${k} ${v}`).join(", ");
  },

  proficiencies(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr.map(p => p.name).join(", ");
  },

  saving_throws(obj) {
    if (!obj || Object.keys(obj).length === 0) return "";
    return Object.entries(obj).map(([k, v]) => `${k} ${v}`).join(", ");
  },

  skills(obj) {
    if (!obj || Object.keys(obj).length === 0) return "";
    return Object.entries(obj).map(([k, v]) => `${k} ${v}`).join(", ");
  },

  traits(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr.map(t => toNamedBlock(t.name, t.desc)).join("");
  },
  actions(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr.map(a => toNamedBlock(a.name, a.desc)).join("");
  },
  reactions(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr.map(r => toNamedBlock(r.name, r.desc)).join("");
  },
  legendary_actions(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr.map(l => toNamedBlock(l.name, l.desc)).join("");
  },
  lair_actions(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr.map(l => toNamedBlock(l.name, l.desc)).join("");
  },

  sources(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr.map(s => {
      const page = s.page ? ` p. ${s.page}` : "";
      return `${s.source}${page}`;
    }).join(", ");
  }

};

// -------------------------------------------------------------
// 7. formatField — universal field resolver (Correct Version)
// -------------------------------------------------------------
function formatField(fieldName, value) {
  const handler = FIELD_HELPERS[fieldName];

  if (handler) {
    try {
      return handler(value);
    } catch (err) {
      console.error(`FIELD_HELPERS["${fieldName}"] failed:`, err);
      return "";
    }
  }

  return safe(value);
}

// ============================================================================
// 8. FIXED renderTable — NOW WORKS FOR ALL REFERENCE PAGES
//   - columns array expects { key, label, optional sortValue: function(item) }
//   - sortState shape: { column: string|null, direction: "asc"|"desc" }
//   - onView(item) : function called when View clicked
//   - getEdit(item) : optional function; can return either a URL string OR an array of DOM nodes (keeps compatibility)
// ============================================================================
function renderTable(container, data, columns, onView, sortState = { column: null, direction: "asc" }, getEdit) {
  container.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  // Defensive defaults
  if (!sortState || typeof sortState !== "object") sortState = { column: null, direction: "asc" };
  if (!Array.isArray(columns)) columns = [];

  const table = document.createElement("table");
  table.classList.add("result-table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  // Build header. store col.key in data-col
  columns.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col.label ?? col.key ?? "";
    th.dataset.col = col.key ?? "";

    // if sortable or column has sortValue, allow click
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      const key = col.key;
      if (!key) return;

      // toggle direction if same column
      if (sortState.column === key) {
        sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
      } else {
        sortState.column = key;
        sortState.direction = "asc";
      }

      // perform sort using either column.sortValue(item) or direct field
      data.sort((a, b) => {
        const colDef = col;
        const av = (typeof colDef.sortValue === "function") ? colDef.sortValue(a) : (a[key]);
        const bv = (typeof colDef.sortValue === "function") ? colDef.sortValue(b) : (b[key]);

        const cmp = window.DnDHelpers.numericOrString(av, bv);
        return sortState.direction === "asc" ? cmp : -cmp;
      });

      // re-render table (preserves sortState object)
      renderTable(container, data, columns, onView, sortState, getEdit);
    });

    // mark current sort column
    if (sortState.column === th.dataset.col) {
      th.textContent += sortState.direction === "asc" ? " ▲" : " ▼";
    } else {
      th.textContent += " ⇅";
    }

    headerRow.appendChild(th);
  });

  // Actions column (View + optional Edit)
  const thActions = document.createElement("th");
  thActions.textContent = "Actions";
  headerRow.appendChild(thActions);

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  // helper: produce cell display
  function displayValue(v) {
    if (v == null || v === "") return "—";
    if (Array.isArray(v)) return v.join(", ");
    if (typeof v === "object") {
      // objects often include nested fields like sources, speed, etc.
      try { return JSON.stringify(v); } catch (e) { return String(v); }
    }
    return String(v);
  }

  data.forEach(item => {
    const tr = document.createElement("tr");

    columns.forEach(col => {
      const td = document.createElement("td");
      const val = (typeof col.sortValue === "function") ? (col.displayValue ? col.displayValue(item) : item[col.key]) : item[col.key];
      td.textContent = displayValue(val);
      tr.appendChild(td);
    });

    // Actions cell
    const actionsTd = document.createElement("td");

    // View button
    if (typeof onView === "function") {
      const viewBtn = document.createElement("button");
      viewBtn.className = "fancy-scroll-button";
      viewBtn.textContent = "View";
      viewBtn.addEventListener("click", () => onView(item));
      actionsTd.appendChild(viewBtn);
    }

    // Edit: support both return types:
    if (typeof getEdit === "function") {
      const editResult = getEdit(item);
      if (typeof editResult === "string") {
        const a = document.createElement("a");
        a.href = editResult;
        a.className = "edit-button";
        a.textContent = "Edit";
        actionsTd.appendChild(a);
      } else if (Array.isArray(editResult)) {
        // assume array of nodes
        editResult.forEach(node => {
          if (node instanceof Node) actionsTd.appendChild(node);
        });
      } else if (editResult && typeof editResult === "object" && editResult instanceof Node) {
        actionsTd.appendChild(editResult);
      }
    }

    tr.appendChild(actionsTd);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

// ============================================================================
// 9. Lightweight bindTableSorting helper (keeps pages that call it happy).
//    - tbl: table element
//    - sortState: shared object used by renderTable
//    - onSort: optional callback to trigger re-rendering (pages can pass their render function)
// ============================================================================
function bindTableSorting(tbl, sortState, onSort) {
  if (!tbl || !tbl.querySelector) return;
  const ths = tbl.querySelectorAll("thead th[data-col]");
  ths.forEach(th => {
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      const key = th.dataset.col;
      if (!key) return;
      if (sortState.column === key) {
        sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
      } else {
        sortState.column = key;
        sortState.direction = "asc";
      }
      // If the page provided a callback, let it re-render using the shared sortState
      if (typeof onSort === "function") onSort();
      else {
        // Visual feedback: toggle arrows
        ths.forEach(t => {
          if (t.dataset.col === sortState.column) {
            t.textContent = t.textContent.replace(/( ▲| ▼| ⇅)$/, "") + (sortState.direction === "asc" ? " ▲" : " ▼");
          } else {
            t.textContent = t.textContent.replace(/( ▲| ▼| ⇅)$/, "") + " ⇅";
          }
        });
      }
    });
  });

  // set initial visual state
  ths.forEach(t => {
    if (t.dataset.col === sortState.column) {
      t.textContent = t.textContent.replace(/( ▲| ▼| ⇅)$/, "") + (sortState.direction === "asc" ? " ▲" : " ▼");
    } else {
      t.textContent = t.textContent.replace(/( ▲| ▼| ⇅)$/, "") + " ⇅";
    }
  });
}

// ============================================================================
// 10. Restore other helpers (from helpers07)
// ============================================================================

function renderCard(container, entry, fields, onBack, onView, options = {}) {
  container.innerHTML = "";

  const c = window.DnDHelpers;
  const div = document.createElement("div");
  div.className = "detail-card";

// --- Title at the top (Item Name) ---
if (entry.name) {
  const title = document.createElement("div");
  title.className = "detail-title";
  title.textContent = entry.name;
  div.appendChild(title);

  // --- Tapered divider under name (monsters only, because of wrapper) ---
  div.insertAdjacentHTML("beforeend", `<div class="divider"></div>`);
}

  // Defensive defaults
  if (!entry || typeof entry !== "object") entry = {};
  if (!Array.isArray(fields)) fields = [];

  // --- Render all fields ---
  fields.forEach(f => {
    const fieldName = f.field ?? f.key ?? f.name ?? "";
    const labelText = f.label ?? fieldName;
    const fieldType = f.type ?? f.format ?? null;

    const block = document.createElement("div");
    block.className = "detail-field";

    const label = document.createElement("div");
    label.className = "detail-label";
    label.textContent = labelText + ":";

    const value = document.createElement("div");
    value.className = "detail-value";

    // Resolve raw data
    let raw = entry[fieldName];
    if (raw == null) {
      if (fieldName === "description" && entry.entries) raw = entry.entries;
      if (fieldName === "description" && entry.desc) raw = entry.desc;
    }

    // ======================================================
    // SPECIAL CASE: Components (spell materials)
    // ======================================================
    if (fieldName === "components") {
      let comps = entry.components;
      if (typeof comps === "string") comps = comps.replace(/[^VSM]/gi, "").split("");
      if (Array.isArray(comps)) {
        const parts = [...comps];
        if (parts.includes("M") && entry.material) {
          parts.push(`(Material: ${entry.material})`);
        }
        value.textContent = parts.join(", ");
      } else {
        value.textContent = "";
      }
    }
    // ======================================================
    // SPECIAL CASE: Classes
    // ======================================================
    else if (fieldName === "class" || fieldName === "classes") {
      if (Array.isArray(raw)) value.textContent = raw.join(", ");
      else value.textContent = raw ? String(raw) : "";
    }
    // ======================================================
    // HTML type (description, etc)
    // ======================================================
    else if (fieldType === "html") {
      if (Array.isArray(raw) && typeof c.renderCardEntries === "function") {
        value.innerHTML = c.renderCardEntries(raw);
      } else {
        value.innerHTML = String(raw ?? "");
      }
    }
    // ======================================================
    // Long text fallback
    // ======================================================
    else if (fieldType === "long" || fieldType === "longtext") {
      const text = Array.isArray(raw) ? raw.join("\n") : (raw ?? "");
      const p = document.createElement("div");
      p.innerText = text;
      value.appendChild(p);
    }
    // ======================================================
    // SPECIAL CASE: Hit Points (show hp + hit_dice)
    // ======================================================
    else if (fieldName === "hp") {
      const hp = entry.hp ?? raw ?? "";
      const dice = entry.hit_dice ?? "";
      if (dice) {
        value.textContent = `${hp} (${dice})`;
      } else {
        value.textContent = `${hp}`;
      }
    }

    // ======================================================
    // Default plain text
    // ======================================================
    else {
      const s = (raw == null)
        ? ""
        : (typeof raw === "object" ? JSON.stringify(raw) : String(raw));
      value.textContent = s;
    }

    block.appendChild(label);
    block.appendChild(value);
    div.appendChild(block);
  });

  // --- Actions block (for monsters) ---
  if (entry.actions?.length > 0) {
    // Divider before actions
    div.insertAdjacentHTML("beforeend", `<div class="divider"></div>`);

    const actionsSection = document.createElement("div");
    actionsSection.className = "actions-section";

    const header = document.createElement("h3");
    header.textContent = "Actions";
    actionsSection.appendChild(header);

    entry.actions.forEach(act => {
      const block = document.createElement("div");
      block.className = "action-block";
      block.innerHTML = `<strong>${act.name}.</strong> ` +
        (act.desc ?? (act.entries?.join(" ") ?? ""));
      actionsSection.appendChild(block);
    });

    div.appendChild(actionsSection);
  }

  // --- Buttons block placed at the BOTTOM ---
  const buttons = document.createElement("div");
  buttons.className = "card-buttons";
  buttons.style.display = "flex";
  buttons.style.justifyContent = "space-between";
  buttons.style.marginTop = "1rem";

  const backBtn = document.createElement("button");
  backBtn.textContent = "Back";
  backBtn.className = "fancy-scroll-button";
  backBtn.addEventListener("click", onBack);

  const viewBtn = document.createElement("button");
  viewBtn.textContent = options.viewText ?? "View Full Details";
  viewBtn.className = "fancy-scroll-button";
  viewBtn.addEventListener("click", onView);

  buttons.appendChild(backBtn);
  buttons.appendChild(viewBtn);
  div.appendChild(buttons);

  // --- FINAL: append the card to the container ---
  container.appendChild(div);
}

function normalizeStringListField(value) {
  if (!value) return [];
  if (Array.isArray(value))
    return value.map(v => normalizeString(v)).filter(v => v.length > 0);
  if (typeof value === "string")
    return value.split(",").map(v => normalizeString(v)).filter(v => v.length > 0);
  return [];
}

function normalizeString(str) {
  return (str || "")
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function capitalizeFirst(str) {
  if (!str) return "";
  str = String(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderCardEntries(entries) {
  if (!entries) return "";
  if (!Array.isArray(entries)) return `<p>${entries}</p>`;

  return entries
    .map(e => {
      if (typeof e === "string") return `<p>${e}</p>`;
      if (typeof e === "object" && e.name && e.desc) {
        const descHtml = Array.isArray(e.desc)
          ? e.desc.map(d => `<p>${d}</p>`).join("")
          : `<p>${e.desc}</p>`;
        return `<div class="entry"><strong>${e.name}.</strong> ${descHtml}</div>`;
      }
      return `<p>${String(e)}</p>`;
    })
    .join("");
}

function objectToKeyValueString(obj) {
  if (!obj || typeof obj !== "object") return "";
  return Object.entries(obj)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
}

function keyValueStringToObject(str) {
  const out = {};
  if (!str || typeof str !== "string") return out;

  str.split(";").forEach(pair => {
    const [k, v] = pair.split(":").map(s => s.trim());
    if (k && v != null) out[k] = v;
  });

  return out;
}

function formatSource(source, page) {
  if (!source && !page) return "—";
  if (source && page) return `${source} ${page}`;
  return source || page || "—";
}

function numericOrString(a, b) {
  const na = parseFloat(a);
  const nb = parseFloat(b);
  const aNum = !isNaN(na);
  const bNum = !isNaN(nb);

  if (aNum && bNum) return na - nb;
  return String(a).localeCompare(String(b));
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ============================================================================
// 11. Export
// ============================================================================
window.DnDHelpers = window.DnDHelpers || {};

Object.assign(window.DnDHelpers, {
  safe,
  toNamedBlock,
  formatCRValue,
  formatCRXP,
  formatAbilityMod,
  formatField,
  ensureArrayField,
  FIELD_HELPERS,
  renderTable,
  renderCard,
  normalizeStringListField,
  normalizeString,
  capitalizeFirst,
  renderCardEntries,
  objectToKeyValueString,
  keyValueStringToObject,
  formatSource,
  numericOrString,
  deepClone,
  bindTableSorting
});

// ============================================================================
// END helpers09.js
// ============================================================================
