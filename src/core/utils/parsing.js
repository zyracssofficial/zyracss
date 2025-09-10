/**
 * Shared Parsing Utilities for CSS Validators
 * Centralized parsing functions to eliminate duplication across validator modules
 */

import { isString, toSafeString } from "./essential.js";

/**
 * Split string by delimiter while respecting parentheses depth
 * This is the most generic version that handles any delimiter
 *
 * @param {string} value - String to split
 * @param {string} delimiter - Delimiter to split on (',', ' ', etc.)
 * @param {Object} options - Parsing options
 * @param {boolean} options.trimParts - Whether to trim each part (default: true)
 * @param {boolean} options.filterEmpty - Whether to filter empty parts (default: true)
 * @returns {string[]} Array of split parts
 */
export function splitRespectingParentheses(value, delimiter, options = {}) {
  const { trimParts = true, filterEmpty = true } = options;

  if (!isString(value)) {
    return [];
  }

  const result = [];
  let current = "";
  let parenDepth = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === "(") {
      parenDepth++;
    } else if (char === ")") {
      parenDepth--;
    } else if (char === delimiter && parenDepth === 0) {
      // Only split when we're not inside parentheses
      const part = trimParts ? current.trim() : current;
      if (!filterEmpty || part.length > 0) {
        result.push(part);
      }
      current = "";
      continue;
    }

    current += char;
  }

  // Add the final part
  const finalPart = trimParts ? current.trim() : current;
  if (!filterEmpty || finalPart.length > 0) {
    result.push(finalPart);
  }

  return result;
}

/**
 * Split string on commas while respecting parentheses
 * Specialized version for comma-separated values like shorthand properties
 *
 * @param {string} value - String to split on commas
 * @param {boolean} trimParts - Whether to trim each part (default: true)
 * @returns {string[]} Array of comma-separated parts
 */
export function splitOnCommas(value, trimParts = true) {
  return splitRespectingParentheses(value, ",", {
    trimParts,
    filterEmpty: true,
  });
}

/**
 * Split string on spaces while respecting parentheses
 * Specialized version for space-separated values like filter functions
 *
 * @param {string} value - String to split on spaces
 * @param {boolean} trimParts - Whether to trim each part (default: true)
 * @returns {string[]} Array of space-separated parts
 */
export function splitOnSpaces(value, trimParts = true) {
  return splitRespectingParentheses(value, /\s/, {
    trimParts,
    filterEmpty: true,
  });
}

/**
 * Split string on spaces while respecting parentheses (supports regex delimiter)
 * Enhanced version that handles any whitespace character
 *
 * @param {string} value - String to split on whitespace
 * @returns {string[]} Array of whitespace-separated parts
 */
export function splitOnWhitespace(value) {
  if (!isString(value)) {
    return [];
  }

  const result = [];
  let current = "";
  let parenDepth = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === "(") {
      parenDepth++;
    } else if (char === ")") {
      parenDepth--;
    } else if (/\s/.test(char) && parenDepth === 0) {
      if (current.trim()) {
        result.push(current.trim());
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result;
}

/**
 * Split string on colons while respecting brackets and quotes
 * Specialized for modifier syntax like "property:value:modifier"
 *
 * @param {string} value - String to split on colons
 * @returns {string[]} Array of colon-separated parts
 */
export function splitOnColons(value) {
  if (!isString(value)) {
    return [];
  }

  const parts = [];
  let current = "";
  let bracketDepth = 0;
  let inQuotes = false;
  let quoteChar = null;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    // Track quote state
    if ((char === '"' || char === "'") && (i === 0 || value[i - 1] !== "\\")) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
        quoteChar = null;
      }
    }

    // Track bracket depth (only outside quotes)
    if (!inQuotes) {
      if (char === "[") {
        bracketDepth++;
      } else if (char === "]") {
        bracketDepth--;
      } else if (char === ":" && bracketDepth === 0) {
        // Only split on colons that are outside brackets
        parts.push(current);
        current = "";
        continue;
      }
    }

    current += char;
  }

  if (current) {
    parts.push(current);
  }

  return parts;
}
