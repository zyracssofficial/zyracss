/**
 * Pseudo-Element Modifiers
 * Validates pseudo-elements like ::before, ::after, etc.
 */

/**
 * Validate pseudo-element modifiers (before, after, first-line, etc.)
 */
export function validatePseudoElement(modifier) {
  const validPseudoElements = [
    "before",
    "after",
    "first-line",
    "first-letter",
    "marker",
    "placeholder",
    "selection",
    "backdrop",
    "file-selector-button",
  ];

  return validPseudoElements.includes(modifier.toLowerCase());
}

/**
 * Get all supported pseudo-elements
 */
export function getSupportedPseudoElements() {
  return [
    "before",
    "after",
    "first-line",
    "first-letter",
    "marker",
    "placeholder",
    "selection",
    "backdrop",
    "file-selector-button",
  ];
}
