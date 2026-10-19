"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { assetUrl } from "@/lib/assets";
import { withBase } from "@/lib/base";
import { useContent } from "@/lib/content";
import { useLang } from "@/lib/i18n";

// The GTA VI Edition loading screen: cover art with a slow push-in, the title
// lockup, rotating tips, and a twelve-second loading bar that runs with a
// quiet music cue, fading out as it lands you in the edition.
//
// Browsers only let sound start from a click or a key, so:
//  - switching the edition on (a click) goes straight into the loader;
//  - arriving in the edition cold shows a "press start" screen first, the
//    way a game waits on its title screen, and the press starts the music.
// `window.dispatchEvent(new Event("gta-load"))` plays it on demand.

const TIPS = {
  en: [
    "Tip: every campaign starts from one sentence, not one picture.",
    "Tip: lock the cast before you build a single scene.",
    "Tip: sell the life, not the square metres.",
    "Tip: one offer per post. The number is the hero.",
    "Tip: Arabic needs more line height than Latin. Give it air.",
    "Tip: press ← → on the home screen to switch the art.",
  ],
  ar: [
    "نصيحة: كل حملة بتبدأ بجملة، مش بصورة.",
    "نصيحة: ثبّت الشخصيات قبل ما تبني أي مشهد.",
    "نصيحة: بيع الحياة، مش الأمتار.",
    "نصيحة: عرض واحد في البوست. الرقم هو البطل.",
    "نصيحة: العربي محتاج مسافة سطور أكبر من الإنجليزي.",
    "نصيحة: دوس ← → في الشاشة الرئيسية عشان تغيّر الصورة.",
  ],
};

const DURATION = 12000; // matches the music cue
const VOLUME = 0.22;

type Phase = "off" | "press" | "loading";

export default function GtaLoader() {
  const { gta } = useContent();
  const { lang } = useLang();
  const [phase, setPhase] = useState<Phase>("off");
  const [tip, setTip] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef(0);

  const fadeOut = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    const start = a.volume;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 700);
      a.volume = start * (1 - k);
      if (k < 1) fade.current = requestAnimationFrame(step);
      else a.pause();
    };
    fade.current = requestAnimationFrame(step);
  }, []);

  const finish = useCallback(() => {
    fadeOut();
    setPhase("off");
  }, [fadeOut]);

  const startLoading = useCallback(() => {
    // a fade still running from the last exit would pause this new cue
    cancelAnimationFrame(fade.current);
    // Counts as this session's load. Switching the edition on from the header
    // lands here before the cold-arrival check below runs, and without the
    // flag that check saw a first visit and swapped the running loader for
    // the press-start screen, music already playing under it.
    try {
      sessionStorage.setItem("gta-loaded", "1");
    } catch {}
    try {
      const a = audio.current ?? new Audio(withBase("/audio/gta-loading.mp3"));
      audio.current = a;
      a.currentTime = 0;
      a.volume = VOLUME;
      void a.play().catch(() => {});
    } catch {}
    setPhase("loading");
  }, []);

  // cold arrival in the edition: once per session, behind a press-start
  useEffect(() => {
    if (!gta) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("gta-loaded") === "1";
      sessionStorage.setItem("gta-loaded", "1");
    } catch {}
    if (!seen) setPhase("press");
  }, [gta]);

  // switched on from the header: that click already counts as the press
  useEffect(() => {
    const play = () => startLoading();
    window.addEventListener("gta-load", play);
    return () => window.removeEventListener("gta-load", play);
  }, [startLoading]);

  useEffect(() => {
    if (phase !== "press") return;
    const go = () => startLoading();
    window.addEventListener("keydown", go, { once: true });
    return () => window.removeEventListener("keydown", go);
  }, [phase, startLoading]);

  // Only ever unlock what this screen locked: clearing the overflow while off
  // also ran on mount, and released the intro preloader's lock under it.
  useEffect(() => {
    if (phase === "off") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "loading") return;
    setTip(Math.floor(Math.random() * TIPS.en.length));
    const tipId = setInterval(() => setTip((x) => (x + 1) % TIPS.en.length), 2400);
    const done = setTimeout(finish, DURATION);
    return () => {
      clearInterval(tipId);
      clearTimeout(done);
    };
  }, [phase, finish]);

  useEffect(() => () => audio.current?.pause(), []);

  return (
    <AnimatePresence>
      {phase !== "off" ? (
        <motion.div
          key="gta-loader"
          className={`fixed inset-0 z-[120] overflow-hidden bg-[#1a0b2e] ${phase === "press" ? "cursor-pointer" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6 }}
          role="status"
          aria-label="Loading"
          onClick={phase === "press" ? startLoading : undefined}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-[70%_center]"
            style={{ backgroundImage: `url(${assetUrl("/me/gta-hero.webp")})` }}
            initial={{ scale: 1.14 }}
            animate={{ scale: phase === "loading" ? 1 : 1.1 }}
            transition={{ duration: phase === "loading" ? DURATION / 1000 : 0.6, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(26_11_46/0.9)_0%,rgb(26_11_46/0.3)_55%,transparent),linear-gradient(0deg,rgb(26_11_46/0.95),transparent_45%)]" />

          <div dir="ltr" className="absolute bottom-8 left-6 right-6 flex flex-col gap-8 md:bottom-12 md:left-12 md:right-12 md:flex-row md:items-end md:justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="gta-lockup font-[family-name:var(--font-gta)] text-[18vw] uppercase leading-[0.82] text-white md:text-[9rem]"
              >
                Mohamed
                <br />
                Tarek{" "}
                <span className="gta-vi inline-block rounded-lg border-[3px] border-white bg-[linear-gradient(135deg,#ff4fa3,#ff9a3c)] px-2 align-middle text-[0.4em] leading-[1.05]">VI</span>
              </motion.p>
              {phase === "loading" ? (
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tip}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-5 max-w-md text-sm text-white/85 md:text-base"
                  >
                    {TIPS[lang][tip]}
                  </motion.p>
                </AnimatePresence>
              ) : (
                <motion.p
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="mt-6 font-[family-name:var(--font-gta)] text-2xl uppercase tracking-[0.12em] text-[#ffd34d] md:text-3xl"
                >
                  {lang === "ar" ? "اضغط في أي مكان للبدء" : "Press any key to start"}
                </motion.p>
              )}
            </div>

            {phase === "loading" ? (
              <div className="flex items-center gap-4 md:flex-col md:items-end">
                <span className="gta-spinner text-3xl text-[#ffd34d]" aria-hidden>
                  ★
                </span>
                <div className="flex-1 md:w-64 md:flex-none">
                  <p className="text-end font-[family-name:var(--font-gta)] text-lg uppercase tracking-wide text-white">Loading story mode</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                    <motion.div
                      className="h-full bg-[linear-gradient(90deg,#ff4fa3,#ff9a3c)]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: DURATION / 1000, ease: [0.3, 0.1, 0.3, 1] }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      finish();
                    }}
                    className="mt-3 ms-auto block min-h-[36px] rounded-full border border-white/40 px-4 text-xs font-bold uppercase tracking-[0.18em] text-white hover:border-white"
                  >
                    Skip ▸▸
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
