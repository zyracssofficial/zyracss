import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { zyraCSSManager } from "zyracss";

const useCase = [
  { path: "/", name: "Home", description: "ZyraCSS Runtime Overview" },
  {
    path: "/static-css",
    name: "Static CSS",
    description: "Basic class processing",
  },
  {
    path: "/dynamic-css",
    name: "Dynamic CSS",
    description: "State-driven styling",
  },
  {
    path: "/conditional-css",
    name: "Conditional CSS",
    description: "Props-based styling",
  },
  { path: "/ai-json", name: "AI/JSON", description: "JSON-driven components" },
  {
    path: "/theme-switching",
    name: "Theme Switching",
    description: "Dynamic themes",
  },
  {
    path: "/user-customization",
    name: "User Customization",
    description: "User-defined styles",
  },
  { path: "/vanilla-js", name: "Vanilla JS", description: "Non-React usage" },
];

export default function Layout({ children }) {
  const location = useLocation();

  // Apply layout styles using ZyraCSS runtime
  useEffect(() => {
    zyraCSSManager.processClasses([
      "d-[flex]",
      "min-h-[100vh]",
      "bg-[#f8fafc]",
      "w-[280px]",
      "bg-[#ffffff]",
      "border-r-[1px,solid,#e2e8f0]",
      "p-[1.5rem]",
      "shadow-[0,1px,3px,rgba(0,0,0,0.1)]",
      "mb-[2rem]",
      "font-size-[1.5rem]",
      "font-weight-[700]",
      "c-[#1e293b]",
      "mb-[0.5rem]",
      "font-size-[0.875rem]",
      "c-[#64748b]",
      "line-height-[1.4]",
      "list-style-[none]",
      "p-[0]",
      "m-[0]",
      "mb-[0.5rem]",
      "d-[block]",
      "p-[0.75rem,1rem]",
      "border-radius-[0.5rem]",
      "transition-[all,0.2s,ease]",
      "text-decoration-[none]",
      "bg-[#3b82f6]",
      "c-[#ffffff]",
      "c-[#475569]",
      "hover:bg-[#f1f5f9]",
      "hover:c-[#1e293b]",
      "font-weight-[600]",
      "font-size-[0.875rem]",
      "mb-[0.25rem]",
      "font-size-[0.75rem]",
      "opacity-[0.8]",
      "flex-[1]",
      "p-[2rem]",
      "overflow-y-[auto]",
    ]);
  }, []);

  return (
    <div className="d-[flex] min-h-[100vh] bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#ffffff] border-r-[1px,solid,#e2e8f0] p-[1.5rem] shadow-[0,1px,3px,rgba(0,0,0,0.1)]">
        <div className="mb-[2rem]">
          <h1 className="font-size-[1.5rem] font-weight-[700] c-[#1e293b] mb-[0.5rem]">
            ZyraCSS Runtime
          </h1>
          <p className="font-size-[0.875rem] c-[#64748b] line-height-[1.4]">
            Interactive examples of different use cases
          </p>
        </div>

        <nav>
          <ul className="list-style-[none] p-[0] m-[0]">
            {useCase.map((useCase) => (
              <li key={useCase.path} className="mb-[0.5rem]">
                <Link
                  to={useCase.path}
                  className={`
                    d-[block] p-[0.75rem,1rem] border-radius-[0.5rem] 
                    transition-[all,0.2s,ease] text-decoration-[none]
                    ${
                      location.pathname === useCase.path
                        ? "bg-[#3b82f6] c-[#ffffff]"
                        : "c-[#475569] hover:bg-[#f1f5f9] hover:c-[#1e293b]"
                    }
                  `}
                >
                  <div className="font-weight-[600] font-size-[0.875rem] mb-[0.25rem]">
                    {useCase.name}
                  </div>
                  <div className="font-size-[0.75rem] opacity-[0.8]">
                    {useCase.description}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-[1] p-[2rem] overflow-y-[auto]">{children}</main>
    </div>
  );
}
