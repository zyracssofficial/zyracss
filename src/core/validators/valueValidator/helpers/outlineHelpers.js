/**
import { 
  isStyleWidth,
  isOutlineStyle, 
  isStyleColor,
  validateStylePart
} from "../../utilities/styleValidation.js";line Shorthand Validation Helpers
 * Helper functions for validating outline shorthand properties according to CSS specification
 */

import {
  isStyleWidth,
  isOutlineStyle,
  isStyleColor,
  validateStylePart,
} from "../../utilities/styleValidation.js";

// Re-export with outline-specific names for backward compatibility
export const isOutlineWidth = isStyleWidth;
export { isOutlineStyle };
export const isOutlineColor = (value) => isStyleColor(value, "outline");

/**
 * Validate a single part of outline shorthand and determine its type
 *
 * @param {string} part - Single part like "2px", "solid", or "#red"
 * @returns {Object} Validation result
 */
export function validateOutlinePart(part) {
  return validateStylePart(part, "outline");
}
