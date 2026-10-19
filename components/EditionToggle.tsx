"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/lib/content";

// The GTA VI Edition switch. A homage skin, not a licence: no Rockstar marks,
// no game logotype -- only the sunset palette, the condensed cover type and
// the "unlocked" moment you get when you flip it on.
export default function EditionToggle() {
  const { gta, setGta } = useContent();
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(false), 2200);
    return () => clearTimeout(id);
  }, [flash]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          const next = !gta;
          setGta(next);
          if (next) setFlash(true);
        }}
        aria-pressed={gta}
        title={gta ? "Back to the standard edition" : "Play the GTA VI Edition"}
        className={`edition-btn group relative inline-flex h-10 items-center gap-1.5 overflow-hidden rounded-full border px-3 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 md:h-9 md:px-4 ${
          gta
            ? "border-white bg-[linear-gradient(100deg,#ff4fa3,#ff9a3c)] text-[#1a0b2e] shadow-[0_0_24px_-4px_#ff4fa3]"
            : "border-line/25 bg-ink-800 text-bone-100 hover:border-[#ff4fa3] hover:text-[#ff7ab8]"
        }`}
      >
        <span aria-hidden className="font-[family-name:var(--font-gta)] text-sm leading-none tracking-normal">VI</span>
        <span className="hidden lg:inline">{gta ? "Edition on" : "GTA VI Edition"}</span>
        <span className="lg:hidden">{gta ? "On" : "Play"}</span>
      </button>

      <AnimatePresence>
        {flash ? (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 1.25 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none fixed inset-x-0 top-1/3 z-[130] text-center"
            role="status"
          >
            <p className="font-[family-name:var(--font-gta)] text-[13vw] uppercase leading-none text-[#ffd34d] [text-shadow:4px_4px_0_#1a0b2e,0_0_40px_rgb(255_79_163/0.6)] md:text-8xl">
              Edition unlocked
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.4em] text-white [text-shadow:2px_2px_0_#1a0b2e]">
              Vice City · Portfolio VI
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
