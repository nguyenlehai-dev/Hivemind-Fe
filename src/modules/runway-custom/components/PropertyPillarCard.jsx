export default function PropertyPillarCard({ eyebrow, title, description }) {
  return (
    <article className="estate-glass-card estate-pillar-card">
      <span className="estate-eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
