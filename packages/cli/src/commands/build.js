/**
 * Build Command for ZyraCSS CLI
 * Modular implementation supporting config files and watch mode
 */

import fs from "fs/promises";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

import { zyra } from "zyracss";
// Direct internal imports for CLI efficiency
import { zyraGetVersion, cleanupGlobalCache, now } from "zyracss/internal";

import {
  loadConfig,
  mergeWithCliOptions,
  validateConfig,
} from "../utils/configLoader.js";
import {
  scanFiles,
  readFiles,
  validateInputSize,
  getFileStats,
} from "../utils/fileScanner.js";
import { createWatcher } from "../utils/fileWatcher.js";

/**
 * Build Command Handler
 * Processes files according to config and generates CSS
 *
 * @param {Object} cliOptions - Commander options from CLI
 * @param {string} cliOptions.input - Input patterns (optional, uses config if not provided)
 * @param {string} cliOptions.output - Output file path (optional, uses config if not provided)
 * @param {boolean} cliOptions.minify - Whether to minify output
 * @param {boolean} cliOptions.watch - Whether to enable watch mode
 * @param {boolean} cliOptions.verbose - Whether to show verbose output
 * @returns {Promise<Object>} Build result
 */
export default async function buildCommand(cliOptions = {}) {
  const startTime = now();

  try {
    // Only clear cache if explicitly requested with --force flag
    if (cliOptions.force) {
      cleanupGlobalCache();
      if (cliOptions.verbose) {
        console.log("� Force rebuild mode - cache cleared");
      }
    }

    if (cliOptions.verbose) {
      console.log("� Starting ZyraCSS build command...");
    }

    // Step 1: Load and validate configuration
    const { config: baseConfig, hasConfig, configPath } = await loadConfig();
    const finalConfig = mergeWithCliOptions(baseConfig, cliOptions);

    const validation = validateConfig(finalConfig);
    if (!validation.isValid) {
      console.error("❌ Configuration errors:");
      validation.errors.forEach((error) => console.error(`   ${error}`));
      return { success: false, error: "invalid-config" };
    }

    // Show warnings
    validation.warnings.forEach((warning) => {
      console.warn(`⚠️  ${warning}`);
    });

    if (finalConfig.verbose) {
      console.log("🔧 Configuration loaded:");
      if (hasConfig) {
        console.log(
          `   Config file: ${path.relative(process.cwd(), configPath)}`
        );
      }
      console.log(`   Content patterns: ${finalConfig.content.length}`);
      console.log(`   Output: ${finalConfig.outputPath}`);
      console.log(`   Minify: ${finalConfig.minify}`);
    }

    // Step 2: Handle watch mode
    if (finalConfig.watch) {
      return await startWatchMode(finalConfig);
    }

    // Step 3: Build once and return
    const result = await runBuild(finalConfig, startTime);

    if (finalConfig.verbose) {
      console.log("🔧 Build command completed");
    }

    return result;
  } catch (error) {
    console.error("❌ Build failed:", error.message);

    if (cliOptions.verbose) {
      console.error("📋 Stack trace:", error.stack);
    }

    cleanupGlobalCache();
    return { success: false, error: error.message };
  }
}

/**
 * Run a single build process
 * @param {Object} config - Final merged configuration
 * @param {number} startTime - Build start time
 * @returns {Promise<Object>} Build result
 */
async function runBuild(config, startTime = now()) {
  try {
    // Step 1: Scan for files
    const filePaths = await scanFiles(
      config.content,
      config.excludePatterns,
      config.verbose
    );

    if (filePaths.length === 0) {
      console.warn("⚠️  No files found matching the specified patterns.");
      console.warn(
        "💡 Check your content patterns in zyracss.config.js or CLI arguments."
      );
      return { success: false, error: "no-files-found" };
    }

    // Step 2: Read file contents
    const readResult = await readFiles(filePaths, config.verbose);

    if (readResult.processedFiles === 0) {
      console.warn("⚠️  No files could be read successfully.");
      return { success: false, error: "no-readable-files" };
    }

    // Step 3: Validate input size for CLI safety
    const sizeValidation = validateInputSize(readResult);
    if (!sizeValidation.isValid) {
      sizeValidation.errors.forEach((error) => {
        console.error(`❌ ${error.message}`);
        if (error.suggestion) {
          console.error(`💡 ${error.suggestion}`);
        }
      });
      return { success: false, error: "input-too-large" };
    }

    // Show warnings about large content
    sizeValidation.warnings.forEach((warning) => {
      console.warn(`⚠️  ${warning.message}`);
      if (warning.suggestion) {
        console.warn(`💡 ${warning.suggestion}`);
      }
    });

    // Step 4: Generate CSS with timeout protection
    if (config.verbose) {
      console.log("⚙️  Generating CSS...");
    }

    const CSS_GENERATION_TIMEOUT = 60000; // 60 seconds

    let result;
    try {
      const htmlInput = readResult.htmlContent.join("\n");

      // Since zyra.generate is now synchronous, we don't need Promise.race
      // But we can still implement timeout using a simple timer if needed
      result = zyra.generate(
        { html: htmlInput },
        {
          minify: config.minify,
          groupSelectors: config.groupSelectors,
          includeComments: !config.minify,
        }
      );
    } catch (error) {
      if (error.message.includes("timed out")) {
        console.error(
          "❌ CSS generation timed out. Input may be too large or complex."
        );
        console.error(
          "💡 Try reducing input size or using the API directly for large datasets."
        );
        return { success: false, error: "generation-timeout" };
      }
      throw error;
    }

    // Step 5: Handle generation results
    if (!result.success) {
      console.error(
        "❌ CSS generation failed:",
        result.error?.message || "Unknown error"
      );
      return { success: false, error: result.error };
    }

    const generatedData = result.data;

    // Report invalid classes
    if (generatedData.invalid && generatedData.invalid.length > 0) {
      if (config.verbose) {
        // Verbose mode: show detailed information
        console.warn(
          `⚠️  ${generatedData.invalid.length} invalid class(es) found:`
        );
        generatedData.invalid.slice(0, 10).forEach((invalid) => {
          const className = invalid.className || invalid.original || invalid;
          const errorMsg =
            invalid.error?.message || invalid.reason || "Invalid syntax";
          console.warn(`   ${className} - ${errorMsg}`);
        });

        if (generatedData.invalid.length > 10) {
          console.warn(`   ... and ${generatedData.invalid.length - 10} more`);
        }
      } else {
        // Concise mode: just show the count with hint for details
        console.warn(
          `⚠️  ${generatedData.invalid.length} invalid class(es) found (Use --verbose for details)`
        );
      }
    }

    // Check if CSS was generated
    if (!generatedData.css || generatedData.css.trim().length === 0) {
      console.warn(
        "⚠️  No valid utility classes found. Generated CSS is empty."
      );
      console.warn(
        "💡 Check your HTML/JSX files for ZyraCSS classes like 'padding-[20px]'"
      );
    }

    // Step 6: Write output file
    const outputPath = path.resolve(process.cwd(), config.outputPath);

    // Ensure output directory exists
    mkdirSync(dirname(outputPath), { recursive: true });

    // Prepare final CSS with header
    let finalCSS = generatedData.css || "";
    if (!config.minify && finalCSS) {
      finalCSS =
        generateCSSHeader(config, readResult, generatedData) + finalCSS;
    }

    await fs.writeFile(outputPath, finalCSS, "utf-8");

    // Step 7: Success reporting
    const buildTime = now() - startTime;
    const relativePath = path.relative(process.cwd(), outputPath);
    const stats = generatedData.stats || {};

    console.log("✅ CSS generated successfully!");
    console.log(`📄 Output: ${relativePath}`);
    console.log(
      `📊 Stats: ${stats.validClasses || 0} classes → ${stats.generatedRules || 0} rules`
    );
    console.log(`⚡ Build time: ${Math.round(buildTime)}ms`);

    // File size information
    const fileStats = await fs.stat(outputPath);
    const sizeKB = (fileStats.size / 1024).toFixed(1);
    console.log(`📏 File size: ${sizeKB} KB`);

    if (config.verbose) {
      // Show detailed stats
      const fileStatsData = getFileStats(filePaths);
      console.log("\n📋 Detailed Statistics:");
      console.log(`   Files processed: ${readResult.processedFiles}`);
      console.log(
        `   Content size: ${Math.round(readResult.totalSize / 1024)}KB`
      );
      console.log("   Files by type:");
      Object.entries(fileStatsData.byExtension).forEach(([ext, count]) => {
        console.log(`     ${ext}: ${count} files`);
      });

      if (stats.compressionRatio && stats.compressionRatio < 1) {
        console.log(
          `   Compression: ${(stats.compressionRatio * 100).toFixed(1)}%`
        );
      }

      // Show cache information
      console.log(`   Cache used: ${stats.fromCache ? "Yes" : "No"}`);
      if (stats.cacheTimestamp) {
        const cacheAge = Date.now() - new Date(stats.cacheTimestamp).getTime();
        console.log(`   Cache age: ${Math.round(cacheAge / 1000)}s`);
      }
    }

    cleanupGlobalCache();

    return {
      success: true,
      outputPath,
      stats: {
        ...stats,
        buildTime,
        filesProcessed: readResult.processedFiles,
        totalFiles: filePaths.length,
      },
    };
  } catch (error) {
    console.error("❌ Build process failed:", error.message);
    cleanupGlobalCache();
    throw error;
  }
}

/**
 * Start watch mode
 * @param {Object} config - Configuration object
 * @returns {Promise<Object>} Watch result
 */
async function startWatchMode(config) {
  console.log("👀 Starting ZyraCSS in watch mode...");

  // Initial build
  console.log("🔨 Running initial build...");
  const initialResult = await runBuild(config);

  if (!initialResult.success) {
    console.error("❌ Initial build failed. Cannot start watch mode.");
    return initialResult;
  }

  console.log("✅ Initial build completed");

  // Create build function for watcher
  const buildFunction = async () => {
    await runBuild(config);
  };

  // Start file watcher
  const watcher = createWatcher(config, buildFunction);
  await watcher.start();

  // Return a promise that never resolves (watch mode runs indefinitely)
  return new Promise(() => {
    // This keeps the process alive
  });
}

/**
 * Generate CSS file header with build information
 * @param {Object} config - Configuration object
 * @param {Object} readResult - File read results
 * @param {Object} generatedData - Generated CSS data
 * @returns {string} CSS header comment
 */
function generateCSSHeader(config, readResult, generatedData) {
  const timestamp = new Date().toISOString();
  const version = zyraGetVersion();
  const stats = generatedData.stats || {};

  return `/* Generated by ZyraCSS */\n`;
}
