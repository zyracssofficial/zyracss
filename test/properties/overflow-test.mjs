/**
 * ZyraCSS Overflow Properties Test Suite
 * Tests all overflow properties from overflow.js map with various value types
 */

import { zyraGenerateCSS } from "../../src/index.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log("📦 ZyraCSS Overflow Properties Test Suite");
console.log("==========================================\n");

/**
 * Test an overflow property with expected result
 */
async function testProperty(
  className,
  shouldPass,
  description,
  category = "overflow"
) {
  totalTests++;

  try {
    const result = await zyraGenerateCSS([className]);
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

console.log("🌊 BASIC OVERFLOW PROPERTIES");
console.log("============================");

// Overflow
await testProperty("overflow-[visible]", true, "Overflow with visible");
await testProperty("overflow-[hidden]", true, "Overflow with hidden");
await testProperty("overflow-[scroll]", true, "Overflow with scroll");
await testProperty("overflow-[auto]", true, "Overflow with auto");
await testProperty("overflow-[clip]", true, "Overflow with clip");

// Overflow-x
await testProperty("overflow-x-[visible]", true, "Overflow-x with visible");
await testProperty("overflow-x-[hidden]", true, "Overflow-x with hidden");
await testProperty("overflow-x-[scroll]", true, "Overflow-x with scroll");
await testProperty("overflow-x-[auto]", true, "Overflow-x with auto");
await testProperty("overflow-x-[clip]", true, "Overflow-x with clip");

// Overflow-y
await testProperty("overflow-y-[visible]", true, "Overflow-y with visible");
await testProperty("overflow-y-[hidden]", true, "Overflow-y with hidden");
await testProperty("overflow-y-[scroll]", true, "Overflow-y with scroll");
await testProperty("overflow-y-[auto]", true, "Overflow-y with auto");
await testProperty("overflow-y-[clip]", true, "Overflow-y with clip");

console.log("🎯 ADVANCED OVERFLOW PROPERTIES");
console.log("===============================");

// Overflow-anchor
await testProperty("overflow-anchor-[auto]", true, "Overflow-anchor with auto");
await testProperty("overflow-anchor-[none]", true, "Overflow-anchor with none");

// Overflow-block
await testProperty(
  "overflow-block-[visible]",
  true,
  "Overflow-block with visible"
);
await testProperty(
  "overflow-block-[hidden]",
  true,
  "Overflow-block with hidden"
);
await testProperty(
  "overflow-block-[scroll]",
  true,
  "Overflow-block with scroll"
);
await testProperty("overflow-block-[auto]", true, "Overflow-block with auto");
await testProperty("overflow-block-[clip]", true, "Overflow-block with clip");

// Overflow-inline
await testProperty(
  "overflow-inline-[visible]",
  true,
  "Overflow-inline with visible"
);
await testProperty(
  "overflow-inline-[hidden]",
  true,
  "Overflow-inline with hidden"
);
await testProperty(
  "overflow-inline-[scroll]",
  true,
  "Overflow-inline with scroll"
);
await testProperty("overflow-inline-[auto]", true, "Overflow-inline with auto");
await testProperty("overflow-inline-[clip]", true, "Overflow-inline with clip");

// Overflow-wrap
await testProperty("overflow-wrap-[normal]", true, "Overflow-wrap with normal");
await testProperty(
  "overflow-wrap-[break-word]",
  true,
  "Overflow-wrap with break-word"
);
await testProperty(
  "overflow-wrap-[anywhere]",
  true,
  "Overflow-wrap with anywhere"
);

console.log("🎳 SCROLL BEHAVIOR PROPERTIES");
console.log("=============================");

// Scroll-behavior
await testProperty("scroll-behavior-[auto]", true, "Scroll-behavior with auto");
await testProperty(
  "scroll-behavior-[smooth]",
  true,
  "Scroll-behavior with smooth"
);

console.log("📏 SCROLL MARGIN PROPERTIES");
console.log("============================");

// Scroll-margin (shorthand)
await testProperty("scroll-margin-[0]", true, "Scroll-margin with zero");
await testProperty(
  "scroll-margin-[10px]",
  true,
  "Scroll-margin with single pixel value"
);
await testProperty(
  "scroll-margin-[10px,20px]",
  true,
  "Scroll-margin with horizontal and vertical"
);
await testProperty(
  "scroll-margin-[5px,10px,15px,20px]",
  true,
  "Scroll-margin with four values"
);
await testProperty("scroll-margin-[1em]", true, "Scroll-margin with em unit");
await testProperty("scroll-margin-[5%]", true, "Scroll-margin with percentage");
await testProperty("scroll-margin-[auto]", true, "Scroll-margin with auto");

// Scroll-margin individual sides
await testProperty(
  "scroll-margin-top-[10px]",
  true,
  "Scroll-margin-top with pixels"
);
await testProperty(
  "scroll-margin-right-[20px]",
  true,
  "Scroll-margin-right with pixels"
);
await testProperty(
  "scroll-margin-bottom-[15px]",
  true,
  "Scroll-margin-bottom with pixels"
);
await testProperty(
  "scroll-margin-left-[25px]",
  true,
  "Scroll-margin-left with pixels"
);

// Scroll-margin logical properties
await testProperty(
  "scroll-margin-block-[10px]",
  true,
  "Scroll-margin-block with pixels"
);
await testProperty(
  "scroll-margin-block-start-[5px]",
  true,
  "Scroll-margin-block-start with pixels"
);
await testProperty(
  "scroll-margin-block-end-[5px]",
  true,
  "Scroll-margin-block-end with pixels"
);
await testProperty(
  "scroll-margin-inline-[15px]",
  true,
  "Scroll-margin-inline with pixels"
);
await testProperty(
  "scroll-margin-inline-start-[8px]",
  true,
  "Scroll-margin-inline-start with pixels"
);
await testProperty(
  "scroll-margin-inline-end-[12px]",
  true,
  "Scroll-margin-inline-end with pixels"
);

console.log("🔲 SCROLL PADDING PROPERTIES");
console.log("=============================");

// Scroll-padding (shorthand)
await testProperty("scroll-padding-[0]", true, "Scroll-padding with zero");
await testProperty(
  "scroll-padding-[10px]",
  true,
  "Scroll-padding with single pixel value"
);
await testProperty(
  "scroll-padding-[10px,20px]",
  true,
  "Scroll-padding with horizontal and vertical"
);
await testProperty(
  "scroll-padding-[5px,10px,15px,20px]",
  true,
  "Scroll-padding with four values"
);
await testProperty("scroll-padding-[1em]", true, "Scroll-padding with em unit");
await testProperty(
  "scroll-padding-[5%]",
  true,
  "Scroll-padding with percentage"
);
await testProperty("scroll-padding-[auto]", true, "Scroll-padding with auto");

// Scroll-padding individual sides
await testProperty(
  "scroll-padding-top-[10px]",
  true,
  "Scroll-padding-top with pixels"
);
await testProperty(
  "scroll-padding-right-[20px]",
  true,
  "Scroll-padding-right with pixels"
);
await testProperty(
  "scroll-padding-bottom-[15px]",
  true,
  "Scroll-padding-bottom with pixels"
);
await testProperty(
  "scroll-padding-left-[25px]",
  true,
  "Scroll-padding-left with pixels"
);

// Scroll-padding logical properties
await testProperty(
  "scroll-padding-block-[10px]",
  true,
  "Scroll-padding-block with pixels"
);
await testProperty(
  "scroll-padding-block-start-[5px]",
  true,
  "Scroll-padding-block-start with pixels"
);
await testProperty(
  "scroll-padding-block-end-[5px]",
  true,
  "Scroll-padding-block-end with pixels"
);
await testProperty(
  "scroll-padding-inline-[15px]",
  true,
  "Scroll-padding-inline with pixels"
);
await testProperty(
  "scroll-padding-inline-start-[8px]",
  true,
  "Scroll-padding-inline-start with pixels"
);
await testProperty(
  "scroll-padding-inline-end-[12px]",
  true,
  "Scroll-padding-inline-end with pixels"
);

console.log("📸 SCROLL SNAP PROPERTIES");
console.log("=========================");

// Scroll-snap-type
await testProperty(
  "scroll-snap-type-[none]",
  true,
  "Scroll-snap-type with none"
);
await testProperty(
  "scroll-snap-type-[x,mandatory]",
  true,
  "Scroll-snap-type with x mandatory"
);
await testProperty(
  "scroll-snap-type-[y,mandatory]",
  true,
  "Scroll-snap-type with y mandatory"
);
await testProperty(
  "scroll-snap-type-[block,mandatory]",
  true,
  "Scroll-snap-type with block mandatory"
);
await testProperty(
  "scroll-snap-type-[inline,mandatory]",
  true,
  "Scroll-snap-type with inline mandatory"
);
await testProperty(
  "scroll-snap-type-[both,mandatory]",
  true,
  "Scroll-snap-type with both mandatory"
);
await testProperty(
  "scroll-snap-type-[x,proximity]",
  true,
  "Scroll-snap-type with x proximity"
);
await testProperty(
  "scroll-snap-type-[y,proximity]",
  true,
  "Scroll-snap-type with y proximity"
);

// Scroll-snap-align
await testProperty(
  "scroll-snap-align-[none]",
  true,
  "Scroll-snap-align with none"
);
await testProperty(
  "scroll-snap-align-[start]",
  true,
  "Scroll-snap-align with start"
);
await testProperty(
  "scroll-snap-align-[end]",
  true,
  "Scroll-snap-align with end"
);
await testProperty(
  "scroll-snap-align-[center]",
  true,
  "Scroll-snap-align with center"
);
await testProperty(
  "scroll-snap-align-[start,center]",
  true,
  "Scroll-snap-align with start center"
);

// Scroll-snap-stop
await testProperty(
  "scroll-snap-stop-[normal]",
  true,
  "Scroll-snap-stop with normal"
);
await testProperty(
  "scroll-snap-stop-[always]",
  true,
  "Scroll-snap-stop with always"
);

console.log("🎨 SCROLLBAR STYLING PROPERTIES");
console.log("===============================");

// Scrollbar-width
await testProperty("scrollbar-width-[auto]", true, "Scrollbar-width with auto");
await testProperty("scrollbar-width-[thin]", true, "Scrollbar-width with thin");
await testProperty("scrollbar-width-[none]", true, "Scrollbar-width with none");

// Scrollbar-color
await testProperty("scrollbar-color-[auto]", true, "Scrollbar-color with auto");
await testProperty(
  "scrollbar-color-[red,blue]",
  true,
  "Scrollbar-color with thumb and track colors"
);
await testProperty(
  "scrollbar-color-[#ff0000,#0000ff]",
  true,
  "Scrollbar-color with hex colors"
);
await testProperty(
  "scrollbar-color-[rgba(255,0,0,0.5),rgba(0,0,255,0.5)]",
  true,
  "Scrollbar-color with rgba colors"
);

// Scrollbar-gutter
await testProperty(
  "scrollbar-gutter-[auto]",
  true,
  "Scrollbar-gutter with auto"
);
await testProperty(
  "scrollbar-gutter-[stable]",
  true,
  "Scrollbar-gutter with stable"
);
await testProperty(
  "scrollbar-gutter-[stable,both-edges]",
  true,
  "Scrollbar-gutter with stable both-edges"
);

console.log("🔬 COMPLEX & EDGE CASES");
console.log("=======================");

// CSS Functions
await testProperty(
  "scroll-margin-[calc(10px+5px)]",
  true,
  "Scroll-margin with calc function"
);
await testProperty(
  "scroll-padding-[min(20px,5%)]",
  true,
  "Scroll-padding with min function"
);
await testProperty(
  "scroll-margin-top-[max(10px,1em)]",
  true,
  "Scroll-margin-top with max function"
);

// CSS Variables
await testProperty(
  "overflow-[var(--overflow)]",
  true,
  "Overflow with CSS variable"
);
await testProperty(
  "scroll-behavior-[var(--scroll-behavior,smooth)]",
  true,
  "Scroll-behavior with variable and fallback"
);
await testProperty(
  "scroll-margin-[var(--margin,10px)]",
  true,
  "Scroll-margin with variable"
);

// Multiple values and complex cases
await testProperty(
  "scroll-snap-type-[var(--axis,x),var(--strictness,mandatory)]",
  true,
  "Scroll-snap-type with variables"
);
await testProperty(
  "scrollbar-color-[var(--thumb-color),var(--track-color)]",
  true,
  "Scrollbar-color with variables"
);

// Mathematical precision
await testProperty(
  "scroll-margin-[10.123456px]",
  true,
  "Scroll-margin with high precision"
);
await testProperty(
  "scroll-padding-[0.5rem]",
  true,
  "Scroll-padding with decimal rem"
);

// Edge cases - should fail
await testProperty("overflow-[]", false, "Empty overflow value");
await testProperty("scroll-margin-[", false, "Unclosed bracket");
await testProperty("scroll-padding-]10px[", false, "Reversed brackets");
await testProperty(
  "scroll-behavior-[10px 20px]",
  false,
  "Spaces in bracket value (invalid)"
);

// Invalid values
await testProperty("overflow-[invalid]", false, "Overflow with invalid value");
await testProperty(
  "scroll-behavior-[red]",
  false,
  "Scroll-behavior with color (invalid)"
);
await testProperty(
  "scroll-margin-[very-large]",
  false,
  "Scroll-margin with invalid keyword"
);
await testProperty(
  "scrollbar-width-[50px]",
  false,
  "Scrollbar-width with pixel value (invalid)"
);

// Unicode/Security tests
await testProperty(
  "overflow-[hidden♥]",
  false,
  "Overflow with Unicode character (should fail)"
);
await testProperty(
  "scroll-behavior-[javascript:alert(1)]",
  false,
  "Scroll-behavior with dangerous content (should fail)"
);

// Negative values where inappropriate
await testProperty(
  "scroll-padding-[-10px]",
  false,
  "Scroll-padding with negative value (invalid)"
);
await testProperty(
  "scrollbar-width-[-5px]",
  false,
  "Scrollbar-width with negative value (invalid)"
);

// Performance considerations
await testProperty(
  "overflow-[hidden]",
  true,
  "Overflow hidden for performance optimization"
);
await testProperty(
  "scroll-behavior-[auto]",
  true,
  "Scroll-behavior auto for default performance"
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

console.log("\n📦 OVERFLOW CATEGORY ASSESSMENT");
console.log("===============================");
if (passedTests / totalTests >= 0.95) {
  console.log("🎉 Excellent! Overflow properties have robust support.");
} else if (passedTests / totalTests >= 0.85) {
  console.log("👍 Good! Most overflow properties work correctly.");
} else {
  console.log("⚠️  Needs improvement. Several overflow properties need fixes.");
}
