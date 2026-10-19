"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { featured, PROFILE_ACTIVITY } from "@/lib/featured";

// Engagement figures read as icons, so the numbers land before the words do
// and the row stays legible at this size. The word is still rendered for
// screen readers and as the icon's tooltip.
function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1.5" title={`${value} ${label}`}>
      <span aria-hidden className="text-bone-500">
        {icon}
      </span>
      <span className="tabular-nums text-bone-300">{value}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

const ico = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ThumbIcon = () => (
  <svg {...ico}>
    <path d="M7 22V11m0 0 4.2-8.4A2 2 0 0 1 15 3.5V9h4.6a2 2 0 0 1 2 2.4l-1.5 8A2 2 0 0 1 18 21H7Z" />
    <path d="M2 11h5v11H2z" />
  </svg>
);

const CommentIcon = () => (
  <svg {...ico}>
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.1 9.1 0 0 1-3.6-.7L3 21l1.9-5a8.2 8.2 0 0 1-.9-3.8 8.4 8.4 0 0 1 8.6-8.2A8.4 8.4 0 0 1 21 11.5Z" />
  </svg>
);

const RepostIcon = () => (
  <svg {...ico}>
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

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
            <StaggerItem key={p.slug}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/12 bg-ink-900 transition-colors duration-300 hover:border-mint/40"
              >
                <div className="relative aspect-video overflow-hidden bg-ink-700">
                  <Media
                    src={p.image}
                    alt={post?.title ?? t.featured.label}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                    className="object-cover transition-transform duration-700 ease-cinema group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[11px] uppercase tracking-ultra text-mint">
                    {post?.kind}
                  </span>
                  <h3 className="mt-2 text-balance text-lg font-medium tracking-tight text-bone-50">
                    {post?.title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-bone-400">
                    {post?.body}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 text-xs text-bone-400">
                    {p.reactions ? (
                      <Stat
                        icon={<ThumbIcon />}
                        value={p.reactions.toLocaleString()}
                        label={t.featured.reactions}
                      />
                    ) : null}
                    {p.comments ? (
                      <Stat
                        icon={<CommentIcon />}
                        value={String(p.comments)}
                        label={t.featured.comments}
                      />
                    ) : null}
                    {p.reposts ? (
                      <Stat
                        icon={<RepostIcon />}
                        value={String(p.reposts)}
                        label={t.featured.reposts}
                      />
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
