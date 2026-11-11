"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";

// Self-initiated key visuals: no client and no brief, one idea per frame.
// They are labelled as concepts on purpose, so nobody reads them as paid
// client work. Unbranded and text-free.

const items = [
  { k: "perfume", en: "Fragrance", ar: "عطور", ien: "The bottle is the tallest tower.", iar: "الزجاجة هي أعلى برج." },
  { k: "key", en: "Real estate", ar: "عقارات", ien: "The key is the neighbourhood.", iar: "المفتاح هو الحي نفسه." },
  { k: "orange", en: "Juice", ar: "عصائر", ien: "The orange is the sunset.", iar: "البرتقالة هي الغروب." },
  { k: "map", en: "Automotive", ar: "سيارات", ien: "The map becomes the road.", iar: "الخريطة بقت الطريق." },
  { k: "coffee", en: "Coffee", ar: "قهوة", ien: "The steam is the city waking up.", iar: "البخار هو المدينة وهي بتصحى." },
];

const copy = {
  en: { label: "Concept lab", a: "No client. No brief.", i: "One idea", b: ".", note: "Self-initiated key visuals, built with AI production and retouching. Each frame carries a single idea." },
  ar: { label: "معمل الأفكار", a: "من غير عميل ولا بريف.", i: "فكرة واحدة", b: ".", note: "كي فيجوال من مبادرتي الشخصية، معمول بالإنتاج بالـ AI والريتاتش. كل كادر شايل فكرة واحدة." },
};

export default function ConceptLab() {
  const { lang } = useLang();
  const c = copy[lang];
  return (
    <section id="concepts" className="py-24 md:py-32">
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

      <ul className="container-edge mx-auto mt-12 flex max-w-edge snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] md:mt-16 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {items.map((x, k) => (
          <li key={x.k} className="w-[70vw] shrink-0 snap-start sm:w-[40vw] lg:w-auto">
            <Reveal delay={0.05 * k}>
              <figure className="group">
                <div className="overflow-hidden rounded-2xl bg-ink-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={withBase(`/work/concepts/${x.k}.webp`)} alt={lang === "ar" ? x.iar : x.ien} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]" />
                </div>
                <figcaption className="mt-3">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-mint">{lang === "ar" ? x.ar : x.en}</span>
                  <p className="mt-1 text-sm leading-snug text-bone-200">{lang === "ar" ? x.iar : x.ien}</p>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
