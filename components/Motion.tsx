"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Toggle } from "@/components/ui/Toggle";
import { SwipeRail } from "@/components/ui/SwipeRail";
import { useLang } from "@/lib/i18n";
import { assetUrl } from "@/lib/assets";
import motionData from "@/lib/motion.json";

type Clip = {
  slug: string;
  title: string;
  kind: string;
  collection?: string;
  src: string;
  poster: string;
  width: number;
  height: number;
};

const clips = motionData as Clip[];
// Two separate collections; the production clip is shown inside its case study.
const landscape = clips.filter((c) => c.collection === "landscape");
const portrait = clips.filter((c) => c.collection === "portrait");

// Landscape clips sit in a 16:9 frame, portrait ones in 9:16 — which is what
// every reel in the set actually is. The portrait frame used to be 4:5, so
// object-cover was cropping the top and bottom off all fourteen of them.
function VideoCard({
  clip,
  onExpand,
  wide = false,
}: {
  clip: Clip;
  onExpand: (c: Clip) => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  // Posters only until you ask for a clip. Auto-playing every tile at once
  // made scrolling heavy and the section feel noisy.
  const play = () => {
    const el = ref.current;
    if (!el) return;
    el.play().then(() => setPlaying(true)).catch(() => {});
  };
  const stop = () => {
    const el = ref.current;
    if (!el) return;
    el.pause();
    setPlaying(false);
  };

  const toggleSound = () => {
    const el = ref.current;
    if (!el) return;
    const next = !muted;
    setMuted(next);
    el.muted = next;
    if (!next) play();
  };

  const btn =
    "grid h-11 w-11 place-items-center rounded-full border border-white/25 md:h-9 md:w-9 bg-black/40 text-white backdrop-blur-md transition-colors duration-300 hover:border-mint/60 hover:text-mint";

  return (
    <div
      onMouseEnter={play}
      onMouseLeave={stop}
      className={`group relative overflow-hidden rounded-xl bg-ink-700 ${
        wide ? "aspect-video" : "aspect-[9/16]"
      }`}
    >
      <video
        ref={ref}
        src={assetUrl(clip.src)}
        poster={assetUrl(clip.poster)}
        muted={muted}
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />
      {/* light scrim only — the clips carry no caption, so nothing to protect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15" />

      {/* play affordance — tap on touch, hover on desktop */}
      {!playing ? (
        <button
          type="button"
          onClick={play}
          aria-label={`Play ${clip.title}`}
          className="absolute inset-0 grid place-items-center"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      ) : null}

      <div className="absolute right-4 top-4 flex gap-2">
        <button onClick={toggleSound} aria-label={muted ? "Unmute" : "Mute"} className={btn}>
          {muted ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
        <button onClick={() => onExpand(clip)} aria-label="Expand" className={btn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
      </div>

    </div>
  );
}

function Lightbox({ clip, onClose }: { clip: Clip; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const portrait = clip.height > clip.width;

  return (
    <motion.div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative overflow-hidden rounded-2xl bg-ink-900 ${
          portrait ? "max-h-[82vh] w-auto" : "w-full max-w-4xl"
        }`}
      >
        <video
          src={assetUrl(clip.src)}
          poster={assetUrl(clip.poster)}
          controls
          autoPlay
          loop
          playsInline
          style={{ aspectRatio: `${clip.width} / ${clip.height}` }}
          className={portrait ? "h-[82vh] w-auto" : "w-full"}
        />
      </motion.div>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-colors hover:border-mint/60 hover:text-mint"
      >
        ✕
      </button>
    </motion.div>
  );
}

export default function Motion() {
  const [expanded, setExpanded] = useState<Clip | null>(null);
  const [tab, setTab] = useState<"landscape" | "portrait">("landscape");
  const { t } = useLang();

  return (
    <section
      id="motion"
      className="container-edge mx-auto max-w-edge scroll-mt-24 section-y"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <SectionLabel>{t.motion.label}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
              {t.motion.h2a}{" "}
              <span className="font-serif font-normal italic text-mint">
                {t.motion.h2i}
              </span>
              {t.motion.h2b}
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm leading-relaxed text-bone-400">
            {t.motion.note}
          </p>
        </Reveal>
      </div>

      {/* one collection at a time — showing all 21 at once was overwhelming */}
      <Reveal delay={0.1}>
        <div className="mt-10">
          <Toggle
            ariaLabel="Video collections"
            hint={t.motion.pick}
            value={tab}
            onChange={(v) => setTab(v as "landscape" | "portrait")}
            options={[
              { value: "landscape", label: t.motion.landscape, hint: String(landscape.length) },
              { value: "portrait", label: t.motion.portrait, hint: String(portrait.length) },
            ]}
          />
        </div>
      </Reveal>

      {/* On phones both collections ride a rail rather than stacking: seven
          16:9 frames one under the other was two screens, and fourteen reels
          two-up was nearly three. */}
      <div className="mt-6">
        {tab === "landscape" ? (
          <SwipeRail
            key="landscape"
            grid="sm:grid-cols-2 lg:grid-cols-3"
            slide="w-[86%]"
            ariaLabel={t.motion.landscape}
          >
            {landscape.map((c) => (
              <VideoCard key={c.slug} clip={c} onExpand={setExpanded} wide />
            ))}
          </SwipeRail>
        ) : (
          <SwipeRail
            key="portrait"
            grid="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            slide="w-[45%]"
            ariaLabel={t.motion.portrait}
          >
            {portrait.map((c) => (
              <VideoCard key={c.slug} clip={c} onExpand={setExpanded} />
            ))}
          </SwipeRail>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <Lightbox clip={expanded} onClose={() => setExpanded(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
