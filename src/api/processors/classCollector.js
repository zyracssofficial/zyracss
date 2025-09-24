/**
 * Class collection module for zyraGenerateCSS API
 * Handles collecting and processing classes from various sources
 */

import { zyraExtractClassFromHTMLArray } from "../../core/parser/htmlExtractor.js";
import { processInput } from "../../core/utils/inputProcessor.js";
import { ZyraResult, ErrorFactory } from "../../core/errors/essential.js";

/**
 * Process classes input using inputProcessor utility
 * @param {Array} classes - Raw classes array
 * @returns {Object} Processing result
 */
export function processClassesInput(classes = []) {
  return processInput(classes, {
    expectArray: true,
    sanitize: false, // We'll do security validation separately
    deduplicate: true,
    includeStats: true,
  });
}

/**
 * Process HTML input using inputProcessor utility
 * @param {Array} html - Raw HTML strings array
 * @returns {Object} Processing result
 */
export function processHTMLInput(html = []) {
  if (!html || html.length === 0) {
    return { processed: [], stats: null };
  }

  return processInput(html, {
    expectArray: true,
    sanitize: false,
    deduplicate: false,
    includeStats: true,
  });
}

/**
 * Collect all classes from processed inputs
 * @param {Array} processedClasses - Processed class array
 * @param {Array} processedHTML - Processed HTML strings
 * @returns {ZyraResult} Result with collected classes
 */
export function collectAllClasses(processedClasses, processedHTML) {
  try {
    const allClasses = [...processedClasses];
    let extractedCount = 0;

    // Extract classes from HTML if provided
    if (processedHTML && processedHTML.length > 0) {
      const extractedClasses = zyraExtractClassFromHTMLArray(processedHTML);

      // Keep original class names - encoding will happen during CSS generation
      // This allows HTML to use natural syntax: background-image-[u(https://...)]
      allClasses.push(...extractedClasses);
      extractedCount = extractedClasses.length;
    }

    return ZyraResult.success({
      allClasses,
      extractionStats: {
        directClasses: processedClasses.length,
        extractedClasses: extractedCount,
        totalClasses: allClasses.length,
      },
    });
  } catch (error) {
    return ZyraResult.error(
      ErrorFactory.parsingFailed("Class collection process", error.message)
    );
  }
}

/**
 * Create extraction statistics summary
 * @param {number} directClasses - Number of directly provided classes
 * @param {number} extractedClasses - Number of classes extracted from HTML
 * @returns {Object} Statistics object
 */
export function createExtractionStats(directClasses, extractedClasses) {
  return {
    directClasses,
    extractedClasses,
    totalClasses: directClasses + extractedClasses,
  };
}
