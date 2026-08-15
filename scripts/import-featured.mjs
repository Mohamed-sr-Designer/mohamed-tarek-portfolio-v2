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

// [file, slug, crop] — crop is the post artwork inside the screenshot.
// The leadership photo (113448) and the speaking clip (113609) were pulled
// from the section; re-add their entries here if they are ever wanted back.
const POSTS = [
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

  // Trim the light card padding LinkedIn draws around the post artwork. The
  // crop boxes catch a few pixels of it and it rendered as a white frame on a
  // dark page. trim() works off the corner pixel, so it eats the surround and
  // stops at the artwork. Done as its own pass: sharp applies trim before
  // extract when both are in one pipeline, which would trim the whole
  // screenshot instead of the crop.
  const cropped = await sharp(path.join(SRC, file))
    .extract(crop)
    .toBuffer()
    .then((buf) => sharp(buf).trim({ threshold: 25 }).toBuffer());
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
