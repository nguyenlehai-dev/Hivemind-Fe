import { useNavigate } from "react-router-dom";

import { useGenerationStore } from "../store/useGenerationStore";

export function useRemixJob() {
  const navigate = useNavigate();
  const setMode = useGenerationStore((s) => s.setMode);
  const setPrompt = useGenerationStore((s) => s.setPrompt);
  const setModelId = useGenerationStore((s) => s.setModelId);
  const setSettings = useGenerationStore((s) => s.setSettings);
  const clearCurrentJob = useGenerationStore((s) => s.clearCurrentJob);

  return function remix(job) {
    if (!job) return;
    setMode(job.mode ?? "image");
    queueMicrotask(() => {
      setPrompt(job.prompt ?? "");
      setModelId(job.model_id ?? null);
      if (job.settings && Object.keys(job.settings).length) {
        setSettings(job.settings);
      }
      clearCurrentJob();
      navigate("/custom");
    });
  };
}
