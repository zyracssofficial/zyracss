/**
 * ZyraCSS Print Properties Test Suite
 * Tests all print properties from print.js map with various value types
 */

import { zyraGenerateCSS } from "../../src/index.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log("📦 ZyraCSS Print Properties Test Suite");
console.log("=====================================\n");

/**
 * Test a print property with expected result
 */
async function testProperty(
  className,
  shouldPass,
  description,
  category = "print"
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
          `   → Invalid classes: ${result.data.invalid.map((inv) => inv.className).join(", ")}`
        );
      }
      failedTests++;
    }
  } catch (error) {
    console.log(`❌ ${description} (Error: ${error.message})`);
    failedTests++;
  }

  console.log();
}

// ================================
// Page Properties
// ================================

console.log("🔸 PAGE PROPERTIES");
console.log("==================");

// Page property
await testProperty("page-[auto]", true, "Page: auto");
await testProperty("page-[print]", true, "Page: print");
await testProperty("page-[named-page]", true, "Page: named page");

// ================================
// Page Break Properties
// ================================

console.log("🔸 PAGE BREAK PROPERTIES");
console.log("========================");

// Page break before
await testProperty("page-break-before-[auto]", true, "Page break before: auto");
await testProperty(
  "page-break-before-[always]",
  true,
  "Page break before: always"
);
await testProperty("page-break-before-[left]", true, "Page break before: left");
await testProperty(
  "page-break-before-[right]",
  true,
  "Page break before: right"
);
await testProperty(
  "page-break-before-[avoid]",
  true,
  "Page break before: avoid"
);

// Page break after
await testProperty("page-break-after-[auto]", true, "Page break after: auto");
await testProperty(
  "page-break-after-[always]",
  true,
  "Page break after: always"
);
await testProperty("page-break-after-[left]", true, "Page break after: left");
await testProperty("page-break-after-[right]", true, "Page break after: right");
await testProperty("page-break-after-[avoid]", true, "Page break after: avoid");

// Page break inside
await testProperty("page-break-inside-[auto]", true, "Page break inside: auto");
await testProperty(
  "page-break-inside-[avoid]",
  true,
  "Page break inside: avoid"
);

// ================================
// Orphans & Widows
// ================================

console.log("🔸 ORPHANS & WIDOWS");
console.log("==================");

// Orphans (minimum lines at bottom of page)
await testProperty("orphans-[2]", true, "Orphans: 2");
await testProperty("orphans-[3]", true, "Orphans: 3");
await testProperty("orphans-[inherit]", true, "Orphans: inherit");

// Widows (minimum lines at top of page)
await testProperty("widows-[2]", true, "Widows: 2");
await testProperty("widows-[3]", true, "Widows: 3");
await testProperty("widows-[inherit]", true, "Widows: inherit");

// ================================
// Invalid Test Cases
// ================================

console.log("🔸 INVALID CASES");
console.log("================");

// Invalid values should fail
await testProperty(
  "page-[123invalid]",
  false,
  "Page: invalid identifier starting with number (should fail)"
);
await testProperty(
  "orphans-[invalid]",
  false,
  "Orphans: invalid (should fail)"
);
await testProperty("widows-[auto]", false, "Widows: auto (should fail)");

// ================================
// SUMMARY
// ================================

console.log("🏆 PRINT PROPERTIES TEST SUMMARY");
console.log("================================");
console.log(`Total tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (failedTests === 0) {
  console.log("\n🎉 All print property tests passed!");
} else {
  console.log(`\n⚠️  ${failedTests} tests failed`);
  // Don't exit with error code to allow quick_category_check to continue
}
