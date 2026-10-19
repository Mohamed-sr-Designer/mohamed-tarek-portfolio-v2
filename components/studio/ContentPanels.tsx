"use client";

import { useMemo, useRef, useState } from "react";
import { baseProjects, type Project } from "@/lib/projects";
import { baseDict } from "@/lib/dict";
import { baseArticles, articleCategories, type Article, type Block } from "@/lib/articles";
import { knownAssets } from "@/lib/assets";
import { clone, deepMerge, type Json } from "@/lib/merge";
import { slugify } from "@/lib/studio-utils";
import { Btn, Card, Field, ImageField, LinesField, Select, Thumb, useStudio } from "./ui";

/* ======================================================================
   Projects
   ====================================================================== */

type AnyProject = Project & { hidden?: boolean };

const AR_FIELDS = ["title", "tagline", "category", "challenge", "strategy"] as const;

export function ProjectsPanel() {
  const { doc, update } = useStudio();
  const [edit, setEdit] = useState<string | null>(null);

  const all: { p: AnyProject; isNew: boolean }[] = useMemo(() => {
    const list = [
      ...baseProjects.map((b) => ({
        p: deepMerge(clone(b), doc.projects?.[b.slug] ?? {}) as AnyProject,
        isNew: false,
      })),
      ...((doc.newProjects ?? []) as unknown as AnyProject[]).map((p) => ({ p, isNew: true })),
    ];
    const order = doc.projectOrder ?? [];
    const rank = (s: string) => (order.includes(s) ? order.indexOf(s) : 1e6);
    return list
      .map((x, i) => ({ x, i }))
      .sort((a, b) => rank(a.x.p.slug) - rank(b.x.p.slug) || a.i - b.i)
      .map(({ x }) => x);
  }, [doc]);

  const move = (slug: string, dir: -1 | 1) =>
    update((d) => {
      const order = all.map((x) => x.p.slug);
      const i = order.indexOf(slug);
      const j = i + dir;
      if (j < 0 || j >= order.length) return;
      [order[i], order[j]] = [order[j], order[i]];
      d.projectOrder = order;
    });

  const setField = (slug: string, isNew: boolean, key: string, value: unknown) =>
    update((d) => {
      if (isNew) {
        const np = (d.newProjects ?? []).find((x) => x.slug === slug);
        if (np) (np as Record<string, unknown>)[key] = value as Json;
      } else {
        d.projects ??= {};
        d.projects[slug] ??= {};
        (d.projects[slug] as Record<string, unknown>)[key] = value as Json;
      }
    });

  const addProject = () => {
    const title = prompt("Project title (English)");
    if (!title) return;
    let slug = slugify(title);
    if (all.some((x) => x.p.slug === slug)) slug = `${slug}-${Date.now() % 1000}`;
    update((d) => {
      d.newProjects ??= [];
      d.newProjects.push({
        slug,
        index: "",
        title,
        client: title.split(",")[0],
        year: String(new Date().getFullYear()),
        category: "",
        sector: "Food & Retail",
        discipline: "",
        accent: "mint",
        simple: true,
        summary: "",
        tagline: "",
        cover: "",
        hero: "",
        tags: [],
        contribution: [],
        gallery: [],
      });
    });
    setEdit(slug);
  };

  const editing = all.find((x) => x.p.slug === edit);

  return (
    <div className="grid gap-4">
      <Card
        title={`${all.length} projects`}
        actions={<Btn kind="primary" onClick={addProject}>+ New project</Btn>}
      >
        <p className="mb-4 text-xs text-bone-400">
          Order here is the order on the site. Hidden projects disappear from the home page and get no case page.
          A new project gets its own case page once it is published.
        </p>
        <ul className="grid gap-2">
          {all.map(({ p, isNew }, i) => (
            <li key={p.slug} className={`flex items-center gap-3 rounded-xl border border-line/10 bg-ink-900 p-2 pr-3 ${p.hidden ? "opacity-50" : ""}`}>
              <Thumb src={p.cover} className="h-14 w-12 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-bone-50">{p.title}</p>
                <p className="truncate text-xs text-bone-400">
                  {p.sector} · {p.gallery.length} images {isNew ? "· new" : ""} {p.hidden ? "· hidden" : ""}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                <Btn title="Move up" disabled={i === 0} onClick={() => move(p.slug, -1)} className="!px-3">↑</Btn>
                <Btn title="Move down" disabled={i === all.length - 1} onClick={() => move(p.slug, 1)} className="!px-3">↓</Btn>
                <Btn onClick={() => setField(p.slug, isNew, "hidden", !p.hidden)}>{p.hidden ? "Show" : "Hide"}</Btn>
                <Btn kind="primary" onClick={() => setEdit(edit === p.slug ? null : p.slug)}>{edit === p.slug ? "Close" : "Edit"}</Btn>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {editing ? <ProjectEditor key={editing.p.slug} p={editing.p} isNew={editing.isNew} setField={setField} onClose={() => setEdit(null)} /> : null}
    </div>
  );
}

function ProjectEditor({
  p,
  isNew,
  setField,
  onClose,
}: {
  p: AnyProject;
  isNew: boolean;
  setField: (slug: string, isNew: boolean, key: string, v: unknown) => void;
  onClose: () => void;
}) {
  const { doc, update } = useStudio();
  const set = (k: string, v: unknown) => setField(p.slug, isNew, k, v);
  const baseAr = (baseDict.ar.projects as Record<string, Record<string, string>>)[p.slug] ?? {};
  const ar = { ...baseAr, ...((doc.ar?.projects as Record<string, Record<string, string>> | undefined)?.[p.slug] ?? {}) };
  const setAr = (k: string, v: string) =>
    update((d) => {
      d.ar ??= {};
      const projects = ((d.ar.projects as Record<string, Record<string, Json>>) ??= {});
      projects[p.slug] ??= {};
      projects[p.slug][k] = v;
    });

  const gallery = p.gallery.map((g) => g.src);
  const setGallery = (srcs: string[]) => set("gallery", srcs.map((src) => ({ src })));

  return (
    <Card
      title={`Editing · ${p.title}`}
      actions={
        <>
          {isNew ? (
            <Btn
              kind="danger"
              onClick={() => {
                if (!confirm("Delete this new project?")) return;
                update((d) => {
                  d.newProjects = (d.newProjects ?? []).filter((x) => x.slug !== p.slug);
                });
                onClose();
              }}
            >
              Delete
            </Btn>
          ) : null}
          <Btn onClick={onClose}>Done</Btn>
        </>
      }
    >
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" value={p.title} onChange={(v) => set("title", v)} />
          <Field label="Client" value={p.client} onChange={(v) => set("client", v)} />
          <Field label="Category" value={p.category} onChange={(v) => set("category", v)} />
          <Field label="Year" value={p.year} onChange={(v) => set("year", v)} />
          <Select
            label="Sector (groups the work)"
            value={p.sector}
            options={Array.from(new Set([...baseProjects.map((x) => x.sector), p.sector])).map((s) => ({ value: s, label: s }))}
            onChange={(v) => set("sector", v)}
          />
          <Field label="Discipline" value={p.discipline} onChange={(v) => set("discipline", v)} />
          <Select
            label="Page type"
            value={p.simple ? "simple" : "full"}
            options={[
              { value: "full", label: "Full case study (challenge + strategy)" },
              { value: "simple", label: "Simple (banner, explanation, images)" },
            ]}
            onChange={(v) => set("simple", v === "simple")}
          />
          <Select
            label="Accent"
            value={p.accent}
            options={[
              { value: "mint", label: "Cyan" },
              { value: "electric", label: "Red" },
            ]}
            onChange={(v) => set("accent", v)}
          />
        </div>

        <Field label="Tagline (shown on the card)" value={p.tagline} onChange={(v) => set("tagline", v)} />
        <Field label="Summary (search & social description)" multiline value={p.summary} onChange={(v) => set("summary", v)} />
        <Field label="Challenge" multiline value={p.challenge ?? ""} onChange={(v) => set("challenge", v)} />
        <Field label="Strategy / explanation" multiline value={p.strategy ?? ""} onChange={(v) => set("strategy", v)} />
        <div className="grid gap-4 md:grid-cols-2">
          <LinesField label="Tags" value={p.tags} onChange={(v) => set("tags", v)} />
          <LinesField label="My contribution" value={p.contribution} onChange={(v) => set("contribution", v)} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ImageField label="Cover (leads the card)" value={p.cover} onChange={(v) => set("cover", v)} />
          <ImageField label="Hero" value={p.hero} onChange={(v) => set("hero", v)} />
        </div>

        <GalleryEditor value={gallery} onChange={setGallery} />
        <LinesField
          label="Card picks (the 3 small posts on the card, image paths)"
          value={p.cardPicks ?? []}
          onChange={(v) => set("cardPicks", v)}
          hint="Optional. One image path per line; leave empty to use the next three in the gallery."
        />

        <div className="rounded-2xl border border-line/10 bg-ink-900 p-4 md:p-5">
          <p className="mb-4 text-sm font-medium text-bone-50">Arabic version</p>
          <div className="grid gap-4">
            {AR_FIELDS.map((k) => (
              <Field key={k} label={k} dir="rtl" multiline={k === "challenge" || k === "strategy"} value={ar[k] ?? ""} onChange={(v) => setAr(k, v)} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function GalleryEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const { upload, toast } = useStudio();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [path, setPath] = useState("");
  const move = (i: number, d: -1 | 1) => {
    const a = value.slice();
    const j = i + d;
    if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]];
    onChange(a);
  };
  return (
    <div>
      <p className="text-xs text-bone-400">Gallery · {value.length} images (first = top of the grid order)</p>
      <ul className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {value.map((src, i) => (
          <li key={src + i} className="overflow-hidden rounded-xl border border-line/10 bg-ink-900">
            <Thumb src={src} className="aspect-[4/5] w-full" />
            <div className="flex items-center justify-between gap-1 p-1">
              <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-bone-300 hover:text-mint" onClick={() => move(i, -1)} aria-label="Move earlier">←</button>
              <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-electric hover:bg-electric/15" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Remove">✕</button>
              <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-bone-300 hover:text-mint" onClick={() => move(i, 1)} aria-label="Move later">→</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          list="known-assets"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="Add by path…"
          className="min-h-[40px] min-w-0 flex-1 rounded-full border border-line/15 bg-ink-900 px-4 text-sm text-bone-50 outline-none focus:border-mint/70"
        />
        <Btn disabled={!path} onClick={() => { onChange([...value, path]); setPath(""); }}>Add</Btn>
        <Btn kind="primary" disabled={busy} onClick={() => input.current?.click()}>{busy ? "Uploading…" : "Upload images"}</Btn>
        <input
          ref={input}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (!files.length) return;
            setBusy(true);
            const added: string[] = [];
            try {
              for (const f of files) added.push(await upload(f));
              toast(`${added.length} image${added.length === 1 ? "" : "s"} uploaded`);
            } catch (err) {
              toast(String((err as Error).message), "err");
            } finally {
              if (added.length) onChange([...value, ...added]);
              setBusy(false);
            }
          }}
        />
      </div>
    </div>
  );
}

/* ======================================================================
   Articles
   ====================================================================== */

// Body text as plain lines: "## Heading", "- list item", "> quote", anything
// else is a paragraph. Blank lines separate blocks.
const toText = (b: Block[]) =>
  b
    .map((x) => ("h2" in x ? `## ${x.h2}` : "p" in x ? x.p : "quote" in x ? `> ${x.quote}` : x.ul.map((i) => `- ${i}`).join("\n")))
    .join("\n\n");

const fromText = (s: string): Block[] => {
  const out: Block[] = [];
  for (const chunk of s.split(/\n\s*\n/)) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    if (lines.every((l) => l.startsWith("- "))) out.push({ ul: lines.map((l) => l.slice(2)) });
    else if (lines[0].startsWith("## ")) {
      out.push({ h2: lines[0].slice(3) });
      if (lines.length > 1) out.push({ p: lines.slice(1).join(" ") });
    } else if (lines[0].startsWith("> ")) out.push({ quote: lines.join(" ").slice(2) });
    else out.push({ p: lines.join(" ") });
  }
  return out;
};

const faqToText = (f: Article["faq"]) => f.map((x) => `Q: ${x.q}\nA: ${x.a}`).join("\n\n");
const faqFromText = (s: string) =>
  s
    .split(/\n\s*\n/)
    .map((c) => {
      const q = /Q:\s*([\s\S]*?)(?:\nA:|$)/.exec(c)?.[1]?.trim() ?? "";
      const a = /A:\s*([\s\S]*)$/.exec(c)?.[1]?.trim() ?? "";
      return { q, a };
    })
    .filter((x) => x.q && x.a);

export function ArticlesPanel() {
  const { doc, update } = useStudio();
  const [edit, setEdit] = useState<string | null>(null);
  const list = baseArticles.map((b) => deepMerge(clone(b), doc.articles?.[b.slug] ?? {}) as Article & { hidden?: boolean });
  const set = (slug: string, k: string, v: unknown) =>
    update((d) => {
      d.articles ??= {};
      d.articles[slug] ??= {};
      (d.articles[slug] as Record<string, unknown>)[k] = v as Json;
    });
  const a = list.find((x) => x.slug === edit);

  return (
    <div className="grid gap-4">
      <Card title={`${list.length} articles`}>
        <ul className="grid gap-2">
          {list.map((x) => (
            <li key={x.slug} className={`flex items-center gap-3 rounded-xl border border-line/10 bg-ink-900 p-3 ${x.hidden ? "opacity-50" : ""}`}>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-bone-50">{x.title}</p>
                <p className="truncate text-xs text-bone-400">{x.category} · {x.date}{x.hidden ? " · hidden" : ""}</p>
              </div>
              <Btn onClick={() => set(x.slug, "hidden", !x.hidden)}>{x.hidden ? "Show" : "Hide"}</Btn>
              <Btn kind="primary" onClick={() => setEdit(edit === x.slug ? null : x.slug)}>{edit === x.slug ? "Close" : "Edit"}</Btn>
            </li>
          ))}
        </ul>
      </Card>
      {a ? (
        <Card key={a.slug} title={`Editing · ${a.title}`} actions={<Btn onClick={() => setEdit(null)}>Done</Btn>}>
          <div className="grid gap-4">
            <Field label="Title" value={a.title} onChange={(v) => set(a.slug, "title", v)} />
            <Field label="Arabic title" dir="rtl" value={a.titleAr} onChange={(v) => set(a.slug, "titleAr", v)} />
            <ImageField label="Cover image" value={a.cover || `/articles/${a.slug}.webp`} onChange={(v) => set(a.slug, "cover", v)} />
            <Field label="Description (search snippet, also the summary box)" multiline value={a.description} onChange={(v) => set(a.slug, "description", v)} />
            <Field label="Arabic summary" dir="rtl" multiline value={a.summaryAr} onChange={(v) => set(a.slug, "summaryAr", v)} />
            <div className="grid gap-4 md:grid-cols-2">
              <Select label="Topic" value={a.category} options={articleCategories.map((c) => ({ value: c, label: c }))} onChange={(v) => set(a.slug, "category", v)} />
              <Field label="Date (YYYY-MM-DD)" value={a.date} onChange={(v) => set(a.slug, "date", v)} />
            </div>
            <LinesField label="Search keywords" value={a.keywords} onChange={(v) => set(a.slug, "keywords", v)} />
            <LinesField label="Key takeaways" value={a.takeaways} onChange={(v) => set(a.slug, "takeaways", v)} />
            <BodyField value={a.body} onChange={(v) => set(a.slug, "body", v)} />
            <FaqField value={a.faq} onChange={(v) => set(a.slug, "faq", v)} />
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function BodyField({ value, onChange }: { value: Block[]; onChange: (v: Block[]) => void }) {
  const [text, setText] = useState(toText(value));
  return (
    <Field
      label="Article body"
      multiline
      hint='Blank line between blocks. "## " starts a heading, "- " a list item, "> " a quote.'
      value={text}
      onChange={(v) => {
        setText(v);
        onChange(fromText(v));
      }}
    />
  );
}

function FaqField({ value, onChange }: { value: Article["faq"]; onChange: (v: Article["faq"]) => void }) {
  const [text, setText] = useState(faqToText(value));
  return (
    <Field
      label="FAQ"
      multiline
      hint='Each question as "Q: …" then "A: …", with a blank line between pairs.'
      value={text}
      onChange={(v) => {
        setText(v);
        onChange(faqFromText(v));
      }}
    />
  );
}

/* ======================================================================
   Media
   ====================================================================== */

export function MediaPanel() {
  const { doc, upload, toast } = useStudio();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const target = useRef<string>("");
  const uploads = Object.keys(doc.assets ?? {}).filter((k) => k.startsWith("/uploads/"));
  const all = Array.from(new Set([...uploads, ...knownAssets()]));
  const shown = all.filter((k) => k.toLowerCase().includes(q.toLowerCase())).slice(0, 120);

  return (
    <div className="grid gap-4">
      <Card
        title="Media library"
        actions={
          <Btn kind="primary" disabled={!!busy} onClick={() => input.current?.click()}>
            {busy === "new" ? "Uploading…" : "Upload new images"}
          </Btn>
        }
      >
        <p className="mb-4 text-xs text-bone-400">
          New uploads are converted to WebP and saved in the repository, then used anywhere by their path. “Replace” swaps an existing
          image everywhere it appears, keeping the same path. Images go live with the next deploy (about two minutes).
        </p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Filter ${all.length} images by path…`}
          className="min-h-[40px] w-full rounded-full border border-line/15 bg-ink-900 px-4 text-sm text-bone-50 outline-none focus:border-mint/70"
        />
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {shown.map((src) => (
            <li key={src} className="overflow-hidden rounded-xl border border-line/10 bg-ink-900">
              <Thumb src={src} className="aspect-square w-full" />
              <div className="p-2">
                <p className="truncate text-[11px] text-bone-400" title={src}>{src}</p>
                <div className="mt-2 flex gap-1.5">
                  <Btn className="!min-h-[32px] flex-1 !px-2 text-xs" onClick={() => { navigator.clipboard?.writeText(src); toast("Path copied"); }}>Copy</Btn>
                  <Btn className="!min-h-[32px] flex-1 !px-2 text-xs" disabled={!!busy} onClick={() => { target.current = src; replaceInput.current?.click(); }}>
                    {busy === src ? "…" : "Replace"}
                  </Btn>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
      <input
        ref={input}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (!files.length) return;
          setBusy("new");
          try {
            for (const f of files) await upload(f);
            toast(`${files.length} uploaded`);
          } catch (err) {
            toast(String((err as Error).message), "err");
          } finally {
            setBusy(null);
          }
        }}
      />
      <input
        ref={replaceInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f || !target.current) return;
          if (!confirm(`Replace ${target.current} everywhere it is used?`)) return;
          setBusy(target.current);
          try {
            await upload(f, target.current);
            toast("Image replaced");
          } catch (err) {
            toast(String((err as Error).message), "err");
          } finally {
            setBusy(null);
          }
        }}
      />
    </div>
  );
}
