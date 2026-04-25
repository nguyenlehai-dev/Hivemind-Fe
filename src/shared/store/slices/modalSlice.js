export const MODAL_KEYS = {
  AUTH: "auth",
  MODEL_PICKER: "model-picker",
  ASSET_UPLOAD: "asset-upload",
  ASSET_PREVIEW: "asset-preview",
  ADVANCED_SETTINGS: "advanced-settings",
  RESULT_DETAIL: "result-detail",
};

/**
 * Zustand slice: app-wide single-modal state.
 * Compose into a store via { ...createModalSlice(set, get) }.
 */
export const createModalSlice = (set) => ({
  activeModal: null,
  modalPayload: null,

  openModal: (key, payload = null) =>
    set({ activeModal: key, modalPayload: payload }),
  closeModal: () => set({ activeModal: null, modalPayload: null }),
  isModalOpen: (key) => (state) => state.activeModal === key,
});
