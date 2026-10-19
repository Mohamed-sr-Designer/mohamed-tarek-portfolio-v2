"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n";
import { type Lang } from "@/lib/dict";

// The language control lives down here now rather than in the header.
//
// It is a pair rather than the single toggle the nav carried: a lone button
// labelled "عربي" has to be read as "switch to Arabic" rather than as a state,
// and there is nothing to tell you which language you are already in. Two
// options with the current one marked answer both at a glance, and each is
// named in its own language so it is legible whichever one you arrived in.
const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

export default function Footer() {
  const { t, lang, setLang } = useLang();
  const year = new Date().getFullYear();

  const links = [
    { label: t.nav.work, href: "/" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.contact, href: "/contact" },
  ];

  // v2: every page beyond the three main ones lives here, not in the header.
  // The dashboard link is here for now, until it gets a quieter home.
  const more = [
    { label: t.footer.articles, href: "/articles" },
    { label: t.footer.dashboard, href: "/studio" },
  ];

  const social = [
    { label: "LinkedIn", value: site.linkedinHandle, href: site.linkedin },
    {
      label: t.contact.labels.WhatsApp,
      value: site.whatsappDisplay,
      href: `https://wa.me/${site.whatsapp}`,
    },
    {
      label: t.contact.labels.Email,
      value: site.email,
      href: `mailto:${site.email}`,
    },
  ];

  return (
    <footer className="border-t border-line/10">
      <div className="container-edge mx-auto max-w-edge py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* identity */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-line/20 font-serif text-xs text-bone-200">
                MT
              </span>
              <span className="text-bone-50">{site.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-400">
              {t.footer.blurb}
            </p>
          </div>

          {/* site nav */}
          <nav className="grid grid-cols-2 gap-8 md:col-span-4" aria-label="Footer">
            <div>
            <p className="text-xs uppercase tracking-ultra text-bone-500">
              {t.footer.siteCol}
            </p>
            <ul className="mt-4 grid gap-2 text-sm">
              {links.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="inline-flex min-h-[40px] items-center text-bone-300 transition-colors hover:text-bone-50"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-ultra text-bone-500">
                {t.footer.moreCol}
              </p>
              <ul className="mt-4 grid gap-2 text-sm">
                {more.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="inline-flex min-h-[40px] items-center text-bone-300 transition-colors hover:text-bone-50"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* social / contact */}
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-ultra text-bone-500">
              {t.footer.connectCol}
            </p>
            <ul className="mt-4 grid gap-3 text-sm">
              {social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      s.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group block"
                  >
                    <span className="block text-xs uppercase tracking-ultra text-bone-500">
                      {s.label}
                    </span>
                    {/* numbers, handles and addresses stay left-to-right in Arabic */}
                    <span dir="ltr" className="mt-0.5 block break-words text-bone-300 transition-colors group-hover:text-bone-50 rtl:text-right">
                      {s.value} ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-line/10 pt-6 text-sm text-bone-500 md:flex-row md:items-center md:justify-between">
          <p className="order-2 md:order-1">
            © {year} {site.name}. {t.footer.rights}
          </p>

          <div className="order-1 flex flex-wrap items-center gap-x-5 gap-y-3 md:order-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs uppercase tracking-ultra text-bone-500">
                {t.footer.language}
              </span>
              <div
                role="group"
                aria-label={t.footer.language}
                className="inline-flex items-center gap-1 rounded-full border border-line/20 bg-ink-800 p-1"
              >
                {LANGS.map((l) => {
                  const on = lang === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      lang={l.code}
                      onClick={() => setLang(l.code)}
                      aria-current={on ? "true" : undefined}
                      className={`min-h-[40px] rounded-full border px-4 text-sm transition-colors duration-300 ${
                        on
                          ? "cta-blend border-transparent font-semibold"
                          : "border-line/20 bg-ink-700 text-bone-200 hover:border-mint/50 hover:text-bone-50"
                      }`}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* a button, not #top: only the home page has a #top anchor */}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="link-underline min-h-[40px] text-bone-300"
            >
              {t.footer.backTop}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
