"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n";
import { openContact } from "@/components/ContactModal";
import ThemeToggle from "@/components/ThemeToggle";
import EditionToggle from "@/components/EditionToggle";
import { useContent } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t, lang } = useLang();
  const { gta } = useContent();

  // in the GTA VI Edition the menu reads like a game's pause menu
  const gameLabels =
    lang === "ar"
      ? { work: "المهمات", about: "ملف اللاعب", contact: "الهاتف", talk: "اتصل بمحمد" }
      : { work: "Missions", about: "Player", contact: "Phone", talk: "Call Mohamed" };
  const links = [
    { label: gta ? gameLabels.work : t.nav.work, href: "/" },
    { label: gta ? gameLabels.about : t.nav.about, href: "/about" },
    { label: gta ? gameLabels.contact : t.nav.contact, href: "/contact" },
  ];

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/" || pathname.startsWith("/work")
      : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b bg-ink-900/85 backdrop-blur-xl light:bg-ink-900/95 transition-all duration-500 ease-cinema ${
          scrolled ? "border-line/12 py-3" : "border-transparent py-5"
        }`}
      >
        <div className="container-edge mx-auto flex max-w-edge items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="Mohamed Tarek — home"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full border border-line/20 font-serif text-sm md:h-9 md:w-9 transition-colors duration-300 group-hover:border-mint/60 group-hover:text-mint">
              MT
            </span>
            <span className="hidden text-sm tracking-tight text-bone-200 xl:block">
              {site.name}
              <span className="text-bone-400"> {t.nav.roleTag}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`link-underline text-sm transition-colors ${
                  isActive(item.href)
                    ? "text-mint"
                    : "text-bone-200 hover:text-bone-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <EditionToggle />
            <ThemeToggle />
            <button
              type="button"
              onClick={openContact}
              className="cta-edge hidden rounded-full px-5 py-2 text-sm text-bone-50 md:inline-block"
            >
              {gta ? gameLabels.talk : t.nav.letsTalk}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span
                className={`h-px w-6 bg-bone-50 transition-all duration-300 ${
                  open ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-6 bg-bone-50 transition-all duration-300 ${
                  open ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink-900 px-8 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {links.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.1, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-4xl text-bone-50"
                  >
                    <span className="mr-3 align-top text-sm text-bone-400">
                      0{i + 1}
                    </span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openContact();
              }}
              className="cta-blend mt-10 w-fit rounded-full px-6 py-3 text-sm font-medium"
            >
              {gta ? gameLabels.talk : t.nav.letsTalk}
            </button>
            <a href={`mailto:${site.email}`} className="mt-6 text-sm text-mint">
              {site.email}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
