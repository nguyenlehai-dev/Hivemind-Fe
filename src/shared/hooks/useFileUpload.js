import { useCallback, useRef } from "react";

/**
 * Reusable file-upload pattern: keeps an <input type="file"> ref, handles
 * multi-file iteration with a max, calls a mutation per file.
 *
 * Caller supplies:
 *   - uploadMutation: any async mutation taking a File and returning an asset
 *   - max: how many simultaneous assets the slot can hold
 *   - currentCount: how many are already filled
 *   - onUploaded: callback invoked with the resolved asset after each success
 *
 * Returns { inputRef, openPicker, handleFiles, inputProps } — spread
 * `inputProps` onto <input type="file" />.
 */
export function useFileUpload({
  uploadMutation,
  max = 4,
  currentCount = 0,
  onUploaded,
  accept = "image/*",
  multiple = true,
}) {
  const inputRef = useRef(null);

  const openPicker = useCallback(() => inputRef.current?.click(), []);

  const handleFiles = useCallback(
    async (fileList) => {
      const remaining = Math.max(0, max - currentCount);
      const files = Array.from(fileList ?? []).slice(0, remaining);
      for (const file of files) {
        try {
          const asset = await uploadMutation.mutateAsync(file);
          onUploaded?.(asset);
        } catch {
          /* error visible via mutation state */
        }
      }
    },
    [uploadMutation, max, currentCount, onUploaded],
  );

  const inputProps = {
    ref: inputRef,
    type: "file",
    accept,
    multiple,
    hidden: true,
    onChange: (e) => {
      handleFiles(e.target.files);
      e.target.value = "";
    },
  };

  return { inputRef, openPicker, handleFiles, inputProps };
}
