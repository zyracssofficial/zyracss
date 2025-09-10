/**
 * Lightweight error exports for API layer
 * Re-exports only essential error classes to minimize bundle size
 * Avoids importing the full 349-line error system
 */

export { ZyraResult, ZyraError, ErrorFactory, ERROR_CODES } from "./index.js";

// Note: This file allows API modules to import just the essential error classes
// without pulling in global error handlers, process listeners, and specialized result types
