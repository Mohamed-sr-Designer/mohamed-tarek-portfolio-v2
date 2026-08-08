"use client";

import { Media } from "@/components/ui/Media";

// Full-bleed opening for the Contact page, sized like the About hero.
// The artwork carries its own lettering, so nothing is laid over it — no
// heading, no scrim, no text of ours.
export default function ContactHero() {
  return (
    <section className="relative min-h-[52svh] overflow-hidden md:min-h-[68svh]">
      <Media
        src="/me/contact-banner.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
    </section>
  );
}
