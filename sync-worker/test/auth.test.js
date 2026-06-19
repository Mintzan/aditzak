import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import worker from '../src/index.js'
import { createMagicLink } from '../src/db.js'
import { hashToken } from '../src/crypto.js'
import { createTestEnv } from './env.js'

function postJson(path, body, headers = {}) {
  return new Request(`https://example.com${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('POST /auth/request-link', () => {
  it('rejects invalid emails', async () => {
    const env = createTestEnv()
    const response = await worker.fetch(postJson('/auth/request-link', { email: 'not-an-email' }), env)
    expect(response.status).toBe(400)
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('creates a magic link and emails it via Resend', async () => {
    const env = createTestEnv()
    const response = await worker.fetch(postJson('/auth/request-link', { email: 'learner@example.com' }), env)

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })

    const { results } = await env.DB.prepare('SELECT * FROM magic_links WHERE email = ?').bind('learner@example.com').all()
    expect(results).toHaveLength(1)
    expect(results[0].used_at).toBeNull()

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    const [url, init] = globalThis.fetch.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    const sentBody = JSON.parse(init.body)
    expect(sentBody.to).toBe('learner@example.com')
    expect(sentBody.text).toContain('authToken=')
  })

  it('allows a few quick retries before rate limiting the same email', async () => {
    const env = createTestEnv()
    const headers = { 'CF-Connecting-IP': '1.2.3.4' }
    const first = await worker.fetch(postJson('/auth/request-link', { email: 'learner@example.com' }, headers), env)
    const second = await worker.fetch(postJson('/auth/request-link', { email: 'learner@example.com' }, headers), env)
    const third = await worker.fetch(postJson('/auth/request-link', { email: 'learner@example.com' }, headers), env)
    const fourth = await worker.fetch(postJson('/auth/request-link', { email: 'learner@example.com' }, headers), env)

    expect(first.status).toBe(200)
    expect(second.status).toBe(200)
    expect(third.status).toBe(200)
    expect(fourth.status).toBe(429)
    expect(globalThis.fetch).toHaveBeenCalledTimes(3)

    const body = await fourth.json()
    expect(body.retryAfterSeconds).toBeGreaterThan(0)
    expect(fourth.headers.get('Retry-After')).toBe(String(body.retryAfterSeconds))
  })

  it('rate limits repeated requests from the same IP across different emails', async () => {
    const env = createTestEnv()
    const headers = { 'CF-Connecting-IP': '9.9.9.9' }
    await worker.fetch(postJson('/auth/request-link', { email: 'one@example.com' }, headers), env)
    await worker.fetch(postJson('/auth/request-link', { email: 'two@example.com' }, headers), env)
    const third = await worker.fetch(postJson('/auth/request-link', { email: 'three@example.com' }, headers), env)
    const fourth = await worker.fetch(postJson('/auth/request-link', { email: 'four@example.com' }, headers), env)

    expect(third.status).toBe(200)
    expect(fourth.status).toBe(429)
  })

  it('returns 502 without sending another email if Resend fails', async () => {
    globalThis.fetch.mockResolvedValue(new Response('error', { status: 500 }))
    const env = createTestEnv()
    const response = await worker.fetch(postJson('/auth/request-link', { email: 'learner@example.com' }), env)
    expect(response.status).toBe(502)
  })
})

describe('POST /auth/verify', () => {
  it('rejects an unknown token', async () => {
    const env = createTestEnv()
    const response = await worker.fetch(postJson('/auth/verify', { token: 'bogus' }), env)
    expect(response.status).toBe(400)
  })

  it('rejects an expired token', async () => {
    const env = createTestEnv()
    const now = Date.now()
    const tokenHash = await hashToken('expired-token')
    await createMagicLink(env.DB, tokenHash, 'learner@example.com', now - 1000, now - 1)

    const response = await worker.fetch(postJson('/auth/verify', { token: 'expired-token' }), env)
    expect(response.status).toBe(400)
  })

  it('verifies a valid token, creating a user and session', async () => {
    const env = createTestEnv()
    await worker.fetch(postJson('/auth/request-link', { email: 'learner@example.com' }), env)

    const sentBody = JSON.parse(globalThis.fetch.mock.calls[0][1].body)
    const token = new URL(sentBody.text.match(/https?:\/\/\S+/)[0]).searchParams.get('authToken')

    const response = await worker.fetch(postJson('/auth/verify', { token }), env)
    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toMatchObject({ email: 'learner@example.com', hasCloudData: false })
    expect(typeof json.sessionToken).toBe('string')

    const { results: users } = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind('learner@example.com').all()
    expect(users).toHaveLength(1)
  })

  it('rejects re-using the same token', async () => {
    const env = createTestEnv()
    await worker.fetch(postJson('/auth/request-link', { email: 'learner@example.com' }), env)
    const sentBody = JSON.parse(globalThis.fetch.mock.calls[0][1].body)
    const token = new URL(sentBody.text.match(/https?:\/\/\S+/)[0]).searchParams.get('authToken')

    const first = await worker.fetch(postJson('/auth/verify', { token }), env)
    const second = await worker.fetch(postJson('/auth/verify', { token }), env)

    expect(first.status).toBe(200)
    expect(second.status).toBe(400)
  })
})

describe('POST /auth/signout', () => {
  async function signIn(env) {
    await worker.fetch(postJson('/auth/request-link', { email: 'learner@example.com' }), env)
    const sentBody = JSON.parse(globalThis.fetch.mock.calls[0][1].body)
    const token = new URL(sentBody.text.match(/https?:\/\/\S+/)[0]).searchParams.get('authToken')
    const response = await worker.fetch(postJson('/auth/verify', { token }), env)
    return (await response.json()).sessionToken
  }

  it('rejects requests without a bearer token', async () => {
    const env = createTestEnv()
    const response = await worker.fetch(postJson('/auth/signout', {}), env)
    expect(response.status).toBe(401)
  })

  it('removes the session, rejecting subsequent use of the same token', async () => {
    const env = createTestEnv()
    const sessionToken = await signIn(env)
    const headers = { Authorization: `Bearer ${sessionToken}` }

    const first = await worker.fetch(postJson('/auth/signout', {}, headers), env)
    expect(first.status).toBe(200)

    const second = await worker.fetch(postJson('/auth/signout', {}, headers), env)
    expect(second.status).toBe(401)
  })
})
