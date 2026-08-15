// LinkedIn recommendations, transcribed verbatim from the profile.
//
// `relation` is LinkedIn's own wording for how the two worked together —
// "managed Mohamed directly" carries more weight to a recruiter than
// "worked on the same team", so it is kept and shown.
export type Recommendation = {
  name: string;
  title: string;
  relation: "managed" | "senior" | "peer" | "report";
  date: string; // ISO, for sorting
  dateLabel: string;
  body: string;
};

// Profile photo path, derived from the name the same way the import script
// slugifies the filenames (scripts/import-avatars.mjs). Keeping it a function
// means a new avatar only has to be dropped in the folder and re-imported —
// there is no second list to keep in sync.
export const avatarFor = (name: string) =>
  `/recs/${name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}.webp`;

export const recommendations: Recommendation[] = [
  {
    name: "Islam Samir",
    title: "Co-founder and CMO at Flowrista",
    relation: "managed",
    date: "2025-04-17",
    dateLabel: "April 2025",
    body: "Working with Mohamed Tarek on the Flowrista senior design project was a truly fantastic experience. I was immediately impressed by his unwavering commitment and remarkable ability to learn at lightning speed. He tackled every challenge head-on and excelled. As a team player, he was exceptional, consistently contributing positively and fostering a collaborative and productive environment.\n\nMohamed added immense value to Flowrista, particularly with his outstanding skills in photo shooting and retouching. He also played a pivotal role in redefining the brand's visual identity, ensuring it resonated deeply with our target audience. What sets Mohamed apart is his solution-oriented mindset; no matter the obstacle, his first instinct is to ask, “How can we fix this?” This relentless determination makes him an unstoppable force and a vital asset to any team.\n\nI wholeheartedly recommend Mohamed Tarek, any team would be fortunate to benefit from his talent, passion, and drive.",
  },
  {
    name: "Reham Elkhateeb",
    title: "Operation / Office Manager",
    relation: "managed",
    date: "2026-02-24",
    dateLabel: "February 2026",
    body: "I highly recommend Tarek as a kind, reliable, and hardworking professional. He is fast, efficient, and consistently delivers quality work.\n\nTarek is also very supportive and cooperative with his teammates, always willing to help and contribute positively to the team.\n\nI'm truly happy you were part of my team at Bundle IMS, and I wish you continued success and growth in your career.",
  },
  {
    name: "Ahmed Hassan",
    title: "Co-Founder & Managing Director at Bundle IMS",
    relation: "managed",
    date: "2026-03-10",
    dateLabel: "March 2026",
    body: "Mohamed is an exceptional creative professional, we all loved having him at Bundle. I am sure he will do great wherever he goes.",
  },
  {
    name: "Omar Khater",
    title: "10+ Years in Data Driven Growth · Digital Transformation & AI",
    relation: "managed",
    date: "2024-12-07",
    dateLabel: "December 2024",
    body: "Tarek is a highly talented designer known for his versatility and creativity. He excels in graphic design, motion graphics, video production, and UI/UX design, consistently delivering high-quality work across a wide range of projects. Highly recommended for any creative endeavor.",
  },
  {
    name: "Ahmed Altamimi",
    title: "Business Development · Growth · Startups · Mentorship",
    relation: "senior",
    date: "2024-04-15",
    dateLabel: "April 2024",
    body: "I've had the pleasure of working closely with Mohammed, our graphic designer at Osolutions. He consistently brings fresh perspectives and creative solutions to our projects, always eager to explore new techniques. Mohammed goes the extra mile, inspiring our team with his passion for improvement. He is not only a talented designer but also a collaborative team player with exceptional design skills. I highly recommend Mohammed for his exceptional dedication and contributions inspiring our entire team to strive for excellence.",
  },
  {
    name: "Enjy Elshiekh",
    title: "Colleague",
    relation: "peer",
    date: "2025-01-01",
    dateLabel: "2025",
    body: "He could create a whole design in a very tight time. Mohamed is one of the most creative designers I have ever worked with. I highly recommend him.",
  },
  {
    name: "Mohamed Abd-Eltawab",
    title: "Visual Designer · Exploring how design shapes value and perception",
    relation: "peer",
    date: "2025-08-06",
    dateLabel: "August 2025",
    body: "I've had the pleasure of working with Mohamed Tarek, and honestly, he's one of the most talented graphic designers I've come across. He always finds a way to get things done, no matter how tricky the task is. Mohamed is a true team player, always helpful, and great at solving problems quickly and creatively.\n\nHe's also someone who's always working on himself, constantly learning, improving, and staying up to date with everything new in design.\n\nSimply put, he's the kind of person you're always happy to have on your team.",
  },
  {
    name: "Amr El hawary",
    title: "Building innovative tech solutions",
    relation: "peer",
    date: "2024-04-15",
    dateLabel: "April 2024",
    body: "I am thrilled to wholeheartedly recommend Mohamed for a senior graphic designer position. Throughout our collaboration, Mohamed has consistently showcased exceptional communication skills and seamless collaboration abilities with clients and peers alike. His attentive listening skills ensure a comprehensive understanding of client needs, which he integrates into his designs with meticulous precision. Beyond his innovative conceptualization, Mohamed excels in crafting visually captivating designs. His portfolio showcases a diverse range of projects, highlighting his versatility and impeccable aesthetic sense. Mohamed's relentless dedication to his craft and relentless pursuit of excellence make him an invaluable asset to any team.",
  },
  {
    name: "Kirolse Nazeh",
    title: "Art Director · Brand Designer",
    relation: "peer",
    date: "2024-04-14",
    dateLabel: "April 2024",
    body: "I am delighted to enthusiastically endorse Mohamed for a senior graphic designer role. Throughout our collaboration, I have witnessed his outstanding capacity to communicate effectively and collaborate seamlessly with both clients and colleagues. Mohamed consistently demonstrated attentive listening skills, ensuring that he comprehensively grasped client requirements and integrated them into his designs with meticulous attention to detail. His expertise extends beyond generating innovative concepts; he also excels in translating them into visually compelling designs. His portfolio is a testament to his versatile approach and impeccable sense of aesthetics, featuring a wide array of projects. Mohamed's unwavering dedication to his craft and his unwavering pursuit of excellence render him an invaluable addition to any team.",
  },
  {
    name: "Menna Ibrahim",
    title: "Senior Account Manager · Social Media Management · Marketing Strategy",
    relation: "peer",
    date: "2024-04-15",
    dateLabel: "April 2024",
    body: "Highly recommended. I wholeheartedly endorse Mohammed Tarek as an incredibly skilled graphic designer. Mohammed's innovative thinking, unwavering commitment, and mastery of technical aspects are truly commendable. His capacity to produce top-notch work with meticulous precision distinguishes him within the industry. Mohammed is an invaluable addition to any team, and I am confident that he will continue to thrive in his professional journey.",
  },
  {
    name: "Iman Abdelwahab",
    title: "Senior Graphic Designer at Social Clicks Network",
    relation: "report",
    date: "2024-04-11",
    dateLabel: "April 2024",
    body: "I wholeheartedly recommend Mohamed for a position of senior graphic designer, i can confidently attest to his ability to effectively communicate and collaborate with clients and team members, actively listening to client requirements and incorporating feedback into his designs he consistently demonstrated a remarkable ability to conceptualize creative ideas and translate them into visually stunning designs, take a look at his portfolio as it showcases a diverse range of projects that reflect his versatile style and keen eye for aesthetics.",
  },
  {
    name: "Mohannad El Gammal",
    title: "Venture Building · Managing Director · Startup Mentor",
    relation: "peer",
    date: "2024-03-24",
    dateLabel: "March 2024",
    body: "I highly recommend Mohammed Tarek as an exceptionally talented graphic designer. Mohammed's creativity, dedication, and technical skills are truly impressive. His ability to deliver high-quality work with attention to detail sets him apart in the field. Mohammed is a valuable asset to any team, and I have no doubt he will continue to excel in his career.",
  },
  {
    name: "Amr Tolba",
    title: "Motion Designer",
    relation: "peer",
    date: "2026-04-29",
    dateLabel: "April 2026",
    body: "I would like to recommend Mohamed Tarek based on my experience working with him. He demonstrates a high level of professionalism and commitment, along with a smooth and approachable communication style.\n\nMohamed has strong skills in his field and consistently delivers tasks with efficiency and high quality. He is also a collaborative team player who adds real value to any team he joins. I highly recommend him for any future opportunities.",
  },
  {
    name: "Canzy Bahgat",
    title: "Senior Growth Manager · Growth Marketing · E-Commerce",
    relation: "peer",
    date: "2024-04-12",
    dateLabel: "April 2024",
    body: "One of the most creative designers i've worked with and was always the main source for the creative ideas in each project we work on, he is not just a designer he is the touch of creativity and light to everything he does.",
  },
  {
    name: "Ziad Tolba",
    title: "Meta Ads & E-commerce Specialist · Performance Marketer",
    relation: "report",
    date: "2024-04-14",
    dateLabel: "April 2024",
    body: "Tarek consistently impresses me with his calm problem-solving and quick learning. A valuable asset. He is always eager to grow and learn anything in zero time. Proud to work with you Tarek.",
  },
  {
    name: "yara shahine",
    title: "Art Director · Graphic Designer · Motion Designer",
    relation: "peer",
    date: "2024-03-23",
    dateLabel: "March 2024",
    body: "Mohamed is very helpful person, eager to learn more and more and have a great sense of art.",
  },
  {
    name: "Maggie Milad",
    title: "UX Writer @ Suez Canal Bank · AI UX Writer",
    relation: "peer",
    date: "2024-04-14",
    dateLabel: "April 2024",
    body: "One of the best designers.",
  },
];
