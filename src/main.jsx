import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAnalytics } from './analytics.js'

initAnalytics()

// Without this, the browser's own scroll restoration (`history.scrollRestoration`
// defaults to 'auto') reapplies the pre-reload scroll position *after* React's
// effects run, clobbering the "jump to last lesson"/"restore position" scroll
// handled in `AppShell`/`HomeScreen` (see docs/DECISIONS.md, 2026-06-12).
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
