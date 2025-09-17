import { useState, useEffect } from "react";
import { zyraCSSManager } from "zyracss";

function App() {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [buttonColor, setButtonColor] = useState("#376d5b");

  // Process static styles once
  useEffect(() => {
    zyraCSSManager.processClasses([
      "min-h-[100vh]",
      "bg-[#f8fafc]",
      "p-[2rem]",
      "d-[flex]",
      "flex-direction-[column]",
      "align-items-[center]",
      "max-w-[800px]",
      "mx-[auto]",
      "font-size-[2rem]",
      "font-weight-[bold]",
      "mb-[1rem]",
      "c-[#1e293b]",
      "font-size-[1rem]",
      "mb-[2rem]",
      "c-[#64748b]",
      "line-height-[1.6]",
      "text-align-[center]",
      "bg-[white]",
      "p-[2rem]",
      "border-radius-[12px]",
      "box-shadow-[0,4px,6px,rgba(0,0,0,0.1)]",
      "mb-[1.5rem]",
      "font-size-[2.5rem]",
      "font-weight-[bold]",
      "text-align-[center]",
      "d-[flex]",
      "gap-[1rem]",
      "flex-wrap-[wrap]",
      "justify-content-[center]",
      "p-[1rem,2rem]",
      "border-[none]",
      "border-radius-[8px]",
      "font-weight-[600]",
      "cursor-[pointer]",
      "transition-[all,0.3s,ease]",
      "font-size-[0.875rem]",
      "opacity-[0.8]",
      "ml-[0.5rem]",
      "font-family-[monospace]",
    ]);
  }, []);

  // Process dynamic styles when state changes
  useEffect(() => {
    const dynamicClasses = [
      // Dynamic counter color based on count
      `c-[${count > 10 ? "#dc2626" : count > 5 ? "#f59e0b" : "#059669"}]`,

      // Dynamic button background based on active state and custom color
      `bg-[${isActive ? buttonColor : "#64748b"}]`,
      `c-[white]`,

      // Dynamic transform based on active state
      `transform-[${isActive ? "scale(1.05)" : "scale(1)"}]`,

      // Dynamic box shadow based on count
      `box-shadow-[0,${count > 5 ? "8" : "4"}px,${count > 5 ? "16" : "8"}px,rgba(0,0,0,0.2)]`,
    ];

    zyraCSSManager.processClasses(dynamicClasses);
  }, [count, isActive, buttonColor]);

  const buttonClass = `p-[1rem,2rem] border-[none] border-radius-[8px] font-weight-[600] cursor-[pointer] transition-[all,0.3s,ease] bg-[${isActive ? buttonColor : "#64748b"}] c-[white] transform-[${isActive ? "scale(1.05)" : "scale(1)"}]`;

  const counterClass = `font-size-[2.5rem] font-weight-[bold] text-align-[center] c-[${count > 10 ? "#dc2626" : count > 5 ? "#f59e0b" : "#059669"}] mb-[1.5rem]`;

  return (
    <div className="min-h-[100vh] bg-[#f8fafc] p-[2rem] d-[flex] flex-direction-[column] align-items-[center] font-family-[monospace]">
      <div className="max-w-[800px] mx-[auto]">
        <h1 className="font-size-[2rem] font-weight-[bold] mb-[1rem] c-[#1e293b] text-align-[center]">
          ZyraCSS Dynamic Styles
        </h1>

        <p className="font-size-[1rem] mb-[2rem] c-[#64748b] line-height-[1.6] text-align-[center]">
          Watch how styles change in real-time based on component state. Colors,
          sizes, and transforms respond to your interactions. The button color
          picker works when the active state is enabled.
        </p>

        <div className="bg-[white] p-[2rem] border-radius-[12px] box-shadow-[0,4px,6px,rgba(0,0,0,0.1)]">
          <div className={counterClass}>Count: {count}</div>

          <div className="d-[flex] gap-[1rem] flex-wrap-[wrap] justify-content-[center] mb-[1.5rem]">
            <button className={buttonClass} onClick={() => setCount(count + 1)}>
              Increment
            </button>

            <button
              className="p-[1rem,2rem] border-[none] border-radius-[8px] font-weight-[600] cursor-[pointer] transition-[all,0.3s,ease] bg-[#e5e7eb] c-[#374151]"
              onClick={() => setCount(0)}
            >
              Reset
            </button>
          </div>

          <label className="d-[flex] align-items-[center] gap-[0.5rem] justify-content-[center] cursor-[pointer] mb-[1rem]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span className="font-weight-[600] c-[#374151]">Active State</span>
          </label>

          <div className="d-[flex] align-items-[center] gap-[0.5rem] justify-content-[center] mb-[1rem]">
            <label className="font-weight-[600] c-[#374151]">
              Button Color:
            </label>
            <input
              type="color"
              value={buttonColor}
              onChange={(e) => setButtonColor(e.target.value)}
              className="border-[none] border-radius-[4px] cursor-[pointer] w-[40px] h-[30px]"
            />
            <span className="font-size-[0.875rem] c-[#64748b] ml-[0.5rem]">
              {" "}
              (applies when active state is selected)
            </span>
          </div>

          <div className="mt-[2rem] p-[1rem] bg-[#f1f5f9] border-radius-[8px]">
            <p className="font-size-[0.875rem] c-[#64748b] opacity-[0.8] text-align-[center]">
              Open DevTools and watch the &lt;style data-zyracss&gt; element as
              you interact!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
