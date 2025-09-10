/**
 * Animation utility mappings for ZyraCSS
 * Full CSS property names only (no short forms)
 */
export const ANIMATION_MAP = new Map([
  // Transitions
  ["transition", "transition"],
  ["transition-property", "transition-property"],
  ["transition-duration", "transition-duration"],
  ["transition-timing-function", "transition-timing-function"],
  ["transition-delay", "transition-delay"],

  // Animations
  ["animation", "animation"],
  ["animation-name", "animation-name"],
  ["animation-duration", "animation-duration"],
  ["animation-timing-function", "animation-timing-function"],
  ["animation-delay", "animation-delay"],
  ["animation-iteration-count", "animation-iteration-count"],
  ["animation-direction", "animation-direction"],
  ["animation-fill-mode", "animation-fill-mode"],
  ["animation-play-state", "animation-play-state"],

  // Will Change (Performance)
  ["will-change", "will-change"],
  ["contain", "contain"],
  ["content-visibility", "content-visibility"],
]);
