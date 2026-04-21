import { useQuery } from "@tanstack/react-query";

import { getCapabilities } from "../api/capabilitiesApi";

export function useCapabilities() {
  return useQuery({
    queryKey: ["runway", "capabilities"],
    queryFn: getCapabilities,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useGenerationMode(mode, references) {
  const { data, isLoading, isError, error } = useCapabilities();

  if (isError) {
    const status = error?.response?.status;
    return {
      kind: "mock",
      reason:
        status === 404
          ? "Backend missing /api/runway/capabilities — restart uvicorn to pick up the new endpoint."
          : `Capabilities check failed (${error?.message ?? "unknown"}). Assuming mock.`,
    };
  }

  if (isLoading || !data) {
    return { kind: "unknown", reason: "Loading capabilities…" };
  }

  const canReal = data.real_generation_modes.includes(mode);
  const needsRef = data.requires_reference_modes.includes(mode);
  const hasRef = (references?.length ?? 0) > 0;
  const backend = data.backend;

  // Backend not configured for real paths
  if (backend === "mock") {
    return {
      kind: "mock",
      reason: "Backend set to mock. Set HIVEMIND_RUNWAY_BACKEND=api or scraper to go live.",
    };
  }

  if (backend === "api" && !data.runway_api_configured) {
    return {
      kind: "mock",
      reason: "Backend=api but HIVEMIND_RUNWAY_API_KEY is empty — falls back to mock.",
    };
  }

  if (backend === "scraper" && !data.scraper_ready) {
    return {
      kind: "mock",
      reason: "Backend=scraper but HIVEMIND_RUNWAY_TEAM_SLUG is empty — falls back to mock.",
    };
  }

  if (!canReal) {
    return {
      kind: "mock",
      reason: `Backend=${backend} doesn't support mode "${mode}". Falls back to mock.`,
    };
  }

  if (needsRef && !hasRef) {
    return {
      kind: "mock",
      reason: `Mode "${mode}" requires a reference image on backend=${backend}. Falls back to mock.`,
    };
  }

  const detail =
    backend === "api"
      ? `Runway Developer API (${data.default_video_model}). Credits will be used.`
      : "Playwright scraper on app.runwayml.com. Fragile, watch the browser.";

  return { kind: "live", reason: `Live via ${backend} — ${detail}` };
}
