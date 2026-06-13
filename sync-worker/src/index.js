// Cloudflare Worker: magic-link auth + cross-device progress sync backend
// for the Aditzak app, backed by D1. See docs/CLOUDFLARE_SYNC_WORKER.md for
// setup.

import { corsHeaders, jsonResponse } from './cors.js'
import { handleRequestLink, handleSignout, handleVerify } from './routes/auth.js'
import { handleGetSync, handlePutSync } from './routes/sync.js'

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

    if (request.method === 'POST' && url.pathname === '/auth/request-link') {
      return handleRequestLink(request, env, cors)
    }

    if (request.method === 'POST' && url.pathname === '/auth/verify') {
      return handleVerify(request, env, cors)
    }

    if (request.method === 'POST' && url.pathname === '/auth/signout') {
      return handleSignout(request, env, cors)
    }

    if (request.method === 'GET' && url.pathname === '/sync') {
      return handleGetSync(request, env, cors)
    }

    if (request.method === 'PUT' && url.pathname === '/sync') {
      return handlePutSync(request, env, cors)
    }

    return jsonResponse({ error: 'Not found' }, 404, cors)
  },
}
