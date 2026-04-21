export default function PreviewStage({ authStatus, currentJob }) {
  if (authStatus !== "connected") {
    return (
      <div className="preview-stage preview-stage--empty">
        <h2>Connect Runway to unlock generation.</h2>
        <p>Login is delegated to the backend so the browser stays clean and stateless.</p>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="preview-stage preview-stage--empty">
        <h2>Everything you need to shape a scene.</h2>
        <p>
          Start with a prompt, add references, choose a model, and the preview panel
          becomes your result workspace.
        </p>
      </div>
    );
  }

  if (currentJob.status === "queued" || currentJob.status === "running") {
    return (
      <div className="preview-stage preview-stage--empty">
        <h2>{currentJob.status === "queued" ? "Job queued" : "Rendering in progress"}</h2>
        <p>{currentJob.prompt}</p>
      </div>
    );
  }

  if (currentJob.status === "failed") {
    return (
      <div className="preview-stage preview-stage--empty">
        <h2>Generation failed</h2>
        <p>{currentJob.error || "The backend returned a failed job state."}</p>
      </div>
    );
  }

  return (
    <div className="preview-stage">
      <img
        src={currentJob.resultUrls[0]}
        alt={currentJob.prompt}
        className="preview-stage__image"
      />
    </div>
  );
}
