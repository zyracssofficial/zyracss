import { useEffect, useState } from "react";
import { zyraCSSManager } from "zyracss";

export default function HomePage() {
  const [zyraStatus, setZyraStatus] = useState("checking...");

  // Apply page styles for all className elements
  useEffect(() => {
    zyraCSSManager.processClasses([
      "mx-[auto]",
      "mb-[2rem]",
      "p-[1rem]",
      "border-radius-[0.5rem]",
      "bg-[#f1f5f9]",
      "border-[1px,solid,#cbd5e1]",
      "font-size-[1rem]",
      "font-weight-[600]",
      "c-[#1e293b]",
      "mb-[0.5rem]",
      "font-size-[0.875rem]",
      "c-[#64748b]",
      "m-[0]",
      "mb-[3rem]",
      "font-size-[2.5rem]",
      "font-weight-[800]",
      "mb-[1rem]",
      "line-height-[1.2]",
      "font-size-[1.125rem]",
      "line-height-[1.6]",
      "font-size-[1.5rem]",
      "d-[grid]",
      "grid-template-columns-[repeat(2,1fr)]",
      "gap-[1.5rem]",
      "bg-[#ffffff]",
      "p-[1.5rem]",
      "border-radius-[0.75rem]",
      "border-[1px,solid,#e2e8f0]",
      "shadow-[0,1px,3px,rgba(0,0,0,0.1)]",
      "c-[#3b82f6]",
      "line-height-[1.5]",
    ]);
  }, []);

  // Check if ZyraCSS is working by looking for the style element
  useEffect(() => {
    const checkZyraCSS = () => {
      const styleElement = document.querySelector("style[data-zyracss]");
      if (styleElement) {
        const cssContent = styleElement.textContent || styleElement.innerHTML;
        if (cssContent.trim().length > 0) {
          const ruleCount = cssContent.split("{").length - 1;
          setZyraStatus(
            `✅ Working! Found ${ruleCount} CSS rules (${Math.round(cssContent.length / 1024)}KB)`
          );
        } else {
          setZyraStatus("⚠️ Style element found but empty");
        }
      } else {
        setZyraStatus("❌ No ZyraCSS style element found");
      }
    };

    // Check immediately and set up continuous monitoring
    checkZyraCSS();

    // Set up MutationObserver to watch for CSS changes
    const styleElement = document.querySelector("style[data-zyracss]");
    if (styleElement) {
      const observer = new MutationObserver(() => {
        checkZyraCSS();
      });

      observer.observe(styleElement, {
        childList: true,
        characterData: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }

    // Fallback: check periodically if no style element yet
    const intervalId = setInterval(() => {
      if (!document.querySelector("style[data-zyracss]")) {
        checkZyraCSS();
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="mx-[auto]">
      {/* ZyraCSS Status Indicator */}
      <div className="mb-[2rem] p-[1rem] border-radius-[0.5rem] bg-[#f1f5f9] border-[1px,solid,#cbd5e1]">
        <h3 className="font-size-[1rem] font-weight-[600] c-[#1e293b] mb-[0.5rem]">
          🔍 ZyraCSS Runtime Status
        </h3>
        <p className="font-size-[0.875rem] c-[#64748b] m-[0]">{zyraStatus}</p>
      </div>

      <header className="mb-[3rem]">
        <h1 className="font-size-[2.5rem] font-weight-[800] c-[#1e293b] mb-[1rem] line-height-[1.2]">
          ZyraCSS Runtime Examples
        </h1>
        <p className="font-size-[1.125rem] c-[#64748b] line-height-[1.6]">
          Explore different use cases of ZyraCSS runtime with interactive
          examples. Each example demonstrates how ZyraCSS generates and injects
          CSS in real-time.
        </p>
      </header>

      <section className="mb-[3rem]">
        <h2 className="font-size-[1.5rem] font-weight-[600] c-[#1e293b] mb-[1rem]">
          ✨ What You'll See
        </h2>
        <div className="d-[grid] grid-template-columns-[repeat(2,1fr)] gap-[1.5rem]">
          <div className="bg-[#ffffff] p-[1.5rem] border-radius-[0.75rem] border-[1px,solid,#e2e8f0] shadow-[0,1px,3px,rgba(0,0,0,0.1)]">
            <h3 className="font-weight-[600] c-[#3b82f6] mb-[0.5rem]">
              Real-time CSS Generation
            </h3>
            <p className="font-size-[0.875rem] c-[#64748b] line-height-[1.5]">
              Watch CSS rules appear in the browser DevTools as components load
              and state changes.
            </p>
          </div>

          <div className="bg-[#ffffff] p-[1.5rem] border-radius-[0.75rem] border-[1px,solid,#e2e8f0] shadow-[0,1px,3px,rgba(0,0,0,0.1)]">
            <h3 className="font-weight-[600] c-[#3b82f6] mb-[0.5rem]">
              DOM Injection
            </h3>
            <p className="font-size-[0.875rem] c-[#64748b] line-height-[1.5]">
              CSS is automatically injected into &lt;style
              data-zyracss="runtime"&gt; elements.
            </p>
          </div>

          <div className="bg-[#ffffff] p-[1.5rem] border-radius-[0.75rem] border-[1px,solid,#e2e8f0] shadow-[0,1px,3px,rgba(0,0,0,0.1)]">
            <h3 className="font-weight-[600] c-[#3b82f6] mb-[0.5rem]">
              Performance Optimization
            </h3>
            <p className="font-size-[0.875rem] c-[#64748b] line-height-[1.5]">
              Automatic deduplication, caching, and batching for optimal
              performance.
            </p>
          </div>

          <div className="bg-[#ffffff] p-[1.5rem] border-radius-[0.75rem] border-[1px,solid,#e2e8f0] shadow-[0,1px,3px,rgba(0,0,0,0.1)]">
            <h3 className="font-weight-[600] c-[#3b82f6] mb-[0.5rem]">
              Developer Experience
            </h3>
            <p className="font-size-[0.875rem] c-[#64748b] line-height-[1.5]">
              Simple hooks and manager APIs that integrate seamlessly with
              React.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-[3rem]">
        <h2 className="font-size-[1.5rem] font-weight-[600] c-[#1e293b] mb-[1rem]">
          🚀 Runtime API Overview
        </h2>

        <div className="bg-[#1e293b] p-[1.5rem] border-radius-[0.75rem] mb-[1rem]">
          <pre className="c-[#e2e8f0] font-family-[monospace] font-size-[0.875rem] line-height-[1.6] m-[0] overflow-x-[auto]">
            {`// Vanilla Manager API (Current Implementation)
import { zyraCSSManager } from "zyracss";

// Static classes - generate once on mount
useEffect(() => {
  zyraCSSManager.processClasses(["d-[flex]", "p-[1rem]", "bg-[#3b82f6]"]);
}, []);

// Dynamic classes - regenerate when dependencies change
useEffect(() => {
  const classes = [
    "p-[0.75rem,1.5rem]",
    \`bg-[\${isActive ? "#3b82f6" : "#64748b"}]\`
  ];
  zyraCSSManager.processClasses(classes);
}, [isActive]);

// Advanced: Generate CSS only (no injection)
const result = await zyraCSSManager.generateCSS(["w-[100px]"]);`}
          </pre>
        </div>

        <div className="bg-[#fef3c7] border-[1px,solid,#f59e0b] border-radius-[0.5rem] p-[1rem]">
          <p className="font-size-[0.875rem] c-[#92400e] line-height-[1.5] m-[0]">
            <strong>💡 Pro Tip:</strong> Open your browser DevTools and watch
            the &lt;style data-zyracss="runtime"&gt; element as you navigate
            between examples!
          </p>
        </div>
      </section>
    </div>
  );
}
