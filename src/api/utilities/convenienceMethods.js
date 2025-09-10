/**
 * Convenience methods module for zyraGenerateCSS API
 * Provides utility functions and simplified interfaces
 */

import { parseClasses } from "../../core/parser/index.js";
import { sanitizeInputArray } from "../../core/security/index.js";
import { now } from "../../core/utils/essential.js";
import { ZyraResult, ErrorFactory } from "../../core/errors/essential.js";
import {
  validateClassesInput,
  validateHTMLInput,
} from "../validators/inputValidator.js";

/**
 * Generate CSS from a single HTML string (convenience method)
 * @param {string} html - HTML string to scan
 * @param {Object} [options] - Generation options
 * @returns {Promise<ZyraResult>} Generated CSS result
 */
export async function zyraGenerateCSSFromHTML(html, options = {}) {
  // Import the main zyraGenerateCSS function to avoid circular imports
  const { zyraGenerateCSS } = await import("../core/generateCSS.js");

  const validation = validateHTMLInput(html);
  if (!validation.success) {
    return validation;
  }

  // Pass HTML directly as string input, not in structured object
  return zyraGenerateCSS(html, options);
}

/**
 * Generate CSS from an array of class names (convenience method)
 * @param {Array} classes - Array of utility class names
 * @param {Object} [options] - Generation options
 * @returns {Promise<ZyraResult>} Generated CSS result
 */
export async function zyraGenerateCSSFromClasses(classes, options = {}) {
  // Import the main zyraGenerateCSS function to avoid circular imports
  const { zyraGenerateCSS } = await import("../core/generateCSS.js");

  const validation = validateClassesInput(classes);
  if (!validation.success) {
    return validation;
  }

  return zyraGenerateCSS({
    classes,
    options,
  });
}

/**
 * Validate classes without generating CSS
 * @param {Array<string>} classes - Array of class names to validate
 * @returns {Promise<ZyraResult>} Validation results only
 */
export async function validateClassNames(classes) {
  const validation = validateClassesInput(classes);
  if (!validation.success) {
    return validation;
  }

  try {
    const startTime = now();

    // Security validation
    const { sanitized, failed } = sanitizeInputArray(classes);

    // Parse validation
    const parseResult = parseClasses(sanitized);

    const processingTime = now() - startTime;

    const result = {
      valid: parseResult.parsed.map((p) => p.className),
      invalid: [
        ...parseResult.invalid.map((inv) => ({
          className: inv.className,
          reason: inv.error.message,
          suggestions: inv.suggestions || [],
        })),
        ...failed.map((f) => ({
          className: f,
          reason: "Failed security validation",
          suggestions: ["Remove dangerous characters"],
        })),
      ],
      stats: {
        total: classes.length,
        validCount: parseResult.parsed.length,
        invalidCount: parseResult.invalid.length + failed.length,
        processingTime,
      },
    };

    return ZyraResult.success(result);
  } catch (error) {
    return ZyraResult.error(
      ErrorFactory.parsingFailed("Validation process failed", error.message)
    );
  }
}

/**
 * Quick validation check for a single class name
 * @param {string} className - Single class name to validate
 * @returns {Promise<ZyraResult>} Validation result for single class
 */
export async function validateSingleClass(className) {
  if (typeof className !== "string") {
    return ZyraResult.error(
      ErrorFactory.invalidInput(className, "Class name must be a string")
    );
  }

  return validateClassNames([className]);
}

/**
 * Get validation statistics without detailed results
 * @param {Array<string>} classes - Array of class names to analyze
 * @returns {Promise<ZyraResult>} Statistics only
 */
export async function getValidationStats(classes) {
  const result = await validateClassNames(classes);

  if (!result.success) {
    return result;
  }

  // Return only statistics, not the detailed results
  return ZyraResult.success(result.data.stats);
}

/**
 * Parse classes and return structured result (direct API)
 * @param {Array<string>} classes - Array of class names to parse
 * @returns {Object} Direct parse result with hasAnyValid, valid, invalid properties
 */
export function parseClassesDirect(classes) {
  // Use the already imported parseClasses function
  const result = parseClasses(classes);

  return {
    hasAnyValid: result.hasAnyValid,
    valid: result.parsed || [],
    invalid: result.invalid || [],
  };
}
