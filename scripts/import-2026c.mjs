// Third drop: the night-shoot banner, a new Board 01, and the Blender renders.
import sharp from "sharp";
import fs from "node:fs/promises";

const manifest = JSON.parse(await fs.readFile("lib/assets.json", "utf8"));

async function put(src, rel, resize) {
  await fs.mkdir(`public/${rel.split("/").slice(0, -1).join("/")}`, { recursive: true });
  const info = await sharp(src).rotate().resize(resize)
    .webp({ quality: 86, effort: 5 }).toFile(`public/${rel}`);
  const blurBuf = await sharp(`public/${rel}`).resize(16).webp({ quality: 40 }).toBuffer();
  manifest[`/${rel}`] = {
    width: info.width, height: info.height,
    blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
  };
  return `${info.width}x${info.height}`;
}

const DESK = "C:/Users/tarek/OneDrive/Desktop";

// The banner. One file serves the home hero and the About hero; it is wide
// enough to stay sharp full-bleed on a large display.
console.log("banner  ", await put(
  `${DESK}/Man_standing_near_muscle_car_202608211245.png`,
  "me/banner-2026.webp",
  { width: 2560, withoutEnlargement: true }
));

// Board 01 in the storyboards toggle is the file numbered 02 -- the section
// shows them in the order 02, 01, 03, 04, and labels them by position.
console.log("board 01", await put(
  `${DESK}/شسي.png`,
  "work/storyboards/02.webp",
  { width: 2200, withoutEnlargement: true }
));

// Blender renders, in the order the folder lists them.
const blenderDir = "D:/New folder (6)";
const blenderFiles = (await fs.readdir(blenderDir))
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
for (const [i, f] of blenderFiles.entries()) {
  const id = String(i + 1).padStart(2, "0");
  console.log(`blender ${id}`, await put(`${blenderDir}/${f}`, `work/blender/${id}.webp`,
    { width: 1920, withoutEnlargement: true }));
}

await fs.writeFile("lib/assets.json", JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest updated");
