export default function ContactSection() {
  return (
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
  );
}
