/**
 * ZyraCSS Border Properties Test Suite
 * Tests all border properties from borders.js map with various value types
 */

import { zyraGenerateCSS } from "../../src/index.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log("🎯 ZyraCSS Border Properties Test Suite");
console.log("=======================================\n");

/**
 * Test a border property with expected result
 */
async function testProperty(
  className,
  shouldPass,
  description,
  category = "borders"
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

console.log("🔲 BORDER SHORTHAND PROPERTIES");
console.log("==============================");

// Border - Full names
await testProperty(
  "border-[1px,solid,black]",
  true,
  "Border full name with width style color"
);
await testProperty(
  "border-[2px,dashed,red]",
  true,
  "Border full name with dashed red"
);
await testProperty(
  "border-[thin,solid,blue]",
  true,
  "Border full name with thin blue"
);
await testProperty(
  "border-[medium,dotted,green]",
  true,
  "Border full name with medium dotted"
);
await testProperty("border-[none]", true, "Border full name with none");

// Border - Short forms
await testProperty(
  "b-[1px,solid,black]",
  true,
  "Border shorthand with width style color"
);
await testProperty(
  "b-[3px,double,purple]",
  true,
  "Border shorthand with double purple"
);
await testProperty(
  "b-[thick,groove,gray]",
  true,
  "Border shorthand with thick groove"
);

console.log("📏 BORDER WIDTH PROPERTIES");
console.log("===========================");

// Border-width - Full names
await testProperty(
  "border-width-[1px]",
  true,
  "Border-width full name with pixels"
);
await testProperty(
  "border-width-[thin]",
  true,
  "Border-width full name with thin"
);
await testProperty(
  "border-width-[medium]",
  true,
  "Border-width full name with medium"
);
await testProperty(
  "border-width-[thick]",
  true,
  "Border-width full name with thick"
);
await testProperty(
  "border-width-[0]",
  true,
  "Border-width full name with zero"
);

// Border-width directional
await testProperty(
  "border-top-width-[2px]",
  true,
  "Border-top-width with pixels"
);
await testProperty(
  "border-right-width-[thin]",
  true,
  "Border-right-width with thin"
);
await testProperty(
  "border-bottom-width-[medium]",
  true,
  "Border-bottom-width with medium"
);
await testProperty(
  "border-left-width-[thick]",
  true,
  "Border-left-width with thick"
);

// Border-width logical
await testProperty(
  "border-block-width-[1px]",
  true,
  "Border-block-width with pixels"
);
await testProperty(
  "border-block-start-width-[2px]",
  true,
  "Border-block-start-width with pixels"
);
await testProperty(
  "border-block-end-width-[3px]",
  true,
  "Border-block-end-width with pixels"
);
await testProperty(
  "border-inline-width-[1px]",
  true,
  "Border-inline-width with pixels"
);
await testProperty(
  "border-inline-start-width-[2px]",
  true,
  "Border-inline-start-width with pixels"
);
await testProperty(
  "border-inline-end-width-[3px]",
  true,
  "Border-inline-end-width with pixels"
);

// Border-width - Invalid values
await testProperty(
  "border-width-[-1px]",
  false,
  "Border-width with negative value (invalid)"
);
await testProperty(
  "border-width-[red]",
  false,
  "Border-width with color (invalid)"
);

console.log("🎨 BORDER STYLE PROPERTIES");
console.log("===========================");

// Border-style - Full names
await testProperty(
  "border-style-[solid]",
  true,
  "Border-style full name with solid"
);
await testProperty(
  "border-style-[dashed]",
  true,
  "Border-style full name with dashed"
);
await testProperty(
  "border-style-[dotted]",
  true,
  "Border-style full name with dotted"
);
await testProperty(
  "border-style-[double]",
  true,
  "Border-style full name with double"
);
await testProperty(
  "border-style-[groove]",
  true,
  "Border-style full name with groove"
);
await testProperty(
  "border-style-[ridge]",
  true,
  "Border-style full name with ridge"
);
await testProperty(
  "border-style-[inset]",
  true,
  "Border-style full name with inset"
);
await testProperty(
  "border-style-[outset]",
  true,
  "Border-style full name with outset"
);
await testProperty(
  "border-style-[none]",
  true,
  "Border-style full name with none"
);
await testProperty(
  "border-style-[hidden]",
  true,
  "Border-style full name with hidden"
);

// Border-style directional
await testProperty(
  "border-top-style-[solid]",
  true,
  "Border-top-style with solid"
);
await testProperty(
  "border-right-style-[dashed]",
  true,
  "Border-right-style with dashed"
);
await testProperty(
  "border-bottom-style-[dotted]",
  true,
  "Border-bottom-style with dotted"
);
await testProperty(
  "border-left-style-[double]",
  true,
  "Border-left-style with double"
);

// Border-style logical
await testProperty(
  "border-block-style-[solid]",
  true,
  "Border-block-style with solid"
);
await testProperty(
  "border-block-start-style-[dashed]",
  true,
  "Border-block-start-style with dashed"
);
await testProperty(
  "border-block-end-style-[dotted]",
  true,
  "Border-block-end-style with dotted"
);
await testProperty(
  "border-inline-style-[solid]",
  true,
  "Border-inline-style with solid"
);
await testProperty(
  "border-inline-start-style-[groove]",
  true,
  "Border-inline-start-style with groove"
);
await testProperty(
  "border-inline-end-style-[ridge]",
  true,
  "Border-inline-end-style with ridge"
);

// Border-style - Invalid values
await testProperty(
  "border-style-[invalid]",
  false,
  "Border-style with invalid value"
);
await testProperty(
  "border-style-[10px]",
  false,
  "Border-style with width value (invalid)"
);

console.log("🌈 BORDER RADIUS PROPERTIES");
console.log("============================");

// Border-radius - Full names
await testProperty(
  "border-radius-[10px]",
  true,
  "Border-radius full name with pixels"
);
await testProperty(
  "border-radius-[50%]",
  true,
  "Border-radius full name with percentage"
);
await testProperty(
  "border-radius-[1rem]",
  true,
  "Border-radius full name with rem"
);
await testProperty(
  "border-radius-[5px,10px]",
  true,
  "Border-radius with elliptical values"
);
await testProperty(
  "border-radius-[10px,15px,20px,25px]",
  true,
  "Border-radius with 4 values"
);

// Border-radius corners
await testProperty(
  "border-top-left-radius-[5px]",
  true,
  "Border-top-left-radius with pixels"
);
await testProperty(
  "border-top-right-radius-[10px]",
  true,
  "Border-top-right-radius with pixels"
);
await testProperty(
  "border-bottom-left-radius-[15px]",
  true,
  "Border-bottom-left-radius with pixels"
);
await testProperty(
  "border-bottom-right-radius-[20px]",
  true,
  "Border-bottom-right-radius with pixels"
);

// Logical border-radius
await testProperty(
  "border-start-start-radius-[8px]",
  true,
  "Border-start-start-radius with pixels"
);
await testProperty(
  "border-start-end-radius-[12px]",
  true,
  "Border-start-end-radius with pixels"
);
await testProperty(
  "border-end-start-radius-[16px]",
  true,
  "Border-end-start-radius with pixels"
);
await testProperty(
  "border-end-end-radius-[20px]",
  true,
  "Border-end-end-radius with pixels"
);

// Border-radius - Invalid values
await testProperty(
  "border-radius-[-5px]",
  false,
  "Border-radius with negative value (invalid)"
);
await testProperty(
  "border-radius-[red]",
  false,
  "Border-radius with color (invalid)"
);

console.log("🖼️  BORDER IMAGE PROPERTIES");
console.log("============================");

// Border-image shorthand
await testProperty(
  "border-image-[u(border.png),30,repeat]",
  true,
  "Border-image with URL and values"
);
await testProperty(
  "border-image-[linear-gradient(red,blue),20]",
  true,
  "Border-image with gradient"
);

// Border-image sub-properties
await testProperty(
  "border-image-source-[u(pattern.svg)]",
  true,
  "Border-image-source with URL"
);
await testProperty(
  "border-image-source-[linear-gradient(45deg,red,blue)]",
  true,
  "Border-image-source with gradient"
);
await testProperty(
  "border-image-slice-[30]",
  true,
  "Border-image-slice with number"
);
await testProperty(
  "border-image-slice-[30,fill]",
  true,
  "Border-image-slice with fill"
);
await testProperty(
  "border-image-width-[10px]",
  true,
  "Border-image-width with pixels"
);
await testProperty(
  "border-image-width-[auto]",
  true,
  "Border-image-width with auto"
);
await testProperty(
  "border-image-outset-[5px]",
  true,
  "Border-image-outset with pixels"
);
await testProperty(
  "border-image-repeat-[stretch]",
  true,
  "Border-image-repeat with stretch"
);
await testProperty(
  "border-image-repeat-[repeat]",
  true,
  "Border-image-repeat with repeat"
);
await testProperty(
  "border-image-repeat-[round]",
  true,
  "Border-image-repeat with round"
);
await testProperty(
  "border-image-repeat-[space]",
  true,
  "Border-image-repeat with space"
);

console.log("🖊️  OUTLINE PROPERTIES");
console.log("======================");

// Outline
await testProperty(
  "outline-[1px,solid,black]",
  true,
  "Outline with width style color"
);
await testProperty("outline-[2px,dashed,red]", true, "Outline with dashed red");
await testProperty("outline-[none]", true, "Outline with none");

// Outline-width
await testProperty("outline-width-[1px]", true, "Outline-width with pixels");
await testProperty("outline-width-[thin]", true, "Outline-width with thin");
await testProperty("outline-width-[medium]", true, "Outline-width with medium");
await testProperty("outline-width-[thick]", true, "Outline-width with thick");

// Outline-style
await testProperty("outline-style-[solid]", true, "Outline-style with solid");
await testProperty("outline-style-[dashed]", true, "Outline-style with dashed");
await testProperty("outline-style-[dotted]", true, "Outline-style with dotted");
await testProperty("outline-style-[none]", true, "Outline-style with none");

// Outline-offset
await testProperty("outline-offset-[2px]", true, "Outline-offset with pixels");
await testProperty("outline-offset-[0]", true, "Outline-offset with zero");
await testProperty(
  "outline-offset-[-1px]",
  true,
  "Outline-offset with negative (valid)"
);

console.log("🔬 COMPLEX & EDGE CASES");
console.log("=======================");

// CSS Functions
await testProperty(
  "border-radius-[calc(50%-5px)]",
  true,
  "Border-radius with calc function"
);
await testProperty(
  "border-width-[var(--border-width)]",
  true,
  "Border-width with CSS variable"
);
await testProperty(
  "outline-offset-[max(2px,0.1em)]",
  true,
  "Outline-offset with max function"
);

// Complex border combinations
await testProperty(
  "border-[2px,solid,var(--primary-color)]",
  true,
  "Border with CSS variable color"
);
await testProperty(
  "border-radius-[clamp(5px,2vw,20px)]",
  true,
  "Border-radius with clamp function"
);

// Multiple border-radius values
await testProperty(
  "border-radius-[10px,20px,30px,40px,/,5px,10px,15px,20px]",
  true,
  "Border-radius with horizontal and vertical radii"
);

// Border-image with complex values
await testProperty(
  "border-image-[repeating-linear-gradient(45deg,red,red-10px,blue-10px,blue-20px),20,repeat]",
  true,
  "Border-image with repeating gradient"
);

// Edge cases - should fail
await testProperty("border-[]", false, "Empty border value");
await testProperty("border-width-[", false, "Unclosed bracket");
await testProperty("border-style-]solid[", false, "Reversed brackets");
await testProperty(
  "b-[1px solid black]",
  false,
  "Spaces in bracket value (invalid)"
);

// Invalid border values
await testProperty(
  "border-style-[123px]",
  false,
  "Border-style with width (invalid)"
);
await testProperty(
  "border-width-[solid]",
  false,
  "Border-width with style (invalid)"
);
await testProperty(
  "outline-style-[red]",
  false,
  "Outline-style with color (invalid)"
);

// Unicode/Security tests
await testProperty(
  "border-[1px,solid,black♥]",
  false,
  "Border with Unicode character (should fail)"
);
await testProperty(
  "outline-[javascript:alert(1)]",
  false,
  "Outline with dangerous content (should fail)"
);

// Very complex border-image - conic-gradient removed (not supported in ZyraCSS v1.0.0 scope)

console.log("📊 TEST RESULTS SUMMARY");
console.log("=======================");
console.log(`Total tests: ${totalTests}`);
console.log(
  `✅ Passed: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`
);
console.log(
  `❌ Failed: ${failedTests} (${((failedTests / totalTests) * 100).toFixed(1)}%)`
);

console.log("\n🎯 BORDERS CATEGORY ASSESSMENT");
console.log("==============================");
if (passedTests / totalTests >= 0.95) {
  console.log("🎉 Excellent! Border properties have robust support.");
} else if (passedTests / totalTests >= 0.85) {
  console.log("👍 Good! Most border properties work correctly.");
} else {
  console.log("⚠️  Needs improvement. Several border properties need fixes.");
}
