export type GalleryItem = { src: string; caption?: string };

// A named gallery group (e.g. "Before" / "After") rendered with the same
// masonry markup the case template already uses.
export type GalleryGroup = { label: string; note?: string; items: GalleryItem[] };

export type WorkflowStep = { n: string; title: string; body: string };

// Production-workflow block: intro copy, numbered steps and key results,
// exactly as supplied in each project's Case Study Flow.txt.
export type Workflow = {
  title: string;
  intro: string[];
  stepsLabel: string;
  steps: WorkflowStep[];
  resultsLabel: string;
  results: string[];
  image?: string;
};

// Strategy block straight from the client proposal deck.
export type Strategy = {
  toneLabel: string;
  tone: string;
  toneTraits: string[];
  pillarsLabel: string;
  pillars: { n: string; title: string }[];
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  client: string;
  year: string;
  category: string;
  sector: string;
  discipline: string;
  accent: "electric" | "mint";
  simple?: boolean; // lighter page: banner + explanation + images, no deep case study
  summary: string;
  tagline: string;
  cover: string;
  hero: string;
  logo?: string;
  tags: string[];
  challenge?: string;
  strategy?: string;
  direction?: string;
  execution?: string;
  impact?: string;
  contribution: string[];
  gallery: GalleryItem[];
  // the three supporting posts on the home card, when the first three in the
  // gallery aren't the strongest ones to lead with
  cardPicks?: string[];
  galleries?: GalleryGroup[]; // named groups (Before / After / Characters …)
  workflow?: Workflow;
  strategyBlock?: Strategy;
  videoSlugs?: string[]; // entries from lib/motion.json shown as a video gallery
};

const g = (...srcs: string[]): GalleryItem[] => srcs.map((src) => ({ src }));

// helper: build a numbered run of image paths, e.g. seq("/work/x/before-", 1, 15)
const seq = (prefix: string, from: number, to: number, ext = ".webp") => {
  const out: string[] = [];
  for (let i = from; i <= to; i++)
    out.push(`${prefix}${String(i).padStart(2, "0")}${ext}`);
  return out;
};

export const projects: Project[] = [
  // ==========================================================  AI WORK FLOW
  {
    slug: "photo-sessions",
    index: "01",
    title: "AI Photo Sessions, Product Library at Scale",
    client: "Hospitality Amenities",
    year: "2025",
    category: "AI Photo Production",
    sector: "AI Workflow",
    discipline: "Photo Production · AI Imaging · Retouch",
    accent: "mint",
    summary:
      "A full product photo library built with a planned AI production flow, from plain reference shots to a premium, consistent set ready for campaigns.",
    tagline: "From plain product shots to a premium, consistent library.",
    cover: "/work/photo-sessions/after-01.webp",
    hero: "/work/photo-sessions/after-03.webp",
    tags: ["AI Photo Production", "Retouch", "Product", "Hospitality"],
    challenge:
      "The products needed a large, consistent image library for campaigns, social media and print. Shooting every angle and setup the traditional way would cost far more time and budget than the schedule allowed.",
    strategy:
      "I planned the whole session before producing anything: the products, the angles and the look were mapped first, then produced with AI imaging and finished with retouching, so every frame shares the same light, composition and premium feel.",
    contribution: ["Shot Planning", "AI Production", "Retouching", "Art Direction"],
    gallery: [],
    galleries: [
      {
        label: "Before",
        note: "What the client sent: plain product photographs, shot on the spot, with no consistent light or setting between them.",
        // 11 and 15 are byte-for-byte copies of 10 and 14, and 03 is two bits
        // off 02 — the same source shot submitted more than once.
        items: g(
          ...seq("/work/photo-sessions/before-", 1, 2),
          ...seq("/work/photo-sessions/before-", 4, 10),
          ...seq("/work/photo-sessions/before-", 12, 14)
        ),
      },
      {
        label: "After",
        note: "What was delivered: one library where every frame shares the same light, framing and premium feel, ready for campaigns, social and print.",
        items: g(...seq("/work/photo-sessions/after-", 1, 12)),
      },
    ],
    workflow: {
      title: "Photo Production Workflow",
      intro: [
        "Every photoshoot started with a structured production plan rather than spontaneous shooting. Each product, location, and angle was carefully mapped to ensure visual consistency and maximize content output from a single session.",
        "The process focused on capturing a diverse library of assets while maintaining the same lighting style, composition, and premium brand identity across every image.",
      ],
      stepsLabel: "Workflow",
      steps: [
        {
          n: "01",
          title: "Shot Planning",
          body: "Defined the required products, hero shots, supporting angles, and content objectives before the shoot.",
        },
        {
          n: "02",
          title: "Scene Setup",
          body: "Prepared the environment, lighting, props, and product placement to achieve a consistent premium aesthetic.",
        },
        {
          n: "03",
          title: "Capture Variations",
          body: "Captured multiple compositions, camera angles, close-ups, lifestyle moments, and detail shots for every setup.",
        },
        {
          n: "04",
          title: "Selection & Review",
          body: "Reviewed all captured assets, selected the strongest visuals, and organized them into structured collections.",
        },
        {
          n: "05",
          title: "Final Asset Library",
          body: "Delivered a scalable library of high-quality images ready for social media, advertising campaigns, website content, and print materials.",
        },
      ],
      resultsLabel: "Key Results",
      results: [
        "60+ High-Quality Assets",
        "Multiple Angles per Product",
        "Consistent Visual Identity",
        "Optimized Production Time",
        "Reusable Marketing Content",
        "Ready for Multi-Platform Campaigns",
      ],
      image: "/work/photo-sessions/flow.webp",
    },
  },
  {
    slug: "video-production",
    index: "02",
    title: "AI Video Production, One Connected System",
    client: "Campaign Production",
    year: "2025",
    category: "AI Video Production",
    sector: "AI Workflow",
    discipline: "Character Design · Scene Construction · Film",
    accent: "electric",
    summary:
      "A full campaign built as one connected production system, characters, scenes and story links planned first, so every shot works across several deliverables.",
    tagline: "One planned system, many films, instead of many separate shoots.",
    // a real scene from the film, not a character sheet
    cover: "/work/video-production/sc-01.webp",
    hero: "/work/video-production/sc-01.webp",
    tags: ["AI Video", "Character Design", "Storyboard", "Campaign"],
    challenge:
      "The campaign needed several videos at once, hero films, social cuts and supporting clips. Treating each one as its own project would break the visual language and repeat the same work again and again.",
    strategy:
      "I built the campaign as a single production system. Characters and scenes were defined up front and connected to each other, so one planned shot could serve several videos while the whole campaign kept one look.",
    contribution: ["Character Planning", "Scene Mapping", "Production Flow", "Art Direction"],
    gallery: [],
    galleries: [
      {
        label: "The cast",
        note: "Before a single scene was built, every character in the campaign was designed and locked: who they are, what they wear, how they look on camera. Fixing the cast first is what lets the same people appear across every film without the look drifting.",
        items: g(...seq("/work/video-production/char-", 1, 7)),
      },
      {
        label: "The scenes",
        note: "Every location the cast appears in, mapped out before filming. Because the scenes were planned around one fixed cast, a single shot could be cut into several different films instead of being shot again for each one.",
        items: g(...seq("/work/video-production/sc-", 1, 17)),
      },
    ],
    // no videoSlugs: the Final Videos block was pulled from this case
    workflow: {
      title: "Production Workflow",
      intro: [
        "Every asset in this campaign was planned before production to ensure consistency across all deliverables.",
        "The workflow started by defining the key characters and campaign scenarios, followed by mapping every scene into interconnected video sequences. Each shot was designed to be reusable across multiple deliverables, maximizing production efficiency while maintaining a consistent visual language.",
        "Instead of treating every video as a separate project, the campaign was built as one connected production system where every scene, character, and location contributes to multiple storytelling paths.",
      ],
      stepsLabel: "Process Breakdown",
      steps: [
        {
          n: "01",
          title: "Character Planning",
          body: "Defining all campaign characters, wardrobe, and appearance guidelines.",
        },
        {
          n: "02",
          title: "Scene Mapping",
          body: "Organizing every environment and production location before filming.",
        },
        {
          n: "03",
          title: "Story Connections",
          body: "Building relationships between scenes to allow content reuse across multiple videos.",
        },
        {
          n: "04",
          title: "Production Flow",
          body: "Planning the shooting order based on locations, actors, and production efficiency.",
        },
        {
          n: "05",
          title: "Content Distribution",
          body: "Exporting the production into multiple campaign assets including hero films, social videos, reels, cut-downs, and supporting content.",
        },
      ],
      resultsLabel: "Key Outcome",
      results: [
        "Unified creative direction",
        "Faster production process",
        "Efficient asset management",
        "Consistent storytelling",
        "Maximum content reuse",
        "Scalable campaign structure",
      ],
      image: "/work/video-production/flow.webp",
    },
  },

  // ====================================================  SOCIAL MEDIA DESIGNS
  {
    slug: "amam",
    index: "03",
    title: "Amam · Durrat Al Arous, Life on the Water",
    client: "Amam Real Estate · Durrat Al Arous",
    year: "2025",
    category: "Real Estate · Campaign",
    sector: "Real Estate",
    discipline: "Campaign · Social System · Bilingual",
    accent: "electric",
    summary:
      "A lifestyle campaign for a waterfront resort community, selling the weekend you get, not the square metres you buy.",
    tagline: "We sold the weekend, not the square metres.",
    cover: "/work/amam-re/01.webp",
    hero: "/work/amam-re/02.webp",
    tags: ["Real Estate", "Campaign", "Lifestyle", "Bilingual AR/EN"],
    challenge:
      "Durrat Al Arous is a resort destination, but most property advertising in the category sells floor plans and prices. Amam needed the feed to make people feel the life there before they ever asked about a unit.",
    strategy:
      "Lead with the moments people actually buy: jet skis at noon, a boat at sunset, family time by the pool. Every post shows a life first and the property second, held together by one calm Arabic type style and the same warm water light.",
    direction:
      "Sunlit blues and sand tones, wide open water, and unhurried lifestyle framing, premium without shouting.",
    execution:
      "A full campaign set of lifestyle key visuals and social posts covering watersports, villas, family time and sunset moments, all bilingual and ready for the feed.",
    impact:
      "A waterfront community that reads as a lifestyle brand, giving the sales team warm interest instead of cold price questions.",
    contribution: ["Campaign Direction", "Key Visuals", "Social System", "Bilingual Layout"],
    // 12 and 13 are dropped: they repeat the "كل إطلالة" villa-and-pool frame
    // that 09-11 already cover. 10 goes too — it is a byte-for-byte copy of 08.
    gallery: g(
      ...seq("/work/amam-re/", 1, 9),
      "/work/amam-re/11.webp",
      "/work/amam-re/14.webp"
    ),
    strategyBlock: {
      toneLabel: "Tone of voice",
      tone: "Warm, refined and human-centered, celebrating comfort, belonging, family connections and everyday moments through a seamless lifestyle experience that inspires ease and confidence.",
      toneTraits: ["Luxurious, never stiff", "Warm and close", "Confident, no hype"],
      pillarsLabel: "Content pillars",
      pillars: [
        { n: "01", title: "The project & units" },
        { n: "02", title: "Life at AMAM" },
        { n: "03", title: "Waterfront & marine lifestyle" },
        { n: "04", title: "Seasons & events" },
        { n: "05", title: "Moments" },
      ],
    },
  },
  {
    slug: "el-raghi",
    index: "04",
    title: "Al Rajhi, Built to Last",
    client: "Al Rajhi Union · Rawdah Residences",
    year: "2025",
    category: "Real Estate · Social",
    sector: "Real Estate",
    discipline: "Social Design · Key Visuals",
    accent: "electric",
    simple: true,
    summary:
      "Social media design for a residential development, architectural photography, quiet sunset light and confident Arabic type that signals quality.",
    tagline: "Built with care, so quality lasts for years.",
    cover: "/work/social/el-raghi/01.webp",
    hero: "/work/social/el-raghi/02.webp",
    tags: ["Real Estate", "Social Design", "Key Visuals"],
    contribution: ["Social Design", "Art Direction", "Retouch"],
    gallery: g(...seq("/work/social/el-raghi/", 1, 9)),
  },
  {
    slug: "tilal-v",
    index: "05",
    title: "Tilal Village, Where Life Finds Its Place",
    client: "Tilal Village · Makkah",
    year: "2025",
    category: "Real Estate · Social Campaign",
    sector: "Real Estate",
    discipline: "Campaign · Social System · Bilingual",
    accent: "mint",
    summary:
      "A social campaign for a residential community minutes from the Haram, built on belonging and family life, not floor plans.",
    tagline: "We sold belonging and faith, not square metres.",
    cover: "/work/tilal-social/01.webp",
    hero: "/work/tilal-social/03.webp",
    tags: ["Real Estate", "Campaign", "Bilingual AR/EN", "Social System"],
    challenge:
      "A premium community in Makkah, in a category where every developer advertises the same specifications. Tilal needed to sell the feeling of raising a family somewhere that means something.",
    strategy:
      "Being close to the Haram is not a feature, it is a way of life. I built the campaign on \"where life finds its place\": family moments, evening light and the city in the frame, so the location carries the message.",
    direction:
      "Golden evening light, classical facades and quiet family scenes, with one bilingual type system so every post is recognisably Tilal.",
    execution:
      "A rolling social system, hero campaign frames, lifestyle posts, interior reveals and aerials, plus the supporting website visual.",
    impact:
      "A development that reads as a home rather than an investment listing, and a feed that stays consistent as it scales.",
    contribution: ["Campaign Direction", "Key Visuals", "Social System", "Bilingual Layout"],
    // site.webp (the laptop mock-up of the website) is out: this is the social
    // campaign case, and a browser mock-up sat oddly among the campaign frames.
    //
    // 04 and 14 are gone too. Perceptual hashing put 03/04 four bits apart and
    // 11/14 one bit apart out of 256 — the same street shot and the same
    // bedroom, twice each. 15 was pulled by hand.
    gallery: g(
      ...seq("/work/tilal-social/", 1, 3),
      ...seq("/work/tilal-social/", 5, 13)
    ),
    // 03 and 04 are the same street shot, so the default first-three row showed
    // it twice. Hand-picked instead: a family moment, an interior and the
    // aerial, so the card spans people, product and place.
    cardPicks: [
      "/work/tilal-social/06.webp",
      "/work/tilal-social/12.webp",
      "/work/tilal-social/08.webp",
    ],
  },
  // Guilt Free takes the slot Fresh Valley used to hold in the social grid.
  {
    slug: "gf",
    index: "06",
    title: "Guilt Free, No Regrets, Just Flavour",
    client: "Guilt Free",
    year: "2025",
    category: "Food & Retail · Social",
    sector: "Food & Retail",
    discipline: "Social Design · Appetite Craft",
    accent: "mint",
    simple: true,
    summary:
      "Social media design for a healthy dessert brand, playful colour, flying crumbs and appetite-first framing that still feels light.",
    tagline: "Dessert that looks indulgent and still feels light.",
    // lead with the product shots, not the typographic posts
    cover: "/work/social/gf/06.webp",
    hero: "/work/social/gf/02.webp",
    tags: ["Food & Beverage", "Social Design", "Appetite Craft"],
    contribution: ["Social Design", "Art Direction", "Retouch"],
    gallery: g(...seq("/work/social/gf/", 1, 9)),
    cardPicks: [
      "/work/social/gf/09.webp",
      "/work/social/gf/03.webp",
      "/work/social/gf/08.webp",
    ],
  },
  {
    slug: "fresh-valley",
    index: "07",
    title: "Fresh Valley, Premium by Nature",
    client: "Fresh Valley",
    year: "2025",
    category: "Food & Retail · Social",
    sector: "Food & Retail",
    discipline: "AI Imaging · Prompt Engineering · Social Design",
    accent: "mint",
    simple: true,
    summary:
      "A full produce campaign generated with AI. Every frame was written as a prompt and produced in Google Flow, then art-directed into one consistent set: the same light, the same skin tones, the same appetite.",
    tagline: "Written as prompts, produced in Google Flow, directed into a set.",
    // numbering follows the source folder, so the hero is named rather than
    // shuffled to the front: 11 leads the card, 14 / 12 / 09 support it
    cover: "/work/social/fresh-valley/11.webp",
    hero: "/work/social/fresh-valley/11.webp",
    tags: [
      "AI Imaging",
      "Prompt Engineering",
      "Google Flow",
      "Food & Retail",
      "Social Design",
    ],
    contribution: [
      "Prompt Engineering",
      "AI Production (Google Flow)",
      "Art Direction",
      "Selection & Retouch",
    ],
    // the whole set is new: 15 AI-generated frames, in source-folder order
    gallery: g(...seq("/work/social/fresh-valley/", 1, 15)),
    cardPicks: [
      "/work/social/fresh-valley/14.webp",
      "/work/social/fresh-valley/12.webp",
      "/work/social/fresh-valley/09.webp",
    ],
  },
  {
    slug: "the-nine",
    index: "08",
    title: "THE NINE, Coffee & Kitchen",
    client: "THE NINE",
    year: "2025",
    category: "Food & Retail · Social",
    sector: "Food & Retail",
    discipline: "Social Design · Café Brand",
    accent: "mint",
    simple: true,
    summary:
      "Social media design for a specialty café, a black and white brand world where the food and the pour do all the talking.",
    tagline: "Specialty coffee, served with a clean black-and-white look.",
    cover: "/work/social/the-nine/02.webp",
    hero: "/work/social/the-nine/02.webp",
    tags: ["Café", "Social Design", "Brand World"],
    contribution: ["Social Design", "Art Direction", "Menu Visuals"],
    gallery: g(...seq("/work/social/the-nine/", 1, 9)),
  },
  // NEXT Academy takes the slot HR Link used to hold, so it lands earlier in
  // the social grid; HR Link follows it.
  {
    slug: "next-academy",
    index: "09",
    title: "NEXT Academy, Skills, Recruited",
    client: "NEXT Academy",
    year: "2025",
    category: "Education · Social",
    sector: "Technology",
    discipline: "Social Design · Enrolment",
    accent: "electric",
    simple: true,
    summary:
      "Social media design for a training academy, sharp, high-contrast posts built to turn interest into enrolment.",
    tagline: "Training posts built to convert interest into enrolment.",
    cover: "/work/social/next-academy/06.webp",
    hero: "/work/social/next-academy/02.webp",
    tags: ["Education", "Social Design", "Enrolment"],
    contribution: ["Social Design", "Art Direction", "Campaign"],
    gallery: g(...seq("/work/social/next-academy/", 1, 9)),
  },
  {
    slug: "hr-link",
    index: "10",
    title: "HR Link, Software, Sold Simply",
    client: "HR Link",
    year: "2025",
    category: "SaaS · Social",
    sector: "Technology",
    discipline: "Social Design · Product Marketing",
    accent: "electric",
    simple: true,
    summary:
      "Social media design for an HR software platform, every post answers one real worry and shows the product solving it.",
    tagline: "HR software made to feel effortless, not technical.",
    cover: "/work/social/hr-link/01.webp",
    hero: "/work/social/hr-link/02.webp",
    tags: ["SaaS", "Social Design", "Bilingual AR/EN"],
    contribution: ["Social Design", "Product Marketing", "Art Direction"],
    gallery: g(...seq("/work/social/hr-link/", 1, 9)),
  },
  {
    slug: "brand-vitals",
    index: "11",
    title: "BrandVitals, Marketing, Built in Blocks",
    client: "BrandVitals",
    year: "2025",
    category: "Marketing · Social",
    sector: "Marketing & Agency",
    discipline: "Social Design · 3D Concept",
    accent: "electric",
    simple: true,
    summary:
      "Social media design for a marketing agency, familiar toy blocks turned into sharp visual metaphors for tired marketing truths.",
    tagline: "Marketing advice that looks like a toy box and lands like a punch.",
    cover: "/work/social/brand-vitals/01.webp",
    hero: "/work/social/brand-vitals/02.webp",
    tags: ["Marketing", "3D Concept", "Social Design"],
    contribution: ["Social Design", "3D Concept", "Art Direction"],
    gallery: g(...seq("/work/social/brand-vitals/", 1, 9)),
  },
];

export const sectors: string[] = Array.from(
  new Set(projects.map((p) => p.sector))
);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacent(slug: string): { next: Project } {
  const i = projects.findIndex((p) => p.slug === slug);
  return { next: projects[(i + 1) % projects.length] };
}
