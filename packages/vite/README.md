# @zyracss/vite

ZyraCSS Vite Plugin - Build-time CSS generation with smart content detection.

## 🚀 **Installation**

```bash
npm install zyracss @zyracss/vite
```

## 📖 **Quick Start**

### **Step 1: Configure Vite Plugin**

Add ZyraCSS to your existing Vite config:

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { zyracss } from "@zyracss/vite"; // Add this

export default defineConfig({
  plugins: [
    zyracss(), // Add this - zero config needed
    react(),
  ],
});
```

### **Step 2: Add CSS Import Directive**

Add the `@import "zyracss"` directive to your main CSS file:

```css
/* src/index.css or your main CSS file */
@import "zyracss"; /* ZyraCSS will replace this with generated CSS */

/* Your existing styles */
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
```

### **Step 3: Use ZyraCSS Classes**

Start using ZyraCSS classes in your components:

```jsx
// React example
function App() {
  return (
    <div className="padding-[20px] c-[#3b82f6] bg-[white] border-radius-[8px]">
      ZyraCSS works like magic! ✨
    </div>
  );
}
```

**That's it!** ZyraCSS will:

- ✅ Auto-scan `src/`, `pages/`, `components/`, `app/` directories
- ✅ Include all framework files (.js, .jsx, .ts, .tsx, .html)
- ✅ Replace `@import "zyracss"` with generated CSS automatically

## ⚙️ **Configuration (Optional)**

### **Using zyracss.config.js (Recommended)**

Create `zyracss.config.js` in your project root:

```javascript
// zyracss.config.js
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  output: "inline", // or 'file'
  outputPath: "dist/zyracss.css", // when output: 'file'
  minify: true,
  watch: true,
};
```

```javascript
// vite.config.js - Clean and simple
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { zyracss } from "@zyracss/vite";

export default defineConfig({
  plugins: [
    react(),
    zyracss(), // Loads config from zyracss.config.js
  ],
});
```

### **Inline Configuration**

```javascript
// vite.config.js - Direct configuration
import { defineConfig } from "vite";
import { zyracss } from "@zyracss/vite";

export default defineConfig({
  plugins: [
    zyracss({
      content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
      output: "inline", // or 'file'
      outputPath: "dist/zyracss.css",
      minify: true,
    }),
  ],
});
```

**Configuration Priority:**

1. 🥇 Inline Vite config (overrides everything)
2. 🥈 `zyracss.config.js` file
3. 🥉 Smart auto-detection (scans common directories)

## 🎯 **Features**

### **CSS Directive Support**

Use the `@import "zyracss"` directive in your CSS files:

```css
/* src/index.css */
@import "zyracss"; /* This gets replaced with generated CSS */

body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
```

ZyraCSS automatically scans your files and replaces the directive with optimized CSS:

```css
/* Generated output */
.padding-\[20px\] {
  padding: 20px;
}
.c-\[#3b82f6\] {
  color: #3b82f6;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
```

### **Automatic CSS Generation**

Just use classes in your components and CSS is generated automatically:

```jsx
// Use ZyraCSS classes in your components
function App() {
  return (
    <div className="padding-[20px] c-[#3b82f6] bg-[white] border-radius-[8px]">
      CSS generated automatically from @import directive!
    </div>
  );
}
```

### **Smart Content Detection**

ZyraCSS automatically scans common project directories:

- **`src/`** - Main source directory (always included)
- **`pages/`** - Next.js style pages (if directory exists)
- **`components/`** - Root-level components (if not in src/)
- **`app/`** - App router or root app directory (if not in src/)
- **Root files** - `.html`, `.js`, `.jsx`, `.ts`, `.tsx` in project root

### **Build-Time Processing**

- Classes are extracted during build time
- CSS is generated once and cached
- No runtime JavaScript overhead
- HMR (Hot Module Replacement) support

## ⚙️ **Configuration Options**

```javascript
zyracss({
  // File patterns to scan for classes (auto-detected if not provided)
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Output mode: 'inline' or 'file'
  output: "inline", // Default: 'inline'

  // Output file path (when output: 'file')
  outputPath: "dist/zyracss.css", // Default: 'dist/zyracss.css'

  // Minify generated CSS
  minify: true, // Default: true

  // Enable file watching in development
  watch: true, // Default: true
});
```

**Smart Defaults:**

- **content**: Auto-detects `src/`, `pages/`, `components/`, `app/` + root files
- **output**: `'inline'` (CSS injected into page)
- **minify**: `true` (optimized CSS)
- **watch**: `true` (HMR support)

## 🎨 **ZyraCSS Syntax**

ZyraCSS uses bracket notation for arbitrary values:

```html
<!-- Basic utilities -->
<div class="bg-red-500 text-white p-4">Content</div>

<!-- Arbitrary values -->
<div class="bg-[#ff6b35] text-[18px] p-[12px]">Custom values</div>

<!-- Responsive design -->
<div class="md:text-[24px] lg:p-[20px]">Responsive</div>
```

## 🔧 **Framework Examples**

### **React**

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { zyracss } from "@zyracss/vite";

export default defineConfig({
  plugins: [
    react(),
    zyracss({
      content: ["./src/**/*.{js,jsx,ts,tsx}"],
    }),
  ],
});
```

## 🚀 **Advanced Usage**

### **Custom ZyraCSS Configuration**

Create a `zyracss.config.js` file in your project root:

```javascript
// zyracss.config.js
export default {
  output: "file",
  outputPath: "public/styles.css",
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./public/index.html"],
  minify: process.env.NODE_ENV === "production",
};
```

### **Dynamic Runtime Usage**

For client-side rendering or dynamic class generation:

```javascript
import { zyra } from "@zyracss/vite";

// Generate CSS on the fly
const css = zyra.generate(["bg-blue-500", "text-[20px]"]);
console.log(css.data.css); // .bg-blue-500{background-color:#3b82f6}...
```

## 📁 **Output Modes**

### **Inline Mode (Default)**

CSS is injected directly where `@import "zyracss"` appears:

```javascript
zyraCSS({ output: "inline" });
```

```css
/* Input: src/index.css */
@import "zyracss";

body {
  margin: 0;
}

/* Output: Processed CSS */
.padding-\[20px\] {
  padding: 20px;
}
.c-\[#3b82f6\] {
  color: #3b82f6;
}

body {
  margin: 0;
}
```

### **File Mode**

CSS is written to a separate file and the import is updated:

```javascript
zyraCSS({
  output: "file",
  outputPath: "dist/zyracss.css",
});
```

```css
/* The @import "zyracss" directive becomes: */
@import "./dist/zyracss.css";
```

## 🔥 **Hot Module Replacement**

The plugin supports HMR in development:

- File changes trigger CSS regeneration
- Styles update without page refresh
- Fast development iteration

## 📊 **Performance**

- **Build-time processing**: No runtime overhead
- **Caching**: Generated CSS is cached for faster rebuilds
- **Tree-shaking**: Only used classes generate CSS
- **Minification**: Optimized output for production

## 🤝 **TypeScript Support**

Full TypeScript support included:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { zyracss } from "@zyracss/vite";

export default defineConfig({
  plugins: [
    zyracss({
      content: ["./src/**/*.{ts,tsx}"],
    }),
  ],
});
```

## 📚 **API Reference**

### **zyracss(options)**

Main plugin function.

**Parameters:**

- `options` (object): Configuration options

**Returns:** Vite plugin object

**Example:**

```javascript
import { zyracss } from "@zyracss/vite";

zyracss({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  output: "inline",
  minify: true,
});
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

**CSS not generating?**

```css
/* Make sure you have the import directive in your CSS file */
@import "zyracss"; /* This line is required! */
```

**Classes not found?**

```javascript
// Check your content patterns in vite.config.js
zyracss({
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Make sure this matches your files
});
```

**Build errors?**

```bash
# Ensure both packages are installed
npm install zyracss @zyracss/vite

# Check your import statement
import { zyracss } from "@zyracss/vite"; // Use named import with braces
```

**Plugin order matters:**

```javascript
// Put ZyraCSS first in your plugins array
plugins: [
  zyracss(), // ZyraCSS should come first
  react(), // Other plugins after
];
```

## 🎉 **Get Started**

1. **Install**: `npm install zyracss @zyracss/vite`
2. **Configure**: Add `zyraCSS()` to your `vite.config.js`
3. **Import**: Add `@import "zyracss";` to your CSS file
4. **Use**: Write ZyraCSS classes in your components
5. **Build**: CSS is generated automatically!

For more examples and advanced usage, check out the [ZyraCSS documentation](https://github.com/zyracssofficial/zyracss).
