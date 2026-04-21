import AppShell from "../../shared/ui/AppShell";
import AssetPreviewModal from "../../shared/ui/AssetPreviewModal";
import { MODAL_KEYS, useUiStore } from "../../shared/store/useUiStore";
import SaveAsAppModal from "../apps/components/SaveAsAppModal";

import AdvancedSettingsModal from "./components/AdvancedSettingsModal";
import GenerateActionBar from "./components/GenerateActionBar";
import GenerationModeTabs from "./components/GenerationModeTabs";
import ModelPickerModal from "./components/ModelPickerModal";
import ModelSelector from "./components/ModelSelector";
import PreviewStage from "./components/PreviewStage";
import PromptComposer from "./components/PromptComposer";
import ReferenceDropzone from "./components/ReferenceDropzone";
import { useGenerationStore } from "./store/useGenerationStore";

export default function CustomWorkflowPage() {
  const mode = useGenerationStore((s) => s.activeMode);
  const setMode = useGenerationStore((s) => s.setMode);
  const openModal = useUiStore((s) => s.openModal);

  return (
    <AppShell className="custom-page" withSidebar>
      <div className="custom-shell">
        <div className="custom-shell__topbar">
          <div>
            <span className="estate-eyebrow">Custom</span>
            <h1>Compose a generation</h1>
          </div>
          <div className="custom-shell__actions">
            <button
              type="button"
              className="estate-button estate-button--ghost estate-button--small"
              onClick={() => openModal("save-as-app")}
            >
              Save as App
            </button>
            <GenerationModeTabs value={mode} onChange={setMode} />
          </div>
        </div>

        <div className="custom-shell__body">
          <aside className="composer">
            <section className="composer__block">
              <h3 className="composer__label">References</h3>
              <ReferenceDropzone />
            </section>

            <section className="composer__block">
              <h3 className="composer__label">Prompt</h3>
              <PromptComposer />
            </section>

            <section className="composer__block">
              <div className="composer__row">
                <h3 className="composer__label">Model</h3>
                <button
                  type="button"
                  className="composer__inline-link"
                  onClick={() => openModal(MODAL_KEYS.ADVANCED_SETTINGS)}
                >
                  Advanced settings
                </button>
              </div>
              <ModelSelector />
            </section>

            <GenerateActionBar />
          </aside>

          <section className="preview">
            <PreviewStage />
          </section>
        </div>
      </div>

      <ModelPickerModal />
      <AssetPreviewModal />
      <AdvancedSettingsModal />
      <SaveAsAppModal />
    </AppShell>
  );
}
