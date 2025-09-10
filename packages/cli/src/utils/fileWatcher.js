/**
 * File Watcher Utility for ZyraCSS CLI
 * Provides efficient file watching for the watch command
 */

import { watch } from "fs";
import { readFileSync } from "fs";
import { createHash } from "crypto";
import path from "path";
import { existsSync } from "fs";
import { scanFiles } from "./fileScanner.js";

/**
 * Debounce utility to prevent excessive rebuilds
 * @param {Function} func - Function to debounce
 * @param {number} wait - Debounce delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * File Watcher Class
 * Manages watching multiple files/directories for changes
 */
export class FileWatcher {
  constructor(config, buildFunction) {
    this.config = config;
    this.buildFunction = buildFunction;
    this.watchers = new Map();
    this.isWatching = false;
    this.watchedFiles = new Set();
    this.fileHashes = new Map(); // Track file content hashes
    this.isRebuilding = false; // Prevent overlapping rebuilds

    // Debounce rebuild to prevent excessive calls
    this.debouncedRebuild = debounce(this.rebuild.bind(this), 300);
  }

  /**
   * Start watching files
   */
  async start() {
    if (this.isWatching) {
      console.warn("⚠️  Watcher is already running");
      return;
    }

    console.log("👀 Starting file watcher...");

    // Get initial file list and initialize hashes
    await this.updateWatchedFiles();
    await this.initializeFileHashes();

    // Watch directories that contain our files
    this.setupDirectoryWatchers();

    this.isWatching = true;
    console.log("✅ File watcher started");
    console.log("   Press Ctrl+C to stop watching");

    // Handle graceful shutdown
    process.on("SIGINT", () => {
      this.stop();
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      this.stop();
      process.exit(0);
    });
  }

  /**
   * Initialize file hashes for existing files
   */
  async initializeFileHashes() {
    for (const filePath of this.watchedFiles) {
      const hash = this.getFileHash(filePath);
      if (hash) {
        this.fileHashes.set(filePath, hash);
      }
    }
  }

  /**
   * Stop watching files
   */
  stop() {
    if (!this.isWatching) {
      return;
    }

    console.log("\n🛑 Stopping file watcher...");

    // Close all watchers
    for (const [path, watcher] of this.watchers) {
      try {
        watcher.close();
      } catch (error) {
        // Ignore errors when closing watchers
      }
    }

    this.watchers.clear();
    this.watchedFiles.clear();
    this.isWatching = false;

    console.log("✅ File watcher stopped");
  }

  /**
   * Update the list of watched files
   */
  async updateWatchedFiles() {
    try {
      const files = await scanFiles(
        this.config.content,
        this.config.excludePatterns,
        false // Don't show verbose output during watch
      );

      this.watchedFiles = new Set(files);

      if (this.config.verbose) {
        console.log(`📁 Watching ${files.length} files`);
      }
    } catch (error) {
      console.error("❌ Error updating watched files:", error.message);
    }
  }

  /**
   * Setup directory watchers for efficient monitoring
   */
  setupDirectoryWatchers() {
    const watchedDirectories = new Set();

    // Extract unique directories from patterns
    for (const pattern of this.config.content) {
      const baseDir = this.extractBaseDirectory(pattern);
      if (baseDir && existsSync(baseDir)) {
        watchedDirectories.add(baseDir);
      }
    }

    // Watch each directory
    for (const directory of watchedDirectories) {
      this.watchDirectory(directory);
    }
  }

  /**
   * Watch a specific directory
   * @param {string} directory - Directory path to watch
   */
  watchDirectory(directory) {
    if (this.watchers.has(directory)) {
      return; // Already watching
    }

    try {
      const watcher = watch(
        directory,
        { recursive: true },
        (eventType, filename) => {
          if (filename) {
            this.handleFileChange(eventType, path.join(directory, filename));
          }
        }
      );

      this.watchers.set(directory, watcher);

      if (this.config.verbose) {
        console.log(
          `👀 Watching directory: ${path.relative(process.cwd(), directory)}`
        );
      }
    } catch (error) {
      console.warn(
        `⚠️  Could not watch directory ${directory}: ${error.message}`
      );
    }
  }

  /**
   * Handle file change events
   * @param {string} eventType - Type of change (rename, change)
   * @param {string} filePath - Path of the changed file
   */
  handleFileChange(eventType, filePath) {
    // Skip if we're currently rebuilding
    if (this.isRebuilding) {
      return;
    }

    // Check if this file is relevant to our patterns
    if (!this.isRelevantFile(filePath)) {
      return;
    }

    // Check if file exists (it might have been deleted)
    const fileExists = existsSync(filePath);
    const relativePath = path.relative(process.cwd(), filePath);

    if (eventType === "rename") {
      if (fileExists) {
        console.log(`📝 File added: ${relativePath}`);
        this.debouncedRebuild();
      } else {
        console.log(`🗑️  File deleted: ${relativePath}`);
        this.fileHashes.delete(filePath);
        this.debouncedRebuild();
      }
      return;
    }

    // For change events, check if content actually changed
    if (eventType === "change" && fileExists) {
      const currentHash = this.getFileHash(filePath);
      const previousHash = this.fileHashes.get(filePath);

      // Only process if content actually changed
      if (currentHash !== previousHash) {
        console.log(`📝 File changed: ${relativePath}`);
        this.fileHashes.set(filePath, currentHash);
        this.debouncedRebuild();
      }
    }
  }

  /**
   * Calculate hash of file content
   * @param {string} filePath - Path to file
   * @returns {string|null} File hash or null if error
   */
  getFileHash(filePath) {
    try {
      const content = readFileSync(filePath, "utf8");
      return createHash("md5").update(content).digest("hex");
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if a file is relevant to our watch patterns
   * @param {string} filePath - File path to check
   * @returns {boolean} True if file is relevant
   */
  isRelevantFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const supportedExtensions = [".html", ".htm", ".js", ".jsx", ".ts", ".tsx"];

    if (!supportedExtensions.includes(ext)) {
      return false;
    }

    // Check against exclude patterns
    for (const excludePattern of this.config.excludePatterns) {
      if (
        filePath.includes(
          excludePattern.replace(/\*\*/g, "").replace(/\*/g, "")
        )
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Extract base directory from a glob pattern
   * @param {string} pattern - Glob pattern
   * @returns {string|null} Base directory or null
   */
  extractBaseDirectory(pattern) {
    // Handle specific file patterns (not glob patterns)
    if (!pattern.includes("*") && !pattern.includes("{")) {
      // This is a specific file, watch its directory
      const absolutePath = path.resolve(process.cwd(), pattern);
      return path.dirname(absolutePath);
    }

    // Handle glob patterns - remove glob parts to get base directory
    const basePath = pattern
      .replace(/\/\*\*\/.*$/, "") // Remove /**/* parts
      .replace(/\/\*.*$/, "") // Remove /* parts
      .replace(/\{.*\}$/, ""); // Remove {ext,ext} parts

    // Handle relative paths
    if (basePath.startsWith("./")) {
      return path.resolve(process.cwd(), basePath);
    } else if (basePath.startsWith("/")) {
      return basePath;
    } else {
      return path.resolve(process.cwd(), basePath);
    }
  }

  /**
   * Rebuild CSS
   */
  async rebuild() {
    // Prevent overlapping rebuilds
    if (this.isRebuilding) {
      return;
    }

    this.isRebuilding = true;
    console.log("\n🔄 Rebuilding CSS...");
    const startTime = Date.now();

    try {
      // Run build function (cache will be used for unchanged content)
      await this.buildFunction();

      const duration = Date.now() - startTime;
      console.log(`✅ Rebuild completed in ${duration}ms`);
      console.log("👀 Watching for changes...");
    } catch (error) {
      console.error("❌ Rebuild failed:", error.message);
      console.log("👀 Watching for changes...");
    } finally {
      this.isRebuilding = false;
    }
  }
}

/**
 * Create and start a file watcher
 * @param {Object} config - Configuration object
 * @param {Function} buildFunction - Function to call when rebuilding
 * @returns {FileWatcher} Watcher instance
 */
export function createWatcher(config, buildFunction) {
  return new FileWatcher(config, buildFunction);
}
