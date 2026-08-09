// LinkedIn "Featured" posts for the About page.
//
// The sources are screenshots of the LinkedIn UI, so each one is cropped down
// to just the post's own artwork — no profile chrome, no "Remove from
// featured" button, no reaction bar.
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(__dirname, "..");
const PUBLIC = path.join(PROJECT, "public");
const SRC = "C:\\Users\\tarek\\OneDrive\\Desktop\\New folder";

// [file, slug, crop] — crop is the post artwork inside the screenshot
const POSTS = [
  [
    "Screenshot 2026-08-09 113448.png",
    "leadership",
    { left: 8, top: 186, width: 588, height: 300 },
  ],
  [
    "Screenshot 2026-08-09 113546.png",
    "nano-banana",
    { left: 18, top: 38, width: 415, height: 233 },
  ],
  [
    "Screenshot 2026-08-09 113550.png",
    "skin-texture",
    { left: 18, top: 40, width: 415, height: 233 },
  ],
  [
    "Screenshot 2026-08-09 113554.png",
    "ai-photo-session",
    { left: 46, top: 45, width: 340, height: 232 },
  ],
  [
    "Screenshot 2026-08-09 113609.png",
    "talk",
    { left: 160, top: 40, width: 145, height: 232 },
  ],
];

const manifestPath = path.join(PROJECT, "lib", "assets.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

await fs.rm(path.join(PUBLIC, "featured"), { recursive: true, force: true });
for (const k of Object.keys(manifest))
  if (k.startsWith("/featured/")) delete manifest[k];

for (const [file, slug, crop] of POSTS) {
  const rel = `featured/${slug}.webp`;
  const out = path.join(PUBLIC, rel);
  await fs.mkdir(path.dirname(out), { recursive: true });

  const cropped = await sharp(path.join(SRC, file)).extract(crop).toBuffer();
  const info = await sharp(cropped)
    .resize({ width: 1200, withoutEnlargement: false })
    .webp({ quality: 86, effort: 5 })
    .toFile(out);

  manifest["/" + rel] = {
    width: info.width,
    height: info.height,
    blur: `data:image/webp;base64,${(
      await sharp(cropped).resize(16).webp({ quality: 22 }).toBuffer()
    ).toString("base64")}`,
  };
  console.log(`  ${rel}  ${info.width}x${info.height}`);
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
console.log("done");
