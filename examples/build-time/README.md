# ZyraCSS Build-Time Example

This example demonstrates **build-time CSS generation** using the ZyraCSS Vite plugin. All ZyraCSS classes are extracted during build and compiled into optimized CSS.

## What This Project Shows

- **Static Class Usage**: ZyraCSS classes defined directly in JSX components
- **Build-Time Compilation**: CSS generated during the build process, not at runtime
- **Vite Plugin Integration**: Seamless integration with Vite build pipeline
- **Production Optimization**: Only used classes are included in final CSS bundle

## How ZyraCSS is Implemented

1. **Vite Plugin**: Configured in `vite.config.js` to scan source files for ZyraCSS classes
2. **CSS Import**: Uses `@import "zyracss"` directive in CSS that gets replaced with generated styles
3. **Static Classes**: All classes are statically defined in components (no runtime generation)
4. **Build Process**: Classes are extracted and compiled to CSS during `npm run build`

## Quick Start

```bash
npm install
npm run dev
```

Perfect for production applications where CSS can be determined at build time.

Use static ZyraCSS classes directly in your JSX:

```jsx
// ✅ Perfect for build-time scanning
<button className="p-[16px,32px] bg-[#3b82f6] c-[white] border-radius-[8px]">
  Click me
</button>

// ✅ Also works
<div className="d-[flex] justify-content-[center] gap-[20px]">
  Content
</div>
```

## 🎯 Best Practices for Build-Time

### ✅ **Do This (Static Classes)**

```jsx
// Static classes work perfectly
<div className="p-[20px] bg-[blue] c-[white]">Static</div>

// Multiple static classes
<button className="p-[12px,24px] border-radius-[6px] font-weight-[600] bg-[#3b82f6] c-[white]">
  Button
</button>

// Conditional but still static
<div className={isActive ? "bg-[green]" : "bg-[gray]"}>
  Conditional
</div>

// Object-based static selection
const sizeClasses = {
  small: "p-[8px,16px] font-size-[14px]",
  large: "p-[16px,32px] font-size-[18px]"
};
<button className={sizeClasses[size]}>Button</button>
```

### 🎨 **Advanced Static Patterns**

```jsx
// Component with variant system
const Button = ({ variant, size }) => {
  const variants = {
    primary: "bg-[#3b82f6] c-[white] hover:bg-[#2563eb]",
    secondary: "bg-[white] c-[#3b82f6] border-[1px,solid,#3b82f6]",
  };

  const sizes = {
    sm: "p-[8px,16px] font-size-[14px]",
    lg: "p-[16px,32px] font-size-[18px]",
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} border-radius-[6px]`}
    >
      Click me
    </button>
  );
};

// Layout system with static classes
<div className="d-[grid] grid-template-columns-[1fr,1fr,1fr] gap-[24px]">
  <div className="bg-[white] p-[24px] border-radius-[12px] box-shadow-[0,4px,6px,-1px,rgba(0,0,0,0.1)]">
    Card 1
  </div>
</div>;
```

## 🏗️ Build Process

1. **Development**: Vite plugin scans files for ZyraCSS classes
2. **CSS Generation**: Found classes are converted to CSS
3. **Injection**: Generated CSS replaces `@import "zyracss"` in your CSS file
4. **Build**: Final bundle contains only the CSS you actually use

## 📊 Benefits

- **🚀 Zero Runtime Overhead**: No JavaScript needed in browser
- **📦 Smaller Bundles**: Only CSS for used classes
- **⚡ Better Performance**: CSS is pre-generated
- **🛠️ Build-Time Optimization**: CSS is minified and optimized

## 🔧 Configuration Options

Create `zyracss.config.js` for advanced settings:

```js
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./pages/**/*.{js,jsx,ts,tsx,html}",
  ],
  output: "inline", // 'inline' | 'file'
  outputPath: "dist/zyracss.css", // if output: 'file'
  minify: true,
  groupSelectors: true,
};
```

This CSS is automatically injected into your stylesheet at build time!
