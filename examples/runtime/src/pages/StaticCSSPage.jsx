import { useEffect } from "react";
import { zyraCSSManager } from "zyracss";

export default function StaticCSSPage() {
  // Static classes - generated once on component mount
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
      "bg-[#1e293b]",
      "p-[1.5rem]",
      "border-radius-[0.5rem]",
      "mb-[1.5rem]",
      "c-[#e2e8f0]",
      "font-family-[monospace]",
      "font-size-[0.875rem]",
      "m-[0]",
      "overflow-x-[auto]",
      "c-[#10b981]",
      "c-[#f59e0b]",
      "c-[#ef4444]",
      "bg-[#ffffff]",
      "border-[1px,solid,#e2e8f0]",
      "d-[grid]",
      "grid-template-columns-[repeat(3,1fr)]",
      "gap-[1rem]",
      "text-align-[center]",
      "font-weight-[500]",
      "p-[1rem]",
      "box-shadow-[0,2px,4px,rgba(0,0,0,0.1)]",
      "transition-[transform,0.2s,ease]",
      "hover:transform-[translateY(-2px)]",
      "cursor-[pointer]",
    ]);
  }, []); // Empty dependency array = run once on mount

  return (
    <div className="mx-[auto]">
      <header className="mb-[2rem]">
        <h1 className="font-size-[2rem] font-weight-[700] c-[#1e293b] mb-[1rem]">
          🎯 Static CSS Use Case
        </h1>
        <p className="font-size-[1.125rem] c-[#64748b] line-height-[1.6]">
          The most basic use case - CSS classes that are processed once when the
          component mounts.
        </p>
      </header>

      <section className="mb-[3rem]">
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          Code Example
        </h2>
        <div className="bg-[#1e293b] p-[1.5rem] border-radius-[0.5rem] mb-[1.5rem]">
          <pre className="c-[#e2e8f0] font-family-[monospace] font-size-[0.875rem] line-height-[1.6] m-[0] overflow-x-[auto]">
            {`import { useEffect } from "react";
import { zyraCSSManager } from "zyracss";

function StaticExample() {
  // These classes are processed once on mount
  useEffect(() => {
    zyraCSSManager.processClasses([
      "d-[flex]",
      "justify-content-[center]", 
      "align-items-[center]",
      "p-[2rem]",
      "bg-[#3b82f6]",
      "c-[#ffffff]",
      "border-radius-[0.75rem]",
      "box-shadow-[0,4px,6px,rgba(0,0,0,0.1)]"
    ]);
  }, []); // Empty dependency = run once on mount

  return (
    <div className="d-[flex] justify-content-[center] align-items-[center] p-[2rem] bg-[#3b82f6] c-[#ffffff] border-radius-[0.75rem] box-shadow-[0,4px,6px,rgba(0,0,0,0.1)]">
      <h3>Static CSS Demo</h3>
    </div>
  );
}`}
          </pre>
        </div>
      </section>

      <section className="mb-[3rem]">
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          Live Demo
        </h2>
        <StaticExample />
      </section>

      <section className="mb-[3rem]">
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          How It Works
        </h2>
        <div className="bg-[#f8fafc] p-[1.5rem] border-radius-[0.5rem] border-[1px,solid,#e2e8f0]">
          <ol className="pl-[1.5rem] space-y-[0.75rem]">
            <li className="font-size-[0.875rem] c-[#374151] line-height-[1.6]">
              <strong>Component mounts</strong> →
              zyraCSSManager.processClasses() triggers
            </li>
            <li className="font-size-[0.875rem] c-[#374151] line-height-[1.6]">
              <strong>Classes processed</strong> → ZyraCSS generates CSS rules
            </li>
            <li className="font-size-[0.875rem] c-[#374151] line-height-[1.6]">
              <strong>CSS injected</strong> → Rules added to &lt;style
              data-zyracss="runtime"&gt;
            </li>
            <li className="font-size-[0.875rem] c-[#374151] line-height-[1.6]">
              <strong>Styles applied</strong> → className attributes get
              matching CSS
            </li>
          </ol>
        </div>
      </section>

      <section>
        <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1rem]">
          🔍 Inspect in DevTools
        </h2>
        <div className="bg-[#fef3c7] border-[1px,solid,#f59e0b] border-radius-[0.5rem] p-[1rem]">
          <p className="font-size-[0.875rem] c-[#92400e] line-height-[1.5] m-[0]">
            <strong>Try this:</strong> Open DevTools → Elements → Look for
            &lt;style data-zyracss="runtime"&gt; in the &lt;head&gt; to see the
            generated CSS rules!
          </p>
        </div>
      </section>
    </div>
  );
}

// Static Example Component
function StaticExample() {
  useEffect(() => {
    zyraCSSManager.processClasses([
      "d-[flex]",
      "justify-content-[center]",
      "align-items-[center]",
      "p-[2rem]",
      "bg-[#3b82f6]",
      "c-[#ffffff]",
      "border-radius-[0.75rem]",
      "box-shadow-[0,4px,6px,rgba(0,0,0,0.1)]",
    ]);
  }, []);

  return (
    <div className="d-[flex] justify-content-[center] align-items-[center] p-[2rem] bg-[#3b82f6] c-[#ffffff] border-radius-[0.75rem] box-shadow-[0,4px,6px,rgba(0,0,0,0.1)]">
      <h3 className="font-size-[1.25rem] font-weight-[600] m-[0]">
        ✨ Static CSS Demo
      </h3>
    </div>
  );
}
