"use client";

import { useContent } from "@/lib/content";
import { useLang } from "@/lib/i18n";

// Dark / light switch, in the header. Two options rather than one icon that
// flips: a lone sun or moon has to be read as "switch to" rather than as a
// state. Each option carries its own border and fill, so the inactive one
// still reads as something you can press -- not as a label.
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

export default function ThemeToggle() {
  const { theme, setTheme } = useContent();
  const { t } = useLang();
  const opts = [
    { v: "dark" as const, label: t.nav.dark, icon: <Moon /> },
    { v: "light" as const, label: t.nav.light, icon: <Sun /> },
  ];
  return (
    <div
      role="group"
      aria-label={t.nav.theme}
      className="inline-flex items-center gap-1 rounded-full border border-line/20 bg-ink-800/80 p-1"
    >
      {opts.map((o) => {
        const on = theme === o.v;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => setTheme(o.v)}
            aria-pressed={on}
            aria-label={o.label}
            title={o.label}
            className={`grid h-10 w-10 place-items-center rounded-full border md:h-8 md:w-8 transition-colors duration-300 ${
              on
                ? "border-mint/70 bg-mint text-ink-900"
                : "border-line/20 bg-ink-700 text-bone-300 hover:border-mint/50 hover:text-mint"
            }`}
          >
            {o.icon}
          </button>
        );
      })}
    </div>
  );
}
