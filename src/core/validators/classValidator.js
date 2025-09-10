/**
 * Class array and batch validation logic
 * Handles validation of multiple classes and provides detailed results
 */

import { validateClassSyntax } from "../parser/syntaxValidator.js";
import { sanitizeInput } from "../security/index.js";
import {
  MAX_CLASSES_PER_REQUEST,
  MAX_BATCH_SIZE,
} from "../security/securityConstants.js";
import { now } from "../utils/essential.js";

/**
 * Validate array of classes with detailed results
 * @param {Array} classes - Array of class names
 * @returns {Object} Validation result with valid/invalid classes and stats
 */
export function validateClasses(classes) {
  if (!Array.isArray(classes)) {
    return {
      valid: [],
      invalid: ["Input must be an array"],
      stats: {
        total: 0,
        validCount: 0,
        invalidCount: 1,
        processingTime: 0,
      },
    };
  }

  const startTime = now();

  // Check array size limits using centralized constant
  if (classes.length > MAX_CLASSES_PER_REQUEST) {
    return {
      valid: [],
      invalid: [
        `Too many classes. Maximum ${MAX_CLASSES_PER_REQUEST} allowed.`,
      ],
      stats: {
        total: classes.length,
        validCount: 0,
        invalidCount: 1,
        processingTime: now() - startTime,
      },
    };
  }

  const valid = [];
  const invalid = [];
  const seen = new Set(); // For deduplication

  for (const className of classes) {
    // Skip duplicates
    if (seen.has(className)) {
      continue;
    }
    seen.add(className);

    // Validate individual class
    const result = validateSingleClass(className);
    if (result.isValid) {
      valid.push(result.sanitized);
    } else {
      invalid.push({
        original: className,
        reason: result.reason,
      });
    }
  }

  const processingTime = now() - startTime;

  return {
    valid,
    invalid,
    stats: {
      total: classes.length,
      unique: seen.size,
      validCount: valid.length,
      invalidCount: invalid.length,
      processingTime: Math.round(processingTime * 100) / 100,
    },
  };
}

/**
 * Validate a single class with detailed result
 * @param {string} className - Class name to validate
 * @returns {Object} Validation result with details
 */
export function validateSingleClass(className) {
  // Type check
  if (typeof className !== "string") {
    return {
      isValid: false,
      reason: "Class must be a string",
      sanitized: null,
    };
  }

  // Sanitize input
  const sanitized = sanitizeInput(className);
  if (!sanitized) {
    return {
      isValid: false,
      reason: "Contains invalid or dangerous characters",
      sanitized: null,
    };
  }

  // Syntax validation
  if (!validateClassSyntax(sanitized)) {
    return {
      isValid: false,
      reason: "Invalid class syntax",
      sanitized: null,
    };
  }

  return {
    isValid: true,
    reason: null,
    sanitized,
  };
}

/**
 * Validate classes in batches for better performance
 * @param {Array} classes - Array of class names
 * @param {number} batchSize - Size of each batch
 * @returns {Promise<Object>} Validation result
 */
export async function validateClassesBatched(
  classes,
  batchSize = MAX_BATCH_SIZE
) {
  if (!Array.isArray(classes)) {
    return validateClasses(classes); // Use regular validation for error handling
  }

  const results = {
    valid: [],
    invalid: [],
    stats: {
      total: classes.length,
      unique: 0,
      validCount: 0,
      invalidCount: 0,
      processingTime: 0,
      batches: 0,
    },
  };

  const startTime = now();
  const seen = new Set();

  // Process in batches
  for (let i = 0; i < classes.length; i += batchSize) {
    const batch = classes.slice(i, i + batchSize);
    const batchResult = validateClasses(batch);

    // Merge results
    results.valid.push(...batchResult.valid);
    results.invalid.push(...batchResult.invalid);
    results.stats.batches++;

    // Update seen set - using for...of for better performance
    for (const cls of batch) {
      seen.add(cls);
    }

    // Yield control to event loop to prevent blocking the main thread
    // This allows other operations to execute between batches for better responsiveness
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  results.stats.unique = seen.size;
  results.stats.validCount = results.valid.length;
  results.stats.invalidCount = results.invalid.length;
  results.stats.processingTime = now() - startTime;

  return results;
}

/**
 * Get statistics about class validation
 * @param {Object} validationResult - Result from validateClasses
 * @returns {Object} Detailed statistics
 */
export function getValidationStats(validationResult) {
  const { stats } = validationResult;

  return {
    ...stats,
    validPercentage:
      stats.total > 0 ? ((stats.validCount / stats.total) * 100).toFixed(2) : 0,
    invalidPercentage:
      stats.total > 0
        ? ((stats.invalidCount / stats.total) * 100).toFixed(2)
        : 0,
    deduplicationRatio:
      stats.total > 0 ? (stats.unique / stats.total).toFixed(2) : 1,
    averageProcessingTime:
      stats.unique > 0 ? (stats.processingTime / stats.unique).toFixed(4) : 0,
  };
}
