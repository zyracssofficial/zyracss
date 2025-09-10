/**
 * Core Type Validators
 * Basic CSS value types (keywords, lengths, numbers, etc.)
 */

import { isSafeInput } from "../../../security/index.js";
import {
  isCSSLength,
  isCSSColor,
  normalizeCSSValue,
  PROCESSING_CONSTANTS,
  CSS_UNITS,
} from "../../../utils/index.js";
import { validateCSSFunction } from "../../../utils/cssFunctionValidator.js";
import {
  CSS_VALUE_PATTERNS,
  PatternTester,
} from "../../../utils/regexPatterns.js";
import {
  ValidationResult,
  ErrorFactory,
  ERROR_CODES,
} from "../../../errors/index.js";

/**
 * Validation helpers for consistent result creation
 */
export const ValidationHelpers = {
  success(value) {
    return ValidationResult.valid(value);
  },

  failure(reason, value) {
    const error = ErrorFactory.invalidInput(value, reason);
    return ValidationResult.invalid(error);
  },

  successWithType(value, type, metadata = {}) {
    const result = ValidationResult.valid(value);
    result.metadata = { type, ...metadata };
    return result;
  },

  keyword(value) {
    return ValidationHelpers.successWithType(value, "keyword");
  },

  length(value) {
    return ValidationHelpers.successWithType(value, "length");
  },

  color(value) {
    return ValidationHelpers.successWithType(value, "color");
  },

  number(value) {
    return ValidationHelpers.successWithType(value, "number");
  },
};

/**
 * Check if value is a CSS global keyword
 */
export function isGlobalKeyword(value) {
  const globalKeywords = [
    "inherit",
    "initial",
    "unset",
    "revert",
    "revert-layer",
  ];
  return globalKeywords.includes(value.toLowerCase());
}

/**
 * Validate keyword values
 */
export function validateKeywordValue(value, rules, strict = false) {
  const trimmed = value.trim().toLowerCase();

  if (rules.values && rules.values.includes(trimmed)) {
    return ValidationHelpers.keyword(value);
  }

  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return ValidationHelpers.keyword(value);
  }

  // Check if custom values are allowed (for animation names, property names, etc.)
  if (rules.allowCustom) {
    // Basic validation for custom keywords (must be valid CSS identifier)
    if (/^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(value.trim())) {
      return ValidationHelpers.successWithType(value, "custom-keyword", {
        keyword: value.trim(),
      });
    }
  }

  return ValidationHelpers.failure(`Invalid keyword: ${trimmed}`, value);
}
