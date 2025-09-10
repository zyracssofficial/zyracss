// ZyraCSS Configuration File
export default {
  // Files to scan for classes
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./pages/**/*.{js,jsx,ts,tsx,html}",
    "./components/**/*.{js,jsx,ts,tsx,html}",
    "./app/**/*.{js,jsx,ts,tsx,html}",
    "./**/*.{html,js,jsx,ts,tsx}",
  ],

  // Output configuration
  output: "file",
  outputPath: "dist/styles.css",

  // Optimization settings
  minify: false,
  watch: false,
  groupSelectors: true,

  // File exclusions
  excludePatterns: ["**/node_modules/**", "**/dist/**", "**/build/**"],
};
