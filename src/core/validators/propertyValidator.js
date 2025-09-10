/**
 * CSS property validation logic
 * Validates CSS property names
 */

import { PROPERTY_MAP } from "../maps/index.js";

/**
 * Validate if a CSS property is supported
 * @param {string} property - CSS property name to validate
 * @returns {boolean} True if property is supported
 */
export function isSupportedProperty(property) {
  if (!property || typeof property !== "string") {
    return false;
  }

  // Get all values from property map
  const supportedProperties = new Set(PROPERTY_MAP.values());
  return supportedProperties.has(property);
}
