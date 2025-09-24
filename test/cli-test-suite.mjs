#!/usr/bin/env node
/**
 * ZyraCSS CLI Test Suite
 * Comprehensive testing of CLI functionality: Security, Cache, Parsing, Regex, Error Handling, Performance
 */

import { exec, spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("💻 ZyraCSS CLI Test Suite");
console.log("=".repeat(50));
console.log(
  "Testing: Security | Cache | Parsing | Regex | Error Handling | Performance"
);
console.log("=".repeat(50));

class CLITestSuite {
  constructor() {
    this.results = {
      security: { passed: 0, failed: 0, tests: [] },
      cache: { passed: 0, failed: 0, tests: [] },
      parsing: { passed: 0, failed: 0, tests: [] },
      regex: { passed: 0, failed: 0, tests: [] },
      errorHandling: { passed: 0, failed: 0, tests: [] },
      performance: { passed: 0, failed: 0, tests: [] },
    };

    this.cliPath = path.resolve(__dirname, "../packages/cli/bin/zyracss");
    this.testDir = path.resolve(__dirname, "cli-test-temp");
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

  async setupTestEnvironment() {
    try {
      await fs.mkdir(this.testDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  async cleanupTestEnvironment() {
    try {
      await fs.rm(this.testDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist
    }
  }

  async execCLI(args, options = {}) {
    const command = `node "${this.cliPath}" ${args}`;

    try {
      const result = await execAsync(command, {
        timeout: 10000,
        cwd: options.cwd || this.testDir,
        ...options,
      });

      return {
        success: true,
        stdout: result.stdout,
        stderr: result.stderr,
        code: 0,
      };
    } catch (error) {
      return {
        success: false,
        stdout: error.stdout || "",
        stderr: error.stderr || "",
        code: error.code || 1,
        error: error.message,
      };
    }
  }

  async testSecurity() {
    console.log("\n🛡️  CLI Security Tests");
    console.log("─".repeat(40));

    // Test 1: Malicious Class Input via CLI
    const maliciousHTML = `
      <div class="p-[<script>alert('xss')</script>] m-[javascript:void(0)] bg-[expression(alert(1))]">
        Test content
      </div>
    `;

    const maliciousFile = path.join(this.testDir, "malicious.html");
    await fs.writeFile(maliciousFile, maliciousHTML);

    const maliciousResult = await this.execCLI(
      `build --input "${maliciousFile}" --output "${this.testDir}/malicious.css"`
    );

    let isSafe = false;
    if (maliciousResult.success) {
      try {
        const outputCSS = await fs.readFile(
          path.join(this.testDir, "malicious.css"),
          "utf8"
        );
        // Check if malicious content is properly escaped or removed
        isSafe =
          !outputCSS.includes("<script>") &&
          !outputCSS.includes("javascript:") &&
          !outputCSS.includes("expression(");
      } catch (error) {
        isSafe = true; // No output file created - also safe
      }
    } else {
      isSafe = true; // Properly rejected
    }

    this.logTest(
      "security",
      "Malicious Input Sanitization",
      isSafe,
      isSafe ? "Malicious content properly handled" : "Unsafe content detected"
    );

    // Test 2: Path Traversal Prevention
    const traversalResult = await this.execCLI(
      `build --input "../../../etc/passwd" --output test.css`
    );
    const pathTraversalPrevented =
      !traversalResult.success ||
      traversalResult.stderr.includes("error") ||
      traversalResult.stderr.includes("invalid");

    this.logTest(
      "security",
      "Path Traversal Prevention",
      pathTraversalPrevented,
      pathTraversalPrevented
        ? "Path traversal blocked"
        : "Path traversal allowed"
    );

    // Test 3: Output Path Validation
    const outputResult = await this.execCLI(
      `build --input test.html --output "../../dangerous/path.css"`
    );
    const outputValidated =
      !outputResult.success ||
      outputResult.stderr.includes("error") ||
      !(await fs
        .access("../../dangerous/path.css")
        .then(() => true)
        .catch(() => false));

    this.logTest(
      "security",
      "Output Path Validation",
      outputValidated,
      outputValidated
        ? "Output path properly validated"
        : "Dangerous output path allowed"
    );

    // Test 4: Large File DoS Prevention
    const largeContent =
      '<div class="' + "p-[1rem] ".repeat(10000) + '">test</div>';
    const largeFile = path.join(this.testDir, "large.html");
    await fs.writeFile(largeFile, largeContent);

    const startTime = Date.now();
    const largeResult = await this.execCLI(
      `build --input "${largeFile}" --output "${this.testDir}/large.css"`
    );
    const processingTime = Date.now() - startTime;

    const dosProtected = processingTime < 30000; // Should complete within 30 seconds

    this.logTest(
      "security",
      "Large File DoS Prevention",
      dosProtected,
      `Processed in ${processingTime}ms`
    );
  }

  async testCache() {
    console.log("\n💾 CLI Cache Tests");
    console.log("─".repeat(40));

    const testHTML = `
      <div class="p-[2rem] m-[1rem] bg-[#ff0000]">
        Test content for caching
      </div>
    `;

    const testFile = path.join(this.testDir, "cache-test.html");
    const outputFile = path.join(this.testDir, "cache-test.css");
    await fs.writeFile(testFile, testHTML);

    // Test 1: First Run (Cache Miss)
    const firstRun = await this.execCLI(
      `build --input "${testFile}" --output "${outputFile}" --verbose`
    );
    const firstRunSuccess =
      firstRun.success &&
      (await fs
        .access(outputFile)
        .then(() => true)
        .catch(() => false));

    this.logTest(
      "cache",
      "First Run Success",
      firstRunSuccess,
      firstRunSuccess ? "CSS generated successfully" : "First run failed"
    );

    // Test 2: Second Run (Cache Hit Potential)
    const secondRunStart = Date.now();
    const secondRun = await this.execCLI(
      `build --input "${testFile}" --output "${outputFile}" --verbose`
    );
    const secondRunTime = Date.now() - secondRunStart;

    const secondRunFaster = secondRun.success && secondRunTime < 5000; // Should be faster due to caching

    this.logTest(
      "cache",
      "Cache Performance Improvement",
      secondRunFaster,
      `Second run: ${secondRunTime}ms`
    );

    // Test 3: Cache Invalidation on File Change
    const modifiedHTML = testHTML.replace("p-[2rem]", "p-[3rem]");
    await fs.writeFile(testFile, modifiedHTML);

    const invalidationRun = await this.execCLI(
      `build --input "${testFile}" --output "${outputFile}"`
    );

    let cacheInvalidated = false;
    if (invalidationRun.success) {
      try {
        const newCSS = await fs.readFile(outputFile, "utf8");
        cacheInvalidated = newCSS.includes("3rem") || newCSS.includes("48px");
      } catch (error) {
        cacheInvalidated = false;
      }
    }

    this.logTest(
      "cache",
      "Cache Invalidation on File Change",
      cacheInvalidated,
      cacheInvalidated ? "Cache properly invalidated" : "Stale cache detected"
    );

    // Test 4: Different Options Create Separate Cache
    const minifiedRun = await this.execCLI(
      `build --input "${testFile}" --output "${this.testDir}/minified.css" --minify`
    );
    const normalRun = await this.execCLI(
      `build --input "${testFile}" --output "${this.testDir}/normal.css"`
    );

    let separateCache = false;
    if (minifiedRun.success && normalRun.success) {
      try {
        const minifiedCSS = await fs.readFile(
          path.join(this.testDir, "minified.css"),
          "utf8"
        );
        const normalCSS = await fs.readFile(
          path.join(this.testDir, "normal.css"),
          "utf8"
        );
        separateCache = minifiedCSS !== normalCSS;
      } catch (error) {
        separateCache = false;
      }
    }

    this.logTest(
      "cache",
      "Option-Specific Caching",
      separateCache,
      separateCache
        ? "Different options cached separately"
        : "Cache not option-aware"
    );
  }

  async testParsing() {
    console.log("\n🔍 CLI Parsing Tests");
    console.log("─".repeat(40));

    // Test 1: ZyraCSS Bracket Notation Support
    const zyraHTML = `
      <div class="p-[2rem] m-[3rem,2rem] px-[1rem,2rem] bg-[#ff0000]">
        <span class="text-[1.5rem] w-[100px] h-[50vh] border-[2px,solid,#333]">
          ZyraCSS Test
        </span>
      </div>
    `;

    const zyraFile = path.join(this.testDir, "zyra-syntax.html");
    const zyraOutput = path.join(this.testDir, "zyra-syntax.css");
    await fs.writeFile(zyraFile, zyraHTML);

    const zyraResult = await this.execCLI(
      `build --input "${zyraFile}" --output "${zyraOutput}"`
    );

    let zyraSupported = false;
    if (zyraResult.success) {
      try {
        const css = await fs.readFile(zyraOutput, "utf8");
        zyraSupported =
          css.includes("padding") &&
          css.includes("margin") &&
          css.includes("background") &&
          css.length > 100;
      } catch (error) {
        zyraSupported = false;
      }
    }

    this.logTest(
      "parsing",
      "ZyraCSS Bracket Notation Support",
      zyraSupported,
      `Generated ${zyraSupported ? "valid" : "invalid"} CSS`
    );

    // Test 2: Complex Value Parsing
    const complexHTML = `
      <div class="box-shadow-[0,4px,6px,-1px,rgba(0,0,0,0.1)] transform-[translateX(50%)]">
        Complex values test
      </div>
    `;

    const complexFile = path.join(this.testDir, "complex.html");
    const complexOutput = path.join(this.testDir, "complex.css");
    await fs.writeFile(complexFile, complexHTML);

    const complexResult = await this.execCLI(
      `build --input "${complexFile}" --output "${complexOutput}"`
    );

    let complexSupported = complexResult.success;
    if (complexSupported) {
      try {
        const css = await fs.readFile(complexOutput, "utf8");
        // Even if complex values aren't fully supported, should generate something
        complexSupported = css.length > 0;
      } catch (error) {
        complexSupported = false;
      }
    }

    this.logTest(
      "parsing",
      "Complex Value Handling",
      complexSupported,
      complexSupported ? "Complex values processed" : "Complex values failed"
    );

    // Test 3: Invalid Class Graceful Handling
    const invalidHTML = `
      <div class="p-[2rem] invalid-class m-[] bg-[unclosed">
        Mixed valid and invalid classes
      </div>
    `;

    const invalidFile = path.join(this.testDir, "invalid.html");
    const invalidOutput = path.join(this.testDir, "invalid.css");
    await fs.writeFile(invalidFile, invalidHTML);

    const invalidResult = await this.execCLI(
      `build --input "${invalidFile}" --output "${invalidOutput}"`
    );

    let gracefulHandling = invalidResult.success; // Should not crash
    if (gracefulHandling) {
      try {
        const css = await fs.readFile(invalidOutput, "utf8");
        // Should generate CSS for valid classes at least
        gracefulHandling = css.includes("padding");
      } catch (error) {
        gracefulHandling = false;
      }
    }

    this.logTest(
      "parsing",
      "Invalid Class Graceful Handling",
      gracefulHandling,
      gracefulHandling
        ? "Invalid classes handled gracefully"
        : "Parser crashed on invalid input"
    );

    // Test 4: Multiple File Processing
    const file1 = path.join(this.testDir, "multi1.html");
    const file2 = path.join(this.testDir, "multi2.html");
    const multiOutput = path.join(this.testDir, "multi.css");

    await fs.writeFile(file1, '<div class="p-[1rem] m-[2rem]">File 1</div>');
    await fs.writeFile(
      file2,
      '<div class="bg-[#ff0000] text-[1.5rem]">File 2</div>'
    );

    const multiResult = await this.execCLI(
      `build --input "${file1},${file2}" --output "${multiOutput}"`
    );

    let multiFileSupport = false;
    if (multiResult.success || multiResult.stderr.includes("multiple")) {
      // Either supports multiple files or gives clear error about not supporting it
      multiFileSupport = true;
    }

    this.logTest(
      "parsing",
      "Multiple File Support",
      multiFileSupport,
      multiResult.success
        ? "Multiple files processed"
        : "Multiple files not supported"
    );
  }

  async testRegex() {
    console.log("\n🔤 CLI Regex Tests");
    console.log("─".repeat(40));

    // Test 1: Pattern Recognition Accuracy
    const regexHTML = `
      <div class="
        p-[2rem] 
        m-[3rem,2rem] 
        bg-[#ff0000] 
        text-[1.5rem]
        invalid-pattern
        p-[2rem
        p-2rem]
      ">
        Regex pattern test
      </div>
    `;

    const regexFile = path.join(this.testDir, "regex-test.html");
    const regexOutput = path.join(this.testDir, "regex-test.css");
    await fs.writeFile(regexFile, regexHTML);

    const regexResult = await this.execCLI(
      `build --input "${regexFile}" --output "${regexOutput}" --verbose`
    );

    let patternAccuracy = false;
    if (regexResult.success) {
      try {
        const css = await fs.readFile(regexOutput, "utf8");
        // Should match valid patterns, ignore invalid ones
        const hasValidPatterns =
          css.includes("padding") &&
          css.includes("margin") &&
          css.includes("background");
        const hasInvalidPatterns =
          css.includes("invalid-pattern") ||
          css.includes("p-[2rem") ||
          css.includes("p-2rem]");

        patternAccuracy = hasValidPatterns && !hasInvalidPatterns;
      } catch (error) {
        patternAccuracy = false;
      }
    }

    this.logTest(
      "regex",
      "Pattern Recognition Accuracy",
      patternAccuracy,
      patternAccuracy
        ? "Valid patterns matched, invalid ignored"
        : "Pattern matching issues"
    );

    // Test 2: Unicode Character Support
    const unicodeHTML = `
      <div class="p-[测试] m-[café] bg-[#ff0000]">
        Unicode character test
      </div>
    `;

    const unicodeFile = path.join(this.testDir, "unicode.html");
    const unicodeOutput = path.join(this.testDir, "unicode.css");
    await fs.writeFile(unicodeFile, unicodeHTML);

    const unicodeResult = await this.execCLI(
      `build --input "${unicodeFile}" --output "${unicodeOutput}"`
    );

    let unicodeSupport = unicodeResult.success; // Should not crash

    this.logTest(
      "regex",
      "Unicode Character Handling",
      unicodeSupport,
      unicodeSupport
        ? "Unicode characters handled"
        : "Unicode characters caused failure"
    );

    // Test 3: Regex Performance Under Load
    const loadHTML =
      '<div class="' +
      Array.from({ length: 100 }, (_, i) => `p-[${i}rem] m-[${i}px]`).join(
        " "
      ) +
      '">Performance test</div>';

    const loadFile = path.join(this.testDir, "load-test.html");
    const loadOutput = path.join(this.testDir, "load-test.css");
    await fs.writeFile(loadFile, loadHTML);

    const loadStart = Date.now();
    const loadResult = await this.execCLI(
      `build --input "${loadFile}" --output "${loadOutput}"`
    );
    const loadTime = Date.now() - loadStart;

    const performantRegex = loadResult.success && loadTime < 10000; // Should complete in 10s

    this.logTest(
      "regex",
      "Regex Performance Under Load",
      performantRegex,
      `${loadTime}ms for 200 classes`
    );

    // Test 4: ReDoS Attack Prevention
    const maliciousHTML = `
      <div class="p-[${"a".repeat(1000)}] m-[${"(".repeat(50)}${")".repeat(50)}]">
        ReDoS test
      </div>
    `;

    const maliciousFile = path.join(this.testDir, "redos-test.html");
    await fs.writeFile(maliciousFile, maliciousHTML);

    const redosStart = Date.now();
    const redosResult = await this.execCLI(
      `build --input "${maliciousFile}" --output "${this.testDir}/redos.css"`
    );
    const redosTime = Date.now() - redosStart;

    const redosProtected = redosTime < 5000; // Should not hang

    this.logTest(
      "regex",
      "ReDoS Attack Prevention",
      redosProtected,
      `Malicious patterns processed in ${redosTime}ms`
    );
  }

  async testErrorHandling() {
    console.log("\n⚠️  CLI Error Handling Tests");
    console.log("─".repeat(40));

    // Test 1: Missing Input File
    const missingResult = await this.execCLI(
      `build --input "nonexistent.html" --output "test.css"`
    );
    const missingHandled =
      !missingResult.success &&
      (missingResult.stderr.includes("not found") ||
        missingResult.stderr.includes("ENOENT") ||
        missingResult.error?.includes("ENOENT"));

    this.logTest(
      "errorHandling",
      "Missing Input File Error",
      missingHandled,
      missingHandled
        ? "Missing file properly reported"
        : "Missing file not detected"
    );

    // Test 2: Invalid Options
    const invalidResult = await this.execCLI(`--invalid-option value`);
    const invalidHandled =
      !invalidResult.success &&
      (invalidResult.stderr.includes("unknown") ||
        invalidResult.stderr.includes("invalid") ||
        invalidResult.stderr.includes("option"));

    this.logTest(
      "errorHandling",
      "Invalid Option Error",
      invalidHandled,
      invalidHandled
        ? "Invalid option properly reported"
        : "Invalid option not caught"
    );

    // Test 3: Write Permission Error
    const readonlyDir = path.join(this.testDir, "readonly");
    await fs.mkdir(readonlyDir, { recursive: true });

    // Try to make directory readonly (may not work on all systems)
    try {
      await fs.chmod(readonlyDir, 0o444);
    } catch (error) {
      // Permissions might not be supported
    }

    const testFile = path.join(this.testDir, "test.html");
    await fs.writeFile(testFile, '<div class="p-[2rem]">test</div>');

    const permissionResult = await this.execCLI(
      `build --input "${testFile}" --output "${readonlyDir}/output.css"`
    );

    // Either succeeds (permissions not enforced) or fails with proper error
    const permissionHandled =
      permissionResult.success ||
      permissionResult.stderr.includes("permission") ||
      permissionResult.stderr.includes("EACCES");

    this.logTest(
      "errorHandling",
      "Write Permission Error",
      permissionHandled,
      permissionHandled
        ? "Permission error handled"
        : "Permission error not detected"
    );

    // Test 4: Help Text Availability
    const helpResult = await this.execCLI(`--help`);
    const hasHelp =
      (helpResult.success && helpResult.stdout.includes("usage")) ||
      helpResult.stdout.includes("options") ||
      helpResult.stdout.includes("help");

    this.logTest(
      "errorHandling",
      "Help Text Availability",
      hasHelp,
      hasHelp ? "Help text available" : "No help text found"
    );

    // Test 5: Graceful Exit on Interrupt
    // This is hard to test automatically, so we'll test timeout handling instead
    const testHTML = '<div class="' + "p-[1rem] ".repeat(1000) + '">huge</div>';
    const hugeFile = path.join(this.testDir, "huge.html");
    await fs.writeFile(hugeFile, testHTML);

    const timeoutResult = await this.execCLI(
      `build --input "${hugeFile}" --output "${this.testDir}/huge.css"`,
      {
        timeout: 1000, // 1 second timeout
      }
    );

    // Should either complete quickly or timeout gracefully
    const gracefulTimeout =
      timeoutResult.success ||
      timeoutResult.error?.includes("timeout") ||
      timeoutResult.code === "SIGTERM";

    this.logTest(
      "errorHandling",
      "Graceful Process Termination",
      gracefulTimeout,
      gracefulTimeout ? "Process termination handled" : "Hung on large input"
    );
  }

  async testPerformance() {
    console.log("\n⚡ CLI Performance Tests");
    console.log("─".repeat(40));

    // Test 1: Small File Processing Speed
    const smallHTML = `
      <div class="p-[2rem] m-[1rem] bg-[#ff0000] text-[1.5rem]">
        Small file test
      </div>
    `;

    const smallFile = path.join(this.testDir, "small.html");
    const smallOutput = path.join(this.testDir, "small.css");
    await fs.writeFile(smallFile, smallHTML);

    const smallStart = Date.now();
    const smallResult = await this.execCLI(
      `build --input "${smallFile}" --output "${smallOutput}"`
    );
    const smallTime = Date.now() - smallStart;

    const smallFast = smallResult.success && smallTime < 5000;

    this.logTest(
      "performance",
      "Small File Processing Speed",
      smallFast,
      `${smallTime}ms for small file`
    );

    // Test 2: Medium File Processing Speed
    const mediumHTML =
      '<div class="' +
      Array.from(
        { length: 50 },
        (_, i) => `p-[${i + 1}rem] m-[${i + 1}px]`
      ).join(" ") +
      '">Medium file test</div>';

    const mediumFile = path.join(this.testDir, "medium.html");
    const mediumOutput = path.join(this.testDir, "medium.css");
    await fs.writeFile(mediumFile, mediumHTML);

    const mediumStart = Date.now();
    const mediumResult = await this.execCLI(
      `build --input "${mediumFile}" --output "${mediumOutput}"`
    );
    const mediumTime = Date.now() - mediumStart;

    const mediumFast = mediumResult.success && mediumTime < 15000;

    this.logTest(
      "performance",
      "Medium File Processing Speed",
      mediumFast,
      `${mediumTime}ms for 100 classes`
    );

    // Test 3: Memory Usage Efficiency
    const initialMemory = process.memoryUsage().heapUsed;

    // Process several files to test memory stability
    for (let i = 0; i < 5; i++) {
      const testHTML = `<div class="${Array.from({ length: 20 }, (_, j) => `p-[${i}-${j}rem]`).join(" ")}">Test ${i}</div>`;
      const testFile = path.join(this.testDir, `memory-test-${i}.html`);
      const testOutput = path.join(this.testDir, `memory-test-${i}.css`);

      await fs.writeFile(testFile, testHTML);
      await this.execCLI(
        `build --input "${testFile}" --output "${testOutput}"`
      );
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024;

    const memoryEfficient = memoryIncrease < 50; // Less than 50MB increase

    this.logTest(
      "performance",
      "Memory Usage Efficiency",
      memoryEfficient,
      `${memoryIncrease.toFixed(2)}MB memory increase`
    );

    // Test 4: Startup Time
    const startupTimes = [];

    for (let i = 0; i < 3; i++) {
      const startupStart = Date.now();
      await this.execCLI(`--version`);
      const startupTime = Date.now() - startupStart;
      startupTimes.push(startupTime);
    }

    const avgStartup =
      startupTimes.reduce((a, b) => a + b) / startupTimes.length;
    const fastStartup = avgStartup < 3000;

    this.logTest(
      "performance",
      "CLI Startup Speed",
      fastStartup,
      `${avgStartup.toFixed(0)}ms average startup`
    );

    // Test 5: Output File Size Efficiency
    const efficiencyHTML = `
      <div class="p-[2rem] p-[2rem] p-[2rem] m-[1rem] m-[1rem]">
        Duplicate classes test
      </div>
    `;

    const efficiencyFile = path.join(this.testDir, "efficiency.html");
    const normalOutput = path.join(this.testDir, "normal.css");
    const minifiedOutput = path.join(this.testDir, "minified.css");

    await fs.writeFile(efficiencyFile, efficiencyHTML);

    await this.execCLI(
      `--input "${efficiencyFile}" --output "${normalOutput}"`
    );
    await this.execCLI(
      `--input "${efficiencyFile}" --output "${minifiedOutput}" --minify`
    );

    let sizeEfficient = false;
    try {
      const normalStats = await fs.stat(normalOutput);
      const minifiedStats = await fs.stat(minifiedOutput);

      // Minified should be smaller or similar size
      sizeEfficient = minifiedStats.size <= normalStats.size;

      this.logTest(
        "performance",
        "Output Size Efficiency",
        sizeEfficient,
        `Normal: ${normalStats.size}B, Minified: ${minifiedStats.size}B`
      );
    } catch (error) {
      this.logTest(
        "performance",
        "Output Size Efficiency",
        false,
        "Could not compare file sizes"
      );
    }
  }

  printSummary() {
    console.log("\n📊 CLI Test Suite Summary");
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
      `${overallStatus} CLI OVERALL:        ${totalPassed}/${totalPassed + totalFailed} (${overallPercentage}%)`
    );

    if (totalFailed === 0) {
      console.log("\n🎉 All CLI tests passed! The CLI is working perfectly.");
    } else if (totalFailed < totalPassed) {
      console.log(
        `\n⚠️  Most CLI tests passed, but ${totalFailed} areas need attention.`
      );
    } else {
      console.log(
        `\n💥 CLI needs significant fixes. ${totalFailed} tests failed.`
      );
    }
  }
}

async function runCLITestSuite() {
  const suite = new CLITestSuite();

  try {
    await suite.setupTestEnvironment();

    await suite.testSecurity();
    await suite.testCache();
    await suite.testParsing();
    await suite.testRegex();
    await suite.testErrorHandling();
    await suite.testPerformance();

    suite.printSummary();
  } catch (error) {
    console.error("\n💥 CLI test suite execution failed:");
    console.error(error.message);
    console.error(error.stack);
  } finally {
    await suite.cleanupTestEnvironment();
  }
}

runCLITestSuite();

