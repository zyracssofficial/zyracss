/**
 * General helper functions
 * Utility functions used across different modules
 */

import { DEBUG_LEVELS } from "./constants.js";

/**
 * Create a logger with different levels
 * @param {string} context - Context/module name for logging
 * @param {number} level - Minimum log level to output
 * @returns {Object} Logger object
 */
export function createLogger(context = "ZyraCSS", level = DEBUG_LEVELS.WARN) {
  const log = (logLevel, message, ...args) => {
    if (logLevel <= level) {
      const timestamp = new Date().toISOString();
      const levelName = Object.keys(DEBUG_LEVELS)[logLevel] || "UNKNOWN";
      console.log(
        `[${timestamp}] [${levelName}] [${context}] ${message}`,
        ...args
      );
    }
  };

  return {
    error: (message, ...args) => log(DEBUG_LEVELS.ERROR, message, ...args),
    warn: (message, ...args) => log(DEBUG_LEVELS.WARN, message, ...args),
    info: (message, ...args) => log(DEBUG_LEVELS.INFO, message, ...args),
    debug: (message, ...args) => log(DEBUG_LEVELS.DEBUG, message, ...args),
    trace: (message, ...args) => log(DEBUG_LEVELS.TRACE, message, ...args),

    setLevel: (newLevel) => {
      level = newLevel;
    },
    getLevel: () => level,
  };
}
