import { Link, NavLink } from "react-router-dom";

import { useAuthStatus } from "../../modules/custom/hooks/useAuth";
import { MODAL_KEYS, useUiStore } from "../store/useUiStore";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/custom", label: "Custom" },
  { to: "/jobs", label: "Jobs" },
];

export default function AppHeader({
  variant = "light",
  showNav = true,
  navItems = NAV_ITEMS,
  onOpenWorkflow,
}) {
  const openModal = useUiStore((s) => s.openModal);
  const { data: authStatus } = useAuthStatus();

  const isConnected = authStatus?.status === "connected";

  return (
    <header className={`app-header app-header--${variant}`}>
      <div className="app-header__inner">
        <Link to="/" className="app-header__brand">
          <div className="app-header__mark">H</div>
          <div>
            <strong>Hivemind</strong>
            <span>Runway custom workflow</span>
          </div>
        </Link>

        {showNav && (
          <nav className="app-header__nav">
            {navItems.map((item) =>
              item.onClick ? (
                <button
                  key={item.label}
                  type="button"
                  className={`app-header__link ${item.isActive ? "app-header__link--active" : ""}`}
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `app-header__link ${isActive ? "app-header__link--active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>
        )}

        <div className="app-header__actions">
          <button
            type="button"
            className={`auth-pill auth-pill--${isConnected ? "connected" : "disconnected"}`}
            onClick={() => openModal(MODAL_KEYS.AUTH)}
            title={isConnected ? "Connected — click to reconnect" : "Click to connect Runway"}
          >
            <span className="auth-pill__dot" />
            {isConnected ? (
              <>
                <span className="auth-pill__label">Connected</span>
                <span className="auth-pill__email">{authStatus?.email}</span>
              </>
            ) : (
              <span className="auth-pill__label">Connect Runway</span>
            )}
          </button>
          {onOpenWorkflow ? (
            <button
              type="button"
              className="estate-button estate-button--small"
              onClick={onOpenWorkflow}
            >
              Open workflow
            </button>
          ) : (
            <Link to="/custom" className="estate-button estate-button--small">
              Open workflow
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
