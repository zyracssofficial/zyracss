/**
 * Incremental CSS generation engine for real-time editing
 * Maintains state for live updates and progressive CSS building
 */

import { parseClasses } from "../../core/parser/index.js";
import { zyraGenerateCSS as zyraGenerateCSSCore } from "../../core/generator/index.js";
import { validateClasses } from "../../core/validators/index.js";
import { sanitizeInputArray } from "../../core/security/index.js";
import { createLogger, now } from "../../core/utils/index.js";
import { zyraGetVersion } from "../../core/utils/version.js";
import { ZyraResult } from "../../core/errors/essential.js";

const logger = createLogger("Engine");

/**
 * Create a ZyraCSS engine for incremental CSS generation
 * Perfect for real-time editing, live previews, and AI-driven style updates
 *
 * @param {Object} options - Engine configuration options
 * @returns {Object} Engine instance with methods for incremental updates
 */
export function zyraCreateEngine(options = {}) {
  const {
    minify = false,
    groupSelectors = true,
    includeComments = false,
    autoUpdate = true,
    maxClasses = 10000,
    cacheEnabled = true,
  } = options;

  // Engine state
  let allClasses = new Set();
  let cachedCSS = null;
  let lastUpdateTime = 0;
  let parseCache = new Map();
  let updateCount = 0;

  // Performance tracking
  const stats = {
    totalUpdates: 0,
    totalClasses: 0,
    cacheHits: 0,
    cacheMisses: 0,
    lastGenerationTime: 0,
    averageGenerationTime: 0,
  };

  /**
   * Add classes to the engine
   * @param {Array<string>} classes - Array of utility class names
   * @returns {Object} Update result with success status
   */
  function addClasses(classes) {
    if (!Array.isArray(classes)) {
      logger.warn("addClasses expects an array of strings");
      return { success: false, added: 0, invalid: ["Input must be an array"] };
    }

    const startTime = now();
    const initialSize = allClasses.size;

    // Sanitize and validate new classes
    const { sanitized, failed } = sanitizeInputArray(classes);
    const validation = validateClasses(sanitized);

    // Track invalid classes
    const invalid = [...validation.invalid, ...failed];

    // Add valid classes to the set (Set automatically deduplicates)
    validation.valid.forEach((cls) => allClasses.add(cls));

    const addedCount = allClasses.size - initialSize;

    // Invalidate cache if new classes were added
    if (addedCount > 0) {
      cachedCSS = null;
      lastUpdateTime = now();
    }

    stats.totalUpdates++;
    updateCount++;

    logger.debug(
      `Added ${addedCount} new classes (${validation.valid.length} total processed)`
    );

    return {
      success: true,
      added: addedCount,
      invalid,
      totalClasses: allClasses.size,
      processingTime: now() - startTime,
    };
  }

  /**
   * Generate CSS from current classes
   * @param {Object} generationOptions - Override generation options
   * @returns {Object} Generated CSS and metadata
   */
  function getCSS(generationOptions = {}) {
    const startTime = now();

    // Use cached CSS if available and no updates occurred
    if (cacheEnabled && cachedCSS && updateCount === 0) {
      stats.cacheHits++;
      return {
        ...cachedCSS,
        data: {
          ...cachedCSS.data,
          stats: {
            ...cachedCSS.data.stats,
            fromCache: true,
            processingTime: 0,
          },
        },
      };
    }

    stats.cacheMisses++;

    if (allClasses.size === 0) {
      const emptyResult = {
        success: true,
        data: {
          css: "",
          stats: {
            totalClasses: 0,
            validClasses: 0,
            invalidClasses: 0,
            generatedRules: 0,
            processingTime: 0,
            fromCache: false,
            cacheTimestamp: null,
          },
          invalid: [],
          security: {
            passed: true,
            blockedClasses: [],
            warnings: [],
          },
        },
        error: null,
      };

      if (cacheEnabled) {
        cachedCSS = emptyResult;
        updateCount = 0;
      }

      return emptyResult;
    }

    // Merge options
    const finalOptions = {
      minify,
      groupSelectors,
      includeComments,
      ...generationOptions,
    };

    try {
      // Parse classes directly from Set using iteration (more memory efficient)
      const parsedClasses = [];
      for (const className of allClasses) {
        if (parseCache.has(className)) {
          parsedClasses.push(parseCache.get(className));
        } else {
          // Parse new class
          const parseResult = parseClasses([className]);
          if (parseResult.parsed.length > 0) {
            parseCache.set(className, parseResult.parsed[0]);
            parsedClasses.push(parseResult.parsed[0]);
          }
        }
      }

      // Generate CSS
      const result = zyraGenerateCSSCore(parsedClasses, finalOptions);
      const processingTime = now() - startTime;

      const finalResult = {
        success: true,
        data: {
          css: result.css,
          stats: {
            totalClasses: allClasses.size,
            validClasses: allClasses.size, // Engine only tracks valid classes
            invalidClasses: 0, // Invalid classes filtered during addClasses
            generatedRules: result.stats.totalRules || 0,
            groupedRules: result.stats.groupedRules || 0,
            compressionRatio: result.stats.compressionRatio || 1,
            processingTime: Math.round(processingTime * 100) / 100,
            fromCache: false,
            cacheTimestamp: null,
          },
          invalid: [], // Engine doesn't track invalid classes in output
          security: {
            passed: true,
            blockedClasses: [],
            warnings: [],
          }, // Engine operates on pre-validated classes
        },
        error: null,
      };

      // Update performance stats
      stats.lastGenerationTime = processingTime;
      stats.averageGenerationTime =
        (stats.averageGenerationTime * stats.totalUpdates + processingTime) /
        (stats.totalUpdates + 1);

      // Cache the result
      if (cacheEnabled) {
        cachedCSS = finalResult;
        updateCount = 0;
      }

      return finalResult;
    } catch (error) {
      const processingTime = now() - startTime;
      logger.error("CSS generation failed:", error.message);

      // Return consistent error format
      return ZyraResult.error({
        code: "GENERATION_FAILED",
        message: error.message,
        details: {
          totalClasses: allClasses.size,
          processingTime: Math.round(processingTime * 100) / 100,
        },
      });
    }
  }

  /**
   * Get current engine statistics
   * @returns {Object} Engine performance and usage statistics
   */
  function getStats() {
    return {
      ...stats,
      totalClasses: allClasses.size,
      cacheSize: parseCache.size,
      updateCount,
      cacheHitRate:
        stats.cacheHits / (stats.cacheHits + stats.cacheMisses) || 0,
      uptime: now() - lastUpdateTime,
    };
  }

  // Initialize
  lastUpdateTime = now();

  // Return the engine instance
  return {
    // Core methods
    addClasses,
    getCSS,

    // Management methods
    getStats,

    // Properties
    get size() {
      return allClasses.size;
    },

    get options() {
      return { ...options };
    },

    // Engine metadata
    get type() {
      return "ZyraCSS-Engine";
    },

    get version() {
      return zyraGetVersion();
    },
  };
}
