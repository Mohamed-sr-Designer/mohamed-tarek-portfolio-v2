"use client";

import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";
import { assetUrl } from "@/lib/assets";
import { openContact } from "@/components/ContactModal";

// The Minimal edition home: black ink on paper. Huge italic serif headlines that
// end on a full stop, small tracked labels, hairline rules, photographs in
// black and white until you hover them, and one solid ink band to close.
// Everything here is the real portfolio; only the voice of the layout changes.

const copy = {
  en: {
    name: "Mohamed Tarek",
    role: "Sr Designer · Team Lead",
    h1a: "Think in brands.",
    h1b: "Design in systems.",
    sub: "Brand identity, campaigns and social systems for companies across Egypt, Saudi Arabia and Kuwait.",
    stats: [
      { n: "5+", l: "Years of practice" },
      { n: "~1,200", l: "Designers trained" },
      { n: "49", l: "Cohorts taught" },
      { n: "3", l: "Markets" },
    ],
    visualsLabel: "Key visuals",
    visualsA: "One idea.",
    visualsB: "One frame.",
    visualsNote: "Photo manipulation for food, retail and campaign brands.",
    behance: "More on Behance",
    behind: "Behind the work",
    first: "Mohamed",
    last: "Tarek.",
    practiceList: "What I do",
    partnersLabel: "Brands & collaborations",
    partnersA: "Worked",
    partnersB: "with.",
    workLabel: "Selected work",
    workA: "The work,",
    workB: "by industry.",
    workNote: "Open any case for the full story.",
    practiceLabel: "My practice",
    practiceA: "Direct. Design.",
    practiceB: "Teach.",
    cards: [
      { k: "The lead", t: "Direct.", d: "Set the idea, the standard and the team behind it." },
      { k: "The craft", t: "Design.", d: "Identities, key visuals and social systems that scale." },
      { k: "The next generation", t: "Teach.", d: "~1,200 designers trained across four academies." },
    ],
    closeLabel: "Have something in mind?",
    closeA: "Let's make it",
    closeB: "clear.",
    contact: "Let's talk",
    elsewhere: "Elsewhere",
    start: "Start a project",
    read: "Read the articles",
  },
  ar: {
    name: "محمد طارق",
    role: "مصمم أول · قائد فريق",
    h1a: "فكّر كعلامة.",
    h1b: "صمّم كنظام.",
    sub: "هويات بصرية وحملات وأنظمة سوشيال لشركات في مصر والسعودية والكويت.",
    stats: [
      { n: "+٥", l: "سنين خبرة" },
      { n: "~١٢٠٠", l: "مصمم اتدرّب" },
      { n: "٤٩", l: "دفعة تدريبية" },
      { n: "٣", l: "أسواق" },
    ],
    visualsLabel: "كي فيجوال",
    visualsA: "فكرة واحدة.",
    visualsB: "كادر واحد.",
    visualsNote: "فوتو مانيبوليشن لعلامات أكل وتجزئة وحملات.",
    behance: "المزيد على Behance",
    behind: "ورا الشغل",
    first: "محمد",
    last: "طارق.",
    practiceList: "بعمل إيه",
    partnersLabel: "علامات وتعاونات",
    partnersA: "اشتغلت",
    partnersB: "معاهم.",
    workLabel: "أعمال مختارة",
    workA: "الشغل،",
    workB: "حسب القطاع.",
    workNote: "افتح أي مشروع للقصة الكاملة.",
    practiceLabel: "طريقة شغلي",
    practiceA: "أخرج. أصمّم.",
    practiceB: "أعلّم.",
    cards: [
      { k: "القيادة", t: "أخرج.", d: "أحدد الفكرة والمعيار والفريق اللي وراهم." },
      { k: "الحِرفة", t: "أصمّم.", d: "هويات وكي فيجوال وأنظمة سوشيال بتكبر مع العلامة." },
      { k: "الجيل الجاي", t: "أعلّم.", d: "حوالي ١٢٠٠ مصمم اتدرّبوا في أربع أكاديميات." },
    ],
    closeLabel: "عندك فكرة؟",
    closeA: "خلّينا نخلّيها",
    closeB: "واضحة.",
    contact: "تواصل",
    elsewhere: "في أماكن تانية",
    start: "ابدأ مشروع",
    read: "اقرأ المقالات",
  },
};

// Key visuals picked from behance.net/mohmedrk, shown in full colour: in this
// edition they are the only colour on the page
const wide = [
  { src: "/work/behance/burger.webp", t: "Burger", k: "Food" },
  { src: "/work/behance/cabin.webp", t: "The cabin", k: "Matte painting" },
];
const squares = [
  { src: "/work/behance/inferno.webp", t: "Inferno", k: "Key visual" },
  { src: "/work/behance/tiger-sea.webp", t: "Tiger chips", k: "Packaging" },
  { src: "/work/behance/albayt.webp", t: "Albayt", k: "Campaign" },
  { src: "/work/behance/italiano.webp", t: "Italiano", k: "Food" },
  { src: "/work/behance/alrahden.webp", t: "Alrahden", k: "Retail" },
  { src: "/work/behance/medlab.webp", t: "Medlab", k: "Healthcare" },
  { src: "/work/behance/ebtl.webp", t: "Ebtl", k: "Retail" },
  { src: "/work/behance/tiger-field.webp", t: "Tiger chips", k: "Packaging" },
];

function Visual({ src, t, k, ratio }: { src: string; t: string; k: string; ratio: string }) {
  return (
    <figure className="min-color">
      <div className={`overflow-hidden bg-ink-800 ${ratio}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assetUrl(src)} alt={t} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-3 text-[11px] uppercase tracking-[0.16em]">
        <span className="font-semibold">{t}</span>
        <span className="opacity-70">{k}</span>
      </figcaption>
    </figure>
  );
}

const logos = Array.from({ length: 36 }, (_, i) => `/logos/dark/${String(i + 1).padStart(2, "0")}.webp`);
// 07 and 09 carry a keyline or a solid extrude, which a mask fills into a
// blob, so they sit out
const marks = [1, 2, 3, 4, 5, 6, 8, 10].map((n) => `/work/type/${String(n).padStart(2, "0")}-dark.webp`);

// White-on-alpha artwork printed in the ink: the file is used as a mask and
// the ink fills it, so lettering and logos read as one colour, like the rest.
function InkMark({ src, className }: { src: string; className: string }) {
  const url = `url(${assetUrl(src)})`;
  return (
    <span
      aria-hidden
      className={`min-mask block bg-mint ${className}`}
      style={{ WebkitMaskImage: url, maskImage: url }}
    />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-mint">{children}</p>;
}

export default function MinimalHome() {
  const { t, lang } = useLang();
  const c = copy[lang];

  return (
    <div className="min-home text-mint">
      {/* ---------------------------------------------------------- hero */}
      <section id="top" className="container-edge mx-auto max-w-edge pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="flex items-center justify-between gap-4">
          <Label>{c.name}</Label>
          <Label>{c.role}</Label>
        </div>
        <h1 className="min-display mt-14 md:mt-20">
          <span className="block">{c.h1a}</span>
          <span className="block">{c.h1b}</span>
        </h1>
        <p className="mt-8 max-w-md text-[15px] leading-relaxed">{c.sub}</p>

        <dl className="mt-16 grid grid-cols-2 border-t border-line/20 md:grid-cols-4">
          {c.stats.map((s, k) => (
            <div key={s.l} className={`py-6 ${k % 2 ? "ps-6" : ""} md:ps-6 ${k ? "md:border-s md:border-line/20" : "md:ps-0"} ${k % 2 ? "border-s border-line/20 md:border-s" : ""}`}>
              <dt dir="ltr" className="min-serif text-5xl leading-none md:text-6xl rtl:text-right">{s.n}</dt>
              <dd className="mt-3 text-[11px] uppercase tracking-[0.18em]">{s.l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* --------------------------------------------------- key visuals */}
      <section className="container-edge mx-auto max-w-edge pb-20 md:pb-28">
        <div className="flex flex-col gap-6 border-t border-line/20 pt-14 md:flex-row md:items-end md:justify-between">
          <div>
            <Label>{c.visualsLabel}</Label>
            <h2 className="min-display mt-6">
              <span className="block">{c.visualsA}</span>
              <span className="block">{c.visualsB}</span>
            </h2>
          </div>
          <div className="max-w-[16rem] text-[11px] uppercase tracking-[0.18em]">
            <p>{c.visualsNote}</p>
            <a href="https://www.behance.net/mohmedrk" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold underline underline-offset-4">
              {c.behance} ↗
            </a>
          </div>
        </div>
        <div className="mt-14 grid gap-x-6 gap-y-10 md:grid-cols-2">
          {wide.map((v) => (
            <Visual key={v.src} {...v} ratio="aspect-[3/2]" />
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {squares.map((v) => (
            <Visual key={v.src} {...v} ratio="aspect-square" />
          ))}
        </div>
      </section>

      {/* ------------------------------------------- the lettering, in ink */}
      <section aria-hidden className="border-y border-line/15 py-10 md:py-14">
        <div className="container-edge mx-auto grid max-w-edge grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-4 md:gap-x-16">
          {marks.map((m) => (
            <InkMark key={m} src={m} className="mx-auto aspect-[2/1] w-full max-w-[15rem]" />
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- about */}
      <section className="container-edge mx-auto grid max-w-edge gap-12 py-20 md:grid-cols-2 md:py-28">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Media src="/me/portrait-hero.webp" alt={site.name} fill sizes="(max-width:768px) 92vw, 45vw" className="min-photo object-cover" />
          </div>
        </Reveal>
        <div className="flex flex-col">
          <Label>{c.behind}</Label>
          <h2 className="min-display mt-6">
            <span className="block">{c.first}</span>
            <span className="block">{c.last}</span>
          </h2>
          <p className="mt-8 max-w-lg text-lg leading-relaxed">{t.about.heroBio}</p>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed opacity-80">{t.about.bio1}</p>
          <div className="mt-10">
            <Label>{c.practiceList}</Label>
            <ul className="mt-4 border-t border-line/20">
              {t.services.items.map((s) => (
                <li key={s.title} className="flex items-center justify-between gap-4 border-b border-line/20 py-3 text-sm">
                  <span className="font-medium">{s.title}</span>
                  <span className="text-[11px] uppercase tracking-[0.14em] opacity-70">{s.tags[0]}</span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-5 inline-block text-[11px] uppercase tracking-[0.2em] underline-offset-4 hover:underline">
              {lang === "ar" ? "الملف الكامل ←" : "Full profile →"}
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ partners */}
      <section className="bg-ink-800 py-20 md:py-28">
        <div className="container-edge mx-auto max-w-edge">
          <Label>{c.partnersLabel}</Label>
          <h2 className="min-display mt-6">
            <span className="block">{c.partnersA}</span>
            <span className="block">{c.partnersB}</span>
          </h2>
          <div className="mt-14 grid grid-cols-3 gap-x-6 gap-y-12 border-t border-line/20 pt-12 sm:grid-cols-4 lg:grid-cols-6">
            {logos.map((l) => (
              <InkMark key={l} src={l} className="mx-auto aspect-[2/1] w-full max-w-[9rem]" />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- work */}
      <section id="work" className="container-edge mx-auto max-w-edge py-20 md:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Label>{c.workLabel}</Label>
            <h2 className="min-display mt-6">
              <span className="block">{c.workA}</span>
              <span className="block">{c.workB}</span>
            </h2>
          </div>
          <p className="max-w-[14rem] text-[11px] uppercase tracking-[0.18em]">{c.workNote}</p>
        </div>

        <ul className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2">
          {projects.map((p, k) => {
            const tr = t.projects[p.slug] ?? {};
            return (
              <li key={p.slug} className={k % 2 ? "md:mt-24" : ""}>
                <Link href={`/work/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
                    <Media src={p.hero || p.cover} alt={tr.title ?? p.title} fill sizes="(max-width:768px) 92vw, 45vw" className="min-photo object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">{p.client.split(" · ")[0]}</h3>
                    <span className="mt-2 shrink-0 text-[11px] uppercase tracking-[0.14em]">{tr.category ?? p.category}</span>
                  </div>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed opacity-80">{tr.tagline ?? p.tagline}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ------------------------------------------------------ practice */}
      <section className="container-edge mx-auto max-w-edge pb-24 md:pb-32">
        <div className="grid gap-8 md:grid-cols-[1fr_3fr]">
          <Label>{c.practiceLabel}</Label>
          <h2 className="min-display">
            <span className="block">{c.practiceA}</span>
            <span className="block">{c.practiceB}</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3 md:items-start">
          {c.cards.map((card, k) => {
            const solid = k === 1;
            return (
              <div
                key={card.t}
                className={`flex min-h-[18rem] flex-col p-7 ${k === 1 ? "md:mt-10" : k === 2 ? "md:mt-20" : ""} ${solid ? "bg-mint text-ink-900" : "bg-ink-800"}`}
              >
                <span aria-hidden className="min-glyph" data-k={k} />
                <p className="mt-auto pt-10 text-[11px] uppercase tracking-[0.2em]">{card.k}</p>
                <p className="min-serif mt-2 text-5xl leading-none">{card.t}</p>
                <p className="mt-3 text-sm">{card.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------- close, in ink */}
      <section id="hire" className="bg-mint py-20 text-ink-900 md:py-28">
        <div className="container-edge mx-auto max-w-edge">
          <p className="text-[11px] uppercase tracking-[0.22em]">{c.closeLabel}</p>
          <h2 className="min-display mt-8 !text-ink-900">
            <span className="block">{c.closeA}</span>
            <span className="block">{c.closeB}</span>
          </h2>
          <div className="mt-16 grid gap-10 border-t border-ink-900/30 pt-10 md:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em]">{site.name}</p>
              <p className="mt-3 text-sm">{site.role}</p>
              <p className="text-sm">{lang === "ar" ? "مصر · السعودية · الكويت" : "Egypt · Saudi Arabia · Kuwait"}</p>
              <button type="button" onClick={openContact} className="mt-6 inline-flex min-h-[44px] items-center border border-ink-900 px-5 text-[11px] uppercase tracking-[0.2em] hover:bg-ink-900 hover:text-mint">
                {c.start} →
              </button>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em]">{c.contact}</p>
              <a dir="ltr" href={`tel:${site.phone}`} className="mt-3 block text-2xl rtl:text-right">{site.phoneDisplay}</a>
              <a dir="ltr" href={`mailto:${site.email}`} className="mt-1 block break-all text-sm underline-offset-4 hover:underline rtl:text-right">{site.email}</a>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[11px] uppercase tracking-[0.2em] underline-offset-4 hover:underline">WhatsApp ↗</a>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em]">{c.elsewhere}</p>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="min-serif mt-3 flex items-center justify-between border-b border-ink-900/30 py-3 text-2xl">
                LinkedIn <span className="font-sans text-base">↗</span>
              </a>
              <Link href="/articles" className="min-serif flex items-center justify-between border-b border-ink-900/30 py-3 text-2xl">
                {c.read} <span className="font-sans text-base">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
