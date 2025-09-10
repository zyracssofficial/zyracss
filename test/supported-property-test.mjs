#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";

const categories = [
  "animation",
  "borders",
  "color",
  "effects",
  "interactive",
  "layout",
  "overflow",
  "print",
  "sizing",
  "spacing",
  "transform",
  "typography",
];

console.log("🎯 Quick Category Results Summary");
console.log("================================");

let totalTests = 0;
let totalPassed = 0;
const results = [];

for (const category of categories) {
  try {
    console.log(`\n📊 ${category.toUpperCase()} CATEGORY:`);

    const output = execSync(`node test/properties/${category}-test.mjs`, {
      encoding: "utf8",
      timeout: 5000,
      cwd: process.cwd(),
    });

    // Extract results from output
    const lines = output.split("\n");
    const summaryLine = lines.find(
      (line) => line.includes("Total tests:") || line.includes("tests:")
    );
    const passLine = lines.find(
      (line) => line.includes("Passed:") || line.includes("✅ Passed:")
    );

    if (summaryLine && passLine) {
      // Parse numbers from summary
      const totalMatch = summaryLine.match(/(\d+)/);
      const passMatch = passLine.match(/(\d+)/);

      if (totalMatch && passMatch) {
        const tests = parseInt(totalMatch[1]);
        const passed = parseInt(passMatch[1]);
        const percentage = ((passed / tests) * 100).toFixed(1);

        console.log(
          `   Total: ${tests} tests, Passed: ${passed} (${percentage}%)`
        );

        totalTests += tests;
        totalPassed += passed;
        results.push({
          category,
          tests,
          passed,
          percentage: parseFloat(percentage),
        });
      }
    } else {
      console.log(`   Could not parse results for ${category}`);
    }
  } catch (error) {
    console.log(
      `   ❌ Error running ${category}: ${error.message.slice(0, 100)}`
    );
  }
}

console.log("\n🏆 OVERALL SUMMARY");
console.log("==================");
console.log(`Total Tests: ${totalTests}`);
console.log(`Total Passed: ${totalPassed}`);
console.log(
  `Overall Pass Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`
);

console.log("\n📈 CATEGORY RANKINGS");
console.log("===================");
results
  .sort((a, b) => b.percentage - a.percentage)
  .forEach((result, index) => {
    const rank = index + 1;
    const emoji =
      result.percentage === 100 ? "🟢" : result.percentage >= 90 ? "🟡" : "🔴";
    console.log(
      `${rank}. ${emoji} ${result.category.toUpperCase()}: ${result.percentage}% (${result.passed}/${result.tests})`
    );
  });
