/**
 * CSS rule generation logic with dynamic property types
 * Fixes hardcoded property types and improves value validation with safe regex execution
 * Includes URL escaping support for secure CSS generation
 */

import { createLogger } from "../utils/helpers.js";

const logger = createLogger("CssGenerator");

import {
  normalizeCSSValue,
  isCSSColor,
  formatFontFamilyFromArray,
} from "../utils/cssUtils.js";
import { syncSafeRegexTest, REGEX_TIMEOUTS } from "../security/safeRegex.js";
import {
  createPropertyTypeCache,
  getPropertyType,
  acceptsShorthand,
} from "../utils/propertyTypeDetector.js";
import { globalCSSFunctionValidator } from "../utils/cssFunctionValidator.js";
import { CSS_VALUE_PATTERNS, PatternTester } from "../utils/regexPatterns.js";
import { validateValue } from "../validators/valueValidator/index.js";

/**
 * Dynamic CSS property type detection based on property maps
 * Replaces hardcoded property types with dynamic generation from property maps
 */

// Create property type cache at module level for performance
const propertyTypeCache = createPropertyTypeCache();

/**
 * CSS function validation now handled by centralized validator
 * @see src/core/utils/cssFunctionValidator.js
 */

// Use the global centralized CSS function validator
const functionValidator = globalCSSFunctionValidator;

/**
 * Enhanced CSS rule generation with proper validation
 * @param {Object} parsedClass - Parsed class object with property and value
 * @param {Object} options - Generation options
 * @returns {Object|null} Enhanced CSS rule object or null if invalid
 */
export function zyraGenerateCSSRule(parsedClass, options = {}) {
  const {
    className,
    prefix,
    property,
    value,
    rawValue,
    selector,
    responsive,
    pseudoClass,
    important = false,
    values, // Add values array from parsed class
  } = parsedClass;

  // Validate required fields
  if (!property || !value || !selector) {
    return null;
  }

  // Cache property type lookup (single call per rule)
  const propertyType = getPropertyType(property, propertyTypeCache);

  try {
    // For font-family, use the original values array to preserve comma separation
    let processedValue;
    if (property === "font-family" && values && values.length > 0) {
      processedValue = formatFontFamilyFromArray(values);
    } else if (property === "font") {
      // For font shorthand, use the validator to get the properly transformed value
      const validationResult = validateValue(value, property, options);
      if (validationResult.isValid) {
        processedValue = validationResult.value;
      } else {
        return null;
      }
    } else if (
      property === "border" ||
      (property.startsWith("border-") &&
        (property.endsWith("-border") ||
          property === "border-block" ||
          property === "border-inline" ||
          property === "border-top" ||
          property === "border-right" ||
          property === "border-bottom" ||
          property === "border-left" ||
          property === "border-block-start" ||
          property === "border-block-end" ||
          property === "border-inline-start" ||
          property === "border-inline-end"))
    ) {
      // For border shorthand properties, use the validator to convert comma-separated to space-separated
      const validationResult = validateValue(value, property, {
        ...options,
        context: { property },
      });
      if (validationResult.isValid) {
        processedValue = validationResult.value;
      } else {
        return null;
      }
    } else if (property === "outline") {
      // For outline shorthand, use the validator to convert comma-separated to space-separated
      const validationResult = validateValue(value, property, {
        ...options,
        context: { property },
      });
      if (validationResult.isValid) {
        processedValue = validationResult.value;
      } else {
        return null;
      }
    } else {
      // Optimized: For simple cases, use fast path processing
      // Complex properties still get full validation
      if (isSimpleCase(value, propertyType)) {
        processedValue = fastProcessValue(value, propertyType);
      } else {
        processedValue = processCSSValue(
          value,
          property,
          propertyType,
          options
        );
      }
    }

    if (!processedValue) {
      return null;
    }

    // Generate CSS declarations
    const declarations = generateDeclarations(
      property,
      processedValue,
      important
    );

    // Create the complete CSS rule
    const rule = {
      selector: generateCompleteSelector(selector, responsive, pseudoClass),
      declarations,
      className,
      property,
      value: processedValue,
      rawValue,
      priority: calculateSpecificity(selector, responsive, pseudoClass),
      declarationString: formatDeclarations(declarations),
      metadata: {
        prefix,
        responsive,
        pseudoClass,
        important,
        type: propertyType,
      },
    };

    return rule;
  } catch (error) {
    // Log error for debugging but don't throw - graceful degradation
    logger.warn(`CSS generation failed for ${className}: ${error.message}`);
    return null;
  }
}

/**
 * Enhanced CSS value processing with proper function validation
 * @param {string} value - Raw CSS value
 * @param {string} property - CSS property name
 * @param {string} propertyType - Pre-computed property type
 * @param {Object} options - Processing options
 * @returns {string|null} Processed CSS value or null if invalid
 */
function processCSSValue(value, property, propertyType, options = {}) {
  const { strict = false } = options;

  // Normalize the value first
  const normalized = normalizeCSSValue(value);
  if (!normalized) {
    return null;
  }

  // Check for CSS functions first (they can appear in any property type)
  if (normalized.includes("(") && normalized.includes(")")) {
    const functionMatch = normalized.match(/^([a-zA-Z-]+\([^)]*\))(.*)$/);
    if (functionMatch) {
      const [, functionCall, remainder] = functionMatch;

      if (!functionValidator.validateFunction(functionCall)) {
        return strict ? null : normalized; // Be permissive in non-strict mode
      }

      // If there's remainder, validate it too
      if (remainder.trim()) {
        // Handle multiple functions or mixed values
        const remainderValid = processCSSValue(
          remainder.trim(),
          property,
          propertyType,
          options
        );
        if (!remainderValid) {
          return strict ? null : normalized;
        }
      }

      return normalized;
    }
  }

  // Use pre-computed property type instead of lookup
  switch (propertyType) {
    case "LENGTH":
      return processLengthValue(normalized, property, strict);

    case "COLOR":
      return processColorValue(normalized, strict);

    case "NUMBER":
      return processNumberValue(normalized, strict);

    case "KEYWORD":
      return processKeywordValue(normalized, property, strict);

    case "COMPLEX":
      return processComplexValue(normalized, property, strict);

    default:
      // For unknown properties, do basic safety validation
      return processFallbackValue(normalized, strict);
  }
}

/**
 * Enhanced length value processing with shorthand support
 */
function processLengthValue(value, property, strict = false) {
  // CSS custom properties
  if (value.startsWith("var(")) {
    return value; // Already validated by function validator
  }

  // Multiple values (shorthand properties)
  if (value.includes(" ") && acceptsShorthand(property)) {
    return processShorthandLength(value, strict);
  }

  // Single length value - use centralized pattern
  if (PatternTester.isLength(value)) {
    return value;
  }

  // Allow keywords for length properties
  const lengthKeywords = [
    "auto",
    "inherit",
    "initial",
    "unset",
    "revert",
    "min-content",
    "max-content",
    "fit-content",
  ];

  if (lengthKeywords.includes(value)) {
    return value;
  }

  return strict ? null : value;
}

/**
 * Enhanced color value processing
 */
function processColorValue(value, strict = false) {
  // CSS custom properties
  if (PatternTester.isVariable(value)) {
    return value; // Already validated by function validator
  }

  // Hex colors - use centralized pattern
  if (PatternTester.isColor(value)) {
    return value.toLowerCase();
  }

  // Function colors (rgb, hsl, etc.) - already validated by function validator
  if (value.includes("(") && value.includes(")")) {
    return value;
  }

  // Named colors and keywords - use centralized function
  if (isCSSColor(value)) {
    return value.toLowerCase();
  }

  return strict ? null : value;
}

/**
 * Process numeric values
 */
function processNumberValue(value, strict = false) {
  // CSS custom properties
  if (value.startsWith("var(")) {
    return value;
  }

  // Pure numbers - use centralized pattern
  if (CSS_VALUE_PATTERNS.NUMBER.test(value)) {
    return value;
  }

  // Keywords
  const numberKeywords = ["auto", "inherit", "initial", "unset", "revert"];
  if (numberKeywords.includes(value)) {
    return value;
  }

  return strict ? null : value;
}

/**
 * Process keyword values based on property
 */
function processKeywordValue(value, property, strict = false) {
  // CSS custom properties
  if (PatternTester.isVariable(value)) {
    return value;
  }

  // Basic keyword pattern - allow alphanumeric and hyphens
  if (syncSafeRegexTest(/^[a-zA-Z-]+$/, value, REGEX_TIMEOUTS.SIMPLE)) {
    return value;
  }

  return strict ? null : value;
}

/**
 * Process complex values (transforms, shadows, etc.)
 */
function processComplexValue(value, property, strict = false) {
  // CSS custom properties
  if (PatternTester.isVariable(value)) {
    return value;
  }

  // Handle transform property specifically
  if (property === "transform") {
    // Handle transform keywords
    const transformKeywords = ["none", "inherit", "initial", "unset", "revert"];

    if (transformKeywords.includes(value.toLowerCase())) {
      return value;
    }

    // Handle transform functions
    if (value.includes("(") && value.includes(")")) {
      return value; // Functions are already validated by the function validator
    }
  }

  // For background property, handle various value types
  if (property === "background") {
    // Handle colors
    if (PatternTester.isColor(value)) {
      return value.toLowerCase();
    }

    // Handle URLs and functions (gradients, etc.)
    if (value.includes("(") && value.includes(")")) {
      return value; // Functions are already validated by the function validator
    }

    // Handle keywords
    const backgroundKeywords = [
      "none",
      "transparent",
      "inherit",
      "initial",
      "unset",
      "revert",
      "scroll",
      "fixed",
      "local", // attachment
      "repeat",
      "repeat-x",
      "repeat-y",
      "no-repeat",
      "space",
      "round", // repeat
      "auto",
      "cover",
      "contain", // size
      "border-box",
      "padding-box",
      "content-box", // clip/origin
      "left",
      "right",
      "top",
      "bottom",
      "center", // position
    ];

    if (backgroundKeywords.includes(value.toLowerCase())) {
      return value;
    }
  }

  // For other complex properties, accept functions and validated values
  if (value.includes("(") && value.includes(")")) {
    return value; // Functions are already validated by the function validator
  }

  // Complex properties often contain functions or multiple values
  return value;
}

/**
 * Check if this is a simple case that can use fast path processing
 * @param {string} value - CSS value
 * @param {string} propertyType - Property type
 * @returns {boolean} True if simple case
 */
function isSimpleCase(value, propertyType) {
  // Fast path for simple values without functions or complex patterns
  return (
    !value.includes("(") && // No functions
    !value.includes(" ") && // No multi-value
    !value.includes(",") && // No comma-separated values
    value.length < 50 && // Reasonable length
    propertyType !== "COMPLEX" // Not a complex property type
  );
}

/**
 * Fast processing for simple CSS values
 * @param {string} value - CSS value
 * @param {string} propertyType - Property type
 * @returns {string} Processed value
 */
function fastProcessValue(value, propertyType) {
  // Simple normalization without extensive validation
  const normalized = normalizeCSSValue(value);
  if (!normalized) return value; // Fallback to original

  // Fast path for common cases
  switch (propertyType) {
    case "COLOR":
      return isCSSColor(normalized) ? normalized.toLowerCase() : normalized;
    case "LENGTH":
    case "NUMBER":
    case "KEYWORD":
    default:
      return normalized;
  }
}

/**
 * Fallback value processing for unknown properties
 */
function processFallbackValue(value, strict = false) {
  // Basic safety check - no dangerous patterns (handled by security layer)
  return value;
}

/**
 * Process shorthand length values (e.g., "10px 20px")
 */
function processShorthandLength(value, strict = false) {
  const parts = value.split(/\s+/);

  // Validate each part is a valid length
  for (const part of parts) {
    if (!processLengthValue(part, null, strict)) {
      return strict ? null : value;
    }
  }

  return value;
}

/**
 * Generate CSS declarations object with enhanced logic
 */
function generateDeclarations(property, value, important = false) {
  const declarations = {};
  const finalValue = important ? `${value} !important` : value;

  // Direct property mapping - the property maps handle the CSS property names
  declarations[property] = finalValue;

  return declarations;
}

/**
 * Generate complete CSS selector with pseudo-class support
 * Note: Responsive media queries are handled at the CSS formatting level, not here
 */
function generateCompleteSelector(baseSelector, responsive, pseudoClass) {
  let selector = baseSelector;

  // Add pseudo-class only if it's not already present in the selector
  if (pseudoClass && !selector.includes(`:${pseudoClass}`)) {
    selector += `:${pseudoClass}`;
  }

  // Don't wrap in media queries here - that's handled by CSS formatter
  // Just return the selector with pseudo-classes

  return selector;
}

/**
 * Calculate CSS specificity for proper cascading
 */
function calculateSpecificity(selector, responsive, pseudoClass) {
  let specificity = 10; // Base class specificity

  if (pseudoClass) {
    specificity += 10; // Pseudo-class adds specificity
  }

  if (responsive) {
    specificity += 1; // Media queries have slight priority
  }

  return specificity;
}

/**
 * Format CSS declarations object into string
 * @param {Object} declarations - CSS declarations object
 * @returns {string} Formatted declarations string
 */
export function formatDeclarations(declarations) {
  // Optimized: Direct string building instead of array operations
  const entries = Object.entries(declarations);

  // Early return for single declaration (common case)
  if (entries.length === 1) {
    const [prop, val] = entries[0];
    return `${prop}: ${val}`;
  }

  // Build string directly for multiple declarations
  let result = "";
  for (let i = 0; i < entries.length; i++) {
    const [prop, val] = entries[i];
    if (i > 0) result += "; ";
    result += `${prop}: ${val}`;
  }

  return result;
}
