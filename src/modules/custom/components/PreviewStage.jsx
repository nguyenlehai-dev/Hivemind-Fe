import { useEffect, useMemo, useState } from "react";

import ResultMedia from "../../../shared/ui/ResultMedia";
import { CUSTOM_PRESETS } from "../customPresets";
import { useGenerationJob } from "../hooks/useGenerationJob";
import { useGenerationStore } from "../store/useGenerationStore";

export default function PreviewStage({ onPresetOpen }) {
  const currentJob = useGenerationStore((s) => s.currentJob);
  const mode = useGenerationStore((s) => s.activeMode);
  const selectedPreset = useGenerationStore((s) => s.selectedPresetByMode[s.activeMode]);
  const { data: job, isLoading } = useGenerationJob(currentJob?.job_id);

  if (!currentJob) {
    return (
      <MarketingStage
        mode={mode}
        selectedPreset={selectedPreset}
        onPresetOpen={onPresetOpen}
      />
    );
  }

  return (
    <div className="preview-stage preview-stage--workspace">
      <div className="preview-stage__header">
        <span className="estate-eyebrow">Job</span>
        <div>
          <strong>{job?.model_id ?? "..."}</strong>
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
              {job?.status === "running"
                ? "Rendering your generation..."
                : "Job queued, starting soon"}
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

function MarketingStage({ mode, selectedPreset, onPresetOpen }) {
  const selectPreset = useGenerationStore((s) => s.selectPreset);
  const presets = useMemo(() => CUSTOM_PRESETS[mode] ?? [], [mode]);
  const [previewPresetId, setPreviewPresetId] = useState(
    selectedPreset?.id ?? presets[0]?.id ?? null,
  );

  useEffect(() => {
    setPreviewPresetId(selectedPreset?.id ?? presets[0]?.id ?? null);
  }, [mode, selectedPreset?.id, presets]);

  const previewPreset =
    presets.find((preset) => preset.id === previewPresetId) ??
    selectedPreset ??
    presets[0] ??
    null;

  const fallback = {
    title: "Everything you need to make anything you want",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&h=900&q=80",
    caption: "Generation preview",
  };

  return (
    <div className="preview-stage preview-stage--marketing">
      <div className="preview-stage__hero-body">
        <h2>{previewPreset?.name ?? fallback.title}</h2>
        {previewPreset?.description && (
          <p className="preview-stage__hero-copy">{previewPreset.description}</p>
        )}

        <div className="preview-stage__chips">
          {presets.slice(0, 5).map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`preview-stage__chip${
                previewPreset?.id === preset.id ? " preview-stage__chip--active" : ""
              }`}
              onClick={() => setPreviewPresetId(preset.id)}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="preview-stage__hero-media preview-stage__hero-media--button"
          onClick={() => {
            if (!previewPreset) return;
            selectPreset(previewPreset);
            onPresetOpen?.(previewPreset);
          }}
          disabled={!previewPreset}
        >
          <img
            src={upscalePresetImage(previewPreset?.thumbnail) ?? fallback.image}
            alt={previewPreset?.name ?? fallback.caption}
          />
        </button>
      </div>
    </div>
  );
}

function upscalePresetImage(url) {
  if (!url) return null;
  return url
    .replace("w=160&h=160", "w=1400&h=900")
    .replace("w=160", "w=1400")
    .replace("h=160", "h=900");
}
