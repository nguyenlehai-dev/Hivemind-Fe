/**
 * Zustand slice: layout (sidebar collapsed state, etc).
 */
export const createLayoutSlice = (set) => ({
  leftPanelCollapsed: false,
  toggleLeftPanel: () =>
    set((state) => ({ leftPanelCollapsed: !state.leftPanelCollapsed })),
  setLeftPanelCollapsed: (collapsed) =>
    set({ leftPanelCollapsed: collapsed }),
});
