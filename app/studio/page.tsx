import type { Metadata } from "next";
import StudioApp from "@/components/studio/Studio";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <StudioApp />;
}
