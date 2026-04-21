export default function AssetPanel({ references }) {
  return (
    <section className="panel">
      <div className="panel__header">
        <h3>Images</h3>
        <span>{references.length} attached</span>
      </div>
      <div className="asset-grid">
        {references.length ? (
          references.map((item) => (
            <article key={item.id} className="asset-card">
              <img src={item.previewUrl} alt={item.name} className="asset-card__image" />
              <div className="asset-card__meta">
                <strong>{item.name}</strong>
                <span>{item.status}</span>
              </div>
            </article>
          ))
        ) : (
          <div className="asset-panel__empty">
            Reference images you upload will appear here for quick reuse.
          </div>
        )}
      </div>
    </section>
  );
}
