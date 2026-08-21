"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { assetUrl } from "@/lib/assets";

// Custom Arabic and Latin lettering, produced with AI tooling and finished by
// hand-off into logotypes and campaign headlines.
//
// Presented as a continuous auto-scrolling loop rather than a grid: the pieces
// have very different proportions, so a fixed grid left them floating at odd
// sizes with nothing lining up. In a strip they each keep their natural width
// and share one baseline. Each piece ships as two cuts on transparent alpha —
// white for dark mode, black for light — so the letterforms sit straight on
// the page with no tile behind them.
//
// The white cuts are what the page shows: dark ground, and the lightbox opens
// on a near-black scrim, so the same artwork serves both. The black cuts stay in
// the repo -- 08's was derived from its own artwork rather than supplied, and
// they cost nothing to keep.
const pieces = Array.from({ length: 8 }, (_, i) => {
  const id = String(i + 1).padStart(2, "0");
  return {
    id,
    dark: `/work/type/${id}-dark.webp`,
    light: `/work/type/${id}-light.webp`,
  };
});

function Piece({
  piece,
  index,
  onOpen,
  label,
  wasDragged,
}: {
  piece: (typeof pieces)[number];
  index: number;
  onOpen: (src: string) => void;
  label: string;
  wasDragged?: () => boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (wasDragged?.()) return;
        onOpen(piece.dark);
      }}
      aria-label={`${label} ${index + 1}`}
      className="group relative h-24 w-44 shrink-0 transition-transform duration-500 ease-cinema hover:scale-[1.06] sm:h-32 sm:w-56"
    >
      <span className="absolute inset-0 block p-5 sm:p-7">
        <span className="relative block h-full w-full">
          <Media
            src={piece.dark}
            alt={`${label} ${index + 1}`}
            fill
            sizes="288px"
            className="object-contain"
          />
        </span>
      </span>
    </button>
  );
}

// The strip never stops: the CSS marquee keeps running while a drag adds its
// own offset on top, so you can throw it left or right by hand and it carries
// on looping from wherever you let go.
//
// Two copies of the set are laid out and the wrapper's own scroll is what the
// drag moves; the -50% keyframe on the inner track is what makes the join
// seamless. A pointer drag past the halfway mark wraps back, so it never runs
// out of strip in either direction.
function Row({
  onOpen,
  label,
}: {
  onOpen: (src: string) => void;
  label: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });

  const track = [...pieces, ...pieces, ...pieces];

  // keep the manual scroll inside the middle copy so dragging never hits an end
  const wrap = (el: HTMLDivElement) => {
    const span = el.scrollWidth / 3;
    if (el.scrollLeft < span * 0.5) el.scrollLeft += span;
    else if (el.scrollLeft > span * 1.5) el.scrollLeft -= span;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startLeft: el.scrollLeft,
      moved: 0,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.startLeft - dx;
    wrap(el);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    drag.current.active = false;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    // start in the middle copy so there is room to drag both ways
    el.scrollLeft = el.scrollWidth / 3;
  }, []);

  return (
    <div
      ref={scroller}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="flex cursor-grab overflow-x-auto overscroll-x-contain active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max items-center gap-6 pe-6 animate-marquee motion-reduce:animate-none sm:gap-10 sm:pe-10">
        {track.map((p, i) => (
          <Piece
            key={`${p.id}-${i}`}
            piece={p}
            index={i % pieces.length}
            onOpen={onOpen}
            label={label}
            // a drag should not open the lightbox on release
            wasDragged={() => drag.current.moved > 6}
          />
        ))}
      </div>
    </div>
  );
}

export default function TypeDesign() {
  const { t } = useLang();
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section id="type" className="scroll-mt-24 section-y">
      <div className="container-edge mx-auto max-w-edge">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>{t.type.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
                {t.type.h2a}{" "}
                <span className="font-serif font-normal italic text-mint">
                  {t.type.h2i}
                </span>
                {t.type.h2b}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-sm leading-relaxed text-bone-400">
              {t.type.note}
            </p>
          </Reveal>
        </div>
      </div>

      {/* one full-bleed strip, always looping and draggable by hand */}
      <div className="mt-12">
        <Row onOpen={setOpen} label={t.type.label} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/92 p-6 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetUrl(open)}
              alt={t.type.label}
              className="max-h-full max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label={t.master.close}
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-colors hover:border-mint/60 hover:text-mint"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
