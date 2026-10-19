"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { projects } from "@/lib/projects";

// GTA VI Edition HUD, on every page: a radar in the corner naming where you
// are in the site, the wanted-level stars, and a "mission started" banner when
// a case study opens. It is what makes the whole site read as game mode, not
// only the home page.

const PLACES = {
  en: { home: "Home base", about: "Player profile", contact: "Phone", articles: "Library", mission: "Mission", studio: "Garage" },
  ar: { home: "القاعدة", about: "ملف اللاعب", contact: "الهاتف", articles: "المكتبة", mission: "مهمة", studio: "الجراج" },
};

export default function GtaHud() {
  const { gta } = useContent();
  const { lang, t } = useLang();
  const path = usePathname() ?? "/";
  const [banner, setBanner] = useState<string | null>(null);
  const p = PLACES[lang];

  const slug = path.startsWith("/work/") ? path.split("/")[2] : null;
  const project = slug ? projects.find((x) => x.slug === slug) : null;
  const place =
    project
      ? `${p.mission} ${project.index}`
      : path.startsWith("/about")
        ? p.about
        : path.startsWith("/contact")
          ? p.contact
          : path.startsWith("/articles")
            ? p.articles
            : p.home;

  useEffect(() => {
    if (!gta || !project) return;
    setBanner((t.projects[project.slug]?.title ?? project.title).split(",")[0]);
    const id = setTimeout(() => setBanner(null), 2400);
    return () => clearTimeout(id);
  }, [gta, project, t]);

  if (!gta) return null;
  // the home screen carries its own HUD (clock, cash, stars) in the hero
  const showRadar = path !== "/" && !path.startsWith("/studio");
  return (
    <>
      {showRadar ? (
      <div dir="ltr" className="pointer-events-none fixed bottom-5 left-5 z-[65] hidden items-end gap-3 md:flex rtl:left-auto rtl:right-5">
        {/* radar */}
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-[3px] border-black/80 bg-[radial-gradient(circle,#3b2a5c_0%,#22143a_70%)] shadow-[0_0_0_2px_rgb(255_244_230/0.7)]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgb(255_255_255/0.12)_50%,transparent_51%),linear-gradient(0deg,transparent_49%,rgb(255_255_255/0.12)_50%,transparent_51%)]" />
          <div className="gta-sweep absolute inset-0 bg-[conic-gradient(from_0deg,rgb(255_79_163/0.45),transparent_25%)]" />
          <span className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 border-x-[6px] border-b-[11px] border-x-transparent border-b-white" />
          <span className="absolute left-1/2 top-1 -translate-x-1/2 text-[10px] font-bold text-white">N</span>
          <span className="absolute right-5 top-7 h-2 w-2 rounded-full bg-[#ffd34d] shadow-[0_0_8px_#ffd34d]" />
        </div>
        <div className="mb-2 font-[family-name:var(--font-gta)] uppercase leading-none">
          <p className="text-[#ffd34d] [text-shadow:2px_2px_0_#1a0b2e]">★★★★★</p>
          <p className="mt-1 text-xl text-white [text-shadow:2px_2px_0_#1a0b2e]">{place}</p>
        </div>
      </div>
      ) : null}

      <AnimatePresence>
        {banner ? (
          <motion.div
            key={banner}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none fixed inset-x-0 top-[38%] z-[100] text-center"
            role="status"
          >
            <p className="font-[family-name:var(--font-gta)] text-[11vw] uppercase leading-none text-[#ffd34d] [text-shadow:4px_4px_0_#1a0b2e] md:text-7xl">
              {lang === "ar" ? "بدأت المهمة" : "Mission started"}
            </p>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.3em] text-white [text-shadow:2px_2px_0_#1a0b2e]">{banner}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
