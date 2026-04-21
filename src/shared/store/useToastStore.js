import { create } from "zustand";

let nextId = 1;

export const useToastStore = create((set, get) => ({
  toasts: [],
  push: (toast) => {
    const id = nextId++;
    const entry = {
      id,
      kind: toast.kind ?? "info",
      message: toast.message,
      timeout: toast.timeout ?? 4000,
    };
    set((state) => ({ toasts: [...state.toasts, entry] }));
    if (entry.timeout > 0) {
      setTimeout(() => {
        get().dismiss(id);
      }, entry.timeout);
    }
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

export const toast = {
  success: (message, opts) =>
    useToastStore.getState().push({ kind: "success", message, ...opts }),
  error: (message, opts) =>
    useToastStore.getState().push({ kind: "error", message, ...opts }),
  info: (message, opts) =>
    useToastStore.getState().push({ kind: "info", message, ...opts }),
};

export function errorMessage(error, fallback = "Something went wrong") {
  return (
    error?.response?.data?.error?.message ??
    error?.message ??
    fallback
  );
}
