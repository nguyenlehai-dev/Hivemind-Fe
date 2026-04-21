import AppShell from "../../shared/ui/AppShell";
import PropertyPillarCard from "./components/PropertyPillarCard";
import ShowcaseMediaCard from "./components/ShowcaseMediaCard";

export default function RunwayCustomPage() {
  const pillars = [
    {
      eyebrow: "Search Layer",
      title: "Search once and keep every provider tab in the same modal context",
      description:
        "Users type a keyword one time, then keep switching between Featured, Google, Runway, or Black Forest Labs without losing their search intent.",
    },
    {
      eyebrow: "Provider Tabs",
      title: "Each modal view isolates the correct vendor family and model behavior",
      description:
        "Google tabs surface Nano Banana and Gemini variants, Runway tabs show Gen-4 family, while Black Forest Labs keeps FLUX choices grouped cleanly.",
    },
    {
      eyebrow: "Selection Logic",
      title: "Choosing a model updates the composer, primary CTA, and current workflow state",
      description:
        "The selected row should immediately sync back to the active dropdown and keep the Generate action aligned with the chosen provider.",
    },
    {
      eyebrow: "Reusable UX",
      title: "One modal pattern can scale to image, video, and future custom workflow surfaces",
      description:
        "The same shell can support provider chips, search, filtered results, and fallback states so the Hivemind frontend stays modular and reusable.",
    },
  ];

  const trustStats = [
    { value: "5+", label: "provider groups" },
    { value: "10+", label: "image models" },
    { value: "1", label: "shared modal system" },
  ];

  const showcases = [
    {
      eyebrow: "Model Picker",
      title: "Google Models: searchable image model groups",
      description:
        "A dedicated provider view for Nano Banana and Gemini variants, optimized for fast switching inside the custom image workflow.",
      mediaType: "video",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&h=700&fit=crop",
      video: "https://cdn.coverr.co/videos/coverr-typing-on-a-laptop-in-close-up-1562693168206?download=1080p",
      primaryAction: "Try now",
      secondaryAction: "Learn more",
    },
    {
      eyebrow: "Runway Models",
      title: "Runway-native generation modes in one filtered view",
      description:
        "This block represents the tab where Gen-4 family models appear without vendor noise, keeping the decision path short and readable.",
      mediaType: "video",
      image:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&h=700&fit=crop",
      video: "https://cdn.coverr.co/videos/coverr-robot-working-in-a-modern-factory-5533/1080p.mp4",
      primaryAction: "Open picker",
      secondaryAction: "Learn more",
    },
    {
      eyebrow: "Interactive States",
      title: "Modal navigation that keeps provider chips and row selection predictable",
      description:
        "The active chip, result list, and selected model should stay synchronized so users always understand what the Generate button will use.",
      mediaType: "video",
      image:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=900&h=700&fit=crop",
      video: "https://cdn.coverr.co/videos/coverr-toys-on-the-floor-1563700887691?download=1080p",
      primaryAction: "Preview states",
      secondaryAction: "Learn more",
    },
    {
      eyebrow: "Workflow Surface",
      title: "A reusable Hivemind card system for future image, video, and audio flows",
      description:
        "Once the shell is stable, the same media-first layout can support additional custom workflow surfaces without rebuilding the interaction model.",
      mediaType: "image",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&h=700&fit=crop",
      primaryAction: "Use in Hivemind",
      secondaryAction: "Learn more",
    },
  ];

  return (
    <AppShell headerVariant="overlay" className="estate-page">
      <div className="estate-main">
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
                {trustStats.map((stat) => (
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

        <section className="estate-section estate-section--showcase" id="showcase">
          <div className="showcase-heading">
            <h2>
              AI reshapes how interfaces guide creation,
              <br />
              how workflows stay understandable and how
              <br />
              product systems scale across new media.
            </h2>
          </div>
          <div className="showcase-grid">
            {showcases.map((item) => (
              <ShowcaseMediaCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="estate-section" id="services">
          <div className="estate-section-heading estate-section-heading--centered">
            <span className="estate-eyebrow">Modal Functions</span>
            <h2>Each block explains what the modal is responsible for</h2>
            <p>
              This section maps the UI behavior directly to frontend responsibilities,
              so the team can design and implement the picker without vague wording.
            </p>
          </div>
          <div className="estate-pillar-grid">
            {pillars.map((pillar) => (
              <PropertyPillarCard key={pillar.title} {...pillar} />
            ))}
          </div>
        </section>

        <section className="estate-section estate-section--contact" id="contact">
          <div className="estate-contact-layout">
            <div>
              <span className="estate-eyebrow">Implementation Notes</span>
              <h2>
                Ready to turn this
                <br />
                <span className="estate-gold-accent">into a real flow?</span>
              </h2>
              <p>
                The next step is wiring this polished modal UI into your React modules,
                then connecting selection events to the Python backend and Playwright
                login/session flow.
              </p>
              <div className="estate-contact-info">
                <div>
                  <span>Frontend</span>
                  <strong>React modular UI</strong>
                </div>
                <div>
                  <span>Backend</span>
                  <strong>Python workflow services</strong>
                </div>
                <div>
                  <span>Automation</span>
                  <strong>Playwright for login only</strong>
                </div>
              </div>
            </div>

            <form className="estate-contact-card estate-glass-card">
              <h3>Workflow Scope</h3>
              <div className="estate-contact-form__row">
                <div className="estate-form-field">
                  <label>Primary surface</label>
                  <input type="text" placeholder="Model picker modal" />
                </div>
                <div className="estate-form-field">
                  <label>Initial mode</label>
                  <input type="text" placeholder="Image generation" />
                </div>
              </div>
              <div className="estate-form-field">
                <label>Provider groups</label>
                <input type="text" placeholder="Google, Runway, BFL, OpenAI..." />
              </div>
              <div className="estate-form-field">
                <label>Selection outcome</label>
                <input type="text" placeholder="Sync selected model back to composer" />
              </div>
              <div className="estate-form-field">
                <label>Notes</label>
                <textarea
                  rows="4"
                  placeholder="Describe which modal should be built first and what state it must control..."
                />
              </div>
              <button type="button" className="estate-button estate-button--full">
                Define first modal
              </button>
            </form>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
