/**
 * Security constants and configuration
 * Centralized security rules and patterns
 */

// Length limits
export const MAX_CLASS_LENGTH = 1000; // Increased for data URLs
export const MAX_VALUE_LENGTH = 800; // Increased for data URLs
export const MAX_CLASSES_PER_REQUEST = 10000;
export const MAX_INPUT_LENGTH = 10000; // Safe regex input length
export const MAX_PATTERN_LENGTH = 1000; // Safe regex pattern length
export const MAX_CACHE_KEY_LENGTH = 1000; // Cache key length limit
export const MAX_FILES_LIMIT = 1000; // File scanner limit
export const MAX_PART_LENGTH = 200; // URL part length limit
export const MAX_BATCH_SIZE = 1000; // Class validation batch size

// Color validation constants
export const RGB_MAX_VALUE = 255; // RGB color component max value
export const HUE_MAX_DEGREES = 360; // HSL hue maximum degrees
export const FONT_WEIGHT_MAX = 1000; // CSS font-weight maximum value

// Dangerous CSS patterns with detailed information
export const DANGEROUS_PATTERNS = {
  javascript_url: {
    regex: /javascript:/i,
    description: "JavaScript URL scheme that can execute code",
    riskLevel: "critical",
    examples: ["javascript:alert(1)", "JAVASCRIPT:void(0)"],
  },

  vbscript_url: {
    regex: /vbscript:/i,
    description: "VBScript URL scheme that can execute code",
    riskLevel: "critical",
    examples: ["vbscript:msgbox(1)", "VBSCRIPT:execute()"],
  },

  file_url: {
    regex: /file:/i,
    description: "File URL scheme that can access local files",
    riskLevel: "high",
    examples: ["file:///etc/passwd", "file:///c:/windows/system32/"],
  },

  data_url: {
    regex: /data:(?!image\/(?:png|jpe?g|gif|webp|bmp|tiff?|ico)(?:;|$))/i,
    description:
      "Data URL scheme that can contain executable content (excludes safe image types)",
    riskLevel: "high",
    examples: [
      "data:text/html,<script>alert(1)</script>",
      "data:image/svg+xml,<svg>",
    ],
  },

  data_svg_url: {
    regex: /data:image\/svg\+xml/i,
    description: "Data URL with SVG content that can execute JavaScript",
    riskLevel: "critical",
    examples: [
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzY3JpcHQ+YWxlcnQoMSk8L3NjcmlwdD48L3N2Zz4=",
    ],
  },

  css_expression: {
    regex: /expression\s*\(/i,
    description: "CSS expressions (IE-specific) that can execute JavaScript",
    riskLevel: "critical",
    examples: ["expression(alert(1))", "expression(document.cookie)"],
  },

  css_behavior: {
    regex: /behavior\s*:/i,
    description: "CSS behavior property that can load external scripts",
    riskLevel: "critical", // Upgraded to critical
    examples: ["behavior: evil.htc"],
  },

  css_binding: {
    regex: /binding\s*:/i,
    description:
      "CSS binding property (Mozilla-specific) that can execute code",
    riskLevel: "high",
    examples: ["binding: xbl.xml#myBinding"],
  },

  // New patterns for encoded attacks
  encoded_expression: {
    regex:
      /\\6[5e]\\7[8x]\\7[0p]\\7[2r]\\6[5e]\\7[3s]\\7[3s]\\6[9i]\\6[fo]\\6[en]/i,
    description: "Hex-encoded CSS expression that can execute code",
    riskLevel: "critical",
    examples: ["\\65\\78\\70\\72\\65\\73\\73\\69\\6F\\6E"],
  },

  encoded_javascript: {
    regex:
      /\\6[aj]\\6[aj]\\7[6v]\\6[aj]\\7[3s]\\6[3c]\\7[2r]\\6[9i]\\7[0p]\\7[4t]/i,
    description: "Hex-encoded JavaScript URL scheme",
    riskLevel: "critical",
    examples: ["\\6a\\61\\76\\61\\73\\63\\72\\69\\70\\74"],
  },

  unicode_script: {
    regex: /\\3[cf]\\7[3s]\\6[3c]\\7[2r]\\6[9i]\\7[0p]\\7[4t]\\3[ef]/i,
    description: "Unicode-encoded script tags",
    riskLevel: "critical",
    examples: ["\\3c\\73\\63\\72\\69\\70\\74\\3e"],
  },

  behavior_property: {
    regex: /(?:^|\s)behavior\s*-\s*\[/i,
    description: "CSS behavior property in bracket syntax",
    riskLevel: "critical",
    examples: ["behavior-[evil.htc]"],
  },

  css_import: {
    regex: /@import/i,
    description: "CSS import that can load external stylesheets",
    riskLevel: "medium",
    examples: ["@import evil.css", '@import "malicious.css"'],
  },

  css_comment: {
    regex: /\/\*[\s\S]*?\*\//g,
    description: "CSS comments that might hide malicious content",
    riskLevel: "low",
    examples: ["/* hidden content */", "/**/evil/**/"],
  },

  html_script: {
    regex: /<script/i,
    description: "HTML script tags that execute JavaScript",
    riskLevel: "critical",
    examples: ["<script>alert(1)</script>", "<SCRIPT src=evil.js>"],
  },

  html_iframe: {
    regex: /<iframe/i,
    description: "HTML iframe tags that can load external content",
    riskLevel: "high",
    examples: ['<iframe src="evil.html">', "<IFRAME onload=alert(1)>"],
  },

  event_handler: {
    regex: /on\w+\s*=/i,
    description: "HTML event handlers that can execute JavaScript",
    riskLevel: "critical",
    examples: ["onclick=alert(1)", 'onload="evil()"', "onerror=hack()"],
  },

  url_scheme: {
    regex: /\b(?:file|ftp|mailto|tel):/i,
    description: "Non-HTTP URL schemes that might be dangerous",
    riskLevel: "medium",
    examples: ["file:///etc/passwd", "ftp://evil.com"],
  },

  css_calc_injection: {
    regex: /calc\s*\([^)]*(?:expression|javascript|eval)/i,
    description: "CSS calc() function with potential code injection",
    riskLevel: "high",
    examples: ["calc(expression(alert(1)))", "calc(javascript:void(0))"],
  },

  // Potential ReDoS patterns
  suspicious_repetition: {
    regex: /^([a-z])\1{20,}[^a-z]/i,
    description: "Suspicious repetitive patterns that could cause ReDoS",
    riskLevel: "high",
    examples: ["aaaaaaaaaaaaaaaaaaaaaaaaaaX"],
  },

  // Unicode-specific security patterns for international character support
  bidi_override: {
    regex: /[\u202A-\u202E\u2066-\u2069]/,
    description:
      "Bidirectional text override characters that can cause visual spoofing",
    riskLevel: "medium",
    examples: ["\u202E", "\u2066", "\u202A"],
  },

  zero_width_chars: {
    regex: /[\u200B-\u200D\uFEFF\u2060]/,
    description:
      "Zero-width characters that can hide content or cause confusion",
    riskLevel: "low",
    examples: ["\u200B", "\u200C", "\u200D", "\uFEFF"],
  },

  // Enhanced bracket security patterns
  bracket_length_attack: {
    regex: /\[[^\]]{500,}\]/,
    description:
      "Excessively long bracket content that could cause memory issues",
    riskLevel: "high",
    examples: ["property-[" + "a".repeat(600) + "]"],
  },

  nested_brackets: {
    regex: /\[[^\]]*\[[^\]]*\]/,
    description: "Nested brackets that could bypass parsing security",
    riskLevel: "medium",
    examples: ["prop-[val[nested]]", "prop-[[double]]"],
  },

  bracket_injection: {
    regex:
      /\[.*(?:javascript:|vbscript:|expression\(|behavior:|data:(?!image\/(?:png|jpe?g|gif|webp|bmp|tiff?|ico)(?:;|$))).*\]/i,
    description: "Malicious content within bracket syntax",
    riskLevel: "critical",
    examples: [
      "bg-[javascript:alert(1)]",
      "prop-[expression(hack())]",
      "bg-[data:text/html,<script>]",
    ],
  },

  script_mixing: {
    regex:
      /(?=.*[а-яё])(?=.*[a-z])|(?=.*[А-ЯЁ])(?=.*[A-Z])|(?=.*[α-ω])(?=.*[a-z])/,
    description:
      "Mixed scripts (Latin with Cyrillic/Greek) that can cause visual confusion",
    riskLevel: "low",
    examples: ["аpple", "αpple", "Hello мир"],
  },

  // Note: Homograph detection disabled to avoid false positives on legitimate multilingual content
  // Can be re-enabled with more sophisticated detection in future versions
};

// Safe CSS function patterns (whitelist)
export const SAFE_CSS_FUNCTIONS = [
  "rgb",
  "rgba",
  "hsl",
  "hsla",
  "linear-gradient",
  "radial-gradient",
  "conic-gradient",
  "calc",
  "min",
  "max",
  "clamp",
  "var",
  "env",
  // url function removed - use u() syntax instead
  "rotate",
  "scale",
  "translate",
  "skew",
  "matrix",
  "matrix3d",
  "perspective",
  "cubic-bezier",
  "steps",
  "blur",
  "brightness",
  "contrast",
  "grayscale",
  "hue-rotate",
  "invert",
  "opacity",
  "saturate",
  "sepia",
];

// Error messages
export const SECURITY_ERRORS = {
  DANGEROUS_PATTERN: "Input contains dangerous patterns",
  INPUT_TOO_LONG: "Input exceeds maximum length",
  TOO_MANY_CLASSES: "Too many classes in request",
  INVALID_FUNCTION: "CSS function not allowed",
  SUSPICIOUS_CONTENT: "Content appears suspicious",
  RATE_LIMITED: "Rate limit exceeded",
};
