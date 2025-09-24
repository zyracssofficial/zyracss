/**
 * Comprehensive Font Shorthand Test Suite
 * Tests all aspects of font shorthand including Google Fonts, system fonts, and edge cases
 */

import { zyra } from "../src/index.js";

async function runFontShorthandTests() {
  console.log("🔤 Comprehensive Font Shorthand Test Suite");
  console.log("==========================================\n");

  const tests = [
    // ====================================
    // BASIC FONT SHORTHAND TESTS
    // ====================================
    {
      section: "Basic Font Shorthand",
      cases: [
        {
          class: "font-[16px,Arial]",
          expected: 'font: 16px "Arial";',
          description: "Basic font-size and font-family",
        },
        {
          class: "font-[bold,18px,Georgia]",
          expected: 'font: bold 18px "Georgia";',
          description: "Font-weight, font-size, and font-family",
        },
        {
          class: "font-[italic,16px,Verdana]",
          expected: 'font: italic 16px "Verdana";',
          description: "Font-style, font-size, and font-family",
        },
        {
          class: "font-[normal,small-caps,bold,18px,Times]",
          expected: 'font: normal small-caps bold 18px "Times";',
          description: "All optional properties before font-size",
        },
      ],
    },

    // ====================================
    // GOOGLE FONTS TESTS (Dash-to-Space Conversion)
    // ====================================
    {
      section: "Google Fonts (Dash-to-Space Conversion)",
      cases: [
        {
          class: "font-[16px,Open-Sans]",
          expected: 'font: 16px "Open Sans";',
          description: "Google Font: Open Sans",
        },
        {
          class: "font-[bold,18px,Roboto-Condensed]",
          expected: 'font: bold 18px "Roboto Condensed";',
          description: "Google Font: Roboto Condensed with weight",
        },
        {
          class: "font-[italic,16px,Source-Sans-Pro]",
          expected: 'font: italic 16px "Source Sans Pro";',
          description: "Google Font: Source Sans Pro with style",
        },
        {
          class: "font-[300,14px,Noto-Sans-JP]",
          expected: 'font: 300 14px "Noto Sans JP";',
          description: "Google Font: Noto Sans JP with numeric weight",
        },
        {
          class: "font-[normal,small-caps,400,16px,PT-Sans-Caption]",
          expected: 'font: normal small-caps 400 16px "PT Sans Caption";',
          description: "Google Font: PT Sans Caption with all properties",
        },
      ],
    },

    // ====================================
    // SYSTEM FONTS TESTS
    // ====================================
    {
      section: "System Fonts",
      cases: [
        {
          class: "font-[caption]",
          expected: "font: caption;",
          description: "System font: caption",
        },
        {
          class: "font-[icon]",
          expected: "font: icon;",
          description: "System font: icon",
        },
        {
          class: "font-[menu]",
          expected: "font: menu;",
          description: "System font: menu",
        },
        {
          class: "font-[message-box]",
          expected: "font: message-box;",
          description: "System font: message-box",
        },
        {
          class: "font-[small-caption]",
          expected: "font: small-caption;",
          description: "System font: small-caption",
        },
        {
          class: "font-[status-bar]",
          expected: "font: status-bar;",
          description: "System font: status-bar",
        },
      ],
    },

    // ====================================
    // LINE-HEIGHT TESTS
    // ====================================
    {
      section: "Line-Height Support",
      cases: [
        {
          class: "font-[16px/1.5,Arial]",
          expected: 'font: 16px/1.5 "Arial";',
          description: "Font-size with line-height",
        },
        {
          class: "font-[bold,18px/1.2,Open-Sans]",
          expected: 'font: bold 18px/1.2 "Open Sans";',
          description: "Weight + size/line-height + Google Font",
        },
        {
          class: "font-[italic,small-caps,bold,16px/1.4,Roboto]",
          expected: 'font: italic small-caps bold 16px/1.4 "Roboto";',
          description: "All properties with line-height",
        },
        {
          class: "font-[14px/20px,Georgia]",
          expected: 'font: 14px/20px "Georgia";',
          description: "Font-size with pixel line-height",
        },
      ],
    },

    // ====================================
    // COMPLEX GOOGLE FONTS
    // ====================================
    {
      section: "Complex Google Fonts",
      cases: [
        {
          class: "font-[16px,Libre-Baskerville]",
          expected: 'font: 16px "Libre Baskerville";',
          description: "Google Font: Libre Baskerville",
        },
        {
          class: "font-[bold,18px,Crimson-Text]",
          expected: 'font: bold 18px "Crimson Text";',
          description: "Google Font: Crimson Text",
        },
        {
          class: "font-[300,16px,Source-Code-Pro]",
          expected: 'font: 300 16px "Source Code Pro";',
          description: "Google Font: Source Code Pro (monospace)",
        },
        {
          class: "font-[italic,16px,Playfair-Display-SC]",
          expected: 'font: italic 16px "Playfair Display SC";',
          description: "Google Font: Playfair Display SC",
        },
      ],
    },

    // ====================================
    // FONT WEIGHT VARIATIONS
    // ====================================
    {
      section: "Font Weight Variations",
      cases: [
        {
          class: "font-[100,16px,Arial]",
          expected: 'font: 100 16px "Arial";',
          description: "Thin weight (100)",
        },
        {
          class: "font-[300,16px,Open-Sans]",
          expected: 'font: 300 16px "Open Sans";',
          description: "Light weight (300)",
        },
        {
          class: "font-[400,16px,Roboto]",
          expected: 'font: 400 16px "Roboto";',
          description: "Normal weight (400)",
        },
        {
          class: "font-[600,16px,Source-Sans-Pro]",
          expected: 'font: 600 16px "Source Sans Pro";',
          description: "Semi-bold weight (600)",
        },
        {
          class: "font-[900,16px,Montserrat]",
          expected: 'font: 900 16px "Montserrat";',
          description: "Black weight (900)",
        },
        {
          class: "font-[bolder,16px,Arial]",
          expected: 'font: bolder 16px "Arial";',
          description: "Relative weight: bolder",
        },
        {
          class: "font-[lighter,16px,Georgia]",
          expected: 'font: lighter 16px "Georgia";',
          description: "Relative weight: lighter",
        },
      ],
    },

    // ====================================
    // FONT STYLE AND VARIANT TESTS
    // ====================================
    {
      section: "Font Style and Variant",
      cases: [
        {
          class: "font-[italic,bold,16px,Times-New-Roman]",
          expected: 'font: italic bold 16px "Times New Roman";',
          description: "Italic style with bold weight",
        },
        {
          class: "font-[oblique,600,18px,Arial]",
          expected: 'font: oblique 600 18px "Arial";',
          description: "Oblique style with numeric weight",
        },
        {
          class: "font-[normal,small-caps,16px,Georgia]",
          expected: 'font: normal small-caps 16px "Georgia";',
          description: "Normal style with small-caps variant",
        },
        {
          class: "font-[italic,small-caps,bold,16px,Open-Sans]",
          expected: 'font: italic small-caps bold 16px "Open Sans";',
          description: "All style properties with Google Font",
        },
      ],
    },

    // ====================================
    // FALLBACK FONTS
    // ====================================
    {
      section: "Font Families with Fallbacks",
      cases: [
        {
          class: "font-family-[Open-Sans,Arial,sans-serif]",
          expected: 'font-family: "Open Sans", "Arial", sans-serif;',
          description: "Google Font with fallbacks (font-family property)",
        },
        {
          class: "ff-[Roboto,Helvetica,Arial,sans-serif]",
          expected: 'font-family: "Roboto", "Helvetica", "Arial", sans-serif;',
          description: "Google Font with multiple fallbacks (shorthand)",
        },
      ],
    },

    // ====================================
    // INVALID CASES (Should Fail)
    // ====================================
    {
      section: "Invalid Cases (Should Fail)",
      cases: [
        {
          class: "font-[Arial]",
          expected: null,
          description: "Missing font-size (should fail)",
        },
        {
          class: "font-[16px]",
          expected: null,
          description: "Missing font-family (should fail)",
        },
        {
          class: "font-[16px,bold,Arial]",
          expected: null,
          description: "Font-weight after font-size (should fail)",
        },
        {
          class: "font-[Arial,16px]",
          expected: null,
          description: "Font-family before font-size (should fail)",
        },
        {
          class: "font-[16px/1.5,bold,Arial]",
          expected: null,
          description: "Font-weight after line-height (should fail)",
        },
      ],
    },
  ];

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const section of tests) {
    console.log(`📋 ${section.section}`);
    console.log("=".repeat(section.section.length + 4));

    for (const test of section.cases) {
      totalTests++;
      console.log(`\\n🧪 Testing: ${test.description}`);
      console.log(`   Class: ${test.class}`);

      try {
        const result = zyra.generate([test.class]);

        if (test.expected === null) {
          // This should fail
          if (
            !result.success ||
            !result.data?.css ||
            result.data.css.trim() === ""
          ) {
            console.log(`   ✅ PASS - Correctly rejected invalid value`);
            passedTests++;
          } else {
            console.log(`   ❌ FAIL - Should have rejected: "${test.class}"`);
            console.log(`   Generated: ${result.data.css.trim()}`);
            failedTests++;
          }
        } else {
          // This should succeed
          if (result.success && result.data?.css) {
            const actualCSS = result.data.css.trim();

            if (actualCSS.includes(test.expected)) {
              console.log(`   ✅ PASS - Generated correct CSS`);
              console.log(`   → ${actualCSS}`);
              passedTests++;
            } else {
              console.log(`   ❌ FAIL - CSS mismatch`);
              console.log(`   Expected: ${test.expected}`);
              console.log(`   Actual: ${actualCSS}`);
              failedTests++;
            }
          } else {
            console.log(`   ❌ FAIL - No CSS generated`);
            if (result.error) {
              console.log(`   Error: ${result.error}`);
            }
            failedTests++;
          }
        }
      } catch (error) {
        if (test.expected === null) {
          console.log(`   ✅ PASS - Correctly threw error for invalid value`);
          passedTests++;
        } else {
          console.log(`   ❌ FAIL - Unexpected error: ${error.message}`);
          failedTests++;
        }
      }
    }

    console.log("\\n");
  }

  console.log("📊 COMPREHENSIVE TEST RESULTS");
  console.log("=============================");
  console.log(`Total tests: ${totalTests}`);
  console.log(
    `✅ Passed: ${passedTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`
  );
  console.log(
    `❌ Failed: ${failedTests} (${((failedTests / totalTests) * 100).toFixed(1)}%)`
  );

  if (failedTests === 0) {
    console.log(
      "\\n🎉 All font shorthand tests passed! Font implementation is working perfectly."
    );
  } else {
    console.log(
      `\\n⚠️  ${failedTests} test(s) failed. Font shorthand implementation needs attention.`
    );
  }
}

runFontShorthandTests().catch(console.error);

