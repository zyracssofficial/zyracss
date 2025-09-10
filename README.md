# ZyraCSS

**A utility-first CSS generator with unlimited arbitrary values and zero configuration**

ZyraCSS generates CSS from utility classes using clean bracket [] syntax. Write exactly the CSS values you need without preset limitations or configuration files.

## 🎯 Quick Example

```html
<!-- Write any CSS value you need -->
<div
  class="font-size-[1.25rem] color-[#3b82f6] background-[linear-gradient(45deg,#ff6b6b,#4ecdc4)] padding-[20px,30px]"
>
  Beautiful gradients with custom padding and colors
</div>
```

**Generates:**

```css
.font-size-\[1\.25rem\] {
  font-size: 1.25rem;
}
.color-\[\#3b82f6\] {
  color: #3b82f6;
}
.background-\[linear-gradient\(45deg\,\#ff6b6b\,\#4ecdc4\)\] {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}
.padding-\[20px\,30px\] {
  padding: 20px 30px;
}
```

## ✨ Features

- **🎯 Unlimited Arbitrary Values**: No preset limitations - write any CSS value
- **⚡ Zero Configuration**: Works out of the box with smart defaults
- **🛡️ Security First**: Built-in CSS injection and XSS prevention
- **🚀 Performance Optimized**: Intelligent caching and deduplication
- **📦 Flexible Integration**: Build-time, runtime, and CLI options
- **🔧 Developer Friendly**: Clear error messages and debugging tools
- **🌍 Framework Agnostic**: Works with React, NextJS, or vanilla HTML
- **📱 Modern CSS Support**: Gradients, transforms, grid, flexbox, and more

## ⚡ Quick Start

Choose your integration method based on your project type:

### 🏗️ Build-Time Integration (Recommended)

For modern React/NextJS applications with build-time optimization:

**Step 1: Install packages**

```bash
npm install zyracss @zyracss/vite
```

**Step 2: Configure Vite plugin**

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { zyracss } from "@zyracss/vite"; // Add this

export default defineConfig({
  plugins: [
    zyracss(), // Zero config - automatically scans your project
    react(),
  ],
});
```

**Step 3: Add CSS import directive**

Add the following to your `src/index.css` or main CSS file:

```css
@import "zyracss"; /* Add this line - ZyraCSS will replace it with generated CSS */

/* Your existing styles */
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
```

**Step 4: Use ZyraCSS classes in your components**

```jsx
// Your components
function App() {
  return (
    <div className="padding-[20px] c-[#3b82f6] bg-[white] border-radius-[8px]">
      ZyraCSS works like magic! ✨
    </div>
  );
}
```

**Perfect for:**

- 🚀 Production applications
- 📦 Component libraries
- ⚡ Optimal performance (build-time generation)
- 🏗️ Static class definitions

---

### ⚡ Runtime Integration

For dynamic classes, theme switching, or user-generated styles:

**Step 1: Install the core package**

```bash
npm install zyracss
```

**Step 2: Configure Vite for runtime usage**

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["zyracss"], // Required for runtime usage
  },
});
```

**Step 3: Import and use the ZyraCSS Manager in your components**

```jsx
import React, { useEffect } from "react";
import { zyraCSSManager } from "zyracss"; // Add this

function DynamicComponent({ userTheme }) {
  const dynamicClasses = [
    `bg-[${userTheme.primaryColor}]`,
    `p-[${userTheme.spacing}px]`,
    `border-radius-[${userTheme.borderRadius}px]`,
  ];

  useEffect(() => {
    // use zyraCSSManager.processClasses()
    zyraCSSManager.processClasses(dynamicClasses);
  }, [dynamicClasses]);

  return <div className={dynamicClasses.join(" ")}>Dynamic styling!</div>;
}
```

**Perfect for:**

- 🎨 Dynamic theme systems
- 🤖 AI-generated components
- 📱 User customization interfaces
- 🔄 Runtime style changes

---

### 🌐 CLI for Static Sites

For static HTML sites without build tools:

**Step 1: Install packages**

```bash
npm install zyracss @zyracss/cli
```

**Step 2: Use CLI commands to build/watch CSS from HTML files**

```bash
# Build CSS from your HTML files
npx zyracss build

# Watch for changes and auto-rebuild
npx zyracss watch

# Custom input/output paths
npx zyracss build -i "src/**/*.html" -o "dist/styles.css" --minify
```

**Step 3: Link the generated CSS file in your HTML**

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Link the generated CSS file -->
    <link rel="stylesheet" href="dist/styles.css" />
  </head>
  <body>
    <div class="padding-[20px] c-[#333] bg-[#f8f9fa] border-radius-[8px]">
      Static site with ZyraCSS!
    </div>
  </body>
</html>
```

**Perfect for:**

- 🌐 Static HTML websites
- 📱 Landing pages
- 🚀 Quick prototyping
- 🏗️ Legacy projects

## 📝 Syntax Rules

ZyraCSS uses strict bracket syntax for predictable and secure CSS generation:

### Core Format

```
[property-prefix]-[value]
```

### ✅ Essential Rules

**1. No spaces inside brackets** (except in quoted strings)

```html
✅
<div class="margin-[10px,20px]">Valid</div>
❌
<div class="margin-[10px 20px]">Invalid</div>
```

**2. Multiple values separated by commas**

```html
✅
<div class="border-[1px,solid,red]">Valid</div>
✅
<div class="padding-[10px,20px,30px,40px]">Valid</div>
```

**3. Multi-word values use dashes**

```html
✅
<div class="font-family-[Times-New-Roman]">Valid</div>
✅
<div class="animation-timing-function-[ease-in-out]">Valid</div>
```

**4. CSS functions use comma syntax**

```html
✅
<div class="transform-[translate(10px,20px)]">Valid</div>
✅
<div class="background-[linear-gradient(45deg,red,blue)]">Valid</div>
❌
<div class="transform-[translate(10px 20px)]">Invalid</div>
```

**5. URLs use special `u()` function**

```html
✅
<div class="background-image-[u(hero.jpg)]">Valid</div>
✅
<div class="background-[u(https://example.com/bg.png)]">
  Valid - use image URL without quotes
</div>
❌
<div class="background-[url(image.png)]">Invalid</div>
❌
<div class="background-[u('image.png')]">
  Invalid - no quotes allowed inside u()
</div>
```

## 🎯 Examples

### Spacing & Layout

```html
<div class="padding-[20px]">Full padding</div>
<div class="p-[1rem,2rem]">Shorthand padding</div>
<div class="margin-[auto]">Centered element</div>
<div class="d-[flex] justify-content-[center]">Flexbox layout</div>
<div class="grid-template-columns-[1fr,2fr,1fr]">CSS Grid</div>
```

### Colors & Backgrounds

```html
<div class="c-[#ff6b6b]">Text color</div>
<div class="bg-[rgba(59,130,246,0.8)]">Background with opacity</div>
<div class="background-[linear-gradient(45deg,#ff6b6b,#4ecdc4)]">Gradients</div>
<div class="border-color-[hsl(200,50%,50%)]">HSL border color</div>
```

### Typography

```html
<div class="font-size-[18px]">Font size</div>
<div class="font-family-[Inter,system-ui,sans-serif]">Font stack</div>
<div class="font-[bold,16px/1.5,Arial]">Font shorthand</div>
<div class="text-align-[center]">Text alignment</div>
```

### Effects & Transforms

```html
<div class="box-shadow-[0,4px,20px,rgba(0,0,0,0.1)]">Box shadow</div>
<div class="transform-[scale(1.1),rotate(45deg)]">Multiple transforms</div>
<div class="transition-[all,0.3s,ease-in-out]">Smooth transitions</div>
<div class="border-radius-[8px,8px,0,0]">Custom border radius</div>
```

### Advanced Values

```html
<div class="width-[calc(100%-40px)]">Calculated width</div>
<div class="height-[min(300px,50vh)]">Responsive height</div>
<div class="font-size-[clamp(1rem,2.5vw,2rem)]">Fluid typography</div>
<div class="background-[u(data:image/svg+xml;base64,...)]">Data URLs</div>
```

## 🛡️ Security Features

ZyraCSS includes enterprise-grade security features:

### URL Security

The `u()` function provides enhanced security for URL handling:

- 🛡️ Blocks dangerous URLs (`javascript:`, `vbscript:`, `file://`)
- 🛡️ Validates data URIs (allows safe image formats only)
- 🛡️ Prevents SVG data URI script injection
- 🛡️ Automatic URL quoting in output

### Input Validation

- ✅ CSS injection prevention
- ✅ ReDoS attack protection
- ✅ Input length validation
- ✅ Unicode support with security context
- ✅ Safe regex execution with timeouts

## ⚙️ Configuration

### Vite Plugin Configuration

```js
// vite.config.js
import { zyracss } from "@zyracss/vite";

export default defineConfig({
  plugins: [
    zyracss({
      // Files to scan for classes
      content: ["./src/**/*.{js,jsx,ts,tsx,html}"],

      // Output mode
      output: "inline", // 'inline' | 'file'
      outputPath: "dist/zyracss.css",

      // Optimizations
      minify: true,
      groupSelectors: true,

      // Development
      debug: false,
    }),
  ],
});
```

### CLI Configuration

Create `zyracss.config.js` for project defaults:

```js
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./pages/**/*.html",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  outputPath: "dist/styles.css",
  minify: false,
  groupSelectors: true,
  excludePatterns: ["**/node_modules/**", "**/dist/**"],
};
```

### Runtime Configuration

```js
import { zyraCSSManager } from "zyracss";

// Process classes for dynamic styling (auto-initializes)
await zyraCSSManager.processClasses([
  "bg-[#ff6b6b]",
  "padding-[20px]",
  "border-radius-[8px]",
]);

// Get runtime statistics
const stats = zyraCSSManager.getStats();
console.log(stats); // { processedClasses: 3, cssRules: 3, initialized: true }
```

````

## 📦 Package Ecosystem

| Package         | Purpose                     | Installation                        |
| --------------- | --------------------------- | ----------------------------------- |
| `zyracss`       | Core engine + runtime API   | `npm install zyracss`               |
| `@zyracss/vite` | Vite build-time integration | `npm install zyracss @zyracss/vite` |
| `@zyracss/cli`  | CLI tools for static sites  | `npm install zyracss @zyracss/cli`  |

### Installation Patterns

```bash
# For React/NextJS applications (recommended)
npm install zyracss @zyracss/vite

# For runtime-only usage
npm install zyracss

# For static HTML sites
npm install zyracss @zyracss/cli
````

## 🚀 CLI Commands

### Build Commands

```bash
# Basic build
npx zyracss build

# Custom input/output
npx zyracss build -i "src/**/*.html" -o "dist/app.css"

# Minified output
npx zyracss build --minify

# Verbose output
npx zyracss build --verbose

# Force rebuild (clear cache)
npx zyracss build --force
```

### Watch Mode

```bash
# Watch with defaults
npx zyracss watch

# Watch with custom options
npx zyracss watch -i "src/**/*.html" -o "dist/app.css" --minify --verbose
```

### CLI Options

| Option         | Description               | Example                |
| -------------- | ------------------------- | ---------------------- |
| `-i, --input`  | Input file patterns       | `-i "src/**/*.html"`   |
| `-o, --output` | Output CSS file path      | `-o "dist/styles.css"` |
| `--minify`     | Generate minified CSS     | `--minify`             |
| `--verbose`    | Show detailed information | `--verbose`            |
| `--force`      | Clear cache and rebuild   | `--force`              |

## 🎯 Programmatic API

### Core Functions

```js
import {
  zyraGenerateCSS,
  zyraGenerateCSSFromHTML,
  zyraGenerateCSSFromClasses,
  zyraCSSManager,
} from "zyracss";

// Generate from classes array
const result = await zyraGenerateCSS(["padding-[20px]", "bg-[#ff6b6b]"]);

// Generate from HTML string
const htmlResult = await zyraGenerateCSSFromHTML(`
  <div class="margin-[10px] c-[blue]">Content</div>
`);

// Runtime manager for dynamic styles
await zyraCSSManager.processClasses(["dynamic-class-[value]"]);
```

### API Response Format

```js
{
  success: true,
  data: {
    css: "/* Generated CSS */",
    classes: ["padding-[20px]", "bg-[#ff6b6b]"],
    metadata: {
      totalClasses: 2,
      validClasses: 2,
      generatedRules: 2,
      processingTime: "1.23ms"
    }
  }
}
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---
