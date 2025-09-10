/**
 * Overflow Properties Validation Rules
 * CSS properties related to overflow behavior and scrolling
 */

import {
  KEYWORD_AUTO,
  KEYWORD_NONE,
  KEYWORD_NORMAL,
} from "../../constants/cssKeywords.js";

/**
 * Overflow properties validation rules
 * 36 properties total (matching maps/overflow.js exactly)
 */
export const OVERFLOW_PROPERTIES = {
  overflow: {
    type: "keyword",
    values: ["visible", "hidden", "scroll", "auto", "clip"],
    allowMultiple: true, // Allow "overflow-x overflow-y"
  },
  "overflow-anchor": {
    type: "keyword",
    values: [...KEYWORD_AUTO, ...KEYWORD_NONE],
  },
  "overflow-block": {
    type: "keyword",
    values: ["visible", "hidden", "scroll", "auto", "clip"],
  },
  "overflow-inline": {
    type: "keyword",
    values: ["visible", "hidden", "scroll", "auto", "clip"],
  },
  "overflow-wrap": {
    type: "keyword",
    values: [...KEYWORD_NORMAL, "break-word", "anywhere"],
  },
  "overflow-x": {
    type: "keyword",
    values: ["visible", "hidden", "scroll", "auto", "clip"],
  },
  "overflow-y": {
    type: "keyword",
    values: ["visible", "hidden", "scroll", "auto", "clip"],
  },
  "scroll-behavior": {
    type: "keyword",
    values: [...KEYWORD_AUTO, "smooth"],
  },
  "scroll-margin": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowMultiple: true, // Allow 1-4 values
  },
  "scroll-margin-block": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowMultiple: true, // Allow 1-2 values
  },
  "scroll-margin-block-end": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
  },
  "scroll-margin-block-start": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
  },
  "scroll-margin-bottom": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
  },
  "scroll-margin-inline": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowMultiple: true, // Allow 1-2 values
  },
  "scroll-margin-inline-end": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
  },
  "scroll-margin-inline-start": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
  },
  "scroll-margin-left": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
  },
  "scroll-margin-right": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
  },
  "scroll-margin-top": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
  },
  "scroll-padding": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowMultiple: true, // Allow 1-4 values
  },
  "scroll-padding-block": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowMultiple: true, // Allow 1-2 values
  },
  "scroll-padding-block-end": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
  },
  "scroll-padding-block-start": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
  },
  "scroll-padding-bottom": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
  },
  "scroll-padding-inline": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowMultiple: true, // Allow 1-2 values
  },
  "scroll-padding-inline-end": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
  },
  "scroll-padding-inline-start": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
  },
  "scroll-padding-left": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
  },
  "scroll-padding-right": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
  },
  "scroll-padding-top": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
  },
  "scroll-snap-align": {
    type: "keyword",
    values: [...KEYWORD_NONE, "start", "end", "center"],
    allowMultiple: true, // Allow "block inline" values
  },
  "scroll-snap-stop": {
    type: "keyword",
    values: ["normal", "always"],
  },
  "scroll-snap-type": {
    type: "keyword",
    values: [
      "none",
      "x",
      "y",
      "block",
      "inline",
      "both",
      "mandatory",
      "proximity",
    ],
    allowMultiple: true, // Allow "axis strictness"
  },
  "scrollbar-color": {
    type: "color-or-complex",
    allowMultiple: true, // Can take thumb and track colors
    allowKeywords: [...KEYWORD_AUTO],
  },
  "scrollbar-gutter": {
    type: "keyword",
    values: ["auto", "stable", "both-edges"],
    allowMultiple: true, // Can combine stable + both-edges
  },
  "scrollbar-width": {
    type: "keyword",
    values: [...KEYWORD_AUTO, "thin", ...KEYWORD_NONE],
  },
};
