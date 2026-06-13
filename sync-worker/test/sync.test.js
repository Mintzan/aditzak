import { describe, expect, it } from 'vitest'
import worker from '../src/index.js'
import { createTestEnv } from './env.js'
import { signIn } from './helpers.js'

function getSync(headers = {}) {
  return new Request('https://example.com/sync', { method: 'GET', headers })
}

function putSync(body, headers = {}) {
  return new Request('https://example.com/sync', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

const PAYLOAD = { progress: { 'lesson-1': { attempts: 1, bestScore: 1 } }, dailyStreak: {}, points: {}, errorStats: {} }

describe('GET /sync', () => {
  it('rejects requests without a bearer token', async () => {
    const env = createTestEnv()
    const response = await worker.fetch(getSync(), env)
    expect(response.status).toBe(401)
  })

  it('rejects an invalid bearer token', async () => {
    const env = createTestEnv()
    const response = await worker.fetch(getSync({ Authorization: 'Bearer not-a-real-token' }), env)
    expect(response.status).toBe(401)
  })

  it('rejects an expired session', async () => {
    const env = createTestEnv()
    const sessionToken = await signIn(env)
    await env.DB.prepare("UPDATE sessions SET expires_at = 0").run()

    const response = await worker.fetch(getSync({ Authorization: `Bearer ${sessionToken}` }), env)
    expect(response.status).toBe(401)
  })

  it('returns a 404 with a null payload when no snapshot exists yet', async () => {
    const env = createTestEnv()
    const sessionToken = await signIn(env)

    const response = await worker.fetch(getSync({ Authorization: `Bearer ${sessionToken}` }), env)
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ payload: null })
  })
})

describe('PUT /sync', () => {
  it('rejects requests without a bearer token', async () => {
    const env = createTestEnv()
    const response = await worker.fetch(putSync({ payload: PAYLOAD, schemaVersion: 1 }), env)
    expect(response.status).toBe(401)
  })

  it('rejects a body missing payload or schemaVersion', async () => {
    const env = createTestEnv()
    const sessionToken = await signIn(env)
    const headers = { Authorization: `Bearer ${sessionToken}` }

    const response = await worker.fetch(putSync({ payload: PAYLOAD }, headers), env)
    expect(response.status).toBe(400)
  })

  it('rejects an oversized payload without writing to D1', async () => {
    const env = createTestEnv()
    const sessionToken = await signIn(env)
    const headers = { Authorization: `Bearer ${sessionToken}` }

    const hugePayload = { ...PAYLOAD, filler: 'x'.repeat(300 * 1024) }
    const putResponse = await worker.fetch(putSync({ payload: hugePayload, schemaVersion: 1 }, headers), env)
    expect(putResponse.status).toBe(413)

    const getResponse = await worker.fetch(getSync(headers), env)
    expect(getResponse.status).toBe(404)
  })

  it('round-trips a payload via PUT then GET', async () => {
    const env = createTestEnv()
    const sessionToken = await signIn(env)
    const headers = { Authorization: `Bearer ${sessionToken}` }

    const putResponse = await worker.fetch(putSync({ payload: PAYLOAD, schemaVersion: 1 }, headers), env)
    expect(putResponse.status).toBe(200)
    const putJson = await putResponse.json()
    expect(putJson.ok).toBe(true)
    expect(typeof putJson.updatedAt).toBe('number')

    const getResponse = await worker.fetch(getSync(headers), env)
    expect(getResponse.status).toBe(200)
    expect(await getResponse.json()).toEqual({ payload: PAYLOAD, schemaVersion: 1, updatedAt: putJson.updatedAt })
  })

  it('overwrites a previous snapshot on a second PUT', async () => {
    const env = createTestEnv()
    const sessionToken = await signIn(env)
    const headers = { Authorization: `Bearer ${sessionToken}` }

    await worker.fetch(putSync({ payload: PAYLOAD, schemaVersion: 1 }, headers), env)
    const updatedPayload = { ...PAYLOAD, dailyStreak: { current: 5 } }
    await worker.fetch(putSync({ payload: updatedPayload, schemaVersion: 2 }, headers), env)

    const getResponse = await worker.fetch(getSync(headers), env)
    const json = await getResponse.json()
    expect(json.payload).toEqual(updatedPayload)
    expect(json.schemaVersion).toBe(2)
  })
})
