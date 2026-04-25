import { useDeleteApp } from "../../hooks/useApps";

export default function AppDangerZone({ app, onDeleted }) {
  const deleteMutation = useDeleteApp();

  function handleDelete() {
    if (!window.confirm(`Delete app "${app.name}" permanently?`)) return;
    deleteMutation.mutate(app.id, { onSuccess: onDeleted });
  }

  return (
    <section className="app-section app-section--danger">
      <h2 className="app-section__title">Danger zone</h2>
      <p className="app-section__hint">
        Removing an app doesn't affect past generations it produced.
      </p>
      <button
        type="button"
        className="estate-button estate-button--ghost"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? "Deleting…" : "Delete app"}
      </button>
    </section>
  );
}
