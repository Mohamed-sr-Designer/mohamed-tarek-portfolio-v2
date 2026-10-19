"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";
import { articles } from "@/lib/articles";
import { assetUrl } from "@/lib/assets";
import { openContact } from "@/components/ContactModal";
import motionClips from "@/lib/motion.json";
import Motion from "@/components/Motion";

// GTA VI Edition home: the portfolio played as a game. A console home screen
// to pick a title, a reel strip, a character-select screen of missions by
// industry, a gameplay film strip, a player profile and a box-art call to
// action. All of it is the real portfolio data; only the framing is a game.
// A homage: no Rockstar marks or game logotypes anywhere.

const ease = [0.16, 1, 0.3, 1] as const;

const copy = {
  en: {
    start: "Start mission",
    profile: "Player profile",
    tagline: "Here comes the brief. I'm ready for it.",
    reel: ["Design", "Direct", "Deliver"],
    watch: "Watch reel",
    chooseA: "Choose your",
    chooseB: "mission",
    chooseNote: "Every sector is a different game. Pick one and see the missions in it.",
    missions: "missions",
    play: "Play mission",
    gameplay: "Gameplay",
    gameplayNote: "Footage from the campaigns. Hover to slow the reel down.",
    story: "New story",
    storyNote: "The player behind the work.",
    stats: [
      { n: "5+", l: "Years in the game" },
      { n: "3", l: "Markets · EG · KSA · KW" },
      { n: "~1,200", l: "Designers trained" },
      { n: "49", l: "Cohorts taught" },
    ],
    missionsDone: "Missions on this site",
    articlesDone: "Field notes written",
    fullProfile: "Full profile",
    available: "Available now",
    preorder: "Pre-order your project",
    platforms: ["Full-time", "Remote", "Freelance", "Hybrid"],
    hireLevel: "Hire level",
    cash: "Years",
  },
  ar: {
    start: "ابدأ المهمة",
    profile: "ملف اللاعب",
    tagline: "البريف وصل. وأنا جاهز.",
    reel: ["تصميم", "إخراج", "تسليم"],
    watch: "شغّل الريل",
    chooseA: "اختار",
    chooseB: "مهمتك",
    chooseNote: "كل قطاع لعبة مختلفة. اختار واحد وشوف المهمات اللي فيه.",
    missions: "مهمات",
    play: "العب المهمة",
    gameplay: "جيم بلاي",
    gameplayNote: "لقطات من الحملات. وقّف الماوس عليها عشان تبطّأ.",
    story: "القصة",
    storyNote: "اللاعب اللي ورا الشغل.",
    stats: [
      { n: "+٥", l: "سنين في اللعبة" },
      { n: "٣", l: "أسواق · مصر · السعودية · الكويت" },
      { n: "~١٢٠٠", l: "مصمم اتدرّب" },
      { n: "٤٩", l: "دفعة تدريبية" },
    ],
    missionsDone: "مهمة في الموقع",
    articlesDone: "مقال مكتوب",
    fullProfile: "الملف الكامل",
    available: "متاح الآن",
    preorder: "احجز مشروعك",
    platforms: ["دوام كامل", "عن بُعد", "فريلانس", "هجين"],
    hireLevel: "مستوى التوظيف",
    cash: "سنين",
  },
};

/* ------------------------------------------------------------------ HUD */
function Hud({ label, cash }: { label: string; cash: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);
  return (
    <div dir="ltr" className="gta-hud pointer-events-none select-none text-right font-[family-name:var(--font-gta)] uppercase leading-none">
      <p className="text-2xl text-white md:text-3xl">{time}</p>
      <p className="mt-1 text-2xl text-[#7dff8a] md:text-3xl">$5+ {cash}</p>
      <p className="mt-2 flex items-center justify-end gap-1 text-lg text-[#ffd34d] md:text-xl">
        <span className="me-1 font-sans text-[10px] font-bold tracking-[0.2em] text-white/80">{label}</span>
        {"★★★★★"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- console */
type Tile = { id: string; img: string; title: string; sub: string; href?: string };

function ConsoleHero() {
  const { t, lang } = useLang();
  const c = copy[lang];
  const tiles: Tile[] = useMemo(
    () => [
      { id: "me", img: "/me/gta-hero.webp", title: site.name, sub: "VI" },
      ...projects.map((p) => ({
        id: p.slug,
        img: p.hero || p.cover,
        title: (t.projects[p.slug]?.title ?? p.title).split(",")[0],
        sub: t.projects[p.slug]?.category ?? p.category,
        href: `/work/${p.slug}`,
      })),
    ],
    [t]
  );
  const [i, setI] = useState(0);
  const cur = tiles[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input,textarea")) return;
      if (e.key === "ArrowRight") setI((x) => (x + 1) % tiles.length);
      if (e.key === "ArrowLeft") setI((x) => (x - 1 + tiles.length) % tiles.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tiles.length]);

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-20">
      {/* background art, cross-faded per tile */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={cur.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease }}
          className="absolute inset-0"
        >
          <Media src={cur.img} alt="" fill priority sizes="100vw" className={`object-cover ${cur.id === "me" ? "object-[70%_center]" : "object-center"}`} />
        </motion.div>
      </AnimatePresence>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(26_11_46/0.85)_0%,rgb(26_11_46/0.05)_30%,rgb(26_11_46/0.15)_55%,rgb(26_11_46/0.95)_100%)]" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgb(26_11_46/0.7),transparent_55%)]" />

      {/* tile row, like a console home screen */}
      <div className="container-edge relative z-10 mx-auto w-full max-w-edge">
        <div className="flex items-start justify-between gap-6">
          <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-3 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tiles.map((tile, k) => {
              const on = k === i;
              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => setI(k)}
                  aria-label={tile.title}
                  aria-pressed={on}
                  className={`relative shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                    on
                      ? "h-20 w-20 border-white shadow-[0_0_0_3px_rgb(255_79_163),0_10px_30px_-8px_rgb(255_79_163)] md:h-24 md:w-24"
                      : "h-14 w-14 border-white/20 opacity-75 hover:opacity-100 md:h-16 md:w-16"
                  }`}
                >
                  <Media src={tile.img} alt="" fill sizes="96px" className="object-cover" />
                  {tile.id === "me" ? (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pb-1 text-center font-[family-name:var(--font-gta)] text-sm text-white">VI</span>
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="hidden shrink-0 pt-2 md:block">
            <Hud label={c.hireLevel} cash={c.cash} />
          </div>
        </div>
        <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-white/80">
          {cur.id === "me" ? `${site.name} · VI` : cur.title}
        </p>
      </div>

      {/* title lockup */}
      <div className="container-edge relative z-10 mx-auto mt-auto w-full max-w-edge pb-14 md:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={cur.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease }}
            className="max-w-2xl"
          >
            {cur.id === "me" ? (
              <h1 dir="ltr" className="gta-lockup font-[family-name:var(--font-gta)] uppercase leading-[0.84] text-white">
                <span className="block text-[17vw] md:text-[clamp(4.5rem,8vw,8.5rem)]">Mohamed</span>
                <span className="flex items-end gap-4 text-[17vw] md:text-[clamp(4.5rem,8vw,8.5rem)]">
                  Tarek
                  <span className="mb-[0.12em] rounded-lg border-[3px] border-white bg-[linear-gradient(135deg,#ff4fa3,#ff9a3c)] px-2 text-[0.42em] leading-[1.05] text-[#1a0b2e]">VI</span>
                </span>
              </h1>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#ffd34d]">{cur.sub}</p>
                <h1 className="gta-lockup mt-3 font-[family-name:var(--font-gta)] text-[13vw] uppercase leading-[0.9] text-white md:text-[clamp(3.5rem,6vw,6.5rem)]">
                  {cur.title}
                </h1>
              </>
            )}
            <p className="mt-5 max-w-md text-base text-white/85 md:text-lg">{cur.id === "me" ? c.tagline : t.projects[cur.id]?.tagline ?? projects.find((p) => p.slug === cur.id)?.tagline}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={cur.href ?? "#missions"}
                className="cta-blend inline-flex min-h-[48px] items-center gap-3 rounded-full px-7 text-sm uppercase tracking-[0.12em]"
              >
                <span aria-hidden>▶</span> {c.start}
              </Link>
              <Link
                href="/about"
                className="inline-flex min-h-[48px] items-center rounded-full border-2 border-white/80 bg-black/30 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md hover:bg-white hover:text-[#1a0b2e]"
              >
                {c.profile}
              </Link>
              <span className="hidden text-[11px] uppercase tracking-[0.2em] text-white/60 md:inline">← → to switch</span>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 md:hidden">
          <Hud label={c.hireLevel} cash={c.cash} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ reel strip */
function ReelStrip() {
  const { lang } = useLang();
  const c = copy[lang];
  const [open, setOpen] = useState(false);
  const clip = (motionClips as { src: string; poster: string; collection: string }[]).find((m) => m.collection === "landscape");
  const words = [...c.reel, ...c.reel, ...c.reel, ...c.reel];
  return (
    <section className="relative overflow-hidden bg-black py-14 md:py-20">
      <div className="-rotate-3 scale-110">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-[family-name:var(--font-gta)] text-[22vw] uppercase leading-none text-white md:text-[12rem]">
          {[...words, ...words].map((w, k) => (
            <span key={k} className={k % 2 ? "text-transparent [-webkit-text-stroke:2px_#ff4fa3]" : ""}>
              {w}
            </span>
          ))}
        </div>
      </div>
      {clip ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-[#1a0b2e] text-center font-[family-name:var(--font-gta)] text-xl uppercase leading-none text-white shadow-[6px_6px_0_#ff4fa3] transition-transform hover:scale-110 md:h-40 md:w-40 md:text-2xl"
        >
          <span>
            <span aria-hidden className="mb-1 block text-3xl">▶</span>
            {c.watch}
          </span>
        </button>
      ) : null}
      <AnimatePresence>
        {open && clip ? (
          <motion.div
            className="fixed inset-0 z-[95] grid place-items-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <video
              src={assetUrl(clip.src)}
              poster={assetUrl(clip.poster)}
              controls
              autoPlay
              playsInline
              className="max-h-full max-w-full rounded-xl border-2 border-white"
              onClick={(e) => e.stopPropagation()}
            />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border-2 border-white text-white">
              ✕
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

/* --------------------------------------------------------- mission select */
function MissionSelect() {
  const { t, lang } = useLang();
  const c = copy[lang];
  const sectorList = useMemo(() => Array.from(new Set(projects.map((p) => p.sector))), []);
  const [sel, setSel] = useState(sectorList[0]);
  const inSector = projects.filter((p) => p.sector === sel);

  return (
    <section id="missions" className="container-edge mx-auto max-w-edge scroll-mt-24 section-y">
      <div className="text-center">
        <h2 className="text-5xl text-white md:text-8xl">
          {c.chooseA} <span className="italic">{c.chooseB}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-bone-300">{c.chooseNote}</p>
      </div>

      {/* character-select cards: one per sector */}
      <div className="mt-12 flex snap-x gap-3 overflow-x-auto pb-6 [scrollbar-width:none] md:grid md:grid-cols-5 md:overflow-visible [&::-webkit-scrollbar]:hidden">
        {sectorList.map((s, k) => {
          const first = projects.find((p) => p.sector === s)!;
          const n = projects.filter((p) => p.sector === s).length;
          const on = s === sel;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSel(s)}
              aria-pressed={on}
              className={`gta-select group relative aspect-[3/4.3] w-[62vw] shrink-0 snap-center overflow-hidden text-start transition-all duration-500 sm:w-[40vw] md:w-auto ${
                on ? "md:-translate-y-3" : ""
              }`}
              style={{ clipPath: k % 2 ? "polygon(6% 0,100% 0,94% 100%,0 100%)" : "polygon(0 0,94% 0,100% 100%,6% 100%)" }}
            >
              <Media src={first.cover} alt="" fill sizes="(max-width:768px) 62vw, 20vw" className={`object-cover transition-transform duration-700 group-hover:scale-105 ${on ? "" : "grayscale-[60%]"}`} />
              <span className={`absolute inset-0 transition-opacity duration-500 ${on ? "bg-[linear-gradient(180deg,transparent_30%,rgb(255_79_163/0.85))]" : "bg-[linear-gradient(180deg,transparent_25%,rgb(10_4_20/0.95))]"}`} />
              <span className="absolute inset-x-0 bottom-0 p-5 text-center">
                <span className={`inline-block px-3 py-1 font-[family-name:var(--font-gta)] text-2xl uppercase leading-none text-white md:text-3xl ${on ? "bg-white/25" : "bg-black/55"}`}>
                  {t.work.sectors[s] ?? s}
                </span>
                <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                  {n} {c.missions}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* the missions in the selected sector */}
      <AnimatePresence mode="wait">
        <motion.ul
          key={sel}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {inSector.map((p) => {
            const tr = t.projects[p.slug] ?? {};
            return (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className="group flex h-full gap-4 rounded-2xl bg-ink-800 p-3 pe-4">
                  <span className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl">
                    <Media src={p.cover} alt="" fill sizes="96px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </span>
                  <span className="flex min-w-0 flex-col py-1">
                    <span className="font-[family-name:var(--font-gta)] text-sm uppercase tracking-wide text-[#ffd34d]">Mission {p.index}</span>
                    <span className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-white">{tr.title ?? p.title}</span>
                    <span className="mt-auto flex items-center gap-2 pt-2 text-xs font-bold uppercase tracking-[0.14em] text-mint">
                      ▶ {c.play}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </motion.ul>
      </AnimatePresence>
    </section>
  );
}

/* --------------------------------------------------------------- gameplay */
const boards = [4, 1, 2, 3, 9, 5, 6, 7, 8].map((n) => `/work/master/${String(n).padStart(2, "0")}.webp`);

function FilmRow({ imgs, reverse }: { imgs: string[]; reverse?: boolean }) {
  return (
    <div className={`gta-film overflow-hidden ${reverse ? "rotate-2" : "-rotate-2"}`}>
      <div className={`flex w-max gap-3 px-3 py-4 hover:[animation-play-state:paused] ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
        {[...imgs, ...imgs].map((src, k) => (
          <div key={src + k} className="relative h-40 w-[17rem] shrink-0 overflow-hidden rounded-sm border-2 border-black md:h-56 md:w-[24rem]">
            <Media src={src} alt="" fill sizes="384px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Gameplay() {
  const { lang } = useLang();
  const c = copy[lang];
  const shots = projects.flatMap((p) => p.gallery.slice(0, 2).map((g) => g.src)).slice(0, 12);
  return (
    <section className="overflow-hidden bg-black section-y">
      <div className="container-edge mx-auto max-w-edge text-center">
        <h2 className="text-6xl text-white md:text-9xl">{c.gameplay}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/70">{c.gameplayNote}</p>
      </div>
      <div className="mt-12 flex flex-col gap-6">
        <FilmRow imgs={boards} />
        <FilmRow imgs={shots} reverse />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ story */
function Story() {
  const { t, lang } = useLang();
  const c = copy[lang];
  return (
    <section className="container-edge mx-auto max-w-edge section-y">
      <div className="text-center">
        <h2 className="text-6xl text-white md:text-8xl">{c.story}</h2>
        <p className="mt-3 text-bone-300">{c.storyNote}</p>
      </div>
      <div className="mt-12 grid items-stretch gap-6 md:grid-cols-[1fr_1.2fr]">
        <div className="relative min-h-[420px] overflow-hidden border-[6px] border-[#5ee7ff] bg-[#5ee7ff] [clip-path:polygon(0_0,100%_0,90%_100%,0_100%)]">
          <Media src="/me/portrait-hero.webp" alt={site.name} fill sizes="(max-width:768px) 92vw, 40vw" className="object-cover" />
          <span className="absolute bottom-4 start-4 bg-black/70 px-3 py-1 font-[family-name:var(--font-gta)] text-2xl uppercase text-white">{site.name}</span>
        </div>
        <div className="flex flex-col justify-between border-[6px] border-[#ffd34d] bg-ink-800 p-6 md:p-10 md:[clip-path:polygon(8%_0,100%_0,100%_100%,0_100%)] md:ps-16">
          <p className="text-lg leading-relaxed text-bone-100">{t.about.heroBio}</p>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
            {[
              ...c.stats,
              { n: String(projects.length), l: c.missionsDone },
              { n: String(articles.length), l: c.articlesDone },
            ].map((s) => (
              <div key={s.l} className="border-s-4 border-[#ff4fa3] ps-3">
                <dt className="font-[family-name:var(--font-gta)] text-4xl leading-none text-white md:text-5xl" dir="ltr">{s.n}</dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-bone-300">{s.l}</dd>
              </div>
            ))}
          </dl>
          <Link href="/about" className="cta-blend mt-8 inline-flex min-h-[48px] w-fit items-center rounded-full px-7 text-sm uppercase tracking-[0.12em]">
            {c.fullProfile} →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- box art */
function BoxArt() {
  const { lang } = useLang();
  const c = copy[lang];
  return (
    <section id="hire" className="relative overflow-hidden bg-black section-y">
      <div className="container-edge mx-auto grid max-w-edge items-center gap-12 md:grid-cols-2">
        <div className="mx-auto w-full max-w-sm">
          <div className="gta-case relative aspect-[3/4] overflow-hidden rounded-md border-[10px] border-[#e9e2f2] bg-[#e9e2f2] shadow-[14px_14px_0_#ff4fa3]">
            <span className="absolute inset-x-0 top-0 z-10 bg-[#0b0614] py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-white">Portfolio · Edition VI</span>
            <Media src="/me/gta-hero.webp" alt="" fill sizes="384px" className="object-cover object-[75%_center]" />
            <span dir="ltr" className="gta-lockup absolute bottom-4 start-4 z-10 font-[family-name:var(--font-gta)] text-5xl uppercase leading-[0.85] text-white">
              Mohamed
              <br />
              Tarek <span className="rounded border-2 border-white px-1 text-2xl align-middle">VI</span>
            </span>
          </div>
        </div>
        <div className="text-center md:text-start">
          <p className="inline-flex items-center gap-2 bg-[#7dff8a] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#0b0614]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#0b0614]" />
            {c.available}
          </p>
          <h2 className="mt-5 text-6xl text-white md:text-8xl">{c.preorder}</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
            {c.platforms.map((p) => (
              <span key={p} className="rounded border-2 border-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
                {p}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <button type="button" onClick={openContact} className="cta-blend inline-flex min-h-[52px] items-center rounded-full px-8 text-sm uppercase tracking-[0.12em]">
              {c.preorder} →
            </button>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center rounded-full border-2 border-white px-7 text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-black"
            >
              WhatsApp ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function GtaHome() {
  return (
    <>
      <ConsoleHero />
      <ReelStrip />
      <MissionSelect />
      <Gameplay />
      {/* the films, under the game skin: they are the cutscenes */}
      <Motion />
      <Story />
      <BoxArt />
    </>
  );
}
