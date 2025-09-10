#!/usr/bin/env node

import { Command } from "commander";
import buildCommand from "./commands/build.js";
import watchCommand from "./commands/watch.js";

const program = new Command();

program
  .name("zyracss")
  .description("ZyraCSS - A utility-first CSS generator")
  .version("0.1.0");

program
  .command("build")
  .description("Build CSS from your source files")
  .option(
    "-i, --input <patterns>",
    "Input file patterns (space or comma separated)"
  )
  .option("-o, --output <path>", "Output CSS file path (overrides config)")
  .option("-m, --minify", "Minify the output CSS")
  .option("-v, --verbose", "Show detailed output")
  .option("-f, --force", "Force rebuild by clearing cache")
  .action(async (options) => {
    try {
      const result = await buildCommand(options);
      if (!result.success) {
        console.error(`❌ Build failed: ${result.error}`);
        process.exit(1);
      } else {
        // buildCommand already outputs success messages, so we don't need to duplicate
        process.exit(0);
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error.message);
      process.exit(1);
    }
  });

program
  .command("watch")
  .description("Watch files and rebuild on changes")
  .option(
    "-i, --input <patterns>",
    "Input file patterns (space or comma separated)"
  )
  .option("-o, --output <path>", "Output CSS file path (overrides config)")
  .option("-m, --minify", "Minify the output CSS")
  .option("-v, --verbose", "Show detailed output")
  .option("-f, --force", "Force rebuild by clearing cache")
  .action(async (options) => {
    try {
      // Add watch flag for build command
      options.watch = true;
      const result = await watchCommand(options);

      // Watch mode should run indefinitely, but if it returns an error
      if (!result.success) {
        console.error(`❌ Watch failed: ${result.error}`);
        process.exit(1);
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error.message);
      process.exit(1);
    }
  });

/**
 * Main CLI runner
 */
async function runCLI() {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error("❌ CLI Error:", error.message);
    process.exit(1);
  }
}

// Execute CLI if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCLI();
}

export default runCLI;
