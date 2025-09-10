/**
import { 
  isStyleWidth,
  isBorderStyle, 
  isStyleColor,
  validateStylePart
} from "../../utilities/styleValidation.js";der Shorthand Validation Helpers
 * Helper functions for validating border shorthand properties according to CSS specification
 */

import {
  isStyleWidth,
  isBorderStyle,
  isStyleColor,
  validateStylePart,
} from "../../utilities/styleValidation.js";

// Re-export with border-specific names for backward compatibility
export const isBorderWidth = isStyleWidth;
export { isBorderStyle };
export const isBorderColor = (value) => isStyleColor(value, "border");

/**
 * Validate a single part of border shorthand and determine its type
 *
 * @param {string} part - Single part like "2px", "solid", or "#red"
 * @returns {Object} Validation result
 */
export function validateBorderPart(part) {
  return validateStylePart(part, "border");
}
