"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

// A card rail on phones, an ordinary grid from `sm` up.
//
// On a 375px viewport every card grid collapsed to a single column and simply
// stacked, so the home page ran twenty-one screens — the social section alone
// was eight of them, and nobody thumbs through eight screens of cards to reach
// the next thing. Cards that are peers (one per brand, one per film) read
// better side by side than end to end, so below `sm` the same markup lays out
// as a snap rail instead.
//
// Three things keep a rail from hiding its own content: the next slide peeks in
// at the edge so there is never a doubt that more exists, the progress bar and
// counter say how long the set is, and snapping lands each card square. Nothing
// changes at `sm` and up, and the DOM is identical either way — only the layout
// switches — so there is no duplicated markup and no JS layout branch.
export function SwipeRail({
  children,
  grid,
  slide = "w-[82%]",
  ariaLabel,
}: {
  children: React.ReactNode;
  /** grid classes that take over from `sm` up, e.g. "sm:grid-cols-2 lg:grid-cols-3" */
  grid: string;
  /** slide width below `sm` — leave room for the next card to peek */
  slide?: string;
  ariaLabel?: string;
}) {
  const { t } = useLang();
  const items = Children.toArray(children);
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [railed, setRailed] = useState(false);

  // The rail only exists below `sm`; above it this is a plain grid and the
  // counter has nothing to count, so it is not rendered at all.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setRailed(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Which slide is current: the one nearest the leading edge of the rail.
  // Measured from rects rather than scrollLeft because scrollLeft runs negative
  // under RTL in Chrome and the Arabic side of the site would count backwards.
  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const kids = Array.from(el.children) as HTMLElement[];
    if (kids.length < 2) return;
    const box = el.getBoundingClientRect();
    const rtl = getComputedStyle(el).direction === "rtl";
    const edge = rtl ? box.right : box.left;
    let best = 0;
    let bestD = Infinity;
    kids.forEach((k, n) => {
      const r = k.getBoundingClientRect();
      const d = Math.abs((rtl ? r.right : r.left) - edge);
      if (d < bestD) {
        bestD = d;
        best = n;
      }
    });
    setI(best);
  }, []);

  return (
    <>
      <div
        ref={ref}
        onScroll={railed ? onScroll : undefined}
        role={railed ? "region" : undefined}
        aria-label={railed ? ariaLabel : undefined}
        className={`rail-bleed flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:gap-5 sm:overflow-visible sm:pb-0 ${grid}`}
      >
        {items.map((child, n) => (
          <div
            key={n}
            className={`${slide} shrink-0 snap-start [&>*]:h-full sm:w-auto`}
          >
            {child}
          </div>
        ))}
      </div>

      {railed && items.length > 1 ? (
        <div className="mt-4 flex items-center gap-3 sm:hidden">
          <span className="shrink-0 text-[11px] uppercase tracking-ultra text-mint">
            {t.ui.swipe}
          </span>
          <span
            aria-hidden
            className="h-[3px] flex-1 overflow-hidden rounded-full bg-line/15"
          >
            <span
              className="block h-full rounded-full bg-mint transition-[width] duration-300 ease-out"
              style={{ width: `${((i + 1) / items.length) * 100}%` }}
            />
          </span>
          <span
            className="shrink-0 text-xs tabular-nums text-bone-400"
            aria-live="polite"
          >
            {i + 1} / {items.length}
          </span>
        </div>
      ) : null}
    </>
  );
}
