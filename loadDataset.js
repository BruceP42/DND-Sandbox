// loadDataset.js
// This script loads the dataset using a VM and exposes it for validate-schema.js

import fs from "fs";
import vm from "vm";

/**
 * Load a dataset defined as:
 *   var someName = [ ... ];
 *
 * This will:
 *  - run the file inside a sandbox
 *  - detect the single global variable
 *  - return its value (must be an array)
 */
export default function loadDataset(filepath) {
  const code = fs.readFileSync(filepath, "utf8");

  // A blank sandbox where the dataset will run
  const sandbox = {};
  vm.createContext(sandbox);

  // Run the dataset file (creates a variable in sandbox)
  vm.runInContext(code, sandbox);

  // Identify whatever global variable was created
  const keys = Object.keys(sandbox);

  if (keys.length !== 1) {
    throw new Error(
      `${filepath}: Expected exactly 1 global variable, found ${keys.length} (${keys})`
    );
  }

  const varName = keys[0];
  const data = sandbox[varName];

  if (!Array.isArray(data)) {
    throw new Error(`${filepath}: Global variable ${varName} is not an array.`);
  }

  return data;
}
