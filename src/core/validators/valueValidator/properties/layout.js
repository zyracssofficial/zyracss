/**
 * Layout Properties Validation Rules
 * CSS properties related to layout, positioning, flexbox, grid, and display
 */

import { PROCESSING_CONSTANTS } from "../../../utils/index.js";
import {
  CSS_GLOBAL_KEYWORDS,
  KEYWORD_AUTO,
  KEYWORD_NONE,
  BASIC_DISPLAY_KEYWORDS,
  POSITION_KEYWORDS,
  VISIBILITY_KEYWORDS,
  OVERFLOW_KEYWORDS,
} from "../../constants/cssKeywords.js";

/**
 * Layout properties validation rules
 * 66 properties total
 */
export const LAYOUT_PROPERTIES = {
  "align-content": {
    type: "keyword",
    values: [
      "normal",
      "flex-start",
      "flex-end",
      "center",
      "space-between",
      "space-around",
      "space-evenly",
      "stretch",
      "start",
      "end",
      "baseline",
    ],
    allowMultiple: true,
  },
  "align-items": {
    type: "keyword",
    values: [
      "normal",
      "flex-start",
      "flex-end",
      "center",
      "baseline",
      "stretch",
      "start",
      "end",
    ],
  },
  "align-self": {
    type: "keyword",
    values: [
      "auto",
      "normal",
      "flex-start",
      "flex-end",
      "center",
      "baseline",
      "stretch",
      "start",
      "end",
    ],
  },
  bottom: {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: ["auto"],
    allowPercentage: true,
  },
  "break-after": {
    type: "keyword",
    values: [
      "auto",
      "avoid",
      "always",
      "all",
      "avoid-page",
      "page",
      "left",
      "right",
      "recto",
      "verso",
      "avoid-column",
      "column",
      "avoid-region",
      "region",
    ],
  },
  "break-before": {
    type: "keyword",
    values: [
      "auto",
      "avoid",
      "always",
      "all",
      "avoid-page",
      "page",
      "left",
      "right",
      "recto",
      "verso",
      "avoid-column",
      "column",
      "avoid-region",
      "region",
    ],
  },
  "break-inside": {
    type: "keyword",
    values: ["auto", "avoid", "avoid-page", "avoid-column", "avoid-region"],
  },
  "caption-side": {
    type: "keyword",
    values: [
      "top",
      "bottom",
      "block-start",
      "block-end",
      "inline-start",
      "inline-end",
    ],
  },
  clear: {
    type: "keyword",
    values: ["none", "left", "right", "both", "inline-start", "inline-end"],
  },
  "column-count": {
    type: "keyword-or-number",
    min: 1,
    allowKeywords: ["auto"],
  },
  "column-fill": {
    type: "keyword",
    values: ["auto", "balance", "balance-all"],
  },
  "column-rule": {
    type: "special-shorthand",
    allowKeywords: [...KEYWORD_NONE, ...CSS_GLOBAL_KEYWORDS],
    allowMultiple: true,
    allowColors: true,
  },
  "column-rule-color": {
    type: "color",
    allowKeywords: ["currentcolor", "transparent", ...CSS_GLOBAL_KEYWORDS],
  },
  "column-rule-style": {
    type: "keyword",
    values: [
      "none",
      "hidden",
      "dotted",
      "dashed",
      "solid",
      "double",
      "groove",
      "ridge",
      "inset",
      "outset",
    ],
  },
  "column-rule-width": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowKeywords: ["thin", "medium", "thick"],
  },
  "column-span": {
    type: "keyword",
    values: ["none", "all"],
  },
  "column-width": {
    type: "length",
    min: 0,
    allowNegative: false,
    allowKeywords: ["auto"],
  },
  columns: {
    type: "complex",
    allowKeywords: ["auto"],
    allowMultiple: true, // Allow "column-width column-count" shorthand
  },
  container: {
    type: "complex",
    allowKeywords: ["none"],
    allowMultiple: true, // Allow "name / type" syntax
  },
  "container-name": {
    type: "string",
    allowKeywords: ["none"],
    allowCustom: true, // Allow custom container names
  },
  "container-type": {
    type: "keyword",
    values: ["normal", "size", "inline-size"],
  },
  display: {
    type: "keyword",
    values: [
      "none",
      "block",
      "inline",
      "inline-block",
      "flex",
      "inline-flex",
      "grid",
      "inline-grid",
      "table",
      "inline-table",
      "table-row",
      "table-cell",
      "table-column",
      "table-column-group",
      "table-row-group",
      "table-header-group",
      "table-footer-group",
      "table-caption",
      "list-item",
      "run-in",
      "contents",
    ],
  },
  "empty-cells": {
    type: "keyword",
    values: ["show", "hide"],
  },
  flex: {
    type: "string",
    allowKeywords: ["none", "auto", "initial"],
    allowMultiple: true, // Allow "flex-grow flex-shrink flex-basis"
  },
  "flex-basis": {
    type: "length",
    allowKeywords: [
      "auto",
      "content",
      "max-content",
      "min-content",
      "fit-content",
    ],
    allowPercentage: true,
    allowCalc: true,
  },
  "flex-direction": {
    type: "keyword",
    values: ["row", "row-reverse", "column", "column-reverse"],
  },
  "flex-flow": {
    type: "complex",
    allowMultiple: true, // Allow "flex-direction flex-wrap" shorthand
  },
  "flex-grow": {
    type: "number",
    min: 0,
    allowNegative: false,
  },
  "flex-shrink": {
    type: "number",
    min: 0,
    allowNegative: false,
  },
  "flex-wrap": {
    type: "keyword",
    values: ["nowrap", "wrap", "wrap-reverse"],
  },
  float: {
    type: "keyword",
    values: ["none", "left", "right", "inline-start", "inline-end"],
  },
  grid: {
    type: "string",
    allowKeywords: ["none"],
    allowMultiple: true,
    allowComplex: true,
  },
  "grid-area": {
    type: "complex",
    allowKeywords: ["auto"],
    allowCustom: true, // Allow custom grid area names
  },
  "grid-auto-columns": {
    type: "complex",
    allowMultiple: true,
  },
  "grid-auto-flow": {
    type: "keyword",
    values: ["row", "column", "dense", "row dense", "column dense"],
    allowMultiple: true,
  },
  "grid-auto-rows": {
    type: "complex",
    allowMultiple: true,
  },
  "grid-column": {
    type: "complex",
    allowKeywords: ["auto"],
    allowCustom: true,
  },
  "grid-column-end": {
    type: "complex",
    allowKeywords: ["auto"],
    allowCustom: true,
  },
  "grid-column-start": {
    type: "complex",
    allowKeywords: ["auto"],
    allowCustom: true,
  },
  "grid-row": {
    type: "complex",
    allowKeywords: ["auto"],
    allowCustom: true,
  },
  "grid-row-end": {
    type: "complex",
    allowKeywords: ["auto"],
    allowCustom: true,
  },
  "grid-row-start": {
    type: "complex",
    allowKeywords: ["auto"],
    allowCustom: true,
  },
  "grid-template": {
    type: "complex",
    allowKeywords: ["none"],
    allowComplex: true,
  },
  "grid-template-areas": {
    type: "string",
    allowKeywords: ["none"],
    allowCustom: true,
  },
  "grid-template-columns": {
    type: "complex",
    allowKeywords: ["none", "auto", "subgrid", "masonry"],
    allowMultiple: true,
    functions: ["repeat", "minmax", "fit-content"],
    allowLength: true,
    allowFractional: true,
    allowCalc: true,
    restrictColors: true,
  },
  "grid-template-rows": {
    type: "complex",
    allowKeywords: ["none", "auto", "subgrid", "masonry"],
    allowMultiple: true,
    functions: ["repeat", "minmax", "fit-content"],
    allowLength: true,
    allowFractional: true,
    allowCalc: true,
    restrictColors: true,
  },
  "justify-content": {
    type: "keyword",
    values: [
      "normal",
      "flex-start",
      "flex-end",
      "center",
      "space-between",
      "space-around",
      "space-evenly",
      "start",
      "end",
      "left",
      "right",
    ],
  },
  "justify-items": {
    type: "keyword",
    values: [
      "normal",
      "start",
      "end",
      "center",
      "stretch",
      "baseline",
      "flex-start",
      "flex-end",
      "self-start",
      "self-end",
      "left",
      "right",
    ],
  },
  "justify-self": {
    type: "keyword",
    values: [
      "auto",
      "normal",
      "start",
      "end",
      "center",
      "stretch",
      "baseline",
      "flex-start",
      "flex-end",
      "self-start",
      "self-end",
      "left",
      "right",
    ],
  },
  left: {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: ["auto"],
    allowPercentage: true,
  },
  "list-style": {
    type: "special-shorthand",
    allowKeywords: [...KEYWORD_NONE, ...CSS_GLOBAL_KEYWORDS],
    allowMultiple: true,
  },
  "list-style-image": {
    type: "color-or-complex",
    allowKeywords: [...KEYWORD_NONE, ...CSS_GLOBAL_KEYWORDS],
  },
  "list-style-position": {
    type: "keyword",
    values: ["inside", "outside"],
  },
  "list-style-type": {
    type: "keyword",
    values: [
      "none",
      "disc",
      "circle",
      "square",
      "decimal",
      "decimal-leading-zero",
      "lower-roman",
      "upper-roman",
      "lower-greek",
      "lower-latin",
      "upper-latin",
      "armenian",
      "georgian",
      "lower-alpha",
      "upper-alpha",
    ],
    allowCustom: true,
  },
  order: {
    type: "integer",
    allowKeywords: CSS_GLOBAL_KEYWORDS,
    allowNegative: true, // order can be negative
  },
  "place-content": {
    type: "keyword",
    values: [
      "normal",
      "start",
      "end",
      "center",
      "stretch",
      "space-between",
      "space-around",
      "space-evenly",
      "baseline",
      "flex-start",
      "flex-end",
    ],
    allowMultiple: true, // Allow "align-content justify-content"
  },
  "place-items": {
    type: "keyword",
    values: [
      "normal",
      "start",
      "end",
      "center",
      "stretch",
      "baseline",
      "flex-start",
      "flex-end",
    ],
    allowMultiple: true, // Allow "align-items justify-items"
  },
  "place-self": {
    type: "keyword",
    values: [
      "auto",
      "normal",
      "start",
      "end",
      "center",
      "stretch",
      "baseline",
      "flex-start",
      "flex-end",
    ],
    allowMultiple: true, // Allow "align-self justify-self"
  },
  position: {
    type: "keyword",
    values: ["static", "relative", "absolute", "fixed", "sticky"],
  },
  right: {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: ["auto"],
    allowPercentage: true,
  },
  "table-layout": {
    type: "keyword",
    values: ["auto", "fixed"],
  },
  top: {
    type: "length",
    allowNegative: true,
    allowCalc: true,
    allowKeywords: ["auto"],
    allowPercentage: true,
  },
  visibility: {
    type: "keyword",
    values: ["visible", "hidden", "collapse"],
  },
  "z-index": {
    type: "integer",
    allowKeywords: ["auto"],
    allowNegative: true, // z-index can be negative
  },
};
