export default function FloatingPanel({
  className = "",
  bodyClassName = "",
  title,
  titleAs: TitleTag = "p",
  children,
  ...props
}) {
  return (
    <div className={`floating-panel ${className}`.trim()} {...props}>
      <div className={`floating-panel__body ${bodyClassName}`.trim()}>
        {title ? <TitleTag className="floating-panel__title">{title}</TitleTag> : null}
        {children}
      </div>
    </div>
  );
}
