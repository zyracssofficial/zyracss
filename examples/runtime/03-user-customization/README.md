# ZyraCSS Runtime - User Customization Example

This example demonstrates **user-driven customization** where users can modify interface styles in real-time with instant visual feedback.

## What This Shows

- **Color Customization**: Users pick primary, background, and text colors with color pickers
- **Spacing Controls**: Adjustable padding and spacing with range sliders
- **Typography Options**: Dynamic font size changes
- **Border Radius**: Customizable corner rounding
- **Live Preview**: Instant visual feedback as users make changes

## Key Features

- ✅ **Real-time Updates**: CSS generated instantly as users interact with controls
- ✅ **Infinite Possibilities**: Any color combination or size value can be applied
- ✅ **User-Driven**: Interface adapts to user preferences, not preset options
- ✅ **Visual Feedback**: Live preview shows exactly how changes will look

## How It Works

1. **User Interactions**: Color pickers, sliders, and inputs capture user preferences
2. **State Updates**: React state tracks all customization values
3. **Dynamic CSS**: Template literals use state values in ZyraCSS classes: `bg-[${userColor}]`
4. **Instant Application**: `useEffect` processes new CSS whenever preferences change

## Run This Example

```bash
npm install
npm run dev
```

Try adjusting the controls and watch the preview update instantly!

## Code Structure

- **App.jsx**: Main component with customization controls and live preview
- **State Management**: Simple React state for all user preferences
- **Dynamic Classes**: ZyraCSS classes using template literals for user values

Perfect for understanding how ZyraCSS runtime enables user customization interfaces that are impossible with static CSS frameworks.
