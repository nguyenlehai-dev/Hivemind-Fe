import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { disconnect, getAuthStatus, login, verifyOtp } from "../api/authApi";

const AUTH_KEY = ["runway", "auth", "status"];

export function useAuthStatus() {
  return useQuery({
    queryKey: AUTH_KEY,
    queryFn: getAuthStatus,
    staleTime: 30_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEY });
    },
  });
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEY });
    },
  });
}

export function useDisconnect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEY });
    },
  });
}
