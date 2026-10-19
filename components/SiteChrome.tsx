"use client";

import { usePathname } from "next/navigation";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
import Cursor from "@/components/Cursor";
import ContactModal from "@/components/ContactModal";
import GtaLoader from "@/components/gta/GtaLoader";
import GtaHud from "@/components/gta/GtaHud";

// The site-wide extras: preloader, smooth scroll, custom cursor, WhatsApp
// button, contact modal. The dashboard is a working tool, so it gets none of
// them -- a hidden native cursor and a floating button over form fields would
// only get in the way there.
export default function SiteChrome() {
  const path = usePathname() ?? "";
  if (path.startsWith("/studio")) return null;
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <ScrollProgress />
      <Cursor />
      <WhatsAppButton />
      <ContactModal />
      <GtaLoader />
      <GtaHud />
    </>
  );
}
