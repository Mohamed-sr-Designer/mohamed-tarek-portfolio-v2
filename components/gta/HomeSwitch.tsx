"use client";

import { useContent } from "@/lib/content";

// The home page is a different page in the GTA VI Edition: the game-mode
// layout replaces the standard sections entirely, rather than restyling them.
export default function HomeSwitch({
  game,
  children,
}: {
  game: React.ReactNode;
  children: React.ReactNode;
}) {
  const { gta } = useContent();
  return <>{gta ? game : children}</>;
}
