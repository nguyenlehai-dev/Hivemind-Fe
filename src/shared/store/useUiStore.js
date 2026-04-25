import { create } from "zustand";

import { MODAL_KEYS, createModalSlice } from "./slices/modalSlice";
import { createLayoutSlice } from "./slices/layoutSlice";

/**
 * App-wide UI store composed from slices. Add a new slice by importing its
 * creator and spreading it into the body below — no need to touch consumers.
 */
export const useUiStore = create((set, get) => ({
  ...createModalSlice(set, get),
  ...createLayoutSlice(set, get),
}));

export { MODAL_KEYS };
