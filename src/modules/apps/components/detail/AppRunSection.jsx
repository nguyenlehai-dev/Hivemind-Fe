import { useEffect, useState } from "react";

import { useFileUpload } from "../../../../shared/hooks/useFileUpload";
import { getErrorMessage } from "../../../../shared/lib/getErrorMessage";
import { useUploadAsset } from "../../../runway-custom/hooks/useUploadAsset";
import { useRunApp } from "../../hooks/useApps";
import SummaryRow from "./SummaryRow";

export default function AppRunSection({ app, onNavigateJobs }) {
  const [prompt, setPrompt] = useState(app.prompt);
  const [refs, setRefs] = useState([]);
  const runMutation = useRunApp();
  const upload = useUploadAsset();
  const needsReference = app.mode === "video";
  const canRun = !needsReference || refs.length > 0;

  const fileUpload = useFileUpload({
    uploadMutation: upload,
    max: 4,
    currentCount: refs.length,
    onUploaded: (asset) => setRefs((prev) => [...prev, asset]),
  });

  useEffect(() => {
    setPrompt(app.prompt);
  }, [app.id, app.prompt]);

  async function handleRun() {
    if (!canRun) return;
    try {
      await runMutation.mutateAsync({
        appId: app.id,
        overrides: {
          prompt,
          references: refs.map((r) => ({ asset_id: r.asset_id })),
        },
      });
      onNavigateJobs();
    } catch {
      /* surface via runError */
    }
  }

  const runError = getErrorMessage(runMutation);

  return (
    <section className="app-section">
      <h2 className="app-section__title">Run</h2>
      <p className="app-section__hint">
        Prompt + references apply only to this run. Preset is unchanged.
      </p>

      <div className="app-run-form">
        <div className="app-run-form__field">
          <label>Prompt</label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Leave blank to use preset prompt"
          />
        </div>

        {(app.mode === "image" || app.mode === "video") && (
          <div className="app-run-form__field">
            <label>
              References{" "}
              {needsReference && <span className="required">(required)</span>}
            </label>
            <div className="reference-dropzone__slots">
              {Array.from({ length: 4 }, (_, i) => refs[i] ?? null).map(
                (asset, i) => (
                  <div
                    key={asset?.asset_id ?? `slot-${i}`}
                    className={`reference-slot ${asset ? "reference-slot--filled" : ""}`}
                  >
                    {asset ? (
                      <>
                        <img src={asset.preview_url} alt={`ref ${i + 1}`} />
                        <button
                          type="button"
                          className="reference-slot__remove"
                          onClick={() =>
                            setRefs((prev) =>
                              prev.filter((r) => r.asset_id !== asset.asset_id),
                            )
                          }
                        >
                          ×
                        </button>
                      </>
                    ) : i === refs.length && refs.length < 4 ? (
                      <button
                        type="button"
                        className="reference-slot__add"
                        onClick={fileUpload.openPicker}
                        disabled={upload.isPending}
                      >
                        {upload.isPending ? "…" : "+"}
                      </button>
                    ) : (
                      <span className="reference-slot__placeholder" />
                    )}
                  </div>
                ),
              )}
            </div>
            <input {...fileUpload.inputProps} />
          </div>
        )}

        <div className="app-run-form__summary">
          <SummaryRow label="Model" value={app.model_id} />
          {app.settings?.aspect_ratio && (
            <SummaryRow label="Aspect" value={app.settings.aspect_ratio} />
          )}
          {app.settings?.num_outputs && (
            <SummaryRow label="Outputs" value={app.settings.num_outputs} />
          )}
          {app.settings?.seed != null && (
            <SummaryRow label="Seed" value={app.settings.seed} />
          )}
        </div>

        {runError && <div className="auth-form__error">{runError}</div>}

        <div className="app-run-form__actions">
          <button
            type="button"
            className="estate-button"
            onClick={handleRun}
            disabled={!canRun || runMutation.isPending}
          >
            {runMutation.isPending ? "Submitting…" : "Run app"}
          </button>
        </div>
      </div>
    </section>
  );
}
