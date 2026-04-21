import { create } from "zustand";

const initialDraft = {
  prompt: "",
  selectedModelId: "",
  references: [],
  settings: {
    aspectRatio: "16:9",
    numOutputs: 1,
  },
};

export const useRunwayStore = create((set) => ({
  auth: {
    status: "disconnected",
    sessionId: "",
    email: "",
    error: "",
  },
  imageDraft: initialDraft,
  currentJob: null,
  history: [],
  ui: {
    activeModal: "",
    selectedAssetPreviewId: "",
  },
  setAuth(partial) {
    set((state) => ({
      auth: {
        ...state.auth,
        ...partial,
      },
    }));
  },
  setPrompt(prompt) {
    set((state) => ({
      imageDraft: {
        ...state.imageDraft,
        prompt,
      },
    }));
  },
  setSelectedModel(selectedModelId) {
    set((state) => ({
      imageDraft: {
        ...state.imageDraft,
        selectedModelId,
      },
    }));
  },
  setSetting(key, value) {
    set((state) => ({
      imageDraft: {
        ...state.imageDraft,
        settings: {
          ...state.imageDraft.settings,
          [key]: value,
        },
      },
    }));
  },
  addReference(reference) {
    set((state) => ({
      imageDraft: {
        ...state.imageDraft,
        references: [...state.imageDraft.references, reference],
      },
    }));
  },
  removeReference(id) {
    set((state) => ({
      imageDraft: {
        ...state.imageDraft,
        references: state.imageDraft.references.filter((item) => item.id !== id),
      },
    }));
  },
  updateReference(id, partial) {
    set((state) => ({
      imageDraft: {
        ...state.imageDraft,
        references: state.imageDraft.references.map((item) =>
          item.id === id ? { ...item, ...partial } : item
        ),
      },
    }));
  },
  setCurrentJob(currentJob) {
    set({ currentJob });
  },
  upsertHistory(job) {
    set((state) => {
      const exists = state.history.some((item) => item.id === job.id);
      return {
        history: exists
          ? state.history.map((item) => (item.id === job.id ? job : item))
          : [job, ...state.history],
      };
    });
  },
  openModal(activeModal) {
    set((state) => ({
      ui: {
        ...state.ui,
        activeModal,
      },
    }));
  },
  closeModal() {
    set((state) => ({
      ui: {
        ...state.ui,
        activeModal: "",
      },
    }));
  },
}));
