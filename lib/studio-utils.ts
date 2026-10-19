// Path helpers for the dashboard's override document.
import { clone, deepMerge } from "./merge";

export type Path = (string | number)[];

export function getAt(obj: unknown, path: Path): unknown {
  let cur: unknown = obj;
  for (const k of path) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string | number, unknown>)[k];
  }
  return cur;
}

export function setAt<T extends object>(obj: T, path: Path, value: unknown): T {
  let cur = obj as Record<string | number, unknown>;
  path.forEach((k, i) => {
    if (i === path.length - 1) {
      cur[k] = value;
      return;
    }
    const next = cur[k];
    if (next == null || typeof next !== "object") {
      cur[k] = typeof path[i + 1] === "number" ? [] : {};
    }
    cur = cur[k] as Record<string | number, unknown>;
  });
  return obj;
}

/** Removes the value at path and prunes objects left empty by it. */
export function deleteAt<T extends object>(obj: T, path: Path): T {
  if (!path.length) return obj;
  const parent = getAt(obj, path.slice(0, -1));
  if (parent && typeof parent === "object") {
    delete (parent as Record<string | number, unknown>)[path[path.length - 1]];
    if (
      !Array.isArray(parent) &&
      Object.keys(parent as object).length === 0 &&
      path.length > 1
    )
      deleteAt(obj, path.slice(0, -1));
  }
  return obj;
}

/** base with the override folded over it (arrays replace wholesale). */
export function effective<T>(base: T, override: unknown): T {
  return deepMerge(clone(base), override ?? {});
}

/**
 * Writing inside an array means writing the whole array (arrays replace on
 * merge). Returns the path to write at and the value to write.
 */
export function writeTarget(
  effectiveRoot: unknown,
  path: Path,
  value: unknown
): { path: Path; value: unknown } {
  const firstNum = path.findIndex((k) => typeof k === "number");
  if (firstNum === -1) return { path, value };
  const arrPath = path.slice(0, firstNum);
  const arr = clone(getAt(effectiveRoot, arrPath)) as unknown[];
  setAt(arr as unknown as object, path.slice(firstNum), value);
  return { path: arrPath, value: arr };
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || `item-${Date.now()}`;
