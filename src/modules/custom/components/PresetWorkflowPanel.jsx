import { useRef, useState } from "react";

import { ImageIcon } from "../../../shared/icons";
import { MODAL_KEYS, useUiStore } from "../../../shared/store/useUiStore";
import { useUploadAsset } from "../hooks/useUploadAsset";
import { useGenerationStore } from "../store/useGenerationStore";

export default function PresetWorkflowPanel({ preset }) {
  const mode = useGenerationStore((s) => s.activeMode);
  const inputs = useGenerationStore((s) => s.presetInputsByMode[s.activeMode] ?? {});
  const prompt = useGenerationStore((s) => s.drafts[s.activeMode].prompt);
  const setPresetInput = useGenerationStore((s) => s.setPresetInput);
  const setPrompt = useGenerationStore((s) => s.setPrompt);
  const setPromptCounter = useGenerationStore((s) => s.setPromtCoumter);
  const addPresetReference = useGenerationStore((s) => s.addPresetReference);
  const removePresetReference = useGenerationStore((s) => s.removePresetReference);
  const openModal = useUiStore((s) => s.openModal);
  const upload = useUploadAsset();
  const [uploadingFieldKey, setUploadingFieldKey] = useState(null);
  const fileInputsRef = useRef({});

  async function handleFiles(field, fileList) {
    const files = Array.from(fileList ?? []).slice(0, field.maxAssets ?? 1);
    if (!files.length) return;

    setUploadingFieldKey(field.key);
    try {
      await Promise.all(
        files.map(async (file) => {
          const asset = await upload.mutateAsync(file);
          addPresetReference(field.key, asset, field.maxAssets ?? 1);
        }),
      );
    } finally {
      setUploadingFieldKey(null);
    }
  }

  return (
    <div className="preset-workflow">
      <div className="preset-workflow__header">
        <p className="preset-workflow__crumb">Apps / {preset.name}</p>
        <h3>{preset.name}</h3>
        <p className="preset-workflow__description">{preset.description}</p>
      </div>

      <div className="preset-workflow__fields">
        {preset.fields.map((field) => {
          const value = inputs[field.key];

          if (field.type === "assets") {
            const assets = value ?? [];
            const leadAsset = assets[0] ?? null;

            return (
              <section key={field.key} className="preset-field">
                <div className="preset-field__label">
                  <span>{field.label}</span>
                  {field.required && <em>Required</em>}
                </div>

                <div className="preset-upload">
                  {leadAsset ? (
                    <button
                      type="button"
                      className="preset-upload__preview"
                      onClick={() =>
                        openModal(MODAL_KEYS.ASSET_PREVIEW, {
                          asset: leadAsset,
                          title: field.label,
                        })
                      }
                    >
                      <img src={leadAsset.preview_url} alt={field.label} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="preset-upload__empty"
                      onClick={() => fileInputsRef.current[field.key]?.click()}
                      disabled={uploadingFieldKey === field.key}
                    >
                      <ImageIcon className="preset-upload__icon" />
                    </button>
                  )}

                  <p className="preset-upload__hint">{field.hint}</p>

                  <div className="preset-upload__actions">
                    <button
                      type="button"
                      className="estate-button estate-button--ghost estate-button--small"
                      onClick={() => fileInputsRef.current[field.key]?.click()}
                      disabled={uploadingFieldKey === field.key}
                    >
                      {uploadingFieldKey === field.key
                        ? "Uploading..."
                        : leadAsset
                          ? "Replace"
                          : "Select"}
                    </button>

                    {leadAsset && (
                      <button
                        type="button"
                        className="estate-button estate-button--ghost estate-button--small"
                        onClick={() => removePresetReference(field.key, leadAsset.asset_id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    ref={(node) => {
                      fileInputsRef.current[field.key] = node;
                    }}
                    type="file"
                    accept={mode === "audio" ? "*" : "image/*"}
                    hidden
                    onChange={(event) => {
                      handleFiles(field, event.target.files);
                      event.target.value = "";
                    }}
                  />
                </div>
              </section>
            );
          }

          return (
            <section key={field.key} className="preset-field">
              <div className="preset-field__label">
                <span>{field.label}</span>
                {field.required && <em>Required</em>}
              </div>

              <textarea
                className="preset-field__textarea"
                rows={field.rows ?? 4}
                placeholder={field.placeholder}
                value={value ?? ""}
                onChange={(event) => setPresetInput(field.key, event.target.value)}
              />
            </section>
          );
        })}

        <section className="preset-field">
          <div className="preset-field__label">
            <span>Additional Direction</span>
            <em>Optional</em>
          </div>

          <textarea
            className="preset-field__textarea"
            rows={4}
            placeholder="Add extra direction, constraints, or output notes."
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              setPromptCounter(event.target.value.length);
            }}
          />
        </section>
      </div>

      {upload.isError && (
        <p className="preset-workflow__error">
          Upload failed: {upload.error?.response?.data?.error?.message ?? upload.error?.message}
        </p>
      )}
    </div>
  );
}
