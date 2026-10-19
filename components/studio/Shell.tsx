"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { withBase } from "@/lib/base";
import type { Overrides } from "@/lib/merge";
import { projects } from "@/lib/projects";
import { articles } from "@/lib/articles";

// The dashboard's frame: a sidebar of sections, the working panel, and a live
// preview of the real site that redraws as you type. A command palette
// (Ctrl/⌘ K) jumps to any section, page or action from the keyboard.

export type NavItem = { id: string; label: string; hint: string; icon: keyof typeof ICONS; count?: number };

const P = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
export const ICONS = {
  home: P("M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"),
  text: P("M4 6h16M4 12h10M4 18h13"),
  grid: P("M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"),
  doc: P("M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"),
  image: P("M4 5h16v14H4zM8 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M20 16l-5-5-9 8"),
  user: P("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"),
  palette: P("M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-1.4 1-2.4 2.4-2.4H18a3 3 0 0 0 3-3c0-6-4-11-9-11zM7.5 11h.01M10 7h.01M15 7.5h.01"),
  rocket: P("M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 4c3 0 6 3 6 6l-7 7-6-6zM13 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"),
  code: P("M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"),
};

const PAGES = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about/" },
  { label: "Contact", path: "/contact/" },
  { label: "Articles", path: "/articles/" },
];

export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-mint/20 blur-[140px] motion-safe:animate-[driftA_30s_ease-in-out_infinite_alternate]" />
      <div className="absolute -bottom-52 -right-40 h-[40rem] w-[40rem] rounded-full bg-electric/15 blur-[150px] motion-safe:animate-[driftB_36s_ease-in-out_infinite_alternate]" />
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
    </div>
  );
}

export function Sidebar({
  items,
  tab,
  setTab,
  changed,
  editCount,
}: {
  items: NavItem[];
  tab: string;
  setTab: (t: string) => void;
  changed: boolean;
  editCount: number;
}) {
  return (
    <aside className="sticky top-0 hidden h-svh w-[264px] shrink-0 flex-col border-e border-line/10 bg-ink-900/70 px-4 py-5 backdrop-blur-xl lg:flex">
      <Link href="/" className="flex items-center gap-3 px-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[linear-gradient(135deg,rgb(var(--mint)),rgb(var(--electric)))] font-serif text-sm font-semibold text-ink-900">MT</span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-bone-50">Studio</span>
          <span className="block text-[11px] uppercase tracking-[0.2em] text-bone-400">Portfolio v2</span>
        </span>
      </Link>

      <nav aria-label="Dashboard sections" className="mt-8 grid gap-1">
        {items.map((it) => {
          const on = tab === it.id;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => setTab(it.id)}
              aria-current={on ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors ${
                on ? "bg-ink-700 text-bone-50" : "text-bone-300 hover:bg-ink-800 hover:text-bone-50"
              }`}
            >
              {on ? <span className="absolute inset-y-2 start-0 w-[3px] rounded-full bg-[linear-gradient(rgb(var(--mint)),rgb(var(--electric)))]" /> : null}
              <span className={on ? "text-mint" : "text-bone-400 group-hover:text-mint"}>{ICONS[it.icon]}</span>
              <span className="flex-1">{it.label}</span>
              {it.count ? <span className="rounded-full bg-electric/15 px-1.5 text-[11px] tabular-nums text-electric">{it.count}</span> : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-line/10 bg-ink-800/80 p-4">
        <p className="flex items-center gap-2 text-xs text-bone-300">
          <span className={`h-2 w-2 rounded-full ${changed ? "bg-electric animate-pulse" : "bg-mint"}`} />
          {changed ? `${editCount} unpublished edit${editCount === 1 ? "" : "s"}` : "In sync with the live site"}
        </p>
        <button
          type="button"
          onClick={() => setTab("publish")}
          className="cta-blend mt-3 w-full rounded-xl py-2.5 text-sm font-semibold"
        >
          Publish
        </button>
        <p className="mt-3 text-center text-[11px] text-bone-500">
          <kbd className="rounded border border-line/20 px-1">Ctrl</kbd> <kbd className="rounded border border-line/20 px-1">K</kbd> to jump anywhere
        </p>
      </div>
    </aside>
  );
}

export function MobileNav({ items, tab, setTab }: { items: NavItem[]; tab: string; setTab: (t: string) => void }) {
  return (
    <nav aria-label="Dashboard sections" className="fixed inset-x-0 bottom-0 z-40 flex gap-1 overflow-x-auto border-t border-line/10 bg-ink-900/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur-xl [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
      {items.map((it) => {
        const on = tab === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => setTab(it.id)}
            aria-current={on ? "page" : undefined}
            className={`flex min-w-[68px] shrink-0 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[11px] ${on ? "bg-ink-700 text-mint" : "text-bone-400"}`}
          >
            {ICONS[it.icon]}
            {it.label.split(" ")[0]}
          </button>
        );
      })}
    </nav>
  );
}

/** The real site in a frame, fed the draft on every edit. */
export function LivePreview({ doc, onClose }: { doc: Overrides; onClose: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [page, setPage] = useState("/");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem("mt_preview", "1");
    } catch {}
  }, []);

  // push the draft in, debounced, once the page inside has loaded
  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => {
      frame.current?.contentWindow?.postMessage({ type: "mt-draft", doc }, location.origin);
    }, 350);
    return () => clearTimeout(id);
  }, [doc, ready]);

  return (
    <section className="sticky top-0 hidden h-svh w-[44%] max-w-[760px] shrink-0 flex-col border-s border-line/10 bg-ink-900/60 backdrop-blur-xl xl:flex">
      <div className="flex items-center gap-2 border-b border-line/10 px-4 py-3">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-bone-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
          </span>
          Live
        </span>
        <select
          value={page}
          onChange={(e) => {
            setReady(false);
            setPage(e.target.value);
          }}
          aria-label="Page to preview"
          className="ms-2 min-h-[32px] rounded-lg border border-line/15 bg-ink-800 px-2 text-xs text-bone-100 outline-none"
        >
          {PAGES.map((p) => (
            <option key={p.path} value={p.path}>{p.label}</option>
          ))}
          {projects.map((p) => (
            <option key={p.slug} value={`/work/${p.slug}/`}>Case · {p.client.split(" · ")[0]}</option>
          ))}
        </select>
        <div className="ms-auto flex gap-1 rounded-lg border border-line/15 bg-ink-800 p-0.5">
          {(["desktop", "mobile"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDevice(d)}
              aria-pressed={device === d}
              className={`rounded-md px-2.5 py-1 text-xs capitalize ${device === d ? "bg-mint font-semibold text-ink-900" : "text-bone-300"}`}
            >
              {d}
            </button>
          ))}
        </div>
        <button type="button" onClick={onClose} aria-label="Hide preview" className="grid h-8 w-8 place-items-center rounded-lg text-bone-400 hover:text-mint">
          ✕
        </button>
      </div>
      <div className="flex flex-1 items-start justify-center overflow-hidden p-4">
        <div
          className={`h-full overflow-hidden rounded-xl border border-line/15 bg-ink-800 shadow-2xl transition-all duration-500 ${
            device === "mobile" ? "w-[390px] max-w-full" : "w-full"
          }`}
        >
          <iframe
            ref={frame}
            key={page}
            src={withBase(page)}
            title="Live preview"
            onLoad={() => setReady(true)}
            className="h-full w-full bg-white"
          />
        </div>
      </div>
    </section>
  );
}

type Cmd = { label: string; group: string; run: () => void };

export function Palette({
  open,
  setOpen,
  items,
  setTab,
  actions,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  items: NavItem[];
  setTab: (t: string) => void;
  actions: Cmd[];
}) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const cmds: Cmd[] = useMemo(
    () => [
      ...items.map((it) => ({ label: it.label, group: "Go to", run: () => setTab(it.id) })),
      ...actions,
      ...projects.map((p) => ({ label: `Edit project · ${p.title}`, group: "Projects", run: () => setTab("projects") })),
      ...articles.map((a) => ({ label: `Edit article · ${a.title}`, group: "Articles", run: () => setTab("articles") })),
    ],
    [items, actions, setTab]
  );
  const list = cmds.filter((c) => c.label.toLowerCase().includes(q.toLowerCase())).slice(0, 9);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    setQ("");
    setI(0);
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-start bg-black/60 px-4 pt-[14vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-line/15 bg-ink-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setI(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") setI((x) => Math.min(x + 1, list.length - 1));
            if (e.key === "ArrowUp") setI((x) => Math.max(x - 1, 0));
            if (e.key === "Enter" && list[i]) {
              list[i].run();
              setOpen(false);
            }
          }}
          placeholder="Jump to a section, project, article or action…"
          className="w-full border-b border-line/10 bg-transparent px-5 py-4 text-base text-bone-50 outline-none placeholder:text-bone-500"
        />
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {list.map((c, k) => (
            <li key={c.group + c.label}>
              <button
                type="button"
                onMouseEnter={() => setI(k)}
                onClick={() => {
                  c.run();
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start text-sm ${k === i ? "bg-ink-700 text-bone-50" : "text-bone-200"}`}
              >
                <span className="truncate">{c.label}</span>
                <span className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-bone-500">{c.group}</span>
              </button>
            </li>
          ))}
          {!list.length ? <li className="px-3 py-6 text-center text-sm text-bone-400">Nothing matches.</li> : null}
        </ul>
      </div>
    </div>
  );
}
