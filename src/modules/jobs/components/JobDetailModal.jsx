import ModalShell from "../../../shared/ui/ModalShell";
import ResultMedia from "../../../shared/ui/ResultMedia";
import { MODAL_KEYS, useUiStore } from "../../../shared/store/useUiStore";
import { useCancelGeneration } from "../../runway-custom/hooks/useCancelGeneration";
import { useGenerationJob } from "../../runway-custom/hooks/useGenerationJob";
import { useRemixJob } from "../../runway-custom/hooks/useRemixJob";
import { useRetryGeneration } from "../../runway-custom/hooks/useRetryGeneration";

export default function JobDetailModal() {
  const isOpen = useUiStore((s) => s.activeModal === MODAL_KEYS.RESULT_DETAIL);
  const payload = useUiStore((s) => s.modalPayload);
  const closeModal = useUiStore((s) => s.closeModal);
  const remix = useRemixJob();
  const cancelMutation = useCancelGeneration();
  const retryMutation = useRetryGeneration();

  const jobId = payload?.jobId ?? null;
  const { data: job, isLoading, isError } = useGenerationJob(isOpen ? jobId : null);
  const isTerminal = job && (job.status === "completed" || job.status === "failed");
  const canCancel = job && (job.status === "queued" || job.status === "running");
  const canRetry = job && job.status === "failed";
  const resultUrl = job?.result_urls?.[0];

  function handleRemix() {
    remix(job);
    closeModal();
  }

  function handleCancel() {
    if (jobId) cancelMutation.mutate(jobId);
  }

  async function handleRetry() {
    if (!jobId) return;
    try {
      await retryMutation.mutateAsync(jobId);
      closeModal();
    } catch {
      /* error visible via mutation */
    }
  }

  function handleDelete() {
    if (!jobId) return;
    if (!window.confirm("Delete this job permanently?")) return;
    cancelMutation.mutate(jobId, {
      onSuccess: () => closeModal(),
    });
  }

  return (
    <ModalShell
      open={isOpen}
      title="Generation detail"
      onClose={closeModal}
      width="modal--wide"
    >
      <div className="job-detail">
        {isLoading && <div className="job-detail__empty">Loading…</div>}
        {isError && (
          <div className="job-detail__empty job-detail__empty--error">
            Could not load this job.
          </div>
        )}

        {job && (
          <>
            <div className="job-detail__canvas">
              {job.result_urls?.[0] ? (
                <ResultMedia
                  url={job.result_urls[0]}
                  mode={job.mode}
                  variant="detail"
                  alt={job.prompt || job.id}
                />
              ) : (
                <div className="job-detail__placeholder">
                  <span className="preview-stage__spinner" aria-hidden="true" />
                  <span>{job.status}</span>
                </div>
              )}
            </div>

            <div className="job-detail__meta">
              <Row label="Status">
                <span className={`job-status job-status--${job.status} job-status--inline`}>
                  {job.status}
                </span>
              </Row>
              <Row label="Mode">{job.mode}</Row>
              <Row label="Model">{job.model_id}</Row>
              <Row label="Created">{formatTime(job.created_at)}</Row>
              {job.prompt && <Row label="Prompt" block>{job.prompt}</Row>}
              {job.settings && Object.keys(job.settings).length > 0 && (
                <Row label="Settings" block>
                  <ul className="job-detail__settings">
                    {Object.entries(job.settings)
                      .filter(
                        ([, v]) => v !== null && v !== undefined && v !== "",
                      )
                      .map(([key, value]) => (
                        <li key={key}>
                          <span>{formatKey(key)}</span>
                          <strong>{formatValue(value)}</strong>
                        </li>
                      ))}
                  </ul>
                </Row>
              )}
              {job.error && (
                <Row label="Error" block>
                  <span className="job-detail__error">{job.error}</span>
                </Row>
              )}
            </div>

            <div className="job-detail__actions">
              <button
                type="button"
                className="estate-button estate-button--ghost"
                onClick={closeModal}
              >
                Close
              </button>
              {canCancel && (
                <button
                  type="button"
                  className="estate-button estate-button--ghost"
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? "Cancelling…" : "Cancel job"}
                </button>
              )}
              {isTerminal && (
                <button
                  type="button"
                  className="estate-button estate-button--ghost"
                  onClick={handleDelete}
                  disabled={cancelMutation.isPending}
                >
                  Delete
                </button>
              )}
              {canRetry && (
                <button
                  type="button"
                  className="estate-button estate-button--ghost"
                  onClick={handleRetry}
                  disabled={retryMutation.isPending}
                >
                  {retryMutation.isPending ? "Retrying…" : "Retry"}
                </button>
              )}
              {resultUrl && (
                <a
                  className="estate-button estate-button--ghost"
                  href={resultUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                >
                  Download
                </a>
              )}
              <button
                type="button"
                className="estate-button"
                onClick={handleRemix}
                disabled={!job.model_id}
              >
                Remix in composer
              </button>
            </div>
          </>
        )}
      </div>
    </ModalShell>
  );
}

function Row({ label, block, children }) {
  return (
    <div className={`job-detail__row ${block ? "job-detail__row--block" : ""}`}>
      <span className="job-detail__label">{label}</span>
      <div className="job-detail__value">{children}</div>
    </div>
  );
}

function formatTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function formatKey(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
