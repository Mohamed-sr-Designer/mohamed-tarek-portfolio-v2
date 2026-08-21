"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import Magnetic from "@/components/ui/Magnetic";
import { Media } from "@/components/ui/Media";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n";

// Cinematic opening for the About page: the same night-shoot banner as the
// home hero, the name, the role, and the two actions a hiring manager needs.
//
// He stands centre frame, so the name is stacked to two lines inside a narrow
// measure and the whole copy block is capped at max-w-xl: set as one line,
// "Mohamed Tarek" at 8xl runs about 700px and would have crossed him.
export default function AboutHero() {
  const { t } = useLang();

  return (
    <section className="relative flex min-h-[86svh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0">
        <Media
          src="/me/banner-2026.webp"
          alt={`${site.name} — ${site.role}`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      {/* Fixed dark scrim (not theme-tinted) so the portrait never washes out.
          Lightened again: only the very bottom needs to be dense enough to
          carry the text, the rest of the photograph should stay visible. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/35 to-transparent"
      />

      {/* Arabic pins left here for the same reason as the home hero: a block
          that follows the page direction starts on the right, which in this
          frame is where he is standing. */}
      <div className="container-edge relative z-10 mx-auto w-full max-w-edge pb-14 pt-40 rtl:text-left">
        <Reveal>
          <SectionLabel>{t.about.label}</SectionLabel>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.92] tracking-tightest text-white [text-shadow:0_2px_30px_rgb(0_0_0/0.5)] md:text-8xl">
            <span className="block">Mohamed</span>
            <span className="block font-serif font-normal italic tracking-normal text-mint-lift">
              Tarek
            </span>
          </h1>
        </Reveal>

        <div className="mt-7 flex max-w-md flex-col gap-8 rtl:mr-auto">
          <div>
            <Reveal delay={0.12}>
              <p className="text-lg text-white/80 md:text-xl">
                {site.roleFull} —{" "}
                <span className="text-white/60">{site.markets}</span>
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-4 text-pretty text-base leading-relaxed text-white/70">
                {t.about.heroBio}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.22}>
            <div className="flex shrink-0 flex-wrap gap-4">
              <Magnetic>
                <Link
                  href="/contact"
                  className="cta-blend rounded-full px-7 py-3.5 text-sm font-medium hover:scale-[1.03]"
                >
                  {t.hero.ctaSecondary}
                </Link>
              </Magnetic>
              <Magnetic>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-edge rounded-full px-7 py-3.5 text-sm text-white"
                >
                  {t.hire.wa}
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
