# ZyraCSS Runtime - Theme Switching Example

This example demonstrates **runtime theme switching** where complete design systems change instantly without page reloads.

## What This Shows

- **Instant Theme Changes**: Switch between Light, Dark, and Neon themes in real-time
- **Complete Color Systems**: Each theme has its own background, surface, text, and accent colors
- **Smooth Transitions**: CSS transitions make theme changes feel polished
- **Dynamic Style Generation**: New CSS rules generated for each theme's color combinations

## Key Features

- ✅ **Runtime Theme Generation**: Themes processed when selected, not pre-built
- ✅ **Complete Design Systems**: Each theme affects all UI elements consistently
- ✅ **Instant Switching**: No page reloads or loading states
- ✅ **Unlimited Themes**: Easy to add new themes with any color combinations

## How It Works

1. **Theme Objects**: Define color palettes as JavaScript objects
2. **Dynamic Processing**: Generate CSS when theme changes using `useEffect(() => {}, [currentTheme])`
3. **Template Literals**: Use theme colors in ZyraCSS classes: `bg-[${theme.primary}]`
4. **Automatic Application**: CSS automatically applied to all matching elements

## Run This Example

```bash
npm install
npm run dev
```

Try switching between themes and watch the entire interface transform instantly!

## Code Structure

- **App.jsx**: Main component with theme state and switching logic
- **Theme Objects**: Simple JavaScript objects defining color schemes
- **Dynamic Classes**: ZyraCSS classes using template literals for theme colors

Perfect for understanding how ZyraCSS runtime enables dynamic theming that's impossible with build-time CSS frameworks.
