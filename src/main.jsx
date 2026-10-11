import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './styles.css'
import './ai-faq.css'
import './layout.css'
import App from './App'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App path={window.location.pathname} />
  </StrictMode>
)

// Production HTML is prerendered (scripts/prerender.mjs), so attach to it;
// the dev server serves an empty root and renders from scratch.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
