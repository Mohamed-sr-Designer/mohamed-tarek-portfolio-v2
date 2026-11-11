"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";

// Seven brand identities, one master shot each: the whole identity grouped on
// a single surface, all photographed the same way, so the seven read as one
// body of work. The logo is in the picture, so the caption stays plain text
// under it and nothing is laid over the image.

const brands = [
  { k: "vital", name: "Vital Foods", en: "F&B", ar: "أغذية" },
  { k: "deco", name: "Décollage", en: "Chocolate", ar: "شوكولاتة" },
  { k: "oud", name: "Oud Tameem", en: "Fragrance", ar: "عطور" },
  { k: "evia", name: "Evia Villas", en: "Real estate", ar: "عقارات" },
  { k: "sehatak", name: "Sehatak", en: "Healthcare", ar: "صحة" },
  { k: "equipq", name: "EquipQ", en: "Hospitality", ar: "ضيافة" },
  { k: "rahden", name: "Alrahden", en: "B2B", ar: "معدات" },
];

const copy = {
  en: { label: "Brand identity", a: "Seven identities,", i: "built to be used", b: ".", note: "Logo, colour, pattern and every touchpoint. Built with the art team at Osolutions, shown here as one master shot per brand." },
  ar: { label: "هويات بصرية", a: "سبع هويات،", i: "معمولة علشان تتستخدم", b: ".", note: "لوجو ولون وباترن وكل نقطة تواصل. اتعملت مع فريق الآرت في أوسوليوشنز، وكل هوية هنا في لقطة واحدة." },
};

// 2 wide, 3 across, 2 wide: seven frames with no holes
const span = (k: number) => (k < 2 || k > 4 ? "md:col-span-3" : "md:col-span-2");

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

        <ul className="mt-12 grid gap-x-4 gap-y-8 md:mt-16 md:grid-cols-6">
          {brands.map((b, k) => (
            <li key={b.k} className={span(k)}>
              <Reveal delay={0.05 * (k % 3)}>
                <figure className="group">
                  <div className="overflow-hidden rounded-2xl bg-ink-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={withBase(`/work/brands/${b.k}.webp`)} alt={`${b.name} brand identity`} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]" />
                  </div>
                  <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                    <b dir="ltr" className="font-display text-lg font-semibold tracking-tight text-bone-50">{b.name}</b>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-bone-400">{lang === "ar" ? b.ar : b.en}</span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
