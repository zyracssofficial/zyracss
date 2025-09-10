/**
 * Modifier Validation Functions - Modular Architecture
 * Exports all modifier validators from specialized modules
 */

import { splitOnColons } from "../../../utils/parsing.js";

// Import all functions from specialized modules
import {
  validatePseudoClass,
  getSupportedPseudoClasses,
} from "./pseudoClasses.js";

import {
  validatePseudoElement,
  getSupportedPseudoElements,
} from "./pseudoElements.js";

import {
  validateResponsiveModifier,
  validateMediaQueryModifier,
  getSupportedResponsiveModifiers,
  getSupportedMediaQueryModifiers,
} from "./responsive.js";

/**
 * Parse modifiers from a class name or modifier string
 * Legacy function for compatibility
 */
export function parseModifiers(input) {
  if (!input || typeof input !== "string") {
    return {
      modifiers: [],
      className: input || "",
    };
  }

  // Smart colon splitting that respects brackets
  const parts = splitOnColons(input);

  if (parts.length === 1) {
    // No modifiers, just the class name
    return {
      modifiers: [],
      className: parts[0],
    };
  }

  // Last part is the class name, everything else are modifiers
  const className = parts.pop();
  const modifiers = [];

  for (const modifier of parts) {
    const result = validateModifier(modifier, "auto");
    if (result.isValid) {
      modifiers.push({
        name: modifier,
        type: result.type,
        isValid: true,
      });
    } else {
      modifiers.push({
        name: modifier,
        type: "unknown",
        isValid: false,
      });
    }
  }

  return {
    modifiers,
    className,
  };
}

/**
 * Main modifier validation function
 * Determines modifier type and validates accordingly
 */
export function validateModifier(modifier, type = "auto") {
  if (!modifier || typeof modifier !== "string") {
    return { isValid: false, type: "unknown", modifier: modifier || "" };
  }

  const cleanModifier = modifier.trim().toLowerCase();

  // Auto-detect modifier type if not specified
  if (type === "auto") {
    // Try pseudo-class first
    if (validatePseudoClass(cleanModifier)) {
      return { isValid: true, type: "pseudo-class", modifier: cleanModifier };
    }

    // Try pseudo-element
    if (validatePseudoElement(cleanModifier)) {
      return { isValid: true, type: "pseudo-element", modifier: cleanModifier };
    }

    // Try responsive
    if (validateResponsiveModifier(cleanModifier)) {
      return { isValid: true, type: "responsive", modifier: cleanModifier };
    }

    // Try media query
    if (validateMediaQueryModifier(cleanModifier)) {
      return { isValid: true, type: "media-query", modifier: cleanModifier };
    }

    return { isValid: false, type: "unknown", modifier: cleanModifier };
  }

  // Validate specific type
  switch (type) {
    case "pseudo-class":
      return {
        isValid: validatePseudoClass(cleanModifier),
        type: "pseudo-class",
        modifier: cleanModifier,
      };
    case "pseudo-element":
      return {
        isValid: validatePseudoElement(cleanModifier),
        type: "pseudo-element",
        modifier: cleanModifier,
      };
    case "responsive":
      return {
        isValid: validateResponsiveModifier(cleanModifier),
        type: "responsive",
        modifier: cleanModifier,
      };
    case "media-query":
      return {
        isValid: validateMediaQueryModifier(cleanModifier),
        type: "media-query",
        modifier: cleanModifier,
      };
    default:
      return { isValid: false, type: "unknown", modifier: cleanModifier };
  }
}

/**
 * Get all supported modifiers grouped by type
 */
export function getAllSupportedModifiers() {
  return {
    pseudoClasses: getSupportedPseudoClasses(),
    pseudoElements: getSupportedPseudoElements(),
    responsive: getSupportedResponsiveModifiers(),
    mediaQuery: getSupportedMediaQueryModifiers(),
  };
}

// Re-export all imported functions
export {
  validatePseudoClass,
  getSupportedPseudoClasses,
  validatePseudoElement,
  getSupportedPseudoElements,
  validateResponsiveModifier,
  validateMediaQueryModifier,
  getSupportedResponsiveModifiers,
  getSupportedMediaQueryModifiers,
};
