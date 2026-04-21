import { useCallback, useRef, useState } from "react";

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
  const [uploading, setUploading] = useState(0);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    async (fileList) => {
      const files = Array.from(fileList || []).slice(
        0,
        MAX_SLOTS - references.length,
      );
      if (!files.length) return;
      setUploading((n) => n + files.length);
      try {
        await Promise.all(
          files.map(async (file) => {
            try {
              const asset = await upload.mutateAsync(file);
              addReference(asset);
            } catch {
              /* swallow; error shown via upload.error */
            }
          }),
        );
      } finally {
        setUploading((n) => Math.max(0, n - files.length));
      }
    },
    [references.length, upload, addReference],
  );

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
        handleFiles(imageFiles);
      }
    },
    [handleFiles],
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => references[i] ?? null);
  const canAdd = references.length < MAX_SLOTS;

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
                onClick={() => inputRef.current?.click()}
                disabled={uploading > 0}
              >
                {uploading > 0 ? "…" : "+"}
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
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {upload.isError && (
        <p className="reference-dropzone__error">
          Upload failed: {upload.error?.response?.data?.error?.message ?? upload.error?.message}
        </p>
      )}
    </div>
  );
}
