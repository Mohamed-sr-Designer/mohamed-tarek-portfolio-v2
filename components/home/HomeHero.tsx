"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n";
import { assetUrl } from "@/lib/assets";
import Magnetic from "@/components/ui/Magnetic";

// The home opens on the work, not on a portrait: the statement on one side and
// a slow wall of real posts on the other. The statement names both halves of
// the practice, design for brands and the academy, because the two buttons
// under it lead to exactly those two places.

const ease = [0.16, 1, 0.3, 1] as const;

export const heroCopy = {
  en: {
    eyebrow: "Sr Graphic Designer & Team Lead",
    l1: "I build brands,",
    l2: "and the designers",
    l3: "behind them.",
    sub: "Campaigns, identities and social systems for brands across Egypt, Saudi Arabia and Kuwait. And an academy where I teach the same craft.",
    work: "See the work",
    academy: "Open the Academy",
    stats: [
      { n: "5+", l: "Years of practice" },
      { n: "3", l: "Markets" },
      { n: "80", l: "Brands designed for" },
      { n: "17", l: "LinkedIn recommendations" },
    ],
  },
  ar: {
    eyebrow: "مصمم جرافيك أول وقائد فريق",
    l1: "ببني براندات،",
    l2: "وببني المصممين",
    l3: "اللي وراها.",
    sub: "حملات وهويات وأنظمة سوشيال لعلامات في مصر والسعودية والكويت. وأكاديمية بعلّم فيها نفس الشغل.",
    work: "شوف الشغل",
    academy: "افتح الأكاديمية",
    stats: [
      { n: "+5", l: "سنين خبرة" },
      { n: "3", l: "أسواق" },
      { n: "80", l: "علامة اشتغلت معاها" },
      { n: "17", l: "توصية على لينكدإن" },
    ],
  },
};

// three columns of real posts, each a different mix of clients
const cols = [
  ["/work/social/amam/01.webp", "/work/social/gf/02.webp", "/work/tilal-social/03.webp", "/work/social/brand-vitals/01.webp", "/work/social/prepd/05.webp", "/work/social/the-nine/02.webp"],
  ["/work/social/prepd/01.webp", "/work/amam-re/02.webp", "/work/social/fresh-valley/11.webp", "/work/social/el-raghi/02.webp", "/work/social/gf/06.webp", "/work/social/hr-link/02.webp"],
  ["/work/tilal-social/01.webp", "/work/social/brand-vitals/02.webp", "/work/social/next-academy/06.webp", "/work/amam-re/01.webp", "/work/social/tilal-v/02.webp", "/work/social/el-raghi/01.webp"],
];

function Column({ items, dir, className = "" }: { items: string[]; dir: "up" | "down"; className?: string }) {
  // the list is doubled so the -50% slide loops without a seam
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`flex flex-col gap-3 ${dir === "up" ? "wall-up" : "wall-down"}`}>
        {[...items, ...items].map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={assetUrl(src)} alt="" loading={i < 3 ? "eager" : "lazy"} decoding="async" className="aspect-[4/5] w-full rounded-xl object-cover" />
        ))}
      </div>
    </div>
  );
}

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span className="block" initial={{ y: "115%" }} animate={{ y: 0 }} transition={{ duration: 1, ease, delay }}>
        {children}
      </motion.span>
    </span>
  );
}

export default function HomeHero() {
  const { lang } = useLang();
  const reduce = useReducedMotion();
  const c = heroCopy[lang];

  return (
    <section id="top" className="relative overflow-hidden pt-24 md:pt-28">
      <div className="container-edge mx-auto grid max-w-edge items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="pb-2 lg:py-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-bone-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            {c.eyebrow}
          </motion.p>

          <h1 className="mt-6 font-display text-[12.5vw] font-semibold leading-[0.98] tracking-[-0.035em] text-bone-50 sm:text-[9vw] lg:text-[clamp(3.4rem,5.6vw,6.2rem)]">
            <Line delay={0.25}>{c.l1}</Line>
            <Line delay={0.37}>{c.l2}</Line>
            <Line delay={0.49}>
              <span className="font-serif font-light italic text-mint">{c.l3}</span>
            </Line>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-bone-300 md:text-lg"
          >
            {c.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <a href="#cases" className="cta-blend group flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium">
                {c.work}
                <motion.span animate={reduce ? {} : { y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                  ↓
                </motion.span>
              </a>
            </Magnetic>
            <Magnetic>
              <a href={site.academy} className="cta-edge flex items-center gap-2 rounded-full px-6 py-3 text-sm text-bone-50">
                {c.academy} <span aria-hidden>↗</span>
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* the wall: three columns on desktop, two on phones, fading out at
            both ends so the motion never hits a hard edge */}
        <div
          aria-hidden
          className="grid h-[58vh] min-h-[420px] grid-cols-2 gap-3 [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)] sm:grid-cols-3 lg:h-[86vh] lg:max-h-[860px]"
        >
          <Column items={cols[0]} dir="up" />
          <Column items={cols[1]} dir="down" />
          <Column items={cols[2]} dir="up" className="hidden sm:block" />
        </div>
      </div>

      <dl className="container-edge mx-auto mt-10 grid max-w-edge grid-cols-2 border-y border-line/15 md:mt-14 md:grid-cols-4">
        {c.stats.map((s, i) => (
          <div key={s.l} className={`py-6 md:py-7 ${i % 2 ? "ps-5 border-s border-line/15" : ""} ${i > 1 ? "border-t border-line/15 md:border-t-0" : ""} ${i ? "md:ps-7 md:border-s md:border-line/15" : ""}`}>
            <dt dir="ltr" className="font-display text-4xl font-semibold tracking-tight text-bone-50 rtl:text-right md:text-5xl">{s.n}</dt>
            <dd className="mt-2 text-xs uppercase tracking-[0.16em] text-bone-400">{s.l}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
