/**
 * Color Properties Validation Rules
 * CSS properties related to colors and backgrounds
 */

import {
  CSS_GLOBAL_KEYWORDS,
  KEYWORD_NONE,
} from "../../constants/cssKeywords.js";

/**
 * Color properties validation rules
 * 13 properties total
 */
export const COLOR_PROPERTIES = {
  background: {
    type: "background-shorthand",
    allowMultiple: true,
    allowColors: true,
    allowKeywords: [
      "none",
      "transparent",
      "currentcolor",
      ...CSS_GLOBAL_KEYWORDS,
    ],
    allowCommaLists: true, // Allow comma-separated values that become space-separated
  },
  "background-attachment": {
    type: "keyword",
    values: ["scroll", "fixed", "local"],
  },
  "background-blend-mode": {
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
  "background-clip": {
    type: "keyword",
    values: ["border-box", "padding-box", "content-box", "text"],
  },
  "background-color": {
    type: "color",
    allowKeywords: ["currentcolor", "transparent"],
  },
  "background-image": {
    type: "color-or-complex",
    allowKeywords: [...KEYWORD_NONE, ...CSS_GLOBAL_KEYWORDS],
  },
  "background-origin": {
    type: "keyword",
    values: ["border-box", "padding-box", "content-box"],
  },
  "background-position": {
    type: "string",
    allowKeywords: [
      "left",
      "center",
      "right",
      "top",
      "bottom",
      ...CSS_GLOBAL_KEYWORDS,
    ],
  },
  "background-repeat": {
    type: "keyword",
    values: ["repeat", "repeat-x", "repeat-y", "no-repeat", "space", "round"],
  },
  "background-size": {
    type: "color-or-complex",
    allowKeywords: ["auto", "cover", "contain", ...CSS_GLOBAL_KEYWORDS],
  },
  color: {
    type: "color",
    allowKeywords: ["currentcolor", "transparent"],
  },
  "color-scheme": {
    type: "keyword",
    values: ["normal", "light", "dark", "light dark", "dark light"],
  },
  "forced-color-adjust": {
    type: "keyword",
    values: ["auto", "none"],
  },
};
