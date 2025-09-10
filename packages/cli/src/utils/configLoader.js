/**
 * ZyraCSS Configuration Loader
 * Handles loading and merging zyracss.config.js with CLI options
 */

import { existsSync } from "fs";
import path from "path";

/**
 * Default ZyraCSS CLI configuration
 */
export const DEFAULT_CONFIG = {
  // Content scanning patterns
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./pages/**/*.{js,jsx,ts,tsx,html}",
    "./components/**/*.{js,jsx,ts,tsx,html}",
    "./*.{html,js,jsx,ts,tsx}",
  ],

  // Output configuration
  output: "file",
  outputPath: "dist/styles.css",

  // Processing options
  minify: false,
  watch: false,
  groupSelectors: true,

  // CLI-specific options
  verbose: false,
  excludePatterns: [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.git/**",
    "**/.next/**",
    "**/coverage/**",
  ],
};

/**
 * Load configuration from zyracss.config.js if it exists
 * @param {string} cwd - Current working directory
 * @returns {Object} Merged configuration object
 */
export async function loadConfig(cwd = process.cwd()) {
  const configPath = path.resolve(cwd, "zyracss.config.js");
  let userConfig = {};

  if (existsSync(configPath)) {
    try {
      // Use dynamic import for ES module support
      const configModule = await import(`file://${configPath}`);
      userConfig = configModule.default || configModule;

      // Validate config structure
      if (typeof userConfig !== "object" || userConfig === null) {
        console.warn(
          "⚠️  Warning: zyracss.config.js must export an object. Using defaults."
        );
        userConfig = {};
      }
    } catch (error) {
      console.warn(
        `⚠️  Warning: Failed to load zyracss.config.js: ${error.message}`
      );
      console.warn("Using default configuration.");
      userConfig = {};
    }
  }

  // Merge user config with defaults
  const mergedConfig = {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };

  // Ensure content is always an array
  if (typeof mergedConfig.content === "string") {
    mergedConfig.content = [mergedConfig.content];
  }

  // Ensure excludePatterns is always an array
  if (userConfig.excludePatterns) {
    if (typeof userConfig.excludePatterns === "string") {
      mergedConfig.excludePatterns = [userConfig.excludePatterns];
    } else if (Array.isArray(userConfig.excludePatterns)) {
      mergedConfig.excludePatterns = userConfig.excludePatterns;
    }
  }

  return {
    config: mergedConfig,
    configPath: existsSync(configPath) ? configPath : null,
    hasConfig: existsSync(configPath),
  };
}

/**
 * Merge CLI options with configuration
 * CLI options take precedence over config file
 * @param {Object} config - Base configuration
 * @param {Object} cliOptions - CLI options from Commander
 * @returns {Object} Final merged configuration
 */
export function mergeWithCliOptions(config, cliOptions = {}) {
  const merged = { ...config };

  // Override with CLI options if provided
  if (cliOptions.output !== undefined) {
    merged.outputPath = cliOptions.output;
  }

  if (cliOptions.minify !== undefined) {
    merged.minify = cliOptions.minify;
  }

  // Auto-adjust output path for minified files if no explicit output provided
  if (merged.minify && !cliOptions.output) {
    // Convert styles.css -> styles.min.css
    const originalPath = merged.outputPath;
    const pathParts = originalPath.split(".");
    if (pathParts.length > 1 && pathParts[pathParts.length - 1] === "css") {
      // Insert 'min' before the .css extension
      pathParts.splice(-1, 0, "min");
      merged.outputPath = pathParts.join(".");
    } else {
      // If no .css extension, just append .min
      merged.outputPath = originalPath + ".min";
    }
  }

  if (cliOptions.watch !== undefined) {
    merged.watch = cliOptions.watch;
  }

  if (cliOptions.verbose !== undefined) {
    merged.verbose = cliOptions.verbose;
  }

  // Handle content patterns from CLI
  if (cliOptions.input) {
    // CLI input patterns override config content patterns
    let inputPatterns;

    if (Array.isArray(cliOptions.input)) {
      // Commander passed multiple arguments (space-separated)
      inputPatterns = cliOptions.input;
    } else if (typeof cliOptions.input === "string") {
      // Single string - check for comma separation first, then space separation
      if (cliOptions.input.includes(",")) {
        inputPatterns = cliOptions.input.split(",").map((p) => p.trim());
      } else if (cliOptions.input.includes(" ")) {
        // Handle quoted strings with spaces that might contain patterns
        inputPatterns = cliOptions.input.split(/\s+/).filter((p) => p.trim());
      } else {
        inputPatterns = [cliOptions.input];
      }
    } else {
      inputPatterns = [String(cliOptions.input)];
    }

    // Filter out empty patterns
    inputPatterns = inputPatterns.filter((p) => p && p.trim());
    merged.content = inputPatterns;
  }

  return merged;
}

/**
 * Validate configuration options
 * @param {Object} config - Configuration to validate
 * @returns {Object} Validation result
 */
export function validateConfig(config) {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (
    !config.content ||
    !Array.isArray(config.content) ||
    config.content.length === 0
  ) {
    errors.push(
      "Configuration must include 'content' array with file patterns"
    );
  }

  if (!config.outputPath || typeof config.outputPath !== "string") {
    errors.push("Configuration must include valid 'outputPath' string");
  }

  // Check output format
  if (config.output && !["file", "inline"].includes(config.output)) {
    warnings.push(
      "'output' should be 'file' or 'inline', defaulting to 'file'"
    );
    config.output = "file";
  }

  // Validate content patterns
  config.content.forEach((pattern, index) => {
    if (typeof pattern !== "string") {
      warnings.push(`Content pattern at index ${index} should be a string`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config,
  };
}
