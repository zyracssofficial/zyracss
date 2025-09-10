/**
 * Numeric Type Validators
 * Numbers, integers, lengths, percentages, angles, time values
 */

import { ValidationHelpers, isGlobalKeyword } from "./core.js";
import { isCSSLength, normalizeCSSValue } from "../../../utils/index.js";
import { validateCSSFunction } from "../../../utils/cssFunctionValidator.js";

/**
 * Check if a unit is a valid CSS length unit
 */
export function isValidLengthUnit(unit) {
  const validUnits = [
    // Absolute lengths
    "px",
    "pt",
    "pc",
    "in",
    "cm",
    "mm",
    "q",
    // Relative lengths
    "em",
    "rem",
    "ex",
    "ch",
    "lh",
    "rlh",
    // Viewport units
    "vw",
    "vh",
    "vmin",
    "vmax",
    "vi",
    "vb",
    // Container units
    "cqw",
    "cqh",
    "cqi",
    "cqb",
    "cqmin",
    "cqmax",
    // Flexible lengths
    "fr",
    // Percentage
    "%",
  ];
  return validUnits.includes(unit.toLowerCase());
}

/**
 * Validate length values (px, em, rem, %, etc.)
 */
export function validateLengthValue(value, rules, strict = false) {
  const trimmed = value.trim();

  // Handle CSS functions using centralized validator (calc, clamp, min, max, etc.)
  if (rules.allowCalc && trimmed.includes("(") && trimmed.includes(")")) {
    // Normalize ZyraCSS syntax to proper CSS syntax for all supported functions
    const normalizedFunction = normalizeCSSFunction(trimmed);

    if (validateCSSFunction(normalizedFunction)) {
      const functionName = normalizedFunction.split("(")[0];
      return ValidationHelpers.successWithType(normalizedFunction, "function", {
        function: functionName,
        originalValue: trimmed, // Keep track of original ZyraCSS syntax
      });
    } else {
      return ValidationHelpers.failure(
        `Invalid CSS function: ${trimmed}`,
        value
      );
    }
  }

  // Handle keywords
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return ValidationHelpers.keyword(value);
  }

  // Handle zero without unit
  if (trimmed === "0") {
    return ValidationHelpers.successWithType(value, "length");
  }

  // Parse length value
  const lengthMatch = trimmed.match(/^([+-]?\d*\.?\d+)([a-zA-Z%]+)$/);
  if (lengthMatch) {
    const [, numStr, unit] = lengthMatch;
    const numValue = parseFloat(numStr);

    // Validate unit
    if (!isValidLengthUnit(unit)) {
      return ValidationHelpers.failure(
        `Unit '${unit}' is not a valid CSS length unit. Use px, em, rem, %, vh, vw, etc.`,
        value
      );
    }

    // Check value constraints
    if (rules.min !== null && rules.min !== undefined && numValue < rules.min) {
      return ValidationHelpers.failure(
        `Value ${numValue} is below minimum ${rules.min}`,
        value
      );
    }

    if (rules.max !== null && rules.max !== undefined && numValue > rules.max) {
      return ValidationHelpers.failure(
        `Value ${numValue} is above maximum ${rules.max}`,
        value
      );
    }

    if (!rules.allowNegative && numValue < 0) {
      return ValidationHelpers.failure("Negative values not allowed", value);
    }

    return ValidationHelpers.length(value);
  }

  // If not a valid length or allowed keyword, reject
  return ValidationHelpers.failure("Invalid value for length property", value);
}

/**
 * Validate number values
 */
export function validateNumberValue(value, rules, strict = false) {
  const trimmed = value.trim();

  // Handle keywords
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return ValidationHelpers.keyword(value);
  }

  const numberMatch = trimmed.match(/^([+-]?\d*\.?\d+)$/);
  if (numberMatch) {
    const numValue = parseFloat(numberMatch[1]);

    // Check numberRange constraint (for properties like font-weight)
    if (rules.numberRange) {
      const [min, max] = rules.numberRange;
      if (numValue < min || numValue > max) {
        return ValidationHelpers.failure(
          `Number ${numValue} out of range ${min}-${max}`,
          value
        );
      }
    }

    // Check individual min/max constraints
    if (rules.min !== null && rules.min !== undefined && numValue < rules.min) {
      return ValidationHelpers.failure(
        `Value ${numValue} is below minimum ${rules.min}`,
        value
      );
    }

    if (rules.max !== null && rules.max !== undefined && numValue > rules.max) {
      return ValidationHelpers.failure(
        `Value ${numValue} is above maximum ${rules.max}`,
        value
      );
    }

    if (!rules.allowNegative && numValue < 0) {
      return ValidationHelpers.failure("Negative values not allowed", value);
    }

    return ValidationHelpers.number(value);
  }

  return ValidationHelpers.failure(
    "Value must be a valid number (e.g., 0, 1.5, -2.3)",
    value
  );
}

/**
 * Validate integer values
 */
export function validateIntegerValue(value, rules, strict = false) {
  const trimmed = value.trim();

  // Handle keywords
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return ValidationHelpers.keyword(value);
  }

  const intMatch = trimmed.match(/^([+-]?\d+)$/);
  if (intMatch) {
    const intValue = parseInt(intMatch[1], 10);

    // Check constraints
    if (rules.min !== null && rules.min !== undefined && intValue < rules.min) {
      return ValidationHelpers.failure(
        `Value ${intValue} is below minimum ${rules.min}`,
        value
      );
    }

    if (rules.max !== null && rules.max !== undefined && intValue > rules.max) {
      return ValidationHelpers.failure(
        `Value ${intValue} is above maximum ${rules.max}`,
        value
      );
    }

    if (!rules.allowNegative && intValue < 0) {
      return ValidationHelpers.failure("Negative values not allowed", value);
    }

    return ValidationHelpers.successWithType(value, "integer");
  }

  return ValidationHelpers.failure("Invalid integer value", value);
}

/**
 * Validate percentage values
 */
export function validatePercentageValue(value, rules, strict = false) {
  const trimmed = value.trim();

  // Handle keywords
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return ValidationHelpers.keyword(value);
  }

  const percentMatch = trimmed.match(/^([+-]?\d*\.?\d+)%$/);
  if (percentMatch) {
    const numValue = parseFloat(percentMatch[1]);

    // Check constraints
    if (rules.min !== null && rules.min !== undefined && numValue < rules.min) {
      return ValidationHelpers.failure(
        `Value ${numValue}% is below minimum ${rules.min}%`,
        value
      );
    }

    if (rules.max !== null && rules.max !== undefined && numValue > rules.max) {
      return ValidationHelpers.failure(
        `Value ${numValue}% is above maximum ${rules.max}%`,
        value
      );
    }

    if (!rules.allowNegative && numValue < 0) {
      return ValidationHelpers.failure(
        "Negative percentages not allowed",
        value
      );
    }

    return ValidationHelpers.successWithType(value, "percentage");
  }

  return ValidationHelpers.failure(
    "Value must be a valid percentage (e.g., 50%, 100%, 0%)",
    value
  );
}

/**
 * Validate angle values (deg, rad, grad, turn)
 */
export function validateAngleValue(value, rules, strict = false) {
  const trimmed = value.trim();

  // Handle keywords
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return ValidationHelpers.keyword(value);
  }

  const angleMatch = trimmed.match(/^([+-]?\d*\.?\d+)(deg|rad|grad|turn)$/);
  if (angleMatch) {
    const [, numStr, unit] = angleMatch;
    const numValue = parseFloat(numStr);

    // Check constraints
    if (rules.min !== null && rules.min !== undefined && numValue < rules.min) {
      return ValidationHelpers.failure(
        `Value ${numValue} is below minimum ${rules.min}`,
        value
      );
    }

    if (rules.max !== null && rules.max !== undefined && numValue > rules.max) {
      return ValidationHelpers.failure(
        `Value ${numValue} is above maximum ${rules.max}`,
        value
      );
    }

    return ValidationHelpers.successWithType(value, "angle");
  }

  return ValidationHelpers.failure("Invalid angle value", value);
}

/**
 * Validate time values (s, ms)
 */
export function validateTimeValue(value, rules, strict = false) {
  const trimmed = value.trim();

  // Handle CSS functions using centralized validator (calc, clamp, min, max, etc.)
  if (rules.allowCalc && trimmed.includes("(") && trimmed.includes(")")) {
    // Normalize ZyraCSS syntax to proper CSS syntax for all supported functions
    const normalizedFunction = normalizeCSSFunction(trimmed);

    if (validateCSSFunction(normalizedFunction)) {
      const functionName = normalizedFunction.split("(")[0];
      return ValidationHelpers.successWithType(normalizedFunction, "function", {
        function: functionName,
        originalValue: trimmed, // Keep track of original ZyraCSS syntax
      });
    } else {
      return ValidationHelpers.failure(
        `Invalid CSS function: ${trimmed}`,
        value
      );
    }
  }

  // Handle keywords
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return ValidationHelpers.keyword(value);
  }

  const timeMatch = trimmed.match(/^([+-]?\d*\.?\d+)(s|ms)$/);
  if (timeMatch) {
    const [, numStr, unit] = timeMatch;
    const numValue = parseFloat(numStr);

    // Check constraints
    if (rules.min !== null && rules.min !== undefined && numValue < rules.min) {
      return ValidationHelpers.failure(
        `Value ${numValue} is below minimum ${rules.min}`,
        value
      );
    }

    if (!rules.allowNegative && numValue < 0) {
      return ValidationHelpers.failure("Negative values not allowed", value);
    }

    return ValidationHelpers.successWithType(value, "time");
  }

  return ValidationHelpers.failure("Invalid time value", value);
}

/**
 * Normalize CSS function expressions from ZyraCSS syntax to CSS syntax
 */
function normalizeCSSFunction(functionExpression) {
  // Extract function name and content
  const match = functionExpression.match(/^([a-z-]+)\((.*)\)$/);
  if (!match) {
    return functionExpression; // Not a function expression, return as-is
  }

  const [, functionName, content] = match;

  // Handle different function types
  switch (functionName) {
    case "calc":
      return normalizeCalcExpression(functionExpression);

    case "min":
    case "max":
    case "clamp":
      // For min/max/clamp, ensure proper spacing around commas
      // min(800px,90vw) → min(800px, 90vw)
      const parts = content.split(",").map((part) => part.trim());
      const normalizedContent = parts.join(", ");
      return `${functionName}(${normalizedContent})`;

    default:
      // For other functions, just return as-is
      return functionExpression;
  }
}

/**
 * Normalize calc expressions from ZyraCSS syntax to CSS syntax
 */
function normalizeCalcExpression(calcExpression) {
  // Extract the content inside the calc() function
  const match = calcExpression.match(/^calc\((.*)\)$/);
  if (!match) {
    return calcExpression; // Not a calc expression, return as-is
  }

  const expression = match[1];

  // Add spaces around operators (+, -, *, /) but be careful not to break negative numbers
  let normalized = expression;

  // Handle operators by adding spaces around them
  // Be careful with minus - only add spaces if it's an operator, not a negative number
  normalized = normalized.replace(/([0-9%])-/g, "$1 - "); // 100%- becomes 100% -
  normalized = normalized.replace(/\)-/g, ") - "); // )- becomes ) -

  // Handle plus operator
  normalized = normalized.replace(/([0-9%])\+/g, "$1 + "); // 100%+ becomes 100% +
  normalized = normalized.replace(/\)\+/g, ") + "); // )+ becomes ) +

  // Handle multiplication operator
  normalized = normalized.replace(/([0-9%])\*/g, "$1 * "); // 100%* becomes 100% *
  normalized = normalized.replace(/\)\*/g, ") * "); // )* becomes ) *

  // Handle division operator
  normalized = normalized.replace(/([0-9%])\//g, "$1 / "); // 100%/ becomes 100% /
  normalized = normalized.replace(/\)\//g, ") / "); // )/ becomes ) /

  // Clean up any double spaces
  normalized = normalized.replace(/\s+/g, " ").trim();

  return `calc(${normalized})`;
}
