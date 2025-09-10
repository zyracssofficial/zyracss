/**
 * Effects Properties Validation Rules
 * CSS properties related to visual effects and filters
 */

import {
  CSS_GLOBAL_KEYWORDS,
  KEYWORD_NONE,
  KEYWORD_AUTO,
} from "../../constants/cssKeywords.js";

/**
 * Effects properties validation rules
 * 18 properties total
 */
export const EFFECTS_PROPERTIES = {
  "backdrop-filter": {
    type: "filter",
    allowKeywords: ["none"],
    functions: [
      "blur",
      "brightness",
      "contrast",
      "drop-shadow",
      "grayscale",
      "hue-rotate",
      "invert",
      "opacity",
      "saturate",
      "sepia",
      "url", // SVG filter references via u() syntax
      "max", // CSS max() function
      "min", // CSS min() function
      "clamp", // CSS clamp() function
      "calc", // CSS calc() function
    ],
  },
  "box-shadow": {
    type: "shadow",
    allowKeywords: ["none"],
    allowMultiple: true, // Can have multiple shadows separated by commas
    allowColors: true,
    allowInset: true, // Allow 'inset' keyword
    requireOffsets: true, // Special flag for box-shadow to require offset values
  },
  "clip-path": {
    type: "complex",
    allowKeywords: [...KEYWORD_NONE, ...CSS_GLOBAL_KEYWORDS],
    allowFunctions: true, // Allow polygon(), circle(), ellipse(), inset(), etc.
  },
  filter: {
    type: "filter",
    functions: [
      "blur",
      "brightness",
      "contrast",
      "drop-shadow",
      "grayscale",
      "hue-rotate",
      "invert",
      "opacity",
      "saturate",
      "sepia",
      "url", // SVG filter references via u() syntax (converts to url())
      "max", // CSS max() function
      "min", // CSS min() function
      "clamp", // CSS clamp() function
      "calc", // CSS calc() function
    ],
    allowKeywords: ["none"],
  },
  "image-rendering": {
    type: "keyword",
    values: ["auto", "smooth", "high-quality", "crisp-edges", "pixelated"],
  },
  isolation: {
    type: "keyword",
    values: ["auto", "isolate"],
  },
  mask: {
    type: "complex",
    allowKeywords: [...KEYWORD_NONE, ...CSS_GLOBAL_KEYWORDS],
    allowMultiple: true,
  },
  "mask-clip": {
    type: "keyword",
    values: [
      "content-box",
      "padding-box",
      "border-box",
      "margin-box",
      "fill-box",
      "stroke-box",
      "view-box",
      "no-clip",
    ],
  },
  "mask-composite": {
    type: "keyword",
    values: ["add", "subtract", "intersect", "exclude"],
  },
  "mask-image": {
    type: "color-or-complex",
    allowKeywords: [...KEYWORD_NONE, ...CSS_GLOBAL_KEYWORDS],
  },
  "mask-mode": {
    type: "keyword",
    values: ["alpha", "luminance", "match-source"],
  },
  "mask-origin": {
    type: "keyword",
    values: [
      "content-box",
      "padding-box",
      "border-box",
      "margin-box",
      "fill-box",
      "stroke-box",
      "view-box",
    ],
  },
  "mask-position": {
    type: "string",
    allowKeywords: [
      "left",
      "center",
      "right",
      "top",
      "bottom",
      "inherit",
      "initial",
      "unset",
    ],
  },
  "mask-repeat": {
    type: "keyword",
    values: ["repeat", "repeat-x", "repeat-y", "no-repeat", "space", "round"],
  },
  "mask-size": {
    type: "color-or-complex",
    allowKeywords: ["auto", "cover", "contain", "inherit", "initial", "unset"],
  },
  "mix-blend-mode": {
    type: "keyword",
    values: [
      "normal",
      "multiply",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "color-dodge",
      "color-burn",
      "hard-light",
      "soft-light",
      "difference",
      "exclusion",
      "hue",
      "saturation",
      "color",
      "luminosity",
    ],
  },
  opacity: {
    type: "number",
    min: 0,
    max: 1,
    allowPercentage: true,
  },
  shadow: {
    type: "shadow",
    allowKeywords: ["none"],
    allowMultiple: true,
    allowColors: true,
  },
};
