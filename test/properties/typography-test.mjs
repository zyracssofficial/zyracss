/**
 * ZyraCSS Typography Properties Test Suite
 * Tests all typography properties from typography.js map with various value types
 */

import { zyra } from "../../src/index.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log("🎯 ZyraCSS Typography Properties Test Suite");
console.log("===========================================\n");

/**
 * Test a typography property with expected result
 */
function testProperty(
  className,
  shouldPass,
  description,
  category = "typography"
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

console.log("✍️  FONT PROPERTIES");
console.log("==================");

// Font shorthand
await testProperty(
  "font-[16px,Arial]",
  true,
  "Font shorthand with size and family"
);
await testProperty(
  "font-[bold,18px,Georgia]",
  true,
  "Font shorthand with weight, size, and family"
);

// Font-family - Full names
await testProperty(
  "font-family-[Arial]",
  true,
  "Font-family full name with Arial"
);
await testProperty(
  "font-family-[Georgia]",
  true,
  "Font-family full name with Georgia"
);
await testProperty(
  "font-family-[Times-New-Roman]",
  true,
  "Font-family full name with multi-word (dash syntax)"
);
await testProperty(
  "font-family-[Arial,sans-serif]",
  true,
  "Font-family with fallback"
);
await testProperty(
  "font-family-[Helvetica,Arial,sans-serif]",
  true,
  "Font-family with multiple fallbacks"
);

// Font-family - Short forms
await testProperty("ff-[Verdana]", true, "Font-family shorthand with Verdana");
await testProperty(
  "ff-[Courier-New]",
  true,
  "Font-family shorthand with multi-word (dash syntax)"
);
await testProperty(
  "ff-[monospace]",
  true,
  "Font-family shorthand with generic family"
);

// Font-size - Full names
await testProperty("font-size-[16px]", true, "Font-size full name with pixels");
await testProperty("font-size-[1.2rem]", true, "Font-size full name with rem");
await testProperty("font-size-[1.5em]", true, "Font-size full name with em");
await testProperty(
  "font-size-[large]",
  true,
  "Font-size full name with keyword"
);
await testProperty(
  "font-size-[100%]",
  true,
  "Font-size full name with percentage"
);

// Font-size - Short forms
await testProperty("fs-[14px]", true, "Font-size shorthand with pixels");
await testProperty("fs-[small]", true, "Font-size shorthand with keyword");
await testProperty("fs-[1.1em]", true, "Font-size shorthand with em");

// Font-weight - Full names
await testProperty(
  "font-weight-[bold]",
  true,
  "Font-weight full name with keyword"
);
await testProperty(
  "font-weight-[400]",
  true,
  "Font-weight full name with number"
);
await testProperty(
  "font-weight-[700]",
  true,
  "Font-weight full name with bold number"
);
await testProperty(
  "font-weight-[100]",
  true,
  "Font-weight full name with thin"
);
await testProperty(
  "font-weight-[900]",
  true,
  "Font-weight full name with black"
);

// Font-weight - Short forms
await testProperty("fw-[normal]", true, "Font-weight shorthand with normal");
await testProperty("fw-[600]", true, "Font-weight shorthand with number");
await testProperty("fw-[lighter]", true, "Font-weight shorthand with relative");

// Font-style
await testProperty("font-style-[italic]", true, "Font-style with italic");
await testProperty("font-style-[normal]", true, "Font-style with normal");
await testProperty("font-style-[oblique]", true, "Font-style with oblique");

// Font-variant
await testProperty(
  "font-variant-[small-caps]",
  true,
  "Font-variant with small-caps"
);
await testProperty("font-variant-[normal]", true, "Font-variant with normal");

// Extended font properties
await testProperty(
  "font-stretch-[condensed]",
  true,
  "Font-stretch with condensed"
);
await testProperty("font-kerning-[auto]", true, "Font-kerning with auto");

// Font - Invalid values
await testProperty(
  "font-family-[123invalid]",
  false,
  "Font-family with invalid characters"
);
await testProperty("font-size-[red]", false, "Font-size with color (invalid)");
await testProperty("font-weight-[1500]", false, "Font-weight out of range");
await testProperty(
  "ff-[Times_New_Roman]",
  false,
  "Font-family with underscore (should use dash)"
);

console.log("📝 TEXT PROPERTIES");
console.log("==================");

// Line-height - Full names
await testProperty(
  "line-height-[1.5]",
  true,
  "Line-height full name with number"
);
await testProperty(
  "line-height-[20px]",
  true,
  "Line-height full name with pixels"
);
await testProperty(
  "line-height-[1.2em]",
  true,
  "Line-height full name with em"
);
await testProperty(
  "line-height-[normal]",
  true,
  "Line-height full name with keyword"
);

// Line-height - Short forms
await testProperty("lh-[1.6]", true, "Line-height shorthand with number");
await testProperty("lh-[24px]", true, "Line-height shorthand with pixels");

// Letter-spacing - Full names
await testProperty(
  "letter-spacing-[1px]",
  true,
  "Letter-spacing full name with pixels"
);
await testProperty(
  "letter-spacing-[0.1em]",
  true,
  "Letter-spacing full name with em"
);
await testProperty(
  "letter-spacing-[normal]",
  true,
  "Letter-spacing full name with normal"
);
await testProperty(
  "letter-spacing-[-1px]",
  true,
  "Letter-spacing full name with negative"
);

// Letter-spacing - Short forms
await testProperty("ls-[2px]", true, "Letter-spacing shorthand with pixels");
await testProperty("ls-[normal]", true, "Letter-spacing shorthand with normal");

// Word-spacing
await testProperty("word-spacing-[5px]", true, "Word-spacing with pixels");
await testProperty("word-spacing-[normal]", true, "Word-spacing with normal");

// Text-align - Full names
await testProperty(
  "text-align-[center]",
  true,
  "Text-align full name with center"
);
await testProperty("text-align-[left]", true, "Text-align full name with left");
await testProperty(
  "text-align-[right]",
  true,
  "Text-align full name with right"
);
await testProperty(
  "text-align-[justify]",
  true,
  "Text-align full name with justify"
);

// Text-align - Short forms
await testProperty("ta-[center]", true, "Text-align shorthand with center");
await testProperty("ta-[right]", true, "Text-align shorthand with right");

// Text-decoration - Full names
await testProperty(
  "text-decoration-[underline]",
  true,
  "Text-decoration full name with underline"
);
await testProperty(
  "text-decoration-[none]",
  true,
  "Text-decoration full name with none"
);
await testProperty(
  "text-decoration-[line-through]",
  true,
  "Text-decoration full name with line-through"
);

// Text-decoration - Short forms
await testProperty(
  "td-[overline]",
  true,
  "Text-decoration shorthand with overline"
);
await testProperty("td-[none]", true, "Text-decoration shorthand with none");

// Text-decoration sub-properties
await testProperty(
  "text-decoration-line-[underline]",
  true,
  "Text-decoration-line with underline"
);
await testProperty(
  "text-decoration-color-[red]",
  true,
  "Text-decoration-color with red"
);
await testProperty(
  "text-decoration-style-[dashed]",
  true,
  "Text-decoration-style with dashed"
);
await testProperty(
  "text-decoration-thickness-[2px]",
  true,
  "Text-decoration-thickness with pixels"
);

// Text-transform - Full names
await testProperty(
  "text-transform-[uppercase]",
  true,
  "Text-transform full name with uppercase"
);
await testProperty(
  "text-transform-[lowercase]",
  true,
  "Text-transform full name with lowercase"
);
await testProperty(
  "text-transform-[capitalize]",
  true,
  "Text-transform full name with capitalize"
);
await testProperty(
  "text-transform-[none]",
  true,
  "Text-transform full name with none"
);

// Text-transform - Short forms
await testProperty(
  "tt-[uppercase]",
  true,
  "Text-transform shorthand with uppercase"
);
await testProperty(
  "tt-[capitalize]",
  true,
  "Text-transform shorthand with capitalize"
);

// Text-indent
await testProperty("text-indent-[20px]", true, "Text-indent with pixels");
await testProperty("text-indent-[2em]", true, "Text-indent with em");
await testProperty("text-indent-[5%]", true, "Text-indent with percentage");

// Text-shadow
await testProperty(
  "text-shadow-[1px,1px,2px,black]",
  true,
  "Text-shadow with full values"
);
await testProperty(
  "text-shadow-[2px,2px,4px,rgba(0,0,0,0.5)]",
  true,
  "Text-shadow with rgba"
);
await testProperty("text-shadow-[none]", true, "Text-shadow with none");

// Text overflow and rendering
await testProperty(
  "text-overflow-[ellipsis]",
  true,
  "Text-overflow with ellipsis"
);
await testProperty("text-overflow-[clip]", true, "Text-overflow with clip");
await testProperty(
  "text-rendering-[optimizeLegibility]",
  true,
  "Text-rendering with optimize"
);

// Text - Invalid values
await testProperty(
  "text-align-[invalid]",
  false,
  "Text-align with invalid value"
);
await testProperty(
  "line-height-[red]",
  false,
  "Line-height with color (invalid)"
);
await testProperty(
  "letter-spacing-[flex]",
  false,
  "Letter-spacing with layout value (invalid)"
);

console.log("📖 CONTENT PROPERTIES");
console.log("=====================");

// Content
await testProperty(
  'content-["Hello-World"]',
  true,
  "Content with quoted string (dash syntax)"
);
await testProperty("content-[attr(title)]", true, "Content with attr function");
await testProperty(
  "content-[counter(chapter)]",
  true,
  "Content with counter function"
);
await testProperty("content-[none]", true, "Content with none");

// Quotes
await testProperty("quotes-[auto]", true, "Quotes with auto");
await testProperty("quotes-[none]", true, "Quotes with none");

console.log("🌐 WRITING MODE PROPERTIES");
console.log("==========================");

// Writing mode
await testProperty(
  "writing-mode-[horizontal-tb]",
  true,
  "Writing-mode horizontal"
);
await testProperty(
  "writing-mode-[vertical-rl]",
  true,
  "Writing-mode vertical right-left"
);
await testProperty(
  "writing-mode-[vertical-lr]",
  true,
  "Writing-mode vertical left-right"
);

// Text orientation
await testProperty("text-orientation-[mixed]", true, "Text-orientation mixed");
await testProperty(
  "text-orientation-[upright]",
  true,
  "Text-orientation upright"
);

// Direction
await testProperty("direction-[ltr]", true, "Direction left-to-right");
await testProperty("direction-[rtl]", true, "Direction right-to-left");

// Unicode bidi
await testProperty("unicode-bidi-[normal]", true, "Unicode-bidi normal");
await testProperty("unicode-bidi-[embed]", true, "Unicode-bidi embed");

console.log("📄 WHITE SPACE PROPERTIES");
console.log("=========================");

// White space
await testProperty("white-space-[normal]", true, "White-space normal");
await testProperty("white-space-[nowrap]", true, "White-space nowrap");
await testProperty("white-space-[pre]", true, "White-space pre");
await testProperty("white-space-[pre-wrap]", true, "White-space pre-wrap");

// Word break
await testProperty("word-break-[normal]", true, "Word-break normal");
await testProperty("word-break-[break-all]", true, "Word-break break-all");
await testProperty("word-break-[keep-all]", true, "Word-break keep-all");

// Word wrap / overflow wrap
await testProperty("word-wrap-[normal]", true, "Word-wrap normal");
await testProperty("word-wrap-[break-word]", true, "Word-wrap break-word");
await testProperty("overflow-wrap-[anywhere]", true, "Overflow-wrap anywhere");

// Hyphens
await testProperty("hyphens-[auto]", true, "Hyphens auto");
await testProperty("hyphens-[manual]", true, "Hyphens manual");
await testProperty("hyphens-[none]", true, "Hyphens none");

// Tab size
await testProperty("tab-size-[4]", true, "Tab-size with number");
await testProperty("tab-size-[2em]", true, "Tab-size with em");

console.log("🔬 COMPLEX & EDGE CASES");
console.log("=======================");

// CSS Functions
await testProperty(
  "font-size-[calc(16px+2vw)]",
  true,
  "Font-size with calc function"
);
await testProperty(
  "line-height-[var(--line-height)]",
  true,
  "Line-height with CSS variable"
);
await testProperty(
  "font-family-[var(--font-primary),Arial]",
  true,
  "Font-family with variable and fallback"
);

// Multiple values
await testProperty(
  "text-shadow-[1px,1px,2px,black,2px,2px,4px,gray]",
  true,
  "Multiple text-shadows"
);

// Edge cases - should fail
await testProperty("ff-[]", false, "Empty font-family value");
await testProperty("font-size-[", false, "Unclosed bracket");
await testProperty("text-align-]center[", false, "Reversed brackets");
await testProperty(
  "fs-[16px 18px]",
  false,
  "Spaces in bracket value (invalid)"
);

// Unicode/Security tests
await testProperty(
  "font-family-[Arial♥]",
  false,
  "Font-family with Unicode character (should fail)"
);
await testProperty(
  "content-[javascript:alert(1)]",
  false,
  "Content with dangerous content (should fail)"
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

console.log("\n🎯 TYPOGRAPHY CATEGORY ASSESSMENT");
console.log("=================================");
if (passedTests / totalTests >= 0.95) {
  console.log("🎉 Excellent! Typography properties have robust support.");
} else if (passedTests / totalTests >= 0.85) {
  console.log("👍 Good! Most typography properties work correctly.");
} else {
  console.log(
    "⚠️  Needs improvement. Several typography properties need fixes."
  );
}



