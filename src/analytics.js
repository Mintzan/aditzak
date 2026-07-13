import posthog from 'posthog-js'

// PostHog project API key for this app's site.
// Not secret: project API keys are meant to be embedded in client-side code
// (write-only, used only to send events). See docs/technical/POSTHOG_ANALYTICS.md for
// where it came from and how to override it (e.g. for forks pointing at a
// different PostHog project).
const DEFAULT_POSTHOG_KEY = 'phc_qBmWmnpSzrrJ24AJuWWo7ZGVoGtrsZeVyuSeEKabB5A7'
const DEFAULT_POSTHOG_HOST = 'https://eu.i.posthog.com'

let initialized = false

// Initializes PostHog: autocaptured pageviews/clicks, plus custom events
// sent via `trackEvent`.
export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY || DEFAULT_POSTHOG_KEY
  if (!key) return

  posthog.init(key, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || DEFAULT_POSTHOG_HOST,
    person_profiles: 'identified_only',
  })
  initialized = true
}

// Sends a custom event to PostHog. No-ops if `initAnalytics` hasn't run
// (e.g. in tests, which render components without the app's entry point).
export function trackEvent(name, properties) {
  if (!initialized) return
  posthog.capture(name, properties)
}
