import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AppShell from "../../shared/ui/AppShell";
import { useUploadAsset } from "../runway-custom/hooks/useUploadAsset";
import { useApp, useDeleteApp, useRunApp, useUpdateApp } from "./hooks/useApps";

export default function AppDetailPage() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { data: app, isLoading, isError, error } = useApp(appId);

  return (
    <AppShell className="apps-page" withSidebar>
      <div className="apps-main">
        <div className="apps-container">
          <div className="apps-header apps-header--with-back">
            <Link to="/apps" className="back-link">← Apps</Link>
            {isLoading && <h1>Loading…</h1>}
            {isError && (
              <h1 className="jobs-empty--error">
                {error?.response?.status === 404
                  ? "App not found."
                  : `Could not load app: ${error?.message}`}
              </h1>
            )}
            {app && (
              <>
                <span className={`app-mode-chip app-mode-chip--${app.mode}`}>
                  {app.mode}
                </span>
                <h1>{app.name}</h1>
                {app.description && <p>{app.description}</p>}
              </>
            )}
          </div>

          {app && (
            <>
              <AppRunSection app={app} onNavigateJobs={() => navigate("/jobs")} />
              <AppEditSection app={app} />
              <AppDangerZone
                app={app}
                onDeleted={() => navigate("/apps")}
              />
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

/* ========================================================================== */

function AppRunSection({ app, onNavigateJobs }) {
  const [prompt, setPrompt] = useState(app.prompt);
  const [refs, setRefs] = useState([]);
  const runMutation = useRunApp();
  const upload = useUploadAsset();
  const inputRef = useRef(null);
  const needsReference = app.mode === "video";
  const canRun = !needsReference || refs.length > 0;

  useEffect(() => {
    setPrompt(app.prompt);
  }, [app.id, app.prompt]);

  async function handleFiles(files) {
    const list = Array.from(files || []).slice(0, 4 - refs.length);
    for (const file of list) {
      try {
        const asset = await upload.mutateAsync(file);
        setRefs((prev) => [...prev, asset]);
      } catch {
        /* shown via upload.error */
      }
    }
  }

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
      /* shown */
    }
  }

  const runError =
    runMutation.error?.response?.data?.error?.message ??
    runMutation.error?.message;

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
                        onClick={() => inputRef.current?.click()}
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
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
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

function SummaryRow({ label, value }) {
  return (
    <div className="app-run-form__summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

/* ========================================================================== */

function AppEditSection({ app }) {
  const [name, setName] = useState(app.name);
  const [description, setDescription] = useState(app.description);
  const [prompt, setPrompt] = useState(app.prompt);
  const [aspectRatio, setAspectRatio] = useState(
    app.settings?.aspect_ratio ?? "",
  );
  const [seed, setSeed] = useState(
    app.settings?.seed ?? app.settings?.seed === 0 ? String(app.settings.seed) : "",
  );
  const updateMutation = useUpdateApp();

  useEffect(() => {
    setName(app.name);
    setDescription(app.description);
    setPrompt(app.prompt);
    setAspectRatio(app.settings?.aspect_ratio ?? "");
    setSeed(app.settings?.seed != null ? String(app.settings.seed) : "");
  }, [app.id, app.name, app.description, app.prompt, app.settings]);

  const dirty =
    name !== app.name ||
    description !== app.description ||
    prompt !== app.prompt ||
    aspectRatio !== (app.settings?.aspect_ratio ?? "") ||
    seed !== (app.settings?.seed != null ? String(app.settings.seed) : "");

  async function handleSave() {
    try {
      const settingsPatch = {
        ...(app.settings ?? {}),
        aspect_ratio: aspectRatio || app.settings?.aspect_ratio || "16:9",
        seed: seed === "" ? null : Number(seed),
        num_outputs: app.settings?.num_outputs ?? 1,
      };
      await updateMutation.mutateAsync({
        appId: app.id,
        patch: {
          name,
          description,
          prompt,
          settings: settingsPatch,
        },
      });
    } catch {
      /* shown */
    }
  }

  const error =
    updateMutation.error?.response?.data?.error?.message ??
    updateMutation.error?.message;

  return (
    <section className="app-section">
      <h2 className="app-section__title">Edit preset</h2>
      <p className="app-section__hint">
        Changes save immediately. Running the app afterwards uses the new preset.
      </p>

      <div className="app-edit-form">
        <div className="app-edit-form__field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="app-edit-form__field">
          <label>Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="app-edit-form__field">
          <label>Prompt</label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div className="app-edit-form__row">
          <div className="app-edit-form__field">
            <label>Aspect ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
            >
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="1:1">1:1</option>
              <option value="4:3">4:3</option>
              <option value="3:4">3:4</option>
            </select>
          </div>
          <div className="app-edit-form__field">
            <label>Seed</label>
            <input
              type="number"
              placeholder="(random)"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="auth-form__error">{error}</div>}

        <div className="app-edit-form__actions">
          <button
            type="button"
            className="estate-button"
            onClick={handleSave}
            disabled={!dirty || updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */

function AppDangerZone({ app, onDeleted }) {
  const deleteMutation = useDeleteApp();

  function handleDelete() {
    if (!window.confirm(`Delete app "${app.name}" permanently?`)) return;
    deleteMutation.mutate(app.id, { onSuccess: onDeleted });
  }

  return (
    <section className="app-section app-section--danger">
      <h2 className="app-section__title">Danger zone</h2>
      <p className="app-section__hint">
        Removing an app doesn't affect past generations it produced.
      </p>
      <button
        type="button"
        className="estate-button estate-button--ghost"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? "Deleting…" : "Delete app"}
      </button>
    </section>
  );
}
