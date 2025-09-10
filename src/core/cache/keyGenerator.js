/**
 * ZyraCSS Cache System - Key Generation
 * Simple, reliable cache key generation for consistent caching
 */

// Enhanced 64-bit hash function for better collision resistance
// Based on FNV-1a algorithm adapted for JavaScript's number limitations
function createEnhancedHash(str) {
  if (str.length === 0) return "0";

  // FNV-1a constants (adapted for JavaScript's safe integer range)
  const FNV_OFFSET_BASIS_32 = 0x811c9dc5;
  const FNV_PRIME_32 = 0x01000193;

  let hash = FNV_OFFSET_BASIS_32;

  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i);

    // FNV-1a: hash = hash XOR byte
    hash ^= byte;

    // FNV-1a: hash = hash * FNV_PRIME (with overflow handling)
    hash = Math.imul(hash, FNV_PRIME_32);
  }

  // Convert to unsigned 32-bit and then to hex for consistent output
  const unsignedHash = hash >>> 0;

  // Combine with a secondary hash for better distribution
  let secondaryHash = 0x9e3779b9; // Golden ratio constant
  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i);
    secondaryHash = Math.imul(secondaryHash ^ byte, 0x85ebca6b);
    secondaryHash = Math.imul(
      secondaryHash ^ (secondaryHash >>> 13),
      0xc2b2ae35
    );
  }
  secondaryHash = secondaryHash >>> 0;

  // Combine both hashes for 64-bit-like distribution
  return (
    unsignedHash.toString(16).padStart(8, "0") +
    secondaryHash.toString(16).padStart(8, "0")
  );
}

// Simple browser-compatible solution - always use the fallback hash
// This ensures compatibility across all environments without crypto dependencies
let createHashFunction = null; // Always null to force using our simple hash function

/**
 * Generate consistent cache keys for ZyraCSS operations
 */
export class CacheKeyGenerator {
  /**
   * Generate cache key for CSS generation
   * @param {Array<string>} classes Array of class names
   * @param {Object} options Generation options
   * @returns {string} Cache key
   */
  zyraGenerateCSSKey(classes, options = {}) {
    // Sort classes for consistent key generation
    const sortedClasses = [...classes].sort();

    // Only include options that affect CSS output
    const relevantOptions = this.extractRelevantOptions(options);

    // Optimized serialization - faster than JSON.stringify for simple objects
    const input = this.fastSerialize(sortedClasses, relevantOptions);

    // Generate hash
    return this.createHash(input, "css");
  }

  /**
   * Generate cache key for parsed class
   * @param {string} className Single class name
   * @returns {string} Cache key
   */
  parseKey(className) {
    return this.createHash(className, "parse");
  }

  /**
   * Extract only options that affect CSS generation
   * @param {Object} options Input options
   * @returns {Object} Filtered options
   */
  extractRelevantOptions(options) {
    const relevant = {};

    // Only include options that actually change the generated CSS
    if (options.minify === true) relevant.minify = true;
    if (options.groupSelectors === false) relevant.groupSelectors = false;
    if (options.includeComments === true) relevant.includeComments = true;
    if (options.important === true) relevant.important = true;
    if (options.scope) relevant.scope = options.scope;

    return relevant;
  }

  /**
   * Sort CSS properties for consistent key generation
   * @param {Object} properties CSS properties object
   * @returns {Object} Sorted properties
   */
  sortProperties(properties) {
    const sorted = {};
    const sortedKeys = Object.keys(properties).sort();
    // Using for...of for better performance than forEach
    for (const key of sortedKeys) {
      sorted[key] = properties[key];
    }
    return sorted;
  }

  /**
   * Fast serialization for cache keys - optimized alternative to JSON.stringify
   * @param {Array<string>} classes Sorted class names
   * @param {Object} options Relevant options
   * @returns {string} Serialized string
   */
  fastSerialize(classes, options) {
    // For arrays of strings and simple objects, manual serialization is faster
    let result = "c:[" + classes.join(",") + "]";

    if (options && Object.keys(options).length > 0) {
      result += ",o:{";
      const optionPairs = [];
      for (const key of Object.keys(options).sort()) {
        const value = options[key];
        optionPairs.push(
          `${key}:${typeof value === "string" ? value : String(value)}`
        );
      }
      result += optionPairs.join(",") + "}";
    }

    return result;
  }

  /**
   * Create hash from input string
   * @param {string} input Input to hash
   * @param {string} prefix Key prefix
   * @returns {string} Hash key
   */
  createHash(input, prefix) {
    let hash;

    if (createHashFunction) {
      // Node.js environment - use crypto module
      hash = createHashFunction("md5")
        .update(input)
        .digest("hex")
        .substring(0, 12);
    } else {
      // Browser environment - use enhanced hash for better collision resistance
      hash = createEnhancedHash(input).substring(0, 12);
    }

    return `${prefix}:${hash}`;
  }
}

// Global instance for consistent key generation
export const keyGenerator = new CacheKeyGenerator();
