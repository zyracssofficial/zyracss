/**
 * Dangerous pattern detection for security with safe regex execution
 * Identifies and blocks malicious content patterns using timeout protection
 */

import { DANGEROUS_PATTERNS, MAX_INPUT_LENGTH } from "./securityConstants.js";
import { syncSafeRegexTest, REGEX_TIMEOUTS } from "./safeRegex.js";

// Pre-compile dangerous patterns for better performance
const COMPILED_PATTERNS = (() => {
  const compiled = {};
  const highPriority = [];

  for (const [patternName, patternInfo] of Object.entries(DANGEROUS_PATTERNS)) {
    // Store compiled pattern with metadata
    const compiledEntry = {
      regex: patternInfo.regex, // Already compiled RegExp objects
      description: patternInfo.description,
      riskLevel: patternInfo.riskLevel,
      examples: patternInfo.examples,
      mitigation: patternInfo.mitigation,
    };

    compiled[patternName] = compiledEntry;

    // Build high-priority patterns list for quick checks
    if (
      patternInfo.riskLevel === "critical" ||
      patternInfo.riskLevel === "high"
    ) {
      highPriority.push(compiledEntry);
    }
  }

  return { all: compiled, highPriority };
})();

/**
 * Check if input contains dangerous patterns
 * @param {string} input - Input to check
 * @returns {Object} Detection result with details
 */
export function detectDangerousPatterns(input) {
  if (typeof input !== "string") {
    return {
      isDangerous: false,
      matchedPatterns: [],
      riskLevel: "none",
    };
  }

  const matchedPatterns = [];
  let highestRiskLevel = "none";

  // Check against all dangerous patterns using pre-compiled patterns
  for (const [patternName, patternInfo] of Object.entries(
    COMPILED_PATTERNS.all
  )) {
    const testResult = syncSafeRegexTest(patternInfo.regex, input, {
      timeout: REGEX_TIMEOUTS.NORMAL,
      maxLength: 50000,
    });

    // syncSafeRegexTest returns a boolean, not an object
    if (testResult) {
      // Safe match operation
      const matchResult = input.match(patternInfo.regex);
      matchedPatterns.push({
        name: patternName,
        description: patternInfo.description,
        riskLevel: patternInfo.riskLevel,
        match: matchResult?.[0],
      });

      // Update highest risk level
      if (
        getRiskPriority(patternInfo.riskLevel) >
        getRiskPriority(highestRiskLevel)
      ) {
        highestRiskLevel = patternInfo.riskLevel;
      }
    }
  }

  return {
    isDangerous: matchedPatterns.length > 0,
    matchedPatterns,
    riskLevel: highestRiskLevel,
    inputLength: input.length,
  };
}

/**
 * Get risk priority for comparison
 * @param {string} riskLevel - Risk level string
 * @returns {number} Priority number (higher = more dangerous)
 */
function getRiskPriority(riskLevel) {
  const priorities = {
    none: 0,
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };
  return priorities[riskLevel] || 0;
}

/**
 * Quick check if input is safe (no dangerous patterns)
 * @param {string} input - Input to check
 * @returns {boolean} True if safe, false if dangerous
 */
export function isSafeInput(input) {
  if (typeof input !== "string") {
    return false;
  }

  // Quick check against pre-compiled high-priority patterns
  for (const pattern of COMPILED_PATTERNS.highPriority) {
    const testResult = syncSafeRegexTest(pattern.regex, input, {
      timeout: REGEX_TIMEOUTS.FAST,
      maxLength: MAX_INPUT_LENGTH,
    });

    // syncSafeRegexTest returns a boolean - if true, pattern matched (dangerous)
    if (testResult) {
      return false;
    }
  }

  return true;
}

/**
 * Batch check multiple inputs for dangerous patterns
 * @param {Array<string>} inputs - Array of inputs to check
 * @returns {Object} Batch detection results
 */
export function batchDetectDangerousPatterns(inputs) {
  if (!Array.isArray(inputs)) {
    return {
      results: [],
      summary: {
        total: 0,
        safe: 0,
        dangerous: 0,
        highRisk: 0,
      },
    };
  }

  const results = [];
  let safe = 0;
  let dangerous = 0;
  let highRisk = 0;

  for (const input of inputs) {
    const detection = detectDangerousPatterns(input);
    results.push({
      input,
      ...detection,
    });

    if (detection.isDangerous) {
      dangerous++;
      if (
        detection.riskLevel === "high" ||
        detection.riskLevel === "critical"
      ) {
        highRisk++;
      }
    } else {
      safe++;
    }
  }

  return {
    results,
    summary: {
      total: inputs.length,
      safe,
      dangerous,
      highRisk,
      dangerousPercentage:
        inputs.length > 0 ? ((dangerous / inputs.length) * 100).toFixed(2) : 0,
    },
  };
}

/**
 * Get detailed information about a specific dangerous pattern
 * @param {string} patternName - Name of the pattern
 * @returns {Object|null} Pattern information or null if not found
 */
export function getPatternInfo(patternName) {
  const pattern = COMPILED_PATTERNS.all[patternName];
  if (!pattern) {
    return null;
  }

  return {
    name: patternName,
    description: pattern.description,
    riskLevel: pattern.riskLevel,
    examples: pattern.examples || [],
    mitigation: pattern.mitigation || "Block input containing this pattern",
  };
}

/**
 * Get all available dangerous patterns (for testing/debugging)
 * @returns {Array<string>} Array of pattern names
 */
export function getAllPatternNames() {
  return Object.keys(COMPILED_PATTERNS.all);
}

/**
 * Test input against a specific pattern with safe execution
 * @param {string} input - Input to test
 * @param {string} patternName - Name of pattern to test against
 * @returns {boolean} True if pattern matches
 */
export function testAgainstPattern(input, patternName) {
  const pattern = COMPILED_PATTERNS.all[patternName];
  if (!pattern || typeof input !== "string") {
    return false;
  }

  const testResult = syncSafeRegexTest(pattern.regex, input, {
    timeout: REGEX_TIMEOUTS.NORMAL,
    maxLength: 10000,
  });

  // Note: syncSafeRegexTest returns a boolean, not an object
  return testResult === true;
}
