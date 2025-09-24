/**
 * Main API - Modularized and streamlined
 * Core CSS generation functionality with improved modularity
 */

// Import modular components
import { validateGenerateInput } from "../validators/inputValidator.js";
import {
  processClassesInput,
  collectAllClasses,
} from "../processors/classCollector.js";
import { performSecurityValidation } from "../validators/securityValidator.js";
import {
  zyraGenerateCSSFromValidatedClasses,
  compileFinalResult,
} from "./cssOrchestrator.js";

import { createTimer } from "../../core/utils/essential.js";
import { ZyraResult, ErrorFactory } from "../../core/errors/essential.js";

/**
 * Generate CSS from classes or HTML strings
 * @param {string|string[]} input - Single or multiple CSS classes, or HTML string
 * @param {Object} options - Configuration options
 * @returns {ZyraResult} Result with CSS and metadata
 */
export function zyraGenerateCSS(input, options = {}) {
  const timer = createTimer("zyraGenerateCSS").start();

  try {
    // Step 1: Validate input parameters
    const validatedInput = validateGenerateInput(input, options);
    if (!validatedInput.success) {
      return validatedInput; // Return validation error as ZyraResult
    }

    // Step 2: Process input based on type (direct array, direct string, or structured object)
    let classesResult = { processed: [] };
    let htmlToProcess = [];

    if (Array.isArray(validatedInput.data.input)) {
      // Direct classes array
      classesResult = processClassesInput(validatedInput.data.input);
    } else if (typeof validatedInput.data.input === "string") {
      // Direct HTML string
      htmlToProcess = [validatedInput.data.input];
    } else {
      // Structured object: {classes: [...], html: [...]}
      const { classes, html } = validatedInput.data.input;

      if (classes && Array.isArray(classes)) {
        classesResult = processClassesInput(classes);
      }

      if (html) {
        htmlToProcess = Array.isArray(html) ? html : [html];
      }
    }

    // Step 3: Collect all classes from various sources
    const allClassesResult = collectAllClasses(
      classesResult.processed || [],
      htmlToProcess
    );
    if (!allClassesResult.success) {
      return allClassesResult; // Return collection error as ZyraResult
    }

    // Step 4: Perform security validation
    const securityResult = performSecurityValidation(
      allClassesResult.data.allClasses
    );
    if (!securityResult.success) {
      return securityResult; // Return security error as ZyraResult
    }

    // Step 5: Generate CSS from validated classes
    const cssResult = zyraGenerateCSSFromValidatedClasses(
      securityResult.data.validClasses,
      validatedInput.data.options,
      timer
    );
    if (!cssResult.success) {
      return cssResult; // Return generation error as ZyraResult
    }

    // Step 6: Compile final result with metadata
    const parseErrors = cssResult.data.parseErrors || [];
    const securityIssues = securityResult.data.securityIssues || [];
    const extractionStats = allClassesResult.data.extractionStats || {};
    const processingTime = timer.stop();

    const finalResult = compileFinalResult(
      cssResult.data,
      parseErrors,
      securityIssues,
      extractionStats,
      processingTime
    );

    return ZyraResult.success(finalResult);
  } catch (error) {
    return ZyraResult.error(
      ErrorFactory.generationFailed(error.message, {
        input: typeof input,
        totalTime: timer.stop(),
      })
    );
  }
}

/**
 * Generate CSS from classes array (simplified interface)
 * @param {string[]} classes - Array of CSS classes
 * @param {Object} options - Configuration options
 * @returns {ZyraResult} Result with CSS and metadata
 */
export async function zyraGenerateCSSFromClasses(classes, options = {}) {
  // Quick validation - main function handles detailed validation
  if (!Array.isArray(classes)) {
    return ZyraResult.error(
      ErrorFactory.invalidInput(
        classes,
        "Classes must be provided as an array",
        [
          "Wrap single classes in an array: ['p-[2rem]']",
          "Example: ['p-[2rem]', 'm-[1rem]']",
        ]
      )
    );
  }

  return zyraGenerateCSS(classes, options);
}

/**
 * Generate CSS from HTML string (simplified interface)
 * @param {string} html - HTML string to extract classes from
 * @param {Object} options - Configuration options
 * @returns {ZyraResult} Result with CSS and metadata
 */
export async function zyraGenerateCSSFromHTML(html, options = {}) {
  if (typeof html !== "string") {
    return ZyraResult.error(
      ErrorFactory.invalidInput(html, "HTML must be provided as a string", [
        "Provide a valid HTML string",
        "Example: '<div class=\"m-4 p-2\">Content</div>'",
      ])
    );
  }

  return zyraGenerateCSS({ html: [html], classes: [] }, options);
}
