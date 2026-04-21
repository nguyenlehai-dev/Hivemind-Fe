import { create } from "zustand";

export const MODAL_KEYS = {
  AUTH: "auth",
  MODEL_PICKER: "model-picker",
  ASSET_UPLOAD: "asset-upload",
  ASSET_PREVIEW: "asset-preview",
  ADVANCED_SETTINGS: "advanced-settings",
  RESULT_DETAIL: "result-detail",
};

export const useUiStore = create((set) => ({
  activeModal: null,
  modalPayload: null,
  leftPanelCollapsed: false,

  openModal: (key, payload = null) => set({ activeModal: key, modalPayload: payload }),
  closeModal: () => set({ activeModal: null, modalPayload: null }),
  toggleLeftPanel: () =>
    set((state) => ({ leftPanelCollapsed: !state.leftPanelCollapsed })),
}));
