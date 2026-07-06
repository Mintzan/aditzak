import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { generateMatchPairsQuestions, generateQuestions, HEART_COST_POINTS } from './lessonLogic'
import { VERBS } from './data/verbs'

describe('App', () => {
  beforeEach(() => {
    // Bypass the one-time language-onboarding screen for tests that exercise
    // the lesson flow — see the dedicated onboarding test in App.appShell.test.jsx.
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

  describe('out of hearts mid-lesson (#533)', () => {
    afterEach(() => {
      window.history.replaceState({}, '', '/')
    })

    it('force-stops a fresh attempt that runs out of hearts, and discards it without recording progress on exit', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      localStorage.setItem('aditzak:hearts:v1', JSON.stringify({ currentHearts: 1, lastHeartChangeTimestamp: null }))
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))
      await user.click(screen.getByRole('button', { name: 'Start' }))
      await user.click(screen.getByRole('button', { name: 'zara' })) // wrong answer, depletes the only heart

      expect(await screen.findByRole('dialog', { name: "You're out of hearts" })).toBeInTheDocument()
      // No points seeded, so there's nothing to spend — only "Discard and exit" should show.
      expect(screen.queryByRole('button', { name: /Buy a heart/ })).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Discard and exit' }))

      expect(screen.getByRole('heading', { name: 'Aditzak' })).toBeInTheDocument()
      expect(JSON.parse(localStorage.getItem('aditzak:progress:v1') ?? '{}')).toEqual({})
      expect(JSON.parse(localStorage.getItem('aditzak:hearts:v1')).currentHearts).toBe(0)
    })

    it('lets the learner buy a heart to continue the same attempt instead of exiting', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      localStorage.setItem('aditzak:hearts:v1', JSON.stringify({ currentHearts: 1, lastHeartChangeTimestamp: null }))
      localStorage.setItem('aditzak:points:v2', JSON.stringify({ earned: { 'seed-device': HEART_COST_POINTS }, spent: {} }))
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))
      await user.click(screen.getByRole('button', { name: 'Start' }))
      await user.click(screen.getByRole('button', { name: 'zara' }))

      await user.click(await screen.findByRole('button', { name: `Buy a heart — ${HEART_COST_POINTS} points` }))

      // The heart is spent-and-restored, and the overlay clears — leaving the
      // still-incorrect feedback for the *same* question showing underneath
      // exactly as it was (buying doesn't touch the exercise's own state),
      // so the learner can hit "Continue" and keep going right where they
      // left off, instead of being dumped back to the lesson list.
      expect(screen.queryByRole('dialog', { name: "You're out of hearts" })).not.toBeInTheDocument()
      expect(JSON.parse(localStorage.getItem('aditzak:hearts:v1'))).toEqual({ currentHearts: 1, lastHeartChangeTimestamp: null })
      const points = JSON.parse(localStorage.getItem('aditzak:points:v2'))
      expect(Object.values(points.spent).reduce((sum, n) => sum + n, 0)).toBe(HEART_COST_POINTS)
      expect(screen.getByText("Not quite — you'll see this one again.")).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
    })

    it('does not interrupt a replay of an already-completed lesson even at 0 hearts', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      localStorage.setItem(
        'aditzak:progress:v1',
        JSON.stringify({
          'izan-present': { attempts: 1, bestScore: 3, totalQuestions: 3, bestStars: 3, lastPlayed: new Date().toISOString() },
        }),
      )
      localStorage.setItem('aditzak:hearts:v1', JSON.stringify({ currentHearts: 0, lastHeartChangeTimestamp: Date.now() }))
      const user = userEvent.setup()
      render(<App />)

      // A lesson already completed once stays tappable at 0 hearts (#532) and
      // skips the preview screen (attempts > 0), straight into questions.
      await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))
      await user.click(screen.getByRole('button', { name: 'zara' })) // wrong answer; hearts already 0

      expect(screen.queryByRole('dialog', { name: "You're out of hearts" })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
    })
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

  describe('share result', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    // With `Math.random` pinned to 0.99, `generateQuestions` and
    // `generateMatchPairsQuestions` are both deterministic — replicate
    // `createExerciseState`'s calls for the "izan-present" lesson (12 form/
    // sentence/pronoun questions, plus the one real match-pairs question
    // appended after them) so each question's `correct` answer — or, for the
    // match-pairs question, its `pairs` — is known up front.
    function izanPresentQuestions() {
      const verb = VERBS.find((v) => v.id === 'izan')
      const questions = generateQuestions(verb, 'present', { noTyping: true, rounds: 4, persons: ['ni', 'zu', 'hura'] })
      const matchPairsQuestions = generateMatchPairsQuestions([{ verb, tense: 'present' }], { persons: ['ni', 'zu', 'hura'] })
      return [...questions, ...matchPairsQuestions]
    }

    // `izan`'s own (Basque) pronouns, matching `MatchPairsBoard`'s
    // `personPronoun`-based tile labels (#201) rather than the generic
    // translated `PERSON_LABEL_KEYS` text.
    const PERSON_LABEL = { ni: 'ni', zu: 'zu', hura: 'hura' }

    // Plays a single match-pairs question to completion by tapping each
    // pair's person tile then its matching form tile, in order — mirroring
    // `MatchPairsBoard`'s own match-then-lock behavior with no mistakes.
    async function playMatchPairsQuestion(user, question) {
      for (const { person, form } of question.pairs) {
        await user.click(screen.getByRole('button', { name: PERSON_LABEL[person] }))
        await user.click(screen.getByRole('button', { name: form }))
      }
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
        const isLast = queue.length === 1
        if (question.kind === 'match-pairs') {
          await playMatchPairsQuestion(user, question)
          await user.click(await screen.findByRole('button', { name: isLast ? 'Finish' : 'Continue' }))
          queue.shift()
          first = false
          continue
        }
        const answer = wrongFirst && first ? question.options.find((o) => o !== question.correct) : question.correct
        const isCorrect = answer === question.correct
        await user.click(screen.getByRole('button', { name: answer }))
        await user.click(screen.getByRole('button', { name: isLast && isCorrect ? 'Finish' : 'Continue' }))
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
})
