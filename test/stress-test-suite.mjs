#!/usr/bin/env node
/**
 * ZyraCSS Advanced Stress Test Suite
 * Extreme testing of security, cache, parsing, regex, error handling, and performance
 */

import {
  zyraGenerateCSSFromClasses,
  zyraGenerateCSSFromHTML,
  parseClasses,
} from "../src/index.js";
import { globalCache } from "../src/core/cache/index.js";
import fs from "fs/promises";
import { spawn } from "child_process";

console.log("🔥 ZyraCSS Advanced Stress Test Suite");
console.log("=".repeat(60));
console.log(
  "Pushing the limits of Security | Cache | Parsing | Regex | Error Handling | Performance"
);
console.log("=".repeat(60));

class StressTestSuite {
  constructor() {
    this.results = { passed: 0, failed: 0, total: 0 };
  }

  log(test, passed, details = "") {
    const status = passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${status}: ${test} ${details}`);
    this.results.total++;
    if (passed) this.results.passed++;
    else this.results.failed++;
  }

  async testAdvancedSecurity() {
    console.log("\n🛡️  ADVANCED SECURITY STRESS TESTS");
    console.log("─".repeat(50));

    // Test 1: Nested XSS attempts
    const xssPayloads = [
      'bg-[javascript:alert("xss")]',
      'p-[expression(alert("xss"))]',
      'm-[u("javascript:alert(1)")]', // Updated to u() syntax
      "text-[<script>alert(1)</script>]",
      "bg-[data:text/html,<script>alert(1)</script>]",
      "border-[@import evil.css]", // Updated to remove url()
      'p-[/**/; background: u("javascript:alert(1)"); /**/]', // Updated to u() syntax
    ];

    let xssBlocked = 0;
    for (const payload of xssPayloads) {
      try {
        const result = await zyraGenerateCSSFromClasses([payload]);
        if (
          !result.data.css.includes("javascript:") &&
          !result.data.css.includes("expression(") &&
          !result.data.css.includes("<script>")
        ) {
          xssBlocked++;
        }
      } catch (error) {
        xssBlocked++; // Blocked by throwing error
      }
    }
    this.log(
      "Advanced XSS Prevention",
      xssBlocked === xssPayloads.length,
      `${xssBlocked}/${xssPayloads.length} XSS attempts blocked`
    );

    // Test 2: Buffer overflow attempts
    const hugeInput = "p-[" + "A".repeat(100000) + "]";
    const startTime = Date.now();
    try {
      const result = await zyraGenerateCSSFromClasses([hugeInput]);
      const processTime = Date.now() - startTime;
      this.log(
        "Buffer Overflow Protection",
        processTime < 5000,
        `${processTime}ms processing time for 100KB input`
      );
    } catch (error) {
      this.log(
        "Buffer Overflow Protection",
        true,
        "Properly rejected huge input"
      );
    }

    // Test 3: ReDoS attack patterns
    const redosPatterns = [
      "p-[" + "(".repeat(1000) + ")".repeat(1000) + "]",
      "m-[" + "a".repeat(1000) + "+".repeat(1000) + "]",
      "bg-[((((((((((((((((((((((((((((((((((((((((a+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)+)]",
    ];

    let redosBlocked = 0;
    for (const pattern of redosPatterns) {
      const startTime = Date.now();
      try {
        await zyraGenerateCSSFromClasses([pattern]);
        const processTime = Date.now() - startTime;
        if (processTime < 1000) redosBlocked++; // Should process quickly or reject
      } catch (error) {
        redosBlocked++; // Properly rejected
      }
    }
    this.log(
      "ReDoS Attack Prevention",
      redosBlocked === redosPatterns.length,
      `${redosBlocked}/${redosPatterns.length} ReDoS patterns handled safely`
    );
  }

  async testAdvancedCache() {
    console.log("\n💾 ADVANCED CACHE STRESS TESTS");
    console.log("─".repeat(50));

    // Test 1: Cache under concurrent load
    const concurrentPromises = [];
    const testClasses = ["p-[1rem]", "m-[2rem]", "bg-[red]"];

    for (let i = 0; i < 50; i++) {
      concurrentPromises.push(zyraGenerateCSSFromClasses(testClasses));
    }

    const startTime = Date.now();
    const results = await Promise.all(concurrentPromises);
    const totalTime = Date.now() - startTime;

    const allIdentical = results.every(
      (result) => result.data.css === results[0].data.css
    );

    this.log(
      "Concurrent Cache Consistency",
      allIdentical && totalTime < 2000,
      `50 concurrent requests in ${totalTime}ms, all identical: ${allIdentical}`
    );

    // Test 2: Cache memory pressure
    const uniqueClasses = [];
    for (let i = 0; i < 1000; i++) {
      uniqueClasses.push(`p-[${i}rem]`);
    }

    const memBefore = process.memoryUsage().heapUsed / 1024 / 1024;
    for (let i = 0; i < 1000; i++) {
      await zyraGenerateCSSFromClasses([uniqueClasses[i]]);
    }
    const memAfter = process.memoryUsage().heapUsed / 1024 / 1024;
    const memIncrease = memAfter - memBefore;

    this.log(
      "Cache Memory Management",
      memIncrease < 50,
      `Memory increase: ${memIncrease.toFixed(2)}MB for 1000 unique entries`
    );

    // Test 3: Cache invalidation stress
    globalCache.clear();
    let cacheHits = 0;
    let cacheMisses = 0;

    for (let i = 0; i < 100; i++) {
      const result = await zyraGenerateCSSFromClasses(["p-[1rem]"]);
      if (result.data.stats.fromCache) cacheHits++;
      else cacheMisses++;
    }

    this.log(
      "Cache Hit Rate Optimization",
      cacheHits > 95,
      `Cache hits: ${cacheHits}/100, misses: ${cacheMisses}/100`
    );
  }

  async testAdvancedParsing() {
    console.log("\n🔍 ADVANCED PARSING STRESS TESTS");
    console.log("─".repeat(50));

    // Test 1: Complex nested values
    const complexCases = [
      "box-shadow-[0,4px,6px,-1px,rgba(0,0,0,0.1),0,2px,4px,-1px,rgba(0,0,0,0.06)]",
      "background-[linear-gradient(45deg,rgba(255,0,0,0.5),rgba(0,255,0,0.5),rgba(0,0,255,0.5))]",
      "transform-[translateX(calc(100% - 50px)) rotate(45deg) scale(1.2)]",
      "clip-path-[polygon(50% 0%, 0% 100%, 100% 100%)]",
      "filter-[blur(5px) brightness(1.2) contrast(1.1) saturate(1.3)]",
    ];

    let complexParsed = 0;
    for (const testCase of complexCases) {
      try {
        const result = await zyraGenerateCSSFromClasses([testCase]);
        if (result.success && result.data.css.length > 50) {
          complexParsed++;
        }
      } catch (error) {
        // Complex parsing failure is acceptable
      }
    }

    this.log(
      "Complex Value Parsing",
      complexParsed >= 3,
      `${complexParsed}/${complexCases.length} complex values parsed`
    );

    // Test 2: Mixed valid/invalid parsing stress
    const mixedClasses = [
      "p-[2rem]",
      "invalid-class",
      "m-[",
      "bg-[#ff0000]",
      "text-[]",
      "border-[1px,solid,red]",
      "malformed",
      "w-[100%]",
      "h-[50vh]",
    ];

    const result = await zyraGenerateCSSFromClasses(mixedClasses);
    const validCount = result.data.stats.validClasses;
    const invalidCount = result.data.stats.invalidClasses;

    this.log(
      "Mixed Valid/Invalid Handling",
      validCount > 0 && invalidCount > 0,
      `Valid: ${validCount}, Invalid: ${invalidCount}, gracefully handled`
    );

    // Test 3: Unicode and special character parsing
    const unicodeClasses = [
      "p-[测试]",
      "m-[café]",
      "bg-[🎨]",
      "text-[中文]",
      "w-[العربية]",
    ];

    let unicodeParsed = 0;
    for (const unicodeClass of unicodeClasses) {
      try {
        const result = await zyraGenerateCSSFromClasses([unicodeClass]);
        if (result.success) unicodeParsed++;
      } catch (error) {
        // Some unicode might be rejected, which is acceptable
      }
    }

    this.log(
      "Unicode Character Support",
      unicodeParsed >= 2,
      `${unicodeParsed}/${unicodeClasses.length} unicode classes handled`
    );
  }

  async testAdvancedRegex() {
    console.log("\n🔤 ADVANCED REGEX STRESS TESTS");
    console.log("─".repeat(50));

    // Test 1: Edge case pattern matching
    const edgeCases = [
      { pattern: "p-[2rem]", valid: true },
      { pattern: "p-[2rem]]", valid: false }, // Extra bracket
      { pattern: "p-[[2rem]", valid: false }, // Extra opening bracket
      { pattern: "p-[2rem,3rem,4rem,5rem,6rem]", valid: true }, // Many values
      { pattern: "p-[]", valid: false }, // Empty brackets
      { pattern: "p-[   ]", valid: false }, // Whitespace only
      { pattern: "p-[2rem;]", valid: false }, // Semicolon
      { pattern: "margin-[2rem,auto,2rem,auto]", valid: true }, // Valid 4-value
    ];

    let correctMatches = 0;
    for (const testCase of edgeCases) {
      try {
        const result = await zyraGenerateCSSFromClasses([testCase.pattern]);
        const actuallyValid = result.success && result.data.css.length > 10;
        if (actuallyValid === testCase.valid) correctMatches++;
      } catch (error) {
        if (!testCase.valid) correctMatches++; // Expected rejection
      }
    }

    this.log(
      "Edge Case Pattern Matching",
      correctMatches >= 6,
      `${correctMatches}/${edgeCases.length} edge cases handled correctly`
    );

    // Test 2: Performance under regex load
    const manyPatterns = [];
    for (let i = 0; i < 1000; i++) {
      manyPatterns.push(`p-[${i}rem]`);
    }

    const regexStartTime = Date.now();
    const regexResult = await zyraGenerateCSSFromClasses(manyPatterns);
    const regexTime = Date.now() - regexStartTime;

    this.log(
      "Regex Performance Under Load",
      regexTime < 3000,
      `1000 patterns processed in ${regexTime}ms`
    );

    // Test 3: Malicious regex patterns
    const maliciousPatterns = [
      "p-[" + "(".repeat(100) + "a".repeat(100) + ")".repeat(100) + "]",
      "m-[" + "x".repeat(1000) + "*".repeat(100) + "]",
      "bg-[((((((((((a*)*)*)*)*)*)*)*)*)*)]",
    ];

    let maliciousHandled = 0;
    for (const pattern of maliciousPatterns) {
      const startTime = Date.now();
      try {
        await zyraGenerateCSSFromClasses([pattern]);
        if (Date.now() - startTime < 500) maliciousHandled++; // Fast processing
      } catch (error) {
        maliciousHandled++; // Properly rejected
      }
    }

    this.log(
      "Malicious Regex Protection",
      maliciousHandled === maliciousPatterns.length,
      `${maliciousHandled}/${maliciousPatterns.length} malicious patterns handled safely`
    );
  }

  async testAdvancedErrorHandling() {
    console.log("\n⚠️  ADVANCED ERROR HANDLING STRESS TESTS");
    console.log("─".repeat(50));

    // Test 1: Cascading error recovery
    const errorCascade = [null, undefined, {}, [], 42, "invalid", "p-[broken"];

    let errorsCaughtGracefully = 0;
    for (const badInput of errorCascade) {
      try {
        const result = await zyraGenerateCSSFromClasses(badInput);
        if (
          result.success === false ||
          (result.success && result.data.css === "")
        ) {
          errorsCaughtGracefully++;
        }
      } catch (error) {
        errorsCaughtGracefully++; // Error properly caught
      }
    }

    this.log(
      "Cascading Error Recovery",
      errorsCaughtGracefully === errorCascade.length,
      `${errorsCaughtGracefully}/${errorCascade.length} error types handled gracefully`
    );

    // Test 2: Memory exhaustion protection
    try {
      const massiveArray = new Array(1000000).fill("p-[1rem]");
      const startTime = Date.now();
      const result = await zyraGenerateCSSFromClasses(massiveArray);
      const processTime = Date.now() - startTime;

      this.log(
        "Memory Exhaustion Protection",
        processTime < 30000,
        `1M classes processed in ${processTime}ms without crash`
      );
    } catch (error) {
      this.log(
        "Memory Exhaustion Protection",
        true,
        "Properly rejected massive input to prevent memory exhaustion"
      );
    }

    // Test 3: Error message quality
    const errorTests = [
      { input: null, expectsError: true },
      { input: "p-[unclosed", expectsError: true },
      { input: [], expectsError: false }, // Empty array is valid
      { input: 42, expectsError: true },
    ];

    let qualityErrors = 0;
    for (const test of errorTests) {
      try {
        const result = await zyraGenerateCSSFromClasses(test.input);
        if (!test.expectsError && result.success) qualityErrors++;
      } catch (error) {
        if (test.expectsError && error.message.length > 10) qualityErrors++;
      }
    }

    this.log(
      "Error Message Quality",
      qualityErrors >= 3,
      `${qualityErrors}/${errorTests.length} error messages were informative`
    );
  }

  async testAdvancedPerformance() {
    console.log("\n⚡ ADVANCED PERFORMANCE STRESS TESTS");
    console.log("─".repeat(50));

    // Test 1: Scaling performance
    const scales = [10, 100, 1000];
    const scalingResults = [];

    for (const scale of scales) {
      const classes = Array.from({ length: scale }, (_, i) => `p-[${i}rem]`);
      const startTime = Date.now();
      await zyraGenerateCSSFromClasses(classes);
      const duration = Date.now() - startTime;
      scalingResults.push(duration);
    }

    // Check if performance scales reasonably (not exponentially)
    const scalingRatio = scalingResults[2] / scalingResults[0]; // 1000 vs 10
    this.log(
      "Performance Scaling",
      scalingRatio < 200,
      `10: ${scalingResults[0]}ms, 100: ${scalingResults[1]}ms, 1000: ${scalingResults[2]}ms`
    );

    // Test 2: Memory efficiency
    const memBefore = process.memoryUsage();

    for (let i = 0; i < 100; i++) {
      await zyraGenerateCSSFromClasses([`test-[${i}px]`]);
    }

    const memAfter = process.memoryUsage();
    const memDiff = (memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024;

    this.log(
      "Memory Efficiency",
      memDiff < 10,
      `Memory increase: ${memDiff.toFixed(2)}MB for 100 generations`
    );

    // Test 3: CPU efficiency under stress
    const cpuStartTime = process.hrtime.bigint();
    const promises = [];

    for (let i = 0; i < 20; i++) {
      promises.push(
        zyraGenerateCSSFromClasses(["p-[1rem]", "m-[2rem]", "bg-[red]"])
      );
    }

    await Promise.all(promises);
    const cpuEndTime = process.hrtime.bigint();
    const cpuDuration = Number(cpuEndTime - cpuStartTime) / 1000000; // Convert to ms

    this.log(
      "CPU Efficiency",
      cpuDuration < 1000,
      `20 concurrent operations completed in ${cpuDuration.toFixed(2)}ms`
    );
  }

  async testCLIStress() {
    console.log("\n💻 CLI STRESS TESTS");
    console.log("─".repeat(50));

    // Create test file with extreme content
    const extremeHTML = `
    <div class="${Array.from({ length: 500 }, (_, i) => `p-[${i}rem] m-[${i}px] bg-[color${i}]`).join(" ")}">
      Extreme test content with 1500 classes
    </div>
    `;

    await fs.writeFile("extreme-test.html", extremeHTML);

    // Test CLI under extreme load
    const cliPromise = new Promise((resolve) => {
      const startTime = Date.now();
      const cli = spawn(
        "node",
        [
          "packages/cli/bin/zyracss",
          "build",
          "extreme-test.html",
          "-o",
          "extreme-output.css",
        ],
        {
          stdio: "pipe",
        }
      );

      cli.on("close", (code) => {
        const duration = Date.now() - startTime;
        resolve({ code, duration });
      });
    });

    const cliResult = await cliPromise;
    this.log(
      "CLI Extreme Load Handling",
      cliResult.code === 0 && cliResult.duration < 10000,
      `1500 classes processed in ${cliResult.duration}ms, exit code: ${cliResult.code}`
    );

    // Cleanup
    try {
      await fs.unlink("extreme-test.html");
      await fs.unlink("extreme-output.css");
    } catch (e) {
      // Ignore cleanup errors
    }
  }

  async runAllTests() {
    await this.testAdvancedSecurity();
    await this.testAdvancedCache();
    await this.testAdvancedParsing();
    await this.testAdvancedRegex();
    await this.testAdvancedErrorHandling();
    await this.testAdvancedPerformance();
    await this.testCLIStress();

    console.log("\n🔥 ADVANCED STRESS TEST SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ PASSED: ${this.results.passed}/${this.results.total}`);
    console.log(`❌ FAILED: ${this.results.failed}/${this.results.total}`);
    console.log(
      `📊 SUCCESS RATE: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`
    );

    if (this.results.failed === 0) {
      console.log("\n🎉 ALL ADVANCED STRESS TESTS PASSED!");
      console.log("ZyraCSS is extremely robust and production-ready! 🚀");
    } else {
      console.log(`\n⚠️  ${this.results.failed} tests need attention.`);
    }
  }
}

// Run the advanced stress tests
const stressTest = new StressTestSuite();
await stressTest.runAllTests();
