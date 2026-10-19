// v2 round 2: article covers (Magnific), the new BrandVitals campaign set,
// and the GTA VI Edition hero. Registers width/height/blur in lib/assets.json.
// Usage: node scripts/import-v2b.mjs
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const MANIFEST = "lib/assets.json";
const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));

async function blurOf(buf) {
  const b = await sharp(buf).resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${b.toString("base64")}`;
}
async function put(input, out, width) {
  let img = sharp(input).rotate();
  const meta = await img.metadata();
  if (meta.width > width) img = img.resize({ width });
  const buf = await img.webp({ quality: 82 }).toBuffer();
  const file = path.join("public", out);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, buf);
  const m = await sharp(buf).metadata();
  manifest[`/${out}`] = { width: m.width, height: m.height, blur: await blurOf(buf) };
  console.log("✓", out, `${m.width}x${m.height}`);
}

// ---- article covers, in the order the articles are written
const slugs = [];
for (const part of ["part1", "part2", "part3"]) {
  const src = await fs.readFile(`lib/articles/${part}.ts`, "utf8");
  for (const m of src.matchAll(/\n    slug: "([^"]+)"/g)) slugs.push(m[1]);
}
if (slugs.length !== 30) throw new Error(`expected 30 slugs, got ${slugs.length}`);
for (const [i, slug] of slugs.entries())
  await put(`_raw/article-covers/${String(i + 1).padStart(2, "0")}.png`, `articles/${slug}.webp`, 1600);

// ---- BrandVitals: the new "Measuring Your Brand's Vitals" set replaces the old one
const BV = "C:/Users/tarek/OneDrive/Desktop/New folder (10)";
const bvDir = "public/work/social/brand-vitals";
for (const f of await fs.readdir(bvDir)) {
  await fs.unlink(path.join(bvDir, f));
  delete manifest[`/work/social/brand-vitals/${f}`];
}
for (let i = 1; i <= 15; i++)
  await put(`${BV}/${i}.png`, `work/social/brand-vitals/${String(i).padStart(2, "0")}.webp`, 1400);

// ---- GTA VI Edition hero
await put("_review/hero-gta-b.png", "me/gta-hero.webp", 2560);

await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest updated");
