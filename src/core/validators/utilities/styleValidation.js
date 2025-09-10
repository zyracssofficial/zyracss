/**
 * Shared Style Validation Utilities
 * Common validation logic for border, outline, and similar CSS properties
 */

import { isCSSLength, isCSSColor } from "../../utils/index.js";
import { isString } from "../../utils/essential.js";
import {
  CSS_BORDER_STYLES,
  CSS_OUTLINE_STYLES,
  CSS_WIDTH_KEYWORDS,
} from "../constants/cssStyles.js";

/**
 * Check if value is a valid width (border-width, outline-width, etc.)
 * Width can be:
 * - A length value (0 or positive)
 * - A keyword: thin, medium, thick
 *
 * @param {string} value - Value to check
 * @returns {boolean} True if valid width
 */
export function isStyleWidth(value) {
  if (!isString(value)) {
    return false;
  }

  const trimmed = value.toLowerCase().trim();

  // Check keywords first
  if (CSS_WIDTH_KEYWORDS.includes(trimmed)) {
    return true;
  }

  // Check if it's a valid length (must be non-negative)
  if (isCSSLength(value)) {
    // Special case: "0" is always valid
    if (trimmed === "0") {
      return true;
    }

    // Extract numeric part to check if it's non-negative
    const numericMatch = value.match(/^([+-]?\d*\.?\d+)/);
    if (numericMatch) {
      const numericValue = parseFloat(numericMatch[1]);
      return numericValue >= 0;
    }
  }

  return false;
}

/**
 * Check if value is a valid border style
 *
 * @param {string} value - Value to check
 * @returns {boolean} True if valid border style
 */
export function isBorderStyle(value) {
  if (!isString(value)) {
    return false;
  }

  const trimmed = value.toLowerCase().trim();

  return CSS_BORDER_STYLES.includes(trimmed);
}

/**
 * Check if value is a valid outline style
 *
 * @param {string} value - Value to check
 * @returns {boolean} True if valid outline style
 */
export function isOutlineStyle(value) {
  if (!isString(value)) {
    return false;
  }

  const trimmed = value.toLowerCase().trim();

  return CSS_OUTLINE_STYLES.includes(trimmed);
}

/**
 * Check if value is a valid color for border/outline properties
 * Color can be any valid CSS color, CSS variables, or special keywords
 *
 * @param {string} value - Value to check
 * @param {string} type - 'border' or 'outline' for type-specific validation
 * @returns {boolean} True if valid color
 */
export function isStyleColor(value, type = "border") {
  if (!isString(value)) {
    return false;
  }

  const trimmed = value.toLowerCase().trim();

  // Special color keywords
  if (trimmed === "currentcolor" || trimmed === "transparent") {
    return true;
  }

  // Outline-specific color keyword
  if (type === "outline" && trimmed === "invert") {
    return true;
  }

  // Use the CSS color validator (excludes CSS variables - handled elsewhere)
  return isCSSColor(value);
}

/**
 * Validate a border/outline part and determine its type
 *
 * @param {string} part - Single part of border/outline shorthand
 * @param {string} type - 'border' or 'outline' for style-specific validation
 * @returns {Object} Validation result with type and validity
 */
export function validateStylePart(part, type = "border") {
  if (!part || typeof part !== "string") {
    return { isValid: false, type: null, reason: "Empty or invalid part" };
  }

  const trimmed = part.trim();

  // Handle CSS variables as their own type - they can represent any component
  if (trimmed.startsWith("var(") && trimmed.endsWith(")")) {
    return { isValid: true, type: "css-variable", value: trimmed };
  }

  // Try width first (excluding CSS variables already handled above)
  if (isStyleWidth(trimmed)) {
    return { isValid: true, type: "width", value: trimmed };
  }

  // Try style
  const isValidStyle =
    type === "outline" ? isOutlineStyle(trimmed) : isBorderStyle(trimmed);
  if (isValidStyle) {
    return { isValid: true, type: "style", value: trimmed };
  }

  // Try color
  if (isStyleColor(trimmed, type)) {
    return { isValid: true, type: "color", value: trimmed };
  }

  return {
    isValid: false,
    type: null,
    reason: `Invalid ${type} value: "${trimmed}" is not a valid width, style, or color`,
  };
}
