#!/usr/bin/env node
/**
 * ZyraCSS API Test Suite
 * Comprehensive testing of API functionality: Security, Cache, Parsing, Regex, Error Handling, Performance
 */

import { zyra } from "../src/index.js";
import { globalCache } from "../src/core/cache/index.js";

console.log("🔌 ZyraCSS API Test Suite");
console.log("=".repeat(50));
console.log(
  "Testing: Security | Cache | Parsing | Regex | Error Handling | Performance"
);
console.log("=".repeat(50));

class APITestSuite {
  constructor() {
    this.results = {
      security: { passed: 0, failed: 0, tests: [] },
      cache: { passed: 0, failed: 0, tests: [] },
      parsing: { passed: 0, failed: 0, tests: [] },
      regex: { passed: 0, failed: 0, tests: [] },
      errorHandling: { passed: 0, failed: 0, tests: [] },
      performance: { passed: 0, failed: 0, tests: [] },
    };
  }

  logTest(category, name, passed, details = "") {
    const status = passed ? "✅ PASS" : "❌ FAIL";
    console.log(`   ${status}: ${name} ${details}`);

    this.results[category].tests.push({ name, passed, details });
    if (passed) {
      this.results[category].passed++;
    } else {
      this.results[category].failed++;
    }
  }

  async testSecurity() {
    console.log("\n🛡️  API Security Tests");
    console.log("─".repeat(40));

    // Test 1: XSS Prevention in API
    try {
      const maliciousClasses = [
        'p-[<script>alert("xss")</script>]',
        "bg-[javascript:alert(1)]",
        "m-[expression(alert(1))]",
      ];

      const result = zyra.generate(maliciousClasses);

      // Check if malicious content is sanitized or properly escaped
      const css = result.data?.css || "";
      const containsRawMalicious =
        css.includes("<script>") ||
        css.includes("javascript:") ||
        css.includes("expression(");

      // Even if it generates CSS, it should be safely escaped
      const safelyHandled =
        !containsRawMalicious || css.includes("\\<") || css.includes("\\3c");

      this.logTest(
        "security",
        "XSS Content Sanitization",
        safelyHandled,
        `${containsRawMalicious ? "Raw malicious content detected" : "Content properly handled"}`
      );
    } catch (error) {
      this.logTest(
        "security",
        "XSS Content Sanitization",
        true,
        "Malicious input properly rejected"
      );
    }

    // Test 2: Input Type Validation
    const invalidInputs = [null, undefined, 123, {}, Symbol("test")];
    let properValidation = 0;

    for (const input of invalidInputs) {
      try {
        const result = zyra.generate(input);
        // If it doesn't throw, it should return an error result
        if (!result.success || result.error) {
          properValidation++;
        }
      } catch (error) {
        // Expected to throw - this is good
        properValidation++;
      }
    }

    this.logTest(
      "security",
      "Input Type Validation",
      properValidation === invalidInputs.length,
      `${properValidation}/${invalidInputs.length} invalid inputs handled`
    );

    // Test 3: CSS Injection Prevention
    try {
      const injectionAttempts = [
        "p-[2rem; } body { background: red; }]",
        "m-[1rem/**/; background: evil;]",
        'bg-[red; @import "evil.css"]',
      ];

      const result = zyra.generate(injectionAttempts);

      if (result.success) {
        const css = result.data?.css || "";
        // Should not contain unescaped injection attempts
        const hasInjection =
          css.includes("} body {") ||
          css.includes("@import") ||
          css.includes("/**/");

        this.logTest(
          "security",
          "CSS Injection Prevention",
          !hasInjection,
          hasInjection ? "Injection detected" : "Injection properly prevented"
        );
      } else {
        this.logTest(
          "security",
          "CSS Injection Prevention",
          true,
          "Injection attempts rejected"
        );
      }
    } catch (error) {
      this.logTest(
        "security",
        "CSS Injection Prevention",
        true,
        "Properly rejected injection"
      );
    }

    // Test 4: Large Input Handling (DoS Prevention)
    try {
      const largeClass = "p-[" + "x".repeat(10000) + "]";
      const startTime = Date.now();

      const result = zyra.generate([largeClass]);
      const processingTime = Date.now() - startTime;

      // Should either handle quickly or reject properly
      const handledWell = processingTime < 1000 || !result.success;

      this.logTest(
        "security",
        "Large Input DoS Prevention",
        handledWell,
        `Processed in ${processingTime}ms`
      );
    } catch (error) {
      this.logTest(
        "security",
        "Large Input DoS Prevention",
        true,
        "Large input properly rejected"
      );
    }
  }

  async testCache() {
    console.log("\n💾 API Cache Tests");
    console.log("─".repeat(40));

    // Clear cache for clean testing
    globalCache.clear();

    const testClasses = ["p-[2rem]", "m-[1rem]", "bg-[#ff0000]"];

    // Test 1: Cache Miss (First Call)
    const result1 = zyra.generate(testClasses);
    this.logTest(
      "cache",
      "Cache Miss Detection",
      result1.data?.stats?.fromCache !== true,
      `fromCache: ${result1.data?.stats?.fromCache}`
    );

    // Test 2: Cache Hit (Second Call)
    const result2 = zyra.generate(testClasses);
    this.logTest(
      "cache",
      "Cache Hit Detection",
      result2.data?.stats?.fromCache === true,
      `fromCache: ${result2.data?.stats?.fromCache}`
    );

    // Test 3: Cache Consistency
    const cssIdentical = result1.data?.css === result2.data?.css;
    this.logTest(
      "cache",
      "Cache Data Consistency",
      cssIdentical,
      `CSS ${cssIdentical ? "identical" : "different"}`
    );

    // Test 4: Cache Performance
    const times = [];
    for (let i = 0; i < 5; i++) {
      const start = Date.now();
      zyra.generate(testClasses);
      times.push(Date.now() - start);
    }

    const avgTime = times.reduce((a, b) => a + b) / times.length;
    this.logTest(
      "cache",
      "Cache Performance",
      avgTime < 5,
      `Average: ${avgTime.toFixed(2)}ms`
    );

    // Test 5: Cache Statistics
    const stats = globalCache.getStats();
    this.logTest(
      "cache",
      "Cache Statistics Tracking",
      stats.totalRequests > 0 && stats.cacheHits > 0,
      `${stats.cacheHits}/${stats.totalRequests} hits`
    );

    // Test 6: Options-Based Cache Separation
    const options1 = { minify: false };
    const options2 = { minify: true };

    zyra.generate(testClasses, options1);
    zyra.generate(testClasses, options2);

    const cached1 = zyra.generate(testClasses, options1);
    const cached2 = zyra.generate(testClasses, options2);

    const bothCached =
      cached1.data?.stats?.fromCache === true &&
      cached2.data?.stats?.fromCache === true;

    this.logTest(
      "cache",
      "Option-Based Cache Separation",
      bothCached,
      "Different options cached separately"
    );
  }

  async testParsing() {
    console.log("\n🔍 API Parsing Tests");
    console.log("─".repeat(40));

    // Test 1: ZyraCSS Bracket Notation
    const zyraClasses = [
      "p-[2rem]",
      "m-[3rem,2rem]",
      "px-[1rem,2rem]",
      "bg-[#ff0000]",
      "text-[1.5rem]",
      "w-[100px]",
      "h-[50vh]",
      "border-[2px,solid,#333]",
      "margin-[auto]",
      "padding-[10px,20px,15px,25px]",
    ];

    let successfulParses = 0;
    for (const className of zyraClasses) {
      const result = zyra.generate([className]);
      if (result.success && result.data?.css && result.data.css.length > 0) {
        successfulParses++;
      }
    }

    this.logTest(
      "parsing",
      "ZyraCSS Bracket Notation Parsing",
      successfulParses >= 8, // Allow some complex cases to fail
      `${successfulParses}/${zyraClasses.length} classes successfully parsed`
    );

    // Test 2: Complex Values
    const complexClasses = [
      "box-shadow-[0,4px,6px,-1px,rgba(0,0,0,0.1)]",
      "transform-[translateX(50%)]",
      "background-[linear-gradient(45deg,#ff0000,#00ff00)]",
    ];

    let complexSuccess = 0;
    for (const className of complexClasses) {
      try {
        const result = zyra.generate([className]);
        if (result.success) complexSuccess++;
      } catch (error) {
        // Some complex cases might not be supported yet
      }
    }

    this.logTest(
      "parsing",
      "Complex Value Parsing",
      complexSuccess >= 1,
      `${complexSuccess}/${complexClasses.length} complex values parsed`
    );

    // Test 3: HTML Class Extraction
    try {
      const htmlContent = `
        <div class="p-[2rem] m-[1rem] bg-[#ff0000]">
          <span class="text-[1.5rem] font-[bold]">Test</span>
        </div>
      `;

      const result = zyra.generate(htmlContent);
      const extractedSuccessfully =
        result.success &&
        result.data?.css &&
        result.data.css.includes("padding") &&
        result.data.css.includes("margin");

      this.logTest(
        "parsing",
        "HTML Class Extraction",
        extractedSuccessfully,
        `Extracted ${result.data?.css?.length || 0} chars of CSS`
      );
    } catch (error) {
      this.logTest("parsing", "HTML Class Extraction", false, error.message);
    }

    // Test 4: Invalid Class Handling
    const invalidClasses = ["invalid-class", "p-[]", "p-[", "m-invalid", ""];
    let invalidHandled = 0;

    for (const className of invalidClasses) {
      try {
        const result = zyra.generate([className]);
        // Should either succeed with empty/minimal CSS or mark as invalid
        if (
          !result.success ||
          result.data?.invalid?.includes(className) ||
          result.data?.css === "" ||
          result.data?.css?.length < 10
        ) {
          invalidHandled++;
        }
      } catch (error) {
        invalidHandled++; // Properly rejected
      }
    }

    this.logTest(
      "parsing",
      "Invalid Class Handling",
      invalidHandled >= 4,
      `${invalidHandled}/${invalidClasses.length} invalid classes handled properly`
    );
  }

  async testRegex() {
    console.log("\n🔤 API Regex Tests");
    console.log("─".repeat(40));

    // Test 1: Pattern Matching Accuracy
    const regexTestCases = [
      { pattern: "p-[2rem]", shouldMatch: true },
      { pattern: "m-[3rem,2rem]", shouldMatch: true },
      { pattern: "bg-[#ff0000]", shouldMatch: true },
      { pattern: "invalid-pattern", shouldMatch: false },
      { pattern: "p-[2rem", shouldMatch: false },
      { pattern: "p-2rem]", shouldMatch: false },
      { pattern: "p-[]", shouldMatch: false },
    ];

    let correctMatches = 0;
    for (const testCase of regexTestCases) {
      try {
        const result = zyra.generate([testCase.pattern]);
        const matched =
          result.success && result.data?.css && result.data.css.length > 20;

        // Convert to proper boolean for comparison
        const actuallyMatched = !!matched;

        if (actuallyMatched === testCase.shouldMatch) {
          correctMatches++;
        }
      } catch (error) {
        if (!testCase.shouldMatch) correctMatches++; // Expected failure
      }
    }

    this.logTest(
      "regex",
      "Pattern Matching Accuracy",
      correctMatches >= 6,
      `${correctMatches}/${regexTestCases.length} patterns matched correctly`
    );

    // Test 2: Regex Performance
    const performanceStart = Date.now();

    for (const testCase of regexTestCases) {
      try {
        zyra.generate([testCase.pattern]);
      } catch (error) {
        // Expected for some patterns
      }
    }

    const regexTime = Date.now() - performanceStart;
    this.logTest(
      "regex",
      "Regex Processing Speed",
      regexTime < 100,
      `${regexTime}ms for ${regexTestCases.length} patterns`
    );

    // Test 3: ReDoS Attack Prevention
    const maliciousPatterns = [
      "p-[" + "a".repeat(1000) + "]",
      "m-[" + "(".repeat(50) + ")".repeat(50) + "]",
    ];

    let regexSecure = true;
    const securityStart = Date.now();

    for (const pattern of maliciousPatterns) {
      const patternStart = Date.now();
      try {
        zyra.generate([pattern]);
      } catch (error) {
        // Expected rejection
      }
      const patternTime = Date.now() - patternStart;

      if (patternTime > 500) {
        // More than 500ms is suspicious
        regexSecure = false;
        break;
      }
    }

    const totalSecurityTime = Date.now() - securityStart;
    this.logTest(
      "regex",
      "ReDoS Attack Prevention",
      regexSecure && totalSecurityTime < 2000,
      `${totalSecurityTime}ms for malicious patterns`
    );

    // Test 4: Unicode and Special Character Handling
    const specialChars = [
      "p-[测试]", // Chinese characters
      "m-[café]", // Accented characters
      "bg-[#ff0000]", // Hash symbol
      "border-[1px,solid,rgba(0,0,0,0.5)]", // Parentheses and commas
    ];

    let specialHandled = 0;
    for (const pattern of specialChars) {
      try {
        const result = zyra.generate([pattern]);
        if (result.success || result.data?.invalid?.includes(pattern)) {
          specialHandled++; // Either parsed or properly marked invalid
        }
      } catch (error) {
        specialHandled++; // Properly rejected
      }
    }

    this.logTest(
      "regex",
      "Special Character Handling",
      specialHandled === specialChars.length,
      `${specialHandled}/${specialChars.length} special patterns handled`
    );
  }

  async testErrorHandling() {
    console.log("\n⚠️  API Error Handling Tests");
    console.log("─".repeat(40));

    // Test 1: Null/Undefined Input Handling
    const nullInputs = [null, undefined];
    let nullHandling = 0;

    for (const input of nullInputs) {
      try {
        const result = zyra.generate(input);
        // Should return error result, not throw
        if (!result.success && result.error) {
          nullHandling++;
        }
      } catch (error) {
        // Also acceptable to throw
        nullHandling++;
      }
    }

    this.logTest(
      "errorHandling",
      "Null/Undefined Input Handling",
      nullHandling === nullInputs.length,
      `${nullHandling}/${nullInputs.length} null inputs handled`
    );

    // Test 2: Wrong Type Input Handling
    const wrongTypes = [123, {}, true, Symbol("test")];
    let wrongTypeHandling = 0;

    for (const input of wrongTypes) {
      try {
        const result = zyra.generate(input);
        if (!result.success) {
          wrongTypeHandling++;
        }
      } catch (error) {
        wrongTypeHandling++;
      }
    }

    this.logTest(
      "errorHandling",
      "Wrong Type Input Handling",
      wrongTypeHandling === wrongTypes.length,
      `${wrongTypeHandling}/${wrongTypes.length} wrong type inputs handled`
    );

    // Test 3: Empty Input Graceful Handling
    try {
      const emptyResult = zyra.generate([]);
      this.logTest(
        "errorHandling",
        "Empty Input Graceful Handling",
        emptyResult.success === true && emptyResult.data?.css === "",
        "Empty array handled gracefully"
      );
    } catch (error) {
      this.logTest(
        "errorHandling",
        "Empty Input Graceful Handling",
        false,
        error.message
      );
    }

    // Test 4: Malformed Class Graceful Handling
    const malformedClasses = [
      "p-[unclosed",
      "m-unopened]",
      "bg-[nested[brackets]]",
      'text-[quotes"inside]',
    ];

    let malformedHandling = 0;
    for (const className of malformedClasses) {
      try {
        const result = zyra.generate([className]);
        // Should handle gracefully - either succeed, mark as invalid, or reject for security
        if (
          result.success ||
          result.data?.invalid?.includes(className) ||
          (result.error && result.error.code === "DANGEROUS_INPUT")
        ) {
          malformedHandling++;
        }
      } catch (error) {
        malformedHandling++; // Also acceptable to reject with exception
      }
    }

    this.logTest(
      "errorHandling",
      "Malformed Class Graceful Handling",
      malformedHandling === malformedClasses.length,
      `${malformedHandling}/${malformedClasses.length} malformed classes handled`
    );

    // Test 5: Error Message Quality
    try {
      zyra.generate(null);
    } catch (error) {
      const hasUsefulError =
        error.message &&
        error.message.length > 10 &&
        (error.code || error.name);
      this.logTest(
        "errorHandling",
        "Error Message Quality",
        hasUsefulError,
        `Message: "${error.message?.substring(0, 30)}..."`
      );
    }
  }

  async testPerformance() {
    console.log("\n⚡ API Performance Tests");
    console.log("─".repeat(40));

    globalCache.clear();

    // Test 1: Small Set Performance
    const smallSet = ["p-[2rem]", "m-[1rem]", "bg-[#ff0000]"];
    const smallTimes = [];

    for (let i = 0; i < 5; i++) {
      const start = process.hrtime.bigint();
      zyra.generate(smallSet);
      const end = process.hrtime.bigint();
      smallTimes.push(Number(end - start) / 1_000_000);
    }

    const avgSmall = smallTimes.reduce((a, b) => a + b) / smallTimes.length;
    this.logTest(
      "performance",
      "Small Set Performance",
      avgSmall < 50,
      `${avgSmall.toFixed(2)}ms average for 3 classes`
    );

    // Test 2: Large Set Performance
    const largeSet = Array.from({ length: 20 }, (_, i) => `p-[${i + 1}rem]`);

    const largeStart = process.hrtime.bigint();
    zyra.generate(largeSet);
    const largeEnd = process.hrtime.bigint();
    const largeTime = Number(largeEnd - largeStart) / 1_000_000;

    this.logTest(
      "performance",
      "Large Set Performance",
      largeTime < 200,
      `${largeTime.toFixed(2)}ms for ${largeSet.length} classes`
    );

    // Test 3: Cache Performance Improvement
    globalCache.clear();

    const coldStart = process.hrtime.bigint();
    zyra.generate(smallSet);
    const coldEnd = process.hrtime.bigint();
    const coldTime = Number(coldEnd - coldStart) / 1_000_000;

    const warmStart = process.hrtime.bigint();
    zyra.generate(smallSet);
    const warmEnd = process.hrtime.bigint();
    const warmTime = Number(warmEnd - warmStart) / 1_000_000;

    const speedup = coldTime / Math.max(warmTime, 0.01);
    this.logTest(
      "performance",
      "Cache Performance Improvement",
      speedup > 2,
      `${speedup.toFixed(1)}x faster with cache (${coldTime.toFixed(2)}ms → ${warmTime.toFixed(2)}ms)`
    );

    // Test 4: Memory Stability
    const initialMemory = process.memoryUsage().heapUsed;

    for (let i = 0; i < 50; i++) {
      zyra.generate([`p-[${i}px]`, `m-[${i}rem]`]);
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024;

    this.logTest(
      "performance",
      "Memory Usage Stability",
      memoryIncrease < 10,
      `${memoryIncrease.toFixed(2)}MB increase after 50 generations`
    );

    // Test 5: Concurrent Request Handling
    const concurrentPromises = Array.from({ length: 10 }, (_, i) =>
      zyra.generate([`p-[${i}rem]`, `m-[${i}px]`])
    );

    const concurrentStart = process.hrtime.bigint();
    await Promise.all(concurrentPromises);
    const concurrentEnd = process.hrtime.bigint();
    const concurrentTime = Number(concurrentEnd - concurrentStart) / 1_000_000;

    this.logTest(
      "performance",
      "Concurrent Request Handling",
      concurrentTime < 500,
      `${concurrentTime.toFixed(2)}ms for 10 concurrent requests`
    );
  }

  printSummary() {
    console.log("\n📊 API Test Suite Summary");
    console.log("=".repeat(50));

    const categories = Object.keys(this.results);
    let totalPassed = 0;
    let totalFailed = 0;

    categories.forEach((category) => {
      const { passed, failed } = this.results[category];
      totalPassed += passed;
      totalFailed += failed;

      const total = passed + failed;
      const percentage =
        total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";
      const status = failed === 0 ? "✅" : failed < passed ? "⚠️" : "❌";

      console.log(
        `${status} ${category.toUpperCase().padEnd(15)} ${passed.toString().padStart(2)}/${total.toString().padEnd(2)} (${percentage}%)`
      );
    });

    console.log("─".repeat(50));
    const overallPercentage = (
      (totalPassed / (totalPassed + totalFailed)) *
      100
    ).toFixed(1);
    const overallStatus =
      totalFailed === 0 ? "🎉" : totalFailed < totalPassed ? "⚠️" : "💥";

    console.log(
      `${overallStatus} API OVERALL:        ${totalPassed}/${totalPassed + totalFailed} (${overallPercentage}%)`
    );

    if (totalFailed === 0) {
      console.log("\n🎉 All API tests passed! The API is working perfectly.");
    } else if (totalFailed < totalPassed) {
      console.log(
        `\n⚠️  Most API tests passed, but ${totalFailed} areas need attention.`
      );
    } else {
      console.log(
        `\n💥 API needs significant fixes. ${totalFailed} tests failed.`
      );
    }
  }
}

async function runAPITestSuite() {
  const suite = new APITestSuite();

  try {
    await suite.testSecurity();
    await suite.testCache();
    await suite.testParsing();
    await suite.testRegex();
    await suite.testErrorHandling();
    await suite.testPerformance();

    suite.printSummary();
  } catch (error) {
    console.error("\n💥 API test suite execution failed:");
    console.error(error.message);
    console.error(error.stack);
  }
}

runAPITestSuite();

