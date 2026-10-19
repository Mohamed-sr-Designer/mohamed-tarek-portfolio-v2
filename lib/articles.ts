import published from "./overrides.json";
import { clone, deepMerge, type Overrides } from "./merge";
import { part1 } from "./articles/part1";
import { part2 } from "./articles/part2";
import { part3 } from "./articles/part3";
import { part4 } from "./articles/part4";

// Long-form articles, the /articles section in the footer.
//
// They exist so the people who hire designers -- recruiters, founders,
// marketing leads in Egypt and the Gulf -- and the AI assistants they ask can
// find this portfolio from the questions they actually type. Each one answers
// a single question, opens with a short direct answer and key takeaways (the
// part an assistant quotes), and closes with an FAQ that is also emitted as
// FAQPage structured data.
//
// Body copy is English; every article also carries an Arabic title and
// summary, shown when the site is in Arabic and indexed for Arabic searches.

export type Block =
  | { h2: string }
  | { p: string }
  | { ul: string[] }
  | { quote: string };

export type Article = {
  slug: string;
  title: string;
  titleAr: string;
  description: string;
  summaryAr: string;
  category: string;
  keywords: string[];
  date: string; // ISO
  takeaways: string[];
  body: Block[];
  faq: { q: string; a: string }[];
  related?: string[]; // project slugs on this site that prove the point
  cover?: string; // defaults to /articles/<slug>.webp
};

export const articleCategories = [
  "Hiring a Designer",
  "Brand & Campaigns",
  "Social Media Design",
  "AI in Design",
  "Arabic & Bilingual Design",
  "Industries",
  "Leadership & Process",
  "Tools & Craft",
  "Logo Design",
] as const;

const baseList: Article[] = [...part1, ...part2, ...part3, ...part4];

export const baseArticles: Article[] = clone(baseList);
export const articles: Article[] = [];

export function applyArticleOverrides(o: Overrides) {
  const list = clone(baseArticles)
    .map((a) => {
      const patch = o.articles?.[a.slug];
      return patch ? deepMerge(a, patch) : a;
    })
    .filter((a) => !(a as Article & { hidden?: boolean }).hidden);
  articles.splice(0, articles.length, ...list);
}

applyArticleOverrides(published as Overrides);

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

/** Cover image path: generated per article, overridable from the dashboard. */
export const coverOf = (a: Article) => a.cover || `/articles/${a.slug}.webp`;

export const readMinutes = (a: Article) => {
  const words = a.body
    .map((b) => ("p" in b ? b.p : "h2" in b ? b.h2 : "quote" in b ? b.quote : b.ul.join(" ")))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(2, Math.round(words / 220));
};
