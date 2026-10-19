import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  Fraunces,
  Alexandria,
  Anton,
} from "next/font/google";
import { site } from "@/lib/site";
import { LangProvider } from "@/lib/i18n";
import { ContentProvider } from "@/lib/content";
import { themeBootScript } from "@/lib/theme-boot";
import published from "@/lib/overrides.json";
import type { Overrides } from "@/lib/merge";

const defaultTheme =
  (published as Overrides).settings?.defaultTheme === "light" ? "light" : "dark";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

// GTA VI Edition only: the tall condensed display face for its headlines
const gta = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gta",
  display: "swap",
});

const arabic = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ar",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: defaultTheme === "light" ? "#F5F7F8" : "#080E12",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Graphic Designer",
    "Art Director",
    "Freelance Graphic Designer",
    "Graphic Designer Egypt",
    "Graphic Designer Saudi Arabia",
    "Graphic Designer Kuwait",
    "Art Director Egypt",
    "Brand Identity Designer",
    "Social Media Designer",
    "Campaign Design",
    "Key Visuals",
    "Creative Direction",
    "AI Production",
    "Motion Design",
    "Hire Graphic Designer",
    "Sr Designer",
    "Team Lead",
    "Mohamed Tarek",
    "Portfolio",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: `${site.name} · Portfolio`,
    title: site.title,
    description: site.description,
    images: [{ url: `${site.url}/og.jpg`, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [`${site.url}/og.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Structured data — how search engines & AI assistants understand who this is.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      jobTitle: "Sr Designer, Team Lead",
      description: site.description,
      url: site.url,
      image: `${site.url}/me/portrait-2026.webp`,
      email: `mailto:${site.email}`,
      telephone: site.phone,
      address: { "@type": "PostalAddress", addressCountry: "EG" },
      workLocation: [
        { "@type": "Place", name: "Egypt" },
        { "@type": "Place", name: "Saudi Arabia" },
        { "@type": "Place", name: "Kuwait" },
      ],
      // Kept in step with the Capabilities block on /about: these are the
      // terms an assistant or a recruiter's search will match on.
      knowsAbout: [
        "Art Direction",
        "Design Team Leadership",
        "Brand Strategy",
        "Campaign Concept Development",
        "Key Visual Development",
        "Visual Identity Systems",
        "Advertising Campaigns",
        "AI Photo Production",
        "AI Video Production",
        "Prompt Engineering",
        "AI Voice-Over",
        "Retouching & Compositing",
        "Storyboarding",
        "Logotype Design",
        "Bilingual AR/EN Design",
        "Motion Design",
        "UI Design",
        "Landing Page Design",
        "Real Estate Marketing Design",
        "SaaS Marketing Design",
      ],
      knowsLanguage: ["ar", "en"],
      affiliation: [
        { "@type": "Organization", name: "SOIC — School of Cinema" },
        { "@type": "Organization", name: "EDUX Academy" },
        { "@type": "Organization", name: "Easily" },
        { "@type": "Organization", name: "Raya Academy" },
      ],
      sameAs: [site.linkedin, site.github],
      seeks: {
        "@type": "Demand",
        name: "Freelance, part-time and hybrid full-time graphic design & art direction roles",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: `${site.name} · Portfolio`,
      description: site.description,
      publisher: { "@id": `${site.url}/#person` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme={defaultTheme}
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${serif.variable} ${arabic.variable} ${gta.variable}`}
    >
      <head>
        {/* sets data-theme before first paint, so there is no flash */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript(defaultTheme) }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="bg-ink-900 font-sans text-bone-50 antialiased">
        <ContentProvider>
        <LangProvider>
          <SiteChrome />
          {children}
        </LangProvider>
        </ContentProvider>
      </body>
    </html>
  );
}
