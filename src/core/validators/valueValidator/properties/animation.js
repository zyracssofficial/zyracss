/**
 * Animation Properties Validation Rules
 * CSS properties related to animations and transitions
 */

import { PROCESSING_CONSTANTS } from "../../../utils/index.js";
import {
  CSS_GLOBAL_KEYWORDS,
  KEYWORD_NONE,
} from "../../constants/cssKeywords.js";

/**
 * Animation properties validation rules
 * 17 properties total
 */
export const ANIMATION_PROPERTIES = {
  animation: {
    type: "animation-shorthand", // Special type for animation shorthand
    allowKeywords: [...KEYWORD_NONE, ...CSS_GLOBAL_KEYWORDS],
    allowMultiple: true, // Allow space-separated shorthand: name duration timing delay iteration direction fill-mode play-state
    allowCalc: true, // Allow calc() in duration/delay
    allowCommaLists: true, // Allow multiple animations separated by commas
    allowCustom: true, // Allow custom animation names
  },
  "animation-delay": {
    type: "time",
    allowNegative: true,
  },
  "animation-direction": {
    type: "keyword",
    values: ["normal", "reverse", "alternate", "alternate-reverse"],
  },
  "animation-duration": {
    type: "time",
    min: PROCESSING_CONSTANTS.MIN_ZERO,
    allowNegative: false,
  },
  "animation-fill-mode": {
    type: "keyword",
    values: ["none", "forwards", "backwards", "both"],
  },
  "animation-iteration-count": {
    type: "number-or-keyword",
    min: PROCESSING_CONSTANTS.MIN_ZERO,
    allowNegative: false,
    values: ["infinite"],
  },
  "animation-name": {
    type: "keyword",
    values: ["none"],
    allowCustom: true, // Allow custom animation names
  },
  "animation-play-state": {
    type: "keyword",
    values: ["running", "paused"],
  },
  "animation-timing-function": {
    type: "keyword-or-function",
    values: [
      "ease",
      "linear",
      "ease-in",
      "ease-out",
      "ease-in-out",
      "step-start",
      "step-end",
    ],
    functions: ["cubic-bezier", "steps"],
  },
  contain: {
    type: "keyword",
    allowKeywords: [
      "none",
      "strict",
      "content",
      "size",
      "layout",
      "style",
      "paint",
      "inherit",
      "initial",
      "unset",
    ],
    allowMultiple: true, // Can combine values like "size layout"
  },
  "content-visibility": {
    type: "keyword",
    allowKeywords: ["visible", "auto", "hidden", "inherit", "initial", "unset"],
  },
  transition: {
    type: "transition-shorthand", // Special type for transition shorthand
    allowKeywords: ["none", "all", "inherit", "initial", "unset"],
    allowCustom: true, // Allow custom property names
    allowCommaLists: true, // Allow multiple transitions separated by commas
  },
  "transition-delay": {
    type: "time",
    allowNegative: true,
    allowCalc: true, // Allow calc() expressions
  },
  "transition-duration": {
    type: "time",
    min: PROCESSING_CONSTANTS.MIN_ZERO,
    allowNegative: false,
  },
  "transition-property": {
    type: "keyword",
    values: ["none", "all"],
    allowCustom: true, // Allow any CSS property name
  },
  "transition-timing-function": {
    type: "keyword-or-function",
    values: [
      "ease",
      "linear",
      "ease-in",
      "ease-out",
      "ease-in-out",
      "step-start",
      "step-end",
    ],
    functions: ["cubic-bezier", "steps"],
  },
  "will-change": {
    type: "keyword",
    allowKeywords: [
      "auto",
      "scroll-position",
      "contents",
      "transform",
      "opacity",
      "inherit",
      "initial",
      "unset",
    ],
    allowCustom: true, // Allow custom property names
    allowCommaLists: true, // Multiple properties
  },
};
