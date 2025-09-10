import { zyraGenerateCSS } from "./generateCSS.js";
import { createLogger } from "../../core/utils/helpers.js";

// Environment detection utility
const isValidBrowserEnvironment = () => {
  try {
    return (
      typeof window !== "undefined" &&
      typeof document !== "undefined" &&
      typeof document.createElement === "function" &&
      typeof document.querySelector === "function" &&
      document.head instanceof Element
    );
  } catch (e) {
    return false;
  }
};

/**
 * Simple browser-optimized CSS manager
 * Proper CSS rule-level deduplication to prevent duplicate styles
 */
class ZyraCSSManager {
  constructor(options = {}) {
    this.processedClasses = new Set(); // Track individual classes
    this.cssRules = new Set(); // Track individual CSS rules to prevent duplicates
    this.styleElement = null;
    this.isInitialized = false;
    this.debug = options.debug ?? true; // Enable debug logging by default for MVP
    this.styleElementId = options.styleElementId ?? "zyracss-runtime";
    this.logger = createLogger("ZyraCSS-Manager");
  }

  /**
   * Configure debug logging
   * @param {boolean} enabled - Enable or disable debug output
   */
  setDebug(enabled) {
    this.debug = enabled;
  }

  /**
   * Initialize the browser manager
   */
  init() {
    if (this.isInitialized) {
      return this;
    }

    // Validate browser environment before proceeding
    if (!isValidBrowserEnvironment()) {
      if (this.debug) {
        this.logger.warn(
          "⚠️ Browser environment not detected. ZyraCSSManager requires a DOM environment."
        );
      }
      throw new Error(
        "ZyraCSSManager requires a browser environment with DOM support"
      );
    }

    // Create or reuse existing style element
    let existingStyle = document.querySelector(
      `style[data-zyracss="${this.styleElementId}"]`
    );
    if (existingStyle) {
      this.styleElement = existingStyle;
      // Load existing CSS rules into our Set for deduplication
      if (existingStyle.textContent) {
        const ruleRegex = /[^{}]+\{[^{}]*\}/g;
        const existingRules = existingStyle.textContent.match(ruleRegex) || [];
        for (const rule of existingRules) {
          const normalizedRule = rule.trim();
          if (normalizedRule) {
            this.cssRules.add(normalizedRule);
          }
        }
      }
    } else {
      this.styleElement = document.createElement("style");
      this.styleElement.setAttribute("data-zyracss", this.styleElementId);
      document.head.appendChild(this.styleElement);
    }

    this.isInitialized = true;
    return this;
  }

  /**
   * Add CSS rules with deduplication at rule level
   */
  addCSS(css) {
    this.init();

    if (!css || !css.trim()) return;

    // More efficient CSS rule parsing using regex
    const ruleRegex = /[^{}]+\{[^{}]*\}/g;
    const rules = css.match(ruleRegex) || [];
    let newRulesAdded = 0;

    for (const rule of rules) {
      const normalizedRule = rule.trim();
      if (normalizedRule && !this.cssRules.has(normalizedRule)) {
        this.cssRules.add(normalizedRule);
        newRulesAdded++;
      }
    }

    if (newRulesAdded > 0) {
      if (this.debug) {
        this.logger.debug(
          `➕ Added ${newRulesAdded} new CSS rules. Total: ${this.cssRules.size}`
        );
      }
      this.updateStyleElement();
    } else {
      if (this.debug) {
        this.logger.debug(
          `⏭️ No new CSS rules to add. All ${rules.length} rules already exist.`
        );
      }
    }
  }

  /**
   * Update the style element with all unique CSS rules
   */
  updateStyleElement() {
    if (!this.styleElement) {
      return;
    }
    const allCSS = Array.from(this.cssRules).join("\n");
    this.styleElement.textContent = allCSS;
  }

  /**
   * Process classes with proper class-level deduplication
   */
  async processClasses(classes, options = {}) {
    // Normalize input
    const classArray = Array.isArray(classes) ? classes : [classes];

    // Filter out invalid classes and already processed ones
    const newClasses = classArray
      .filter((cls) => typeof cls === "string" && cls.trim())
      .map((cls) => cls.trim())
      .filter((cls) => !this.processedClasses.has(cls));

    if (newClasses.length === 0) {
      if (this.debug) {
        this.logger.debug("⏭️ All classes already processed or invalid");
      }
      return this;
    }

    if (this.debug) {
      this.logger.debug(
        `🔄 Processing ${newClasses.length} new classes:`,
        newClasses
      );
      this.logger.debug(
        `📊 Already processed: ${this.processedClasses.size} classes`
      );
    }

    try {
      // Process only the new classes - use core API directly
      const result = await zyraGenerateCSS(newClasses, options);
      const css = result.success ? result.data.css : "";

      if (css && css.trim()) {
        // Mark these classes as processed
        newClasses.forEach((cls) => this.processedClasses.add(cls));

        // Add the CSS to our accumulated styles
        this.addCSS(css.trim());

        if (this.debug) {
          this.logger.debug(
            `✅ Added CSS for ${newClasses.length} classes. Total processed: ${this.processedClasses.size}`
          );
        }
      }

      return this;
    } catch (error) {
      this.logger.error("Failed to process classes:", newClasses, error);
      throw error;
    }
  }

  /**
   * Clear all processed classes and CSS rules
   */
  clear() {
    this.processedClasses.clear();
    this.cssRules.clear();
    if (this.styleElement) {
      this.styleElement.textContent = "";
    }
    if (this.debug) {
      this.logger.debug("🧹 Cleared all processed classes and CSS rules");
    }
    return this;
  }

  /**
   * Get current stats
   */
  getStats() {
    return {
      processedClasses: this.processedClasses.size,
      cssRules: this.cssRules.size,
      initialized: this.isInitialized,
    };
  }
}

// Create and export singleton instance with the expected name
const zyraCSSManager = new ZyraCSSManager();
export { zyraCSSManager };

// Note: ZyraCSSManager class is kept internal for MVP
// Users should use the singleton instance `zyraCSSManager`
