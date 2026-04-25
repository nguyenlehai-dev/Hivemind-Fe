import { useQuery } from "@tanstack/react-query";

import { getGeneration } from "../api/generationApi";

export function useGenerationJob(jobId) {
  return useQuery({
    queryKey: ["runway", "generation", jobId],
    queryFn: () => getGeneration(jobId),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") return false;
      return 1500;
    },
  });
}
