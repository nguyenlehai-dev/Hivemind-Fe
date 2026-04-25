import { useCallback } from "react";

import { useFileUpload } from "../../../shared/hooks/useFileUpload";
import { getErrorMessage } from "../../../shared/lib/getErrorMessage";
import { MODAL_KEYS, useUiStore } from "../../../shared/store/useUiStore";
import { useUploadAsset } from "../hooks/useUploadAsset";
import { useGenerationStore } from "../store/useGenerationStore";

const MAX_SLOTS = 4;

export default function ReferenceDropzone() {
  const mode = useGenerationStore((s) => s.activeMode);
  const references = useGenerationStore(
    (s) => s.drafts[s.activeMode].references,
  );
  const addReference = useGenerationStore((s) => s.addReference);
  const removeReference = useGenerationStore((s) => s.removeReference);
  const openModal = useUiStore((s) => s.openModal);
  const upload = useUploadAsset();

  const fileUpload = useFileUpload({
    uploadMutation: upload,
    max: MAX_SLOTS,
    currentCount: references.length,
    onUploaded: addReference,
  });

  const onPaste = useCallback(
    (event) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      const imageFiles = [];
      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) imageFiles.push(file);
        }
      }
      if (imageFiles.length) {
        event.preventDefault();
        fileUpload.handleFiles(imageFiles);
      }
    },
    [fileUpload],
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      fileUpload.handleFiles(event.dataTransfer.files);
    },
    [fileUpload],
  );

  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => references[i] ?? null);
  const canAdd = references.length < MAX_SLOTS;
  const uploadError = getErrorMessage(upload);

  return (
    <div
      className="reference-dropzone"
      onPaste={onPaste}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      tabIndex={0}
    >
      <div className="reference-dropzone__slots">
        {slots.map((asset, index) => (
          <div
            key={asset?.asset_id ?? `slot-${index}`}
            className={`reference-slot ${asset ? "reference-slot--filled" : ""}`}
          >
            {asset ? (
              <>
                <button
                  type="button"
                  className="reference-slot__open"
                  onClick={() =>
                    openModal(MODAL_KEYS.ASSET_PREVIEW, {
                      asset,
                      title: `Reference ${index + 1}`,
                    })
                  }
                  aria-label={`Preview reference ${index + 1}`}
                >
                  <img src={asset.preview_url} alt={`ref ${index + 1}`} />
                </button>
                <button
                  type="button"
                  className="reference-slot__remove"
                  onClick={() => removeReference(asset.asset_id)}
                  aria-label="Remove reference"
                >
                  ×
                </button>
              </>
            ) : index === references.length && canAdd ? (
              <button
                type="button"
                className="reference-slot__add"
                onClick={fileUpload.openPicker}
                disabled={upload.isPending}
              >
                {upload.isPending ? "…" : "+"}
              </button>
            ) : (
              <span className="reference-slot__placeholder" />
            )}
          </div>
        ))}
      </div>
      <p className="reference-dropzone__hint">
        Drop image, paste from clipboard, or click + to upload. Max {MAX_SLOTS} references.
      </p>
      {mode === "video" && references.length === 0 && (
        <p className="reference-dropzone__required">
          Video mode requires at least 1 reference image for real Runway generation.
          Without it, result will fall back to mock.
        </p>
      )}
      <input {...fileUpload.inputProps} />
      {uploadError && (
        <p className="reference-dropzone__error">Upload failed: {uploadError}</p>
      )}
    </div>
  );
}
