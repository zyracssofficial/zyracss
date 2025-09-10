import { useState, useEffect } from "react";
import { zyraCSSManager } from "zyracss";

export default function DynamicCSSPage() {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [color, setColor] = useState("#3b82f6");
  const [buttonClassString, setButtonClassString] = useState("");
  const [counterClassString, setCounterClassString] = useState("");

  // Static layout classes
  useEffect(() => {
    zyraCSSManager.processClasses([
      "mx-[auto]",
      "mb-[2rem]",
      "font-size-[2rem]",
      "font-weight-[700]",
      "c-[#1e293b]",
      "mb-[1rem]",
      "font-size-[1.125rem]",
      "c-[#64748b]",
      "line-height-[1.6]",
      "d-[grid]",
      "grid-template-columns-[1fr,1fr]",
      "gap-[2rem]",
      "mb-[3rem]",
      "bg-[#ffffff]",
      "p-[2rem]",
      "border-radius-[0.75rem]",
      "border-[1px,solid,#e2e8f0]",
      "font-size-[1.25rem]",
      "font-weight-[600]",
      "c-[#374151]",
      "mb-[1.5rem]",
      "d-[flex]",
      "flex-wrap-[wrap]",
      "p-[1rem,2rem]",
      "border-[1px,solid,#64748b]",
      "bg-[transparent]",
      "c-[#64748b]",
      "border-radius-[0.5rem]",
      "cursor-[pointer]",
      "mb-[1rem]",
      "d-[block]",
      "mb-[0.5rem]",
      "w-[100%]",
      "font-size-[0.875rem]",
      "overflow-x-[auto]",
      "font-family-[monospace]",
      "m-[0]",
      "bg-[#1e293b]",
      "p-[1.5rem]",
    ]);
  }, []); // Static classes run once

  // Dynamic classes that change based on state
  useEffect(() => {
    const buttonClasses = [
      "p-[1rem,2rem]",
      "border-[none]",
      "border-radius-[0.5rem]",
      "font-weight-[600]",
      "cursor-[pointer]",
      "transition-[all,0.3s,ease]",
      `bg-[${color}]`,
      `c-[${isActive ? "#ffffff" : "#000000"}]`,
      `transform-[${isActive ? "scale(1.05)" : "scale(1)"}]`,
      `box-shadow-[0,${count > 5 ? "8" : "4"}px,${count > 5 ? "16" : "6"}px,rgba(0,0,0,0.1)]`,
    ];
    zyraCSSManager.processClasses(buttonClasses);
    setButtonClassString(buttonClasses.join(" "));
  }, [count, isActive, color]);

  useEffect(() => {
    const counterClasses = [
      "font-size-[2rem]",
      "font-weight-[700]",
      "text-align-[center]",
      "p-[1rem]",
      "border-radius-[0.5rem]",
      `c-[${count > 10 ? "#dc2626" : count > 5 ? "#f59e0b" : "#059669"}]`,
      `bg-[${count > 10 ? "#fef2f2" : count > 5 ? "#fffbeb" : "#f0fdf4"}]`,
      `border-[2px,solid,${count > 10 ? "#dc2626" : count > 5 ? "#f59e0b" : "#059669"}]`,
    ];
    zyraCSSManager.processClasses(counterClasses);
    setCounterClassString(counterClasses.join(" "));
  }, [count]);

  return (
    <div className="mx-[auto]">
      <header className="mb-[2rem]">
        <h1 className="font-size-[2rem] font-weight-[700] c-[#1e293b] mb-[1rem]">
          🔄 Dynamic CSS Use Case
        </h1>
        <p className="font-size-[1.125rem] c-[#64748b] line-height-[1.6]">
          CSS that changes based on component state - colors, sizes, animations
          respond to user interactions.
        </p>
      </header>

      <div className="d-[grid] grid-template-columns-[1fr,1fr] gap-[2rem] mb-[3rem]">
        {/* Interactive Demo */}
        <div className="bg-[#ffffff] p-[2rem] border-radius-[0.75rem] border-[1px,solid,#e2e8f0]">
          <h3 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1.5rem]">
            Interactive Demo
          </h3>

          <div
            className={counterClassString}
            style={{ marginBottom: "1.5rem" }}
          >
            Count: {count}
          </div>

          <div className="d-[flex] gap-[1rem] flex-wrap-[wrap] mb-[1.5rem]">
            <button
              className={buttonClassString}
              onClick={() => setCount(count + 1)}
            >
              Increment
            </button>

            <button
              className="p-[1rem,2rem] border-[1px,solid,#64748b] bg-[transparent] c-[#64748b] border-radius-[0.5rem] font-weight-[600] cursor-[pointer]"
              onClick={() => setCount(0)}
            >
              Reset
            </button>
          </div>

          <div className="mb-[1rem]">
            <label className="d-[block] font-weight-[600] c-[#374151] mb-[0.5rem]">
              Button Color:
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-[60px] h-[40px] border-[none] border-radius-[0.25rem] cursor-[pointer]"
            />
          </div>

          <label className="d-[flex] align-items-[center] gap-[0.5rem] cursor-[pointer]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span className="font-weight-[600] c-[#374151]">Active State</span>
          </label>
        </div>

        {/* Code Example */}
        <div className="bg-[#1e293b] p-[1.5rem] border-radius-[0.75rem]">
          <h4 className="c-[#e2e8f0] font-weight-[600] mb-[1rem]">
            Dynamic Hook Usage
          </h4>
          <pre className="c-[#e2e8f0] font-family-[monospace] font-size-[0.75rem] line-height-[1.4] m-[0] overflow-x-[auto]">
            {`// Button styles that change with state
useEffect(() => {
  const buttonClasses = [
    "p-[1rem,2rem]",
    "border-[none]",
    "border-radius-[0.5rem]",
    \`bg-[\${color}]\`,
    \`c-[\${isActive ? "#ffffff" : "#000000"}]\`,
    \`transform-[\${isActive ? "scale(1.05)" : "scale(1)"}]\`,
    \`box-shadow-[0,\${count > 5 ? "8" : "4"}px,\${count > 5 ? "16" : "6"}px,rgba(0,0,0,0.1)]\`
  ];
  zyraCSSManager.processClasses(buttonClasses);
  setButtonClassString(buttonClasses.join(" "));
}, [count, isActive, color]);

// Counter styles that change with count
useEffect(() => {
  const counterClasses = [
    "font-size-[2rem]",
    "font-weight-[700]",
    "text-align-[center]",
    "p-[1rem]",
    "border-radius-[0.5rem]",
    \`c-[\${count > 10 ? "#dc2626" : count > 5 ? "#f59e0b" : "#059669"}]\`,
    \`bg-[\${count > 10 ? "#fef2f2" : count > 5 ? "#fffbeb" : "#f0fdf4"}]\`,
    \`border-[2px,solid,\${count > 10 ? "#dc2626" : count > 5 ? "#f59e0b" : "#059669"}]\`
  ];
  zyraCSSManager.processClasses(counterClasses);
  setCounterClassString(counterClasses.join(" "));
}, [count]);

// CSS regenerates when dependencies change`}
          </pre>
        </div>
      </div>

      <section>
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          How Dynamic CSS Works
        </h2>
        <div className="bg-[#f8fafc] p-[1.5rem] border-radius-[0.5rem] border-[1px,solid,#e2e8f0]">
          <ul className="pl-[1.5rem] space-y-[0.75rem]">
            <li className="font-size-[0.875rem] c-[#374151] line-height-[1.6]">
              <strong>State changes</strong> → Dependencies array triggers
              re-evaluation
            </li>
            <li className="font-size-[0.875rem] c-[#374151] line-height-[1.6]">
              <strong>Classes recalculated</strong> → Function runs with new
              state values
            </li>
            <li className="font-size-[0.875rem] c-[#374151] line-height-[1.6]">
              <strong>New CSS generated</strong> → Only if classes actually
              changed
            </li>
            <li className="font-size-[0.875rem] c-[#374151] line-height-[1.6]">
              <strong>DOM updated</strong> → New styles injected, old ones stay
              cached
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
