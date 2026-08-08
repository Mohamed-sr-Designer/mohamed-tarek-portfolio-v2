// New portrait for the home hero, and the banner for the contact page.
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(__dirname, "..");
const PUBLIC = path.join(PROJECT, "public");

const manifestPath = path.join(PROJECT, "lib", "assets.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

async function put(src, rel, resize) {
  const out = path.join(PUBLIC, rel);
  await fs.mkdir(path.dirname(out), { recursive: true });
  const info = await sharp(src)
    .rotate()
    .resize(resize)
    .webp({ quality: 84, effort: 5 })
    .toFile(out);
  manifest["/" + rel] = {
    width: info.width,
    height: info.height,
    blur: `data:image/webp;base64,${(
      await sharp(src).resize(16).webp({ quality: 22 }).toBuffer()
    ).toString("base64")}`,
  };
  console.log(`  ${rel}  ${info.width}x${info.height}`);
}

await put("D:\\123451.png", "me/portrait-hero.webp", {
  width: 1600,
  withoutEnlargement: true,
});

await put("D:\\2134.png", "me/contact-banner.webp", {
  width: 2600,
  withoutEnlargement: true,
});

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
console.log("done");
