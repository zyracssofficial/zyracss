# ZyraCSS Runtime - JSON Example

This example demonstrates **JSON-to-CSS transformation** where design specifications are converted to styled components in real-time.

## What This Shows

- **JSON to CSS Conversion**: Transform design objects into ZyraCSS utility classes
- **AI-Ready Architecture**: Perfect for AI-generated design specifications
- **Live JSON Editing**: Edit design specs and see instant visual changes
- **Component Generation**: Dynamic components styled from data specifications

## Key Features

- ✅ **Dynamic Style Generation**: CSS created from any JSON specification
- ✅ **AI/CMS Compatible**: Perfect for external design data sources
- ✅ **Real-time Updates**: Edit JSON and see instant style changes
- ✅ **Unlimited Flexibility**: Any CSS property can be specified in JSON

## How It Works

1. **Design Specifications**: JSON objects define colors, spacing, typography, etc.
2. **Conversion Function**: `designToClasses()` maps JSON properties to ZyraCSS classes
3. **Dynamic Processing**: CSS generated when JSON changes using `useEffect(() => {}, [spec])`
4. **Live Preview**: Components re-render with new styles instantly

## JSON Structure

```json
{
  "background": "#6366f1",
  "textColor": "#ffffff",
  "padding": "2rem",
  "borderRadius": "16px",
  "fontSize": "1.25rem",
  "boxShadow": "0,8px,25px,rgba(99,102,241,0.3)"
}
```

## Run This Example

```bash
npm install
npm run dev
```

Try editing the JSON specification and watch the component update instantly!

## Use Cases

- **AI Design Systems**: Let AI generate design specifications
- **CMS-Driven Styling**: Allow content creators to define component styles
- **User-Generated Themes**: Let users create custom component designs
- **Dynamic Branding**: Change brand styles across components from data

Perfect for understanding how ZyraCSS runtime enables truly data-driven styling that's impossible with static CSS frameworks.
