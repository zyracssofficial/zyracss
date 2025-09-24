/**
 * ZyraCSS Internal API
 *
 * This module provides internal utilities for ZyraCSS packages (CLI, Vite, etc.)
 * These exports are NOT part of the public API and may change without notice.
 *
 * Only intended for use by official @zyracss packages.
 *
 * @internal
 */

// Version utilities
export { zyraGetVersion } from "./core/utils/version.js";

// Performance utilities
export { now } from "./core/utils/index.js";

// Cache management
export { cleanupGlobalCache } from "./core/cache/index.js";

// Error handling
export { ZyraError, ERROR_CODES } from "./core/errors/essential.js";

// Security constants
export { MAX_FILES_LIMIT } from "./core/security/securityConstants.js";

// Parser utilities
export { zyraExtractClassFromHTML } from "./core/parser/index.js";

/**
 * Re-export the main public API for convenience
 * This allows packages to import both public and internal APIs from one place if needed
 */
export { zyra } from "./index.js";
