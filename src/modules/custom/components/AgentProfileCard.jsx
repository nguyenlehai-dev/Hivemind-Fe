export default function AgentProfileCard({
  image,
  name,
  role,
  note,
  trustSignal,
  specialty,
}) {
  return (
    <article className="estate-glass-card estate-agent-card">
      <div className="estate-agent-card__avatar">
        <img src={image} alt={name} className="estate-agent-card__photo" />
      </div>
      <div className="estate-agent-card__body">
        <strong>{name}</strong>
        <span>{role}</span>
        <p>{note}</p>
        <div className="estate-agent-card__tags">
          <span>{specialty}</span>
          <span>{trustSignal}</span>
        </div>
      </div>
    </article>
  );
}
