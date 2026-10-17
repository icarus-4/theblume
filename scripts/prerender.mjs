// Post-build step: render every route to static HTML with its own <head>
// (title, description, canonical, Open Graph, JSON-LD), then write
// robots.txt, sitemap.xml and llms.txt for the configured site URL.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const env = loadEnv('production', root, 'VITE_')
const site = (env.VITE_SITE_URL || '').replace(/\/?$/, '/')
if (!/^https?:\/\//.test(site)) throw new Error('VITE_SITE_URL must be an absolute URL (see .env)')
const base = new URL(site).pathname

const imp = (p) => import(pathToFileURL(resolve(root, p)).href)
const { render } = await imp('dist-ssr/entry-server.js')
const { headFor, pageIndex } = await imp('src/seo.js')
const { SERVICE_PAGES } = await imp('src/services-data.js')
const { AI_SERVICES, FAQS, APPS } = await imp('src/content.js')

const template = readFileSync(resolve(dist, 'index.html'), 'utf8')
const SEO_BLOCK = /<!-- seo:start[\s\S]*?<!-- seo:end -->/
if (!SEO_BLOCK.test(template)) throw new Error('seo markers not found in dist/index.html')
if (!template.includes('<div id="root"></div>')) throw new Error('root placeholder not found in dist/index.html')

const slugs = ['', 'services', ...SERVICE_PAGES.map((p) => p.slug)]
let words = []
for (const slug of slugs) {
  const body = render(`${base}${slug ? `${slug}/` : ''}`)
  const html = template
    .replace(SEO_BLOCK, headFor(slug, site).trim())
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  const dir = slug ? resolve(dist, slug) : dist
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), html)
  // Unique content only: <main> minus the shared contact section.
  const unique = body.slice(body.indexOf('<main'), body.indexOf('<section id="contact"'))
  const text = unique.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ')
  words.push([slug || '(home)', text.split(/\s+/).filter(Boolean).length])
}

writeFileSync(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}sitemap.xml\n`)

const today = new Date().toISOString().slice(0, 10)
writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${slugs.map((s) => `  <url>\n    <loc>${site}${s ? `${s}/` : ''}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n')}
</urlset>
`,
)

writeFileSync(
  resolve(dist, 'llms.txt'),
  `# Ivies

> Ivies is an AI development and software company. We build generative AI apps, AI agents, RAG knowledge assistants and machine learning systems, integrate AI into existing software, and deliver custom software, Android and iOS apps, cloud and DevOps, UI/UX design and ongoing tech support for businesses in every industry.

## Service pages
${pageIndex(site).map(([name, url, desc]) => `- [${name}](${url}): ${desc}`).join('\n')}

## AI development capabilities
${AI_SERVICES.map((s) => `- ${s.title}: ${s.body}`).join('\n')}

## Our products
${APPS.map((a) => `- ${a.name}${a.subtitle ? ` (${a.subtitle})` : ''}${a.website ? ` (${a.website})` : ''}: ${a.tagline}${a.status === 'live' && a.url ? ` Google Play: ${a.url}` : ' Coming soon to app stores.'}`).join('\n')}

## FAQ
${FAQS.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}
`,
)

rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerendered ${slugs.length} pages for ${site}`)
console.table(Object.fromEntries(words))
