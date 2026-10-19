"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { assetUrl } from "@/lib/assets";
import { useContent } from "@/lib/content";
import { useLang } from "@/lib/i18n";

// The GTA VI Edition loading screen: cover art with a slow push-in, the title
// lockup, a loading bar and rotating tips, like a game booting story mode.
// Plays when the edition is switched on, and once per session on arrival.
// Fire `window.dispatchEvent(new Event("gta-load"))` to play it on demand.

const TIPS = {
  en: [
    "Tip: every campaign starts from one sentence, not one picture.",
    "Tip: lock the cast before you build a single scene.",
    "Tip: sell the life, not the square metres.",
    "Tip: one offer per post. The number is the hero.",
    "Tip: Arabic needs more line height than Latin. Give it air.",
    "Tip: press ← → on the home screen to switch titles.",
  ],
  ar: [
    "نصيحة: كل حملة بتبدأ بجملة، مش بصورة.",
    "نصيحة: ثبّت الشخصيات قبل ما تبني أي مشهد.",
    "نصيحة: بيع الحياة، مش الأمتار.",
    "نصيحة: عرض واحد في البوست. الرقم هو البطل.",
    "نصيحة: العربي محتاج مسافة سطور أكبر من الإنجليزي.",
    "نصيحة: دوس ← → في الشاشة الرئيسية عشان تغيّر العنوان.",
  ],
};

const DURATION = 2600;

export default function GtaLoader() {
  const { gta } = useContent();
  const { lang } = useLang();
  const [show, setShow] = useState(false);
  const [tip, setTip] = useState(0);

  // once per session on arrival in the edition
  useEffect(() => {
    if (!gta) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("gta-loaded") === "1";
      sessionStorage.setItem("gta-loaded", "1");
    } catch {}
    if (!seen) setShow(true);
  }, [gta]);

  useEffect(() => {
    const play = () => setShow(true);
    window.addEventListener("gta-load", play);
    return () => window.removeEventListener("gta-load", play);
  }, []);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    setTip(Math.floor(Math.random() * TIPS.en.length));
    const tipId = setInterval(() => setTip((x) => (x + 1) % TIPS.en.length), 1300);
    const done = setTimeout(() => setShow(false), DURATION);
    return () => {
      clearInterval(tipId);
      clearTimeout(done);
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="gta-loader"
          className="fixed inset-0 z-[120] overflow-hidden bg-[#1a0b2e]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5 }}
          role="status"
          aria-label="Loading"
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-[70%_center]"
            style={{ backgroundImage: `url(${assetUrl("/me/gta-hero.webp")})` }}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: DURATION / 1000 + 0.6, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(26_11_46/0.92)_0%,rgb(26_11_46/0.35)_55%,transparent),linear-gradient(0deg,rgb(26_11_46/0.95),transparent_45%)]" />

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
                <span className="inline-block rounded-lg border-[3px] border-white bg-[linear-gradient(135deg,#ff4fa3,#ff9a3c)] px-2 align-middle text-[0.4em] leading-[1.05] text-[#1a0b2e]">VI</span>
              </motion.p>
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
            </div>

            <div className="flex items-center gap-4 md:flex-col md:items-end">
              <span className="gta-spinner text-3xl text-[#ffd34d]" aria-hidden>
                ★
              </span>
              <div className="flex-1 md:w-56 md:flex-none">
                <p className="text-end font-[family-name:var(--font-gta)] text-lg uppercase tracking-wide text-white">Loading story mode</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    className="h-full bg-[linear-gradient(90deg,#ff4fa3,#ff9a3c)]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: DURATION / 1000 - 0.2, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
