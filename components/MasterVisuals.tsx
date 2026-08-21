"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { assetUrl } from "@/lib/assets";

// Master visuals — full campaign boards (key visual + the thinking behind it).
// Shown as one large featured board with a thumbnail rail underneath, so all
// nine are reachable without a very long scroll. Click to view full size.
// 04 (TANK 700) is the hero of this section, then the rest in order.
// 09 (SOC Analyst diploma) and 10 (Makkiyoon) were pulled at his request.
const ORDER = [4, 1, 2, 3, 5, 6, 7, 8];
const boards = ORDER.map(
  (n) => `/work/master/${String(n).padStart(2, "0")}.webp`
);

export default function MasterVisuals() {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const [open, setOpen] = useState<string | null>(null);

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
      id="master"
      className="border-y border-line/10 bg-ink-800 scroll-mt-24"
    >
      <div className="container-edge mx-auto max-w-edge section-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>{t.master.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
                {t.master.h2a}{" "}
                <span className="font-serif font-normal italic text-mint">
                  {t.master.h2i}
                </span>
                {t.master.h2b}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-sm leading-relaxed text-bone-400">
              {t.master.note}
            </p>
          </Reveal>
        </div>

        {/* featured board */}
        <Reveal delay={0.1}>
          <button
            type="button"
            onClick={() => setOpen(boards[i])}
            aria-label={`${t.master.label} ${i + 1} — ${t.master.expand}`}
            className="group relative mt-10 block w-full overflow-hidden rounded-2xl border border-line/10 bg-ink-900"
          >
            <div className="relative aspect-video">
              <Media
                key={boards[i]}
                src={boards[i]}
                alt={`${t.master.label} ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 80rem"
                className="object-cover transition-transform duration-700 ease-cinema group-hover:scale-[1.02]"
              />
            </div>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="pointer-events-none absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-[11px] uppercase tracking-widest text-white backdrop-blur-md opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              {t.master.expand}
            </span>
          </button>
        </Reveal>

        {/* thumbnail rail */}
        <Reveal delay={0.15}>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {boards.map((src, n) => (
              <button
                key={src}
                type="button"
                onClick={() => setI(n)}
                aria-label={`${t.master.label} ${n + 1}`}
                aria-current={n === i}
                className={`relative aspect-video overflow-hidden rounded-lg border transition-all duration-300 ${
                  n === i
                    ? "border-mint/70 opacity-100 ring-1 ring-mint/40"
                    : "border-line/10 opacity-55 hover:opacity-90"
                }`}
              >
                <Media
                  src={src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </Reveal>
      </div>

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
              src={assetUrl(open)}
              alt={t.master.label}
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
