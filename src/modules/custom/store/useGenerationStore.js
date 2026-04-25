import { create } from "zustand";

import { getPresetInitialInputs } from "../customPresets";

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

const emptyModeMap = () => ({
  image: null,
  video: null,
  audio: null,
});

const emptyPresetInputsMap = () => ({
  image: {},
  video: {},
  audio: {},
});

export const useGenerationStore = create((set, get) => ({
  activeMode: "image",
  drafts: initialDrafts,
  selectedPresetByMode: emptyModeMap(),
  presetInputsByMode: emptyPresetInputsMap(),
  currentJob: null,
  promtCounter: 0,

  setPromtCoumter: (value) => set({ promtCounter: value }),

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

  selectPreset: (preset) =>
    set((state) => {
      const current = state.drafts[state.activeMode];
      return {
        selectedPresetByMode: {
          ...state.selectedPresetByMode,
          [state.activeMode]: preset,
        },
        presetInputsByMode: {
          ...state.presetInputsByMode,
          [state.activeMode]: preset ? getPresetInitialInputs(preset) : {},
        },
        drafts: {
          ...state.drafts,
          [state.activeMode]: {
            ...current,
            settings: {
              ...current.settings,
              ...(preset?.defaults?.settings ?? {}),
            },
          },
        },
      };
    }),

  setPresetInput: (fieldKey, value) =>
    set((state) => ({
      presetInputsByMode: {
        ...state.presetInputsByMode,
        [state.activeMode]: {
          ...state.presetInputsByMode[state.activeMode],
          [fieldKey]: value,
        },
      },
    })),

  addPresetReference: (fieldKey, asset, maxAssets = 1) =>
    set((state) => {
      const currentInputs = state.presetInputsByMode[state.activeMode] ?? {};
      const currentAssets = currentInputs[fieldKey] ?? [];
      if (currentAssets.some((item) => item.asset_id === asset.asset_id)) return state;
      return {
        presetInputsByMode: {
          ...state.presetInputsByMode,
          [state.activeMode]: {
            ...currentInputs,
            [fieldKey]:
              maxAssets <= 1
                ? [asset]
                : [...currentAssets, asset].slice(0, maxAssets),
          },
        },
      };
    }),

  removePresetReference: (fieldKey, assetId) =>
    set((state) => {
      const currentInputs = state.presetInputsByMode[state.activeMode] ?? {};
      return {
        presetInputsByMode: {
          ...state.presetInputsByMode,
          [state.activeMode]: {
            ...currentInputs,
            [fieldKey]: (currentInputs[fieldKey] ?? []).filter(
              (item) => item.asset_id !== assetId,
            ),
          },
        },
      };
    }),

  applyAppPreset: (app) =>
    set((state) => {
      if (!app) return state;
      const current = state.drafts[state.activeMode];
      return {
        drafts: {
          ...state.drafts,
          [state.activeMode]: {
            ...current,
            prompt: app.prompt ?? "",
            modelId: app.model_id ?? current.modelId,
            settings: {
              ...current.settings,
              ...(app.settings ?? {}),
            },
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
      selectedPresetByMode: {
        ...state.selectedPresetByMode,
        [state.activeMode]: null,
      },
      presetInputsByMode: {
        ...state.presetInputsByMode,
        [state.activeMode]: {},
      },
    })),

  getActiveDraft: () => {
    const state = get();
    return state.drafts[state.activeMode];
  },
}));
