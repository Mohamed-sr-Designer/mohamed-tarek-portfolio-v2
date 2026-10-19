"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";
import { articles, articleCategories, coverOf, readMinutes } from "@/lib/articles";
import { Media } from "@/components/ui/Media";

const fmt = (iso: string, lang: string) =>
  new Date(iso).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function ArticlesIndex() {
  const { t, lang } = useLang();
  const [cat, setCat] = useState<string>("all");
  const catLabel = (c: string) => t.articles.categories[c] ?? c;

  const list = useMemo(
    () =>
      articles
        .filter((a) => cat === "all" || a.category === cat)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [cat]
  );

  return (
    <section className="container-edge mx-auto max-w-edge section-y pt-32 md:pt-40">
      <Reveal>
        <SectionLabel>{t.articles.label}</SectionLabel>
      </Reveal>
      <Reveal delay={0.05}>
        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
          {t.articles.h2a}{" "}
          <span className="font-serif font-normal italic text-mint">{t.articles.h2i}</span>
          {t.articles.h2b}
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-bone-300">{t.articles.note}</p>
      </Reveal>

      {/* topic filter — every chip has its own border and fill so the
          inactive ones still read as pressable */}
      <div className="mt-10">
        <p className="text-[11px] uppercase tracking-ultra text-mint">{t.articles.filter}</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          {["all", ...articleCategories].map((c) => {
            const on = cat === c;
            const n = c === "all" ? articles.length : articles.filter((a) => a.category === c).length;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                aria-pressed={on}
                className={`flex min-h-[40px] shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
                  on
                    ? "border-mint bg-mint font-semibold text-ink-900"
                    : "border-line/20 bg-ink-800 text-bone-200 hover:border-mint/50 hover:text-bone-50"
                }`}
              >
                {c === "all" ? t.articles.all : catLabel(c)}
                <span className={`text-xs tabular-nums ${on ? "text-ink-900/70" : "text-bone-500"}`}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/articles/${a.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/10 bg-ink-800 transition-colors duration-300 hover:border-mint/40"
            >
              <span className="relative block aspect-[16/9] overflow-hidden bg-ink-700">
                <Media
                  src={coverOf(a)}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 30vw"
                  className="object-cover transition-transform duration-700 ease-cinema group-hover:scale-[1.04]"
                />
              </span>
              <span className="flex flex-1 flex-col p-6">
              <span className="text-xs uppercase tracking-[0.18em] text-mint">{catLabel(a.category)}</span>
              <h2 className="mt-3 text-pretty text-xl font-semibold leading-snug text-bone-50">
                {lang === "ar" ? a.titleAr : a.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-bone-300">
                {lang === "ar" ? a.summaryAr : a.description}
              </p>
              <span className="mt-auto flex items-center justify-between gap-3 pt-6 text-xs text-bone-400">
                <span>
                  {fmt(a.date, lang)} · {readMinutes(a)} {t.articles.min}
                </span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line/20 text-bone-200 transition-colors group-hover:border-mint group-hover:bg-mint group-hover:text-ink-900 rtl:rotate-180">
                  →
                </span>
              </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
