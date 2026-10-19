"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { articles, coverOf, getArticle, readMinutes, type Article } from "@/lib/articles";
import { projects } from "@/lib/projects";
import { Media } from "@/components/ui/Media";

// One article. The body is English; in Arabic the header switches to the
// Arabic title and summary and says so, rather than pretending to be
// translated. The layout stays a single readable column at every width.
export default function ArticleView({ initial }: { initial: Article }) {
  const { t, lang } = useLang();
  // read from the live list so a dashboard draft shows up in preview
  const a = getArticle(initial.slug) ?? initial;
  const ar = lang === "ar";
  const catLabel = t.articles.categories[a.category] ?? a.category;
  const related = (a.related ?? [])
    .map((s) => projects.find((p) => p.slug === s))
    .filter(Boolean)
    .slice(0, 3);
  const more = articles
    .filter((x) => x.slug !== a.slug && x.category === a.category)
    .concat(articles.filter((x) => x.slug !== a.slug && x.category !== a.category))
    .slice(0, 3);

  return (
    <article className="container-edge mx-auto max-w-edge pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="mx-auto max-w-[44rem]">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-bone-400">
          <Link href="/articles" className="hover:text-mint">
            {t.articles.back}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-mint">{catLabel}</span>
        </nav>

        <h1 className="mt-6 text-balance text-[2rem] font-semibold leading-[1.1] tracking-tight text-bone-50 sm:text-4xl md:text-5xl">
          {ar ? a.titleAr : a.title}
        </h1>
        {ar ? (
          <p lang="en" dir="ltr" className="mt-3 text-sm text-bone-400">
            {a.title}
          </p>
        ) : null}

        <p className="mt-6 text-sm text-bone-400">
          {t.articles.by} <Link href="/about" className="text-bone-200 hover:text-mint">{site.name}</Link>
          {" · "}
          {site.role} · {readMinutes(a)} {t.articles.min}
        </p>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-line/10 bg-ink-700">
          <Media src={coverOf(a)} alt={a.title} fill priority sizes="(max-width: 768px) 92vw, 44rem" className="object-cover" />
        </div>

        {/* the direct answer, first: the part people and assistants quote */}
        <div className="mt-8 rounded-2xl border border-mint/25 bg-ink-800 p-5 md:p-6">
          <p className="text-[11px] uppercase tracking-ultra text-mint">{t.articles.summary}</p>
          <p className="mt-3 text-base leading-relaxed text-bone-100">{ar ? a.summaryAr : a.description}</p>
          <p className="mt-5 text-[11px] uppercase tracking-ultra text-mint">{t.articles.takeaways}</p>
          <ul lang="en" dir="ltr" className="mt-3 grid gap-2 text-[15px] leading-relaxed text-bone-200">
            {a.takeaways.map((k) => (
              <li key={k} className="flex gap-3">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </div>

        {ar && t.articles.arNote ? (
          <p className="mt-6 text-sm text-bone-400">{t.articles.arNote}</p>
        ) : null}

        {/* body */}
        <div lang="en" dir="ltr" className="mt-10 text-[17px] leading-[1.75] text-bone-200">
          {a.body.map((b, i) =>
            "h2" in b ? (
              <h2 key={i} className="mb-3 mt-10 text-2xl font-semibold leading-snug tracking-tight text-bone-50">
                {b.h2}
              </h2>
            ) : "p" in b ? (
              <p key={i} className="mt-4 text-pretty">
                {b.p}
              </p>
            ) : "quote" in b ? (
              <blockquote key={i} className="my-8 border-s-2 border-mint ps-5 font-serif text-2xl italic text-bone-50">
                {b.quote}
              </blockquote>
            ) : (
              <ul key={i} className="mt-4 grid gap-2.5">
                {b.ul.map((x) => (
                  <li key={x} className="flex gap-3">
                    <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                    <span className="text-pretty">{x}</span>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>

        {/* FAQ */}
        {a.faq.length ? (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight text-bone-50">{t.articles.faq}</h2>
            <div lang="en" dir="ltr" className="mt-5 divide-y divide-line/10 rounded-2xl border border-line/10 bg-ink-800">
              {a.faq.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-medium text-bone-50">
                    {f.q}
                    <span aria-hidden className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line/20 text-bone-300 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-bone-300">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {/* proof on this site */}
      {related.length ? (
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="text-xs uppercase tracking-ultra text-bone-400">{t.articles.related}</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {related.map((p) => {
              const tr = t.projects[p!.slug] ?? {};
              return (
                <li key={p!.slug}>
                  <Link href={`/work/${p!.slug}`} className="group block overflow-hidden rounded-xl border border-line/10 bg-ink-800">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Media src={p!.cover} alt={tr.title ?? p!.title} fill sizes="(max-width:640px) 92vw, 30vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    </div>
                    <p className="p-4 text-sm font-medium leading-snug text-bone-50">{tr.title ?? p!.title}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-xs uppercase tracking-ultra text-bone-400">{t.articles.more}</h2>
        <ul className="mt-5 grid gap-4 md:grid-cols-3">
          {more.map((m) => (
            <li key={m.slug}>
              <Link href={`/articles/${m.slug}`} className="flex h-full flex-col rounded-xl border border-line/10 bg-ink-800 p-5 transition-colors hover:border-mint/40">
                <span className="text-[11px] uppercase tracking-[0.18em] text-mint">{t.articles.categories[m.category] ?? m.category}</span>
                <span className="mt-2 text-base font-semibold leading-snug text-bone-50">{ar ? m.titleAr : m.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
