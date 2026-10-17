# Ivies

Website for **Ivies** (formerly theBlume) — an AI development and software
company. Live at <https://www.theivies.in/> (www.theblume.in redirects there).

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

## Hosting

The site is hosted on AWS (S3 + CloudFront, account resources tagged
`Project=theblume` from the original name, isolated from other projects). DNS
for `theivies.in` and the old `theblume.in` stays at GoDaddy: each `www` is a
CNAME to CloudFront, and each bare domain forwards to `https://www.theivies.in`.
A CloudFront function 301-redirects `www.theblume.in` to `www.theivies.in`. If the domain ever changes, update `VITE_SITE_URL`
and the CloudFront alternate domain names together.

## Deploy

Every push to `main` builds the site and publishes it to S3/CloudFront via
`.github/workflows/deploy.yml`, using GitHub OIDC (no stored AWS keys). The
`theblume-github-deploy` role can only write to the site bucket and refresh
its CDN. Manual deploy after `npm run build`:

```bash
S3_BUCKET=theblume-in-website CF_DISTRIBUTION_ID=E1Z0PRVKRFFOIU bash scripts/deploy-aws.sh
```
