"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";

// Teaching & mentorship, a recruiter-friendly proof of leadership:
// four academies, ~1,200 graduates, plus on-site design advisory.
export default function Teaching() {
  const { t } = useLang();
  return (
    <section
      id="teaching"
      className="border-y border-line/10 bg-ink-800/40 scroll-mt-24"
    >
      <div className="container-edge mx-auto max-w-edge section-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>{t.teach.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
                {t.teach.h2a}{" "}
                <span className="font-serif font-normal italic text-mint">
                  {t.teach.h2i}
                </span>
                {t.teach.h2b}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-sm leading-relaxed text-bone-400">
              {t.teach.note}
            </p>
          </Reveal>
        </div>

        {/* academies */}
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2">
          {t.teach.academies.map((a) => (
            <StaggerItem
              key={a.name}
              className="flex h-full flex-col gap-3 rounded-xl border border-line/10 bg-ink-900 p-7 transition-colors duration-300 hover:border-mint/30"
            >
              <div className="flex min-w-0 items-center gap-3">
                {a.logo ? (
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/90">
                    <Media
                      src={a.logo}
                      alt={a.name}
                      fill
                      sizes="40px"
                      className="object-contain p-1"
                    />
                  </span>
                ) : null}
                <h3 className="min-w-0 text-xl font-semibold tracking-tight text-bone-50 md:text-2xl">
                  {a.name}
                </h3>
              </div>
              <p className="text-xs uppercase tracking-ultra text-bone-400">
                {t.teach.role}
              </p>
              <p className="text-pretty text-sm leading-relaxed text-bone-300">
                {a.desc}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
