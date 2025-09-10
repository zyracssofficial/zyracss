/**
 * Sizing Properties Validation Rules
 * CSS properties related to element dimensions and sizing
 */

import {
  KEYWORD_AUTO,
  INTRINSIC_SIZE_KEYWORDS,
  CONTENT_SIZE_KEYWORDS,
  OBJECT_FIT_KEYWORDS,
  POSITION_KEYWORDS,
} from "../../constants/cssKeywords.js";

/**
 * Sizing properties validation rules
 * 12 properties total
 */
export const SIZING_PROPERTIES = {
  "aspect-ratio": {
    type: "ratio-or-keyword",
    allowKeywords: KEYWORD_AUTO,
    allowNumbers: true, // Allow width/height ratios like 16/9
    allowCalc: true,
  },
  "block-size": {
    type: "length",
    allowKeywords: [...KEYWORD_AUTO, ...INTRINSIC_SIZE_KEYWORDS],
    allowCalc: true,
    allowPercentage: true,
  },
  "box-sizing": {
    type: "keyword",
    values: ["content-box", "border-box"],
  },
  height: {
    type: "length",
    allowKeywords: [...KEYWORD_AUTO, ...INTRINSIC_SIZE_KEYWORDS],
    allowCalc: true,
    allowPercentage: true,
  },
  "inline-size": {
    type: "length",
    allowKeywords: [...KEYWORD_AUTO, ...INTRINSIC_SIZE_KEYWORDS],
    allowCalc: true,
    allowPercentage: true,
  },
  "max-height": {
    type: "length",
    allowKeywords: ["none", ...INTRINSIC_SIZE_KEYWORDS],
    allowCalc: true,
    allowPercentage: true,
  },
  "max-width": {
    type: "length",
    allowKeywords: ["none", ...INTRINSIC_SIZE_KEYWORDS],
    allowCalc: true,
    allowPercentage: true,
  },
  "min-height": {
    type: "length",
    min: 0,
    allowKeywords: [...KEYWORD_AUTO, ...INTRINSIC_SIZE_KEYWORDS],
    allowCalc: true,
    allowPercentage: true,
  },
  "min-width": {
    type: "length",
    min: 0,
    allowKeywords: [...KEYWORD_AUTO, ...INTRINSIC_SIZE_KEYWORDS],
    allowCalc: true,
    allowPercentage: true,
  },
  "object-fit": {
    type: "keyword",
    values: OBJECT_FIT_KEYWORDS,
  },
  "object-position": {
    type: "string", // Match old validator
    allowKeywords: POSITION_KEYWORDS, // Match old validator order
    allowPercentage: true,
    allowLength: true,
    allowMultiple: true, // Allow "x y" position values
  },
  width: {
    type: "length",
    allowKeywords: [...KEYWORD_AUTO, ...INTRINSIC_SIZE_KEYWORDS],
    allowCalc: true,
    allowPercentage: true,
  },
};
