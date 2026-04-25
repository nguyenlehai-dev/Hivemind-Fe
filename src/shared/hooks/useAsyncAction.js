import { useCallback, useRef, useState } from "react";

/**
 * Lightweight async wrapper — alternative to useMutation when you don't need
 * React Query's cache. Tracks pending/error state and prevents overlapping
 * calls. Cleaner than scattering try/catch + useState in every component.
 *
 * Usage:
 *   const runAction = useAsyncAction(async (arg) => await api.doThing(arg));
 *   runAction.run(arg);        // fire-and-forget (logs rejection)
 *   await runAction.runAsync(arg);  // await the promise
 *   runAction.isPending / runAction.error / runAction.reset()
 */
export function useAsyncAction(fn) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const latest = useRef(fn);
  latest.current = fn;

  const runAsync = useCallback(async (...args) => {
    setIsPending(true);
    setError(null);
    try {
      return await latest.current(...args);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  const run = useCallback(
    (...args) => {
      runAsync(...args).catch(() => {
        /* consumers read `error` */
      });
    },
    [runAsync],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsPending(false);
  }, []);

  return { run, runAsync, isPending, error, reset };
}
