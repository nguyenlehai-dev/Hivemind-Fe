/**
 * Slice: the "current job" pointer surfaced on the canvas/preview stage.
 */
export const createCurrentJobSlice = (set) => ({
  currentJob: null,
  setCurrentJob: (job) => set({ currentJob: job }),
  clearCurrentJob: () => set({ currentJob: null }),
});
