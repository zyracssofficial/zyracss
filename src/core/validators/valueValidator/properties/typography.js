/**
 * Typography Properties Validation Rules
 * CSS properties related to text, fonts, and typography
 */

import { PROCESSING_CONSTANTS } from "../../../utils/index.js";
import { FONT_WEIGHT_MAX } from "../../../security/securityConstants.js";
import {
  CSS_GLOBAL_KEYWORDS,
  KEYWORD_AUTO,
  KEYWORD_NORMAL,
  KEYWORD_NONE,
  FONT_STYLE_KEYWORDS,
  TEXT_ALIGN_KEYWORDS,
} from "../../constants/cssKeywords.js";

/**
 * Typography properties validation rules
 * 50 properties total
 */
export const TYPOGRAPHY_PROPERTIES = {
  content: {
    type: "string",
    allowKeywords: [
      "none",
      "normal",
      "open-quote",
      "close-quote",
      "no-open-quote",
      "no-close-quote",
    ],
    allowStrings: true,
    allowCounters: true,
    allowAttr: true,
    allowMultiple: true,
  },
  "counter-increment": {
    type: "string",
    allowKeywords: ["none"],
    allowCustom: true,
    allowMultiple: true,
  },
  "counter-reset": {
    type: "string",
    allowKeywords: ["none"],
    allowCustom: true,
    allowMultiple: true,
  },
  "counter-set": {
    type: "string",
    allowKeywords: ["none"],
    allowCustom: true,
    allowMultiple: true,
  },
  direction: {
    type: "keyword",
    values: ["ltr", "rtl"],
  },
  font: {
    type: "font-shorthand",
    allowKeywords: [
      "caption",
      "icon",
      "menu",
      "message-box",
      "small-caption",
      "status-bar",
    ],
    systemFonts: [
      "caption",
      "icon",
      "menu",
      "message-box",
      "small-caption",
      "status-bar",
    ],
    allowMultiple: true,
  },
  "font-display": {
    type: "keyword",
    values: ["auto", "block", "swap", "fallback", "optional"],
  },
  "font-family": {
    type: "font-family",
    allowKeywords: CSS_GLOBAL_KEYWORDS,
    allowStrings: true,
    allowMultiple: true,
    systemFamilies: [
      "serif",
      "sans-serif",
      "monospace",
      "cursive",
      "fantasy",
      "system-ui",
      "ui-serif",
      "ui-sans-serif",
      "ui-monospace",
      "ui-rounded",
    ],
  },
  "font-kerning": {
    type: "keyword",
    values: ["auto", "normal", "none"],
  },
  "font-optical-sizing": {
    type: "keyword",
    values: ["auto", "none"],
  },
  "font-size": {
    type: "length",
    min: PROCESSING_CONSTANTS.MIN_ZERO,
    allowNegative: false,
    allowCalc: true,
    allowFunctions: true,
    allowKeywords: [
      "xx-small",
      "x-small",
      "small",
      "medium",
      "large",
      "x-large",
      "xx-large",
    ],
  },
  "font-stretch": {
    type: "keyword",
    values: [
      "normal",
      "ultra-condensed",
      "extra-condensed",
      "condensed",
      "semi-condensed",
      "semi-expanded",
      "expanded",
      "extra-expanded",
      "ultra-expanded",
    ],
    allowPercentage: true,
  },
  "font-style": {
    type: "keyword",
    values: ["normal", "italic", "oblique"],
    allowAngles: true, // For oblique angles
  },
  "font-variant": {
    type: "keyword",
    values: ["normal", "small-caps"],
  },
  "font-variation-settings": {
    type: "string",
    allowKeywords: ["normal"],
    allowCustom: true,
  },
  "font-weight": {
    type: "keyword-or-number",
    values: ["normal", "bold", "lighter", "bolder"],
    numberRange: [1, FONT_WEIGHT_MAX],
  },
  hyphens: {
    type: "keyword",
    values: ["none", "manual", "auto"],
  },
  "letter-spacing": {
    type: "length",
    allowKeywords: ["normal"],
    allowNegative: true,
    allowCalc: true,
  },
  "line-height": {
    type: "length-or-number",
    min: PROCESSING_CONSTANTS.MIN_ZERO,
    allowNegative: false,
    allowUnitless: true,
    allowCalc: true,
    allowKeywords: ["normal"],
    allowPercentage: true,
  },
  "margin-trim": {
    type: "keyword",
    values: ["none", "in-flow", "all"],
  },
  quotes: {
    type: "string",
    allowKeywords: ["none", "auto"],
    allowStrings: true,
    allowMultiple: true, // Allow pairs of open/close quotes
  },
  "tab-size": {
    type: "length-or-number", // Match old validator
    allowKeywords: [],
    allowNegative: false, // Cannot be negative
    allowUnitless: true, // Allow pure numbers like 4
    min: 0,
    allowCalc: true,
  },
  "text-align": {
    type: "keyword",
    values: [...TEXT_ALIGN_KEYWORDS, ...CSS_GLOBAL_KEYWORDS],
  },
  "text-align-last": {
    type: "keyword",
    values: ["auto", ...TEXT_ALIGN_KEYWORDS, ...CSS_GLOBAL_KEYWORDS],
  },
  "text-autospace": {
    type: "keyword",
    values: ["normal", "no-autospace"],
    allowMultiple: true,
  },
  "text-decoration": {
    type: "string",
    allowKeywords: ["none"],
    allowMultiple: true,
  },
  "text-decoration-color": {
    type: "color",
    allowKeywords: ["currentcolor", "transparent", ...CSS_GLOBAL_KEYWORDS],
  },
  "text-decoration-line": {
    type: "keyword",
    values: ["none", "underline", "overline", "line-through", "blink"],
    allowMultiple: true,
  },
  "text-decoration-style": {
    type: "keyword",
    values: ["solid", "double", "dotted", "dashed", "wavy"],
  },
  "text-decoration-thickness": {
    type: "length",
    allowKeywords: ["auto", "from-font"],
    allowPercentage: true,
    allowCalc: true,
  },
  "text-emphasis": {
    type: "string",
    allowKeywords: ["none"],
    allowMultiple: true,
  },
  "text-emphasis-color": {
    type: "color",
    allowKeywords: ["currentcolor", "transparent", ...CSS_GLOBAL_KEYWORDS],
  },
  "text-emphasis-position": {
    type: "keyword",
    values: ["over", "under", "left", "right"],
    allowMultiple: true, // Allow "over left" etc.
  },
  "text-emphasis-style": {
    type: "keyword",
    values: [
      "none",
      "filled",
      "open",
      "dot",
      "circle",
      "double-circle",
      "triangle",
      "sesame",
    ],
    allowStrings: true, // Allow custom marks
  },
  "text-indent": {
    type: "length",
    allowPercentage: true,
    allowCalc: true,
    allowNegative: true,
    allowKeywords: ["hanging", "each-line"],
    allowMultiple: true, // Allow "length hanging each-line"
  },
  "text-orientation": {
    type: "keyword",
    values: ["mixed", "upright", "sideways"],
  },
  "text-overflow": {
    type: "keyword",
    values: ["clip", "ellipsis"],
  },
  "text-rendering": {
    type: "keyword",
    values: [
      "auto",
      "optimizespeed",
      "optimizelegibility",
      "geometricprecision",
    ],
  },
  "text-shadow": {
    type: "shadow",
    allowKeywords: ["none"],
    allowMultiple: true,
    allowColors: true,
  },
  "text-size-adjust": {
    type: "string",
    values: ["none", "auto"],
    allowPercentage: true,
  },
  "text-spacing-trim": {
    type: "keyword",
    values: ["normal", "space-all", "space-first", "trim-start"],
    allowMultiple: true,
  },
  "text-transform": {
    type: "keyword",
    values: [
      "none",
      "capitalize",
      "uppercase",
      "lowercase",
      "full-width",
      "full-size-kana",
    ],
  },
  "text-underline-offset": {
    type: "length",
    allowKeywords: ["auto"],
    allowPercentage: true,
    allowCalc: true,
  },
  "text-wrap": {
    type: "keyword",
    values: ["wrap", "nowrap", "balance", "stable", "pretty"],
  },
  "unicode-bidi": {
    type: "keyword",
    values: [
      "normal",
      "embed",
      "isolate",
      "bidi-override",
      "isolate-override",
      "plaintext",
    ],
  },
  "white-space": {
    type: "keyword",
    values: ["normal", "nowrap", "pre", "pre-wrap", "pre-line", "break-spaces"],
  },
  "word-break": {
    type: "keyword",
    values: ["normal", "break-all", "keep-all", "break-word"],
  },
  "word-spacing": {
    type: "length",
    allowKeywords: ["normal"],
    allowNegative: true,
    allowPercentage: true,
    allowCalc: true,
  },
  "word-wrap": {
    type: "keyword",
    values: ["normal", "break-word"],
  },
  "writing-mode": {
    type: "keyword",
    values: ["horizontal-tb", "vertical-rl", "vertical-lr"],
  },
};
