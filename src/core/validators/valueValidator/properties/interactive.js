/**
 * Interactive Properties Validation Rules
 * CSS properties related to user interactions, cursors, and input behavior
 */

import { CURSOR_KEYWORDS } from "../../constants/cssKeywords.js";

/**
 * Interactive properties validation rules
 * 6 properties total
 */
export const INTERACTIVE_PROPERTIES = {
  "accent-color": {
    type: "color",
    allowKeywords: ["auto", "currentcolor", "transparent"],
  },
  appearance: {
    type: "keyword",
    values: [
      "none",
      "auto",
      "button",
      "textfield",
      "searchfield",
      "textarea",
      "push-button",
      "slider-horizontal",
      "checkbox",
      "radio",
      "square-button",
      "menulist",
      "menulist-button",
      "listbox",
      "meter",
      "progress-bar",
    ],
  },
  "caret-color": {
    type: "color",
    allowKeywords: ["auto", "currentcolor", "transparent"],
  },
  cursor: {
    type: "color-or-complex", // Allow complex values including processed URLs
    allowKeywords: CURSOR_KEYWORDS,
  },
  "pointer-events": {
    type: "keyword",
    values: [
      "auto",
      "none",
      "visiblepainted", // Lowercase to match validation normalization
      "visiblefill", // Lowercase to match validation normalization
      "visiblestroke", // Lowercase to match validation normalization
      "visible",
      "painted",
      "fill",
      "stroke",
      "all",
      "inherit", // Add missing inherit
    ],
  },
  "touch-action": {
    type: "keyword",
    values: [
      "auto",
      "none",
      "pan-x",
      "pan-left",
      "pan-right",
      "pan-y",
      "pan-up",
      "pan-down",
      "pinch-zoom",
      "manipulation",
    ],
    allowMultiple: true, // Can combine values like "pan-x pinch-zoom"
  },
  "user-select": {
    type: "keyword",
    values: ["auto", "text", "none", "contain", "all"],
  },
  resize: {
    type: "keyword",
    values: ["none", "both", "horizontal", "vertical", "block", "inline"],
  },
};
