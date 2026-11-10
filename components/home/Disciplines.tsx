"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { SectionLabel } from "@/components/ui/SectionLabel";
import AiWorkflow from "@/components/AiWorkflow";
import SocialCards from "@/components/SocialCards";
import TypeDesign from "@/components/TypeDesign";
import Storyboards from "@/components/Storyboards";
import Motion from "@/components/Motion";
import ThreeD from "@/components/ThreeD";
import WebProjects from "@/components/WebProjects";

// The craft, one discipline at a time. These seven sections used to be stacked
// down the home page, which made it thirteen screens long; here they share one
// place and the visitor picks what they came for.

const tabs = [
  { id: "ai", en: "AI production", ar: "إنتاج بالـ AI", node: <AiWorkflow /> },
  { id: "social", en: "Social systems", ar: "أنظمة سوشيال", node: <SocialCards /> },
  { id: "type", en: "Lettering", ar: "ليترينج", node: <TypeDesign /> },
  { id: "storyboards", en: "Storyboards", ar: "ستوري بورد", node: <Storyboards /> },
  { id: "motion", en: "Motion", ar: "موشن", node: <Motion /> },
  { id: "three-d", en: "3D", ar: "3D", node: <ThreeD /> },
  { id: "web", en: "Websites", ar: "مواقع", node: <WebProjects /> },
];

const copy = {
  en: { label: "The craft", a: "Pick a", i: "discipline", b: "." },
  ar: { label: "الحِرفة", a: "اختار", i: "التخصص", b: "." },
};

export default function Disciplines() {
  const { lang } = useLang();
  const c = copy[lang];
  const [on, setOn] = useState("ai");

  // a link to #social, #motion... from anywhere opens that tab
  useEffect(() => {
    const pick = () => {
      const h = window.location.hash.slice(1);
      if (tabs.some((t) => t.id === h)) {
        setOn(h);
        document.getElementById("craft")?.scrollIntoView();
      }
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, []);

  return (
    <section id="craft" className="pt-24 md:pt-32">
      <div className="container-edge mx-auto max-w-edge">
        <SectionLabel>{c.label}</SectionLabel>
        <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-bone-50 md:text-6xl">
          {c.a} <span className="font-serif font-light italic text-mint">{c.i}</span>
          {c.b}
        </h2>
        <div role="tablist" aria-label={c.label} className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={on === t.id}
              onClick={() => setOn(t.id)}
              className={`min-h-[44px] shrink-0 rounded-full border px-5 text-sm font-medium transition-colors duration-300 ${
                on === t.id ? "border-mint bg-mint text-ink-900" : "border-line/20 text-bone-200 hover:border-mint/60 hover:text-mint"
              }`}
            >
              {lang === "ar" ? t.ar : t.en}
            </button>
          ))}
        </div>
      </div>
      {/* each discipline keeps its own section, heading and layout */}
      <div role="tabpanel" className="craft-panel">
        {tabs.find((t) => t.id === on)?.node}
      </div>
    </section>
  );
}
