/**
 * ZyraCSS Sizing Properties Test Suite
 * Tests all sizing properties from sizing.js map with various value types
 */

import { zyraGenerateCSS } from "../../src/index.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log("🎯 ZyraCSS Sizing Properties Test Suite");
console.log("=======================================\n");

/**
 * Test a sizing property with expected result
 */
async function testProperty(
  className,
  shouldPass,
  description,
  category = "sizing"
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

console.log("📐 WIDTH PROPERTIES");
console.log("==================");

// Width - Full names
await testProperty("width-[100px]", true, "Width full name with pixels");
await testProperty("width-[50%]", true, "Width full name with percentage");
await testProperty("width-[10rem]", true, "Width full name with rem");
await testProperty("width-[5em]", true, "Width full name with em");
await testProperty(
  "width-[100vw]",
  true,
  "Width full name with viewport width"
);
await testProperty("width-[auto]", true, "Width full name with auto");
await testProperty(
  "width-[max-content]",
  true,
  "Width full name with max-content"
);
await testProperty(
  "width-[min-content]",
  true,
  "Width full name with min-content"
);
await testProperty(
  "width-[fit-content]",
  true,
  "Width full name with fit-content"
);

// Width - Short forms
await testProperty("w-[200px]", true, "Width shorthand with pixels");
await testProperty("w-[75%]", true, "Width shorthand with percentage");
await testProperty("w-[auto]", true, "Width shorthand with auto");
await testProperty("w-[100vw]", true, "Width shorthand with viewport width");

// Min-width - Full names
await testProperty(
  "min-width-[100px]",
  true,
  "Min-width full name with pixels"
);
await testProperty(
  "min-width-[50%]",
  true,
  "Min-width full name with percentage"
);
await testProperty("min-width-[0]", true, "Min-width full name with zero");
await testProperty("min-width-[auto]", true, "Min-width full name with auto");
await testProperty(
  "min-width-[max-content]",
  true,
  "Min-width full name with max-content"
);

// Min-width - Short forms
await testProperty("min-w-[150px]", true, "Min-width shorthand with pixels");
await testProperty("min-w-[25%]", true, "Min-width shorthand with percentage");
await testProperty("min-w-[0]", true, "Min-width shorthand with zero");

// Max-width - Full names
await testProperty(
  "max-width-[500px]",
  true,
  "Max-width full name with pixels"
);
await testProperty(
  "max-width-[100%]",
  true,
  "Max-width full name with percentage"
);
await testProperty("max-width-[none]", true, "Max-width full name with none");
await testProperty(
  "max-width-[80vw]",
  true,
  "Max-width full name with viewport width"
);

// Max-width - Short forms
await testProperty("max-w-[600px]", true, "Max-width shorthand with pixels");
await testProperty("max-w-[90%]", true, "Max-width shorthand with percentage");
await testProperty("max-w-[none]", true, "Max-width shorthand with none");

// Inline-size (logical width)
await testProperty("inline-size-[200px]", true, "Inline-size with pixels");
await testProperty("inline-size-[50%]", true, "Inline-size with percentage");
await testProperty("inline-size-[auto]", true, "Inline-size with auto");

// Width - Invalid values
await testProperty("width-[red]", false, "Width with color (invalid)");
await testProperty("w-[-100px]", false, "Width with negative value (invalid)");
await testProperty(
  "min-width-[-50px]",
  false,
  "Min-width with negative value (invalid)"
);

console.log("📏 HEIGHT PROPERTIES");
console.log("====================");

// Height - Full names
await testProperty("height-[200px]", true, "Height full name with pixels");
await testProperty(
  "height-[100vh]",
  true,
  "Height full name with viewport height"
);
await testProperty("height-[50%]", true, "Height full name with percentage");
await testProperty("height-[10rem]", true, "Height full name with rem");
await testProperty("height-[auto]", true, "Height full name with auto");
await testProperty(
  "height-[max-content]",
  true,
  "Height full name with max-content"
);
await testProperty(
  "height-[min-content]",
  true,
  "Height full name with min-content"
);

// Height - Short forms
await testProperty("h-[300px]", true, "Height shorthand with pixels");
await testProperty("h-[100vh]", true, "Height shorthand with viewport height");
await testProperty("h-[60%]", true, "Height shorthand with percentage");
await testProperty("h-[auto]", true, "Height shorthand with auto");

// Min-height - Full names
await testProperty(
  "min-height-[100px]",
  true,
  "Min-height full name with pixels"
);
await testProperty(
  "min-height-[50vh]",
  true,
  "Min-height full name with viewport height"
);
await testProperty("min-height-[0]", true, "Min-height full name with zero");
await testProperty("min-height-[auto]", true, "Min-height full name with auto");

// Min-height - Short forms
await testProperty("min-h-[150px]", true, "Min-height shorthand with pixels");
await testProperty(
  "min-h-[30vh]",
  true,
  "Min-height shorthand with viewport height"
);
await testProperty("min-h-[0]", true, "Min-height shorthand with zero");

// Max-height - Full names
await testProperty(
  "max-height-[500px]",
  true,
  "Max-height full name with pixels"
);
await testProperty(
  "max-height-[80vh]",
  true,
  "Max-height full name with viewport height"
);
await testProperty("max-height-[none]", true, "Max-height full name with none");

// Max-height - Short forms
await testProperty("max-h-[600px]", true, "Max-height shorthand with pixels");
await testProperty(
  "max-h-[90vh]",
  true,
  "Max-height shorthand with viewport height"
);
await testProperty("max-h-[none]", true, "Max-height shorthand with none");

// Block-size (logical height)
await testProperty("block-size-[300px]", true, "Block-size with pixels");
await testProperty(
  "block-size-[80vh]",
  true,
  "Block-size with viewport height"
);
await testProperty("block-size-[auto]", true, "Block-size with auto");

// Height - Invalid values
await testProperty("height-[blue]", false, "Height with color (invalid)");
await testProperty("h-[-200px]", false, "Height with negative value (invalid)");
await testProperty(
  "max-height-[-100px]",
  false,
  "Max-height with negative value (invalid)"
);

console.log("📦 BOX SIZING PROPERTIES");
console.log("========================");

// Box-sizing
await testProperty(
  "box-sizing-[content-box]",
  true,
  "Box-sizing with content-box"
);
await testProperty(
  "box-sizing-[border-box]",
  true,
  "Box-sizing with border-box"
);
await testProperty("box-sizing-[inherit]", true, "Box-sizing with inherit");

// Box-sizing - Invalid values
await testProperty(
  "box-sizing-[invalid]",
  false,
  "Box-sizing with invalid value"
);

console.log("🖼️  OBJECT PROPERTIES");
console.log("=====================");

// Object-fit
await testProperty("object-fit-[fill]", true, "Object-fit with fill");
await testProperty("object-fit-[contain]", true, "Object-fit with contain");
await testProperty("object-fit-[cover]", true, "Object-fit with cover");
await testProperty("object-fit-[none]", true, "Object-fit with none");
await testProperty(
  "object-fit-[scale-down]",
  true,
  "Object-fit with scale-down"
);

// Object-position
await testProperty(
  "object-position-[center]",
  true,
  "Object-position with center"
);
await testProperty("object-position-[top]", true, "Object-position with top");
await testProperty("object-position-[left]", true, "Object-position with left");
await testProperty(
  "object-position-[50%,50%]",
  true,
  "Object-position with coordinates"
);
await testProperty(
  "object-position-[10px,20px]",
  true,
  "Object-position with pixel coordinates"
);

// Object - Invalid values
await testProperty(
  "object-fit-[invalid]",
  false,
  "Object-fit with invalid value"
);

console.log("📐 ASPECT RATIO PROPERTIES");
console.log("==========================");

// Aspect-ratio
await testProperty("aspect-ratio-[16/9]", true, "Aspect-ratio with 16:9");
await testProperty("aspect-ratio-[4/3]", true, "Aspect-ratio with 4:3");
await testProperty(
  "aspect-ratio-[1/1]",
  true,
  "Aspect-ratio with 1:1 (square)"
);
await testProperty("aspect-ratio-[auto]", true, "Aspect-ratio with auto");
await testProperty("aspect-ratio-[1.5]", true, "Aspect-ratio with decimal");
await testProperty("aspect-ratio-[2]", true, "Aspect-ratio with number");

// Aspect-ratio - Invalid values
await testProperty(
  "aspect-ratio-[invalid]",
  false,
  "Aspect-ratio with invalid value"
);
await testProperty(
  "aspect-ratio-[16:9]",
  false,
  "Aspect-ratio with colon (should use slash)"
);

console.log("🔬 COMPLEX & EDGE CASES");
console.log("=======================");

// CSS Functions
await testProperty("width-[calc(100%-20px)]", true, "Width with calc function");
await testProperty(
  "height-[calc(100vh-100px)]",
  true,
  "Height with calc function"
);
await testProperty(
  "max-width-[min(500px,90vw)]",
  true,
  "Max-width with min function"
);
await testProperty(
  "min-height-[max(200px,30vh)]",
  true,
  "Min-height with max function"
);
await testProperty(
  "w-[clamp(200px,50vw,800px)]",
  true,
  "Width with clamp function"
);

// CSS Variables
await testProperty(
  "width-[var(--container-width)]",
  true,
  "Width with CSS variable"
);
await testProperty(
  "height-[var(--header-height,60px)]",
  true,
  "Height with CSS variable and fallback"
);
await testProperty(
  "max-w-[var(--max-content-width)]",
  true,
  "Max-width with CSS variable"
);

// Viewport units
await testProperty("width-[100vw]", true, "Width with viewport width");
await testProperty("height-[100vh]", true, "Height with viewport height");
await testProperty("w-[50vmin]", true, "Width with viewport minimum");
await testProperty("h-[75vmax]", true, "Height with viewport maximum");

// Container query units (newer CSS)
await testProperty("width-[50cqw]", true, "Width with container query width");
await testProperty(
  "height-[30cqh]",
  true,
  "Height with container query height"
);

// Intrinsic sizing keywords
await testProperty("width-[max-content]", true, "Width with max-content");
await testProperty(
  "min-width-[min-content]",
  true,
  "Min-width with min-content"
);
await testProperty(
  "max-width-[fit-content(300px)]",
  true,
  "Max-width with fit-content function"
);

// Multiple aspect ratios (newer browsers)
await testProperty(
  "aspect-ratio-[auto,16/9]",
  true,
  "Aspect-ratio with auto fallback"
);

// Edge cases - should fail
await testProperty("width-[]", false, "Empty width value");
await testProperty("height-[", false, "Unclosed bracket");
await testProperty("w-]100px[", false, "Reversed brackets");
await testProperty(
  "h-[100px 200px]",
  false,
  "Spaces in bracket value (invalid)"
);

// Invalid sizing values
await testProperty(
  "width-[display]",
  false,
  "Width with display value (invalid)"
);
await testProperty(
  "height-[flex]",
  false,
  "Height with layout value (invalid)"
);
await testProperty(
  "box-sizing-[100px]",
  false,
  "Box-sizing with measurement (invalid)"
);

// Unicode/Security tests
await testProperty(
  "width-[100♥]",
  false,
  "Width with Unicode character (should fail)"
);
await testProperty(
  "height-[javascript:alert(1)]",
  false,
  "Height with dangerous content (should fail)"
);

// Very small and large values
await testProperty("width-[0.1px]", true, "Width with very small value");
await testProperty("height-[9999px]", true, "Height with very large value");
await testProperty(
  "max-width-[999999px]",
  true,
  "Max-width with extremely large value"
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

console.log("\n🎯 SIZING CATEGORY ASSESSMENT");
console.log("=============================");
if (passedTests / totalTests >= 0.95) {
  console.log("🎉 Excellent! Sizing properties have robust support.");
} else if (passedTests / totalTests >= 0.85) {
  console.log("👍 Good! Most sizing properties work correctly.");
} else {
  console.log("⚠️  Needs improvement. Several sizing properties need fixes.");
}
