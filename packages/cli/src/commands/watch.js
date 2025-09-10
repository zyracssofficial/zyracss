/**
 * Watch Command for ZyraCSS CLI
 * Simplified command that delegates to build command with watch flag
 */

import buildCommand from "./build.js";

/**
 * Watch Command Handler
 * This is essentially build command with watch flag enabled
 * Kept as separate command for better CLI UX
 *
 * @param {Object} cliOptions - Commander options from CLI
 * @returns {Promise<Object>} Watch result
 */
export default async function watchCommand(cliOptions = {}) {
  // Add watch flag and delegate to build command
  const watchOptions = {
    ...cliOptions,
    watch: true,
  };

  return buildCommand(watchOptions);
}
