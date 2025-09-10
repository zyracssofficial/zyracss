/**
 * Properties Index
 * Consolidates all property validation rules from individual modules
 */

import { ANIMATION_PROPERTIES } from "./animation.js";
import { BORDER_PROPERTIES } from "./borders.js";
import { COLOR_PROPERTIES } from "./color.js";
import { EFFECTS_PROPERTIES } from "./effects.js";
import { INTERACTIVE_PROPERTIES } from "./interactive.js";
import { LAYOUT_PROPERTIES } from "./layout.js";
import { OVERFLOW_PROPERTIES } from "./overflow.js";
import { PRINT_PROPERTIES } from "./print.js";
import { SIZING_PROPERTIES } from "./sizing.js";
import { SPACING_PROPERTIES } from "./spacing.js";
import { TRANSFORM_PROPERTIES } from "./transform.js";
import { TYPOGRAPHY_PROPERTIES } from "./typography.js";

/**
 * Combined property validation rules
 * Organized by categories matching CSS_PROPERTIES_REFERENCE.md
 * Properties are sorted alphabetically within each category
 */
export const PROPERTY_VALIDATION_RULES = {
  ...ANIMATION_PROPERTIES,
  ...BORDER_PROPERTIES,
  ...COLOR_PROPERTIES,
  ...EFFECTS_PROPERTIES,
  ...INTERACTIVE_PROPERTIES,
  ...LAYOUT_PROPERTIES,
  ...OVERFLOW_PROPERTIES,
  ...PRINT_PROPERTIES,
  ...SIZING_PROPERTIES,
  ...SPACING_PROPERTIES,
  ...TRANSFORM_PROPERTIES,
  ...TYPOGRAPHY_PROPERTIES,
};

/**
 * Property categories for easy access and organization
 */
export const PROPERTY_CATEGORIES = {
  ANIMATION: ANIMATION_PROPERTIES,
  BORDERS: BORDER_PROPERTIES,
  COLOR: COLOR_PROPERTIES,
  EFFECTS: EFFECTS_PROPERTIES,
  INTERACTIVE: INTERACTIVE_PROPERTIES,
  LAYOUT: LAYOUT_PROPERTIES,
  OVERFLOW: OVERFLOW_PROPERTIES,
  PRINT: PRINT_PROPERTIES,
  SIZING: SIZING_PROPERTIES,
  SPACING: SPACING_PROPERTIES,
  TRANSFORM: TRANSFORM_PROPERTIES,
  TYPOGRAPHY: TYPOGRAPHY_PROPERTIES,
};

/**
 * Get property validation rules for a specific property
 * @param {string} property - CSS property name
 * @returns {Object|null} Property validation rules or null if not found
 */
export function getPropertyRules(property) {
  return PROPERTY_VALIDATION_RULES[property] || null;
}

/**
 * Get all properties in a specific category
 * @param {string} category - Category name (ANIMATION, BORDERS, etc.)
 * @returns {Object|null} Category properties or null if not found
 */
export function getCategoryProperties(category) {
  return PROPERTY_CATEGORIES[category] || null;
}

/**
 * Check if a property is supported
 * @param {string} property - CSS property name
 * @returns {boolean} True if property is supported
 */
export function isKnownProperty(property) {
  return property in PROPERTY_VALIDATION_RULES;
}

/**
 * Get all supported property names
 * @returns {string[]} Array of all supported property names
 */
export function getAllPropertyNames() {
  return Object.keys(PROPERTY_VALIDATION_RULES);
}

/**
 * Get property count by category
 * @returns {Object} Object with category names and property counts
 */
export function getPropertyCountByCategory() {
  return Object.entries(PROPERTY_CATEGORIES).reduce(
    (counts, [category, properties]) => {
      counts[category] = Object.keys(properties).length;
      return counts;
    },
    {}
  );
}
