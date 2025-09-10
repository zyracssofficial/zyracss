#!/usr/bin/env node
/**
 * ZyraCSS MVP Smoke Test
 * Quick validation of core functionality - the most critical features
 */

console.log("Starting imports...");

import {
  zyraGenerateCSSFromClasses,
  zyraGenerateCSSFromHTML,
} from "../src/index.js";

console.log("Imports complete!");

console.log("🚀 ZyraCSS MVP Smoke Test");
console.log("=".repeat(50));

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    const result = fn();
    if (result) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error.message}`);
    failed++;
  }
}

async function asyncTest(name, fn) {
  try {
    const result = await Promise.race([
      fn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Test timeout after 5s")), 5000)
      ),
    ]);
    if (result) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error.message}`);
    failed++;
  }
}

// 1. CORE PARSING TESTS
console.log("\n🔍 Core Parsing Tests");
console.log("─".repeat(30));

await asyncTest("Single value brackets: p-[2rem]", async () => {
  const result = await zyraGenerateCSSFromClasses(["p-[2rem]"]);
  return result.data.css.includes("padding: 2rem");
});

await asyncTest("Multiple values: m-[1rem,2rem,3rem,4rem]", async () => {
  const result = await zyraGenerateCSSFromClasses(["m-[1rem,2rem,3rem,4rem]"]);
  return result.data.css.includes("margin: 1rem 2rem 3rem 4rem");
});

await asyncTest("Full property names: padding-[24px]", async () => {
  const result = await zyraGenerateCSSFromClasses(["padding-[24px]"]);
  return result.data.css.includes("padding: 24px");
});

await asyncTest("Color values: bg-[#ff0000]", async () => {
  const result = await zyraGenerateCSSFromClasses(["bg-[#ff0000]"]);
  return result.data.css.includes("background: #ff0000");
});

// 2. TAILWIND REJECTION TESTS
console.log("\n🚫 Tailwind Rejection Tests");
console.log("─".repeat(30));

await asyncTest("Reject Tailwind: p-4", async () => {
  const result = await zyraGenerateCSSFromClasses(["p-4"]);
  return result.data.stats.validClasses === 0;
});

await asyncTest("Reject Tailwind: bg-red-500", async () => {
  const result = await zyraGenerateCSSFromClasses(["bg-red-500"]);
  return result.data.stats.validClasses === 0;
});

await asyncTest("Reject Tailwind: text-xl", async () => {
  const result = await zyraGenerateCSSFromClasses(["text-xl"]);
  return result.data.stats.validClasses === 0;
});

// 3. SECURITY TESTS
console.log("\n🛡️ Security Tests");
console.log("─".repeat(30));

await asyncTest("Block XSS: bg-[javascript:alert(1)]", async () => {
  const result = await zyraGenerateCSSFromClasses(["bg-[javascript:alert(1)]"]);
  return !result.success || !result.data?.css?.includes("javascript:");
});

await asyncTest("Block injection: p-[expression(alert(1))]", async () => {
  const result = await zyraGenerateCSSFromClasses(["p-[expression(alert(1))]"]);
  return !result.success || !result.data?.css?.includes("expression(");
});

// 4. ERROR HANDLING TESTS
console.log("\n⚠️ Error Handling Tests");
console.log("─".repeat(30));

await asyncTest("Handle null input gracefully", async () => {
  const result = await zyraGenerateCSSFromClasses(null);
  return result.data?.stats?.validClasses === 0 || !result.success;
});

await asyncTest("Handle empty brackets: p-[]", async () => {
  const result = await zyraGenerateCSSFromClasses(["p-[]"]);
  return result.data.stats.validClasses === 0;
});

await asyncTest("Handle malformed: p-[2rem", async () => {
  const result = await zyraGenerateCSSFromClasses(["p-[2rem"]);
  return result.data.stats.validClasses === 0;
});

// 5. HTML EXTRACTION TESTS
console.log("\n📄 HTML Extraction Tests");
console.log("─".repeat(30));

await asyncTest("Extract from HTML", async () => {
  const html = '<div class="p-[2rem] bg-[blue]">Test</div>';
  const result = await zyraGenerateCSSFromHTML(html);
  return result.data.stats.validClasses === 2;
});

await asyncTest("Ignore Tailwind in HTML", async () => {
  const html = '<div class="p-4 bg-red-500 m-[1rem]">Test</div>';
  const result = await zyraGenerateCSSFromHTML(html);
  return result.data.stats.validClasses === 1; // Only m-[1rem] should be valid
});

// 6. PERFORMANCE SMOKE TEST
console.log("\n⚡ Performance Smoke Test");
console.log("─".repeat(30));

await asyncTest("Process 50 classes under 100ms", async () => {
  const classes = Array.from({ length: 50 }, (_, i) => `p-[${i}px]`);
  const start = Date.now();
  await zyraGenerateCSSFromClasses(classes);
  const duration = Date.now() - start;
  console.log(`    Duration: ${duration}ms`);
  return duration < 100;
});

// SUMMARY
console.log("\n🎯 Smoke Test Summary");
console.log("=".repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(
  `📊 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`
);

if (failed === 0) {
  console.log("\n🚀 All smoke tests passed! ZyraCSS MVP is ready!");
} else {
  console.log("\n⚠️ Some smoke tests failed - MVP needs attention");
  process.exit(1);
}
