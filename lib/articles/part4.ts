import type { Article } from "../articles";

// Tools & Craft · Logo Design · Brand & Campaigns · AI in Design (round two)
export const part4: Article[] = [
  {
    slug: "photoshop-retouching-workflow-for-key-visuals",
    title: "A Photoshop Retouching Workflow for Campaign Key Visuals",
    titleAr: "طريقة ريتاتش في فوتوشوب للصور الرئيسية في الحملات",
    description:
      "A practical Photoshop retouching workflow for campaign key visuals: clean-up, light and shadow, colour matching across a set, and the final export checks.",
    summaryAr:
      "طريقة ريتاتش عملية في فوتوشوب للكي فيجوال: التنظيف، الضوء والظل، توحيد الألوان على السِت كله، وفحوصات التصدير الأخيرة.",
    category: "Tools & Craft",
    keywords: ["Photoshop retouching", "key visual retouching", "Photoshop workflow", "product retouching"],
    date: "2026-09-14",
    takeaways: [
      "Work non-destructively: every fix on its own layer, every adjustment as an adjustment layer.",
      "Retouch light before detail: the eye reads light first.",
      "Match the set, not the single image.",
    ],
    body: [
      { p: "Retouching is where a good key visual becomes a finished one. It is also where most time is wasted, because people fix details before they fix the light. A clear order of work keeps the image consistent and the file editable when the client asks for one more change." },
      { h2: "1. Clean-up" },
      { p: "Start with dust, seams, labels and anything distracting, each on its own empty layer with the healing tools sampling all layers. Keep this layer named, so a later colour change never forces you to redo it." },
      { h2: "2. Light and shadow" },
      { p: "Use soft dodge and burn on neutral grey layers to shape the product and the subject. Add a contact shadow where the object meets the surface: missing shadows are the fastest way a composite gives itself away." },
      { h2: "3. Colour" },
      { ul: [
        "Neutralise first with a curves layer, then grade.",
        "Pull brand colours into the scene with selective colour, not saturation.",
        "Check skin and food separately; both go wrong quickly.",
      ] },
      { h2: "4. Match the set" },
      { p: "Open the whole campaign side by side before the last pass. One image warmer than the others breaks the set more than a small flaw ever will. I keep one master grade and apply it to every frame, then adjust only where the scene demands it." },
      { h2: "5. Export" },
      { p: "Export at the sizes the brief lists, sharpen per output, and check every format at actual size on a phone. Keep the layered master; the export is a copy." },
    ],
    faq: [
      { q: "What is non-destructive retouching?", a: "Editing with separate layers, masks and adjustment layers so every change can be undone or adjusted later without damaging the original pixels." },
      { q: "How do you keep a set of images consistent?", a: "Grade them together with one master adjustment, compare them side by side and fix the outliers, rather than finishing each image on its own." },
    ],
    related: ["photo-sessions"],
  },
  {
    slug: "photoshop-generative-fill-for-designers",
    title: "Photoshop Generative Fill: Where It Helps Designers, and Where It Doesn't",
    titleAr: "الـ Generative Fill في فوتوشوب: بيساعد المصمم في إيه، وفين ما بينفعش",
    description:
      "An honest look at Photoshop's generative tools in daily design work: extending canvases, removing objects, quick variations, and where hand work still wins.",
    summaryAr:
      "نظرة صريحة على أدوات التوليد في فوتوشوب في الشغل اليومي: توسيع الكانفاس، مسح العناصر، التنويعات السريعة، وفين الشغل اليدوي لسه بيكسب.",
    category: "Tools & Craft",
    keywords: ["Photoshop generative fill", "generative expand", "AI in Photoshop", "Photoshop AI tools"],
    date: "2026-09-18",
    takeaways: [
      "Best uses: extending a background, removing clutter, filling gaps for new formats.",
      "Weak spots: hands, text, product labels and anything brand-critical.",
      "Always finish generated areas by hand to match grain and light.",
    ],
    body: [
      { p: "Generative fill changed one job above all: adapting a key visual to every format. A 16:9 campaign image that once needed a reshoot or hours of cloning to become a 9:16 story can now be extended in minutes. That alone earns it a place in the workflow." },
      { h2: "Where it helps" },
      { ul: [
        "Extending canvases for new aspect ratios.",
        "Removing people, cables and clutter from a scene.",
        "Rough variations of a background while exploring a direction.",
        "Filling small gaps after compositing.",
      ] },
      { h2: "Where it doesn't" },
      { p: "Anything the brand depends on stays manual: product labels, logos, packaging details, hands holding the product, and all typography. Generated versions of these drift in small ways a client notices immediately." },
      { h2: "Make it match" },
      { p: "Generated areas are often smoother and cleaner than the photograph around them. Add matching grain, check the direction of light, and blend the edge with a soft mask. If it looks too perfect, it will read as fake." },
      { h2: "A note on originals" },
      { p: "Keep the original frame and the generated layers separate in the file. When the client asks for a different crop, you want to regenerate only the extension, not rebuild the image." },
    ],
    faq: [
      { q: "Can generative fill replace a photo shoot?", a: "No. It extends and repairs images well, but the product, the people and the light still need to come from a real shoot or a carefully directed AI production." },
    ],
  },
  {
    slug: "illustrator-vs-photoshop-which-tool",
    title: "Illustrator vs Photoshop: Which Tool for Which Job",
    titleAr: "إليستريتور ولا فوتوشوب: كل أداة لأنهي شغلانة",
    description:
      "A clear guide to when to use Illustrator and when to use Photoshop in brand and campaign work: logos, icons, layouts, photo work and the hand-off between them.",
    summaryAr:
      "دليل واضح لإمتى تستخدم إليستريتور وإمتى فوتوشوب في شغل العلامات والحملات: اللوجوهات، الأيقونات، اللياوت، شغل الصور، والتسليم بينهم.",
    category: "Tools & Craft",
    keywords: ["Illustrator vs Photoshop", "Adobe Illustrator", "Adobe Photoshop", "vector vs raster"],
    date: "2026-09-25",
    takeaways: [
      "Illustrator for anything that must scale: logos, icons, type, patterns.",
      "Photoshop for anything made of pixels: photos, compositing, retouching.",
      "Most campaign work uses both: vector assets placed into pixel scenes.",
    ],
    body: [
      { p: "The question sounds basic, but the wrong tool choice causes real problems later: a logo built in Photoshop that cannot be printed on a building, or a photo composite fought through in Illustrator. The rule is simple once you see it as vector versus pixels." },
      { h2: "Use Illustrator for" },
      { ul: [
        "Logos and wordmarks, which must work from a favicon to a billboard.",
        "Icons and pictograms.",
        "Custom lettering, once the sketch is approved.",
        "Patterns, infographics and print layouts with lots of type.",
      ] },
      { h2: "Use Photoshop for" },
      { ul: [
        "Retouching and colour grading photography.",
        "Compositing key visuals from several images.",
        "Finishing AI-generated imagery.",
        "Social posts that are mostly image.",
      ] },
      { h2: "The hand-off" },
      { p: "In a typical campaign, the logo, the type lock-up and icons come from Illustrator as vector or smart objects, and the scene is built in Photoshop. Keep the vector parts linked, so a logo update changes every file at once." },
      { h2: "And the rest" },
      { p: "Layout-heavy print, decks and multi-page documents are often better in a layout tool, and interface work belongs in a UI tool. The point is not loyalty to one app; it is choosing the format that keeps the work editable and sharp." },
    ],
    faq: [
      { q: "Should a logo be designed in Photoshop?", a: "No. Logos should be built as vectors in Illustrator or a similar tool so they stay sharp at any size and can be produced in any medium." },
    ],
  },
  {
    slug: "logo-design-process-step-by-step",
    title: "The Logo Design Process, Step by Step",
    titleAr: "خطوات تصميم اللوجو من الأول للآخر",
    description:
      "How a professional logo is designed: discovery, positioning, sketching, digital refinement, testing at every size, and the files a brand should receive.",
    summaryAr:
      "إزاي اللوجو الاحترافي بيتصمم: الفهم، التموضع، الإسكتشات، التطوير الديجيتال، الاختبار على كل المقاسات، والملفات اللي العلامة لازم تستلمها.",
    category: "Logo Design",
    keywords: ["logo design process", "logo designer Egypt", "how to design a logo", "brand mark design"],
    date: "2026-09-29",
    takeaways: [
      "A logo starts with positioning, not drawing.",
      "Sketch wide on paper before narrowing on screen.",
      "Test at 16 pixels and on a building before calling it done.",
    ],
    body: [
      { p: "A good logo looks simple, and that simplicity is the result of a lot of decisions. The process below is the one I use for identity work; skipping a step usually shows up later as a mark that does not quite fit the business." },
      { h2: "1. Discovery" },
      { p: "Who is the brand for, who are the competitors, and what should people feel when they see it? A short workshop or questionnaire answers more than any mood board." },
      { h2: "2. Positioning" },
      { p: "Write one sentence the logo must express: premium and calm, bold and local, technical and friendly. Every sketch is judged against it." },
      { h2: "3. Sketching" },
      { p: "Dozens of quick pencil ideas, explored widely: lettermarks, symbols, wordmarks, combinations. Quantity first, because the strongest idea is rarely the first." },
      { h2: "4. Refinement" },
      { p: "The best two or three move into vector. Here the work is optical: curves, weights, spacing between letters, how the mark sits with the name." },
      { h2: "5. Testing" },
      { ul: [
        "At favicon size and on a phone screen.",
        "In one colour, reversed, and on photography.",
        "On real applications: a signboard, a bag, a social avatar.",
      ] },
      { h2: "6. Delivery" },
      { p: "Vector masters, colour and mono versions, transparent PNGs, clear-space rules and a one-page usage guide. The logo is only as useful as the files that come with it." },
    ],
    faq: [
      { q: "How many logo concepts should a designer present?", a: "Usually two or three well-developed directions, each tested in use, rather than many unfinished options." },
      { q: "What files should I receive with a logo?", a: "Vector files (AI, SVG, PDF), PNGs with transparency, colour and one-colour versions, and a short usage guide." },
    ],
  },
  {
    slug: "what-makes-a-logo-memorable",
    title: "What Makes a Logo Memorable",
    titleAr: "إيه اللي يخلّي اللوجو يتفتكر",
    description:
      "The qualities that make a logo memorable: one idea, a simple silhouette, distinctiveness in its category, and consistent use over time.",
    summaryAr:
      "الصفات اللي بتخلّي اللوجو يتفتكر: فكرة واحدة، شكل بسيط، اختلاف عن باقي الفئة، واستخدام ثابت على مدار الوقت.",
    category: "Logo Design",
    keywords: ["memorable logo", "good logo design", "logo design tips", "brand recognition"],
    date: "2026-10-03",
    takeaways: [
      "Memorable logos hold one idea, not three.",
      "If you can draw it from memory, people can remember it.",
      "Consistency of use does more for recognition than any single design choice.",
    ],
    body: [
      { p: "Clients often ask for a logo that is unique, modern and timeless at once. Those words are hard to design to. Memorability is easier to aim at, because it has clear ingredients." },
      { h2: "One idea" },
      { p: "A mark that tries to show the product, the location and the founder's initials shows none of them. Choose the one thing that matters and let the rest live in the brand's imagery and copy." },
      { h2: "A simple silhouette" },
      { p: "Fill the logo solid black. If the shape is still recognisable as a silhouette, it will survive small sizes, embroidery, signage and quick glances in a feed." },
      { h2: "Different from the category" },
      { p: "Put the logo next to its five closest competitors. If it disappears among them, it is not doing its job, however beautiful it is on its own." },
      { h2: "Used the same way, every time" },
      { p: "Recognition is built by repetition. A logo used in the same colours, in the same position and with the same clear space for years becomes memorable even if it started out ordinary." },
    ],
    faq: [
      { q: "Should a logo show what the business does?", a: "Not necessarily. Many strong logos are abstract; what matters is that the mark is distinctive and expresses the brand's character." },
    ],
  },
  {
    slug: "designing-arabic-and-bilingual-logos",
    title: "Designing Arabic and Bilingual Logos",
    titleAr: "تصميم اللوجوهات العربية وثنائية اللغة",
    description:
      "How to design Arabic and bilingual Arabic–English logos: matching weight and rhythm across scripts, lock-up options, and the mistakes that break bilingual marks.",
    summaryAr:
      "إزاي تصمم لوجو عربي أو ثنائي عربي وإنجليزي: توازن الوزن والإيقاع بين الخطين، اختيارات الترتيب، والأخطاء اللي بتبوّظ اللوجو الثنائي.",
    category: "Logo Design",
    keywords: ["Arabic logo design", "bilingual logo", "Arabic wordmark", "Arabic English logo"],
    date: "2026-10-07",
    takeaways: [
      "Design both scripts together; do not translate one into the other at the end.",
      "Match visual weight and height, not point size.",
      "Prepare stacked and horizontal lock-ups for different spaces.",
    ],
    body: [
      { p: "In the Gulf and Egypt, many brands need a logo that works in Arabic and English. The most common failure is a beautiful Latin wordmark with an Arabic name typed underneath in a default font. The two scripts then look like two different companies." },
      { h2: "Design them as a pair" },
      { p: "Start sketching both names together. Look for shared features: a stroke angle, a terminal shape, a rhythm of verticals. Arabic is horizontal and flowing, Latin is vertical and stacked, so the match comes from character rather than identical shapes." },
      { h2: "Balance the weight" },
      { p: "Arabic letterforms carry dots, ascenders and descenders that change how heavy a word looks. Adjust size and stroke weight until both names feel equally strong from a distance." },
      { h2: "Lock-ups" },
      { ul: [
        "Horizontal: Arabic on the right, English on the left, sharing a baseline or a centre line.",
        "Stacked: the lead language on top, for square spaces and social avatars.",
        "Single-language versions for markets that need only one.",
      ] },
      { h2: "Common mistakes" },
      { ul: [
        "Stretching or skewing an Arabic font to match Latin width.",
        "Breaking letter connections to force a style.",
        "Forgetting how the Arabic reads at very small sizes.",
      ] },
    ],
    faq: [
      { q: "Should the Arabic or English be bigger in a bilingual logo?", a: "Neither by default. They should look equally weighted; the market decides which one leads in position." },
    ],
  },
  {
    slug: "art-direction-for-photo-shoots",
    title: "Art Direction for Photo Shoots: The Shot List and the Mood",
    titleAr: "الإخراج الفني لجلسات التصوير: الشوت ليست والمود",
    description:
      "How to art-direct a product or lifestyle photo shoot: the mood board, the shot list, casting and styling, on-set decisions and selecting the final frames.",
    summaryAr:
      "إزاي تعمل إخراج فني لجلسة تصوير منتج أو لايف ستايل: المود بورد، الشوت ليست، الكاستنج والستايلنج، القرارات في اللوكيشن، واختيار اللقطات النهائية.",
    category: "Brand & Campaigns",
    keywords: ["art direction photo shoot", "shot list", "mood board", "product photography direction"],
    date: "2026-10-10",
    takeaways: [
      "The shot list is the contract between the idea and the day.",
      "Decide light and palette before the shoot, not on set.",
      "Select with the campaign in mind, not the single best frame.",
    ],
    body: [
      { p: "An art director's main job on a shoot is to make sure the day produces a campaign, not just nice pictures. That work mostly happens before anyone picks up a camera." },
      { h2: "The mood board" },
      { p: "Three to five references for light, colour, composition and casting. More than that and the photographer receives mixed signals. Each reference should be there for one reason you can name." },
      { h2: "The shot list" },
      { ul: [
        "Every frame needed, by format: hero, social, web, print.",
        "Where the copy will sit in each frame.",
        "Must-have shots first, nice-to-haves last.",
      ] },
      { h2: "Casting and styling" },
      { p: "People should look like the audience. Wardrobe, props and surfaces should carry the brand palette so colour does not have to be added later." },
      { h2: "On set" },
      { p: "Watch the frame, not the scene. Check every hero shot against its layout, with space left for the headline, before moving on." },
      { h2: "Selection" },
      { p: "Pick frames that work as a set. The same approach applies to AI productions, where the shot list becomes the prompt plan." },
    ],
    faq: [
      { q: "What does an art director do on a photo shoot?", a: "They define the visual idea, prepare the mood board and shot list, guide the photographer and stylist on set, and select the final images for the campaign." },
    ],
    related: ["photo-sessions"],
  },
  {
    slug: "keeping-brand-imagery-consistent-colour-and-light",
    title: "Colour and Light: Keeping a Brand's Imagery Consistent",
    titleAr: "الألوان والإضاءة: إزاي صور العلامة تفضل متّسقة",
    description:
      "How to keep a brand's photography and AI imagery consistent: one light direction, a defined grade, palette in the scene, and a shared reference set for every designer.",
    summaryAr:
      "إزاي صور العلامة سواء تصوير أو AI تفضل متّسقة: اتجاه ضوء واحد، جريد محدد، ألوان العلامة جوه المشهد، ومجموعة مراجع مشتركة لكل المصممين.",
    category: "Tools & Craft",
    keywords: ["brand photography consistency", "colour grading", "brand imagery guidelines", "visual consistency"],
    date: "2026-10-14",
    takeaways: [
      "Pick one light: time of day, direction and softness.",
      "Save the grade as a preset and use it on every image.",
      "Put the brand colour in the scene, not in an overlay.",
    ],
    body: [
      { p: "Brands spend a lot on a logo and a palette, then publish photos with ten different moods. Imagery is the largest visual surface a brand owns, so consistency there matters more than anywhere else." },
      { h2: "One light" },
      { p: "Decide whether the brand lives in morning softness, golden hour or crisp studio light. Write it down. Every shoot and every AI prompt starts from it." },
      { h2: "One grade" },
      { p: "Build a master colour grade and save it as a preset or LUT. Apply it to every image first, then correct only what the scene requires." },
      { h2: "Colour in the scene" },
      { p: "Instead of tinting photos with brand colour, bring the colour into props, wardrobe and surfaces. It looks natural and still builds recognition." },
      { h2: "A shared reference set" },
      { p: "Keep ten approved images that define the look, and share them with every photographer, designer and freelancer. It is the quickest way to stop drift across a team." },
    ],
    faq: [
      { q: "How do brands keep their photos consistent?", a: "By defining one lighting style and one colour grade, using brand colours inside the scenes, and giving everyone the same set of approved reference images." },
    ],
    related: ["fresh-valley", "prepd"],
  },
  {
    slug: "graphic-design-tool-stack-2026",
    title: "My Graphic Design Tool Stack in 2026",
    titleAr: "الأدوات اللي بشتغل بيها في الجرافيك ديزاين سنة 2026",
    description:
      "The tools a working senior designer uses in 2026, from Photoshop and Illustrator to AI imaging, video and web, and how they fit into one workflow.",
    summaryAr:
      "الأدوات اللي مصمم سينيور بيشتغل بيها في 2026، من فوتوشوب وإليستريتور لأدوات الصور بالـ AI والفيديو والويب، وإزاي بتتجمع في طريقة شغل واحدة.",
    category: "Tools & Craft",
    keywords: ["graphic design tools 2026", "designer tool stack", "best design software", "AI design tools"],
    date: "2026-10-16",
    takeaways: [
      "Core craft tools still do most of the finishing work.",
      "AI tools sit at the start (exploring) and in the middle (producing), not at the end.",
      "A stack is only as good as the handover between its tools.",
    ],
    body: [
      { p: "Students ask me which tools to learn first. The honest answer is that tools change every year and the craft does not. Still, here is what a working day actually runs on." },
      { h2: "Craft" },
      { ul: [
        "Photoshop for retouching, compositing and finishing imagery.",
        "Illustrator for logos, lettering, icons and vector layouts.",
        "A UI design tool for interfaces and presentations.",
      ] },
      { h2: "AI production" },
      { ul: [
        "Image generators for exploration and campaign imagery.",
        "AI video tools for motion and planned film systems.",
        "AI voice for drafts and, where approved, final voice-over.",
      ] },
      { h2: "Motion and web" },
      { p: "After Effects and an editor for reels and films, and AI-assisted development for websites, which is how this portfolio was built." },
      { h2: "What ties it together" },
      { p: "Naming, folders and source files. A stack that produces beautiful work nobody else can open is not a professional stack. Every project I hand over includes the layered masters and the assets in a structure the next designer understands." },
    ],
    faq: [
      { q: "Which design tool should a beginner learn first?", a: "Photoshop and Illustrator are still the best foundation, because they teach image and vector thinking that every other tool builds on." },
    ],
  },
  {
    slug: "choosing-an-ai-image-generator-as-a-designer",
    title: "AI Image Generators for Designers: How to Choose",
    titleAr: "إزاي المصمم يختار أداة توليد الصور بالذكاء الاصطناعي",
    description:
      "How designers should choose between AI image generators: realism, text rendering, reference and character consistency, editing control and licensing.",
    summaryAr:
      "إزاي المصمم يختار بين أدوات توليد الصور: الواقعية، كتابة النصوص، الثبات مع المراجع والشخصيات، التحكم في التعديل، والترخيص.",
    category: "AI in Design",
    keywords: ["AI image generator for designers", "best AI image tool", "AI image generation", "AI for graphic design"],
    date: "2026-10-18",
    takeaways: [
      "Different models are good at different jobs; most designers use more than one.",
      "For brand work, reference and consistency control matter more than raw beauty.",
      "Check the licence terms before any commercial use.",
    ],
    body: [
      { p: "There is no single best AI image generator. Each model has strengths, and a designer's job is to know which one to reach for. These are the questions I ask when choosing." },
      { h2: "Realism or style?" },
      { p: "Some models excel at photographic realism, others at illustration and graphic styles. Match the model to the campaign's look rather than forcing one to do everything." },
      { h2: "Can it write?" },
      { p: "If the image must contain text, especially Arabic, test text rendering specifically. Many models still misspell or invent letters; some handle typography far better than others. On this site, covers that needed real Arabic were made with a model chosen for text." },
      { h2: "Can it stay consistent?" },
      { p: "Brand work needs the same product, character or style across many images. Reference images, character libraries and seeds make that possible; models without them are fine for one-offs only." },
      { h2: "How much control?" },
      { p: "Editing tools such as inpainting, expanding and precise edits decide how much of the image you can fix without starting over." },
      { h2: "Can you use it commercially?" },
      { p: "Read the terms. Commercial rights, model releases for real people and restrictions on brand marks vary between services." },
    ],
    faq: [
      { q: "Which AI image generator is best for graphic designers?", a: "It depends on the job: some are best for photorealism, others for typography and layout. Most professionals use two or three and pick per project." },
    ],
    related: ["fresh-valley", "photo-sessions"],
  },
];
