import { useMutation, useQueryClient } from "@tanstack/react-query";

import { errorMessage, toast } from "../../../shared/store/useToastStore";
import { createGeneration } from "../api/generationApi";

export function useCreateGeneration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGeneration,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["runway", "generations"] });
      toast.success(`Job ${data.job_id} queued`);
    },
    onError: (err) => toast.error(errorMessage(err, "Failed to create job")),
  });
}
