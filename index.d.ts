declare module "zyracss" {
  interface ZyraResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
  }

  interface ZyraCSSManager {
    processClasses(classes: string[]): Promise<void>;
    getStats(): {
      processedClasses: number;
      cssRules: number;
      initialized: boolean;
    };
    init(): ZyraCSSManager;
    setDebug(enabled: boolean): void;
  }

  interface GenerationOptions {
    minify?: boolean;
    groupSelectors?: boolean;
    includeComments?: boolean;
  }

  interface ValidationResult {
    valid: string[];
    invalid: Array<{
      className: string;
      reason: string;
      suggestions: string[];
    }>;
    stats: {
      total: number;
      validCount: number;
      invalidCount: number;
      processingTime: number;
    };
  }

  // Core API functions
  export function zyraGenerateCSS(
    input: string | string[] | { classes?: string[]; html?: string[] },
    options?: GenerationOptions
  ): Promise<ZyraResult>;
  export function zyraGenerateCSSFromHTML(
    html: string,
    options?: GenerationOptions
  ): Promise<ZyraResult>;
  export function zyraGenerateCSSFromClasses(
    classes: string[],
    options?: GenerationOptions
  ): Promise<ZyraResult>;

  // Browser manager
  export const zyraCSSManager: ZyraCSSManager;

  // Utility functions
  export function zyraExtractClassFromHTML(html: string): string[];
  export function parseClasses(classes: string[]): {
    hasAnyValid: boolean;
    valid: any[];
    invalid: any[];
  };
  export function validateClasses(classes: string[]): boolean;

  // Convenience validation functions
  export function validateClassNames(
    classes: string[]
  ): Promise<ZyraResult<ValidationResult>>;
  export function validateSingleClass(
    className: string
  ): Promise<ZyraResult<ValidationResult>>;
  export function getValidationStats(classes: string[]): Promise<ZyraResult>;
  export function parseClassesDirect(classes: string[]): {
    hasAnyValid: boolean;
    valid: any[];
    invalid: any[];
  };

  // Utilities
  export function zyraGetVersion(): string;
  export function cleanupGlobalCache(): void;
  export function now(): number;
}
