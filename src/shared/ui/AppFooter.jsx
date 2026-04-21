export default function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__brand">
          <div className="app-footer__mark">H</div>
          <div>
            <strong>Hivemind</strong>
            <p>
              Runway-style custom workflow interface built for fast composer,
              reusable modals, and predictable generation state.
            </p>
          </div>
        </div>

        <div className="app-footer__columns">
          <div>
            <h4>Product</h4>
            <a href="#custom">Custom</a>
            <a href="#jobs">Jobs</a>
            <a href="#workflow">Workflow</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#docs">Docs</a>
            <a href="#api">API</a>
            <a href="#guide">Guide</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </div>
      <div className="app-footer__bottom">
        <span>© {new Date().getFullYear()} Hivemind</span>
        <span>Internal build · Runway custom workflow</span>
      </div>
    </footer>
  );
}
