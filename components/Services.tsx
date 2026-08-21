"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";

export default function Services() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);

  return (
    <section
      id="services"
      className="border-y border-line/10 bg-ink-800 scroll-mt-24"
    >
      <div className="container-edge mx-auto max-w-edge section-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>{t.services.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
                {t.services.h2a}{" "}
                <span className="font-serif font-normal italic text-mint">
                  {t.services.h2i}
                </span>{" "}
                {t.services.h2b}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-sm leading-relaxed text-bone-400">
              {t.services.note}{" "}
              <Link href="/contact" className="text-mint">
                {t.services.noteLink}
              </Link>
            </p>
          </Reveal>
        </div>

        {/* An index you open, not six tall cards stacked two rows deep. Each
            service is one line until you ask for it, which keeps the whole
            section to roughly a single screen. */}
        <Stagger className="mt-12 border-t border-line/12">
          {t.services.items.map((s, i) => {
            const on = i === open;
            return (
              <StaggerItem key={s.title} className="border-b border-line/12">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(on ? -1 : i)}
                    aria-expanded={on}
                    className="group flex w-full items-center gap-4 py-4 text-start transition-colors duration-300 md:gap-6 md:py-5"
                  >
                    <span
                      className={`font-serif text-base italic transition-colors duration-300 ${
                        on ? "text-mint" : "text-bone-500 group-hover:text-mint"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 text-balance text-lg font-medium tracking-tight transition-colors duration-300 md:text-2xl ${
                        on ? "text-mint" : "text-bone-50 group-hover:text-mint"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      aria-hidden
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                        on
                          ? "rotate-45 border-mint text-mint"
                          : "border-line/25 text-bone-400 group-hover:border-mint/60 group-hover:text-mint"
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {on ? (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-4 pb-7 md:grid-cols-12 md:gap-8">
                        <p className="text-pretty text-base leading-relaxed text-bone-300 md:col-span-7 md:col-start-2">
                          {s.desc}
                        </p>
                        <ul className="flex flex-wrap gap-2 md:col-span-4">
                          {s.tags.map((tag) => (
                            <li
                              key={tag}
                              className="h-fit rounded-full border border-line/15 px-3 py-1 text-xs text-bone-400"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
