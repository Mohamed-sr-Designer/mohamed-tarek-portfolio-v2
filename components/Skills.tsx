"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";

export default function Skills() {
  const { t } = useLang();
  return (
    <section className="border-y border-line/10 bg-ink-800/40">
      <div className="container-edge mx-auto max-w-edge section-y">
        <Reveal>
          <SectionLabel>{t.skills.label}</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone-400">
            {t.skills.note}
          </p>
        </Reveal>

        {/* Keyword chips per discipline, each group carrying the line of
            evidence for it. Dense and scannable on purpose: this is the block
            a recruiter skims and a search engine indexes. */}
        <Stagger className="mt-12 grid gap-10 md:grid-cols-2 md:gap-x-12">
          {t.skills.groups.map((grp) => (
            <StaggerItem key={grp.title}>
              <h3 className="text-base font-medium tracking-tight text-bone-50 md:text-lg">
                {grp.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-bone-500">
                {grp.proof}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {grp.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line/15 bg-ink-900 px-3.5 py-1.5 text-sm text-bone-200 transition-colors duration-300 hover:border-mint/50 hover:text-mint"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
