/**
 * URL Utilities for ZyraCSS
 * Handles URL-based arbitrary values in CSS classes
 * Includes u(...) syntax support for secure URL parsing
 */

import { isString, toSafeString } from "./essential.js";
import { ZyraError, ERROR_CODES } from "../errors/index.js";

/**
 * CSS.escape polyfill for environments without native support
 * @param {string} ident - Identifier to escape
 * @returns {string} Escaped identifier
 */
export function cssEscapeIdent(ident) {
  if (typeof CSS !== "undefined" && CSS?.escape) {
    return CSS.escape(ident);
  }

  // Fallback implementation
  return ident.replace(/([!"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
}

/**
 * URL schemes and validation configuration
 */
const ALLOWED_SCHEMES = new Set(["http:", "https:", "data:", "blob:"]);
const BANNED_SCHEMES = new Set(["javascript:", "vbscript:", "file:"]);
const ALLOW_SVG = false; // Disallow data:image/svg+xml by default for security

/**
 * Sanitizes and validates URL values for security
 * @param {string} raw - Raw URL string to sanitize
 * @returns {string} Sanitized URL
 * @throws {Error} If URL is invalid or contains banned schemes
 */
export function sanitizeUrl(raw) {
  const inner = String(raw).trim();

  // Handle fragment identifiers (SVG references like #my-filter)
  if (inner.startsWith("#")) {
    // Fragment identifiers are safe and commonly used for SVG filters/masks
    return inner.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  }

  let u;

  try {
    u = new URL(inner, "https://_base_");
  } catch {
    throw new ZyraError(
      ERROR_CODES.INVALID_CSS_VALUE,
      `Invalid URL format: ${inner}`,
      { url: inner },
      ["Check URL syntax", "Ensure proper protocol (https://, http://)"]
    );
  }

  if (BANNED_SCHEMES.has(u.protocol)) {
    throw new ZyraError(
      ERROR_CODES.INVALID_CSS_VALUE,
      `Banned URL scheme: ${u.protocol}`,
      { url: inner, scheme: u.protocol },
      [
        "Use allowed schemes: http:, https:, data:, blob:",
        "Avoid javascript:, vbscript:, file: schemes",
      ]
    );
  }

  if (!ALLOWED_SCHEMES.has(u.protocol)) {
    throw new ZyraError(
      ERROR_CODES.INVALID_CSS_VALUE,
      `URL scheme not in allowlist: ${u.protocol}`,
      {
        url: inner,
        scheme: u.protocol,
        allowedSchemes: Array.from(ALLOWED_SCHEMES),
      },
      ["Use allowed schemes: http:, https:, data:, blob:"]
    );
  }

  if (u.protocol === "data:") {
    const head = inner.slice(5, 128).toLowerCase();
    if (!head.startsWith("image/")) {
      throw new ZyraError(
        ERROR_CODES.INVALID_CSS_VALUE,
        `Data URL must be image type: ${head}`,
        { url: inner, dataType: head },
        ["Use image/* data URLs only", "Example: data:image/png;base64,..."]
      );
    }
    if (!ALLOW_SVG && head.startsWith("image/svg+xml")) {
      throw new ZyraError(
        ERROR_CODES.SECURITY_VIOLATION,
        "Data SVG URLs disallowed for security",
        { url: inner, dataType: head },
        [
          "Use external SVG URLs: u(https://example.com/icon.svg)",
          "Or enable ALLOW_SVG flag if needed",
        ]
      );
    }
  }

  // Escape quotes and backslashes for CSS
  return inner.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

/**
 * Normalizes u(...) URL function syntax to url('...') CSS syntax
 * Handles multiple u() functions in a single value
 * @param {string} value - The value to check and normalize
 * @returns {string|null} Normalized value with url() functions or null if no u() syntax found
 * @throws {Error} If value contains u(...) with invalid/dangerous URL
 */
export function normalizeUrlFunction(value) {
  const v = value.trim();

  // Check if there are any u(...) patterns
  if (!v.includes("u(")) return null;

  // Replace all u(...) patterns with url('...')
  let result = v;
  let hasReplacements = false;

  // Use a regex to find all u(...) patterns
  result = result.replace(/u\(([^)]*)\)/g, (match, inner) => {
    hasReplacements = true;
    const trimmedInner = inner.trim().replace(/^(['"])(.*)\1$/s, "$2");

    try {
      const safe = sanitizeUrl(trimmedInner);
      return `url('${safe}')`;
    } catch (error) {
      // For u(...) syntax, we should throw on dangerous URLs to prevent processing
      throw new ZyraError(
        ERROR_CODES.INVALID_CSS_VALUE,
        `Invalid URL in u() function: ${error.message}`,
        { url: trimmedInner, originalMatch: match },
        [
          "Check URL syntax and security constraints",
          "Use url() instead of u() for external URLs",
        ]
      );
    }
  });

  return hasReplacements ? result : null;
}

/**
 * Checks if a CSS property typically accepts URL values
 * @param {string} property - CSS property name
 * @returns {boolean} True if property typically accepts URLs
 */
export function isUrlProperty(property) {
  const urlProperties = new Set([
    "background-image",
    "mask-image",
    "border-image-source",
    "cursor",
    "list-style-image",
    "content",
    "background",
    "mask",
    "border-image",
    "filter", // SVG filters can use url() references
    "backdrop-filter", // May also use SVG filters
  ]);

  return urlProperties.has(property) || property.endsWith("-image");
}

/**
 * Valid cursor keywords according to CSS specification
 */
const VALID_CURSOR_KEYWORDS = new Set([
  // Auto and default
  "auto",
  "default",
  // Links and status
  "pointer",
  "progress",
  "wait",
  // Selection
  "text",
  "vertical-text",
  "crosshair",
  "cell",
  // Drag and drop
  "move",
  "copy",
  "alias",
  "grab",
  "grabbing",
  // Resize cursors
  "n-resize",
  "ne-resize",
  "e-resize",
  "se-resize",
  "s-resize",
  "sw-resize",
  "w-resize",
  "nw-resize",
  "col-resize",
  "row-resize",
  "all-scroll",
  // Zoom
  "zoom-in",
  "zoom-out",
  // Disabled states
  "not-allowed",
  "no-drop",
  // Context
  "context-menu",
  "help",
  // Misc
  "none",
]);

/**
 * Validates cursor values for the cursor property
 * @param {string} value - The cursor value to validate
 * @returns {boolean} True if valid cursor value
 */
export function isValidCursorValue(value) {
  if (!isString(value) || !value) {
    return false;
  }

  // Split on commas to handle multiple cursor values with fallbacks
  const parts = value.split(",").map((part) => part.trim());

  for (const part of parts) {
    // Check if it's a valid keyword
    if (VALID_CURSOR_KEYWORDS.has(part)) {
      continue;
    }

    // Check if it's a u() URL function (will be validated by URL functions)
    if (part.match(/^u\(.+\)$/)) {
      continue;
    }

    // Check if it's a url() function (from our u() conversion)
    if (part.match(/^url\(.+\)$/)) {
      continue;
    }

    // If none of the above, it's invalid
    return false;
  }

  return true;
}

/**
 * Simple hash function for generating stable short hashes
 * @param {string} str - String to hash
 * @returns {string} Short hash (6-8 characters)
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to base36 and ensure positive
  return Math.abs(hash).toString(36).substr(0, 8);
}
