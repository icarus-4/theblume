import { SERVICE_PAGES } from '../services-data'
import { pageHref, homeAnchor } from '../routes'
import Wordmark from './Wordmark'

// Site-wide footer: crawlable links to every service page from every page.
export default function Footer({ isHome, onNavigate }) {
  const anchor = (id, label) => (
    <a
      href={isHome ? `#${id}` : homeAnchor(id)}
      onClick={isHome ? (e) => (e.preventDefault(), onNavigate(id)) : undefined}
    >
      {label}
    </a>
  )
  const ai = SERVICE_PAGES.filter((p) => p.kind === 'ai')
  const other = SERVICE_PAGES.filter((p) => p.kind !== 'ai')

  return (
    <footer className="footer" data-shape="5" data-dim="0">
      <div className="container footer-cols">
        <div className="footer-brand-col">
          <a href={pageHref()} className="footer-brand" aria-label="theBlume home">
            <img src={`${import.meta.env.BASE_URL}logo-mark.png`} alt="" width="44" height="44" />
            <Wordmark />
          </a>
          <p>AI development and software company. We build generative AI, AI agents, custom software and apps, and support them after launch.</p>
        </div>
        <nav aria-label="AI services">
          <h2 className="footer-h">AI services</h2>
          <ul>
            {ai.map((p) => <li key={p.slug}><a href={pageHref(p.slug)}>{p.navTitle}</a></li>)}
          </ul>
        </nav>
        <nav aria-label="Development and support services">
          <h2 className="footer-h">Development & support</h2>
          <ul>
            {other.map((p) => <li key={p.slug}><a href={pageHref(p.slug)}>{p.navTitle}</a></li>)}
            <li><a href={pageHref('services')}>All services</a></li>
          </ul>
        </nav>
        <nav aria-label="Company">
          <h2 className="footer-h">Company</h2>
          <ul>
            <li>{anchor('finhance', 'FinHance LMS')}</li>
            <li>{anchor('apps', 'Our apps')}</li>
            <li>{anchor('process', 'How we work')}</li>
            <li>{anchor('industries', 'Industries')}</li>
            <li>{anchor('faq', 'FAQ')}</li>
          </ul>
        </nav>
      </div>
      <div className="container footer-bottom">
        <p className="mono footer-copy">© {new Date().getFullYear()} theBlume. Technology that grows with you.</p>
      </div>
      <div className="footer-giant" aria-hidden="true">
        <span className="wordmark-the">the</span>Blume
      </div>
    </footer>
  )
}
