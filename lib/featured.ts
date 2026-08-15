// LinkedIn "Featured" posts, mirrored on the About page.
//
export const PROFILE_ACTIVITY =
  "https://www.linkedin.com/in/mohamedrk/recent-activity/all/";

export type FeaturedPost = {
  slug: string;
  image: string;
  reactions?: number;
  comments?: number;
  reposts?: number;
  url: string;
};

// Three AI-workflow posts. The leadership photo and the speaking clip were
// pulled: they sat oddly next to the craft breakdowns and neither carried the
// reach the other three do.
//
// Share-tracking query strings (utm_source, rcm and friends) are stripped from
// the permalinks — they identify the share that produced the link and have no
// business in a public portfolio.
export const featured: FeaturedPost[] = [
  {
    slug: "skin-texture",
    image: "/featured/skin-texture.webp",
    reactions: 699,
    comments: 37,
    reposts: 104,
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7362583005082566658/",
  },
  {
    slug: "nano-banana",
    image: "/featured/nano-banana.webp",
    reactions: 534,
    comments: 28,
    reposts: 107,
    url: "https://www.linkedin.com/posts/mohamedrk_nano-banana-activity-7368567112853811201-RpFe",
  },
  {
    slug: "ai-photo-session",
    image: "/featured/ai-photo-session.webp",
    reactions: 523,
    comments: 20,
    reposts: 47,
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7318136606383611907/",
  },
];
