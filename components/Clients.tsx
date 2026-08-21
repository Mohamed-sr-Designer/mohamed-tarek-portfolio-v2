"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";

// The brands behind the work, a recruiter usually looks for this first.
const logos = Array.from({ length: 36 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

export default function Clients() {
  const { t } = useLang();
  return (
    <section
      id="clients"
      className="border-y border-line/10 bg-ink-800 scroll-mt-24"
    >
      <div className="container-edge mx-auto max-w-edge py-20 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>{t.clients.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 max-w-2xl text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-5xl">
                {t.clients.h2a}{" "}
                <span className="font-serif font-normal italic text-mint">
                  {t.clients.h2i}
                </span>
                {t.clients.h2b}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-sm leading-relaxed text-bone-400">
              {t.clients.note}
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
          {logos.map((n, i) => (
            <Reveal key={n} delay={(i % 9) * 0.02}>
              <div className="group grid aspect-[3/2] place-items-center bg-ink-900 p-4 transition-colors duration-300 hover:bg-ink-800">
                <div className="relative h-full w-full opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                  <Media
                    src={`/logos/light/${n}.webp`}
                    alt="Client logo"
                    fill
                    sizes="140px"
                    className="object-contain"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
