/**
 * ZyraCSS Effects Properties Test Suite
 * Tests all effects properties from effects.js map with various value types
 */

import { zyra } from "../../src/index.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log("🎯 ZyraCSS Effects Properties Test Suite");
console.log("========================================\n");

/**
 * Test an effects property with expected result
 */
function testProperty(
  className,
  shouldPass,
  description,
  category = "effects"
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

console.log("🌟 BOX SHADOW PROPERTIES");
console.log("========================");

// Box-shadow - Full names
await testProperty(
  "box-shadow-[0,2px,4px,rgba(0,0,0,0.1)]",
  true,
  "Box-shadow full name with RGBA"
);
await testProperty(
  "box-shadow-[2px,2px,5px,#333333]",
  true,
  "Box-shadow full name with hex color"
);
await testProperty(
  "box-shadow-[inset,0,1px,3px,black]",
  true,
  "Box-shadow full name with inset"
);
await testProperty(
  "box-shadow-[0,0,10px,blue]",
  true,
  "Box-shadow full name with blue glow"
);
await testProperty("box-shadow-[none]", true, "Box-shadow full name with none");

// Box-shadow - Short forms
await testProperty(
  "bs-[0,2px,4px,rgba(0,0,0,0.1)]",
  true,
  "Box-shadow bs shorthand"
);
await testProperty(
  "bs-[2px,2px,8px,red]",
  true,
  "Box-shadow bs shorthand with red"
);
await testProperty("bs-[1px,1px,2px,gray]", true, "Box-shadow bs shorthand");
await testProperty("bs-[none]", true, "Box-shadow bs shorthand with none");

// Multiple box-shadows
await testProperty(
  "box-shadow-[0,1px,3px,black,0,1px,2px,rgba(0,0,0,0.3)]",
  true,
  "Multiple box-shadows"
);
await testProperty(
  "bs-[inset,0,1px,0,white,0,1px,2px,black]",
  true,
  "Multiple shadows with inset"
);

console.log("✏️  TEXT SHADOW PROPERTIES");
console.log("==========================");

// Text-shadow
await testProperty(
  "text-shadow-[1px,1px,2px,black]",
  true,
  "Text-shadow with black"
);
await testProperty(
  "text-shadow-[2px,2px,4px,rgba(0,0,0,0.5)]",
  true,
  "Text-shadow with RGBA"
);
await testProperty(
  "text-shadow-[0,0,5px,blue]",
  true,
  "Text-shadow with blue glow"
);
await testProperty("text-shadow-[none]", true, "Text-shadow with none");

// Multiple text-shadows
await testProperty(
  "text-shadow-[1px,1px,0,white,2px,2px,0,black]",
  true,
  "Multiple text-shadows"
);

console.log("👻 OPACITY PROPERTIES");
console.log("=====================");

// Opacity - Full names
await testProperty(
  "opacity-[1]",
  true,
  "Opacity full name with 1 (fully opaque)"
);
await testProperty(
  "opacity-[0]",
  true,
  "Opacity full name with 0 (fully transparent)"
);
await testProperty("opacity-[0.5]", true, "Opacity full name with 0.5");
await testProperty("opacity-[0.25]", true, "Opacity full name with 0.25");
await testProperty("opacity-[0.75]", true, "Opacity full name with 0.75");

// Opacity - Short forms
await testProperty("o-[0.8]", true, "Opacity shorthand with 0.8");
await testProperty("o-[0.1]", true, "Opacity shorthand with 0.1");
await testProperty("o-[1]", true, "Opacity shorthand with 1");

// Opacity - Invalid values
await testProperty(
  "opacity-[1.5]",
  false,
  "Opacity with value greater than 1 (invalid)"
);
await testProperty(
  "opacity-[-0.5]",
  false,
  "Opacity with negative value (invalid)"
);
await testProperty("o-[red]", false, "Opacity with color (invalid)");

console.log("🔄 TRANSFORM PROPERTIES");
console.log("=======================");

// Transform - Full names
await testProperty(
  "transform-[rotate(45deg)]",
  true,
  "Transform full name with rotate"
);
await testProperty(
  "transform-[scale(1.2)]",
  true,
  "Transform full name with scale"
);
await testProperty(
  "transform-[translate(10px,20px)]",
  true,
  "Transform full name with translate"
);
await testProperty(
  "transform-[skew(10deg,20deg)]",
  true,
  "Transform full name with skew"
);
await testProperty("transform-[none]", true, "Transform full name with none");

// Transform - Short forms
await testProperty(
  "t-[rotate(90deg)]",
  true,
  "Transform shorthand with rotate"
);
await testProperty("t-[scale(0.8)]", true, "Transform shorthand with scale");
await testProperty(
  "t-[translateX(50px)]",
  true,
  "Transform shorthand with translateX"
);

// Complex transforms
await testProperty(
  "transform-[rotate(45deg),scale(1.2)]",
  true,
  "Transform with multiple functions"
);
await testProperty(
  "t-[translate3d(10px,20px,30px)]",
  true,
  "Transform with 3D translate"
);
await testProperty(
  "transform-[matrix(1,0,0,1,0,0)]",
  true,
  "Transform with matrix"
);

console.log("🌈 FILTER PROPERTIES");
console.log("====================");

// Filter - Full names
await testProperty("filter-[blur(5px)]", true, "Filter full name with blur");
await testProperty(
  "filter-[brightness(1.2)]",
  true,
  "Filter full name with brightness"
);
await testProperty(
  "filter-[contrast(1.5)]",
  true,
  "Filter full name with contrast"
);
await testProperty(
  "filter-[grayscale(1)]",
  true,
  "Filter full name with grayscale"
);
await testProperty(
  "filter-[hue-rotate(90deg)]",
  true,
  "Filter full name with hue-rotate"
);
await testProperty("filter-[invert(1)]", true, "Filter full name with invert");
await testProperty(
  "filter-[saturate(2)]",
  true,
  "Filter full name with saturate"
);
await testProperty("filter-[sepia(0.8)]", true, "Filter full name with sepia");
await testProperty("filter-[none]", true, "Filter full name with none");

// Filter - Short forms
await testProperty("f-[blur(3px)]", true, "Filter shorthand with blur");
await testProperty(
  "f-[brightness(0.8)]",
  true,
  "Filter shorthand with brightness"
);
await testProperty(
  "f-[grayscale(100%)]",
  true,
  "Filter shorthand with grayscale percentage"
);

// Multiple filters
await testProperty(
  "filter-[blur(2px),brightness(1.1),contrast(1.2)]",
  true,
  "Filter with multiple functions"
);
await testProperty(
  "f-[sepia(0.5),hue-rotate(180deg)]",
  true,
  "Filter shorthand with multiple functions"
);

// Advanced filters
await testProperty(
  "filter-[drop-shadow(2px,2px,4px,rgba(0,0,0,0.3))]",
  true,
  "Filter with drop-shadow"
);
await testProperty(
  "filter-[u(#my-filter)]", // Updated to u() syntax
  true,
  "Filter with SVG filter reference"
);

console.log("🌫️  BACKDROP FILTER PROPERTIES");
console.log("===============================");

// Backdrop-filter
await testProperty(
  "backdrop-filter-[blur(10px)]",
  true,
  "Backdrop-filter with blur"
);
await testProperty(
  "backdrop-filter-[brightness(0.8)]",
  true,
  "Backdrop-filter with brightness"
);
await testProperty(
  "backdrop-filter-[saturate(1.5)]",
  true,
  "Backdrop-filter with saturate"
);
await testProperty("backdrop-filter-[none]", true, "Backdrop-filter with none");

// Multiple backdrop filters
await testProperty(
  "backdrop-filter-[blur(5px),brightness(1.1)]",
  true,
  "Backdrop-filter with multiple functions"
);

console.log("✂️  CLIP & MASK PROPERTIES");
console.log("===========================");

// Clip-path
await testProperty("clip-path-[circle(50%)]", true, "Clip-path with circle");
await testProperty(
  "clip-path-[ellipse(50%,25%)]",
  true,
  "Clip-path with ellipse"
);
await testProperty(
  "clip-path-[polygon(0%,0%,100%,0%,100%,100%,0%,100%)]",
  true,
  "Clip-path with polygon"
);
await testProperty("clip-path-[inset(10px)]", true, "Clip-path with inset");
await testProperty("clip-path-[none]", true, "Clip-path with none");

// Mask
await testProperty("mask-[u(mask.svg)]", true, "Mask with URL");
await testProperty("mask-[none]", true, "Mask with none");

// Mask sub-properties
await testProperty("mask-image-[u(mask.png)]", true, "Mask-image with URL");
await testProperty(
  "mask-image-[linear-gradient(black,transparent)]",
  true,
  "Mask-image with gradient"
);
await testProperty("mask-mode-[alpha]", true, "Mask-mode with alpha");
await testProperty("mask-mode-[luminance]", true, "Mask-mode with luminance");
await testProperty(
  "mask-repeat-[no-repeat]",
  true,
  "Mask-repeat with no-repeat"
);
await testProperty("mask-position-[center]", true, "Mask-position with center");
await testProperty("mask-clip-[border-box]", true, "Mask-clip with border-box");
await testProperty(
  "mask-origin-[padding-box]",
  true,
  "Mask-origin with padding-box"
);
await testProperty("mask-size-[contain]", true, "Mask-size with contain");
await testProperty("mask-composite-[add]", true, "Mask-composite with add");

console.log("👁️  VISIBILITY PROPERTIES");
console.log("=========================");

// Visibility (also in effects map)
await testProperty("visibility-[visible]", true, "Visibility with visible");
await testProperty("visibility-[hidden]", true, "Visibility with hidden");
await testProperty("visibility-[collapse]", true, "Visibility with collapse");

console.log("🔬 COMPLEX & EDGE CASES");
console.log("=======================");

// CSS Functions in effects
await testProperty(
  "opacity-[var(--opacity)]",
  true,
  "Opacity with CSS variable"
);
await testProperty(
  "transform-[rotate(calc(45deg+90deg))]",
  true,
  "Transform with calc in function"
);
await testProperty(
  "filter-[blur(max(2px,0.1em))]",
  true,
  "Filter with max function"
);

// Very complex transforms
await testProperty(
  "transform-[perspective(1000px),rotateX(45deg),rotateY(45deg)]",
  true,
  "Transform with 3D perspective and rotations"
);
await testProperty(
  "t-[translateZ(100px),scale3d(1.2,1.2,1)]",
  true,
  "Transform with 3D translate and scale"
);

// Complex filters
await testProperty(
  "filter-[brightness(1.1),contrast(1.2),saturate(1.3),hue-rotate(30deg)]",
  true,
  "Filter with many functions"
);

// SVG filters and masks
await testProperty(
  "filter-[u(#glow),blur(1px)]",
  true,
  "Filter combining SVG and CSS filters"
);
await testProperty(
  "mask-[u(#mask),linear-gradient(black,transparent)]",
  true,
  "Mask with multiple sources"
);

// Edge cases - should fail
await testProperty("opacity-[]", false, "Empty opacity value");
await testProperty("transform-[", false, "Unclosed bracket");
await testProperty("filter-]blur(5px)[", false, "Reversed brackets");
await testProperty(
  "box-shadow-[2px 2px 4px black]",
  false,
  "Spaces in bracket value (invalid)"
);

// Invalid effects values
await testProperty(
  "transform-[invalid()]",
  false,
  "Transform with invalid function"
);
await testProperty(
  "filter-[blur(-5px)]",
  false,
  "Filter blur with negative value (invalid)"
);
await testProperty(
  "box-shadow-[red]",
  false,
  "Box-shadow with only color (invalid)"
);

// Unicode/Security tests
await testProperty(
  "transform-[rotate(45♥)]",
  false,
  "Transform with Unicode character (should fail)"
);
await testProperty(
  "filter-[u(javascript:alert(1))]",
  false,
  "Filter with dangerous content (should fail)"
);

// Performance hint
await testProperty(
  "transform-[translateZ(0)]",
  true,
  "Transform with GPU acceleration hint"
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

console.log("\n🎯 EFFECTS CATEGORY ASSESSMENT");
console.log("==============================");
if (passedTests / totalTests >= 0.95) {
  console.log("🎉 Excellent! Effects properties have robust support.");
} else if (passedTests / totalTests >= 0.85) {
  console.log("👍 Good! Most effects properties work correctly.");
} else {
  console.log("⚠️  Needs improvement. Several effects properties need fixes.");
}



