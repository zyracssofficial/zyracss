import { useState, useEffect } from "react";
import { zyraCSSManager } from "zyracss";

// Component that demonstrates conditional styling based on props
function Card({ variant, size, isActive, children, onClick }) {
  const [cardClassString, setCardClassString] = useState("");

  useEffect(() => {
    const baseClasses = [
      "p-[1.5rem]",
      "border-radius-[0.75rem]",
      "cursor-[pointer]",
      "transition-[all,0.3s,ease]",
      "border-[2px,solid,transparent]",
    ];

    // Conditional styling based on variant prop
    if (variant === "primary") {
      baseClasses.push("bg-[#3b82f6]", "c-[white]");
    } else if (variant === "secondary") {
      baseClasses.push("bg-[#6b7280]", "c-[white]");
    } else if (variant === "danger") {
      baseClasses.push("bg-[#ef4444]", "c-[white]");
    } else {
      baseClasses.push(
        "bg-[white]",
        "c-[#374151]",
        "border-[1px,solid,#e5e7eb]"
      );
    }

    // Conditional styling based on size prop
    if (size === "small") {
      baseClasses.push("p-[0.75rem]", "font-size-[0.875rem]");
    } else if (size === "large") {
      baseClasses.push("p-[2rem]", "font-size-[1.25rem]");
    }

    // Conditional styling based on active state
    if (isActive) {
      baseClasses.push(
        "border-[2px,solid,#10b981]",
        "box-shadow-[0,0,0,3px,rgba(16,185,129,0.1)]"
      );
    }

    zyraCSSManager.processClasses(baseClasses);
    setCardClassString(baseClasses.join(" "));
  }, [variant, size, isActive]);

  return (
    <div className={cardClassString} onClick={onClick}>
      {children}
    </div>
  );
}

export default function ConditionalCSSPage() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [userType, setUserType] = useState("guest");
  const [headerClassString, setHeaderClassString] = useState("");
  const [advancedSectionClassString, setAdvancedSectionClassString] =
    useState("");

  // Static layout classes (reduced set - common ones are pre-loaded)
  useEffect(() => {
    zyraCSSManager.processClasses([
      "grid-template-columns-[repeat(2,1fr)]",
      "bg-[#f9fafb]",
      "flex-direction-[column]",
      "bg-[#fef2f2]",
      "bg-[#eff6ff]",
      "hover:bg-[#f3f4f6]",
      "hover:scale-[1.02]",
      "active:scale-[0.98]",
      "transform-[scale(1)]",
      "box-shadow-[0,2px,4px,rgba(0,0,0,0.1)]",
      "hover:box-shadow-[0,4px,8px,rgba(0,0,0,0.15)]",
    ]);
  }, []);

  // Dynamic classes based on user type and state
  useEffect(() => {
    const baseClasses = ["mb-[2rem]", "p-[1.5rem]", "border-radius-[0.75rem]"];

    if (userType === "admin") {
      baseClasses.push("bg-[#dc2626]", "c-[white]");
    } else if (userType === "premium") {
      baseClasses.push("bg-[#7c3aed]", "c-[white]");
    } else {
      baseClasses.push("bg-[#f3f4f6]", "c-[#374151]");
    }

    zyraCSSManager.processClasses(baseClasses);
    setHeaderClassString(baseClasses.join(" "));
  }, [userType]);

  useEffect(() => {
    const advancedClasses = showAdvanced
      ? [
          "opacity-[1]",
          "max-h-[500px]",
          "transition-[all,0.3s,ease]",
          "mb-[2rem]",
        ]
      : [
          "opacity-[0.5]",
          "max-h-[100px]",
          "overflow-[hidden]",
          "transition-[all,0.3s,ease]",
          "mb-[2rem]",
        ];

    zyraCSSManager.processClasses(advancedClasses);
    setAdvancedSectionClassString(advancedClasses.join(" "));
  }, [showAdvanced]);

  return (
    <div className="mx-[auto]">
      {/* Header with user type conditional styling */}
      <div className={headerClassString}>
        <h1 className="font-size-[2rem] font-weight-[700] mb-[1rem]">
          🔀 Conditional CSS Use Case
        </h1>
        <p className="font-size-[1.125rem] line-height-[1.6]">
          CSS classes that change based on props, state, and conditions
        </p>
        <div className="font-size-[0.875rem] mt-[1rem]">
          Current User Type: <strong>{userType}</strong>
        </div>
      </div>

      {/* User Type Selector */}
      <section className="mb-[3rem]">
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          User Type (affects header styling)
        </h2>
        <div className="d-[flex] gap-[0.5rem] mb-[1rem]">
          {["guest", "premium", "admin"].map((type) => (
            <button
              key={type}
              className={`p-[0.5rem,1rem] border-radius-[0.25rem] cursor-[pointer] ${
                userType === type
                  ? "bg-[#3b82f6] c-[white]"
                  : "bg-[#f3f4f6] c-[#374151] border-[1px,solid,#d1d5db]"
              }`}
              onClick={() => setUserType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Card Variants */}
      <section className="mb-[3rem]">
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          Card Variants (prop-based styling)
        </h2>
        <div className="d-[grid] grid-template-columns-[repeat(2,1fr)] gap-[1rem] mb-[2rem]">
          <Card
            variant="primary"
            size="medium"
            isActive={selectedCard === "primary"}
            onClick={() =>
              setSelectedCard(selectedCard === "primary" ? null : "primary")
            }
          >
            <strong>Primary Card</strong>
            <div>Click to select</div>
          </Card>
          <Card
            variant="secondary"
            size="medium"
            isActive={selectedCard === "secondary"}
            onClick={() =>
              setSelectedCard(selectedCard === "secondary" ? null : "secondary")
            }
          >
            <strong>Secondary Card</strong>
            <div>Click to select</div>
          </Card>
          <Card
            variant="danger"
            size="small"
            isActive={selectedCard === "danger"}
            onClick={() =>
              setSelectedCard(selectedCard === "danger" ? null : "danger")
            }
          >
            <strong>Danger Card (Small)</strong>
            <div>Click to select</div>
          </Card>
          <Card
            variant="default"
            size="large"
            isActive={selectedCard === "default"}
            onClick={() =>
              setSelectedCard(selectedCard === "default" ? null : "default")
            }
          >
            <strong>Default Card (Large)</strong>
            <div>Click to select</div>
          </Card>
        </div>
        <div className="p-[1rem,1.5rem] bg-[#f9fafb] border-radius-[0.5rem] font-size-[0.875rem]">
          <strong>Selected:</strong> {selectedCard || "None"}
        </div>
      </section>

      {/* Advanced Section Toggle */}
      <section className={advancedSectionClassString}>
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          Advanced Features
        </h2>
        <button
          className="p-[0.5rem,1rem] bg-[#10b981] c-[white] border-radius-[0.25rem] cursor-[pointer] mb-[1rem]"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Hide" : "Show"} Advanced Section
        </button>
        {showAdvanced && (
          <div className="p-[1.5rem] bg-[white] border-[1px,solid,#e5e7eb] border-radius-[0.5rem]">
            <h3 className="font-weight-[600] mb-[1rem]">
              Conditional Features
            </h3>
            <ul className="list-style-[disc] pl-[1.5rem] line-height-[1.8]">
              <li>
                Card styling changes based on variant, size, and active state
              </li>
              <li>Header background changes based on user type</li>
              <li>This section animates based on show/hide state</li>
              <li>All transitions are handled by ZyraCSS classes</li>
            </ul>
          </div>
        )}
      </section>

      {/* Code Example */}
      <section className="mb-[3rem]">
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          Code Example
        </h2>
        <pre className="bg-[#1e293b] c-[#e2e8f0] p-[1.5rem] border-radius-[0.5rem] overflow-x-[auto] font-size-[0.875rem]">
          {`const [cardClasses, setCardClasses] = useState("");

useEffect(() => {
  const baseClasses = ["p-[1.5rem]", "border-radius-[0.75rem]"];

  // Conditional styling based on props
  if (variant === "primary") {
    baseClasses.push("bg-[#3b82f6]", "c-[white]");
  } else if (variant === "danger") {
    baseClasses.push("bg-[#ef4444]", "c-[white]");
  }

  // Conditional styling based on state
  if (isActive) {
    baseClasses.push("border-[2px,solid,#10b981]");
  }

  zyraCSSManager.processClasses(baseClasses);
  setCardClasses(baseClasses.join(" "));
}, [variant, isActive]);`}
        </pre>
      </section>
    </div>
  );
}
