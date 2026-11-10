"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { projects } from "@/lib/projects";

// Six case studies, laid out as a bento rather than a list: two wide frames
// carry the campaigns, four tall ones carry the systems. Every card opens the
// full case.

const picks: { slug: string; span: string; ratio: string; img?: string }[] = [
  { slug: "amam", span: "md:col-span-4", ratio: "aspect-[4/5] md:aspect-[16/10]" },
  { slug: "photo-sessions", span: "md:col-span-2", ratio: "aspect-[4/5]" },
  { slug: "tilal-v", span: "md:col-span-2", ratio: "aspect-[4/5]" },
  { slug: "prepd", span: "md:col-span-2", ratio: "aspect-[4/5]" },
  { slug: "gf", span: "md:col-span-2", ratio: "aspect-[4/5]" },
  { slug: "video-production", span: "md:col-span-3", ratio: "aspect-[4/5] md:aspect-[16/10]" },
  { slug: "brand-vitals", span: "md:col-span-3", ratio: "aspect-[4/5] md:aspect-[16/10]" },
];

const copy = {
  en: { label: "Selected work", a: "Seven cases,", i: "one standard", b: ".", note: "Campaigns, social systems and AI production. Open any case for the problem, the idea and the result.", open: "Open case" },
  ar: { label: "أعمال مختارة", a: "سبع مشاريع،", i: "بمعيار واحد", b: ".", note: "حملات وأنظمة سوشيال وإنتاج بالـ AI. افتح أي مشروع وشوف المشكلة والفكرة والنتيجة.", open: "افتح المشروع" },
};

export default function FeaturedWork() {
  const { t, lang } = useLang();
  const c = copy[lang];

  return (
    <section id="cases" className="container-edge mx-auto max-w-edge py-24 md:py-32">
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

      <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-6">
        {picks.map((p, k) => {
          const pr = projects.find((x) => x.slug === p.slug);
          if (!pr) return null;
          const tr = t.projects[pr.slug] ?? {};
          return (
            <li key={p.slug} className={p.span}>
              <Reveal delay={0.05 * (k % 3)}>
                <Link href={`/work/${pr.slug}`} className="group block">
                  <div className={`relative overflow-hidden rounded-2xl bg-ink-800 ${p.ratio}`}>
                    <Media
                      src={pr.hero || pr.cover}
                      alt={tr.title ?? pr.title}
                      fill
                      sizes="(max-width:768px) 92vw, 60vw"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                    <span className="absolute end-4 top-4 rounded-full bg-ink-900/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-bone-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {c.open} ↗
                    </span>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight text-bone-50 transition-colors group-hover:text-mint md:text-2xl">{pr.client.split(" · ")[0]}</h3>
                      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-bone-300">{tr.tagline ?? pr.tagline}</p>
                    </div>
                    <span className="mt-1.5 shrink-0 text-[11px] uppercase tracking-[0.14em] text-bone-400">{(tr.category ?? pr.category).split(" · ")[0]}</span>
                  </div>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
