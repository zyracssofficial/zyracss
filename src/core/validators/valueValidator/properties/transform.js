/**
 * Transform Properties Validation Rules
 * CSS properties related to 2D and 3D transformations
 */

import { KEYWORD_NONE } from "../../constants/cssKeywords.js";

/**
 * Transform properties validation rules
 * 10 properties total
 */
export const TRANSFORM_PROPERTIES = {
  "backface-visibility": {
    type: "keyword",
    values: ["visible", "hidden"],
  },
  perspective: {
    type: "length",
    min: 0,
    allowNegative: false,
    allowKeywords: [...KEYWORD_NONE],
    allowCalc: true,
  },
  "perspective-origin": {
    type: "keyword-or-length",
    allowKeywords: ["top", "right", "bottom", "left", "center"],
    allowPercentage: true,
    allowMultiple: true, // Allow "x y" position values
  },
  rotate: {
    type: "complex",
    allowKeywords: [...KEYWORD_NONE],
    allowCalc: true,
    allowAngles: true,
    allowMultiple: true, // Allow "x 45deg" or "1 1 0 45deg" syntax
  },
  scale: {
    type: "number",
    allowKeywords: [...KEYWORD_NONE],
    allowCalc: true,
    allowMultiple: true, // Allow "x y z" scale values
  },
  transform: {
    type: "function-or-keyword",
    functions: [
      "translate",
      "translateX",
      "translateY",
      "translateZ",
      "translate3d",
      "rotate",
      "rotateX",
      "rotateY",
      "rotateZ",
      "rotate3d",
      "scale",
      "scaleX",
      "scaleY",
      "scaleZ",
      "scale3d",
      "skew",
      "skewX",
      "skewY",
      "matrix",
      "matrix3d",
      "perspective",
    ],
    allowKeywords: [...KEYWORD_NONE],
    allowMultiple: true, // Allow multiple transform functions
    allowCalc: true, // Allow calc() functions in transform values
  },
  "transform-box": {
    type: "keyword",
    values: ["content-box", "border-box", "fill-box", "stroke-box", "view-box"],
  },
  "transform-origin": {
    type: "keyword-or-length",
    allowKeywords: ["top", "right", "bottom", "left", "center"],
    allowPercentage: true,
    allowMultiple: true, // Allow "x y z" position values
  },
  "transform-style": {
    type: "keyword",
    values: ["flat", "preserve-3d"],
  },
  translate: {
    type: "length",
    allowKeywords: [...KEYWORD_NONE],
    allowCalc: true,
    allowPercentage: true,
    allowMultiple: true, // Allow "x y z" translate values
  },
};
