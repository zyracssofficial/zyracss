/**
 * CSS Generation Engine for ZyraCSS
 * Main coordination module for CSS generation
 */

import { zyraGenerateCSSRule } from "./cssGenerator.js";
import { groupIdenticalRules } from "./groupSelectors.js";
import { formatCSS } from "./cssFormatter.js";

/**
 * Generate CSS from parsed utility classes
 * @param {Array} parsedClasses - Array of parsed class objects
 * @param {Object} options - Generation options
 * @returns {Object} Generated CSS and metadata
 */
export function zyraGenerateCSS(parsedClasses, options = {}) {
  const {
    minify = false,
    groupSelectors = true,
    includeComments = false,
  } = options;

  // Step 1: Convert classes to CSS rules
  const rules = parsedClasses
    .map((parsedClass) => zyraGenerateCSSRule(parsedClass, options))
    .filter(Boolean);

  // Step 2: Group rules with identical declarations
  const groupedRules = groupSelectors ? groupIdenticalRules(rules) : rules;

  // Step 3: Format final CSS output
  const css = formatCSS(groupedRules, { minify, includeComments });

  return {
    css,
    stats: {
      totalClasses: parsedClasses.length,
      totalRules: rules.length,
      groupedRules: groupedRules.length,
      compressionRatio:
        rules.length > 0 ? groupedRules.length / rules.length : 1,
    },
  };
}
