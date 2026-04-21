import PreviewStage from "./PreviewStage";
import JobStatusPanel from "./JobStatusPanel";

const presets = [
  "Seedance 2.0",
  "Multi-Shot Video",
  "Runway Characters",
  "Gen-4.5",
  "Kling 3.0",
  "Nano Banana 2",
];

export default function RightPreviewPanel({ authStatus, currentJob }) {
  return (
    <section className="preview-panel">
      <div className="preview-panel__hero">
        <h1>Everything you need to make anything you want</h1>
        <div className="preset-row">
          {presets.map((preset) => (
            <span key={preset} className="preset-chip">
              {preset}
            </span>
          ))}
        </div>
      </div>
      <PreviewStage authStatus={authStatus} currentJob={currentJob} />
      <JobStatusPanel currentJob={currentJob} />
    </section>
  );
}
