"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Toggle } from "@/components/ui/Toggle";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { projects } from "@/lib/projects";

// AI Work Flow — the opening story. One production at a time, chosen with a
// toggle: the flow diagram leads, then the summary, then the steps.
const flows = projects.filter((p) => p.sector === "AI Workflow");

export default function AiWorkflow() {
  const { t } = useLang();
  const [active, setActive] = useState(flows[0]?.slug ?? "");
  const p = flows.find((f) => f.slug === active) ?? flows[0];
  const tr = t.projects[p.slug] ?? {};
  const wf = p.workflow!;

  return (
    <section
      id="ai-workflow"
      className="container-edge mx-auto max-w-edge scroll-mt-24 section-y"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <SectionLabel>{t.ai.label}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
              {t.ai.h2a}{" "}
              <span className="font-serif font-normal italic text-mint">
                {t.ai.h2i}
              </span>{" "}
              {t.ai.h2b}
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm leading-relaxed text-bone-400">
            {t.ai.note}
          </p>
        </Reveal>
      </div>

      {/* pick a production */}
      <Reveal delay={0.1}>
        <div className="mt-10">
          <Toggle
            ariaLabel={t.ai.label}
            hint={t.ai.pick}
            value={active}
            onChange={setActive}
            options={flows.map((f) => ({
              value: f.slug,
              label: (t.projects[f.slug]?.category ?? f.category).replace(
                /^AI /,
                ""
              ),
            }))}
          />
        </div>
      </Reveal>

      {/* Diagram beside the summary, steps on one scrolling rail underneath.
          The old stacked layout — full-width diagram, then a 2-column intro,
          then six tall step cards, then a repeat CTA card — ran nearly three
          screens for what is an intro section.

          `grid-cols-1` is load-bearing, not cosmetic: a bare `grid` leaves the
          single implicit column sized to its content, and a grid item's
          automatic minimum size is its content's min-content width — which for
          the flow diagram is the image's intrinsic 1728px. The column blew past
          the viewport, the whole page picked up a horizontal scrollbar, and the
          diagram rendered mostly off-screen on phones. Tailwind's `grid-cols-1`
          is `repeat(1, minmax(0, 1fr))`, and that `minmax(0, …)` is what lets
          the track shrink below its content — the same reason the `lg` layout
          was never affected. */}
      <article
        key={p.slug}
        className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10"
      >
        <Reveal className="lg:col-span-7">
          <Link
            href={`/work/${p.slug}`}
            className="group block overflow-hidden rounded-2xl border border-line/10 bg-ink-800/40"
          >
            <Media
              src={wf.image!}
              alt={`${tr.title ?? p.title} — ${wf.title}`}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="h-auto w-full transition-transform duration-700 ease-cinema group-hover:scale-[1.01]"
            />
          </Link>
        </Reveal>

        <div className="flex flex-col justify-center lg:col-span-5">
          <Reveal delay={0.05}>
            <p className="text-xs uppercase tracking-ultra text-bone-400">
              {tr.category ?? p.category}
            </p>
            <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-bone-50 md:text-3xl">
              {tr.title ?? p.title}
            </h3>
            <p className="mt-4 text-pretty text-base leading-relaxed text-bone-300">
              {wf.intro[0]}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {wf.results.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-line/15 bg-ink-800/60 px-3 py-1 text-xs text-bone-200"
                >
                  {r}
                </span>
              ))}
            </div>

            <Link
              href={`/work/${p.slug}`}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-bone-50 px-6 py-3 text-sm font-medium text-ink-900 transition-transform duration-300 hover:scale-[1.03]"
            >
              {t.case.readMore}
              {p.galleries?.length ? (
                <span className="text-ink-900/55">
                  ·{" "}
                  {p.galleries.reduce((n, grp) => n + grp.items.length, 0)}
                </span>
              ) : null}
              <span aria-hidden className="rtl:rotate-180">
                →
              </span>
            </Link>
          </Reveal>
        </div>

        {/* steps — one horizontal rail instead of a six-card block */}
        <Reveal delay={0.1} className="lg:col-span-12">
          <ol className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {wf.steps.map((s) => (
              <li
                key={s.n}
                className="w-[15rem] shrink-0 snap-start rounded-xl border border-line/12 bg-ink-800/40 p-4"
              >
                <span className="font-display text-xs tabular-nums text-mint">
                  {s.n}
                </span>
                <span className="mt-1.5 block text-sm font-medium tracking-tight text-bone-50">
                  {s.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-bone-400">
                  {s.body}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </article>
    </section>
  );
}
