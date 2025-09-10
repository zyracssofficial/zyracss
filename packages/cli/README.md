# @zyracss/cli

**ZyraCSS CLI - Command-line interface for static HTML sites and build automation**

The official CLI tool for ZyraCSS that enables CSS generation from HTML files, perfect for static sites, legacy projects, and build automation.

## ✨ Features

- **🌐 Static Site Support**: Perfect for HTML-only projects
- **⚡ Build & Watch Modes**: One-time builds or continuous watching
- **🔍 Smart File Scanning**: Automatically finds ZyraCSS classes in HTML
- **📦 Zero Config**: Works out of the box with sensible defaults
- **⚙️ Configurable**: Optional `zyracss.config.js` for custom settings
- **🚀 Fast Processing**: Optimized for large projects
- **🛡️ Security Built-in**: Inherits all ZyraCSS security features
- **📱 Cross-Platform**: Works on Windows, macOS, and Linux

## 📦 Installation

```bash
npm install zyracss @zyracss/cli
```

**Note**: You need both packages - `zyracss` for the core engine and `@zyracss/cli` for the command-line interface.

## 🚀 Quick Start

### Step 1: Install the CLI

```bash
npm install zyracss @zyracss/cli
```

### Step 2: Create your HTML file

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Static Site</title>
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

### Step 3: Generate CSS

```bash
# Build CSS from your HTML files
zyracss build

# Watch for changes and auto-rebuild
zyracss watch
```

**That's it!** Your CSS will be generated in `dist/styles.css`.

## 🎯 Commands

### Build Command

Generate CSS from your source files:

```bash
# Basic build
zyracss build

# Custom input/output
zyracss build -i "src/**/*.html" -o "dist/app.css"

# Minified output
zyracss build --minify

# Verbose output
zyracss build --verbose

# Force rebuild (clear cache)
zyracss build --force
```

### Watch Command

Continuously watch files and regenerate CSS on changes:

```bash
# Watch with defaults
zyracss watch

# Watch with custom options
zyracss watch -i "src/**/*.html" -o "dist/app.css" --minify --verbose
```

## ⚙️ Command Options

| Option      | Short | Description               | Example                |
| ----------- | ----- | ------------------------- | ---------------------- |
| `--input`   | `-i`  | Input file patterns       | `-i "src/**/*.html"`   |
| `--output`  | `-o`  | Output CSS file path      | `-o "dist/styles.css"` |
| `--minify`  | `-m`  | Generate minified CSS     | `--minify`             |
| `--verbose` | `-v`  | Show detailed information | `--verbose`            |
| `--force`   | `-f`  | Clear cache and rebuild   | `--force`              |

## 📁 Configuration File

Create `zyracss.config.js` in your project root for custom defaults:

```js
// zyracss.config.js
export default {
  content: [
    "./src/**/*.html",
    "./pages/**/*.html",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  outputPath: "dist/styles.css",
  minify: false,
  groupSelectors: true,
  excludePatterns: ["**/node_modules/**", "**/dist/**"],
};
```

### Configuration Options

| Option            | Type       | Default                  | Description                               |
| ----------------- | ---------- | ------------------------ | ----------------------------------------- |
| `content`         | `string[]` | Auto-detected patterns   | File patterns to scan for ZyraCSS classes |
| `outputPath`      | `string`   | `"dist/styles.css"`      | Where to write the generated CSS          |
| `minify`          | `boolean`  | `false`                  | Minify the generated CSS                  |
| `groupSelectors`  | `boolean`  | `true`                   | Group identical CSS rules                 |
| `excludePatterns` | `string[]` | `["**/node_modules/**"]` | Patterns to exclude from scanning         |

## 🎯 Usage Examples

### Basic Static Site

```bash
# Project structure
my-site/
├── index.html
├── about.html
└── contact.html

# Generate CSS
zyracss build

# Output: dist/styles.css
```

### Custom Configuration

```bash
# Custom input and output
zyracss build -i "pages/**/*.html" -o "public/app.css" --minify
```

### Development Workflow

```bash
# Start watching during development
zyracss watch --verbose

# In another terminal, edit your HTML files
# CSS will be regenerated automatically
```

### Build Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "build": "zyracss build --minify",
    "dev": "zyracss watch --verbose",
    "clean": "zyracss build --force"
  }
}
```

## 🔍 Smart Content Detection

The CLI automatically detects common project patterns:

```js
// Default patterns (auto-detected)
[
  "./src/**/*.html", // Source HTML files
  "./*.html", // Root HTML files
  "./pages/**/*.html", // Pages directory
  "./components/**/*.{js,jsx,ts,tsx}", // Component files (if they exist)
];
```

### Custom Content Patterns

Override defaults in your config:

```js
// zyracss.config.js
export default {
  content: [
    // Include specific files
    "./index.html",
    "./src/pages/**/*.html",

    // Include JavaScript/TypeScript components
    "./src/components/**/*.{js,ts}",

    // Exclude test files
    "!./src/**/*.test.html",
    "!./src/**/*.spec.js",
  ],
};
```

## 🎨 ZyraCSS Syntax

Use ZyraCSS classes in your HTML:

```html
<!-- Basic utilities -->
<div class="bg-red-500 text-white p-4">Content</div>

<!-- Arbitrary values -->
<div class="bg-[#ff6b35] text-[18px] p-[12px]">Custom values</div>

<!-- Complex layouts -->
<div class="d-[grid] grid-template-columns-[1fr,2fr,1fr] gap-[20px]">
  Grid layout
</div>

<!-- URLs with u() function -->
<div class="background-image-[u(hero.jpg)] background-size-[cover]">
  Background image
</div>
```

## 📊 Output Examples

### Build Output

```bash
$ zyracss build --verbose

🎨 ZyraCSS CLI v0.1.0
📁 Input patterns: ["./src/**/*.html", "./*.html"]
📄 Output file: dist/styles.css
🔍 Found 3 HTML files to process
⚡ Extracted 15 unique ZyraCSS classes
📝 Generated 847 characters of CSS
✅ Build completed in 23ms
```

### Watch Output

```bash
$ zyracss watch --verbose

🎨 ZyraCSS CLI v0.1.0 - Watch Mode
👀 Watching: ["./src/**/*.html", "./*.html"]
📄 Output: dist/styles.css

🔄 Initial build...
✅ Generated CSS (15 classes, 847 chars) in 23ms

👀 Watching for changes... (Press Ctrl+C to stop)

📝 src/index.html changed
🔄 Rebuilding...
✅ Updated CSS (18 classes, 1.2KB) in 12ms
```

## 🔧 Advanced Usage

### Integration with Build Tools

```bash
# Use with npm scripts
npm run build

# Use with Makefile
make css

# Use with GitHub Actions
- run: npx zyracss build --minify
```

### Multiple Output Files

```bash
# Build different sections separately
zyracss build -i "src/pages/**/*.html" -o "dist/pages.css"
zyracss build -i "src/components/**/*.html" -o "dist/components.css"
```

### Performance Optimization

```bash
# For large projects, use specific patterns
zyracss build -i "src/critical/**/*.html" -o "dist/critical.css" --minify

# Exclude unnecessary directories
zyracss build -i "src/**/*.html" -i "!src/archive/**" -o "dist/app.css"
```

## 🛠️ Troubleshooting

### Common Issues

**CLI not found?**

```bash
# Make sure both packages are installed
npm install zyracss @zyracss/cli

# Check global installation
npm list -g @zyracss/cli
```

**No CSS generated?**

```bash
# Check your input patterns
zyracss build --verbose

# Make sure HTML files contain ZyraCSS classes
grep -r "class.*\[" src/
```

**Permission errors?**

```bash
# Make sure output directory exists and is writable
mkdir -p dist
chmod 755 dist
```

**Classes not found?**

```bash
# Use verbose mode to see what's being processed
zyracss build --verbose

# Check your file patterns match your structure
zyracss build -i "**/*.html" --verbose
```

### Debug Mode

Use verbose output to diagnose issues:

```bash
zyracss build --verbose
```

This shows:

- ✅ Input patterns being used
- ✅ Files being processed
- ✅ Classes being extracted
- ✅ CSS generation details
- ✅ Performance metrics

## 🏗️ Project Types

### Static HTML Sites

Perfect for:

- 🌐 Landing pages
- 📱 Portfolio sites
- 🏢 Business websites
- 📚 Documentation sites

```bash
# Simple setup
zyracss build
zyracss watch
```

### Legacy Projects

Ideal for:

- 🔧 Modernizing old sites
- 📈 Progressive enhancement
- 🎨 Adding utility CSS

```bash
# Custom patterns for legacy structure
zyracss build -i "templates/**/*.html" -o "assets/new-styles.css"
```

### Build Tool Integration

Works with:

- 📦 Webpack
- 🎯 Gulp
- 🏗️ Make
- 🚀 GitHub Actions

```bash
# In your build pipeline
zyracss build --minify --force
```

## 🤝 Related Packages

- [`zyracss`](../../README.md) - Core CSS generation engine
- [`@zyracss/vite`](../vite/README.md) - Vite plugin for build-time integration

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [Documentation](https://github.com/zyracssofficial/zyracss)
- [GitHub Repository](https://github.com/zyracssofficial/zyracss)
- [Report Issues](https://github.com/zyracssofficial/zyracss/issues)
- [NPM Package](https://www.npmjs.com/package/@zyracss/cli)
