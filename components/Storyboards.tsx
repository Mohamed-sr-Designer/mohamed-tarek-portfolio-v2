"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { Toggle } from "@/components/ui/Toggle";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";

// Storyboards — the frame-by-frame plan behind the films. Wide boards, shown
// full width with a lightbox, because the panels carry readable detail.
// Board 02 leads — its frames are the stronger opener — then 01, then 03.
// 04 is a 4-across x 3-down matrix built from the film's scene frames
// (scripts/build-storyboard-04.mjs).
const boards = ["02", "01", "03", "04"].map(
  (n) => `/work/storyboards/${n}.webp`
);

export default function Storyboards() {
  const { t } = useLang();
  const [open, setOpen] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section
      id="storyboards"
      className="container-edge mx-auto max-w-edge scroll-mt-24 section-y"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <SectionLabel>{t.story.label}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
              {t.story.h2a}{" "}
              <span className="font-serif font-normal italic text-mint">
                {t.story.h2i}
              </span>
              {t.story.h2b}
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm leading-relaxed text-bone-400">
            {t.story.note}
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-10">
          <Toggle
            ariaLabel={t.story.label}
            hint={t.story.pick}
            value={String(idx)}
            onChange={(v) => setIdx(Number(v))}
            options={boards.map((_, i) => ({
              value: String(i),
              label: `${t.story.board} ${String(i + 1).padStart(2, "0")}`,
            }))}
          />
        </div>
      </Reveal>

      <Reveal>
        <button
          type="button"
          onClick={() => setOpen(boards[idx])}
          className="group relative mt-6 block w-full overflow-hidden rounded-2xl border border-line/10 bg-ink-900 text-left"
        >
          <Media
            key={boards[idx]}
            src={boards[idx]}
            alt={`${t.story.label} ${idx + 1}`}
            sizes="(max-width: 1024px) 100vw, 80rem"
            className="h-auto w-full transition-transform duration-700 ease-cinema group-hover:scale-[1.01]"
          />
          <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1 text-[11px] uppercase tracking-widest text-white backdrop-blur-md opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {t.master.expand}
          </span>
        </button>
      </Reveal>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-3 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBase(open)}
              alt={t.story.label}
              className="max-h-full max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label={t.master.close}
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-colors hover:border-mint/60 hover:text-mint"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
