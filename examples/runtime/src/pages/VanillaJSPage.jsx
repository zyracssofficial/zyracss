import { useEffect, useRef, useState } from "react";
import { zyraCSSManager } from "../../../../src/index.js";

export default function VanillaJSPage() {
  const [status, setStatus] = useState("Loading...");
  const [log, setLog] = useState([]);
  const containerRef = useRef(null);

  // Basic static classes
  useEffect(() => {
    zyraCSSManager.processClasses([
      "mx-[auto]",
      "p-[2rem]",
      "font-size-[2rem]",
      "font-weight-[700]",
      "c-[#1e293b]",
      "mb-[1rem]",
      "font-size-[1.125rem]",
      "c-[#64748b]",
      "line-height-[1.6]",
      "mb-[3rem]",
      "bg-[#f8fafc]",
      "p-[1.5rem]",
      "border-radius-[0.5rem]",
      "border-[1px,solid,#e2e8f0]",
      "bg-[#1e293b]",
      "c-[#e2e8f0]",
      "font-family-[monospace]",
      "font-size-[0.875rem]",
      "overflow-x-[auto]",
      "white-space-[pre-wrap]",
    ]);
  }, []);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLog((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    const initSimpleExample = async () => {
      try {
        addLog("Starting Vanilla JS example...");
        setStatus("Initializing...");

        if (!containerRef.current) {
          addLog("❌ Container ref not found");
          setStatus("Error: No container");
          return;
        }

        addLog("✅ Container found");

        // Import zyraCSSManager dynamically to catch import errors
        let zyraCSSManager;
        try {
          const module = await import(
            "../../../../src/api/core/browserManager.js"
          );
          zyraCSSManager = module.zyraCSSManager;
          addLog("✅ zyraCSSManager imported successfully");
        } catch (importError) {
          addLog(`❌ Failed to import zyraCSSManager: ${importError.message}`);
          setStatus("Error: Import failed");
          return;
        }

        // Create simple DOM content
        containerRef.current.innerHTML = `
          <div id="simple-example">
            <h3>🎯 Simple Vanilla JS Example</h3>
            <p>This is a basic example without complex operations.</p>
            <button id="test-button">Test Button</button>
            <div id="status-box">Ready</div>
          </div>
        `;
        addLog("✅ HTML content created");

        // Simple class array
        const testClasses = [
          "p-[1rem]",
          "bg-[#3b82f6]",
          "c-[white]",
          "border-radius-[0.5rem]",
        ];

        addLog("🔄 Processing classes...");
        await zyraCSSManager.processClasses(testClasses);
        addLog("✅ Classes processed successfully");

        // Apply classes to elements
        const exampleDiv = document.getElementById("simple-example");
        if (exampleDiv) {
          exampleDiv.className =
            "p-[2rem] bg-[#f0fdf4] border-[1px,solid,#10b981] border-radius-[0.75rem]";
          addLog("✅ Applied styles to example div");
        }

        const button = document.getElementById("test-button");
        if (button) {
          button.className = testClasses.join(" ");
          button.addEventListener("click", () => {
            addLog("🖱️ Button clicked!");
            const statusBox = document.getElementById("status-box");
            if (statusBox) {
              statusBox.textContent = "Button was clicked!";
              statusBox.className =
                "p-[1rem] bg-[#10b981] c-[white] border-radius-[0.25rem] mt-[1rem]";
            }
          });
          addLog("✅ Button styled and event listener added");
        }

        setStatus("✅ Success!");
        addLog("🎉 Simple example completed successfully!");
      } catch (error) {
        addLog(`❌ Error in initialization: ${error.message}`);
        addLog(`❌ Error stack: ${error.stack}`);
        setStatus(`❌ Error: ${error.message}`);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initSimpleExample();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      addLog("🧹 Cleanup completed");
    };
  }, []);

  return (
    <div className="mx-[auto] p-[2rem]">
      <header className="mb-[3rem]">
        <h1 className="font-size-[2rem] font-weight-[700] c-[#1e293b] mb-[1rem]">
          🌐 Vanilla JS Use Case
        </h1>
        <p className="font-size-[1.125rem] c-[#64748b] line-height-[1.6]">
          Using ZyraCSS without React - pure JavaScript with the zyraCSSManager
          API
        </p>
        <div className="bg-[#f8fafc] p-[1.5rem] border-radius-[0.5rem] border-[1px,solid,#e2e8f0] mt-[1rem]">
          <strong>Status:</strong> {status}
        </div>
      </header>

      <section className="mb-[3rem]">
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          📊 Debug Log
        </h2>
        <div className="bg-[#1e293b] c-[#e2e8f0] p-[1.5rem] border-radius-[0.5rem] font-family-[monospace] font-size-[0.875rem] overflow-x-[auto] white-space-[pre-wrap] min-h-[150px] max-h-[300px] overflow-y-[auto]">
          {log.join("\n") || "Waiting for logs..."}
        </div>
      </section>

      <section className="mb-[3rem]">
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          🎯 Vanilla JS Example
        </h2>
        <div
          ref={containerRef}
          className="border-[2px,dashed,#d1d5db] border-radius-[0.75rem] p-[2rem] min-h-[200px] bg-[#fafafa]"
        >
          Loading example...
        </div>
      </section>

      <section className="mb-[3rem]">
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          💻 Code Example
        </h2>
        <pre className="bg-[#1e293b] c-[#e2e8f0] p-[1.5rem] border-radius-[0.5rem] font-family-[monospace] font-size-[0.875rem] line-height-[1.6] overflow-x-[auto]">
          {`import { zyraCSSManager } from 'zyracss';

// Define your styles
const classes = ['p-[1rem]', 'bg-[#3b82f6]', 'c-[white]'];

// Process classes and apply to element
zyraCSSManager.processClasses(classes).then(() => {
  const element = document.getElementById('my-element');
  element.className = classes.join(' ');
});`}
        </pre>
      </section>
    </div>
  );
}
