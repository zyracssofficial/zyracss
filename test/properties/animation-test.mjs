/**
 * ZyraCSS Animation Properties Test Suite
 * Tests all animation properties from animation.js map with various value types
 */

import { zyraGenerateCSS } from "../../src/index.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

console.log("🎬 ZyraCSS Animation Properties Test Suite");
console.log("==========================================\n");

/**
 * Test an animation property with expected result
 */
async function testProperty(
  className,
  shouldPass,
  description,
  category = "animation"
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

console.log("🔄 TRANSITION PROPERTIES");
console.log("========================");

// Transition (shorthand)
await testProperty(
  "transition-[all,0.3s,ease,0s]",
  true,
  "Transition with all properties"
);
await testProperty(
  "transition-[opacity,0.5s]",
  true,
  "Transition with property and duration"
);
await testProperty(
  "transition-[transform,0.2s,ease-in-out]",
  true,
  "Transition with timing function"
);
await testProperty(
  "transition-[background-color,1s,linear,0.1s]",
  true,
  "Transition with delay"
);
await testProperty("transition-[none]", true, "Transition with none");

// Transition-property
await testProperty(
  "transition-property-[all]",
  true,
  "Transition-property with all"
);
await testProperty(
  "transition-property-[none]",
  true,
  "Transition-property with none"
);
await testProperty(
  "transition-property-[opacity]",
  true,
  "Transition-property with opacity"
);
await testProperty(
  "transition-property-[transform]",
  true,
  "Transition-property with transform"
);
await testProperty(
  "transition-property-[background-color]",
  true,
  "Transition-property with background-color"
);
await testProperty(
  "transition-property-[width,height,opacity]",
  true,
  "Transition-property with multiple properties"
);

// Transition-duration
await testProperty(
  "transition-duration-[0s]",
  true,
  "Transition-duration with zero seconds"
);
await testProperty(
  "transition-duration-[0.3s]",
  true,
  "Transition-duration with decimal seconds"
);
await testProperty(
  "transition-duration-[300ms]",
  true,
  "Transition-duration with milliseconds"
);
await testProperty(
  "transition-duration-[1.5s]",
  true,
  "Transition-duration with decimal seconds"
);
await testProperty(
  "transition-duration-[0.2s,0.5s,1s]",
  true,
  "Transition-duration with multiple values"
);

// Transition-timing-function
await testProperty(
  "transition-timing-function-[linear]",
  true,
  "Transition-timing-function with linear"
);
await testProperty(
  "transition-timing-function-[ease]",
  true,
  "Transition-timing-function with ease"
);
await testProperty(
  "transition-timing-function-[ease-in]",
  true,
  "Transition-timing-function with ease-in"
);
await testProperty(
  "transition-timing-function-[ease-out]",
  true,
  "Transition-timing-function with ease-out"
);
await testProperty(
  "transition-timing-function-[ease-in-out]",
  true,
  "Transition-timing-function with ease-in-out"
);
await testProperty(
  "transition-timing-function-[step-start]",
  true,
  "Transition-timing-function with step-start"
);
await testProperty(
  "transition-timing-function-[step-end]",
  true,
  "Transition-timing-function with step-end"
);
await testProperty(
  "transition-timing-function-[steps(4,end)]",
  true,
  "Transition-timing-function with steps"
);
await testProperty(
  "transition-timing-function-[cubic-bezier(0.25,0.1,0.25,1)]",
  true,
  "Transition-timing-function with cubic-bezier"
);

// Transition-delay
await testProperty("transition-delay-[0s]", true, "Transition-delay with zero");
await testProperty(
  "transition-delay-[0.1s]",
  true,
  "Transition-delay with decimal seconds"
);
await testProperty(
  "transition-delay-[100ms]",
  true,
  "Transition-delay with milliseconds"
);
await testProperty(
  "transition-delay-[-0.5s]",
  true,
  "Transition-delay with negative value"
);
await testProperty(
  "transition-delay-[0.1s,0.2s,0.3s]",
  true,
  "Transition-delay with multiple values"
);

console.log("🎭 ANIMATION PROPERTIES");
console.log("=======================");

// Animation (shorthand)
await testProperty(
  "animation-[fadeIn,1s,ease-in-out]",
  true,
  "Animation with name, duration, and timing"
);
await testProperty(
  "animation-[slideUp,0.5s,linear,infinite]",
  true,
  "Animation with infinite iteration"
);
await testProperty(
  "animation-[bounce,2s,ease,3]",
  true,
  "Animation with specific iteration count"
);
await testProperty(
  "animation-[rotate,1s,linear,infinite,alternate]",
  true,
  "Animation with alternate direction"
);
await testProperty(
  "animation-[fadeIn,1s,ease,0.2s,1,normal,forwards]",
  true,
  "Complex animation shorthand"
);
await testProperty("animation-[none]", true, "Animation with none");

// Animation-name
await testProperty(
  "animation-name-[fadeIn]",
  true,
  "Animation-name with fadeIn"
);
await testProperty(
  "animation-name-[slideUp]",
  true,
  "Animation-name with slideUp"
);
await testProperty(
  "animation-name-[bounce]",
  true,
  "Animation-name with bounce"
);
await testProperty(
  "animation-name-[myCustomAnimation]",
  true,
  "Animation-name with custom name"
);
await testProperty("animation-name-[none]", true, "Animation-name with none");
await testProperty(
  "animation-name-[fadeIn,slideUp]",
  true,
  "Animation-name with multiple animations"
);

// Animation-duration
await testProperty(
  "animation-duration-[0s]",
  true,
  "Animation-duration with zero"
);
await testProperty(
  "animation-duration-[1s]",
  true,
  "Animation-duration with one second"
);
await testProperty(
  "animation-duration-[0.5s]",
  true,
  "Animation-duration with decimal seconds"
);
await testProperty(
  "animation-duration-[500ms]",
  true,
  "Animation-duration with milliseconds"
);
await testProperty(
  "animation-duration-[2.5s]",
  true,
  "Animation-duration with long duration"
);
await testProperty(
  "animation-duration-[1s,0.5s,2s]",
  true,
  "Animation-duration with multiple values"
);

// Animation-timing-function
await testProperty(
  "animation-timing-function-[linear]",
  true,
  "Animation-timing-function with linear"
);
await testProperty(
  "animation-timing-function-[ease]",
  true,
  "Animation-timing-function with ease"
);
await testProperty(
  "animation-timing-function-[ease-in]",
  true,
  "Animation-timing-function with ease-in"
);
await testProperty(
  "animation-timing-function-[ease-out]",
  true,
  "Animation-timing-function with ease-out"
);
await testProperty(
  "animation-timing-function-[ease-in-out]",
  true,
  "Animation-timing-function with ease-in-out"
);
await testProperty(
  "animation-timing-function-[steps(3,start)]",
  true,
  "Animation-timing-function with steps start"
);
await testProperty(
  "animation-timing-function-[steps(5,end)]",
  true,
  "Animation-timing-function with steps end"
);
await testProperty(
  "animation-timing-function-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
  true,
  "Animation-timing-function with custom cubic-bezier"
);

// Animation-delay
await testProperty("animation-delay-[0s]", true, "Animation-delay with zero");
await testProperty(
  "animation-delay-[0.5s]",
  true,
  "Animation-delay with half second"
);
await testProperty(
  "animation-delay-[200ms]",
  true,
  "Animation-delay with milliseconds"
);
await testProperty(
  "animation-delay-[-1s]",
  true,
  "Animation-delay with negative value"
);
await testProperty(
  "animation-delay-[0.1s,0.2s]",
  true,
  "Animation-delay with multiple values"
);

// Animation-iteration-count
await testProperty(
  "animation-iteration-count-[1]",
  true,
  "Animation-iteration-count with one"
);
await testProperty(
  "animation-iteration-count-[3]",
  true,
  "Animation-iteration-count with three"
);
await testProperty(
  "animation-iteration-count-[infinite]",
  true,
  "Animation-iteration-count with infinite"
);
await testProperty(
  "animation-iteration-count-[0.5]",
  true,
  "Animation-iteration-count with decimal"
);
await testProperty(
  "animation-iteration-count-[2.5]",
  true,
  "Animation-iteration-count with decimal iterations"
);
await testProperty(
  "animation-iteration-count-[1,infinite,3]",
  true,
  "Animation-iteration-count with multiple values"
);

// Animation-direction
await testProperty(
  "animation-direction-[normal]",
  true,
  "Animation-direction with normal"
);
await testProperty(
  "animation-direction-[reverse]",
  true,
  "Animation-direction with reverse"
);
await testProperty(
  "animation-direction-[alternate]",
  true,
  "Animation-direction with alternate"
);
await testProperty(
  "animation-direction-[alternate-reverse]",
  true,
  "Animation-direction with alternate-reverse"
);
await testProperty(
  "animation-direction-[normal,reverse]",
  true,
  "Animation-direction with multiple values"
);

// Animation-fill-mode
await testProperty(
  "animation-fill-mode-[none]",
  true,
  "Animation-fill-mode with none"
);
await testProperty(
  "animation-fill-mode-[forwards]",
  true,
  "Animation-fill-mode with forwards"
);
await testProperty(
  "animation-fill-mode-[backwards]",
  true,
  "Animation-fill-mode with backwards"
);
await testProperty(
  "animation-fill-mode-[both]",
  true,
  "Animation-fill-mode with both"
);
await testProperty(
  "animation-fill-mode-[forwards,none]",
  true,
  "Animation-fill-mode with multiple values"
);

// Animation-play-state
await testProperty(
  "animation-play-state-[running]",
  true,
  "Animation-play-state with running"
);
await testProperty(
  "animation-play-state-[paused]",
  true,
  "Animation-play-state with paused"
);
await testProperty(
  "animation-play-state-[running,paused]",
  true,
  "Animation-play-state with multiple values"
);

console.log("⚡ PERFORMANCE PROPERTIES");
console.log("=========================");

// Will-change
await testProperty("will-change-[auto]", true, "Will-change with auto");
await testProperty(
  "will-change-[scroll-position]",
  true,
  "Will-change with scroll-position"
);
await testProperty("will-change-[contents]", true, "Will-change with contents");
await testProperty(
  "will-change-[transform]",
  true,
  "Will-change with transform"
);
await testProperty("will-change-[opacity]", true, "Will-change with opacity");
await testProperty(
  "will-change-[left,top]",
  true,
  "Will-change with multiple properties"
);
await testProperty(
  "will-change-[transform,opacity]",
  true,
  "Will-change with transform and opacity"
);

// Contain
await testProperty("contain-[none]", true, "Contain with none");
await testProperty("contain-[strict]", true, "Contain with strict");
await testProperty("contain-[content]", true, "Contain with content");
await testProperty("contain-[size]", true, "Contain with size");
await testProperty("contain-[layout]", true, "Contain with layout");
await testProperty("contain-[style]", true, "Contain with style");
await testProperty("contain-[paint]", true, "Contain with paint");
await testProperty(
  "contain-[size,layout]",
  true,
  "Contain with multiple values"
);
await testProperty(
  "contain-[layout,style,paint]",
  true,
  "Contain with layout style paint"
);

// Content-visibility
await testProperty(
  "content-visibility-[visible]",
  true,
  "Content-visibility with visible"
);
await testProperty(
  "content-visibility-[hidden]",
  true,
  "Content-visibility with hidden"
);
await testProperty(
  "content-visibility-[auto]",
  true,
  "Content-visibility with auto"
);

console.log("🔬 COMPLEX & EDGE CASES");
console.log("=======================");

// CSS Functions and variables
await testProperty(
  "animation-duration-[var(--duration,1s)]",
  true,
  "Animation-duration with CSS variable"
);
await testProperty(
  "transition-delay-[calc(0.5s+0.1s)]",
  true,
  "Transition-delay with calc function"
);
await testProperty(
  "animation-iteration-count-[var(--iterations,infinite)]",
  true,
  "Animation-iteration-count with variable"
);

// Complex timing functions
await testProperty(
  "animation-timing-function-[cubic-bezier(0.17,0.67,0.83,0.67)]",
  true,
  "Complex cubic-bezier timing"
);
await testProperty(
  "transition-timing-function-[steps(10,jump-start)]",
  true,
  "Steps with jump-start"
);
await testProperty(
  "animation-timing-function-[steps(8,jump-end)]",
  true,
  "Steps with jump-end"
);
await testProperty(
  "transition-timing-function-[steps(6,jump-none)]",
  true,
  "Steps with jump-none"
);
await testProperty(
  "animation-timing-function-[steps(4,jump-both)]",
  true,
  "Steps with jump-both"
);

// Very long animations
await testProperty(
  "animation-duration-[3600s]",
  true,
  "Animation-duration with one hour"
);
await testProperty(
  "transition-delay-[30s]",
  true,
  "Transition-delay with long delay"
);

// High precision values
await testProperty(
  "animation-duration-[0.123456s]",
  true,
  "Animation-duration with high precision"
);
await testProperty(
  "animation-iteration-count-[2.718281828]",
  true,
  "Animation-iteration-count with mathematical precision"
);

// Multiple complex animations
await testProperty(
  "animation-[fadeIn,1s,ease-in,slideUp,0.5s,ease-out,0.2s]",
  true,
  "Multiple animations with different properties"
);

// Performance optimization cases
await testProperty(
  "will-change-[transform,opacity,filter]",
  true,
  "Will-change with GPU-accelerated properties"
);
await testProperty(
  "contain-[strict]",
  true,
  "Contain strict for performance isolation"
);

// Edge cases - should fail
await testProperty("animation-[]", false, "Empty animation value");
await testProperty("transition-duration-[", false, "Unclosed bracket");
await testProperty("animation-name-]fadeIn[", false, "Reversed brackets");
await testProperty(
  "will-change-[10px 20px]",
  false,
  "Spaces in bracket value (invalid)"
);

// Invalid values
await testProperty(
  "animation-duration-[-1s]",
  false,
  "Animation-duration with negative value (invalid)"
);
await testProperty(
  "transition-duration-[red]",
  false,
  "Transition-duration with color (invalid)"
);
await testProperty(
  "animation-iteration-count-[-2]",
  false,
  "Animation-iteration-count with negative (invalid)"
);
await testProperty(
  "animation-direction-[sideways]",
  false,
  "Animation-direction with invalid value"
);
await testProperty(
  "animation-fill-mode-[maybe]",
  false,
  "Animation-fill-mode with invalid value"
);

// Invalid timing functions
await testProperty(
  "animation-timing-function-[cubic-bezier(2,0,0,1)]",
  false,
  "Cubic-bezier with invalid range (invalid)"
);
await testProperty(
  "transition-timing-function-[steps(0)]",
  false,
  "Steps with zero steps (invalid)"
);

// Unicode/Security tests
await testProperty(
  "animation-name-[fadeIn♥]",
  false,
  "Animation-name with Unicode character (should fail)"
);
await testProperty(
  "will-change-[javascript:alert(1)]",
  false,
  "Will-change with dangerous content (should fail)"
);

// Performance anti-patterns
await testProperty(
  "will-change-[width,height,top,left,right,bottom]",
  true,
  "Will-change with many properties (performance warning but valid)"
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

console.log("\n🎬 ANIMATION CATEGORY ASSESSMENT");
console.log("================================");
if (passedTests / totalTests >= 0.95) {
  console.log("🎉 Excellent! Animation properties have robust support.");
} else if (passedTests / totalTests >= 0.85) {
  console.log("👍 Good! Most animation properties work correctly.");
} else {
  console.log(
    "⚠️  Needs improvement. Several animation properties need fixes."
  );
}
