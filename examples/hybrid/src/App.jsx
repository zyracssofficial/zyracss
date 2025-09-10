import { useState, useEffect } from "react";
import { zyraCSSManager } from "../../../src/index.js";

function App() {
  // STATE: App state for dynamic styling
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState("blue");
  const [isHovered, setIsHovered] = useState(false);

  // DYNAMIC STYLING: Counter display (RUNTIME)
  const [counterClasses, setCounterClasses] = useState("");

  useEffect(() => {
    const classes = [
      "font-size-[3rem]",
      "font-weight-[700]",
      "text-align-[center]",
      "p-[2rem]",
      "border-radius-[1rem]",
      `c-[${count > 20 ? "#dc2626" : count > 10 ? "#f59e0b" : "#10b981"}]`,
      `bg-[${count > 20 ? "#fef2f2" : count > 10 ? "#fffbeb" : "#f0fdf4"}]`,
      `border-[3px,solid,${count > 20 ? "#dc2626" : count > 10 ? "#f59e0b" : "#10b981"}]`,
      `transform-[${count > 0 ? "rotate(2deg)" : "rotate(0deg)"}]`,
      "transition-[all,0.5s,ease]",
    ];

    zyraCSSManager.processClasses(classes);
    setCounterClasses(classes.join(" "));
  }, [count]);

  // Dynamic theme-based styling (RUNTIME)
  const [buttonClasses, setButtonClasses] = useState("");

  useEffect(() => {
    const colors = {
      blue: { bg: "#3b82f6", hover: "#2563eb", text: "#ffffff" },
      green: { bg: "#10b981", hover: "#059669", text: "#ffffff" },
      purple: { bg: "#8b5cf6", hover: "#7c3aed", text: "#ffffff" },
      red: { bg: "#ef4444", hover: "#dc2626", text: "#ffffff" },
    };

    const currentColor = colors[theme];
    const classes = [
      "p-[1rem,2rem]",
      "border-[none]",
      "border-radius-[0.5rem]",
      "font-weight-[600]",
      "cursor-[pointer]",
      "transition-[all,0.3s,ease]",
      `bg-[${isHovered ? currentColor.hover : currentColor.bg}]`,
      `c-[${currentColor.text}]`,
      `transform-[${isHovered ? "scale(1.05)" : "scale(1)"}]`,
      "box-shadow-[0,4px,6px,rgba(0,0,0,0.1)]",
    ];

    zyraCSSManager.processClasses(classes);
    setButtonClasses(classes.join(" "));
  }, [theme, isHovered, count]);

  return (
    <div className="max-w-[800px] mx-[auto] p-[2rem]">
      {/* Header - BUILD-TIME: Static layout classes */}
      <header className="text-align-[center] mb-[2rem]">
        <h1 className="font-size-[2rem] font-weight-[700] c-[#1e293b] mb-[1rem]">
          🏗️ Hybrid ZyraCSS Demo
        </h1>

        <p className="font-size-[1rem] c-[#64748b] mb-[2rem]">
          Combining build-time optimization with runtime flexibility
        </p>

        <div className="d-[grid] grid-template-columns-[1fr,1fr] gap-[2rem] mb-[2rem]">
          <div className="text-align-[left]">
            <h3 className="font-weight-[600] c-[#10b981] mb-[0.5rem]">
              ⚡ Build-time
            </h3>
            <p className="font-size-[0.875rem] c-[#64748b]">
              Layout, typography, spacing - pre-generated for optimal
              performance
            </p>
          </div>
          <div className="text-align-[left]">
            <h3 className="font-weight-[600] c-[#3b82f6] mb-[0.5rem]">
              🔄 Runtime
            </h3>
            <p className="font-size-[0.875rem] c-[#64748b]">
              Theme colors, animations, state-based styles generated on-demand
            </p>
          </div>
        </div>
      </header>

      <main className="d-[flex] flex-direction-[column] align-items-[center] gap-[2rem]">
        {/* Counter Display - HYBRID: static layout + dynamic colors */}
        <div className={counterClasses}>{count}</div>

        {/* Interactive Button - HYBRID: static base + dynamic theme */}
        <button
          className={buttonClasses}
          onClick={() => setCount(count + 1)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Increment Counter
        </button>

        {/* Theme Selector Buttons - BUILD-TIME: All static classes */}
        <div className="d-[flex] gap-[1rem]">
          {["blue", "green", "purple", "red"].map((color) => (
            <button
              key={color}
              onClick={() => setTheme(color)}
              className={
                theme === color
                  ? "p-[0.75rem,1.5rem] border-radius-[0.5rem] font-weight-[600] cursor-[pointer] transition-[all,0.2s,ease] text-transform-[capitalize] bg-[#1e293b] c-[#ffffff]"
                  : "p-[0.75rem,1.5rem] border-radius-[0.5rem] font-weight-[600] cursor-[pointer] transition-[all,0.2s,ease] text-transform-[capitalize] bg-[#ffffff] c-[#64748b] border-[1px,solid,#e2e8f0] hover:border-[#cbd5e1]"
              }
            >
              {color}
            </button>
          ))}
        </div>

        {/* Reset Button - BUILD-TIME: All static */}
        <button
          onClick={() => {
            setCount(0);
            setTheme("blue");
          }}
          className="p-[0.5rem,1rem] border-[1px,solid,#dc2626] border-radius-[0.25rem] bg-[#ffffff] c-[#dc2626] font-size-[0.875rem] cursor-[pointer] transition-[all,0.2s,ease] hover:bg-[#dc2626] hover:c-[#ffffff]"
        >
          Reset All
        </button>

        {/* Info Panel - BUILD-TIME: All static layout */}
        <div className="bg-[#f8fafc] border-[1px,solid,#e2e8f0] border-radius-[0.5rem] p-[1.5rem] w-[100%] mt-[2rem]">
          <h3 className="font-weight-[600] c-[#1e293b] mb-[1rem]">
            How it works:
          </h3>
          <ul className="c-[#64748b] font-size-[0.875rem]">
            <li className="mb-[0.5rem]">
              <strong>Build-time CSS:</strong> Layout classes like{" "}
              <code className="bg-[#e2e8f0] p-[0.25rem] border-radius-[0.25rem]">
                d-[flex]
              </code>
              ,{" "}
              <code className="bg-[#e2e8f0] p-[0.25rem] border-radius-[0.25rem]">
                p-[2rem]
              </code>{" "}
              are pre-generated
            </li>
            <li className="mb-[0.5rem]">
              <strong>Runtime CSS:</strong> Dynamic colors like{" "}
              <code className="bg-[#e2e8f0] p-[0.25rem] border-radius-[0.25rem]">
                bg-[theme.color]
              </code>{" "}
              are generated on-demand
            </li>
            <li>
              <strong>Result:</strong> Optimal performance with maximum
              flexibility
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
