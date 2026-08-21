// Build the light-theme cut for Type Design piece 08.
//
// He supplied folders 1-6 as a pair (white artwork for dark mode, black for
// light) but 7 and 8 came as a single full-colour file each. 07 is
// theme-neutral -- black-filled blue letters with a white outline, legible on
// both grounds -- but 08 is a white word with a light-green offset shadow, so
// on the cream ground the word itself disappeared and only the shadow showed.
// That is why the tile had a dark plate painted behind it, which is the thing
// he asked to be rid of.
//
// So the light cut is derived from the one file that exists: the achromatic
// pixels (the word) invert to ink, and the green shadow keeps its hue and
// saturation but is taken down to a lightness that holds against cream.
// Partial-alpha edge pixels get the same treatment, so the antialiasing stays
// clean instead of fringing white.
import sharp from "sharp";
import fs from "node:fs/promises";

const SRC = "public/work/type/08-dark.webp";
const OUT = "public/work/type/08-light.webp";

const rgb2hsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h;
  if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (mx === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h, s, l];
};

const hsl2rgb = (h, s, l) => {
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map((v) => Math.round(v * 255));
};

const { data, info } = await sharp(SRC).ensureAlpha().raw()
  .toBuffer({ resolveWithObject: true });

let word = 0, shadow = 0;
for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] === 0) continue;
  const [h, s, l] = rgb2hsl(data[i], data[i + 1], data[i + 2]);
  if (s < 0.25) {
    // the word: white becomes ink, and the greys in between follow
    const v = Math.round((1 - l) * 235 + 10);
    data[i] = data[i + 1] = data[i + 2] = v;
    word++;
  } else {
    // the shadow: same green, deep enough to read on cream
    const [r, g, b] = hsl2rgb(h, Math.min(1, s * 1.05), 0.36);
    data[i] = r; data[i + 1] = g; data[i + 2] = b;
    shadow++;
  }
}

const { width, height } = info;
await sharp(data, { raw: { width, height, channels: 4 } })
  .webp({ quality: 88, effort: 5, alphaQuality: 100 })
  .toFile(OUT);

const manifestPath = "lib/assets.json";
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const blurBuf = await sharp(OUT).resize(16).webp({ quality: 40 }).toBuffer();
manifest["/work/type/08-light.webp"] = {
  width, height,
  blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
};
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

console.log(`08-light.webp  ${width}x${height}  word ${word}px  shadow ${shadow}px`);
