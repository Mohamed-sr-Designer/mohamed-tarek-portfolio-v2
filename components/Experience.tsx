"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Toggle } from "@/components/ui/Toggle";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";

type Role = { title: string; period: string };
type Job = {
  company: string;
  type: string;
  period: string;
  place: string;
  current?: boolean;
  returned?: boolean; // came back to the same company in a bigger role
  note: string;
  logo?: string;
  roles?: Role[]; // ladder within one company, newest first
  role?: string; // single role
};

// Verified work history, newest to oldest (provided by Mohamed).
// Osolutions appears twice on purpose: once at the top for the return as Art
// Team Lead, and again lower down for the first stint and its three
// promotions. One combined card hid the fact that he left and was brought
// back to lead.
const jobs: Job[] = [
  {
    company: "Osolutions",
    logo: "/orgs/osolutions.webp",
    role: "Team Lead",
    type: "Full-time · On-site",
    period: "May 2026 — Present",
    place: "Cairo, Egypt",
    current: true,
    returned: true,
    note: "Returned to lead the art team: mentoring designers to a high creative standard, turning business requirements into visual solutions with cross-functional teams, reviewing work for brand consistency, and planning workloads and creative workflows so the team keeps developing.",
  },
  {
    company: "JUMPPEAK",
    logo: "/orgs/jumppeak.webp",
    role: "Senior Graphic Designer, Team Lead",
    type: "Full-time",
    period: "Mar 2026 — May 2026",
    place: "Al Jizah, Egypt",
    note: "Built on-brand graphics for websites, apps and social; worked with the art director to keep brand visuals consistent across platforms; led junior and mid-level designers on assets optimised for multimedia.",
  },
  {
    company: "Prepd",
    logo: "/orgs/prepd.webp",
    role: "Senior Graphic Designer",
    type: "Part-time · Remote",
    period: "Nov 2025 — Jul 2026",
    place: "Makkah, Saudi Arabia",
    note: "High-impact marketing materials that lifted Prepd's brand visibility, plus digital interfaces built for a better experience. Partnered with cross-functional teams on consistent messaging across every touchpoint, positioning the brand as premium and memorable.",
  },
  {
    company: "Bundle IMS",
    logo: "/orgs/bundle.webp",
    role: "Senior Graphic Designer, Visual Designer",
    type: "Full-time · On-site",
    period: "Aug 2025 — Mar 2026",
    place: "Giza, Egypt",
    note: "Worked with the art director on an automotive campaign, running BTL activity from concept to execution: brand activation and event management, graphic design and visual communication, creative direction support and marketing collateral.",
  },
  {
    company: "Teaching Planet Academy",
    logo: "/orgs/teaching.webp",
    type: "Part-time · Hybrid",
    period: "May 2022 — Dec 2025",
    place: "Giza, Egypt",
    note: "Designed marketing materials and digital interfaces, then taught the craft: Photoshop, Illustrator and InDesign across twelve-session cohorts, with hands-on projects and assignments.",
    roles: [
      { title: "Senior Graphic Designer", period: "Jan 2025 — Dec 2025" },
      { title: "Graphic Design Instructor", period: "May 2022 — Dec 2024" },
    ],
  },
  {
    company: "Flowrista",
    logo: "/orgs/flowrista.webp",
    role: "Senior Graphic Designer",
    type: "Full-time · On-site",
    period: "Jan 2025 — Aug 2025",
    place: "New Cairo, Egypt",
    note: "Marketing materials and digital interfaces for a floral-gifting brand, plus photo shooting and retouching that redefined its visual identity. Worked across teams on cohesive messaging and helped make the gifting experience unforgettable.",
  },
  {
    company: "Osolutions",
    logo: "/orgs/osolutions.webp",
    type: "Full-time · On-site",
    period: "Jan 2023 — Dec 2024",
    place: "Cairo, Egypt",
    note: "Joined as a Graphic Designer and moved up twice in under two years. Led branding, social campaigns and digital marketing assets for a range of clients, worked with marketing and account teams on concepts that matched campaign objectives, and kept visual consistency across platforms while raising production efficiency.",
    roles: [
      { title: "Senior Graphic Designer", period: "Aug 2024 — Dec 2024" },
      { title: "Mid-Level Designer", period: "Jan 2024 — Aug 2024" },
      { title: "Graphic Designer", period: "Jan 2023 — Dec 2023" },
    ],
  },
  {
    company: "Pala De 7",
    logo: "/orgs/pala7.webp",
    role: "Senior Graphic Designer",
    type: "Freelance · Remote",
    period: "Jul 2024 — Jul 2025",
    place: "Jeddah, Saudi Arabia",
    note: "Led social-media graphics and UI in Adobe and Figma to project deadlines, keeping the padel brand's visual identity consistent and engaging and folding stakeholder feedback into the work.",
  },
  {
    company: "Alkhabeer for Training",
    logo: "/orgs/alkhabeer.webp",
    role: "Graphic Designer & UI Designer",
    type: "Part-time · Remote",
    period: "Oct 2023 — Aug 2024",
    place: "Riyadh, Saudi Arabia",
    note: "Digital assets for web, apps, social and video, backed by meticulous style guides and a firm grasp of the brand persona so every piece carried the same narrative.",
  },
  {
    company: "Raya Academy",
    logo: "/orgs/raya.webp",
    role: "Graphic Design Instructor",
    type: "Part-time · On-site",
    period: "Nov 2022 — Nov 2023",
    place: "Cairo, Egypt",
    note: "Taught Photoshop, Illustrator and InDesign across twelve offline sessions, guiding students through hands-on projects until the principles stuck.",
  },
];

// Roles held inside one company, newest first. Every rung above the first
// hire is a step up, so all but the last carry the promotion badge.
function Ladder({ roles, promoted }: { roles: Role[]; promoted: string }) {
  return (
    <ol className="relative ml-1 border-l border-line/15">
      {roles.map((r, i) => (
        <li key={r.title} className="relative pb-5 pl-6 last:pb-0">
          <span
            className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${
              i === 0 ? "bg-mint" : "bg-bone-500"
            }`}
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-base md:text-lg ${
                  i === 0 ? "font-medium text-bone-50" : "text-bone-200"
                }`}
              >
                {r.title}
              </span>
              {i !== roles.length - 1 ? (
                <span className="text-[11px] uppercase tracking-widest text-mint">
                  {promoted}
                </span>
              ) : null}
            </div>
            <span className="text-xs text-bone-400">{r.period}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

// "full" is a full-time on-site or hybrid post; "flex" covers part-time,
// remote, freelance and instructor work. Read off the `type` string so the two
// stay in step with the job list itself.
type Filter = "all" | "full" | "flex";

const bucket = (j: Job): Exclude<Filter, "all"> =>
  /full-time/i.test(j.type) && !/part-time|freelance/i.test(j.type)
    ? "full"
    : "flex";

export default function Experience() {
  const { t } = useLang();
  // Full-time opens the section: it is the commitment a hiring manager is
  // usually scanning for, so it should not need a click to reach.
  const [filter, setFilter] = useState<Filter>("full");

  const count = (f: Exclude<Filter, "all">) =>
    jobs.filter((j) => bucket(j) === f).length;
  const shown =
    filter === "all" ? jobs : jobs.filter((j) => bucket(j) === filter);

  return (
    <section
      id="experience"
      className="container-edge mx-auto max-w-edge scroll-mt-24 section-y"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <SectionLabel>{t.exp.label}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-2xl text-balance font-sans text-4xl font-light leading-[1.05] tracking-tight text-bone-50 md:text-6xl">
              {t.exp.h2a}{" "}
              <span className="font-serif italic text-mint">{t.exp.h2i}</span>{" "}
              {t.exp.h2b}
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm leading-relaxed text-bone-400">
            {t.exp.note}
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.12}>
        <div className="mt-10">
          <Toggle
            ariaLabel={t.exp.label}
            hint={t.exp.filterHint}
            value={filter}
            onChange={setFilter}
            options={[
              {
                value: "full",
                label: t.exp.fullTime,
                hint: String(count("full")),
              },
              {
                value: "flex",
                label: t.exp.partTime,
                hint: String(count("flex")),
              },
              { value: "all", label: t.exp.all, hint: String(jobs.length) },
            ]}
          />
        </div>
      </Reveal>

      <div className="mt-8 border-t border-line/10">
        {shown.map((j) => (
          <Reveal key={j.company + j.period}>
            <div className="group grid grid-cols-1 gap-4 border-b border-line/10 py-7 transition-colors duration-300 hover:bg-ink-800/30 md:grid-cols-12 md:gap-6 md:py-8">
              <div className="md:col-span-4">
                <div className="flex flex-wrap items-center gap-3">
                  {j.logo ? (
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white/90">
                      <Media
                        src={j.logo}
                        alt={j.company}
                        fill
                        sizes="36px"
                        className="object-contain p-1"
                      />
                    </span>
                  ) : null}
                  <h3 className="text-xl font-medium tracking-tight text-bone-50 md:text-2xl">
                    {j.company}
                  </h3>
                  {j.current ? (
                    <span className="flex items-center gap-1.5 rounded-full border border-mint/40 bg-mint/5 px-2.5 py-0.5 text-[11px] uppercase tracking-widest text-mint">
                      <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                      {t.exp.now}
                    </span>
                  ) : null}
                  {j.returned ? (
                    <span className="rounded-full border border-line/25 px-2.5 py-0.5 text-[11px] uppercase tracking-widest text-bone-300">
                      {t.exp.returned}
                    </span>
                  ) : null}
                </div>
                {j.role ? <p className="mt-1.5 text-bone-200">{j.role}</p> : null}
                <p className="mt-2 text-sm text-bone-200">{j.period}</p>
                <p className="text-xs text-bone-400">
                  {j.place} · {j.type}
                </p>
              </div>

              <div className="md:col-span-8">
                {j.roles ? (
                  <Ladder roles={j.roles} promoted={t.exp.promoted} />
                ) : null}
                <p
                  className={`text-pretty text-sm leading-relaxed text-bone-400 md:text-base ${
                    j.roles ? "mt-4 border-t border-line/10 pt-4" : ""
                  }`}
                >
                  {j.note}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
