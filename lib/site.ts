export const site = {
  name: "Mohamed Tarek",
  role: "Sr Designer, Team Lead",
  roleFull: "Sr Designer, Team Lead",
  title: "Mohamed Tarek, Sr Designer, Team Lead | Graphic Design & Art Direction",
  description:
    "Mohamed Tarek is a Sr Designer and Team Lead based in Egypt, working across Egypt, Saudi Arabia and Kuwait. He builds brand identities, ad campaigns, social media systems, key visuals and motion, and is available for full-time, remote, freelance and hybrid roles.",
  availability: "Full-time · Remote · Freelance · Hybrid",
  // Canonical origin. Every canonical tag, Open Graph URL, sitemap entry
  // and JSON-LD @id is built from this, so on a new host it MUST be the new
  // address -- left pointing at the old one, all 15 pages would tell Google the
  // real version lives somewhere else and the new domain would never rank.
  //
  // Set NEXT_PUBLIC_SITE_URL at build time when deploying anywhere other than
  // the current GitHub Pages address. No trailing slash.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://mohamed-sr-designer.github.io/mohamed-tarek-portfolio-v2",
  email: "mohamed.tarek.ahmed1@gmail.com",
  phoneDisplay: "+20 10 1145 8929",
  phone: "+201011458929",
  whatsappDisplay: "+20 122 874 8098",
  whatsapp: "201228748098",
  linkedin: "https://www.linkedin.com/in/mohamedrk/",
  linkedinHandle: "/in/mohamedrk",
  github: "https://github.com/Mohamed-sr-Designer",
  location: "Egypt",
  markets: "Egypt · Saudi Arabia · Kuwait",
};

// `copy` is what lands on the clipboard, the raw, usable value rather than
// the prettified one shown on screen.
export const contacts = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    copy: site.email,
  },
  {
    label: "WhatsApp",
    value: site.whatsappDisplay,
    href: `https://wa.me/${site.whatsapp}`,
    copy: `+${site.whatsapp}`,
  },
  {
    label: "Phone",
    value: site.phoneDisplay,
    href: `tel:${site.phone}`,
    copy: site.phone,
  },
  {
    label: "LinkedIn",
    value: site.linkedinHandle,
    href: site.linkedin,
    copy: site.linkedin,
  },
];

export const nav = [
  { label: "Work", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

