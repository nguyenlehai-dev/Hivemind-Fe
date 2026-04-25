import AssetPreviewModal from "../../shared/ui/AssetPreviewModal";
import SaveAsAppModal from "../apps/components/SaveAsAppModal";

import GenerateActionBar from "./components/GenerateActionBar";
import GenerationModeTabs from "./components/GenerationModeTabs";
import InlineSettingsBar from "./components/InlineSettingsBar";
import PresetWorkflowPanel from "./components/PresetWorkflowPanel";
import PreviewStage from "./components/PreviewStage";
import PromptComposer from "./components/PromptComposer";
import ReferenceDropzone from "./components/ReferenceDropzone";
import { useGenerationStore } from "./store/useGenerationStore";

export default function CustomWorkflowContent() {
  const mode = useGenerationStore((s) => s.activeMode);
  const setMode = useGenerationStore((s) => s.setMode);
  const selectedPreset = useGenerationStore((s) => s.selectedPresetByMode[s.activeMode]);

  return (
    <>
      <div className="custom-shell custom-shell--compact">
        <div className="custom-shell__body">
          <aside className="composer">
            <section className="composer__surface">
              <div className="composer__surface-header">
                <GenerationModeTabs value={mode} onChange={setMode} />
              </div>

              <div className="composer__canvas">
                {selectedPreset ? (
                  <PresetWorkflowPanel preset={selectedPreset} />
                ) : (
                  <>
                    <ReferenceDropzone />
                    <PromptComposer />
                  </>
                )}
              </div>
            </section>

            <div className="composer__footer">
              <InlineSettingsBar />
              <GenerateActionBar />
            </div>
          </aside>

          <section className="preview">
            <PreviewStage />
          </section>
        </div>
      </div>

      <AssetPreviewModal />
      <SaveAsAppModal />
    </>
  );
}
