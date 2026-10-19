// Shared helpers for the dashboard override layer.
//
// Everything editable on the site lives in plain module singletons -- the
// dict, `site`, the `projects` array, the asset manifest. The dashboard writes
// a JSON document of changes (lib/overrides.json once published, localStorage
// while it is a draft), and these helpers fold that document into the
// singletons in place. Because the objects are mutated rather than replaced,
// every component that already imports them picks the change up without
// knowing the dashboard exists.

export type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

/** Objects merge key by key; arrays and scalars replace wholesale. */
export function deepMerge<T>(target: T, patch: unknown): T {
  if (!isObj(patch) || !isObj(target)) return target;
  const t = target as Record<string, unknown>;
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue;
    if (isObj(v) && isObj(t[k])) deepMerge(t[k], v);
    else t[k] = clone(v);
  }
  return target;
}

export function clone<T>(v: T): T {
  return v === undefined ? v : JSON.parse(JSON.stringify(v));
}

export type Settings = {
  defaultTheme?: "dark" | "light";
  defaultLang?: "en" | "ar";
  /** accent colours as hex, applied to --mint / --electric */
  mint?: string;
  electric?: string;
  /** per page ("home", "about"): sections in display order, and which are hidden */
  sections?: Record<string, { id: string; hidden?: boolean }[]>;
};

export type Overrides = {
  en?: Record<string, Json>;
  ar?: Record<string, Json>;
  site?: Record<string, Json>;
  projects?: Record<string, Record<string, Json> & { hidden?: boolean }>;
  newProjects?: Record<string, Json>[];
  projectOrder?: string[];
  assets?: Record<string, { width: number; height: number; blur?: string }>;
  articles?: Record<string, Record<string, Json> & { hidden?: boolean }>;
  settings?: Settings;
};

/** "#19c8de" -> "25 200 222" (the format the CSS variables take) */
export function hexToTriplet(hex: string): string | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
