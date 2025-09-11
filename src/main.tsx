import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// --- Preconnect & DNS Prefetch (uses VITE_INSTANCE) ---
;(function setupPreconnect() {
  try {
    const inst = import.meta.env?.VITE_INSTANCE as string | undefined
    if (!inst) return
    const u = new URL(inst)
    const host = `${u.protocol}//${u.host}`
    const mk = (rel: string, href: string, crossorigin = false) => {
      const l = document.createElement('link')
      l.rel = rel
      l.href = href
      if (crossorigin) l.crossOrigin = 'anonymous'
      document.head.appendChild(l)
    }
    mk('dns-prefetch', host)
    mk('preconnect', host, true)
  } catch {
    /* empty */
  }
})()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
