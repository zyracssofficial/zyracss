/**
 * ZyraCSS Spacing Properties Test Suite
 * Tests all spacing properties from spacing.js map with various value types
 */

import { zyra } from "../../src/index.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log("🎯 ZyraCSS Spacing Properties Test Suite");
console.log("=========================================\n");

/**
 * Test a spacing property with expected result
 */
function testProperty(
  className,
  shouldPass,
  description,
  category = "spacing"
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

console.log("📏 PADDING PROPERTIES");
console.log("====================");

// Padding - Full names with valid values
await testProperty("padding-[10px]", true, "Padding full name with pixels");
await testProperty("padding-[1rem]", true, "Padding full name with rem");
await testProperty("padding-[2em]", true, "Padding full name with em");
await testProperty("padding-[5%]", true, "Padding full name with percentage");
await testProperty("padding-[10px,20px]", true, "Padding with 2 values");
await testProperty(
  "padding-[5px,10px,15px,20px]",
  true,
  "Padding with 4 values"
);

// Padding - Short forms with valid values
await testProperty("p-[15px]", true, "Padding shorthand with pixels");
await testProperty("p-[1.5rem]", true, "Padding shorthand with decimal rem");
await testProperty("p-[0]", true, "Padding shorthand with zero");

// Padding directional - Full names
await testProperty("padding-top-[10px]", true, "Padding-top full name");
await testProperty("padding-right-[20px]", true, "Padding-right full name");
await testProperty("padding-bottom-[30px]", true, "Padding-bottom full name");
await testProperty("padding-left-[40px]", true, "Padding-left full name");

// Padding directional - Short forms
await testProperty("pt-[25px]", true, "Padding-top shorthand");
await testProperty("pr-[35px]", true, "Padding-right shorthand");
await testProperty("pb-[45px]", true, "Padding-bottom shorthand");
await testProperty("pl-[55px]", true, "Padding-left shorthand");

// Padding logical - Full names
await testProperty("padding-block-[10px]", true, "Padding-block full name");
await testProperty("padding-inline-[20px]", true, "Padding-inline full name");
await testProperty(
  "padding-block-start-[15px]",
  true,
  "Padding-block-start full name"
);
await testProperty(
  "padding-block-end-[25px]",
  true,
  "Padding-block-end full name"
);
await testProperty(
  "padding-inline-start-[35px]",
  true,
  "Padding-inline-start full name"
);
await testProperty(
  "padding-inline-end-[45px]",
  true,
  "Padding-inline-end full name"
);

// Padding logical - Short forms
await testProperty("py-[12px]", true, "Padding-block (py) shorthand");
await testProperty("px-[18px]", true, "Padding-inline (px) shorthand");

// Padding - Invalid values (should fail)
await testProperty(
  "padding-[-10px]",
  false,
  "Padding with negative value (invalid)"
);
await testProperty("p-[invalid]", false, "Padding with invalid keyword");
await testProperty("padding-[red]", false, "Padding with color (invalid)");
await testProperty(
  "p-[10px 20px]",
  false,
  "Padding with spaces (invalid syntax)"
);

console.log("📏 MARGIN PROPERTIES");
console.log("===================");

// Margin - Full names with valid values
await testProperty("margin-[10px]", true, "Margin full name with pixels");
await testProperty("margin-[auto]", true, "Margin full name with auto");
await testProperty("margin-[1rem]", true, "Margin full name with rem");
await testProperty("margin-[10px,20px]", true, "Margin with 2 values");
await testProperty("margin-[5px,10px,15px,20px]", true, "Margin with 4 values");

// Margin - Short forms with valid values
await testProperty("m-[15px]", true, "Margin shorthand with pixels");
await testProperty("m-[auto]", true, "Margin shorthand with auto");
await testProperty("m-[0]", true, "Margin shorthand with zero");

// Margin directional - Full names
await testProperty("margin-top-[10px]", true, "Margin-top full name");
await testProperty(
  "margin-right-[auto]",
  true,
  "Margin-right full name with auto"
);
await testProperty(
  "margin-bottom-[-5px]",
  true,
  "Margin-bottom full name with negative"
);
await testProperty("margin-left-[20px]", true, "Margin-left full name");

// Margin directional - Short forms
await testProperty("mt-[25px]", true, "Margin-top shorthand");
await testProperty("mr-[auto]", true, "Margin-right shorthand with auto");
await testProperty("mb-[-10px]", true, "Margin-bottom shorthand with negative");
await testProperty("ml-[30px]", true, "Margin-left shorthand");

// Margin logical - Full names
await testProperty("margin-block-[10px]", true, "Margin-block full name");
await testProperty(
  "margin-inline-[auto]",
  true,
  "Margin-inline full name with auto"
);
await testProperty(
  "margin-block-start-[15px]",
  true,
  "Margin-block-start full name"
);
await testProperty(
  "margin-block-end-[-5px]",
  true,
  "Margin-block-end full name with negative"
);
await testProperty(
  "margin-inline-start-[25px]",
  true,
  "Margin-inline-start full name"
);
await testProperty(
  "margin-inline-end-[35px]",
  true,
  "Margin-inline-end full name"
);

// Margin logical - Short forms
await testProperty("my-[12px]", true, "Margin-block (my) shorthand");
await testProperty("mx-[auto]", true, "Margin-inline (mx) shorthand with auto");

// Margin - Invalid values (should fail)
await testProperty("margin-[red]", false, "Margin with color (invalid)");
await testProperty("m-[display]", false, "Margin with display value (invalid)");

console.log("📏 GAP PROPERTIES");
console.log("================");

// Gap properties
await testProperty("gap-[10px]", true, "Gap with pixels");
await testProperty("gap-[1rem]", true, "Gap with rem");
await testProperty("gap-[20px,30px]", true, "Gap with 2 values");
await testProperty("row-gap-[15px]", true, "Row-gap with pixels");
await testProperty("column-gap-[25px]", true, "Column-gap with pixels");

// Gap - Invalid values
await testProperty("gap-[red]", false, "Gap with color (invalid)");
await testProperty("gap-[-10px]", false, "Gap with negative value (invalid)");

console.log("📏 INSET PROPERTIES");
console.log("==================");

// Inset properties (logical positioning)
await testProperty("inset-[10px]", true, "Inset with pixels");
await testProperty("inset-[auto]", true, "Inset with auto");
await testProperty("inset-block-[20px]", true, "Inset-block with pixels");
await testProperty("inset-inline-[30px]", true, "Inset-inline with pixels");
await testProperty(
  "inset-block-start-[15px]",
  true,
  "Inset-block-start with pixels"
);
await testProperty(
  "inset-block-end-[25px]",
  true,
  "Inset-block-end with pixels"
);
await testProperty(
  "inset-inline-start-[35px]",
  true,
  "Inset-inline-start with pixels"
);
await testProperty(
  "inset-inline-end-[45px]",
  true,
  "Inset-inline-end with pixels"
);

// Inset - Invalid values
await testProperty("inset-[red]", false, "Inset with color (invalid)");

console.log("🔬 COMPLEX & EDGE CASES");
console.log("=======================");

// CSS Functions
await testProperty(
  "padding-[calc(100%-10px)]",
  true,
  "Padding with calc function"
);
await testProperty("margin-[var(--spacing)]", true, "Margin with CSS variable");
await testProperty(
  "p-[clamp(10px,2vw,20px)]",
  true,
  "Padding with clamp function"
);

// Multiple complex values
await testProperty(
  "margin-[calc(50%-10px),auto]",
  true,
  "Margin with calc and auto"
);
await testProperty(
  "padding-[var(--pad-y),var(--pad-x)]",
  true,
  "Padding with multiple variables"
);

// Edge cases - should fail
await testProperty("p-[]", false, "Empty value in brackets");
await testProperty("padding-[", false, "Unclosed bracket");
await testProperty("margin-]10px[", false, "Reversed brackets");
await testProperty("p-[10px 20px]", false, "Spaces in bracket value (invalid)");

// Viewport units
await testProperty("padding-[10vh]", true, "Padding with viewport height");
await testProperty("margin-[5vw]", true, "Margin with viewport width");
await testProperty("gap-[2vmin]", true, "Gap with viewport minimum");
await testProperty("p-[3vmax]", true, "Padding with viewport maximum");

// Unicode/Security tests
await testProperty(
  "padding-[10♥]",
  false,
  "Padding with Unicode character (should fail)"
);
await testProperty(
  "margin-[javascript:alert(1)]",
  false,
  "Margin with dangerous content (should fail)"
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

console.log("\n🎯 SPACING CATEGORY ASSESSMENT");
console.log("==============================");
if (passedTests / totalTests >= 0.95) {
  console.log("🎉 Excellent! Spacing properties have robust support.");
} else if (passedTests / totalTests >= 0.85) {
  console.log("👍 Good! Most spacing properties work correctly.");
} else {
  console.log("⚠️  Needs improvement. Several spacing properties need fixes.");
}



