function baseProps(props) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    ...props,
  };
}

export function AppsIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function SlidersIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <line x1="6" y1="4" x2="6" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="18" y1="4" x2="18" y2="20" />
      <circle cx="6" cy="9" r="2" />
      <circle cx="12" cy="15" r="2" />
      <circle cx="18" cy="7" r="2" />
    </svg>
  );
}

export function SparklesIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
      <path d="M5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14z" />
    </svg>
  );
}

export function ClockIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function WorkflowIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3.5" y="4" width="6" height="6" rx="1.5" />
      <rect x="14.5" y="14" width="6" height="6" rx="1.5" />
      <rect x="3.5" y="14" width="6" height="6" rx="1.5" />
      <path d="M9.5 7h5a2 2 0 012 2v5" />
    </svg>
  );
}

export function UserBadgeIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19a7 7 0 0114 0" />
      <path d="M19 5l1 1 2-2" />
    </svg>
  );
}

export function ImageIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M6.5 16l3.5-3 2.5 2 3.5-4 2 2.5" />
    </svg>
  );
}

export function VideoIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3.5" y="6" width="11" height="12" rx="2" />
      <path d="M14.5 10l6-3v10l-6-3z" />
    </svg>
  );
}

export function AudioIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <path d="M6 9v6" />
      <path d="M10 6v12" />
      <path d="M14 8v8" />
      <path d="M18 5v14" />
    </svg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function WandIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 20l9.5-9.5" />
      <path d="M13 5l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
      <path d="M17 11l.6-1.4L19 9l-1.4-.6L17 7l-.6 1.4L15 9l1.4.6L17 11z" />
      <path d="M3 15l1.2-2.8L7 11l-2.8-1.2L3 7 1.8 9.8 0 11l1.8 1.2L3 15z" />
    </svg>
  );
}

export function RatioIcon(props) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M8 10l2.5 4" />
      <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
