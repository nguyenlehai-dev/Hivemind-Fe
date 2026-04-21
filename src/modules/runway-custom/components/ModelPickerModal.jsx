import { useEffect, useMemo, useState } from "react";

import ModalShell from "../../../shared/ui/ModalShell";
import { MODAL_KEYS, useUiStore } from "../../../shared/store/useUiStore";
import { useRunwayModels } from "../hooks/useModels";
import { useGenerationStore } from "../store/useGenerationStore";

const ALL_FILTER = "all";

export default function ModelPickerModal() {
  const isOpen = useUiStore((s) => s.activeModal === MODAL_KEYS.MODEL_PICKER);
  const closeModal = useUiStore((s) => s.closeModal);
  const mode = useGenerationStore((s) => s.activeMode);
  const modelId = useGenerationStore((s) => s.drafts[s.activeMode].modelId);
  const setModelId = useGenerationStore((s) => s.setModelId);

  const { data: models = [], isLoading, isError } = useRunwayModels(mode);

  const [search, setSearch] = useState("");
  const [vendor, setVendor] = useState(ALL_FILTER);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setVendor(ALL_FILTER);
    }
  }, [isOpen]);

  const vendors = useMemo(() => {
    const set = new Set(models.map((m) => m.vendor));
    return [ALL_FILTER, ...Array.from(set)];
  }, [models]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return models.filter((m) => {
      if (vendor !== ALL_FILTER && m.vendor !== vendor) return false;
      if (!term) return true;
      return (
        m.name.toLowerCase().includes(term) ||
        m.id.toLowerCase().includes(term) ||
        m.vendor.toLowerCase().includes(term)
      );
    });
  }, [models, search, vendor]);

  function handlePick(id) {
    setModelId(id);
    closeModal();
  }

  return (
    <ModalShell open={isOpen} title="Select a model" onClose={closeModal} width="modal--wide">
      <div className="model-picker">
        <div className="model-picker__search">
          <input
            type="text"
            autoFocus
            placeholder="Search models, vendors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="model-picker__filters" role="tablist">
          {vendors.map((v) => (
            <button
              key={v}
              type="button"
              className={`model-picker__filter ${
                vendor === v ? "model-picker__filter--active" : ""
              }`}
              onClick={() => setVendor(v)}
            >
              {v === ALL_FILTER ? "Featured" : titleCase(v)}
            </button>
          ))}
        </div>

        <div className="model-picker__list">
          {isLoading && <div className="model-picker__empty">Loading models…</div>}
          {isError && (
            <div className="model-picker__empty model-picker__empty--error">
              Could not load model catalog.
            </div>
          )}
          {!isLoading && !isError && filtered.length === 0 && (
            <div className="model-picker__empty">No models match this filter.</div>
          )}
          {filtered.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`model-card ${modelId === m.id ? "model-card--active" : ""}`}
              onClick={() => handlePick(m.id)}
            >
              <div className="model-card__head">
                <strong>{m.name}</strong>
                <span className="model-card__vendor">{titleCase(m.vendor)}</span>
              </div>
              <div className="model-card__meta">
                <span>{m.media_types.join(" · ")}</span>
                <span>{m.capabilities.join(" · ")}</span>
              </div>
              {modelId === m.id && <span className="model-card__check">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

function titleCase(value) {
  return value
    .split(/[-_\s]+/)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}
