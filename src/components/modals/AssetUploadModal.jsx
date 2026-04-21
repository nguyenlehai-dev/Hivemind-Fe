export default function AssetUploadModal({ open, onClose, onFileSelect }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal__header">
          <h2>Add reference</h2>
          <button type="button" className="modal__close" onClick={onClose}>
            x
          </button>
        </div>
        <label className="upload-dropzone">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onFileSelect(file);
                onClose();
              }
            }}
          />
          <span>Drop an image here or click to browse.</span>
        </label>
      </div>
    </div>
  );
}
