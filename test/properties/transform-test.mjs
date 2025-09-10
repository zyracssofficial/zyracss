/**
 * ZyraCSS Transform Properties Test Suite
 * Tests all transform properties from transform.js map with various value types
 */

import { zyraGenerateCSS } from "../../src/index.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log("🎯 ZyraCSS Transform Properties Test Suite");
console.log("==========================================\n");

/**
 * Test a transform property with expected result
 */
async function testProperty(
  className,
  shouldPass,
  description,
  category = "transform"
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

console.log("🔄 TRANSFORM PROPERTIES");
console.log("=======================");

// Transform - 2D functions
await testProperty(
  "transform-[rotate(45deg)]",
  true,
  "Transform with rotate degrees"
);
await testProperty(
  "transform-[rotate(0.5turn)]",
  true,
  "Transform with rotate turns"
);
await testProperty(
  "transform-[rotate(100grad)]",
  true,
  "Transform with rotate gradians"
);
await testProperty(
  "transform-[scale(1.5)]",
  true,
  "Transform with uniform scale"
);
await testProperty(
  "transform-[scale(1.2,0.8)]",
  true,
  "Transform with non-uniform scale"
);
await testProperty("transform-[scaleX(2)]", true, "Transform with scaleX");
await testProperty("transform-[scaleY(0.5)]", true, "Transform with scaleY");
await testProperty(
  "transform-[translate(10px,20px)]",
  true,
  "Transform with translate"
);
await testProperty(
  "transform-[translateX(50px)]",
  true,
  "Transform with translateX"
);
await testProperty(
  "transform-[translateY(-30px)]",
  true,
  "Transform with translateY"
);
await testProperty(
  "transform-[skew(15deg,10deg)]",
  true,
  "Transform with skew"
);
await testProperty("transform-[skewX(20deg)]", true, "Transform with skewX");
await testProperty("transform-[skewY(-10deg)]", true, "Transform with skewY");

// Transform - 3D functions
await testProperty(
  "transform-[rotateX(45deg)]",
  true,
  "Transform with rotateX"
);
await testProperty(
  "transform-[rotateY(90deg)]",
  true,
  "Transform with rotateY"
);
await testProperty(
  "transform-[rotateZ(180deg)]",
  true,
  "Transform with rotateZ"
);
await testProperty(
  "transform-[rotate3d(1,1,0,45deg)]",
  true,
  "Transform with rotate3d"
);
await testProperty(
  "transform-[translate3d(10px,20px,30px)]",
  true,
  "Transform with translate3d"
);
await testProperty(
  "transform-[translateZ(50px)]",
  true,
  "Transform with translateZ"
);
await testProperty(
  "transform-[scale3d(1.2,1.2,1)]",
  true,
  "Transform with scale3d"
);
await testProperty("transform-[scaleZ(0.8)]", true, "Transform with scaleZ");

// Transform - Matrix functions
await testProperty(
  "transform-[matrix(1,0,0,1,0,0)]",
  true,
  "Transform with 2D matrix"
);
await testProperty(
  "transform-[matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)]",
  true,
  "Transform with 3D matrix"
);

// Transform - Perspective
await testProperty(
  "transform-[perspective(1000px)]",
  true,
  "Transform with perspective"
);

// Transform - Multiple functions
await testProperty(
  "transform-[rotate(45deg),scale(1.2)]",
  true,
  "Transform with multiple 2D functions"
);
await testProperty(
  "transform-[translate(10px,20px),rotate(30deg),scale(1.1)]",
  true,
  "Transform with translate, rotate, and scale"
);
await testProperty(
  "transform-[perspective(500px),rotateX(45deg),rotateY(45deg)]",
  true,
  "Transform with 3D perspective and rotations"
);

// Transform - None
await testProperty("transform-[none]", true, "Transform with none");

console.log("🎯 TRANSFORM ORIGIN PROPERTIES");
console.log("==============================");

// Transform-origin - Keywords
await testProperty(
  "transform-origin-[center]",
  true,
  "Transform-origin with center"
);
await testProperty("transform-origin-[top]", true, "Transform-origin with top");
await testProperty(
  "transform-origin-[bottom]",
  true,
  "Transform-origin with bottom"
);
await testProperty(
  "transform-origin-[left]",
  true,
  "Transform-origin with left"
);
await testProperty(
  "transform-origin-[right]",
  true,
  "Transform-origin with right"
);

// Transform-origin - Coordinates
await testProperty(
  "transform-origin-[50%,50%]",
  true,
  "Transform-origin with percentage coordinates"
);
await testProperty(
  "transform-origin-[10px,20px]",
  true,
  "Transform-origin with pixel coordinates"
);
await testProperty(
  "transform-origin-[top,left]",
  true,
  "Transform-origin with keyword coordinates"
);

// Transform-origin - 3D
await testProperty(
  "transform-origin-[50%,50%,100px]",
  true,
  "Transform-origin with 3D coordinates"
);
await testProperty(
  "transform-origin-[center,center,0]",
  true,
  "Transform-origin with 3D keywords"
);

console.log("🏗️  TRANSFORM STYLE PROPERTIES");
console.log("===============================");

// Transform-style
await testProperty("transform-style-[flat]", true, "Transform-style with flat");
await testProperty(
  "transform-style-[preserve-3d]",
  true,
  "Transform-style with preserve-3d"
);

console.log("📦 TRANSFORM BOX PROPERTIES");
console.log("============================");

// Transform-box
await testProperty(
  "transform-box-[content-box]",
  true,
  "Transform-box with content-box"
);
await testProperty(
  "transform-box-[border-box]",
  true,
  "Transform-box with border-box"
);
await testProperty(
  "transform-box-[fill-box]",
  true,
  "Transform-box with fill-box"
);
await testProperty(
  "transform-box-[stroke-box]",
  true,
  "Transform-box with stroke-box"
);
await testProperty(
  "transform-box-[view-box]",
  true,
  "Transform-box with view-box"
);

console.log("👁️  PERSPECTIVE PROPERTIES");
console.log("===========================");

// Perspective
await testProperty("perspective-[1000px]", true, "Perspective with pixels");
await testProperty("perspective-[50em]", true, "Perspective with em");
await testProperty("perspective-[none]", true, "Perspective with none");

// Perspective-origin
await testProperty(
  "perspective-origin-[center]",
  true,
  "Perspective-origin with center"
);
await testProperty(
  "perspective-origin-[top,left]",
  true,
  "Perspective-origin with top left"
);
await testProperty(
  "perspective-origin-[50%,50%]",
  true,
  "Perspective-origin with percentages"
);
await testProperty(
  "perspective-origin-[100px,200px]",
  true,
  "Perspective-origin with pixels"
);

console.log("🔄 BACKFACE VISIBILITY PROPERTIES");
console.log("==================================");

// Backface-visibility
await testProperty(
  "backface-visibility-[visible]",
  true,
  "Backface-visibility with visible"
);
await testProperty(
  "backface-visibility-[hidden]",
  true,
  "Backface-visibility with hidden"
);

console.log("🆕 INDIVIDUAL TRANSFORM PROPERTIES");
console.log("===================================");

// Translate property (newer CSS)
await testProperty(
  "translate-[10px]",
  true,
  "Translate property with single value"
);
await testProperty(
  "translate-[10px,20px]",
  true,
  "Translate property with x and y"
);
await testProperty(
  "translate-[10px,20px,30px]",
  true,
  "Translate property with x, y, and z"
);
await testProperty(
  "translate-[50%]",
  true,
  "Translate property with percentage"
);
await testProperty("translate-[none]", true, "Translate property with none");

// Rotate property (newer CSS)
await testProperty("rotate-[45deg]", true, "Rotate property with degrees");
await testProperty("rotate-[0.25turn]", true, "Rotate property with turns");
await testProperty("rotate-[100grad]", true, "Rotate property with gradians");
await testProperty(
  "rotate-[1,1,0,45deg]",
  true,
  "Rotate property with 3D axis and angle"
);
await testProperty("rotate-[none]", true, "Rotate property with none");

// Scale property (newer CSS)
await testProperty("scale-[1.5]", true, "Scale property with uniform scale");
await testProperty("scale-[1.2,0.8]", true, "Scale property with x and y");
await testProperty(
  "scale-[1.2,0.8,1.5]",
  true,
  "Scale property with x, y, and z"
);
await testProperty("scale-[none]", true, "Scale property with none");

console.log("🔬 COMPLEX & EDGE CASES");
console.log("=======================");

// CSS Functions in transforms
await testProperty(
  "transform-[rotate(calc(45deg+45deg))]",
  true,
  "Transform with calc in rotate"
);
await testProperty(
  "translate-[calc(50%-10px),calc(25%+5px)]",
  true,
  "Translate with calc functions"
);
await testProperty(
  "perspective-[max(1000px,50em)]",
  true,
  "Perspective with max function"
);

// CSS Variables
await testProperty(
  "transform-[var(--rotation)]",
  true,
  "Transform with CSS variable"
);
await testProperty(
  "transform-origin-[var(--origin-x),var(--origin-y)]",
  true,
  "Transform-origin with variables"
);
await testProperty(
  "rotate-[var(--angle,45deg)]",
  true,
  "Rotate property with variable and fallback"
);

// Very complex transforms
await testProperty(
  "transform-[perspective(1000px),translate3d(10px,20px,30px),rotateX(45deg),rotateY(45deg),scale(1.2)]",
  true,
  "Complex 3D transform with multiple functions"
);

// Mathematical precision
await testProperty(
  "transform-[rotate(0.123456789deg)]",
  true,
  "Transform with high precision angle"
);
await testProperty(
  "scale-[1.123456789]",
  true,
  "Scale with high precision number"
);

// Edge cases - should fail
await testProperty("transform-[]", false, "Empty transform value");
await testProperty("rotate-[", false, "Unclosed bracket");
await testProperty("scale-]1.5[", false, "Reversed brackets");
await testProperty(
  "translate-[10px 20px]",
  false,
  "Spaces in bracket value (invalid)"
);

// Invalid transform values
await testProperty(
  "transform-[invalidFunction(45deg)]",
  false,
  "Transform with invalid function"
);
await testProperty("rotate-[45]", false, "Rotate without unit (invalid)");
await testProperty("scale-[red]", false, "Scale with color (invalid)");
await testProperty(
  "perspective-[-1000px]",
  false,
  "Perspective with negative value (invalid)"
);

// Unicode/Security tests
await testProperty(
  "transform-[rotate(45♥)]",
  false,
  "Transform with Unicode character (should fail)"
);
await testProperty(
  "translate-[javascript:alert(1)]",
  false,
  "Translate with dangerous content (should fail)"
);

// Performance optimizations
await testProperty(
  "transform-[translateZ(0)]",
  true,
  "Transform with GPU acceleration hint"
);
await testProperty(
  "transform-[translate3d(0,0,0)]",
  true,
  "Transform with 3D GPU hint"
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

console.log("\n🎯 TRANSFORM CATEGORY ASSESSMENT");
console.log("================================");
if (passedTests / totalTests >= 0.95) {
  console.log("🎉 Excellent! Transform properties have robust support.");
} else if (passedTests / totalTests >= 0.85) {
  console.log("👍 Good! Most transform properties work correctly.");
} else {
  console.log(
    "⚠️  Needs improvement. Several transform properties need fixes."
  );
}
