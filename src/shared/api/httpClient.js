import axios from "axios";

import { getErrorMessage } from "../lib/getErrorMessage";
import { useToastStore } from "../store/useToastStore";

const DEFAULT_TIMEOUT_MS = 30_000;

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  withCredentials: false,
  timeout: DEFAULT_TIMEOUT_MS,
});

// Global auth token injector. Components/app bootstrap can call
// setAuthToken(token) once; every subsequent request carries it.
let authToken = null;
export function setAuthToken(token) {
  authToken = token;
}

httpClient.interceptors.request.use((config) => {
  if (authToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Toast on unexpected server errors (5xx) or network failures.
// 4xx errors bubble up — components decide how to surface them.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isNetwork = !error?.response;
    if (isNetwork || status >= 500) {
      const message = getErrorMessage(error, "Request failed");
      useToastStore.getState().push({ kind: "error", message });
    }
    return Promise.reject(error);
  },
);
