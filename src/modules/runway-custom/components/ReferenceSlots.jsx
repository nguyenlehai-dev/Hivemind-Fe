export default function ReferenceSlots({ references, onAddClick, onRemove }) {
  const slots = [...references];
  while (slots.length < 3) {
    slots.push(null);
  }

  return (
    <div className="reference-slots">
      {slots.slice(0, 3).map((item, index) =>
        item ? (
          <div key={item.id} className="reference-slot">
            <img src={item.previewUrl} alt={item.name} className="reference-slot__image" />
            <button
              type="button"
              className="reference-slot__remove"
              onClick={() => onRemove(item.id)}
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            key={`empty-${index}`}
            type="button"
            className="reference-slot reference-slot--empty"
            onClick={onAddClick}
          >
            +
          </button>
        )
      )}
    </div>
  );
}
