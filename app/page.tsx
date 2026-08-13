import SiteShell from "@/components/SiteShell";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import AiWorkflow from "@/components/AiWorkflow";
import MasterVisuals from "@/components/MasterVisuals";
import TypeDesign from "@/components/TypeDesign";
import SocialCards from "@/components/SocialCards";
import Storyboards from "@/components/Storyboards";
import Motion from "@/components/Motion";
import WebProjects from "@/components/WebProjects";
import LoopSlider from "@/components/LoopSlider";
import Services from "@/components/Services";
import HireCta from "@/components/HireCta";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <LogoMarquee />
      <AiWorkflow />
      <MasterVisuals />
      <TypeDesign />
      <SocialCards />
      {/* the wall of selected designs closes out the social run, before the
          page moves on to how the films get planned */}
      <LoopSlider />
      <Storyboards />
      <Motion />
      <WebProjects />
      <Services />
      <HireCta />
    </SiteShell>
  );
}
