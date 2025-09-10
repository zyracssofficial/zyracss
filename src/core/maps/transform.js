/**
 * Transform utility mappings for ZyraCSS
 * Full CSS property names only (no short forms)
 */
export const TRANSFORM_MAP = new Map([
  // Transform
  ["transform", "transform"],
  ["t", "transform"], // Transform shorthand
  ["transform-origin", "transform-origin"],
  ["transform-style", "transform-style"],
  ["transform-box", "transform-box"],

  // Perspective
  ["perspective", "perspective"],
  ["perspective-origin", "perspective-origin"],

  // Backface Visibility
  ["backface-visibility", "backface-visibility"],

  // Individual Transform Properties (newer)
  ["translate", "translate"],
  ["rotate", "rotate"],
  ["scale", "scale"],
]);
