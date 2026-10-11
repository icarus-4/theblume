import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Pages live in sub-folders (/ai-integration/ …), so assets need an absolute
// base. It is taken from VITE_SITE_URL: '/theblume/' on GitHub Pages, '/' on
// a custom domain. The dev server always uses '/'; `vite preview` mirrors production.
export default defineConfig(({ command, mode, isPreview }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const base = (command === 'build' || isPreview) && env.VITE_SITE_URL ? new URL(env.VITE_SITE_URL).pathname : '/'
  return {
    base,
    plugins: [react()],
    server: { port: 5173, strictPort: true },
    // three.js is code-split into its own lazy chunk; it's large by nature.
    build: { chunkSizeWarningLimit: 600 },
  }
})
