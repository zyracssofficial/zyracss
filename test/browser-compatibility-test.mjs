#!/usr/bin/env node
/**
 * Browser Environment Simulation Test
 * Tests ZyraCSS behavior in browser-like conditions
 */

// Simulate browser environment
global.process = undefined;
global.require = undefined;

import {
  zyraGenerateCSS,
  zyraGenerateCSSFromHTML,
  zyraExtractClassFromHTML,
  parseClasses,
} from "../src/index.js";

console.log("🌐 ZyraCSS Browser Environment Test");
console.log("=".repeat(50));

async function testBrowserCompatibility() {
  const tests = [];

  // Test 1: Basic CSS Generation
  try {
    const result = await zyraGenerateCSS([
      "p-[20px]",
      "bg-[#ff0000]",
      "color-[blue]",
    ]);
    const success = result.success && result.data.css.includes("padding: 20px");
    tests.push({ name: "Basic CSS Generation", success });
    console.log(success ? "✅" : "❌", "Basic CSS Generation");
  } catch (error) {
    tests.push({
      name: "Basic CSS Generation",
      success: false,
      error: error.message,
    });
    console.log("❌ Basic CSS Generation:", error.message);
  }

  // Test 2: HTML Class Extraction
  try {
    const html = '<div class="p-[10px] bg-[red] color-[white]">Test</div>';
    const classes = zyraExtractClassFromHTML(html);
    const success = classes.length === 3 && classes.includes("p-[10px]");
    tests.push({ name: "HTML Class Extraction", success });
    console.log(success ? "✅" : "❌", "HTML Class Extraction");
  } catch (error) {
    tests.push({
      name: "HTML Class Extraction",
      success: false,
      error: error.message,
    });
    console.log("❌ HTML Class Extraction:", error.message);
  }

  // Test 3: CSS from HTML
  try {
    const html = '<div class="margin-[15px] font-size-[18px]">Content</div>';
    const result = await zyraGenerateCSSFromHTML(html);
    const success = result.success && result.data.css.includes("margin: 15px");
    tests.push({ name: "CSS from HTML", success });
    console.log(success ? "✅" : "❌", "CSS from HTML");
  } catch (error) {
    tests.push({ name: "CSS from HTML", success: false, error: error.message });
    console.log("❌ CSS from HTML:", error.message);
  }

  // Test 4: Class Parsing
  try {
    const result = parseClasses(["w-[100px]", "h-[50vh]", "invalid-class"]);
    const success = result.hasAnyValid && result.valid.length >= 2;
    tests.push({ name: "Class Parsing", success });
    console.log(success ? "✅" : "❌", "Class Parsing");
  } catch (error) {
    tests.push({ name: "Class Parsing", success: false, error: error.message });
    console.log("❌ Class Parsing:", error.message);
  }

  // Test 5: Complex Values
  try {
    const complexClasses = [
      "transform-[rotate(45deg),scale(1.2)]",
      "bg-[linear-gradient(45deg,#ff0000,#0000ff)]",
      "box-shadow-[0,4px,8px,rgba(0,0,0,0.3)]",
    ];
    const result = await zyraGenerateCSS(complexClasses);
    const success = result.success && result.data.css.includes("transform:");
    tests.push({ name: "Complex Values", success });
    console.log(success ? "✅" : "❌", "Complex Values");
  } catch (error) {
    tests.push({
      name: "Complex Values",
      success: false,
      error: error.message,
    });
    console.log("❌ Complex Values:", error.message);
  }

  // Test 6: Caching (Browser Environment)
  try {
    const classes = ["p-[25px]", "color-[green]"];

    // First call
    const start1 = Date.now();
    const result1 = await zyraGenerateCSS(classes);
    const time1 = Date.now() - start1;

    // Second call (should be cached)
    const start2 = Date.now();
    const result2 = await zyraGenerateCSS(classes);
    const time2 = Date.now() - start2;

    const success =
      result1.success &&
      result2.success &&
      result1.data.css === result2.data.css;
    tests.push({ name: "Caching System", success });
    console.log(
      success ? "✅" : "❌",
      `Caching System (${time1}ms → ${time2}ms)`
    );
  } catch (error) {
    tests.push({
      name: "Caching System",
      success: false,
      error: error.message,
    });
    console.log("❌ Caching System:", error.message);
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  const passed = tests.filter((t) => t.success).length;
  const total = tests.length;
  console.log(`📊 Test Results: ${passed}/${total} passed`);

  if (passed === total) {
    console.log("🎉 All tests passed! ZyraCSS is browser-compatible.");
  } else {
    console.log("⚠️  Some tests failed. Check the issues above.");
    tests
      .filter((t) => !t.success)
      .forEach((test) => {
        console.log(`   - ${test.name}: ${test.error || "Unknown error"}`);
      });
  }

  return { passed, total, tests };
}

testBrowserCompatibility().catch(console.error);
