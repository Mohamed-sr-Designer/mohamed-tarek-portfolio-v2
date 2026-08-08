import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import ContactHero from "@/components/ContactHero";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact · Hire a Graphic Designer & Art Director",
  description:
    "Hire Mohamed Tarek, graphic designer and art director available for freelance, part-time and hybrid full-time roles across Egypt, Saudi Arabia and Kuwait. Email, WhatsApp and LinkedIn.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <SiteShell>
      <ContactHero />
      <Contact />
    </SiteShell>
  );
}
