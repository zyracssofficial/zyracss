# ZyraCSS Hybrid Example

This example demonstrates **both build-time and runtime** ZyraCSS usage in a single application, showing how to optimize static styles while maintaining dynamic flexibility.

## What This Project Shows

- **Static Classes**: Layout and typography compiled at build-time for optimal performance
- **Dynamic Classes**: Theme colors and interactive states generated at runtime
- **Combined Approach**: Best of both worlds - performance + flexibility
- **Smart Implementation**: Static styles use Vite plugin, dynamic styles use runtime API

## How ZyraCSS is Implemented

1. **Build-Time (Vite Plugin)**:
   - Static classes in JSX are extracted during build
   - Layout, typography, and fixed styles compiled to CSS
   - Optimized bundle with pre-generated styles

2. **Runtime (JavaScript API)**:
   - Dynamic classes generated with `zyraCSSManager.processClasses()`
   - Theme colors, hover states, and interactive styles
   - CSS generated on-demand when state changes

3. **Hybrid Strategy**:
   - Use build-time for predictable, static styles
   - Use runtime for user interactions and dynamic theming

## Quick Start

```bash
npm install
npm run dev
```

Perfect for applications that need both performance optimization and dynamic styling capabilities.

// ⚡ RUNTIME: Dynamic theme classes (generated on-demand)

```jsx
const [dynamicTheme, setDynamicTheme] = useState("");

useEffect(() => {
  const classes = [
    `bg-[${theme.background}]`,
    `c-[${theme.text}]`,
    `border-[2px,solid,${isActive ? theme.active : theme.inactive}]`,
  ];

  zyraCSSManager.processClasses(classes);
  setDynamicTheme(classes.join(" "));
}, [theme, isActive]);

return (
  <div className={`${staticLayout} ${dynamicTheme}`}>Best of both worlds!</div>
);
```

## Benefits

### ✅ Performance

- **Static styles**: Zero runtime overhead
- **Dynamic styles**: Only generated when needed
- **Bundle size**: Optimized static CSS, minimal runtime code

### ✅ Developer Experience

- **Predictable**: Static styles work immediately
- **Flexible**: Dynamic styles respond to any state
- **Type-safe**: Full TypeScript support for both approaches

### ✅ Production Ready

- **Build optimization**: Static CSS minified and cached
- **Runtime efficiency**: Dynamic generation only when necessary
- **No auto-scanning**: Explicit usage prevents unexpected behavior

## When to Use Each Approach

### Use Build-time for:

- Layout patterns (flexbox, grid)
- Typography scales
- Design system colors
- Common spacing values
- Responsive breakpoints

### Use Runtime for:

- User theme preferences
- Interactive state changes
- Animation triggers
- Dynamic color calculations
- Conditional styling based on props/state

## Result

The hybrid approach gives you:

- **Fast initial load** (build-time optimization)
- **Dynamic interactivity** (runtime flexibility)
- **Best performance** (minimal runtime overhead)
- **Great DX** (predictable + flexible)

This is the recommended approach for production applications that need both performance and flexibility.

```

```
