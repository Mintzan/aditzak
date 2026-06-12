import { render, screen } from '@testing-library/react'
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
})
