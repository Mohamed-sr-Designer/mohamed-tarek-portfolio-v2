"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Toggle } from "@/components/ui/Toggle";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { withBase } from "@/lib/base";

// 3D product rendering, built in Blender.
//
// The drop held two different things: three finished renders of the bottle and
// two screenshots of the Blender viewport with the scene, the lighting rig and
// the wireframe on show. Those are worth more together than apart -- the whole
// site argues that the process is the work -- so the toggle moves between the
// result and how it was built, the same shape as the AI Work Flow section.
const shots = {
  render: ["/work/blender/01.webp", "/work/blender/03.webp", "/work/blender/04.webp"],
  scene: ["/work/blender/02.webp", "/work/blender/05.webp"],
};

export default function ThreeD() {
  const { t } = useLang();
  const [tab, setTab] = useState<"render" | "scene">("render");
  const [i, setI] = useState(0);
  const [open, setOpen] = useState<string | null>(null);

  const list = shots[tab];
  const current = list[Math.min(i, list.length - 1)];

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
    <section
      id="three-d"
      className="border-y border-line/10 bg-ink-800 scroll-mt-24"
    >
      <div className="container-edge mx-auto max-w-edge section-y">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <SectionLabel>{t.threeD.label}</SectionLabel>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
                {t.threeD.h2a}{" "}
                <span className="font-serif font-normal italic text-mint">
                  {t.threeD.h2i}
                </span>
                {t.threeD.h2b}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-sm leading-relaxed text-bone-400">
              {t.threeD.note}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10">
            <Toggle
              ariaLabel={t.threeD.label}
              hint={t.threeD.pick}
              value={tab}
              onChange={(v) => {
                setTab(v as "render" | "scene");
                setI(0);
              }}
              options={[
                { value: "render", label: t.threeD.renders, hint: String(shots.render.length) },
                { value: "scene", label: t.threeD.scene, hint: String(shots.scene.length) },
              ]}
            />
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <button
            type="button"
            onClick={() => setOpen(current)}
            aria-label={`${t.threeD.label} — ${t.master.expand}`}
            className="group relative mt-6 block w-full overflow-hidden rounded-2xl border border-line/10 bg-ink-900"
          >
            <div className="relative aspect-video">
              <Media
                key={current}
                src={current}
                alt={t.threeD.label}
                fill
                sizes="(max-width: 1024px) 100vw, 80rem"
                className="object-cover transition-transform duration-700 ease-cinema group-hover:scale-[1.02]"
              />
            </div>
            <span className="pointer-events-none absolute bottom-5 right-5 rounded-full bg-black/55 px-4 py-2 text-[11px] uppercase tracking-widest text-white backdrop-blur-md opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              {t.master.expand}
            </span>
          </button>
        </Reveal>

        {list.length > 1 ? (
          <Reveal delay={0.15}>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {list.map((src, n) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setI(n)}
                  aria-label={`${t.threeD.label} ${n + 1}`}
                  aria-current={n === i}
                  className={`relative aspect-video overflow-hidden rounded-lg border transition-all duration-300 ${
                    n === i
                      ? "border-mint/70 opacity-100 ring-1 ring-mint/40"
                      : "border-line/10 opacity-55 hover:opacity-90"
                  }`}
                >
                  <Media src={src} alt="" fill sizes="160px" className="object-cover" />
                </button>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-3 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBase(open)}
              alt={t.threeD.label}
              className="max-h-full max-w-full rounded-lg object-contain"
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
