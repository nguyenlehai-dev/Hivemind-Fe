const MODES = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "audio", label: "Audio" },
];

export default function GenerationModeTabs({ value, onChange }) {
  return (
    <div className="mode-tabs" role="tablist" aria-label="Generation mode">
      {MODES.map((mode) => (
        <button
          key={mode.value}
          type="button"
          role="tab"
          aria-selected={value === mode.value}
          className={`mode-tabs__item ${
            value === mode.value ? "mode-tabs__item--active" : ""
          }`}
          onClick={() => onChange(mode.value)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
