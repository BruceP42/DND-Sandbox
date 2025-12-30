/* ============================================================================
   unified-loader.js
   Phase 3.2 — Unified Loader Skeleton (Root-Relative Paths)
   Version V20 saved after completing Phase 3.2 prior to starting phase 3.3
============================================================================ */

(() => {
  "use strict";

  /* -------------------------------------------------------------------------
     Internal State
  ------------------------------------------------------------------------- */
  const state = {
    basePath: "/", // always relative to project root
    datasets: new Map()
  };

  /* -------------------------------------------------------------------------
     Public API
  ------------------------------------------------------------------------- */
  const DnDLoader = {
    getBasePath() {
      return state.basePath;
    },

    async loadDataset(name, relativePath) {
      if (state.datasets.has(name)) return state.datasets.get(name);

      // Use root-relative path for import
      const url = new URL(relativePath, window.location.origin + state.basePath).href;

      try {
        const module = await import(url);
        const data = module.default;

        if (!Array.isArray(data)) {
          throw new Error("Dataset default export is not an array");
        }

        state.datasets.set(name, data);
        return data;
      } catch (err) {
        console.error(`[DnDLoader] Failed to load dataset "${name}" from ${url}`, err);
        throw err;
      }
    },

    getDataset(name) {
      return state.datasets.get(name) || null;
    },

    hasDataset(name) {
      return state.datasets.has(name);
    },

    debugState() {
      return {
        basePath: state.basePath,
        loadedDatasets: Array.from(state.datasets.keys())
      };
    }
  };

  /* -------------------------------------------------------------------------
     Initialization
  ------------------------------------------------------------------------- */
  window.DnDLoader = DnDLoader;

  /* -------------------------------------------------------------------------
     Optional Debug Output
  ------------------------------------------------------------------------- */
  const debugEl = document.getElementById("Debug");
  if (debugEl) {
    debugEl.innerHTML = `
      <strong>DnDLoader Initialized</strong><br>
      Computed base path: ${state.basePath}
    `;
  }
})();
