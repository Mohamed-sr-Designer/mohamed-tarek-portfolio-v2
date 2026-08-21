"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { site, contacts } from "@/lib/site";
import { useLang } from "@/lib/i18n";
import CopyButton from "@/components/ui/CopyButton";

export default function Contact() {
  const { t } = useLang();
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden pb-[4.5rem] pt-32 md:pb-28 md:pt-44"
    >
      <div aria-hidden className="blend-field -z-10 opacity-60" />

      <div className="container-edge mx-auto max-w-edge">
        <Reveal>
          <SectionLabel>{t.contact.label}</SectionLabel>
        </Reveal>

        <Reveal delay={0.05}>
          {/* h1 on the contact page: it is a standalone route, and every page
              needs exactly one top-level heading for search and screen readers */}
          <h1 className="mt-10 max-w-4xl text-balance font-sans text-5xl font-light leading-[1.02] tracking-tightest text-bone-50 md:text-8xl">
            {t.contact.h2a}{" "}
            <span className="font-serif italic text-mint">{t.contact.h2i}</span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-bone-200">
            {t.contact.body}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-blend rounded-full px-7 py-3.5 text-sm font-medium hover:scale-[1.03]"
            >
              {t.hire.wa}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex max-w-full items-center gap-4 break-words text-bone-50"
            >
              <span className="font-sans text-[clamp(1rem,4vw,1.6rem)] font-light tracking-tight transition-colors duration-300 group-hover:text-mint">
                {site.email}
              </span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line/10 bg-line/10 sm:grid-cols-2 lg:grid-cols-4">
            {contacts.map((c) => (
              <div
                key={c.label}
                className="group flex flex-col gap-3 bg-ink-900 p-6 transition-colors duration-300 focus-within:bg-ink-800 hover:bg-ink-800"
              >
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    c.href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  aria-label={`${t.contact.open} ${
                    t.contact.labels[c.label] ?? c.label
                  }`}
                  className="flex flex-col gap-2"
                >
                  <span className="flex items-center gap-2 text-xs uppercase tracking-ultra text-bone-400">
                    {t.contact.labels[c.label] ?? c.label}
                    <span className="text-bone-500 transition-colors group-hover:text-mint">
                      ↗
                    </span>
                  </span>
                  <span
                    className="break-words text-base text-bone-50 transition-colors group-hover:text-mint"
                    dir="ltr"
                  >
                    {c.value}
                  </span>
                </a>
                <CopyButton
                  value={c.copy}
                  label={t.contact.labels[c.label] ?? c.label}
                  copyLabel={t.contact.copy}
                  copiedLabel={t.contact.copied}
                  className="self-start"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
