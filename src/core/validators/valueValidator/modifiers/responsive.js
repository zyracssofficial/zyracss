/**
 * Responsive and Media Query Modifiers
 * Validates responsive breakpoints and media query modifiers
 */

/**
 * Validate responsive modifiers (sm, md, lg, xl, etc.)
 */
export function validateResponsiveModifier(modifier) {
  const validResponsiveModifiers = [
    "sm", // Small screens
    "md", // Medium screens
    "lg", // Large screens
    "xl", // Extra large screens
    "2xl", // 2x Extra large screens
    "mobile",
    "tablet",
    "desktop",
    "print",
    "screen",
  ];

  return validResponsiveModifiers.includes(modifier.toLowerCase());
}

/**
 * Validate media query modifiers (dark, light, motion, etc.)
 */
export function validateMediaQueryModifier(modifier) {
  const validMediaModifiers = [
    "dark",
    "light",
    "motion-safe",
    "motion-reduce",
    "contrast-more",
    "contrast-less",
    "portrait",
    "landscape",
    "print",
    "screen",
  ];

  return validMediaModifiers.includes(modifier.toLowerCase());
}

/**
 * Get all supported responsive modifiers
 */
export function getSupportedResponsiveModifiers() {
  return [
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "mobile",
    "tablet",
    "desktop",
    "print",
    "screen",
  ];
}

/**
 * Get all supported media query modifiers
 */
export function getSupportedMediaQueryModifiers() {
  return [
    "dark",
    "light",
    "motion-safe",
    "motion-reduce",
    "contrast-more",
    "contrast-less",
    "portrait",
    "landscape",
    "print",
    "screen",
  ];
}
