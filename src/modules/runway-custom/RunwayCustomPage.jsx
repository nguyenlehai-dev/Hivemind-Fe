import { useState } from "react";
import GenerationModeTabs from "./components/GenerationModeTabs";
import LeftComposerPanel from "./components/LeftComposerPanel";
import RightPreviewPanel from "./components/RightPreviewPanel";
import WorkspaceSidebar from "./components/WorkspaceSidebar";
import AssetUploadModal from "./components/modals/AssetUploadModal";
import AuthModal from "./components/modals/AuthModal";
import ModelPickerModal from "./components/modals/ModelPickerModal";
import { useRunwayCustomPage } from "./hooks/useRunwayCustomPage";

export default function RunwayCustomPage() {
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
  });
  const runwayCustom = useRunwayCustomPage();

  return (
    <div className="app-shell">
      <WorkspaceSidebar />
      <main className="workspace">
        <header className="workspace__header">
          <GenerationModeTabs
            activeMode={runwayCustom.activeMode}
            onChange={runwayCustom.setActiveMode}
          />
          <div className="workspace__actions">
            <button
              type="button"
              className="ghost-button"
              onClick={() => runwayCustom.openModal("auth")}
            >
              {runwayCustom.auth.status === "connected" ? "Reconnect" : "Login"}
            </button>
            <div className={`status-badge status-badge--${runwayCustom.auth.status}`}>
              {runwayCustom.auth.status}
            </div>
          </div>
        </header>
        <section className="workspace__content">
          <LeftComposerPanel
            references={runwayCustom.imageDraft.references}
            prompt={runwayCustom.imageDraft.prompt}
            selectedModelName={runwayCustom.selectedModel?.name}
            aspectRatio={runwayCustom.imageDraft.settings.aspectRatio}
            isGenerating={runwayCustom.isGenerating}
            canGenerate={runwayCustom.canGenerate}
            onAddClick={() => runwayCustom.openModal("asset-upload")}
            onRemoveReference={runwayCustom.removeReference}
            onPromptChange={runwayCustom.setPrompt}
            onOpenModelPicker={() => runwayCustom.openModal("model-picker")}
            onGenerate={runwayCustom.submitGeneration}
          />
          <RightPreviewPanel
            authStatus={runwayCustom.auth.status}
            currentJob={runwayCustom.currentJob}
          />
        </section>
      </main>

      <AuthModal
        open={runwayCustom.ui.activeModal === "auth"}
        form={authForm}
        onClose={runwayCustom.closeModal}
        onChange={(key, value) =>
          setAuthForm((state) => ({
            ...state,
            [key]: value,
          }))
        }
        onSubmit={runwayCustom.submitLogin}
        isSubmitting={runwayCustom.isSubmittingLogin}
      />
      <ModelPickerModal
        open={runwayCustom.ui.activeModal === "model-picker"}
        onClose={runwayCustom.closeModal}
        models={runwayCustom.models}
        selectedModelId={runwayCustom.imageDraft.selectedModelId}
        onSelect={runwayCustom.setSelectedModel}
      />
      <AssetUploadModal
        open={runwayCustom.ui.activeModal === "asset-upload"}
        onClose={runwayCustom.closeModal}
        onFileSelect={runwayCustom.uploadReference}
      />
    </div>
  );
}
