"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n";
import { Media } from "@/components/ui/Media";
import Magnetic from "@/components/ui/Magnetic";
import { useContent } from "@/lib/content";

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
        className="grid h-11 w-11 place-items-center rounded-full border border-line/25 text-bone-200 transition-colors hover:border-mint/60 hover:text-mint md:border-white/30 md:text-white/90 md:hover:border-mint md:hover:text-mint"
      >
        {children}
      </a>
    </Magnetic>
  );
}

// The hero is one full-bleed frame now: the night shoot runs edge to edge and
// the copy is cut back to the line, the availability and two actions.
//
// From `md` up the copy is overlaid in the lower left -- wet tarmac and
// forecourt, no subject -- with the scrim raking in from that corner only. The
// column is measured against where he stands rather than set by eye; see the
// note on it below.
//
// Phones do not overlay at all. A 16:9 frame cropped into a portrait viewport
// puts him head-to-foot in the middle of the screen with nowhere clear to put
// text, and small type over a busy photograph is a poor read regardless. There
// the banner is a block and the copy sits under it on the page.
export default function Hero() {
  const reduce = useReducedMotion();
  const { t } = useLang();
  const { gta } = useContent();

  return (
    <section
      id="top"
      // On phones the banner is a block, so it must start below the fixed
      // header rather than under it -- the bar was clipping the top of his head.
      // From md up the header deliberately floats over the frame.
      className="relative overflow-hidden pt-20 md:flex md:min-h-[94svh] md:flex-col md:justify-end md:pt-0"
    >
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] md:absolute md:inset-0 md:aspect-auto">
        <Media
          key={gta ? "gta" : "std"}
          src={gta ? "/me/gta-hero.webp" : "/me/hero-cairo.webp"}
          alt={`${site.name} — ${site.role}`}
          fill
          priority
          sizes="100vw"
          // both covers put him on the right third, so phones crop toward him
          className="object-cover object-[72%_center] md:object-center"
        />
        {/* Overlay scrim, md and up only -- on phones the copy is off the photo
            and a scrim would just dim it for nothing. */}
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-gradient-to-tr from-black/85 via-black/35 to-transparent md:block"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 hidden h-24 bg-gradient-to-t from-ink-900 to-transparent md:block"
        />
      </div>

      <div className="container-edge relative z-10 mx-auto w-full max-w-edge pb-4 pt-10 md:pb-20 md:pt-44">
        {/* The measure has to grow with the type or the type outruns it. At
            3.7vw unbounded the headline hit 67px on a 1815px screen while this
            column stayed pinned at max-w-lg, so each of the three lines
            rendered 516px wide inside a 512px box and broke in half -- six
            lines instead of three, 419px of headline. Zooming to 150% shrank
            the CSS viewport enough to make it fit again, which is what made
            zooming look like the fix.

            So the size is capped at 4rem and the column steps up with the
            breakpoints instead of sitting at one width. Measured: the longest
            line needs about nine times the font size, and the column is sized
            to clear that at every step.

            The ceiling on the column is where he stands, not taste. He is at
            roughly 60% across the frame, and object-cover crops differently at
            each width -- about 507px in from the left at md, about 1100px at
            1815 -- so the column can afford to grow, but only at the same
            pace. The wider banner bought room here: he used to be dead
            centre. */}
        {/* In Arabic this block is pinned left rather than following the
            page direction. A max-width block sits at the inline-start, which in
            RTL is the right -- straight over him in the photograph, which is the
            one place the copy must never go. mr-auto pushes it back to the left
            and text-left sets each line flush to that edge, so the column reads
            exactly like the English one. The words themselves are untouched:
            direction stays RTL, so the Arabic still runs right to left inside
            each line. */}
        <div className="max-w-lg rtl:mr-auto rtl:text-left md:max-w-[26rem] lg:max-w-lg xl:max-w-xl 2xl:max-w-[40rem]">
          {/* GTA VI Edition: a cover-art lockup of the name above the line */}
          {gta ? (
            <p aria-hidden className="gta-lockup mb-4 font-[family-name:var(--font-gta)] uppercase leading-[0.86] text-white">
              <span className="block text-[13vw] md:text-[clamp(3.5rem,6vw,6.5rem)]">Mohamed</span>
              <span className="block text-[13vw] md:text-[clamp(3.5rem,6vw,6.5rem)]">Tarek</span>
              <span className="mt-2 inline-block rounded-md border-2 border-white px-2 text-[7vw] leading-none md:text-[clamp(1.6rem,2.6vw,2.8rem)]">VI</span>
            </p>
          ) : null}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-bone-400 rtl:flex-row-reverse sm:text-xs sm:tracking-[0.28em] md:text-white/75"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-70 md:bg-white" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint md:bg-white" />
            </span>
            {t.hero.avail}
          </motion.p>

          <h1 className="mt-5 font-display text-[8.4vw] font-semibold leading-[1.02] tracking-[-0.03em] text-bone-50 sm:text-[6vw] sm:leading-[0.98] md:mt-7 md:text-[clamp(2.6rem,3.6vw,4rem)] md:text-white md:[text-shadow:0_2px_34px_rgb(0_0_0/0.55)]">
            <Line delay={0.35}>{t.hero.l1}</Line>
            <Line delay={0.48}>{t.hero.l2}</Line>
            <Line delay={0.61}>
              {t.hero.l3pre}{" "}
              <span className="font-serif font-light italic text-mint md:text-mint-lift">
                {t.hero.l3accent}
              </span>
            </Line>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-8 flex flex-wrap items-center gap-4 rtl:flex-row-reverse md:mt-10"
          >
            <Magnetic>
              <a
                href="#work"
                className="cta-blend group flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium"
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
                className="cta-edge rounded-full px-6 py-3 text-sm text-bone-50"
              >
                {t.hero.ctaSecondary}
              </Link>
            </Magnetic>
            <SocialIcon href={site.linkedin} label="LinkedIn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-8.5c0-2.03-.04-4.64-2.83-4.64-2.83 0-3.27 2.2-3.27 4.5V24H8V8z" />
              </svg>
            </SocialIcon>
            <SocialIcon href={`https://wa.me/${site.whatsapp}`} label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 .5C5.66.5.5 5.66.5 12c0 2.03.53 4.01 1.54 5.76L.5 23.5l5.9-1.51A11.44 11.44 0 0 0 12 23.5c6.34 0 11.5-5.16 11.5-11.5S18.34.5 12 .5zm0 21a9.44 9.44 0 0 1-4.82-1.32l-.35-.2-3.5.9.93-3.41-.23-.36A9.43 9.43 0 0 1 2.5 12 9.5 9.5 0 1 1 12 21.5zm5.21-7.11c-.29-.14-1.69-.83-1.95-.93-.26-.1-.45-.14-.64.15-.19.28-.74.92-.9 1.11-.17.19-.33.21-.62.07-.28-.14-1.2-.44-2.28-1.41a8.54 8.54 0 0 1-1.58-1.96c-.17-.29-.02-.44.12-.58.13-.13.29-.33.43-.5.14-.17.19-.29.28-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.28-1 .98-1 2.39s1.02 2.77 1.17 2.96c.14.19 2.01 3.07 4.88 4.3.68.3 1.21.47 1.63.6.68.22 1.3.19 1.79.12.55-.08 1.69-.69 1.93-1.36.24-.66.24-1.23.17-1.35-.07-.12-.26-.19-.55-.33z" />
              </svg>
            </SocialIcon>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
