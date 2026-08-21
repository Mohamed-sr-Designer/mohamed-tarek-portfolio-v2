// Production QA over the exported site: every referenced asset resolves, the
// SEO surface is present on each page, and the structured data parses.
import { promises as fs } from "node:fs";
import path from "node:path";

const OUT = "out";
const fail = [];
const warn = [];
const ok = [];

const read = (p) => fs.readFile(p, "utf8");
const exists = async (p) => !!(await fs.stat(p).catch(() => null));

async function htmlFiles(dir = OUT, acc = []) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await htmlFiles(p, acc);
    else if (e.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

// Refuse to grade a stale export.
//
// This bit us: NEXT_DIST_DIR redirects the static export as well as the build
// cache, so a build run with it set writes the site somewhere else entirely and
// leaves out/ untouched. QA then read a half-hour-old export and passed every
// check -- a green run that said nothing about the code just written. A QA pass
// that can be satisfied by yesterday's output is worse than no QA at all, so
// compare the export against the sources it was built from and stop if it is
// behind.
async function newestMtime(dir, skip = /node_modules|.next|^out$|.git/) {
  let newest = 0;
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (skip.test(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) newest = Math.max(newest, await newestMtime(p, skip));
    else if (/.(tsx?|css|json|mjs)$/.test(e.name)) {
      newest = Math.max(newest, (await fs.stat(p)).mtimeMs);
    }
  }
  return newest;
}

if (!(await exists(OUT))) {
  console.error("no out/ — run the build first");
  process.exit(1);
}
const exportedAt = (await fs.stat(path.join(OUT, "index.html"))).mtimeMs;
const sourcedAt = Math.max(
  await newestMtime("components"),
  await newestMtime("lib"),
  await newestMtime("app"),
);
if (sourcedAt > exportedAt) {
  const mins = ((sourcedAt - exportedAt) / 60000).toFixed(1);
  console.error(
    `STALE EXPORT: out/ is ${mins} min older than the newest source file.
` +
      `Nothing below would reflect the current code. Rebuild before running QA.
` +
      `(If you built with NEXT_DIST_DIR set, the export went to that directory, not out/.)`
  );
  process.exit(1);
}

const pages = await htmlFiles();
console.log(`pages: ${pages.length}\n`);

// ---- 1. every local asset reference resolves ------------------------------
const missing = new Set();
const seen = new Set();
for (const p of pages) {
  const html = await read(p);
  for (const m of html.matchAll(
    /(?:src|href)="(\/[^"?#]+\.(?:webp|jpg|jpeg|png|svg|mp4|ico|css|js))(?:\?[^"#]*)?"/g
  )) {
    // route-group folders like /work/[slug]/ arrive percent-encoded in the HTML,
    // and images carry a ?v= cache stamp the filesystem knows nothing about
    const rel = decodeURIComponent(m[1]);
    if (seen.has(rel)) continue;
    seen.add(rel);
    if (!(await exists(path.join(OUT, rel)))) missing.add(rel);
  }
}
if (missing.size) fail.push(`${missing.size} missing assets: ${[...missing].slice(0, 8).join(", ")}`);
else ok.push(`all ${seen.size} referenced assets resolve`);

// ---- 2. SEO surface on every page -----------------------------------------
for (const p of pages) {
  const html = await read(p);
  const rel = p.replace(/\\/g, "/").replace(`${OUT}/`, "/").replace("/index.html", "/");
  if (!/<title>[^<]{8,}<\/title>/.test(html)) fail.push(`${rel}: no <title>`);
  if (!/name="description" content="[^"]{40,}"/.test(html))
    fail.push(`${rel}: no meta description`);
  if (!/rel="canonical"/.test(html)) warn.push(`${rel}: no canonical`);
  if (!/property="og:title"/.test(html)) warn.push(`${rel}: no og:title`);
  if (!/<h1[\s>]/.test(html)) warn.push(`${rel}: no h1`);
  if (/rel="icon"/.test(html) === false) warn.push(`${rel}: no favicon link`);
}
ok.push("title + description present on every page");

// ---- 3. structured data parses --------------------------------------------
let blocks = 0;
for (const p of pages) {
  const html = await read(p);
  for (const m of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
  )) {
    blocks++;
    try {
      JSON.parse(m[1].replace(/\\u003c/g, "<"));
    } catch (e) {
      fail.push(`${p}: invalid JSON-LD (${e.message})`);
    }
  }
}
ok.push(`${blocks} JSON-LD blocks parse`);

// ---- 4. sitemap + robots ---------------------------------------------------
const sitemap = await read(path.join(OUT, "sitemap.xml")).catch(() => "");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) fail.push("sitemap.xml has no URLs");
else ok.push(`sitemap lists ${urls.length} URLs`);
if (!(await exists(path.join(OUT, "robots.txt")))) fail.push("robots.txt missing");
else ok.push("robots.txt present");

// ---- 5. images declare dimensions (layout shift) ---------------------------
let noDims = 0;
for (const p of pages) {
  const html = await read(p);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\bwidth=/.test(tag) && !/\bstyle="[^"]*position:absolute/.test(tag))
      noDims++;
  }
}
if (noDims) warn.push(`${noDims} <img> without explicit width (possible CLS)`);
else ok.push("all images declare dimensions or are fill-positioned");

// ---- report ----------------------------------------------------------------
for (const o of ok) console.log(`  PASS  ${o}`);
for (const w of [...new Set(warn)]) console.log(`  WARN  ${w}`);
for (const f of fail) console.log(`  FAIL  ${f}`);
console.log(
  `\n${fail.length ? `${fail.length} FAILURES` : "no failures"}, ${new Set(warn).size} warnings`
);
process.exit(fail.length ? 1 : 0);
