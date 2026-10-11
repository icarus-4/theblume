// Per-page <head> tags and JSON-LD, generated at build time by
// scripts/prerender.mjs. Structured data only describes what the page shows.
import { SERVICE_PAGES, SERVICES_HUB, pageBySlug } from './services-data.js'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const HOME = {
  title: 'AI Development & Software Company | theBlume',
  description:
    'AI development company building generative AI apps, AI agents and AI integrations, plus custom software, mobile apps and tech support for every industry.',
  ogTitle: 'theBlume — AI Development & Software Company',
  ogDescription:
    'Generative AI apps, AI agents, AI integration, custom software and mobile apps — designed, built and supported by theBlume.',
}

function organization(site, full) {
  const org = {
    '@type': 'Organization',
    '@id': `${site}#organization`,
    name: 'theBlume',
    url: site,
    logo: { '@type': 'ImageObject', url: `${site}logo-mark.png`, width: 256, height: 256 },
    image: `${site}og-image.png`,
  }
  if (!full) return org
  const offer = (name, serviceType, slug) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name, serviceType, ...(slug ? { url: `${site}${slug}/` } : {}) },
  })
  return {
    ...org,
    description:
      'theBlume is an AI development and software company that builds generative AI apps, AI agents, AI integrations, custom software, Android and iOS apps, and provides tech support for businesses in every industry.',
    slogan: 'Ideas, grown into intelligent software.',
    email: 'hello@theblume.in',
    knowsAbout: [
      'Artificial intelligence development', 'Generative AI', 'Large language models', 'AI agents',
      'Retrieval-augmented generation', 'AI integration', 'Machine learning', 'Computer vision', 'MLOps',
      'Software development', 'Mobile app development', 'Android app development', 'Cloud computing',
      'DevOps', 'UI/UX design', 'IT support',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Technology services',
      itemListElement: SERVICE_PAGES.map((p) => offer(p.navTitle, p.h1.replace(/ (company|services)$/i, ''), p.slug)),
    },
  }
}

function breadcrumbs(site, trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })),
  }
}

function tags({ title, description, url, ogTitle, ogDescription, site, graph }) {
  return `
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="theBlume" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(ogTitle || title)}" />
    <meta property="og:description" content="${esc(ogDescription || description)}" />
    <meta property="og:image" content="${site}og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="theBlume logo with the words AI development, software and apps" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(ogTitle || title)}" />
    <meta name="twitter:description" content="${esc(ogDescription || description)}" />
    <meta name="twitter:image" content="${site}og-image.png" />
    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>
  `
}

export function headFor(slug, site) {
  const website = {
    '@type': 'WebSite',
    '@id': `${site}#website`,
    url: site,
    name: 'theBlume',
    inLanguage: 'en',
    publisher: { '@id': `${site}#organization` },
  }

  if (!slug) {
    return tags({
      ...HOME,
      url: site,
      site,
      graph: [
        organization(site, true),
        website,
        {
          '@type': 'WebPage',
          '@id': `${site}#webpage`,
          url: site,
          name: HOME.title,
          isPartOf: { '@id': `${site}#website` },
          about: { '@id': `${site}#organization` },
          primaryImageOfPage: `${site}og-image.png`,
          inLanguage: 'en',
        },
        {
          '@type': 'MobileApplication',
          name: 'welikethisone: Communities',
          operatingSystem: 'Android',
          applicationCategory: 'SocialNetworkingApplication',
          description: 'Social media governed by the people using it: post on a board, vote on what you see, and vote on each other.',
          url: 'https://www.welikethisone.com/',
          installUrl: 'https://play.google.com/store/apps/details?id=com.welikethisone.app',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
          author: { '@id': `${site}#organization` },
        },
      ],
    })
  }

  if (slug === 'services') {
    const url = `${site}services/`
    return tags({
      title: SERVICES_HUB.metaTitle,
      description: SERVICES_HUB.metaDescription,
      url,
      site,
      graph: [
        organization(site, false),
        website,
        {
          '@type': 'CollectionPage',
          '@id': `${url}#webpage`,
          url,
          name: SERVICES_HUB.metaTitle,
          description: SERVICES_HUB.metaDescription,
          isPartOf: { '@id': `${site}#website` },
          about: { '@id': `${site}#organization` },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: SERVICE_PAGES.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.navTitle, url: `${site}${p.slug}/` })),
          },
        },
        breadcrumbs(site, [['Home', site], ['Services', url]]),
      ],
    })
  }

  const p = pageBySlug[slug]
  const url = `${site}${slug}/`
  return tags({
    title: p.metaTitle,
    description: p.metaDescription,
    url,
    site,
    graph: [
      organization(site, false),
      website,
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: p.metaTitle,
        description: p.metaDescription,
        isPartOf: { '@id': `${site}#website` },
        about: { '@id': `${url}#service` },
        inLanguage: 'en',
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: p.h1.replace(/^./, (c) => c.toUpperCase()),
        serviceType: p.navTitle,
        description: p.lead,
        url,
        provider: { '@id': `${site}#organization` },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${p.navTitle} services`,
          itemListElement: p.offerings.map((o) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: o.title, description: o.body } })),
        },
      },
      breadcrumbs(site, [['Home', site], ['Services', `${site}services/`], [p.navTitle, url]]),
    ],
  })
}

// Used by llms.txt
export function pageIndex(site) {
  return [
    ['Services overview', `${site}services/`, SERVICES_HUB.lead],
    ...SERVICE_PAGES.map((p) => [p.navTitle, `${site}${p.slug}/`, p.lead]),
  ]
}
