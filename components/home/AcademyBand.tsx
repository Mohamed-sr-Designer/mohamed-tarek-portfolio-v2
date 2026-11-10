"use client";

import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { withBase } from "@/lib/base";

// The other half of the practice. The band borrows the academy's own violet
// so it reads as a door into a different room, not one more portfolio section.

const copy = {
  en: {
    label: "The Academy",
    a: "I teach",
    i: "what I ship",
    b: ".",
    body: "The same workflow behind this portfolio, taught step by step. Photoshop and Illustrator are complete courses, free. The AI production tracks go deeper.",
    cta: "Enter the Academy",
    free: "Start free",
    tracks: [
      { k: "ps", t: "Adobe Photoshop", s: "Free, full course" },
      { k: "ai", t: "AI Production", s: "Photo and video tracks" },
      { k: "ae", t: "After Effects", s: "Coming soon" },
      { k: "pr", t: "Premiere Pro", s: "Coming soon" },
    ],
  },
  ar: {
    label: "الأكاديمية",
    a: "بعلّم",
    i: "اللي بشتغله",
    b: ".",
    body: "نفس طريقة الشغل اللي ورا البورتفوليو ده، خطوة بخطوة. فوتوشوب وإليستريتور كورسات كاملة ومجانية. ومسارات الإنتاج بالـ AI بتدخل أعمق.",
    cta: "ادخل الأكاديمية",
    free: "ابدأ مجانًا",
    tracks: [
      { k: "ps", t: "Adobe Photoshop", s: "كورس كامل ومجاني" },
      { k: "ai", t: "AI Production", s: "مسار صور ومسار فيديو" },
      { k: "ae", t: "After Effects", s: "قريبًا" },
      { k: "pr", t: "Premiere Pro", s: "قريبًا" },
    ],
  },
};

export default function AcademyBand() {
  const { lang } = useLang();
  const c = copy[lang];
  return (
    <section id="academy" className="container-edge mx-auto max-w-edge py-24 md:py-32">
      <div className="academy-band overflow-hidden rounded-[2rem] p-7 md:p-14">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F0ABFC]">{c.label}</p>
            <h2 className="mt-6 font-display text-5xl font-semibold leading-[1] tracking-[-0.03em] text-white md:text-7xl">
              {c.a} <span className="font-serif font-light italic text-[#F0ABFC]">{c.i}</span>
              {c.b}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/80">{c.body}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={site.academy} className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#1B0B2E] transition-transform duration-300 hover:-translate-y-0.5">
                {c.cta} <span aria-hidden>↗</span>
              </a>
              <a href={`${site.academy}courses/`} className="inline-flex min-h-[48px] items-center rounded-full border border-white/40 px-6 text-sm font-medium text-white transition-colors hover:border-white">
                {c.free}
              </a>
            </div>
          </Reveal>

          <ul className="grid grid-cols-2 gap-3 md:gap-4">
            {c.tracks.map((t, k) => (
              <li key={t.k}>
                <Reveal delay={0.06 * k}>
                  <a href={`${site.academy}courses/`} className="group block overflow-hidden rounded-2xl bg-black/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={withBase(`/academy/${t.k}.webp`)} alt="" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]" />
                    <span className="block p-4">
                      <b dir="ltr" className="block text-base font-semibold text-white rtl:text-right">{t.t}</b>
                      <span className="mt-1 block text-xs text-white/70">{t.s}</span>
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
