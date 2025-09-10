/**
 * ZyraCSS Cache System - Core LRU Cache Implementation
 * Simple, reliable LRU cache with TTL support
 */

import { fastNow } from "../utils/essential.js";

/**
 * Basic LRU Cache with Time-To-Live support
 */
export class LRUCache {
  constructor(maxSize = 1000, ttlMs = 3600000) {
    // 1 hour default TTL
    this.maxSize = maxSize;
    this.ttl = ttlMs;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get value from cache
   * @param {string} key Cache key
   * @returns {any|null} Cached value or null if not found/expired
   */
  get(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // Check if expired
    if (fastNow() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Move to end (most recently used) by deleting and re-inserting
    this.cache.delete(key);
    this.cache.set(key, entry);
    this.hits++;

    return entry.value;
  }

  /**
   * Set value in cache
   * @param {string} key Cache key
   * @param {any} value Value to cache
   */
  set(key, value) {
    // Remove existing entry if present
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Evict oldest entry if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    // Add new entry
    this.cache.set(key, {
      value,
      timestamp: fastNow(),
    });
  }

  /**
   * Check if key exists in cache
   * @param {string} key Cache key
   * @returns {boolean} True if key exists and not expired
   */
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (fastNow() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
    };
  }

  /**
   * Get current cache size
   * @returns {number} Number of entries in cache
   */
  get size() {
    return this.cache.size;
  }
}
