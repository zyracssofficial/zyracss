/**
 * ZyraCSS Vite Plugin with CSS Directive Support
 *
 * Enables @import "zyracss" in CSS files
 *
 * Features:
 * - CSS directive processing (@import "zyracss")
 * - Automatic HTML scanning
 * - Output to file or inline
 * - Configurable via zyracss.config.js
 */

import {
  zyraGenerateCSS,
  zyraExtractClassFromHTML,
} from "../../../src/index.js";
import fs from "fs";
import path from "path";

/**
 * Get smart content patterns based on common project structures
 * Simple directory detection to cover most use cases
 */
function getSmartContentPatterns() {
  const patterns = [];

  // Always scan src directory (most common)
  patterns.push("./src/**/*.{js,jsx,ts,tsx,html}");

  // Check for common additional directories
  if (fs.existsSync("pages")) {
    patterns.push("./pages/**/*.{js,jsx,ts,tsx,html}");
  }
  if (fs.existsSync("components") && !fs.existsSync("src/components")) {
    patterns.push("./components/**/*.{js,jsx,ts,tsx,html}");
  }
  if (fs.existsSync("app") && !fs.existsSync("src/app")) {
    patterns.push("./app/**/*.{js,jsx,ts,tsx,html}");
  }

  // Add root-level files for simple projects
  patterns.push("./*.{html,js,jsx,ts,tsx}");

  return patterns;
}

const defaultConfig = {
  output: "inline", // 'inline' | 'file'
  outputPath: "dist/zyracss.css",
  content: null, // Will be set to smart patterns if not provided
  minify: true,
  watch: true,
  debug: false, // Enable debug logging
};

export function zyracss(userConfig = {}) {
  // Use smart patterns if no content is explicitly provided
  const smartDefaults = {
    ...defaultConfig,
    content: getSmartContentPatterns(),
  };

  const config = { ...smartDefaults, ...userConfig };
  let cachedCSS = "";
  let cachedClasses = new Set();
  let lastScanTime = 0;
  let configLoaded = false;
  let configLoadPromise = null;
  let fileModificationTimes = new Map(); // Track file changes more efficiently

  // Enhanced config loader with better validation
  const loadConfigSync = (configPath) => {
    if (!fs.existsSync(configPath) || configLoaded) {
      configLoaded = true;
      return;
    }

    try {
      // Use require for synchronous loading in Node.js environment
      delete require.cache[require.resolve(configPath)]; // Clear cache for reloading
      const userFileConfig = require(configPath);
      const configData = userFileConfig.default || userFileConfig;

      // Validate and merge config safely
      if (configData && typeof configData === "object") {
        // Validate content patterns
        if (configData.content && Array.isArray(configData.content)) {
          configData.content = configData.content.filter((pattern) => {
            return typeof pattern === "string" && pattern.trim().length > 0;
          });
        } // Merge config safely, preserving existing smart defaults
        Object.assign(config, configData);

        if (config.debug) {
          console.log("🎨 ZyraCSS: Configuration loaded successfully");
        }
      }

      configLoaded = true;
    } catch (error) {
      if (config.debug) {
        console.warn(
          "🎨 ZyraCSS: Failed to load config synchronously, trying async:",
          error.message
        );
      }
      // Fallback to async loading for ES modules
      configLoadPromise = loadConfigAsync(configPath);
    }
  };

  // Async fallback for ES module configs
  const loadConfigAsync = async (configPath) => {
    if (configLoaded) return;

    try {
      const configUrl = `file://${path.resolve(configPath)}?t=${Date.now()}`;
      const userFileConfig = await import(configUrl);
      const configData = userFileConfig.default || userFileConfig;

      Object.assign(config, configData);
      configLoaded = true;
    } catch (error) {
      console.warn("Could not load zyracss.config.js:", error.message);
      configLoaded = true;
    }
  };

  const plugin = {
    name: "zyracss",
    enforce: "pre", // Run before other plugins

    // Plugin metadata for better Vite integration
    meta: {
      framework: "zyracss",
      version: "0.1.0",
    },

    async configResolved(resolvedConfig) {
      // Load ZyraCSS config before Vite configuration finalizes
      const zyraConfigPath = path.resolve(
        resolvedConfig.root || process.cwd(),
        "zyracss.config.js"
      );
      loadConfigSync(zyraConfigPath);

      // If async loading was triggered, wait for it
      if (configLoadPromise) {
        await configLoadPromise;
      }

      // Auto-configure Vite for ZyraCSS
      resolvedConfig.optimizeDeps = resolvedConfig.optimizeDeps || {};
      resolvedConfig.optimizeDeps.exclude =
        resolvedConfig.optimizeDeps.exclude || [];
      if (!resolvedConfig.optimizeDeps.exclude.includes("zyracss")) {
        resolvedConfig.optimizeDeps.exclude.push("zyracss");
      }
    },

    resolveId(id, importer) {
      // Intercept @import "zyracss" to prevent resolving to main JS file
      if (id === "zyracss" && importer && importer.endsWith(".css")) {
        return "\0virtual:zyracss.css"; // Virtual CSS module ID
      }
    },

    load(id) {
      // Return empty CSS for the virtual module that will be processed by transform
      if (id === "\0virtual:zyracss.css") {
        return "/* ZyraCSS placeholder - will be replaced by transform hook */";
      }
    },

    async scanForClasses() {
      const allClasses = new Set();
      const scannedFiles = [];
      let hasFileChanges = false;

      if (config.debug) {
        console.log(`🎨 ZyraCSS: Scanning content patterns:`, config.content);
      }

      try {
        // Improved glob implementation that handles various patterns
        const scanFiles = (globPattern) => {
          const files = [];

          // Convert glob pattern to directory and file regex
          const normalizedPattern = globPattern.replace(/\\/g, "/");
          let baseDir = "./";
          let remainingPattern = normalizedPattern;

          // Handle absolute paths by converting to relative
          if (path.isAbsolute(normalizedPattern)) {
            const cwd = process.cwd().replace(/\\/g, "/");
            if (normalizedPattern.startsWith(cwd)) {
              // Convert absolute path to relative
              remainingPattern =
                "./" + normalizedPattern.substring(cwd.length + 1);
            } else {
              // For absolute paths outside cwd, use the full path as base
              const lastWildcard = normalizedPattern.lastIndexOf("*");
              if (lastWildcard > 0) {
                const beforeWildcard = normalizedPattern.substring(
                  0,
                  lastWildcard
                );
                const lastSlash = beforeWildcard.lastIndexOf("/");
                if (lastSlash > 0) {
                  baseDir = beforeWildcard.substring(0, lastSlash);
                  remainingPattern = normalizedPattern.substring(lastSlash + 1);
                }
              }
            }
          }

          // Extract base directory from pattern
          if (remainingPattern.startsWith("./")) {
            remainingPattern = remainingPattern.substring(2);
          }

          // Find the base directory before the first wildcard
          const firstWildcard = remainingPattern.search(/[*\[\]{}]/);
          if (firstWildcard > 0) {
            const basePath = remainingPattern.substring(0, firstWildcard);
            const lastSlash = basePath.lastIndexOf("/");
            if (lastSlash >= 0) {
              baseDir = path.join(baseDir, basePath.substring(0, lastSlash));
              remainingPattern = remainingPattern.substring(lastSlash + 1);
            }
          }

          // Create regex for file matching - FIXED REGEX LOGIC
          let regexPattern = remainingPattern;

          // Handle ** patterns (recursive directory matching)
          if (regexPattern.startsWith("**/")) {
            regexPattern = regexPattern.substring(3); // Remove **/ prefix
            // For **/ patterns, we'll search recursively and match the file pattern only
          }

          // Convert file pattern to regex
          regexPattern = regexPattern
            .replace(/\*/g, "[^/]*") // * matches any characters except /
            .replace(/\./g, "\\.") // Escape dots
            .replace(/\{([^}]+)\}/g, "($1)") // {js,jsx} -> (js|jsx)
            .replace(/,/g, "|"); // Convert commas to OR

          const fileRegex = new RegExp(regexPattern + "$");

          // Recursive directory walker
          const walkDir = (dir) => {
            if (!fs.existsSync(dir)) return;

            try {
              const items = fs.readdirSync(dir);
              for (const item of items) {
                const fullPath = path.join(dir, item);

                try {
                  const stat = fs.statSync(fullPath);
                  if (stat.isDirectory()) {
                    // Continue walking subdirectories
                    walkDir(fullPath);
                  } else if (stat.isFile()) {
                    // For files, test against the filename pattern only
                    if (fileRegex.test(item)) {
                      files.push(fullPath);
                    }
                  }
                } catch (statError) {
                  // Skip files that can't be stat'd (permissions, etc.)
                  continue;
                }
              }
            } catch (readdirError) {
              // Skip directories that can't be read
              return;
            }
          };

          // Start walking from the base directory
          walkDir(baseDir);
          return files;
        };

        // Process each content pattern
        for (const pattern of config.content) {
          try {
            const files = scanFiles(pattern);

            if (config.debug && files.length > 0) {
              console.log(
                `🎨 ZyraCSS: Pattern "${pattern}" matched ${files.length} files`
              );
            }

            for (const file of files) {
              try {
                if (fs.existsSync(file)) {
                  const stat = fs.statSync(file);
                  const modTime = stat.mtime.getTime();
                  const lastModTime = fileModificationTimes.get(file);

                  // Check if file has changed since last scan
                  if (!lastModTime || modTime > lastModTime) {
                    hasFileChanges = true;
                    fileModificationTimes.set(file, modTime);

                    const content = fs.readFileSync(file, "utf-8");
                    scannedFiles.push(file);

                    // Use enhanced core extractor for all file types
                    // Core now handles JSX, template literals, and standard HTML
                    const classes = zyraExtractClassFromHTML(content);
                    classes.forEach((cls) => allClasses.add(cls));
                  } else {
                    // Use cached classes from unchanged files
                    cachedClasses.forEach((cls) => allClasses.add(cls));
                  }
                }
              } catch (fileError) {
                // Skip files that can't be read
                continue;
              }
            }
          } catch (patternError) {
            console.warn(
              `🎨 ZyraCSS: Error processing pattern "${pattern}":`,
              patternError.message
            );
          }
        }
      } catch (error) {
        console.warn("🎨 ZyraCSS: Error scanning for classes:", error.message);
      }

      // Update cached classes for next scan
      if (hasFileChanges) {
        cachedClasses = new Set(allClasses);
        if (config.debug && scannedFiles.length > 0) {
          console.log(
            `🎨 ZyraCSS: Processed ${scannedFiles.length} changed files`
          );
        }
      }

      return Array.from(allClasses);
    },

    async generateZyraCSS() {
      const startTime = Date.now();
      const now = startTime;

      // Improved caching with more intelligent invalidation
      if (cachedCSS && now - lastScanTime < 100) {
        if (config.debug) {
          console.log(
            "🎨 ZyraCSS: Using cached CSS (generated less than 100ms ago)"
          );
        }
        return cachedCSS;
      }

      // Wait a bit for config to load if needed
      let waitTime = 0;
      while (!configLoaded && waitTime < 500) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        waitTime += 10;
      }

      const classes = await this.scanForClasses();

      if (config.debug) {
        console.log(`🎨 ZyraCSS: Found ${classes.length} classes to process`);
      }

      if (classes.length === 0) {
        const message =
          "/* No ZyraCSS classes found. Check your content patterns if this is unexpected. */";
        cachedCSS = message;
        lastScanTime = now;
        if (config.debug) {
          console.warn("🎨 ZyraCSS: No classes found in scanned files");
          console.warn("🎨 ZyraCSS: Checked patterns:", config.content);
        }
        return cachedCSS;
      }

      try {
        const result = await zyraGenerateCSS(classes, {
          minify: config.minify,
          groupSelectors: true,
        });

        if (result.success) {
          cachedCSS = result.data.css;
          lastScanTime = now;

          if (config.debug) {
            const processingTime = Date.now() - startTime;
            console.log(
              `🎨 ZyraCSS: Generated ${result.data.css.length} characters of CSS in ${processingTime}ms (${classes.length} classes)`
            );

            if (result.data.stats) {
              const { validClasses, invalidClasses } = result.data.stats;
              if (invalidClasses > 0) {
                console.warn(
                  `🎨 ZyraCSS: ${invalidClasses} invalid classes found`
                );
              }
            }
          }

          return cachedCSS;
        } else {
          const errorMessage = result.error || "Unknown generation error";
          console.error("🚨 ZyraCSS generation failed:", errorMessage);

          // Provide more helpful error context
          cachedCSS = `/* 
ZyraCSS generation failed: ${errorMessage}

Scanned ${classes.length} classes from ${config.content.length} content patterns.
Check your zyracss.config.js and ensure your content patterns are correct.
*/`;
          lastScanTime = now;
          return cachedCSS;
        }
      } catch (error) {
        console.error("🚨 ZyraCSS generation error:", error.message);

        // Enhanced error information for debugging
        cachedCSS = `/* 
ZyraCSS generation error: ${error.message}

Classes found: ${classes.length}
Content patterns: ${JSON.stringify(config.content, null, 2)}
Debug mode: ${config.debug ? "enabled" : "disabled"}

This error occurred during build-time CSS generation.
*/`;
        lastScanTime = now;
        return cachedCSS;
      }
    },

    async transform(code, id) {
      // Handle virtual zyracss CSS module
      if (id === "\0virtual:zyracss.css") {
        const generatedCSS = await plugin.generateZyraCSS();
        return generatedCSS;
      }

      // Process CSS files with @import "zyracss"
      if (id.endsWith(".css") && code.includes('@import "zyracss"')) {
        const generatedCSS = await plugin.generateZyraCSS();

        if (config.output === "file") {
          // Write to file
          const outputDir = path.dirname(config.outputPath);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          fs.writeFileSync(config.outputPath, generatedCSS);

          // Replace @import with file import
          const relativePath = path.relative(
            path.dirname(id),
            config.outputPath
          );
          return code.replace(
            '@import "zyracss";',
            `@import "${relativePath}";`
          );
        } else {
          // Inline CSS (default)
          return code.replace('@import "zyracss";', generatedCSS);
        }
      }

      return null;
    },

    configureServer(server) {
      console.log(
        "🎨 ZyraCSS Vite Plugin loaded - CSS directive support enabled"
      );

      if (config.watch) {
        // Enhanced file watching with better performance
        let watchTimeout;
        let configWatcher;
        const watchers = new Set();

        const watchFiles = (changedFile) => {
          clearTimeout(watchTimeout);
          watchTimeout = setTimeout(() => {
            // Clear caches more intelligently
            cachedCSS = "";
            lastScanTime = 0;

            // Clear file modification cache for changed file only
            if (changedFile) {
              fileModificationTimes.delete(changedFile);
            } else {
              fileModificationTimes.clear();
            }

            if (config.debug) {
              console.log(
                `🎨 ZyraCSS: File changes detected${changedFile ? ` in ${changedFile}` : ""}, clearing cache`
              );
            }

            // Send more targeted update to browser
            server.ws.send({
              type: "update",
              updates: [
                {
                  type: "css-update",
                  path: "zyracss",
                  acceptedPath: "zyracss",
                  timestamp: Date.now(),
                },
              ],
            });
          }, 100);
        };

        // Watch directories based on content patterns
        const watchedDirs = new Set();
        for (const pattern of config.content) {
          try {
            // Extract directory to watch from pattern
            const baseDir = pattern.split("*")[0].replace(/\/$/, "") || "./";
            if (!watchedDirs.has(baseDir) && fs.existsSync(baseDir)) {
              watchedDirs.add(baseDir);
              const watcher = fs.watch(
                baseDir,
                { recursive: true },
                (eventType, filename) => {
                  if (
                    filename &&
                    (eventType === "change" || eventType === "rename")
                  ) {
                    const fullPath = path.join(baseDir, filename);
                    // Only trigger for relevant file types
                    if (/\.(js|jsx|ts|tsx|html|vue|svelte)$/.test(filename)) {
                      watchFiles(fullPath);
                    }
                  }
                }
              );
              watchers.add(watcher);
            }
          } catch (error) {
            if (config.debug) {
              console.warn(
                `🎨 ZyraCSS: Could not watch pattern ${pattern}:`,
                error.message
              );
            }
          }
        }

        // Watch config file for changes
        const configPath = path.resolve(process.cwd(), "zyracss.config.js");
        if (fs.existsSync(configPath)) {
          configWatcher = fs.watch(configPath, (eventType) => {
            if (eventType === "change") {
              if (config.debug) {
                console.log("🎨 ZyraCSS: Config file changed, reloading...");
              }
              configLoaded = false;
              cachedClasses.clear();
              watchFiles(configPath);
            }
          });
          watchers.add(configWatcher);
        }

        // Clean up watchers on server close
        if (server.httpServer && server.httpServer.on) {
          server.httpServer.on("close", () => {
            watchers.forEach((watcher) => {
              try {
                if (watcher.close) {
                  watcher.close();
                }
              } catch (error) {
                // Ignore cleanup errors
              }
            });
            watchers.clear();
          });
        }
      }
    },
  };

  return plugin;
}

// Named export for: import { zyracss } from '@zyracss/vite'
