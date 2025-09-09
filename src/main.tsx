import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// --- Preconnect & DNS Prefetch (uses VITE_INSTANCE) ---
;(function setupPreconnect() {
  try {
    const inst = (import.meta as any).env?.VITE_INSTANCE as string | undefined
    if (!inst) return
    const u = new URL(inst)
    const host = `${u.protocol}//${u.host}`
    const mk = (rel: string, href: string, crossorigin = false) => {
      const l = document.createElement('link')
      l.rel = rel as any
      l.href = href
      if (crossorigin) (l as any).crossOrigin = 'anonymous'
      document.head.appendChild(l)
    }
    mk('dns-prefetch', host)
    mk('preconnect', host, true)
  } catch {}
})()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
