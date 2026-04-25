import AppShell from "../../shared/ui/AppShell";
import ContactSection from "./components/landing/ContactSection";
import HeroSection from "./components/landing/HeroSection";
import PillarsSection from "./components/landing/PillarsSection";
import ShowcaseSection from "./components/landing/ShowcaseSection";

export default function RunwayCustomPage() {
  return (
    <AppShell headerVariant="overlay" className="estate-page">
      <div className="estate-main">
        <HeroSection />
        <ShowcaseSection />
        <PillarsSection />
        <ContactSection />
      </div>
    </AppShell>
  );
}
