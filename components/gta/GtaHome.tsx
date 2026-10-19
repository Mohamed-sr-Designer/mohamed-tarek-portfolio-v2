"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { assetUrl } from "@/lib/assets";
import { useLang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";
import { articles } from "@/lib/articles";
import { openContact } from "@/components/ContactModal";
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
    kv: "Key visual",
    kvNote: "A campaign board from the work. Pick another below, or start a mission.",
    crewA: "The",
    crewB: "crew",
    crewNote: "Brands I have run missions with, across Egypt, Saudi Arabia and Kuwait.",
    typeA: "Type",
    typeB: "play",
    typeNote: "Custom Arabic and Latin lettering, run like footage. Hover to hold a frame.",
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
    kv: "صورة رئيسية",
    kvNote: "لوحة حملة من الشغل. اختار غيرها من تحت، أو ابدأ مهمة.",
    crewA: "",
    crewB: "الكرو",
    crewNote: "علامات نفّذت معاها مهمات في مصر والسعودية والكويت.",
    typeA: "لعب",
    typeB: "بالحروف",
    typeNote: "حروف عربية ولاتينية مخصّصة، معروضة زي لقطات فيلم. وقّف الماوس عليها عشان تثبت.",
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
// The hero is the edition's cover only: him, the lockup, the HUD.
function ConsoleHero() {
  const { lang } = useLang();
  const c = copy[lang];
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black pt-20">
      <div className="absolute inset-0">
        <Media src="/me/gta-hero.webp" alt="" fill priority sizes="100vw" className="object-cover object-[70%_center]" />
      </div>

      <div className="container-edge relative z-10 mx-auto flex w-full max-w-edge justify-end pt-2">
        <div className="hidden md:block">
          <Hud label={c.hireLevel} cash={c.cash} />
        </div>
      </div>

      {/* in Arabic the copy stays on the left too: he sits on the right of the art */}
      <div className="container-edge relative z-10 mx-auto mt-auto w-full max-w-edge pb-10 md:pb-14 rtl:text-left">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="max-w-2xl rtl:mr-auto">
          <h1 dir="ltr" className="gta-lockup font-[family-name:var(--font-gta)] uppercase leading-[0.84] text-white">
            <span className="block text-[17vw] md:text-[clamp(4.5rem,8vw,8.5rem)]">Mohamed</span>
            <span className="flex items-end gap-4 text-[17vw] md:text-[clamp(4.5rem,8vw,8.5rem)]">
              Tarek
              <span className="gta-vi mb-[0.12em] rounded-lg border-[3px] border-white bg-[linear-gradient(135deg,#ff4fa3,#ff9a3c)] px-2 text-[0.42em] leading-[1.05]">VI</span>
            </span>
          </h1>
          <p className="mt-4 max-w-md text-base font-medium text-white [text-shadow:0_2px_10px_rgb(0_0_0/0.85)] md:text-lg">{c.tagline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 rtl:justify-end">
            <Link href="#missions" className="cta-blend inline-flex min-h-[48px] items-center gap-3 rounded-full px-7 text-sm uppercase tracking-[0.12em]">
              <span aria-hidden>▶</span> {c.start}
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-[48px] items-center rounded-full border-2 border-white/85 bg-black/35 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md hover:bg-white hover:text-[#1a0b2e]"
            >
              {c.profile}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------- key visuals console */
// The wide campaign boards as a console home screen (the PS5 reference): the
// selected board fills the panel, a row of title tiles runs along the top
// with the current one enlarged and named under it, and the title and a Play
// button sit bottom-left. Play opens the board full size.
const boards = [4, 1, 2, 3, 9, 5, 6, 7, 8].map((n) => `/work/master/${String(n).padStart(2, "0")}.webp`);

function KvConsole() {
  const { lang, t } = useLang();
  const c = copy[lang];
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const name = (k: number) => `${c.kv} ${String(k + 1).padStart(2, "0")}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input,textarea")) return;
      if (e.key === "Escape") setOpen(false);
      const el = document.getElementById("key-visuals");
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return; // only while it is on screen
      if (e.key === "ArrowRight") setI((x) => (x + 1) % boards.length);
      if (e.key === "ArrowLeft") setI((x) => (x - 1 + boards.length) % boards.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="key-visuals" dir="ltr" className="relative overflow-hidden bg-black">
      <div className="container-edge mx-auto flex max-w-edge items-end gap-6 pb-5 pt-10 md:pt-14">
        <h2 className="text-5xl text-white md:text-7xl">{t.master.label}</h2>
        <span className="pb-1 text-lg font-semibold text-white/50 md:text-2xl">{lang === "ar" ? "الحملات" : "Campaigns"}</span>
      </div>
      <div className="relative aspect-[4/5] w-full sm:aspect-video md:max-h-[92svh] md:min-h-[620px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={boards[i]}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease }}
            className="absolute inset-0"
          >
            <Media src={boards[i]} alt={name(i)} fill sizes="100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>

      </div>

      {/* title + actions, under the art: the boards carry their own copy, so
          nothing is laid over them */}
      <div className="container-edge mx-auto flex max-w-edge flex-wrap items-center justify-between gap-5 py-6 md:py-8">
        <div>
          <AnimatePresence mode="wait">
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease }}
              className="gta-lockup font-[family-name:var(--font-gta)] text-4xl uppercase leading-none text-white md:text-6xl"
            >
              {name(i)}
            </motion.p>
          </AnimatePresence>
        </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-[#1a0b2e] shadow-lg transition-transform hover:scale-[1.04]"
            >
              {lang === "ar" ? "شغّل" : "Play"}
            </button>
            <button
              type="button"
              onClick={() => setI((x) => (x + 1) % boards.length)}
              aria-label={lang === "ar" ? "التالي" : "Next"}
              className="grid h-12 w-12 place-items-center rounded-full bg-black/45 text-xl font-bold text-white backdrop-blur-md hover:bg-black/65"
            >
              •••
            </button>
          </div>
      </div>

      {/* the picker: small wide thumbnails on the black, never over the art */}
      <div className="container-edge mx-auto max-w-edge pb-10 md:pb-14">
        <div className="flex items-end gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] md:gap-3 [&::-webkit-scrollbar]:hidden">
          {boards.map((src, k) => {
            const on = k === i;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setI(k)}
                aria-label={name(k)}
                aria-pressed={on}
                className={`relative aspect-video shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
                  on
                    ? "w-32 ring-[3px] ring-white ring-offset-2 ring-offset-black md:w-40"
                    : "w-24 opacity-55 hover:opacity-100 md:w-32"
                }`}
              >
                <Media src={src} alt="" fill sizes="160px" className="object-cover" />
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[95] grid place-items-center bg-black/92 p-3 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl(boards[i])} alt={name(i)} className="max-h-full max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border-2 border-white text-white">
              ✕
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------ the crew */
// The client logos, as the crew roster: two counter-running rows of logo
// badges on a tilted band, the way a game credits its gangs.
const logos = Array.from({ length: 36 }, (_, i) => `/logos/dark/${String(i + 1).padStart(2, "0")}.webp`);

function LogoRow({ list, reverse }: { list: string[]; reverse?: boolean }) {
  return (
    <div className="overflow-hidden">
      <div className={`flex w-max gap-4 py-2 hover:[animation-play-state:paused] ${reverse ? "animate-marquee-rev" : "animate-marquee"}`} style={{ animationDuration: "70s" }}>
        {[...list, ...list].map((src, k) => (
          <span key={src + k} className="relative grid h-20 w-40 shrink-0 place-items-center rounded-xl border-2 border-white/15 bg-white/[0.04] transition-colors duration-300 hover:border-[#ff4fa3] hover:bg-[#ff4fa3]/15 md:h-24 md:w-48">
            <span className="relative block h-10 w-28 md:h-12 md:w-32">
              <Media src={src} alt="Client logo" fill sizes="128px" className="object-contain" />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function CrewStrip() {
  const { lang } = useLang();
  const c = copy[lang];
  const half = Math.ceil(logos.length / 2);
  return (
    <section aria-label={c.crewNote} className="relative overflow-hidden bg-black py-16 md:py-24">
      <div className="container-edge mx-auto max-w-edge text-center">
        <h2 className="text-6xl text-white md:text-8xl">
          {c.crewA} <span className="italic">{c.crewB}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/70">{c.crewNote}</p>
      </div>
      <div className="mt-10 -rotate-2 scale-[1.04] border-y-4 border-[#ff4fa3] bg-[#120822] py-4">
        <LogoRow list={logos.slice(0, half)} />
        <LogoRow list={logos.slice(half)} reverse />
      </div>
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
        <h2 className="text-5xl text-bone-50 md:text-8xl">
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
                    <span className="font-[family-name:var(--font-gta)] text-sm uppercase tracking-wide text-electric">Mission {p.index}</span>
                    <span className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-bone-50">{tr.title ?? p.title}</span>
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

/* ----------------------------------------------------------- type play */
// The lettering pieces, framed as film footage: each piece sits on its own
// dark frame with sprocket holes running above and below.
const typePieces = Array.from({ length: 10 }, (_, i) => `/work/type/${String(i + 1).padStart(2, "0")}-dark.webp`);

function FilmRow({ imgs, reverse }: { imgs: string[]; reverse?: boolean }) {
  return (
    <div className={`gta-film overflow-hidden ${reverse ? "rotate-2" : "-rotate-2"}`}>
      <div className={`flex w-max gap-3 px-3 py-4 hover:[animation-play-state:paused] ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
        {[...imgs, ...imgs].map((src, k) => (
          <div key={src + k} className="relative h-28 w-[12rem] shrink-0 overflow-hidden rounded-sm border-2 border-black bg-[radial-gradient(circle_at_50%_40%,#2a1446,#0b0614)] md:h-36 md:w-[16rem]">
            <span className="absolute inset-4 md:inset-5">
              <Media src={src} alt="Lettering" fill sizes="384px" className="object-contain" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypePlay() {
  const { lang } = useLang();
  const c = copy[lang];
  const half = Math.ceil(typePieces.length / 2);
  return (
    <section id="type" className="overflow-hidden bg-black py-12 md:py-16">
      <div className="container-edge mx-auto max-w-edge text-center">
        <h2 className="text-5xl text-white md:text-7xl">
          {c.typeA} <span className="italic">{c.typeB}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/70">{c.typeNote}</p>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        <FilmRow imgs={typePieces.slice(0, half).concat(typePieces.slice(0, half))} />
        <FilmRow imgs={typePieces.slice(half).concat(typePieces.slice(half))} reverse />
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
        <h2 className="text-6xl text-bone-50 md:text-8xl">{c.story}</h2>
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
                <dt className="font-[family-name:var(--font-gta)] text-4xl leading-none text-bone-50 md:text-5xl" dir="ltr">{s.n}</dt>
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
              Tarek <span className="gta-vi rounded border-2 border-white bg-[linear-gradient(135deg,#ff4fa3,#ff9a3c)] px-1 align-middle text-2xl">VI</span>
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
      <CrewStrip />
      <KvConsole />
      <MissionSelect />
      <TypePlay />
      {/* the films, under the game skin: they are the cutscenes */}
      <Motion />
      <Story />
      <BoxArt />
    </>
  );
}
