/**
 * ZyraCSS Cache System - Clean Architecture
 */

import { keyGenerator as _keyGenerator } from "./keyGenerator.js";
import { globalCache as _globalCache } from "./cacheManager.js";

// Export all cache components
export { LRUCache } from "./lruCache.js";
export { CacheKeyGenerator, keyGenerator } from "./keyGenerator.js";
export { ZyraCacheManager, globalCache } from "./cacheManager.js";

// Essential legacy cache methods - core functionality only
export function getCachedGeneratedCSS(classes, options) {
  return _globalCache.getCachedCSS(classes, options);
}

export function cacheGeneratedCSS(classes, options, result) {
  return _globalCache.setCachedCSS(classes, options, result);
}

export function getCachedParsedClass(className) {
  return _globalCache.getCachedParse(className);
}

export function cacheParsedClass(className, result) {
  return _globalCache.setCachedParse(className, result);
}

// Global cache cleanup utility
export function cleanupGlobalCache() {
  _globalCache.clear();
}

// Higher-order function for parse caching
export function withParseCache(parseFunction) {
  return function (className, ...args) {
    // Try to get from cache first
    const cached = _globalCache.getCachedParse(className);
    if (cached) {
      return cached;
    }

    // Execute the parse function
    const result = parseFunction(className, ...args);

    // Cache the result if successful
    if (result && !result.error) {
      _globalCache.setCachedParse(className, result);
    }

    return result;
  };
}
