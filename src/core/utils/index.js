/**
 * ZyraCSS Utilities Index
 * Centralized access to all utility functions
 *
 * Re-export Strategy:
 * - Explicit re-exports for better IDE support and tree-shaking
 * - Centralized utility access point for internal modules
 * - Clear separation between public and internal utilities
 */

// Export centralized regex patterns (explicit exports for better maintainability)
export {
  CSS_UNIT_PATTERNS,
  CSS_VALUE_PATTERNS,
  COMPILED_PATTERNS,
  PatternTester,
} from "./regexPatterns.js";

/**
 * Create performance timer with portable timing
 * @param {string} name - Timer name
 * @returns {Object} Timer object with start/stop methods
 */
export function createTimer(name = "timer") {
  let startTime = null;

  return {
    start() {
      startTime = Date.now();
      return this;
    },

    stop() {
      if (startTime === null) {
        return 0; // Return 0 instead of throwing error for robustness
      }
      const duration = Date.now() - startTime;
      startTime = null;
      return duration;
    },

    elapsed() {
      if (startTime === null) {
        return 0;
      }
      return Date.now() - startTime;
    },
  };
}

// CSS utilities
export {
  escapeCSSSelector,
  normalizeCSSValue,
  isCSSLength,
  isCSSColor,
  formatFontFamilyFromArray,
  formatCSSRule,
} from "./cssUtils.js";

// Constants
export {
  CSS_UNITS,
  PROCESSING_CONSTANTS,
  CACHE_CONSTANTS,
  DEBUG_LEVELS,
} from "./constants.js";

// Helper functions
export { createLogger } from "./helpers.js";

/**
 * Portable high-resolution timer
 * Works in Node.js, browsers, and test environments
 * @returns {number} Current time in milliseconds
 */
export const now =
  (globalThis.performance &&
    globalThis.performance.now.bind(globalThis.performance)) ||
  (() => Date.now());
