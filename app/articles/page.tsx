import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import ArticlesIndex from "@/components/ArticlesIndex";
import { articles } from "@/lib/articles";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Articles · Design, Hiring & AI",
  description:
    "Practical articles by Mohamed Tarek, Sr Designer and Team Lead, on hiring designers, brand campaigns, social media design, AI production and Arabic bilingual design in Egypt, Saudi Arabia and Kuwait.",
  alternates: { canonical: "/articles" },
};

export default function ArticlesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${site.url}/articles#page`,
        url: `${site.url}/articles`,
        name: "Articles · Design, Hiring & AI",
        isPartOf: { "@id": `${site.url}/#website` },
        author: { "@id": `${site.url}/#person` },
      },
      {
        "@type": "ItemList",
        itemListElement: articles.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${site.url}/articles/${a.slug}`,
          name: a.title,
        })),
      },
    ],
  };
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }}
      />
      <ArticlesIndex />
    </SiteShell>
  );
}
