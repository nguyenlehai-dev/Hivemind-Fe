import ModalShell from "../../../../shared/ui/ModalShell";

export default function AssetUploadModal({ open, onClose, onFileSelect }) {
  return (
    <ModalShell open={open} title="Add reference" onClose={onClose}>
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
    </ModalShell>
  );
}
