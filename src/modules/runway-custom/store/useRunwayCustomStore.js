import { create } from "zustand";

const createInitialImageDraft = () => ({
  prompt: "",
  selectedModelId: "",
  references: [],
  settings: {
    aspectRatio: "16:9",
    numOutputs: 1,
  },
});

export const useRunwayCustomStore = create((set) => ({
  auth: {
    status: "disconnected",
    sessionId: "",
    email: "",
    error: "",
  },
  generation: {
    activeMode: "Image",
    drafts: {
      image: createInitialImageDraft(),
    },
    currentJob: null,
    history: [],
  },
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
  setActiveMode(activeMode) {
    set((state) => ({
      generation: {
        ...state.generation,
        activeMode,
      },
    }));
  },
  updateImageDraft(partial) {
    set((state) => ({
      generation: {
        ...state.generation,
        drafts: {
          ...state.generation.drafts,
          image: {
            ...state.generation.drafts.image,
            ...partial,
          },
        },
      },
    }));
  },
  setPrompt(prompt) {
    set((state) => ({
      generation: {
        ...state.generation,
        drafts: {
          ...state.generation.drafts,
          image: {
            ...state.generation.drafts.image,
            prompt,
          },
        },
      },
    }));
  },
  setSelectedModel(selectedModelId) {
    set((state) => ({
      generation: {
        ...state.generation,
        drafts: {
          ...state.generation.drafts,
          image: {
            ...state.generation.drafts.image,
            selectedModelId,
          },
        },
      },
    }));
  },
  setSetting(key, value) {
    set((state) => ({
      generation: {
        ...state.generation,
        drafts: {
          ...state.generation.drafts,
          image: {
            ...state.generation.drafts.image,
            settings: {
              ...state.generation.drafts.image.settings,
              [key]: value,
            },
          },
        },
      },
    }));
  },
  addReference(reference) {
    set((state) => ({
      generation: {
        ...state.generation,
        drafts: {
          ...state.generation.drafts,
          image: {
            ...state.generation.drafts.image,
            references: [...state.generation.drafts.image.references, reference],
          },
        },
      },
    }));
  },
  removeReference(id) {
    set((state) => ({
      generation: {
        ...state.generation,
        drafts: {
          ...state.generation.drafts,
          image: {
            ...state.generation.drafts.image,
            references: state.generation.drafts.image.references.filter(
              (item) => item.id !== id
            ),
          },
        },
      },
    }));
  },
  setCurrentJob(currentJob) {
    set((state) => ({
      generation: {
        ...state.generation,
        currentJob,
      },
    }));
  },
  upsertHistory(job) {
    set((state) => {
      const exists = state.generation.history.some((item) => item.id === job.id);
      return {
        generation: {
          ...state.generation,
          history: exists
            ? state.generation.history.map((item) => (item.id === job.id ? job : item))
            : [job, ...state.generation.history],
        },
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
