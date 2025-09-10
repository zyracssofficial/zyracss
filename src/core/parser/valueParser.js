/**
 * CSS value parsing logic for complex values and functions
 * Handles comma-separated values, CSS functions, and shorthand syntax
 * Includes u(...) URL syntax support
 */

import { detectDangerousPatterns } from "../security/index.js";
import { createLogger } from "../utils/helpers.js";

const logger = createLogger("ValueParser");
import {
  isKnownCSSFunction,
  isSingleCSSFunction,
} from "../utils/cssFunctionValidator.js";
import {
  normalizeUrlFunction,
  isUrlProperty,
  isValidCursorValue,
} from "../utils/urlUtils.js";

/**
 * Enhanced CSS syntax parser that handles complex values and functions
 * @param {string} cssValue - Raw CSS value to parse
 * @param {string} property - CSS property name (for URL processing)
 * @returns {Object|null} Parsed value object or null if invalid
 */
export function parseCSSSyntax(cssValue, property = null) {
  if (!cssValue || typeof cssValue !== "string") {
    return null;
  }

  // Check for u(...) URL syntax and normalize if property accepts URLs
  let hasUrlFromUSyntax = false;
  if (property && isUrlProperty(property)) {
    try {
      const normalizedUrl = normalizeUrlFunction(cssValue);
      if (normalizedUrl) {
        // Replace the original value with the normalized URL
        cssValue = normalizedUrl;
        hasUrlFromUSyntax = true; // Mark that this url() came from u() conversion
      }
    } catch (error) {
      // If u(...) syntax contains invalid/dangerous URL, reject the entire value
      logger.warn(`Dangerous URL detected in u() function: ${cssValue}`, {
        error: error.message,
        property: property,
      });
      return null;
    }
  }

  // Property-specific validation
  if (property === "cursor") {
    if (!isValidCursorValue(cssValue)) {
      return null;
    }
  }

  // Security validation - check for dangerous patterns in CSS values
  const securityCheck = detectDangerousPatterns(cssValue);
  if (securityCheck.isDangerous) {
    // Log the security issue and reject the value
    logger.warn(`Dangerous CSS value detected: ${cssValue}`, {
      patterns: securityCheck.matchedPatterns.map((p) => p.name),
      riskLevel: securityCheck.riskLevel,
    });
    return null;
  }

  // Validate CSS syntax - reject unescaped quotes and other invalid syntax
  if (!isValidCSSValue(cssValue)) {
    return null;
  }

  // Validate that multiple values only use commas as separators
  if (!isValidMultiValueSyntax(cssValue)) {
    return null;
  }

  // Check if this is a SINGLE CSS function (like linear-gradient, rgba, etc.)
  // Only treat as function if the entire value is a single function call
  if (isSingleCSSFunction(cssValue)) {
    return {
      cssValue: cssValue.trim(),
      values: [cssValue.trim()],
      isFunction: true,
      hasUrlFromUSyntax,
    };
  }

  // Split on commas for shorthand values (like padding: 1rem 2rem)
  // Only split if not inside parentheses
  const values = smartCommaSplit(cssValue);

  // Check if comma splitting failed due to invalid syntax
  if (values === null) {
    return null; // Invalid comma syntax (leading/trailing/consecutive commas)
  }

  if (values.length === 1) {
    return {
      cssValue: values[0].trim(),
      values: values,
      isFunction: false,
      hasUrlFromUSyntax,
    };
  }

  // Special handling for border and outline properties - preserve comma-separated format
  // for proper shorthand validation in the validator
  if (
    property &&
    (property === "border" ||
      property === "outline" ||
      (property.startsWith("border-") &&
        (property.endsWith("-border") ||
          property === "border-block" ||
          property === "border-inline")) ||
      property.startsWith("outline-"))
  ) {
    // For border/outline shorthand properties, don't auto-convert commas to spaces
    // Let the validator handle the proper shorthand validation
    const trimmedValues = values.map((v) => v.trim());
    return {
      cssValue: cssValue.trim(), // Keep original comma-separated format
      values: trimmedValues,
      isFunction: false,
      hasUrlFromUSyntax,
      preserveCommas: true, // Flag to indicate this should be handled specially
    };
  }

  // Multiple values - join with spaces for CSS shorthand (non-border properties)
  const trimmedValues = values.map((v) => v.trim());
  return {
    cssValue: trimmedValues.join(" "),
    values: trimmedValues,
    isFunction: false,
    hasUrlFromUSyntax,
  };
}

/**
 * Smart comma splitting that respects parentheses
 * @param {string} value - Value to split
 * @returns {Array} Array of split values
 */
function smartCommaSplit(value) {
  const result = [];
  let current = "";
  let parenDepth = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === "(") {
      parenDepth++;
    } else if (char === ")") {
      parenDepth--;
    } else if (char === "," && parenDepth === 0) {
      // Only split on comma if we're not inside parentheses
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  // Always add the final element (even if empty - this helps detect trailing commas)
  result.push(current);

  // Check for invalid comma patterns (leading/trailing commas)
  if (result.length > 0) {
    // Check for leading comma (first element is empty)
    if (result[0].trim() === "") {
      return null; // Invalid: leading comma
    }

    // Check for trailing comma (last element is empty)
    if (result[result.length - 1].trim() === "") {
      return null; // Invalid: trailing comma
    }

    // Check for consecutive commas (any middle element is empty)
    for (let i = 1; i < result.length - 1; i++) {
      if (result[i].trim() === "") {
        return null; // Invalid: consecutive commas
      }
    }
  }

  return result.length > 0 ? result : [value];
}

/**
 * Validate that multiple values only use commas as separators
 * ZyraCSS Rule: NO SPACES allowed inside brackets, even in CSS functions
 * @param {string} value - Value to validate
 * @returns {boolean} True if valid syntax
 */
function isValidMultiValueSyntax(value) {
  // ZyraCSS strict rule: NO SPACES allowed anywhere inside bracket values
  // Even CSS functions must use comma syntax: calc(100%-20px) not calc(100% - 20px)

  // Check for any spaces outside of quoted strings and CSS functions
  let inQuotes = false;
  let quoteChar = null;
  let inFunction = false;
  let parenDepth = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    // Track parentheses for CSS functions
    if (char === "(") {
      parenDepth++;
      if (parenDepth === 1) {
        // Check if this looks like a CSS function start
        const beforeParen = value.slice(0, i);
        if (/[a-zA-Z-]+$/.test(beforeParen)) {
          inFunction = true;
        }
      }
    } else if (char === ")") {
      parenDepth--;
      if (parenDepth === 0) {
        inFunction = false;
      }
    }

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

    // If we find a space outside quotes and functions, reject the value
    if (!inQuotes && !inFunction && char === " ") {
      return false;
    }
  }

  // Check for invalid separators like pipes
  // Semicolons are allowed inside CSS functions (like data URLs)
  if (value.includes("|")) {
    return false;
  }

  // Check for semicolons outside of CSS functions and quoted strings
  inQuotes = false;
  quoteChar = null;
  inFunction = false;
  parenDepth = 0;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    // Track parentheses for CSS functions
    if (char === "(") {
      parenDepth++;
      if (parenDepth === 1) {
        const beforeParen = value.slice(0, i);
        if (/[a-zA-Z-]+$/.test(beforeParen)) {
          inFunction = true;
        }
      }
    } else if (char === ")") {
      parenDepth--;
      if (parenDepth === 0) {
        inFunction = false;
      }
    }

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

    // Semicolons outside functions and quotes are invalid
    if (!inQuotes && !inFunction && char === ";") {
      return false;
    }
  }

  return true;
}

/**
 * Validate CSS value syntax to reject malformed values
 * @param {string} value - CSS value to validate
 * @returns {boolean} True if valid CSS syntax
 */
function isValidCSSValue(value) {
  // Check for unescaped quotes that would break CSS
  if (hasUnescapedQuotes(value)) {
    return false;
  }

  // Check for other invalid CSS syntax patterns
  // Invalid: unclosed brackets, invalid characters, etc.
  if (hasInvalidCSSCharacters(value)) {
    return false;
  }

  return true;
}

/**
 * Check for unescaped quotes in CSS value
 * @param {string} value - CSS value to check
 * @returns {boolean} True if contains unescaped quotes
 */
function hasUnescapedQuotes(value) {
  // For CSS functions like u('...') or content("..."), quotes inside functions are valid
  // Check if this is a CSS function with quoted parameters
  const functionPattern = /^[a-z-]+\([^)]*\)$/i;
  if (functionPattern.test(value)) {
    // For CSS functions, quotes inside are generally valid
    return false;
  }

  // For non-function values, check for properly paired quotes
  const doubleQuoteMatches = (value.match(/"/g) || []).length;
  const singleQuoteMatches = (value.match(/'/g) || []).length;

  // If odd number of quotes, they're not properly paired
  return doubleQuoteMatches % 2 !== 0 || singleQuoteMatches % 2 !== 0;
}

/**
 * Check for invalid CSS characters
 * @param {string} value - CSS value to check
 * @returns {boolean} True if contains invalid characters
 */
function hasInvalidCSSCharacters(value) {
  // Check for characters that shouldn't appear in CSS values
  // Basic invalid characters
  if (/[<>{}]/.test(value)) {
    return true;
  }

  // For quoted strings, allow Unicode characters inside quotes
  const quotedStringPattern = /^["'].*["']$/;
  if (quotedStringPattern.test(value)) {
    // For quoted strings, only check for control characters
    if (/[\x00-\x1F\x7F-\x9F]/.test(value)) {
      return true;
    }
    return false;
  }

  // For non-quoted values, check for non-ASCII characters (Unicode characters should be rejected)
  // CSS values should generally use ASCII characters only
  // Allow common CSS-safe characters and arithmetic operators for calc() functions
  const allowedChars = [
    "a-zA-Z0-9", // Alphanumeric
    "\\-%.,()\\[\\]", // Basic CSS characters
    "#:;/\\s", // Selectors and spacing
    "\"'?&=_", // Quotes and URL parameters
    "+*", // Arithmetic operators for calc()
  ].join("");

  if (!new RegExp(`^[${allowedChars}]*$`).test(value)) {
    return true;
  }

  // Additional check for control characters
  if (/[\x00-\x1F\x7F-\x9F]/.test(value)) {
    return true;
  }

  return false;
}
