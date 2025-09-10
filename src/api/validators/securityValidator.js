/**
 * Security validation module for zyraGenerateCSS API
 * Handles security validation and sanitization of classes
 */

import {
  sanitizeInputArray,
  detectDangerousPatterns,
  batchDetectDangerousPatterns,
  validateClassNameSecurity,
} from "../../core/security/index.js";
import { ZyraResult, ErrorFactory } from "../../core/errors/essential.js";

/**
 * Perform security validation on collected classes
 * @param {Array} allClasses - All collected classes
 * @param {Object} options - Security options
 * @returns {ZyraResult} Security validation result
 */
export function performSecurityValidation(allClasses, options = {}) {
  const { strict = true, veryStrict = true } = options;

  try {
    // First check for dangerous patterns
    const dangerousResults = [];
    let hasCriticalThreat = false;

    for (const className of allClasses) {
      if (typeof className === "string") {
        const securityCheck = validateClassNameSecurity(className);
        if (securityCheck.isDangerous) {
          dangerousResults.push({
            className,
            patterns: securityCheck.matchedPatterns,
            riskLevel: securityCheck.riskLevel,
          });

          if (securityCheck.riskLevel === "critical") {
            hasCriticalThreat = true;
          }
        }
      }
    }

    // In very strict mode, fail for medium+ risk patterns
    // In strict mode, fail only for critical patterns
    const shouldBlock = veryStrict
      ? dangerousResults.some((r) =>
          ["critical", "high", "medium"].includes(r.riskLevel)
        )
      : strict && hasCriticalThreat;

    if (shouldBlock) {
      const relevantClasses = veryStrict
        ? dangerousResults.filter((r) =>
            ["critical", "high", "medium"].includes(r.riskLevel)
          )
        : dangerousResults.filter((r) => r.riskLevel === "critical");

      const classNames = relevantClasses.map((r) => r.className);

      return ZyraResult.error(
        ErrorFactory.dangerousInput(
          classNames,
          [
            veryStrict
              ? "Security threats detected"
              : "Critical security threats detected",
          ],
          [
            "Remove JavaScript URLs and expressions",
            "Remove script tags and event handlers",
            "Remove data URLs and behavior properties",
            "Remove CSS imports and comments",
            "Use safe CSS values only",
          ]
        )
      );
    }

    // Sanitize inputs for basic cleaning
    const { sanitized, failed } = sanitizeInputArray(allClasses);

    // Create comprehensive security issues list
    const securityIssues = [
      ...dangerousResults.map((result) => ({
        className: result.className,
        reason: `Dangerous patterns detected: ${result.patterns.map((p) => p.name).join(", ")}`,
        riskLevel: result.riskLevel,
        type: "security",
        patterns: result.patterns.map((p) => p.name),
      })),
      ...failed.map((failedClass) => ({
        className: failedClass,
        reason: "Failed basic sanitization",
        riskLevel: "medium",
        type: "sanitization",
      })),
    ];

    // Filter out classes with dangerous patterns from valid classes
    const classesWithDangerousPatterns = new Set(
      dangerousResults.map((r) => r.className)
    );
    const finalValidClasses = sanitized.filter(
      (className) => !classesWithDangerousPatterns.has(className)
    );

    return ZyraResult.success({
      validClasses: finalValidClasses,
      securityIssues,
      dangerousClasses: Array.from(classesWithDangerousPatterns),
      stats: {
        total: allClasses.length,
        valid: finalValidClasses.length,
        dangerous: classesWithDangerousPatterns.size,
        sanitizationFailed: failed.length,
      },
    });
  } catch (error) {
    return ZyraResult.error(
      ErrorFactory.dangerousInput(
        allClasses,
        ["Security validation failed"],
        ["Review input for dangerous patterns"]
      )
    );
  }
}

/**
 * Create security issues summary
 * @param {Array} failedClasses - Classes that failed security validation
 * @returns {Array} Array of security issue objects
 */
export function createSecurityIssues(failedClasses) {
  return failedClasses.map((failedClass) => ({
    className: failedClass,
    reason: "Failed security validation",
    type: "security",
    suggestions: [
      "Remove dangerous characters",
      "Use only valid CSS class syntax",
    ],
  }));
}

/**
 * Sanitize classes and return detailed results
 * @param {Array} classes - Classes to sanitize
 * @returns {Object} Detailed sanitization results
 */
export function sanitizeClasses(classes) {
  const { sanitized, failed } = sanitizeInputArray(classes);

  return {
    validClasses: sanitized,
    invalidClasses: failed,
    securityIssues: createSecurityIssues(failed),
    stats: {
      total: classes.length,
      valid: sanitized.length,
      invalid: failed.length,
    },
  };
}
