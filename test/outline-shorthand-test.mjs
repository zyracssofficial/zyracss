import { zyra } from "../src/index.js";

console.log("🧪 ZyraCSS Outline Shorthand Validation Test Suite");
console.log("=".repeat(60));

let testCount = 0;
let passedTests = 0;

/**
 * Helper function to test outline shorthand validation
 */
function testOutlineShorthand(className, expected, description) {
  testCount++;

  try {
    const result = zyra.generate([className]);

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
function runOutlineTests() {
  console.log("📋 Testing Valid Outline Values:");
  console.log("-".repeat(40));

  // Basic valid combinations (using comma syntax)
  testOutlineShorthand(
    "outline-[2px,solid,red]",
    true,
    "Width + Style + Color"
  );
  testOutlineShorthand("outline-[solid,red]", true, "Style + Color (no width)");
  testOutlineShorthand("outline-[2px,red]", true, "Width + Color (no style)");
  testOutlineShorthand("outline-[2px,solid]", true, "Width + Style (no color)");
  testOutlineShorthand("outline-[solid]", true, "Style only");
  testOutlineShorthand("outline-[red]", true, "Color only");
  testOutlineShorthand("outline-[2px]", true, "Width only");

  // Different order combinations
  testOutlineShorthand(
    "outline-[red,solid,2px]",
    true,
    "Color + Style + Width"
  );
  testOutlineShorthand(
    "outline-[solid,2px,red]",
    true,
    "Style + Width + Color"
  );
  testOutlineShorthand(
    "outline-[red,2px,solid]",
    true,
    "Color + Width + Style"
  );

  // Outline-specific styles
  testOutlineShorthand("outline-[auto]", true, "Auto style (outline-specific)");
  testOutlineShorthand(
    "outline-[2px,auto,red]",
    true,
    "Width + Auto style + Color"
  );
  testOutlineShorthand("outline-[auto,red]", true, "Auto style + Color");

  // Outline-specific colors
  testOutlineShorthand(
    "outline-[invert]",
    true,
    "Invert color (outline-specific)"
  );
  testOutlineShorthand(
    "outline-[2px,solid,invert]",
    true,
    "Width + Style + Invert color"
  );
  testOutlineShorthand(
    "outline-[auto,invert]",
    true,
    "Auto style + Invert color"
  );

  // CSS variables
  testOutlineShorthand(
    "outline-[var(--outline-width),solid,red]",
    true,
    "CSS variable width"
  );
  testOutlineShorthand(
    "outline-[2px,var(--outline-style),red]",
    true,
    "CSS variable style"
  );
  testOutlineShorthand(
    "outline-[2px,solid,var(--outline-color)]",
    true,
    "CSS variable color"
  );
  testOutlineShorthand(
    "outline-[var(--full-outline)]",
    true,
    "Full CSS variable"
  );

  // Complex colors
  testOutlineShorthand("outline-[2px,solid,rgb(255,0,0)]", true, "RGB color");
  testOutlineShorthand(
    "outline-[2px,solid,rgba(255,0,0,0.5)]",
    true,
    "RGBA color"
  );
  testOutlineShorthand(
    "outline-[2px,solid,hsl(0,100%,50%)]",
    true,
    "HSL color"
  );
  testOutlineShorthand(
    "outline-[2px,solid,hsla(0,100%,50%,0.8)]",
    true,
    "HSLA color"
  );

  // Length units
  testOutlineShorthand("outline-[1em,solid,red]", true, "Em width unit");
  testOutlineShorthand("outline-[0.5rem,solid,red]", true, "Rem width unit");
  testOutlineShorthand("outline-[3pt,solid,red]", true, "Point width unit");
  testOutlineShorthand(
    "outline-[medium,solid,red]",
    true,
    "Named width (medium)"
  );
  testOutlineShorthand(
    "outline-[thick,solid,red]",
    true,
    "Named width (thick)"
  );
  testOutlineShorthand("outline-[thin,solid,red]", true, "Named width (thin)");

  // Standard CSS keywords
  testOutlineShorthand("outline-[initial]", true, "Initial keyword");
  testOutlineShorthand("outline-[inherit]", true, "Inherit keyword");
  testOutlineShorthand("outline-[unset]", true, "Unset keyword");

  console.log("📋 Testing Invalid Outline Values:");
  console.log("-".repeat(40));

  // Invalid combinations
  testOutlineShorthand(
    "outline-[2px,2px,solid,red]",
    false,
    "Duplicate width values"
  );
  testOutlineShorthand(
    "outline-[solid,dashed,red]",
    false,
    "Duplicate style values"
  );
  testOutlineShorthand(
    "outline-[red,blue,solid]",
    false,
    "Duplicate color values"
  );
  testOutlineShorthand(
    "outline-[2px,solid,red,green]",
    false,
    "Too many values (4)"
  );

  // Invalid individual values
  testOutlineShorthand("outline-[xyz,solid,red]", false, "Invalid width value");
  testOutlineShorthand(
    "outline-[2px,invalid,red]",
    false,
    "Invalid style value"
  );
  testOutlineShorthand(
    "outline-[2px,solid,invalidcolor]",
    false,
    "Invalid color value"
  );

  // Invalid syntax
  testOutlineShorthand("outline-[]", false, "Empty value");
  testOutlineShorthand(
    "outline-[2px solid red]",
    false,
    "Space-separated values (should use commas)"
  );

  // Edge cases
  testOutlineShorthand(
    "outline-[0,none,transparent]",
    true,
    "Zero width with none style"
  );
  testOutlineShorthand("outline-[none]", true, "None style only");
  testOutlineShorthand("outline-[transparent]", true, "Transparent color only");

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
try {
  const success = runOutlineTests();
  process.exit(success ? 0 : 1);
} catch (error) {
  console.error("Test suite failed:", error);
  process.exit(1);
}
