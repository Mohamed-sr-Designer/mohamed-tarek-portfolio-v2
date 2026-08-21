// Normalise the tool logos into one frame.
//
// They arrived in every shape there is: 250x250 to 1280x1280, Figma at 2:3 and
// Gemini at 2:1, four of them with a baked white background and Claude as a
// white glyph on its orange tile. Dropped straight into the cards they would
// have sat at different weights with different amounts of air around them,
// which is exactly what he asked not to happen.
//
// So each one is knocked off its background, trimmed to the ink itself, then
// scaled to fit a fixed box and centred on one square canvas. Same canvas, same
// padding, same optical size for all of them.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SRC = "C:/Users/tarek/OneDrive/Desktop/New folder (3)";
const OUT = "public/tools";
const CANVAS = 512;
const INSET = 0.82; // the ink fills 82% of the square, the rest is air

// `white` knocks a baked white background out and un-premultiplies the edges
// so antialiasing does not fringe. `tile` is for Claude, which is the inverse
// case: a white mark on a solid orange square, so the mark's own coverage
// becomes the alpha and the brand orange becomes the colour.
const icons = [
  { out: "photoshop", file: "ps.webp" },
  { out: "figma", file: "Figma-logo.svg.webp" },
  { out: "magnific", file: "Magnific-Logo.png" },
  { out: "illustrator", file: "Adobe_Illustrator_CC_icon.svg.webp" },
  { out: "after-effects", file: "Adobe_After_Effects_CC_icon.svg.webp" },
  { out: "premiere", file: "premiere.svg" },
  // ChatGPT ships the same way Claude does -- a white mark on a solid tile --
  // but with a white page margin around the tile too. Margin and mark are the
  // same white, so the margin is cropped off first and only then is the mark
  // lifted off the tile; otherwise the whole margin would come out solid ink.
  { out: "chatgpt", file: "chat gpt.png", mode: "tile", pretrim: true, bg: [116, 170, 156], ink: [116, 170, 156] },
  { out: "claude", file: "cloadue.png", mode: "tile", bg: [217, 119, 87], ink: [217, 119, 87] },
  { out: "elevenlabs", file: "elevenlabs-symbol-rounded-hd-free-png.webp" },
  { out: "blender", file: "Blender.webp", mode: "white" },
  { out: "gemini", file: "gimini.webp", mode: "white" },
];

// A rounded tile leaves four white wedges outside its corner radius, and they
// read as "white" exactly like the mark does, so the knockout turns them into
// solid ink. Flood from the border over everything that came out opaque and
// clear it: the wedges touch the edge, the mark in the middle does not.
const clearBorderInk = (data, w, h) => {
  const seen = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const n = y * w + x;
    if (seen[n] || data[n * 4 + 3] < 200) return;
    seen[n] = 1;
    stack.push(n);
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const n = stack.pop();
    data[n * 4 + 3] = 0;
    const x = n % w, y = (n / w) | 0;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
};

const knockout = (data, info, spec) => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (spec.mode === "white") {
      const a = 255 - Math.min(r, g, b);
      data[i + 3] = a;
      if (a > 0 && a < 255) {
        // undo the composite against white so the edge keeps its own colour
        const k = a / 255;
        data[i] = Math.max(0, Math.min(255, Math.round((r - 255 * (1 - k)) / k)));
        data[i + 1] = Math.max(0, Math.min(255, Math.round((g - 255 * (1 - k)) / k)));
        data[i + 2] = Math.max(0, Math.min(255, Math.round((b - 255 * (1 - k)) / k)));
      }
    } else {
      // How far this pixel runs from the tile colour toward white, measured on
      // whichever channel has the most room to travel -- blue for Claude's
      // orange, red for ChatGPT's green -- so the mark's antialiasing survives.
      const ch = spec.channel;
      const v = ch === 0 ? r : ch === 1 ? g : b;
      const a = Math.max(0, Math.min(255, Math.round(((v - spec.bg[ch]) / (255 - spec.bg[ch])) * 255)));
      data[i] = spec.ink[0]; data[i + 1] = spec.ink[1]; data[i + 2] = spec.ink[2];
      data[i + 3] = a;
    }
  }
};

await fs.mkdir(OUT, { recursive: true });
const manifest = JSON.parse(await fs.readFile("lib/assets.json", "utf8"));

for (const spec of icons) {
  const src = path.join(SRC, spec.file);
  let pipe = sharp(src, { density: 600 });

  if (spec.pretrim) {
    pipe = sharp(await pipe.png().trim({ threshold: 6 }).toBuffer());
  }
  if (spec.mode === "tile") {
    spec.channel = spec.bg.indexOf(Math.min(...spec.bg)); // most room to white
  }
  if (spec.mode) {
    const { data, info } = await pipe.ensureAlpha().raw()
      .toBuffer({ resolveWithObject: true });
    knockout(data, info, spec);
    if (spec.pretrim) clearBorderInk(data, info.width, info.height);
    pipe = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
  }

  // trim on alpha, then fit the ink into the inset box
  const trimmed = await pipe.png().trim({ threshold: 1 }).toBuffer();
  const box = Math.round(CANVAS * INSET);
  const fitted = await sharp(trimmed)
    .resize({ width: box, height: box, fit: "inside", withoutEnlargement: false })
    .toBuffer();
  const fm = await sharp(fitted).metadata();

  const rel = `tools/${spec.out}.webp`;
  const info = await sharp({
    create: { width: CANVAS, height: CANVAS, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{
      input: fitted,
      top: Math.round((CANVAS - fm.height) / 2),
      left: Math.round((CANVAS - fm.width) / 2),
    }])
    .webp({ quality: 92, effort: 5, alphaQuality: 100 })
    .toFile(`public/${rel}`);

  const blurBuf = await sharp(`public/${rel}`).resize(16).webp({ quality: 40 }).toBuffer();
  manifest[`/${rel}`] = {
    width: info.width, height: info.height,
    blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
  };
  console.log(`  ${spec.out.padEnd(15)} ink ${fm.width}x${fm.height} in ${CANVAS}`);
}

await fs.writeFile("lib/assets.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`${icons.length} icons -> public/tools`);
