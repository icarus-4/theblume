# theBlume

Website for **theBlume** — an AI development and software company. Live at
<https://icarus-4.github.io/theblume/>.

A motion-driven React site (Vite, framer-motion, three.js particle field, Lenis
smooth scrolling) with a home page, a services hub and 11 dedicated service
pages. Every page is prerendered to static HTML at build time so search
engines and AI crawlers can read it without running JavaScript.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # client build → server render → per-page HTML in dist/
npm run preview    # serve dist/ exactly as it will be deployed
```

`npm run build` also writes `sitemap.xml`, `robots.txt` and `llms.txt`.

## Where things live

| What | File |
|---|---|
| Home page copy, FAQs, apps | `src/content.js` |
| Service page content | `src/services-data.js` |
| Per-page titles, meta tags, JSON-LD | `src/seo.js` |
| Site URL (canonical, sitemap, Open Graph) | `.env` → `VITE_SITE_URL` |

Moving to a custom domain: set `VITE_SITE_URL` to the new URL (for example
`https://theblume.com/`) and add the domain in the repository's Pages settings.

## Deploy

Every push to `main` builds and publishes the site to GitHub Pages via
`.github/workflows/deploy.yml`.
