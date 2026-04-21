import { useMutation, useQueryClient } from "@tanstack/react-query";

import { errorMessage, toast } from "../../../shared/store/useToastStore";
import { cancelGeneration } from "../api/generationApi";

export function useCancelGeneration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelGeneration,
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ["runway", "generations"] });
      queryClient.invalidateQueries({
        queryKey: ["runway", "generation", jobId],
      });
      toast.info("Job removed");
    },
    onError: (err) => toast.error(errorMessage(err, "Failed to cancel")),
  });
}
