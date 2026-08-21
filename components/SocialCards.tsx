"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { SwipeRail } from "@/components/ui/SwipeRail";
import { useLang } from "@/lib/i18n";
import { projects, type Project } from "@/lib/projects";

// Social media designs — one card per brand, built like the campaign cards on
// the performance-evaluation site: a header, one large key visual, a row of
// supporting posts, and a short note on what holds the brand together.
const social = projects.filter(
  (p) => p.sector !== "AI Workflow" && p.gallery.length > 0
);

function Card({ p }: { p: Project }) {
  const { t } = useLang();
  const tr = t.projects[p.slug] ?? {};
  // the card leads with the project cover, then three supporting posts —
  // curated per project when set, otherwise the next three in the feed
  const kv = p.gallery.find((x) => x.src === p.cover) ?? p.gallery[0];
  const row = (
    p.cardPicks?.length
      ? p.cardPicks.map((src) => ({ src }))
      : p.gallery.filter((x) => x.src !== kv.src)
  ).slice(0, 3);
  const title = tr.title ?? p.title;
  // long client strings ("Al Rajhi Union · Rawdah Residences") wrap and push
  // the count onto its own line — show the lead brand only
  const shortClient = p.client.split(" · ")[0];

  return (
    <article className="flex h-full flex-col rounded-2xl border border-line/10 bg-ink-800 p-5 transition-colors duration-500 hover:border-line/25 md:p-6">
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {/* wraps rather than truncates — on a rail slide the card is 307px
              wide and the count badge takes a third of the row, so "Amam Real
              Estate" was being cut to "Amam Real E…" */}
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-bone-50 sm:text-xl md:text-2xl">
            {shortClient}
          </h3>
          <p className="mt-1 text-sm text-bone-400">
            {tr.category ?? p.category}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-line/15 bg-ink-900 px-3 py-1 text-xs text-bone-300">
          {p.gallery.length} {t.socialCards.posts}
        </span>
      </div>

      {/* key visual */}
      <Link
        href={`/work/${p.slug}`}
        className="group mt-5 block overflow-hidden rounded-xl bg-ink-700"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Media
            src={kv.src}
            alt={`${title} — ${t.socialCards.keyVisual}`}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
            className="object-cover transition-transform duration-700 ease-cinema group-hover:scale-[1.04]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[11px] uppercase tracking-widest text-white backdrop-blur-md">
            {t.socialCards.keyVisual}
          </span>
        </div>
      </Link>

      {/* supporting posts */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        {row.map((g) => (
          <div
            key={g.src}
            className="relative aspect-square overflow-hidden rounded-lg bg-ink-700"
          >
            <Media
              src={g.src}
              alt={`${title} — post`}
              fill
              sizes="120px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* note */}
      <p className="mt-4 text-pretty text-sm leading-relaxed text-bone-400">
        {tr.tagline ?? p.tagline}
      </p>

      {/* A filled pill, not a text link. As underlined mint text this read as
          a caption and people did not realise the card led anywhere. */}
      <Link
        href={`/work/${p.slug}`}
        className="group/cta mt-auto flex w-full items-center justify-between gap-3 rounded-full border border-mint/40 bg-mint/10 px-5 py-3 text-sm font-medium text-mint transition-colors duration-300 hover:bg-mint hover:text-ink-900"
      >
        <span>{t.socialCards.viewAll}</span>
        <span
          aria-hidden
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint/20 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:bg-ink-900/15 rtl:rotate-180"
        >
          →
        </span>
      </Link>
    </article>
  );
}

export default function SocialCards() {
  const { t } = useLang();
  return (
    <section
      id="social"
      className="container-edge mx-auto max-w-edge scroll-mt-24 section-y"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <SectionLabel>{t.socialCards.label}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
              {t.socialCards.h2a}{" "}
              <span className="font-serif font-normal italic text-mint">
                {t.socialCards.h2i}
              </span>
              {t.socialCards.h2b}
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm leading-relaxed text-bone-400">
            {t.socialCards.note}
          </p>
        </Reveal>
      </div>

      {/* eleven brands stacked one per column ran eight screens on a phone —
          side by side on a rail it is one, and the set is still all here */}
      <div className="mt-12">
        <SwipeRail grid="sm:grid-cols-2 lg:grid-cols-3" ariaLabel={t.socialCards.label}>
          {social.map((p) => (
            <Reveal key={p.slug}>
              <Card p={p} />
            </Reveal>
          ))}
        </SwipeRail>
      </div>
    </section>
  );
}
