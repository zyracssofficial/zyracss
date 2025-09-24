/**
 * Input validation module for zyraGenerateCSS API
 * Handles validation of input parameters and structure
 */

import { ZyraResult, ErrorFactory } from "../../core/errors/essential.js";
import { ERROR_MESSAGES } from "../../core/utils/errorMessages.js";

/**
 * Validate the main zyraGenerateCSS input
 * @param {string|string[]|Object} input - Input to validate (classes, HTML, or structured object)
 * @param {Object} options - Generation options
 * @returns {ZyraResult} Validation result
 */
export function validateGenerateInput(input, options = {}) {
  // Handle direct array/string inputs (common usage)
  if (Array.isArray(input)) {
    // Direct classes array
    const classValidation = validateClassesInput(input);
    if (!classValidation.success) return classValidation;

    return ZyraResult.success({
      input,
      options: validateOptions(options),
    });
  }

  if (typeof input === "string") {
    // Direct HTML string
    const htmlValidation = validateHTMLInput([input]);
    if (!htmlValidation.success) return htmlValidation;

    return ZyraResult.success({
      input, // Keep as string, don't wrap in array
      options: validateOptions(options),
    });
  }

  // Handle structured input object (advanced usage)
  if (!input || typeof input !== "object") {
    return ZyraResult.error(
      ErrorFactory.invalidInput(input, ERROR_MESSAGES.INPUT.INVALID_COLLECTION)
    );
  }

  const { classes, html, options: inputOptions } = input;
  const mergedOptions = { ...options, ...inputOptions };

  // Validate that at least one input source is provided
  if (!classes && !html) {
    return ZyraResult.error(
      ErrorFactory.invalidInput(
        input,
        "Either classes or html must be provided",
        [
          "Provide a classes array: ['m-4', 'p-2']",
          "Provide HTML strings: ['<div class=\"m-4\">...']",
        ]
      )
    );
  }

  // Quick type validation - detailed processing happens in main function
  if (classes !== undefined) {
    const classValidation = validateClassesInput(classes);
    if (!classValidation.success) return classValidation;
  }

  if (html !== undefined) {
    const htmlValidation = validateHTMLInput(html);
    if (!htmlValidation.success) return htmlValidation;
  }

  return ZyraResult.success({
    input: { classes, html },
    options: validateOptions(mergedOptions),
  });
}

/**
 * Validate options object
 * @param {Object} options - Options to validate
 * @returns {Object} Validated options
 */
function validateOptions(options = {}) {
  if (typeof options !== "object" || options === null) {
    return {};
  }
  return options;
}

/**
 * Validate classes array input
 * @param {Array} classes - Classes to validate
 * @returns {ZyraResult} Validation result
 */
export function validateClassesInput(classes) {
  if (!Array.isArray(classes)) {
    const inputType = typeof classes;
    let specificMessage = "Classes must be provided as an array";
    const suggestions = ["Wrap single classes in an array: ['p-[2rem]']"];

    if (classes === null) {
      specificMessage =
        "Classes cannot be null. Provide an array of class names";
      suggestions.push("Use an empty array [] for no classes");
    } else if (classes === undefined) {
      specificMessage =
        "Classes parameter is required. Provide an array of class names";
      suggestions.push("Example: ['p-[2rem]', 'm-[1rem]']");
    } else if (inputType === "string") {
      specificMessage = `Single class string "${classes}" must be wrapped in an array`;
      suggestions.push(`Change to: ["${classes}"]`);
    } else if (inputType === "number") {
      specificMessage = `Number ${classes} is not valid. Classes must be strings in an array`;
      suggestions.push("Example: ['p-[2rem]', 'margin-[1rem]']");
    } else if (inputType === "object") {
      specificMessage =
        "Object provided instead of array. Classes must be an array of strings";
      suggestions.push("Use array syntax: ['class1', 'class2']");
    }

    return ZyraResult.error(
      ErrorFactory.invalidInput(classes, specificMessage, suggestions)
    );
  }

  return ZyraResult.success(classes);
}

/**
 * Validate HTML input (string or array of strings)
 * @param {string|Array<string>} html - HTML to validate
 * @returns {ZyraResult} Validation result
 */
function validateHTMLInput(html) {
  // Single HTML string
  if (typeof html === "string") {
    return ZyraResult.success(html);
  }

  // Array of HTML strings
  if (Array.isArray(html)) {
    const validStrings = html.every((item) => typeof item === "string");
    if (!validStrings) {
      return ZyraResult.error(
        ErrorFactory.invalidInput(html, "HTML array must contain only strings")
      );
    }
    return ZyraResult.success(html);
  }

  return ZyraResult.error(
    ErrorFactory.invalidInput(html, "HTML must be a string or array of strings")
  );
}
