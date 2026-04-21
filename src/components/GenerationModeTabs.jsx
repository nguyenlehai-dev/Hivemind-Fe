const tabs = ["Image", "Video", "Audio"];

export default function GenerationModeTabs({ activeMode, onChange }) {
  return (
    <div className="mode-tabs">
      {tabs.map((tab) => {
        const disabled = tab !== "Image";
        return (
          <button
            key={tab}
            type="button"
            className={`mode-tabs__item ${activeMode === tab ? "is-active" : ""}`}
            onClick={() => !disabled && onChange(tab)}
            disabled={disabled}
          >
            {tab}
            {disabled && <span className="mode-tabs__tag">Soon</span>}
          </button>
        );
      })}
    </div>
  );
}
