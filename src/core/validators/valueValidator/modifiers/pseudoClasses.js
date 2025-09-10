/**
 * Pseudo-Class Modifiers
 * Validates pseudo-class states like :hover, :focus, etc.
 */

/**
 * Validate pseudo-class modifiers (hover, focus, active, etc.)
 */
export function validatePseudoClass(modifier) {
  const validPseudoClasses = [
    "hover",
    "focus",
    "active",
    "visited",
    "link",
    "disabled",
    "enabled",
    "checked",
    "required",
    "optional",
    "valid",
    "invalid",
    "in-range",
    "out-of-range",
    "read-only",
    "read-write",
    "first-child",
    "last-child",
    "nth-child",
    "first-of-type",
    "last-of-type",
    "nth-of-type",
    "only-child",
    "only-of-type",
    "empty",
    "target",
    "default",
    "indeterminate",
  ];

  return validPseudoClasses.includes(modifier.toLowerCase());
}

/**
 * Get all supported pseudo-classes
 */
export function getSupportedPseudoClasses() {
  return [
    "hover",
    "focus",
    "active",
    "visited",
    "link",
    "disabled",
    "enabled",
    "checked",
    "required",
    "optional",
    "valid",
    "invalid",
    "in-range",
    "out-of-range",
    "read-only",
    "read-write",
    "first-child",
    "last-child",
    "nth-child",
    "first-of-type",
    "last-of-type",
    "nth-of-type",
    "only-child",
    "only-of-type",
    "empty",
    "target",
    "default",
    "indeterminate",
  ];
}
