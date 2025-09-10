import { useState, useMemo, useEffect } from "react";
import { zyraCSSManager } from "zyracss";

// Function to convert JSON design specifications to ZyraCSS classes
function jsonToZyraCSS(designSpec) {
  const classes = [];

  // Layout properties
  if (designSpec.layout) {
    const { display, width, height, padding, margin, gap } = designSpec.layout;
    if (display) classes.push(`d-[${display}]`);
    if (width) classes.push(`w-[${width}]`);
    if (height) classes.push(`h-[${height}]`);
    if (padding) classes.push(`p-[${padding}]`);
    if (margin) classes.push(`m-[${margin}]`);
    if (gap) classes.push(`gap-[${gap}]`);
  }

  // Typography properties
  if (designSpec.typography) {
    const { fontSize, fontWeight, color, textAlign, lineHeight } =
      designSpec.typography;
    if (fontSize) classes.push(`font-size-[${fontSize}]`);
    if (fontWeight) classes.push(`font-weight-[${fontWeight}]`);
    if (color) classes.push(`c-[${color}]`);
    if (textAlign) classes.push(`text-align-[${textAlign}]`);
    if (lineHeight) classes.push(`line-height-[${lineHeight}]`);
  }

  // Visual properties
  if (designSpec.visual) {
    const { backgroundColor, border, borderRadius, boxShadow, opacity } =
      designSpec.visual;
    if (backgroundColor) classes.push(`bg-[${backgroundColor}]`);
    if (border) classes.push(`border-[${border}]`);
    if (borderRadius) classes.push(`border-radius-[${borderRadius}]`);
    if (boxShadow) classes.push(`box-shadow-[${boxShadow}]`);
    if (opacity) classes.push(`opacity-[${opacity}]`);
  }

  // Interactive properties
  if (designSpec.interactive) {
    const { cursor, transition, transform } = designSpec.interactive;
    if (cursor) classes.push(`cursor-[${cursor}]`);
    if (transition) classes.push(`transition-[${transition}]`);
    if (transform) classes.push(`transform-[${transform}]`);
  }

  return classes;
}

// AI Component Generator - creates components from JSON
function AIGeneratedComponent({ designData, title }) {
  const [classes, setClasses] = useState("");

  useEffect(() => {
    const generatedClasses = jsonToZyraCSS(designData);
    const classString = generatedClasses.join(" ");
    zyraCSSManager.processClasses(generatedClasses);
    setClasses(classString);
  }, [designData]);

  return (
    <div className={classes}>
      {designData.type === "button" ? (
        // Render button without title/description
        <button className={classes}>{designData.content}</button>
      ) : (
        // Render other components with title/description
        <>
          <h3>{title}</h3>
          <p>This component was generated from JSON!</p>
          {designData.content && <div>{designData.content}</div>}
        </>
      )}
    </div>
  );
}

export default function AIJSONPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("card");
  const [customJSON, setCustomJSON] = useState("");
  const [jsonError, setJsonError] = useState("");

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
      "mb-[3rem]",
      "font-size-[1.25rem]",
      "font-weight-[600]",
      "c-[#374151]",
      "d-[grid]",
      "grid-template-columns-[repeat(2,1fr)]",
      "gap-[1rem]",
      "mb-[2rem]",
      "p-[1rem,1.5rem]",
      "border-[1px,solid,#d1d5db]",
      "border-radius-[0.5rem]",
      "cursor-[pointer]",
      "bg-[#3b82f6]",
      "c-[white]",
      "bg-[#f9fafb]",
      "c-[#374151]",
      "w-[100%]",
      "h-[200px]",
      "p-[1rem]",
      "font-family-[monospace]",
      "font-size-[0.875rem]",
      "border-[1px,solid,#e5e7eb]",
      "resize-[vertical]",
      "bg-[#10b981]",
      "bg-[#ef4444]",
      "text-align-[center]",
    ]);
  }, []);

  // Predefined AI/JSON templates
  const templates = {
    card: {
      layout: {
        display: "block",
        width: "300px",
        padding: "1.5rem",
        margin: "1rem",
      },
      visual: {
        backgroundColor: "#d4f1ff",
        border: "1px,solid,#e5e7eb",
        borderRadius: "0.75rem",
        boxShadow: "0,4px,6px,rgba(0,0,0,0.1)",
      },
      typography: {
        fontSize: "1rem",
        color: "#374151",
      },
      interactive: {
        cursor: "pointer",
        transition: "transform,0.2s,ease",
      },
      content: "Beautiful card component",
    },
    button: {
      layout: {
        display: "inline-flex",
        padding: "0.75rem,1.5rem",
      },
      visual: {
        backgroundColor: "#3b82f6",
        borderRadius: "0.5rem",
        border: "none",
      },
      typography: {
        fontSize: "1rem",
        fontWeight: "600",
        color: "white",
        textAlign: "center",
      },
      interactive: {
        cursor: "pointer",
        transition: "all,0.2s,ease",
      },
      content: "Click Me",
      type: "button", // Special type to render differently
    },
    alert: {
      layout: {
        display: "block",
        width: "100%",
        padding: "1rem,1.5rem",
        margin: "1rem,0",
      },
      visual: {
        backgroundColor: "#fef3c7",
        border: "1px,solid,#f59e0b",
        borderRadius: "0.5rem",
      },
      typography: {
        fontSize: "0.875rem",
        color: "#92400e",
      },
      content: "⚠️ This is an AI-generated alert component",
    },
    hero: {
      layout: {
        display: "block",
        width: "100%",
        height: "auto",
        padding: "3rem,2rem",
      },
      visual: {
        backgroundColor: "linear-gradient(135deg,#667eea,0%,#764ba2,100%)",
        borderRadius: "1rem",
      },
      typography: {
        fontSize: "2rem",
        fontWeight: "800",
        color: "white",
        textAlign: "center",
      },
      content: "🚀 AI-Powered Hero Section",
    },
  };

  // Parse custom JSON input
  const customDesign = useMemo(() => {
    if (!customJSON.trim()) return null;

    try {
      const parsed = JSON.parse(customJSON);
      setJsonError("");
      return parsed;
    } catch (error) {
      setJsonError(`Invalid JSON: ${error.message}`);
      return null;
    }
  }, [customJSON]);

  return (
    <div className="mx-[auto]">
      <header className="mb-[2rem]">
        <h1 className="font-size-[2rem] font-weight-[700] c-[#1e293b] mb-[1rem]">
          🤖 AI/JSON-driven CSS Use Case
        </h1>
        <p className="font-size-[1.125rem] c-[#64748b] line-height-[1.6]">
          Generate ZyraCSS classes from JSON design specifications - perfect for
          AI-powered design tools!
        </p>
      </header>

      {/* Template Selector */}
      <section className="mb-[3rem]">
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          Predefined Templates
        </h2>
        <div className="d-[grid] grid-template-columns-[repeat(2,1fr)] gap-[1rem] mb-[2rem]">
          {Object.keys(templates).map((templateName) => (
            <button
              key={templateName}
              className={`p-[1rem,1.5rem] border-radius-[0.5rem] cursor-[pointer] text-align-[center] ${
                selectedTemplate === templateName
                  ? "bg-[#3b82f6] c-[white]"
                  : "bg-[#f9fafb] c-[#374151] border-[1px,solid,#d1d5db]"
              }`}
              onClick={() => setSelectedTemplate(templateName)}
            >
              {templateName.charAt(0).toUpperCase() + templateName.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Generated Component Preview */}
      <section className="mb-[3rem]">
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          AI Generated Component
        </h2>
        <div className="p-[2rem] bg-[#f8fafc] border-[1px,solid,#e2e8f0] border-radius-[0.75rem] text-align-[center]">
          <AIGeneratedComponent
            designData={templates[selectedTemplate]}
            title={`AI ${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}`}
          />
        </div>
      </section>

      {/* JSON Structure Display */}
      <section className="mb-[3rem]">
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          JSON Design Specification
        </h2>
        <pre className="bg-[#1e293b] c-[#e2e8f0] p-[1.5rem] border-radius-[0.5rem] overflow-x-[auto] font-size-[0.875rem]">
          {JSON.stringify(templates[selectedTemplate], null, 2)}
        </pre>
      </section>

      {/* Implementation Guide */}
      <section className="mb-[3rem]">
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          Implementation Guide
        </h2>
        <div className="bg-[#f0fdf4] p-[1.5rem] border-[1px,solid,#10b981] border-radius-[0.5rem]">
          <h3 className="font-weight-[600] mb-[1rem] c-[#047857]">
            How to use JSON-driven styling:
          </h3>
          <ol className="list-style-[decimal] pl-[1.5rem] line-height-[1.8] c-[#065f46]">
            <li>
              Define your design in JSON format with layout, visual, typography,
              and interactive properties
            </li>
            <li>Use a function to convert JSON to ZyraCSS classes</li>
            <li>
              Use zyraCSSManager.processClasses() to generate CSS at runtime
            </li>
            <li>
              Perfect for AI design tools, content management systems, and
              dynamic UIs
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
