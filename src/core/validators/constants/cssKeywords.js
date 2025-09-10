/**
 * Shared Validation Constants
 * Centralized validation keywords, value sets, and lookup tables used across multiple validator files
 */

/**
 * CSS Global Keywords
 * Available for all CSS properties as per CSS specification
 */
export const CSS_GLOBAL_KEYWORDS = [
  "inherit",
  "initial", 
  "revert",
  "revert-layer",
  "unset"
];

/**
 * Common Single Value Keywords
 * Frequently used individual keywords across properties
 */
export const KEYWORD_AUTO = ["auto"];
export const KEYWORD_NONE = ["none"];
export const KEYWORD_NORMAL = ["normal"];

/**
 * Combined Common Keywords
 * Frequently used combinations across properties
 */
export const KEYWORDS_AUTO_GLOBAL = [
  "auto",
  ...CSS_GLOBAL_KEYWORDS
];

export const KEYWORDS_NONE_GLOBAL = [
  "none", 
  ...CSS_GLOBAL_KEYWORDS
];

export const KEYWORDS_NORMAL_GLOBAL = [
  "normal",
  ...CSS_GLOBAL_KEYWORDS
];

/**
 * Box Model Keywords  
 * Used for sizing, box-sizing, background-clip, etc.
 */
export const BOX_MODEL_KEYWORDS = [
  "content-box",
  "border-box",
  "padding-box"
];

/**
 * Intrinsic Sizing Keywords
 * Used for width, height, min-width, max-width, etc.
 */
export const INTRINSIC_SIZE_KEYWORDS = [
  "auto",
  "max-content", 
  "min-content",
  "fit-content"
];

/**
 * Content Size Keywords  
 * Extended intrinsic sizing for max-width/height
 */
export const CONTENT_SIZE_KEYWORDS = [
  "none",
  "max-content",
  "min-content", 
  "fit-content"
];

/**
 * Position Keywords
 * Used for transform-origin, background-position, etc.
 */
export const POSITION_KEYWORDS = [
  "top",
  "right", 
  "bottom",
  "left",
  "center"
];

/**
 * Display Keywords
 * Basic display values (without complex flex/grid values)
 */
export const BASIC_DISPLAY_KEYWORDS = [
  "block",
  "inline",
  "inline-block", 
  "none"
];

/**
 * Visibility Keywords
 */
export const VISIBILITY_KEYWORDS = [
  "visible",
  "hidden",
  "collapse"
];

/**
 * Float Keywords
 */
export const FLOAT_KEYWORDS = [
  "left",
  "right",
  "none"
];

/**
 * Clear Keywords  
 */
export const CLEAR_KEYWORDS = [
  "left", 
  "right",
  "both",
  "none"
];

/**
 * Overflow Keywords
 */
export const OVERFLOW_KEYWORDS = [
  "visible",
  "hidden",
  "clip", 
  "scroll",
  "auto"
];

/**
 * Object Fit Keywords
 */
export const OBJECT_FIT_KEYWORDS = [
  "fill",
  "contain",
  "cover", 
  "none",
  "scale-down"
];

/**
 * Transform Style Keywords
 */
export const TRANSFORM_STYLE_KEYWORDS = [
  "flat",
  "preserve-3d"  
];

/**
 * Transform Box Keywords
 */
export const TRANSFORM_BOX_KEYWORDS = [
  "content-box",
  "border-box",
  "fill-box",
  "stroke-box", 
  "view-box"
];

/**
 * Text Transform Keywords
 */
export const TEXT_TRANSFORM_KEYWORDS = [
  "none",
  "capitalize",
  "uppercase",
  "lowercase",
  "full-width",
  "full-size-kana"
];

/**
 * Font Style Keywords
 */
export const FONT_STYLE_KEYWORDS = [
  "normal",
  "italic",
  "oblique"
];

/**
 * Font Weight Keywords
 */
export const FONT_WEIGHT_KEYWORDS = [
  "normal",
  "bold",
  "lighter", 
  "bolder"
];

/**
 * Text Align Keywords
 */
export const TEXT_ALIGN_KEYWORDS = [
  "left",
  "right", 
  "center",
  "justify",
  "start",
  "end"
];

/**
 * Vertical Align Keywords
 */
export const VERTICAL_ALIGN_KEYWORDS = [
  "baseline",
  "sub",
  "super",
  "text-top",
  "text-bottom",
  "middle", 
  "top",
  "bottom"
];

/**
 * White Space Keywords
 */
export const WHITE_SPACE_KEYWORDS = [
  "normal",
  "nowrap",
  "pre",
  "pre-wrap",
  "pre-line",
  "break-spaces"
];

/**
 * Word Break Keywords
 */
export const WORD_BREAK_KEYWORDS = [
  "normal", 
  "break-all",
  "keep-all",
  "break-word"
];

/**
 * List Style Type Keywords
 */
export const LIST_STYLE_TYPE_KEYWORDS = [
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
  "georgian"
];

/**
 * Cursor Keywords
 */
export const CURSOR_KEYWORDS = [
  "auto",
  "default",
  "none",
  "context-menu",
  "help", 
  "pointer",
  "progress",
  "wait",
  "cell",
  "crosshair",
  "text",
  "vertical-text",
  "alias",
  "copy",
  "move",
  "no-drop",
  "not-allowed",
  "grab",
  "grabbing",
  "e-resize",
  "n-resize",
  "ne-resize",
  "nw-resize",
  "s-resize",
  "se-resize",
  "sw-resize",
  "w-resize",
  "ew-resize",
  "ns-resize",
  "nesw-resize",
  "nwse-resize",
  "col-resize",
  "row-resize",
  "all-scroll",
  "zoom-in",
  "zoom-out"
];

/**
 * Animation Fill Mode Keywords
 */
export const ANIMATION_FILL_MODE_KEYWORDS = [
  "none",
  "forwards",
  "backwards", 
  "both"
];

/**
 * Animation Direction Keywords
 */
export const ANIMATION_DIRECTION_KEYWORDS = [
  "normal",
  "reverse",
  "alternate",
  "alternate-reverse"
];

/**
 * Animation Play State Keywords
 */
export const ANIMATION_PLAY_STATE_KEYWORDS = [
  "running",
  "paused"
];

/**
 * Timing Function Keywords
 */
export const TIMING_FUNCTION_KEYWORDS = [
  "ease",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "linear",
  "step-start",
  "step-end"
];

/**
 * Transition Property Keywords
 */
export const TRANSITION_PROPERTY_KEYWORDS = [
  "none",
  "all"
];

/**
 * Grid Keywords
 */
export const GRID_KEYWORDS = [
  "none",
  "auto",
  "subgrid",
  "masonry"
];

/**
 * Flex Direction Keywords
 */
export const FLEX_DIRECTION_KEYWORDS = [
  "row",
  "row-reverse", 
  "column",
  "column-reverse"
];

/**
 * Flex Wrap Keywords
 */
export const FLEX_WRAP_KEYWORDS = [
  "nowrap",
  "wrap",
  "wrap-reverse"
];

/**
 * Justify Content Keywords
 */
export const JUSTIFY_CONTENT_KEYWORDS = [
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly"
];

/**
 * Align Items Keywords
 */
export const ALIGN_ITEMS_KEYWORDS = [
  "stretch",
  "flex-start", 
  "flex-end",
  "center",
  "baseline"
];

/**
 * Align Content Keywords
 */
export const ALIGN_CONTENT_KEYWORDS = [
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
  "stretch"
];

/**
 * Common Value Validation Helpers
 * Functions that create commonly-used validation rule combinations
 */

/**
 * Create validation rules for properties that accept auto + global keywords
 */
export function createAutoKeywordRules() {
  return {
    type: "keyword",
    allowKeywords: KEYWORDS_AUTO_GLOBAL
  };
}

/**
 * Create validation rules for properties that accept none + global keywords  
 */
export function createNoneKeywordRules() {
  return {
    type: "keyword", 
    allowKeywords: KEYWORDS_NONE_GLOBAL
  };
}

/**
 * Create validation rules for properties that accept normal + global keywords
 */
export function createNormalKeywordRules() {
  return {
    type: "keyword",
    allowKeywords: KEYWORDS_NORMAL_GLOBAL  
  };
}

/**
 * Create validation rules for intrinsic sizing properties
 */
export function createIntrinsicSizingRules() {
  return {
    type: "length-percentage",
    allowKeywords: INTRINSIC_SIZE_KEYWORDS
  };
}

/**
 * Create validation rules for content sizing properties  
 */
export function createContentSizingRules() {
  return {
    type: "length-percentage",
    allowKeywords: CONTENT_SIZE_KEYWORDS
  };
}
