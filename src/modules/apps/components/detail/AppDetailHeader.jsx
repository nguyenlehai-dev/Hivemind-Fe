import { Link } from "react-router-dom";

export default function AppDetailHeader({ app, isLoading, isError, error }) {
  return (
    <div className="apps-header apps-header--with-back">
      <Link to="/apps" className="back-link">← Apps</Link>
      {isLoading && <h1>Loading…</h1>}
      {isError && (
        <h1 className="jobs-empty--error">
          {error?.response?.status === 404
            ? "App not found."
            : `Could not load app: ${error?.message}`}
        </h1>
      )}
      {app && (
        <>
          <span className={`app-mode-chip app-mode-chip--${app.mode}`}>
            {app.mode}
          </span>
          <h1>{app.name}</h1>
          {app.description && <p>{app.description}</p>}
        </>
      )}
    </div>
  );
}
