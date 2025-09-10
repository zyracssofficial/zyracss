/**
 * Common security validation functions
 * Shared validators used across the application
 */

import { detectDangerousPatterns } from "./patternDetector.js";

/**
 * Smart security validation for class names with Unicode support
 * Validates property prefixes (ASCII-only) and values (Unicode allowed in quotes) separately
 * @param {string} className - The class name to validate
 * @returns {Object} Security validation result
 */
export function validateClassNameSecurity(className) {
  // First check for basic dangerous patterns
  const basicCheck = detectDangerousPatterns(className);

  // If no dangerous patterns found, allow it
  if (!basicCheck.isDangerous) {
    return basicCheck;
  }

  // If dangerous patterns found, check if they're just Unicode in appropriate contexts
  const filteredPatterns = basicCheck.matchedPatterns.filter((pattern) => {
    // Allow script_mixing for legitimate content/font properties with quoted Unicode
    if (pattern.name === "script_mixing") {
      // Check if this is a content or font-family property with quoted value
      const contentOrFontPattern = /^(content|font-family)-\[["'][^"']*["']\]$/;
      return !contentOrFontPattern.test(className);
    }

    // Keep all other security patterns
    return true;
  });

  if (filteredPatterns.length === 0) {
    return {
      isDangerous: false,
      matchedPatterns: [],
      riskLevel: "none",
      inputLength: className.length,
    };
  }

  return {
    isDangerous: true,
    matchedPatterns: filteredPatterns,
    riskLevel: basicCheck.riskLevel,
    inputLength: className.length,
  };
}
