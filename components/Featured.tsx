"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { featured, PROFILE_ACTIVITY } from "@/lib/featured";

// The posts pinned to his LinkedIn Featured section, mirrored here so the
// teaching and AI-workflow side of his profile is visible without leaving the
// site — each tile opens the post itself.
export default function Featured() {
  const { t } = useLang();

  return (
    <section
      id="featured"
      className="container-edge mx-auto max-w-edge scroll-mt-24 section-y"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <SectionLabel>{t.featured.label}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
              {t.featured.h2a}{" "}
              <span className="font-serif font-normal italic text-mint">
                {t.featured.h2i}
              </span>
              {t.featured.h2b}
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="max-w-xs">
            <p className="text-sm leading-relaxed text-bone-400">
              {t.featured.note}
            </p>
            <a
              href={PROFILE_ACTIVITY}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-mint underline-offset-4 hover:underline"
            >
              {t.featured.all}
              <span aria-hidden className="rtl:rotate-180">
                ↗
              </span>
            </a>
          </div>
        </Reveal>
      </div>

      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => {
          const post = t.featured.posts[p.slug];
          return (
            <StaggerItem key={p.slug} className={p.portrait ? "sm:row-span-2" : ""}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/12 bg-ink-900 transition-colors duration-300 hover:border-mint/40"
              >
                <div
                  className={`relative overflow-hidden bg-ink-700 ${
                    p.portrait ? "aspect-[3/4]" : "aspect-video"
                  }`}
                >
                  <Media
                    src={p.image}
                    alt={post?.title ?? t.featured.label}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                    className="object-cover transition-transform duration-700 ease-cinema group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[10px] uppercase tracking-ultra text-mint">
                    {post?.kind}
                  </span>
                  <h3 className="mt-2 text-balance text-lg font-medium tracking-tight text-bone-50">
                    {post?.title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-bone-400">
                    {post?.body}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs text-bone-500">
                    {p.reactions ? (
                      <span>
                        {p.reactions.toLocaleString()} {t.featured.reactions}
                      </span>
                    ) : null}
                    {p.comments ? (
                      <span>
                        {p.comments} {t.featured.comments}
                      </span>
                    ) : null}
                    {p.reposts ? (
                      <span>
                        {p.reposts} {t.featured.reposts}
                      </span>
                    ) : null}
                    <span className="ms-auto text-mint opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {t.featured.open} ↗
                    </span>
                  </div>
                </div>
              </a>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
