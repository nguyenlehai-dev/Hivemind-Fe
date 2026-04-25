import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronDownIcon, ImageIcon } from "../../../shared/icons";
import FloatingPanel from "../../../shared/ui/FloatingPanel";
import { useCancelGeneration } from "../hooks/useCancelGeneration";
import { useCreateGeneration } from "../hooks/useCreateGeneration";
import { useGenerationJob } from "../hooks/useGenerationJob";
import { useGenerationMode } from "../hooks/useCapabilities";
import ModelSelector from "./ModelSelector";
import {
  buildPresetPrompt,
  collectPresetAssets,
  CUSTOM_PRESETS,
  getMissingPresetRequirements,
} from "../customPresets";
import { useGenerationStore } from "../store/useGenerationStore";

export default function GenerateActionBar() {
  const [isPresetMenuOpen, setIsPresetMenuOpen] = useState(false);
  const presetMenuRef = useRef(null);
  const mode = useGenerationStore((s) => s.activeMode);
  const draft = useGenerationStore((s) => s.drafts[s.activeMode]);
  const selectedPreset = useGenerationStore((s) => s.selectedPresetByMode[s.activeMode]);
  const presetInputs = useGenerationStore((s) => s.presetInputsByMode[s.activeMode] ?? {});
  const currentJob = useGenerationStore((s) => s.currentJob);
  const setCurrentJob = useGenerationStore((s) => s.setCurrentJob);
  const selectPreset = useGenerationStore((s) => s.selectPreset);
  const createJob = useCreateGeneration();
  const cancelMutation = useCancelGeneration();
  const jobDetail = useGenerationJob(currentJob?.job_id);

  const appsForMode = useMemo(() => CUSTOM_PRESETS[mode] ?? [], [mode]);
  const presetReferences = useMemo(
    () => collectPresetAssets(selectedPreset, presetInputs),
    [selectedPreset, presetInputs],
  );
  const effectiveReferences = selectedPreset ? presetReferences : draft.references;
  const effectivePrompt = useMemo(
    () =>
      selectedPreset
        ? buildPresetPrompt(selectedPreset, presetInputs, draft.prompt).trim()
        : draft.prompt.trim(),
    [selectedPreset, presetInputs, draft.prompt],
  );
  const missingPresetRequirements = useMemo(
    () => getMissingPresetRequirements(selectedPreset, presetInputs),
    [selectedPreset, presetInputs],
  );
  const genMode = useGenerationMode(mode, effectiveReferences);

  const hasPrompt = effectivePrompt.length > 0;
  const hasReference = effectiveReferences.length > 0;
  const hasModel = Boolean(draft.modelId);
  const canGenerate =
    hasModel &&
    missingPresetRequirements.length === 0 &&
    (hasPrompt || hasReference);

  const phase = resolvePhase({
    createPending: createJob.isPending,
    createError: createJob.isError,
    jobStatus: jobDetail.data?.status,
    canGenerate,
  });

  useEffect(() => {
    if (!isPresetMenuOpen) return undefined;

    function handlePointerDown(event) {
      if (!presetMenuRef.current?.contains(event.target)) {
        setIsPresetMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsPresetMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPresetMenuOpen]);

  async function handleGenerate() {
    if (!canGenerate) return;
    try {
      const response = await createJob.mutateAsync({
        mode,
        model_id: draft.modelId,
        prompt: effectivePrompt,
        references: effectiveReferences.map((r) => ({ asset_id: r.asset_id })),
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
  const generationHint =
    missingPresetRequirements.length > 0
      ? `Preset requires: ${missingPresetRequirements.join(", ")}`
      : genMode.reason;

  return (
    <div className={`generate-bar generate-bar--${phase}`}>
      <div className="generate-bar__controls">
        <div
          ref={presetMenuRef}
          className={`generate-bar__select-wrap${
            isPresetMenuOpen ? " generate-bar__select-wrap--open" : ""
          }`}
        >
          <button
            type="button"
            className="generate-bar__select-button"
            onClick={() => setIsPresetMenuOpen((value) => !value)}
          >
            <span>Apps</span>
            <ChevronDownIcon className="generate-bar__select-chevron" />
          </button>

          {isPresetMenuOpen && (
            <FloatingPanel
              className="preset-menu"
              bodyClassName="preset-menu__body"
              title={`Apps to do more with your ${mode}`}
            >
              <div className="preset-menu__list">
                {appsForMode.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    className={`preset-menu__item${
                      selectedPreset?.id === app.id ? " preset-menu__item--active" : ""
                    }`}
                    onClick={() => {
                      selectPreset(app);
                      setIsPresetMenuOpen(false);
                    }}
                  >
                    <span className="preset-menu__thumb" aria-hidden="true">
                      {app.thumbnail ? (
                        <img
                          className="preset-menu__thumb-image"
                          src={app.thumbnail}
                          alt=""
                        />
                      ) : (
                        <ImageIcon className="preset-menu__thumb-icon" />
                      )}
                    </span>
                    <span className="preset-menu__content">
                      <strong>{app.name}</strong>
                      <span>{app.description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </FloatingPanel>
          )}
        </div>

        <ModelSelector />

        <button
          type="button"
          className="estate-button generate-bar__button"
          onClick={handleGenerate}
          disabled={
            phase === "submitting" ||
            phase === "queued" ||
            phase === "running" ||
            !canGenerate
          }
        >
          {phase === "submitting"
            ? "Submitting..."
            : phase === "queued" || phase === "running"
              ? "Generating..."
              : "Generate"}
        </button>
      </div>

      <div className="generate-bar__meta">
        {(phase === "queued" || phase === "running") && currentJob?.job_id && (
          <button
            type="button"
            className="estate-button estate-button--ghost generate-bar__cancel"
            onClick={() => cancelMutation.mutate(currentJob.job_id)}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? "Cancelling..." : "Cancel"}
          </button>
        )}
        <p className="generate-bar__mode-reason">{generationHint}</p>
      </div>

      {errorMessage && <p className="generate-bar__error">{errorMessage}</p>}
    </div>
  );
}

function resolvePhase({ createPending, createError, jobStatus, canGenerate }) {
  if (createPending) return "submitting";
  if (createError) return "error";
  if (jobStatus === "queued") return "queued";
  if (jobStatus === "running") return "running";
  if (jobStatus === "completed") return "completed";
  if (jobStatus === "failed") return "error";
  return canGenerate ? "ready" : "disabled";
}
