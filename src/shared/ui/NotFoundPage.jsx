import { Link, useLocation } from "react-router-dom";

import AppShell from "./AppShell";

export default function NotFoundPage() {
  const location = useLocation();
  return (
    <AppShell>
      <div className="not-found">
        <span className="estate-eyebrow not-found__eyebrow">404</span>
        <h1>Page not found</h1>
        <p>
          Nothing at <code>{location.pathname}</code>. The link may be stale, or
          the feature hasn't been built yet.
        </p>
        <div className="not-found__links">
          <Link to="/" className="estate-button estate-button--ghost">
            Home
          </Link>
          <Link to="/custom" className="estate-button">
            Open workflow
          </Link>
          <Link to="/apps" className="estate-button estate-button--ghost">
            Apps
          </Link>
          <Link to="/jobs" className="estate-button estate-button--ghost">
            Jobs
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
