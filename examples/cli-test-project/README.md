# ZyraCSS CLI Test Project

This project demonstrates **CLI-based CSS generation** using the ZyraCSS command-line interface to process HTML files and generate static CSS.

## What This Project Shows

- **CLI Usage**: Generate CSS using the ZyraCSS command-line tool
- **HTML Processing**: Scan HTML files for ZyraCSS classes and compile them
- **Static Output**: Generate optimized CSS files for production use
- **Build Integration**: Perfect for non-JavaScript projects or build pipelines

## How ZyraCSS is Implemented

1. **CLI Command**: Uses `zyracss` command to process files
2. **File Scanning**: Analyzes HTML files for ZyraCSS class usage
3. **CSS Generation**: Compiles found classes into standard CSS
4. **Output File**: Generates `dist/styles.css` with optimized styles

## Usage Example

```bash
# Install ZyraCSS CLI globally
npm install zyracss @zyracss/cli

# Generate CSS from HTML files
zyracss --input "*.html" --output "dist/styles.css"
```

## Quick Start

1. Install ZyraCSS CLI
2. Run the command to generate CSS
3. Link the generated CSS file in your HTML
4. Open `index.html` in a browser

Perfect for static websites, legacy projects, or any HTML-based development workflow.
