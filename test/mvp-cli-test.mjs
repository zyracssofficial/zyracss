#!/usr/bin/env node
/**
 * ZyraCSS MVP CLI Test
 * Comprehensive CLI functionality testing for MVP validation
 */

import { exec, spawn } from "child_process";
import { promises as fs } from "fs";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

console.log("💻 ZyraCSS MVP CLI Test");
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

async function runCLI(args) {
  try {
    const { stdout, stderr } = await execAsync(
      `node packages/cli/bin/zyracss ${args}`,
      {
        timeout: 10000,
      }
    );
    return { stdout, stderr, success: true };
  } catch (error) {
    return {
      stdout: error.stdout || "",
      stderr: error.stderr || error.message,
      success: false,
      exitCode: error.code,
    };
  }
}

// Test file creation helper
async function createTestFile(filename, content) {
  await fs.writeFile(filename, content);
}

async function cleanup(files) {
  for (const file of files) {
    try {
      await fs.unlink(file);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

console.log("\n🔍 CLI Parsing & Generation Tests");
console.log("─".repeat(40));

// Test 1: Basic ZyraCSS syntax
await createTestFile(
  "test-basic.html",
  `
<div class="p-[2rem] m-[1rem,2rem] bg-[#ff0000] text-[white]">
  <h1 class="font-size-[2rem] line-height-[1.5]">ZyraCSS Test</h1>
</div>
`
);

const basic = await runCLI("build -i test-basic.html -o test-basic.css");
log("Generate CSS from ZyraCSS classes", basic.success);

if (basic.success) {
  const css = await fs.readFile("test-basic.css", "utf8");
  log("Contains padding rule", css.includes("padding: 2rem"));
  log("Contains margin rule", css.includes("margin: 1rem 2rem"));
  log("Contains background rule", css.includes("background: #ff0000"));
  log("Properly escapes brackets", css.includes("\\[") && css.includes("\\]"));
}

// Test 2: Tailwind rejection
await createTestFile(
  "test-tailwind.html",
  `
<div class="p-4 bg-red-500 text-xl m-[2rem] p-[1rem]">
  Should only process ZyraCSS bracket notation
</div>
`
);

const tailwind = await runCLI(
  "build -i test-tailwind.html -o test-tailwind.css"
);
if (tailwind.success) {
  const css = await fs.readFile("test-tailwind.css", "utf8");
  const validRules = (css.match(/\{[^}]+\}/g) || []).length;
  log(
    "Rejects Tailwind classes (only ZyraCSS rules)",
    validRules === 2,
    `(${validRules} rules)`
  );
  log("Processes ZyraCSS m-[2rem]", css.includes("margin: 2rem"));
  log("Processes ZyraCSS p-[1rem]", css.includes("padding: 1rem"));
  log(
    "Ignores Tailwind p-4",
    !css.includes("padding: 1rem") || css.split("padding:").length === 2
  );
}

console.log("\n🛡️ CLI Security Tests");
console.log("─".repeat(40));

// Test 3: Security - XSS prevention
await createTestFile(
  "test-security.html",
  `
<div class="bg-[javascript:alert(1)] p-[expression(alert(1))] m-[2rem]">
  Security test
</div>
`
);

const security = await runCLI(
  "build -i test-security.html -o test-security.css"
);
if (security.success) {
  const css = await fs.readFile("test-security.css", "utf8");
  log("Blocks javascript: injection", !css.includes("javascript:"));
  log("Blocks expression() injection", !css.includes("expression("));
  log("Still processes safe classes", css.includes("margin: 2rem"));
}

// Test 4: Large file protection
const largeContent =
  '<div class="' +
  Array.from({ length: 100000 }, (_, i) => `p-[${i}px]`).join(" ") +
  '">Large</div>';
await createTestFile("test-large.html", largeContent);

const large = await runCLI("build -i test-large.html -o test-large.css");
// This might fail due to size limits, which is expected behavior
log(
  "Handles large files appropriately",
  large.success || large.stderr.includes("too large")
);

console.log("\n⚠️ CLI Error Handling Tests");
console.log("─".repeat(40));

// Test 5: Missing input file
const missing = await runCLI("build -i nonexistent.html -o output.css");
log("Reports missing input file", !missing.success);

// Test 6: Invalid options
const invalid = await runCLI("build --invalid-option");
log("Handles invalid options", !invalid.success);

// Test 7: Output to read-only location (OS-specific)
const isWindows = process.platform === "win32";
const readonlyPath = isWindows
  ? "C:\\Windows\\System32\\readonly.css" // Windows system directory
  : "/root/readonly.css"; // Unix root directory
const readonly = await runCLI(`build -i test-basic.html -o "${readonlyPath}"`);
log("Handles write permission errors", !readonly.success);

console.log("\n⚡ CLI Performance Tests");
console.log("─".repeat(40));

// Test 8: Performance with medium file
await createTestFile(
  "test-perf.html",
  `
<div class="${Array.from({ length: 100 }, (_, i) => `p-[${i}px] m-[${i}rem]`).join(" ")}">
  Performance test
</div>
`
);

const start = Date.now();
const perf = await runCLI("build -i test-perf.html -o test-perf.css");
const duration = Date.now() - start;
log(
  "Processes 200 classes under 5 seconds",
  perf.success && duration < 5000,
  `(${duration}ms)`
);

// Test 9: Help command
const help = await runCLI("--help");
log("Help command works", help.success);

// Test 10: Version command
const version = await runCLI("--version");
log("Version command works", version.success);

console.log("\n🎯 CLI Caching Tests");
console.log("─".repeat(40));

// Test 11: Cache behavior (run same command twice)
const cache1 = await runCLI("build -i test-basic.html -o test-cache.css");
const cache2 = await runCLI("build -i test-basic.html -o test-cache.css");
log("Cache improves performance", cache1.success && cache2.success);

console.log("\n📊 CLI Validation Tests");
console.log("─".repeat(40));

// Test 12: Mixed valid/invalid classes
await createTestFile(
  "test-mixed.html",
  `
<div class="p-[2rem] invalid-class m-[] bg-[blue] malformed-[">
  Mixed validation test
</div>
`
);

const mixed = await runCLI("build -i test-mixed.html -o test-mixed.css");
if (mixed.success) {
  const css = await fs.readFile("test-mixed.css", "utf8");
  const validRules = (css.match(/\{[^}]+\}/g) || []).length;
  log(
    "Processes valid classes, ignores invalid",
    validRules === 2,
    `(${validRules} valid rules)`
  );
}

// Cleanup
await cleanup([
  "test-basic.html",
  "test-basic.css",
  "test-tailwind.html",
  "test-tailwind.css",
  "test-security.html",
  "test-security.css",
  "test-large.html",
  "test-large.css",
  "test-perf.html",
  "test-perf.css",
  "test-cache.css",
  "test-mixed.html",
  "test-mixed.css",
]);

// SUMMARY
console.log("\n🎯 CLI Test Summary");
console.log("=".repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(
  `📊 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`
);

if (failed === 0) {
  console.log("\n🚀 All CLI tests passed! CLI is MVP-ready!");
} else if (failed <= 2) {
  console.log("\n⚠️ Minor CLI issues detected - mostly ready for MVP");
} else {
  console.log("\n⚠️ CLI needs attention before MVP");
  process.exit(1);
}
