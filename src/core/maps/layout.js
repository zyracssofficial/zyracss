/**
 * Layout utility mappings for ZyraCSS
 * Full CSS property names + existing short forms
 */
export const LAYOUT_MAP = new Map([
  // Display - Full names
  ["display", "display"],

  // Display - Existing short forms
  ["d", "display"],

  // Position - Full names
  ["position", "position"],
  ["top", "top"],
  ["right", "right"],
  ["bottom", "bottom"],
  ["left", "left"],
  ["z-index", "z-index"],

  // Position - Existing short forms
  ["pos", "position"],
  ["z", "z-index"],

  // Float & Clear - Full names
  ["float", "float"],
  ["clear", "clear"],

  // Visibility - Full names
  ["visibility", "visibility"],

  // Visibility - Existing short forms
  ["v", "visibility"],

  // Flexbox Container - Full names
  ["flex-direction", "flex-direction"],
  ["flex-wrap", "flex-wrap"],
  ["flex-flow", "flex-flow"],
  ["justify-content", "justify-content"],
  ["align-items", "align-items"],
  ["align-content", "align-content"],
  ["place-content", "place-content"],
  ["justify-items", "justify-items"],
  ["place-items", "place-items"],

  // Flexbox Items - Full names
  ["flex", "flex"],
  ["flex-grow", "flex-grow"],
  ["flex-shrink", "flex-shrink"],
  ["flex-basis", "flex-basis"],
  ["align-self", "align-self"],
  ["justify-self", "justify-self"],
  ["place-self", "place-self"],
  ["order", "order"],

  // Grid Container - Full names
  ["grid", "grid"],
  ["grid-template", "grid-template"],
  ["grid-template-rows", "grid-template-rows"],
  ["grid-template-columns", "grid-template-columns"],
  ["grid-template-areas", "grid-template-areas"],
  ["grid-auto-rows", "grid-auto-rows"],
  ["grid-auto-columns", "grid-auto-columns"],
  ["grid-auto-flow", "grid-auto-flow"],

  // Grid Items - Full names
  ["grid-area", "grid-area"],
  ["grid-row", "grid-row"],
  ["grid-row-start", "grid-row-start"],
  ["grid-row-end", "grid-row-end"],
  ["grid-column", "grid-column"],
  ["grid-column-start", "grid-column-start"],
  ["grid-column-end", "grid-column-end"],

  // Multi-column Layout - Full names
  ["columns", "columns"],
  ["column-count", "column-count"],
  ["column-width", "column-width"],
  ["column-rule", "column-rule"],
  ["column-rule-width", "column-rule-width"],
  ["column-rule-style", "column-rule-style"],
  ["column-rule-color", "column-rule-color"],
  ["column-span", "column-span"],
  ["column-fill", "column-fill"],
  ["break-before", "break-before"],
  ["break-after", "break-after"],
  ["break-inside", "break-inside"],

  // Table Layout - Full names
  ["table-layout", "table-layout"],
  ["border-collapse", "border-collapse"],
  ["border-spacing", "border-spacing"],
  ["caption-side", "caption-side"],
  ["empty-cells", "empty-cells"],

  // Lists - Full names
  ["list-style", "list-style"],
  ["list-style-type", "list-style-type"],
  ["list-style-position", "list-style-position"],
  ["list-style-image", "list-style-image"],

  // Container Queries - Full names
  ["container", "container"],
  ["container-type", "container-type"],
  ["container-name", "container-name"],
]);
