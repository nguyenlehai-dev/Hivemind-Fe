import { useCallback, useState } from "react";

/**
 * Boolean open/close state for modals, drawers, popovers.
 * Returns a stable API so consumers can pass handlers without re-memoising.
 */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  return { isOpen, open, close, toggle, setIsOpen };
}
