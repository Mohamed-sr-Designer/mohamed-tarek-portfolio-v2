"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";

// Seven brand identities, each shown the way a brand is actually met: the logo
// over its own world. A swipe rail on phones, a grid from md up.

const brands = [
  { k: "vital", name: "Vital Foods", en: "F&B", ar: "أغذية" },
  { k: "oud", name: "Oud Tameem", en: "Fragrance", ar: "عطور" },
  { k: "evia", name: "Evia Villas", en: "Real estate", ar: "عقارات" },
  { k: "deco", name: "Décollage", en: "F&B", ar: "شوكولاتة" },
  { k: "rahden", name: "Alrahden", en: "B2B", ar: "معدات" },
  { k: "sehatak", name: "Sehatak", en: "Healthcare", ar: "صحة" },
  { k: "equipq", name: "EquipQ", en: "Hospitality", ar: "ضيافة" },
];

const copy = {
  en: { label: "Brand identity", a: "Seven identities,", i: "built to be used", b: ".", note: "Logo, colour, pattern and every touchpoint, from packaging to the fleet. Built with the art team at Osolutions." },
  ar: { label: "هويات بصرية", a: "سبع هويات،", i: "معمولة علشان تتستخدم", b: ".", note: "لوجو ولون وباترن وكل نقطة تواصل، من التغليف لحد الأسطول. اتعملت مع فريق الآرت في أوسوليوشنز." },
};

export default function BrandIdentities() {
  const { lang } = useLang();
  const c = copy[lang];
  return (
    <section id="brands" className="bg-ink-800/60 py-24 md:py-32">
      <div className="container-edge mx-auto max-w-edge">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionLabel>{c.label}</SectionLabel>
            <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-bone-50 md:text-6xl">
              {c.a} <span className="font-serif font-light italic text-mint">{c.i}</span>
              {c.b}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-bone-300 md:text-end">{c.note}</p>
          </Reveal>
        </div>
      </div>

      <ul className="container-edge mx-auto mt-12 flex max-w-edge snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] md:mt-16 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
        {brands.map((b, k) => (
          <li key={b.k} className={`w-[78vw] shrink-0 snap-start sm:w-[46vw] md:w-auto ${k === 0 ? "md:col-span-2 md:row-span-2" : k > 4 ? "md:col-span-2" : ""}`}>
            <figure className="group relative h-full min-h-[15rem] overflow-hidden rounded-2xl bg-ink-900 md:min-h-[17rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBase(`/work/brands/${b.k}.webp`)} alt={`${b.name} brand identity`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-ink-900/90 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={withBase(`/work/brands/${b.k}-logo.png`)} alt={b.name} loading="lazy" className="brand-logo h-8 w-auto max-w-[9rem] object-contain object-left rtl:object-right" />
                <span className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-bone-400">{lang === "ar" ? b.ar : b.en}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
