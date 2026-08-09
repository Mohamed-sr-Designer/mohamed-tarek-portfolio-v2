import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import AboutHero from "@/components/AboutHero";
import About from "@/components/About";
import Clients from "@/components/Clients";
import Experience from "@/components/Experience";
import Featured from "@/components/Featured";
import Recommendations from "@/components/Recommendations";
import Teaching from "@/components/Teaching";
import Skills from "@/components/Skills";
import Tools from "@/components/Tools";
import HireCta from "@/components/HireCta";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About · Sr Designer, Team Lead",
  description:
    "About Mohamed Tarek, Sr Designer and Team Lead based in Egypt, working across Egypt, Saudi Arabia and Kuwait. Experience, clients, capabilities and toolkit.",
  alternates: { canonical: "/about" },
};

// Profile structured data — helps search and AI assistants read the page
// as a person's professional profile.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${site.url}/about`,
  mainEntity: { "@id": `${site.url}/#person` },
};

// Kept tight on purpose: a recruiter wants who he is, who he has worked for,
// where he has worked, what he can do, and how to reach him.
export default function AboutPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AboutHero />
      <About />
      <Clients />
      <Experience />
      <Recommendations />
      <Featured />
      <Teaching />
      <Skills />
      <Tools />
      <HireCta />
    </SiteShell>
  );
}
