/**
 * CSS rule grouping and deduplication logic
 * Groups selectors with identical declarations for smaller CSS output
 */

/**
 * Group CSS rules with identical declarations while preserving metadata
 * Rules are only grouped if they have the same context (normal, responsive, pseudo-class combinations)
 * @param {Array} rules - Array of CSS rule objects
 * @returns {Array} Array of grouped rules
 */
export function groupIdenticalRules(rules) {
  const grouped = new Map();

  for (const rule of rules) {
    // Create a context key that includes declarations + responsive state + pseudo-class
    // This ensures rules are only grouped within the same context
    const responsive = rule.metadata?.responsive || null;
    const pseudoClass = rule.metadata?.pseudoClass || null;
    const contextKey = `${rule.declarationString}|responsive:${responsive}|pseudo:${pseudoClass}`;

    if (grouped.has(contextKey)) {
      // Add selector to existing group (same context)
      const existing = grouped.get(contextKey);
      existing.selectors.push(rule.selector);
      existing.classNames.push(rule.className);
    } else {
      // Create new group with preserved metadata
      grouped.set(contextKey, {
        selectors: [rule.selector],
        declarations: rule.declarations,
        declarationString: rule.declarationString,
        classNames: [rule.className],
        metadata: rule.metadata ? { ...rule.metadata } : {}, // Preserve exact metadata
      });
    }
  }

  return Array.from(grouped.values());
}
