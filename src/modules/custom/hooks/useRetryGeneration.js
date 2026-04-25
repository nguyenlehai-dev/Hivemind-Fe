import { useMutation, useQueryClient } from "@tanstack/react-query";

import { errorMessage, toast } from "../../../shared/store/useToastStore";
import { retryGeneration } from "../api/generationApi";

export function useRetryGeneration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: retryGeneration,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["runway", "generations"] });
      toast.success(`Retrying as ${data.job_id}`);
    },
    onError: (err) => toast.error(errorMessage(err, "Retry failed")),
  });
}
