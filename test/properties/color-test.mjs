/**
 * ZyraCSS Color Properties Test Suite
 * Tests all color properties from color.js map with various value types
 */

import { zyra } from "../../src/index.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log("🎯 ZyraCSS Color Properties Test Suite");
console.log("======================================\n");

/**
 * Test a color property with expected result
 */
function testProperty(
  className,
  shouldPass,
  description,
  category = "color"
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

console.log("🎨 TEXT COLOR PROPERTIES");
console.log("========================");

// Color - Full names
await testProperty("color-[red]", true, "Color full name with named color");
await testProperty("color-[blue]", true, "Color full name with blue");
await testProperty(
  "color-[#ff0000]",
  true,
  "Color full name with hex (6 digits)"
);
await testProperty("color-[#f00]", true, "Color full name with hex (3 digits)");
await testProperty(
  "color-[rgb(255,0,0)]",
  true,
  "Color full name with RGB function"
);
await testProperty(
  "color-[rgba(255,0,0,0.5)]",
  true,
  "Color full name with RGBA function"
);
await testProperty(
  "color-[hsl(0,100%,50%)]",
  true,
  "Color full name with HSL function"
);
await testProperty(
  "color-[hsla(0,100%,50%,0.8)]",
  true,
  "Color full name with HSLA function"
);

// Color - Short forms
await testProperty("c-[green]", true, "Color shorthand with named color");
await testProperty("c-[#00ff00]", true, "Color shorthand with hex");
await testProperty("c-[rgb(0,255,0)]", true, "Color shorthand with RGB");
await testProperty("c-[hsl(120,100%,50%)]", true, "Color shorthand with HSL");

// Color with CSS keywords
await testProperty("color-[transparent]", true, "Color with transparent");
await testProperty("c-[currentcolor]", true, "Color with currentcolor");
await testProperty("color-[inherit]", true, "Color with inherit");
await testProperty("c-[initial]", true, "Color with initial");

// Color - Invalid values
await testProperty("color-[invalid]", false, "Color with invalid keyword");
await testProperty("c-[123]", false, "Color with just numbers");
await testProperty(
  "color-[#gggggg]",
  false,
  "Color with invalid hex characters"
);
await testProperty(
  "c-[rgb(300,0,0)]",
  false,
  "Color with RGB values out of range"
);

console.log("🖼️  BACKGROUND PROPERTIES");
console.log("=========================");

// Background - Full names
await testProperty("background-[red]", true, "Background full name with color");
await testProperty(
  "background-[#0066cc]",
  true,
  "Background full name with hex"
);
await testProperty(
  "background-[u(image.jpg)]",
  true,
  "Background full name with image"
);
await testProperty(
  "background-[linear-gradient(to-right,red,blue)]",
  true,
  "Background full name with gradient"
);
await testProperty(
  "background-[radial-gradient(circle,red,blue)]",
  true,
  "Background full name with radial gradient"
);

// Background - Short forms
await testProperty("bg-[blue]", true, "Background shorthand with color");
await testProperty("bg-[#ff6600]", true, "Background shorthand with hex");
await testProperty("bg-[u(bg.png)]", true, "Background shorthand with image");
await testProperty(
  "bg-[linear-gradient(45deg,red,yellow)]",
  true,
  "Background shorthand with gradient"
);

// Background-color - Full and short forms
await testProperty(
  "background-color-[yellow]",
  true,
  "Background-color full name"
);
await testProperty("bg-color-[purple]", true, "Background-color shorthand");
await testProperty(
  "background-color-[rgba(255,255,255,0.9)]",
  true,
  "Background-color with RGBA"
);

// Background sub-properties
await testProperty(
  "background-image-[u(texture.jpg)]",
  true,
  "Background-image with URL"
);
await testProperty(
  "background-position-[center]",
  true,
  "Background-position center"
);
await testProperty(
  "background-position-[top,left]",
  true,
  "Background-position with coordinates"
);
await testProperty("background-size-[cover]", true, "Background-size cover");
await testProperty(
  "background-size-[100px,200px]",
  true,
  "Background-size with dimensions"
);
await testProperty(
  "background-repeat-[no-repeat]",
  true,
  "Background-repeat no-repeat"
);
await testProperty(
  "background-repeat-[repeat-x]",
  true,
  "Background-repeat repeat-x"
);
await testProperty(
  "background-attachment-[fixed]",
  true,
  "Background-attachment fixed"
);
await testProperty(
  "background-origin-[padding-box]",
  true,
  "Background-origin padding-box"
);
await testProperty(
  "background-clip-[border-box]",
  true,
  "Background-clip border-box"
);
await testProperty(
  "background-blend-mode-[multiply]",
  true,
  "Background-blend-mode multiply"
);

// Background - Invalid values
await testProperty(
  "background-[123invalid]",
  false,
  "Background with invalid value"
);
await testProperty(
  "bg-[javascript:alert(1)]",
  false,
  "Background with dangerous content"
);

console.log("🔲 BORDER COLOR PROPERTIES");
console.log("===========================");

// Border color - Full names
await testProperty("border-color-[red]", true, "Border-color full name");
await testProperty("border-color-[#333333]", true, "Border-color with hex");
await testProperty(
  "border-color-[rgb(100,100,100)]",
  true,
  "Border-color with RGB"
);

// Directional border colors
await testProperty(
  "border-top-color-[blue]",
  true,
  "Border-top-color with blue"
);
await testProperty(
  "border-right-color-[green]",
  true,
  "Border-right-color with green"
);
await testProperty(
  "border-bottom-color-[yellow]",
  true,
  "Border-bottom-color with yellow"
);
await testProperty(
  "border-left-color-[purple]",
  true,
  "Border-left-color with purple"
);

// Logical border colors
await testProperty(
  "border-block-start-color-[orange]",
  true,
  "Border-block-start-color"
);
await testProperty(
  "border-block-end-color-[pink]",
  true,
  "Border-block-end-color"
);
await testProperty(
  "border-inline-start-color-[brown]",
  true,
  "Border-inline-start-color"
);
await testProperty(
  "border-inline-end-color-[gray]",
  true,
  "Border-inline-end-color"
);

// Border color - Invalid values
await testProperty(
  "border-color-[invalid]",
  false,
  "Border-color with invalid value"
);
await testProperty(
  "border-top-color-[123abc]",
  false,
  "Border-top-color with invalid format"
);

console.log("🖊️  OUTLINE COLOR PROPERTIES");
console.log("=============================");

// Outline color
await testProperty("outline-color-[red]", true, "Outline-color with red");
await testProperty("outline-color-[#ff0000]", true, "Outline-color with hex");
await testProperty("outline-color-[invert]", true, "Outline-color with invert");

console.log("📰 TEXT DECORATION COLOR");
console.log("========================");

// Text decoration color
await testProperty(
  "text-decoration-color-[red]",
  true,
  "Text-decoration-color with red"
);
await testProperty(
  "text-decoration-color-[#0066ff]",
  true,
  "Text-decoration-color with hex"
);
await testProperty(
  "text-decoration-color-[rgba(255,0,0,0.7)]",
  true,
  "Text-decoration-color with RGBA"
);

console.log("🎯 TEXT EMPHASIS COLOR");
console.log("======================");

// Text emphasis color
await testProperty(
  "text-emphasis-color-[blue]",
  true,
  "Text-emphasis-color with blue"
);
await testProperty(
  "text-emphasis-color-[#00ff00]",
  true,
  "Text-emphasis-color with hex"
);

console.log("📑 COLUMN RULE COLOR");
console.log("====================");

// Column rule color
await testProperty(
  "column-rule-color-[black]",
  true,
  "Column-rule-color with black"
);
await testProperty(
  "column-rule-color-[#666666]",
  true,
  "Column-rule-color with hex"
);

console.log("🌈 ADVANCED COLOR FORMATS");
console.log("==========================");

// Modern CSS color functions
await testProperty(
  "color-[oklch(0.7,0.15,180)]",
  true,
  "Color with OKLCH function"
);
await testProperty(
  "background-[lab(50%,20,-30)]",
  true,
  "Background with LAB function"
);
// color() function removed - not supported in ZyraCSS v1.0.0 scope

// CSS variables and custom properties
await testProperty(
  "color-[var(--primary-color)]",
  true,
  "Color with CSS variable"
);
await testProperty(
  "bg-[var(--bg-gradient,linear-gradient(red,blue))]",
  true,
  "Background with variable and fallback"
);

// Color with math functions - color-mix removed (not supported in ZyraCSS v1.0.0 scope)

console.log("🔬 COMPLEX & EDGE CASES");
console.log("=======================");

// Multiple backgrounds
await testProperty(
  "background-[u(img1.jpg),linear-gradient(red,blue)]",
  true,
  "Multiple backgrounds"
);
await testProperty(
  "background-[red,u(pattern.png)]",
  true,
  "Background with color and image"
);

// Complex gradients - conic-gradient removed (not supported in ZyraCSS v1.0.0 scope)
await testProperty(
  "background-[repeating-linear-gradient(45deg,red,red-10px,blue-10px,blue-20px)]",
  true,
  "Background with repeating gradient"
);

// Edge cases - should fail
await testProperty("color-[]", false, "Empty color value");
await testProperty("background-[", false, "Unclosed bracket");
await testProperty("c-]red[", false, "Reversed brackets");
await testProperty("bg-[red blue]", false, "Spaces in bracket value (invalid)");

// Unicode/Security tests
await testProperty(
  "color-[red♥]",
  false,
  "Color with Unicode character (should fail)"
);
await testProperty(
  "background-[javascript:alert(1)]",
  false,
  "Background with dangerous content (should fail)"
);

// Very long color values
await testProperty(
  "background-[linear-gradient(45deg,rgba(255,0,0,0.8),rgba(0,255,0,0.6),rgba(0,0,255,0.4))]",
  true,
  "Long gradient with multiple RGBA colors"
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

console.log("\n🎯 COLOR CATEGORY ASSESSMENT");
console.log("============================");
if (passedTests / totalTests >= 0.95) {
  console.log("🎉 Excellent! Color properties have robust support.");
} else if (passedTests / totalTests >= 0.85) {
  console.log("👍 Good! Most color properties work correctly.");
} else {
  console.log("⚠️  Needs improvement. Several color properties need fixes.");
}



