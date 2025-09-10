#!/usr/bin/env node
/**
 * ZyraCSS Unicode + ASCII Validation Test
 * Tests ZyraCSS v1.0.0 with enhanced Unicode support:
 * - SHOULD PASS: Unicode  if (correctBehavio  if (correctBehavio  if (correctBehavior === totalTests) {
    console.log(
      "🎉 Perfect Unicode + ASCII validation! ZyraCSS securely handles international content."
    );
  } else {
    console.log("⚠️  Unicode + ASCII validation needs improvement.");
  }

  console.log("\n💡 Expected Behavior:");
  console.log(
    "• Unicode should be allowed in quoted strings for content/font properties"
  );
  console.log(
    "• Unicode should be REJECTED in CSS values like lengths, colors, margins, etc."
  );
  console.log(
    "• Enhanced security patterns protect against visual spoofing and injection attacks"
  );
  console.log(
    "• High rejection rate for invalid Unicode usage maintains security"
  );{
    console.log(
      "🎉 Perfect Unicode + ASCII validation! ZyraCSS securely handles international content."
    );
  } else {
    console.log("⚠️  Unicode + ASCII validation needs improvement.");
  }

  console.log("\n💡 Expected Behavior:");
  console.log(
    "• Unicode should be allowed in quoted strings for content/font properties"
  );
  console.log(
    "• Unicode should be REJECTED in CSS values like lengths, colors, margins, etc."
  );
  console.log(
    "• Enhanced security patterns protect against visual spoofing and injection attacks"
  );
  console.log(
    "• High rejection rate for invalid Unicode usage maintains security"
  );{
    console.log(
      "🎉 Perfect Unicode + ASCII validation! ZyraCSS securely handles international content."
    );
  } else {
    console.log("⚠️  Unicode + ASCII validation needs improvement.");
  }

  console.log("\n💡 Expected Behavior:");
  console.log(
    "• Unicode should be allowed in quoted strings for content/font properties"
  );
  console.log(
    "• Unicode should be REJECTED in CSS values like lengths, colors, margins, etc."
  );
  console.log(
    "• Enhanced security patterns protect against visual spoofing and injection attacks"
  );
  console.log(
    "• High rejection rate for invalid Unicode usage maintains security"
  );ntexts (quoted content/font strings)
 * - SHOULD FAIL: Unicode in inappropriate contexts (CSS values, property names)
 * - Enhanced security patterns for international character safety
 */

import { zyraGenerateCSSFromClasses } from "../src/index.js";

console.log("🌍 ZyraCSS Unicode + ASCII Validation Test");
console.log("===========================================");

let totalTests = 0;
let correctBehavior = 0;

function testUnicode(className, shouldPass, description) {
  totalTests++;

  return zyraGenerateCSSFromClasses([className])
    .then((result) => {
      const actualPass = result.success && result.data.css.trim().length > 0;
      const isCorrect = actualPass === shouldPass;

      if (isCorrect) {
        correctBehavior++;
        console.log(`✅ ${description}`);
        console.log(
          `   ${className} → ${shouldPass ? "PASSED" : "CORRECTLY REJECTED"}`
        );
      } else {
        console.log(`❌ ${description}`);
        console.log(
          `   ${className} → Expected: ${shouldPass ? "pass" : "fail"}, Got: ${actualPass ? "pass" : "fail"}`
        );
      }

      return isCorrect;
    })
    .catch((error) => {
      const isCorrect = !shouldPass; // Errors should only happen when we expect failure
      if (isCorrect) {
        correctBehavior++;
        console.log(`✅ ${description}`);
        console.log(`   ${className} → CORRECTLY REJECTED (error)`);
      } else {
        console.log(`❌ ${description}`);
        console.log(`   ${className} → Unexpected error: ${error.message}`);
      }
      return isCorrect;
    });
}

async function runTests() {
  console.log("\n� Invalid Unicode Usage (should be REJECTED):");
  console.log("──────────────────────────────────────────────");

  // These should all FAIL - Unicode in inappropriate contexts
  await testUnicode("p-[中文]", false, "Chinese characters in padding value");
  await testUnicode("m-[العربية]", false, "Arabic characters in margin value");
  await testUnicode("bg-[Čech]", false, "Czech characters in background value");
  await testUnicode("w-[Русский]", false, "Russian characters in width value");
  await testUnicode("h-[한국어]", false, "Korean characters in height value");
  await testUnicode(
    "color-[日本語]",
    false,
    "Japanese characters as color value"
  );
  await testUnicode(
    "border-[Ελληνικά]",
    false,
    "Greek characters in border value"
  );
  await testUnicode(
    "font-size-[हिन्दी]",
    false,
    "Hindi characters in font-size value"
  );
  await testUnicode(
    "top-[עברית]",
    false,
    "Hebrew characters in position value"
  );
  await testUnicode("opacity-[ไทย]", false, "Thai characters in opacity value");

  console.log("\n✅ Valid Unicode Usage (should PASS):");
  console.log("─────────────────────────────────────");

  // ZyraCSS v1.0.0 with enhanced Unicode support - these should PASS
  await testUnicode(
    'content-["Hello 世界"]',
    true,
    "Unicode in quoted content string"
  );
  await testUnicode(
    'content-["Привет мир"]',
    true,
    "Cyrillic in quoted content string"
  );
  await testUnicode(
    'content-["مرحبا بالعالم"]',
    true,
    "Arabic in quoted content string"
  );
  await testUnicode(
    'font-family-["微软雅黑"]',
    true,
    "Unicode font name in quotes"
  );
  await testUnicode('content-["🌍🚀"]', true, "Emoji in quoted content string");

  console.log("\n✅ Valid ASCII Usage (should PASS):");
  console.log("──────────────────────────────────");

  // ASCII content works perfectly
  await testUnicode('content-["Hello"]', true, "Plain ASCII in quoted content");
  await testUnicode('content-["Hello World"]', true, "ASCII text with spaces");
  await testUnicode('font-family-["Arial"]', true, "ASCII font family name");

  console.log("\n🔤 Edge Cases:");
  console.log("──────────────");

  // Edge cases with mixed content
  await testUnicode(
    "p-[2rem中文]",
    false,
    "Mixed valid unit with Unicode text"
  );
  await testUnicode(
    "bg-[#ff0000中文]",
    false,
    "Mixed valid color with Unicode text"
  );
  await testUnicode(
    'content-["Hello"]',
    true,
    "Plain ASCII in quoted content (baseline)"
  );

  console.log("\n📊 Unicode Validation Test Results:");
  console.log("===================================");
  console.log(`✅ Correct behavior: ${correctBehavior}/${totalTests}`);
  console.log(
    `📈 Validation accuracy: ${((correctBehavior / totalTests) * 100).toFixed(1)}%`
  );

  if (correctBehavior === totalTests) {
    console.log(
      "� Perfect Unicode validation! ZyraCSS correctly handles Unicode."
    );
  } else {
    console.log("⚠️  Unicode validation needs improvement.");
  }

  console.log("\n� Expected Behavior:");
  console.log(
    "• Unicode should ONLY be allowed in quoted strings for content/font properties"
  );
  console.log(
    "• Unicode should be REJECTED in CSS values like lengths, colors, margins, etc."
  );
  console.log(
    "• High rejection rate for invalid Unicode usage is GOOD behavior"
  );
}

runTests().catch(console.error);
