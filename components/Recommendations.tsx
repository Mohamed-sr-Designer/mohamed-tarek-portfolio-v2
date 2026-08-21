"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { site } from "@/lib/site";
import {
  avatarFor,
  recommendations,
  type Recommendation,
} from "@/lib/recommendations";

// LinkedIn recommendations, verbatim.
//
// The strongest ones lead and the shortest fill in behind them, in a masonry
// so quotes of very different lengths don't leave ragged gaps. Long ones clamp
// to a few lines with a "read it in full" toggle, so the section stays a
// readable block instead of a wall of testimony.
const FIRST_SHOW = 6;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

function Card({
  rec,
  relationLabel,
  more,
  less,
}: {
  rec: Recommendation;
  relationLabel: string;
  more: string;
  less: string;
}) {
  const [open, setOpen] = useState(false);
  const long = rec.body.length > 320;

  return (
    <figure className="mb-4 break-inside-avoid rounded-2xl border border-line/12 bg-ink-900 p-6 transition-colors duration-300 hover:border-mint/30 md:p-7">
      <div className="flex items-start gap-3">
        {/* Photo in the circle the initials used to fill. The initials stay
            underneath as the fallback, so a missing avatar degrades to the
            old treatment instead of an empty ring. */}
        <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-line/15 bg-ink-900 font-serif text-sm text-mint">
          {initials(rec.name)}
          <Media
            src={avatarFor(rec.name)}
            alt={rec.name}
            fill
            sizes="44px"
            className="object-cover"
          />
        </span>
        <div className="min-w-0">
          <figcaption className="truncate text-base font-medium tracking-tight text-bone-50">
            {rec.name}
          </figcaption>
          <p className="mt-0.5 text-xs leading-relaxed text-bone-400">
            {rec.title}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-mint/25 bg-mint/5 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-mint">
          {relationLabel}
        </span>
        <span className="text-[11px] text-bone-500">{rec.dateLabel}</span>
      </div>

      <blockquote
        className={`mt-4 whitespace-pre-line text-pretty text-sm leading-relaxed text-bone-300 ${
          long && !open ? "line-clamp-[7]" : ""
        }`}
      >
        {rec.body}
      </blockquote>

      {long ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-3 text-xs text-mint underline-offset-4 transition-opacity hover:underline"
        >
          {open ? less : more}
        </button>
      ) : null}
    </figure>
  );
}

export default function Recommendations() {
  const { t } = useLang();
  const [expanded, setExpanded] = useState(false);

  const shown = expanded
    ? recommendations
    : recommendations.slice(0, FIRST_SHOW);
  const hidden = recommendations.length - shown.length;

  return (
    <section
      id="recommendations"
      className="border-y border-line/10 bg-ink-800 scroll-mt-24"
    >
      <div className="container-edge mx-auto max-w-edge section-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>{t.recs.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
                {t.recs.h2a}{" "}
                <span className="font-serif font-normal italic text-mint">
                  {t.recs.h2i}
                </span>
                {t.recs.h2b}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-sm leading-relaxed text-bone-400">
              {t.recs.note.replace("{n}", String(recommendations.length))}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 gap-4 [column-fill:_balance] md:columns-2 lg:columns-3">
          <AnimatePresence initial={false}>
            {shown.map((rec, i) => (
              <motion.div
                key={rec.name}
                initial={i < FIRST_SHOW ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="break-inside-avoid"
              >
                <Card
                  rec={rec}
                  relationLabel={t.recs.relations[rec.relation]}
                  more={t.recs.more}
                  less={t.recs.less}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {hidden > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="cta-edge flex items-center gap-2 rounded-full px-6 py-3 text-sm text-bone-200"
            >
              {t.recs.showAll} · {hidden}
            </button>
          ) : null}
          <a
            href={`${site.linkedin}details/recommendations/`}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-blend group flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium hover:scale-[1.03]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-8.5c0-2.03-.04-4.64-2.83-4.64-2.83 0-3.27 2.2-3.27 4.5V24H8V8z" />
            </svg>
            {t.recs.verify}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180">
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
