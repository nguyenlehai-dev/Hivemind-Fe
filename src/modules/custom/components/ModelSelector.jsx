import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronDownIcon } from "../../../shared/icons";
import FloatingPanel from "../../../shared/ui/FloatingPanel";
import SearchInput from "../../../shared/ui/SearchInput";
import { useRunwayModels } from "../hooks/useModels";
import { useGenerationStore } from "../store/useGenerationStore";

const ALL_FILTER = "all";

export default function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [vendor, setVendor] = useState(ALL_FILTER);
  const containerRef = useRef(null);
  const mode = useGenerationStore((s) => s.activeMode);
  const modelId = useGenerationStore((s) => s.drafts[s.activeMode].modelId);
  const setModelId = useGenerationStore((s) => s.setModelId);
  const { data: models = [], isLoading, isError } = useRunwayModels(mode);

  const current = useMemo(
    () => models.find((model) => model.id === modelId) ?? null,
    [models, modelId],
  );

  const vendors = useMemo(() => {
    const set = new Set(models.map((model) => model.vendor));
    return [ALL_FILTER, ...Array.from(set)];
  }, [models]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return models.filter((model) => {
      if (vendor !== ALL_FILTER && model.vendor !== vendor) return false;
      if (!term) return true;
      return (
        model.name.toLowerCase().includes(term) ||
        model.id.toLowerCase().includes(term) ||
        model.vendor.toLowerCase().includes(term)
      );
    });
  }, [models, search, vendor]);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setVendor(ALL_FILTER);
      return undefined;
    }

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handlePick(id) {
    setModelId(id);
    setIsOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className={`model-selector-wrap${isOpen ? " model-selector-wrap--open" : ""}`}
    >
      <button
        type="button"
        className={`generate-bar__picker${isOpen ? " generate-bar__picker--open" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span>{current?.name ?? (models.length ? "Choose model" : "No models for this mode")}</span>
        <ChevronDownIcon className="generate-bar__select-chevron" />
      </button>

      {isOpen && (
        <FloatingPanel
          className="model-picker-panel"
          bodyClassName="model-picker"
          role="dialog"
          aria-label="Select a model"
        >
          <SearchInput
            containerClassName="model-picker__search"
            className="model-picker__search-input"
            iconClassName="model-picker__search-icon"
            autoFocus
            placeholder="Search models, vendors..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="model-picker__filters" role="tablist">
            {vendors.map((value) => (
              <button
                key={value}
                type="button"
                className={`model-picker__filter ${
                  vendor === value ? "model-picker__filter--active" : ""
                }`}
                onClick={() => setVendor(value)}
              >
                {value === ALL_FILTER ? "Featured" : titleCase(value)}
              </button>
            ))}
          </div>

          <div className="model-picker__list">
            {isLoading && <div className="model-picker__empty">Loading models...</div>}
            {isError && (
              <div className="model-picker__empty model-picker__empty--error">
                Could not load model catalog.
              </div>
            )}
            {!isLoading && !isError && filtered.length === 0 && (
              <div className="model-picker__empty">No models match this filter.</div>
            )}
            {filtered.map((model) => (
              <button
                key={model.id}
                type="button"
                className={`model-card ${modelId === model.id ? "model-card--active" : ""}`}
                onClick={() => handlePick(model.id)}
              >
                <div className="model-card__head">
                  <strong>{model.name}</strong>
                  <span className="model-card__vendor">{titleCase(model.vendor)}</span>
                </div>
                <div className="model-card__meta">
                  <span>{model.media_types.join(" | ")}</span>
                  <span>{model.capabilities.join(" | ")}</span>
                </div>
                {modelId === model.id && <span className="model-card__check">OK</span>}
              </button>
            ))}
          </div>
        </FloatingPanel>
      )}
    </div>
  );
}

function titleCase(value) {
  return value
    .split(/[-_\s]+/)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}
