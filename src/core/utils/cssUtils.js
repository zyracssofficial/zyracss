/**
 * CSS-related utility functions
 * Helper functions for CSS processing and manipulation
 */

import { CSS_VALUE_PATTERNS, PatternTester } from "./regexPatterns.js";
import { cssEscapeIdent } from "./urlUtils.js";
import { isString, toSafeString } from "./essential.js";

/**
 * Escape CSS class name for use in selectors
 * @param {string} className - Class name to escape
 * @returns {string} Escaped class name
 */
export function escapeCSSSelector(className) {
  if (!isString(className)) {
    return "";
  }

  // Use the enhanced cssEscapeIdent function for better URL support
  return cssEscapeIdent(className);
}

/**
 * Convert CSS value to consistent format
 * @param {string} value - CSS value to normalize
 * @returns {string} Normalized CSS value
 */
export function normalizeCSSValue(value) {
  if (!isString(value)) {
    return "";
  }

  let normalized = value.trim();

  // Normalize color values
  if (normalized.startsWith("#")) {
    // Ensure hex colors are lowercase
    normalized = normalized.toLowerCase();

    // Expand 3-digit hex to 6-digit
    if (normalized.length === 4) {
      normalized =
        "#" +
        normalized[1].repeat(2) +
        normalized[2].repeat(2) +
        normalized[3].repeat(2);
    }
  }

  // Normalize zero values - use centralized pattern
  if (CSS_VALUE_PATTERNS.ZERO_WITH_UNITS.test(normalized)) {
    normalized = "0";
  }

  // Remove unnecessary decimal zeros
  normalized = normalized.replace(/\.0+(?=\D|$)/g, "");

  // Normalize CSS functions (calc, min, max, clamp) with proper spacing
  // Handle both top-level and nested functions
  normalized = normalizeNestedCalcFunctions(normalized);

  // Normalize CSS function comma spacing for all functions
  normalized = normalizeCSSFunctionCommas(normalized);

  return normalized;
}

/**
 * Normalize calc expressions with proper operator spacing
 * @param {string} value - CSS value to normalize
 * @returns {string} Normalized CSS value with proper calc spacing
 */
function normalizeNestedCalcFunctions(value) {
  // Handle all calc functions in the value (top-level, nested, and multiple)
  return value.replace(/calc\s*\(\s*([^)]+)\s*\)/gi, (match, expression) => {
    return `calc(${normalizeCalcExpression(expression.trim())})`;
  });
}

/**
 * Normalize arithmetic operators in calc expressions
 * @param {string} expression - Calc expression to normalize
 * @returns {string} Normalized calc expression with proper spacing
 */
function normalizeCalcExpression(expression) {
  const operators = [
    { pattern: /([0-9]+[a-z%]*)-/g, replacement: "$1 - " },
    { pattern: /\)-/g, replacement: ") - " },
    { pattern: /([0-9]+[a-z%]*)\+/g, replacement: "$1 + " },
    { pattern: /\)\+/g, replacement: ") + " },
    { pattern: /([0-9]+[a-z%]*)\*/g, replacement: "$1 * " },
    { pattern: /\)\*/g, replacement: ") * " },
    { pattern: /([0-9]+[a-z%]*)\//g, replacement: "$1 / " },
    { pattern: /\)\//g, replacement: ") / " },
  ];

  // Apply operator spacing transformations
  let normalized = operators.reduce((expr, { pattern, replacement }) => {
    return expr.replace(pattern, replacement);
  }, expression);

  // Clean up any double spaces
  return normalized.replace(/\s+/g, " ").trim();
}

/**
 * Normalize comma spacing in CSS functions
 * @param {string} value - CSS value to normalize
 * @returns {string} Normalized CSS value with proper comma spacing
 */
function normalizeCSSFunctionCommas(value) {
  // List of CSS functions that need comma spacing normalization
  const cssFunction = [
    "rgb",
    "rgba",
    "hsl",
    "hsla",
    "oklch",
    "oklab",
    "lab",
    "lch",
    "linear-gradient",
    "radial-gradient",
    "conic-gradient",
    "repeating-linear-gradient",
    "min",
    "max",
    "clamp",
    "repeat",
    "minmax",
    "translate",
    "scale",
    "rotate",
    "transform",
    "cubic-bezier",
    "steps",
    "polygon",
    "circle",
    "ellipse",
    "inset",
    "color-mix",
    "color",
    "var",
    "env",
    "blur",
    "brightness",
    "contrast",
    "saturate",
    "hue-rotate",
    "drop-shadow",
  ];

  // Use a more sophisticated approach to handle nested parentheses
  let result = value;

  // Process each function type
  for (const functionName of cssFunction) {
    const regex = new RegExp(`\\b${functionName}\\s*\\(`, "gi");
    let match;

    while ((match = regex.exec(result)) !== null) {
      const startIndex = match.index;
      const openParenIndex = match.index + match[0].length - 1;

      // Find the matching closing parenthesis
      let depth = 1;
      let endIndex = openParenIndex + 1;

      while (depth > 0 && endIndex < result.length) {
        if (result[endIndex] === "(") {
          depth++;
        } else if (result[endIndex] === ")") {
          depth--;
        }
        endIndex++;
      }

      if (depth === 0) {
        // Extract the function and its arguments
        const fullFunction = result.substring(startIndex, endIndex);
        const funcName = fullFunction.substring(0, fullFunction.indexOf("("));
        const args = fullFunction.substring(
          fullFunction.indexOf("(") + 1,
          fullFunction.lastIndexOf(")")
        );

        let normalizedFunction;

        // Special handling for gradient functions
        if (funcName.includes("gradient")) {
          normalizedFunction = normalizeGradientFunction(funcName, args);
        }
        // Special handling for drop-shadow function
        else if (funcName === "drop-shadow") {
          normalizedFunction = normalizeDropShadowFunction(funcName, args);
        }
        // Normalize comma spacing in arguments for other functions
        else {
          const normalizedArgs = args
            .split(",")
            .map((arg) => arg.trim())
            .join(", ");
          normalizedFunction = `${funcName}(${normalizedArgs})`;
        }

        // Replace the original function with the normalized one
        result =
          result.substring(0, startIndex) +
          normalizedFunction +
          result.substring(endIndex);

        // Reset regex lastIndex to continue from the new position
        regex.lastIndex = startIndex + normalizedFunction.length;
      }
    }
  }

  return result;
}

/**
 * Normalize gradient function arguments with special handling for directional keywords
 */
function normalizeGradientFunction(functionName, args) {
  // First normalize any nested CSS functions (like rgba, hsl) BEFORE splitting
  const normalizedArgs = args.replace(
    /\b(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch)\s*\(([^)]+)\)/gi,
    (match, func, funcArgs) => {
      const cleanArgs = funcArgs
        .split(",")
        .map((arg) => arg.trim())
        .join(", ");
      return `${func}(${cleanArgs})`;
    }
  );

  // Then split the normalized args respecting nested parentheses
  const parts = smartSplitGradientArgs(normalizedArgs);
  const result = [];

  for (let i = 0; i < parts.length; i++) {
    const current = parts[i];
    const next = parts[i + 1];

    // Handle 'to' keyword followed by direction
    if (current === "to" && next) {
      result.push(`to ${next}`);
      i++; // Skip the next part as it's already processed
      continue;
    }

    // Handle 'at' keyword for radial gradients
    if (current === "at" && next) {
      // Merge with previous: 'ellipse,at,center' -> 'ellipse at center'
      const prev = result.pop();
      result.push(`${prev} at ${next}`);
      i++; // Skip the next part as it's already processed
      continue;
    }

    // Handle color stops with percentages or lengths
    // Check if current is a color and next is a percentage/length
    if (next && (next.endsWith("%") || next.match(/^\d+[a-z]+$/))) {
      result.push(`${current} ${next}`);
      i++; // Skip the next part as it's already processed
      continue;
    }

    // Default: add the current part as-is (already normalized above)
    result.push(current);
  }

  return `${functionName}(${result.join(", ")})`;
}

/**
 * Smart gradient argument splitting that respects nested functions
 */
function smartSplitGradientArgs(args) {
  const result = [];
  let current = "";
  let depth = 0;

  for (let i = 0; i < args.length; i++) {
    const char = args[i];

    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    } else if (char === "," && depth === 0) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result;
}

/**
 * Normalize drop-shadow function arguments
 */
function normalizeDropShadowFunction(functionName, args) {
  // drop-shadow uses spaces, not commas: drop-shadow(2px 2px 4px black)
  // But we need to preserve commas inside nested functions like rgba()

  const parts = [];
  let current = "";
  let depth = 0;

  for (let i = 0; i < args.length; i++) {
    const char = args[i];

    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    } else if (char === "," && depth === 0) {
      // Only split on comma if we're not inside parentheses
      if (current.trim()) {
        parts.push(current.trim());
      }
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  // Join parts with spaces for drop-shadow, but preserve internal function syntax
  const normalizedArgs = parts
    .map((part) => {
      // If this part contains a function like rgba(), normalize its internal commas
      if (part.includes("(") && part.includes(")")) {
        return part.replace(/,(\s*)/g, ", "); // Ensure space after comma in functions
      }
      return part;
    })
    .join(" ");

  return `${functionName}(${normalizedArgs})`;
}

/**
 * Check if CSS value is a length unit
 * @param {string} value - Value to check
 * @returns {boolean} True if value is a length
 */
export function isCSSLength(value) {
  if (!isString(value)) {
    return false;
  }

  return PatternTester.isLength(value.trim());
}

/**
 * Check if CSS value is a color
 * @param {string} value - Value to check
 * @returns {boolean} True if value is a color
 */
export function isCSSColor(value) {
  if (!isString(value)) {
    return false;
  }

  const trimmed = value.trim();

  // Check function-based colors first (hex, rgb, hsl, etc.)
  if (PatternTester.isColor(trimmed)) {
    return true;
  }

  // Named colors (basic check)
  const namedColors = [
    "highlight",
    "transparent",
    "currentcolor",
    "inherit",
    "initial",
    "unset",
    "revert",
    "aliceblue",
    "antiquewhite",
    "aqua",
    "aquamarine",
    "azure",
    "beige",
    "bisque",
    "black",
    "blanchedalmond",
    "blue",
    "blueviolet",
    "brown",
    "burlywood",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "coral",
    "cornflowerblue",
    "cornsilk",
    "crimson",
    "cyan",
    "darkblue",
    "darkcyan",
    "darkgoldenrod",
    "darkgray",
    "darkgreen",
    "darkgrey",
    "darkkhaki",
    "darkmagenta",
    "darkolivegreen",
    "darkorange",
    "darkorchid",
    "darkred",
    "darksalmon",
    "darkseagreen",
    "darkslateblue",
    "darkslategray",
    "darkslategrey",
    "darkturquoise",
    "darkviolet",
    "deeppink",
    "deepskyblue",
    "dimgray",
    "dimgrey",
    "dodgerblue",
    "firebrick",
    "floralwhite",
    "forestgreen",
    "fuchsia",
    "gainsboro",
    "ghostwhite",
    "gold",
    "goldenrod",
    "gray",
    "green",
    "greenyellow",
    "grey",
    "honeydew",
    "hotpink",
    "indianred",
    "indigo",
    "ivory",
    "khaki",
    "lavender",
    "lavenderblush",
    "lawngreen",
    "lemonchiffon",
    "lightblue",
    "lightcoral",
    "lightcyan",
    "lightgoldenrodyellow",
    "lightgray",
    "lightgreen",
    "lightgrey",
    "lightpink",
    "lightsalmon",
    "lightseagreen",
    "lightskyblue",
    "lightslategray",
    "lightslategrey",
    "lightsteelblue",
    "lightyellow",
    "lime",
    "limegreen",
    "linen",
    "magenta",
    "maroon",
    "mediumaquamarine",
    "mediumblue",
    "mediumorchid",
    "mediumpurple",
    "mediumseagreen",
    "mediumslateblue",
    "mediumspringgreen",
    "mediumturquoise",
    "mediumvioletred",
    "midnightblue",
    "mintcream",
    "mistyrose",
    "moccasin",
    "navajowhite",
    "navy",
    "oldlace",
    "olive",
    "olivedrab",
    "orange",
    "orangered",
    "orchid",
    "palegoldenrod",
    "palegreen",
    "paleturquoise",
    "palevioletred",
    "papayawhip",
    "peachpuff",
    "peru",
    "pink",
    "plum",
    "powderblue",
    "purple",
    "red",
    "rosybrown",
    "royalblue",
    "saddlebrown",
    "salmon",
    "sandybrown",
    "seagreen",
    "seashell",
    "sienna",
    "silver",
    "skyblue",
    "slateblue",
    "slategray",
    "slategrey",
    "snow",
    "springgreen",
    "steelblue",
    "tan",
    "teal",
    "thistle",
    "tomato",
    "turquoise",
    "violet",
    "wheat",
    "white",
    "whitesmoke",
    "yellow",
    "yellowgreen",
  ];

  return namedColors.includes(trimmed.toLowerCase());
}

/**
 * Format font family array into properly quoted CSS value
 * @param {Array<string>} values - Array of font family names
 * @returns {string} Properly formatted font-family value
 */
export function formatFontFamilyFromArray(values) {
  return values
    .map((font) => {
      let trimmed = font.trim();

      // Check if it's a generic font family first (before any processing)
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
      ];

      if (genericFamilies.includes(trimmed.toLowerCase())) {
        return trimmed.toLowerCase(); // Ensure generic families are lowercase and unquoted
      }

      // Convert dashes to spaces for non-generic font names (e.g., Times-New-Roman → Times New Roman)
      if (trimmed.includes("-")) {
        trimmed = trimmed.replace(/-/g, " ");
        // Capitalize each word for proper font name formatting
        trimmed = trimmed.replace(/\b\w/g, (char) => char.toUpperCase());

        // Handle special font name abbreviations that should be uppercase
        trimmed = trimmed.replace(/\bMs\b/g, "MS"); // Microsoft Sans → MS
        trimmed = trimmed.replace(/\bNt\b/g, "NT"); // Windows NT
        trimmed = trimmed.replace(/\bUi\b/g, "UI"); // User Interface
      } else {
        // For single-word fonts without dashes, capitalize if it's likely a brand name
        // (not a generic family like serif, sans-serif, etc.)
        // Capitalize first letter for brand names like arial → Arial
        trimmed =
          trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      }

      // Font names with spaces need quotes
      if (trimmed.includes(" ")) {
        return `"${trimmed}"`;
      }

      // Multi-word font names and branded fonts should be quoted
      // Quote fonts that start with uppercase (likely brand names like Inter, Arial)
      if (/^[A-Z]/.test(trimmed)) {
        return `"${trimmed}"`;
      }

      return trimmed;
    })
    .join(", ");
}

/**
 * Format CSS rule string from selector and declarations
 * @param {string} selector - CSS selector
 * @param {Object} declarations - CSS declarations object
 * @param {Object} options - Formatting options
 * @returns {string} CSS rule string
 */
export function formatCSSRule(selector, declarations, options = {}) {
  const { minify = false, indent = "  " } = options;

  if (!selector || !declarations || typeof declarations !== "object") {
    return "";
  }

  const props = Object.entries(declarations)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([prop, value]) => `${minify ? "" : indent}${prop}: ${value};`)
    .join(minify ? "" : "\n");

  if (!props) {
    return "";
  }

  if (minify) {
    return `${selector}{${props}}`;
  } else {
    return `${selector} {\n${props}\n}`;
  }
}
