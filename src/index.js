/**
 * ZyraCSS - Modern Clean API
 * Single namespace export for simplicity and clarity
 */

// Import all required functions
import { zyraGenerateCSS } from "./api/core/generateCSS.js";
import { zyraCSSManager } from "./api/core/browserManager.js";
import { zyraCreateEngine } from "./api/core/createEngine.js";

// ============================================================================
// ZYRA NAMESPACE - Modern Clean API
// ============================================================================

export const zyra = {
  // Main CSS generation
  generate: zyraGenerateCSS,

  // Inject manager - simplified to direct function call
  inject: (classes) => {
    try {
      return zyraCSSManager.processClasses(classes);
    } catch (error) {
      if (typeof window === "undefined") {
        console.warn("[ZyraCSS] Inject features require browser environment");
        return;
      }
      throw error;
    }
  },

  // Advanced engine for incremental processing
  createEngine: zyraCreateEngine,
};

// ============================================================================
// DEFAULT EXPORT - Zyra namespace
// ============================================================================

export default zyra;
