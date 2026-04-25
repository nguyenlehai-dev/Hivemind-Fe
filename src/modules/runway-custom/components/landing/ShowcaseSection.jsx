import ShowcaseMediaCard from "../ShowcaseMediaCard";
import { SHOWCASES } from "../../data/landingContent";

export default function ShowcaseSection() {
  return (
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
        {SHOWCASES.map((item) => (
          <ShowcaseMediaCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
