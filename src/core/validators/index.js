/**
 * Validators module - Main coordination for all validation logic
 * Provides unified interface for CSS property and value validation
 */

// Property validation
export { isSupportedProperty } from "./propertyValidator.js";

// Value validation
export {
  validateValue,
  validateMultipleValuesBatch as validateMultipleValues,
  isValidCSSFunction,
} from "./valueValidator/index.js";

// Class validation
export {
  validateClasses,
  validateSingleClass,
  validateClassesBatched,
  getValidationStats,
} from "./classValidator.js";

// Re-export syntax validation from parser
export { validateClassSyntax } from "../parser/syntaxValidator.js";
