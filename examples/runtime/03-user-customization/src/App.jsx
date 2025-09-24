import { useState, useEffect } from "react";
import { zyra } from "zyracss";

function App() {
  const [activeTab, setActiveTab] = useState("content");
  const [preferences, setPreferences] = useState({
    // Button Options
    buttonColor: "#415336",
    buttonTextColor: "#ffffff",
    buttonSpacing: 18,
    buttonBorderRadius: 8,
    buttonFontSize: 16,
    // Layout Options
    backgroundColor: "#bee2a7",
    textColor: "#000000",
    contentSpacing: 30,
    contentBorderRadius: 12,
    contentFontSize: 16,
    // Heading Options
    headingColor: "#000000",
    headingFontSize: 20,
    textTransform: "none",
  });

  // Process static layout styles once
  useEffect(() => {
    zyra.inject([
      // Layout and positioning
      "min-h-[100vh]",
      "min-h-[300px]",
      "d-[flex]",
      "d-[grid]",
      "d-[block]",
      "flex-direction-[column]",
      "align-items-[center]",
      "grid-template-columns-[1fr,1fr]",
      "flex-[1]",

      // Spacing and sizing
      "w-[100%]",
      "w-[40px]",
      "h-[40px]",
      "max-w-[1000px]",
      "p-[2rem]",
      "p-[1.5rem]",
      "p-[1rem]",
      "p-[0.5rem]",
      "p-[4px]",
      "p-[0.75rem,1rem]", // Tab button padding shorthand
      "mx-[auto]",
      "mb-[2rem]",
      "mb-[1.5rem]",
      "mb-[1rem]",
      "mb-[0.5rem]",
      "gap-[2rem]",
      "gap-[0.5rem]",
      "gap-[2px]",

      // Colors and backgrounds
      "bg-[#f8fafc]",
      "bg-[#fafbfc]",
      "bg-[white]",
      "bg-[transparent]",
      "c-[#1e293b]",
      "c-[#64748b]",
      "c-[#374151]",
      "c-[#3b82f6]",
      "c-[#6b7280]",
      "hover:c-[#374151]",
      "hover:bg-[rgba(255,255,255,0.5)]",

      // Typography
      "font-family-[sans-serif]",
      "font-size-[2rem]",
      "font-size-[1.25rem]",
      "font-size-[1.125rem]",
      "font-size-[0.875rem]",
      "font-weight-[bold]",
      "font-weight-[600]",
      "font-weight-[500]",
      "text-align-[center]",
      "line-height-[1.6]",
      "text-transform-[uppercase]",
      "letter-spacing-[0.5px]",
      "line-height-[1.5]",

      // Borders and effects
      "border-radius-[12px]",
      "border-radius-[8px]",
      "border-radius-[6px]",
      "border-[1px,solid,#e5e7eb]",
      "border-[1px,solid,#d1d5db]",
      "border-[1px,solid,#f1f3f4]",
      "border-[none]",
      "box-shadow-[0,4px,6px,rgba(0,0,0,0.1)]",
      "box-shadow-[0,1px,3px,rgba(0,0,0,0.1)]",

      // Interactions
      "cursor-[pointer]",
      "transition-[all,0.2s,ease]",
      "opacity-[0.8]",
    ]);
  }, []);

  // Process user preference styles when they change
  useEffect(() => {
    const customClasses = [
      `bg-[${preferences.backgroundColor}]`,
      `c-[${preferences.textColor}]`,
      `bg-[${preferences.buttonColor}]`,
      `c-[${preferences.buttonTextColor}]`,
      `p-[${preferences.buttonSpacing}px]`,
      `border-radius-[${preferences.buttonBorderRadius}px]`,
      `font-size-[${preferences.buttonFontSize}px]`,
      `p-[${preferences.contentSpacing}px]`,
      `border-radius-[${preferences.contentBorderRadius}px]`,
      `font-size-[${preferences.contentFontSize}px]`,
      `c-[${preferences.headingColor}]`,
      `font-size-[${preferences.headingFontSize}px]`,
      `text-transform-[${preferences.textTransform}]`,
      `hover:opacity-[0.9]`,
    ];

    zyra.inject(customClasses);
  }, [preferences]);

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const previewClass = `bg-[${preferences.backgroundColor}] c-[${preferences.textColor}] p-[${preferences.contentSpacing}px] border-radius-[${preferences.contentBorderRadius}px] border-[2px,solid,${preferences.buttonColor}] transition-[all,0.3s,ease]`;

  const buttonClass = `bg-[${preferences.buttonColor}] c-[${preferences.buttonTextColor}] p-[${preferences.buttonSpacing}px] border-[none] border-radius-[${preferences.buttonBorderRadius}px] font-size-[${preferences.buttonFontSize}px] font-weight-[600] cursor-[pointer] transition-[all,0.2s,ease] hover:opacity-[0.9]`;

  return (
    <div className="min-h-[100vh] bg-[#f8fafc] p-[2rem] d-[flex] flex-direction-[column] align-items-[center] font-family-[sans-serif]">
      <div className="max-w-[1000px] mx-[auto]">
        <h1 className="font-size-[2rem] font-weight-[bold] mb-[1rem] c-[#1e293b] text-align-[center]">
          ZyraCSS User Customization
        </h1>

        <p className="font-size-[1.125rem] mb-[2rem] c-[#64748b] line-height-[1.6] text-align-[center]">
          Let users customize their interface in real-time. Every change
          instantly generates new CSS and updates the preview.
        </p>

        <div className="d-[grid] grid-template-columns-[1fr,1fr] gap-[2rem] w-[100%]">
          {/* Controls Panel */}
          <div className="bg-[white] p-[1.5rem] border-radius-[12px] box-shadow-[0,4px,6px,rgba(0,0,0,0.1)] border-[1px,solid,#e5e7eb]">
            <h2 className="font-size-[1.25rem] font-weight-[600] mb-[1.5rem] c-[#374151]">
              Customize Your Style
            </h2>

            {/* Enhanced Tab Navigation */}
            <div className="d-[flex] bg-[#f8fafc] border-radius-[8px] p-[4px] mb-[1.5rem] gap-[2px]">
              <button
                className={
                  activeTab === "content"
                    ? "flex-[1] p-[0.75rem,1rem] border-[none] border-radius-[6px] bg-[white] cursor-[pointer] font-weight-[600] c-[#3b82f6] transition-[all,0.2s,ease] box-shadow-[0,1px,3px,rgba(0,0,0,0.1)]"
                    : "flex-[1] p-[0.75rem,1rem] border-[none] border-radius-[6px] bg-[transparent] cursor-[pointer] font-weight-[500] c-[#6b7280] transition-[all,0.2s,ease] hover:c-[#374151] hover:bg-[rgba(255,255,255,0.5)]"
                }
                onClick={() => setActiveTab("content")}
              >
                📐 Layout
              </button>
              <button
                className={
                  activeTab === "heading"
                    ? "flex-[1] p-[0.75rem,1rem] border-[none] border-radius-[6px] bg-[white] cursor-[pointer] font-weight-[600] c-[#3b82f6] transition-[all,0.2s,ease] box-shadow-[0,1px,3px,rgba(0,0,0,0.1)]"
                    : "flex-[1] p-[0.75rem,1rem] border-[none] border-radius-[6px] bg-[transparent] cursor-[pointer] font-weight-[500] c-[#6b7280] transition-[all,0.2s,ease] hover:c-[#374151] hover:bg-[rgba(255,255,255,0.5)]"
                }
                onClick={() => setActiveTab("heading")}
              >
                ✍️ Heading
              </button>
              <button
                className={
                  activeTab === "button"
                    ? "flex-[1] p-[0.75rem,1rem] border-[none] border-radius-[6px] bg-[white] cursor-[pointer] font-weight-[600] c-[#3b82f6] transition-[all,0.2s,ease] box-shadow-[0,1px,3px,rgba(0,0,0,0.1)]"
                    : "flex-[1] p-[0.75rem,1rem] border-[none] border-radius-[6px] bg-[transparent] cursor-[pointer] font-weight-[500] c-[#6b7280] transition-[all,0.2s,ease] hover:c-[#374151] hover:bg-[rgba(255,255,255,0.5)]"
                }
                onClick={() => setActiveTab("button")}
              >
                🎨 Button
              </button>
            </div>

            {/* Enhanced Tab Content */}
            <div className="min-h-[300px] bg-[#fafbfc] border-radius-[8px] p-[1.5rem] border-[1px,solid,#f1f3f4]">
              {/* Content Tab (Layout) */}
              {activeTab === "content" && (
                <div>
                  <div className="mb-[1.5rem] p-[1rem] bg-[white] border-radius-[8px] border-[1px,solid,#e5e7eb]">
                    <h4 className="font-size-[0.875rem] font-weight-[600] c-[#374151] mb-[1rem] text-transform-[uppercase] letter-spacing-[0.5px] opacity-[0.8]">
                      Colors
                    </h4>

                    <div className="mb-[1rem]">
                      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
                        Background Color
                      </label>
                      <div className="d-[flex] align-items-[center] gap-[0.5rem]">
                        <input
                          type="color"
                          value={preferences.backgroundColor}
                          onChange={(e) =>
                            updatePreference("backgroundColor", e.target.value)
                          }
                          className="w-[40px] h-[40px] border-[1px,solid,#d1d5db] border-radius-[6px] cursor-[pointer]"
                        />
                        <input
                          type="text"
                          value={preferences.backgroundColor}
                          onChange={(e) =>
                            updatePreference("backgroundColor", e.target.value)
                          }
                          className="w-[100%] p-[0.5rem] border-[1px,solid,#d1d5db] border-radius-[6px] font-size-[0.875rem]"
                        />
                      </div>
                    </div>

                    <div className="mb-[1rem]">
                      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
                        Text Color
                      </label>
                      <div className="d-[flex] align-items-[center] gap-[0.5rem]">
                        <input
                          type="color"
                          value={preferences.textColor}
                          onChange={(e) =>
                            updatePreference("textColor", e.target.value)
                          }
                          className="w-[40px] h-[40px] border-[1px,solid,#d1d5db] border-radius-[6px] cursor-[pointer]"
                        />
                        <input
                          type="text"
                          value={preferences.textColor}
                          onChange={(e) =>
                            updatePreference("textColor", e.target.value)
                          }
                          className="w-[100%] p-[0.5rem] border-[1px,solid,#d1d5db] border-radius-[6px] font-size-[0.875rem]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-[1rem] bg-[white] border-radius-[8px] border-[1px,solid,#e5e7eb]">
                    <h4 className="font-size-[0.875rem] font-weight-[600] c-[#374151] mb-[1rem] text-transform-[uppercase] letter-spacing-[0.5px] opacity-[0.8]">
                      Layout
                    </h4>

                    <div className="mb-[1rem]">
                      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
                        Content Spacing: {preferences.contentSpacing}px
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="40"
                        value={preferences.contentSpacing}
                        onChange={(e) =>
                          updatePreference(
                            "contentSpacing",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-[100%]"
                      />
                    </div>

                    <div className="mb-[1rem]">
                      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
                        Content Border Radius: {preferences.contentBorderRadius}
                        px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={preferences.contentBorderRadius}
                        onChange={(e) =>
                          updatePreference(
                            "contentBorderRadius",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-[100%]"
                      />
                    </div>

                    <div className="mb-[1rem]">
                      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
                        Content Font Size: {preferences.contentFontSize}px
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="20"
                        value={preferences.contentFontSize}
                        onChange={(e) =>
                          updatePreference(
                            "contentFontSize",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-[100%]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Heading Tab */}
              {activeTab === "heading" && (
                <div>
                  <div className="mb-[1.5rem] p-[1rem] bg-[white] border-radius-[8px] border-[1px,solid,#e5e7eb]">
                    <h4 className="font-size-[0.875rem] font-weight-[600] c-[#374151] mb-[1rem] text-transform-[uppercase] letter-spacing-[0.5px] opacity-[0.8]">
                      Colors
                    </h4>

                    <div className="mb-[1rem]">
                      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
                        Heading Color
                      </label>
                      <div className="d-[flex] align-items-[center] gap-[0.5rem]">
                        <input
                          type="color"
                          value={preferences.headingColor}
                          onChange={(e) =>
                            updatePreference("headingColor", e.target.value)
                          }
                          className="w-[40px] h-[40px] border-[1px,solid,#d1d5db] border-radius-[6px] cursor-[pointer]"
                        />
                        <input
                          type="text"
                          value={preferences.headingColor}
                          onChange={(e) =>
                            updatePreference("headingColor", e.target.value)
                          }
                          className="w-[100%] p-[0.5rem] border-[1px,solid,#d1d5db] border-radius-[6px] font-size-[0.875rem]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-[1rem] bg-[white] border-radius-[8px] border-[1px,solid,#e5e7eb]">
                    <h4 className="font-size-[0.875rem] font-weight-[600] c-[#374151] mb-[1rem] text-transform-[uppercase] letter-spacing-[0.5px] opacity-[0.8]">
                      Typography
                    </h4>

                    <div className="mb-[1rem]">
                      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
                        Heading Font Size: {preferences.headingFontSize}px
                      </label>
                      <input
                        type="range"
                        min="14"
                        max="28"
                        value={preferences.headingFontSize}
                        onChange={(e) =>
                          updatePreference(
                            "headingFontSize",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-[100%]"
                      />
                    </div>

                    <div className="mb-[1rem]">
                      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
                        Text Transform
                      </label>
                      <select
                        value={preferences.textTransform}
                        onChange={(e) =>
                          updatePreference("textTransform", e.target.value)
                        }
                        className="w-[100%] p-[0.5rem] border-[1px,solid,#d1d5db] border-radius-[6px] font-size-[0.875rem]"
                      >
                        <option value="none">None</option>
                        <option value="uppercase">UPPERCASE</option>
                        <option value="lowercase">lowercase</option>
                        <option value="capitalize">Capitalize</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Button Tab */}
              {activeTab === "button" && (
                <div>
                  <div className="mb-[1.5rem] p-[1rem] bg-[white] border-radius-[8px] border-[1px,solid,#e5e7eb]">
                    <h4 className="font-size-[0.875rem] font-weight-[600] c-[#374151] mb-[1rem] text-transform-[uppercase] letter-spacing-[0.5px] opacity-[0.8]">
                      Colors
                    </h4>

                    <div className="mb-[1rem]">
                      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
                        Button Color
                      </label>
                      <div className="d-[flex] align-items-[center] gap-[0.5rem]">
                        <input
                          type="color"
                          value={preferences.buttonColor}
                          onChange={(e) =>
                            updatePreference("buttonColor", e.target.value)
                          }
                          className="w-[40px] h-[40px] border-[1px,solid,#d1d5db] border-radius-[6px] cursor-[pointer]"
                        />
                        <input
                          type="text"
                          value={preferences.buttonColor}
                          onChange={(e) =>
                            updatePreference("buttonColor", e.target.value)
                          }
                          className="w-[100%] p-[0.5rem] border-[1px,solid,#d1d5db] border-radius-[6px] font-size-[0.875rem]"
                        />
                      </div>
                    </div>

                    <div className="mb-[1rem]">
                      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
                        Button Text Color
                      </label>
                      <div className="d-[flex] align-items-[center] gap-[0.5rem]">
                        <input
                          type="color"
                          value={preferences.buttonTextColor}
                          onChange={(e) =>
                            updatePreference("buttonTextColor", e.target.value)
                          }
                          className="w-[40px] h-[40px] border-[1px,solid,#d1d5db] border-radius-[6px] cursor-[pointer]"
                        />
                        <input
                          type="text"
                          value={preferences.buttonTextColor}
                          onChange={(e) =>
                            updatePreference("buttonTextColor", e.target.value)
                          }
                          className="w-[100%] p-[0.5rem] border-[1px,solid,#d1d5db] border-radius-[6px] font-size-[0.875rem]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-[1rem] bg-[white] border-radius-[8px] border-[1px,solid,#e5e7eb]">
                    <h4 className="font-size-[0.875rem] font-weight-[600] c-[#374151] mb-[1rem] text-transform-[uppercase] letter-spacing-[0.5px] opacity-[0.8]">
                      Dimensions
                    </h4>

                    <div className="mb-[1rem]">
                      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
                        Button Spacing: {preferences.buttonSpacing}px
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="32"
                        value={preferences.buttonSpacing}
                        onChange={(e) =>
                          updatePreference(
                            "buttonSpacing",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-[100%]"
                      />
                    </div>

                    <div className="mb-[1rem]">
                      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
                        Button Border Radius: {preferences.buttonBorderRadius}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        value={preferences.buttonBorderRadius}
                        onChange={(e) =>
                          updatePreference(
                            "buttonBorderRadius",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-[100%]"
                      />
                    </div>

                    <div className="mb-[1rem]">
                      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
                        Button Font Size: {preferences.buttonFontSize}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={preferences.buttonFontSize}
                        onChange={(e) =>
                          updatePreference(
                            "buttonFontSize",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-[100%]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-[white] p-[1.5rem] border-radius-[12px] box-shadow-[0,4px,6px,rgba(0,0,0,0.1)] border-[1px,solid,#e5e7eb]">
            <h2 className="font-size-[1.25rem] font-weight-[600] mb-[1.5rem] c-[#374151]">
              Live Preview
            </h2>

            <div className={previewClass}>
              <h3
                className={`font-size-[${preferences.headingFontSize}px] font-weight-[600] mb-[1rem] c-[${preferences.headingColor}] text-transform-[${preferences.textTransform}]`}
              >
                Sample Heading
              </h3>

              <p
                className={`font-size-[${preferences.contentFontSize}px] line-height-[1.5] mb-[1.5rem] opacity-[0.8] font-family-[sans-serif] line-height-[1.5]`}
              >
                This is your live preview area where you can see exactly how
                your customized content will appear. Every adjustment you make
                to colors, spacing, typography, and styling options is instantly
                reflected here in real-time. The power of ZyraCSS allows for
                dynamic CSS generation that responds immediately to your
                preferences. Watch as your design choices come to life with
                seamless updates to background colors, text styling, border
                radius, and spacing. This interactive preview gives you complete
                control over the visual appearance of your content. Experiment
                with different combinations to create the perfect look for your
                project.
              </p>

              <button className={buttonClass}>Custom Button</button>
            </div>

            <div className="mt-[1.5rem] p-[1rem] bg-[#f1f5f9] border-radius-[8px]">
              <p className="font-size-[0.875rem] c-[#64748b] opacity-[0.8]">
                Every adjustment instantly generates new CSS. Check DevTools to
                see the magic!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
