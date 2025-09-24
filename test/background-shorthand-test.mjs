/**
 * Background Validation Test Suite
 * Tests various background property scenarios to validate implementation
 */

import { zyra } from "../src/index.js";

// Test cases for background validation
const backgroundTests = [
  // Basic color values
  {
    class: "bg-[red]",
    expected: "background: red;",
    description: "Basic color name",
  },
  {
    class: "bg-[#ff0000]",
    expected: "background: #ff0000;",
    description: "Hex color",
  },
  {
    class: "bg-[#f00]",
    expected: "background: #ff0000;",
    description: "Short hex color (normalized to full hex)",
  },
  {
    class: "bg-[rgb(255,0,0)]",
    expected: "background: rgb(255, 0, 0);",
    description: "RGB function",
  },
  {
    class: "bg-[rgba(255,0,0,0.5)]",
    expected: "background: rgba(255, 0, 0, 0.5);",
    description: "RGBA function",
  },
  {
    class: "bg-[hsl(0,100%,50%)]",
    expected: "background: hsl(0, 100%, 50%);",
    description: "HSL function",
  },
  {
    class: "bg-[hsla(0,100%,50%,0.8)]",
    expected: "background: hsla(0, 100%, 50%, 0.8);",
    description: "HSLA function",
  },

  // Keywords
  {
    class: "bg-[transparent]",
    expected: "background: transparent;",
    description: "Transparent keyword",
  },
  {
    class: "bg-[none]",
    expected: "background: none;",
    description: "None keyword",
  },
  {
    class: "bg-[inherit]",
    expected: "background: inherit;",
    description: "Inherit keyword",
  },
  {
    class: "bg-[initial]",
    expected: "background: initial;",
    description: "Initial keyword",
  },

  // URL/Image values
  {
    class: "bg-[u(image.jpg)]",
    expected: "background: url('image.jpg');",
    description: "Image URL with u() function",
  },
  {
    class: "bg-[u(https://example.com/bg.png)]",
    expected: "background: url('https://example.com/bg.png');",
    description: "Full URL with u() function",
  },

  // Gradients
  {
    class: "bg-[linear-gradient(to-right,red,blue)]",
    expected: "background: linear-gradient(to-right, red, blue);",
    description: "Linear gradient",
  },
  {
    class: "bg-[linear-gradient(45deg,#ff0000,#0000ff)]",
    expected: "background: linear-gradient(45deg, #ff0000, #0000ff);",
    description: "Linear gradient with angle",
  },
  {
    class: "bg-[radial-gradient(circle,red,blue)]",
    expected: "background: radial-gradient(circle, red, blue);",
    description: "Radial gradient",
  },

  // Background shorthand combinations (comma-separated in ZyraCSS)
  {
    class: "bg-[u(image.jpg),no-repeat,center]",
    expected: "background: url('image.jpg') no-repeat center;",
    description: "Image with position and repeat",
  },
  {
    class: "bg-[linear-gradient(to-bottom,red,blue),no-repeat]",
    expected: "background: linear-gradient(to-bottom, red, blue) no-repeat;",
    description: "Gradient with repeat",
  },
  {
    class: "bg-[red,u(pattern.png),repeat-x]",
    expected: "background: red url('pattern.png') repeat-x;",
    description: "Color with image and repeat",
  },
  {
    class: "bg-[#fff,u(overlay.png),50%,25%,no-repeat]",
    expected: "background: #fff url('overlay.png') 50% 25% no-repeat;",
    description: "Complex background shorthand",
  },

  // CSS Variables
  {
    class: "bg-[var(--primary-color)]",
    expected: "background: var(--primary-color);",
    description: "CSS variable",
  },
  {
    class: "bg-[var(--bg-image,u(fallback.jpg))]",
    expected: "background: var(--bg-image, url('fallback.jpg'));",
    description: "CSS variable with fallback",
  },

  // Advanced CSS functions
  {
    class: "bg-[calc(100%-20px)]",
    expected: "background: calc(100% - 20px);",
    description: "Calc function",
  },

  // Multiple background layers (should handle comma-separation correctly)
  {
    class: "bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),u(hero.jpg)]",
    expected:
      "background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)) url('hero.jpg');",
    description: "Overlay gradient with background image (properly spaced)",
  },

  // Invalid cases (should fail)
  {
    class: "bg-[123invalid]",
    expected: null,
    description: "Invalid value starting with number",
  },
  {
    class: "bg-[<script>]",
    expected: null,
    description: "Security threat",
  },
  {
    class: "bg-[]",
    expected: null,
    description: "Empty brackets",
  },
  {
    class: "bg-[javascript:alert(1)]",
    expected: null,
    description: "JavaScript injection attempt",
  },
];

console.log("🎨 Background Validation Test Suite");
console.log("===================================\n");

let passed = 0;
let failed = 0;
let total = backgroundTests.length;

async function runTests() {
  for (const test of backgroundTests) {
    console.log(`📋 Testing: ${test.description}`);
    console.log(`   Class: ${test.class}`);

    try {
      const result = zyra.generate([test.class]);

      if (test.expected === null) {
        // This should fail
        if (
          !result.success ||
          !result.data?.css ||
          result.data.css.trim() === ""
        ) {
          console.log(`   ✅ PASS - Correctly rejected invalid value`);
          passed++;
        } else {
          console.log(`   ❌ FAIL - Should have rejected: "${test.class}"`);
          console.log(`   Generated: ${result.data.css.trim()}`);
          failed++;
        }
      } else {
        // This should succeed
        if (result.success && result.data?.css) {
          const actualCSS = result.data.css.trim();

          if (actualCSS.includes(test.expected)) {
            console.log(`   ✅ PASS - Generated correct CSS`);
            console.log(`   → ${actualCSS}`);
            passed++;
          } else {
            console.log(`   ❌ FAIL - CSS mismatch`);
            console.log(`   Expected: ${test.expected}`);
            console.log(`   Actual: ${actualCSS}`);
            failed++;
          }
        } else {
          console.log(
            `   ❌ FAIL - API returned error: ${result.error || "Unknown error"}`
          );
          failed++;
        }
      }
    } catch (error) {
      if (test.expected === null) {
        console.log(`   ✅ PASS - Correctly threw error for invalid value`);
        passed++;
      } else {
        console.log(`   ❌ FAIL - Unexpected error: ${error.message}`);
        failed++;
      }
    }

    console.log("");
  }

  console.log("📊 Test Results Summary");
  console.log("======================");
  console.log(`Total tests: ${total}`);
  console.log(`✅ Passed: ${passed} (${((passed / total) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${failed} (${((failed / total) * 100).toFixed(1)}%)`);

  if (failed === 0) {
    console.log(
      "\n🎉 All background tests passed! Background implementation is working correctly."
    );
  } else {
    console.log(
      `\n⚠️  ${failed} test(s) failed. Background implementation needs attention.`
    );
  }

  // Additional validation tests
  console.log("\n🔍 Additional Background Property Validation Tests");
  console.log("=================================================\n");

  // Test different background sub-properties to ensure they work
  const subPropertyTests = [
    { class: "background-[red]", property: "background" },
    { class: "background-color-[blue]", property: "background-color" },
    { class: "background-image-[u(test.jpg)]", property: "background-image" },
    { class: "background-repeat-[no-repeat]", property: "background-repeat" },
    { class: "background-position-[center]", property: "background-position" },
    { class: "background-size-[cover]", property: "background-size" },
    {
      class: "background-attachment-[fixed]",
      property: "background-attachment",
    },
  ];

  for (const test of subPropertyTests) {
    console.log(`🔧 Testing ${test.property} with class: ${test.class}`);

    try {
      const result = zyra.generate([test.class]);

      if (result.success && result.data?.css) {
        const css = result.data.css.trim();
        console.log(`   ✅ PASS - ${test.property} generated correctly`);
        console.log(`   → ${css}`);
      } else {
        console.log(`   ❌ FAIL - ${test.property} not generated`);
        console.log(`   Result: ${result.error || "No CSS generated"}`);
      }
    } catch (error) {
      console.log(`   ❌ ERROR - ${error.message}`);
    }

    console.log("");
  }
}

// Run the tests
runTests().catch(console.error);

