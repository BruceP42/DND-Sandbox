// Initial version of unified-loader that proved the abilty to determine the level of the subdirectory from which the script is called V1.0
(() => {
  "use strict";

  // Compute base path based on current location
  function computeBasePath() {
    const scriptUrl = new URL(document.currentScript.src);
    const scriptDir = scriptUrl.pathname.replace(/\/[^/]+$/, ""); // remove filename
  
    // scriptDir now ends in /js
    // project root is one level up from /js
    const projectRootDir = scriptDir.replace(/\/js$/, "");
  
    const pagePath = window.location.pathname;
  
    // Count how many directories the page is below the project root
    const relative = pagePath.replace(projectRootDir, "");
    const depth = relative.split("/").filter(Boolean).length - 1;
  
    return depth <= 0 ? "./" : "../".repeat(depth);
  }

  const basePath = computeBasePath();

  // Expose for diagnostics
  window.__DND_BASE_PATH__ = basePath;

  // Debug output (temporary)
  const debugEl = document.getElementById("path-debug");
  if (debugEl) {
    debugEl.textContent = `Computed base path: ${basePath}`;
  }

})();
