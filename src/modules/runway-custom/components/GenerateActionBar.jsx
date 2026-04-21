import { useCancelGeneration } from "../hooks/useCancelGeneration";
import { useCreateGeneration } from "../hooks/useCreateGeneration";
import { useGenerationJob } from "../hooks/useGenerationJob";
import { useGenerationMode } from "../hooks/useCapabilities";
import { useGenerationStore } from "../store/useGenerationStore";

export default function GenerateActionBar() {
  const mode = useGenerationStore((s) => s.activeMode);
  const draft = useGenerationStore((s) => s.drafts[s.activeMode]);
  const currentJob = useGenerationStore((s) => s.currentJob);
  const setCurrentJob = useGenerationStore((s) => s.setCurrentJob);
  const createJob = useCreateGeneration();
  const cancelMutation = useCancelGeneration();
  const jobDetail = useGenerationJob(currentJob?.job_id);
  const genMode = useGenerationMode(mode, draft.references);

  const hasPrompt = draft.prompt.trim().length > 0;
  const hasReference = draft.references.length > 0;
  const hasModel = Boolean(draft.modelId);
  const canGenerate = hasModel && (hasPrompt || hasReference);

  const phase = resolvePhase({
    createPending: createJob.isPending,
    createError: createJob.isError,
    jobStatus: jobDetail.data?.status,
    canGenerate,
  });

  async function handleGenerate() {
    if (!canGenerate) return;
    try {
      const response = await createJob.mutateAsync({
        mode,
        model_id: draft.modelId,
        prompt: draft.prompt.trim(),
        references: draft.references.map((r) => ({ asset_id: r.asset_id })),
        settings: draft.settings,
      });
      setCurrentJob(response);
    } catch {
      /* error displayed in bar */
    }
  }

  const errorMessage =
    createJob.error?.response?.data?.error?.message ??
    createJob.error?.message;

  return (
    <div className={`generate-bar generate-bar--${phase}`}>
      <div className="generate-bar__status">
        <span className={`generate-bar__dot generate-bar__dot--${phase}`} />
        <span>{PHASE_LABEL[phase]}</span>
      </div>
      <div className="generate-bar__buttons">
        <button
          type="button"
          className="estate-button generate-bar__button"
          onClick={handleGenerate}
          disabled={phase === "submitting" || phase === "queued" || phase === "running" || !canGenerate}
        >
          {phase === "submitting"
            ? "Submitting…"
            : phase === "queued" || phase === "running"
              ? "Generating…"
              : "Generate"}
        </button>

        {(phase === "queued" || phase === "running") && currentJob?.job_id && (
          <button
            type="button"
            className="estate-button estate-button--ghost generate-bar__cancel"
            onClick={() => cancelMutation.mutate(currentJob.job_id)}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? "Cancelling…" : "Cancel"}
          </button>
        )}
      </div>

      <div
        className={`generate-bar__mode generate-bar__mode--${genMode.kind}`}
        title={genMode.reason}
      >
        <span className={`generate-bar__mode-dot generate-bar__mode-dot--${genMode.kind}`} />
        <span className="generate-bar__mode-label">
          {genMode.kind === "live" ? "Live · Runway API" : genMode.kind === "mock" ? "Mock mode" : "…"}
        </span>
      </div>
      <p className="generate-bar__mode-reason">{genMode.reason}</p>

      {errorMessage && <p className="generate-bar__error">{errorMessage}</p>}
    </div>
  );
}

const PHASE_LABEL = {
  disabled: "Add prompt, reference, and model to generate",
  ready: "Ready to generate",
  submitting: "Submitting request",
  queued: "Queued",
  running: "Running",
  completed: "Completed",
  error: "Error – try again",
};

function resolvePhase({ createPending, createError, jobStatus, canGenerate }) {
  if (createPending) return "submitting";
  if (createError) return "error";
  if (jobStatus === "queued") return "queued";
  if (jobStatus === "running") return "running";
  if (jobStatus === "completed") return "completed";
  if (jobStatus === "failed") return "error";
  return canGenerate ? "ready" : "disabled";
}
