/**
 * Extract a user-facing error message from an Axios error, a TanStack mutation,
 * or a plain Error. Returns null when nothing meaningful is available.
 *
 * Usage:
 *   const message = getErrorMessage(mutation.error) ?? fallback;
 *   const message = getErrorMessage(mutation);          // also accepts the mutation obj
 */
export function getErrorMessage(source, fallback = null) {
  if (!source) return fallback;

  // TanStack mutation object
  if (source.error || source.data?.status === "error") {
    const fromError = getErrorMessage(source.error);
    if (fromError) return fromError;
    if (source.data?.status === "error") {
      return source.data?.message ?? fallback;
    }
  }

  // Axios error (has .response.data.error.message from our BE)
  const apiMessage = source.response?.data?.error?.message;
  if (apiMessage) return apiMessage;

  // Axios error with generic message
  if (source.message) return source.message;

  if (typeof source === "string") return source;

  return fallback;
}
