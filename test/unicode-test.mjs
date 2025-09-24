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

import { zyra } from "../src/index.js";

console.log("🌍 ZyraCSS Unicode + ASCII Validation Test");
console.log("===========================================");

let totalTests = 0;
let correctBehavior = 0;

function testUnicode(className, shouldPass, description) {
  totalTests++;

  try {
    const result = zyra.generate([className]);
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
  } catch (error) {
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
  }
}

function runTests() {
  console.log("\n� Invalid Unicode Usage (should be REJECTED):");
  console.log("──────────────────────────────────────────────");

  // These should all FAIL - Unicode in inappropriate contexts
  testUnicode("p-[中文]", false, "Chinese characters in padding value");
  testUnicode("m-[العربية]", false, "Arabic characters in margin value");
  testUnicode("bg-[Čech]", false, "Czech characters in background value");
  testUnicode("w-[Русский]", false, "Russian characters in width value");
  testUnicode("h-[한국어]", false, "Korean characters in height value");
  testUnicode("color-[日本語]", false, "Japanese characters as color value");
  testUnicode("border-[Ελληνικά]", false, "Greek characters in border value");
  testUnicode(
    "font-size-[हिन्दी]",
    false,
    "Hindi characters in font-size value"
  );
  testUnicode("top-[עברית]", false, "Hebrew characters in position value");
  testUnicode("opacity-[ไทย]", false, "Thai characters in opacity value");

  console.log("\n✅ Valid Unicode Usage (should PASS):");
  console.log("─────────────────────────────────────");

  // ZyraCSS v1.0.0 with enhanced Unicode support - these should PASS
  testUnicode(
    'content-["Hello 世界"]',
    true,
    "Unicode in quoted content string"
  );
  testUnicode(
    'content-["Привет мир"]',
    true,
    "Cyrillic in quoted content string"
  );
  testUnicode(
    'content-["مرحبا بالعالم"]',
    true,
    "Arabic in quoted content string"
  );
  testUnicode('font-family-["微软雅黑"]', true, "Unicode font name in quotes");
  testUnicode('content-["🌍🚀"]', true, "Emoji in quoted content string");

  console.log("\n✅ Valid ASCII Usage (should PASS):");
  console.log("──────────────────────────────────");

  // ASCII content works perfectly
  testUnicode('content-["Hello"]', true, "Plain ASCII in quoted content");
  testUnicode('content-["Hello World"]', true, "ASCII text with spaces");
  testUnicode('font-family-["Arial"]', true, "ASCII font family name");

  console.log("\n🔤 Edge Cases:");
  console.log("──────────────");

  // Edge cases with mixed content
  testUnicode("p-[2rem中文]", false, "Mixed valid unit with Unicode text");
  testUnicode("bg-[#ff0000中文]", false, "Mixed valid color with Unicode text");
  testUnicode(
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

runTests();
