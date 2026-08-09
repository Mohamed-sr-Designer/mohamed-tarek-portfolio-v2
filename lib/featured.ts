// LinkedIn "Featured" posts, mirrored on the About page.
//
// `url` points at each individual post. The exact post permalinks were not in
// the source screenshots, so they currently fall back to the profile's
// activity feed — swap in the real hrefs and nothing else needs to change.
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
export const featured: FeaturedPost[] = [
  {
    slug: "skin-texture",
    image: "/featured/skin-texture.webp",
    reactions: 699,
    comments: 37,
    reposts: 104,
    url: PROFILE_ACTIVITY,
  },
  {
    slug: "nano-banana",
    image: "/featured/nano-banana.webp",
    reactions: 534,
    comments: 28,
    reposts: 107,
    url: PROFILE_ACTIVITY,
  },
  {
    slug: "ai-photo-session",
    image: "/featured/ai-photo-session.webp",
    reactions: 523,
    comments: 20,
    reposts: 47,
    url: PROFILE_ACTIVITY,
  },
];
