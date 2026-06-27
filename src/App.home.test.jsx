import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { generateMatchPairsQuestions, generateQuestions } from './lessonLogic'
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
    // `verb.pronouns`-based tile labels (#201) rather than the generic
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
