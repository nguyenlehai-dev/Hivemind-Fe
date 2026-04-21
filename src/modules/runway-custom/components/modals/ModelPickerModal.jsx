import { WandIcon } from "../../../../shared/icons";
import ModalShell from "../../../../shared/ui/ModalShell";

export default function ModelPickerModal({
  open,
  onClose,
  models,
  selectedModelId,
  onSelect,
}) {
  return (
    <ModalShell open={open} title="Choose image model" onClose={onClose} width="modal--wide">
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
              <strong className="model-card__title">
                <WandIcon className="button-icon" />
                <span>{model.name}</span>
              </strong>
              <span>{model.vendor}</span>
            </div>
            <p>{model.capabilities.join(" · ")}</p>
          </button>
        ))}
      </div>
    </ModalShell>
  );
}
