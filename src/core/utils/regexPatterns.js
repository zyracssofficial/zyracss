/**
 * Centralized Regex Patterns for ZyraCSS
 * Eliminates duplicate regex definitions across the codebase
 * Single source of truth for all CSS validation patterns
 */

/**
 * Common CSS unit patterns
 */
export const CSS_UNIT_PATTERNS = {
  // Length units (consolidated from multiple files)
  LENGTH_UNITS: "px|em|rem|vh|vw|%|in|cm|mm|pt|pc|ex|ch|vmin|vmax|fr",

  // Angle units
  ANGLE_UNITS: "deg|grad|rad|turn",

  // Time units
  TIME_UNITS: "s|ms",

  // All units combined
  ALL_UNITS:
    "px|em|rem|vh|vw|%|in|cm|mm|pt|pc|ex|ch|vmin|vmax|fr|deg|grad|rad|turn|s|ms",
};

/**
 * Consolidated CSS value patterns
 */
export const CSS_VALUE_PATTERNS = {
  // Number patterns
  NUMBER: /^([+-]?\d*\.?\d+)$/,
  POSITIVE_NUMBER: /^(\d*\.?\d+)$/,
  INTEGER: /^([+-]?\d+)$/,

  // Length patterns (consolidated from 8+ duplicate definitions)
  LENGTH: new RegExp(`^-?[\\d.]+(?:${CSS_UNIT_PATTERNS.LENGTH_UNITS})?$`),
  LENGTH_WITH_ZERO: new RegExp(
    `^-?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:${CSS_UNIT_PATTERNS.LENGTH_UNITS})$|^0$`
  ),
  LENGTH_STRICT: new RegExp(
    `^([+-]?\\d*\\.?\\d+)(${CSS_UNIT_PATTERNS.LENGTH_UNITS})$`
  ),

  // Angle patterns
  ANGLE: new RegExp(`^-?[\\d.]+(?:${CSS_UNIT_PATTERNS.ANGLE_UNITS})?$`),

  // Color patterns (consolidated from multiple files)
  HEX_COLOR: /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i,

  // CSS function patterns
  RGB_MODERN:
    /^rgba?\(\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*(?:\/\s*(\d+(?:\.\d+)?|\d+(?:\.\d+)?%))?\s*\)$/,
  RGB_LEGACY:
    /^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)$/,
  HSL_MODERN:
    /^hsla?\(\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%\s*(?:\/\s*(\d+(?:\.\d+)?|\d+(?:\.\d+)?%))?\s*\)$/,
  HSL_LEGACY:
    /^hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)$/,

  // Modern color function patterns
  OKLCH_MODERN:
    /^oklch\(\s*(\d+(?:\.\d+)?%?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*(?:\/\s*(\d+(?:\.\d+)?|\d+(?:\.\d+)?%))?\s*\)$/,
  OKLAB_MODERN:
    /^oklab\(\s*(\d+(?:\.\d+)?%?)\s*[,\s]\s*([-+]?\d+(?:\.\d+)?)\s*[,\s]\s*([-+]?\d+(?:\.\d+)?)\s*(?:\/\s*(\d+(?:\.\d+)?|\d+(?:\.\d+)?%))?\s*\)$/,
  LAB_MODERN:
    /^lab\(\s*(\d+(?:\.\d+)?%?)\s*[,\s]\s*([-+]?\d+(?:\.\d+)?)\s*[,\s]\s*([-+]?\d+(?:\.\d+)?)\s*(?:\/\s*(\d+(?:\.\d+)?|\d+(?:\.\d+)?%))?\s*\)$/,
  LCH_MODERN:
    /^lch\(\s*(\d+(?:\.\d+)?%?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*(?:\/\s*(\d+(?:\.\d+)?|\d+(?:\.\d+)?%))?\s*\)$/,

  // CSS variable patterns
  CSS_VARIABLE: /^var\(\s*(--[a-zA-Z0-9-_]+)\s*(?:,\s*([^)]+))?\s*\)$/,
  CSS_VAR_NAME: /^--[\w-]+$/,
  CSS_VAR_SIMPLE: /^var\(--[\w-]+\)$/,

  // CSS function detection
  CSS_FUNCTION: /^([a-zA-Z-]+)\((.*)\)$/,

  // Calc expression patterns
  CALC_BASIC: /^[\d\s+\-*/.()%a-zA-Z-]+$/,

  // Class name patterns
  VALID_CLASS: /^[a-zA-Z][a-zA-Z0-9-]*(?:-\[[^\]]+\]|-[^ \t"'<>]+)?$/,

  // Zero value patterns
  ZERO_WITH_UNITS: new RegExp(`^0+(?:${CSS_UNIT_PATTERNS.LENGTH_UNITS})$`),
};

/**
 * Frequently used compiled regex patterns for performance
 */
export const COMPILED_PATTERNS = {
  // Most common patterns pre-compiled for performance
  isLength: CSS_VALUE_PATTERNS.LENGTH,
  isLengthWithZero: CSS_VALUE_PATTERNS.LENGTH_WITH_ZERO,
  isHexColor: CSS_VALUE_PATTERNS.HEX_COLOR,
  isCSSVariable: CSS_VALUE_PATTERNS.CSS_VARIABLE,
  isNumber: CSS_VALUE_PATTERNS.NUMBER,
  isAngle: CSS_VALUE_PATTERNS.ANGLE,
};

/**
 * Performance-optimized pattern testing
 */
export const PatternTester = {
  /**
   * Test if value is a CSS length (most common operation)
   * @param {string} value - Value to test
   * @returns {boolean} True if valid length
   */
  isLength(value) {
    return COMPILED_PATTERNS.isLength.test(value) || value === "0";
  },

  /**
   * Test if value is a CSS color
   * @param {string} value - Value to test
   * @returns {boolean} True if valid color
   */
  isColor(value) {
    const trimmed = value.trim().toLowerCase();
    return (
      COMPILED_PATTERNS.isHexColor.test(trimmed) ||
      CSS_VALUE_PATTERNS.RGB_MODERN.test(trimmed) ||
      CSS_VALUE_PATTERNS.RGB_LEGACY.test(trimmed) ||
      CSS_VALUE_PATTERNS.HSL_MODERN.test(trimmed) ||
      CSS_VALUE_PATTERNS.HSL_LEGACY.test(trimmed) ||
      CSS_VALUE_PATTERNS.OKLCH_MODERN.test(trimmed) ||
      CSS_VALUE_PATTERNS.OKLAB_MODERN.test(trimmed) ||
      CSS_VALUE_PATTERNS.LAB_MODERN.test(trimmed) ||
      CSS_VALUE_PATTERNS.LCH_MODERN.test(trimmed)
    );
  },

  /**
   * Test if value is a CSS function
   * @param {string} value - Value to test
   * @returns {boolean} True if valid function
   */
  isFunction(value) {
    return CSS_VALUE_PATTERNS.CSS_FUNCTION.test(value);
  },

  /**
   * Test if value is a CSS variable
   * @param {string} value - Value to test
   * @returns {boolean} True if valid CSS variable
   */
  isVariable(value) {
    return COMPILED_PATTERNS.isCSSVariable.test(value);
  },
};

/**
 * Export commonly used patterns for backward compatibility
 */
