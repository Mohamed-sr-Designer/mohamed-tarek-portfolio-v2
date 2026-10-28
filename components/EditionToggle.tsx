"use client";

import { useContent } from "@/lib/content";
import { useLang } from "@/lib/i18n";

// The edition switch: Classic, Minimal, or the GTA VI Edition. One segmented
// control rather than separate buttons, so it reads as "pick one" and the
// header stays calm. Every option keeps its own border and fill, so the
// inactive ones still read as pressable. GTA VI boots its loading screen.
export default function EditionToggle() {
  const { gta, minimal, setGta, setMinimal } = useContent();
  const { lang } = useLang();
  const classic = !gta && !minimal;

  const opts = [
    {
      id: "std",
      on: classic,
      label: lang === "ar" ? "الكلاسيكي" : "Classic",
      icon: <span aria-hidden className="block h-2.5 w-2.5 rounded-full bg-current" />,
      pick: () => {
        setGta(false);
        setMinimal(false);
      },
      onCls: "border-mint/70 bg-mint text-ink-900",
    },
    {
      id: "min",
      on: minimal,
      label: lang === "ar" ? "مينيمال" : "Minimal",
      icon: (
        <span aria-hidden className="flex items-center gap-[2px]">
          <span className="block h-2.5 w-2.5 rounded-full border-[1.5px] border-current" />
          <span className="block h-2.5 w-2.5 border-[1.5px] border-current" />
        </span>
      ),
      pick: () => setMinimal(true),
      onCls: "border-mint bg-mint text-ink-900",
    },
    {
      id: "gta",
      on: gta,
      label: "GTA VI",
      icon: <span aria-hidden className="gta-mark font-[family-name:var(--font-gta)] text-sm leading-none tracking-normal">VI</span>,
      pick: () => {
        setGta(true);
        window.scrollTo({ top: 0 });
        window.dispatchEvent(new Event("gta-load"));
      },
      onCls: "border-white bg-[linear-gradient(100deg,#ff4fa3,#ff9a3c)] text-[#1a0b2e]",
    },
  ];

  return (
    <div
      role="group"
      aria-label={lang === "ar" ? "النسخة" : "Edition"}
      className="edition-btn inline-flex items-center gap-1 rounded-full border border-line/20 bg-ink-800/80 p-1"
    >
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={o.pick}
          aria-pressed={o.on}
          aria-label={o.label}
          title={o.label}
          className={`inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-full border px-2.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 md:h-8 md:min-w-8 ${
            o.on ? o.onCls : "border-line/20 bg-ink-700 text-bone-300 hover:border-mint/50 hover:text-mint"
          }`}
        >
          {o.icon}
          <span className="hidden xl:inline">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
