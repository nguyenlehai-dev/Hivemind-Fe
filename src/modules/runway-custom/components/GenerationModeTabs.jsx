import { AudioIcon, ImageIcon, VideoIcon } from "../../../shared/icons";

const tabs = [
  { label: "Image", icon: ImageIcon },
  { label: "Video", icon: VideoIcon },
  { label: "Audio", icon: AudioIcon },
];

export default function GenerationModeTabs({ activeMode, onChange }) {
  return (
    <div className="mode-tabs">
      {tabs.map(({ label, icon: Icon }) => {
        const disabled = label !== "Image";
        return (
          <button
            key={label}
            type="button"
            className={`mode-tabs__item ${activeMode === label ? "is-active" : ""}`}
            onClick={() => !disabled && onChange(label)}
            disabled={disabled}
          >
            <Icon className="mode-tabs__icon" />
            {label}
            {disabled && <span className="mode-tabs__tag">Soon</span>}
          </button>
        );
      })}
    </div>
  );
}
