import { ChevronDownIcon, RatioIcon, WandIcon } from "../../../shared/icons";

export default function ActionBar({
  selectedModelName,
  aspectRatio,
  isGenerating,
  canGenerate,
  onOpenModelPicker,
  onGenerate,
}) {
  return (
    <div className="action-bar">
      <button type="button" className="field-button" onClick={onOpenModelPicker}>
        <span className="field-button__content">
          <WandIcon className="button-icon" />
          <span>{selectedModelName || "Choose model"}</span>
        </span>
        <ChevronDownIcon className="button-icon button-icon--muted" />
      </button>
      <div className="field-pill">
        <RatioIcon className="button-icon button-icon--muted" />
        <span>{aspectRatio}</span>
      </div>
      <button
        type="button"
        className="generate-button"
        disabled={!canGenerate || isGenerating}
        onClick={onGenerate}
      >
        <WandIcon className="button-icon" />
        {isGenerating ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}
