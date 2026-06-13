import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { generateQuestions } from './lessonLogic'
import { VERBS } from './data/verbs'

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

  it('renders the home screen with the learning journey', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Aditzak' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Phase I' })).toBeInTheDocument()
    expect(screen.getByText(/Who and Where/)).toBeInTheDocument()
    expect(screen.getAllByText(/^izan — to be/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/egon — to be/).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Coming soon').length).toBeGreaterThan(0)
  })

  it('shows a conjugation preview before a lesson’s first attempt, then starts the exercise on "Start"', async () => {
    // A roll just under 1 keeps `rollQuestionKind` on the 'form' framing
    // (roll >= SPECIAL_QUESTION_CHANCE) without disturbing `shuffle`'s
    // Fisher-Yates swaps (Math.floor(0.99 * (i + 1)) === i for every i).
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))

    expect(screen.getByText('Take a look before you start')).toBeInTheDocument()
    expect(screen.getByText('naiz')).toBeInTheDocument()
    expect(screen.getByText('zara')).toBeInTheDocument()
    expect(screen.getByText('da')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Start' }))

    expect(screen.queryByText('Take a look before you start')).not.toBeInTheDocument()
    expect(screen.getByText('Which form is correct?')).toBeInTheDocument()
  })

  it('skips the preview but already shows sentence-based questions on a lesson’s second attempt', async () => {
    localStorage.setItem(
      'aditzak:progress:v1',
      JSON.stringify({
        'izan-present': { attempts: 1, bestScore: 3, totalQuestions: 3, bestStars: 3, lastPlayed: new Date().toISOString() },
      }),
    )
    // A roll of 0 picks the 'sentence' framing — allowed even during the
    // no-typing ramp (see `NO_TYPING_ATTEMPTS`), unlike `type-verb`/
    // `type-pronoun`/`spot-error`.
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))

    expect(screen.queryByText('Take a look before you start')).not.toBeInTheDocument()
    expect(screen.getByText('Which word completes the sentence?')).toBeInTheDocument()
  })

  it('shows a language selector before the home screen on first launch, then remembers the choice', async () => {
    localStorage.removeItem('aditzak:lang:v1')
    const user = userEvent.setup()
    render(<App />)

    expect(screen.queryByRole('heading', { name: 'Aditzak' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Euskara/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /English/ }))

    expect(screen.getByRole('heading', { name: 'Aditzak' })).toBeInTheDocument()
    expect(localStorage.getItem('aditzak:lang:v1')).toBe('en')
  })

  it('lets a learner open the feedback form from the Profile tab and submit it', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true })
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /Profile/ }))
    await user.click(screen.getByRole('button', { name: 'Send feedback' }))

    expect(screen.getByRole('dialog', { name: 'Send feedback' })).toBeInTheDocument()

    await user.type(screen.getByLabelText("What's on your mind?"), 'Great app!')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByText('Thanks! Your feedback has been sent.')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: 'POST',
      body: JSON.stringify({ message: 'Great app!', email: '', context: 'profile' }),
    })

    await user.click(screen.getAllByRole('button', { name: 'Close' })[1])
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows an error if feedback submission fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false })
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /Profile/ }))
    await user.click(screen.getByRole('button', { name: 'Send feedback' }))
    await user.type(screen.getByLabelText("What's on your mind?"), 'Something is broken')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByText('Something went wrong. Please try again later.')).toBeInTheDocument()
  })

  describe('share app', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('shares the app via the native share sheet when available', async () => {
      const share = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', { ...navigator, share })
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      await user.click(screen.getByRole('button', { name: 'Invite a friend' }))

      expect(share).toHaveBeenCalledWith({
        title: 'Aditzak — Basque Verb Conjugation',
        text: "I'm learning Basque verb conjugation with Aditzak — come give it a try:",
        url: `${window.location.origin}${import.meta.env.BASE_URL}`,
      })
    })

    it('falls back to copying the link and shows a brief confirmation', async () => {
      // `userEvent.setup()` installs its own `navigator.clipboard` stub (with a
      // working `writeText`), so spy on that rather than replacing
      // `navigator` wholesale — `navigator.share` is already `undefined` in
      // jsdom, so the fallback path is taken without needing to stub it away.
      const user = userEvent.setup()
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
      render(<App />)

      await user.click(screen.getByRole('button', { name: /Profile/ }))
      await user.click(screen.getByRole('button', { name: 'Invite a friend' }))

      expect(writeText).toHaveBeenCalledWith(
        `I'm learning Basque verb conjugation with Aditzak — come give it a try: ${window.location.origin}${import.meta.env.BASE_URL}`,
      )
      expect(await screen.findByRole('button', { name: 'Link copied!' })).toBeInTheDocument()
    })
  })

  describe('share result', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    // With `Math.random` pinned to 0.99, `generateQuestions` is deterministic
    // — replicate `createExerciseState`'s call for the "izan-present" lesson
    // (12 questions: 4 rounds × the ni/zu/hura horizon, no typing on a first
    // attempt) so each question's `correct` answer is known up front and can
    // be clicked by its visible button text, regardless of question kind
    // (form/sentence/pronoun all render `correct` as an option's label).
    function izanPresentQuestions() {
      const verb = VERBS.find((v) => v.id === 'izan')
      return generateQuestions(verb, 'present', { noTyping: true, rounds: 4, persons: ['ni', 'zu', 'hura'] })
    }

    // Mirrors `exerciseReducer`'s `queue`: an incorrect first attempt is
    // pushed to the back of the queue for a retry, so `wrongFirst` adds one
    // extra round at the end (answered correctly) rather than just swapping
    // one answer for another.
    async function playLesson(user, { wrongFirst = false } = {}) {
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      const queue = izanPresentQuestions()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))
      await user.click(screen.getByRole('button', { name: 'Start' }))

      let first = true
      while (queue.length > 0) {
        const question = queue[0]
        const answer = wrongFirst && first ? question.options.find((o) => o !== question.correct) : question.correct
        const isCorrect = answer === question.correct
        const isLast = queue.length === 1 && isCorrect
        await user.click(screen.getByRole('button', { name: answer }))
        await user.click(screen.getByRole('button', { name: isLast ? 'Finish' : 'Continue' }))
        if (isCorrect) {
          queue.shift()
        } else {
          queue.push(queue.shift())
        }
        first = false
      }
    }

    it('shows a "Share" button on a 3-star result and shares via the native share sheet', async () => {
      const share = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', { ...navigator, share })
      const user = userEvent.setup()
      await playLesson(user)

      const shareButton = await screen.findByRole('button', { name: 'Share' })
      await user.click(shareButton)

      expect(share).toHaveBeenCalledWith({
        title: 'Aditzak — Basque Verb Conjugation',
        text: 'I just got 3/3 ⭐ on izan · Present (ni/zu/hura) in Aditzak, a Basque verb conjugation app. Think you can do better?',
        url: `${window.location.origin}${import.meta.env.BASE_URL}`,
      })
    })

    it('falls back to copying the link and shows a brief confirmation', async () => {
      const user = userEvent.setup()
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
      await playLesson(user)

      const shareButton = await screen.findByRole('button', { name: 'Share' })
      await user.click(shareButton)

      expect(writeText).toHaveBeenCalledWith(
        `I just got 3/3 ⭐ on izan · Present (ni/zu/hura) in Aditzak, a Basque verb conjugation app. Think you can do better? ${window.location.origin}${import.meta.env.BASE_URL}`,
      )
      expect(await screen.findByRole('button', { name: 'Link copied!' })).toBeInTheDocument()
    })

    it('does not show a "Share" button on a less-than-perfect result', async () => {
      const user = userEvent.setup()
      await playLesson(user, { wrongFirst: true })

      expect(await screen.findByRole('button', { name: 'Continue' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Share' })).not.toBeInTheDocument()
    })
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

      it('applies "keep the best of both"', async () => {
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

      it("applies \"use this device's progress\"", async () => {
        const fetchMock = mockFetch()
        const user = userEvent.setup()
        render(<App />)

        await user.click(await screen.findByRole('button', { name: /Use this device's progress/ }))
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

        const putCall = fetchMock.mock.calls.find(([, options]) => options?.method === 'PUT')
        expect(JSON.parse(putCall[1].body).payload.progress).toEqual(localProgress)
        expect(JSON.parse(localStorage.getItem('aditzak:progress:v1'))).toEqual(localProgress)
      })

      it('applies "use account progress"', async () => {
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
