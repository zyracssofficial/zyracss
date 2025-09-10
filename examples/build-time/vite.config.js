import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { zyracss } from "../../packages/vite/src/index.js";

export default defineConfig({
  plugins: [
    // ZyraCSS must come before React to process CSS imports first
    zyracss({
      // Files to scan for ZyraCSS classes
      content: ["./src/**/*.{js,jsx,ts,tsx,html}"],

      // Output mode: 'inline' injects CSS where @import "zyracss" appears
      output: "inline",

      // Optional: output to separate file instead
      // output: "file",
      // outputPath: "dist/zyracss.css",

      // Build optimizations
      minify: false, // Set to true for production
      groupSelectors: true,

      // Enable debugging
      debug: false,
    }),
    react(),
  ],
  optimizeDeps: {
    exclude: ["zyracss"],
  },
});
