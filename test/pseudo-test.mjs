/**
 * Pseudo-Class and Pseudo-Element Test
 * Tests the modifier system for :hover, ::before, etc.
 */

import { zyraGenerateCSS } from "../src/index.js";

console.log("🎭 ZyraCSS Pseudo-Class & Pseudo-Element Test");
console.log("================================================");

// Test cases for pseudo-classes and pseudo-elements
const testCases = [
  // Pseudo-classes
  { input: "hover:bg-[red]", description: "Hover pseudo-class" },
  { input: "focus:border-[2px,solid,blue]", description: "Focus pseudo-class" },
  {
    input: "active:transform-[scale(0.95)]",
    description: "Active pseudo-class",
  },
  { input: "disabled:opacity-[0.5]", description: "Disabled pseudo-class" },
  { input: "checked:bg-[green]", description: "Checked pseudo-class" },
  { input: "first-child:margin-[0]", description: "First-child pseudo-class" },
  { input: "last-child:margin-[0]", description: "Last-child pseudo-class" },

  // Pseudo-elements
  { input: 'before:content-[""]', description: "Before pseudo-element" },
  { input: 'after:content-["→"]', description: "After pseudo-element" },
  {
    input: "first-line:font-weight-[bold]",
    description: "First-line pseudo-element",
  },
  {
    input: "first-letter:font-size-[2em]",
    description: "First-letter pseudo-element",
  },
  {
    input: "placeholder:color-[gray]",
    description: "Placeholder pseudo-element",
  },
  {
    input: "selection:bg-[highlight]",
    description: "Selection pseudo-element",
  },

  // Combined modifiers
  { input: "md:hover:bg-[blue]", description: "Responsive + Hover" },
  {
    input: "lg:focus:border-[3px,solid,green]",
    description: "Responsive + Focus",
  },

  // Invalid cases (should fail)
  {
    input: "invalid-pseudo:bg-[red]",
    description: "Invalid pseudo-class (should fail)",
  },
  {
    input: "unknown-element:color-[blue]",
    description: "Invalid pseudo-element (should fail)",
  },
];

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  try {
    const result = await zyraGenerateCSS([testCase.input]);

    const shouldFail = testCase.description.includes("should fail");
    const actuallyFailed =
      !result.success || !result.data.css || result.data.css.trim() === "";

    if (shouldFail) {
      if (actuallyFailed) {
        console.log(`✅ ${testCase.description}`);
        console.log(`   → Correctly rejected: ${testCase.input}`);
        passed++;
      } else {
        console.log(`❌ ${testCase.description}`);
        console.log(`   → Should have failed but passed: ${testCase.input}`);
        console.log(`   → Generated: ${result.data.css.substring(0, 100)}...`);
        failed++;
      }
    } else {
      if (!actuallyFailed) {
        console.log(`✅ ${testCase.description}`);
        console.log(
          `   → ${result.data.css.replace(/\n/g, " ").substring(0, 80)}...`
        );
        passed++;
      } else {
        console.log(`❌ ${testCase.description}`);
        console.log(`   → Failed to generate CSS for: ${testCase.input}`);
        if (
          result.data &&
          result.data.invalid &&
          result.data.invalid.length > 0
        ) {
          console.log(`   → Error: ${result.data.invalid[0].error}`);
        }
        failed++;
      }
    }
  } catch (error) {
    console.log(`❌ ${testCase.description}`);
    console.log(`   → Exception: ${error.message}`);
    failed++;
  }

  console.log("");
}

console.log("📊 TEST RESULTS SUMMARY");
console.log("=======================");
console.log(`Total tests: ${testCases.length}`);
console.log(
  `✅ Passed: ${passed} (${((passed / testCases.length) * 100).toFixed(1)}%)`
);
console.log(
  `❌ Failed: ${failed} (${((failed / testCases.length) * 100).toFixed(1)}%)`
);

if (failed > 0) {
  console.log("");
  console.log("⚠️ Some pseudo-class/pseudo-element tests failed");
  process.exit(1);
} else {
  console.log("");
  console.log("🎉 All pseudo-class/pseudo-element tests passed!");
}
