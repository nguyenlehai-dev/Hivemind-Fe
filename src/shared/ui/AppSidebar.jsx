import { NavLink } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { label: "Apps", icon: "▦", to: "/apps" },
  { label: "Custom", icon: "◆", to: "/custom" },
  { label: "Chat", icon: "◐", disabled: true },
  { label: "Recents", icon: "◷", to: "/jobs" },
  { label: "Workflow", icon: "◬", disabled: true },
  { label: "Characters", icon: "◉", disabled: true },
];

export default function AppSidebar() {
  return (
    <aside className="app-sidebar" aria-label="Workspace navigation">
      <nav className="app-sidebar__nav">
        {SIDEBAR_ITEMS.map((item) =>
          item.disabled ? (
            <span
              key={item.label}
              className="app-sidebar__item app-sidebar__item--disabled"
              title="Coming soon"
            >
              <span className="app-sidebar__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="app-sidebar__label">{item.label}</span>
              <span className="app-sidebar__tag">Soon</span>
            </span>
          ) : (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `app-sidebar__item ${isActive ? "app-sidebar__item--active" : ""}`
              }
            >
              <span className="app-sidebar__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="app-sidebar__label">{item.label}</span>
            </NavLink>
          ),
        )}
      </nav>
    </aside>
  );
}
