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
        {selectedModelName || "Choose model"}
      </button>
      <div className="field-pill">{aspectRatio}</div>
      <button
        type="button"
        className="generate-button"
        disabled={!canGenerate || isGenerating}
        onClick={onGenerate}
      >
        {isGenerating ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}
