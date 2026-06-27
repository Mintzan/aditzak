import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    // Bypass the one-time language-onboarding screen for tests that exercise
    // the lesson flow — see the dedicated onboarding test below.
    localStorage.setItem('aditzak:lang:v1', 'en')
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('cross-device sync', () => {
    afterEach(() => {
      window.history.replaceState({}, '', '/')
    })

    it('migrates a v1 {balance} value to the v2 PN-Counter shape on first load', async () => {
      localStorage.setItem('aditzak:points:v1', JSON.stringify({ balance: 42 }))
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      expect((await screen.findAllByText('42')).length).toBeGreaterThan(0)

      const deviceId = localStorage.getItem('aditzak:deviceId:v1')
      expect(JSON.parse(localStorage.getItem('aditzak:points:v2'))).toEqual({ earned: { [deviceId]: 42 }, spent: {} })
    })

    it('pushes local data silently when signing in to an account with no cloud data', async () => {
      window.history.pushState({}, '', '/?authToken=test-token')
      localStorage.setItem(
        'aditzak:progress:v1',
        JSON.stringify({ 'izan-present': { attempts: 1, bestScore: 2, totalQuestions: 3, bestStars: 1, lastPlayed: '2026-06-01T00:00:00.000Z' } }),
      )
      const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
        if (String(url).includes('/auth/verify')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ sessionToken: 'session-token', email: 'learner@example.com', hasCloudData: false }),
          })
        }
        return Promise.resolve({ ok: true, status: 200 })
      })
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      expect(await screen.findByText('learner@example.com')).toBeInTheDocument()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      await waitFor(() =>
        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/sync'), expect.objectContaining({ method: 'PUT' })),
      )
    })

    it('adopts the cloud snapshot silently when this device has no local data yet', async () => {
      window.history.pushState({}, '', '/?authToken=test-token')
      const cloudPayload = {
        progress: { 'izan-present': { attempts: 3, bestScore: 3, totalQuestions: 3, bestStars: 3, lastPlayed: '2026-06-10T00:00:00.000Z' } },
        dailyStreak: {},
        points: { earned: { 'cloud-device': 30 }, spent: {} },
        errorStats: {},
      }
      const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((url, options) => {
        if (String(url).includes('/auth/verify')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ sessionToken: 'session-token', email: 'learner@example.com', hasCloudData: true }),
          })
        }
        if (options?.method === 'PUT') return Promise.resolve({ ok: true, status: 200 })
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ payload: cloudPayload, schemaVersion: 1, updatedAt: Date.now() }) })
      })
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      expect(await screen.findByText('learner@example.com')).toBeInTheDocument()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect((await screen.findAllByText('30')).length).toBeGreaterThan(0)
      expect(fetchMock).not.toHaveBeenCalledWith(expect.stringContaining('/sync'), expect.objectContaining({ method: 'PUT' }))
    })

    describe('first sign-in merge', () => {
      const localProgress = {
        'izan-present': { attempts: 1, bestScore: 2, totalQuestions: 3, bestStars: 1, lastPlayed: '2026-06-01T00:00:00.000Z' },
      }
      const cloudPayload = {
        progress: {
          'izan-present': { attempts: 3, bestScore: 3, totalQuestions: 3, bestStars: 3, lastPlayed: '2026-06-10T00:00:00.000Z' },
          'egon-present': { attempts: 2, bestScore: 3, totalQuestions: 3, bestStars: 2, lastPlayed: '2026-06-10T00:00:00.000Z' },
        },
        dailyStreak: {},
        points: { earned: { 'cloud-device': 50 }, spent: {} },
        errorStats: {},
      }

      function mockFetch() {
        return vi.spyOn(globalThis, 'fetch').mockImplementation((url, options) => {
          if (String(url).includes('/auth/verify')) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ sessionToken: 'session-token', email: 'learner@example.com', hasCloudData: true }),
            })
          }
          if (options?.method === 'PUT') return Promise.resolve({ ok: true, status: 200 })
          return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ payload: cloudPayload, schemaVersion: 1, updatedAt: Date.now() }) })
        })
      }

      beforeEach(() => {
        window.history.pushState({}, '', '/?authToken=test-token')
        localStorage.setItem('aditzak:progress:v1', JSON.stringify(localProgress))
      })

      it('shows the merge modal when both this device and the account have data', async () => {
        mockFetch()
        render(<App />)

        expect(await screen.findByRole('dialog', { name: 'Sync your progress' })).toBeInTheDocument()
      })

      it('applies "keep the best of both"', { timeout: 15000 }, async () => {
        mockFetch()
        const user = userEvent.setup()
        render(<App />)

        await user.click(await screen.findByRole('button', { name: /Keep the best of both/ }))
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

        const progress = JSON.parse(localStorage.getItem('aditzak:progress:v1'))
        expect(progress['izan-present']).toEqual({
          attempts: 3,
          bestScore: 3,
          totalQuestions: 3,
          bestStars: 3,
          lastPlayed: '2026-06-10T00:00:00.000Z',
        })
        expect(progress['egon-present']).toEqual(cloudPayload.progress['egon-present'])
      })

      it("applies \"use this device's progress\"", { timeout: 15000 }, async () => {
        const fetchMock = mockFetch()
        const user = userEvent.setup()
        render(<App />)

        await user.click(await screen.findByRole('button', { name: /Use this device's progress/ }))
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

        const putCall = fetchMock.mock.calls.find(([, options]) => options?.method === 'PUT')
        expect(JSON.parse(putCall[1].body).payload.progress).toEqual(localProgress)
        expect(JSON.parse(localStorage.getItem('aditzak:progress:v1'))).toEqual(localProgress)
      })

      it('applies "use account progress"', { timeout: 15000 }, async () => {
        mockFetch()
        const user = userEvent.setup()
        render(<App />)

        await user.click(await screen.findByRole('button', { name: /Use account progress/ }))
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

        expect(JSON.parse(localStorage.getItem('aditzak:progress:v1'))).toEqual(cloudPayload.progress)
      })
    })

    it('shows "Syncing…" while the initial sync is in flight, then "Synced just now"', async () => {
      localStorage.setItem(
        'aditzak:session:v1',
        JSON.stringify({ token: 'session-token', email: 'learner@example.com', expiresAt: Date.now() + 1000 * 60 * 60 }),
      )
      let releaseFirstFetch
      const firstFetch = new Promise((resolve) => {
        releaseFirstFetch = resolve
      })
      let callCount = 0
      vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
        callCount += 1
        if (callCount === 1) return firstFetch.then(() => ({ ok: false, status: 404, json: () => Promise.resolve({ payload: null }) }))
        return Promise.resolve({ ok: true, status: 200 })
      })
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      expect(await screen.findByText('Syncing…')).toBeInTheDocument()

      releaseFirstFetch()
      expect(await screen.findByText('Synced just now')).toBeInTheDocument()
    })

    it('shows "Sync failed, will retry" when the initial sync fails', async () => {
      localStorage.setItem(
        'aditzak:session:v1',
        JSON.stringify({ token: 'session-token', email: 'learner@example.com', expiresAt: Date.now() + 1000 * 60 * 60 }),
      )
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 500 })
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      expect(await screen.findByText('Sync failed, will retry')).toBeInTheDocument()
    })

    it('pushes a debounced background sync after resetting progress while signed in', async () => {
      localStorage.setItem(
        'aditzak:session:v1',
        JSON.stringify({ token: 'session-token', email: 'learner@example.com', expiresAt: Date.now() + 1000 * 60 * 60 }),
      )
      const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((url, options) => {
        if (options?.method === 'PUT') return Promise.resolve({ ok: true, status: 200 })
        return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({ payload: null }) })
      })
      vi.spyOn(window, 'confirm').mockReturnValue(true)
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      expect(await screen.findByText('Synced just now')).toBeInTheDocument()

      fetchMock.mockClear()
      await user.click(screen.getByRole('button', { name: 'Reset progress' }))

      await waitFor(
        () => expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/sync'), expect.objectContaining({ method: 'PUT' })),
        { timeout: 2000 },
      )
    })
  })
})
