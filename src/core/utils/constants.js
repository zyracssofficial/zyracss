/**
 * Shared constants used across ZyraCSS
 * Non-security related constants and configuration
 */

// Version info with fallback to prevent module loading issues
const VERSION_INFO = {
  version: "0.1.0",
  major: 0,
  minor: 1,
  patch: 0,
  name: "zyracss",
  FULL: "0.1.0",
};

// CSS unit types
export const CSS_UNITS = {
  LENGTH: [
    "px",
    "em",
    "rem",
    "vh",
    "vw",
    "%",
    "in",
    "cm",
    "mm",
    "pt",
    "pc",
    "ex",
    "ch",
    "vmin",
    "vmax",
    "fr",
  ],
  ANGLE: ["deg", "grad", "rad", "turn"],
  TIME: ["s", "ms"],
  FREQUENCY: ["Hz", "kHz"],
  RESOLUTION: ["dpi", "dpcm", "dppx"],
};

// Cache configuration constants
export const CACHE_CONSTANTS = {
  // Cache sizes
  MAX_PARSE_CACHE: 5000,
  MAX_GENERATION_CACHE: 1000,
  DEFAULT_CACHE_SIZE: 1000,
  KEY_CACHE_SIZE_DIVIDER: 2, // keyCacheMaxSize = maxSize / 2

  // TTL values (in milliseconds)
  TTL_ONE_HOUR: 60 * 60 * 1000, // 3600000ms
  TTL_THIRTY_MINUTES: 30 * 60 * 1000, // 1800000ms
  TTL_DEFAULT: 60 * 60 * 1000, // 1 hour default

  // Memory limits
  MAX_MEMORY_SIZE: 1024 * 1024, // 1MB
  RECOMMENDED_MEMORY_SIZE: 100 * 1024, // 100KB
};

// Processing constants
export const PROCESSING_CONSTANTS = {
  MAX_VALIDATION_BATCH: 1000,
  MAX_ENGINE_CLASSES: 10000,
  DECIMAL_PRECISION: 100, // For Math.round(value * 100) / 100
  PERCENTAGE_MAX: 100,
  PERCENTAGE_MIN: 0,
  PROGRESS_MIN: 0,
  PROGRESS_MAX: 100,

  // Basic validation constants
  MIN_ZERO: 0,
  OPACITY_MIN: 0,
  OPACITY_MAX: 1,

  // Color validation ranges
  RGB_MIN: 0,
  RGB_MAX: 255,
  HSL_PERCENTAGE_MIN: 0,
  HSL_PERCENTAGE_MAX: 100,
  HSL_HUE_MIN: 0,
  HSL_HUE_MAX: 360,
  ALPHA_MIN: 0,
  ALPHA_MAX: 1,

  // Font validation ranges
  FONT_WEIGHT_MIN: 1,
  FONT_WEIGHT_MAX: 1000,

  // Validation ranges
  NUMBER_RANGE_MIN: 1,
  NUMBER_RANGE_MAX: 1000,
};

// Error codes for consistent error handling
// Version information
export { VERSION_INFO };

// Debug levels
export const DEBUG_LEVELS = {
  NONE: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  TRACE: 5,
};
