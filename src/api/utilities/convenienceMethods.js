/**
 * Convenience methods module for zyraGenerateCSS API
 * Provides utility functions and simplified interfaces
 */

import { parseClasses } from "../../core/parser/index.js";
import { sanitizeInputArray } from "../../core/security/index.js";
import { now } from "../../core/utils/essential.js";
import { ZyraResult, ErrorFactory } from "../../core/errors/essential.js";
import { validateClassesInput } from "../validators/inputValidator.js";

/**
 * Validate classes without generating CSS
 * @param {Array<string>} classes - Array of class names to validate
 * @returns {Promise<ZyraResult>} Validation results only
 */
export async function validateClassNames(classes) {
  const validation = validateClassesInput(classes);
  if (!validation.success) {
    return validation;
  }

  try {
    const startTime = now();

    // Security validation
    const { sanitized, failed } = sanitizeInputArray(classes);

    // Parse validation
    const parseResult = parseClasses(sanitized);

    const processingTime = now() - startTime;

    const result = {
      valid: parseResult.parsed.map((p) => p.className),
      invalid: [
        ...parseResult.invalid.map((inv) => ({
          className: inv.className,
          reason: inv.error.message,
          suggestions: inv.suggestions || [],
        })),
        ...failed.map((f) => ({
          className: f,
          reason: "Failed security validation",
          suggestions: ["Remove dangerous characters"],
        })),
      ],
      stats: {
        total: classes.length,
        validCount: parseResult.parsed.length,
        invalidCount: parseResult.invalid.length + failed.length,
        processingTime,
      },
    };

    return ZyraResult.success(result);
  } catch (error) {
    return ZyraResult.error(
      ErrorFactory.parsingFailed("Validation process failed", error.message)
    );
  }
}
