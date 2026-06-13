// Cloudflare Worker: magic-link auth + cross-device progress sync backend
// for the Aditzak app, backed by D1. See docs/CLOUDFLARE_SYNC_WORKER.md for
// setup. The `/auth/*` and `/sync` endpoints land in follow-up issues — for
// now this only exposes a health-check route.

const JSON_HEADERS = { 'content-type': 'application/json' }

function corsHeaders(origin, allowedOrigin) {
  const headers = {
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  if (origin && origin === allowedOrigin) {
    headers['Access-Control-Allow-Origin'] = allowedOrigin
  }
  return headers
}

function jsonResponse(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...cors },
  })
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN)
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    if (request.method === 'GET' && url.pathname === '/healthz') {
      return jsonResponse({ ok: true }, 200, cors)
    }

    return jsonResponse({ error: 'Not found' }, 404, cors)
  },
}
