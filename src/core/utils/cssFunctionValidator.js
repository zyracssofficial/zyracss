/**
 * Centralized CSS Function Validation for ZyraCSS
 * Consolidates all CSS function validation logic into one authoritative source
 * Eliminates duplication between cssGenerator.js, valueValidator.js, and valueParser.js
 */

import {
  syncSafeRegexTest,
  safeRegexMatch,
  REGEX_TIMEOUTS,
} from "../security/safeRegex.js";

/**
 * Comprehensive CSS function definitions with validation rules
 * Single source of truth for all CSS functions supported by ZyraCSS
 */
export const CSS_FUNCTIONS = new Map([
  // Color functions
  [
    "rgb",
    {
      minArgs: 3,
      maxArgs: 3,
      category: "color",
      description: "RGB color function",
    },
  ],
  [
    "rgba",
    {
      minArgs: 4,
      maxArgs: 4,
      category: "color",
      description: "RGBA color function with alpha",
    },
  ],
  [
    "hsl",
    {
      minArgs: 3,
      maxArgs: 3,
      category: "color",
      description: "HSL color function",
    },
  ],
  [
    "hsla",
    {
      minArgs: 4,
      maxArgs: 4,
      category: "color",
      description: "HSLA color function with alpha",
    },
  ],
  [
    "oklch",
    {
      minArgs: 3,
      maxArgs: 4,
      category: "color",
      description: "OKLCH color function",
    },
  ],
  [
    "oklab",
    {
      minArgs: 3,
      maxArgs: 4,
      category: "color",
      description: "OKLAB color function",
    },
  ],
  [
    "lab",
    {
      minArgs: 3,
      maxArgs: 4,
      category: "color",
      description: "LAB color function",
    },
  ],
  [
    "lch",
    {
      minArgs: 3,
      maxArgs: 4,
      category: "color",
      description: "LCH color function",
    },
  ],

  // Length and calculation functions
  [
    "calc",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "length",
      description: "CSS calc() function",
    },
  ],
  [
    "min",
    {
      minArgs: 1,
      maxArgs: Infinity,
      category: "length",
      description: "CSS min() function",
    },
  ],
  [
    "max",
    {
      minArgs: 1,
      maxArgs: Infinity,
      category: "length",
      description: "CSS max() function",
    },
  ],
  [
    "clamp",
    {
      minArgs: 3,
      maxArgs: 3,
      category: "length",
      description: "CSS clamp() function",
    },
  ],

  // CSS Variables
  [
    "var",
    {
      minArgs: 1,
      maxArgs: 2,
      category: "variable",
      description: "CSS custom property variable",
    },
  ],
  [
    "env",
    {
      minArgs: 1,
      maxArgs: 2,
      category: "variable",
      description: "CSS environment variable",
    },
  ],

  // Transform functions
  [
    "translate",
    {
      minArgs: 1,
      maxArgs: 2,
      category: "transform",
      description: "2D translate transform",
    },
  ],
  [
    "translateX",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "transform",
      description: "X-axis translate transform",
    },
  ],
  [
    "translateY",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "transform",
      description: "Y-axis translate transform",
    },
  ],
  [
    "rotate",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "transform",
      description: "Rotation transform",
    },
  ],
  [
    "scale",
    {
      minArgs: 1,
      maxArgs: 2,
      category: "transform",
      description: "Scale transform",
    },
  ],
  [
    "scaleX",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "transform",
      description: "X-axis scale transform",
    },
  ],
  [
    "scaleY",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "transform",
      description: "Y-axis scale transform",
    },
  ],

  // 3D Transform functions
  [
    "translate3d",
    {
      minArgs: 3,
      maxArgs: 3,
      category: "transform",
      description: "3D translate transform",
    },
  ],
  [
    "translateZ",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "transform",
      description: "Z-axis translate transform",
    },
  ],
  [
    "rotate3d",
    {
      minArgs: 4,
      maxArgs: 4,
      category: "transform",
      description: "3D rotate transform",
    },
  ],
  [
    "rotateX",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "transform",
      description: "X-axis rotate transform",
    },
  ],
  [
    "rotateY",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "transform",
      description: "Y-axis rotate transform",
    },
  ],
  [
    "rotateZ",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "transform",
      description: "Z-axis rotate transform",
    },
  ],
  [
    "scale3d",
    {
      minArgs: 3,
      maxArgs: 3,
      category: "transform",
      description: "3D scale transform",
    },
  ],
  [
    "scaleZ",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "transform",
      description: "Z-axis scale transform",
    },
  ],
  [
    "matrix",
    {
      minArgs: 6,
      maxArgs: 6,
      category: "transform",
      description: "2D matrix transform",
    },
  ],
  [
    "matrix3d",
    {
      minArgs: 16,
      maxArgs: 16,
      category: "transform",
      description: "3D matrix transform",
    },
  ],
  [
    "skew",
    {
      minArgs: 1,
      maxArgs: 2,
      category: "transform",
      description: "Skew transform",
    },
  ],
  [
    "skewX",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "transform",
      description: "X-axis skew transform",
    },
  ],
  [
    "skewY",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "transform",
      description: "Y-axis skew transform",
    },
  ],
  [
    "perspective",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "transform",
      description: "Perspective transform",
    },
  ],

  // Gradient functions
  [
    "linear-gradient",
    {
      minArgs: 2,
      maxArgs: Infinity,
      category: "gradient",
      description: "Linear gradient",
    },
  ],
  [
    "radial-gradient",
    {
      minArgs: 2,
      maxArgs: Infinity,
      category: "gradient",
      description: "Radial gradient",
    },
  ],
  [
    "conic-gradient",
    {
      minArgs: 2,
      maxArgs: Infinity,
      category: "gradient",
      description: "Conic gradient",
    },
  ],

  // Image functions
  [
    "image",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "url",
      description: "Image reference",
    },
  ],

  // Animation timing functions
  [
    "cubic-bezier",
    {
      minArgs: 4,
      maxArgs: 4,
      category: "timing",
      description: "Cubic bezier timing function",
    },
  ],
  [
    "steps",
    {
      minArgs: 1,
      maxArgs: 2,
      category: "timing",
      description: "Steps timing function",
    },
  ],

  // Grid layout functions
  [
    "repeat",
    {
      minArgs: 2,
      maxArgs: 2,
      category: "grid",
      description: "Grid repeat function",
    },
  ],
  [
    "minmax",
    {
      minArgs: 2,
      maxArgs: 2,
      category: "grid",
      description: "Grid minmax function",
    },
  ],
  [
    "fit-content",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "grid",
      description: "Grid fit-content function",
    },
  ],

  // Filter functions
  [
    "blur",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "filter",
      description: "Blur filter",
    },
  ],
  [
    "brightness",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "filter",
      description: "Brightness filter",
    },
  ],
  [
    "contrast",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "filter",
      description: "Contrast filter",
    },
  ],
  [
    "saturate",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "filter",
      description: "Saturate filter",
    },
  ],
  [
    "hue-rotate",
    {
      minArgs: 1,
      maxArgs: 1,
      category: "filter",
      description: "Hue rotation filter",
    },
  ],
  [
    "drop-shadow",
    {
      minArgs: 3,
      maxArgs: 5,
      category: "filter",
      description: "Drop shadow filter",
    },
  ],
]);

/**
 * CSS Function Argument Validators
 * Specific validation logic for different types of CSS function arguments
 */
export class CSSFunctionValidators {
  /**
   * Validate RGB/RGBA color arguments
   */
  static validateColorArgs(args, functionName) {
    return args.every((arg) => {
      const num = parseFloat(arg);
      return (
        !isNaN(num) && num >= 0 && (arg.includes("%") ? num <= 100 : num <= 255)
      );
    });
  }

  /**
   * Validate HSL/HSLA color arguments
   */
  static validateHSLArgs(args) {
    const [h, s, l, a] = args;
    const hue = parseFloat(h);
    const sat = parseFloat(s);
    const light = parseFloat(l);

    if (isNaN(hue) || hue < 0 || hue > 360) return false;
    if (isNaN(sat) || sat < 0 || sat > 100) return false;
    if (isNaN(light) || light < 0 || light > 100) return false;

    if (a !== undefined) {
      const alpha = parseFloat(a);
      if (isNaN(alpha) || alpha < 0 || alpha > 1) return false;
    }

    return true;
  }

  /**
   * Validate calc() expression arguments
   */
  static validateCalcArgs(args) {
    const calcExpr = args[0];
    return syncSafeRegexTest(/^[\d\s+\-*/.()%a-zA-Z-]+$/, calcExpr, {
      timeout: REGEX_TIMEOUTS.FAST,
    });
  }

  /**
   * Validate length arguments (px, em, rem, %, etc.)
   */
  static validateLengthArgs(args) {
    return args.every((arg) => {
      const trimmedArg = arg.trim();

      // Allow calc() functions for lengths - basic validation without circular dependency
      if (trimmedArg.startsWith("calc(") && trimmedArg.endsWith(")")) {
        const calcContent = trimmedArg.slice(5, -1); // Remove 'calc(' and ')'
        // Basic validation for calc content - allow numbers, operators, and units
        return /^[\d\s+\-*/.()%a-zA-Z-]+$/.test(calcContent);
      }

      // Allow regular length values
      const lengthTest = syncSafeRegexTest(
        /^-?[\d.]+(?:px|em|rem|%|vh|vw|in|cm|mm|pt|pc|ex|ch|vmin|vmax|fr)?$/,
        trimmedArg,
        { timeout: REGEX_TIMEOUTS.FAST }
      );
      const varTest = syncSafeRegexTest(/^var\(--[\w-]+\)$/, trimmedArg, {
        timeout: REGEX_TIMEOUTS.FAST,
      });

      return lengthTest || varTest;
    });
  }

  /**
   * Validate angle arguments (deg, rad, grad, turn)
   */
  static validateAngleArgs(args) {
    return args.every((arg) => {
      const trimmedArg = arg.trim();

      // Allow calc() functions for angles - basic validation without circular dependency
      if (trimmedArg.startsWith("calc(") && trimmedArg.endsWith(")")) {
        const calcContent = trimmedArg.slice(5, -1); // Remove 'calc(' and ')'
        // Basic validation for calc content - allow numbers, operators, and units
        return /^[\d\s+\-*/.()%a-zA-Z-]+$/.test(calcContent);
      }

      // Allow direct angle values
      return /^-?[\d.]+(?:deg|grad|rad|turn)?$/.test(trimmedArg);
    });
  }

  /**
   * Validate numeric arguments
   */
  static validateNumberArgs(args) {
    return args.every((arg) => {
      const num = parseFloat(arg);
      return !isNaN(num);
    });
  }

  /**
   * Validate rotate3d arguments (x, y, z, angle)
   */
  static validateRotate3dArgs(args) {
    if (args.length !== 4) return false;

    // First three arguments should be numbers (axis coordinates)
    for (let i = 0; i < 3; i++) {
      const num = parseFloat(args[i]);
      if (isNaN(num)) return false;
    }

    // Fourth argument should be an angle
    return /^-?[\d.]+(?:deg|grad|rad|turn)$/.test(args[3].trim());
  }

  /**
   * Validate CSS variable arguments
   */
  static validateVarArgs(args) {
    const [varName, fallback] = args;
    if (!/^--[\w-]+$/.test(varName)) return false;
    return true; // Fallback can be anything
  }

  /**
   * Validate steps timing function arguments
   */
  static validateStepsArgs(args) {
    if (args.length < 1 || args.length > 2) return false;

    const stepCount = parseInt(args[0].trim(), 10);
    if (isNaN(stepCount) || stepCount <= 0) return false;

    if (args.length === 2) {
      const position = args[1].trim();
      const validPositions = [
        "start",
        "end",
        "jump-start",
        "jump-end",
        "jump-none",
        "jump-both",
      ];
      return validPositions.includes(position);
    }

    return true;
  }

  /**
   * Validate gradient arguments
   */
  static validateGradientArgs(args) {
    // Basic gradient validation - ensure we have direction and colors
    return args.length >= 2;
  }

  /**
   * Validate cubic-bezier arguments
   */
  static validateCubicBezierArgs(args) {
    return args.every((arg) => {
      const num = parseFloat(arg);
      return !isNaN(num) && num >= 0 && num <= 1;
    });
  }

  /**
   * Validate modern color function arguments (oklch, oklab, lab, lch)
   */
  static validateModernColorArgs(args) {
    // Allow flexible argument validation for modern color functions
    return args.length >= 3 && args.length <= 4;
  }

  /**
   * Validate grid function arguments (repeat, minmax, fit-content)
   */
  static validateGridArgs(args) {
    // Basic validation for grid functions
    return args.length >= 1;
  }

  /**
   * Validate filter function arguments
   */
  static validateFilterArgs(args) {
    // Basic validation for filter functions
    return args.length >= 1;
  }
}

/**
 * Centralized CSS Function Validator
 * Single point of validation for all CSS functions
 */
export class CentralizedCSSFunctionValidator {
  // Static validation mapping for performance - shared across all instances
  static validationMap = new Map([
    ["rgb", CSSFunctionValidators.validateColorArgs],
    ["rgba", CSSFunctionValidators.validateColorArgs],
    ["hsl", CSSFunctionValidators.validateHSLArgs],
    ["hsla", CSSFunctionValidators.validateHSLArgs],
    ["calc", CSSFunctionValidators.validateCalcArgs],
    ["min", CSSFunctionValidators.validateLengthArgs],
    ["max", CSSFunctionValidators.validateLengthArgs],
    ["clamp", CSSFunctionValidators.validateLengthArgs],
    ["var", CSSFunctionValidators.validateVarArgs],
    ["env", CSSFunctionValidators.validateVarArgs],
    ["translate", CSSFunctionValidators.validateLengthArgs],
    ["translateX", CSSFunctionValidators.validateLengthArgs],
    ["translateY", CSSFunctionValidators.validateLengthArgs],
    ["rotate", CSSFunctionValidators.validateAngleArgs],
    ["scale", CSSFunctionValidators.validateNumberArgs],
    ["scaleX", CSSFunctionValidators.validateNumberArgs],
    ["scaleY", CSSFunctionValidators.validateNumberArgs],
    // 3D Transform functions
    ["translate3d", CSSFunctionValidators.validateLengthArgs],
    ["translateZ", CSSFunctionValidators.validateLengthArgs],
    ["rotate3d", CSSFunctionValidators.validateRotate3dArgs],
    ["rotateX", CSSFunctionValidators.validateAngleArgs],
    ["rotateY", CSSFunctionValidators.validateAngleArgs],
    ["rotateZ", CSSFunctionValidators.validateAngleArgs],
    ["scale3d", CSSFunctionValidators.validateNumberArgs],
    ["scaleZ", CSSFunctionValidators.validateNumberArgs],
    ["matrix", CSSFunctionValidators.validateNumberArgs],
    ["matrix3d", CSSFunctionValidators.validateNumberArgs],
    ["skew", CSSFunctionValidators.validateAngleArgs],
    ["skewX", CSSFunctionValidators.validateAngleArgs],
    ["skewY", CSSFunctionValidators.validateAngleArgs],
    ["perspective", CSSFunctionValidators.validateLengthArgs],
    ["linear-gradient", CSSFunctionValidators.validateGradientArgs],
    ["radial-gradient", CSSFunctionValidators.validateGradientArgs],
    ["conic-gradient", CSSFunctionValidators.validateGradientArgs],
    ["cubic-bezier", CSSFunctionValidators.validateCubicBezierArgs],
    ["steps", CSSFunctionValidators.validateStepsArgs],
    // Modern color functions
    ["oklch", CSSFunctionValidators.validateModernColorArgs],
    ["oklab", CSSFunctionValidators.validateModernColorArgs],
    ["lab", CSSFunctionValidators.validateModernColorArgs],
    ["lch", CSSFunctionValidators.validateModernColorArgs],
    // Grid functions
    ["repeat", CSSFunctionValidators.validateGridArgs],
    ["minmax", CSSFunctionValidators.validateGridArgs],
    ["fit-content", CSSFunctionValidators.validateGridArgs],
    // Filter functions
    ["blur", CSSFunctionValidators.validateFilterArgs],
    ["brightness", CSSFunctionValidators.validateFilterArgs],
    ["contrast", CSSFunctionValidators.validateFilterArgs],
    ["saturate", CSSFunctionValidators.validateFilterArgs],
    ["hue-rotate", CSSFunctionValidators.validateFilterArgs],
    ["drop-shadow", CSSFunctionValidators.validateFilterArgs],
  ]);

  constructor() {
    // Constructor is now lightweight - no expensive Map creation
  }

  /**
   * Parse CSS function arguments respecting commas and parentheses
   * @param {string} argsString - Argument string
   * @returns {Array<string>} Parsed arguments
   */
  parseArguments(argsString) {
    const args = [];
    let current = "";
    let parenDepth = 0;
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i];

      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = "";
      } else if (char === "(" && !inQuotes) {
        parenDepth++;
      } else if (char === ")" && !inQuotes) {
        parenDepth--;
      } else if (char === "," && parenDepth === 0 && !inQuotes) {
        args.push(current.trim());
        current = "";
        continue;
      }

      current += char;
    }

    if (current.trim()) {
      args.push(current.trim());
    }

    return args;
  }

  /**
   * Validate CSS function with proper argument checking and safe regex
   * @param {string} functionCall - CSS function call like "rgb(255, 0, 0)"
   * @param {boolean} hasUrlFromUSyntax - Whether this url() came from u() syntax
   * @returns {boolean} True if valid function
   */
  validateFunction(functionCall, hasUrlFromUSyntax = false) {
    const matches = safeRegexMatch(
      /^([a-zA-Z0-9-]+)\((.*)\)$/,
      functionCall,
      REGEX_TIMEOUTS.FAST
    );

    if (!matches) {
      return false;
    }

    const [, funcName, argsString] = matches;

    // Special case: allow url() when it comes from u() syntax conversion
    if (funcName === "url" && hasUrlFromUSyntax) {
      return true;
    }

    const functionDef = CSS_FUNCTIONS.get(funcName);

    if (!functionDef) {
      // Unknown function - allow for extensibility
      return true; // Be permissive for unknown functions
    }

    const args = this.parseArguments(argsString);

    // Check argument count
    if (
      args.length < functionDef.minArgs ||
      args.length > functionDef.maxArgs
    ) {
      return false;
    }

    // Validate arguments with specific validator
    const validator =
      CentralizedCSSFunctionValidator.validationMap.get(funcName);
    if (validator) {
      return validator(args, funcName);
    }

    // If no specific validator, basic validation passed
    return true;
  }

  /**
   * Check if a string contains CSS functions
   * @param {string} value - CSS value to check
   * @returns {boolean} True if contains CSS functions
   */
  containsCSSFunction(value) {
    for (const functionName of CSS_FUNCTIONS.keys()) {
      if (value.includes(`${functionName}(`)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if CSS value is a SINGLE CSS function (not part of multiple values)
   * @param {string} value - CSS value to check
   * @returns {boolean} True if the entire value is a single CSS function
   */
  isSingleCSSFunction(value) {
    for (const functionName of CSS_FUNCTIONS.keys()) {
      if (value.startsWith(`${functionName}(`)) {
        // Find the matching closing parenthesis
        let parenCount = 0;
        let startPos = value.indexOf("(");

        for (let i = startPos; i < value.length; i++) {
          if (value[i] === "(") parenCount++;
          if (value[i] === ")") parenCount--;

          if (parenCount === 0) {
            // Check if there's anything significant after the closing paren
            const remainder = value.slice(i + 1).trim();
            return remainder === ""; // True only if nothing follows
          }
        }
      }
    }
    return false;
  }

  /**
   * Get all supported CSS function names
   * @returns {Array<string>} Array of function names
   */
  getSupportedFunctions() {
    return Array.from(CSS_FUNCTIONS.keys());
  }

  /**
   * Check if a function name is known/supported
   * @param {string} functionName - Name of the function
   * @returns {boolean} True if function is supported
   */
  isKnownFunction(functionName) {
    return CSS_FUNCTIONS.has(functionName);
  }

  /**
   * Get function definition by name
   * @param {string} functionName - Name of the function
   * @returns {Object|null} Function definition or null
   */
  getFunctionDefinition(functionName) {
    return CSS_FUNCTIONS.get(functionName) || null;
  }
}

// Global instance for performance and consistency
export const globalCSSFunctionValidator = new CentralizedCSSFunctionValidator();

// Convenience exports for backward compatibility
export const validateCSSFunction = (functionCall, hasUrlFromUSyntax = false) =>
  globalCSSFunctionValidator.validateFunction(functionCall, hasUrlFromUSyntax);

export const isSingleCSSFunction = (value) =>
  globalCSSFunctionValidator.isSingleCSSFunction(value);

export const isKnownCSSFunction = (functionName) =>
  globalCSSFunctionValidator.isKnownFunction(functionName);
