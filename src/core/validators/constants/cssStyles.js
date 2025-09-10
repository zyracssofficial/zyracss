/**
 * Shared CSS Validation Constants
 * Centralized constants to eliminate duplication across validator modules
 */

/**
 * CSS border and outline style keywords
 * Used by border, outline, and related properties
 */
export const CSS_BORDER_STYLES = [
  "none",
  "hidden",
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
];

/**
 * CSS outline styles (includes border styles + outline-specific)
 */
export const CSS_OUTLINE_STYLES = [
  "none",
  "auto", // outline-specific
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
];

/**
 * CSS width keywords for border, outline, etc.
 */
export const CSS_WIDTH_KEYWORDS = ["thin", "medium", "thick"];

/**
 * Complete border style keywords including CSS globals
 * For use in property validation rules
 */
export const BORDER_STYLE_KEYWORDS = [
  ...CSS_BORDER_STYLES,
  "inherit",
  "initial",
  "unset",
  "revert",
];
