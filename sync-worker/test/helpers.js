import { vi } from 'vitest'
import worker from '../src/index.js'

export function postJson(path, body, headers = {}) {
  return new Request(`https://example.com${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

// Signs in via the magic-link flow and returns a session token, mocking the
// Resend email call along the way.
export async function signIn(env, email = 'learner@example.com') {
  const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))

  await worker.fetch(postJson('/auth/request-link', { email }), env)
  const sentBody = JSON.parse(fetchSpy.mock.calls[0][1].body)
  const token = new URL(sentBody.text.match(/https?:\/\/\S+/)[0]).searchParams.get('authToken')

  const response = await worker.fetch(postJson('/auth/verify', { token }), env)
  const { sessionToken } = await response.json()

  fetchSpy.mockRestore()
  return sessionToken
}
