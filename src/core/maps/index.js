/**
 * Central property mapping system for ZyraCSS
 * Maps utility prefixes to CSS properties
 */

import { SPACING_MAP } from "./spacing.js";
import { TYPOGRAPHY_MAP } from "./typography.js";
import { COLOR_MAP } from "./color.js";
import { LAYOUT_MAP } from "./layout.js";
import { SIZING_MAP } from "./sizing.js";
import { BORDERS_MAP } from "./borders.js";
import { EFFECTS_MAP } from "./effects.js";
import { TRANSFORM_MAP } from "./transform.js";
import { OVERFLOW_MAP } from "./overflow.js";
import { INTERACTIVE_MAP } from "./interactive.js";
import { ANIMATION_MAP } from "./animation.js";
import { PRINT_MAP } from "./print.js";

/**
 * Combined property map - O(1) lookups for performance
 * Each entry maps: prefix -> CSS property name
 */
export const PROPERTY_MAP = new Map([
  ...SPACING_MAP,
  ...TYPOGRAPHY_MAP,
  ...COLOR_MAP,
  ...LAYOUT_MAP,
  ...SIZING_MAP,
  ...BORDERS_MAP,
  ...EFFECTS_MAP,
  ...TRANSFORM_MAP,
  ...OVERFLOW_MAP,
  ...INTERACTIVE_MAP,
  ...ANIMATION_MAP,
  ...PRINT_MAP,
]);
