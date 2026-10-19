"use client";

import { Fragment } from "react";
import { useContent } from "@/lib/content";

// Renders a page's sections in the order, and with the visibility, saved from
// the dashboard. Sections the settings do not mention keep their default slot
// after the ones that are listed.
export default function Sections({
  page,
  items,
}: {
  page: string;
  items: { id: string; node: React.ReactNode }[];
}) {
  const { settings } = useContent();
  const saved = settings.sections?.[page];
  if (!saved?.length) return <>{items.map((s) => <Fragment key={s.id}>{s.node}</Fragment>)}</>;

  const rank = new Map(saved.map((s, i) => [s.id, i]));
  const hidden = new Set(saved.filter((s) => s.hidden).map((s) => s.id));
  const ordered = items
    .map((s, i) => ({ s, i }))
    .sort((a, b) => (rank.get(a.s.id) ?? 1e3 + a.i) - (rank.get(b.s.id) ?? 1e3 + b.i))
    .map(({ s }) => s)
    .filter((s) => !hidden.has(s.id));
  return <>{ordered.map((s) => <Fragment key={s.id}>{s.node}</Fragment>)}</>;
}
