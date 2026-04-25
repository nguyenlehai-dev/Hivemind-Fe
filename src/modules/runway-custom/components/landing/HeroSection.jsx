import { TRUST_STATS } from "../../data/landingContent";

export default function HeroSection() {
  return (
    <section className="estate-hero">
      <div className="estate-hero__overlay" />
      <div className="estate-hero__inner">
        <div className="estate-hero__content">
          <span className="estate-badge">
            <span className="estate-badge__dot" />
            Runway Custom UI
          </span>
          <h1>
            Design one
            <br />
            <span className="estate-gold-accent">clean model picker</span>
          </h1>
          <p>
            Hivemind is shaping a premium frontend for Runway-style generation.
            The goal is a reusable modal system where provider tabs, model results,
            and selection state stay predictable across the workflow.
          </p>

          <div className="estate-search-panel estate-glass-card">
            <div className="estate-search-field">
              <label>Mode</label>
              <input type="text" value="Image" readOnly />
            </div>
            <div className="estate-search-divider" />
            <div className="estate-search-field">
              <label>Provider</label>
              <select defaultValue="Google">
                <option>Google</option>
                <option>Runway</option>
                <option>Black Forest Labs</option>
                <option>OpenAI</option>
              </select>
            </div>
            <div className="estate-search-divider" />
            <div className="estate-search-field">
              <label>Modal Focus</label>
              <select defaultValue="Model Picker">
                <option>Model Picker</option>
                <option>Reference Assets</option>
                <option>Generation Settings</option>
              </select>
            </div>
            <button type="button" className="estate-button estate-button--search">
              Preview
            </button>
          </div>

          <div className="estate-hero-stats">
            {TRUST_STATS.map((stat) => (
              <article key={stat.label} className="estate-hero-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="estate-hero__visual">
          <div className="estate-tour-panel estate-glass-card">
            <div className="estate-tour-panel__header">
              <span>Modal preview</span>
              <span>Custom workflow</span>
            </div>
            <div className="estate-tour-panel__stage">
              <div className="estate-tour-panel__play">
                <span>Open Modal</span>
              </div>
              <div className="estate-tour-panel__overlay-card">
                <span>Provider tabs · filtered list</span>
                <strong>Search, switch provider, select model, sync generate CTA</strong>
              </div>
            </div>
            <div className="estate-tour-panel__footer">
              <article className="estate-mini-card">
                <span>Input</span>
                <strong>Search image models</strong>
              </article>
              <article className="estate-mini-card">
                <span>Context</span>
                <strong>Featured / Google / Runway</strong>
              </article>
              <article className="estate-mini-card">
                <span>Output</span>
                <strong>Selected model in composer</strong>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
