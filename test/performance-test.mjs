/**
 * Performance Test: Large Component Rendering with ZyraCSS
 */

import { zyraGenerateCSS } from "../src/index.js";

// Simulate ZyraCSS Manager behavior
class PerformanceTestManager {
  constructor() {
    this.generatedClasses = new Set();
    this.pendingClasses = new Set();
    this.batchTimer = null;
    this.componentRenderTimes = [];
    this.cssGenerationTimes = [];
  }

  // Simulate component calling generateCSS
  simulateComponentRender(componentId, classes) {
    const startTime = performance.now();

    // Add classes to pending batch (like real implementation)
    classes.forEach((cls) => {
      if (cls && !this.generatedClasses.has(cls)) {
        this.pendingClasses.add(cls);
      }
    });

    // Start/restart batch timer (like real implementation)
    this.processBatch();

    const endTime = performance.now();
    this.componentRenderTimes.push({
      componentId,
      time: endTime - startTime,
    });
  }

  async processBatch() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }

    return new Promise((resolve) => {
      this.batchTimer = setTimeout(async () => {
        const batchStartTime = performance.now();

        if (this.pendingClasses.size === 0) {
          resolve();
          return;
        }

        const newClasses = Array.from(this.pendingClasses);
        this.pendingClasses.clear();

        console.log(
          `🎨 Processing batch of ${newClasses.length} unique classes`
        );

        try {
          const result = await zyraGenerateCSS(newClasses, {
            minify: false,
            groupSelectors: true,
          });

          if (result.success) {
            newClasses.forEach((cls) => this.generatedClasses.add(cls));

            const batchEndTime = performance.now();
            this.cssGenerationTimes.push({
              classCount: newClasses.length,
              time: batchEndTime - batchStartTime,
            });

            console.log(
              `✅ Batch completed in ${(batchEndTime - batchStartTime).toFixed(2)}ms`
            );
            resolve(result.data.css);
          }
        } catch (error) {
          console.error("Error generating CSS:", error);
          resolve();
        }
      }, 10); // 10ms delay like real implementation
    });
  }

  getStats() {
    return {
      totalComponents: this.componentRenderTimes.length,
      totalUniqueClasses: this.generatedClasses.size,
      avgComponentRenderTime:
        this.componentRenderTimes.reduce((sum, c) => sum + c.time, 0) /
        this.componentRenderTimes.length,
      totalCSSGenerationTime: this.cssGenerationTimes.reduce(
        (sum, c) => sum + c.time,
        0
      ),
      cssGenerationBatches: this.cssGenerationTimes.length,
    };
  }
}

// Generate test data for different scenarios
function generateTestClasses(componentId, scenario = "normal") {
  const scenarios = {
    normal: [
      `padding-[${Math.floor(Math.random() * 50)}px]`,
      `c-[#${Math.floor(Math.random() * 16777215).toString(16)}]`,
      `margin-[${Math.floor(Math.random() * 30)}px]`,
    ],
    heavy: [
      `padding-[${Math.floor(Math.random() * 100)}px,${Math.floor(Math.random() * 100)}px]`,
      `bg-color-[linear-gradient(45deg,#${Math.floor(Math.random() * 16777215).toString(16)},#${Math.floor(Math.random() * 16777215).toString(16)})]`,
      `box-shadow-[0,${Math.floor(Math.random() * 10)}px,${Math.floor(Math.random() * 20)}px,rgba(0,0,0,0.${Math.floor(Math.random() * 9)})]`,
      `border-radius-[${Math.floor(Math.random() * 50)}px]`,
      `font-size-[${Math.floor(Math.random() * 48) + 12}px]`,
    ],
    duplicate: [
      "padding-[20px]", // These will be duplicated across components
      "c-[#3b82f6]",
      "margin-[10px]",
    ],
  };

  return scenarios[scenario];
}

// Test scenarios
async function runPerformanceTests() {
  console.log("🚀 Starting ZyraCSS Performance Tests\n");

  // Test 1: 100 components (small)
  console.log("📊 Test 1: 100 Components");
  const test1 = new PerformanceTestManager();
  const start1 = performance.now();

  for (let i = 0; i < 100; i++) {
    test1.simulateComponentRender(i, generateTestClasses(i, "normal"));
  }

  await new Promise((resolve) => setTimeout(resolve, 50)); // Wait for batching
  const end1 = performance.now();

  console.log(`Total time: ${(end1 - start1).toFixed(2)}ms`);
  console.log(`Stats:`, test1.getStats());
  console.log("");

  // Test 2: 1000 components (medium)
  console.log("📊 Test 2: 1000 Components");
  const test2 = new PerformanceTestManager();
  const start2 = performance.now();

  for (let i = 0; i < 1000; i++) {
    test2.simulateComponentRender(i, generateTestClasses(i, "normal"));
  }

  await new Promise((resolve) => setTimeout(resolve, 50));
  const end2 = performance.now();

  console.log(`Total time: ${(end2 - start2).toFixed(2)}ms`);
  console.log(`Stats:`, test2.getStats());
  console.log("");

  // Test 3: 2000 components (large) - Your scenario!
  console.log("📊 Test 3: 2000 Components (Your Scenario)");
  const test3 = new PerformanceTestManager();
  const start3 = performance.now();

  for (let i = 0; i < 2000; i++) {
    test3.simulateComponentRender(i, generateTestClasses(i, "heavy"));
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  const end3 = performance.now();

  console.log(`Total time: ${(end3 - start3).toFixed(2)}ms`);
  console.log(`Stats:`, test3.getStats());
  console.log("");

  // Test 4: 2000 components with many duplicates (realistic)
  console.log("📊 Test 4: 2000 Components with Duplicates (Realistic)");
  const test4 = new PerformanceTestManager();
  const start4 = performance.now();

  for (let i = 0; i < 2000; i++) {
    // Mix of unique and duplicate classes (more realistic)
    const classes = [
      ...generateTestClasses(i, "duplicate"), // Same classes
      ...generateTestClasses(i, "normal").slice(0, 2), // Some unique
    ];
    test4.simulateComponentRender(i, classes);
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
  const end4 = performance.now();

  console.log(`Total time: ${(end4 - start4).toFixed(2)}ms`);
  console.log(`Stats:`, test4.getStats());
  console.log("");

  console.log("🎯 Performance Test Complete!");
}

// Run the tests
runPerformanceTests().catch(console.error);
