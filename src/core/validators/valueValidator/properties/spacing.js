/**
 * Spacing Properties Validation Rules
 * CSS properties related to spacing, margins, padding, and gaps
 */

import { PROCESSING_CONSTANTS } from "../../../utils/index.js";
import { KEYWORD_AUTO, KEYWORD_NORMAL } from "../../constants/cssKeywords.js";

/**
 * Spacing properties validation rules
 * 32 properties total
 */
export const SPACING_PROPERTIES = {
  "column-gap": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_NORMAL],
  },
  gap: {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_NORMAL],
    allowMultiple: true, // Allow "row-gap column-gap"
  },
  inset: {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
    allowMultiple: true, // Allow 1-4 values like margin/padding
  },
  "inset-block": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
    allowMultiple: true, // Allow 1-2 values
  },
  "inset-block-end": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
  },
  "inset-block-start": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
  },
  "inset-inline": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
    allowMultiple: true, // Allow 1-2 values
  },
  "inset-inline-end": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
  },
  "inset-inline-start": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
  },
  margin: {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
    allowMultiple: true, // Allow 1-4 values
  },
  "margin-block": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
    allowMultiple: true, // Allow 1-2 values
  },
  "margin-block-end": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
  },
  "margin-block-start": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
  },
  "margin-bottom": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
  },
  "margin-inline": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
    allowMultiple: true, // Allow 1-2 values
  },
  "margin-inline-end": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
  },
  "margin-inline-start": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
  },
  "margin-left": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
  },
  "margin-right": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
  },
  "margin-top": {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: [...KEYWORD_AUTO],
    allowPercentage: true,
  },
  padding: {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowPercentage: true,
    allowMultiple: true, // Allow 1-4 values
  },
  "padding-block": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowPercentage: true,
    allowMultiple: true, // Allow 1-2 values
  },
  "padding-block-end": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowPercentage: true,
  },
  "padding-block-start": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowPercentage: true,
  },
  "padding-bottom": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowPercentage: true,
  },
  "padding-inline": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowPercentage: true,
    allowMultiple: true, // Allow 1-2 values
  },
  "padding-inline-end": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowPercentage: true,
  },
  "padding-inline-start": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowPercentage: true,
  },
  "padding-left": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowPercentage: true,
  },
  "padding-right": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowPercentage: true,
  },
  "padding-top": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowPercentage: true,
  },
  "row-gap": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowCalc: true,
    allowKeywords: [...KEYWORD_NORMAL],
  },
};
