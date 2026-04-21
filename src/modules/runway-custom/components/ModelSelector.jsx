import { useMemo } from "react";

import { useRunwayModels } from "../hooks/useModels";
import { useGenerationStore } from "../store/useGenerationStore";
import { MODAL_KEYS, useUiStore } from "../../../shared/store/useUiStore";

export default function ModelSelector() {
  const mode = useGenerationStore((s) => s.activeMode);
  const modelId = useGenerationStore((s) => s.drafts[s.activeMode].modelId);
  const openModal = useUiStore((s) => s.openModal);
  const { data: models = [] } = useRunwayModels(mode);

  const current = useMemo(
    () => models.find((m) => m.id === modelId) ?? null,
    [models, modelId],
  );

  return (
    <button
      type="button"
      className="model-selector"
      onClick={() => openModal(MODAL_KEYS.MODEL_PICKER)}
    >
      <div className="model-selector__text">
        <span className="model-selector__label">Model</span>
        {current ? (
          <div className="model-selector__current">
            <strong>{current.name}</strong>
            <span>{current.vendor}</span>
          </div>
        ) : (
          <span className="model-selector__placeholder">
            {models.length ? "Choose a model" : "No models for this mode"}
          </span>
        )}
      </div>
      <span className="model-selector__chevron" aria-hidden="true">
        ⌄
      </span>
    </button>
  );
}
