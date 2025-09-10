/**
 * CSS output formatting logic
 * Handles minification and pretty-printing of final CSS with responsive support
 */

/**
 * Format final CSS output with responsive media query support
 * @param {Array} rules - Array of CSS rules
 * @param {Object} options - Formatting options
 * @returns {string} Final CSS string
 */
export function formatCSS(rules, options = {}) {
  const { minify = false } = options;

  let css = "";

  // Separate rules by media queries
  const normalRules = [];
  const responsiveRules = new Map(); // breakpoint -> rules

  for (const rule of rules) {
    // Check if any selector has responsive metadata
    const hasResponsive = rule.metadata?.responsive;

    if (hasResponsive) {
      const breakpoint = rule.metadata.responsive;
      if (!responsiveRules.has(breakpoint)) {
        responsiveRules.set(breakpoint, []);
      }
      responsiveRules.get(breakpoint).push(rule);
    } else {
      normalRules.push(rule);
    }
  }

  // Format normal rules first
  for (const rule of normalRules) {
    css += formatSingleRule(rule, minify);
  }

  // Format responsive rules grouped by media query
  for (const [breakpoint, rulesInBreakpoint] of responsiveRules) {
    const breakpointValue = getBreakpointValue(breakpoint);
    const mediaQuery = getMediaQueryString(breakpoint, breakpointValue);

    if (minify) {
      css += `@media ${mediaQuery}{`;
      for (const rule of rulesInBreakpoint) {
        css += formatSingleRule(rule, minify, true);
      }
      css += "}";
    } else {
      css += `@media ${mediaQuery} {\n`;
      for (let i = 0; i < rulesInBreakpoint.length; i++) {
        const rule = rulesInBreakpoint[i];
        const ruleCSS = formatSingleRule(rule, minify, true);
        const indentedCSS = ruleCSS.replace(/^/gm, "  "); // Indent each line
        css += indentedCSS;

        // Add spacing between rules within media query, but not after the last one
        if (i < rulesInBreakpoint.length - 1) {
          css += "\n";
        }
      }
      css += "\n}\n\n"; // Proper closing with spacing
    }
  }

  return css.trim();
}

/**
 * Format a single CSS rule
 * @param {Object} rule - CSS rule object
 * @param {boolean} minify - Whether to minify output
 * @param {boolean} isInsideMediaQuery - Whether this rule is inside a media query
 * @returns {string} Formatted CSS rule
 */
function formatSingleRule(rule, minify = false, isInsideMediaQuery = false) {
  const selectors = rule.selectors.join(minify ? "," : ",\n");
  const declarations = Object.entries(rule.declarations)
    .map(([prop, val]) => `${minify ? "" : "  "}${prop}: ${val};`)
    .join(minify ? "" : "\n");

  if (minify) {
    return `${selectors}{${declarations}}`;
  } else {
    if (isInsideMediaQuery) {
      // Don't add extra newlines when inside media query - parent handles spacing
      return `${selectors} {\n${declarations}\n}`;
    } else {
      return `${selectors} {\n${declarations}\n}\n\n`;
    }
  }
}

/**
 * Get breakpoint value for responsive design
 */
function getBreakpointValue(breakpoint) {
  const breakpoints = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  };

  // Special media queries (not min-width based)
  const specialMediaQueries = {
    print: "print",
    screen: "screen",
    dark: "(prefers-color-scheme: dark)",
    light: "(prefers-color-scheme: light)",
  };

  if (specialMediaQueries[breakpoint]) {
    return specialMediaQueries[breakpoint];
  }

  return breakpoints[breakpoint] || "768px";
}

/**
 * Generate the correct media query string for a breakpoint
 */
function getMediaQueryString(breakpoint, breakpointValue) {
  // Special media queries that don't use min-width
  const specialQueries = ["print", "screen"];
  const preferenceQueries = breakpointValue.startsWith("(prefers-");

  if (specialQueries.includes(breakpoint)) {
    return breakpointValue;
  }

  if (preferenceQueries) {
    return breakpointValue;
  }

  // Default to min-width for responsive breakpoints
  return `(min-width: ${breakpointValue})`;
}
