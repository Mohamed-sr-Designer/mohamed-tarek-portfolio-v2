"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { projects, sectors, type Project } from "@/lib/projects";

// One compact, recruiter-friendly work section: industry tabs — click a
// sector, see only its cases. All panels stay in the DOM (hidden, not
// unmounted) so search engines index every industry and its copy.
const groups = sectors.map((s) => ({
  sector: s,
  items: projects.filter((p) => p.sector === s),
}));

function Card({ p }: { p: Project }) {
  const { t } = useLang();
  const tr = t.projects[p.slug] ?? {};
  return (
    <Link href={`/work/${p.slug}`} className="group block h-full">
      <div className="flex h-full flex-col rounded-2xl border border-line/10 bg-ink-800 p-4 transition-all duration-500 ease-cinema hover:-translate-y-1.5 hover:border-line/25 md:p-5">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink-700">
          <Media
            src={p.cover}
            alt={tr.title ?? p.title}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            className="object-cover transition-transform duration-[1.2s] ease-cinema group-hover:scale-[1.04]"
          />
          <span className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/30 px-4 py-1.5 text-xs uppercase tracking-widest text-white opacity-0 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-100">
            {t.work.viewCase}
          </span>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line/15 bg-ink-900 px-3 py-1 text-xs text-bone-300">
            {p.year}
          </span>
          <span
            className={`rounded-full border border-line/15 bg-ink-900 px-3 py-1 text-xs ${
              p.accent === "mint" ? "text-mint" : "text-electric"
            }`}
          >
            {tr.category ?? p.category}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold tracking-tight text-bone-50 md:text-xl">
          {tr.title ?? p.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-bone-400">
          {tr.tagline ?? p.tagline}
        </p>
      </div>
    </Link>
  );
}

export default function SelectedWork() {
  const [active, setActive] = useState(groups[0].sector);
  const { t } = useLang();

  return (
    <section
      id="work"
      className="container-edge mx-auto max-w-edge scroll-mt-20 py-24 md:py-32"
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <SectionLabel>{t.work.label}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
              {t.work.h2a}{" "}
              <span className="font-serif font-normal italic text-bone-200">
                {t.work.h2i}
              </span>{" "}
              {t.work.h2b}
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm leading-relaxed text-bone-400">
            {t.work.note}
          </p>
        </Reveal>
      </div>

      {/* Industry tabs */}
      <Reveal delay={0.1}>
        <div
          role="tablist"
          aria-label="Work by industry"
          className="mt-10 flex flex-wrap gap-2"
        >
          {groups.map((g) => {
            const isActive = g.sector === active;
            return (
              <button
                key={g.sector}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${g.sector}`}
                onClick={() => setActive(g.sector)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
                  isActive
                    ? "border-transparent bg-bone-50 text-ink-900"
                    : "border-line/15 text-bone-300 hover:border-line/35 hover:text-bone-50"
                }`}
              >
                {t.work.sectors[g.sector] ?? g.sector}
                <span
                  className={`text-xs ${
                    isActive ? "text-ink-900/60" : "text-bone-500"
                  }`}
                >
                  {g.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Panels — all rendered for SEO, only the active one visible */}
      {groups.map((g) => (
        <div
          key={g.sector}
          id={`panel-${g.sector}`}
          role="tabpanel"
          hidden={g.sector !== active}
          className="mt-10"
        >
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-bone-300 md:text-lg">
            {t.work.blurbs[g.sector]}
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((p) => (
              <Card key={p.slug} p={p} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
