"use client";

import { useContent } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import type { Lang } from "@/lib/dict";

// Language and theme, together in the header as one compact group: EN / ع on
// one side of a hairline, moon / sun on the other. One pill instead of two
// keeps the header calm. Every option carries its own border and fill, so the
// inactive one still reads as something you can press -- not as a label.
const Sun = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
  </svg>
);
const Moon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" />
  </svg>
);

const btn = (on: boolean) =>
  `grid h-9 min-w-9 place-items-center rounded-full border px-2 text-[12px] font-semibold transition-colors duration-300 md:h-8 md:min-w-8 ${
    on
      ? "border-mint/70 bg-mint text-ink-900"
      : "border-line/20 bg-ink-700 text-bone-300 hover:border-mint/50 hover:text-mint"
  }`;

export default function ThemeToggle() {
  const { theme, setTheme } = useContent();
  const { t, lang, setLang } = useLang();
  const langs: { v: Lang; label: string; name: string }[] = [
    { v: "en", label: "EN", name: "English" },
    { v: "ar", label: "ع", name: "العربية" },
  ];
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line/20 bg-ink-800/80 p-1">
      <div role="group" aria-label={t.footer.language} className="flex gap-1">
        {langs.map((l) => (
          <button
            key={l.v}
            type="button"
            lang={l.v}
            onClick={() => setLang(l.v)}
            aria-pressed={lang === l.v}
            aria-label={l.name}
            title={l.name}
            className={btn(lang === l.v)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <span aria-hidden className="mx-0.5 h-5 w-px bg-line/20" />
      <div role="group" aria-label={t.nav.theme} className="flex gap-1">
        {(["dark", "light"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setTheme(v)}
            aria-pressed={theme === v}
            aria-label={v === "dark" ? t.nav.dark : t.nav.light}
            title={v === "dark" ? t.nav.dark : t.nav.light}
            className={btn(theme === v)}
          >
            {v === "dark" ? <Moon /> : <Sun />}
          </button>
        ))}
      </div>
    </div>
  );
}
