/**
 * ZyraCSS Layout Properties Test Suite
 * Tests all layout properties from layout.js map with various value types
 */

import { zyraGenerateCSS } from "../../src/index.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log("🎯 ZyraCSS Layout Properties Test Suite");
console.log("=======================================\n");

/**
 * Test a layout property with expected result
 */
async function testProperty(
  className,
  shouldPass,
  description,
  category = "layout"
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

console.log("📺 DISPLAY PROPERTIES");
console.log("=====================");

// Display - Full names
await testProperty("display-[block]", true, "Display full name with block");
await testProperty("display-[inline]", true, "Display full name with inline");
await testProperty(
  "display-[inline-block]",
  true,
  "Display full name with inline-block"
);
await testProperty("display-[flex]", true, "Display full name with flex");
await testProperty(
  "display-[inline-flex]",
  true,
  "Display full name with inline-flex"
);
await testProperty("display-[grid]", true, "Display full name with grid");
await testProperty(
  "display-[inline-grid]",
  true,
  "Display full name with inline-grid"
);
await testProperty("display-[table]", true, "Display full name with table");
await testProperty("display-[none]", true, "Display full name with none");

// Display - Short forms
await testProperty("d-[block]", true, "Display shorthand with block");
await testProperty("d-[flex]", true, "Display shorthand with flex");
await testProperty("d-[grid]", true, "Display shorthand with grid");
await testProperty("d-[none]", true, "Display shorthand with none");

// Display - Invalid values
await testProperty("display-[invalid]", false, "Display with invalid value");
await testProperty("d-[red]", false, "Display with color (invalid)");

console.log("📍 POSITION PROPERTIES");
console.log("======================");

// Position - Full names
await testProperty("position-[static]", true, "Position full name with static");
await testProperty(
  "position-[relative]",
  true,
  "Position full name with relative"
);
await testProperty(
  "position-[absolute]",
  true,
  "Position full name with absolute"
);
await testProperty("position-[fixed]", true, "Position full name with fixed");
await testProperty("position-[sticky]", true, "Position full name with sticky");

// Position - Short forms
await testProperty("pos-[relative]", true, "Position shorthand with relative");
await testProperty("pos-[absolute]", true, "Position shorthand with absolute");
await testProperty("pos-[fixed]", true, "Position shorthand with fixed");

// Position offset properties
await testProperty("top-[10px]", true, "Top with pixels");
await testProperty("top-[50%]", true, "Top with percentage");
await testProperty("top-[auto]", true, "Top with auto");
await testProperty("right-[20px]", true, "Right with pixels");
await testProperty("bottom-[30px]", true, "Bottom with pixels");
await testProperty("left-[40px]", true, "Left with pixels");

// Z-index - Full and short forms
await testProperty("z-index-[999]", true, "Z-index full name with number");
await testProperty("z-index-[-1]", true, "Z-index full name with negative");
await testProperty("z-index-[auto]", true, "Z-index full name with auto");
await testProperty("z-[100]", true, "Z-index shorthand with number");
await testProperty("z-[0]", true, "Z-index shorthand with zero");

// Position - Invalid values
await testProperty("position-[invalid]", false, "Position with invalid value");
await testProperty("top-[red]", false, "Top with color (invalid)");
await testProperty("z-index-[999.5]", false, "Z-index with decimal (invalid)");

console.log("🌊 FLOAT & CLEAR PROPERTIES");
console.log("============================");

// Float
await testProperty("float-[left]", true, "Float with left");
await testProperty("float-[right]", true, "Float with right");
await testProperty("float-[none]", true, "Float with none");

// Clear
await testProperty("clear-[left]", true, "Clear with left");
await testProperty("clear-[right]", true, "Clear with right");
await testProperty("clear-[both]", true, "Clear with both");
await testProperty("clear-[none]", true, "Clear with none");

console.log("📋 OVERFLOW PROPERTIES");
console.log("======================");

// Overflow
await testProperty("overflow-[visible]", true, "Overflow with visible");
await testProperty("overflow-[hidden]", true, "Overflow with hidden");
await testProperty("overflow-[scroll]", true, "Overflow with scroll");
await testProperty("overflow-[auto]", true, "Overflow with auto");

// Overflow directional
await testProperty("overflow-x-[hidden]", true, "Overflow-x with hidden");
await testProperty("overflow-x-[scroll]", true, "Overflow-x with scroll");
await testProperty("overflow-y-[auto]", true, "Overflow-y with auto");
await testProperty("overflow-y-[visible]", true, "Overflow-y with visible");

console.log("👁️  VISIBILITY PROPERTIES");
console.log("=========================");

// Visibility - Full and short forms
await testProperty(
  "visibility-[visible]",
  true,
  "Visibility full name with visible"
);
await testProperty(
  "visibility-[hidden]",
  true,
  "Visibility full name with hidden"
);
await testProperty(
  "visibility-[collapse]",
  true,
  "Visibility full name with collapse"
);
await testProperty("v-[visible]", true, "Visibility shorthand with visible");
await testProperty("v-[hidden]", true, "Visibility shorthand with hidden");

console.log("📦 FLEXBOX CONTAINER PROPERTIES");
console.log("===============================");

// Flex direction
await testProperty("flex-direction-[row]", true, "Flex-direction with row");
await testProperty(
  "flex-direction-[column]",
  true,
  "Flex-direction with column"
);
await testProperty(
  "flex-direction-[row-reverse]",
  true,
  "Flex-direction with row-reverse"
);
await testProperty(
  "flex-direction-[column-reverse]",
  true,
  "Flex-direction with column-reverse"
);

// Flex wrap
await testProperty("flex-wrap-[nowrap]", true, "Flex-wrap with nowrap");
await testProperty("flex-wrap-[wrap]", true, "Flex-wrap with wrap");
await testProperty(
  "flex-wrap-[wrap-reverse]",
  true,
  "Flex-wrap with wrap-reverse"
);

// Flex flow (shorthand)
await testProperty("flex-flow-[row,wrap]", true, "Flex-flow with row wrap");
await testProperty(
  "flex-flow-[column,nowrap]",
  true,
  "Flex-flow with column nowrap"
);

// Justify content
await testProperty(
  "justify-content-[flex-start]",
  true,
  "Justify-content with flex-start"
);
await testProperty(
  "justify-content-[flex-end]",
  true,
  "Justify-content with flex-end"
);
await testProperty(
  "justify-content-[center]",
  true,
  "Justify-content with center"
);
await testProperty(
  "justify-content-[space-between]",
  true,
  "Justify-content with space-between"
);
await testProperty(
  "justify-content-[space-around]",
  true,
  "Justify-content with space-around"
);
await testProperty(
  "justify-content-[space-evenly]",
  true,
  "Justify-content with space-evenly"
);

// Align items
await testProperty(
  "align-items-[flex-start]",
  true,
  "Align-items with flex-start"
);
await testProperty("align-items-[flex-end]", true, "Align-items with flex-end");
await testProperty("align-items-[center]", true, "Align-items with center");
await testProperty("align-items-[baseline]", true, "Align-items with baseline");
await testProperty("align-items-[stretch]", true, "Align-items with stretch");

// Align content
await testProperty(
  "align-content-[flex-start]",
  true,
  "Align-content with flex-start"
);
await testProperty("align-content-[center]", true, "Align-content with center");
await testProperty(
  "align-content-[space-between]",
  true,
  "Align-content with space-between"
);

// Place content (CSS Grid/Flexbox shorthand)
await testProperty("place-content-[center]", true, "Place-content with center");
await testProperty(
  "place-content-[start,end]",
  true,
  "Place-content with start end"
);

// Justify/place items
await testProperty("justify-items-[start]", true, "Justify-items with start");
await testProperty("justify-items-[center]", true, "Justify-items with center");
await testProperty("place-items-[center]", true, "Place-items with center");

console.log("🔧 FLEXBOX ITEM PROPERTIES");
console.log("===========================");

// Flex
await testProperty("flex-[1]", true, "Flex with number");
await testProperty("flex-[0,1,auto]", true, "Flex with grow shrink basis");
await testProperty("flex-[none]", true, "Flex with none");

// Flex grow
await testProperty("flex-grow-[1]", true, "Flex-grow with number");
await testProperty("flex-grow-[0]", true, "Flex-grow with zero");
await testProperty("flex-grow-[2]", true, "Flex-grow with larger number");

// Flex shrink
await testProperty("flex-shrink-[1]", true, "Flex-shrink with number");
await testProperty("flex-shrink-[0]", true, "Flex-shrink with zero");

// Flex basis
await testProperty("flex-basis-[auto]", true, "Flex-basis with auto");
await testProperty("flex-basis-[200px]", true, "Flex-basis with pixels");
await testProperty("flex-basis-[50%]", true, "Flex-basis with percentage");

// Align self
await testProperty("align-self-[auto]", true, "Align-self with auto");
await testProperty("align-self-[center]", true, "Align-self with center");
await testProperty("align-self-[flex-end]", true, "Align-self with flex-end");

// Justify self
await testProperty("justify-self-[auto]", true, "Justify-self with auto");
await testProperty("justify-self-[center]", true, "Justify-self with center");

// Place self
await testProperty("place-self-[center]", true, "Place-self with center");
await testProperty("place-self-[start,end]", true, "Place-self with start end");

// Order
await testProperty("order-[1]", true, "Order with positive number");
await testProperty("order-[-1]", true, "Order with negative number");
await testProperty("order-[0]", true, "Order with zero");

console.log("🏗️  CSS GRID CONTAINER PROPERTIES");
console.log("==================================");

// Grid
await testProperty("grid-[auto]", true, "Grid with auto");
await testProperty("grid-[none]", true, "Grid with none");

// Grid template
await testProperty("grid-template-[none]", true, "Grid-template with none");
await testProperty("grid-template-[auto]", true, "Grid-template with auto");

// Grid template rows
await testProperty(
  "grid-template-rows-[auto]",
  true,
  "Grid-template-rows with auto"
);
await testProperty(
  "grid-template-rows-[100px,200px]",
  true,
  "Grid-template-rows with fixed sizes"
);
await testProperty(
  "grid-template-rows-[1fr,2fr]",
  true,
  "Grid-template-rows with fr units"
);

// Grid template columns
await testProperty(
  "grid-template-columns-[auto]",
  true,
  "Grid-template-columns with auto"
);
await testProperty(
  "grid-template-columns-[100px,200px,300px]",
  true,
  "Grid-template-columns with fixed sizes"
);
await testProperty(
  "grid-template-columns-[1fr,1fr,1fr]",
  true,
  "Grid-template-columns with fr units"
);
await testProperty(
  "grid-template-columns-[repeat(3,1fr)]",
  true,
  "Grid-template-columns with repeat function"
);

// Grid template areas
await testProperty(
  'grid-template-areas-["header,header","nav,main","footer,footer"]',
  true,
  "Grid-template-areas with layout"
);
await testProperty(
  "grid-template-areas-[none]",
  true,
  "Grid-template-areas with none"
);

// Grid auto
await testProperty("grid-auto-rows-[auto]", true, "Grid-auto-rows with auto");
await testProperty(
  "grid-auto-rows-[100px]",
  true,
  "Grid-auto-rows with fixed size"
);
await testProperty(
  "grid-auto-columns-[auto]",
  true,
  "Grid-auto-columns with auto"
);
await testProperty(
  "grid-auto-columns-[minmax(100px,1fr)]",
  true,
  "Grid-auto-columns with minmax"
);

// Grid auto flow
await testProperty("grid-auto-flow-[row]", true, "Grid-auto-flow with row");
await testProperty(
  "grid-auto-flow-[column]",
  true,
  "Grid-auto-flow with column"
);
await testProperty("grid-auto-flow-[dense]", true, "Grid-auto-flow with dense");

console.log("📐 CSS GRID ITEM PROPERTIES");
console.log("============================");

// Grid area
await testProperty("grid-area-[header]", true, "Grid-area with named area");
await testProperty("grid-area-[1,2,3,4]", true, "Grid-area with line numbers");
await testProperty("grid-area-[auto]", true, "Grid-area with auto");

// Grid row
await testProperty("grid-row-[1]", true, "Grid-row with line number");
await testProperty("grid-row-[1,3]", true, "Grid-row with start and end");
await testProperty("grid-row-[span,2]", true, "Grid-row with span");

// Grid row start/end
await testProperty(
  "grid-row-start-[1]",
  true,
  "Grid-row-start with line number"
);
await testProperty("grid-row-start-[auto]", true, "Grid-row-start with auto");
await testProperty("grid-row-end-[3]", true, "Grid-row-end with line number");
await testProperty("grid-row-end-[span,2]", true, "Grid-row-end with span");

// Grid column
await testProperty("grid-column-[1]", true, "Grid-column with line number");
await testProperty("grid-column-[1,4]", true, "Grid-column with start and end");
await testProperty("grid-column-[span,3]", true, "Grid-column with span");

// Grid column start/end
await testProperty(
  "grid-column-start-[2]",
  true,
  "Grid-column-start with line number"
);
await testProperty(
  "grid-column-start-[auto]",
  true,
  "Grid-column-start with auto"
);
await testProperty(
  "grid-column-end-[4]",
  true,
  "Grid-column-end with line number"
);
await testProperty(
  "grid-column-end-[span,2]",
  true,
  "Grid-column-end with span"
);

console.log("📰 MULTI-COLUMN LAYOUT");
console.log("======================");

// Columns
await testProperty("columns-[auto]", true, "Columns with auto");
await testProperty("columns-[3]", true, "Columns with count");
await testProperty("columns-[200px]", true, "Columns with width");

console.log("🔬 COMPLEX & EDGE CASES");
console.log("=======================");

// CSS Functions in layout
await testProperty("top-[calc(50%-10px)]", true, "Top with calc function");
await testProperty(
  "grid-template-columns-[repeat(auto-fit,minmax(200px,1fr))]",
  true,
  "Grid template with complex repeat"
);
await testProperty(
  "flex-basis-[clamp(200px,50%,400px)]",
  true,
  "Flex-basis with clamp function"
);

// CSS Variables
await testProperty(
  "z-index-[var(--z-header)]",
  true,
  "Z-index with CSS variable"
);
await testProperty(
  "grid-template-areas-[var(--grid-layout)]",
  true,
  "Grid-template-areas with variable"
);

// Edge cases - should fail
await testProperty("display-[]", false, "Empty display value");
await testProperty("position-[", false, "Unclosed bracket");
await testProperty("flex-]1[", false, "Reversed brackets");
await testProperty(
  "grid-template-columns-[1fr 2fr]",
  false,
  "Spaces in bracket value (invalid)"
);

// Invalid layout values
await testProperty(
  "justify-content-[invalid]",
  false,
  "Justify-content with invalid value"
);
await testProperty(
  "flex-grow-[-1]",
  false,
  "Flex-grow with negative value (invalid)"
);
await testProperty(
  "grid-template-columns-[red]",
  false,
  "Grid-template-columns with color (invalid)"
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

console.log("\n🎯 LAYOUT CATEGORY ASSESSMENT");
console.log("=============================");
if (passedTests / totalTests >= 0.95) {
  console.log("🎉 Excellent! Layout properties have robust support.");
} else if (passedTests / totalTests >= 0.85) {
  console.log("👍 Good! Most layout properties work correctly.");
} else {
  console.log("⚠️  Needs improvement. Several layout properties need fixes.");
}
