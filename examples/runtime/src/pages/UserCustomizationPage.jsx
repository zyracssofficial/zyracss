import { useState, useEffect } from "react";
import { zyraCSSManager } from "zyracss";

// Local storage helpers
const STORAGE_KEY = "zyracss-user-preferences";

function saveUserPreferences(prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

function loadUserPreferences() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

// Color picker component
function ColorPicker({ label, value, onChange }) {
  return (
    <div className="mb-[1rem]">
      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
        {label}
      </label>
      <div className="d-[flex] align-items-[center] gap-[0.5rem]">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-[40px] h-[40px] border-[1px,solid,#d1d5db] border-radius-[0.5rem] cursor-[pointer]"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="p-[0.5rem] border-[1px,solid,#d1d5db] border-radius-[0.25rem] font-family-[monospace] font-size-[0.875rem] w-[100px]"
        />
      </div>
    </div>
  );
}

// Range slider component
function RangeSlider({ label, value, onChange, min, max, step, unit = "" }) {
  return (
    <div className="mb-[1rem]">
      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
        {label}: {value}
        {unit}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-[100%] h-[6px] bg-[#e5e7eb] border-radius-[3px] cursor-[pointer]"
      />
    </div>
  );
}

// Select dropdown component
function Select({ label, value, onChange, options }) {
  return (
    <div className="mb-[1rem]">
      <label className="d-[block] font-weight-[500] mb-[0.5rem] c-[#374151]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[100%] p-[0.5rem] border-[1px,solid,#d1d5db] border-radius-[0.25rem] bg-[white]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Customizable component that adapts to user preferences
function CustomizableComponent({ userPrefs, title, content }) {
  const [componentClasses, setComponentClasses] = useState("");
  const [titleClasses, setTitleClasses] = useState("");
  const [contentClasses, setContentClasses] = useState("");

  useEffect(() => {
    const classes = [
      `p-[${userPrefs.spacing}rem]`,
      `border-radius-[${userPrefs.borderRadius}px]`,
      `bg-[${userPrefs.backgroundColor}]`,
      `c-[${userPrefs.textColor}]`,
      `border-[${userPrefs.borderWidth}px,solid,${userPrefs.borderColor}]`,
      `box-shadow-[0,${userPrefs.shadowSize}px,${userPrefs.shadowSize * 2}px,rgba(0,0,0,${userPrefs.shadowOpacity})]`,
    ];

    if (userPrefs.animation) {
      classes.push("transition-[all,0.3s,ease]");
    }

    zyraCSSManager.processClasses(classes);
    setComponentClasses(classes.join(" "));
  }, [userPrefs]);

  useEffect(() => {
    const classes = [
      `font-size-[${userPrefs.titleSize}rem]`,
      `font-weight-[${userPrefs.fontWeight}]`,
      `font-family-[${userPrefs.fontFamily}]`,
      `mb-[${userPrefs.spacing * 0.5}rem]`,
      `c-[${userPrefs.titleColor}]`,
    ];

    zyraCSSManager.processClasses(classes);
    setTitleClasses(classes.join(" "));
  }, [userPrefs]);

  useEffect(() => {
    const classes = [
      `font-size-[${userPrefs.fontSize}rem]`,
      `line-height-[${userPrefs.lineHeight}]`,
      `font-family-[${userPrefs.fontFamily}]`,
    ];

    zyraCSSManager.processClasses(classes);
    setContentClasses(classes.join(" "));
  }, [userPrefs]);

  return (
    <div className={componentClasses}>
      <h3 className={titleClasses}>{title}</h3>
      <p className={contentClasses}>{content}</p>
    </div>
  );
}

export default function UserCustomizationPage() {
  // Default user preferences
  const defaultPrefs = {
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    titleColor: "#111827",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 8,
    spacing: 1.5,
    fontSize: 1,
    titleSize: 1.25,
    fontWeight: 600,
    fontFamily: "system-ui,sans-serif",
    lineHeight: 1.6,
    shadowSize: 4,
    shadowOpacity: 0.1,
    animation: true,
  };

  const [userPrefs, setUserPrefs] = useState(defaultPrefs);
  const [presetName, setPresetName] = useState("");
  const [savedPresets, setSavedPresets] = useState({});

  // Static layout classes (reduced set - common ones are pre-loaded)
  useEffect(() => {
    zyraCSSManager.processClasses([
      "grid-template-columns-[350px,1fr]",
      "bg-[#f0fdf4]",
      "bg-[#fef2f2]",
      "bg-[#f3f4f6]",
      "hover:bg-[#2563eb]",
      "hover:bg-[#059669]",
      "hover:bg-[#dc2626]",
      "hover:bg-[#4b5563]",
      "text-decoration-[none]",
      "box-shadow-[0,4px,6px,rgba(0,0,0,0.1)]",
      "resize-[none]",
    ]);
  }, []);

  // Load saved preferences and presets on mount
  useEffect(() => {
    const saved = loadUserPreferences();
    if (saved) {
      setUserPrefs(saved.current || defaultPrefs);
      setSavedPresets(saved.presets || {});
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    saveUserPreferences({
      current: userPrefs,
      presets: savedPresets,
    });
  }, [userPrefs, savedPresets]);

  const updatePref = (key, value) => {
    setUserPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const savePreset = () => {
    if (!presetName.trim()) return;
    setSavedPresets((prev) => ({
      ...prev,
      [presetName]: { ...userPrefs },
    }));
    setPresetName("");
  };

  const loadPreset = (name) => {
    if (savedPresets[name]) {
      setUserPrefs(savedPresets[name]);
    }
  };

  const deletePreset = (name) => {
    setSavedPresets((prev) => {
      const newPresets = { ...prev };
      delete newPresets[name];
      return newPresets;
    });
  };

  const resetToDefaults = () => {
    setUserPrefs(defaultPrefs);
  };

  const fontOptions = [
    { value: "system-ui,sans-serif", label: "System Sans" },
    { value: "Georgia,serif", label: "Georgia" },
    { value: "Arial,sans-serif", label: "Arial" },
    { value: "monospace", label: "Monospace" },
    { value: "Helvetica,Arial,sans-serif", label: "Helvetica" },
  ];

  return (
    <div className="max-w-[1000px] mx-[auto] p-[2rem]">
      <header className="mb-[3rem]">
        <h1 className="font-size-[2rem] font-weight-[700] c-[#1e293b] mb-[1rem]">
          👤 User Customization Use Case
        </h1>
        <p className="font-size-[1.125rem] c-[#64748b] line-height-[1.6]">
          Let users customize the appearance with real-time ZyraCSS generation.
          All preferences are saved locally!
        </p>
      </header>

      <div className="d-[grid] grid-template-columns-[350px,1fr] gap-[2rem]">
        {/* Customization Panel */}
        <div className="bg-[#f8fafc] p-[1.5rem] border-radius-[0.75rem] border-[1px,solid,#e2e8f0] h-[fit-content] position-[sticky] top-[1rem]">
          <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1.5rem]">
            🎨 Customize Appearance
          </h2>

          {/* Color Controls */}
          <fieldset className="border-[1px,solid,#d1d5db] border-radius-[0.5rem] p-[1rem] mb-[1.5rem]">
            <legend className="font-weight-[600] px-[0.5rem]">Colors</legend>
            <ColorPicker
              label="Background"
              value={userPrefs.backgroundColor}
              onChange={(value) => updatePref("backgroundColor", value)}
            />
            <ColorPicker
              label="Text Color"
              value={userPrefs.textColor}
              onChange={(value) => updatePref("textColor", value)}
            />
            <ColorPicker
              label="Title Color"
              value={userPrefs.titleColor}
              onChange={(value) => updatePref("titleColor", value)}
            />
            <ColorPicker
              label="Border Color"
              value={userPrefs.borderColor}
              onChange={(value) => updatePref("borderColor", value)}
            />
          </fieldset>

          {/* Typography Controls */}
          <fieldset className="border-[1px,solid,#d1d5db] border-radius-[0.5rem] p-[1rem] mb-[1.5rem]">
            <legend className="font-weight-[600] px-[0.5rem]">
              Typography
            </legend>
            <Select
              label="Font Family"
              value={userPrefs.fontFamily}
              onChange={(value) => updatePref("fontFamily", value)}
              options={fontOptions}
            />
            <RangeSlider
              label="Font Size"
              value={userPrefs.fontSize}
              onChange={(value) => updatePref("fontSize", value)}
              min={0.75}
              max={2}
              step={0.1}
              unit="rem"
            />
            <RangeSlider
              label="Title Size"
              value={userPrefs.titleSize}
              onChange={(value) => updatePref("titleSize", value)}
              min={1}
              max={3}
              step={0.1}
              unit="rem"
            />
            <RangeSlider
              label="Font Weight"
              value={userPrefs.fontWeight}
              onChange={(value) => updatePref("fontWeight", value)}
              min={100}
              max={900}
              step={100}
            />
            <RangeSlider
              label="Line Height"
              value={userPrefs.lineHeight}
              onChange={(value) => updatePref("lineHeight", value)}
              min={1}
              max={2.5}
              step={0.1}
            />
          </fieldset>

          {/* Layout Controls */}
          <fieldset className="border-[1px,solid,#d1d5db] border-radius-[0.5rem] p-[1rem] mb-[1.5rem]">
            <legend className="font-weight-[600] px-[0.5rem]">Layout</legend>
            <RangeSlider
              label="Spacing"
              value={userPrefs.spacing}
              onChange={(value) => updatePref("spacing", value)}
              min={0.5}
              max={4}
              step={0.1}
              unit="rem"
            />
            <RangeSlider
              label="Border Width"
              value={userPrefs.borderWidth}
              onChange={(value) => updatePref("borderWidth", value)}
              min={0}
              max={5}
              step={1}
              unit="px"
            />
            <RangeSlider
              label="Border Radius"
              value={userPrefs.borderRadius}
              onChange={(value) => updatePref("borderRadius", value)}
              min={0}
              max={20}
              step={1}
              unit="px"
            />
          </fieldset>

          {/* Effects Controls */}
          <fieldset className="border-[1px,solid,#d1d5db] border-radius-[0.5rem] p-[1rem] mb-[1.5rem]">
            <legend className="font-weight-[600] px-[0.5rem]">Effects</legend>
            <RangeSlider
              label="Shadow Size"
              value={userPrefs.shadowSize}
              onChange={(value) => updatePref("shadowSize", value)}
              min={0}
              max={20}
              step={1}
              unit="px"
            />
            <RangeSlider
              label="Shadow Opacity"
              value={userPrefs.shadowOpacity}
              onChange={(value) => updatePref("shadowOpacity", value)}
              min={0}
              max={1}
              step={0.1}
            />
            <div className="mb-[1rem]">
              <label className="d-[flex] align-items-[center] gap-[0.5rem] cursor-[pointer]">
                <input
                  type="checkbox"
                  checked={userPrefs.animation}
                  onChange={(e) => updatePref("animation", e.target.checked)}
                />
                <span className="font-weight-[500] c-[#374151]">
                  Enable Animations
                </span>
              </label>
            </div>
          </fieldset>

          {/* Preset Controls */}
          <fieldset className="border-[1px,solid,#d1d5db] border-radius-[0.5rem] p-[1rem] mb-[1.5rem]">
            <legend className="font-weight-[600] px-[0.5rem]">Presets</legend>
            <div className="d-[flex] gap-[0.5rem] mb-[1rem]">
              <input
                type="text"
                placeholder="Preset name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="flex-[1] p-[0.5rem] border-[1px,solid,#d1d5db] border-radius-[0.25rem] font-size-[0.875rem]"
              />
              <button
                onClick={savePreset}
                disabled={!presetName.trim()}
                className="p-[0.5rem,1rem] bg-[#10b981] c-[white] border-[none] border-radius-[0.25rem] cursor-[pointer] font-size-[0.875rem] disabled:bg-[#d1d5db] disabled:cursor-[not-allowed]"
              >
                Save
              </button>
            </div>
            <div className="overflow-y-[auto] max-h-[150px]">
              {Object.keys(savedPresets).map((name) => (
                <div
                  key={name}
                  className="d-[flex] gap-[0.5rem] mb-[0.5rem] align-items-[center]"
                >
                  <button
                    onClick={() => loadPreset(name)}
                    className="flex-[1] p-[0.25rem,0.5rem] bg-[#3b82f6] c-[white] border-[none] border-radius-[0.25rem] cursor-[pointer] font-size-[0.75rem] text-align-[left]"
                  >
                    {name}
                  </button>
                  <button
                    onClick={() => deletePreset(name)}
                    className="p-[0.25rem,0.5rem] bg-[#ef4444] c-[white] border-[none] border-radius-[0.25rem] cursor-[pointer] font-size-[0.75rem]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </fieldset>

          <button
            onClick={resetToDefaults}
            className="w-[100%] p-[0.5rem,1rem] bg-[#6b7280] c-[white] border-[none] border-radius-[0.25rem] cursor-[pointer] font-size-[0.875rem]"
          >
            Reset to Defaults
          </button>
        </div>

        {/* Preview Area */}
        <div className="d-[flex] flex-direction-[column] gap-[2rem]">
          <section>
            <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1.5rem]">
              🎯 Live Preview
            </h2>
            <div className="d-[flex] flex-direction-[column] gap-[1.5rem]">
              <CustomizableComponent
                userPrefs={userPrefs}
                title="Welcome to ZyraCSS!"
                content="This component adapts to your customization preferences in real-time. Every change you make generates new ZyraCSS classes dynamically."
              />
              <CustomizableComponent
                userPrefs={userPrefs}
                title="User Preferences"
                content="Colors, typography, spacing, and effects are all customizable. The styles persist across sessions using localStorage."
              />
              <CustomizableComponent
                userPrefs={userPrefs}
                title="Preset System"
                content="Save your favorite combinations as presets and switch between them instantly. Share presets with others or keep different styles for different moods!"
              />
            </div>
          </section>

          {/* Generated CSS Classes */}
          <section>
            <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1.5rem]">
              📝 Generated ZyraCSS Classes
            </h2>
            <div className="bg-[#1e293b] c-[#e2e8f0] p-[1.5rem] border-radius-[0.5rem] overflow-x-[auto]">
              <pre className="font-family-[monospace] font-size-[0.875rem] line-height-[1.6] m-[0]">
                {`// Component container classes:
p-[${userPrefs.spacing}rem]
border-radius-[${userPrefs.borderRadius}px]
bg-[${userPrefs.backgroundColor}]
c-[${userPrefs.textColor}]
border-[${userPrefs.borderWidth}px,solid,${userPrefs.borderColor}]
box-shadow-[0,${userPrefs.shadowSize}px,${userPrefs.shadowSize * 2}px,rgba(0,0,0,${userPrefs.shadowOpacity})]${userPrefs.animation ? "\ntransition-[all,0.3s,ease]" : ""}

// Title (h3) classes:
font-size-[${userPrefs.titleSize}rem]
font-weight-[${userPrefs.fontWeight}]
font-family-[${userPrefs.fontFamily}]
c-[${userPrefs.titleColor}]

// Content (p) classes:
font-size-[${userPrefs.fontSize}rem]
line-height-[${userPrefs.lineHeight}]
font-family-[${userPrefs.fontFamily}]

// Animation status: ${userPrefs.animation ? "Enabled" : "Disabled"}`}
              </pre>
            </div>
          </section>

          {/* User Guide */}
          <section>
            <h2 className="font-size-[1.25rem] font-weight-[600] c-[#374151] mb-[1.5rem]">
              📖 How It Works
            </h2>
            <div className="bg-[#f0fdf4] border-[1px,solid,#10b981] border-radius-[0.75rem] p-[1.5rem]">
              <ul className="list-style-[disc] pl-[1.5rem] line-height-[1.8] c-[#065f46]">
                <li>
                  <strong>Real-time Updates:</strong> As you adjust controls,
                  ZyraCSS classes are generated instantly
                </li>
                <li>
                  <strong>Persistent Preferences:</strong> Your settings are
                  saved to localStorage automatically
                </li>
                <li>
                  <strong>Preset System:</strong> Save and share your favorite
                  style combinations
                </li>
                <li>
                  <strong>Dynamic Classes:</strong>{" "}
                  zyraCSSManager.processClasses() regenerates CSS when
                  preferences change
                </li>
                <li>
                  <strong>Type-safe:</strong> All values are validated and
                  converted to proper CSS units
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
