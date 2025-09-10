# ZyraCSS Runtime Examples

This example project showcases **runtime CSS generation** with ZyraCSS, demonstrating different use cases where CSS is generated dynamically in the browser.

## What This Project Shows

- **Dynamic CSS Generation**: CSS created on-demand based on component state
- **Real-time Updates**: Styles that change instantly as users interact
- **Runtime Flexibility**: Perfect for user customization and interactive UIs
- **Multiple Use Cases**: 8 practical examples of runtime CSS patterns

## How ZyraCSS is Implemented

1. **Runtime API**: Uses `zyraCSSManager.processClasses()` to generate CSS dynamically
2. **React Integration**: useEffect hooks trigger CSS generation when state changes
3. **Browser-Based**: All CSS generation happens in the browser, no build step required
4. **Interactive Patterns**: Covers themes, user preferences, AI-driven styling, and more

## Included Use Cases

1. **Static CSS** - Basic runtime CSS generation
2. **Dynamic CSS** - Styles that change with component state
3. **Conditional CSS** - CSS based on user roles and conditions
4. **AI/JSON-driven CSS** - Generate styles from JSON specifications
5. **Theme Switching** - Runtime theme changes with smooth transitions
6. **User Customization** - Let users customize appearance with live preview
7. **Vanilla JS Usage** - Using ZyraCSS without React

## Quick Start

```bash
npm install
npm run dev
```

Perfect for applications with dynamic theming, user customization, or AI-powered styling.
