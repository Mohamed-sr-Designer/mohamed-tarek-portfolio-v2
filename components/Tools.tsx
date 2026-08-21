"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Media } from "@/components/ui/Media";
import { useLang } from "@/lib/i18n";

type Tool = { name: string; role: string; icon: string };

// Every logo is pre-normalised to one square canvas with the same padding
// (scripts/import-tool-icons.mjs), so the cards can render them at a fixed box
// and they all land at the same optical weight -- no per-logo nudging here.
const icon = (slug: string) => `/tools/${slug}.webp`;

// What he leads with. The Adobe run moved up here from the second row: it is
// what the day actually gets spent in, and a recruiter should hit it first.
const core: Tool[] = [
  { name: "Photoshop", role: "Retouch & Composite", icon: icon("photoshop") },
  { name: "Illustrator", role: "Vector & Logo", icon: icon("illustrator") },
  { name: "After Effects", role: "Motion", icon: icon("after-effects") },
  { name: "Premiere Pro", role: "Video Edit", icon: icon("premiere") },
  { name: "Figma", role: "UI & Systems", icon: icon("figma") },
  { name: "Magnific", role: "Upscale · Freepik", icon: icon("magnific") },
];

// Real, used, but supporting -- the AI set traded places with the Adobe one.
const secondary: Tool[] = [
  { name: "ChatGPT", role: "AI Copy & Concept", icon: icon("chatgpt") },
  { name: "Claude", role: "AI Reasoning", icon: icon("claude") },
  { name: "ElevenLabs", role: "AI Voice-Over", icon: icon("elevenlabs") },
  { name: "Blender", role: "3D (Basics)", icon: icon("blender") },
  { name: "Gemini", role: "AI Ideation", icon: icon("gemini") },
];

function CoreCard({ t }: { t: Tool }) {
  return (
    <StaggerItem className="group flex items-center gap-4 rounded-xl border border-line/12 bg-ink-900 p-5 transition-colors duration-300 hover:border-mint/35">
      <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-line/10 bg-ink-800 p-2">
        <Media src={t.icon} alt="" fill sizes="48px" className="object-contain p-2" />
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
    <StaggerItem className="inline-flex items-center gap-2.5 rounded-full border border-line/15 py-2 pe-4 ps-2.5 transition-colors duration-300 hover:border-line/35">
      <span className="relative block h-5 w-5 shrink-0">
        <Media src={t.icon} alt="" fill sizes="20px" className="object-contain" />
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
