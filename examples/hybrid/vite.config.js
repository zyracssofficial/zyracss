import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { zyracss } from "@zyracss/vite";

export default defineConfig({
  plugins: [
    // ZyraCSS build-time processing for static classes
    zyracss({
      // Scan for ZyraCSS classes at build time
      content: ["./src/**/*.{js,jsx,ts,tsx,html}"],

      // Inline CSS for build-time optimization
      output: "inline",

      // Build optimizations
      minify: false,
    }),
    react(),
  ],
  optimizeDeps: {
    exclude: ["zyracss"], // Important for runtime
  },
});
