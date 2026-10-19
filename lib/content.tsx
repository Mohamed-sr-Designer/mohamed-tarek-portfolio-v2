"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import published from "./overrides.json";
import { applyDictOverrides } from "./dict";
import { applyProjectOverrides } from "./projects";
import { applySiteOverrides } from "./site";
import { applyAssetOverrides } from "./assets";
import { applyArticleOverrides } from "./articles";
import { clone, hexToTriplet, type Overrides, type Settings } from "./merge";

// Runtime side of the dashboard.
//
// Published edits are already baked in at build time (each data module folds
// lib/overrides.json into itself on import). What happens here is the draft:
// when the dashboard turns preview on, the draft document sits in
// localStorage, and on load it is folded over the base data the same way, then
// the tree remounts once so every component reads the new values.

import { DRAFT_KEY, EDITION_KEY, PREVIEW_KEY, THEME_KEY } from "./theme-boot";
export { DRAFT_KEY, PREVIEW_KEY, THEME_KEY };

export const publishedOverrides = published as Overrides;

export function readDraft(): Overrides | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Overrides) : null;
  } catch {
    return null;
  }
}

export function previewOn(): boolean {
  try {
    // localStorage: the dashboard's Preview button; sessionStorage: the live
    // preview pane inside the dashboard (same tab, so the iframe shares it)
    return localStorage.getItem(PREVIEW_KEY) === "1" || sessionStorage.getItem(PREVIEW_KEY) === "1";
  } catch {
    return false;
  }
}

/** Folds a whole document into every data module, starting from the base. */
export function applyAll(o: Overrides) {
  applyDictOverrides(o);
  applyProjectOverrides(o);
  applySiteOverrides(o);
  applyAssetOverrides(o);
  applyArticleOverrides(o);
}

export function applySettingsToDocument(s: Settings | undefined) {
  const el = document.documentElement;
  const mint = s?.mint && hexToTriplet(s.mint);
  const electric = s?.electric && hexToTriplet(s.electric);
  if (mint) el.style.setProperty("--mint", mint);
  else el.style.removeProperty("--mint");
  if (electric) el.style.setProperty("--electric", electric);
  else el.style.removeProperty("--electric");
}

type ContentCtx = {
  settings: Settings;
  draft: boolean;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  /** the GTA VI Edition skin, on top of either theme */
  gta: boolean;
  setGta: (on: boolean) => void;
};

const Ctx = createContext<ContentCtx>({
  settings: {},
  draft: false,
  theme: "dark",
  setTheme: () => {},
  gta: false,
  setGta: () => {},
});

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(
    () => clone(publishedOverrides.settings ?? {})
  );
  const [draft, setDraft] = useState(false);
  const [version, setVersion] = useState(0);
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [gta, setGtaState] = useState(false);

  useEffect(() => {
    let s = publishedOverrides.settings;
    if (previewOn()) {
      const d = readDraft();
      if (d) {
        applyAll(d);
        s = d.settings;
        setDraft(true);
        setVersion((v) => v + 1);
      }
    }
    setSettings(clone(s ?? {}));
    applySettingsToDocument(s);
    // the pre-paint script in <head> already set the attribute; mirror it
    const current = document.documentElement.dataset.theme;
    setThemeState(current === "light" ? "light" : "dark");
    setGtaState(document.documentElement.dataset.edition === "gta");

    // Live preview: the dashboard posts the draft into this page (when it is
    // the iframe in the dashboard) on every edit, so changes show while typing.
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== location.origin) return;
      const m = e.data as { type?: string; doc?: Overrides };
      if (m?.type !== "mt-draft" || !m.doc) return;
      applyAll(m.doc);
      setSettings(clone(m.doc.settings ?? {}));
      applySettingsToDocument(m.doc.settings);
      setDraft(true);
      setVersion((v) => v + 1);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const setGta = useCallback((on: boolean) => {
    setGtaState(on);
    if (on) document.documentElement.dataset.edition = "gta";
    else delete document.documentElement.dataset.edition;
    try {
      if (on) localStorage.setItem(EDITION_KEY, "gta");
      else localStorage.removeItem(EDITION_KEY);
    } catch {}
  }, []);

  const setTheme = useCallback((t: "dark" | "light") => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {}
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", t === "light" ? "#F5F7F8" : "#080E12");
  }, []);

  return (
    <Ctx.Provider value={{ settings, draft, theme, setTheme, gta, setGta }}>
      {/* the key remounts the tree once after a draft is folded in */}
      <div key={version} className="contents">
        {children}
      </div>
      {draft ? <DraftBar /> : null}
    </Ctx.Provider>
  );
}

export function useContent() {
  return useContext(Ctx);
}

function DraftBar() {
  // inside the dashboard preview pane the dashboard already says it is a draft
  if (typeof window !== "undefined" && window.self !== window.top) return null;
  return (
    <div className="fixed left-1/2 top-[76px] z-[120] flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full md:bottom-4 md:top-auto border border-electric/50 bg-ink-800/95 py-2 pl-4 pr-2 text-xs text-bone-50 shadow-2xl backdrop-blur-md">
      <span className="h-2 w-2 rounded-full bg-electric" aria-hidden />
      Draft preview, not published
      <button
        type="button"
        onClick={() => {
          try {
            localStorage.removeItem(PREVIEW_KEY);
          } catch {}
          location.reload();
        }}
        className="rounded-full border border-line/25 px-3 py-1.5 hover:border-mint/60 hover:text-mint"
      >
        Exit
      </button>
    </div>
  );
}
