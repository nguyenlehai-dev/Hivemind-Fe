import {
  AppsIcon,
  ClockIcon,
  SlidersIcon,
  SparklesIcon,
  UserBadgeIcon,
  WorkflowIcon,
} from "../../../shared/icons";

const items = [
  { label: "Apps", icon: AppsIcon },
  { label: "Custom", icon: SlidersIcon },
  { label: "Chat", icon: SparklesIcon },
  { label: "Recents", icon: ClockIcon },
  { label: "Workflow", icon: WorkflowIcon },
  { label: "Characters", icon: UserBadgeIcon },
];

export default function WorkspaceSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">HM</div>
      <nav className="sidebar__nav">
        {items.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className={`sidebar__item ${label === "Custom" ? "is-active" : ""}`}
          >
            <span className="sidebar__glyph">
              <Icon />
            </span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
