/**
 * File Scanner Utility for ZyraCSS CLI
 * Efficiently scans and processes HTML, JSX, TSX files
 */

import { glob } from "glob";
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { ZyraError, ERROR_CODES, MAX_FILES_LIMIT } from "zyracss";

/**
 * Supported file extensions for ZyraCSS class extraction
 */
const SUPPORTED_EXTENSIONS = [".html", ".htm", ".js", ".jsx", ".ts", ".tsx"];

/**
 * Scan files based on glob patterns
 * @param {Array<string>} patterns - Array of glob patterns
 * @param {Array<string>} excludePatterns - Array of patterns to exclude
 * @param {boolean} verbose - Whether to show verbose output
 * @returns {Promise<Array<string>>} Array of file paths
 */
export async function scanFiles(
  patterns,
  excludePatterns = [],
  verbose = false
) {
  if (verbose) {
    console.log("🔍 Scanning for files...");
  }

  const allFiles = new Set();
  const missingFiles = [];

  for (const pattern of patterns) {
    try {
      // Check if pattern looks like a direct file path (no wildcards)
      const isDirectFile =
        !pattern.includes("*") &&
        !pattern.includes("?") &&
        !pattern.includes("[");

      if (isDirectFile) {
        // For direct file paths, check if file exists
        const absolutePath = path.resolve(pattern);
        if (existsSync(absolutePath)) {
          const ext = path.extname(absolutePath).toLowerCase();
          if (SUPPORTED_EXTENSIONS.includes(ext)) {
            allFiles.add(absolutePath);
            if (verbose) {
              console.log(`   Direct file "${pattern}": found`);
            }
          } else {
            console.warn(
              `⚠️  Warning: File "${pattern}" has unsupported extension (${ext})`
            );
          }
        } else {
          missingFiles.push(pattern);
        }
      } else {
        // For glob patterns, use normal glob scanning
        const files = await glob(pattern, {
          ignore: excludePatterns,
          absolute: true,
          nodir: true, // Only return files, not directories
        });

        // Filter for supported extensions
        const supportedFiles = files.filter((file) => {
          const ext = path.extname(file).toLowerCase();
          return SUPPORTED_EXTENSIONS.includes(ext);
        });

        supportedFiles.forEach((file) => allFiles.add(file));

        if (verbose && files.length > 0) {
          console.log(
            `   Pattern "${pattern}": ${supportedFiles.length} files`
          );
        }
      }
    } catch (error) {
      console.warn(
        `⚠️  Warning: Error scanning pattern "${pattern}": ${error.message}`
      );
    }
  }

  // Report missing files as errors
  if (missingFiles.length > 0) {
    console.error("❌ Missing input files:");
    missingFiles.forEach((file) => {
      console.error(`   ${file}`);
    });
    throw new ZyraError(
      ERROR_CODES.FILE_NOT_FOUND,
      `Input files not found: ${missingFiles.join(", ")}`,
      { missingFiles, patterns },
      ["Check file paths are correct", "Ensure files exist and are accessible"]
    );
  }

  const fileArray = Array.from(allFiles);

  if (verbose) {
    console.log(`📁 Found ${fileArray.length} file(s) to process`);
    if (fileArray.length > 0 && fileArray.length <= 20) {
      fileArray.forEach((file) => {
        console.log(`   ${path.relative(process.cwd(), file)}`);
      });
    } else if (fileArray.length > 20) {
      console.log(`   (${fileArray.length} files total - showing first 5)`);
      fileArray.slice(0, 5).forEach((file) => {
        console.log(`   ${path.relative(process.cwd(), file)}`);
      });
      console.log(`   ... and ${fileArray.length - 5} more`);
    }
  }

  return fileArray;
}

/**
 * Read file with automatic encoding detection and conversion
 * Supports UTF-8, UTF-16 LE, and UTF-16 BE with graceful fallback
 * @param {string} filePath - Path to the file to read
 * @param {boolean} verbose - Whether to log encoding detection
 * @returns {Promise<{content: string, encoding: string}>} File content and detected encoding
 */
async function readFileWithEncodingDetection(filePath, verbose = false) {
  try {
    // Read file as buffer to detect encoding
    const buffer = await fs.readFile(filePath);

    // Check for UTF-16 Little Endian BOM (FF FE)
    if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
      if (verbose) {
        console.log(
          `📄 Detected UTF-16 LE encoding: ${path.relative(process.cwd(), filePath)}`
        );
      }
      const content = buffer.toString("utf16le").replace(/^\uFEFF/, "");
      return { content, encoding: "utf16le" };
    }

    // Check for UTF-16 Big Endian BOM (FE FF)
    if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
      if (verbose) {
        console.log(
          `📄 Detected UTF-16 BE encoding: ${path.relative(process.cwd(), filePath)}`
        );
      }
      const content = buffer.toString("utf16be").replace(/^\uFEFF/, "");
      return { content, encoding: "utf16be" };
    }

    // Check for UTF-8 BOM (EF BB BF)
    if (
      buffer.length >= 3 &&
      buffer[0] === 0xef &&
      buffer[1] === 0xbb &&
      buffer[2] === 0xbf
    ) {
      if (verbose) {
        console.log(
          `📄 Detected UTF-8 with BOM: ${path.relative(process.cwd(), filePath)}`
        );
      }
      const content = buffer.toString("utf8").replace(/^\uFEFF/, "");
      return { content, encoding: "utf8-bom" };
    }

    // Default to UTF-8 (most common for web development)
    const content = buffer.toString("utf8");
    return { content, encoding: "utf8" };
  } catch (error) {
    // Fallback to original UTF-8 reading if buffer reading fails
    const content = await fs.readFile(filePath, "utf-8");
    const cleanContent = content.replace(/^\uFEFF/, "");
    return { content: cleanContent, encoding: "utf8-fallback" };
  }
}

/**
 * Read and extract content from files
 */
export async function readFiles(filePaths, verbose = false) {
  if (verbose && filePaths.length > 0) {
    console.log("📖 Reading file contents...");
  }

  const htmlContent = [];
  const errors = [];
  let processedFiles = 0;

  for (const filePath of filePaths) {
    try {
      // Check if file exists
      if (!existsSync(filePath)) {
        errors.push({
          file: filePath,
          error: "File not found",
        });
        continue;
      }

      // Use enhanced encoding detection
      const { content: cleanContent, encoding } =
        await readFileWithEncodingDetection(filePath, verbose);

      htmlContent.push(cleanContent);
      processedFiles++;

      if (verbose) {
        const encodingNote = encoding !== "utf8" ? ` [${encoding}]` : "";
        console.log(
          `📄 Read file: ${path.relative(process.cwd(), filePath)} (${cleanContent.length} chars)${encodingNote}`
        );
      }
    } catch (error) {
      errors.push({
        file: filePath,
        error: error.message,
      });

      if (verbose) {
        console.warn(
          `⚠️  Warning: Could not read ${path.relative(process.cwd(), filePath)}: ${error.message}`
        );
      }
    }
  }

  if (verbose) {
    console.log(`✅ Successfully read ${processedFiles} file(s)`);
    if (errors.length > 0) {
      console.log(`⚠️  ${errors.length} file(s) had errors`);
    }
  }

  return {
    htmlContent,
    processedFiles,
    errors,
    totalSize: htmlContent.join("").length,
  };
}

/**
 * Validate input size for CLI safety
 * @param {Object} readResult - Result from readFiles
 * @param {Object} limits - Size limits
 * @returns {Object} Validation result
 */
export function validateInputSize(readResult, limits = {}) {
  const maxSize = limits.maxHtmlSize || 10 * 1024 * 1024; // 10MB default
  const maxFiles = limits.maxFiles || MAX_FILES_LIMIT; // Default files limit

  const errors = [];
  const warnings = [];

  if (readResult.totalSize > maxSize) {
    errors.push({
      type: "size_exceeded",
      message: `HTML content too large (${Math.round(readResult.totalSize / 1024 / 1024)}MB). Maximum ${maxSize / 1024 / 1024}MB allowed.`,
      suggestion:
        "Consider breaking large files into smaller chunks or using the API directly.",
    });
  }

  if (readResult.processedFiles > maxFiles) {
    warnings.push({
      type: "many_files",
      message: `Processing ${readResult.processedFiles} files. This may take some time.`,
      suggestion:
        "Consider using more specific glob patterns to reduce file count.",
    });
  }

  // Warn about very large individual files
  if (readResult.totalSize > 1024 * 1024) {
    // 1MB
    warnings.push({
      type: "large_content",
      message: `Processing ${Math.round(readResult.totalSize / 1024)}KB of content.`,
      suggestion: "Large files may slow down processing.",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get file statistics for reporting
 * @param {Array<string>} filePaths - Array of file paths
 * @returns {Object} Statistics object
 */
export function getFileStats(filePaths) {
  const stats = {
    total: filePaths.length,
    byExtension: {},
    byDirectory: {},
  };

  filePaths.forEach((filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const dir = path.dirname(path.relative(process.cwd(), filePath));

    stats.byExtension[ext] = (stats.byExtension[ext] || 0) + 1;
    stats.byDirectory[dir] = (stats.byDirectory[dir] || 0) + 1;
  });

  return stats;
}
