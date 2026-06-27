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

  describe('question flagging', () => {
    async function startLessonAndAnswer(user) {
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      render(<App />)

      await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))
      await user.click(screen.getByRole('button', { name: 'Start' }))
      await user.click(screen.getByRole('button', { name: 'naiz' }))

      expect(await screen.findByText('Bikain! Great job!')).toBeInTheDocument()
    }

    it('lets a learner report a problem with a question, with diagnostics attached', async () => {
      const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true })
      const user = userEvent.setup()
      await startLessonAndAnswer(user)

      await user.click(screen.getByRole('button', { name: 'Report a problem with this question' }))

      expect(screen.getByRole('dialog', { name: 'Report a problem' })).toBeInTheDocument()
      const paragraph = (regex) => screen.getByText((_, element) => element.tagName === 'P' && regex.test(element.textContent))
      expect(paragraph(/Question:/)).toBeInTheDocument()
      expect(paragraph(/Correct answer:\s*naiz/)).toBeInTheDocument()
      expect(paragraph(/Your answer:\s*naiz/)).toBeInTheDocument()

      await user.type(screen.getByLabelText("What's wrong? (optional)"), 'This seems off')
      await user.click(screen.getByRole('button', { name: 'Send report' }))

      expect(await screen.findByText("Thanks! We'll take a look.")).toBeInTheDocument()
      expect(fetchMock).toHaveBeenCalledTimes(1)
      const [, options] = fetchMock.mock.calls[0]
      const body = JSON.parse(options.body)
      expect(body).toMatchObject({
        message: 'This seems off',
        email: '',
        context: 'question-flag',
        diagnostics: {
          lessonId: 'izan-present',
          review: false,
          verbId: 'izan',
          tense: 'present',
          person: 'ni',
          kind: 'form',
          correct: 'naiz',
          userAnswer: 'naiz',
          outcome: 'correct',
          language: 'en',
          question: { options: expect.arrayContaining(['naiz']) },
        },
      })
      expect(body.diagnostics.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)

      await user.click(screen.getAllByRole('button', { name: 'Close' })[1])
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Reported' })).toBeDisabled()
    })

    it('resets the "reported" state for the next question', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true })
      const user = userEvent.setup()
      await startLessonAndAnswer(user)

      await user.click(screen.getByRole('button', { name: 'Report a problem with this question' }))
      await user.click(screen.getByRole('button', { name: 'Send report' }))
      await screen.findByText("Thanks! We'll take a look.")
      await user.click(screen.getAllByRole('button', { name: 'Close' })[1])
      expect(screen.getByRole('button', { name: 'Reported' })).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Continue' }))
      await user.click(screen.getByRole('button', { name: 'zara' }))

      expect(screen.getByRole('button', { name: 'Report a problem with this question' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Reported' })).not.toBeInTheDocument()
    })

    it('shows an error if the report submission fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false })
      const user = userEvent.setup()
      await startLessonAndAnswer(user)

      await user.click(screen.getByRole('button', { name: 'Report a problem with this question' }))
      await user.click(screen.getByRole('button', { name: 'Send report' }))

      expect(await screen.findByText('Something went wrong. Please try again later.')).toBeInTheDocument()
    })
  })

  describe('lesson navigation confirmation (#464)', () => {
    afterEach(() => {
      window.history.replaceState({}, '', '/')
    })

    it('exits to the lesson list immediately when no progress has been made yet', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm')
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))
      await user.click(screen.getByRole('button', { name: 'Start' }))
      await user.click(screen.getByRole('button', { name: 'Exit lesson' }))

      expect(screen.getByRole('heading', { name: 'Aditzak' })).toBeInTheDocument()
      expect(confirmSpy).not.toHaveBeenCalled()
    })

    it('asks for confirmation before abandoning a lesson with progress, and stays if cancelled', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))
      await user.click(screen.getByRole('button', { name: 'Start' }))
      await user.click(screen.getByRole('button', { name: 'naiz' }))
      await user.click(screen.getByRole('button', { name: 'Exit lesson' }))

      expect(confirmSpy).toHaveBeenCalledWith('Leave this lesson? Your progress on it will be lost.')
      expect(screen.queryByRole('heading', { name: 'Aditzak' })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Exit lesson' })).toBeInTheDocument()
    })

    it('leaves the lesson when the learner confirms abandoning', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      vi.spyOn(window, 'confirm').mockReturnValue(true)
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))
      await user.click(screen.getByRole('button', { name: 'Start' }))
      await user.click(screen.getByRole('button', { name: 'naiz' }))
      await user.click(screen.getByRole('button', { name: 'Exit lesson' }))

      expect(screen.getByRole('heading', { name: 'Aditzak' })).toBeInTheDocument()
    })

    it('treats the browser back button the same as the exit button', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))
      await user.click(screen.getByRole('button', { name: 'Start' }))
      await user.click(screen.getByRole('button', { name: 'naiz' }))

      window.dispatchEvent(new PopStateEvent('popstate'))
      expect(confirmSpy).toHaveBeenCalledWith('Leave this lesson? Your progress on it will be lost.')
      expect(screen.getByRole('button', { name: 'Exit lesson' })).toBeInTheDocument()

      confirmSpy.mockReturnValue(true)
      window.dispatchEvent(new PopStateEvent('popstate'))

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Aditzak' })).toBeInTheDocument()
      })
    })
  })

  describe('account sign-in', () => {
    afterEach(() => {
      window.history.replaceState({}, '', '/')
    })

    it('requests a magic link and shows the "check your email" step', async () => {
      const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, status: 200 })
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      await user.click(screen.getByRole('button', { name: 'Sign in / create account' }))
      await user.type(screen.getByLabelText('Email'), 'learner@example.com')
      await user.click(screen.getByRole('button', { name: 'Send sign-in link' }))

      expect(await screen.findByText('Check your email')).toBeInTheDocument()
      expect(screen.getByText("We'll sign you in automatically once you click the link.")).toBeInTheDocument()
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/request-link'),
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'learner@example.com' }) }),
      )
    })

    it('shows a rate-limit error from the request-link endpoint', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 429 })
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      await user.click(screen.getByRole('button', { name: 'Sign in / create account' }))
      await user.type(screen.getByLabelText('Email'), 'learner@example.com')
      await user.click(screen.getByRole('button', { name: 'Send sign-in link' }))

      expect(await screen.findByText('Too many attempts. Please wait a bit and try again.')).toBeInTheDocument()
    })

    it('shows an invalid-email error from the request-link endpoint', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 400 })
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      await user.click(screen.getByRole('button', { name: 'Sign in / create account' }))
      await user.type(screen.getByLabelText('Email'), 'learner@example.com')
      await user.click(screen.getByRole('button', { name: 'Send sign-in link' }))

      expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    })

    it('shows a generic error for a server-side failure from the request-link endpoint', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 502 })
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      await user.click(screen.getByRole('button', { name: 'Sign in / create account' }))
      await user.type(screen.getByLabelText('Email'), 'learner@example.com')
      await user.click(screen.getByRole('button', { name: 'Send sign-in link' }))

      expect(await screen.findByText('Something went wrong. Please try again later.')).toBeInTheDocument()
    })

    it('shows a network error if the request-link call fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'))
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      await user.click(screen.getByRole('button', { name: 'Sign in / create account' }))
      await user.type(screen.getByLabelText('Email'), 'learner@example.com')
      await user.click(screen.getByRole('button', { name: 'Send sign-in link' }))

      expect(await screen.findByText('Something went wrong. Please try again later.')).toBeInTheDocument()
    })

    it('completes sign-in from a magic-link URL, persists the session, and signs out', async () => {
      window.history.pushState({}, '', '/?authToken=test-token')
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
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/verify'),
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ token: 'test-token' }) }),
      )
      expect(window.location.search).toBe('')

      const stored = JSON.parse(localStorage.getItem('aditzak:session:v1'))
      expect(stored).toMatchObject({ token: 'session-token', email: 'learner@example.com' })

      await user.click(screen.getByRole('button', { name: 'Sign out' }))

      expect(await screen.findByRole('button', { name: 'Sign in / create account' })).toBeInTheDocument()
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/signout'),
        expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer session-token' }) }),
      )
      expect(localStorage.getItem('aditzak:session:v1')).toBeNull()
    })

    it('restores a signed-in session from localStorage and pulls/pushes the sync snapshot', async () => {
      localStorage.setItem(
        'aditzak:session:v1',
        JSON.stringify({ token: 'session-token', email: 'learner@example.com', expiresAt: Date.now() + 1000 * 60 * 60 }),
      )
      const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((url, options) => {
        if (options?.method === 'PUT') return Promise.resolve({ ok: true, status: 200 })
        return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({ payload: null }) })
      })
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      expect(await screen.findByText('learner@example.com')).toBeInTheDocument()
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/sync'),
        expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer session-token' }) }),
      )
      expect(await screen.findByText('Synced just now')).toBeInTheDocument()
    })

    it('treats an expired stored session as signed out', async () => {
      localStorage.setItem(
        'aditzak:session:v1',
        JSON.stringify({ token: 'session-token', email: 'learner@example.com', expiresAt: Date.now() - 1000 }),
      )
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      expect(screen.getByRole('button', { name: 'Sign in / create account' })).toBeInTheDocument()
    })
  })
})
