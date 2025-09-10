/**
 * Syntax validation and CSS selector generation
 * Handles class name validation and CSS selector escaping with safe regex execution
 */

import { escapeCSSSelector } from "../utils/cssUtils.js";
import { syncSafeRegexTest, REGEX_TIMEOUTS } from "../security/safeRegex.js";
import { ERROR_MESSAGES } from "../utils/errorMessages.js";

/**
 * Validate class syntax - supports both bracket and shorthand syntax with timeout protection
 * Examples: p-[24px], bg-[#111], p-24px, w-100%, bg-red
 * @param {string} className - Class name to validate
 * @returns {boolean} True if valid syntax
 */
export function validateClassSyntax(className) {
  if (!className || typeof className !== "string") {
    return {
      isValid: false,
      reason: "Class name must be a non-empty string",
      suggestions: ["Provide a valid string class name"],
    };
  }

  const trimmed = className.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      reason: ERROR_MESSAGES.INPUT.EMPTY_STRING,
      suggestions: ["Provide a non-empty class name"],
    };
  }

  // Check for malformed bracket syntax
  const openBrackets = (trimmed.match(/\[/g) || []).length;
  const closeBrackets = (trimmed.match(/\]/g) || []).length;

  if (openBrackets !== closeBrackets) {
    return {
      isValid: false,
      reason: "Unmatched brackets in class name",
      suggestions: [
        "Ensure each '[' has a matching ']'",
        "Example: p-[2rem] not p-[2rem or p-2rem]",
      ],
    };
  }

  // Check for empty brackets
  if (trimmed.includes("[-]") || trimmed.includes("[]")) {
    return {
      isValid: false,
      reason: "Empty brackets are not allowed",
      suggestions: [
        "Provide a value inside brackets",
        "Example: p-[2rem] not p-[]",
      ],
    };
  }

  // Check for unclosed brackets at start
  if (trimmed.startsWith("[") && !trimmed.endsWith("]")) {
    return {
      isValid: false,
      reason: ERROR_MESSAGES.SYNTAX.INVALID_BRACKETS,
      suggestions: [
        "Add property prefix before brackets",
        "Example: p-[2rem] not [2rem]",
      ],
    };
  }

  // Enhanced pattern to support both bracket and shorthand syntax
  const validPattern = /^[a-zA-Z][a-zA-Z0-9-]*(?:-\[[^\]]+\]|-[^ \t"'<>]+)?$/;

  const testResult = syncSafeRegexTest(validPattern, trimmed, {
    timeout: REGEX_TIMEOUTS.FAST,
  });

  if (!testResult.result || testResult.error || testResult.timedOut) {
    // Provide specific error messages based on pattern
    if (trimmed.includes(" ")) {
      return {
        isValid: false,
        reason: "Class names cannot contain spaces",
        suggestions: [
          "Remove spaces from class name",
          "Use hyphens instead of spaces",
        ],
      };
    }

    if (!/^[a-zA-Z]/.test(trimmed)) {
      return {
        isValid: false,
        reason: "Class names must start with a letter",
        suggestions: [
          "Start class name with a letter (a-z, A-Z)",
          "Example: p-[2rem] not 2-[2rem]",
        ],
      };
    }

    if (trimmed.includes('"') || trimmed.includes("'")) {
      return {
        isValid: false,
        reason: "Class names cannot contain quotes",
        suggestions: [
          "Remove quotes from class name",
          "Use bracket notation for complex values",
        ],
      };
    }

    return {
      isValid: false,
      reason: ERROR_MESSAGES.UNKNOWN_SYNTAX,
      suggestions: [
        "Use format: property-[value]",
        "Example: p-[2rem], m-[1rem], bg-[#ff0000]",
      ],
    };
  }

  return { isValid: true };
}

/**
 * Generate CSS selector with proper escaping
 * Uses centralized escaping function for consistency
 * @param {string} className - The class name to escape
 * @returns {string} Escaped CSS selector
 */
export function generateSelector(className) {
  return `.${escapeCSSSelector(className)}`;
}
