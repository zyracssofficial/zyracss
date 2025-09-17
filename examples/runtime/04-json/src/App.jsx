import { useState, useEffect } from "react";
import { zyraCSSManager } from "zyracss";

// Sample design specifications (could come from AI, API, or user input)
const designSpecs = {
  heroCard: {
    background: "#6366f1",
    textColor: "#ffffff",
    padding: "2rem",
    borderRadius: "16px",
    fontSize: "1rem",
    boxShadow: "0,8px,25px,rgba(99,102,241,0.3)",
  },
  warningCard: {
    background: "#fbbf24",
    textColor: "#92400e",
    padding: "1.5rem",
    borderRadius: "8px",
    fontSize: "1rem",
    boxShadow: "0,4px,12px,rgba(251,191,36,0.2)",
  },
  successCard: {
    background: "#10b981",
    textColor: "#ffffff",
    padding: "1.5rem",
    borderRadius: "12px",
    fontSize: "1.125rem",
    boxShadow: "0,6px,20px,rgba(16,185,129,0.25)",
  },
  dangerCard: {
    background: "#ef4444",
    textColor: "#ffffff",
    padding: "1.5rem",
    borderRadius: "8px",
    fontSize: "1rem",
    boxShadow: "0,4px,15px,rgba(239,68,68,0.3)",
  },
};

// Function to convert design spec to ZyraCSS classes
function designToClasses(spec) {
  return [
    `bg-[${spec.background}]`,
    `c-[${spec.textColor}]`,
    `p-[${spec.padding}]`,
    `border-radius-[${spec.borderRadius}]`,
    `font-size-[${spec.fontSize}]`,
    `box-shadow-[${spec.boxShadow}]`,
  ];
}

// Dynamic component that renders based on JSON specification
function AIGeneratedCard({ spec, title, content }) {
  const [classes, setClasses] = useState("");

  useEffect(() => {
    const generatedClasses = designToClasses(spec);
    zyraCSSManager.processClasses(generatedClasses);
    setClasses(generatedClasses.join(" "));
  }, [spec]);

  return (
    <div className={`${classes} transition-[all,0.3s,ease] mb-[1rem]`}>
      <h3 className="font-weight-[600] mb-[0.5rem]">{title}</h3>
      <p className="opacity-[0.9] line-height-[1.5]">{content}</p>
    </div>
  );
}

function App() {
  const [selectedSpec, setSelectedSpec] = useState("heroCard");
  const [customJSON, setCustomJSON] = useState(
    JSON.stringify(designSpecs.heroCard, null, 2)
  );
  const [parsedSpec, setParsedSpec] = useState(designSpecs.heroCard);
  const [jsonError, setJsonError] = useState("");

  // Process static layout styles once
  useEffect(() => {
    zyraCSSManager.processClasses([
      "min-h-[100vh]",
      "bg-[#f8fafc]",
      "p-[2rem]",
      "max-w-[1200px]",
      "mx-[auto]",
      "font-size-[2rem]",
      "font-weight-[bold]",
      "mb-[1rem]",
      "c-[#1e293b]",
      "text-align-[center]",
      "font-size-[1.125rem]",
      "mb-[2rem]",
      "c-[#64748b]",
      "line-height-[1.6]",
      "text-align-[center]",
      "d-[grid]",
      "grid-template-columns-[1fr,1fr]",
      "gap-[2rem]",
      "bg-[white]",
      "p-[1.5rem]",
      "border-radius-[12px]",
      "box-shadow-[0,4px,6px,rgba(0,0,0,0.1)]",
      "border-[1px,solid,#e5e7eb]",
      "font-size-[1.25rem]",
      "font-weight-[600]",
      "mb-[1.5rem]",
      "c-[#374151]",
      "d-[flex]",
      "gap-[0.5rem]",
      "flex-wrap-[wrap]",
      "mb-[1rem]",
      "p-[0.5rem,1rem]",
      "border-[none]",
      "border-radius-[6px]",
      "font-size-[0.875rem]",
      "cursor-[pointer]",
      "transition-[all,0.2s,ease]",
      "bg-[#e5e7eb]",
      "c-[#374151]",
      "bg-[#3b82f6]",
      "c-[white]",
      "w-[100%]",
      "h-[200px]",
      "p-[1rem]",
      "border-[1px,solid,#d1d5db]",
      "border-radius-[8px]",
      "font-family-[monospace]",
      "font-size-[0.875rem]",
      "resize-[vertical]",
      "c-[#dc2626]",
      "font-size-[0.875rem]",
      "mb-[1rem]",
      "font-weight-[600]",
      "hover:opacity-[0.9]",
      "opacity-[0.8]",
      "font-family-[monospace]",
      "box-sizing-[border-box]",
    ]);
  }, []);

  // Handle JSON input changes
  const handleJSONChange = (value) => {
    setCustomJSON(value);
    try {
      const parsed = JSON.parse(value);
      setParsedSpec(parsed);
      setJsonError("");
    } catch (error) {
      setJsonError("Invalid JSON format");
    }
  };

  // Handle preset selection
  const handlePresetChange = (presetKey) => {
    setSelectedSpec(presetKey);
    const spec = designSpecs[presetKey];
    setCustomJSON(JSON.stringify(spec, null, 2));
    setParsedSpec(spec);
    setJsonError("");
  };

  return (
    <div className="min-h-[100vh] bg-[#f8fafc] p-[2rem] font-family-[monospace]">
      <div className="max-w-[1200px] mx-[auto]">
        <h1 className="font-size-[2rem] font-weight-[bold] mb-[1rem] c-[#1e293b] text-align-[center]">
          ZyraCSS JSON Example
        </h1>

        <p className="font-size-[1.125rem] mb-[2rem] c-[#64748b] line-height-[1.6] text-align-[center]">
          Transform JSON design specifications into styled components instantly.
        </p>

        <div className="d-[grid] grid-template-columns-[1fr,1fr] gap-[2rem]">
          {/* JSON Editor Panel */}
          <div className="bg-[white] p-[1.5rem] border-radius-[12px] box-shadow-[0,4px,6px,rgba(0,0,0,0.1)] border-[1px,solid,#e5e7eb]">
            <h2 className="font-size-[1.25rem] font-weight-[600] mb-[1.5rem] c-[#374151]">
              Design Specification
            </h2>

            <div className="d-[flex] gap-[0.5rem] flex-wrap-[wrap] mb-[1rem]">
              {Object.keys(designSpecs).map((key) => (
                <button
                  key={key}
                  className={
                    selectedSpec === key
                      ? "p-[0.5rem,1rem] border-[none] border-radius-[6px] font-size-[0.875rem] cursor-[pointer] transition-[all,0.2s,ease] bg-[#3b82f6] c-[white]"
                      : "p-[0.5rem,1rem] border-[none] border-radius-[6px] font-size-[0.875rem] cursor-[pointer] transition-[all,0.2s,ease] bg-[#e5e7eb] c-[#374151] hover:opacity-[0.9]"
                  }
                  onClick={() => handlePresetChange(key)}
                >
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </button>
              ))}
            </div>
            <textarea
              value={customJSON}
              onChange={(e) => handleJSONChange(e.target.value)}
              className="w-[100%] h-[200px] p-[1rem] border-[1px,solid,#d1d5db] border-radius-[8px] font-family-[monospace] font-size-[0.875rem] resize-[vertical] box-sizing-[border-box]"
              placeholder="Edit JSON specification..."
            />

            {jsonError && (
              <p className="c-[#dc2626] font-size-[0.875rem] mb-[1rem]">
                {jsonError}
              </p>
            )}

            <div className="mt-[1rem] p-[1rem] bg-[#f1f5f9] border-radius-[8px]">
              <p className="font-size-[0.875rem] c-[#64748b] opacity-[0.8]">
                💡 Edit the values in the JSON code above to see instant style
                changes.
              </p>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="bg-[white] p-[1.5rem] border-radius-[12px] box-shadow-[0,4px,6px,rgba(0,0,0,0.1)] border-[1px,solid,#e5e7eb]">
            <h2 className="font-size-[1.25rem] font-weight-[600] mb-[1.5rem] c-[#374151]">
              Generated Component
            </h2>

            <AIGeneratedCard
              spec={parsedSpec}
              title="AI-Generated Card"
              content="This card was styled using the JSON specification on the left. Every property in the JSON translates to ZyraCSS utility classes, creating truly dynamic styling possibilities."
            />

            <div className="mt-[1rem] p-[1rem] bg-[#f8fafc] border-radius-[8px] border-[1px,solid,#e5e7eb]">
              <h3 className="font-weight-[600] mb-[0.5rem] c-[#374151]">
                Generated Classes:
              </h3>
              <div className="font-family-[monospace] font-size-[0.75rem] c-[#64748b] line-height-[1.4]">
                {designToClasses(parsedSpec).map((className, index) => (
                  <div key={index}>{className}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
