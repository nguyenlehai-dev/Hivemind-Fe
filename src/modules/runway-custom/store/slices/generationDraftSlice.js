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

/**
 * Slice: per-mode generation draft (prompt, references, settings, model).
 * Composes into useGenerationStore via `...createGenerationDraftSlice(set, get)`.
 */
export const createGenerationDraftSlice = (set, get) => {
  const patchActive = (producer) =>
    set((state) => {
      const mode = state.activeMode;
      const current = state.drafts[mode];
      return {
        drafts: { ...state.drafts, [mode]: producer(current) },
      };
    });

  return {
    activeMode: "image",
    drafts: initialDrafts,

    setMode: (mode) => set({ activeMode: mode }),

    setPrompt: (prompt) =>
      patchActive((current) => ({ ...current, prompt })),

    setModelId: (modelId) =>
      patchActive((current) => ({ ...current, modelId })),

    addReference: (asset) =>
      patchActive((current) => {
        if (current.references.some((r) => r.asset_id === asset.asset_id)) {
          return current;
        }
        return { ...current, references: [...current.references, asset] };
      }),

    removeReference: (assetId) =>
      patchActive((current) => ({
        ...current,
        references: current.references.filter((r) => r.asset_id !== assetId),
      })),

    setSettings: (partial) =>
      patchActive((current) => ({
        ...current,
        settings: { ...current.settings, ...partial },
      })),

    resetDraft: () => patchActive(() => emptyDraft()),

    getActiveDraft: () => {
      const state = get();
      return state.drafts[state.activeMode];
    },
  };
};
