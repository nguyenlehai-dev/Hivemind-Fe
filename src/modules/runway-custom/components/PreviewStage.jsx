import ResultMedia from "../../../shared/ui/ResultMedia";
import { useGenerationJob } from "../hooks/useGenerationJob";
import { useGenerationStore } from "../store/useGenerationStore";

export default function PreviewStage() {
  const currentJob = useGenerationStore((s) => s.currentJob);
  const mode = useGenerationStore((s) => s.activeMode);
  const { data: job, isLoading } = useGenerationJob(currentJob?.job_id);

  if (!currentJob) {
    return <MarketingStage mode={mode} />;
  }

  return (
    <div className="preview-stage preview-stage--workspace">
      <div className="preview-stage__header">
        <span className="estate-eyebrow">Job</span>
        <div>
          <strong>{job?.model_id ?? "…"}</strong>
          <span className="preview-stage__meta">
            {job?.status ?? (isLoading ? "loading" : "queued")}
          </span>
        </div>
      </div>

      {job?.result_urls?.[0] && (
        <a
          className="preview-stage__download"
          href={job.result_urls[0]}
          download
          target="_blank"
          rel="noreferrer"
        >
          Download result
        </a>
      )}
      <div className="preview-stage__canvas">
        {job?.result_urls?.[0] ? (
          <ResultMedia
            url={job.result_urls[0]}
            mode={job.mode}
            alt={job.prompt || job.id}
          />
        ) : (
          <div className="preview-stage__placeholder">
            <span className="preview-stage__spinner" aria-hidden="true" />
            <span>
              {job?.status === "running" ? "Rendering your generation…" : "Job queued, starting soon"}
            </span>
          </div>
        )}
      </div>

      {job?.prompt && (
        <div className="preview-stage__prompt">
          <span className="estate-eyebrow">Prompt</span>
          <p>{job.prompt}</p>
        </div>
      )}
    </div>
  );
}

function MarketingStage({ mode }) {
  return (
    <div className="preview-stage preview-stage--marketing">
      <span className="estate-eyebrow">Preview</span>
      <h2>Start by composing a {mode} generation</h2>
      <p>
        Drop references, write a prompt, pick a model from the picker modal and hit
        Generate. Results stream into this stage.
      </p>
      <ul className="preview-stage__tips">
        <li>Use <kbd>⌘</kbd> <kbd>Enter</kbd> to generate from the prompt box.</li>
        <li>Paste images directly into the reference zone.</li>
        <li>Switching mode keeps a separate draft per mode.</li>
      </ul>
    </div>
  );
}
