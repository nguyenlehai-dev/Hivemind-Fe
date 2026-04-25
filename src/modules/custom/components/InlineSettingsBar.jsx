import { useEffect, useRef, useState } from "react";

import {
  AppsIcon,
  ChevronDownIcon,
  RatioIcon,
  SparklesIcon,
  WandIcon,
} from "../../../shared/icons";
import { useGenerationStore } from "../store/useGenerationStore";

const ASPECT_RATIOS = {
  image: ["16:9", "1:1", "4:3", "3:4", "9:16"],
  video: ["16:9", "9:16", "1:1"],
  audio: [],
};

export default function InlineSettingsBar() {
  const [isAspectMenuOpen, setIsAspectMenuOpen] = useState(false);
  const aspectMenuRef = useRef(null);
  const mode = useGenerationStore((s) => s.activeMode);
  const settings = useGenerationStore((s) => s.drafts[s.activeMode].settings);
  const selectedPreset = useGenerationStore((s) => s.selectedPresetByMode[s.activeMode]);
  const setSettings = useGenerationStore((s) => s.setSettings);
  const selectPreset = useGenerationStore((s) => s.selectPreset);

  const aspectRatios = ASPECT_RATIOS[mode] ?? [];
  const activeAspectRatio = settings.aspect_ratio ?? aspectRatios[0];

  useEffect(() => {
    if (!isAspectMenuOpen) return undefined;

    function handlePointerDown(event) {
      if (!aspectMenuRef.current?.contains(event.target)) {
        setIsAspectMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsAspectMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAspectMenuOpen]);

  return (
    <div className="inline-settings" aria-label="Advanced settings">
      <div className="inline-settings__leading">
        <button
          type="button"
          className={`inline-settings__clear${
            selectedPreset ? " inline-settings__clear--active" : ""
          }`}
          aria-label="Clear preset and return to custom composer"
          title="Clear preset"
          onClick={() => selectPreset(null)}
          disabled={!selectedPreset}
        >
          <WandIcon className="inline-settings__icon" />
        </button>
      </div>

      {aspectRatios.length > 0 && (
        <div
          ref={aspectMenuRef}
          className={`inline-settings__item inline-settings__item--menu${
            isAspectMenuOpen ? " inline-settings__item--menu-open" : ""
          }`}
        >
          <RatioIcon className="inline-settings__icon" />
          <button
            type="button"
            className="inline-settings__menu-trigger"
            aria-haspopup="listbox"
            aria-expanded={isAspectMenuOpen}
            onClick={() => setIsAspectMenuOpen((value) => !value)}
          >
            <span>{activeAspectRatio}</span>
            <ChevronDownIcon className="inline-settings__chevron" />
          </button>

          {isAspectMenuOpen && (
            <div className="inline-settings__menu" role="listbox" aria-label="Aspect ratio">
              {aspectRatios.map((ratio) => {
                const isActive = ratio === activeAspectRatio;

                return (
                  <button
                    key={ratio}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={`inline-settings__menu-option${
                      isActive ? " inline-settings__menu-option--active" : ""
                    }`}
                    onClick={() => {
                      setSettings({ aspect_ratio: ratio });
                      setIsAspectMenuOpen(false);
                    }}
                  >
                    {ratio}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="inline-settings__item">
        <AppsIcon className="inline-settings__icon" />
        <button
          type="button"
          className="inline-settings__step"
          onClick={() =>
            setSettings({
              num_outputs: Math.max(1, (settings.num_outputs ?? 1) - 1),
            })
          }
          disabled={(settings.num_outputs ?? 1) <= 1}
        >
          -
        </button>
        <span className="inline-settings__value">
          {settings.num_outputs ?? 1}
        </span>
        <button
          type="button"
          className="inline-settings__step"
          onClick={() =>
            setSettings({
              num_outputs: Math.min(4, (settings.num_outputs ?? 1) + 1),
            })
          }
          disabled={(settings.num_outputs ?? 1) >= 4}
        >
          +
        </button>
      </div>

      <div className="inline-settings__item">
        <SparklesIcon className="inline-settings__icon" />
        <button
          type="button"
          className="inline-settings__action"
          onClick={() =>
            setSettings({
              seed:
                settings.seed == null
                  ? Math.floor(Math.random() * 1_000_000)
                  : null,
            })
          }
        >
          {settings.seed == null ? "Auto" : String(settings.seed)}
        </button>
      </div>
    </div>
  );
}
