#!/usr/bin/env node
/**
 * ZyraCSS Font Family Test Suite
 * Tests font-family and ff property handling including:
 * - System fonts (Arial, Times, etc.)
 * - Google fonts (proper capitalization and quotes)
 * - Multiple font fallbacks
 * - Font names with underscores/spaces
 */

import { zyra } from "../src/index.js";

console.log("🔤 ZyraCSS Font Family Test Suite");
console.log("=================================");

let passed = 0;
let failed = 0;

function testFont(className, expectedCSS, description) {
  try {
    const result = zyra.generate([className]);
    if (result.success && result.data.css.includes(expectedCSS)) {
      console.log(`✅ ${description}`);
      console.log(`   ${className} → ${expectedCSS}`);
      passed++;
      return true;
    } else {
      console.log(`❌ ${description}`);
      console.log(`   ${className} → Expected: ${expectedCSS}`);
      console.log(`   Got: ${result.data?.css || "No CSS generated"}`);
      failed++;
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   ${className} → Error: ${error.message}`);
    failed++;
    return false;
  }
}

function runFontTests() {
  console.log("\n📝 System Font Tests:");
  console.log("─────────────────────");

  // Test basic system fonts - ZyraCSS quotes all non-generic fonts for safety
  testFont("ff-[Arial]", 'font-family: "Arial"', "Basic Arial font");
  testFont("font-family-[Arial]", 'font-family: "Arial"', "Font-family Arial");
  testFont("ff-[Helvetica]", 'font-family: "Helvetica"', "Helvetica font");
  testFont("ff-[Times]", 'font-family: "Times"', "Times font");

  console.log("\n🌐 Google Fonts Tests (should be quoted and capitalized):");
  console.log("──────────────────────────────────────────────────────");

  // Test Google fonts - should have proper capitalization and quotes
  testFont("ff-[inter]", 'font-family: "Inter"', "Inter Google font");
  testFont("ff-[roboto]", 'font-family: "Roboto"', "Roboto Google font");
  testFont(
    "ff-[open-sans]",
    'font-family: "Open Sans"',
    "Open Sans with dashes"
  );
  testFont(
    "ff-[source-code-pro]",
    'font-family: "Source Code Pro"',
    "Source Code Pro"
  );
  testFont("ff-[noto-sans]", 'font-family: "Noto Sans"', "Noto Sans");
  testFont(
    "ff-[playfair-display]",
    'font-family: "Playfair Display"',
    "Playfair Display"
  );

  console.log("\n📚 Multiple Font Fallbacks:");
  console.log("───────────────────────────");

  // Test multiple fonts with fallbacks - system fonts are quoted, generics are not
  testFont(
    "ff-[inter,sans-serif]",
    'font-family: "Inter", sans-serif',
    "Inter with sans-serif fallback"
  );
  testFont(
    "ff-[roboto,Arial,sans-serif]",
    'font-family: "Roboto", "Arial", sans-serif',
    "Multiple font stack"
  );
  testFont(
    "ff-[Times,serif]",
    'font-family: "Times", serif',
    "Times with serif fallback"
  );
  testFont(
    "ff-[Courier,monospace]",
    'font-family: "Courier", monospace',
    "Courier with monospace fallback"
  );

  console.log("\n🔧 Font Name Edge Cases:");
  console.log("────────────────────────");

  // Test font names with special characters
  testFont(
    "font-family-[times-new-roman]",
    'font-family: "Times New Roman"',
    "Times New Roman with dashes"
  );
  testFont(
    "ff-[comic-sans-ms]",
    'font-family: "Comic Sans MS"',
    "Comic Sans MS"
  );
  testFont("ff-[trebuchet-ms]", 'font-family: "Trebuchet MS"', "Trebuchet MS");

  console.log("\n⚡ Performance & Complex Cases:");
  console.log("──────────────────────────────");

  // Test complex font stacks
  testFont(
    "ff-[inter,system-ui,sans-serif]",
    'font-family: "Inter", system-ui, sans-serif',
    "Complex system font stack"
  );

  testFont(
    "ff-[source-code-pro,Consolas,Monaco,monospace]",
    'font-family: "Source Code Pro", "Consolas", "Monaco", monospace',
    "Complex monospace font stack"
  );

  console.log("\n🚫 Invalid Font Cases (should be rejected):");
  console.log("────────────────────────────────────────");

  // Test invalid cases that should fail
  const invalidTests = [
    { className: "ff-[]", description: "Empty font family" },
    { className: "ff-[,Arial]", description: "Leading comma" },
    { className: "ff-[Arial,]", description: "Trailing comma" },
    {
      className: "font-family-[123invalid]",
      description: "Font name starting with number",
    },
  ];

  for (const test of invalidTests) {
    try {
      const result = zyra.generate([test.className]);
      if (!result.success || !result.data.css.trim()) {
        console.log(`✅ ${test.description} correctly rejected`);
        passed++;
      } else {
        console.log(`❌ ${test.description} should be rejected but passed`);
        failed++;
      }
    } catch (error) {
      console.log(`✅ ${test.description} correctly rejected (error)`);
      passed++;
    }
  }

  console.log("\n📊 Font Family Test Results:");
  console.log("============================");
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(
    `📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`
  );

  if (failed === 0) {
    console.log("🎉 Perfect font family support!");
  } else {
    console.log("⚠️ Font family support needs improvement.");
  }

  console.log("\n💡 Expected Behavior:");
  console.log(
    '• System fonts: Quoted for safety ("Arial", "Helvetica", "Times")'
  );
  console.log('• Google fonts: Quoted and capitalized ("Inter", "Roboto")');
  console.log('• Underscores converted to spaces (open_sans → "Open Sans")');
  console.log("• Multiple fonts: Comma-separated with proper quoting");
  console.log("• Generic families: Unquoted (sans-serif, serif, monospace)");
  console.log("• Invalid syntax: Properly rejected");
}

try {
  runFontTests();
} catch (error) {
  console.error(error);
  process.exit(1);
}
