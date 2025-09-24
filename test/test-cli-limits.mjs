#!/usr/bin/env node
/**
 * Test CLI safety limits
 */

import fs from "fs/promises";

// Create a file that should trigger the HTML size limit
const largeContent = "x".repeat(11 * 1024 * 1024); // 11MB of content
const html = `<div class="p-[1rem]">${largeContent}</div>`;

await fs.writeFile("large-content-test.html", html);
console.log("Created file with 11MB content (should trigger size limit)");

// Test if it properly rejects
import { spawn } from "child_process";

const testResult = await new Promise((resolve) => {
  const cli = spawn(
    "node",
    [
      "packages/cli/bin/zyracss",
      "build",
      "-i",
      "large-content-test.html",
      "-o",
      "output.css",
    ],
    {
      stdio: "pipe",
    }
  );

  let output = "";
  let errorOutput = "";

  cli.stdout.on("data", (data) => {
    output += data.toString();
  });

  cli.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  cli.on("close", (code) => {
    resolve({ code, output, errorOutput });
  });
});

console.log("\nCLI Test Result:");
console.log(`Exit code: ${testResult.code}`);
console.log(`Output: ${testResult.output}`);
console.log(`Error output: ${testResult.errorOutput}`);

// Cleanup
await fs.unlink("large-content-test.html");
if (fs.existsSync && fs.existsSync("output.css")) {
  await fs.unlink("output.css");
}

