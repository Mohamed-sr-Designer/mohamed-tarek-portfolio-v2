"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n";

// Closing conversion band, the last thing a potential client or employer
// sees before the footer. One message: he's available, here's how to reach him.
export default function HireCta() {
  const { t } = useLang();
  return (
    <section
      id="hire"
      className="container-edge mx-auto max-w-edge scroll-mt-24 section-y"
    >
      <div className="relative overflow-hidden rounded-3xl border border-line/10 bg-ink-800 px-7 py-16 text-center md:px-16 md:py-24">
        <div aria-hidden className="blend-field -z-0 opacity-70" />

        <Reveal className="relative">
          <p className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.28em] text-bone-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            {t.hire.avail}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-8 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
            {t.hire.h2a}{" "}
            <span className="text-blend font-serif font-normal italic">
              {t.hire.h2i}
            </span>
            {t.hire.h2b}
          </h2>
        </Reveal>

        {/* empty by default in v2 — the paragraph was pulled; the dashboard
            can put one back without touching code */}
        {t.hire.body ? (
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-bone-300 md:text-lg">
              {t.hire.body}
            </p>
          </Reveal>
        ) : null}

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${site.email}`}
              className="cta-blend rounded-full px-7 py-3.5 text-sm font-medium hover:scale-[1.03]"
            >
              {site.email}
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-edge rounded-full px-7 py-3.5 text-sm text-bone-50"
            >
              {t.hire.wa}
            </a>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center text-sm text-bone-400 underline-offset-4 hover:text-bone-50 hover:underline"
            >
              {t.hire.all}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
