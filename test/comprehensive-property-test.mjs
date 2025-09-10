#!/usr/bin/env node
/**
 * ZyraCSS Comprehensive Property Test Suite
 * Tests ALL CSS properties from the maps folder with various value types:
 * - Valid values (acceptable)
 * - Invalid values (unacceptable)
 * - Complex values (functions, multiple values)
 * - Simple values (keywords, lengths)
 * - Edge cases and boundary conditions
 */

import { zyraGenerateCSSFromClasses } from "../src/index.js";

console.log("🎯 ZyraCSS Comprehensive Property Test Suite");
console.log("===========================================");

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let unexpectedPasses = 0;

// Test categories for reporting
const categories = {
  spacing: { passed: 0, failed: 0, total: 0 },
  typography: { passed: 0, failed: 0, total: 0 },
  color: { passed: 0, failed: 0, total: 0 },
  layout: { passed: 0, failed: 0, total: 0 },
  sizing: { passed: 0, failed: 0, total: 0 },
  borders: { passed: 0, failed: 0, total: 0 },
  effects: { passed: 0, failed: 0, total: 0 },
  transform: { passed: 0, failed: 0, total: 0 },
  overflow: { passed: 0, failed: 0, total: 0 },
  interactive: { passed: 0, failed: 0, total: 0 },
  animation: { passed: 0, failed: 0, total: 0 },
};

/**
 * Test a CSS class and check if it behaves as expected
 * @param {string} className - The CSS class to test
 * @param {boolean} shouldPass - Whether the test should pass or fail
 * @param {string} description - Description of the test
 * @param {string} category - Category for reporting
 */
async function testProperty(className, shouldPass, description, category) {
  totalTests++;
  categories[category].total++;

  try {
    const result = await zyraGenerateCSSFromClasses([className]);
    const actuallyPassed =
      result.success && result.data?.css?.trim().length > 0;

    if (actuallyPassed === shouldPass) {
      passedTests++;
      categories[category].passed++;
      console.log(`✅ ${description}`);
      if (actuallyPassed && result.data.css) {
        console.log(`   → ${result.data.css.trim().replace(/\n/g, " ")}`);
      }
    } else {
      failedTests++;
      categories[category].failed++;
      if (actuallyPassed && !shouldPass) {
        unexpectedPasses++;
        console.log(`⚠️  ${description} (unexpected pass)`);
        console.log(
          `   → ${result.data?.css?.trim().replace(/\n/g, " ") || "No CSS"}`
        );
      } else {
        console.log(`❌ ${description} (expected to pass but failed)`);
      }
    }
  } catch (error) {
    failedTests++;
    categories[category].failed++;
    console.log(`💥 ${description} (error: ${error.message})`);
  }
}

async function runComprehensiveTests() {
  // ==============================================
  // SPACING PROPERTIES TESTS
  // ==============================================
  console.log("\n📏 SPACING PROPERTIES");
  console.log("====================");

  // Padding tests - Valid cases
  await testProperty("p-[10px]", true, "Padding with pixels", "spacing");
  await testProperty(
    "padding-[1rem]",
    true,
    "Padding full name with rem",
    "spacing"
  );
  await testProperty("pt-[20px]", true, "Padding-top shorthand", "spacing");
  await testProperty(
    "padding-top-[2em]",
    true,
    "Padding-top full name",
    "spacing"
  );
  await testProperty(
    "py-[15px]",
    true,
    "Padding-block (py) shorthand",
    "spacing"
  );
  await testProperty(
    "px-[25px]",
    true,
    "Padding-inline (px) shorthand",
    "spacing"
  );

  // Padding tests - Invalid cases
  await testProperty(
    "p-[red]",
    false,
    "Padding with color (invalid)",
    "spacing"
  );
  await testProperty(
    "p-[flex]",
    false,
    "Padding with display value (invalid)",
    "spacing"
  );
  await testProperty(
    "pt-[-10px]",
    false,
    "Padding-top with negative (should be rejected)",
    "spacing"
  );

  // Margin tests - Valid cases
  await testProperty("m-[10px]", true, "Margin with pixels", "spacing");
  await testProperty(
    "margin-[auto]",
    true,
    "Margin with auto keyword",
    "spacing"
  );
  await testProperty(
    "mt-[-5px]",
    true,
    "Margin-top with negative (valid)",
    "spacing"
  );
  await testProperty("my-[0]", true, "Margin-block with zero", "spacing");

  // Margin tests - Invalid cases
  await testProperty(
    "m-[blue]",
    false,
    "Margin with color (invalid)",
    "spacing"
  );

  // Gap tests
  await testProperty("gap-[10px]", true, "Gap with pixels", "spacing");
  await testProperty("row-gap-[1rem]", true, "Row gap with rem", "spacing");
  await testProperty(
    "gap-[invalid]",
    false,
    "Gap with invalid value",
    "spacing"
  );

  // ==============================================
  // TYPOGRAPHY PROPERTIES TESTS
  // ==============================================
  console.log("\n✍️  TYPOGRAPHY PROPERTIES");
  console.log("========================");

  // Font family tests
  await testProperty(
    "ff-[Arial]",
    true,
    "Font-family shorthand with Arial",
    "typography"
  );
  await testProperty(
    "font-family-[Georgia]",
    true,
    "Font-family full name",
    "typography"
  );
  await testProperty(
    "ff-[Arial,sans-serif]",
    true,
    "Font-family with fallback",
    "typography"
  );
  await testProperty(
    "ff-[123invalid]",
    false,
    "Font-family starting with number",
    "typography"
  );

  // Font size tests
  await testProperty("fs-[16px]", true, "Font-size with pixels", "typography");
  await testProperty(
    "font-size-[1.2em]",
    true,
    "Font-size with em",
    "typography"
  );
  await testProperty(
    "fs-[large]",
    true,
    "Font-size with keyword",
    "typography"
  );
  await testProperty(
    "fs-[red]",
    false,
    "Font-size with color (invalid)",
    "typography"
  );

  // Font weight tests
  await testProperty(
    "fw-[bold]",
    true,
    "Font-weight with keyword",
    "typography"
  );
  await testProperty(
    "font-weight-[400]",
    true,
    "Font-weight with number",
    "typography"
  );
  await testProperty(
    "fw-[999]",
    true,
    "Font-weight high value (valid)",
    "typography"
  );
  await testProperty(
    "fw-[1001]",
    false,
    "Font-weight out of range",
    "typography"
  );

  // Text properties
  await testProperty("ta-[center]", true, "Text-align center", "typography");
  await testProperty(
    "text-align-[justify]",
    true,
    "Text-align justify",
    "typography"
  );
  await testProperty(
    "ta-[invalid]",
    false,
    "Text-align invalid value",
    "typography"
  );

  await testProperty("lh-[1.5]", true, "Line-height with number", "typography");
  await testProperty(
    "line-height-[20px]",
    true,
    "Line-height with pixels",
    "typography"
  );
  await testProperty(
    "lh-[red]",
    false,
    "Line-height with color (invalid)",
    "typography"
  );

  await testProperty(
    "ls-[2px]",
    true,
    "Letter-spacing with pixels",
    "typography"
  );
  await testProperty(
    "letter-spacing-[normal]",
    true,
    "Letter-spacing normal",
    "typography"
  );

  await testProperty(
    "tt-[uppercase]",
    true,
    "Text-transform uppercase",
    "typography"
  );
  await testProperty(
    "text-transform-[capitalize]",
    true,
    "Text-transform capitalize",
    "typography"
  );
  await testProperty(
    "tt-[invalid]",
    false,
    "Text-transform invalid",
    "typography"
  );

  // ==============================================
  // COLOR PROPERTIES TESTS
  // ==============================================
  console.log("\n🎨 COLOR PROPERTIES");
  console.log("==================");

  // Text color tests
  await testProperty("c-[red]", true, "Color with named color", "color");
  await testProperty("color-[#ff0000]", true, "Color with hex", "color");
  await testProperty(
    "c-[rgb(255,0,0)]",
    true,
    "Color with RGB function",
    "color"
  );
  await testProperty(
    "c-[hsl(0,100%,50%)]",
    true,
    "Color with HSL function",
    "color"
  );
  await testProperty("c-[invalid]", false, "Color with invalid value", "color");

  // Background tests
  await testProperty("bg-[blue]", true, "Background with color", "color");
  await testProperty(
    "background-[#00ff00]",
    true,
    "Background with hex",
    "color"
  );
  await testProperty(
    "bg-[u(image.jpg)]",
    true,
    "Background with image",
    "color"
  );
  await testProperty(
    "bg-[linear-gradient(to-right,red,blue)]",
    true,
    "Background with gradient",
    "color"
  );
  await testProperty(
    "bg-[123invalid]",
    false,
    "Background with invalid value",
    "color"
  );

  // Border colors
  await testProperty(
    "border-color-[red]",
    true,
    "Border color with named color",
    "color"
  );
  await testProperty(
    "border-top-color-[#333]",
    true,
    "Border-top-color with hex",
    "color"
  );

  // ==============================================
  // LAYOUT PROPERTIES TESTS
  // ==============================================
  console.log("\n📐 LAYOUT PROPERTIES");
  console.log("===================");

  // Display tests
  await testProperty("d-[flex]", true, "Display flex shorthand", "layout");
  await testProperty(
    "display-[grid]",
    true,
    "Display grid full name",
    "layout"
  );
  await testProperty("d-[block]", true, "Display block", "layout");
  await testProperty(
    "display-[inline-block]",
    true,
    "Display inline-block",
    "layout"
  );
  await testProperty(
    "d-[invalid]",
    false,
    "Display with invalid value",
    "layout"
  );

  // Position tests
  await testProperty(
    "pos-[relative]",
    true,
    "Position relative shorthand",
    "layout"
  );
  await testProperty(
    "position-[absolute]",
    true,
    "Position absolute full name",
    "layout"
  );
  await testProperty("pos-[fixed]", true, "Position fixed", "layout");
  await testProperty(
    "position-[invalid]",
    false,
    "Position invalid value",
    "layout"
  );

  // Positioning values
  await testProperty("top-[10px]", true, "Top with pixels", "layout");
  await testProperty("left-[50%]", true, "Left with percentage", "layout");
  await testProperty("z-[999]", true, "Z-index shorthand", "layout");
  await testProperty("z-index-[10]", true, "Z-index full name", "layout");
  await testProperty("top-[red]", false, "Top with color (invalid)", "layout");

  // Flexbox tests
  await testProperty(
    "justify-content-[center]",
    true,
    "Justify-content center",
    "layout"
  );
  await testProperty(
    "align-items-[flex-start]",
    true,
    "Align-items flex-start",
    "layout"
  );
  await testProperty("flex-[1]", true, "Flex shorthand", "layout");
  await testProperty("flex-grow-[2]", true, "Flex-grow", "layout");
  await testProperty(
    "justify-content-[invalid]",
    false,
    "Justify-content invalid",
    "layout"
  );

  // Grid tests
  await testProperty(
    "grid-template-columns-[1fr,1fr]",
    true,
    "Grid template columns",
    "layout"
  );
  await testProperty("grid-area-[header]", true, "Grid area", "layout");

  // ==============================================
  // SIZING PROPERTIES TESTS
  // ==============================================
  console.log("\n📏 SIZING PROPERTIES");
  console.log("===================");

  // Width tests
  await testProperty("w-[100px]", true, "Width pixels shorthand", "sizing");
  await testProperty(
    "width-[50%]",
    true,
    "Width percentage full name",
    "sizing"
  );
  await testProperty("w-[auto]", true, "Width auto", "sizing");
  await testProperty("min-w-[200px]", true, "Min-width shorthand", "sizing");
  await testProperty("min-width-[100%]", true, "Min-width full name", "sizing");
  await testProperty("max-w-[500px]", true, "Max-width shorthand", "sizing");
  await testProperty("w-[red]", false, "Width with color (invalid)", "sizing");

  // Height tests
  await testProperty(
    "h-[100vh]",
    true,
    "Height viewport units shorthand",
    "sizing"
  );
  await testProperty(
    "height-[200px]",
    true,
    "Height pixels full name",
    "sizing"
  );
  await testProperty("h-[auto]", true, "Height auto", "sizing");
  await testProperty("min-h-[50vh]", true, "Min-height shorthand", "sizing");
  await testProperty(
    "min-height-[100px]",
    true,
    "Min-height full name",
    "sizing"
  );
  await testProperty("max-h-[80vh]", true, "Max-height shorthand", "sizing");
  await testProperty(
    "h-[flex]",
    false,
    "Height with display value (invalid)",
    "sizing"
  );

  // Other sizing
  await testProperty(
    "box-sizing-[border-box]",
    true,
    "Box-sizing border-box",
    "sizing"
  );
  await testProperty("object-fit-[cover]", true, "Object-fit cover", "sizing");
  await testProperty("aspect-ratio-[16/9]", true, "Aspect ratio", "sizing");

  // ==============================================
  // BORDER PROPERTIES TESTS
  // ==============================================
  console.log("\n🔲 BORDER PROPERTIES");
  console.log("===================");

  // Border shorthand
  await testProperty(
    "b-[1px,solid,black]",
    true,
    "Border shorthand",
    "borders"
  );
  await testProperty(
    "border-[2px,dashed,red]",
    true,
    "Border full name",
    "borders"
  );

  // Border width
  await testProperty("border-width-[2px]", true, "Border width", "borders");
  await testProperty(
    "border-top-width-[thin]",
    true,
    "Border-top-width keyword",
    "borders"
  );

  // Border style
  await testProperty(
    "border-style-[solid]",
    true,
    "Border style solid",
    "borders"
  );
  await testProperty(
    "border-style-[dashed]",
    true,
    "Border style dashed",
    "borders"
  );
  await testProperty(
    "border-style-[invalid]",
    false,
    "Border style invalid",
    "borders"
  );

  // Border radius
  await testProperty(
    "border-radius-[10px]",
    true,
    "Border radius pixels",
    "borders"
  );
  await testProperty(
    "border-radius-[50%]",
    true,
    "Border radius percentage",
    "borders"
  );

  // ==============================================
  // EFFECTS PROPERTIES TESTS
  // ==============================================
  console.log("\n✨ EFFECTS PROPERTIES");
  console.log("====================");

  // Box shadow
  await testProperty(
    "shadow-[0,2px,4px,rgba(0,0,0,0.1)]",
    true,
    "Box shadow shorthand",
    "effects"
  );
  await testProperty(
    "box-shadow-[2px,2px,5px,#333]",
    true,
    "Box shadow full name",
    "effects"
  );
  await testProperty("bs-[none]", true, "Box shadow none", "effects");

  // Text shadow
  await testProperty(
    "text-shadow-[1px,1px,2px,black]",
    true,
    "Text shadow",
    "effects"
  );

  // Opacity
  await testProperty("o-[0.5]", true, "Opacity shorthand", "effects");
  await testProperty("opacity-[1]", true, "Opacity full name", "effects");
  await testProperty("o-[invalid]", false, "Opacity invalid", "effects");

  // Transform
  await testProperty(
    "t-[rotate(45deg)]",
    true,
    "Transform shorthand",
    "effects"
  );
  await testProperty(
    "transform-[scale(1.2)]",
    true,
    "Transform full name",
    "effects"
  );
  await testProperty(
    "transform-[translate(10px,20px)]",
    true,
    "Transform translate",
    "effects"
  );

  // Filter
  await testProperty("f-[blur(5px)]", true, "Filter shorthand", "effects");
  await testProperty(
    "filter-[brightness(1.2)]",
    true,
    "Filter full name",
    "effects"
  );

  // ==============================================
  // TRANSFORM PROPERTIES TESTS
  // ==============================================
  console.log("\n🔄 TRANSFORM PROPERTIES");
  console.log("=====================");

  await testProperty(
    "transform-origin-[center]",
    true,
    "Transform origin center",
    "transform"
  );
  await testProperty(
    "transform-origin-[top,left]",
    true,
    "Transform origin position",
    "transform"
  );
  await testProperty(
    "transform-style-[preserve-3d]",
    true,
    "Transform style 3d",
    "transform"
  );
  await testProperty("perspective-[1000px]", true, "Perspective", "transform");
  await testProperty(
    "backface-visibility-[hidden]",
    true,
    "Backface visibility",
    "transform"
  );

  // Individual transform properties
  await testProperty(
    "translate-[10px,20px]",
    true,
    "Translate property",
    "transform"
  );
  await testProperty("rotate-[45deg]", true, "Rotate property", "transform");
  await testProperty("scale-[1.5]", true, "Scale property", "transform");

  // ==============================================
  // OVERFLOW PROPERTIES TESTS
  // ==============================================
  console.log("\n📜 OVERFLOW PROPERTIES");
  console.log("=====================");

  await testProperty("overflow-[hidden]", true, "Overflow hidden", "overflow");
  await testProperty(
    "overflow-x-[scroll]",
    true,
    "Overflow-x scroll",
    "overflow"
  );
  await testProperty("overflow-y-[auto]", true, "Overflow-y auto", "overflow");
  await testProperty(
    "overflow-[invalid]",
    false,
    "Overflow invalid",
    "overflow"
  );

  await testProperty(
    "scroll-behavior-[smooth]",
    true,
    "Scroll behavior smooth",
    "overflow"
  );
  await testProperty("scroll-margin-[10px]", true, "Scroll margin", "overflow");

  // ==============================================
  // INTERACTIVE PROPERTIES TESTS
  // ==============================================
  console.log("\n🖱️  INTERACTIVE PROPERTIES");
  console.log("=========================");

  await testProperty("cursor-[pointer]", true, "Cursor pointer", "interactive");
  await testProperty("cursor-[grab]", true, "Cursor grab", "interactive");
  await testProperty(
    "cursor-[invalid]",
    false,
    "Cursor invalid",
    "interactive"
  );

  await testProperty(
    "pointer-events-[none]",
    true,
    "Pointer events none",
    "interactive"
  );
  await testProperty(
    "user-select-[none]",
    true,
    "User select none",
    "interactive"
  );
  await testProperty("resize-[both]", true, "Resize both", "interactive");

  // ==============================================
  // ANIMATION PROPERTIES TESTS
  // ==============================================
  console.log("\n🎬 ANIMATION PROPERTIES");
  console.log("=====================");

  await testProperty(
    "transition-[all,0.3s,ease]",
    true,
    "Transition shorthand",
    "animation"
  );
  await testProperty(
    "transition-duration-[500ms]",
    true,
    "Transition duration",
    "animation"
  );
  await testProperty(
    "transition-property-[opacity]",
    true,
    "Transition property",
    "animation"
  );

  await testProperty(
    "animation-[fadeIn,1s,ease-in-out]",
    true,
    "Animation shorthand",
    "animation"
  );
  await testProperty(
    "animation-duration-[2s]",
    true,
    "Animation duration",
    "animation"
  );
  await testProperty(
    "animation-iteration-count-[infinite]",
    true,
    "Animation iteration count",
    "animation"
  );

  await testProperty(
    "will-change-[transform]",
    true,
    "Will change",
    "animation"
  );

  // ==============================================
  // COMPLEX AND EDGE CASES
  // ==============================================
  console.log("\n🔬 COMPLEX & EDGE CASES");
  console.log("======================");

  // Multiple values
  await testProperty(
    "margin-[10px,20px]",
    true,
    "Margin with multiple values",
    "spacing"
  );
  await testProperty(
    "padding-[5px,10px,15px,20px]",
    true,
    "Padding with 4 values",
    "spacing"
  );

  // CSS functions
  await testProperty(
    "width-[calc(100%-20px)]",
    true,
    "Width with calc function",
    "sizing"
  );
  await testProperty(
    "background-[linear-gradient(45deg,red,blue)]",
    true,
    "Background gradient",
    "color"
  );
  await testProperty(
    "transform-[matrix(1,0,0,1,0,0)]",
    true,
    "Transform matrix",
    "effects"
  );

  // CSS variables
  await testProperty(
    "color-[var(--primary-color)]",
    true,
    "Color with CSS variable",
    "color"
  );
  await testProperty(
    "margin-[var(--spacing-md,1rem)]",
    true,
    "Margin with CSS variable and fallback",
    "spacing"
  );

  // Invalid bracket syntax
  await testProperty("p-[]", false, "Empty value in brackets", "spacing");
  await testProperty("m-[", false, "Unclosed bracket", "spacing");
  await testProperty("w-]100px[", false, "Reversed brackets", "sizing");

  // Special characters and edge cases
  await testProperty(
    'content-["Hello World"]',
    true,
    "Content with quoted string",
    "typography"
  );
  await testProperty(
    "background-[u('image.png')]",
    true,
    "Background with quoted URL",
    "color"
  );

  // Print results
  console.log("\n📊 TEST RESULTS SUMMARY");
  console.log("=======================");
  console.log(`Total tests: ${totalTests}`);
  console.log(
    `✅ Passed: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`
  );
  console.log(
    `❌ Failed: ${failedTests} (${((failedTests / totalTests) * 100).toFixed(1)}%)`
  );
  console.log(`⚠️  Unexpected passes: ${unexpectedPasses}`);

  console.log("\n📋 RESULTS BY CATEGORY");
  console.log("======================");

  for (const [category, stats] of Object.entries(categories)) {
    const successRate =
      stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : "0.0";
    console.log(
      `${category.padEnd(12)}: ${stats.passed}/${stats.total} (${successRate}%)`
    );
  }

  // Overall assessment
  const overallSuccess = (passedTests / totalTests) * 100;
  console.log("\n🎯 OVERALL ASSESSMENT");
  console.log("====================");

  if (overallSuccess >= 90) {
    console.log("🎉 Excellent! ZyraCSS has robust property support.");
  } else if (overallSuccess >= 75) {
    console.log(
      "👍 Good! Most properties work well, minor improvements needed."
    );
  } else if (overallSuccess >= 60) {
    console.log("⚠️  Fair. Several properties need attention.");
  } else {
    console.log("🔧 Needs significant work on property support.");
  }

  if (unexpectedPasses > 0) {
    console.log(
      `\n⚠️  Note: ${unexpectedPasses} tests passed when they were expected to fail.`
    );
    console.log("This might indicate validation that's too permissive.");
  }
}

runComprehensiveTests().catch(console.error);
