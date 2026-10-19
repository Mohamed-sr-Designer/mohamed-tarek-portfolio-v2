"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { clone, type Overrides, type Settings } from "@/lib/merge";
import { baseSite } from "@/lib/site";
import { pageSections } from "@/lib/sections";
import { DRAFT_KEY, PREVIEW_KEY, publishedOverrides, readDraft } from "@/lib/content";
import { checkAccess, latestRun, loadGh, putFile, putText, saveGh, type GhConfig } from "@/lib/github";
import { withBase } from "@/lib/base";
import { slugify } from "@/lib/studio-utils";
import { Btn, Card, Field, KnownAssetsList, Select, Studio as StudioContext, useStudio } from "./ui";
import TextsPanel from "./TextsPanel";
import { Aurora, LivePreview, MobileNav, Palette, Sidebar, type NavItem } from "./Shell";
import { ArticlesPanel, MediaPanel, ProjectsPanel } from "./ContentPanels";

// The dashboard. Everything is edited as one JSON document of changes:
// saved as a draft in this browser while you work, previewable on the real
// site, and published by committing it to the repository as
// lib/overrides.json, which the next deploy folds into the site.
//
// The password keeps casual visitors out of the editor. It is not what
// protects the live site: publishing needs a GitHub token with write access,
// and that token only ever lives in the browser of the person who entered it.

const PASSWORD = "2026";
const UNLOCK_KEY = "mt_studio";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "texts", label: "Texts" },
  { id: "projects", label: "Projects" },
  { id: "articles", label: "Articles" },
  { id: "media", label: "Images" },
  { id: "site", label: "Contact & info" },
  { id: "settings", label: "Theme & layout" },
  { id: "publish", label: "Publish" },
  { id: "advanced", label: "Advanced" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function StudioApp() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      setUnlocked(sessionStorage.getItem(UNLOCK_KEY) === "1");
    } catch {
      setUnlocked(false);
    }
  }, []);
  if (unlocked === null) return <div className="min-h-svh bg-ink-900" />;
  return unlocked ? <Dashboard /> : <Gate onOk={() => setUnlocked(true)} />;
}

function Gate({ onOk }: { onOk: () => void }) {
  const [v, setV] = useState("");
  const [err, setErr] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const submit = (val: string) => {
    if (val === PASSWORD) {
      try {
        sessionStorage.setItem(UNLOCK_KEY, "1");
      } catch {}
      onOk();
    } else {
      setErr(true);
      setTimeout(() => setV(""), 450);
    }
  };
  return (
    <div className="relative grid min-h-svh place-items-center overflow-hidden bg-ink-900 px-5" onClick={() => input.current?.focus()}>
      <Aurora />
      <div className="relative w-full max-w-md text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgb(var(--mint)),rgb(var(--electric)))] font-serif text-lg font-semibold text-ink-900 shadow-[0_20px_60px_-20px_rgb(var(--mint))]">
          MT
        </span>
        <h1 className="mt-8 text-[clamp(3rem,12vw,5.5rem)] font-semibold leading-none tracking-tight text-bone-50">
          Studio<span className="text-blend">.</span>
        </h1>
        <p className="mt-4 text-sm text-bone-400">Every word, image and colour on the site, in one place.</p>
        <form
          className={`mt-10 ${err ? "studio-shake" : ""}`}
          onSubmit={(e) => {
            e.preventDefault();
            submit(v);
          }}
        >
          <label htmlFor="pin" className="text-[11px] uppercase tracking-[0.3em] text-bone-400">Passcode</label>
          <div className="relative mx-auto mt-4 flex w-fit gap-3">
            {[0, 1, 2, 3].map((k) => (
              <span
                key={k}
                className={`grid h-16 w-14 place-items-center rounded-2xl border text-2xl font-semibold transition-all duration-300 ${
                  err ? "border-electric text-electric" : v.length > k ? "border-mint bg-mint/10 text-bone-50" : v.length === k ? "border-bone-300/60 bg-ink-800" : "border-line/15 bg-ink-800/70"
                }`}
              >
                {v[k] ? "•" : ""}
              </span>
            ))}
            <input
              id="pin"
              ref={input}
              autoFocus
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              value={v}
              aria-invalid={err}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setV(val);
                setErr(false);
                if (val.length === 4) submit(val);
              }}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
          <p className={`mt-4 h-5 text-sm ${err ? "text-electric" : "text-transparent"}`}>That passcode is not right.</p>
        </form>
        <Link href="/" className="mt-6 inline-block text-xs text-bone-400 hover:text-mint">← Back to the site</Link>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ images
async function toWebp(file: File, maxW = 2400): Promise<{ b64: string; width: number; height: number; url: string }> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxW / bmp.width);
  const width = Math.round(bmp.width * scale);
  const height = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, width, height);
  const blob: Blob = await new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("Could not encode image"))), "image/webp", 0.86)
  );
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return { b64: btoa(bin), width, height, url: URL.createObjectURL(blob) };
}

function Dashboard() {
  const [doc, setDoc] = useState<Overrides>(() => clone(publishedOverrides));
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [gh, setGh] = useState<GhConfig>({ repo: "", branch: "main", token: "" });
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<{ id: number; msg: string; kind: "ok" | "err" }[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    const d = readDraft();
    if (d) setDoc(d);
    setGh(loadGh());
    setLoaded(true);
  }, []);

  // autosave the draft
  useEffect(() => {
    if (!loaded) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(doc));
      } catch {}
    }, 300);
    return () => clearTimeout(id);
  }, [doc, loaded]);

  const update = useCallback((fn: (d: Overrides) => void) => {
    setDoc((prev) => {
      const next = clone(prev);
      fn(next);
      return next;
    });
  }, []);

  const toast = useCallback((msg: string, kind: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "err" ? 7000 : 3000);
  }, []);

  const upload = useCallback(
    async (file: File, targetPath?: string) => {
      if (!gh.token) throw new Error("Connect GitHub on the Publish tab first: uploads are saved to the repository.");
      const { b64, width, height, url } = await toWebp(file);
      const name = slugify(file.name.replace(/\.[a-z0-9]+$/i, ""));
      const path = targetPath ?? `/uploads/${name}-${Date.now().toString(36)}.webp`;
      await putFile(gh, `public${path}`, b64, `Dashboard: ${targetPath ? "replace" : "upload"} ${path}`);
      setPreviews((p) => ({ ...p, [path]: url }));
      update((d) => {
        d.assets ??= {};
        d.assets[path] = { width, height };
      });
      return path;
    },
    [gh, update]
  );

  const changed = JSON.stringify(doc) !== JSON.stringify(publishedOverrides);

  const count = (o: unknown): number =>
    typeof o === "string" || typeof o === "number" || typeof o === "boolean"
      ? 1
      : Array.isArray(o)
        ? 1
        : o && typeof o === "object"
          ? Object.values(o).reduce((n: number, x) => n + count(x), 0)
          : 0;
  const nav: NavItem[] = [
    { id: "overview", label: "Overview", hint: "", icon: "home" },
    { id: "texts", label: "Texts", hint: "", icon: "text", count: count(doc.en) + count(doc.ar) },
    { id: "projects", label: "Projects", hint: "", icon: "grid", count: count(doc.projects) + (doc.newProjects?.length ?? 0) },
    { id: "articles", label: "Articles", hint: "", icon: "doc", count: count(doc.articles) },
    { id: "media", label: "Images", hint: "", icon: "image", count: Object.keys(doc.assets ?? {}).length },
    { id: "site", label: "Contact & info", hint: "", icon: "user", count: count(doc.site) },
    { id: "settings", label: "Theme & layout", hint: "", icon: "palette", count: count(doc.settings) },
    { id: "publish", label: "Publish", hint: "", icon: "rocket" },
    { id: "advanced", label: "Advanced", hint: "", icon: "code" },
  ];
  const editCount = nav.reduce((n, x) => n + (x.count ?? 0), 0);
  const title = TABS.find((t) => t.id === tab)?.label ?? "";
  const openDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(doc));
      localStorage.setItem(PREVIEW_KEY, "1");
    } catch {}
    window.open(withBase("/"), "_blank");
  };
  const paletteActions = [
    { label: "Open the draft on the full site", group: "Action", run: openDraft },
    { label: "Toggle the live preview", group: "Action", run: () => setShowPreview((v) => !v) },
    { label: "Publish to the live site", group: "Action", run: () => setTab("publish") },
  ];

  return (
    <StudioContext.Provider value={{ doc, update, gh, upload, previews, toast }}>
      <KnownAssetsList />
      <div className="relative flex min-h-svh bg-ink-900 text-bone-50">
        <Aurora />
        <Sidebar items={nav} tab={tab} setTab={(t) => setTab(t as Tab)} changed={changed} editCount={editCount} />

        <div className="relative min-w-0 flex-1 pb-28 lg:pb-10">
          <header className="sticky top-0 z-30 border-b border-line/10 bg-ink-900/75 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-3 md:px-8">
              <Link href="/" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,rgb(var(--mint)),rgb(var(--electric)))] font-serif text-xs font-semibold text-ink-900 lg:hidden">MT</Link>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.24em] text-bone-500">Studio</p>
                <h1 className="truncate text-lg font-semibold leading-tight text-bone-50">{title}</h1>
              </div>
              <div className="ms-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPalette(true)}
                  className="hidden min-h-[40px] items-center gap-3 rounded-full border border-line/15 bg-ink-800/80 px-4 text-sm text-bone-400 hover:border-mint/50 md:flex"
                >
                  Search…
                  <kbd className="rounded border border-line/20 px-1.5 text-[11px]">Ctrl K</kbd>
                </button>
                <Btn className="hidden xl:inline-flex" onClick={() => setShowPreview((v) => !v)}>{showPreview ? "Hide preview" : "Show preview"}</Btn>
                <Btn onClick={openDraft} title="Open the draft on the full site in a new tab">Open draft ↗</Btn>
                <Btn kind="primary" className="lg:hidden" onClick={() => setTab("publish")}>Publish</Btn>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">
            {tab === "overview" && <Overview go={setTab} changed={changed} />}
            {tab === "texts" && <TextsPanel />}
            {tab === "projects" && <ProjectsPanel />}
            {tab === "articles" && <ArticlesPanel />}
            {tab === "media" && <MediaPanel />}
            {tab === "site" && <SitePanel />}
            {tab === "settings" && <SettingsPanel />}
            {tab === "publish" && <PublishPanel gh={gh} setGh={(c) => { setGh(c); saveGh(c); }} discard={() => setDoc(clone(publishedOverrides))} changed={changed} />}
            {tab === "advanced" && <AdvancedPanel replace={setDoc} />}
          </main>
        </div>

        {showPreview ? <LivePreview doc={doc} onClose={() => setShowPreview(false)} /> : null}
        <MobileNav items={nav} tab={tab} setTab={(t) => setTab(t as Tab)} />
        <Palette
          open={palette}
          setOpen={setPalette}
          items={nav}
          setTab={(t) => setTab(t as Tab)}
          actions={paletteActions}
        />

        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex flex-col items-center gap-2 px-4 lg:bottom-6">
          {toasts.map((t) => (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto max-w-md rounded-full border px-4 py-2.5 text-sm shadow-2xl backdrop-blur-md ${
                t.kind === "err" ? "border-electric/50 bg-ink-800/95 text-electric" : "border-mint/40 bg-ink-800/95 text-bone-50"
              }`}
            >
              {t.msg}
            </div>
          ))}
        </div>
      </div>
    </StudioContext.Provider>
  );
}

// ------------------------------------------------------------------ panels
function Overview({ go, changed }: { go: (t: Tab) => void; changed: boolean }) {
  const { doc } = useStudio();
  const count = (o: unknown): number =>
    typeof o === "string" || typeof o === "number" || typeof o === "boolean"
      ? 1
      : Array.isArray(o)
        ? o.reduce((n: number, x) => n + count(x), 0)
        : o && typeof o === "object"
          ? Object.values(o).reduce((n: number, x) => n + count(x), 0)
          : 0;
  const tiles: { t: Tab; title: string; body: string; n?: number }[] = [
    { t: "texts", title: "Texts", body: "Every heading, paragraph and button, in English and Arabic.", n: count(doc.en) + count(doc.ar) },
    { t: "projects", title: "Projects", body: "Case studies: copy, images, order, hide or add new ones.", n: count(doc.projects) + (doc.newProjects?.length ?? 0) },
    { t: "articles", title: "Articles", body: "The 30 articles: titles, body, keywords and FAQ.", n: count(doc.articles) },
    { t: "media", title: "Images", body: "Upload new images or replace any image on the site.", n: Object.keys(doc.assets ?? {}).length },
    { t: "site", title: "Contact & info", body: "Name, role, email, phone, WhatsApp, LinkedIn.", n: count(doc.site) },
    { t: "settings", title: "Theme & layout", body: "Default theme and language, accent colours, section order.", n: count(doc.settings) },
  ];
  return (
    <div className="grid gap-4">
      <Card>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-bone-300">
          Edit anything below. Changes save automatically as a draft in this browser. Use <b className="text-bone-50">Preview</b> to see
          the draft on the real site, and <b className="text-bone-50">Publish</b> to put it live.
        </p>
        <p className={`mt-4 text-sm ${changed ? "text-electric" : "text-mint"}`}>
          {changed ? "You have changes that are not live yet." : "Everything here matches the live site."}
        </p>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((x) => (
          <button
            key={x.t}
            type="button"
            onClick={() => go(x.t)}
            className="rounded-2xl border border-line/10 bg-ink-800 p-5 text-start transition-colors hover:border-mint/50"
          >
            <span className="flex items-center justify-between">
              <span className="text-lg font-semibold">{x.title}</span>
              {x.n ? <span className="rounded-full bg-electric/15 px-2 py-0.5 text-xs text-electric">{x.n} edits</span> : null}
            </span>
            <span className="mt-2 block text-sm leading-relaxed text-bone-400">{x.body}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SitePanel() {
  const { doc, update } = useStudio();
  const keys = Object.keys(baseSite).filter((k) => k !== "url") as (keyof typeof baseSite)[];
  const val = (k: string) => String((doc.site?.[k] as string | undefined) ?? (baseSite as Record<string, string>)[k] ?? "");
  return (
    <Card title="Contact & site info">
      <p className="mb-4 text-xs text-bone-400">
        Used in the header, footer, contact page, buttons and search data. The site address itself is set at build time and is not editable here.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {keys.map((k) => (
          <Field
            key={k}
            label={k}
            value={val(k)}
            changed={doc.site?.[k] !== undefined}
            onReset={() => update((d) => { if (d.site) delete d.site[k]; })}
            onChange={(v) => update((d) => { d.site ??= {}; d.site[k] = v; })}
          />
        ))}
      </div>
    </Card>
  );
}

function SettingsPanel() {
  const { doc, update } = useStudio();
  const s: Settings = doc.settings ?? {};
  const set = (fn: (s: Settings) => void) => update((d) => { d.settings ??= {}; fn(d.settings); });

  return (
    <div className="grid gap-4">
      <Card title="Defaults">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Default theme (visitors can still switch in the header)"
            value={s.defaultTheme ?? "dark"}
            options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }]}
            onChange={(v) => set((x) => { x.defaultTheme = v; })}
          />
          <Select
            label="Default language (visitors can still switch in the footer)"
            value={s.defaultLang ?? "en"}
            options={[{ value: "en", label: "English" }, { value: "ar", label: "العربية" }]}
            onChange={(v) => set((x) => { x.defaultLang = v; })}
          />
        </div>
      </Card>
      <Card title="Accent colours">
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            ["mint", "Primary accent (cyan)", "#19c8de"],
            ["electric", "Second accent (red)", "#ff3b4e"],
          ] as const).map(([k, label, def]) => (
            <div key={k} className="flex items-center gap-3">
              <input
                type="color"
                value={s[k] ?? def}
                onChange={(e) => set((x) => { x[k] = e.target.value; })}
                aria-label={label}
                className="h-12 w-14 cursor-pointer rounded-lg border border-line/20 bg-ink-900"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-bone-50">{label}</p>
                <p className="text-xs text-bone-400">{s[k] ?? `${def} (default)`}</p>
              </div>
              {s[k] ? <Btn onClick={() => set((x) => { delete x[k]; })}>Reset</Btn> : null}
            </div>
          ))}
        </div>
      </Card>
      {Object.entries(pageSections).map(([page, defs]) => (
        <SectionOrder key={page} page={page} defs={defs} />
      ))}
    </div>
  );
}

function SectionOrder({ page, defs }: { page: string; defs: { id: string; label: string }[] }) {
  const { doc, update } = useStudio();
  const saved = useMemo(() => doc.settings?.sections?.[page] ?? [], [doc, page]);
  const list = useMemo(() => {
    const rank = new Map(saved.map((x, i) => [x.id, i]));
    return defs
      .map((d, i) => ({ ...d, hidden: !!saved.find((x) => x.id === d.id)?.hidden, i }))
      .sort((a, b) => (rank.get(a.id) ?? 1e3 + a.i) - (rank.get(b.id) ?? 1e3 + b.i));
  }, [saved, defs]);
  const write = (next: typeof list) =>
    update((d) => {
      d.settings ??= {};
      d.settings.sections ??= {};
      d.settings.sections[page] = next.map((x) => ({ id: x.id, ...(x.hidden ? { hidden: true } : {}) }));
    });
  const move = (i: number, dir: -1 | 1) => {
    const a = list.slice();
    const j = i + dir;
    if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]];
    write(a);
  };
  return (
    <Card
      title={`${page === "home" ? "Home" : "About"} page sections`}
      actions={saved.length ? <Btn onClick={() => update((d) => { if (d.settings?.sections) delete d.settings.sections[page]; })}>Reset order</Btn> : undefined}
    >
      <ul className="grid gap-2">
        {list.map((x, i) => (
          <li key={x.id} className={`flex items-center gap-2 rounded-xl border border-line/10 bg-ink-900 p-2 pl-4 ${x.hidden ? "opacity-50" : ""}`}>
            <span className="w-6 text-xs tabular-nums text-bone-500">{i + 1}</span>
            <span className="min-w-0 flex-1 truncate text-sm">{x.label}</span>
            <Btn className="!px-3" disabled={i === 0} onClick={() => move(i, -1)} title="Move up">↑</Btn>
            <Btn className="!px-3" disabled={i === list.length - 1} onClick={() => move(i, 1)} title="Move down">↓</Btn>
            <Btn onClick={() => write(list.map((y) => (y.id === x.id ? { ...y, hidden: !y.hidden } : y)))}>{x.hidden ? "Show" : "Hide"}</Btn>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function PublishPanel({
  gh,
  setGh,
  discard,
  changed,
}: {
  gh: GhConfig;
  setGh: (c: GhConfig) => void;
  discard: () => void;
  changed: boolean;
}) {
  const { doc, toast } = useStudio();
  const [busy, setBusy] = useState(false);
  const [run, setRun] = useState<Awaited<ReturnType<typeof latestRun>>>();
  const poll = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => () => clearInterval(poll.current), []);

  const watch = () => {
    clearInterval(poll.current);
    let n = 0;
    const tick = async () => {
      try {
        const r = await latestRun(gh);
        setRun(r);
        if (r && r.status === "completed") clearInterval(poll.current);
      } catch {}
      if (++n > 60) clearInterval(poll.current);
    };
    tick();
    poll.current = setInterval(tick, 8000);
  };

  return (
    <div className="grid gap-4">
      <Card title="GitHub connection">
        <p className="mb-4 text-xs leading-relaxed text-bone-400">
          Publishing commits your changes to the repository and the site rebuilds itself (about two minutes). Use a fine-grained
          personal access token limited to this one repository with <b>Contents: Read and write</b> and <b>Actions: Read</b>. It is
          stored only in this browser.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Repository" value={gh.repo} onChange={(v) => setGh({ ...gh, repo: v.trim() })} />
          <Field label="Branch" value={gh.branch} onChange={(v) => setGh({ ...gh, branch: v.trim() })} />
          <Field label="Token" type="password" value={gh.token} onChange={(v) => setGh({ ...gh, token: v.trim() })} placeholder="github_pat_…" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Btn
            disabled={!gh.token || busy}
            onClick={async () => {
              setBusy(true);
              try {
                toast(`Connected to ${await checkAccess(gh)}`);
              } catch (e) {
                toast(String((e as Error).message), "err");
              } finally {
                setBusy(false);
              }
            }}
          >
            Test connection
          </Btn>
          <a
            href="https://github.com/settings/personal-access-tokens/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] items-center rounded-full border border-line/20 px-4 text-sm text-bone-200 hover:border-mint/60 hover:text-mint"
          >
            Create a token ↗
          </a>
        </div>
      </Card>

      <Card title="Publish">
        <p className="text-sm text-bone-300">
          {changed ? "Your draft differs from the live site." : "Nothing new to publish."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Btn
            kind="primary"
            disabled={!gh.token || busy || !changed}
            onClick={async () => {
              if (!confirm("Publish these changes to the live site?")) return;
              setBusy(true);
              try {
                await putText(gh, "lib/overrides.json", JSON.stringify(doc, null, 2) + "\n", "Dashboard: publish site edits");
                toast("Published. The site is rebuilding.");
                watch();
              } catch (e) {
                toast(String((e as Error).message), "err");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Publishing…" : "Publish to the live site"}
          </Btn>
          <Btn
            kind="danger"
            disabled={!changed}
            onClick={() => {
              if (confirm("Throw away every unpublished change?")) discard();
            }}
          >
            Discard draft
          </Btn>
        </div>
        {run ? (
          <p className="mt-4 text-sm text-bone-300">
            Latest build:{" "}
            <a href={run.html_url} target="_blank" rel="noopener noreferrer" className="text-mint underline-offset-2 hover:underline">
              {run.status === "completed" ? (run.conclusion === "success" ? "live ✓" : `finished: ${run.conclusion}`) : `${run.status}…`}
            </a>
          </p>
        ) : null}
      </Card>
    </div>
  );
}

function AdvancedPanel({ replace }: { replace: (d: Overrides) => void }) {
  const { doc, toast } = useStudio();
  const [text, setText] = useState(() => JSON.stringify(doc, null, 2));
  const file = useRef<HTMLInputElement>(null);
  return (
    <Card
      title="Raw changes (JSON)"
      actions={
        <>
          <Btn
            onClick={() => {
              const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `site-edits-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
            }}
          >
            Export
          </Btn>
          <Btn onClick={() => file.current?.click()}>Import</Btn>
          <Btn
            kind="primary"
            onClick={() => {
              try {
                replace(JSON.parse(text));
                toast("Applied");
              } catch (e) {
                toast(`Not valid JSON: ${(e as Error).message}`, "err");
              }
            }}
          >
            Apply
          </Btn>
        </>
      }
    >
      <p className="mb-3 text-xs text-bone-400">Everything you changed, as one document. For backups, or to move edits between browsers.</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className="h-[60vh] w-full rounded-xl border border-line/15 bg-ink-900 p-4 font-mono text-xs leading-relaxed text-bone-100 outline-none focus:border-mint/70"
      />
      <input
        ref={file}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          setText(await f.text());
        }}
      />
    </Card>
  );
}
