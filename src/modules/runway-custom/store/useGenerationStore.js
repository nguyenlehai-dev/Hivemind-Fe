import { create } from "zustand";

import { createCurrentJobSlice } from "./slices/currentJobSlice";
import { createGenerationDraftSlice } from "./slices/generationDraftSlice";

/**
 * Generation module store. Composed from slices so each concern owns its
 * state and actions — add a new slice by spreading it below.
 */
export const useGenerationStore = create((set, get) => ({
  ...createGenerationDraftSlice(set, get),
  ...createCurrentJobSlice(set, get),
}));
