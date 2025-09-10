/**
 * Error System - Main Index with Clean Exports
 * Provides centralized error handling with clean modular exports
 */

// ============================================================================
// CORE ERROR CLASSES
// ============================================================================

/**
 * Standard ZyraCSS Result type - used everywhere for consistency
 */
export class ZyraResult {
  constructor(success, data = null, error = null) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static success(data) {
    return new ZyraResult(true, data, null);
  }

  static error(error) {
    return new ZyraResult(false, null, error);
  }
}

// Error context size limits to prevent memory leaks
const MAX_CONTEXT_SIZE = 1024 * 10; // 10KB max per context object
const MAX_STRING_LENGTH = 1000; // Max length for individual context strings

/**
 * Sanitize and limit context data to prevent memory accumulation
 */
function sanitizeContext(context) {
  if (!context || typeof context !== "object") {
    return context;
  }

  const sanitized = {};
  let totalSize = 0;

  for (const [key, value] of Object.entries(context)) {
    let sanitizedValue = value;

    if (typeof value === "string" && value.length > MAX_STRING_LENGTH) {
      sanitizedValue = value.slice(0, MAX_STRING_LENGTH) + "...truncated";
    } else if (typeof value === "object" && value !== null) {
      // Recursively sanitize nested objects, but limit depth
      try {
        const stringified = JSON.stringify(value);
        if (stringified.length > MAX_STRING_LENGTH) {
          sanitizedValue = "[Large object - truncated]";
        } else {
          sanitizedValue = value;
        }
      } catch (e) {
        sanitizedValue = "[Non-serializable object]";
      }
    }

    // Check if adding this property would exceed size limit
    const serializedValue = JSON.stringify(sanitizedValue);
    const valueSize = serializedValue ? serializedValue.length : 9; // 'undefined'.length = 9
    const newSize = totalSize + valueSize + key.length + 10; // +10 for JSON overhead
    if (newSize >= MAX_CONTEXT_SIZE) {
      sanitized["...truncated"] =
        `${Object.keys(context).length - Object.keys(sanitized).length} more properties`;
      break;
    }

    sanitized[key] = sanitizedValue;
    totalSize = newSize;
  }

  return sanitized;
}

/**
 * Standard ZyraCSS Error class with context and suggestions
 */
export class ZyraError extends Error {
  constructor(code, message, context = {}, suggestions = []) {
    super(message);
    this.name = "ZyraError";
    this.code = code;
    this.context = sanitizeContext(context);
    this.suggestions = Array.isArray(suggestions)
      ? suggestions.slice(0, 10)
      : []; // Limit suggestions
    this.timestamp = new Date().toISOString();
  }

  static fromException(error) {
    if (error instanceof ZyraError) return error;

    return new ZyraError("UNEXPECTED_ERROR", error.message, {
      originalError: error.name,
      stack: error.stack?.slice(0, MAX_STRING_LENGTH), // Limit stack trace size
    });
  }

  /**
   * Clean up error collections to prevent memory leaks
   * @param {Array} errors - Array of errors to clean up
   * @param {number} maxErrors - Maximum number of errors to keep
   * @returns {Array} Cleaned error array
   */
  static cleanup(errors, maxErrors = 100) {
    if (!Array.isArray(errors) || errors.length <= maxErrors) {
      return errors;
    }

    // Keep the most recent errors and add a summary of discarded ones
    const kept = errors.slice(-maxErrors);
    const discarded = errors.length - maxErrors;

    kept.unshift(
      new ZyraError(
        "ERROR_CLEANUP",
        `Error history cleaned up: ${discarded} older errors removed`,
        { discardedCount: discarded, timestamp: new Date().toISOString() },
        ["This is automatic cleanup to prevent memory leaks"]
      )
    );

    return kept;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      suggestions: this.suggestions,
      timestamp: this.timestamp,
    };
  }
}

// ============================================================================
// ERROR CONSTANTS
// ============================================================================

export const ERROR_CODES = {
  // Input errors
  INVALID_INPUT: "INVALID_INPUT",
  INVALID_CLASS_SYNTAX: "INVALID_CLASS_SYNTAX",
  INVALID_CSS_VALUE: "INVALID_CSS_VALUE",

  // Security errors
  DANGEROUS_INPUT: "DANGEROUS_INPUT",
  INPUT_TOO_LONG: "INPUT_TOO_LONG",

  // Processing errors
  PARSING_FAILED: "PARSING_FAILED",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  GENERATION_FAILED: "GENERATION_FAILED",

  // System errors
  PROPERTY_NOT_SUPPORTED: "PROPERTY_NOT_SUPPORTED",
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
};

// ============================================================================
// ERROR FACTORY
// ============================================================================

export class ErrorFactory {
  static invalidInput(input, reason, suggestions = []) {
    return new ZyraError(
      ERROR_CODES.INVALID_INPUT,
      `Invalid input: ${reason}`,
      { input, inputType: typeof input },
      suggestions
    );
  }

  static invalidClassSyntax(className, reason, suggestions = []) {
    return new ZyraError(
      ERROR_CODES.INVALID_CLASS_SYNTAX,
      `Invalid class syntax in "${className}": ${reason}`,
      { className },
      suggestions.length
        ? suggestions
        : [
            "Use bracket syntax: property-[value]",
            "Use shorthand syntax: property-value",
            "Check for unmatched brackets or invalid characters",
          ]
    );
  }

  static invalidCSSValue(property, value, reason, suggestions = []) {
    return new ZyraError(
      ERROR_CODES.INVALID_CSS_VALUE,
      `Invalid CSS value "${value}" for property "${property}": ${reason}`,
      { property, value },
      suggestions
    );
  }

  static dangerousInput(input, patterns, suggestions = []) {
    return new ZyraError(
      ERROR_CODES.DANGEROUS_INPUT,
      `Input contains dangerous patterns: ${patterns.join(", ")}`,
      { input, detectedPatterns: patterns },
      suggestions.length
        ? suggestions
        : [
            "Remove javascript: URLs",
            "Remove data: URLs",
            "Remove CSS expressions",
            "Use safe CSS values only",
          ]
    );
  }

  static parsingFailed(input, reason, suggestions = []) {
    return new ZyraError(
      ERROR_CODES.PARSING_FAILED,
      `Failed to parse input: ${reason}`,
      { input },
      suggestions
    );
  }

  static propertyNotSupported(property, availableProperties = []) {
    const suggestions = availableProperties.length
      ? [`Did you mean: ${availableProperties.slice(0, 3).join(", ")}?`]
      : ["Check the property mapping documentation"];

    return new ZyraError(
      ERROR_CODES.PROPERTY_NOT_SUPPORTED,
      `CSS property "${property}" is not supported`,
      { property, availableProperties },
      suggestions
    );
  }

  static generationFailed(className, reason, suggestions = []) {
    return new ZyraError(
      ERROR_CODES.GENERATION_FAILED,
      `Failed to generate CSS for "${className}": ${reason}`,
      { className },
      suggestions
    );
  }
}

// ============================================================================
// SPECIALIZED RESULT CLASSES
// ============================================================================

export class ValidationResult {
  constructor(isValid, value = null, errors = []) {
    this.isValid = isValid;
    this.value = value;
    this.errors = errors;
  }

  static valid(value) {
    return new ValidationResult(true, value, []);
  }

  static invalid(errors) {
    const errorArray = Array.isArray(errors) ? errors : [errors];
    return new ValidationResult(false, null, errorArray);
  }

  toZyraResult() {
    if (this.isValid) {
      return ZyraResult.success(this.value);
    } else {
      return ZyraResult.error(
        this.errors[0] ||
          new ZyraError("VALIDATION_FAILED", "Validation failed")
      );
    }
  }

  addError(error) {
    this.errors.push(error);
    this.isValid = false;
    return this;
  }
}

export class ParseResult {
  constructor(parsed = [], invalid = []) {
    this.parsed = parsed;
    this.invalid = invalid;
  }

  static success(parsed) {
    return new ParseResult(parsed, []);
  }

  static withInvalid(parsed, invalid) {
    return new ParseResult(parsed, invalid);
  }

  get isFullyValid() {
    return this.invalid.length === 0;
  }

  get hasAnyValid() {
    return this.parsed.length > 0;
  }

  toZyraResult() {
    if (this.hasAnyValid) {
      return ZyraResult.success({
        parsed: this.parsed,
        invalid: this.invalid,
        stats: {
          total: this.parsed.length + this.invalid.length,
          valid: this.parsed.length,
          invalid: this.invalid.length,
        },
      });
    } else {
      return ZyraResult.error(
        new ZyraError(
          ERROR_CODES.PARSING_FAILED,
          "No valid classes could be parsed",
          { totalInput: this.invalid.length }
        )
      );
    }
  }
}
