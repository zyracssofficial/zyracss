#!/usr/bin/env node
/**
 * ZyraCSfunction test(name, fn) {
  try {
    const result = fn();
    if (result) {
      console.log(`✅ ${name}`);
      passedTests++;
    } else {
      console.log(`❌ ${name}`);
      failedTests++;
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    failedTests++;
  }
} Quick validation of core functionality - the most critical features
 * Updated to use new zyra namespace API
 */

console.log("Starting imports...");

import { zyra } from "../src/index.js";

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

test("Single value brackets: p-[2rem]", () => {
  const result = zyra.generate(["p-[2rem]"]);
  return result.data.css.includes("padding: 2rem");
});

await asyncTest("Multiple values: m-[1rem,2rem,3rem,4rem]", async () => {
  const result = zyra.generate(["m-[1rem,2rem,3rem,4rem]"]);
  return result.data.css.includes("margin: 1rem 2rem 3rem 4rem");
});

test("Full property names: padding-[24px]", () => {
  const result = zyra.generate(["padding-[24px]"]);
  return result.data.css.includes("padding: 24px");
});

test("Color values: bg-[#ff0000]", () => {
  const result = zyra.generate(["bg-[#ff0000]"]);
  return result.data.css.includes("background: #ff0000");
});

// 2. TAILWIND REJECTION TESTS
console.log("\n🚫 Tailwind Rejection Tests");
console.log("─".repeat(30));

test("Reject Tailwind: p-4", () => {
  const result = zyra.generate(["p-4"]);
  return result.data.stats.validClasses === 0;
});

test("Reject Tailwind: bg-red-500", () => {
  const result = zyra.generate(["bg-red-500"]);
  return result.data.stats.validClasses === 0;
});

test("Reject Tailwind: text-xl", () => {
  const result = zyra.generate(["text-xl"]);
  return result.data.stats.validClasses === 0;
});

// 3. SECURITY TESTS
console.log("\n🛡️ Security Tests");
console.log("─".repeat(30));

test("Block XSS: bg-[javascript:alert(1)]", () => {
  const result = zyra.generate(["bg-[javascript:alert(1)]"]);
  return !result.success || !result.data?.css?.includes("javascript:");
});

test("Block injection: p-[expression(alert(1))]", () => {
  const result = zyra.generate(["p-[expression(alert(1))]"]);
  return !result.success || !result.data?.css?.includes("expression(");
});

// 4. ERROR HANDLING TESTS
console.log("\n⚠️ Error Handling Tests");
console.log("─".repeat(30));

test("Handle null input gracefully", () => {
  const result = zyra.generate(null);
  return result.data?.stats?.validClasses === 0 || !result.success;
});

test("Handle empty brackets: p-[]", () => {
  const result = zyra.generate(["p-[]"]);
  return result.data.stats.validClasses === 0;
});

test("Handle malformed: p-[2rem", () => {
  const result = zyra.generate(["p-[2rem"]);
  return result.data.stats.validClasses === 0;
});

// 5. HTML EXTRACTION TESTS
console.log("\n📄 HTML Extraction Tests");
console.log("─".repeat(30));

test("Extract from HTML", () => {
  const html = '<div class="p-[2rem] bg-[blue]">Test</div>';
  const result = zyra.generate(html);
  return result.data.stats.validClasses === 2;
});

test("Ignore Tailwind in HTML", () => {
  const html = '<div class="p-4 bg-red-500 m-[1rem]">Test</div>';
  const result = zyra.generate(html);
  return result.data.stats.validClasses === 1; // Only m-[1rem] should be valid
});

// 6. PERFORMANCE SMOKE TEST
console.log("\n⚡ Performance Smoke Test");
console.log("─".repeat(30));

test("Process 50 classes under 100ms", () => {
  const classes = Array.from({ length: 50 }, (_, i) => `p-[${i}px]`);
  const start = Date.now();
  zyra.generate(classes);
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
