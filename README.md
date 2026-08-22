# Mohamed Tarek — Sr Designer, Team Lead · Portfolio

Bilingual (EN/AR) portfolio and lead-generation site. **Next.js 14 App Router ·
TypeScript · Tailwind · Framer Motion**, exported as a fully static site — no
server, no database, no API routes, no runtime environment variables.

Requires **Node ≥ 20.9**.

```bash
npm ci
npm run dev      # http://localhost:3000
npm run build    # static export -> out/
npm run qa       # audits the export (see "QA" below)
npm run lint
```

---

## What ships

`npm run build` writes a self-contained static site to `out/`. Serve that
directory from anything — S3, nginx, Netlify, Cloudflare Pages, GitHub Pages.
There is nothing to run.

The only build-time inputs are two environment variables, both optional:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | Sub-path the site is served from. Set to `/mohamed-tarek-portfolio` by the GitHub Pages workflow. **Leave unset when hosting at a domain root.** |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, no trailing slash. Every canonical tag, Open Graph URL, sitemap entry and JSON-LD @id is built from it. **Must be set to the new address when moving hosts** or all 15 pages keep telling Google the real version lives on the old domain. |
| `NEXT_DIST_DIR` | Build cache location. See the warning under "Gotchas". |

---

## Layout

```
app/               routes (/, /about, /contact, /work/[slug]) + metadata + JSON-LD
components/        one file per section; ui/ holds the shared primitives
lib/
  dict.ts          every user-facing string, EN and AR. `ar` is typed
                   `typeof en`, so the two can never drift apart silently
  projects.ts      case-study content and gallery ordering
  assets.json      generated image manifest — do not hand-edit
  assets.ts        getAsset() / assetUrl(); owns the cache stamp
  i18n.tsx         language provider (client-side, localStorage-backed)
scripts/           asset pipeline + QA. Only three are wired into npm
public/            everything served verbatim
```

### The asset manifest

`lib/assets.json` maps each image to its width, height, a base64 blur
placeholder, and `v` — a hash of the file's own bytes.

`assetUrl()` appends that hash as `?v=…`. This is load-bearing, not decoration:
asset filenames here are deliberately stable (the hero banner is always
`/me/banner-2026.webp`), so without the stamp a replaced image keeps its old
URL and every browser and CDN holding the previous bytes goes on serving them.
Four consecutive image replacements deployed correctly and all four looked like
they had silently failed before this existed.

`scripts/stamp-assets.mjs` regenerates the hashes and runs automatically as a
`prebuild` hook, so they cannot drift from the files — including in CI.

Any component that builds its own `<img src>` or `<video src>` must use
`assetUrl()`, not a raw path, or that one asset will cache-poison while
everything around it updates.

---

## Deployment

Currently GitHub Pages via `.github/workflows/deploy.yml` — builds on every push
to `main` with `NEXT_PUBLIC_BASE_PATH` set to the repo name.

**Moving to a real host:**

```bash
NEXT_PUBLIC_SITE_URL="https://yourdomain.com" npm run build
```

Then upload the contents of `out/` to the web root. Leave
`NEXT_PUBLIC_BASE_PATH` unset unless the site lives under a sub-path.

Verify before going live: `grep -o 'rel="canonical" href="[^"]*"' out/index.html`
should show the new domain, not the old one.

### Security headers

`public/_headers` carries the full set — CSP, HSTS, `nosniff`,
`Referrer-Policy`, `Permissions-Policy`, frame denial, and cache policy. It is
read natively by **Netlify** and **Cloudflare Pages**.

**GitHub Pages ignores it** — Pages serves no custom headers at all, so the
site currently runs without any of them. That is the single biggest reason to
move hosts.

nginx equivalent:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" always;
add_header X-Frame-Options "DENY" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

location /_next/static/ { add_header Cache-Control "public, max-age=31536000, immutable"; }
location ~* \.html$      { add_header Cache-Control "public, max-age=0, must-revalidate"; }
```

Apache: the same directives inside `<IfModule mod_headers.c>` as `Header always
set …`.

**On `'unsafe-inline'`:** a static export has no per-request nonce, and Next
inlines its hydration payload as roughly a dozen `<script>` blocks. The upgrade
is SHA-256 hashes of those blocks regenerated per build — worth doing the day
any third-party script lands here. `style-src` needs it unconditionally because
Framer Motion writes inline styles. The site has no inputs, no auth and no
cookies, so the practical XSS surface today is nil.

---

## QA

`npm run qa` checks the export: every referenced asset resolves, every page has
a title, description, canonical and exactly one `h1`, all JSON-LD parses, and
the sitemap and robots files are present.

It **refuses to run against a stale export** and exits 1 if `out/` is older than
the newest file in `components/`, `lib/` or `app/`. This is deliberate: a green
QA run that graded a half-hour-old build once passed all six checks while saying
nothing about the code just written.

---

## Gotchas

**`NEXT_DIST_DIR` also moves the export.** It exists so a local build does not
clobber a running dev server's cache, but with `output: "export"` it redirects
the exported site too — the build lands in that directory and `out/` is left
untouched. Either stop the dev server before building, or expect the export
somewhere else. The QA staleness guard exists because of this.

**Running `npm run build` while `npm run dev` is live** overwrites `.next` and
leaves the dev server serving 404s for chunks it thinks it still has. Symptom: a
page that renders unstyled, or a section reporting an absurd height. Fix:
`rm -rf .next` and restart.

**`lib/assets.json` is generated.** Re-run the relevant script in `scripts/`
rather than editing it.

---

## Known gaps

**Arabic has no SEO presence.** The language switch is client-side and both
languages share one URL, so every page renders English into the HTML and search
engines never see a word of Arabic content — verified: the only Arabic string in
the exported markup is the switcher's own label. There is no `hreflang` either,
and adding one would be dishonest without distinct URLs to point at.

For a site targeting Egypt, Saudi Arabia and Kuwait this is the largest
remaining SEO opportunity. The fix is real routing — an `/ar/` route group or a
`[lang]` segment rendering `dict.ar` at build time — which gives each language
its own indexable URL, at which point reciprocal `hreflang` tags become correct
and worth adding.

**Two high-severity advisories remain** in production dependencies, both in
PostCSS as bundled inside Next 14. They are build-time CSS processing and
require attacker-controlled CSS input, which does not exist here. Clearing them
means a Next 15/16 major upgrade — worth scheduling, not urgent.

**React 18 → 19 and Framer Motion 11 → 13** are available and untaken. Both are
breaking; neither is blocking.
