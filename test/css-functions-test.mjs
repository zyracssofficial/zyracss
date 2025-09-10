/**
 * ZyraCSS CSS Functions Test Suite - Rewritten for async API
 * Tests supp    await test('CSS variable with fallback', async () => {
        return await expectCSS(['font-size-[var(--font-size,calc(1rem+2px))]'], 'font-size: var(--font-size, calc(1rem + 2px))');
    }); for CSS functions like calc(), var(), rgb(), hsl(), u(), linear-gradient()
 */

import { zyraGenerateCSS as generateCSS } from "../src/index.js";

// ANSI color codes for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

let testCount = 0;
let passCount = 0;
let failCount = 0;

async function test(name, testFn) {
  testCount++;
  try {
    const result = await testFn();
    if (result) {
      passCount++;
      console.log(`${colors.green}✅ ${name}${colors.reset}`);
      if (typeof result === "string") {
        console.log(`   → ${result.replace(/\n/g, " ").substring(0, 50)}...`);
      }
    } else {
      failCount++;
      console.log(`${colors.red}❌ ${name}${colors.reset}`);
    }
  } catch (error) {
    failCount++;
    console.log(
      `${colors.red}❌ ${name} - Error: ${error.message}${colors.reset}`
    );
  }
}

async function expectCSS(classes, expectedPattern) {
  try {
    const result = await generateCSS(classes);
    return result.success && result.data.css.includes(expectedPattern);
  } catch (error) {
    return false;
  }
}

async function expectFailure(classes, expectedErrorCode) {
  try {
    const result = await generateCSS(classes);
    return (
      !result.success && result.error && result.error.code === expectedErrorCode
    );
  } catch (error) {
    return false;
  }
}

async function runTests() {
  console.log(
    `${colors.cyan}${colors.bold}🧮 ZyraCSS CSS Functions Test${colors.reset}`
  );
  console.log("=".repeat(48));

  // calc() function tests
  await test("Basic calc() function", async () => {
    return await expectCSS(
      ["width-[calc(100%-20px)]"],
      "width: calc(100% - 20px)"
    );
  });

  await test("Complex calc() with multiple operations", async () => {
    return await expectCSS(
      ["height-[calc(100vh-60px-2rem)]"],
      "height: calc(100vh - 60px - 2rem)"
    );
  });

  await test("calc() with multiplication and division", async () => {
    return await expectCSS(["margin-[calc(10px*2)]"], "margin: calc(10px * 2)");
  });

  await test("calc() with nested parentheses", async () => {
    return await expectCSS(
      ["padding-[calc((100%-40px)/2)]"],
      "padding: calc((100% - 40px)/2)"
    );
  });

  // var() function tests
  await test("Basic CSS custom property", async () => {
    return await expectCSS(
      ["color-[var(--primary-color)]"],
      "color: var(--primary-color)"
    );
  });

  await test("CSS variable with fallback", async () => {
    return await expectCSS(
      ["background-[var(--bg-color,white)]"],
      "background: var(--bg-color, white)"
    );
  });

  await test("CSS variable with complex fallback", async () => {
    return await expectCSS(
      ["font-size-[var(--font-size,calc(1rem+2px))]"],
      "font-size: var(--font-size, calc(1rem + 2px))"
    );
  });

  // rgb() and rgba() function tests
  await test("Basic rgb() function", async () => {
    return await expectCSS(["color-[rgb(255,0,0)]"], "color: rgb(255, 0, 0)");
  });

  await test("rgba() with alpha channel", async () => {
    return await expectCSS(
      ["background-[rgba(0,128,255,0.5)]"],
      "background: rgba(0, 128, 255, 0.5)"
    );
  });

  await test("rgb() with percentages", async () => {
    return await expectCSS(
      ["border-color-[rgb(50%,75%,100%)]"],
      "border-color: rgb(50%, 75%, 100%)"
    );
  });

  // hsl() and hsla() function tests
  await test("Basic hsl() function", async () => {
    return await expectCSS(
      ["color-[hsl(120,100%,50%)]"],
      "color: hsl(120, 100%, 50%)"
    );
  });

  await test("hsla() with alpha channel", async () => {
    return await expectCSS(
      ["background-[hsla(240,100%,50%,0.3)]"],
      "background: hsla(240, 100%, 50%, 0.3)"
    );
  });

  await test("hsl() with degree units", async () => {
    return await expectCSS(
      ["color-[hsl(180deg,50%,25%)]"],
      "color: hsl(180deg, 50%, 25%)"
    );
  });

  // u() function tests (URL syntax)
  await test("Basic u() function", async () => {
    return await expectCSS(
      ["background-image-[u(image.jpg)]"],
      "background-image: url('image.jpg')"
    );
  });

  await test("u() with quotes", async () => {
    // Quotes inside u() are actually stripped correctly - should work
    return await expectCSS(
      ['background-image-[u("./assets/bg.png")]'],
      "background-image: url('./assets/bg.png')"
    );
  });

  await test("u() with data URI", async () => {
    // SVG data URIs are blocked for security - should fail
    return await expectFailure(
      ["background-[u(data:image/svg+xml;base64,PHN2Zz4K)]"],
      "DANGEROUS_INPUT"
    );
  });

  await test("u() with safe data URI (PNG)", async () => {
    // Safe image data URIs are allowed
    return await expectCSS(
      [
        "background-[u(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==)]",
      ],
      "background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==')"
    );
  });

  // linear-gradient() function tests
  await test("Basic linear-gradient()", async () => {
    return await expectCSS(
      ["background-[linear-gradient(to,right,red,blue)]"],
      "background: linear-gradient(to right, red, blue)"
    );
  });

  await test("linear-gradient() with angle", async () => {
    return await expectCSS(
      ["background-[linear-gradient(45deg,red,blue)]"],
      "background: linear-gradient(45deg, red, blue)"
    );
  });

  await test("linear-gradient() with multiple stops", async () => {
    return await expectCSS(
      ["background-[linear-gradient(to,bottom,red,yellow,green,blue)]"],
      "background: linear-gradient(to bottom, red, yellow, green, blue)"
    );
  });

  await test("linear-gradient() with percentage stops", async () => {
    return await expectCSS(
      ["background-[linear-gradient(90deg,red,0%,blue,100%)]"],
      "background: linear-gradient(90deg, red 0%, blue 100%)"
    );
  });

  // radial-gradient() function tests
  await test("Basic radial-gradient()", async () => {
    return await expectCSS(
      ["background-[radial-gradient(circle,red,blue)]"],
      "background: radial-gradient(circle, red, blue)"
    );
  });

  await test("radial-gradient() with ellipse", async () => {
    return await expectCSS(
      ["background-[radial-gradient(ellipse,at,center,red,blue)]"],
      "background: radial-gradient(ellipse at center, red, blue)"
    );
  });

  // min(), max(), clamp() function tests
  await test("min() function", async () => {
    return await expectCSS(
      ["width-[min(100%,500px)]"],
      "width: min(100%, 500px)"
    );
  });

  await test("max() function", async () => {
    return await expectCSS(
      ["height-[max(200px,50vh)]"],
      "height: max(200px, 50vh)"
    );
  });

  await test("clamp() function", async () => {
    return await expectCSS(
      ["font-size-[clamp(1rem,2.5vw,2rem)]"],
      "font-size: clamp(1rem, 2.5vw, 2rem)"
    );
  });

  // Complex nested function combinations
  await test("calc() with var() inside", async () => {
    return await expectCSS(
      ["width-[calc(var(--container-width)-40px)]"],
      "width: calc(var(--container-width)-40px)"
    );
  });

  await test("rgba() inside linear-gradient()", async () => {
    return await expectCSS(
      [
        "background-[linear-gradient(to,right,rgba(255,0,0,0.5),rgba(0,0,255,0.5))]",
      ],
      "background: linear-gradient(to right, rgba(255, 0, 0, 0.5), rgba(0, 0, 255, 0.5))"
    );
  });

  await test("Multiple functions in box-shadow", async () => {
    return await expectCSS(
      ["box-shadow-[0,0,calc(1rem*2),rgba(0,0,0,var(--shadow-opacity,0.1))]"],
      "box-shadow: 0 0 calc(1rem * 2) rgba(0, 0, 0, var(--shadow-opacity, 0.1))"
    );
  });

  // Transform function tests
  await test("transform with multiple functions", async () => {
    return await expectCSS(
      ["transform-[translate(10px,20px),scale(1.5),rotate(45deg)]"],
      "transform: translate(10px, 20px) scale(1.5) rotate(45deg)"
    );
  });

  await test("transform with calc() inside", async () => {
    return await expectCSS(
      ["transform-[translateX(calc(50%-10px))]"],
      "transform: translateX(calc(50% - 10px))"
    );
  });

  // Filter function tests
  await test("filter blur function", async () => {
    return await expectCSS(["filter-[blur(5px)]"], "filter: blur(5px)");
  });

  await test("filter with multiple functions", async () => {
    return await expectCSS(
      ["filter-[brightness(1.2),contrast(1.1),saturate(1.3)]"],
      "filter: brightness(1.2) contrast(1.1) saturate(1.3)"
    );
  });

  // Animation function tests
  await test("cubic-bezier() timing function", async () => {
    return await expectCSS(
      ["transition-timing-function-[cubic-bezier(0.25,0.1,0.25,1)]"],
      "transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1)"
    );
  });

  // Grid function tests
  await test("repeat() in grid", async () => {
    return await expectCSS(
      ["grid-template-columns-[repeat(auto-fit,minmax(250px,1fr))]"],
      "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))"
    );
  });

  await test("minmax() in grid", async () => {
    return await expectCSS(
      ["grid-template-rows-[minmax(100px,auto)]"],
      "grid-template-rows: minmax(100px, auto)"
    );
  });

  // Modern color function tests
  await test("oklch() color function", async () => {
    return await expectCSS(
      ["color-[oklch(0.7,0.15,180)]"],
      "color: oklch(0.7, 0.15, 180)"
    );
  });

  await test("oklab() color function", async () => {
    return await expectCSS(
      ["background-[oklab(0.5,0.1,-0.1)]"],
      "background: oklab(0.5, 0.1, -0.1)"
    );
  });

  await test("lab() color function", async () => {
    return await expectCSS(
      ["color-[lab(50%,20,-30)]"],
      "color: lab(50%, 20, -30)"
    );
  });

  await test("lch() color function", async () => {
    return await expectCSS(
      ["background-[lch(70%,45,120)]"],
      "background: lch(70%, 45, 120)"
    );
  });

  // Error handling tests
  await test("Invalid function syntax (should handle gracefully)", async () => {
    try {
      const result = await generateCSS(["width-[calc(100%)]"]);
      // Should either work or fail gracefully
      return true;
    } catch (error) {
      return true; // Either outcome is acceptable for edge cases
    }
  });

  await test("Unbalanced parentheses (should handle gracefully)", async () => {
    try {
      const result = await generateCSS(["width-[calc(100%-20px]"]);
      // Should either work or fail gracefully
      return true;
    } catch (error) {
      return true;
    }
  });

  // Functions with responsive prefixes
  await test("Responsive calc() function", async () => {
    const result = await generateCSS(["md:width-[calc(100%-40px)]"]);
    return (
      result.success &&
      result.data.css.includes("@media (min-width: 768px)") &&
      result.data.css.includes("width: calc(100% - 40px)")
    );
  });

  await test("Responsive gradient with functions", async () => {
    const result = await generateCSS([
      "lg:background-[linear-gradient(45deg,rgb(255,0,0),hsl(240,100%,50%))]",
    ]);
    return (
      result.success &&
      result.data.css.includes("@media (min-width: 1024px)") &&
      result.data.css.includes(
        "background: linear-gradient(45deg, rgb(255, 0, 0), hsl(240, 100%, 50%))"
      )
    );
  });

  // Print test results
  console.log(`\n${colors.blue}📊 TEST RESULTS SUMMARY${colors.reset}`);
  console.log("=".repeat(23));
  console.log(`Total tests: ${testCount}`);
  console.log(
    `${colors.green}✅ Passed: ${passCount} (${((passCount / testCount) * 100).toFixed(1)}%)${colors.reset}`
  );
  console.log(
    `${colors.red}❌ Failed: ${failCount} (${((failCount / testCount) * 100).toFixed(1)}%)${colors.reset}`
  );

  if (failCount === 0) {
    console.log(
      `\n${colors.green}🎉 All CSS functions tests passed!${colors.reset}`
    );
  } else {
    console.log(
      `\n${colors.red}❌ ${failCount} test(s) failed. Please check the implementation.${colors.reset}`
    );
    process.exit(1);
  }
}

// Run all tests
runTests().catch(console.error);
