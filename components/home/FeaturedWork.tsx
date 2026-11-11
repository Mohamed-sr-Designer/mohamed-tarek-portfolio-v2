"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { getAsset } from "@/lib/assets";

// Six case studies, and only six. Every cover is shown whole, at the ratio it
// was designed in: these are finished posts, and cropping a designed layout to
// fit a frame cuts its type and makes the work look careless.

const picks = ["amam", "tilal-v", "prepd", "gf", "brand-vitals", "photo-sessions"];

const copy = {
  en: { label: "Selected work", a: "Six cases,", i: "one standard", b: ".", note: "Campaigns, social systems and AI production. Open any case for the problem, the idea and the result.", open: "Open case" },
  ar: { label: "أعمال مختارة", a: "ست مشاريع،", i: "بمعيار واحد", b: ".", note: "حملات وأنظمة سوشيال وإنتاج بالـ AI. افتح أي مشروع وشوف المشكلة والفكرة والنتيجة.", open: "افتح المشروع" },
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

      <ul className="mt-12 grid items-start gap-x-5 gap-y-12 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
        {picks.map((slug, k) => {
          const pr = projects.find((x) => x.slug === slug);
          if (!pr) return null;
          const tr = t.projects[pr.slug] ?? {};
          const src = pr.hero || pr.cover;
          const meta = getAsset(src);
          return (
            <li key={slug}>
              <Reveal delay={0.05 * (k % 3)}>
                <Link href={`/work/${pr.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl bg-ink-800" style={{ aspectRatio: meta.width && meta.height ? `${meta.width} / ${meta.height}` : "4 / 5" }}>
                    <Media
                      src={src}
                      alt={tr.title ?? pr.title}
                      fill
                      sizes="(max-width:640px) 92vw, (max-width:1024px) 46vw, 30vw"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight text-bone-50 transition-colors group-hover:text-mint md:text-2xl">{pr.client.split(" · ")[0]}</h3>
                      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-bone-300">{tr.tagline ?? pr.tagline}</p>
                    </div>
                    <span className="mt-1.5 shrink-0 text-[11px] uppercase tracking-[0.14em] text-bone-400">{(tr.category ?? pr.category).split(" · ")[0]}</span>
                  </div>
                  <span className="mt-3 inline-block text-sm text-mint opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {c.open} <span aria-hidden>↗</span>
                  </span>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
