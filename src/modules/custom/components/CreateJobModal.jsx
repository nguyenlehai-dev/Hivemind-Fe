import { useEffect, useMemo, useState } from "react";

import ModalShell from "../../../shared/ui/ModalShell";
import { useRunwayModels } from "../hooks/useModels";
import { useCreateGeneration } from "../hooks/useCreateGeneration";

const MODES = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "audio", label: "Audio" },
];

export default function CreateJobModal({ open, onClose }) {
  const [mode, setMode] = useState("image");
  const [modelId, setModelId] = useState("");
  const [prompt, setPrompt] = useState("");

  const models = useRunwayModels(mode);
  const createJob = useCreateGeneration();

  const availableModels = useMemo(() => models.data ?? [], [models.data]);

  useEffect(() => {
    if (!availableModels.length) {
      setModelId("");
      return;
    }
    if (!availableModels.some((m) => m.id === modelId)) {
      setModelId(availableModels[0].id);
    }
  }, [availableModels, modelId]);

  useEffect(() => {
    if (!open) {
      createJob.reset();
      setPrompt("");
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(event) {
    event.preventDefault();
    if (!modelId) return;
    try {
      await createJob.mutateAsync({
        mode,
        model_id: modelId,
        prompt: prompt.trim(),
      });
      onClose?.();
    } catch {
      // error shown below via createJob.error
    }
  }

  const errorMessage =
    createJob.error?.response?.data?.error?.message ??
    createJob.error?.message;

  return (
    <ModalShell open={open} title="New generation job" onClose={onClose}>
      <form className="job-form" onSubmit={handleSubmit}>
        <div className="job-form__field">
          <label>Mode</label>
          <div className="job-form__mode-group">
            {MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                className={`job-form__mode ${
                  mode === m.value ? "job-form__mode--active" : ""
                }`}
                onClick={() => setMode(m.value)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="job-form__field">
          <label htmlFor="job-model">Model</label>
          <select
            id="job-model"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            disabled={models.isLoading || !availableModels.length}
          >
            {models.isLoading && <option>Loading…</option>}
            {!models.isLoading && !availableModels.length && (
              <option>No models for this mode</option>
            )}
            {availableModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} · {m.vendor}
              </option>
            ))}
          </select>
        </div>

        <div className="job-form__field">
          <label htmlFor="job-prompt">Prompt</label>
          <textarea
            id="job-prompt"
            rows={4}
            placeholder="Describe what you want to generate…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {errorMessage && <div className="job-form__error">{errorMessage}</div>}

        <div className="job-form__actions">
          <button
            type="button"
            className="estate-button estate-button--ghost"
            onClick={onClose}
            disabled={createJob.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="estate-button"
            disabled={createJob.isPending || !modelId}
          >
            {createJob.isPending ? "Creating…" : "Create job"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
