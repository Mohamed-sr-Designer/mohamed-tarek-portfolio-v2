"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site, contacts } from "@/lib/site";
import { useLang } from "@/lib/i18n";
import CopyButton from "@/components/ui/CopyButton";

// Glassy contact card opened from the header "Let's talk" — same details as
// the contact page, without leaving the current page.
export function openContact() {
  window.dispatchEvent(new CustomEvent("open-contact"));
}

export default function ContactModal() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener("open-contact", on);
    return () => window.removeEventListener("open-contact", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.documentElement.classList.remove("modal-open");
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink-900/60 p-0 backdrop-blur-xl sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.contact.label}
            dir={lang === "ar" ? "rtl" : "ltr"}
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-line/12 bg-ink-800 p-7 shadow-[0_30px_120px_-30px_rgb(var(--fg)/0.35)] sm:rounded-3xl md:p-9"
          >
            {/* soft glow behind the glass */}
            <div aria-hidden className="blend-field opacity-45" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-mint">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
                  </span>
                  {t.hero.avail}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-bone-50 md:text-4xl">
                  {t.contact.h2a}{" "}
                  <span className="font-serif font-normal italic text-mint">
                    {t.contact.h2i}
                  </span>
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.master.close}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line/20 text-bone-200 transition-colors hover:border-mint/60 hover:text-mint"
              >
                ✕
              </button>
            </div>

            <p className="relative mt-4 text-sm leading-relaxed text-bone-300">
              {t.contact.body}
            </p>

            {/* channels — the row opens the channel, the button copies it */}
            <div className="relative mt-7 grid gap-2">
              {contacts.map((c) => (
                <div
                  key={c.label}
                  className="group flex items-center gap-3 rounded-2xl border border-line/10 bg-ink-900 px-5 py-4 transition-colors duration-300 focus-within:border-mint/40 hover:border-mint/40 hover:bg-ink-700/60"
                >
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      c.href.startsWith("http") ? "noopener noreferrer" : undefined
                    }
                    aria-label={`${t.contact.open} ${
                      t.contact.labels[c.label] ?? c.label
                    }`}
                    className="min-w-0 flex-1"
                  >
                    <span className="block text-[11px] uppercase tracking-ultra text-bone-500">
                      {t.contact.labels[c.label] ?? c.label}
                    </span>
                    <span
                      className="mt-0.5 block truncate text-sm text-bone-50 transition-colors group-hover:text-mint"
                      dir="ltr"
                    >
                      {c.value}
                    </span>
                  </a>
                  <CopyButton
                    value={c.copy}
                    label={t.contact.labels[c.label] ?? c.label}
                    copyLabel={t.contact.copy}
                    copiedLabel={t.contact.copied}
                  />
                </div>
              ))}
            </div>

            {/* primary action — brand orange with white type, so it reads as
                the one thing to press rather than another neutral pill */}
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-blend relative mt-5 block rounded-full px-6 py-3.5 text-center text-sm font-semibold shadow-[0_10px_30px_-12px_rgb(var(--mint)/0.6)] hover:scale-[1.02]"
            >
              {t.contact.startProject}
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
