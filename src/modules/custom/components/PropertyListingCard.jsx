export default function PropertyListingCard({
  image,
  status,
  title,
  location,
  price,
  meta,
  highlights = [],
  type,
}) {
  return (
    <article className="estate-glass-card estate-listing-card">
      <div className="estate-listing-card__image">
        <img src={image} alt={title} className="estate-listing-card__photo" />
        <span className="estate-listing-card__badge">{status}</span>
        {type ? <span className="estate-listing-card__type">{type}</span> : null}
      </div>
      <div className="estate-listing-card__body">
        <div className="estate-listing-card__heading">
          <div>
            <h3>{title}</h3>
            <p>{location}</p>
          </div>
          <strong>{price}</strong>
        </div>
        <div className="estate-listing-card__meta">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        {highlights.length ? (
          <ul className="estate-listing-card__highlights">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        <button type="button" className="estate-button estate-button--ghost estate-button--small">
          Open Modal Spec
        </button>
      </div>
    </article>
  );
}
