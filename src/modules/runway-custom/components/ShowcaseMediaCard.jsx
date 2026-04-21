export default function ShowcaseMediaCard({
  title,
  description,
  eyebrow,
  mediaType = "image",
  image,
  video,
  primaryAction,
  secondaryAction,
}) {
  return (
    <article className="showcase-card">
      <div className="showcase-card__media">
        {mediaType === "video" ? (
          <video
            className="showcase-card__asset"
            src={video}
            poster={image}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img className="showcase-card__asset" src={image} alt={title} />
        )}

        <div className="showcase-card__overlay">
          <span>{eyebrow}</span>
          <button type="button" className="showcase-card__learn-more">
            Learn more
          </button>
        </div>
      </div>

      <div className="showcase-card__body">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="showcase-card__actions">
          {primaryAction ? (
            <button type="button" className="estate-button estate-button--small showcase-card__primary">
              {primaryAction}
            </button>
          ) : null}
          {secondaryAction ? (
            <button type="button" className="estate-button estate-button--ghost estate-button--small">
              {secondaryAction}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
