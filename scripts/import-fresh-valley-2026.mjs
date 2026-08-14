// Replaces the whole Fresh Valley set with the new AI-generated series.
//
// Every frame is generated with prompt engineering in Google Flow, so the old
// nine are cleared out rather than added to. 11.png leads (it becomes 01), the
// rest follow in folder order.
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(__dirname, "..");
const PUBLIC = path.join(PROJECT, "public");
const SRC = "C:\\Users\\tarek\\OneDrive\\Desktop\\New folder (19)";
const DEST = "work/social/fresh-valley";

const natural = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const manifestPath = path.join(PROJECT, "lib", "assets.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

// clear the old set completely
await fs.rm(path.join(PUBLIC, DEST), { recursive: true, force: true });
for (const k of Object.keys(manifest))
  if (k.startsWith(`/${DEST}/`)) delete manifest[k];

const all = (await fs.readdir(SRC))
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort(natural);

// 11.png is the master, so it takes slot 01 and the rest keep folder order
const LEAD = "11.png";
const ordered = [LEAD, ...all.filter((f) => f !== LEAD)];

const dupes = [];
const seen = new Map();
let n = 0;

for (const f of ordered) {
  const src = path.join(SRC, f);
  const h = (await import("node:crypto"))
    .createHash("md5")
    .update(await fs.readFile(src))
    .digest("hex");
  if (seen.has(h)) dupes.push(`${f} is identical to ${seen.get(h)}`);
  else seen.set(h, f);

  n++;
  const rel = `${DEST}/${String(n).padStart(2, "0")}.webp`;
  const out = path.join(PUBLIC, rel);
  await fs.mkdir(path.dirname(out), { recursive: true });
  const info = await sharp(src)
    .rotate()
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(out);
  manifest["/" + rel] = {
    width: info.width,
    height: info.height,
    blur: `data:image/webp;base64,${(
      await sharp(src).resize(16).webp({ quality: 22 }).toBuffer()
    ).toString("base64")}`,
  };
  console.log(`  ${rel} <- ${f}  ${info.width}x${info.height}`);
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\nfresh-valley: ${n} images (01 = ${LEAD})`);
if (dupes.length) {
  console.log("repeated source images:");
  for (const d of dupes) console.log("  ! " + d);
}
