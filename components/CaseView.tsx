"use client";

import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { Carousel } from "@/components/ui/Carousel";
import CaseGalleries from "@/components/CaseGalleries";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n";
import { assetUrl } from "@/lib/assets";
import { projects, type Project } from "@/lib/projects";
import motionData from "@/lib/motion.json";

type Clip = { slug: string; src: string; poster: string };

export default function CaseView({ project }: { project: Project }) {
  const { t, lang } = useLang();
  const tr = t.projects[project.slug] ?? {};
  const accent = project.accent === "mint" ? "text-mint" : "text-electric";
  // The grid is laid out like an Instagram profile: the first post sits
  // bottom-right and the newest lands top-left, so a 9-set reads
  //   9 8 7
  //   6 5 4
  //   3 2 1
  // which in DOM order is simply the set reversed.
  //
  // Nothing is filtered out here. `project.hero` used to be dropped from the
  // grid because it led the page, but case pages no longer show a hero image —
  // keeping the filter silently cost every social set its hero frame and left
  // 8 tiles in a 9-tile grid.
  const gallery = [...project.gallery].reverse();
  const others = projects.filter((p) => p.slug !== project.slug);
  // Deduped by slug: a clip can appear in motion.json under more than one
  // collection, which was rendering the same film twice on the video case.
  const caseVideos = (motionData as Clip[])
    .filter((c) => (project.videoSlugs ?? []).includes(c.slug))
    .filter((c, i, all) => all.findIndex((x) => x.slug === c.slug) === i);
  // On workflow cases the flow diagram is the lead visual.
  const leadIsFlow = Boolean(project.workflow?.image);
  const leadVisual = project.workflow?.image ?? project.hero;

  const title = tr.title ?? project.title;
  const category = tr.category ?? project.category;
  // workflow cases lead with their flow diagram below, so they open on type alone
  const showLead = !leadIsFlow;
  const meta = [
    { k: lang === "ar" ? "العميل" : "Client", v: project.client.split(" · ")[0] },
    { k: lang === "ar" ? "القطاع" : "Sector", v: category.split(" · ")[0] },
    { k: lang === "ar" ? "السنة" : "Year", v: project.year },
    { k: lang === "ar" ? "دوري" : "My role", v: project.contribution.slice(0, 2).join(", ") },
  ];
  const at = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(at + 1) % projects.length];
  const ntr = t.projects[next.slug] ?? {};

  return (
    <>


      {/* opening: the same split as the home hero */}
      <section className="container-edge mx-auto max-w-edge pt-28 md:pt-32">
        <Link href="/#cases" className="link-underline inline-flex min-h-[40px] items-center gap-2 text-sm text-bone-300">
          <span aria-hidden className="inline-block rtl:rotate-180">←</span> {lang === "ar" ? "كل المشاريع" : "All work"}
        </Link>
        <div className={`mt-6 grid items-end gap-10 ${showLead ? "lg:grid-cols-[1.1fr_0.9fr] lg:gap-16" : ""}`}>
          <div>
            <Reveal>
              <p className={`text-xs font-medium uppercase tracking-[0.22em] ${accent}`}>{category}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className={`mt-5 text-balance font-display text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-bone-50 md:text-7xl ${showLead ? "" : "max-w-5xl lg:text-8xl"}`}>
                {title}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-pretty font-serif text-xl italic leading-snug text-bone-200 md:text-2xl">
                {tr.tagline ?? project.tagline}
              </p>
            </Reveal>
          </div>
          {showLead ? (
            <Reveal delay={0.1}>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-ink-800 lg:max-w-none">
                <Media src={project.hero || project.cover} alt={title} fill priority sizes="(max-width:1024px) 90vw, 40vw" className="object-cover" />
              </div>
            </Reveal>
          ) : null}
        </div>

        <dl className="mt-12 grid grid-cols-2 border-y border-line/15 md:mt-16 md:grid-cols-4">
          {meta.map((m, i) => (
            <div key={m.k} className={`py-5 md:py-6 ${i % 2 ? "ps-5 border-s border-line/15" : ""} ${i > 1 ? "border-t border-line/15 md:border-t-0" : ""} ${i ? "md:ps-7 md:border-s md:border-line/15" : ""}`}>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-bone-400">{m.k}</dt>
              <dd className="mt-2 text-base font-medium text-bone-50 md:text-lg">{m.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* lead visual — the flow diagram leads on workflow cases, so the
          process is understood before anything else; otherwise the hero.
          Social sets skip it: their grid below is the story. */}
      {leadIsFlow ? (
      <section className="container-edge mx-auto mt-12 max-w-edge md:mt-16">
        <Reveal>
          <div
            className={`mx-auto overflow-hidden rounded-2xl bg-ink-700 ${
              leadIsFlow ? "max-w-6xl" : "max-w-5xl"
            }`}
          >
            <Media
              src={leadVisual}
              alt={leadIsFlow ? `${title} — ${project.workflow!.title}` : title}
              priority
              sizes="(max-width: 1024px) 100vw, 72rem"
              className="h-auto max-h-[80vh] w-full object-contain"
            />
          </div>
          {leadIsFlow ? (
            <p className="mx-auto mt-3 max-w-6xl text-center text-xs uppercase tracking-ultra text-bone-400">
              {project.workflow!.title}
            </p>
          ) : null}
        </Reveal>
      </section>
      ) : null}

      {/* approach — full case study, or a lighter "explanation" for simple ones */}
      <section className="container-edge mx-auto max-w-edge py-16 md:py-20">
        {project.simple ? (
          <div className="grid gap-8 border-y border-line/10 py-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.28em] text-bone-400">
                {project.client} · {category}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.contribution.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-line/15 px-3 py-1 text-xs text-bone-200"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-8">
              <p className="text-pretty text-xl leading-relaxed text-bone-100 md:text-2xl">
                {tr.strategy ?? project.summary}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <ul className="flex flex-wrap gap-2">
              {project.contribution.map((c) => (
                <li key={c} className="rounded-full border border-line/15 px-3.5 py-1.5 text-xs text-bone-200">
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl bg-ink-800 p-7 md:p-10">
                  <span className="font-serif text-6xl font-light italic text-bone-500">01</span>
                  <h2 className={`mt-6 text-sm font-medium uppercase tracking-[0.18em] ${accent}`}>{t.case.challenge}</h2>
                  <p className="mt-4 text-pretty text-lg leading-relaxed text-bone-100 md:text-xl">{tr.challenge ?? project.challenge}</p>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="h-full rounded-2xl border border-mint/30 bg-ink-800 p-7 md:p-10">
                  <span className="font-serif text-6xl font-light italic text-mint">02</span>
                  <h2 className={`mt-6 text-sm font-medium uppercase tracking-[0.18em] ${accent}`}>{t.case.solution}</h2>
                  <p className="mt-4 text-pretty text-lg leading-relaxed text-bone-100 md:text-xl">{tr.strategy ?? project.strategy}</p>
                </div>
              </Reveal>
            </div>
          </div>
        )}
      </section>

      {/* strategy from the proposal deck — tone of voice + content pillars */}
      {project.strategyBlock ? (
        <section className="container-edge mx-auto max-w-edge pb-14 md:pb-20">
          <div className="grid gap-6 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-5">
              <div className="h-full rounded-2xl border border-line/10 bg-ink-800 p-7">
                <p className="text-[11px] uppercase tracking-ultra text-bone-500">
                  {project.strategyBlock.toneLabel}
                </p>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-bone-100">
                  {project.strategyBlock.tone}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.strategyBlock.toneTraits.map((x) => (
                    <span
                      key={x}
                      className="rounded-full border border-line/15 bg-ink-900 px-3 py-1 text-xs text-bone-300"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="md:col-span-7">
              <p className="text-[11px] uppercase tracking-ultra text-bone-500">
                {project.strategyBlock.pillarsLabel}
              </p>
              <div className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 sm:grid-cols-2">
                {project.strategyBlock.pillars.map((pl) => (
                  <div key={pl.n} className="flex items-baseline gap-3 bg-ink-900 p-5">
                    <span className="font-display text-sm tabular-nums text-mint">
                      {pl.n}
                    </span>
                    <span className="text-base text-bone-100">{pl.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* named gallery groups (Before / After, Characters / Scenes …) */}
      {project.galleries?.length ? (
        <CaseGalleries groups={project.galleries} title={title} />
      ) : null}

      {/* Final videos: the payoff of the whole case, so it gets a banded
          section and full width rather than a small tile in a two-up grid. */}
      {caseVideos.length > 0 ? (
        <section className="border-y border-line/10 bg-ink-800">
          <div className="container-edge mx-auto max-w-edge py-16 md:py-24">
            <Reveal>
              <h2 className="mb-8 max-w-2xl text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-5xl">
                {t.case.finalVideos}
              </h2>
            </Reveal>
            <div
              className={`grid gap-6 ${
                caseVideos.length > 1 ? "lg:grid-cols-2" : ""
              }`}
            >
              {caseVideos.map((v) => (
                <Reveal key={v.slug}>
                  <video
                    src={assetUrl(v.src)}
                    poster={assetUrl(v.poster)}
                    controls
                    playsInline
                    preload="none"
                    className="w-full rounded-2xl border border-line/10 bg-ink-700 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.8)]"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* production workflow — numbered steps + key results + flow diagram */}
      {project.workflow ? (
        <section className="border-y border-line/10 bg-ink-800">
          <div className="container-edge mx-auto max-w-edge py-16 md:py-20">
            <Reveal>
              <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-4xl">
                {project.workflow.title}
              </h2>
            </Reveal>
            <div className="mt-6 grid gap-4 md:max-w-3xl">
              {project.workflow.intro.map((p, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p className="text-pretty text-base leading-relaxed text-bone-300 md:text-lg">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <p className="mt-12 text-xs uppercase tracking-ultra text-bone-400">
                {project.workflow.stepsLabel}
              </p>
            </Reveal>
            <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line/10 bg-line/10 sm:grid-cols-2 lg:grid-cols-5">
              {project.workflow.steps.map((s) => (
                <div
                  key={s.n}
                  className="group flex flex-col gap-4 bg-ink-900 p-7 transition-colors duration-500 hover:bg-ink-700"
                >
                  <span className="font-serif text-5xl text-bone-500 transition-colors duration-500 group-hover:text-mint">
                    {s.n}
                  </span>
                  <h3 className="text-xl font-medium tracking-tight text-bone-50">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-bone-400">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>

            <Reveal>
              <p className="mt-12 text-xs uppercase tracking-ultra text-bone-400">
                {project.workflow.resultsLabel}
              </p>
            </Reveal>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.workflow.results.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-line/15 bg-ink-900 px-4 py-2 text-sm text-bone-200"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* gallery — an Instagram-style grid, first post bottom-right (CSS
          columns would reflow the set vertically, so this stays a real grid) */}
      {gallery.length > 0 ? (
        <section className="container-edge mx-auto max-w-edge pb-14 md:pb-20">
          {/* always left-to-right: many sets are one continuous puzzle across
              the 3x3, and an RTL grid mirrored every row (7 8 9 instead of
              9 8 7) in Arabic. Hairline gaps so the tiles read as one image. */}
          <div dir="ltr" className="mx-auto grid max-w-5xl grid-cols-3 gap-[2px] overflow-hidden rounded-2xl md:gap-1">
            {gallery.map((g) => (
              <figure
                key={g.src}
                className="relative aspect-[4/5] overflow-hidden bg-ink-700"
              >
                <Media
                  src={g.src}
                  alt={g.caption ?? title}
                  fill
                  sizes="(max-width: 640px) 33vw, 22vw"
                  className="object-cover"
                />
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="border-y border-line/10 bg-ink-800">
        <div className="container-edge mx-auto flex max-w-edge flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center md:py-24">
          <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-5xl">
            {t.case.ctaA}{" "}
            <span className="font-serif font-normal italic text-mint">
              {t.case.ctaI}
            </span>
          </h2>
          <Link
            href="/contact"
            className="cta-blend shrink-0 rounded-full px-7 py-3 text-sm font-medium hover:scale-105"
          >
            {t.case.ctaBtn}
          </Link>
        </div>
      </section>

      {/* next case */}
      <section className="container-edge mx-auto max-w-edge pt-16 md:pt-24">
        <Link href={`/work/${next.slug}`} className="group grid items-center gap-8 overflow-hidden rounded-[2rem] bg-ink-800 p-6 md:grid-cols-[1fr_auto] md:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-bone-400">{lang === "ar" ? "المشروع التالي" : "Next case"}</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1] tracking-[-0.03em] text-bone-50 transition-colors duration-300 group-hover:text-mint md:text-6xl">
              {next.client.split(" · ")[0]} <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-2 rtl:rotate-180 rtl:group-hover:-translate-x-2">→</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-bone-300">{ntr.tagline ?? next.tagline}</p>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink-700 md:w-56">
            <Media src={next.cover} alt={ntr.title ?? next.title} fill sizes="(max-width:768px) 90vw, 14rem" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        </Link>
      </section>

      {/* continue */}
      <section className="container-edge mx-auto max-w-edge py-16 md:py-24">
        <Reveal>
          <h2 className="mb-8 text-3xl font-semibold tracking-tight text-bone-50 md:text-4xl">
            {t.case.cont}
          </h2>
        </Reveal>
        <Carousel ariaLabel="More case studies">
          {others.map((p) => {
            const ptr = t.projects[p.slug] ?? {};
            return (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="group w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink-700">
                  <Media
                    src={p.cover}
                    alt={ptr.title ?? p.title}
                    fill
                    sizes="(max-width: 640px) 78vw, 31vw"
                    className="object-cover transition-transform duration-700 ease-cinema group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 text-lg font-medium tracking-tight text-bone-50">
                  {ptr.title ?? p.title}
                </h3>
                <span className="text-sm text-mint">
                  {t.case.readMore}{" "}
                  <span aria-hidden className="inline-block rtl:rotate-180">
                    →
                  </span>
                </span>
              </Link>
            );
          })}
        </Carousel>
      </section>


    </>
  );
}
