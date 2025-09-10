/**
 * Border Shorthand Validation Test
 * Tests for proper border shorthand validation according to CSS specification
 */

import { zyraGenerateCSS } from "../src/index.js";

console.log("🔲 Border Shorthand Validation Test");
console.log("===================================");

const testCases = [
  // Valid cases - basic combinations
  {
    class: "border-[1px,solid,red]",
    expected: true,
    description: "Valid: width, style, color",
  },
  {
    class: "border-[solid,1px,red]",
    expected: true,
    description: "Valid: style, width, color (order doesn't matter)",
  },
  {
    class: "border-[red,solid,2px]",
    expected: true,
    description: "Valid: color, style, width",
  },

  // Valid cases - two values
  {
    class: "border-[1px,solid]",
    expected: true,
    description: "Valid: width, style only",
  },
  {
    class: "border-[solid,red]",
    expected: true,
    description: "Valid: style, color only",
  },
  {
    class: "border-[1px,red]",
    expected: true,
    description: "Valid: width, color only",
  },

  // Valid cases - single values
  { class: "border-[solid]", expected: true, description: "Valid: style only" },
  { class: "border-[red]", expected: true, description: "Valid: color only" },
  { class: "border-[2px]", expected: true, description: "Valid: width only" },
  { class: "border-[0]", expected: true, description: "Valid: zero width" },

  // Valid cases - keywords
  {
    class: "border-[none]",
    expected: true,
    description: "Valid: none keyword",
  },
  {
    class: "border-[thin,dashed,blue]",
    expected: true,
    description: "Valid: thin width keyword",
  },
  {
    class: "border-[medium,dotted,#ff0000]",
    expected: true,
    description: "Valid: medium width, hex color",
  },
  {
    class: "border-[thick,double,rgba(0,0,0,0.5)]",
    expected: true,
    description: "Valid: thick width, rgba color",
  },

  // Valid cases - more color formats
  {
    class: "border-[1px,solid,#abc]",
    expected: true,
    description: "Valid: 3-digit hex color",
  },
  {
    class: "border-[1px,solid,hsl(120,50%,50%)]",
    expected: true,
    description: "Valid: HSL color",
  },
  {
    class: "border-[1px,solid,currentcolor]",
    expected: true,
    description: "Valid: currentcolor keyword",
  },
  {
    class: "border-[1px,solid,transparent]",
    expected: true,
    description: "Valid: transparent keyword",
  },

  // Valid cases - all border styles
  {
    class: "border-[1px,hidden,red]",
    expected: true,
    description: "Valid: hidden style",
  },
  {
    class: "border-[1px,dotted,red]",
    expected: true,
    description: "Valid: dotted style",
  },
  {
    class: "border-[1px,dashed,red]",
    expected: true,
    description: "Valid: dashed style",
  },
  {
    class: "border-[1px,double,red]",
    expected: true,
    description: "Valid: double style",
  },
  {
    class: "border-[1px,groove,red]",
    expected: true,
    description: "Valid: groove style",
  },
  {
    class: "border-[1px,ridge,red]",
    expected: true,
    description: "Valid: ridge style",
  },
  {
    class: "border-[1px,inset,red]",
    expected: true,
    description: "Valid: inset style",
  },
  {
    class: "border-[1px,outset,red]",
    expected: true,
    description: "Valid: outset style",
  },

  // Invalid cases - main issue to fix
  {
    class: "border-[1px,sandipan,red]",
    expected: false,
    description: "Invalid: 'sandipan' is not a border style",
  },

  // Invalid cases - duplicates
  {
    class: "border-[solid,solid,red]",
    expected: false,
    description: "Invalid: duplicate style values",
  },
  {
    class: "border-[1px,2px,red]",
    expected: false,
    description: "Invalid: duplicate width values",
  },
  {
    class: "border-[red,blue,solid]",
    expected: false,
    description: "Invalid: duplicate color values",
  },

  // Invalid cases - too many values
  {
    class: "border-[1px,solid,red,blue]",
    expected: false,
    description: "Invalid: more than 3 values",
  },
  {
    class: "border-[1px,solid,red,2px,blue]",
    expected: false,
    description: "Invalid: way too many values",
  },

  // Invalid cases - unknown values
  {
    class: "border-[invalid,solid,red]",
    expected: false,
    description: "Invalid: 'invalid' is not a valid border value",
  },
  {
    class: "border-[1px,unknownstyle,red]",
    expected: false,
    description: "Invalid: 'unknownstyle' is not a valid border style",
  },
  {
    class: "border-[1px,solid,notacolor]",
    expected: false,
    description: "Invalid: 'notacolor' is not a valid color",
  },

  // Invalid cases - negative values
  {
    class: "border-[-1px,solid,red]",
    expected: false,
    description: "Invalid: negative width",
  },
  {
    class: "border-[-5em,solid,red]",
    expected: false,
    description: "Invalid: negative width with em unit",
  },

  // Invalid cases - empty values
  {
    class: "border-[,solid,red]",
    expected: false,
    description: "Invalid: empty value part",
  },
  {
    class: "border-[1px,,red]",
    expected: false,
    description: "Invalid: empty middle value",
  },
  {
    class: "border-[1px,solid,]",
    expected: false,
    description: "Invalid: empty last value",
  },

  // Edge cases
  {
    class: "border-[]",
    expected: false,
    description: "Invalid: completely empty",
  },
  {
    class: "border-[,,,]",
    expected: false,
    description: "Invalid: only commas",
  },
];

async function runBorderShorthandTest() {
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      const result = await zyraGenerateCSS([testCase.class]);
      const hasCSS = !!(
        result.success &&
        result.data.css &&
        result.data.css.trim().length > 0
      );
      const hasErrors =
        !result.success ||
        (result.data.invalid && result.data.invalid.length > 0);
      const actuallyPassed = hasCSS && !hasErrors;

      if (actuallyPassed === testCase.expected) {
        console.log(`✅ ${testCase.description}`);
        if (actuallyPassed) {
          console.log(`   → Generated CSS: ${result.data.css.trim()}`);
        }
        passed++;
      } else {
        console.log(`❌ ${testCase.description}`);
        console.log(
          `   Expected: ${testCase.expected ? "pass" : "fail"}, Got: ${actuallyPassed ? "pass" : "fail"}`
        );
        if (
          result.data &&
          result.data.invalid &&
          result.data.invalid.length > 0
        ) {
          console.log(
            `   → Errors: ${result.data.invalid.map((e) => e.message || e.reason || e).join(", ")}`
          );
        }
        if (hasCSS) {
          console.log(`   → Generated CSS: ${result.data.css.trim()}`);
        }
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${testCase.description} (threw error: ${error.message})`);
      console.log(`   → Error details: ${error.stack}`);
      failed++;
    }
    console.log("");
  }

  console.log(`📊 Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log("🎉 All border shorthand validation tests passed!");
  } else {
    console.log(
      `⚠️  ${failed} test(s) failed. Border shorthand validation needs attention.`
    );
  }
}

// Run the test
runBorderShorthandTest().catch(console.error);
