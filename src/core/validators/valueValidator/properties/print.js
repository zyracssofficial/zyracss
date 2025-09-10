/**
 * Print Properties Validation Rules
 * CSS properties related to print media and page layout
 */

import {
  CSS_GLOBAL_KEYWORDS,
  KEYWORD_AUTO,
} from "../../constants/cssKeywords.js";

/**
 * Print properties validation rules
 * 6 properties total
 */
export const PRINT_PROPERTIES = {
  orphans: {
    type: "integer",
    min: 1,
    allowKeywords: CSS_GLOBAL_KEYWORDS,
  },
  page: {
    type: "keyword-or-identifier",
    allowKeywords: [...KEYWORD_AUTO, ...CSS_GLOBAL_KEYWORDS],
    allowIdentifiers: true, // Allow valid CSS identifiers for named pages
    pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/, // Valid CSS identifier pattern
  },
  "page-break-after": {
    type: "keyword",
    values: ["auto", "always", "avoid", "left", "right", "recto", "verso"],
  },
  "page-break-before": {
    type: "keyword",
    values: ["auto", "always", "avoid", "left", "right", "recto", "verso"],
  },
  "page-break-inside": {
    type: "keyword",
    values: ["auto", "avoid"],
  },
  widows: {
    type: "integer",
    min: 1,
    allowKeywords: CSS_GLOBAL_KEYWORDS,
  },
};
