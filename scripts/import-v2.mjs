// v2 asset import: Prepd social set, the ElSewedy master visual, the ElSewedy
// posts for the loop slider, and two new lettering pieces.
// Writes WebP into /public and registers width/height/blur in lib/assets.json
// (the prebuild stamp step adds the cache-busting hash).
// Usage: node scripts/import-v2.mjs
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const D = "C:/Users/tarek/OneDrive/Desktop";
const IMG =
  "C:/Users/tarek/AppData/Local/Temp/claude/C--Users-tarek-OneDrive-Desktop-New-folder--7-/93f8aff8-6025-4494-96c8-42de8bc9fc38/images";
const MANIFEST = "lib/assets.json";
const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));

async function blurOf(buf) {
  const b = await sharp(buf).resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${b.toString("base64")}`;
}

async function put(input, out, width, { alpha = false } = {}) {
  let img = sharp(input).rotate();
  const meta = await img.metadata();
  if (meta.width > width) img = img.resize({ width });
  const buf = await img.webp({ quality: alpha ? 90 : 84, alphaQuality: 100 }).toBuffer();
  const file = path.join("public", out);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, buf);
  const m = await sharp(buf).metadata();
  manifest[`/${out}`] = { width: m.width, height: m.height, blur: await blurOf(buf) };
  console.log("✓", out, `${m.width}x${m.height}`);
}

// ---- Prepd social set (order = how the card and case read)
const prepd = ["4", "5", "6", "7", "8", "9"];
for (const [i, n] of prepd.entries())
  await put(`${IMG}/${n}.webp`, `work/social/prepd/${String(i + 1).padStart(2, "0")}.webp`, 1400);

// ---- ElSewedy master visual (landscape)
await put(`${D}/Artboard 1 copy.png`, "work/master/09.webp", 2400);

// ---- ElSewedy posts → loop slider 37..49
const sei = [
  ...["4.png", "5.png", "6.png", "8.png", "Artboard 10 copy.png", "Artboard 10.png"].map(
    (f) => `${D}/New folder (26)/${f}`
  ),
  ...[
    "Artboard 7 copy 2.png",
    "Artboard 7 copy 3.png",
    "Artboard 7 copy.png",
    "Artboard 7.png",
    "Artboard 8 copy 2.png",
    "Artboard 8 copy.png",
    "Artboard 8.png",
  ].map((f) => `${D}/New folder (31)/New folder/New folder/${f}`),
];
for (const [i, f] of sei.entries()) await put(f, `slider/${37 + i}.webp`, 900);

// ---- lettering
// 09 "أمّن واطمن": white letters, black outline + shadow — reads on both
// grounds, so both cuts are the same artwork.
const t9 = `${D}/2x/Asset 1@2x-8.png`;
await put(t9, "work/type/09-dark.webp", 1200, { alpha: true });
await put(t9, "work/type/09-light.webp", 1200, { alpha: true });

// 10 "بكرة اللي بنحلم بيه بنبنيه": white + red on alpha. The dark cut is the
// artwork as supplied; the light cut turns the white to black and keeps the red.
const t10 = `${D}/New folder (25)/Vector Smart Object.png`;
await put(t10, "work/type/10-dark.webp", 1200, { alpha: true });
{
  const { data, info } = await sharp(t10).toColourspace("srgb").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let p = 0; p < data.length; p += 4) {
    const [r, g, b] = [data[p], data[p + 1], data[p + 2]];
    const redish = r > 120 && r - Math.max(g, b) > 60;
    if (!redish) {
      // neutral pixel: invert its lightness so white ink becomes black ink
      const l = 255 - Math.round((r + g + b) / 3);
      data[p] = data[p + 1] = data[p + 2] = l;
    }
  }
  if (info.channels !== 4) throw new Error("channels " + info.channels);
  const png = await sharp(data, { raw: info }).png().toBuffer();
  await put(png, "work/type/10-light.webp", 1200, { alpha: true });
}

await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest updated");
