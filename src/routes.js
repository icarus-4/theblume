import { SERVICE_PAGES, pageBySlug } from './services-data'

// Every page is a real, prerendered URL (…/ai-integration/), so links are
// plain <a href> and crawlers can follow them.
export const BASE = import.meta.env.BASE_URL // '/' on the custom domain and in dev

export const pageHref = (slug = '') => `${BASE}${slug ? `${slug}/` : ''}`
export const homeAnchor = (id) => `${BASE}#${id}`

export const ROUTE_SLUGS = ['', 'services', ...SERVICE_PAGES.map((p) => p.slug)]

export function resolveRoute(pathname = '/') {
  let p = pathname
  if (p.startsWith(BASE)) p = p.slice(BASE.length)
  p = p.replace(/index\.html$/, '').replace(/^\/+|\/+$/g, '')
  if (!p) return { type: 'home', slug: '' }
  if (p === 'services') return { type: 'hub', slug: 'services' }
  if (pageBySlug[p]) return { type: 'service', slug: p, page: pageBySlug[p] }
  return { type: 'home', slug: '' }
}
