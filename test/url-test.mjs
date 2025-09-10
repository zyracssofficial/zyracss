import { zyraGenerateCSS } from "../src/index.js";

/**
 * Test suite for URL support with u(...) syntax
 * Tests security, validation, and CSS generation for URL values
 */

console.log("🧪 Testing ZyraCSS URL Support with u(...) syntax\n");

// Test cases for URL functionality
const testCases = [
  // Valid URL cases
  {
    name: "HTTPS URL",
    className: "background-image-[u(https://cdn.ex.com/bg.jpg)]",
    expected: "background-image: url('https://cdn.ex.com/bg.jpg')",
    shouldPass: true,
  },
  {
    name: "HTTP URL",
    className: "mask-image-[u(http://example.com/mask.png)]",
    expected: "mask-image: url('http://example.com/mask.png')",
    shouldPass: true,
  },
  {
    name: "Data URL (PNG)",
    className:
      "background-image-[u(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==)]",
    expected:
      "background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==')",
    shouldPass: true,
  },
  {
    name: "Cursor URL",
    className: "cursor-[u(https://cdn.ex.com/cursor.cur)]",
    expected: "cursor: url('https://cdn.ex.com/cursor.cur')",
    shouldPass: true,
  },
  {
    name: "Blob URL",
    className:
      "background-image-[u(blob:https://example.com/123e4567-e89b-12d3-a456-426614174000)]",
    expected:
      "background-image: url('blob:https://example.com/123e4567-e89b-12d3-a456-426614174000')",
    shouldPass: true,
  },

  // Security test cases (should be rejected)
  {
    name: "JavaScript URL (should be blocked)",
    className: "background-image-[u(javascript:alert(1))]",
    expected: null,
    shouldPass: false,
  },
  {
    name: "VBScript URL (should be blocked)",
    className: "background-image-[u(vbscript:msgbox(1))]",
    expected: null,
    shouldPass: false,
  },
  {
    name: "File URL (should be blocked)",
    className: "background-image-[u(file:///etc/passwd)]",
    expected: null,
    shouldPass: false,
  },
  {
    name: "Data SVG URL (should be blocked)",
    className:
      "background-image-[u(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzY3JpcHQ+YWxlcnQoMSk8L3NjcmlwdD48L3N2Zz4=)]",
    expected: null,
    shouldPass: false,
  },
  {
    name: "Data non-image URL (should be blocked)",
    className: "background-image-[u(data:text/html,<script>alert(1)</script>)]",
    expected: null,
    shouldPass: false,
  },

  // Non-URL properties should pass through unchanged
  {
    name: "Non-URL property with u() syntax",
    className: "color-[u(red)]",
    expected: null, // Should fail to parse as u() is not valid for color
    shouldPass: false,
  },

  // Test proper escaping
  {
    name: "URL with special characters",
    className: "background-image-[u(https://cdn.ex.com/bg-file.jpg?v=1&t=123)]",
    expected:
      "background-image: url('https://cdn.ex.com/bg-file.jpg?v=1&t=123')",
    shouldPass: true,
  },
];

// Run tests
async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      console.log(`\n📋 Testing: ${testCase.name}`);
      console.log(`   Class: ${testCase.className}`);

      const result = await zyraGenerateCSS({
        classes: [testCase.className],
      });

      // Debug output
      if (result.data?.invalid && result.data.invalid.length > 0) {
        console.log(
          `   🔍 Debug - Invalid: ${JSON.stringify(result.data.invalid)}`
        );
      }
      if (result.data?.security && result.data.security.length > 0) {
        console.log(
          `   🔍 Debug - Security: ${JSON.stringify(result.data.security)}`
        );
      }

      if (testCase.shouldPass) {
        if (
          result.success &&
          result.data?.css &&
          result.data.css.includes(testCase.expected)
        ) {
          console.log(`   ✅ PASS: Generated expected CSS`);
          console.log(`   📄 CSS: ${result.data.css.trim()}`);
          passed++;
        } else {
          console.log(`   ❌ FAIL: Did not generate expected CSS`);
          console.log(`   📄 Expected: ${testCase.expected}`);
          console.log(`   📄 Got: ${result.data?.css || "null"}`);
          if (result.data?.invalid?.length > 0) {
            console.log(
              `   📄 Invalid: ${JSON.stringify(result.data.invalid)}`
            );
          }
          failed++;
        }
      } else {
        // Should fail - expect no CSS generation or error
        if (
          !result.success ||
          !result.data?.css ||
          result.data.css.trim() === "" ||
          result.data?.invalid?.length > 0
        ) {
          console.log(`   ✅ PASS: Correctly rejected dangerous URL`);
          if (result.data?.invalid?.length > 0) {
            console.log(
              `   🔒 Security: ${result.data.invalid[0]?.error || "Invalid class"}`
            );
          }
          if (!result.success) {
            console.log(`   🔒 Security: ${result.error}`);
          }
          passed++;
        } else {
          console.log(
            `   ❌ FAIL: Should have been rejected but generated CSS`
          );
          console.log(`   📄 Generated: ${result.data.css}`);
          failed++;
        }
      }
    } catch (error) {
      if (testCase.shouldPass) {
        console.log(`   ❌ FAIL: Unexpected error - ${error.message}`);
        failed++;
      } else {
        console.log(`   ✅ PASS: Correctly threw error for dangerous URL`);
        console.log(`   🔒 Security: ${error.message}`);
        passed++;
      }
    }
  }

  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Total: ${passed + failed}`);

  if (failed === 0) {
    console.log(`\n🎉 All tests passed! URL support is working correctly.`);
  } else {
    console.log(`\n⚠️  Some tests failed. Please check the implementation.`);
  }
}

runTests().catch(console.error);
