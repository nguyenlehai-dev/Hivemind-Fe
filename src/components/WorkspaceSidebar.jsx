const items = [
  "Apps",
  "Custom",
  "Chat",
  "Recents",
  "Workflow",
  "Characters",
];

export default function WorkspaceSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">HM</div>
      <nav className="sidebar__nav">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={`sidebar__item ${item === "Custom" ? "is-active" : ""}`}
          >
            <span className="sidebar__glyph" />
            <span>{item}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
