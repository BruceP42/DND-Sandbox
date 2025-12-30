/* ============================================================
   DnD Unified Dataset Loader
   Phase 3.3 — Guard Rails & Observability
   ============================================================ */

/* -----------------------------
   Configuration
------------------------------ */

// Set to true during development/testing only
const LOADER_DEBUG = false;

/* -----------------------------
   Internal State
------------------------------ */

const state = {
  basePath: null,
  datasets: new Map()
};

/* -----------------------------
   Logging Helpers
------------------------------ */

function logDebug(...args) {
  if (LOADER_DEBUG) {
    console.log("[DnDLoader]", ...args);
  }
}

function fatal(message) {
  throw new Error(`[DnDLoader] ${message}`);
}

/* -----------------------------
   Base Path Resolution
------------------------------ */

function computeBasePath() {
  const path = window.location.pathname;

  // Remove filename
  const parts = path.split("/").filter(Boolean);
  parts.pop();

  if (parts.length === 0) {
    return "/";
  }

  return "/" + parts.join("/") + "/";
}

/* -----------------------------
   Public Loader API
------------------------------ */

export const DnDLoader = {

  /* ---------- Path ---------- */

  getBasePath() {
    if (!state.basePath) {
      state.basePath = computeBasePath();
      logDebug("Computed basePath:", state.basePath);
    }
    return state.basePath;
  },

  /* ---------- Dataset Loading ---------- */

  async loadDataset(domain, relativePath) {
    if (!domain || typeof domain !== "string") {
      fatal("Domain name must be a non-empty string");
    }

    if (state.datasets.has(domain)) {
      fatal(`Dataset for domain "${domain}" already loaded`);
    }

    const basePath = this.getBasePath();
    const url = new URL(relativePath, window.location.origin + basePath).href;

    logDebug(`Attempting to load "${domain}" from`, url);

    let module;
    try {
      module = await import(url);
    } catch (err) {
      fatal(`Failed to import dataset "${domain}" from ${url}`);
    }

    /* ---------- Guard Rails ---------- */

    const data = module.default;

    if (!Array.isArray(data)) {
      fatal(`Dataset "${domain}" default export is not an array`);
    }

    if (module.__normalized !== true) {
      fatal(`Dataset "${domain}" is not marked as normalized`);
    }

    if (module.__domain !== domain) {
      fatal(
        `Domain mismatch while loading "${domain}": expected "${domain}", got "${module.__domain}"`
      );
    }

    /* ---------- Accept ---------- */

    state.datasets.set(domain, data);
    logDebug(`Loaded ${data.length} records for "${domain}"`);

    return data;
  },

  /* ---------- Accessors ---------- */

  getDataset(domain) {
    return state.datasets.get(domain);
  },

  hasDataset(domain) {
    return state.datasets.has(domain);
  },

  /* ---------- Debug ---------- */

  debugState() {
    return {
      basePath: state.basePath,
      loadedDatasets: Array.from(state.datasets.keys())
    };
  }
};

/* -----------------------------
   End of Loader
------------------------------ */
