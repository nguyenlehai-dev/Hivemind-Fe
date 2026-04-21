export default function ModelPickerModal({
  open,
  onClose,
  models,
  selectedModelId,
  onSelect,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal modal--wide">
        <div className="modal__header">
          <h2>Choose image model</h2>
          <button type="button" className="modal__close" onClick={onClose}>
            x
          </button>
        </div>
        <div className="model-grid">
          {models.map((model) => (
            <button
              key={model.id}
              type="button"
              className={`model-card ${selectedModelId === model.id ? "is-selected" : ""}`}
              onClick={() => {
                onSelect(model.id);
                onClose();
              }}
            >
              <div className="model-card__top">
                <strong>{model.name}</strong>
                <span>{model.vendor}</span>
              </div>
              <p>{model.capabilities.join(" · ")}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
