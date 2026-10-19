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

import { DRAFT_KEY, PREVIEW_KEY, THEME_KEY } from "./theme-boot";
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
    return localStorage.getItem(PREVIEW_KEY) === "1";
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
};

const Ctx = createContext<ContentCtx>({
  settings: {},
  draft: false,
  theme: "dark",
  setTheme: () => {},
});

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(
    () => clone(publishedOverrides.settings ?? {})
  );
  const [draft, setDraft] = useState(false);
  const [version, setVersion] = useState(0);
  const [theme, setThemeState] = useState<"dark" | "light">("dark");

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
    <Ctx.Provider value={{ settings, draft, theme, setTheme }}>
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
