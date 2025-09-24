/**
 * ZyraCSS Internal API Type Definitions
 *
 * These types are for internal use by official @zyracss packages only.
 * Not part of the public API and may change without notice.
 *
 * @internal
 */

// Version utilities
export declare function zyraGetVersion(): string;

// Performance utilities
export declare const now: () => number;

// Cache management
export declare function cleanupGlobalCache(): void;

// Error handling
export declare class ZyraError extends Error {
  constructor(message: string, code?: string);
  code?: string;
}

export declare const ERROR_CODES: {
  readonly INVALID_INPUT: "INVALID_INPUT";
  readonly PARSING_ERROR: "PARSING_ERROR";
  readonly GENERATION_ERROR: "GENERATION_ERROR";
  readonly SECURITY_ERROR: "SECURITY_ERROR";
  readonly CACHE_ERROR: "CACHE_ERROR";
  readonly CONFIG_ERROR: "CONFIG_ERROR";
};

// Security constants
export declare const MAX_FILES_LIMIT: number;

// Parser utilities
export declare function zyraExtractClassFromHTML(
  htmlContent: string,
  options?: {
    includeInvalid?: boolean;
    maxClasses?: number;
  }
): {
  classes: string[];
  invalid?: string[];
  truncated?: boolean;
};

// Main API re-export
export declare const zyra: {
  generate(
    input: string | { html: string } | string[],
    options?: {
      minify?: boolean;
      groupSelectors?: boolean;
      includeComments?: boolean;
    }
  ): {
    success: boolean;
    data?: {
      css: string;
      stats: {
        validClasses: number;
        generatedRules: number;
        fromCache: boolean;
        cacheTimestamp?: string;
        compressionRatio?: number;
      };
      invalid?: Array<{
        className: string;
        error: { message: string };
      }>;
    };
    error?: { message: string };
  };

  inject(
    css: string,
    options?: { target?: string }
  ): {
    success: boolean;
    data?: { injected: boolean; target: string };
    error?: { message: string };
  };

  createEngine(config?: {
    cache?: boolean;
    minify?: boolean;
    security?: { maxClassLength?: number; maxClasses?: number };
  }): {
    generate: (
      input: string | { html: string } | string[],
      options?: { minify?: boolean; groupSelectors?: boolean }
    ) => any;
    clearCache: () => void;
    getStats: () => { cacheSize: number; totalGenerations: number };
  };
};
