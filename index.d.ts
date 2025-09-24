declare module "zyracss" {
  interface ZyraResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
  }

  interface GenerationOptions {
    minify?: boolean;
    groupSelectors?: boolean;
    includeComments?: boolean;
  }

  interface CSSGenerationResult {
    css: string;
    stats: {
      totalClasses: number;
      validClasses: number;
      invalidClasses: number;
      generatedRules: number;
      groupedRules: number;
      compressionRatio: number;
      processingTime: number;
      fromCache: boolean;
      cacheTimestamp: number | null;
    };
    invalid: Array<{
      className: string;
      reason: string;
      suggestions: string[];
    }>;
    security: {
      passed: boolean;
      blockedClasses: string[];
      warnings: string[];
    };
  }

  interface Engine {
    addClasses(classes: string[]): {
      success: boolean;
      added: number;
      invalid: string[];
      totalClasses: number;
      processingTime: number;
    };
    getCSS(options?: GenerationOptions): ZyraResult<CSSGenerationResult>;
    getStats(): {
      totalUpdates: number;
      totalClasses: number;
      cacheHits: number;
      cacheMisses: number;
      lastGenerationTime: number;
      averageGenerationTime: number;
      cacheSize: number;
      updateCount: number;
      cacheHitRate: number;
      uptime: number;
    };
    size: number;
    options: any;
    type: string;
    version: string;
  }

  // ========================================================================
  // ZYRA NAMESPACE - Modern 3-Method API
  // ========================================================================
  export const zyra: {
    generate(
      input: string | string[] | { classes?: string[]; html?: string[] },
      options?: GenerationOptions
    ): ZyraResult<CSSGenerationResult>;

    inject(classes: string[]): void;

    createEngine(options?: GenerationOptions): Engine;
  };

  // Default export
  export default zyra;
}
