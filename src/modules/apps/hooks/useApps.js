import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { errorMessage, toast } from "../../../shared/store/useToastStore";
import {
  createApp,
  deleteApp,
  getApp,
  listApps,
  runApp,
  updateApp,
} from "../api/appApi";

const APPS_KEY = ["runway", "apps"];
const appKey = (id) => ["runway", "apps", id];

export function useApps() {
  return useQuery({
    queryKey: APPS_KEY,
    queryFn: listApps,
  });
}

export function useApp(appId) {
  return useQuery({
    queryKey: appKey(appId),
    queryFn: () => getApp(appId),
    enabled: Boolean(appId),
  });
}

export function useCreateApp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApp,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: APPS_KEY });
      toast.success(`Saved "${data.name}"`);
    },
    onError: (err) => toast.error(errorMessage(err, "Save failed")),
  });
}

export function useUpdateApp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, patch }) => updateApp(appId, patch),
    onSuccess: (_, { appId }) => {
      queryClient.invalidateQueries({ queryKey: APPS_KEY });
      queryClient.invalidateQueries({ queryKey: appKey(appId) });
      toast.success("App updated");
    },
    onError: (err) => toast.error(errorMessage(err, "Update failed")),
  });
}

export function useDeleteApp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPS_KEY });
      toast.info("App deleted");
    },
    onError: (err) => toast.error(errorMessage(err, "Delete failed")),
  });
}

export function useRunApp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, overrides }) => runApp(appId, overrides),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["runway", "generations"] });
      toast.success(`Running → ${data.job_id}`);
    },
    onError: (err) => toast.error(errorMessage(err, "Run failed")),
  });
}
