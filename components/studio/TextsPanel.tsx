"use client";

import { useMemo, useState } from "react";
import { baseDict, type Lang } from "@/lib/dict";
import { clone } from "@/lib/merge";
import { deleteAt, effective, getAt, setAt, writeTarget, type Path } from "@/lib/studio-utils";
import { Btn, Card, Field, useStudio } from "./ui";

// Every string on the site, in both languages, generated from the dictionary
// itself, so a string added to the code shows up here with no extra work.
// Project copy is edited on the Projects tab, so it is left out here.

const SECTION_NAMES: Record<string, string> = {
  ui: "Shared micro-copy",
  nav: "Header",
  hero: "Home · hero",
  work: "Work & sectors",
  ai: "AI Work Flow",
  master: "Key Visuals",
  socialCards: "Social Media Designs",
  story: "Storyboards",
  clients: "Clients",
  services: "Services",
  motion: "Motion & Video",
  threeD: "3D Rendering",
  featured: "Featured on LinkedIn",
  recs: "Recommendations",
  type: "Type Design",
  web: "Vibe Coding",
  social: "Designs wall",
  hire: "Hire band",
  footer: "Footer",
  articles: "Articles pages",
  about: "About",
  exp: "Experience",
  teach: "Teaching",
  skills: "Capabilities",
  tools: "Toolkit",
  contact: "Contact",
  case: "Case pages",
};

type Leaf = { path: Path; value: string };

function leaves(node: unknown, path: Path, out: Leaf[]) {
  if (typeof node === "string") out.push({ path, value: node });
  else if (Array.isArray(node)) node.forEach((v, i) => leaves(v, [...path, i], out));
  else if (node && typeof node === "object")
    for (const [k, v] of Object.entries(node)) leaves(v, [...path, k], out);
  return out;
}

const label = (path: Path) =>
  path
    .slice(1)
    .map((k) => (typeof k === "number" ? `#${k + 1}` : k))
    .join(" › ");

export default function TextsPanel() {
  const { doc, update } = useStudio();
  const [lang, setLang] = useState<Lang>("en");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>("hero");

  const base = baseDict[lang] as unknown as Record<string, unknown>;
  const ov = useMemo(() => (doc[lang] ?? {}) as Record<string, unknown>, [doc, lang]);
  const eff = useMemo(() => effective(base, ov), [base, ov]);
  const sections = Object.keys(base).filter((k) => k !== "projects");
  const dir = lang === "ar" ? "rtl" : "ltr";

  const isChanged = (path: Path) => {
    for (let i = path.length; i > 0; i--) if (getAt(ov, path.slice(0, i)) !== undefined) {
      // an overridden array counts as changed only where it differs
      return JSON.stringify(getAt(eff, path)) !== JSON.stringify(getAt(base, path));
    }
    return false;
  };

  const write = (path: Path, value: unknown) =>
    update((d) => {
      const root = (d[lang] ??= {});
      const t = writeTarget(effective(base, root), path, value);
      setAt(root, t.path, t.value);
    });

  const reset = (path: Path) =>
    update((d) => {
      const root = d[lang];
      if (!root) return;
      const firstNum = path.findIndex((k) => typeof k === "number");
      if (firstNum === -1) deleteAt(root, path);
      else {
        // inside an array: put the base value back into the overridden array
        const t = writeTarget(effective(base, root), path, clone(getAt(base, path)));
        setAt(root, t.path, t.value);
      }
    });

  const all = useMemo(() => sections.flatMap((s) => leaves(eff[s], [s], [])), [eff, sections]);
  const hits = q.trim()
    ? all.filter(
        (l) =>
          l.value.toLowerCase().includes(q.toLowerCase()) ||
          label(l.path).toLowerCase().includes(q.toLowerCase())
      )
    : null;

  const renderLeaf = (l: Leaf, showSection = false) => (
    <Field
      key={l.path.join(".")}
      label={(showSection ? `${SECTION_NAMES[l.path[0] as string] ?? l.path[0]} › ` : "") + (label(l.path) || String(l.path[0]))}
      value={l.value}
      dir={dir}
      changed={isChanged(l.path)}
      onReset={() => reset(l.path)}
      onChange={(v) => write(l.path, v)}
    />
  );

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label="Language" className="inline-flex gap-1 rounded-full border border-line/20 bg-ink-900 p-1">
            {(["en", "ar"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`min-h-[36px] rounded-full border px-4 text-sm ${lang === l ? "border-mint bg-mint font-semibold text-ink-900" : "border-line/20 bg-ink-800 text-bone-200"}`}
              >
                {l === "en" ? "English" : "العربية"}
              </button>
            ))}
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search every text on the site…"
            className="min-h-[40px] min-w-0 flex-1 rounded-full border border-line/15 bg-ink-900 px-4 text-sm text-bone-50 outline-none focus:border-mint/70"
          />
        </div>
        <p className="mt-3 text-xs text-bone-400">
          Edited fields are marked with a red dot. Empty a field to hide that line where the design allows it.
        </p>
      </Card>

      {hits ? (
        <Card title={`${hits.length} match${hits.length === 1 ? "" : "es"}`}>
          <div className="grid gap-4">{hits.slice(0, 80).map((l) => renderLeaf(l, true))}</div>
        </Card>
      ) : (
        sections.map((s) => {
          const ls = leaves(eff[s], [s], []);
          const edited = ls.filter((l) => isChanged(l.path)).length;
          const isOpen = open === s;
          return (
            <section key={s} className="rounded-2xl border border-line/10 bg-ink-800">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : s)}
                aria-expanded={isOpen}
                className="flex min-h-[56px] w-full items-center justify-between gap-3 px-4 text-start md:px-6"
              >
                <span className="font-medium text-bone-50">{SECTION_NAMES[s] ?? s}</span>
                <span className="flex items-center gap-3 text-xs text-bone-400">
                  {edited ? <span className="rounded-full bg-electric/15 px-2 py-0.5 text-electric">{edited} edited</span> : null}
                  {ls.length} texts
                  <span aria-hidden className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>⌄</span>
                </span>
              </button>
              {isOpen ? (
                <div className="grid gap-4 border-t border-line/10 p-4 md:p-6">
                  {ls.map((l) => renderLeaf(l))}
                  <ArrayTools section={s} eff={eff} write={write} />
                </div>
              ) : null}
            </section>
          );
        })
      )}
    </div>
  );
}

// Lists inside a section (service cards, skill groups, stats…) can grow or
// shrink: add a copy of the last item, or remove the last one.
function ArrayTools({
  section,
  eff,
  write,
}: {
  section: string;
  eff: Record<string, unknown>;
  write: (p: Path, v: unknown) => void;
}) {
  const arrays: { path: Path; arr: unknown[] }[] = [];
  const walk = (n: unknown, p: Path) => {
    if (Array.isArray(n)) {
      arrays.push({ path: p, arr: n });
      n.forEach((v, i) => walk(v, [...p, i]));
    } else if (n && typeof n === "object") for (const [k, v] of Object.entries(n)) walk(v, [...p, k]);
  };
  walk(eff[section], [section]);
  if (!arrays.length) return null;
  return (
    <div className="mt-2 grid gap-2 rounded-xl border border-dashed border-line/15 p-3">
      <p className="text-xs text-bone-400">Lists in this section</p>
      {arrays.map(({ path, arr }) => (
        <div key={path.join(".")} className="flex flex-wrap items-center justify-between gap-2 text-sm text-bone-200">
          <span>
            {label(path) || String(path[0])} · {arr.length} items
          </span>
          <span className="flex gap-2">
            <Btn onClick={() => write(path, [...arr, clone(arr[arr.length - 1] ?? "")])}>+ Add item</Btn>
            <Btn kind="danger" disabled={!arr.length} onClick={() => write(path, arr.slice(0, -1))}>
              Remove last
            </Btn>
          </span>
        </div>
      ))}
    </div>
  );
}
