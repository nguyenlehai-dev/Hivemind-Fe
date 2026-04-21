import { create } from "zustand";

const emptyDraft = () => ({
  prompt: "",
  references: [],
  modelId: null,
  settings: { aspect_ratio: "16:9", num_outputs: 1 },
});

const initialDrafts = {
  image: emptyDraft(),
  video: emptyDraft(),
  audio: emptyDraft(),
};

export const useGenerationStore = create((set, get) => ({
  activeMode: "image",
  drafts: initialDrafts,
  currentJob: null,

  setMode: (mode) => set({ activeMode: mode }),

  setPrompt: (prompt) =>
    set((state) => ({
      drafts: {
        ...state.drafts,
        [state.activeMode]: { ...state.drafts[state.activeMode], prompt },
      },
    })),

  setModelId: (modelId) =>
    set((state) => ({
      drafts: {
        ...state.drafts,
        [state.activeMode]: { ...state.drafts[state.activeMode], modelId },
      },
    })),

  addReference: (asset) =>
    set((state) => {
      const current = state.drafts[state.activeMode];
      if (current.references.some((r) => r.asset_id === asset.asset_id)) return state;
      return {
        drafts: {
          ...state.drafts,
          [state.activeMode]: {
            ...current,
            references: [...current.references, asset],
          },
        },
      };
    }),

  removeReference: (assetId) =>
    set((state) => {
      const current = state.drafts[state.activeMode];
      return {
        drafts: {
          ...state.drafts,
          [state.activeMode]: {
            ...current,
            references: current.references.filter((r) => r.asset_id !== assetId),
          },
        },
      };
    }),

  setSettings: (partial) =>
    set((state) => {
      const current = state.drafts[state.activeMode];
      return {
        drafts: {
          ...state.drafts,
          [state.activeMode]: {
            ...current,
            settings: { ...current.settings, ...partial },
          },
        },
      };
    }),

  setCurrentJob: (job) => set({ currentJob: job }),
  clearCurrentJob: () => set({ currentJob: null }),

  resetDraft: () =>
    set((state) => ({
      drafts: {
        ...state.drafts,
        [state.activeMode]: emptyDraft(),
      },
    })),

  getActiveDraft: () => {
    const state = get();
    return state.drafts[state.activeMode];
  },
}));
