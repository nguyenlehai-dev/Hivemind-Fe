import { Link, useNavigate } from "react-router-dom";

import AppShell from "../../shared/ui/AppShell";
import { useApps, useDeleteApp, useRunApp } from "./hooks/useApps";

export default function AppsPage() {
  const { data: apps = [], isLoading, isError, error } = useApps();
  const runMutation = useRunApp();
  const deleteMutation = useDeleteApp();
  const navigate = useNavigate();

  async function handleRun(app) {
    try {
      await runMutation.mutateAsync({ appId: app.id, overrides: {} });
      navigate("/jobs");
    } catch {
      /* error shown via mutation */
    }
  }

  function handleDelete(app) {
    if (!window.confirm(`Delete app "${app.name}"?`)) return;
    deleteMutation.mutate(app.id);
  }

  return (
    <AppShell className="apps-page" withSidebar>
      <div className="apps-main">
        <div className="apps-container">
          <div className="apps-header">
            <span className="estate-eyebrow">Apps</span>
            <h1>Saved presets</h1>
            <p>
              Apps là preset của composer (mode + model + prompt + settings).
              Lưu từ Custom page, chạy lại bất kỳ lúc nào mà không phải nhập lại.
            </p>
          </div>

          {isLoading && <div className="jobs-empty">Đang tải…</div>}

          {isError && (
            <div className="jobs-empty jobs-empty--error">
              Không tải được: {error?.response?.data?.error?.message ?? error?.message}
            </div>
          )}

          {!isLoading && !isError && apps.length === 0 && (
            <div className="jobs-empty">
              Chưa có app nào. Vào <strong>/custom</strong>, compose một generation,
              rồi click <strong>Save as App</strong> để tạo preset đầu tiên.
            </div>
          )}

          {apps.length > 0 && (
            <div className="apps-grid">
              {apps.map((app) => (
                <article
                  key={app.id}
                  className={`app-card app-card--${app.mode} app-card--clickable`}
                  onClick={() => navigate(`/apps/${app.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/apps/${app.id}`);
                    }
                  }}
                >
                  <header className="app-card__head">
                    <span className={`app-mode-chip app-mode-chip--${app.mode}`}>
                      {app.mode}
                    </span>
                    <h3>{app.name}</h3>
                  </header>
                  {app.description && (
                    <p className="app-card__desc">{app.description}</p>
                  )}
                  <dl className="app-card__meta">
                    <div>
                      <dt>Model</dt>
                      <dd>{app.model_id}</dd>
                    </div>
                    {app.prompt && (
                      <div>
                        <dt>Prompt</dt>
                        <dd className="app-card__prompt">{app.prompt}</dd>
                      </div>
                    )}
                    {app.settings?.aspect_ratio && (
                      <div>
                        <dt>Aspect</dt>
                        <dd>{app.settings.aspect_ratio}</dd>
                      </div>
                    )}
                    {app.settings?.seed != null && (
                      <div>
                        <dt>Seed</dt>
                        <dd>{app.settings.seed}</dd>
                      </div>
                    )}
                  </dl>
                  <div
                    className="app-card__actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="estate-button estate-button--ghost estate-button--small"
                      onClick={() => handleDelete(app)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </button>
                    <Link
                      to={`/apps/${app.id}`}
                      className="estate-button estate-button--ghost estate-button--small"
                    >
                      Open
                    </Link>
                    <button
                      type="button"
                      className="estate-button estate-button--small"
                      onClick={() => handleRun(app)}
                      disabled={runMutation.isPending || app.mode === "video"}
                      title={
                        app.mode === "video"
                          ? "Video apps require a reference — use Open"
                          : undefined
                      }
                    >
                      {runMutation.isPending && runMutation.variables?.appId === app.id
                        ? "Running…"
                        : "Quick run"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
