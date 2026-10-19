import SiteShell from "@/components/SiteShell";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import AiWorkflow from "@/components/AiWorkflow";
import MasterVisuals from "@/components/MasterVisuals";
import TypeDesign from "@/components/TypeDesign";
import SocialCards from "@/components/SocialCards";
import Storyboards from "@/components/Storyboards";
import Motion from "@/components/Motion";
import ThreeD from "@/components/ThreeD";
import WebProjects from "@/components/WebProjects";
import LoopSlider from "@/components/LoopSlider";
import Services from "@/components/Services";
import HireCta from "@/components/HireCta";
import Sections from "@/components/Sections";
import HomeSwitch from "@/components/gta/HomeSwitch";
import GtaHome from "@/components/gta/GtaHome";

export default function Home() {
  return (
    <SiteShell>
      {/* default order below; the dashboard can reorder or hide sections.
          The wall of selected designs closes out the social run, and the
          Blender work sits with the other built-not-shot work after films. */}
      <HomeSwitch game={<GtaHome />}>
      <Sections
        page="home"
        items={[
          { id: "hero", node: <Hero /> },
          { id: "logos", node: <LogoMarquee /> },
          { id: "ai", node: <AiWorkflow /> },
          { id: "master", node: <MasterVisuals /> },
          { id: "type", node: <TypeDesign /> },
          { id: "social", node: <SocialCards /> },
          { id: "slider", node: <LoopSlider /> },
          { id: "storyboards", node: <Storyboards /> },
          { id: "motion", node: <Motion /> },
          { id: "threeD", node: <ThreeD /> },
          { id: "web", node: <WebProjects /> },
          { id: "services", node: <Services /> },
          { id: "hire", node: <HireCta /> },
        ]}
      />
      </HomeSwitch>
    </SiteShell>
  );
}
