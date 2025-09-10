/**
 * Dynamic Property Type Detection for ZyraCSS
 * Generates property types from existing property maps instead of hardcoding them
 */

import { PROPERTY_MAP } from "../maps/index.js";

/**
 * Properties that commonly accept shorthand syntax (multiple space-separated values)
 */
const SHORTHAND_PROPERTIES = new Set([
  // Spacing shorthand
  "padding",
  "margin",
  // Border shorthand
  "border-width",
  "border-style",
  "border-color",
  "border-radius",
  // Background shorthand
  "background-position",
  "background-size",
  // Flexbox shorthand
  "flex",
  // Grid shorthand
  "grid-area",
  "grid-column",
  "grid-row",
  // Text shorthand
  "text-decoration",
  // Transform origin
  "transform-origin",
  // Transition shorthand
  "transition",
  // Animation shorthand
  "animation",
]);

/**
 * Check if a property accepts shorthand syntax
 * @param {string} property - CSS property name
 * @returns {boolean} True if property accepts shorthand values
 */
export function acceptsShorthand(property) {
  return SHORTHAND_PROPERTIES.has(property);
}

/**
 * CSS property type patterns for categorization
 */
const PROPERTY_TYPE_PATTERNS = {
  LENGTH: {
    // Properties that accept length values (px, em, rem, %, etc.)
    suffixes: [
      "-width",
      "-height",
      "-top",
      "-right",
      "-bottom",
      "-left",
      "-size",
      "-spacing",
      "-radius",
    ],
    prefixes: [
      "padding",
      "margin",
      "border",
      "gap",
      "top",
      "right",
      "bottom",
      "left",
    ],
    exact: [
      "width",
      "height",
      "min-width",
      "max-width",
      "min-height",
      "max-height",
      "font-size",
      "line-height",
      "letter-spacing",
      "word-spacing",
      "text-indent",
    ],
  },

  COLOR: {
    // Properties that accept color values
    suffixes: ["-color"],
    prefixes: ["color", "background-color", "border-color"],
    exact: [
      "color",
      "background-color",
      "border-color",
      "outline-color",
      "text-decoration-color",
    ],
  },

  NUMBER: {
    // Properties that accept numeric values without units
    exact: [
      "opacity",
      "z-index",
      "flex-grow",
      "flex-shrink",
      "order",
      "font-weight",
      "line-height",
      "zoom",
      "tab-size",
      "column-count",
    ],
  },

  KEYWORD: {
    // Properties that primarily accept keyword values
    exact: [
      "display",
      "position",
      "float",
      "clear",
      "overflow",
      "overflow-x",
      "overflow-y",
      "text-align",
      "font-style",
      "text-decoration",
      "text-transform",
      "white-space",
      "vertical-align",
      "visibility",
      "cursor",
      "pointer-events",
      "user-select",
    ],
  },

  COMPLEX: {
    // Properties that accept complex values (functions, multiple values, etc.)
    exact: [
      "transform",
      "box-shadow",
      "text-shadow",
      "background",
      "border",
      "transition",
      "animation",
      "filter",
      "backdrop-filter",
      "clip-path",
      "mask",
    ],
  },
};

/**
 * Dynamically determine property type based on property name
 * @param {string} property - CSS property name
 * @returns {string} Property type (LENGTH, COLOR, NUMBER, KEYWORD, COMPLEX)
 */
function determinePropertyType(property) {
  // Check exact matches first (most specific)
  for (const [type, patterns] of Object.entries(PROPERTY_TYPE_PATTERNS)) {
    if (patterns.exact && patterns.exact.includes(property)) {
      return type;
    }
  }

  // Check suffix patterns
  for (const [type, patterns] of Object.entries(PROPERTY_TYPE_PATTERNS)) {
    if (patterns.suffixes) {
      for (const suffix of patterns.suffixes) {
        if (property.endsWith(suffix)) {
          return type;
        }
      }
    }
  }

  // Check prefix patterns
  for (const [type, patterns] of Object.entries(PROPERTY_TYPE_PATTERNS)) {
    if (patterns.prefixes) {
      for (const prefix of patterns.prefixes) {
        if (property.startsWith(prefix)) {
          return type;
        }
      }
    }
  }

  // Default to KEYWORD for unknown properties
  return "KEYWORD";
}

/**
 * Generate property types dynamically from property maps
 * @returns {Object} Property mappings organized by type
 */
export function generatePropertyTypes() {
  const propertyTypes = {
    LENGTH: [],
    COLOR: [],
    NUMBER: [],
    KEYWORD: [],
    COMPLEX: [],
  };

  // Get all unique CSS properties from the property map
  const allProperties = new Set(PROPERTY_MAP.values());

  // Categorize each property
  for (const property of allProperties) {
    const type = determinePropertyType(property);
    if (propertyTypes[type]) {
      propertyTypes[type].push(property);
    }
  }

  return propertyTypes;
}

/**
 * Create a property type cache for fast lookups
 * @returns {Map} Map of property -> type
 */
export function createPropertyTypeCache() {
  const cache = new Map();
  const propertyTypes = generatePropertyTypes();

  for (const [type, properties] of Object.entries(propertyTypes)) {
    for (const property of properties) {
      cache.set(property, type);
    }
  }

  return cache;
}

/**
 * Get property type for a specific property
 * @param {string} property - CSS property name
 * @param {Map} cache - Optional pre-built cache
 * @returns {string} Property type
 */
export function getPropertyType(property, cache = null) {
  if (cache && cache.has(property)) {
    return cache.get(property);
  }

  return determinePropertyType(property);
}
