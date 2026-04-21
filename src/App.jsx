import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import WorkspaceSidebar from "./components/WorkspaceSidebar";
import GenerationModeTabs from "./components/GenerationModeTabs";
import LeftComposerPanel from "./components/LeftComposerPanel";
import RightPreviewPanel from "./components/RightPreviewPanel";
import AuthModal from "./components/modals/AuthModal";
import AssetUploadModal from "./components/modals/AssetUploadModal";
import ModelPickerModal from "./components/modals/ModelPickerModal";
import {
  createGeneration,
  getAuthStatus,
  getGeneration,
  getModels,
  loginRunway,
  uploadAsset,
} from "./lib/runwayApi";
import { useRunwayStore } from "./stores/useRunwayStore";

export default function App() {
  const [activeMode, setActiveMode] = useState("Image");
  const auth = useRunwayStore((state) => state.auth);
  const ui = useRunwayStore((state) => state.ui);
  const imageDraft = useRunwayStore((state) => state.imageDraft);
  const currentJob = useRunwayStore((state) => state.currentJob);
  const setAuth = useRunwayStore((state) => state.setAuth);
  const setPrompt = useRunwayStore((state) => state.setPrompt);
  const setSelectedModel = useRunwayStore((state) => state.setSelectedModel);
  const addReference = useRunwayStore((state) => state.addReference);
  const removeReference = useRunwayStore((state) => state.removeReference);
  const setCurrentJob = useRunwayStore((state) => state.setCurrentJob);
  const upsertHistory = useRunwayStore((state) => state.upsertHistory);
  const openModal = useRunwayStore((state) => state.openModal);
  const closeModal = useRunwayStore((state) => state.closeModal);

  const authStatusQuery = useQuery({
    queryKey: ["runway-auth-status"],
    queryFn: getAuthStatus,
  });

  const modelsQuery = useQuery({
    queryKey: ["runway-models", activeMode.toLowerCase()],
    queryFn: () => getModels(activeMode.toLowerCase()),
  });

  useEffect(() => {
    if (authStatusQuery.data?.status) {
      setAuth({
        status: authStatusQuery.data.status,
        sessionId: authStatusQuery.data.session_id || "",
        email: authStatusQuery.data.email || "",
      });
    }
  }, [authStatusQuery.data, setAuth]);

  const loginMutation = useMutation({
    mutationFn: loginRunway,
    onMutate: () => setAuth({ status: "connecting", error: "" }),
    onSuccess: (response) => {
      setAuth({
        status: response.status,
        sessionId: response.session_id,
        email: response.email || "",
      });
      closeModal();
    },
    onError: (error) => {
      setAuth({
        status: "error",
        error: error.message || "Unable to connect.",
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: uploadAsset,
    onSuccess: (response, file) => {
      addReference({
        id: response.data.asset_id,
        name: file.name,
        previewUrl: response.data.preview_url,
        status: "uploaded",
        assetId: response.data.asset_id,
      });
    },
  });

  const generateMutation = useMutation({
    mutationFn: createGeneration,
    onSuccess: (response) => {
      const job = {
        id: response.data.job_id,
        status: response.data.status,
        modelId: imageDraft.selectedModelId,
        prompt: imageDraft.prompt,
        resultUrls: [],
      };
      setCurrentJob(job);
      upsertHistory(job);
    },
  });

  useEffect(() => {
    if (!currentJob || currentJob.status === "completed" || currentJob.status === "failed") {
      return undefined;
    }

    const interval = window.setInterval(async () => {
      try {
        const response = await getGeneration(currentJob.id);
        const job = {
          id: response.data.id,
          status: response.data.status,
          modelId: response.data.model_id,
          prompt: response.data.prompt,
          resultUrls: response.data.result_urls,
          error: response.data.error,
        };
        setCurrentJob(job);
        upsertHistory(job);
      } catch (error) {
        setCurrentJob({
          ...currentJob,
          status: "failed",
          error: error.message,
        });
      }
    }, 1500);

    return () => window.clearInterval(interval);
  }, [currentJob, setCurrentJob, upsertHistory]);

  const selectedModel = useMemo(
    () =>
      modelsQuery.data?.data?.find((item) => item.id === imageDraft.selectedModelId) || null,
    [modelsQuery.data, imageDraft.selectedModelId]
  );

  const canGenerate =
    auth.status === "connected" &&
    Boolean(imageDraft.selectedModelId) &&
    Boolean(imageDraft.prompt.trim() || imageDraft.references.length);

  return (
    <div className="app-shell">
      <WorkspaceSidebar />
      <main className="workspace">
        <header className="workspace__header">
          <GenerationModeTabs activeMode={activeMode} onChange={setActiveMode} />
          <div className="workspace__actions">
            <button type="button" className="ghost-button" onClick={() => openModal("auth")}>
              {auth.status === "connected" ? "Reconnect" : "Login"}
            </button>
            <div className={`status-badge status-badge--${auth.status}`}>{auth.status}</div>
          </div>
        </header>
        <section className="workspace__content">
          <LeftComposerPanel
            references={imageDraft.references}
            prompt={imageDraft.prompt}
            selectedModelName={selectedModel?.name}
            aspectRatio={imageDraft.settings.aspectRatio}
            isGenerating={generateMutation.isPending || currentJob?.status === "running"}
            canGenerate={canGenerate}
            onAddClick={() => openModal("asset-upload")}
            onRemoveReference={removeReference}
            onPromptChange={setPrompt}
            onOpenModelPicker={() => openModal("model-picker")}
            onGenerate={() =>
              generateMutation.mutate({
                mode: "image",
                model_id: imageDraft.selectedModelId,
                prompt: imageDraft.prompt,
                references: imageDraft.references.map((item) => ({
                  asset_id: item.assetId,
                })),
                settings: {
                  aspect_ratio: imageDraft.settings.aspectRatio,
                  num_outputs: imageDraft.settings.numOutputs,
                },
              })
            }
          />
          <RightPreviewPanel authStatus={auth.status} currentJob={currentJob} />
        </section>
      </main>

      <AuthModal
        open={ui.activeModal === "auth"}
        onClose={closeModal}
        onSubmit={(payload) => loginMutation.mutate(payload)}
        isSubmitting={loginMutation.isPending}
      />
      <ModelPickerModal
        open={ui.activeModal === "model-picker"}
        onClose={closeModal}
        models={modelsQuery.data?.data || []}
        selectedModelId={imageDraft.selectedModelId}
        onSelect={setSelectedModel}
      />
      <AssetUploadModal
        open={ui.activeModal === "asset-upload"}
        onClose={closeModal}
        onFileSelect={(file) => uploadMutation.mutate(file)}
      />
    </div>
  );
}
