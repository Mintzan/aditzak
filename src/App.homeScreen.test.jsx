import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    // Bypass the one-time language-onboarding screen for tests that exercise
    // the home screen — see the dedicated onboarding test in App.appShell.test.jsx.
    localStorage.setItem('aditzak:lang:v1', 'en')
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('renders the home screen with the learning journey', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Aditzak' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Phase I\b/ })).toBeInTheDocument()
    expect(screen.getByText(/Who and Where/)).toBeInTheDocument()
    expect(screen.getAllByText(/^izan — to be/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/egon — to be/).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Coming soon').length).toBeGreaterThan(0)
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
})
