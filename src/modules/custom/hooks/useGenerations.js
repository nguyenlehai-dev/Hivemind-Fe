import { useQuery } from "@tanstack/react-query";

import { listGenerations } from "../api/generationApi";

export function useRunwayGenerations() {
  return useQuery({
    queryKey: ["runway", "generations"],
    queryFn: listGenerations,
    refetchInterval: (query) => {
      const jobs = query.state.data ?? [];
      const hasPending = jobs.some(
        (job) => job.status === "queued" || job.status === "running",
      );
      return hasPending ? 2000 : false;
    },
  });
}
