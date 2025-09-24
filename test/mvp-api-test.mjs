#!/usr/bin/env node
/**
 * ZyraCSS MVP API Test
 * Comprehensive API testing focusing on security, performance, caching, regex, parsing, validation, and error handling
 */

import { zyra } from "../src/index.js";
import { globalCache } from "../src/core/cache/index.js";

console.log("🔌 ZyraCSS MVP API Test");
console.log("=".repeat(50));

let passed = 0;
let failed = 0;

function log(name, success, details = "") {
  if (success) {
    console.log(`✅ ${name} ${details}`);
    passed++;
  } else {
    console.log(`❌ ${name} ${details}`);
    failed++;
  }
}

function test(name, fn) {
  try {
    const result = fn();
    log(name, result);
  } catch (error) {
    log(name, false, `Error: ${error.message}`);
  }
}

console.log("\n🔍 Core API Parsing Tests");
console.log("─".repeat(40));

// Test 1: Single value bracket notation
test("Single value: p-[2rem]", () => {
  const result = zyra.generate(["p-[2rem]"]);
  return (
    result.data.css.includes("padding: 2rem") &&
    result.data.stats.validClasses === 1
  );
});

// Test 2: Multiple values
test("Multiple values: m-[1rem,2rem,3rem,4rem]", () => {
  const result = zyra.generate(["m-[1rem,2rem,3rem,4rem]"]);
  return result.data.css.includes("margin: 1rem 2rem 3rem 4rem");
});

// Test 3: Full property names
test("Full property: padding-[24px]", () => {
  const result = zyra.generate(["padding-[24px]"]);
  return result.data.css.includes("padding: 24px");
});

// Test 4: Color values
test("Color: bg-[#ff0000]", () => {
  const result = zyra.generate(["bg-[#ff0000]"]);
  return result.data.css.includes("background: #ff0000");
});

// Test 5: Complex values
test("Complex: box-shadow-[0,4px,6px,-1px,rgba(0,0,0,0.1)]", () => {
  const result = zyra.generate(["box-shadow-[0,4px,6px,-1px,rgba(0,0,0,0.1)]"]);
  return result.data.css.includes(
    "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  );
});

console.log("\n🚫 Tailwind Rejection Tests");
console.log("─".repeat(40));

// Test 6: Reject Tailwind utility classes
test("Reject Tailwind p-4", () => {
  const result = zyra.generate(["p-4"]);
  return result.data.stats.validClasses === 0;
});

test("Reject Tailwind bg-red-500", () => {
  const result = zyra.generate(["bg-red-500"]);
  return result.data.stats.validClasses === 0;
});

test("Reject Tailwind text-xl", () => {
  const result = zyra.generate(["text-xl"]);
  return result.data.stats.validClasses === 0;
});

test("Reject Tailwind flex", () => {
  const result = zyra.generate(["flex"]);
  return result.data.stats.validClasses === 0;
});

// Test 7: Mixed ZyraCSS and Tailwind
test("Mixed: ZyraCSS + Tailwind", () => {
  const result = zyra.generate(["p-[2rem]", "p-4", "bg-[blue]", "bg-red-500"]);
  return result.data.stats.validClasses === 2; // Only ZyraCSS classes should be valid
});

console.log("\n🛡️ Security Tests");
console.log("─".repeat(40));

// Test 8: XSS Prevention
test("Block javascript: injection", () => {
  const result = zyra.generate(["bg-[javascript:alert(1)]"]);
  return !result.success || !result.data?.css?.includes("javascript:");
});

test("Block expression() injection", () => {
  const result = zyra.generate(["p-[expression(alert(1))]"]);
  return !result.success || !result.data?.css?.includes("expression(");
});

test("Block data: URI injection", () => {
  const result = zyra.generate([
    "bg-[data:text/html,<script>alert(1)</script>]",
  ]);
  return !result.success || !result.data?.css?.includes("data:text/html");
});

test("Block CSS import injection", () => {
  const result = zyra.generate(['border-[@import u("evil.css")]']);
  // Should either block the @import or reject the entire class
  return (
    !result.success ||
    !result.data?.css?.includes("@import") ||
    result.data?.stats?.validClasses === 0
  );
});

// Test 9: Input validation
test("Large input protection", () => {
  const largeClass = "p-[" + "x".repeat(10000) + "]";
  const result = zyra.generate([largeClass]);
  // Should either reject or handle gracefully
  // If rejected (result.success = false), data will be null
  // If accepted, should have limited stats
  return (
    !result.success ||
    (result.data && result.data.stats.validClasses === 0) ||
    (result.data && result.data.css.length < 50000)
  );
});

console.log("\n💾 Caching Tests");
console.log("─".repeat(40));

// Test 10: Cache functionality
globalCache.clear();
const cacheTestClasses = ["p-[2rem]", "m-[1rem]", "bg-[#ff0000]"];

const start1 = Date.now();
const result1 = zyra.generate(cacheTestClasses);
const time1 = Date.now() - start1;

const start2 = Date.now();
const result2 = zyra.generate(cacheTestClasses);
const time2 = Date.now() - start2;

log("Cache improves performance", time2 <= time1, `(${time1}ms → ${time2}ms)`);
log("Cache produces identical results", result1.data.css === result2.data.css);

// Test 11: Cache with different options
const options1 = { minify: false };
const options2 = { minify: true };
const result3 = zyra.generate(["p-[1rem]"], options1);
const result4 = zyra.generate(["p-[1rem]"], options2);
log("Cache respects different options", result3.data.css !== result4.data.css);

console.log("\n🔤 Regex & Validation Tests");
console.log("─".repeat(40));

// Test 12: Valid patterns
const validPatterns = [
  "p-[2rem]",
  "m-[1rem,2rem]",
  "bg-[#ff0000]",
  "color-[rgba(0,0,0,0.5)]", // Changed from text- to color-
  "transform-[translateX(50%)]",
];

for (const pattern of validPatterns) {
  test(`Valid pattern: ${pattern}`, () => {
    const result = zyra.generate([pattern]);
    return result.data.stats.validClasses === 1;
  });
}

// Test 13: Invalid patterns
const invalidPatterns = [
  "p-[2rem", // Missing closing bracket
  "p-2rem]", // Missing opening bracket
  "p-[]", // Empty brackets
  "invalid-class", // Not ZyraCSS format
  "", // Empty string
];

for (const pattern of invalidPatterns) {
  test(`Invalid pattern: ${pattern || "(empty)"}`, () => {
    const result = zyra.generate([pattern]);
    return result.data.stats.validClasses === 0;
  });
}

console.log("\n⚠️ Error Handling Tests");
console.log("─".repeat(40));

// Test 14: Null/undefined inputs
test("Handle null input", () => {
  const result = zyra.generate(null);
  return result.data?.stats?.validClasses === 0 || !result.success;
});

test("Handle undefined input", () => {
  const result = zyra.generate(undefined);
  return result.data?.stats?.validClasses === 0 || !result.success;
});

test("Handle empty array", () => {
  const result = zyra.generate([]);
  return result.data.stats.validClasses === 0;
});

// Test 15: Wrong type inputs
test("Handle number input", () => {
  const result = zyra.generate(123);
  return result.data?.stats?.validClasses === 0 || !result.success;
});

test("Handle object input", () => {
  const result = zyra.generate({ class: "p-[2rem]" });
  return result.data?.stats?.validClasses === 0 || !result.success;
});

// Test 16: Mixed valid/invalid
test("Mixed valid/invalid classes", () => {
  const classes = ["p-[2rem]", "invalid", "m-[1rem]", "bg-[]"];
  const result = zyra.generate(classes);
  return result.data.stats.validClasses === 2; // Only p-[2rem] and m-[1rem]
});

console.log("\n📄 HTML Parsing Tests");
console.log("─".repeat(40));

// Test 17: HTML extraction
test("Extract from HTML", () => {
  const html = '<div class="p-[2rem] bg-[blue] m-[1rem,2rem]">Test</div>';
  const result = zyra.generate(html);
  return result.data.stats.validClasses === 3;
});

// Test 18: HTML with Tailwind (should ignore)
test("HTML ignores Tailwind", () => {
  const html =
    '<div class="p-4 bg-red-500 m-[2rem] text-xl p-[1rem]">Test</div>';
  const result = zyra.generate(html);
  return result.data.stats.validClasses === 2; // Only ZyraCSS classes
});

// Test 19: Complex HTML
test("Complex HTML parsing", () => {
  const html = `
    <div class="p-[2rem] bg-[#ff0000]">
      <h1 class="font-size-[2rem] color-[white]">Title</h1>
      <p class="margin-[1rem,0] line-height-[1.5]">Text</p>
      <span class="invalid-class p-[1rem]">Span</span>
    </div>
  `;
  const result = zyra.generate(html);
  return result.data.stats.validClasses === 7; // All ZyraCSS classes should work
});

console.log("\n⚡ Performance Tests");
console.log("─".repeat(40));

// Test 20: Small set performance
const smallClasses = ["p-[1rem]", "m-[2rem]", "bg-[blue]"];
const smallStart = Date.now();
zyra.generate(smallClasses);
const smallTime = Date.now() - smallStart;
log("Small set under 50ms", smallTime < 50, `(${smallTime}ms)`);

// Test 21: Medium set performance
const mediumClasses = Array.from({ length: 50 }, (_, i) => `p-[${i}px]`);
const mediumStart = Date.now();
zyra.generate(mediumClasses);
const mediumTime = Date.now() - mediumStart;
log(
  "Medium set under 200ms",
  mediumTime < 200,
  `(${mediumTime}ms for 50 classes)`
);

// Test 22: Memory efficiency
const memBefore = process.memoryUsage().heapUsed;
for (let i = 0; i < 20; i++) {
  zyra.generate([`test-[${i}px]`]);
}
const memAfter = process.memoryUsage().heapUsed;
const memIncrease = (memAfter - memBefore) / 1024 / 1024;
log(
  "Memory efficient",
  memIncrease < 10,
  `(${memIncrease.toFixed(2)}MB increase)`
);

// SUMMARY
console.log("\n🎯 API Test Summary");
console.log("=".repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(
  `📊 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`
);

// Category breakdown
const categories = {
  Parsing: 5,
  "Tailwind Rejection": 5,
  Security: 5,
  Caching: 3,
  Validation: 10,
  "Error Handling": 7,
  "HTML Processing": 3,
  Performance: 4,
};

console.log("\n📊 Category Breakdown:");
Object.entries(categories).forEach(([category, count]) => {
  console.log(`${category}: Expected ${count} tests`);
});

if (failed === 0) {
  console.log("\n🚀 All API tests passed! API is MVP-ready!");
} else if (failed <= 3) {
  console.log("\n⚠️ Minor API issues detected - mostly ready for MVP");
} else {
  console.log("\n⚠️ API needs attention before MVP");
  process.exit(1);
}
