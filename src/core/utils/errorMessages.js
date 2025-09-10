/**
 * Common error message templates
 * Reduces duplication and ensures consistent messaging
 */

export const ERROR_MESSAGES = {
  // Input validation
  INVALID_STRING: "Must be a non-empty string",
  INVALID_STRING_ONLY: "Must be a string",
  INVALID_CLASS_STRING: "Class name must be a non-empty string",
  INVALID_CLASS_STRING_SIMPLE: "Class name must be a string",
  INVALID_VALUE_STRING: "Value must be a non-empty string",
  INVALID_HTML_STRING: "HTML must be a string",
  INVALID_HTML_STRING_OR_ARRAY: "HTML must be a string or array of strings",

  // Array validation
  INVALID_INPUT_TYPE: "Input must be an array, string, or object",
  INVALID_ARRAY: "Must be an array",
  INVALID_CLASSES_ARRAY: "Classes must be an array of strings",
  INVALID_HTML_ARRAY: "HTML array must contain only strings",

  // Security
  DANGEROUS_CHARACTERS: "Contains dangerous characters",

  // Syntax
  UNKNOWN_SYNTAX: "Unknown syntax pattern",
  INVALID_BRACKETS: "Invalid bracket syntax",
  UNCLOSED_BRACKETS: "Unclosed bracket in class name",
  UNOPENED_BRACKETS: "Unopened bracket in class name",
  NESTED_BRACKETS: "Nested brackets not allowed",

  // Processing
  NO_CLASSES: "No classes provided",
  GENERATION_FAILED: "CSS generation failed",
  PARSING_FAILED: "Class parsing failed",
};
