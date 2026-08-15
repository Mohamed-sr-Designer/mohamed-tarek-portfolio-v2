// Profile photos for the LinkedIn recommendations.
//
// Files are named after the person, so the slug is derived from the filename
// and matched against the `name` field in lib/recommendations.ts. Square crop,
// centred — the card renders them as circles.
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(__dirname, "..");
const PUBLIC = path.join(PROJECT, "public");
const SRC = "C:\\Users\\tarek\\OneDrive\\Desktop\\New folder (20)";

export const slugify = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const manifestPath = path.join(PROJECT, "lib", "assets.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

await fs.rm(path.join(PUBLIC, "recs"), { recursive: true, force: true });
for (const k of Object.keys(manifest))
  if (k.startsWith("/recs/")) delete manifest[k];

const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const made = [];

for (const f of files) {
  const slug = slugify(path.parse(f).name);
  const rel = `recs/${slug}.webp`;
  const out = path.join(PUBLIC, rel);
  await fs.mkdir(path.dirname(out), { recursive: true });

  const info = await sharp(path.join(SRC, f))
    .rotate()
    .resize(240, 240, { fit: "cover", position: "attention" })
    .webp({ quality: 86 })
    .toFile(out);

  manifest["/" + rel] = {
    width: info.width,
    height: info.height,
    blur: `data:image/webp;base64,${(
      await sharp(path.join(SRC, f)).resize(16).webp({ quality: 22 }).toBuffer()
    ).toString("base64")}`,
  };
  made.push(slug);
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`${made.length} avatars:`);
console.log("  " + made.join("\n  "));
