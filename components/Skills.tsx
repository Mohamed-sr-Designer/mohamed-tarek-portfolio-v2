"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";

// Capabilities as a filterable keyword board.
//
// It used to be four static columns of chips — everything on screen, nothing
// to do, nothing leading the eye. Now a discipline can be picked: the board
// filters to it, the evidence line for that discipline comes forward, and the
// count updates. "All" stays the default so every keyword is still in the
// markup on first paint, which is what the search engines and the recruiter's
// first scan need.
export default function Skills() {
  const { t } = useLang();
  const [active, setActive] = useState(-1); // -1 = all

  const groups = t.skills.groups;
  const shown = active === -1 ? groups : [groups[active]];
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const count = shown.reduce((n, g) => n + g.items.length, 0);

  return (
    <section className="border-y border-line/10 bg-ink-800">
      <div className="container-edge mx-auto max-w-edge section-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>{t.skills.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone-400">
                {t.skills.note}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="text-sm text-bone-500">
              <span className="font-display text-3xl text-mint tabular-nums">
                {count}
              </span>{" "}
              <span className="align-middle">
                {active === -1 ? t.skills.totalLabel : t.skills.shownLabel}
              </span>
            </p>
          </Reveal>
        </div>

        {/* discipline filter */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col gap-2.5">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-ultra text-mint">
              <span aria-hidden className="text-xs leading-none">
                ⇄
              </span>
              {t.skills.filterHint}
            </span>
            <div
              role="tablist"
              aria-label={t.skills.label}
              className="flex flex-wrap gap-2"
            >
              {[{ title: t.skills.all, n: total }, ...groups.map((g) => ({ title: g.title, n: g.items.length }))].map(
                (o, i) => {
                  const idx = i - 1; // first entry is "All"
                  const on = active === idx;
                  return (
                    <button
                      key={o.title}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setActive(idx)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                        on
                          ? "border-mint bg-mint font-semibold text-ink-900 shadow-[0_6px_18px_-6px_rgb(var(--mint)/0.8)]"
                          : "border-line/25 bg-ink-900/70 text-bone-300 hover:border-mint/50 hover:text-mint"
                      }`}
                    >
                      {o.title}
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
                          on ? "bg-ink-900/20 text-ink-900" : "bg-line/15 text-bone-400"
                        }`}
                      >
                        {o.n}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </Reveal>

        {/* the board */}
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-x-12">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((grp) => (
              <motion.div
                key={grp.title}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={active === -1 ? "" : "md:col-span-2"}
              >
                <h3 className="text-base font-medium tracking-tight text-bone-50 md:text-lg">
                  {grp.title}
                </h3>
                <p className="mt-1.5 flex items-start gap-2 text-xs leading-relaxed text-bone-500">
                  <span aria-hidden className="mt-px text-mint">
                    ✦
                  </span>
                  {grp.proof}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {grp.items.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(i * 0.02, 0.25),
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="cursor-default rounded-full border border-line/15 bg-ink-900 px-3.5 py-1.5 text-sm text-bone-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-mint/60 hover:bg-mint/5 hover:text-mint"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
