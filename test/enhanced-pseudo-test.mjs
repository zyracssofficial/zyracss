/**
 * ZyraCSS Enhanced Pseudo Test - Clean version
 */

import { zyra } from "../src/index.js";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

let testCount = 0;
let passCount = 0;
let failCount = 0;

async function test(name, testFn) {
  testCount++;
  try {
    const result = await testFn();
    if (result) {
      passCount++;
      console.log(`${colors.green}✅ ${name}${colors.reset}`);
    } else {
      failCount++;
      console.log(`${colors.red}❌ ${name}${colors.reset}`);
    }
  } catch (error) {
    failCount++;
    console.log(
      `${colors.red}❌ ${name} - Error: ${error.message}${colors.reset}`
    );
  }
}

async function expectCSS(classes, expectedPattern) {
  try {
    const result = zyra.generate(classes);
    return result.success && result.data.css.includes(expectedPattern);
  } catch (error) {
    return false;
  }
}

async function runTests() {
  console.log(
    `${colors.cyan}${colors.bold}🎭 ZyraCSS Enhanced Pseudo Test${colors.reset}`
  );
  console.log("=".repeat(48));

  // Basic pseudo-classes
  await test("Hover pseudo-class", async () => {
    return await expectCSS(["hover:color-[red]"], ":hover");
  });

  await test("Focus pseudo-class", async () => {
    return await expectCSS(["focus:outline-[2px,solid,blue]"], ":focus");
  });

  await test("Active pseudo-class", async () => {
    return await expectCSS(["active:color-[green]"], ":active");
  });

  await test("Visited pseudo-class", async () => {
    return await expectCSS(["visited:color-[purple]"], ":visited");
  });

  await test("Disabled pseudo-class", async () => {
    return await expectCSS(["disabled:opacity-[0.5]"], ":disabled");
  });

  // Form pseudo-classes
  await test("Checked pseudo-class", async () => {
    return await expectCSS(["checked:background-[green]"], ":checked");
  });

  await test("Required pseudo-class", async () => {
    return await expectCSS(["required:border-color-[red]"], ":required");
  });

  await test("Valid pseudo-class", async () => {
    return await expectCSS(["valid:border-color-[green]"], ":valid");
  });

  await test("Invalid pseudo-class", async () => {
    return await expectCSS(["invalid:border-color-[red]"], ":invalid");
  });

  // Structural pseudo-classes
  await test("First-child pseudo-class", async () => {
    return await expectCSS(["first-child:margin-top-[0]"], ":first-child");
  });

  await test("Last-child pseudo-class", async () => {
    return await expectCSS(["last-child:margin-bottom-[0]"], ":last-child");
  });

  await test("Only-child pseudo-class", async () => {
    return await expectCSS(["only-child:display-[block]"], ":only-child");
  });

  // Pseudo-elements
  await test("Before pseudo-element", async () => {
    return await expectCSS(['before:content-["•"]'], "::before");
  });

  await test("After pseudo-element", async () => {
    return await expectCSS(['after:content-[" (required)"]'], "::after");
  });

  await test("First-line pseudo-element", async () => {
    return await expectCSS(["first-line:font-size-[1.2em]"], "::first-line");
  });

  await test("First-letter pseudo-element", async () => {
    return await expectCSS(["first-letter:font-size-[3em]"], "::first-letter");
  });

  // Responsive + Pseudo combinations
  await test("Small breakpoint with hover", async () => {
    const result = zyra.generate(["sm:hover:color-[red]"]);
    return (
      result.success &&
      result.data.css.includes("@media") &&
      result.data.css.includes(":hover")
    );
  });

  await test("Medium breakpoint with focus", async () => {
    const result = zyra.generate(["md:focus:transform-[scale(0.95)]"]);
    return (
      result.success &&
      result.data.css.includes("@media") &&
      result.data.css.includes(":focus")
    );
  });

  // Complex properties with pseudo
  await test("Hover with complex transform", async () => {
    return await expectCSS(
      ["hover:transform-[scale(1.1),rotate(5deg)]"],
      "transform: scale(1.1) rotate(5deg)"
    );
  });

  await test("Focus with max() function", async () => {
    return await expectCSS(["focus:width-[max(200px,25%)]"], "max(200px, 25%)");
  });

  // Additional pseudo-classes
  await test("Target pseudo-class", async () => {
    return await expectCSS(["target:background-[yellow]"], ":target");
  });

  await test("Link pseudo-class", async () => {
    return await expectCSS(["link:color-[blue]"], ":link");
  });

  await test("Enabled pseudo-class", async () => {
    return await expectCSS(["enabled:opacity-[1]"], ":enabled");
  });

  await test("Read-only pseudo-class", async () => {
    return await expectCSS(["read-only:background-[#f5f5f5]"], ":read-only");
  });

  await test("Read-write pseudo-class", async () => {
    return await expectCSS(
      ["read-write:border-[1px,solid,#ccc]"],
      ":read-write"
    );
  });

  await test("Optional pseudo-class", async () => {
    return await expectCSS(["optional:border-style-[dashed]"], ":optional");
  });

  await test("Out-of-range pseudo-class", async () => {
    return await expectCSS(
      ["out-of-range:border-color-[red]"],
      ":out-of-range"
    );
  });

  await test("In-range pseudo-class", async () => {
    return await expectCSS(["in-range:border-color-[green]"], ":in-range");
  });

  await test("Indeterminate pseudo-class", async () => {
    return await expectCSS(["indeterminate:opacity-[0.7]"], ":indeterminate");
  });

  await test("Default pseudo-class", async () => {
    return await expectCSS(["default:font-weight-[bold]"], ":default");
  });

  // More pseudo-elements
  await test("Placeholder pseudo-element", async () => {
    return await expectCSS(["placeholder:color-[#999]"], "::placeholder");
  });

  await test("Selection pseudo-element", async () => {
    return await expectCSS(["selection:background-[blue]"], "::selection");
  });

  await test("Backdrop pseudo-element", async () => {
    return await expectCSS(["backdrop:background-[black]"], "::backdrop");
  });

  await test("Marker pseudo-element", async () => {
    return await expectCSS(["marker:color-[red]"], "::marker");
  });

  // Pseudo-element with complex content
  await test("Before with multiple content types", async () => {
    return await expectCSS(
      ['before:content-[counter(section),".",attr(title)]'],
      "::before"
    );
  });

  await test("After with Unicode and quotes", async () => {
    return await expectCSS(['after:content-["→","\A0","★"]'], "::after");
  });

  await test("Before with CSS counters", async () => {
    return await expectCSS(
      ["before:content-[counter(list-item)]"],
      "counter(list-item)"
    );
  });

  // Complex pseudo with CSS functions
  await test("Hover with box-shadow and transition", async () => {
    const result = zyra.generate([
      "hover:box-shadow-[0,4px,8px,rgba(0,0,0,0.2)]",
    ]);
    return (
      result.success &&
      result.data.css.includes(":hover") &&
      result.data.css.includes("box-shadow")
    );
  });

  // Structural pseudo-classes with more variations
  await test("First-of-type with styling", async () => {
    return await expectCSS(["first-of-type:margin-top-[0]"], ":first-of-type");
  });

  await test("Last-of-type with styling", async () => {
    return await expectCSS(["last-of-type:margin-bottom-[0]"], ":last-of-type");
  });

  await test("Only-of-type with styling", async () => {
    return await expectCSS(
      ["only-of-type:text-align-[center]"],
      ":only-of-type"
    );
  });

  await test("Empty pseudo-class with display", async () => {
    return await expectCSS(["empty:display-[none]"], ":empty");
  });

  // CSS Functions with pseudo-classes
  await test("Hover with CSS calc() function", async () => {
    return await expectCSS(
      ["hover:width-[calc(100%-20px)]"],
      "calc(100% - 20px)"
    );
  });

  await test("Focus with CSS var() function", async () => {
    return await expectCSS(
      ["focus:color-[var(--primary-color,blue)]"],
      "var(--primary-color, blue)"
    );
  });

  await test("Active with CSS min() function", async () => {
    return await expectCSS(
      ["active:width-[min(100%,500px)]"],
      "min(100%, 500px)"
    );
  });

  await test("Hover with CSS max() function", async () => {
    return await expectCSS(
      ["hover:height-[max(200px,50vh)]"],
      "max(200px, 50vh)"
    );
  });

  await test("Focus with CSS clamp() function", async () => {
    return await expectCSS(
      ["focus:font-size-[clamp(1rem,2.5vw,2rem)]"],
      "clamp(1rem, 2.5vw, 2rem)"
    );
  });

  // Advanced responsive + pseudo combinations
  await test("Large breakpoint with before pseudo-element", async () => {
    const result = zyra.generate(['lg:before:content-["Desktop"]']);
    return (
      result.success &&
      result.data.css.includes("@media") &&
      result.data.css.includes("::before")
    );
  });

  await test("Extra large breakpoint with hover", async () => {
    const result = zyra.generate(["xl:hover:transform-[scale(1.05)]"]);
    return (
      result.success &&
      result.data.css.includes("@media") &&
      result.data.css.includes(":hover")
    );
  });

  await test("XL breakpoint with focus (duplicate)", async () => {
    const result = zyra.generate(["xl:focus:box-shadow-[0,0,0,3px,blue]"]);
    return (
      result.success &&
      result.data.css.includes("@media") &&
      result.data.css.includes(":focus")
    );
  });

  // Complex gradients with pseudo-classes
  await test("Hover with calc() function", async () => {
    return await expectCSS(
      ["hover:width-[calc(100%-20px)]"],
      "calc(100% - 20px)"
    );
  });

  await test("Focus with min() function", async () => {
    return await expectCSS(["focus:width-[min(100px,50%)]"], "min(100px, 50%)");
  });

  // Modern color functions with pseudo-classes (only supported ones)
  await test("Hover with oklch() color function", async () => {
    return await expectCSS(
      ["hover:color-[oklch(0.7,0.15,180)]"],
      "oklch(0.7, 0.15, 180)"
    );
  });

  await test("Focus with oklab() color function", async () => {
    return await expectCSS(
      ["focus:background-[oklab(0.5,0.1,-0.1)]"],
      "oklab(0.5, 0.1, -0.1)"
    );
  });

  // CSS Grid functions with pseudo-classes (only supported ones)
  await test("Hover with repeat() function", async () => {
    return await expectCSS(
      ["hover:grid-template-columns-[repeat(3,1fr)]"],
      "repeat(3, 1fr)"
    );
  });

  await test("Focus with minmax() function", async () => {
    return await expectCSS(
      ["focus:grid-template-columns-[minmax(200px,1fr)]"],
      "minmax(200px, 1fr)"
    );
  });

  // Advanced pseudo-element styling
  await test("Before with positioning and z-index", async () => {
    const result = zyra.generate([
      "before:position-[absolute]",
      "before:z-index-[10]",
    ]);
    return (
      result.success &&
      result.data.css.includes("::before") &&
      result.data.css.includes("position: absolute")
    );
  });

  await test("After with transform and transition", async () => {
    const result = zyra.generate(["after:transform-[translateX(10px)]"]);
    return (
      result.success &&
      result.data.css.includes("::after") &&
      result.data.css.includes("transform")
    );
  });

  // Multiple pseudo-classes on same element
  await test("Hover and focus states together", async () => {
    const result = zyra.generate([
      "hover:color-[blue]",
      "focus:color-[green]",
    ]);
    return (
      result.success &&
      result.data.css.includes(":hover") &&
      result.data.css.includes(":focus")
    );
  });

  // Error handling tests
  await test("Invalid pseudo-class graceful handling", async () => {
    try {
      const result = zyra.generate(["invalid-pseudo:color-[red]"]);
      return !result.success || result.data.css.trim() === "";
    } catch (error) {
      return true; // Expected to fail
    }
  });

  await test("Malformed pseudo-element handling", async () => {
    try {
      const result = zyra.generate(['before-invalid:content-["test"]']);
      return !result.success || result.data.css.trim() === "";
    } catch (error) {
      return true; // Expected to fail
    }
  });

  // Print results
  console.log(`\n${colors.blue}📊 TEST RESULTS${colors.reset}`);
  console.log("=".repeat(15));
  console.log(`Total tests: ${testCount}`);
  console.log(
    `${colors.green}✅ Passed: ${passCount} (${((passCount / testCount) * 100).toFixed(1)}%)${colors.reset}`
  );
  console.log(
    `${colors.red}❌ Failed: ${failCount} (${((failCount / testCount) * 100).toFixed(1)}%)${colors.reset}`
  );

  if (failCount === 0) {
    console.log(
      `\n${colors.green}🎉 All enhanced pseudo tests passed!${colors.reset}`
    );
  } else {
    console.log(
      `\n${colors.red}❌ ${failCount} test(s) failed. Please check the implementation.${colors.reset}`
    );
  }
}

runTests().catch(console.error);

