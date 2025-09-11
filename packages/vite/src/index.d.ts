/**
 * ZyraCSS Vite Plugin TypeScript Declarations
 */

export interface ZyraViteConfig {
  /** Output mode: 'inline' to embed CSS directly, 'file' to write separate CSS file */
  output?: "inline" | "file";

  /** Output path when using 'file' mode */
  outputPath?: string;

  /** Content patterns to scan for ZyraCSS classes */
  content?: string[];

  /** Whether to minify the generated CSS */
  minify?: boolean;

  /** Whether to enable file watching for HMR */
  watch?: boolean;

  /** Enable debug logging */
  debug?: boolean;
}

export declare function zyracss(config?: ZyraViteConfig): import("vite").Plugin;

export default zyracss;
