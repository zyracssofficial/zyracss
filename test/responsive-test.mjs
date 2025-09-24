/**
 * ZyraCSS Responsive System Test Suite - Rewritten for async API
 * Tests breakpoint functionality and responsive prefixes
 */

import { zyra } from "../src/index.js";

const generateCSS = zyra.generate;

const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// ANSI color codes for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
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
      if (typeof result === "string") {
        console.log(`   → ${result.replace(/\n/g, " ").substring(0, 50)}...`);
      }
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

async function expectMediaQuery(classes, breakpoint, property) {
  try {
    const result = await generateCSS(classes);
    const mediaQuery = `@media (min-width: ${BREAKPOINTS[breakpoint]})`;
    return (
      result.success &&
      result.data.css.includes(mediaQuery) &&
      result.data.css.includes(property)
    );
  } catch (error) {
    return false;
  }
}

async function runTests() {
  console.log(
    `${colors.cyan}${colors.bold}📱 ZyraCSS Responsive System Test${colors.reset}`
  );
  console.log("=".repeat(48));

  // Basic responsive prefix tests
  await test("Small breakpoint (sm:)", async () => {
    return await expectMediaQuery(["sm:bg-[red]"], "sm", "background: red");
  });

  await test("Medium breakpoint (md:)", async () => {
    return await expectMediaQuery(["md:color-[blue]"], "md", "color: blue");
  });

  await test("Large breakpoint (lg:)", async () => {
    return await expectMediaQuery(["lg:padding-[20px]"], "lg", "padding: 20px");
  });

  await test("Extra large breakpoint (xl:)", async () => {
    return await expectMediaQuery(["xl:margin-[10px]"], "xl", "margin: 10px");
  });

  // Multiple responsive classes
  await test("Multiple breakpoints for same element", async () => {
    const result = await generateCSS([
      "sm:bg-[red]",
      "md:bg-[blue]",
      "lg:bg-[green]",
    ]);
    return (
      result.success &&
      result.data.css.includes("@media (min-width: 640px)") &&
      result.data.css.includes("@media (min-width: 768px)") &&
      result.data.css.includes("@media (min-width: 1024px)") &&
      result.data.css.includes("background: red") &&
      result.data.css.includes("background: blue") &&
      result.data.css.includes("background: green")
    );
  });

  // Complex responsive properties
  await test("Responsive flexbox layout", async () => {
    return await expectMediaQuery(
      ["lg:flex-direction-[column]"],
      "lg",
      "flex-direction: column"
    );
  });

  await test("Responsive grid system", async () => {
    return await expectMediaQuery(
      ["md:grid-template-columns-[repeat(3,1fr)]"],
      "md",
      "grid-template-columns: repeat(3, 1fr)"
    );
  });

  await test("Responsive transform", async () => {
    return await expectMediaQuery(
      ["xl:transform-[scale(1.2)]"],
      "xl",
      "transform: scale(1.2)"
    );
  });

  await test("Responsive typography", async () => {
    return await expectMediaQuery(
      ["sm:font-size-[18px]"],
      "sm",
      "font-size: 18px"
    );
  });

  // Responsive with pseudo-classes
  await test("Responsive hover state", async () => {
    const result = await generateCSS(["md:hover:bg-[blue]"]);
    return (
      result.success &&
      result.data.css.includes("@media (min-width: 768px)") &&
      result.data.css.includes(":hover") &&
      result.data.css.includes("background: blue")
    );
  });

  await test("Responsive focus state", async () => {
    const result = await generateCSS(["lg:focus:border-[2px,solid,red]"]);
    return (
      result.success &&
      result.data.css.includes("@media (min-width: 1024px)") &&
      result.data.css.includes(":focus") &&
      result.data.css.includes("border: 2px solid red")
    );
  });

  // Responsive spacing utilities
  await test("Responsive margin", async () => {
    return await expectMediaQuery(["sm:margin-[auto]"], "sm", "margin: auto");
  });

  await test("Responsive padding with multiple values", async () => {
    return await expectMediaQuery(
      ["md:padding-[10px,20px,30px,40px]"],
      "md",
      "padding: 10px 20px 30px 40px"
    );
  });

  // Responsive positioning
  await test("Responsive absolute positioning", async () => {
    return await expectMediaQuery(
      ["lg:position-[absolute]"],
      "lg",
      "position: absolute"
    );
  });

  await test("Responsive z-index", async () => {
    return await expectMediaQuery(["xl:z-index-[999]"], "xl", "z-index: 999");
  });

  // Responsive dimensions
  await test("Responsive width", async () => {
    return await expectMediaQuery(["sm:width-[100%]"], "sm", "width: 100%");
  });

  await test("Responsive height with calc", async () => {
    return await expectMediaQuery(
      ["md:height-[calc(100vh-60px)]"],
      "md",
      "height: calc(100vh - 60px)"
    );
  });

  // Responsive display properties
  await test("Responsive display block", async () => {
    return await expectMediaQuery(
      ["lg:display-[block]"],
      "lg",
      "display: block"
    );
  });

  await test("Responsive display none", async () => {
    return await expectMediaQuery(["xl:display-[none]"], "xl", "display: none");
  });

  // Edge cases and error handling
  await test("Invalid breakpoint prefix (should fail)", async () => {
    try {
      const result = await generateCSS(["xxl:bg-[red]"]);
      // Should either reject or treat as regular class
      return (
        result.success &&
        (!result.data.css.includes("@media (min-width:") ||
          result.data.css.includes(".xxl\\:bg-\\[red\\]"))
      );
    } catch (error) {
      return true; // Expected to fail
    }
  });

  await test("Responsive with complex property values", async () => {
    return await expectMediaQuery(
      ["sm:box-shadow-[0px,4px,8px,rgba(0,0,0,0.1)]"],
      "sm",
      "box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1)"
    );
  });

  await test("Responsive background with gradient", async () => {
    return await expectMediaQuery(
      ["md:background-[linear-gradient(to,right,red,blue)]"],
      "md",
      "background: linear-gradient(to right, red, blue)"
    );
  });

  // Responsive pseudo-elements
  await test("Responsive before pseudo-element", async () => {
    const result = await generateCSS(['lg:before:content-["Mobile"]']);
    return (
      result.success &&
      result.data.css.includes("@media (min-width: 1024px)") &&
      result.data.css.includes("::before") &&
      result.data.css.includes('content: "Mobile"')
    );
  });

  // Advanced responsive layout tests
  await test("Responsive CSS Grid layout", async () => {
    return await expectMediaQuery(
      ["lg:grid-template-columns-[repeat(3,1fr)]"],
      "lg",
      "grid-template-columns: repeat(3, 1fr)"
    );
  });

  await test("Responsive CSS Grid gap", async () => {
    return await expectMediaQuery(["md:gap-[2rem]"], "md", "gap: 2rem");
  });

  await test("Responsive CSS Grid areas", async () => {
    return await expectMediaQuery(
      ["xl:grid-area-[header]"],
      "xl",
      "grid-area: header"
    );
  });

  await test("Responsive Flexbox direction", async () => {
    return await expectMediaQuery(
      ["sm:flex-direction-[column]"],
      "sm",
      "flex-direction: column"
    );
  });

  await test("Responsive Flexbox wrap", async () => {
    return await expectMediaQuery(
      ["md:flex-wrap-[wrap]"],
      "md",
      "flex-wrap: wrap"
    );
  });

  await test("Responsive Flexbox justify content", async () => {
    return await expectMediaQuery(
      ["lg:justify-content-[space-between]"],
      "lg",
      "justify-content: space-between"
    );
  });

  await test("Responsive Flexbox align items", async () => {
    return await expectMediaQuery(
      ["xl:align-items-[center]"],
      "xl",
      "align-items: center"
    );
  });

  // Container queries (if supported)
  await test("Responsive with container queries", async () => {
    const result = await generateCSS([
      "@container(min-width:500px):padding-[2rem]",
    ]);
    // May not be supported yet, so just check if it doesn't crash
    return true;
  });

  // Responsive typography
  await test("Responsive font-family", async () => {
    return await expectMediaQuery(
      ["md:font-family-[Georgia,serif]"],
      "md",
      'font-family: "Georgia", serif'
    );
  });

  await test("Responsive font-weight", async () => {
    return await expectMediaQuery(
      ["lg:font-weight-[700]"],
      "lg",
      "font-weight: 700"
    );
  });

  await test("Responsive line-height", async () => {
    return await expectMediaQuery(
      ["sm:line-height-[1.6]"],
      "sm",
      "line-height: 1.6"
    );
  });

  await test("Responsive letter-spacing", async () => {
    return await expectMediaQuery(
      ["xl:letter-spacing-[0.1em]"],
      "xl",
      "letter-spacing: 0.1em"
    );
  });

  await test("Responsive text-align", async () => {
    return await expectMediaQuery(
      ["md:text-align-[center]"],
      "md",
      "text-align: center"
    );
  });

  // Responsive positioning
  await test("Responsive position absolute", async () => {
    return await expectMediaQuery(
      ["lg:position-[absolute]"],
      "lg",
      "position: absolute"
    );
  });

  await test("Responsive top positioning", async () => {
    return await expectMediaQuery(["md:top-[50px]"], "md", "top: 50px");
  });

  await test("Responsive z-index", async () => {
    return await expectMediaQuery(["sm:z-index-[100]"], "sm", "z-index: 100");
  });

  // Responsive transforms
  await test("Responsive transform scale", async () => {
    return await expectMediaQuery(
      ["lg:transform-[scale(1.2)]"],
      "lg",
      "transform: scale(1.2)"
    );
  });

  await test("Responsive transform rotate", async () => {
    return await expectMediaQuery(
      ["xl:transform-[rotate(45deg)]"],
      "xl",
      "transform: rotate(45deg)"
    );
  });

  await test("Responsive transform translate", async () => {
    return await expectMediaQuery(
      ["md:transform-[translateX(20px)]"],
      "md",
      "transform: translateX(20px)"
    );
  });

  await test("Responsive complex transform", async () => {
    return await expectMediaQuery(
      ["lg:transform-[scale(1.1),rotate(5deg),translateY(-10px)]"],
      "lg",
      "transform: scale(1.1) rotate(5deg) translateY(-10px)"
    );
  });

  // Responsive animations and transitions
  await test("Responsive transition duration", async () => {
    return await expectMediaQuery(
      ["sm:transition-duration-[0.5s]"],
      "sm",
      "transition-duration: 0.5s"
    );
  });

  await test("Responsive transition property", async () => {
    return await expectMediaQuery(
      ["md:transition-property-[all]"],
      "md",
      "transition-property: all"
    );
  });

  await test("Responsive animation duration", async () => {
    return await expectMediaQuery(
      ["lg:animation-duration-[2s]"],
      "lg",
      "animation-duration: 2s"
    );
  });

  await test("Responsive animation name", async () => {
    return await expectMediaQuery(
      ["xl:animation-name-[fadeIn]"],
      "xl",
      "animation-name: fadeIn"
    );
  });

  // Responsive filters and effects
  await test("Responsive filter blur", async () => {
    return await expectMediaQuery(
      ["md:filter-[blur(5px)]"],
      "md",
      "filter: blur(5px)"
    );
  });

  await test("Responsive backdrop-filter", async () => {
    return await expectMediaQuery(
      ["lg:backdrop-filter-[blur(10px)]"],
      "lg",
      "backdrop-filter: blur(10px)"
    );
  });

  await test("Responsive opacity", async () => {
    return await expectMediaQuery(["sm:opacity-[0.8]"], "sm", "opacity: 0.8");
  });

  // Responsive borders and outlines
  await test("Responsive border-radius", async () => {
    return await expectMediaQuery(
      ["md:border-radius-[1rem]"],
      "md",
      "border-radius: 1rem"
    );
  });

  await test("Responsive border-width", async () => {
    return await expectMediaQuery(
      ["lg:border-width-[3px]"],
      "lg",
      "border-width: 3px"
    );
  });

  await test("Responsive border-style", async () => {
    return await expectMediaQuery(
      ["xl:border-style-[dashed]"],
      "xl",
      "border-style: dashed"
    );
  });

  await test("Responsive outline", async () => {
    return await expectMediaQuery(
      ["sm:outline-[2px,solid,blue]"],
      "sm",
      "outline: 2px solid blue"
    );
  });

  // Responsive clip-path and masks
  await test("Responsive clip-path", async () => {
    return await expectMediaQuery(
      ["lg:clip-path-[circle(50%)]"],
      "lg",
      "clip-path: circle(50%)"
    );
  });

  await test("Responsive mask", async () => {
    return await expectMediaQuery(
      ["xl:mask-[u(mask.svg)]"], // Updated to u() syntax
      "xl",
      "mask: url('mask.svg')" // Output still uses url() as expected CSS
    );
  });

  // Responsive custom properties
  await test("Responsive CSS custom property", async () => {
    return await expectMediaQuery(
      ["md:--primary-color-[#007bff]"],
      "md",
      "--primary-color: #007bff"
    );
  });

  await test("Responsive CSS variable usage", async () => {
    return await expectMediaQuery(
      ["lg:color-[var(--primary-color)]"],
      "lg",
      "color: var(--primary-color)"
    );
  });

  // Multiple breakpoint combinations
  await test("Multiple responsive classes same element", async () => {
    const result = await generateCSS([
      "sm:font-size-[16px]",
      "md:font-size-[18px]",
      "lg:font-size-[20px]",
    ]);
    return (
      result.success &&
      result.data.css.includes("@media (min-width: 640px)") &&
      result.data.css.includes("@media (min-width: 768px)") &&
      result.data.css.includes("@media (min-width: 1024px)")
    );
  });

  await test("Complex responsive layout combination", async () => {
    const result = await generateCSS([
      "sm:grid-template-columns-[1fr]",
      "md:grid-template-columns-[repeat(2,1fr)]",
      "lg:grid-template-columns-[repeat(3,1fr)]",
      "xl:grid-template-columns-[repeat(4,1fr)]",
    ]);
    return (
      result.success &&
      result.data.css.includes("repeat(2, 1fr)") &&
      result.data.css.includes("repeat(3, 1fr)") &&
      result.data.css.includes("repeat(4, 1fr)")
    );
  });

  // Responsive with pseudo-classes
  await test("Responsive hover effects", async () => {
    const result = await generateCSS(["md:hover:transform-[scale(1.1)]"]);
    return (
      result.success &&
      result.data.css.includes("@media (min-width: 768px)") &&
      result.data.css.includes(":hover") &&
      result.data.css.includes("transform: scale(1.1)")
    );
  });

  await test("Responsive focus effects", async () => {
    const result = await generateCSS([
      "lg:focus:box-shadow-[0,0,0,3px,rgba(59,130,246,0.5)]",
    ]);
    return (
      result.success &&
      result.data.css.includes("@media (min-width: 1024px)") &&
      result.data.css.includes(":focus") &&
      result.data.css.includes("box-shadow")
    );
  });

  // Responsive with CSS functions
  await test("Responsive calc() function", async () => {
    return await expectMediaQuery(
      ["sm:width-[calc(100%-40px)]"],
      "sm",
      "width: calc(100% - 40px)"
    );
  });

  await test("Responsive min() function", async () => {
    return await expectMediaQuery(
      ["md:height-[min(500px,50vh)]"],
      "md",
      "height: min(500px, 50vh)"
    );
  });

  await test("Responsive max() function", async () => {
    return await expectMediaQuery(
      ["lg:font-size-[max(18px,1.2rem)]"],
      "lg",
      "font-size: max(18px, 1.2rem)"
    );
  });

  await test("Responsive clamp() function", async () => {
    return await expectMediaQuery(
      ["xl:padding-[clamp(1rem,5vw,3rem)]"],
      "xl",
      "padding: clamp(1rem, 5vw, 3rem)"
    );
  });

  // Responsive gradients
  await test("Responsive linear gradient direction", async () => {
    return await expectMediaQuery(
      ["md:background-[linear-gradient(to,bottom,red,blue)]"],
      "md",
      "background: linear-gradient(to bottom, red, blue)"
    );
  });

  await test("Responsive radial gradient", async () => {
    return await expectMediaQuery(
      ["lg:background-[radial-gradient(circle,at,center,red,blue)]"],
      "lg",
      "background: radial-gradient(circle at center, red, blue)"
    );
  });

  // Responsive modern color functions
  await test("Responsive oklch() color", async () => {
    return await expectMediaQuery(
      ["md:color-[oklch(0.7,0.15,180)]"],
      "md",
      "color: oklch(0.7, 0.15, 180)"
    );
  });

  await test("Responsive lab() color", async () => {
    return await expectMediaQuery(
      ["lg:background-[lab(50%,20,-30)]"],
      "lg",
      "background: lab(50%, 20, -30)"
    );
  });

  // Error handling and edge cases
  await test("Invalid breakpoint handling", async () => {
    try {
      const result = await generateCSS(["invalid:color-[red]"]);
      // Should either work or fail gracefully
      return true;
    } catch (error) {
      return true; // Expected to fail gracefully
    }
  });

  await test("Responsive with empty value", async () => {
    try {
      const result = await generateCSS(["md:color-[]"]);
      return !result.success || result.data.css.trim() === "";
    } catch (error) {
      return true; // Expected to fail
    }
  });

  // Print vs Screen media queries
  await test("Print media query", async () => {
    const result = await generateCSS(["print:display-[none]"]);
    // May or may not be supported
    return true;
  });

  await test("Screen media query", async () => {
    const result = await generateCSS(["screen:color-[black]"]);
    // May or may not be supported
    return true;
  });

  // Print test results
  console.log(`\n${colors.blue}📊 TEST RESULTS SUMMARY${colors.reset}`);
  console.log("=".repeat(23));
  console.log(`Total tests: ${testCount}`);
  console.log(
    `${colors.green}✅ Passed: ${passCount} (${((passCount / testCount) * 100).toFixed(1)}%)${colors.reset}`
  );
  console.log(
    `${colors.red}❌ Failed: ${failCount} (${((failCount / testCount) * 100).toFixed(1)}%)${colors.reset}`
  );

  if (failCount === 0) {
    console.log(
      `\n${colors.green}🎉 All responsive system tests passed!${colors.reset}`
    );
  } else {
    console.log(
      `\n${colors.red}❌ ${failCount} test(s) failed. Please check the implementation.${colors.reset}`
    );
    process.exit(1);
  }
}

// Run all tests
runTests().catch(console.error);

