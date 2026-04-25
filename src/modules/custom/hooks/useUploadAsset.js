import { useMutation } from "@tanstack/react-query";

import { uploadAsset } from "../api/assetApi";

export function useUploadAsset() {
  return useMutation({
    mutationFn: uploadAsset,
  });
}
