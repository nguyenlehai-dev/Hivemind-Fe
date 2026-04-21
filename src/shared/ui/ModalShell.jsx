export default function ModalShell({ open, title, onClose, width = "", children }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className={`modal ${width}`.trim()}>
        <div className="modal__header">
          <h2>{title}</h2>
          <button type="button" className="modal__close" onClick={onClose}>
            x
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
