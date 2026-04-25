export default function JobActions({
  job,
  onClose,
  onCancel,
  onRetry,
  onDelete,
  onRemix,
  cancelPending,
  retryPending,
}) {
  const isTerminal = job.status === "completed" || job.status === "failed";
  const canCancel = job.status === "queued" || job.status === "running";
  const canRetry = job.status === "failed";
  const resultUrl = job.result_urls?.[0];

  return (
    <div className="job-detail__actions">
      <button
        type="button"
        className="estate-button estate-button--ghost"
        onClick={onClose}
      >
        Close
      </button>
      {canCancel && (
        <button
          type="button"
          className="estate-button estate-button--ghost"
          onClick={onCancel}
          disabled={cancelPending}
        >
          {cancelPending ? "Cancelling…" : "Cancel job"}
        </button>
      )}
      {isTerminal && (
        <button
          type="button"
          className="estate-button estate-button--ghost"
          onClick={onDelete}
          disabled={cancelPending}
        >
          Delete
        </button>
      )}
      {canRetry && (
        <button
          type="button"
          className="estate-button estate-button--ghost"
          onClick={onRetry}
          disabled={retryPending}
        >
          {retryPending ? "Retrying…" : "Retry"}
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
        onClick={onRemix}
        disabled={!job.model_id}
      >
        Remix in composer
      </button>
    </div>
  );
}
