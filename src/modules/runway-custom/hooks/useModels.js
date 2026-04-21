import { useQuery } from "@tanstack/react-query";

import { listModels } from "../api/modelApi";

export function useRunwayModels(mode = "image") {
  return useQuery({
    queryKey: ["runway", "models", mode],
    queryFn: () => listModels(mode),
    staleTime: 5 * 60 * 1000,
  });
}
