/**
 * Security module - Main coordination for all security functions
 * Clean re-exports and minimal coordination
 */

// Input sanitization
export { sanitizeInput, sanitizeInputArray } from "./inputSanitizer.js";

// Safe regex utilities
export {
  safeRegexTest,
  syncSafeRegexTest,
  safeRegexMatch,
  safeRegexReplace,
  createSafeRegex,
  isInputLengthSafe,
  REGEX_TIMEOUTS,
} from "./safeRegex.js";

// Pattern detection
export {
  detectDangerousPatterns,
  isSafeInput,
  batchDetectDangerousPatterns,
  getPatternInfo,
  getAllPatternNames,
  testAgainstPattern,
} from "./patternDetector.js";

// Common validation functions
export { validateClassNameSecurity } from "./validators.js";

// Length validation
export {
  validateLength,
  validateArrayLength,
  calculateTotalSize,
  validateCombinedSize,
} from "./lengthValidator.js";

// Security constants
export {
  MAX_CLASS_LENGTH,
  MAX_VALUE_LENGTH,
  MAX_CLASSES_PER_REQUEST,
  DANGEROUS_PATTERNS,
  SAFE_CSS_FUNCTIONS,
  SECURITY_ERRORS,
} from "./securityConstants.js";
