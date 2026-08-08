"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n";
import { Media } from "@/components/ui/Media";
import Magnetic from "@/components/ui/Magnetic";
import GridField from "@/components/ui/GridField";

const ease = [0.16, 1, 0.3, 1] as const;

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.1em]">
      <motion.span
        className="block"
        initial={{ y: "115%", rotate: 2 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ duration: 1.1, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Magnetic>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="grid h-11 w-11 place-items-center rounded-full border border-line/20 text-bone-200 transition-colors hover:border-mint/60 hover:text-mint"
      >
        {children}
      </a>
    </Magnetic>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const { t } = useLang();

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-12 pt-24 md:pb-16 md:pt-32"
    >
      {/* backdrop: ambient glow, then grid paper + mouse-reactive squares */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          aria-hidden
          className="absolute left-[-8%] top-[-12%] h-[50vw] w-[50vw] rounded-full bg-mint/10 blur-[140px]"
          animate={reduce ? {} : { opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-900" />
      </div>
      <GridField />

      <div className="container-edge relative z-10 mx-auto w-full max-w-edge">
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex w-full items-center justify-between text-xs uppercase tracking-[0.28em] text-bone-400"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            {t.hero.avail}
          </span>
          <span className="hidden sm:block">{t.hero.portfolio}</span>
        </motion.div>

        <div className="mt-8 grid items-center gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-14">
          {/* Left, statement */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35 }}
              className="mb-6 text-sm text-bone-400 md:text-base"
            >
              {t.hero.intro}
            </motion.p>

            <h1 className="font-display text-[11vw] font-semibold leading-[0.98] tracking-[-0.03em] text-bone-50 sm:text-[8vw] lg:text-[4.3vw]">
              <Line delay={0.45}>{t.hero.l1}</Line>
              <Line delay={0.58}>{t.hero.l2}</Line>
              <Line delay={0.71}>
                {t.hero.l3pre}{" "}
                <span className="font-serif font-light italic text-mint">
                  {t.hero.l3accent}
                </span>
              </Line>
            </h1>

            {/* CTAs + socials + meta */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-10 flex flex-col gap-6"
            >
              <div className="flex flex-wrap items-center gap-4">
                <Magnetic>
                  <a
                    href="#work"
                    className="group flex items-center gap-3 rounded-full bg-bone-50 px-6 py-3 text-sm font-medium text-ink-900 transition-colors"
                  >
                    {t.hero.ctaPrimary}
                    <motion.span
                      animate={reduce ? {} : { y: [0, 4, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ↓
                    </motion.span>
                  </a>
                </Magnetic>
                <Magnetic>
                  <Link
                    href="/contact"
                    className="rounded-full border border-line/25 px-6 py-3 text-sm text-bone-50 transition-colors hover:border-mint/60 hover:text-mint"
                  >
                    {t.hero.ctaSecondary}
                  </Link>
                </Magnetic>
                <SocialIcon href={site.linkedin} label="LinkedIn">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-8.5c0-2.03-.04-4.64-2.83-4.64-2.83 0-3.27 2.2-3.27 4.5V24H8V8z" />
                  </svg>
                </SocialIcon>
                <SocialIcon
                  href={`https://wa.me/${site.whatsapp}`}
                  label="WhatsApp"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 .5C5.66.5.5 5.66.5 12c0 2.03.53 4.01 1.54 5.76L.5 23.5l5.9-1.51A11.44 11.44 0 0 0 12 23.5c6.34 0 11.5-5.16 11.5-11.5S18.34.5 12 .5zm0 21a9.44 9.44 0 0 1-4.82-1.32l-.35-.2-3.5.9.93-3.41-.23-.36A9.43 9.43 0 0 1 2.5 12 9.5 9.5 0 1 1 12 21.5zm5.21-7.11c-.29-.14-1.69-.83-1.95-.93-.26-.1-.45-.14-.64.15-.19.28-.74.92-.9 1.11-.17.19-.33.21-.62.07-.28-.14-1.2-.44-2.28-1.41a8.54 8.54 0 0 1-1.58-1.96c-.17-.29-.02-.44.12-.58.13-.13.29-.33.43-.5.14-.17.19-.29.28-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.28-1 .98-1 2.39s1.02 2.77 1.17 2.96c.14.19 2.01 3.07 4.88 4.3.68.3 1.21.47 1.63.6.68.22 1.3.19 1.79.12.55-.08 1.69-.69 1.93-1.36.24-.66.24-1.23.17-1.35-.07-.12-.26-.19-.55-.33z" />
                  </svg>
                </SocialIcon>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-bone-400">
                {t.hero.markets}
              </p>
            </motion.div>
          </div>

          {/* Right, portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease, delay: 0.5 }}
            className="order-1 lg:order-2 lg:col-span-5"
          >
            <div className="relative mx-auto max-w-[15rem] sm:max-w-[19rem] lg:max-w-none">
              <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-mint/25 via-transparent to-electric/25 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.6rem] border border-line/15 bg-ink-700 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]">
                <Media
                  src="/me/portrait-hero.webp"
                  alt="Mohamed Tarek, Sr Designer, Team Lead"
                  sizes="(max-width: 1024px) 80vw, 34vw"
                  className="h-auto w-full"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold leading-tight text-white">
                      {site.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      {t.hero.chipRole}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[0.65rem] uppercase tracking-widest text-white backdrop-blur-md">
                    {t.hero.chipBadge}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
