import ModalShell from "../../../shared/ui/ModalShell";
import { MODAL_KEYS, useUiStore } from "../../../shared/store/useUiStore";
import { useGenerationStore } from "../store/useGenerationStore";

const ASPECT_RATIOS = {
  image: ["16:9", "1:1", "4:3", "3:4", "9:16"],
  video: ["16:9", "9:16", "1:1"],
  audio: [],
};

export default function AdvancedSettingsModal() {
  const isOpen = useUiStore((s) => s.activeModal === MODAL_KEYS.ADVANCED_SETTINGS);
  const closeModal = useUiStore((s) => s.closeModal);

  const mode = useGenerationStore((s) => s.activeMode);
  const settings = useGenerationStore((s) => s.drafts[s.activeMode].settings);
  const setSettings = useGenerationStore((s) => s.setSettings);

  const aspectRatios = ASPECT_RATIOS[mode] ?? [];

  return (
    <ModalShell open={isOpen} title="Advanced settings" onClose={closeModal}>
      <div className="settings-form">
        {aspectRatios.length > 0 && (
          <div className="settings-form__field">
            <label>Aspect ratio</label>
            <div className="settings-form__chips">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  className={`settings-form__chip ${
                    settings.aspect_ratio === ratio
                      ? "settings-form__chip--active"
                      : ""
                  }`}
                  onClick={() => setSettings({ aspect_ratio: ratio })}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="settings-form__field">
          <label htmlFor="settings-outputs">Number of outputs</label>
          <div className="settings-form__stepper">
            <button
              type="button"
              onClick={() =>
                setSettings({
                  num_outputs: Math.max(1, (settings.num_outputs ?? 1) - 1),
                })
              }
              disabled={(settings.num_outputs ?? 1) <= 1}
            >
              −
            </button>
            <input
              id="settings-outputs"
              type="number"
              min={1}
              max={4}
              value={settings.num_outputs ?? 1}
              onChange={(e) => {
                const n = Math.max(1, Math.min(4, Number(e.target.value) || 1));
                setSettings({ num_outputs: n });
              }}
            />
            <button
              type="button"
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
          <p className="settings-form__hint">Max 4 outputs per job.</p>
        </div>

        <div className="settings-form__field">
          <label htmlFor="settings-seed">Seed</label>
          <div className="settings-form__seed">
            <input
              id="settings-seed"
              type="number"
              placeholder="Random"
              value={settings.seed ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setSettings({ seed: v === "" ? null : Number(v) });
              }}
            />
            <button
              type="button"
              className="estate-button estate-button--ghost estate-button--small"
              onClick={() =>
                setSettings({ seed: Math.floor(Math.random() * 1_000_000) })
              }
            >
              Randomize
            </button>
            {settings.seed != null && (
              <button
                type="button"
                className="estate-button estate-button--ghost estate-button--small"
                onClick={() => setSettings({ seed: null })}
              >
                Clear
              </button>
            )}
          </div>
          <p className="settings-form__hint">
            Leave empty for random. Same seed + prompt + model → repeatable output.
          </p>
        </div>

        <div className="settings-form__actions">
          <button type="button" className="estate-button" onClick={closeModal}>
            Done
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
