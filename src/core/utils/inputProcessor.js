/**
 * Input Processing Utility
 */

import { sanitizeInputArray } from "../security/index.js";
import { now } from "./essential.js";

/**
 * Unified input processing for all API endpoints
 * @param {any} input - Input to process (array, string, etc.)
 * @param {Object} options - Processing options
 * @returns {Object} Standardized processing result
 */
export function processInput(input, options = {}) {
  const {
    expectArray = true,
    sanitize = true,
    deduplicate = true,
    includeStats = true,
  } = options;

  const startTime = now();
  const result = {
    success: false,
    processed: [],
    invalid: [],
    stats: null,
  };

  // Phase 1: Type validation
  if (expectArray && !Array.isArray(input)) {
    result.invalid.push({
      input,
      reason: "Expected array input",
      type: "type_error",
    });

    if (includeStats) {
      result.stats = createProcessingStats(startTime, [], []);
    }

    return result;
  }

  // Phase 2: Convert to array if needed
  let workingArray = expectArray ? input : [input];

  // Phase 3: Filter valid strings
  const { validStrings, invalidItems } = extractValidStrings(workingArray);
  result.invalid.push(...invalidItems);

  // Phase 4: Security sanitization
  let processedItems = validStrings;
  if (sanitize && validStrings.length > 0) {
    const sanitizeResult = sanitizeInputArray(validStrings);
    processedItems = sanitizeResult.sanitized;

    // Add sanitization failures to invalid list - using for...of for better performance
    for (const failed of sanitizeResult.failed) {
      result.invalid.push({
        input: failed,
        reason: "Failed security validation",
        type: "security_error",
      });
    }
  }

  // Phase 5: Deduplication
  if (deduplicate && processedItems.length > 0) {
    const { deduplicated, duplicates } = deduplicateArray(processedItems);
    processedItems = deduplicated;

    // Note: We don't add duplicates to invalid since they're not errors
  }

  // Phase 6: Final result
  result.success = true;
  result.processed = processedItems;

  if (includeStats) {
    result.stats = createProcessingStats(
      startTime,
      workingArray,
      processedItems
    );
  }

  return result;
}

/**
 * Extract valid string items from mixed array
 * @param {Array} items - Mixed array of items
 * @returns {Object} Separated valid strings and invalid items
 */
function extractValidStrings(items) {
  const validStrings = [];
  const invalidItems = [];

  for (const item of items) {
    if (typeof item === "string" && item.trim()) {
      validStrings.push(item.trim());
    } else if (typeof item !== "string") {
      invalidItems.push({
        input: item,
        reason: `Expected string, got ${typeof item}`,
        type: "type_error",
      });
    } else if (!item.trim()) {
      invalidItems.push({
        input: item,
        reason: "Empty string not allowed",
        type: "empty_error",
      });
    }
  }

  return { validStrings, invalidItems };
}

/**
 * Deduplicate array and track statistics
 * @param {Array} items - Array to deduplicate
 * @returns {Object} Deduplicated array and duplicate count
 */
function deduplicateArray(items) {
  const seen = new Set();
  const deduplicated = [];
  let duplicateCount = 0;

  for (const item of items) {
    if (seen.has(item)) {
      duplicateCount++;
    } else {
      seen.add(item);
      deduplicated.push(item);
    }
  }

  return {
    deduplicated,
    duplicates: duplicateCount,
    uniqueCount: deduplicated.length,
  };
}

/**
 * Create standardized processing statistics
 * @param {number} startTime - Processing start time
 * @param {Array} originalInput - Original input array
 * @param {Array} processedOutput - Final processed array
 * @returns {Object} Processing statistics
 */
function createProcessingStats(startTime, originalInput, processedOutput) {
  const processingTime = now() - startTime;

  return {
    processingTime: Math.round(processingTime * 100) / 100,
    originalCount: originalInput.length,
    processedCount: processedOutput.length,
    reductionRatio:
      originalInput.length > 0
        ? (1 - processedOutput.length / originalInput.length).toFixed(3)
        : 0,
    itemsPerMs:
      processingTime > 0
        ? Math.round(processedOutput.length / processingTime)
        : processedOutput.length,
  };
}

/**
 * Specialized processor for HTML input
 * @param {string|Array} html - HTML string or array of HTML strings
 * @param {Object} options - Processing options
 * @returns {Object} HTML processing result
 */
export async function processHTMLInput(html, options = {}) {
  const { extractClasses = true } = options;

  // Convert single string to array
  const htmlArray = Array.isArray(html) ? html : [html];

  // Process as regular input first
  const baseResult = processInput(htmlArray, {
    expectArray: true,
    sanitize: false, // HTML content doesn't need CSS sanitization
    deduplicate: false, // Don't deduplicate HTML content
    includeStats: true,
    ...options,
  });

  // If class extraction is requested, extract classes from HTML
  if (extractClasses && baseResult.success) {
    try {
      // This would use your existing HTML extractor
      const { zyraExtractClassFromHTMLArray } = await import(
        "../parser/htmlExtractor.js"
      );
      const extractedClasses = zyraExtractClassFromHTMLArray(
        baseResult.processed
      );

      baseResult.extractedClasses = extractedClasses;
      baseResult.extractionStats = {
        htmlSources: baseResult.processed.length,
        extractedClasses: extractedClasses.length,
        uniqueClasses: [...new Set(extractedClasses)].length,
      };
    } catch (error) {
      baseResult.extractionError = error.message;
    }
  }

  return baseResult;
}
