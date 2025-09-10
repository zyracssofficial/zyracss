/**
 * Color Type Validators
 * Color values including hex, rgb, hsl, named colors
 */

import { ValidationHelpers } from "./core.js";
import { isCSSColor } from "../../../utils/index.js";
import {
  RGB_MAX_VALUE,
  HUE_MAX_DEGREES,
} from "../../../security/securityConstants.js";

/**
 * Validate RGB function arguments
 */
function validateRgbArguments(args) {
  if (args.length < 3 || args.length > 4) {
    return { valid: false, reason: "RGB requires 3 or 4 arguments" };
  }

  // Validate RGB values (0-255)
  for (let i = 0; i < 3; i++) {
    const value = parseFloat(args[i].trim());
    if (isNaN(value) || value < 0 || value > RGB_MAX_VALUE) {
      return {
        valid: false,
        reason: `RGB value ${i + 1} must be between 0 and ${RGB_MAX_VALUE}`,
      };
    }
  }

  // Validate alpha value if present (0-1)
  if (args.length === 4) {
    const alpha = parseFloat(args[3].trim());
    if (isNaN(alpha) || alpha < 0 || alpha > 1) {
      return { valid: false, reason: "Alpha value must be between 0 and 1" };
    }
  }

  return { valid: true };
}

/**
 * Validate HSL function arguments
 */
function validateHslArguments(args) {
  if (args.length < 3 || args.length > 4) {
    return { valid: false, reason: "HSL requires 3 or 4 arguments" };
  }

  // Validate hue (0-360, but allow any number as it wraps)
  const hue = parseFloat(args[0].trim());
  if (isNaN(hue)) {
    return { valid: false, reason: "Hue must be a number" };
  }

  // Validate saturation and lightness (0-100%)
  for (let i = 1; i < 3; i++) {
    const valueStr = args[i].trim();
    if (!valueStr.endsWith("%")) {
      return {
        valid: false,
        reason: "HSL saturation and lightness must be percentages",
      };
    }
    const value = parseFloat(valueStr.slice(0, -1));
    if (isNaN(value) || value < 0 || value > 100) {
      return {
        valid: false,
        reason: `HSL ${i === 1 ? "saturation" : "lightness"} must be between 0% and 100%`,
      };
    }
  }

  // Validate alpha value if present (0-1)
  if (args.length === 4) {
    const alpha = parseFloat(args[3].trim());
    if (isNaN(alpha) || alpha < 0 || alpha > 1) {
      return { valid: false, reason: "Alpha value must be between 0 and 1" };
    }
  }

  return { valid: true };
}

/**
 * Validate color values (hex, rgb, hsl, named colors)
 */
export function validateColorValue(value, rules, strict = false) {
  const trimmed = value.trim().toLowerCase();

  // Handle keywords
  if (rules.allowKeywords && rules.allowKeywords.includes(trimmed)) {
    return ValidationHelpers.keyword(value);
  }

  // Check for RGB/RGBA functions and validate arguments
  const rgbMatch = trimmed.match(/^rgba?\(\s*([^)]+)\s*\)$/);
  if (rgbMatch) {
    const args = rgbMatch[1].split(",");
    const validation = validateRgbArguments(args);
    if (!validation.valid) {
      return ValidationHelpers.failure(validation.reason, value);
    }
    return ValidationHelpers.color(value);
  }

  // Check for HSL/HSLA functions and validate arguments
  const hslMatch = trimmed.match(/^hsla?\(\s*([^)]+)\s*\)$/);
  if (hslMatch) {
    const args = hslMatch[1].split(",");
    const validation = validateHslArguments(args);
    if (!validation.valid) {
      return ValidationHelpers.failure(validation.reason, value);
    }
    return ValidationHelpers.color(value);
  }

  // Use utility function for other color validation (hex, named colors, etc.)
  if (isCSSColor(trimmed)) {
    return ValidationHelpers.color(value);
  }

  return ValidationHelpers.failure(
    "Value must be a valid CSS color (hex: #fff, rgb: rgb(255,0,0), hsl: hsl(0,100%,50%), or named color)",
    value
  );
}
