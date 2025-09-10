/**
 * Input length validation and limits
 * Prevents DoS attacks through oversized inputs
 */

import {
  MAX_CLASS_LENGTH,
  MAX_VALUE_LENGTH,
  MAX_CLASSES_PER_REQUEST,
} from "./securityConstants.js";

/**
 * Validate input length constraints
 * @param {string} input - Input to validate
 * @param {string} type - Type of input ('class', 'value', or 'general')
 * @returns {Object} Validation result with details
 */
export function validateLength(input, type = "general") {
  if (typeof input !== "string") {
    return {
      isValid: false,
      reason: "Input must be a string",
      limit: 0,
      actual: 0,
    };
  }

  const limits = {
    class: MAX_CLASS_LENGTH,
    value: MAX_VALUE_LENGTH,
    general: MAX_CLASS_LENGTH,
  };

  const limit = limits[type] || MAX_CLASS_LENGTH;
  const actual = input.length;

  if (actual > limit) {
    return {
      isValid: false,
      reason: `Input too long. Maximum ${limit} characters allowed for ${type}`,
      limit,
      actual,
      excess: actual - limit,
    };
  }

  return {
    isValid: true,
    reason: null,
    limit,
    actual,
    remaining: limit - actual,
  };
}

/**
 * Validate array length constraints
 * @param {Array} array - Array to validate
 * @returns {Object} Validation result
 */
export function validateArrayLength(array) {
  if (!Array.isArray(array)) {
    return {
      isValid: false,
      reason: "Input must be an array",
      limit: MAX_CLASSES_PER_REQUEST,
      actual: 0,
    };
  }

  const actual = array.length;

  if (actual > MAX_CLASSES_PER_REQUEST) {
    return {
      isValid: false,
      reason: `Too many items. Maximum ${MAX_CLASSES_PER_REQUEST} allowed`,
      limit: MAX_CLASSES_PER_REQUEST,
      actual,
      excess: actual - MAX_CLASSES_PER_REQUEST,
    };
  }

  return {
    isValid: true,
    reason: null,
    limit: MAX_CLASSES_PER_REQUEST,
    actual,
    remaining: MAX_CLASSES_PER_REQUEST - actual,
  };
}

/**
 * Calculate total size of all inputs
 * @param {Array<string>} inputs - Array of string inputs
 * @returns {Object} Size calculation results
 */
export function calculateTotalSize(inputs) {
  if (!Array.isArray(inputs)) {
    return {
      totalLength: 0,
      averageLength: 0,
      maxLength: 0,
      minLength: 0,
      count: 0,
    };
  }

  if (inputs.length === 0) {
    return {
      totalLength: 0,
      averageLength: 0,
      maxLength: 0,
      minLength: 0,
      count: 0,
    };
  }

  const lengths = inputs
    .filter((input) => typeof input === "string")
    .map((input) => input.length);

  if (lengths.length === 0) {
    return {
      totalLength: 0,
      averageLength: 0,
      maxLength: 0,
      minLength: 0,
      count: 0,
    };
  }

  const totalLength = lengths.reduce((sum, len) => sum + len, 0);

  return {
    totalLength,
    averageLength: totalLength / lengths.length,
    maxLength: Math.max(...lengths),
    minLength: Math.min(...lengths),
    count: lengths.length,
  };
}

/**
 * Check if combined input size is reasonable
 * @param {Array<string>} inputs - Array of inputs
 * @returns {Object} Size validation result
 */
export function validateCombinedSize(inputs) {
  const sizeInfo = calculateTotalSize(inputs);
  const arrayValidation = validateArrayLength(inputs);

  // Maximum total size (1MB of text should be more than enough)
  const MAX_TOTAL_SIZE = 1024 * 1024;

  if (!arrayValidation.isValid) {
    return {
      isValid: false,
      reason: arrayValidation.reason,
      sizeInfo,
    };
  }

  if (sizeInfo.totalLength > MAX_TOTAL_SIZE) {
    return {
      isValid: false,
      reason: `Combined input size too large. Maximum ${MAX_TOTAL_SIZE} characters allowed`,
      sizeInfo,
      limit: MAX_TOTAL_SIZE,
    };
  }

  // Check for suspicious patterns (e.g., many very long strings)
  if (sizeInfo.count > 100 && sizeInfo.averageLength > 1000) {
    return {
      isValid: false,
      reason: "Suspicious input pattern detected (many large strings)",
      sizeInfo,
    };
  }

  return {
    isValid: true,
    reason: null,
    sizeInfo,
  };
}
