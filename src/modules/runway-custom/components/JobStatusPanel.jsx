export default function JobStatusPanel({ currentJob }) {
  return (
    <section className="status-panel">
      <div className="status-panel__header">
        <h3>Job Status</h3>
        <span>{currentJob ? currentJob.status : "idle"}</span>
      </div>
      {currentJob ? (
        <dl className="status-panel__grid">
          <div>
            <dt>Job</dt>
            <dd>{currentJob.id}</dd>
          </div>
          <div>
            <dt>Model</dt>
            <dd>{currentJob.modelId}</dd>
          </div>
          <div>
            <dt>Prompt</dt>
            <dd>{currentJob.prompt}</dd>
          </div>
        </dl>
      ) : (
        <p className="status-panel__empty">No active job yet.</p>
      )}
    </section>
  );
}
