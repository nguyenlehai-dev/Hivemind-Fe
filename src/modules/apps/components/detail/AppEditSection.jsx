import { useFormState } from "../../../../shared/hooks/useFormState";
import { getErrorMessage } from "../../../../shared/lib/getErrorMessage";
import { useUpdateApp } from "../../hooks/useApps";

function toFormValues(app) {
  return {
    name: app.name ?? "",
    description: app.description ?? "",
    prompt: app.prompt ?? "",
    aspect_ratio: app.settings?.aspect_ratio ?? "",
    seed: app.settings?.seed != null ? String(app.settings.seed) : "",
  };
}

export default function AppEditSection({ app }) {
  const form = useFormState(toFormValues(app), { resetWhen: app.id });
  const updateMutation = useUpdateApp();

  async function handleSave() {
    try {
      const settingsPatch = {
        ...(app.settings ?? {}),
        aspect_ratio:
          form.values.aspect_ratio || app.settings?.aspect_ratio || "16:9",
        seed: form.values.seed === "" ? null : Number(form.values.seed),
        num_outputs: app.settings?.num_outputs ?? 1,
      };
      await updateMutation.mutateAsync({
        appId: app.id,
        patch: {
          name: form.values.name,
          description: form.values.description,
          prompt: form.values.prompt,
          settings: settingsPatch,
        },
      });
    } catch {
      /* surface via error */
    }
  }

  const error = getErrorMessage(updateMutation);

  return (
    <section className="app-section">
      <h2 className="app-section__title">Edit preset</h2>
      <p className="app-section__hint">
        Changes save immediately. Running the app afterwards uses the new preset.
      </p>

      <div className="app-edit-form">
        <div className="app-edit-form__field">
          <label>Name</label>
          <input
            value={form.values.name}
            onChange={form.handleChange("name")}
          />
        </div>
        <div className="app-edit-form__field">
          <label>Description</label>
          <input
            value={form.values.description}
            onChange={form.handleChange("description")}
          />
        </div>
        <div className="app-edit-form__field">
          <label>Prompt</label>
          <textarea
            rows={3}
            value={form.values.prompt}
            onChange={form.handleChange("prompt")}
          />
        </div>
        <div className="app-edit-form__row">
          <div className="app-edit-form__field">
            <label>Aspect ratio</label>
            <select
              value={form.values.aspect_ratio}
              onChange={form.handleChange("aspect_ratio")}
            >
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="1:1">1:1</option>
              <option value="4:3">4:3</option>
              <option value="3:4">3:4</option>
            </select>
          </div>
          <div className="app-edit-form__field">
            <label>Seed</label>
            <input
              type="number"
              placeholder="(random)"
              value={form.values.seed}
              onChange={form.handleChange("seed")}
            />
          </div>
        </div>

        {error && <div className="auth-form__error">{error}</div>}

        <div className="app-edit-form__actions">
          <button
            type="button"
            className="estate-button"
            onClick={handleSave}
            disabled={!form.isDirty || updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </section>
  );
}
