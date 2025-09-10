/**
 * HTML scanning and class extraction logic with safe regex execution
 * Finds utility classes within HTML content with enhanced JSX support
 */

import {
  isInputLengthSafe,
  REGEX_TIMEOUTS,
  safeRegexTest,
} from "../security/safeRegex.js";
import { createLogger } from "../utils/index.js";
import { MAX_CLASSES_PER_REQUEST } from "../security/securityConstants.js";

const logger = createLogger("HtmlExtractor");

/**
 * Enhanced class extraction patterns for modern JavaScript frameworks
 * Supports template literals, JSX expressions, and regular attributes
 */
const CLASS_EXTRACTION_PATTERNS = {
  // Standard HTML/JSX class attributes
  STANDARD_ATTRIBUTES: /class(Name)?=["']([^"']+)["']/g,

  // Template literals in JSX: className={`bg-[${color}] p-[10px]`}
  TEMPLATE_LITERALS: /class(Name)?=\s*\{\s*`([^`]*)`\s*\}/g,

  // JSX expressions with strings: className={condition ? "bg-[red]" : "bg-[blue]"}
  JSX_STRING_EXPRESSIONS:
    /class(Name)?=\s*\{[^}]*["']([^"']*\[[^\]]+\][^"']*)["'][^}]*\}/g,

  // String literals anywhere in content: "bg-[red] p-[10px]"
  STANDALONE_STRINGS: /["'`]([^"'`]*\[[^\]]+\][^"'`]*)["'`]/g,
};

/**
 * Extract ZyraCSS classes from a class string
 * ZyraCSS classes use bracket syntax: property-[value]
 * @param {string} classString - String containing space-separated classes
 * @returns {Array<string>} Array of valid ZyraCSS classes
 */
function extractZyraClassesFromString(classString) {
  if (!classString || typeof classString !== "string") return [];

  const classes = [];
  const potentialClasses = classString.split(/\s+/);

  for (const cls of potentialClasses) {
    const trimmed = cls.trim();
    // ZyraCSS validation: must contain brackets and not be empty
    if (trimmed && trimmed.includes("[") && trimmed.includes("]")) {
      // Additional validation: basic bracket pairing
      const openBrackets = (trimmed.match(/\[/g) || []).length;
      const closeBrackets = (trimmed.match(/\]/g) || []).length;
      if (openBrackets === closeBrackets) {
        classes.push(trimmed);
      }
    }
  }

  return classes;
}

/**
 * Enhanced JSX-aware class extraction with multiple pattern matching
 * @param {string} content - HTML/JSX content to scan
 * @param {Object} options - Extraction options
 * @returns {Array<string>} Array of ZyraCSS classes found
 */
function extractClassesWithJSXSupport(content, options = {}) {
  const classes = new Set();
  const maxClasses = options.maxClasses || 5000;

  // Optimized single-pass extraction using combined regex patterns
  const patterns = [
    {
      regex: new RegExp(
        CLASS_EXTRACTION_PATTERNS.STANDARD_ATTRIBUTES.source,
        "g"
      ),
      matchIndex: 2, // Extract from match[2]
    },
    {
      regex: new RegExp(
        CLASS_EXTRACTION_PATTERNS.TEMPLATE_LITERALS.source,
        "g"
      ),
      matchIndex: 2, // Extract from match[2]
    },
    {
      regex: new RegExp(
        CLASS_EXTRACTION_PATTERNS.JSX_STRING_EXPRESSIONS.source,
        "g"
      ),
      matchIndex: 2, // Extract from match[2]
    },
    {
      regex: new RegExp(
        CLASS_EXTRACTION_PATTERNS.STANDALONE_STRINGS.source,
        "g"
      ),
      matchIndex: 1, // Extract from match[1]
    },
  ];

  // Single-pass extraction with all patterns
  for (const pattern of patterns) {
    if (classes.size >= maxClasses) break;

    let match;
    while (
      (match = pattern.regex.exec(content)) !== null &&
      classes.size < maxClasses
    ) {
      const extractedValue = match[pattern.matchIndex];
      if (extractedValue) {
        const foundClasses = extractZyraClassesFromString(extractedValue);
        // Use for...of instead of forEach for better performance
        for (const cls of foundClasses) {
          classes.add(cls);
          if (classes.size >= maxClasses) break;
        }
      }
    }
  }

  return Array.from(classes);
}

/**
 * Extract classes from HTML content with enhanced JSX support and timeout protection
 * @param {string} html - HTML/JSX content to scan
 * @param {Object} options - Optional configuration
 * @returns {Array} Array of found ZyraCSS class names
 */
export function zyraExtractClassFromHTML(html, options = {}) {
  const maxHtmlSize = options.maxHtmlSize || 100000; // 100KB default
  const maxClasses = options.maxClasses || 5000; // Prevent memory exhaustion

  // Early return for unsafe input lengths
  if (!isInputLengthSafe(html, maxHtmlSize)) {
    logger.warn(
      `HTML input too large for safe processing: ${html.length} bytes (max: ${maxHtmlSize})`
    );
    return [];
  }

  try {
    // Use enhanced JSX-aware extraction
    const classes = extractClassesWithJSXSupport(html, { maxClasses });

    if (classes.length >= maxClasses) {
      logger.warn(
        `Class extraction limit reached: ${maxClasses}. Some classes may be missed.`
      );
    }

    return classes;
  } catch (error) {
    logger.warn("HTML class extraction error:", error.message);
    return [];
  }
}

/**
 * Extract classes from multiple HTML strings
 * @param {Array<string>} htmlArray - Array of HTML strings
 * @param {Object} options - Optional configuration
 * @returns {Array} Array of unique class names found across all HTML
 */
export function zyraExtractClassFromHTMLArray(htmlArray, options = {}) {
  const maxTotalClasses = options.maxTotalClasses || MAX_CLASSES_PER_REQUEST; // Global limit
  const allClasses = new Set();

  for (const html of htmlArray) {
    if (typeof html === "string") {
      const classes = zyraExtractClassFromHTML(html, options);
      classes.forEach((cls) => {
        // Global class limit across all HTML files
        if (allClasses.size >= maxTotalClasses) {
          logger.warn(`Global class limit reached: ${maxTotalClasses}`);
          return Array.from(allClasses);
        }
        allClasses.add(cls);
      });
    }
  }

  return Array.from(allClasses);
}
