# ZyraCSS Runtime - Dynamic CSS Example

This example demonstrates **state-driven CSS generation** where styles change in real-time based on component state.

## What This Shows

- **Dynamic Color Changes**: Counter color changes from green → yellow → red based on count value
- **Interactive Transforms**: Button scales up/down based on active state
- **Conditional Styling**: Box shadows and backgrounds respond to state changes
- **Real-time Updates**: CSS is generated instantly when state updates

## Key Features

- ✅ **Runtime CSS Generation**: No build-time scanning required
- ✅ **State-Responsive Styling**: Styles update automatically with state
- ✅ **Performance Optimized**: Only generates new CSS when state actually changes
- ✅ **Zero Configuration**: Works out of the box

## How It Works

1. **Static Styles**: Processed once on component mount using `useEffect(() => {}, [])`
2. **Dynamic Styles**: Processed when dependencies change using `useEffect(() => {}, [count, isActive])`
3. **Automatic Injection**: CSS is automatically injected into the page's `<head>`

## Run This Example

```bash
npm install
npm run dev
```

Open DevTools and watch the `<style data-zyracss>` element to see CSS being generated in real-time!

## Code Structure

- **App.jsx**: Main component with state-driven styling
- **Simple Setup**: No complex routing or layouts
- **Pure ZyraCSS**: Only utility classes, no custom CSS

Perfect for understanding how ZyraCSS runtime handles dynamic styling scenarios.
