/**
 * ZyraCSS - Main package entry point
 * Exports the programmatic API for generating utility-first CSS
 *
 * Re-export Pattern Purpose:
 * - Provides clean public API surface for consumers
 * - Maintains stable interface while allowing internal refactoring
 * - Groups related functionality logically for different use cases
 * - Enables tree-shaking for minimal bundle sizes
 * - Offers both granular and convenience imports
 */

// ============================================================================
// PRIMARY API - Core functionality for MVP
// ============================================================================

export {
  zyraGenerateCSS,
  zyraGenerateCSSFromHTML,
  zyraGenerateCSSFromClasses,
} from "./api/core/generateCSS.js";

// ============================================================================
// ADVANCED API - For complex integrations
// ============================================================================

// Incremental engine for real-time editing
export { zyraCreateEngine } from "./api/core/createEngine.js";

// Simple browser runtime for React/Vite projects
export { zyraCSSManager } from "./api/core/browserManager.js";

// ============================================================================
// UTILITY API - For tooling and advanced usage
// ============================================================================

export { zyraExtractClassFromHTML } from "./core/parser/index.js";
export { validateClasses } from "./core/validators/index.js";

// Additional convenience methods for validation
export {
  validateClassNames,
  validateSingleClass,
  getValidationStats,
  parseClassesDirect,
} from "./api/utilities/convenienceMethods.js";

// Parser API with consistent structure
import { parseClasses as coreParseClasses } from "./core/parser/classParser.js";
export function parseClasses(classes) {
  const result = coreParseClasses(classes);
  return {
    hasAnyValid: result.hasAnyValid,
    valid: result.parsed || [],
    invalid: result.invalid || [],
  };
}

// ============================================================================
// METADATA & UTILITIES - Version info and tooling
// ============================================================================

export { zyraGetVersion } from "./core/utils/version.js";
export { cleanupGlobalCache } from "./core/cache/index.js";
export { now } from "./core/utils/index.js";
export { MAX_FILES_LIMIT } from "./core/security/securityConstants.js";

// ============================================================================
// DEFAULT EXPORT - Main function for convenience
// ============================================================================

export { zyraGenerateCSS as default } from "./api/core/generateCSS.js";
