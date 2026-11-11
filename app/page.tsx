import SiteShell from "@/components/SiteShell";
import HomeHero from "@/components/home/HomeHero";
import LogoMarquee from "@/components/LogoMarquee";
import FeaturedWork from "@/components/home/FeaturedWork";
import MasterVisuals from "@/components/MasterVisuals";
import BrandIdentities from "@/components/home/BrandIdentities";
import ConceptLab from "@/components/home/ConceptLab";
import Disciplines from "@/components/home/Disciplines";
import AcademyBand from "@/components/home/AcademyBand";
import Recommendations from "@/components/Recommendations";
import Services from "@/components/Services";
import HireCta from "@/components/HireCta";
import Sections from "@/components/Sections";
import HomeSwitch from "@/components/HomeSwitch";
import MinimalHome from "@/components/minimal/MinimalHome";

export default function Home() {
  return (
    <SiteShell>
      {/* default order below; the dashboard can reorder or hide sections.
          The page runs work first: cases, key visuals, identities, then the
          craft behind them one discipline at a time, then the academy. */}
      <HomeSwitch minimal={<MinimalHome />}>
        <Sections
          page="home"
          items={[
            { id: "hero", node: <HomeHero /> },
            { id: "logos", node: <LogoMarquee /> },
            { id: "featured", node: <FeaturedWork /> },
            { id: "master", node: <MasterVisuals /> },
            { id: "brands", node: <BrandIdentities /> },
            { id: "concepts", node: <ConceptLab /> },
            { id: "craft", node: <Disciplines /> },
            { id: "academy", node: <AcademyBand /> },
            { id: "recommendations", node: <Recommendations /> },
            { id: "services", node: <Services /> },
            { id: "hire", node: <HireCta /> },
          ]}
        />
      </HomeSwitch>
    </SiteShell>
  );
}
