import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { UnitOverviewModal } from './screens/HomeScreen'
import { LanguageProvider } from './i18n/LanguageContext'

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
  })

  it('lets a learner open a unit overview explaining an available unit', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText(/Who and Where/).closest('button'))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('say who and where you are')
    // Unit 1's two practice lessons (izan-present, egon-present) each get
    // their own conjugation table — unit-1-review doesn't add a third, since
    // it just recombines those same two verb/tense pairs.
    expect(dialog).toHaveTextContent('izan — to be · Present')
    expect(dialog).toHaveTextContent('egon — to be (located / in a state) · Present')
    expect(within(dialog).getAllByText('naiz').length).toBeGreaterThan(0)
    expect(within(dialog).getAllByText('nago').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it("shows ukan's ergative-marked pronouns (Nik/Zuk/Hark) in Unit 2's overview", async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByText(/your first ergative/).closest('button'))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('ukan — to have · Present')
    // The whole point of this unit is the ni -> nik ergative-subject shift, so
    // the table must show the declined (-k) pronouns, not the bare ones
    // (ConjugationTable lowercases the display form, hence 'nik' not 'Nik').
    expect(within(dialog).getByText('nik')).toBeInTheDocument()
    expect(within(dialog).getByText('zuk')).toBeInTheDocument()
    expect(within(dialog).getByText('hark')).toBeInTheDocument()
    expect(within(dialog).getByText('dut')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows a "coming soon" note for a pending unit', async () => {
    // Every unit in the curriculum is `available` as of 2026-07-05 (see
    // docs/DECISIONS.md), so there's no real pending unit left to click
    // through to any more — this exercises `UnitOverviewModal` directly with
    // a synthetic pending unit instead, the same "no lessonIds yet" shape a
    // future unit would have.
    const user = userEvent.setup()
    const onClose = vi.fn()
    const pendingUnit = { number: 99, title: 'A Future Unit', focus: 'Not built yet', status: 'pending' }
    render(
      <LanguageProvider>
        <UnitOverviewModal unit={pendingUnit} onClose={onClose} />
      </LanguageProvider>,
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent("hasn't been built yet")

    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalled()
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
