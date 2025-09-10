import { useState, createContext, useContext, useEffect } from "react";
import { zyraCSSManager } from "../../../../src/index.js";

// Theme Context
const ThemeContext = createContext();

// Theme definitions
const themes = {
  light: {
    name: "Light Theme",
    colors: {
      primary: "#3b82f6",
      secondary: "#6b7280",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      accent: "#10b981",
      danger: "#ef4444",
    },
    spacing: {
      small: "0.5rem",
      medium: "1rem",
      large: "1.5rem",
      xlarge: "2rem",
    },
  },
  dark: {
    name: "Dark Theme",
    colors: {
      primary: "#60a5fa",
      secondary: "#9ca3af",
      background: "#111827",
      surface: "#1f2937",
      text: "#f9fafb",
      textSecondary: "#d1d5db",
      border: "#374151",
      accent: "#34d399",
      danger: "#f87171",
    },
    spacing: {
      small: "0.5rem",
      medium: "1rem",
      large: "1.5rem",
      xlarge: "2rem",
    },
  },
  neon: {
    name: "Neon Theme",
    colors: {
      primary: "#8b5cf6",
      secondary: "#a78bfa",
      background: "#0f0f23",
      surface: "#1a1a2e",
      text: "#eee8ff",
      textSecondary: "#c4b5fd",
      border: "#6366f1",
      accent: "#00f5ff",
      danger: "#ff006e",
    },
    spacing: {
      small: "0.75rem",
      medium: "1.25rem",
      large: "2rem",
      xlarge: "3rem",
    },
  },
  nature: {
    name: "Nature Theme",
    colors: {
      primary: "#059669",
      secondary: "#6b7280",
      background: "#f0fdf4",
      surface: "#dcfce7",
      text: "#064e3b",
      textSecondary: "#065f46",
      border: "#a7f3d0",
      accent: "#fbbf24",
      danger: "#dc2626",
    },
    spacing: {
      small: "0.5rem",
      medium: "1rem",
      large: "1.5rem",
      xlarge: "2rem",
    },
  },
};

// Theme Provider Component
function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState("light");

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider
      value={{ theme, currentTheme, setCurrentTheme, themes }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

// Themed Card Component
function ThemedCard({ title, children, variant = "default" }) {
  const { theme } = useTheme();
  const [cardClasses, setCardClasses] = useState("");

  useEffect(() => {
    const baseClasses = [
      "p-[1.5rem]",
      "border-radius-[0.75rem]",
      "border-[1px,solid," + theme.colors.border + "]",
      "transition-[all,0.3s,ease]",
    ];

    if (variant === "primary") {
      baseClasses.push("bg-[" + theme.colors.primary + "]", "c-[white]");
    } else if (variant === "surface") {
      baseClasses.push(
        "bg-[" + theme.colors.surface + "]",
        "c-[" + theme.colors.text + "]"
      );
    } else {
      baseClasses.push(
        "bg-[" + theme.colors.background + "]",
        "c-[" + theme.colors.text + "]"
      );
    }

    zyraCSSManager.processClasses(baseClasses);
    setCardClasses(baseClasses.join(" "));
  }, [theme, variant]);

  return (
    <div className={cardClasses}>
      {title && (
        <h3
          className={`font-weight-[600] mb-[${theme.spacing.medium}] c-[${variant === "primary" ? "white" : theme.colors.text}]`}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

// Themed Button Component
function ThemedButton({
  children,
  variant = "primary",
  onClick,
  size = "medium",
}) {
  const { theme } = useTheme();
  const [buttonClasses, setButtonClasses] = useState("");

  useEffect(() => {
    const baseClasses = [
      "border-radius-[0.5rem]",
      "cursor-[pointer]",
      "transition-[all,0.2s,ease]",
      "font-weight-[600]",
      "border-[none]",
    ];

    // Size variants
    if (size === "small") {
      baseClasses.push("p-[0.5rem,1rem]", "font-size-[0.875rem]");
    } else if (size === "large") {
      baseClasses.push("p-[1rem,2rem]", "font-size-[1.125rem]");
    } else {
      baseClasses.push("p-[0.75rem,1.5rem]", "font-size-[1rem]");
    }

    // Color variants
    if (variant === "primary") {
      baseClasses.push("bg-[" + theme.colors.primary + "]", "c-[white]");
    } else if (variant === "secondary") {
      baseClasses.push("bg-[" + theme.colors.secondary + "]", "c-[white]");
    } else if (variant === "accent") {
      baseClasses.push(
        "bg-[" + theme.colors.accent + "]",
        "c-[" + theme.colors.background + "]"
      );
    } else if (variant === "outline") {
      baseClasses.push(
        "bg-[transparent]",
        "c-[" + theme.colors.primary + "]",
        "border-[1px,solid," + theme.colors.primary + "]"
      );
    }

    zyraCSSManager.processClasses(baseClasses);
    setButtonClasses(baseClasses.join(" "));
  }, [theme, variant, size]);

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
}

// Main Component Content
function ThemeContent() {
  const { theme, currentTheme, setCurrentTheme, themes } = useTheme();
  const [showColorPalette, setShowColorPalette] = useState(false);

  // Static layout classes (reduced set - common ones are pre-loaded)
  useEffect(() => {
    zyraCSSManager.processClasses([
      "min-h-[100vh]",
      "flex-wrap-[wrap]",
      "grid-template-columns-[repeat(2,1fr)]",
      "text-transform-[uppercase]",
      "letter-spacing-[0.05em]",
      "d-[inline-block]",
      "border-radius-[50%]",
      "mr-[0.5rem]",
      "hover:scale-[1.1]",
      "transform-[scale(1)]",
      "active:scale-[0.95]",
      "vertical-align-[middle]",
    ]);
  }, []);

  // Dynamic background based on theme
  const [backgroundClasses, setBackgroundClasses] = useState("");

  useEffect(() => {
    const classes = [
      "bg-[" + theme.colors.background + "]",
      "c-[" + theme.colors.text + "]",
      "min-h-[100vh]",
      "transition-[all,0.3s,ease]",
      "p-[2rem]",
    ];

    zyraCSSManager.processClasses(classes);
    setBackgroundClasses(classes.join(" "));
  }, [theme]);

  return (
    <div className={backgroundClasses}>
      <div className="mx-[auto]">
        <header className="mb-[3rem]">
          <h1
            className={`font-size-[2rem] font-weight-[700] mb-[1rem] c-[${theme.colors.text}]`}
          >
            🎨 Theme Switching Use Case
          </h1>
          <p
            className={`font-size-[1.125rem] line-height-[1.6] c-[${theme.colors.textSecondary}]`}
          >
            Dynamic theme switching with ZyraCSS - watch the entire interface
            transform!
          </p>
          <div
            className={`p-[1rem] border-radius-[0.5rem] bg-[${theme.colors.surface}] mt-[1rem]`}
          >
            <strong>Current Theme:</strong> {theme.name}
          </div>
        </header>

        {/* Theme Selector */}
        <section className="mb-[3rem]">
          <h2
            className={`font-size-[1.25rem] font-weight-[600] mb-[1rem] c-[${theme.colors.text}]`}
          >
            Choose Your Theme
          </h2>
          <div className="d-[flex] flex-wrap-[wrap] gap-[1rem] mb-[2rem]">
            {Object.entries(themes).map(([key, themeData]) => (
              <ThemedButton
                key={key}
                variant={currentTheme === key ? "primary" : "outline"}
                onClick={() => setCurrentTheme(key)}
              >
                {themeData.name}
              </ThemedButton>
            ))}
          </div>
        </section>

        {/* Sample Components */}
        <section className="mb-[3rem]">
          <h2
            className={`font-size-[1.25rem] font-weight-[600] mb-[1rem] c-[${theme.colors.text}]`}
          >
            Themed Components
          </h2>
          <div className="d-[grid] grid-template-columns-[repeat(2,1fr)] gap-[1rem] mb-[2rem]">
            <ThemedCard title="Default Card" variant="default">
              <p className={`c-[${theme.colors.textSecondary}] mb-[1rem]`}>
                This card adapts to the current theme automatically.
              </p>
              <ThemedButton variant="accent" size="small">
                Learn More
              </ThemedButton>
            </ThemedCard>

            <ThemedCard title="Primary Card" variant="primary">
              <p className="c-[white] mb-[1rem] opacity-[0.9]">
                Primary variant with theme-aware styling.
              </p>
              <ThemedButton variant="outline" size="small">
                <span className="c-[white]">Action</span>
              </ThemedButton>
            </ThemedCard>

            <ThemedCard title="Surface Card" variant="surface">
              <p className={`c-[${theme.colors.textSecondary}] mb-[1rem]`}>
                Surface variant for elevated content.
              </p>
              <div className="d-[flex] gap-[0.5rem]">
                <ThemedButton variant="primary" size="small">
                  Save
                </ThemedButton>
                <ThemedButton variant="secondary" size="small">
                  Cancel
                </ThemedButton>
              </div>
            </ThemedCard>

            <ThemedCard title="Interactive Demo">
              <div className="d-[flex] flex-direction-[column] gap-[1rem]">
                <ThemedButton
                  variant="accent"
                  onClick={() => setShowColorPalette(!showColorPalette)}
                >
                  {showColorPalette ? "Hide" : "Show"} Color Palette
                </ThemedButton>
                {showColorPalette && (
                  <div className="d-[grid] grid-template-columns-[repeat(2,1fr)] gap-[0.5rem] p-[1rem] border-radius-[0.5rem] bg-[rgba(0,0,0,0.05)]">
                    {Object.entries(theme.colors).map(([name, color]) => (
                      <div
                        key={name}
                        className="d-[flex] align-items-[center] font-size-[0.75rem]"
                      >
                        <div
                          className="w-[20px] h-[20px] border-radius-[4px] mr-[0.5rem]"
                          style={{ backgroundColor: color }}
                        />
                        <span className={`c-[${theme.colors.textSecondary}]`}>
                          {name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ThemedCard>
          </div>
        </section>

        {/* Button Variants */}
        <section className="mb-[3rem]">
          <h2
            className={`font-size-[1.25rem] font-weight-[600] mb-[1rem] c-[${theme.colors.text}]`}
          >
            Button Variants
          </h2>
          <div className="d-[flex] flex-wrap-[wrap] gap-[1rem] mb-[2rem]">
            <ThemedButton variant="primary">Primary</ThemedButton>
            <ThemedButton variant="secondary">Secondary</ThemedButton>
            <ThemedButton variant="accent">Accent</ThemedButton>
            <ThemedButton variant="outline">Outline</ThemedButton>
          </div>
          <div className="d-[flex] flex-wrap-[wrap] gap-[1rem]">
            <ThemedButton variant="primary" size="small">
              Small
            </ThemedButton>
            <ThemedButton variant="primary" size="medium">
              Medium
            </ThemedButton>
            <ThemedButton variant="primary" size="large">
              Large
            </ThemedButton>
          </div>
        </section>

        {/* Implementation Code */}
        <section className="mb-[3rem]">
          <h2
            className={`font-size-[1.25rem] font-weight-[600] mb-[1rem] c-[${theme.colors.text}]`}
          >
            Implementation Example
          </h2>
          <ThemedCard>
            <pre
              className={`bg-[${theme.colors.surface}] c-[${theme.colors.text}] p-[1.5rem] border-radius-[0.5rem] overflow-x-[auto] font-size-[0.875rem] font-family-[monospace]`}
            >
              {`const [buttonClasses, setButtonClasses] = useState("");

useEffect(() => {
  const baseClasses = ["p-[0.75rem,1.5rem]", "border-radius-[0.5rem]"];

  // Theme-aware styling
  if (variant === "primary") {
    baseClasses.push(
      "bg-[" + theme.colors.primary + "]",
      "c-[white]"
    );
  }

  zyraCSSManager.processClasses(baseClasses);
  setButtonClasses(baseClasses.join(" "));
}, [theme, variant]);`}
            </pre>
          </ThemedCard>
        </section>

        {/* Theme Data Display */}
        <section className="mb-[3rem]">
          <h2
            className={`font-size-[1.25rem] font-weight-[600] mb-[1rem] c-[${theme.colors.text}]`}
          >
            Current Theme Data
          </h2>
          <ThemedCard>
            <pre
              className={`bg-[${theme.colors.surface}] c-[${theme.colors.text}] p-[1.5rem] border-radius-[0.5rem] overflow-x-[auto] font-size-[0.75rem] font-family-[monospace] line-height-[1.6]`}
            >
              {JSON.stringify(theme, null, 2)}
            </pre>
          </ThemedCard>
        </section>
      </div>
    </div>
  );
}

// Main exported component with Theme Provider
export default function ThemeSwitchingPage() {
  return (
    <ThemeProvider>
      <ThemeContent />
    </ThemeProvider>
  );
}
