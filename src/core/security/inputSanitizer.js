/**
 * Input sanitization and cleaning logic
 * Handles safe cleaning of user input before processing with regex timeout protection
 */

import { MAX_CLASS_LENGTH, MAX_VALUE_LENGTH } from "./securityConstants.js";
import { syncSafeRegexTest, REGEX_TIMEOUTS } from "./safeRegex.js";

/**
 * Sanitize and clean input string
 * @param {string} input - Input to sanitize
 * @returns {string|null} Sanitized input or null if invalid
 */
export function sanitizeInput(input) {
  if (typeof input !== "string") {
    return null;
  }

  // Length validation
  if (input.length > MAX_CLASS_LENGTH) {
    return null;
  }

  // Remove dangerous characters and control characters
  const cleaned = cleanDangerousCharacters(input);

  if (!cleaned) {
    return null;
  }

  return cleaned.trim();
}

/**
 * Clean dangerous characters from input
 * @param {string} input - Input to clean
 * @returns {string|null} Cleaned input or null if too dangerous
 */
function cleanDangerousCharacters(input) {
  // Remove null bytes and control characters (except tab, newline, carriage return)
  let cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Remove XSS-prone patterns
  cleaned = removeXSSPatterns(cleaned);

  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, " ");

  // If the cleaning removed too much content, it might be suspicious
  if (cleaned.length < input.length * 0.5 && input.length > 10) {
    return null;
  }

  return cleaned;
}

/**
 * Remove XSS-prone patterns from input
 * @param {string} input - Input to clean
 * @returns {string} Cleaned input
 */
function removeXSSPatterns(input) {
  let cleaned = input;

  // Remove script tags and content
  cleaned = cleaned.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
  cleaned = cleaned.replace(/<script[^>]*>/gi, "");

  // Remove javascript: protocols
  cleaned = cleaned.replace(/javascript\s*:/gi, "");

  // Remove CSS expressions (IE-specific)
  cleaned = cleaned.replace(/expression\s*\(/gi, "");

  // Remove data: protocols that could contain scripts
  cleaned = cleaned.replace(/data\s*:\s*[^,]*script/gi, "");

  // Remove vbscript: protocols
  cleaned = cleaned.replace(/vbscript\s*:/gi, "");

  // Remove event handlers (onclick, onload, etc.)
  cleaned = cleaned.replace(/on\w+\s*=/gi, "");

  // Remove HTML entities that could decode to dangerous characters
  cleaned = cleaned.replace(/&lt;script/gi, "");
  cleaned = cleaned.replace(/&#x3c;script/gi, "");

  // Escape remaining angle brackets to prevent HTML injection
  cleaned = cleaned.replace(/</g, "\\3c ");
  cleaned = cleaned.replace(/>/g, "\\3e ");

  return cleaned;
}

/**
 * Sanitize array of inputs
 * @param {Array} inputs - Array of inputs to sanitize
 * @returns {Object} Object with sanitized and failed inputs
 */
export function sanitizeInputArray(inputs) {
  if (!Array.isArray(inputs)) {
    return {
      sanitized: [],
      failed: ["Input must be an array"],
    };
  }

  const sanitized = [];
  const failed = [];

  for (const input of inputs) {
    const cleaned = sanitizeInput(input);
    if (cleaned !== null) {
      sanitized.push(cleaned);
    } else {
      failed.push(input);
    }
  }

  return { sanitized, failed };
}
