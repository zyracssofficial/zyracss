/**
 * ZyraCSS Cache System - Main Cache Manager
 * Coordinates multi-layer caching for optimal performance
 */

import { LRUCache } from "./lruCache.js";
import { keyGenerator } from "./keyGenerator.js";
import { now, fastNow } from "../utils/essential.js";
import { createLogger } from "../utils/index.js";
import { MAX_CACHE_KEY_LENGTH } from "../security/securityConstants.js";

const logger = createLogger("CacheManager");

/**
 * Two-layer cache system for ZyraCSS
 * Provides caching for CSS generation and parsing
 */
export class ZyraCacheManager {
  constructor(options = {}) {
    // Cache configuration with enhanced security limits
    const config = {
      cssMaxSize: options.cssMaxSize || 500, // CSS generation cache
      parseMaxSize: options.parseMaxSize || 2000, // Parsed class cache
      ttl: options.ttl || 3600000, // 1 hour TTL
      maxKeyLength: options.maxKeyLength || MAX_CACHE_KEY_LENGTH, // Prevent key-based attacks
      maxValueSize: options.maxValueSize || 250000, // 250KB per cached value (increased for production)
      enableLargeResultCaching: options.enableLargeResultCaching !== false, // Enable by default
      largeResultThreshold: options.largeResultThreshold || 100000, // 100KB threshold for large results
      ...options,
    };

    // Store config for validation
    this.config = config;

    // Initialize cache layers
    this.cssCache = new LRUCache(config.cssMaxSize, config.ttl);
    this.parseCache = new LRUCache(config.parseMaxSize, config.ttl);

    // Performance tracking
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      startTime: fastNow(),
    };
  }

  /**
   * Get cached CSS generation result
   * @param {Array<string>} classes Array of class names
   * @param {Object} options Generation options
   * @returns {Object|null} Cached result or null
   */
  getCachedCSS(classes, options = {}) {
    this.stats.totalRequests++;

    const key = keyGenerator.zyraGenerateCSSKey(classes, options);
    const cached = this.cssCache.get(key);

    if (cached) {
      this.stats.cacheHits++;
      return {
        ...cached,
        fromCache: true,
        cacheHit: true,
        cacheKey: key,
      };
    }

    this.stats.cacheMisses++;
    return null;
  }

  /**
   * Validate cache input for security
   * @param {string} key Cache key
   * @param {any} value Cache value
   * @returns {boolean} True if valid
   */
  validateCacheInput(key, value) {
    // Key validation
    if (typeof key !== "string" || key.length > this.config.maxKeyLength) {
      logger.warn(
        `Cache key too long or invalid: ${key?.length || "undefined"} (max: ${this.config.maxKeyLength})`
      );
      return false;
    }

    // Value size validation with smart large result handling
    if (value && typeof value === "object") {
      const valueStr = JSON.stringify(value);

      // Hard limit - reject extremely large values
      if (valueStr.length > this.config.maxValueSize) {
        logger.warn(
          `Cache value too large: ${valueStr.length} bytes (max: ${this.config.maxValueSize})`
        );

        // For large results, try caching essential data only
        if (
          this.config.enableLargeResultCaching &&
          valueStr.length > this.config.largeResultThreshold
        ) {
          return this.validateReducedCacheValue(value, valueStr.length);
        }

        return false;
      }
    }

    return true;
  }

  /**
   * Validate reduced cache value for large results
   * @param {Object} value Original value
   * @param {number} originalSize Original size in bytes
   * @returns {boolean} Whether reduced value can be cached
   */
  validateReducedCacheValue(value, originalSize) {
    try {
      // Create a reduced version with essential data only
      const reducedValue = this.createReducedCacheValue(value);
      const reducedStr = JSON.stringify(reducedValue);

      if (reducedStr.length <= this.config.maxValueSize) {
        logger.info(
          `Large result reduced for caching: ${originalSize} → ${reducedStr.length} bytes (${Math.round((reducedStr.length / originalSize) * 100)}% of original)`
        );
        return true;
      }

      logger.warn(
        `Even reduced cache value too large: ${reducedStr.length} bytes (max: ${this.config.maxValueSize})`
      );
      return false;
    } catch (error) {
      logger.warn(`Failed to create reduced cache value: ${error.message}`);
      return false;
    }
  }

  /**
   * Create reduced cache value for large results
   * @param {Object} value Original cache value
   * @returns {Object} Reduced cache value
   */
  createReducedCacheValue(value) {
    if (!value || typeof value !== "object") {
      return value;
    }

    // For CSS generation results, keep essential data only
    if (value.css && value.stats) {
      return {
        css: value.css, // Keep full CSS - this is what we need
        stats: {
          // Keep essential stats only
          totalClasses: value.stats.totalClasses,
          validClasses: value.stats.validClasses,
          invalidClasses: value.stats.invalidClasses,
          generationTime: value.stats.generationTime,
        },
        timestamp: value.timestamp,
        // Skip detailed breakdowns and metadata to save space
      };
    }

    return value;
  }

  /**
   * Cache CSS generation result with validation
   * @param {Array<string>} classes Array of class names
   * @param {Object} options Generation options
   * @param {Object} result Generation result
   */
  setCachedCSS(classes, options = {}, result) {
    const key = keyGenerator.zyraGenerateCSSKey(classes, options);

    // Store essential data only to minimize memory usage
    const cacheData = {
      css: result.css,
      stats: {
        ...result.stats,
        totalClasses: classes.length,
        cacheTimestamp: now(),
      },
      invalid: result.invalid || [],
      security: result.security || [],
    };

    // Validate before caching
    if (this.validateCacheInput(key, cacheData)) {
      this.cssCache.set(key, cacheData);
    } else {
      // Try reduced caching for large results
      if (this.config.enableLargeResultCaching) {
        const reducedData = this.createReducedCacheValue(cacheData);
        if (this.validateCacheInput(key, reducedData)) {
          this.cssCache.set(key, reducedData);
          logger.info("Cached reduced version of large result");
        } else {
          logger.warn("Skipping cache - even reduced version too large");
        }
      } else {
        logger.warn("Skipping cache due to validation failure");
      }
    }
  }

  /**
   * Get cached parsed class result
   * @param {string} className Class name
   * @returns {Object|null} Parsed result or null
   */
  getCachedParse(className) {
    const key = keyGenerator.parseKey(className);
    return this.parseCache.get(key);
  }

  /**
   * Cache parsed class result with validation
   * @param {string} className Class name
   * @param {Object} parseResult Parse result
   */
  setCachedParse(className, parseResult) {
    const key = keyGenerator.parseKey(className);

    // Validate before caching
    if (this.validateCacheInput(key, parseResult)) {
      this.parseCache.set(key, parseResult);
    } else {
      logger.warn("Skipping parse cache due to validation failure");
    }
  }

  /**
   * Clear all caches
   */
  clear() {
    this.cssCache.clear();
    this.parseCache.clear();

    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      startTime: fastNow(),
    };
  }

  /**
   * Get comprehensive cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const cssStats = this.cssCache.getStats();
    const parseStats = this.parseCache.getStats();

    const totalHits = this.stats.cacheHits;
    const totalRequests = this.stats.totalRequests;

    return {
      // Overall stats
      totalRequests,
      cacheHits: totalHits,
      cacheMisses: this.stats.cacheMisses,
      hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,

      // Individual cache stats
      css: {
        size: cssStats.size,
        maxSize: cssStats.maxSize,
        hitRate: cssStats.hitRate,
        hits: cssStats.hits,
        misses: cssStats.misses,
      },
      parse: {
        size: parseStats.size,
        maxSize: parseStats.maxSize,
        hitRate: parseStats.hitRate,
        hits: parseStats.hits,
        misses: parseStats.misses,
      },

      // Legacy compatibility
      generationSize: cssStats.size,
      generationHits: cssStats.hits,
      generationMisses: cssStats.misses,
      generationHitRate: cssStats.hitRate,
      parseSize: parseStats.size,
      parseHits: parseStats.hits,
      parseMisses: parseStats.misses,
    };
  }

  // Legacy compatibility methods
  getCachedGeneratedCSS(classes, options) {
    return this.getCachedCSS(classes, options);
  }

  cacheGeneratedCSS(classes, options, result) {
    return this.setCachedCSS(classes, options, result);
  }

  getCachedParsedClass(className) {
    return this.getCachedParse(className);
  }

  cacheParsedClass(className, result) {
    return this.setCachedParse(className, result);
  }
}

// Global cache instance
export const globalCache = new ZyraCacheManager();
