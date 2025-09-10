/**
 * Function and Complex Type Validators
 * URLs, CSS custom properties, functions, multi-type values
 */

import { ValidationHelpers, isGlobalKeyword } from "./core.js";
import { isSafeInput } from "../../../security/index.js";
import { normalizeCSSValue } from "../../../utils/index.js";
import { validateCSSFunction } from "../../../utils/cssFunctionValidator.js";
import { splitRespectingParentheses } from "../../../utils/parsing.js";
import {
  RGB_MAX_VALUE,
  HUE_MAX_DEGREES,
} from "../../../security/securityConstants.js";
import {
  validateLengthValue,
  validateNumberValue,
  validateIntegerValue,
  validatePercentageValue,
  validateAngleValue,
  validateTimeValue,
} from "./numeric.js";
import { validateColorValue } from "./color.js";
import { validateKeywordValue } from "./core.js";

/**
 * Validate URL values
 */
export function validateUrlValue(value, rules, strict = false) {
  const trimmed = value.trim();

  // Handle keywords
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return ValidationHelpers.keyword(value);
  }

  return ValidationHelpers.failure("Invalid URL value", value);
}

/**
 * Validate CSS custom property (CSS variable) values
 */
export function validateCustomPropertyValue(value, rules, strict = false) {
  const trimmed = value.trim();

  // CSS custom properties: var(--property-name) or var(--property-name, fallback)
  const varMatch = trimmed.match(/^var\(--[a-zA-Z0-9_-]+(?:,\s*.*?)?\)$/);
  if (varMatch) {
    return ValidationHelpers.successWithType(value, "custom-property");
  }

  return ValidationHelpers.failure("Invalid CSS custom property", value);
}

/**
 * Validate multiple possible value types
 * Tries validators in order until one succeeds
 */
export function validateMultiTypeValue(
  value,
  allowedTypes,
  rules,
  strict = false
) {
  const trimmed = value.trim();

  // Check global keywords first
  if (isGlobalKeyword(trimmed)) {
    return ValidationHelpers.keyword(value);
  }

  // Try each allowed type until one succeeds
  for (const type of allowedTypes) {
    let result;

    switch (type) {
      case "length":
        result = validateLengthValue(value, rules.length || {}, strict);
        break;
      case "color":
        result = validateColorValue(value, rules.color || {}, strict);
        break;
      case "number":
        result = validateNumberValue(value, rules.number || {}, strict);
        break;
      case "integer":
        result = validateIntegerValue(value, rules.integer || {}, strict);
        break;
      case "percentage":
        result = validatePercentageValue(value, rules.percentage || {}, strict);
        break;
      case "angle":
        result = validateAngleValue(value, rules.angle || {}, strict);
        break;
      case "time":
        result = validateTimeValue(value, rules.time || {}, strict);
        break;
      case "custom-property":
        result = validateCustomPropertyValue(
          value,
          rules.customProperty || {},
          strict
        );
        break;
      case "keyword":
        result = validateKeywordValue(value, rules.keyword || {}, strict);
        break;
      default:
        continue;
    }

    if (result.isValid) {
      return result;
    }
  }

  return ValidationHelpers.failure(
    `Value does not match any allowed types: ${allowedTypes.join(", ")}`,
    value
  );
}

/**
 * Validate comma-separated list of values
 */
export function validateValueList(value, itemValidator, rules, strict = false) {
  const trimmed = value.trim();

  // Split by comma but respect function parentheses
  const values = splitRespectingParentheses(trimmed, ",");

  if (rules.minItems && values.length < rules.minItems) {
    return ValidationHelpers.failure(
      `List must have at least ${rules.minItems} items`,
      value
    );
  }

  if (rules.maxItems && values.length > rules.maxItems) {
    return ValidationHelpers.failure(
      `List cannot have more than ${rules.maxItems} items`,
      value
    );
  }

  const validatedValues = [];
  for (let i = 0; i < values.length; i++) {
    const itemValue = values[i].trim();
    const result = itemValidator(itemValue, rules.itemRules || {}, strict);

    if (!result.isValid) {
      return ValidationHelpers.failure(
        `Invalid item at position ${i + 1}: ${result.reason}`,
        value
      );
    }

    validatedValues.push(result.value);
  }

  return ValidationHelpers.successWithType(validatedValues.join(", "), "list", {
    items: validatedValues.length,
  });
}

/**
 * Validate CSS function values (like transform functions)
 */
export function validateCSSFunctionValue(
  value,
  rules,
  strict = false,
  context = {}
) {
  const trimmed = value.trim();

  // Handle keywords first
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return ValidationHelpers.keyword(value);
  }

  // Check if it's a function call
  const functionMatch = trimmed.match(/^([a-z0-9-]+)\((.*)\)$/i);
  if (functionMatch) {
    const [, functionName, args] = functionMatch;

    // Check if the function is allowed
    if (rules.functions && rules.functions.includes(functionName)) {
      // Split arguments and normalize any calc expressions
      // Use splitRespectingParentheses to handle nested functions like rgba(), max(), etc.
      const argList = splitRespectingParentheses(args, ",").map((arg) => {
        const cleanArg = arg.trim();
        // If this argument contains calc, normalize it
        if (cleanArg.includes("calc(") && rules.allowCalc) {
          return normalizeCSSValue(cleanArg);
        }
        return cleanArg;
      });

      // Reconstruct the function with normalized arguments
      const normalizedValue = `${functionName}(${argList.join(",")})`;

      // Use the existing CSS function validator with context
      const isValid = validateCSSFunction(
        normalizedValue,
        context.hasUrlFromUSyntax
      );
      if (isValid) {
        return ValidationHelpers.successWithType(normalizedValue, "function", {
          functionName,
          args: argList,
        });
      }

      // For timing functions, perform specific validation
      if (functionName === "cubic-bezier") {
        return validateCubicBezierFunction(argList, normalizedValue);
      }

      if (functionName === "steps") {
        return validateStepsFunction(argList, normalizedValue);
      }

      // For color functions, perform specific validation
      if (functionName === "rgb" || functionName === "rgba") {
        return validateRgbFunction(argList, normalizedValue);
      }

      if (functionName === "hsl" || functionName === "hsla") {
        return validateHslFunction(argList, normalizedValue);
      }

      // For now, return success if function name is in the allowed list
      return ValidationHelpers.successWithType(normalizedValue, "function", {
        functionName,
        args: argList,
      });
    }
  }

  return ValidationHelpers.failure("Invalid CSS function value", value);
}

/**
 * Validate CSS content property values
 */
export function validateContentValue(value, rules, strict = false) {
  const trimmed = value.trim();

  // Handle keywords
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return ValidationHelpers.keyword(value);
  }

  // Handle quoted strings (for content property)
  if (rules.allowStrings) {
    // Match quoted strings: "text" or 'text'
    const stringMatch = trimmed.match(/^["'](.*)["']$/);
    if (stringMatch) {
      const content = stringMatch[1];
      return ValidationHelpers.successWithType(value, "string", { content });
    }
  }

  // Handle attr() function
  if (rules.allowAttr && trimmed.match(/^attr\([^)]+\)$/)) {
    return ValidationHelpers.successWithType(value, "attr", {});
  }

  // Handle counter functions
  if (
    rules.allowCounters &&
    (trimmed.match(/^counter\([^)]+\)$/) ||
      trimmed.match(/^counters\([^)]+\)$/))
  ) {
    return ValidationHelpers.successWithType(value, "counter", {});
  }

  return ValidationHelpers.failure("Invalid content value", value);
}

/**
 * Validate cubic-bezier timing function
 * cubic-bezier(x1, y1, x2, y2) where x1 and x2 must be between 0 and 1, y1 and y2 can be any value
 */
function validateCubicBezierFunction(argList, normalizedValue) {
  if (argList.length !== 4) {
    return ValidationHelpers.failure(
      "cubic-bezier requires exactly 4 arguments",
      normalizedValue
    );
  }

  // x1 and x2 (first and third arguments) must be between 0 and 1
  const x1 = parseFloat(argList[0].trim());
  const x2 = parseFloat(argList[2].trim());

  if (isNaN(x1) || x1 < 0 || x1 > 1) {
    return ValidationHelpers.failure(
      "cubic-bezier x1 (first argument) must be between 0 and 1",
      normalizedValue
    );
  }

  if (isNaN(x2) || x2 < 0 || x2 > 1) {
    return ValidationHelpers.failure(
      "cubic-bezier x2 (third argument) must be between 0 and 1",
      normalizedValue
    );
  }

  // y1 and y2 (second and fourth arguments) can be any numeric value
  const y1 = parseFloat(argList[1].trim());
  const y2 = parseFloat(argList[3].trim());

  if (isNaN(y1) || isNaN(y2)) {
    return ValidationHelpers.failure(
      "cubic-bezier y values must be numeric",
      normalizedValue
    );
  }

  return ValidationHelpers.successWithType(normalizedValue, "function", {
    functionName: "cubic-bezier",
    args: argList,
  });
}

/**
 * Validate steps timing function
 * steps(number, position) where number must be positive integer
 */
function validateStepsFunction(argList, normalizedValue) {
  if (argList.length < 1 || argList.length > 2) {
    return ValidationHelpers.failure(
      "steps requires 1 or 2 arguments",
      normalizedValue
    );
  }

  const stepCount = parseInt(argList[0].trim(), 10);
  if (isNaN(stepCount) || stepCount <= 0) {
    return ValidationHelpers.failure(
      "steps count must be a positive integer",
      normalizedValue
    );
  }

  if (argList.length === 2) {
    const position = argList[1].trim();
    const validPositions = [
      "start",
      "end",
      "jump-start",
      "jump-end",
      "jump-none",
      "jump-both",
    ];
    if (!validPositions.includes(position)) {
      return ValidationHelpers.failure(
        `invalid steps position: ${position}`,
        normalizedValue
      );
    }
  }

  return ValidationHelpers.successWithType(normalizedValue, "function", {
    functionName: "steps",
    args: argList,
  });
}

/**
 * Validate RGB color function
 * rgb(r, g, b) or rgba(r, g, b, a) where r,g,b are 0-${RGB_MAX_VALUE} and a is 0-1
 */
function validateRgbFunction(argList, normalizedValue) {
  if (argList.length < 3 || argList.length > 4) {
    return ValidationHelpers.failure(
      "rgb/rgba requires 3 or 4 arguments",
      normalizedValue
    );
  }

  // Validate RGB values (0-${RGB_MAX_VALUE})
  for (let i = 0; i < 3; i++) {
    const value = parseFloat(argList[i].trim());
    if (isNaN(value) || value < 0 || value > RGB_MAX_VALUE) {
      return ValidationHelpers.failure(
        `RGB value ${i + 1} must be between 0 and ${RGB_MAX_VALUE}`,
        normalizedValue
      );
    }
  }

  // Validate alpha value if present (0-1)
  if (argList.length === 4) {
    const alpha = parseFloat(argList[3].trim());
    if (isNaN(alpha) || alpha < 0 || alpha > 1) {
      return ValidationHelpers.failure(
        "Alpha value must be between 0 and 1",
        normalizedValue
      );
    }
  }

  return ValidationHelpers.successWithType(normalizedValue, "function", {
    functionName: "rgb",
    args: argList,
  });
}

/**
 * Validate HSL color function
 * hsl(h, s%, l%) or hsla(h, s%, l%, a) where h is 0-${HUE_MAX_DEGREES}, s,l are 0-100%, a is 0-1
 */
function validateHslFunction(argList, normalizedValue) {
  if (argList.length < 3 || argList.length > 4) {
    return ValidationHelpers.failure(
      "hsl/hsla requires 3 or 4 arguments",
      normalizedValue
    );
  }

  // Validate hue (0-${HUE_MAX_DEGREES}, but allow any number as it wraps)
  const hue = parseFloat(argList[0].trim());
  if (isNaN(hue)) {
    return ValidationHelpers.failure("Hue must be a number", normalizedValue);
  }

  // Validate saturation and lightness (0-100%)
  for (let i = 1; i < 3; i++) {
    const valueStr = argList[i].trim();
    if (!valueStr.endsWith("%")) {
      return ValidationHelpers.failure(
        `HSL saturation and lightness must be percentages`,
        normalizedValue
      );
    }
    const value = parseFloat(valueStr.slice(0, -1));
    if (isNaN(value) || value < 0 || value > 100) {
      return ValidationHelpers.failure(
        `HSL ${i === 1 ? "saturation" : "lightness"} must be between 0% and 100%`,
        normalizedValue
      );
    }
  }

  // Validate alpha value if present (0-1)
  if (argList.length === 4) {
    const alpha = parseFloat(argList[3].trim());
    if (isNaN(alpha) || alpha < 0 || alpha > 1) {
      return ValidationHelpers.failure(
        "Alpha value must be between 0 and 1",
        normalizedValue
      );
    }
  }

  return ValidationHelpers.successWithType(normalizedValue, "function", {
    functionName: "hsl",
    args: argList,
  });
}
