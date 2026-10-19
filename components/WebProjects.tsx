"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";

const sites = [
  {
    name: "Tilal Village",
    type: "Luxury Real Estate · Makkah",
    url: "https://mohamed-sr-designer.github.io/tilal-village/",
    img: "/web/tilal.webp",
    host: "tilal-village",
  },
  {
    name: "JADEITE",
    type: "Office Villas · Al Khobar",
    url: "https://mohamed-sr-designer.github.io/jadeite-office-villas/",
    img: "/web/jadeite.webp",
    host: "jadeite-office-villas",
  },
  {
    name: "Fresh Valley",
    type: "Premium Produce Brand",
    url: "https://mohamed-sr-designer.github.io/fresh-valley/",
    img: "/web/fresh-valley.webp",
    host: "fresh-valley",
  },
  {
    name: "HR Link",
    type: "HR SaaS Platform · KSA",
    url: "https://mohamed-sr-designer.github.io/hrlink-redesign/",
    img: "/web/hrlink.webp",
    host: "hrlink-redesign",
  },
  {
    name: "SOIC",
    type: "Digital Cinema Campus",
    url: "https://mohamed-sr-designer.github.io/soic-campus/",
    img: "/web/soic.webp",
    host: "soic-campus",
  },
  {
    name: "THE NINE",
    type: "Digital Menu · Café",
    url: "https://mohamed-sr-designer.github.io/the-9-menu/",
    img: "/web/the9.webp",
    host: "the-9-menu",
  },
  {
    name: "HR Path",
    type: "HR Consulting · KSA",
    url: "https://mohamed-sr-designer.github.io/hrpath-redesign/",
    img: "/web/hrpath.webp",
    host: "hrpath-redesign",
  },
  {
    name: "Baleine Bleu Maison",
    type: "Commercial Tower · Riyadh",
    url: "https://mohamed-sr-designer.github.io/baleine-bleu-maison/",
    img: "/web/baleine.webp",
    host: "baleine-bleu-maison",
  },
  {
    name: "Miraf District",
    type: "Real Estate · Al Khobar",
    url: "https://mohamed-sr-designer.github.io/miraf-district/",
    img: "/web/miraf.webp",
    host: "miraf-district",
  },
];

export default function WebProjects() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const current = sites[active];

  return (
    <section id="web" className="container-edge mx-auto max-w-edge scroll-mt-24 section-y">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <SectionLabel>{t.web.label}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
              {t.web.h2a}{" "}
              <span className="font-serif font-normal italic text-mint">
                {t.web.h2i}
              </span>
              {t.web.h2b}
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-sm leading-relaxed text-bone-400">
            {t.web.note}
          </p>
        </Reveal>
      </div>

      {/* One preview frame plus a picker, instead of nine stacked cards, the
          whole set now fits in a single screen rather than three long rows. */}
      <Reveal delay={0.12}>
        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          {/* picker */}
          <div
            role="tablist"
            aria-label={t.web.label}
            className="order-2 flex gap-2 overflow-x-auto pb-2 lg:order-1 lg:col-span-4 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {sites.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.name}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={`shrink-0 rounded-xl border px-4 py-3 text-start transition-colors duration-300 lg:w-full ${
                    on
                      ? "border-mint/50 bg-mint/[0.07]"
                      : "border-line/12 hover:border-line/30 hover:bg-ink-800/50"
                  }`}
                >
                  <span
                    className={`block whitespace-nowrap text-sm font-medium tracking-tight lg:text-base ${
                      on ? "text-mint" : "text-bone-100"
                    }`}
                  >
                    {s.name}
                  </span>
                  <span className="mt-0.5 hidden text-xs text-bone-400 lg:block">
                    {s.type}
                  </span>
                </button>
              );
            })}
          </div>

          {/* preview */}
          <div className="order-1 lg:order-2 lg:col-span-8">
            <div className="overflow-hidden rounded-xl border border-line/12 bg-ink-800">
              {/* browser chrome */}
              <div className="flex items-center gap-2 border-b border-line/10 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-line/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-line/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-line/20" />
                <span className="mx-2 min-w-0 flex-1 truncate rounded-full bg-line/5 px-3 py-1 text-[11px] text-bone-400" dir="ltr">
                  {current.host}.github.io
                </span>
                <a
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-edge inline-flex min-h-[36px] shrink-0 items-center rounded-full px-4 text-xs font-medium text-mint"
                >
                  {t.web.live}
                </a>
              </div>

              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.web.visit}, ${current.name}`}
                className="group relative block aspect-[16/10] overflow-hidden bg-ink-700"
              >
                <Media
                  key={current.img}
                  src={current.img}
                  alt={`${current.name}, ${current.type}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover object-top transition-transform duration-[1.2s] ease-cinema group-hover:scale-[1.03]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="cta-blend pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium opacity-0 group-hover:opacity-100">
                  {t.web.visit} ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
