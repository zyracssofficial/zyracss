/**
 * ZyraCSS Interactive Properties Test Suite
 * Tests all interactive properties from interactive.js map with various value types
 */

import { zyra } from "../../src/index.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log("🖱️  ZyraCSS Interactive Properties Test Suite");
console.log("=============================================\n");

/**
 * Test an interactive property with expected result
 */
function testProperty(
  className,
  shouldPass,
  description,
  category = "interactive"
) {
  totalTests++;

  try {
    const result = zyra.generate([className]);
    const hasCSS = !!(
      result.success &&
      result.data.css &&
      result.data.css.trim().length > 0
    );
    const hasErrors =
      !result.success ||
      (result.data.invalid && result.data.invalid.length > 0);

    const actuallyPassed = hasCSS && !hasErrors;

    if (actuallyPassed === shouldPass) {
      console.log(`✅ ${description}`);
      if (actuallyPassed) {
        console.log(`   → ${result.data.css.trim()}`);
      }
      passedTests++;
    } else {
      console.log(
        `❌ ${description} (expected ${shouldPass ? "pass" : "fail"} but ${actuallyPassed ? "passed" : "failed"})`
      );
      if (hasErrors && result.data.invalid) {
        console.log(
          `   → Errors: ${result.data.invalid.map((e) => e.message || e.reason || e).join(", ")}`
        );
      }
      if (!result.success && result.error) {
        console.log(`   → Error: ${result.error.message}`);
      }
      failedTests++;
    }
  } catch (error) {
    console.log(`❌ ${description} (threw error: ${error.message})`);
    failedTests++;
  }

  console.log("");
}

console.log("🖱️  CURSOR PROPERTIES");
console.log("====================");

// Basic cursor values
await testProperty("cursor-[auto]", true, "Cursor with auto");
await testProperty("cursor-[default]", true, "Cursor with default");
await testProperty("cursor-[pointer]", true, "Cursor with pointer");
await testProperty("cursor-[crosshair]", true, "Cursor with crosshair");
await testProperty("cursor-[move]", true, "Cursor with move");
await testProperty("cursor-[text]", true, "Cursor with text");
await testProperty("cursor-[wait]", true, "Cursor with wait");
await testProperty("cursor-[help]", true, "Cursor with help");

// Resize cursors
await testProperty("cursor-[n-resize]", true, "Cursor with n-resize");
await testProperty("cursor-[ne-resize]", true, "Cursor with ne-resize");
await testProperty("cursor-[e-resize]", true, "Cursor with e-resize");
await testProperty("cursor-[se-resize]", true, "Cursor with se-resize");
await testProperty("cursor-[s-resize]", true, "Cursor with s-resize");
await testProperty("cursor-[sw-resize]", true, "Cursor with sw-resize");
await testProperty("cursor-[w-resize]", true, "Cursor with w-resize");
await testProperty("cursor-[nw-resize]", true, "Cursor with nw-resize");

// Advanced cursor values
await testProperty("cursor-[col-resize]", true, "Cursor with col-resize");
await testProperty("cursor-[row-resize]", true, "Cursor with row-resize");
await testProperty("cursor-[all-scroll]", true, "Cursor with all-scroll");
await testProperty("cursor-[zoom-in]", true, "Cursor with zoom-in");
await testProperty("cursor-[zoom-out]", true, "Cursor with zoom-out");
await testProperty("cursor-[grab]", true, "Cursor with grab");
await testProperty("cursor-[grabbing]", true, "Cursor with grabbing");

// Not-allowed and progress
await testProperty("cursor-[not-allowed]", true, "Cursor with not-allowed");
await testProperty("cursor-[progress]", true, "Cursor with progress");
await testProperty("cursor-[copy]", true, "Cursor with copy");
await testProperty("cursor-[alias]", true, "Cursor with alias");
await testProperty("cursor-[context-menu]", true, "Cursor with context-menu");
await testProperty("cursor-[cell]", true, "Cursor with cell");
await testProperty("cursor-[vertical-text]", true, "Cursor with vertical-text");

// Custom cursor (URL)
await testProperty(
  "cursor-[u(cursor.cur),auto]", // Updated to u() syntax
  true,
  "Cursor with custom URL and fallback"
);
await testProperty(
  "cursor-[u(hand.png),pointer]", // Updated to u() syntax
  true,
  "Cursor with PNG URL and fallback"
);

// None cursor
await testProperty("cursor-[none]", true, "Cursor with none");

console.log("🎯 POINTER EVENTS PROPERTIES");
console.log("============================");

// Pointer-events
await testProperty("pointer-events-[auto]", true, "Pointer-events with auto");
await testProperty("pointer-events-[none]", true, "Pointer-events with none");
await testProperty(
  "pointer-events-[visiblePainted]",
  true,
  "Pointer-events with visiblePainted"
);
await testProperty(
  "pointer-events-[visibleFill]",
  true,
  "Pointer-events with visibleFill"
);
await testProperty(
  "pointer-events-[visibleStroke]",
  true,
  "Pointer-events with visibleStroke"
);
await testProperty(
  "pointer-events-[visible]",
  true,
  "Pointer-events with visible"
);
await testProperty(
  "pointer-events-[painted]",
  true,
  "Pointer-events with painted"
);
await testProperty("pointer-events-[fill]", true, "Pointer-events with fill");
await testProperty(
  "pointer-events-[stroke]",
  true,
  "Pointer-events with stroke"
);
await testProperty("pointer-events-[all]", true, "Pointer-events with all");

console.log("👆 TOUCH ACTION PROPERTIES");
console.log("===========================");

// Touch-action
await testProperty("touch-action-[auto]", true, "Touch-action with auto");
await testProperty("touch-action-[none]", true, "Touch-action with none");
await testProperty("touch-action-[pan-x]", true, "Touch-action with pan-x");
await testProperty("touch-action-[pan-y]", true, "Touch-action with pan-y");
await testProperty(
  "touch-action-[pan-left]",
  true,
  "Touch-action with pan-left"
);
await testProperty(
  "touch-action-[pan-right]",
  true,
  "Touch-action with pan-right"
);
await testProperty("touch-action-[pan-up]", true, "Touch-action with pan-up");
await testProperty(
  "touch-action-[pan-down]",
  true,
  "Touch-action with pan-down"
);
await testProperty(
  "touch-action-[pinch-zoom]",
  true,
  "Touch-action with pinch-zoom"
);
await testProperty(
  "touch-action-[manipulation]",
  true,
  "Touch-action with manipulation"
);

// Multiple touch-action values
await testProperty(
  "touch-action-[pan-x,pan-y]",
  true,
  "Touch-action with pan-x and pan-y"
);
await testProperty(
  "touch-action-[pan-x,pinch-zoom]",
  true,
  "Touch-action with pan-x and pinch-zoom"
);

console.log("📝 USER SELECT PROPERTIES");
console.log("=========================");

// User-select
await testProperty("user-select-[auto]", true, "User-select with auto");
await testProperty("user-select-[text]", true, "User-select with text");
await testProperty("user-select-[none]", true, "User-select with none");
await testProperty("user-select-[contain]", true, "User-select with contain");
await testProperty("user-select-[all]", true, "User-select with all");

console.log("📐 RESIZE PROPERTIES");
console.log("====================");

// Resize
await testProperty("resize-[none]", true, "Resize with none");
await testProperty("resize-[both]", true, "Resize with both");
await testProperty("resize-[horizontal]", true, "Resize with horizontal");
await testProperty("resize-[vertical]", true, "Resize with vertical");
await testProperty("resize-[block]", true, "Resize with block");
await testProperty("resize-[inline]", true, "Resize with inline");

console.log("🎨 CARET PROPERTIES");
console.log("===================");

// Caret-color
await testProperty("caret-color-[auto]", true, "Caret-color with auto");
await testProperty(
  "caret-color-[transparent]",
  true,
  "Caret-color with transparent"
);
await testProperty("caret-color-[red]", true, "Caret-color with red");
await testProperty("caret-color-[#ff0000]", true, "Caret-color with hex");
await testProperty("caret-color-[rgb(255,0,0)]", true, "Caret-color with rgb");
await testProperty(
  "caret-color-[rgba(255,0,0,0.5)]",
  true,
  "Caret-color with rgba"
);
await testProperty(
  "caret-color-[hsl(0,100%,50%)]",
  true,
  "Caret-color with hsl"
);
await testProperty(
  "caret-color-[hsla(0,100%,50%,0.5)]",
  true,
  "Caret-color with hsla"
);

console.log("🎭 ACCENT COLOR PROPERTIES");
console.log("===========================");

// Accent-color
await testProperty("accent-color-[auto]", true, "Accent-color with auto");
await testProperty("accent-color-[blue]", true, "Accent-color with blue");
await testProperty("accent-color-[#0066cc]", true, "Accent-color with hex");
await testProperty(
  "accent-color-[rgb(0,102,204)]",
  true,
  "Accent-color with rgb"
);
await testProperty(
  "accent-color-[rgba(0,102,204,0.8)]",
  true,
  "Accent-color with rgba"
);
await testProperty(
  "accent-color-[hsl(210,100%,40%)]",
  true,
  "Accent-color with hsl"
);
await testProperty(
  "accent-color-[hsla(210,100%,40%,0.8)]",
  true,
  "Accent-color with hsla"
);

console.log("🎪 APPEARANCE PROPERTIES");
console.log("========================");

// Appearance
await testProperty("appearance-[none]", true, "Appearance with none");
await testProperty("appearance-[auto]", true, "Appearance with auto");
await testProperty(
  "appearance-[menulist-button]",
  true,
  "Appearance with menulist-button"
);
await testProperty("appearance-[textfield]", true, "Appearance with textfield");
await testProperty("appearance-[button]", true, "Appearance with button");
await testProperty("appearance-[checkbox]", true, "Appearance with checkbox");
await testProperty("appearance-[radio]", true, "Appearance with radio");
await testProperty(
  "appearance-[searchfield]",
  true,
  "Appearance with searchfield"
);
await testProperty("appearance-[textarea]", true, "Appearance with textarea");

console.log("🔬 COMPLEX & EDGE CASES");
console.log("=======================");

// CSS Functions in color properties
await testProperty(
  "caret-color-[var(--caret-color)]",
  true,
  "Caret-color with CSS variable"
);
await testProperty(
  "accent-color-[var(--accent,blue)]",
  true,
  "Accent-color with variable and fallback"
);

// Complex cursor with multiple fallbacks
await testProperty(
  "cursor-[u(custom.cur),u(fallback.cur),pointer]", // Updated to u() syntax
  true,
  "Cursor with multiple URLs and fallback"
);

// Touch-action combinations
await testProperty(
  "touch-action-[pan-left,pan-right,pinch-zoom]",
  true,
  "Touch-action with multiple values"
);

// CSS color functions - removed unsupported functions (color-mix, light-dark not in ZyraCSS v1.0.0 scope)

// Mathematical precision
await testProperty(
  "caret-color-[rgba(255,128,64,0.123456)]",
  true,
  "Caret-color with high precision alpha"
);

// Edge cases - should fail
await testProperty("cursor-[]", false, "Empty cursor value");
await testProperty("pointer-events-[", false, "Unclosed bracket");
await testProperty("user-select-]text[", false, "Reversed brackets");
await testProperty(
  "resize-[10px 20px]",
  false,
  "Spaces in bracket value (invalid)"
);

// Invalid values
await testProperty(
  "cursor-[invalid-cursor]",
  false,
  "Cursor with invalid value"
);
await testProperty(
  "pointer-events-[maybe]",
  false,
  "Pointer-events with invalid value"
);
await testProperty(
  "user-select-[sometimes]",
  false,
  "User-select with invalid value"
);
await testProperty("resize-[diagonal]", false, "Resize with invalid value");
await testProperty(
  "touch-action-[swipe]",
  false,
  "Touch-action with invalid value"
);

// Invalid color values
await testProperty(
  "caret-color-[notacolor]",
  false,
  "Caret-color with invalid color"
);
await testProperty(
  "accent-color-[#gggggg]",
  false,
  "Accent-color with invalid hex"
);

// Unicode/Security tests
await testProperty(
  "cursor-[pointer♥]",
  false,
  "Cursor with Unicode character (should fail)"
);
await testProperty(
  "user-select-[javascript:alert(1)]",
  false,
  "User-select with dangerous content (should fail)"
);

// URL injection attempts
await testProperty(
  "cursor-[u(javascript:alert(1)),pointer]", // Updated to u() syntax
  false,
  "Cursor with JavaScript URL (should fail)"
);

// Performance considerations
await testProperty(
  "pointer-events-[none]",
  true,
  "Pointer-events none for performance"
);
await testProperty(
  "user-select-[none]",
  true,
  "User-select none for UI elements"
);

console.log("📊 TEST RESULTS SUMMARY");
console.log("=======================");
console.log(`Total tests: ${totalTests}`);
console.log(
  `✅ Passed: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`
);
console.log(
  `❌ Failed: ${failedTests} (${((failedTests / totalTests) * 100).toFixed(1)}%)`
);

console.log("\n🖱️  INTERACTIVE CATEGORY ASSESSMENT");
console.log("===================================");
if (passedTests / totalTests >= 0.95) {
  console.log("🎉 Excellent! Interactive properties have robust support.");
} else if (passedTests / totalTests >= 0.85) {
  console.log("👍 Good! Most interactive properties work correctly.");
} else {
  console.log(
    "⚠️  Needs improvement. Several interactive properties need fixes."
  );
}



