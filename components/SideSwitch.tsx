"use client";

import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n";

// The two halves of one name: the portfolio (this site) and the academy (its
// own site). One segmented switch sits in both headers, in the same place, so
// moving between them reads as flipping a side rather than leaving.
export default function SideSwitch({ className = "" }: { className?: string }) {
  const { lang } = useLang();
  const here = lang === "ar" ? "البورتفوليو" : "Portfolio";
  const there = lang === "ar" ? "الأكاديمية" : "Academy";
  return (
    <div
      role="group"
      aria-label={lang === "ar" ? "البورتفوليو أو الأكاديمية" : "Portfolio or Academy"}
      className={`inline-flex items-center rounded-full border border-line/20 bg-ink-800/80 p-1 text-[12px] font-semibold ${className}`}
    >
      <span aria-current="page" className="rounded-full bg-mint px-3.5 py-1.5 text-ink-900">
        {here}
      </span>
      <a
        href={site.academy}
        className="group inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-bone-200 transition-colors hover:text-mint"
      >
        {there}
        <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
          ↗
        </span>
      </a>
    </div>
  );
}
