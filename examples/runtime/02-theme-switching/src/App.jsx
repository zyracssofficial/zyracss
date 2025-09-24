import { useState, useEffect } from "react";
import { zyra } from "zyracss";

const themes = {
  light: {
    name: "Light",
    background: "#ffffff",
    surface: "#f8fafc",
    borderColor: "#f8fafc",
    primary: "#3b82f6",
    text: "#1f2937",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    buttonText: "#ffffff",
  },
  dark: {
    name: "Dark",
    background: "#111827",
    surface: "#1f2937",
    borderColor: "#1f2937",
    primary: "#60a5fa",
    text: "#f9fafb",
    textSecondary: "#d1d5db",
    border: "#374151",
    buttonText: "#111827",
  },
  neon: {
    name: "Neon",
    background: "#0f0f23",
    surface: "#1a1a2e",
    borderColor: "#1a1a2e",
    primary: "#00f5ff",
    text: "#eee8ff",
    textSecondary: "#c4b5fd",
    border: "#6366f1",
    buttonText: "#0f0f23",
  },
};

function App() {
  const [currentTheme, setCurrentTheme] = useState("light");
  const theme = themes[currentTheme];

  // Process static layout styles once
  useEffect(() => {
    zyra.inject([
      "min-h-[100vh]",
      "p-[2rem]",
      "d-[flex]",
      "flex-direction-[column]",
      "align-items-[center]",
      "transition-[all,0.3s,ease]",
      "max-w-[800px]",
      "mx-[auto]",
      "font-size-[2.5rem]",
      "font-weight-[bold]",
      "mb-[1rem]",
      "text-align-[center]",
      "font-size-[1.125rem]",
      "mb-[2rem]",
      "line-height-[1.6]",
      "text-align-[center]",
      "d-[flex]",
      "gap-[0.75rem]",
      "gap-[1rem]",
      "flex-wrap-[wrap]",
      "justify-content-[center]",
      "mb-[2rem]",
      "p-[0.75rem,1.5rem]",
      "border-[none]",
      "border-radius-[8px]",
      "font-weight-[600]",
      "cursor-[pointer]",
      "transition-[all,0.2s,ease]",
      "border-radius-[12px]",
      "p-[2rem]",
      "box-shadow-[0,4px,6px,rgba(0,0,0,0.1)]",
      "mb-[1.5rem]",
      "d-[grid]",
      "grid-template-columns-[1fr,1fr]",
      "gap-[1.5rem]",
      "font-size-[1.25rem]",
      "font-weight-[600]",
      "mb-[1rem]",
      "font-size-[1rem]",
      "line-height-[1.5]",
      "opacity-[0.9]",
      "bg-[#374151]",
      "bg-[#6366f1]",
    ]);
  }, []);

  // Process theme-based dynamic styles
  useEffect(() => {
    const themeClasses = [
      // Background colors
      `bg-[${theme.background}]`,
      `bg-[${theme.surface}]`,
      `bg-[${theme.borderColor}]`,

      // Text colors
      `c-[${theme.text}]`,
      `c-[${theme.textSecondary}]`,

      // Border colors
      `border-[1px,solid,${theme.border}]`,

      // Button colors
      `bg-[${theme.primary}]`,
      `c-[${theme.buttonText}]`,

      // Hover states
      `hover:bg-[${theme.border}]`,
      `hover:c-[${theme.text}]`,
    ];

    zyra.inject(themeClasses);
  }, [currentTheme, theme]);

  const containerClass = `min-h-[100vh] bg-[${theme.background}] p-[2rem] d-[flex] flex-direction-[column] align-items-[center] transition-[all,0.3s,ease]`;

  const titleClass = `font-size-[2.5rem] font-weight-[bold] mb-[1rem] c-[${theme.text}] text-align-[center]`;

  const descriptionClass = `font-size-[1.125rem] mb-[2rem] c-[${theme.textSecondary}] line-height-[1.6] text-align-[center]`;

  const cardClass = `bg-[${theme.surface}] border-radius-[12px] p-[2rem] box-shadow-[0,4px,6px,rgba(0,0,0,0.1)] mb-[1.5rem] border-[1px,solid,${theme.border}]`;

  const activeButtonClass = `p-[0.75rem,1.5rem] border-[none] border-radius-[8px] font-weight-[600] cursor-[pointer] transition-[all,0.2s,ease] bg-[${theme.primary}] c-[${theme.buttonText}]`;

  const inactiveButtonClass = `p-[0.75rem,1.5rem] border-[none] border-radius-[8px] font-weight-[600] cursor-[pointer] transition-[all,0.2s,ease] bg-[${theme.border}] c-[${theme.text}] hover:bg-[${theme.primary}] hover:c-[${theme.buttonText}]`;

  return (
    <div className={containerClass}>
      <div className="max-w-[800px] mx-[auto]">
        <h1 className={titleClass}>ZyraCSS Theme Switching</h1>

        <p className={descriptionClass}>
          Experience instant theme changes powered by runtime CSS generation.
          Each theme uses completely different color schemes generated
          on-the-fly.
        </p>

        <div className="d-[flex] gap-[1rem] flex-wrap-[wrap] justify-content-[center] mb-[2rem]">
          {Object.entries(themes).map(([key, themeOption]) => (
            <button
              key={key}
              className={
                currentTheme === key ? activeButtonClass : inactiveButtonClass
              }
              onClick={() => setCurrentTheme(key)}
            >
              {themeOption.name}
            </button>
          ))}
        </div>

        <div className={cardClass}>
          <h2
            className={`font-size-[1.5rem] font-weight-[600] mb-[1rem] c-[${theme.text}]`}
          >
            Current Theme: {theme.name}
          </h2>

          <div className="d-[grid] grid-template-columns-[1fr,1fr] gap-[1.5rem]">
            <div>
              <h3
                className={`font-size-[1.25rem] font-weight-[600] mb-[1rem] c-[${theme.text}]`}
              >
                Theme Colors
              </h3>
              <div className="d-[flex] flex-direction-[column] gap-[0.75rem]">
                <div className={`font-size-[1rem] c-[${theme.textSecondary}]`}>
                  Background: {theme.background}
                </div>
                <div className={`font-size-[1rem] c-[${theme.textSecondary}]`}>
                  Card: {theme.surface}
                </div>
                <div className={`font-size-[1rem] c-[${theme.textSecondary}]`}>
                  Border Color: {theme.border}
                </div>
                <div className={`font-size-[1rem] c-[${theme.textSecondary}]`}>
                  Primary Color: {theme.primary}
                </div>
                <div className={`font-size-[1rem] c-[${theme.textSecondary}]`}>
                  Heading: {theme.text}
                </div>
                <div className={`font-size-[1rem] c-[${theme.textSecondary}]`}>
                  Content: {theme.textSecondary}
                </div>
              </div>
            </div>

            <div>
              <h3
                className={`font-size-[1.25rem] font-weight-[600] mb-[1rem] c-[${theme.text}]`}
              >
                Sample Content
              </h3>
              <p
                className={`font-size-[1rem] line-height-[1.5] c-[${theme.textSecondary}] opacity-[0.9]`}
              >
                Notice how all colors adapt seamlessly to maintain perfect
                readability and visual hierarchy. The theme system intelligently
                adjusts text colors, backgrounds, and borders to ensure optimal
                contrast and user experience across all visual modes. Experience
                the power of ZyraCSS runtime styling as it transforms your
                interface instantly with each theme selection.
              </p>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <p
            className={`font-size-[1rem] c-[${theme.textSecondary}] text-align-[center] opacity-[0.8]`}
          >
            Watch DevTools as you switch themes - see CSS being generated in
            real-time!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
