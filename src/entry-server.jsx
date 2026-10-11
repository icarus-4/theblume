import { renderToString } from 'react-dom/server'
import App from './App'

// Build-time render: puts the real page content into index.html so search
// engines and AI crawlers that don't run JavaScript can read it.
export function render(path) {
  return renderToString(<App path={path} />)
}
