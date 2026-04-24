import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/lib/queryKeys";
import { disconnect, getAuthStatus, login, verifyOtp } from "../api/authApi";

export function useAuthStatus() {
  return useQuery({
    queryKey: queryKeys.auth.status(),
    queryFn: getAuthStatus,
    staleTime: 30_000,
  });
}

function useAuthMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.status() });
    },
  });
}

export function useLogin() {
  return useAuthMutation(login);
}

export function useVerifyOtp() {
  return useAuthMutation(verifyOtp);
}

export function useDisconnect() {
  return useAuthMutation(disconnect);
}
