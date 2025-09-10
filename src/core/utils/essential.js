/**
 * Lightweight utils exports for API layer
 * Re-exports only essential utilities to minimize bundle size
 */

export { createTimer, now, createLogger } from "./index.js";

// Note: This allows importing just timing and logging utilities
// without pulling in CSS utilities, string processing, and other non-API functions

/**
 * Common validation utilities to reduce code duplication
 */

/**
 * Validate that a value is a non-empty string
 * @param {any} value - Value to validate
 * @param {string} name - Name for error messages
 * @returns {boolean} True if valid
 */
export function isValidString(value, name = "value") {
  return value && typeof value === "string";
}

/**
 * Validate that a value is a string (allows empty strings)
 * @param {any} value - Value to validate
 * @returns {boolean} True if value is a string
 */
export function isString(value) {
  return typeof value === "string";
}

/**
 * Validate that a value is a non-empty string
 * @param {any} value - Value to validate
 * @returns {boolean} True if value is a non-empty string
 */
export function isNonEmptyString(value) {
  return value && typeof value === "string";
}

/**
 * Safe string conversion with fallback
 * @param {any} value - Value to convert
 * @param {string} fallback - Fallback value if conversion fails
 * @returns {string} String representation or fallback
 */
export function toSafeString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

/**
 * High-performance timer utilities for hot paths
 * Optimizes Date.now() calls by caching values briefly
 */
let cachedTime = 0;
let cacheExpiry = 0;
const CACHE_DURATION = 1; // Cache for 1ms to avoid excessive Date.now() calls

/**
 * Get current time with brief caching for hot paths
 * Reduces Date.now() system calls in performance-critical code
 * @returns {number} Current time in milliseconds
 */
export function fastNow() {
  const currentTime = Date.now();
  if (currentTime >= cacheExpiry) {
    cachedTime = currentTime;
    cacheExpiry = currentTime + CACHE_DURATION;
  }
  return cachedTime;
}

/**
 * Create a timer object for measuring elapsed time
 * Uses cached timing for better performance in hot paths
 * @returns {object} Timer object with start time and elapsed function
 */
export function createFastTimer() {
  const startTime = fastNow();
  return {
    startTime,
    elapsed: () => fastNow() - startTime,
    reset: () => {
      const newStartTime = fastNow();
      return {
        startTime: newStartTime,
        elapsed: () => fastNow() - newStartTime,
        reset: arguments.callee,
      };
    },
  };
}
