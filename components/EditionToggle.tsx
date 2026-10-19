"use client";

import { useContent } from "@/lib/content";

// The GTA VI Edition switch. A homage skin, not a licence: no Rockstar marks,
// no game logotype. Switching it on boots the game loading screen
// (components/gta/GtaLoader) and the home page becomes the game-mode layout.
export default function EditionToggle() {
  const { gta, setGta } = useContent();

  return (
    <button
      type="button"
      onClick={() => {
        const next = !gta;
        setGta(next);
        if (next) {
          window.scrollTo({ top: 0 });
          window.dispatchEvent(new Event("gta-load"));
        }
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
      <span className="hidden lg:inline">{gta ? "Exit edition" : "GTA VI Edition"}</span>
      <span className="lg:hidden">{gta ? "Exit" : "Play"}</span>
    </button>
  );
}
