"use client";

import { useContent } from "@/lib/content";

// The Minimal edition has its own editorial home, which replaces the standard
// sections entirely rather than restyling them.
export default function HomeSwitch({ minimal, children }: { minimal: React.ReactNode; children: React.ReactNode }) {
  const { minimal: min } = useContent();
  return <>{min ? minimal : children}</>;
}
