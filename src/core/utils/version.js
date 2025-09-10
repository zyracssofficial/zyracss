/**
 * Version utilities with fallback for async environments
 */

import { ZyraError, ERROR_CODES } from "../errors/index.js";

// Check if we're in a browser environment with proper feature detection
const isBrowser = (() => {
  try {
    // Check for DOM availability and basic browser features
    return (
      typeof window !== "undefined" &&
      typeof document !== "undefined" &&
      typeof document.createElement === "function" &&
      typeof window.location === "object" &&
      typeof navigator !== "undefined"
    );
  } catch (e) {
    // In some environments, accessing these objects might throw
    return false;
  }
})();

let packageInfo = null;

// Synchronous fallback version info
const FALLBACK_VERSION = {
  version: "0.1.0",
  major: 0,
  minor: 1,
  patch: 0,
  name: "zyracss",
  FULL: "0.1.0",
};

function loadPackageInfo() {
  if (packageInfo) return packageInfo;

  try {
    // Browser or bundled environment check - return fallback immediately
    if (isBrowser || typeof import.meta.url === "undefined") {
      packageInfo = FALLBACK_VERSION;
      return packageInfo;
    }

    // For any bundled environment (Vite, esbuild, webpack), use fallback
    // This avoids eval warnings and ensures compatibility
    packageInfo = FALLBACK_VERSION;
    return packageInfo;
  } catch (error) {
    // Silently use fallback version - no warning needed for CLI usage
    packageInfo = FALLBACK_VERSION;
    return packageInfo;
  }
}

export function zyraGetVersion() {
  return loadPackageInfo().version;
}
