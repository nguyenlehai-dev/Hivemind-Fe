import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ModalShell from "../../../shared/ui/ModalShell";
import TextInput from "../../../shared/ui/TextInput";
import { MODAL_KEYS, useUiStore } from "../../../shared/store/useUiStore";
import { useGenerationStore } from "../../custom/store/useGenerationStore";
import { useCreateApp } from "../hooks/useApps";

export default function SaveAsAppModal() {
  const isOpen = useUiStore((s) => s.activeModal === "save-as-app");
  const closeModal = useUiStore((s) => s.closeModal);
  const mode = useGenerationStore((s) => s.activeMode);
  const draft = useGenerationStore((s) => s.drafts[s.activeMode]);
  const createMutation = useCreateApp();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      createMutation.reset();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim() || !draft.modelId) return;
    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        mode,
        model_id: draft.modelId,
        prompt: draft.prompt,
        settings: draft.settings,
      });
      closeModal();
      navigate("/apps");
    } catch {
      /* error shown inline */
    }
  }

  const errorMessage =
    createMutation.error?.response?.data?.error?.message ??
    createMutation.error?.message;

  return (
    <ModalShell open={isOpen} title="Save as App" onClose={closeModal}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="auth-form__hint">
          Preset saves <strong>{mode}</strong> mode, model <strong>{draft.modelId ?? "(none)"}</strong>,
          current prompt + settings.
        </p>

        <div className="auth-form__field">
          <label htmlFor="app-name">Name</label>
          <TextInput
            id="app-name"
            type="text"
            required
            maxLength={128}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="app-desc">Description (optional)</label>
          <TextInput
            id="app-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {!draft.modelId && (
          <div className="auth-form__error">
            Select a model first before saving as App.
          </div>
        )}

        {errorMessage && <div className="auth-form__error">{errorMessage}</div>}

        <div className="auth-form__actions">
          <button
            type="button"
            className="estate-button estate-button--ghost"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="estate-button"
            disabled={createMutation.isPending || !name.trim() || !draft.modelId}
          >
            {createMutation.isPending ? "Saving…" : "Save App"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
