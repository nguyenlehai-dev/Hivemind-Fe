import PropertyPillarCard from "../PropertyPillarCard";
import { PILLARS } from "../../data/landingContent";

export default function PillarsSection() {
  return (
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
        {PILLARS.map((pillar) => (
          <PropertyPillarCard key={pillar.title} {...pillar} />
        ))}
      </div>
    </section>
  );
}
