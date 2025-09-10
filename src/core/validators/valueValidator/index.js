/**
 * CSS Value Validator - Modular Architecture
 * Main orchestrator for property-specific value validation
 */

import { isSafeInput } from "../../security/index.js";
import { normalizeCSSValue } from "../../utils/index.js";
import { ValidationResult, ErrorFactory } from "../../errors/index.js";
import { ERROR_MESSAGES } from "../../utils/errorMessages.js";
import { isNonEmptyString, fastNow } from "../../utils/essential.js";
import { MAX_PART_LENGTH } from "../../security/securityConstants.js";
import { validateBorderPart } from "./helpers/borderHelpers.js";
import { validateOutlinePart } from "./helpers/outlineHelpers.js";
import { splitOnCommas, splitOnWhitespace } from "../../utils/parsing.js";

/**
 * Compatibility helper for createValidationResult
 */
function createValidationResult(
  isValid,
  reason = null,
  value = null,
  metadata = {}
) {
  if (isValid) {
    const result = ValidationResult.valid(value);
    result.metadata = {
      type: "unknown",
      timestamp: fastNow(),
      ...metadata,
    };
    return result;
  } else {
    const error = ErrorFactory.invalidInput(value, reason);
    return ValidationResult.invalid(error);
  }
}
import {
  PROPERTY_VALIDATION_RULES,
  getPropertyRules,
  isKnownProperty,
} from "./properties/index.js";
import {
  isGlobalKeyword,
  validateLengthValue,
  validateColorValue,
  validateKeywordValue,
  validateNumberValue,
  validateIntegerValue,
  validateTimeValue,
  validateAngleValue,
  validateCSSFunctionValue,
  validateContentValue,
  ValidationHelpers,
} from "./types/index.js";

/**
 * Enhanced CSS value validation for a given property
 * @param {string} value - CSS value to validate
 * @param {string} property - CSS property name
 * @param {Object} options - Validation options
 * @returns {Object} Comprehensive validation result
 */
export function validateValue(value, property, options = {}) {
  const {
    strict = false,
    allowCustomProperties = true,
    context = {},
  } = options;

  if (!isNonEmptyString(value)) {
    return createValidationResult(
      false,
      ERROR_MESSAGES.INPUT.INVALID_TYPE,
      value
    );
  }

  // Security check first
  if (!isSafeInput(value)) {
    return createValidationResult(
      false,
      "Value contains unsafe patterns",
      value
    );
  }

  // Normalize the value using utility
  const normalizedValue = normalizeCSSValue(value);

  // Handle CSS global keywords
  if (isGlobalKeyword(normalizedValue)) {
    return createValidationResult(true, null, normalizedValue, {
      type: "global-keyword",
    });
  }

  // Get property-specific validation rules
  const rules = getPropertyRules(property);
  if (!rules) {
    // Unknown property - use fallback validation
    return validateUnknownProperty(normalizedValue, strict);
  }

  // Add property to context for use in validators
  const contextWithProperty = { ...context, property };

  // Handle CSS custom properties ONLY if it's not a shorthand property
  // For shorthand properties, CSS variables are handled within the shorthand validation
  if (
    allowCustomProperties &&
    normalizedValue.startsWith("var(") &&
    rules.type !== "special-shorthand" &&
    rules.type !== "border-shorthand"
  ) {
    return validateCustomProperty(normalizedValue, strict);
  }

  // Handle space-separated or comma-separated values for shorthand properties with allowMultiple
  if (rules.allowMultiple) {
    const hasSpaces = normalizedValue.includes(" ");
    const hasCommas = normalizedValue.includes(",");
    const hasParens = normalizedValue.includes("(");

    // Check for special-shorthand properties first (like border)
    // These need custom validation logic that understands the property semantics
    if (
      rules.type === "special-shorthand" ||
      rules.type === "border-shorthand"
    ) {
      return validateByType(
        normalizedValue,
        rules,
        strict,
        contextWithProperty
      );
    }

    // Handle multiple values - either space-separated or comma-separated
    // Allow parentheses if they're part of calc/function syntax
    if (
      (hasSpaces || hasCommas) &&
      (!hasParens ||
        (hasParens &&
          (hasCommas || normalizedValue.match(/calc\(|min\(|max\(|clamp\(/))))
    ) {
      return validateMultipleValuesParts(
        normalizedValue,
        rules,
        property,
        strict
      );
    }
  }

  // Validate based on property type
  return validateByType(normalizedValue, rules, strict, contextWithProperty);
}

/**
 * Validate value based on its type
 */
function validateByType(value, rules, strict, context = {}) {
  switch (rules.type) {
    case "length":
      return validateLengthValue(value, rules, strict);

    case "length-or-number":
      return validateLengthOrNumberValue(value, rules, strict);

    case "color":
      return validateColorValue(value, rules, strict);

    case "number":
      return validateNumberValue(value, rules, strict);

    case "integer":
      return validateIntegerValue(value, rules, strict);

    case "time":
      return validateTimeValue(value, rules, strict);

    case "angle":
      return validateAngleValue(value, rules, strict);

    case "ratio-or-keyword":
      return validateRatioOrKeywordValue(value, rules, strict);

    case "keyword":
      return validateKeywordValue(value, rules, strict);

    case "keyword-or-number":
      return validateKeywordOrNumberValue(value, rules, strict);

    case "keyword-or-length":
      return validateKeywordOrLengthValue(value, rules, strict);

    case "keyword-or-identifier":
      return validateKeywordOrIdentifierValue(value, rules, strict);

    case "keyword-or-function":
      return validateKeywordOrFunctionValue(value, rules, strict, context);

    case "number-or-keyword":
      return validateNumberOrKeywordValue(value, rules, strict);

    case "function-or-keyword":
      return validateFunctionOrKeywordValue(value, rules, strict, context);

    case "font-shorthand":
      return validateFontShorthand(value, rules, strict);

    case "font-family":
      return validateFontFamilyValue(value, rules, strict);

    case "function":
      return validateFunctionValue(value, rules, strict);

    case "color-or-complex":
      return validateColorOrComplexValue(value, rules, strict);

    case "complex":
      return validateComplexValue(value, rules, strict);

    case "string":
      return validateStringValue(value, rules, strict);

    case "border-shorthand":
    case "special-shorthand":
      return validateShorthandProperty(value, rules, strict, context);

    case "transition-shorthand":
      return validateTransitionShorthand(value, rules, strict);

    case "animation-shorthand":
      return validateAnimationShorthand(value, rules, strict);

    case "background-shorthand":
      return validateBackgroundShorthand(value, rules, strict);

    case "content":
      return validateContentValue(value, rules, strict);

    case "shadow":
      return validateShadowValue(value, rules, strict);

    case "text-shadow":
      return validateTextShadowValue(value, rules, strict);

    case "filter":
      return validateFilterValue(value, rules, strict, context);

    default:
      return validateFallbackValue(value, strict);
  }
}

/**
 * Validate multiple space-separated or comma-separated values
 */
function validateMultipleValuesParts(value, rules, property, strict) {
  // Determine if this is comma-separated or space-separated
  let parts;
  if (value.includes(",")) {
    // Comma-separated values (ZyraCSS style)
    parts = value
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
  } else {
    // Space-separated values (standard CSS style)
    parts = value.split(/\s+/).filter((part) => part.trim().length > 0);
  }

  if (parts.length > 1) {
    const partResults = [];
    let allValid = true;

    for (const part of parts) {
      // Create a copy of rules without allowMultiple to avoid infinite recursion
      const partRules = { ...rules, allowMultiple: false };

      const partResult = validateByType(part, partRules, strict);

      if (partResult.isValid) {
        partResults.push(partResult);
      } else {
        allValid = false;
        break;
      }
    }

    if (allValid) {
      // Combine the normalized values from each part
      const normalizedParts = partResults.map((result) => result.value);
      const normalizedValue = value.includes(",")
        ? normalizedParts.join(",") // Preserve comma-separation for ZyraCSS
        : normalizedParts.join(" "); // Space-separation for CSS

      return createValidationResult(true, null, normalizedValue, {
        type: "shorthand-multiple",
        parts: partResults.length,
        validatedParts: partResults,
      });
    }
  }

  // If multiple validation fails, try as single value
  return validateByType(value, rules, strict);
}

/**
 * Validate CSS custom property (var() function)
 */
function validateCustomProperty(value, strict = false) {
  const match = value.match(/^var\(\s*(--[^,)]+)\s*(?:,\s*(.+))?\s*\)$/);

  if (!match) {
    return createValidationResult(
      false,
      ERROR_MESSAGES.SYNTAX.INVALID_VAR_FUNCTION,
      value
    );
  }

  const [, propertyName, fallbackValue] = match;

  // Validate property name
  if (!propertyName.startsWith("--")) {
    return createValidationResult(
      false,
      "Custom property name must start with --",
      value
    );
  }

  // Validate fallback value if present
  if (fallbackValue) {
    const trimmedFallback = fallbackValue.trim();
    if (!trimmedFallback) {
      return createValidationResult(false, "Empty fallback value", value);
    }
  }

  return createValidationResult(true, null, value, {
    type: "custom-property",
    propertyName,
    fallbackValue: fallbackValue ? fallbackValue.trim() : null,
  });
}

/**
 * Validate unknown property with basic checks
 */
function validateUnknownProperty(value, strict) {
  if (strict) {
    return createValidationResult(false, "Unknown property", value);
  }

  // Allow any reasonable-looking CSS value for unknown properties
  if (value.match(/^[a-zA-Z0-9\s\-_%(),./]+$/)) {
    return createValidationResult(true, null, value, {
      type: "unknown-property",
      warning: "Property not recognized",
    });
  }

  return createValidationResult(
    false,
    ERROR_MESSAGES.SECURITY.INVALID_CHARACTERS,
    value
  );
}

/**
 * Fallback validation for unrecognized types
 */
function validateFallbackValue(value, strict) {
  if (strict) {
    return createValidationResult(false, "Unrecognized value type", value);
  }

  return createValidationResult(true, null, value, {
    type: "fallback",
    warning: "Basic validation applied",
  });
}

/**
 * Validate keyword-or-number type values
 */
function validateKeywordOrNumberValue(value, rules, strict) {
  // Try keyword first, then number
  const keywordResult = validateKeywordValue(value, rules, strict);
  if (keywordResult.isValid) return keywordResult;
  return validateNumberValue(value, rules, strict);
}

/**
 * Validate length-or-number type values
 */
function validateLengthOrNumberValue(value, rules, strict) {
  // Try number first (for unitless), then length
  if (/^\d*\.?\d+$/.test(value) && rules.allowUnitless) {
    return validateNumberValue(value, rules, strict);
  }
  return validateLengthValue(value, rules, strict);
}

/**
 * Validate ratio-or-keyword type values
 */
function validateRatioOrKeywordValue(value, rules, strict) {
  // Try keyword first
  if (rules.allowKeywords && rules.allowKeywords.includes(value)) {
    return createValidationResult(true, null, value, { type: "keyword" });
  }

  // Check for ratio pattern (e.g., "16/9", "4/3")
  const ratioPattern = /^\d+\/\d+$/;
  if (ratioPattern.test(value)) {
    return createValidationResult(true, null, value, { type: "ratio" });
  }

  // Check for single number (e.g., "1.5", "2") for aspect-ratio
  if (rules.allowNumbers) {
    const numberPattern = /^\d*\.?\d+$/;
    if (numberPattern.test(value)) {
      return createValidationResult(true, null, value, { type: "number" });
    }
  }

  return createValidationResult(
    false,
    "Value must be a valid CSS keyword or ratio (e.g., '16/9', '1.5', 'auto')",
    value
  );
}

/**
 * Validate keyword-or-length type values
 */
function validateKeywordOrLengthValue(value, rules, strict) {
  // Try keyword first, then length
  const keywordResult = validateKeywordValue(value, rules, strict);
  if (keywordResult.isValid) return keywordResult;
  return validateLengthValue(value, rules, strict);
}

/**
 * Validate keyword-or-identifier type values
 */
function validateKeywordOrIdentifierValue(value, rules, strict) {
  // Try keyword first
  const keywordResult = validateKeywordValue(value, rules, strict);
  if (keywordResult.isValid) return keywordResult;

  // Check if it's a valid CSS identifier for custom page names
  if (rules.allowIdentifiers && rules.pattern) {
    if (rules.pattern.test(value)) {
      return createValidationResult(true, null, value, { type: "identifier" });
    }
  }

  return createValidationResult(
    false,
    "Value must be a valid CSS keyword, length, or identifier",
    value
  );
}

/**
 * Validate number-or-keyword type values
 */
function validateNumberOrKeywordValue(value, rules, strict) {
  // Try number first, then keyword
  const numberResult = validateNumberValue(value, rules, strict);
  if (numberResult.isValid) return numberResult;
  return validateKeywordValue(value, rules, strict);
}

/**
 * Validate keyword-or-function type values
 */
function validateKeywordOrFunctionValue(value, rules, strict, context = {}) {
  // Try keyword first, then CSS function
  const keywordResult = validateKeywordValue(value, rules, strict);
  if (keywordResult.isValid) return keywordResult;

  // Check if it's a CSS function
  if (value.includes("(") && value.includes(")")) {
    return validateCSSFunctionValue(value, rules, strict, context);
  }

  return validateFallbackValue(value, strict);
}

/**
 * Validate font-family type values
 */
function validateFontFamilyValue(value, rules, strict) {
  // Split by commas for multiple font families
  const families = value.split(",").map((f) => f.trim());

  for (const family of families) {
    const isQuoted = /^["'].*["']$/.test(family);
    const cleanFamily = family.replace(/^["']|["']$/g, "");

    // Check if it's a system font family keyword
    if (rules.systemFamilies && rules.systemFamilies.includes(cleanFamily)) {
      continue;
    }

    // Check if it's a fallback keyword
    if (
      rules.fallbackKeywords &&
      rules.fallbackKeywords.includes(cleanFamily)
    ) {
      continue;
    }

    if (isQuoted) {
      // Quoted font family names can contain Unicode characters
      // Just check that it's not empty and doesn't contain control characters
      if (!cleanFamily || /[\x00-\x1F\x7F]/.test(cleanFamily)) {
        return createValidationResult(
          false,
          "Invalid quoted font family name",
          value
        );
      }
    } else {
      // Unquoted font family names must follow CSS identifier rules (ASCII only)
      // Font family names should not start with digits
      if (!/^[a-zA-Z][a-zA-Z0-9\s\-]*$/.test(cleanFamily)) {
        return createValidationResult(
          false,
          "Invalid unquoted font family name",
          value
        );
      }
    }
  }

  return createValidationResult(true, null, value, { type: "font-family" });
}

/**
 * Validate function type values
 */
function validateFunctionValue(value, rules, strict) {
  // Check if it looks like a CSS function
  const functionPattern = /^[a-zA-Z-]+\(.+\)$/;
  if (!functionPattern.test(value)) {
    return createValidationResult(
      false,
      ERROR_MESSAGES.SYNTAX.INVALID_FUNCTION,
      value
    );
  }

  // Extract function name
  const match = value.match(/^([a-zA-Z-]+)\(/);
  if (!match) {
    return createValidationResult(false, "Cannot parse function name", value);
  }

  const functionName = match[1];

  // Check if function is allowed
  if (rules.functions && !rules.functions.includes(functionName)) {
    return createValidationResult(
      false,
      `Function ${functionName} not allowed`,
      value
    );
  }

  return createValidationResult(true, null, value, {
    type: "function",
    functionName: functionName,
  });
}

/**
 * Validate color-or-complex type values
 */
function validateColorOrComplexValue(value, rules, strict) {
  // Try color validation first
  const colorResult = validateColorValue(value, rules, strict);
  if (colorResult.isValid) return colorResult;

  // Fall back to complex validation for gradients, etc.
  return validateComplexValue(value, rules, strict);
}

/**
 * Validate complex type values
 */
function validateComplexValue(value, rules, strict) {
  // Handle border-radius slash syntax for horizontal/vertical radii
  if (rules.allowSlash && (value.includes("/") || value.includes(",/,"))) {
    return validateBorderRadiusSlashSyntax(value, rules, strict);
  }

  // Special handling for border-radius (ensure proper constraints)
  if (rules.allowSlash) {
    return validateBorderRadiusComplex(value, rules, strict);
  }

  // Special handling for rotate property - must have angle units
  if (rules.allowAngles) {
    // For rotate property, angles must have units (unless it's a keyword like "none")
    const isPlainNumber = /^\d*\.?\d+$/.test(value.trim());
    const isKeyword =
      rules.allowKeywords && rules.allowKeywords.includes(value.toLowerCase());

    if (isPlainNumber && !isKeyword) {
      return createValidationResult(
        false,
        "Angle values require units (deg, rad, grad, turn)",
        value
      );
    }
  }

  // If colors are restricted, check if this looks like a color value
  if (rules.restrictColors) {
    const trimmed = value.trim().toLowerCase();

    // Check if it's a named color (common ones that shouldn't be in grid templates)
    const commonColors = [
      "red",
      "green",
      "blue",
      "yellow",
      "orange",
      "purple",
      "pink",
      "brown",
      "black",
      "white",
      "gray",
      "grey",
      "cyan",
      "magenta",
      "lime",
      "navy",
      "maroon",
      "olive",
      "aqua",
      "teal",
      "silver",
      "fuchsia",
    ];

    if (commonColors.includes(trimmed)) {
      return createValidationResult(
        false,
        "Color values not allowed for this property",
        value
      );
    }

    // Check for hex colors
    if (/^#[0-9a-f]{3,8}$/i.test(trimmed)) {
      return createValidationResult(
        false,
        "Color values not allowed for this property",
        value
      );
    }

    // Check for rgb/rgba/hsl/hsla functions
    if (/^(rgb|rgba|hsl|hsla)\s*\(/i.test(trimmed)) {
      return createValidationResult(
        false,
        "Color values not allowed for this property",
        value
      );
    }
  }

  // Reject values that start with numbers but aren't valid CSS units or functions
  if (/^\d/.test(value)) {
    // Allow valid CSS patterns that start with numbers:
    // - Numbers with units (e.g., "1fr", "45deg", "2px")
    // - Numbers with commas for multiple values (e.g., "0,2px,4px")
    // - Numbers followed by spaces for multiple values (which become commas)
    // - Pure numbers (but not numbers followed by invalid text)
    const validNumberPatterns = [
      /^\d*\.?\d+(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|fr|deg|rad|grad|turn|s|ms|Hz|kHz)$/i, // Numbers with known CSS units
      /^\d*\.?\d+(,\d|\s\d)/, // Numbers in sequences: 0,2px,4px or "0 2px 4px"
      /^\d*\.?\d+$/, // Pure numbers only (no trailing text)
    ];

    const isValidNumberPattern = validNumberPatterns.some((pattern) =>
      pattern.test(value)
    );

    if (!isValidNumberPattern && !/^[a-zA-Z-]+\(/.test(value)) {
      return createValidationResult(
        false,
        "Value format not supported - use valid CSS syntax like 'calc()', 'var()', or standard values",
        value
      );
    }
  }

  // Complex values can contain multiple types - be permissive
  if (strict) {
    // In strict mode, require more validation
    // Allow quotes for URL functions and other CSS functions, including colons and semicolons for URLs
    if (!/^[a-zA-Z0-9\s\-_%():,./#+'"?&=;]+$/.test(value)) {
      return createValidationResult(
        false,
        "Invalid characters in complex value",
        value
      );
    }
  }

  return createValidationResult(true, null, value, {
    type: "complex",
    warning: strict ? null : "Complex validation applied",
  });
}

/**
 * Validate string type values
 */
function validateStringValue(value, rules, strict) {
  // Check for quotes if required
  if (rules.allowQuotes && (value.startsWith('"') || value.startsWith("'"))) {
    // Validate quoted string
    const quote = value[0];
    if (!value.endsWith(quote) || value.length < 2) {
      return createValidationResult(
        false,
        "Mismatched quotes in string",
        value
      );
    }
  }

  // Check for functions if allowed
  if (rules.allowFunctions && value.includes("(")) {
    return validateFunctionValue(value, rules, strict);
  }

  // Check keywords if allowed
  if (rules.allowKeywords && rules.allowKeywords.includes(value)) {
    return createValidationResult(true, null, value, { type: "keyword" });
  }

  return createValidationResult(true, null, value, { type: "string" });
}

/**
 * Validate function-or-keyword type values
 */
function validateFunctionOrKeywordValue(value, rules, strict, context = {}) {
  // Try keyword first, then CSS function
  const keywordCheck = validateKeywordValue(value, rules, strict);
  if (keywordCheck.isValid) return keywordCheck;

  // Check if it's a CSS function
  if (value.includes("(") && value.includes(")")) {
    return validateCSSFunctionValue(value, rules, strict, context);
  }

  return validateFallbackValue(value, strict);
}

/**
 * Font Family Validation Helper
 * Validates a comma-separated list of font families
 */

/**
 * Basic shorthand validators (simplified versions)
 */
function validateBorderShorthand(value, rules, strict) {
  const trimmed = value.trim();

  // Handle global keywords first
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return createValidationResult(true, null, trimmed, { type: "keyword" });
  }

  // Handle comma-separated border values like "1px,solid,red" -> "1px solid red"
  if (value.includes(",")) {
    // Use comma splitting to respect parentheses in functions like rgba()
    const parts = splitOnCommas(value);

    // Border shorthand can have 1-3 values maximum
    if (parts.length > 3 || parts.length === 0) {
      return createValidationResult(
        false,
        "Border shorthand accepts maximum 3 values (width, style, color)",
        value
      );
    }

    // Validate each part using helper functions
    let hasWidth = false;
    let hasStyle = false;
    let hasColor = false;

    for (const part of parts) {
      if (!part || part.length === 0) {
        return createValidationResult(false, "Empty border value part", value);
      }

      const validation = validateBorderPart(part);
      if (!validation.isValid) {
        return createValidationResult(false, validation.reason, value);
      }

      // Check for duplicates
      if (validation.type === "width") {
        if (hasWidth) {
          return createValidationResult(
            false,
            "Duplicate border width values",
            value
          );
        }
        hasWidth = true;
      } else if (validation.type === "style") {
        if (hasStyle) {
          return createValidationResult(
            false,
            "Duplicate border style values",
            value
          );
        }
        hasStyle = true;
      } else if (validation.type === "color") {
        if (hasColor) {
          return createValidationResult(
            false,
            "Duplicate border color values",
            value
          );
        }
        hasColor = true;
      }
    }

    // Convert comma-separated to space-separated for CSS output
    const spaceValue = parts.join(" ");
    return createValidationResult(true, null, spaceValue, {
      type: "special-shorthand",
      originalValue: value,
    });
  }

  // Single value - validate as individual border component
  const validation = validateBorderPart(trimmed);

  if (validation.isValid) {
    return createValidationResult(true, null, trimmed, {
      type: "special-shorthand",
    });
  }

  return createValidationResult(
    false,
    validation.reason || "Invalid border value",
    value
  );
}

/**
 * Validate CSS font shorthand property according to CSS specification
 *
 * Font shorthand syntax:
 * font: [font-style] [font-variant] [font-weight] [font-stretch] font-size[/line-height] font-family
 *
 * Requirements:
 * - font-size and font-family are mandatory
 * - font-style, font-variant, font-weight, font-stretch must come before font-size
 * - line-height must immediately follow font-size with "/" separator
 * - font-family must be the last value
 * - System font keywords: caption, icon, menu, message-box, small-caption, status-bar
 */
/**
 * Transform font family names according to CSS naming rules
 * Converts dash-separated names to quoted space-separated names
 * Based on MDN CSS font-family specification
 */
function transformFontFamilyNames(fontFamilyString) {
  // Generic font families that should NOT be quoted
  const genericFamilies = [
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui",
    "ui-serif",
    "ui-sans-serif",
    "ui-monospace",
    "ui-rounded",
    "math",
    "emoji",
    "fangsong",
  ];

  // If the input contains commas, it's multiple families - split and process each
  if (fontFamilyString.includes(",")) {
    return fontFamilyString
      .split(",")
      .map((family) => {
        const trimmed = family.trim();
        return transformSingleFontFamily(trimmed, genericFamilies);
      })
      .join(", ");
  }

  // Single font family
  return transformSingleFontFamily(fontFamilyString.trim(), genericFamilies);
}

/**
 * Transform a single font family name
 */
function transformSingleFontFamily(familyName, genericFamilies) {
  let trimmed = familyName.trim();

  // If already quoted, return as-is (assuming it's correctly formatted)
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed;
  }

  // Check if it's a generic family (should not be quoted)
  if (genericFamilies.includes(trimmed.toLowerCase())) {
    return trimmed.toLowerCase();
  }

  // Convert dashes to spaces for multi-word font names (ZyraCSS convention)
  if (trimmed.includes("-")) {
    trimmed = trimmed.replace(/-/g, " ");

    // Capitalize each word properly for font names
    trimmed = trimmed.replace(/\b\w/g, (char) => char.toUpperCase());

    // Handle special font name abbreviations
    trimmed = trimmed.replace(/\bMs\b/g, "MS"); // Microsoft Sans → MS
    trimmed = trimmed.replace(/\bNt\b/g, "NT"); // Windows NT
    trimmed = trimmed.replace(/\bUi\b/g, "UI"); // User Interface
  } else {
    // For single-word fonts, capitalize first letter if it looks like a brand name
    if (!/^(serif|sans-serif|monospace|cursive|fantasy)$/i.test(trimmed)) {
      trimmed =
        trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }
  }

  // According to CSS specs: multi-word font names should be quoted
  // Also quote font names with spaces, digits, or special characters
  if (trimmed.includes(" ") || /[\d\-\(\)\[\]\.\/\\]/.test(trimmed)) {
    return `"${trimmed}"`;
  }

  // Single-word branded fonts should also be quoted (good practice)
  if (/^[A-Z]/.test(trimmed)) {
    return `"${trimmed}"`;
  }

  return trimmed;
}

function validateFontShorthand(value, rules, strict) {
  const trimmedValue = value.trim();

  // Handle system font keywords first
  const systemFonts = [
    "caption",
    "icon",
    "menu",
    "message-box",
    "small-caption",
    "status-bar",
  ];
  if (systemFonts.includes(trimmedValue.toLowerCase())) {
    return createValidationResult(true, null, trimmedValue, {
      type: "font-shorthand",
      subtype: "system-font",
    });
  }

  // For ZyraCSS comma-separated values, convert to space-separated for analysis
  let parts;
  if (trimmedValue.includes(",")) {
    // ZyraCSS format: font-[bold,16px,Arial] -> "bold 16px Arial"
    parts = trimmedValue
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
  } else {
    // Already space-separated
    parts = trimmedValue.split(/\s+/).filter((part) => part.length > 0);
  }

  if (parts.length < 2) {
    return createValidationResult(
      false,
      "Font shorthand requires at least font-size and font-family",
      value
    );
  }

  // Define valid values for each component
  const fontStyles = ["normal", "italic", "oblique"];
  const fontVariants = ["normal", "small-caps"];
  const fontWeights = [
    "normal",
    "bold",
    "bolder",
    "lighter",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ];
  const fontStretches = [
    "normal",
    "ultra-condensed",
    "extra-condensed",
    "condensed",
    "semi-condensed",
    "semi-expanded",
    "expanded",
    "extra-expanded",
    "ultra-expanded",
  ];
  const fontSizeKeywords = [
    "xx-small",
    "x-small",
    "small",
    "medium",
    "large",
    "x-large",
    "xx-large",
    "xxx-large",
    "larger",
    "smaller",
  ];

  // Find font-size position (required)
  let fontSizeIndex = -1;
  let hasLineHeight = false;
  let lineHeightValue = "";

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    // Check for font-size with optional line-height (size/line-height)
    if (part.includes("/")) {
      const [size, lineHeight] = part.split("/");

      // Validate font-size part
      if (isFontSize(size)) {
        fontSizeIndex = i;
        hasLineHeight = true;
        lineHeightValue = lineHeight;
        // Replace the size/line-height part with just the size for further processing
        parts[i] = size;
        break;
      }
    } else if (isFontSize(part)) {
      fontSizeIndex = i;
      break;
    }
  }

  if (fontSizeIndex === -1) {
    return createValidationResult(
      false,
      "Font shorthand requires a valid font-size",
      value
    );
  }

  // Validate font-family (everything after font-size, or after line-height if present)
  if (fontSizeIndex >= parts.length - 1) {
    return createValidationResult(
      false,
      "Font shorthand requires font-family as the last value",
      value
    );
  }

  // Get font-family parts (everything after font-size)
  const fontFamilyParts = parts.slice(fontSizeIndex + 1);
  const fontFamily = fontFamilyParts.join(" ");

  // Validate font-family is not empty and doesn't contain font property keywords
  if (!fontFamily || fontFamily.trim().length === 0) {
    return createValidationResult(
      false,
      "Font shorthand requires a font-family value",
      value
    );
  }

  // Validate that font-family doesn't contain font property keywords
  for (const familyPart of fontFamilyParts) {
    const partLower = familyPart.toLowerCase();
    if (
      fontStyles.includes(partLower) ||
      fontVariants.includes(partLower) ||
      fontWeights.includes(partLower) ||
      fontStretches.includes(partLower)
    ) {
      return createValidationResult(
        false,
        `Invalid font shorthand: "${familyPart}" appears in font-family position but should come before font-size`,
        value
      );
    }
  }

  // Validate parts before font-size (font-style, font-variant, font-weight, font-stretch)
  const usedProperties = new Set();

  for (let i = 0; i < fontSizeIndex; i++) {
    const part = parts[i].toLowerCase();
    let isValid = false;

    // Check each property type (in order of precedence)
    if (fontStyles.includes(part) && !usedProperties.has("font-style")) {
      usedProperties.add("font-style");
      isValid = true;
    } else if (
      fontVariants.includes(part) &&
      !usedProperties.has("font-variant")
    ) {
      usedProperties.add("font-variant");
      isValid = true;
    } else if (
      fontWeights.includes(part) &&
      !usedProperties.has("font-weight")
    ) {
      usedProperties.add("font-weight");
      isValid = true;
    } else if (
      fontStretches.includes(part) &&
      !usedProperties.has("font-stretch")
    ) {
      usedProperties.add("font-stretch");
      isValid = true;
    }

    if (!isValid) {
      return createValidationResult(
        false,
        `Invalid font component: "${parts[i]}" (must be font-style, font-variant, font-weight, or font-stretch, and not duplicated)`,
        value
      );
    }
  }

  // Validate line-height if present
  if (hasLineHeight) {
    if (!isValidLineHeight(lineHeightValue)) {
      return createValidationResult(
        false,
        `Invalid line-height value: "${lineHeightValue}"`,
        value
      );
    }
  }

  // Transform font family names according to CSS rules
  const transformedFontFamily = transformFontFamilyNames(fontFamily);

  // Build the normalized CSS value
  let cssValue;
  if (hasLineHeight) {
    // Reconstruct the font-size/line-height part
    cssValue =
      parts.slice(0, fontSizeIndex).join(" ") +
      (fontSizeIndex > 0 ? " " : "") +
      parts[fontSizeIndex] +
      "/" +
      lineHeightValue +
      " " +
      transformedFontFamily;
    cssValue = cssValue.trim();
  } else {
    cssValue =
      parts.slice(0, fontSizeIndex).join(" ") +
      (fontSizeIndex > 0 ? " " : "") +
      parts[fontSizeIndex] +
      " " +
      transformedFontFamily;
    cssValue = cssValue.trim();
  }

  return createValidationResult(true, null, cssValue, {
    type: "font-shorthand",
    components: {
      hasStyle: usedProperties.has("font-style"),
      hasVariant: usedProperties.has("font-variant"),
      hasWeight: usedProperties.has("font-weight"),
      hasStretch: usedProperties.has("font-stretch"),
      hasLineHeight: hasLineHeight,
      fontSize: parts[fontSizeIndex],
      fontFamily: transformedFontFamily,
    },
  });

  /**
   * Check if a value is a valid font-size
   */
  function isFontSize(value) {
    // Length units
    if (
      /^\d+(\.\d+)?(px|em|rem|pt|pc|in|cm|mm|ex|ch|vh|vw|vmin|vmax|%)$/i.test(
        value
      )
    ) {
      return true;
    }

    // Font-size keywords
    if (fontSizeKeywords.includes(value.toLowerCase())) {
      return true;
    }

    // CSS functions
    if (/^(calc|min|max|clamp)\s*\(/.test(value)) {
      return true;
    }

    return false;
  }

  /**
   * Check if a value is a valid line-height
   */
  function isValidLineHeight(value) {
    // Number (unitless)
    if (/^\d+(\.\d+)?$/.test(value)) {
      return true;
    }

    // Length or percentage
    if (/^\d+(\.\d+)?(px|em|rem|ex|ch|vh|vw|vmin|vmax|%)$/i.test(value)) {
      return true;
    }

    // Keywords
    if (["normal"].includes(value.toLowerCase())) {
      return true;
    }

    return false;
  }
}

function validateTransitionShorthand(value, rules, strict) {
  // Handle comma-separated transition values
  if (value.includes(",")) {
    const parts = value.split(",").map((part) => part.trim());
    if (parts.length <= 4) {
      const spaceValue = parts.join(" ");
      return createValidationResult(true, null, spaceValue, {
        type: "transition-shorthand",
        originalValue: value,
      });
    }
  }

  return createValidationResult(true, null, value, {
    type: "transition-shorthand",
  });
}

function validateAnimationShorthand(value, rules, strict) {
  // Handle comma-separated animation values
  if (value.includes(",")) {
    const parts = value.split(",").map((part) => part.trim());
    if (parts.length <= 8) {
      const spaceValue = parts.join(" ");
      return createValidationResult(true, null, spaceValue, {
        type: "animation-shorthand",
        originalValue: value,
      });
    }
  }

  return createValidationResult(true, null, value, {
    type: "animation-shorthand",
  });
}

/**
 * Validate background shorthand values
 * Handles CSS background shorthand property with proper comma-to-space conversion
 */
function validateBackgroundShorthand(value, rules, strict) {
  const trimmed = value.trim();

  // Handle keywords first
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return createValidationResult(true, null, trimmed, { type: "keyword" });
  }

  // Handle comma-separated background values
  if (value.includes(",")) {
    const parts = value.split(",").map((part) => part.trim());

    // Validate each part is reasonable for background values
    for (const part of parts) {
      if (!part || part.length > MAX_PART_LENGTH) {
        return createValidationResult(
          false,
          "Invalid background value part",
          value
        );
      }
    }

    // Convert comma-separated to space-separated for CSS output
    const spaceValue = parts.join(" ");
    return createValidationResult(true, null, spaceValue, {
      type: "background-shorthand",
      originalValue: value,
    });
  }

  // Single value - validate as color or complex value
  // Use existing color validation for single background values
  const colorValidation = validateColorValue(trimmed, rules, strict);
  if (colorValidation.isValid) {
    return createValidationResult(true, null, trimmed, {
      type: "background-shorthand",
    });
  }

  // Try complex value validation (for gradients, images, etc.)
  const complexValidation = validateColorOrComplexValue(trimmed, rules, strict);
  if (complexValidation.isValid) {
    return createValidationResult(true, null, trimmed, {
      type: "background-shorthand",
    });
  }

  // If neither validation passes, reject the value
  return createValidationResult(
    false,
    "Background value must include valid color, image, position, size, or repeat values",
    value
  );
}

/**
 * Validate box-shadow values
 */
function validateShadowValue(value, rules, strict) {
  const trimmed = value.trim();

  // Handle keywords first
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return createValidationResult(true, null, trimmed, { type: "keyword" });
  }

  // Special check for box-shadow: reject "just a color" values
  if (rules.requireOffsets) {
    if (
      !trimmed.includes(" ") &&
      !trimmed.includes(",") &&
      !trimmed.includes("(")
    ) {
      const colorResult = validateColorValue(trimmed, {}, strict);
      if (colorResult.isValid) {
        return createValidationResult(
          false,
          "Box-shadow cannot be just a color; requires at least offset-x and offset-y",
          value
        );
      }
    }
  }

  // Check if this looks like a single shadow with comma-separated components
  // vs multiple complete shadows separated by commas
  if (trimmed.includes(",")) {
    // Try to parse as single shadow first (comma-separated components)
    const singleShadowResult = validateSingleShadow(trimmed, rules, strict);
    if (singleShadowResult.isValid) {
      return singleShadowResult;
    }

    // If single shadow parsing failed and multiple shadows are allowed,
    // try parsing as multiple complete shadows
    if (rules.allowMultiple) {
      const shadows = splitOnCommas(trimmed);
      const processedShadows = [];

      // Validate each shadow
      for (const shadow of shadows) {
        const shadowResult = validateSingleShadow(shadow.trim(), rules, strict);
        if (!shadowResult.isValid) {
          return shadowResult;
        }
        processedShadows.push(shadowResult.value);
      }

      // Join multiple shadows with commas for CSS
      const cssValue = processedShadows.join(", ");
      return createValidationResult(true, null, cssValue, {
        type: "shadow-multiple",
        count: shadows.length,
      });
    }

    // If we reach here, comma-parsing failed
    return singleShadowResult; // Return the original error
  }

  // Validate single shadow (no commas)
  return validateSingleShadow(trimmed, rules, strict);
}

/**
 * Validate text-shadow values
 */
function validateTextShadowValue(value, rules, strict) {
  const trimmed = value.trim();

  // Handle keywords first
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return createValidationResult(true, null, trimmed, { type: "keyword" });
  }

  // Check if this looks like a single text shadow with comma-separated components
  // vs multiple complete text shadows separated by commas
  if (trimmed.includes(",")) {
    // Try to parse as single text shadow first (comma-separated components)
    const singleShadowResult = validateSingleTextShadow(trimmed, rules, strict);
    if (singleShadowResult.isValid) {
      return singleShadowResult;
    }

    // If single shadow parsing failed and multiple shadows are allowed,
    // try parsing as multiple complete shadows
    if (rules.allowMultiple) {
      const shadows = splitOnCommas(trimmed);
      const processedShadows = [];

      // Validate each shadow
      for (const shadow of shadows) {
        const shadowResult = validateSingleTextShadow(
          shadow.trim(),
          rules,
          strict
        );
        if (!shadowResult.isValid) {
          return shadowResult;
        }
        processedShadows.push(shadowResult.value);
      }

      // Join multiple shadows with commas for CSS
      const cssValue = processedShadows.join(", ");
      return createValidationResult(true, null, cssValue, {
        type: "text-shadow-multiple",
        count: shadows.length,
      });
    }

    // If we reach here, comma-parsing failed
    return singleShadowResult; // Return the original error
  }

  // Validate single text shadow (no commas)
  return validateSingleTextShadow(trimmed, rules, strict);
}

/**
 * Validate a single box-shadow value
 * Format: [inset] <offset-x> <offset-y> [blur-radius] [spread-radius] [color]
 * Handles ZyraCSS comma-separated format: "0,2px,4px,rgba(0,0,0,0.1)" -> "0 2px 4px rgba(0,0,0,0.1)"
 */
function validateSingleShadow(value, rules, strict) {
  const trimmed = value.trim();

  // Handle ZyraCSS comma-separated format (but not inside function calls)
  if (
    trimmed.includes(",") &&
    !trimmed.startsWith("rgba(") &&
    !trimmed.startsWith("hsla(")
  ) {
    const parts = splitOnCommas(trimmed);

    if (parts.length < 2) {
      return createValidationResult(
        false,
        "Box shadow requires at least offset-x and offset-y",
        value
      );
    }

    // Convert comma-separated to space-separated for CSS
    const spaceValue = parts.join(" ");
    return createValidationResult(true, null, spaceValue, {
      type: "shadow",
      originalValue: trimmed,
      parts: parts.length,
    });
  }

  // Handle already space-separated format
  const parts = trimmed.split(/\s+/);

  if (parts.length < 2) {
    return createValidationResult(
      false,
      "Box shadow requires at least offset-x and offset-y",
      value
    );
  }

  let hasInset = false;
  let partIndex = 0;

  // Check for inset keyword
  if (parts[0] === "inset") {
    if (!rules.allowInset) {
      return createValidationResult(
        false,
        "Inset shadows not allowed for this property",
        value
      );
    }
    hasInset = true;
    partIndex = 1;
  }

  // Need at least 2 more parts for offset-x and offset-y
  if (parts.length - partIndex < 2) {
    return createValidationResult(
      false,
      "Box shadow requires offset-x and offset-y values",
      value
    );
  }

  // Basic validation - accept if it looks like a shadow pattern
  return createValidationResult(true, null, trimmed, {
    type: "shadow",
    hasInset,
    parts: parts.length,
  });
}

/**
 * Validate a single text-shadow value
 * Format: <offset-x> <offset-y> [blur-radius] [color]
 * Handles ZyraCSS comma-separated format
 */
function validateSingleTextShadow(value, rules, strict) {
  const trimmed = value.trim();

  // Handle ZyraCSS comma-separated format (but not inside function calls)
  if (
    trimmed.includes(",") &&
    !trimmed.startsWith("rgba(") &&
    !trimmed.startsWith("hsla(")
  ) {
    const parts = splitOnCommas(trimmed);

    if (parts.length < 2) {
      return createValidationResult(
        false,
        "Text shadow requires at least offset-x and offset-y",
        value
      );
    }

    // Convert comma-separated to space-separated for CSS
    const spaceValue = parts.join(" ");
    return createValidationResult(true, null, spaceValue, {
      type: "text-shadow",
      originalValue: trimmed,
      parts: parts.length,
    });
  }

  // Handle already space-separated format
  const parts = trimmed.split(/\s+/);

  if (parts.length < 2) {
    return createValidationResult(
      false,
      "Text shadow requires at least offset-x and offset-y",
      value
    );
  }

  // Basic validation - accept if it looks like a text shadow pattern
  return createValidationResult(true, null, trimmed, {
    type: "text-shadow",
    parts: parts.length,
  });
}

/**
 * Validate filter values with specific function validation
 * Handles filter functions: blur, brightness, contrast, drop-shadow, etc.
 */
function validateFilterValue(value, rules, strict, context = {}) {
  const trimmed = value.trim();

  // Handle keywords first
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return createValidationResult(true, null, trimmed, {
      type: "keyword",
    });
  }

  // Handle URL-based SVG filter references (from u() syntax)
  if (trimmed.startsWith("url(") && trimmed.endsWith(")")) {
    // This is a URL reference, likely from u() syntax conversion
    // Validate it as a CSS function with URL context
    return validateCSSFunctionValue(trimmed, rules, strict, context);
  }

  // Split on commas outside parentheses to handle multiple filters
  const filters = splitOnCommas(trimmed);
  const allResults = [];

  for (const filter of filters) {
    const trimmedFilter = filter.trim();
    // Each filter can itself contain space-separated functions
    if (trimmedFilter.includes(" ") && trimmedFilter.includes("(")) {
      // Space-separated functions within this filter - split properly outside parentheses
      const functions = splitOnWhitespace(trimmedFilter);
      for (const func of functions) {
        const result = validateSingleFilterFunction(
          func.trim(),
          rules,
          strict,
          context
        );
        if (!result.isValid) {
          return result;
        }
        allResults.push(result);
      }
    } else {
      // Single function or URL
      const result = validateSingleFilterFunction(
        trimmedFilter,
        rules,
        strict,
        context
      );
      if (!result.isValid) {
        return result;
      }
      allResults.push(result);
    }
  }

  return createValidationResult(true, null, trimmed, {
    type: "filter-multiple",
    functions: allResults.length,
  });
}

/**
 * Validate a single filter function
 */
function validateSingleFilterFunction(value, rules, strict, context = {}) {
  const trimmed = value.trim();

  // Handle URL-based SVG filter references first
  if (trimmed.startsWith("url(") && trimmed.endsWith(")")) {
    return validateCSSFunctionValue(trimmed, rules, strict, context);
  }

  // Check for valid filter functions
  // Handle nested parentheses properly
  const functionNameMatch = trimmed.match(/^([a-z-]+)\(/);
  if (!functionNameMatch) {
    return createValidationResult(
      false,
      "Invalid filter function format",
      value
    );
  }

  const functionName = functionNameMatch[1];

  // Extract parameters by finding the matching closing parenthesis
  let depth = 1; // Start at 1 since we're already inside the function parentheses
  let paramStart = functionName.length + 1;
  let paramEnd = -1;

  for (let i = paramStart; i < trimmed.length; i++) {
    if (trimmed[i] === "(") {
      depth++;
    } else if (trimmed[i] === ")") {
      depth--;
      if (depth === 0) {
        paramEnd = i;
        break;
      }
    }
  }

  if (paramEnd === -1) {
    return createValidationResult(
      false,
      "Invalid filter function format - missing closing parenthesis",
      value
    );
  }

  const params = trimmed.slice(paramStart, paramEnd);

  // Check if it's an allowed filter function
  if (rules.functions && !rules.functions.includes(functionName)) {
    return createValidationResult(
      false,
      `Filter function '${functionName}' not allowed`,
      value
    );
  }

  // Validate specific filter functions
  switch (functionName) {
    case "blur":
      return validateBlurFunction(params, value);
    case "brightness":
    case "contrast":
    case "saturate":
    case "sepia":
    case "invert":
    case "grayscale":
      return validateNumericFilterFunction(params, functionName, value);
    case "hue-rotate":
      return validateAngleFilterFunction(params, value);
    case "drop-shadow":
      return validateDropShadowFunction(params, value);
    default:
      // For unknown functions, do basic validation
      return createValidationResult(true, null, trimmed, {
        type: "filter-function",
        function: functionName,
      });
  }
}

/**
 * Validate blur filter function - should reject negative values
 */
function validateBlurFunction(params, originalValue) {
  const trimmed = params.trim();

  // Handle CSS functions like max(), min(), clamp(), calc()
  if (trimmed.includes("(") && trimmed.includes(")")) {
    // For CSS functions, do basic validation - they should be handled by calc validator
    return createValidationResult(true, null, originalValue, {
      type: "filter-blur-function",
      function: trimmed.split("(")[0],
    });
  }

  // Parse length value for simple cases
  const lengthMatch = trimmed.match(/^([+-]?\d*\.?\d+)([a-zA-Z%]+)$/);
  if (!lengthMatch) {
    return createValidationResult(
      false,
      "Invalid blur value format",
      originalValue
    );
  }

  const [, numStr, unit] = lengthMatch;
  const numValue = parseFloat(numStr);

  // Blur values must be non-negative
  if (numValue < 0) {
    return createValidationResult(
      false,
      "Blur values cannot be negative",
      originalValue
    );
  }

  // Check for valid length units
  const validUnits = [
    "px",
    "em",
    "rem",
    "ex",
    "ch",
    "vw",
    "vh",
    "vmin",
    "vmax",
    "mm",
    "cm",
    "in",
    "pt",
    "pc",
  ];
  if (!validUnits.includes(unit.toLowerCase())) {
    return createValidationResult(
      false,
      `Invalid length unit for blur: ${unit}`,
      originalValue
    );
  }

  return createValidationResult(true, null, originalValue, {
    type: "filter-blur",
    value: numValue,
    unit: unit,
  });
}

/**
 * Validate numeric filter functions (brightness, contrast, etc.)
 */
function validateNumericFilterFunction(params, functionName, originalValue) {
  const trimmed = params.trim();

  // Check for percentage
  if (trimmed.endsWith("%")) {
    const numStr = trimmed.slice(0, -1);
    const numValue = parseFloat(numStr);
    if (isNaN(numValue) || numValue < 0) {
      return createValidationResult(
        false,
        `Invalid ${functionName} percentage value`,
        originalValue
      );
    }
    return createValidationResult(true, null, originalValue, {
      type: `filter-${functionName}`,
      value: numValue,
      unit: "%",
    });
  }

  // Check for number
  const numValue = parseFloat(trimmed);
  if (isNaN(numValue) || numValue < 0) {
    return createValidationResult(
      false,
      `Invalid ${functionName} value`,
      originalValue
    );
  }

  return createValidationResult(true, null, originalValue, {
    type: `filter-${functionName}`,
    value: numValue,
  });
}

/**
 * Validate angle filter functions (hue-rotate)
 */
function validateAngleFilterFunction(params, originalValue) {
  const trimmed = params.trim();

  const angleMatch = trimmed.match(/^([+-]?\d*\.?\d+)(deg|grad|rad|turn)$/);
  if (!angleMatch) {
    return createValidationResult(
      false,
      "Invalid angle value for hue-rotate",
      originalValue
    );
  }

  const [, numStr, unit] = angleMatch;
  const numValue = parseFloat(numStr);

  return createValidationResult(true, null, originalValue, {
    type: "filter-hue-rotate",
    value: numValue,
    unit: unit,
  });
}

/**
 * Validate drop-shadow filter function
 */
function validateDropShadowFunction(params, originalValue) {
  // Drop-shadow has format: drop-shadow(offset-x offset-y blur-radius color)
  // Input can be in ZyraCSS comma-separated format: "2px,2px,4px,rgba(0,0,0,0.3)"
  // Or in CSS space-separated format: "2px 2px 4px rgba(0, 0, 0, 0.3)"

  const trimmed = params.trim();

  // Determine if this is comma-separated (ZyraCSS) or space-separated (CSS) format
  // We split on commas first if they exist outside parentheses, otherwise on spaces
  let parts = [];
  let current = "";
  let parenDepth = 0;
  let hasCommaOutsideParens = false;

  // First pass: check if there are commas outside parentheses
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (char === "(") {
      parenDepth++;
    } else if (char === ")") {
      parenDepth--;
    } else if (char === "," && parenDepth === 0) {
      hasCommaOutsideParens = true;
      break;
    }
  }

  // Split based on format detected
  parenDepth = 0;
  current = "";

  if (hasCommaOutsideParens) {
    // ZyraCSS comma-separated format
    for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed[i];
      if (char === "(") {
        parenDepth++;
        current += char;
      } else if (char === ")") {
        parenDepth--;
        current += char;
      } else if (char === "," && parenDepth === 0) {
        if (current.trim()) {
          parts.push(current.trim());
        }
        current = "";
      } else {
        current += char;
      }
    }
  } else {
    // CSS space-separated format - use the splitOnWhitespace function
    parts = splitOnWhitespace(trimmed);
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  if (parts.length < 2) {
    return createValidationResult(
      false,
      "Drop-shadow requires at least offset-x and offset-y",
      originalValue
    );
  }

  return createValidationResult(true, null, originalValue, {
    type: "filter-drop-shadow",
    parts: parts.length,
  });
}

/**
 * Validate multiple values in batch
 * @param {string[]} values - Array of CSS values to validate
 * @param {string} property - CSS property name
 * @param {Object} options - Validation options
 * @returns {Object} Batch validation results
 */
export function validateMultipleValuesBatch(values, property, options = {}) {
  const results = [];
  const errors = [];

  for (let i = 0; i < values.length; i++) {
    const result = validateValue(values[i], property, options);

    if (result.isValid) {
      results.push({ index: i, value: values[i], result });
    } else {
      errors.push({ index: i, value: values[i], error: result.reason });
    }
  }

  return {
    results,
    errors,
    summary: {
      total: values.length,
      valid: results.length,
      invalid: errors.length,
      successRate: results.length / values.length,
    },
  };
}

/**
 * Validate border-radius slash syntax for horizontal/vertical radii
 * Supports: "10px 20px / 5px 10px" or "10px,20px,30px,40px,/,5px,10px,15px,20px"
 */
function validateBorderRadiusSlashSyntax(value, rules, strict) {
  let parts;

  // Handle ZyraCSS comma-separated format with "/" as a separate item
  if (value.includes(",/,")) {
    parts = value.split(",/,");
  } else {
    // Handle standard CSS space-separated format
    parts = value.split("/");
  }

  if (parts.length !== 2) {
    return createValidationResult(
      false,
      "Border-radius slash syntax requires exactly one slash separator",
      value
    );
  }

  const [horizontalPart, verticalPart] = parts.map((part) => part.trim());

  if (!horizontalPart || !verticalPart) {
    return createValidationResult(
      false,
      "Border-radius requires values on both sides of slash",
      value
    );
  }

  // Create length rules for validating individual radius values
  const lengthRules = {
    type: "length",
    min: rules.min || 0,
    allowNegative: rules.allowNegative || false,
    allowPercentage: rules.allowPercentage || false,
    allowCalc: rules.allowCalc || false,
    allowFunctions: rules.allowFunctions || false,
    allowMultiple: true,
  };

  // Validate horizontal radii
  const horizontalResult = validateMultipleValuesParts(
    horizontalPart,
    lengthRules,
    "border-radius",
    strict
  );
  if (!horizontalResult.isValid) {
    return createValidationResult(
      false,
      `Invalid horizontal radii: ${horizontalResult.reason}`,
      value
    );
  }

  // Validate vertical radii
  const verticalResult = validateMultipleValuesParts(
    verticalPart,
    lengthRules,
    "border-radius",
    strict
  );
  if (!verticalResult.isValid) {
    return createValidationResult(
      false,
      `Invalid vertical radii: ${verticalResult.reason}`,
      value
    );
  }

  // Reconstruct the normalized value for CSS output
  const normalizedValue = `${horizontalResult.value.replace(/,/g, " ")} / ${verticalResult.value.replace(/,/g, " ")}`;

  return createValidationResult(true, null, normalizedValue, {
    type: "border-radius-slash",
    horizontalRadii: horizontalResult.value,
    verticalRadii: verticalResult.value,
  });
}

/**
 * Validate border-radius complex values with proper constraints
 */
function validateBorderRadiusComplex(value, rules, strict) {
  // First check for invalid color values
  if (validateColorValue(value, {}, strict).isValid) {
    return createValidationResult(
      false,
      "Color values not allowed for border-radius",
      value
    );
  }

  // Check for negative length values
  if (value.startsWith("-") && /^-\d/.test(value)) {
    return createValidationResult(
      false,
      "Negative values not allowed for border-radius",
      value
    );
  }

  // Allow keywords
  if (rules.allowKeywords && rules.allowKeywords.includes(value)) {
    return createValidationResult(true, null, value, { type: "keyword" });
  }

  // For single values, validate as length
  if (!value.includes(" ") && !value.includes(",")) {
    return validateLengthValue(value, rules, strict);
  }

  // For multiple values, validate each as length
  const lengthRules = {
    type: "length",
    min: rules.min || 0,
    allowNegative: rules.allowNegative || false,
    allowPercentage: rules.allowPercentage || false,
    allowCalc: rules.allowCalc || false,
    allowFunctions: rules.allowFunctions || false,
    allowMultiple: true,
  };

  return validateMultipleValuesParts(
    value,
    lengthRules,
    "border-radius",
    strict
  );
}

/**
 * Check if a CSS function is valid and safe
 * @param {string} value - Value to check
 * @returns {boolean} True if valid CSS function
 */
export function isValidCSSFunction(value) {
  const result = validateValue(value, "transform", { strict: false });
  return (
    result.isValid &&
    (result.metadata.type === "function" ||
      result.metadata.type === "calc-function")
  );
}

/**
 * Validates shorthand properties like border and outline
 * @param {string} value - The shorthand value to validate
 * @param {Object} rules - The validation rules
 * @param {boolean} strict - Whether to use strict validation
 * @param {Object} context - The validation context with property information
 * @returns {Object} - Validation result
 */
function validateShorthandProperty(value, rules, strict, context) {
  const propertyName = context?.property;

  if (!propertyName) {
    return {
      isValid: false,
      error: "Property name is required for shorthand validation",
      metadata: { type: "shorthand", property: "unknown" },
    };
  }

  // Determine which validation helpers to use based on property
  let validator;

  if (propertyName.startsWith("border")) {
    validator = validateBorderPart;
  } else if (propertyName.startsWith("outline")) {
    validator = validateOutlinePart;
  } else {
    return {
      isValid: false,
      error: `Unsupported shorthand property: ${propertyName}`,
      metadata: { type: "shorthand", property: propertyName },
    };
  }

  // Handle special keyword values (for the entire shorthand)
  const specialKeywords = ["initial", "inherit", "unset", "revert"];
  if (specialKeywords.includes(value.toLowerCase())) {
    return {
      isValid: true,
      value: value.toLowerCase(),
      metadata: {
        type: "keyword",
        property: propertyName,
        keyword: value.toLowerCase(),
      },
    };
  }

  // Parse the shorthand value using comma splitting
  const parts = splitOnCommas(value);
  const validatedParts = [];
  const usedTypes = new Set();

  for (const part of parts) {
    const result = validator(part.trim());

    if (!result.isValid) {
      return {
        isValid: false,
        error: `Invalid ${propertyName} component: ${part.trim()} - ${result.error}`,
        metadata: {
          type: "shorthand",
          property: propertyName,
          invalidPart: part.trim(),
          originalValue: value,
        },
      };
    }

    // Check for duplicate component types (CSS variables don't count as duplicates)
    if (result.type !== "css-variable" && usedTypes.has(result.type)) {
      return {
        isValid: false,
        error: `Duplicate ${result.type} value in ${propertyName}: ${part.trim()}`,
        metadata: {
          type: "shorthand",
          property: propertyName,
          duplicateType: result.type,
          originalValue: value,
        },
      };
    }

    if (result.type !== "css-variable") {
      usedTypes.add(result.type);
    }
    validatedParts.push(result.value);
  }

  // Ensure we don't have too many parts
  if (validatedParts.length > 3) {
    return {
      isValid: false,
      error: `Too many values for ${propertyName}. Expected at most 3, got ${validatedParts.length}`,
      metadata: {
        type: "shorthand",
        property: propertyName,
        partCount: validatedParts.length,
        originalValue: value,
      },
    };
  }

  // Create the final space-separated value
  const finalValue = validatedParts.join(" ");

  return {
    isValid: true,
    value: finalValue,
    metadata: {
      type: "shorthand",
      property: propertyName,
      components: validatedParts,
      componentTypes: Array.from(usedTypes),
      originalValue: value,
    },
  };
}

// Export property validation rules for compatibility
export { PROPERTY_VALIDATION_RULES };
