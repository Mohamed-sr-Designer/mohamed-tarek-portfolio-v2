"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLang } from "@/lib/i18n";

type Tool = { name: string; role: string; mono: string; color: string };

// The six he specialises in. These get the weight on the page: a recruiter
// should see what he is genuinely deep in before anything else.
const core: Tool[] = [
  { name: "Photoshop", role: "Retouch & Composite", mono: "Ps", color: "#31A8FF" },
  { name: "Figma", role: "UI & Systems", mono: "Fi", color: "#F24E1E" },
  { name: "Magnific", role: "Upscale · Freepik", mono: "M", color: "#1273EB" },
  { name: "ChatGPT", role: "AI Copy & Concept", mono: "AI", color: "#10A37F" },
  { name: "Claude", role: "AI Reasoning", mono: "C", color: "#D97757" },
  { name: "ElevenLabs", role: "AI Voice-Over", mono: "11", color: "#E1E1E1" },
];

// Real, used, but not what he leads with. Seedance was dropped entirely.
const secondary: Tool[] = [
  { name: "Illustrator", role: "Vector & Logo", mono: "Ai", color: "#FF9A00" },
  { name: "After Effects", role: "Motion", mono: "Ae", color: "#9999FF" },
  { name: "Premiere Pro", role: "Video Edit", mono: "Pr", color: "#9999FF" },
  { name: "Blender", role: "3D (Basics)", mono: "Bl", color: "#E87D0D" },
  { name: "Gemini", role: "AI Ideation", mono: "G", color: "#1A73E8" },
];

function CoreCard({ t }: { t: Tool }) {
  return (
    <StaggerItem className="group flex items-center gap-4 rounded-xl border border-line/12 bg-ink-900 p-5 transition-colors duration-300 hover:border-mint/35">
      <span
        className="grid h-12 w-12 shrink-0 place-items-center rounded-lg text-sm font-semibold"
        style={{
          color: t.color,
          backgroundColor: `${t.color}14`,
          border: `1px solid ${t.color}40`,
        }}
      >
        {t.mono}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-lg font-medium tracking-tight text-bone-50">
          {t.name}
        </span>
        <span className="block truncate text-xs text-bone-400">{t.role}</span>
      </span>
    </StaggerItem>
  );
}

// Quieter treatment for the secondary set: a chip, not a card.
function SecondaryChip({ t }: { t: Tool }) {
  return (
    <StaggerItem className="inline-flex items-center gap-2.5 rounded-full border border-line/15 px-4 py-2 transition-colors duration-300 hover:border-line/35">
      <span
        className="text-[11px] font-semibold"
        style={{ color: `${t.color}CC` }}
      >
        {t.mono}
      </span>
      <span className="text-sm text-bone-200">{t.name}</span>
      <span className="text-xs text-bone-500">{t.role}</span>
    </StaggerItem>
  );
}

export default function Tools() {
  const { t } = useLang();
  return (
    <section className="container-edge mx-auto max-w-edge section-y">
      <Reveal>
        <SectionLabel>{t.tools.label}</SectionLabel>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-6 max-w-2xl text-balance font-sans text-3xl font-light leading-[1.05] tracking-tight text-bone-50 md:text-5xl">
          {t.tools.h2a}{" "}
          <span className="font-serif italic text-mint">{t.tools.h2i}</span>
          {t.tools.h2b}
        </h2>
      </Reveal>

      <div className="mt-12">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-xs uppercase tracking-ultra text-mint">
            {t.tools.coreCol}
          </p>
          <p className="text-xs text-bone-500">{t.tools.coreNote}</p>
        </div>
        <Stagger className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {core.map((tool) => (
            <CoreCard key={tool.name} t={tool} />
          ))}
        </Stagger>
      </div>

      <div className="mt-12 border-t border-line/10 pt-10">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-xs uppercase tracking-ultra text-bone-400">
            {t.tools.alsoCol}
          </p>
          <p className="text-xs text-bone-500">{t.tools.alsoNote}</p>
        </div>
        <Stagger className="mt-5 flex flex-wrap gap-2.5">
          {secondary.map((tool) => (
            <SecondaryChip key={tool.name} t={tool} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
