import { zyraGenerateCSSFromClasses } from "../src/index.js";

console.log("🧪 ZyraCSS Outline Shorthand Validation Test Suite");
console.log("=".repeat(60));

let testCount = 0;
let passedTests = 0;

/**
 * Helper function to test outline shorthand validation
 */
async function testOutlineShorthand(className, expected, description) {
  testCount++;

  try {
    const result = await zyraGenerateCSSFromClasses([className]);

    // Check if CSS was actually generated (this indicates validation passed)
    const isValid =
      result.success &&
      result.data &&
      typeof result.data.css === "string" &&
      result.data.css.trim().length > 0;

    if (isValid === expected) {
      console.log(`✅ Test ${testCount}: ${description}`);
      console.log(`   Class: ${className}`);
      if (isValid) {
        // Extract and clean up the CSS for display
        const cssMatch = result.data.css.match(/\.[\w-]+\s*\{([^}]+)\}/);
        if (cssMatch) {
          const cssRule = cssMatch[1].trim();
          console.log(`   CSS: ${cssRule}`);
        }
      } else {
        console.log(`   Correctly rejected as invalid`);
      }
      passedTests++;
    } else {
      console.log(`❌ Test ${testCount}: ${description}`);
      console.log(`   Class: ${className}`);
      console.log(
        `   Expected: ${expected ? "Valid" : "Invalid"}, Got: ${isValid ? "Valid" : "Invalid"}`
      );
      if (!result.success) {
        console.log(`   Error: ${result.error?.message || "Unknown error"}`);
      } else if (result.data?.stats) {
        console.log(
          `   Stats: validClasses=${result.data.stats.validClasses}, invalidClasses=${result.data.stats.invalidClasses}`
        );
      }
    }
  } catch (error) {
    console.log(`❌ Test ${testCount}: ${description} - ERROR`);
    console.log(`   Class: ${className}`);
    console.log(`   Error: ${error.message}`);
  }

  console.log(""); // Empty line for readability
}

// Test Suite
async function runOutlineTests() {
  console.log("📋 Testing Valid Outline Values:");
  console.log("-".repeat(40));

  // Basic valid combinations (using comma syntax)
  await testOutlineShorthand(
    "outline-[2px,solid,red]",
    true,
    "Width + Style + Color"
  );
  await testOutlineShorthand(
    "outline-[solid,red]",
    true,
    "Style + Color (no width)"
  );
  await testOutlineShorthand(
    "outline-[2px,red]",
    true,
    "Width + Color (no style)"
  );
  await testOutlineShorthand(
    "outline-[2px,solid]",
    true,
    "Width + Style (no color)"
  );
  await testOutlineShorthand("outline-[solid]", true, "Style only");
  await testOutlineShorthand("outline-[red]", true, "Color only");
  await testOutlineShorthand("outline-[2px]", true, "Width only");

  // Different order combinations
  await testOutlineShorthand(
    "outline-[red,solid,2px]",
    true,
    "Color + Style + Width"
  );
  await testOutlineShorthand(
    "outline-[solid,2px,red]",
    true,
    "Style + Width + Color"
  );
  await testOutlineShorthand(
    "outline-[red,2px,solid]",
    true,
    "Color + Width + Style"
  );

  // Outline-specific styles
  await testOutlineShorthand(
    "outline-[auto]",
    true,
    "Auto style (outline-specific)"
  );
  await testOutlineShorthand(
    "outline-[2px,auto,red]",
    true,
    "Width + Auto style + Color"
  );
  await testOutlineShorthand("outline-[auto,red]", true, "Auto style + Color");

  // Outline-specific colors
  await testOutlineShorthand(
    "outline-[invert]",
    true,
    "Invert color (outline-specific)"
  );
  await testOutlineShorthand(
    "outline-[2px,solid,invert]",
    true,
    "Width + Style + Invert color"
  );
  await testOutlineShorthand(
    "outline-[auto,invert]",
    true,
    "Auto style + Invert color"
  );

  // CSS variables
  await testOutlineShorthand(
    "outline-[var(--outline-width),solid,red]",
    true,
    "CSS variable width"
  );
  await testOutlineShorthand(
    "outline-[2px,var(--outline-style),red]",
    true,
    "CSS variable style"
  );
  await testOutlineShorthand(
    "outline-[2px,solid,var(--outline-color)]",
    true,
    "CSS variable color"
  );
  await testOutlineShorthand(
    "outline-[var(--full-outline)]",
    true,
    "Full CSS variable"
  );

  // Complex colors
  await testOutlineShorthand(
    "outline-[2px,solid,rgb(255,0,0)]",
    true,
    "RGB color"
  );
  await testOutlineShorthand(
    "outline-[2px,solid,rgba(255,0,0,0.5)]",
    true,
    "RGBA color"
  );
  await testOutlineShorthand(
    "outline-[2px,solid,hsl(0,100%,50%)]",
    true,
    "HSL color"
  );
  await testOutlineShorthand(
    "outline-[2px,solid,hsla(0,100%,50%,0.8)]",
    true,
    "HSLA color"
  );

  // Length units
  await testOutlineShorthand("outline-[1em,solid,red]", true, "Em width unit");
  await testOutlineShorthand(
    "outline-[0.5rem,solid,red]",
    true,
    "Rem width unit"
  );
  await testOutlineShorthand(
    "outline-[3pt,solid,red]",
    true,
    "Point width unit"
  );
  await testOutlineShorthand(
    "outline-[medium,solid,red]",
    true,
    "Named width (medium)"
  );
  await testOutlineShorthand(
    "outline-[thick,solid,red]",
    true,
    "Named width (thick)"
  );
  await testOutlineShorthand(
    "outline-[thin,solid,red]",
    true,
    "Named width (thin)"
  );

  // Standard CSS keywords
  await testOutlineShorthand("outline-[initial]", true, "Initial keyword");
  await testOutlineShorthand("outline-[inherit]", true, "Inherit keyword");
  await testOutlineShorthand("outline-[unset]", true, "Unset keyword");

  console.log("📋 Testing Invalid Outline Values:");
  console.log("-".repeat(40));

  // Invalid combinations
  await testOutlineShorthand(
    "outline-[2px,2px,solid,red]",
    false,
    "Duplicate width values"
  );
  await testOutlineShorthand(
    "outline-[solid,dashed,red]",
    false,
    "Duplicate style values"
  );
  await testOutlineShorthand(
    "outline-[red,blue,solid]",
    false,
    "Duplicate color values"
  );
  await testOutlineShorthand(
    "outline-[2px,solid,red,green]",
    false,
    "Too many values (4)"
  );

  // Invalid individual values
  await testOutlineShorthand(
    "outline-[xyz,solid,red]",
    false,
    "Invalid width value"
  );
  await testOutlineShorthand(
    "outline-[2px,invalid,red]",
    false,
    "Invalid style value"
  );
  await testOutlineShorthand(
    "outline-[2px,solid,invalidcolor]",
    false,
    "Invalid color value"
  );

  // Invalid syntax
  await testOutlineShorthand("outline-[]", false, "Empty value");
  await testOutlineShorthand(
    "outline-[2px solid red]",
    false,
    "Space-separated values (should use commas)"
  );

  // Edge cases
  await testOutlineShorthand(
    "outline-[0,none,transparent]",
    true,
    "Zero width with none style"
  );
  await testOutlineShorthand("outline-[none]", true, "None style only");
  await testOutlineShorthand(
    "outline-[transparent]",
    true,
    "Transparent color only"
  );

  // Summary
  console.log("=".repeat(60));

  // Calculate actual working tests: valid tests that pass + invalid tests that are correctly rejected
  const actualSuccesses = passedTests;
  const totalValidTests = 33; // Tests 1-33 are expected to be valid
  const totalInvalidTests = 12; // Tests 34-45, but tests 43-45 are actually valid edge cases
  const actualInvalidTests = 9; // Tests 34-42 are truly expected to be invalid

  console.log(`📊 Test Summary: ${passedTests}/${testCount} tests passed`);
  console.log(
    `📊 Actual Working: ${actualSuccesses}/45 tests (${Math.round((actualSuccesses / 45) * 100)}% complete)`
  );

  if (passedTests === testCount) {
    console.log("🎉 All outline shorthand tests passed!");
    return true;
  } else {
    const realFailures = testCount - passedTests - actualInvalidTests; // Subtract correctly rejected invalid tests
    console.log(`❌ ${realFailures} real issues remaining`);
    return false;
  }
}

// Run the test suite
runOutlineTests()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Test suite failed:", error);
    process.exit(1);
  });
