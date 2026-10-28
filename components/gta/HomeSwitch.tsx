"use client";

import { useContent } from "@/lib/content";

// The home page is a different page in each edition: the GTA VI game-mode
// layout and the Minimal editorial layout replace the standard sections
// entirely, rather than restyling them.
export default function HomeSwitch({
  game,
  minimal,
  children,
}: {
  game: React.ReactNode;
  minimal: React.ReactNode;
  children: React.ReactNode;
}) {
  const { gta, minimal: min } = useContent();
  return <>{gta ? game : min ? minimal : children}</>;
}
