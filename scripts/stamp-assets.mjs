// Stamp every manifest entry with a short hash of the file's actual bytes.
//
// Why this exists: the asset filenames are stable by design -- the banner is
// always /me/banner-2026.webp -- so when he drops a new version of a photo and
// it is re-imported, the URL does not change. GitHub Pages serves it with
// Cache-Control: max-age=600 and its own ETag, so a browser that already has
// the old bytes keeps showing them, and the deploy looks like it silently
// failed even though the new file is sitting on the server.
//
// The hash goes into the query string rather than the filename so nothing has
// to move on disk, no stale copies pile up in public/, and the manifest stays
// keyed by clean path. New bytes mean a new URL, which no cache can answer
// from its existing copy.
//
// Runs as a prebuild step, so the stamps can never drift from the files.
import { createHash } from "node:crypto";
import fs from "node:fs/promises";

const MANIFEST = "lib/assets.json";
const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));

let stamped = 0;
let changed = 0;
const missing = [];

for (const [key, meta] of Object.entries(manifest)) {
  const file = `public${key}`;
  let bytes;
  try {
    bytes = await fs.readFile(file);
  } catch {
    missing.push(key);
    continue;
  }
  const v = createHash("md5").update(bytes).digest("hex").slice(0, 8);
  if (meta.v !== v) changed++;
  meta.v = v;
  stamped++;
}

await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

console.log(`stamped ${stamped} assets (${changed} changed)`);
if (missing.length) {
  console.log(`  ${missing.length} manifest entries have no file: ${missing.slice(0, 5).join(", ")}`);
}
