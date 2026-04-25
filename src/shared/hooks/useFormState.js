import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Minimal form state manager for flat objects. Not a replacement for
 * react-hook-form, just enough structure to avoid 5× `useState` + ad-hoc
 * `dirty` booleans across the codebase.
 *
 * Usage:
 *   const form = useFormState({ name: "", prompt: "" });
 *   form.values.name
 *   form.setField("name", "x")
 *   form.handleChange("name")(e)     // onChange={form.handleChange("name")}
 *   form.reset()
 *   form.isDirty  // compared against initial
 */
export function useFormState(initialValues, { resetWhen } = {}) {
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    if (resetWhen !== undefined) setValues(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetWhen]);

  const setField = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleChange = useCallback(
    (name) => (event) => {
      const next = event?.target
        ? event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value
        : event;
      setField(name, next);
    },
    [setField],
  );

  const reset = useCallback(
    (nextValues) => setValues(nextValues ?? initialValues),
    [initialValues],
  );

  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialValues),
    [values, initialValues],
  );

  return { values, setField, handleChange, reset, isDirty, setValues };
}
