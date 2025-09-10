/**
 * Updated Parser with consistent error handling and caching
 * Integrates with new error handling and caching systems with safe regex execution
 */

import { PROPERTY_MAP } from "../maps/index.js";
import {
  sanitizeInput,
  isSafeInput,
  validateClassNameSecurity,
} from "../security/index.js";
import {
  syncSafeRegexTest,
  safeRegexMatch,
  REGEX_TIMEOUTS,
} from "../security/safeRegex.js";
import { parseCSSSyntax } from "./valueParser.js";
import { generateSelector } from "./syntaxValidator.js";
import { validateValue, validateMultipleValues } from "../validators/index.js";
import {
  ZyraResult,
  ZyraError,
  ErrorFactory,
  ValidationResult,
  ParseResult,
} from "../errors/index.js";
import { withParseCache } from "../cache/index.js";
import { isValidString } from "../utils/essential.js";
import { ERROR_MESSAGES } from "../utils/errorMessages.js";
import { parseModifiers } from "../validators/valueValidator/modifiers/index.js";

/**
 * Enhanced class parser with consistent error handling
 * @param {string} className - The utility class to parse
 * @param {boolean} includeModifiers - Whether to process modifiers (colon syntax)
 * @returns {ZyraResult} Result containing parsed class or error
 */
function parseClassCore(className, includeModifiers = true) {
  // Input validation
  if (!isValidString(className)) {
    return ZyraResult.error(
      ErrorFactory.invalidInput(
        className,
        "Class name must be a non-empty string"
      )
    );
  }

  // Smart security validation - check property prefix and value separately
  const securityCheck = validateClassNameSecurity(className);
  if (securityCheck.isDangerous) {
    const patterns = securityCheck.matchedPatterns.map(
      (p) => `${p.name} (${p.riskLevel})`
    );
    const suggestions = securityCheck.matchedPatterns.flatMap((p) =>
      p.description ? [`Avoid: ${p.description}`] : []
    );
    return ZyraResult.error(
      ErrorFactory.dangerousInput(
        className,
        patterns,
        suggestions.length ? suggestions : undefined
      )
    );
  }

  // Security sanitization
  const sanitized = sanitizeInput(className);
  if (!sanitized) {
    return ZyraResult.error(
      ErrorFactory.dangerousInput(className, ["Contains dangerous characters"])
    );
  }

  // Syntax validation
  const syntaxValidation = validateClassSyntax(sanitized);
  if (!syntaxValidation.isValid) {
    return ZyraResult.error(
      ErrorFactory.invalidClassSyntax(
        sanitized,
        syntaxValidation.reason,
        syntaxValidation.suggestions
      )
    );
  }

  // ✅ MODIFIER PARSING SUPPORT (only if includeModifiers is true)
  if (includeModifiers && sanitized.includes(":")) {
    const modifierResult = parseModifiers(sanitized);

    if (modifierResult.className && modifierResult.modifiers.length > 0) {
      // Validate all modifiers are valid
      const invalidModifiers = modifierResult.modifiers.filter(
        (m) => !m.isValid
      );
      if (invalidModifiers.length > 0) {
        return ZyraResult.error(
          ErrorFactory.invalidClassSyntax(
            sanitized,
            `Invalid modifier(s): ${invalidModifiers.map((m) => m.name).join(", ")}`,
            [
              "Supported pseudo-classes: hover, focus, active, disabled, etc.",
              "Supported pseudo-elements: before, after, placeholder, etc.",
              "Supported responsive: sm, md, lg, xl, 2xl",
            ]
          )
        );
      }

      // Parse the base class (without modifiers) recursively
      const baseClassResult = parseClassCore(modifierResult.className, false);
      if (!baseClassResult.success) {
        return baseClassResult; // Return the error from base class parsing
      }

      // Enhance the parsed class with modifier information
      const parsedClass = baseClassResult.data;
      parsedClass.modifiers = modifierResult.modifiers;
      parsedClass.responsive = modifierResult.modifiers.find(
        (m) => m.type === "responsive"
      )?.name;
      parsedClass.pseudoClass = modifierResult.modifiers.find(
        (m) => m.type === "pseudo-class"
      )?.name;
      parsedClass.pseudoElement = modifierResult.modifiers.find(
        (m) => m.type === "pseudo-element"
      )?.name;

      // Update the selector to include modifiers
      // For modifiers, use the FULL class name (including modifiers) as the base selector
      const fullClassSelector = generateSelector(sanitized); // Use the full class name with modifiers
      let enhancedSelector = fullClassSelector;

      // Add CSS pseudo-class/pseudo-element to the selector
      if (parsedClass.pseudoClass) {
        enhancedSelector += `:${parsedClass.pseudoClass}`;
      }
      if (parsedClass.pseudoElement) {
        enhancedSelector += `::${parsedClass.pseudoElement}`;
      }

      parsedClass.selector = enhancedSelector;
      parsedClass.className = sanitized; // Use the original class name with modifiers

      return ZyraResult.success(parsedClass);
    }
  }

  // Parse based on syntax type with safe regex - ONLY bracket syntax
  const bracketMatches = safeRegexMatch(
    /^(--[a-zA-Z0-9-]*|[a-zA-Z][a-zA-Z0-9-]*)-\[([^\]]+)\]$/,
    sanitized,
    REGEX_TIMEOUTS.FAST
  );
  if (bracketMatches && bracketMatches.length >= 3) {
    return parseBracketSyntax(bracketMatches[1], bracketMatches[2]);
  }

  // Handle malformed bracket syntax gracefully
  const malformedBracketMatches = safeRegexMatch(
    /^([a-zA-Z-]+)-\[([^\]]*)/,
    sanitized,
    REGEX_TIMEOUTS.FAST
  );
  if (malformedBracketMatches && malformedBracketMatches.length >= 2) {
    return ZyraResult.error(
      ErrorFactory.invalidClassSyntax(
        sanitized,
        "Unclosed bracket in class name",
        [
          `Complete the bracket: ${malformedBracketMatches[1]}-[${malformedBracketMatches[2] || "value"}]`,
          "Ensure each '[' has a matching ']'",
        ]
      )
    );
  }

  // Handle unopened bracket syntax
  if (sanitized.includes("]") && !sanitized.includes("[")) {
    return ZyraResult.error(
      ErrorFactory.invalidClassSyntax(
        sanitized,
        "Unopened bracket in class name",
        ["Add opening bracket before the value", "Use format: property-[value]"]
      )
    );
  }

  // Handle nested brackets
  if (sanitized.includes("[[") || sanitized.includes("]]")) {
    return ZyraResult.error(
      ErrorFactory.invalidClassSyntax(
        sanitized,
        "Nested brackets not allowed",
        [
          "Use single level brackets only",
          "Example: bg-[rgba(255,0,0,0.5)] not bg-[[color]]",
        ]
      )
    );
  }

  return ZyraResult.error(
    ErrorFactory.invalidClassSyntax(sanitized, "Unknown syntax pattern", [
      "Use bracket syntax: property-[value]",
    ])
  );
}

/**
 * Enhanced syntax validation with detailed feedback
 * @param {string} className - Class name to validate
 * @returns {ValidationResult} Validation result with details
 */
function validateClassSyntax(className) {
  if (!isValidString(className)) {
    return ValidationResult.invalid(
      ErrorFactory.invalidInput(className, ERROR_MESSAGES.INPUT.INVALID_TYPE)
    );
  }

  // Enhanced pattern to support bracket syntax AND modifier syntax (colon-separated)
  // Updated to allow numbers at start for responsive modifiers like "2xl" and -- for CSS custom properties
  const bracketPattern = /^(--[a-zA-Z0-9-]*|[a-zA-Z][a-zA-Z0-9-]*)-\[[^\]]+\]$/;
  const modifierPattern =
    /^([a-zA-Z0-9][a-zA-Z0-9-]*:)*(--[a-zA-Z0-9-]*|[a-zA-Z][a-zA-Z0-9-]*)-\[[^\]]+\]$/;

  const isBracketValid = syncSafeRegexTest(bracketPattern, className, {
    timeout: REGEX_TIMEOUTS.FAST,
  });

  const isModifierValid = syncSafeRegexTest(modifierPattern, className, {
    timeout: REGEX_TIMEOUTS.FAST,
  });

  const isValid = isBracketValid || isModifierValid;

  if (!isValid) {
    const suggestions = [];

    // Specific error analysis
    if (className.includes(" ")) {
      suggestions.push("Remove spaces from class name");
    }
    if (className.includes("[") && !className.includes("]")) {
      suggestions.push("Close bracket with ]");
    }
    if (!className.includes("[") && className.includes("]")) {
      suggestions.push("Open bracket with [");
    }

    const startsWithNumber = syncSafeRegexTest(/^[0-9]/, className, {
      timeout: REGEX_TIMEOUTS.FAST,
    });
    if (startsWithNumber) {
      suggestions.push("Class names cannot start with numbers");
    }

    return ValidationResult.invalid(
      ErrorFactory.invalidClassSyntax(
        className,
        "Invalid character pattern",
        suggestions
      )
    );
  }

  return ValidationResult.valid(className);
}

/**
 * Parse bracket syntax with enhanced error handling
 * @param {string} prefix - Property prefix
 * @param {string} value - CSS value in brackets
 * @returns {ZyraResult} Parse result
 */
function parseBracketSyntax(prefix, value) {
  // Smart property resolution for ambiguous prefixes
  let property = PROPERTY_MAP.get(prefix);

  // Special handling for CSS custom properties (variables starting with --)
  if (!property && prefix.startsWith("--")) {
    property = prefix; // CSS custom properties use their exact name
  }

  if (!property) {
    const availableProperties = getAvailableProperties(prefix);
    return ZyraResult.error(
      ErrorFactory.propertyNotSupported(prefix, availableProperties)
    );
  }

  // Reject direct url() function syntax - use u() syntax instead
  if (/^\s*url\s*\(/i.test(value)) {
    return ZyraResult.error(
      ErrorFactory.invalidCSSValue(
        property,
        value,
        "url() function not supported",
        [
          "Use u() syntax instead: u(your-url-here)",
          "Example: background-image-[u(https://example.com/image.jpg)]",
        ]
      )
    );
  }

  // Value parsing with enhanced validation - pass property for URL processing
  const valueParseResult = parseCSSSyntax(value, property);
  if (!valueParseResult) {
    return ZyraResult.error(
      ErrorFactory.invalidCSSValue(
        property,
        value,
        "Could not parse CSS value",
        ["Check for unmatched parentheses", "Verify CSS function syntax"]
      )
    );
  }

  // Validate that the parsed value is appropriate for the property type
  let validationResult;

  // Properties that should be treated as single complex values even with commas
  const singleComplexProperties = [
    "box-shadow",
    "text-shadow",
    "filter",
    "backdrop-filter",
    "transform",
    "rotate",
    "scale",
    "translate",
    "border-radius", // Add border-radius for slash syntax support
    "font", // Add font for shorthand syntax support
    "border", // Add border for shorthand validation
    "border-top",
    "border-right",
    "border-bottom",
    "border-left",
    "border-block",
    "border-inline",
    "border-block-start",
    "border-block-end",
    "border-inline-start",
    "border-inline-end",
    "outline", // Add outline for shorthand validation
  ];

  // Properties that need comma format validation (due to complex comma handling)
  const commaFormatProperties = ["box-shadow", "text-shadow"];

  if (
    valueParseResult.values.length > 1 &&
    !singleComplexProperties.includes(property)
  ) {
    // Multiple values - validate each individual value
    const multiValidationResult = validateMultipleValues(
      valueParseResult.values,
      property,
      {
        strict: true,
        allowCustomProperties: true,
      }
    );

    if (multiValidationResult.errors.length > 0) {
      const firstError = multiValidationResult.errors[0];
      validationResult = {
        isValid: false,
        reason: `Invalid value "${firstError.value}" at position ${firstError.index + 1}: ${firstError.error}`,
        suggestions: [
          `Each value must be valid for property "${property}"`,
          `Check CSS documentation for valid "${property}" values`,
        ],
      };
    } else {
      validationResult = { isValid: true };
    }
  } else {
    // Single value or complex property - validate the complete value
    // For properties that need comma format, validate original; otherwise validate converted
    const valueToValidate = commaFormatProperties.includes(property)
      ? value
      : valueParseResult.cssValue;

    // Special validation for CSS custom properties
    if (property.startsWith("--")) {
      // CSS custom properties can have any value, just basic validation
      validationResult = { isValid: true };
    } else {
      validationResult = validateValue(valueToValidate, property, {
        strict: true,
        allowCustomProperties: true,
        context: {
          hasUrlFromUSyntax: valueParseResult.hasUrlFromUSyntax,
        },
      });
    }
  }

  if (!validationResult.isValid) {
    return ZyraResult.error(
      ErrorFactory.invalidCSSValue(
        property,
        value,
        validationResult.reason,
        validationResult.suggestions || [
          `Property "${property}" requires a different value type`,
          `Check CSS documentation for valid "${property}" values`,
        ]
      )
    );
  }

  // Create parsed class object
  const parsedClass = {
    className: `${prefix}-[${value}]`,
    prefix,
    property,
    value: valueParseResult.cssValue,
    rawValue: value,
    values: valueParseResult.values,
    syntax: "bracket",
    selector: generateSelector(`${prefix}-[${value}]`),
    isFunction: valueParseResult.isFunction,
    hasUrlFromUSyntax: valueParseResult.hasUrlFromUSyntax,
    metadata: {
      parseTimestamp: Date.now(),
      fromCache: false,
    },
  };

  return ZyraResult.success(parsedClass);
}

/**
 * Check if a value looks like a size/length
 * @param {string} value - CSS value to check
 * @returns {boolean} True if value looks like a size
 */
function isSizeValue(value) {
  // Check for common size unit patterns
  return (
    /^\d+(\.\d+)?(px|em|rem|%|vw|vh|pt|pc|in|cm|mm|ex|ch|vmin|vmax)$/i.test(
      value
    ) || /^\d+(\.\d+)?$/.test(value)
  ); // unitless numbers
}

/**
 * Get available properties for suggestions
 * @param {string} prefix - Attempted prefix
 * @returns {Array<string>} Similar available properties
 */
function getAvailableProperties(prefix) {
  const allPrefixes = Array.from(PROPERTY_MAP.keys());

  // Simple fuzzy matching - find prefixes that start with same letters
  const similar = allPrefixes
    .filter((p) => p.startsWith(prefix.charAt(0)))
    .sort((a, b) => {
      // Sort by similarity (Levenshtein would be better, but this is simple)
      const aDiff = Math.abs(a.length - prefix.length);
      const bDiff = Math.abs(b.length - prefix.length);
      return aDiff - bDiff;
    })
    .slice(0, 5);

  return similar;
}

/**
 * Generate CSS selector with modifier support (pseudo-classes, pseudo-elements, responsive)
 * @param {string} baseSelector - Base CSS selector (.classname)
 * @param {string} responsive - Responsive modifier (sm, md, lg, xl, 2xl)
 * @param {string} pseudoClass - Pseudo-class modifier (hover, focus, active, etc.)
 * @param {string} pseudoElement - Pseudo-element modifier (before, after, etc.)
 * @returns {string} Enhanced CSS selector
 */
function generateModifierSelector(
  baseSelector,
  responsive,
  pseudoClass,
  pseudoElement
) {
  let selector = baseSelector;

  // Add pseudo-class
  if (pseudoClass) {
    selector += `:${pseudoClass}`;
  }

  // Add pseudo-element (note: pseudo-elements use :: syntax)
  if (pseudoElement) {
    selector += `::${pseudoElement}`;
  }

  // For responsive, don't wrap here - let the CSS generator handle media queries
  // Just return the selector with pseudo-classes/elements, responsive will be handled later

  return selector;
}

/**
 * Parse multiple classes with comprehensive error handling
 * @param {Array|string} input - Classes to parse
 * @returns {ParseResult} Parse result with valid and invalid classes
 */
export function parseClasses(input) {
  let classes = [];

  // Input normalization
  if (Array.isArray(input)) {
    classes = input;
  } else if (typeof input === "string") {
    classes = input.trim().split(/\s+/).filter(Boolean);
  } else {
    return ParseResult.withInvalid(
      [],
      [
        ErrorFactory.invalidInput(
          input,
          ERROR_MESSAGES.INPUT.INVALID_COLLECTION
        ),
      ]
    );
  }

  const parsed = [];
  const invalid = [];
  const seen = new Set(); // Deduplication

  for (const className of classes) {
    // Skip duplicates
    if (seen.has(className)) continue;
    seen.add(className);

    // Parse individual class
    const parseResult = parseClass(className);

    if (parseResult.success) {
      parsed.push(parseResult.data);
    } else {
      invalid.push({
        className,
        error: parseResult.error,
        suggestions: parseResult.error.suggestions || [],
      });
    }
  }

  return ParseResult.withInvalid(parsed, invalid);
}

/**
 * Cache-enabled parse function
 */
export const parseClass = withParseCache(parseClassCore);
