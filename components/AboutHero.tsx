"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import Magnetic from "@/components/ui/Magnetic";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n";
import { heroCopy } from "@/components/home/HomeHero";

// The About page opens the way the home does: type on one side, one framed
// picture on the other, and the same four numbers underneath. The portrait is
// a frame now, not a full-bleed backdrop, so no text ever sits on his face.

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutHero() {
  const { t, lang } = useLang();
  const stats = heroCopy[lang].stats;

  return (
    <section className="relative overflow-hidden pt-24 md:pt-28">
      <div className="container-edge mx-auto grid max-w-edge items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="lg:py-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-bone-300"
          >
            <span className="h-2 w-2 rounded-full bg-mint" />
            {t.about.label} · <bdi>{site.markets}</bdi>
          </motion.p>

          <h1 className="mt-6 font-display text-[15vw] font-semibold leading-[0.94] tracking-[-0.035em] text-bone-50 sm:text-[10vw] lg:text-[clamp(4rem,7vw,7.5rem)]">
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.span className="block" initial={{ y: "115%" }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.25 }}>
                Mohamed
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.14em]">
              <motion.span className="block font-serif font-light italic text-mint" initial={{ y: "115%" }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay: 0.37 }}>
                Tarek.
              </motion.span>
            </span>
          </h1>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.65 }}>
            <p className="mt-6 text-lg font-medium text-bone-100 md:text-xl">{site.roleFull}</p>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-bone-300 md:text-lg">{t.about.heroBio}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Magnetic>
                <Link href="/contact" className="cta-blend rounded-full px-7 py-3.5 text-sm font-medium">
                  {t.hero.ctaSecondary}
                </Link>
              </Magnetic>
              <Magnetic>
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="cta-edge rounded-full px-7 py-3.5 text-sm text-bone-50">
                  {t.hire.wa}
                </a>
              </Magnetic>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.2 }}
          className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-ink-800 lg:max-w-none"
        >
          <Media src="/me/portrait-hero.webp" alt={`${site.name}, ${site.role}`} fill priority sizes="(max-width:1024px) 90vw, 45vw" className="object-cover object-[center_20%]" />
        </motion.div>
      </div>

      <dl className="container-edge mx-auto mt-12 grid max-w-edge grid-cols-2 border-y border-line/15 md:mt-16 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.l} className={`py-6 md:py-7 ${i % 2 ? "ps-5 border-s border-line/15" : ""} ${i > 1 ? "border-t border-line/15 md:border-t-0" : ""} ${i ? "md:ps-7 md:border-s md:border-line/15" : ""}`}>
            <dt dir="ltr" className="font-display text-4xl font-semibold tracking-tight text-bone-50 rtl:text-right md:text-5xl">{s.n}</dt>
            <dd className="mt-2 text-xs uppercase tracking-[0.16em] text-bone-400">{s.l}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
