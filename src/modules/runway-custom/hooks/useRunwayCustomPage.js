import { useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createGeneration,
  getAuthStatus,
  getGeneration,
  getModels,
  loginRunway,
  uploadAsset,
} from "../api/runwayCustomApi";
import { useRunwayCustomStore } from "../store/useRunwayCustomStore";

export function useRunwayCustomPage() {
  const auth = useRunwayCustomStore((state) => state.auth);
  const ui = useRunwayCustomStore((state) => state.ui);
  const generation = useRunwayCustomStore((state) => state.generation);
  const imageDraft = generation.drafts.image;
  const currentJob = generation.currentJob;
  const setAuth = useRunwayCustomStore((state) => state.setAuth);
  const setActiveMode = useRunwayCustomStore((state) => state.setActiveMode);
  const setPrompt = useRunwayCustomStore((state) => state.setPrompt);
  const setSelectedModel = useRunwayCustomStore((state) => state.setSelectedModel);
  const addReference = useRunwayCustomStore((state) => state.addReference);
  const removeReference = useRunwayCustomStore((state) => state.removeReference);
  const setCurrentJob = useRunwayCustomStore((state) => state.setCurrentJob);
  const upsertHistory = useRunwayCustomStore((state) => state.upsertHistory);
  const openModal = useRunwayCustomStore((state) => state.openModal);
  const closeModal = useRunwayCustomStore((state) => state.closeModal);

  const authStatusQuery = useQuery({
    queryKey: ["runway-auth-status"],
    queryFn: getAuthStatus,
  });

  const modelsQuery = useQuery({
    queryKey: ["runway-models", generation.activeMode.toLowerCase()],
    queryFn: () => getModels(generation.activeMode.toLowerCase()),
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
    () => modelsQuery.data?.data?.find((item) => item.id === imageDraft.selectedModelId) || null,
    [modelsQuery.data, imageDraft.selectedModelId]
  );

  const canGenerate =
    auth.status === "connected" &&
    Boolean(imageDraft.selectedModelId) &&
    Boolean(imageDraft.prompt.trim() || imageDraft.references.length);

  return {
    auth,
    ui,
    imageDraft,
    currentJob,
    selectedModel,
    models: modelsQuery.data?.data || [],
    activeMode: generation.activeMode,
    isSubmittingLogin: loginMutation.isPending,
    isGenerating: generateMutation.isPending || currentJob?.status === "running",
    canGenerate,
    setActiveMode,
    setPrompt,
    setSelectedModel,
    removeReference,
    openModal,
    closeModal,
    submitLogin: loginMutation.mutate,
    uploadReference: uploadMutation.mutate,
    submitGeneration() {
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
      });
    },
  };
}
