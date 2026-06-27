import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

// `createExerciseState` always mixes in a real `kind: 'match-pairs'`
// question for any eligible lesson (see `generateMatchPairsQuestions`,
// wired in #192) — this flag lets the 'match-pairs question' tests below
// suppress a practice lesson's normal per-person questions, so the queue
// they exercise is just that one real match-pairs question (plus an
// optional controlled followup), rather than 12+ unrelated questions.
const matchPairsMock = vi.hoisted(() => ({ enabled: false, withFollowup: false }))
const FOLLOWUP_QUESTION = {
  kind: 'form',
  verbId: 'izan',
  tense: 'present',
  person: 'gu',
  correct: 'gara',
  options: ['gara', 'naiz', 'da', 'zarete'],
}

// Lets the 'word-order question' tests below swap in a single controlled
// `kind: 'word-order'` question (with a fixed, known `tokens`/`correct`)
// instead of `izan`'s normal per-person questions — mirroring how
// `matchPairsMock` substitutes `FOLLOWUP_QUESTION` above.
const wordOrderMock = vi.hoisted(() => ({ enabled: false, question: null }))

// Lets the [C1]/#228 'review form question' test below force `generateQuestions`
// (called once per review source — see `createExerciseState`) to return a
// single controlled `kind: 'form'` question for the given verb/tense, instead
// of the lesson's normal cross-section.
const formQuestionMock = vi.hoisted(() => ({ enabled: false, byVerbId: {} }))

// #330: records every `verbId` `createExerciseState` calls `generateQuestions`
// with, so the 'carrier sampling' tests below can assert how many — and
// which — of a pool lesson's sources actually got drilled in a given play,
// without needing to inspect `createExerciseState` itself (it isn't exported).
const generateQuestionsCalls = vi.hoisted(() => ({ verbIds: [], rounds: [] }))

vi.mock('./lessonLogic', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    generateQuestions: (verb, tense, options) => {
      generateQuestionsCalls.verbIds.push(verb.id)
      generateQuestionsCalls.rounds.push(options.rounds)
      if (formQuestionMock.enabled) return formQuestionMock.byVerbId[verb.id] ? [formQuestionMock.byVerbId[verb.id]] : []
      if (wordOrderMock.enabled) return [wordOrderMock.question]
      if (!matchPairsMock.enabled) return actual.generateQuestions(verb, tense, options)
      return matchPairsMock.withFollowup ? [FOLLOWUP_QUESTION] : []
    },
  }
})

describe('App', () => {
  beforeEach(() => {
    // Bypass the one-time language-onboarding screen for tests that exercise
    // the lesson flow — see the dedicated onboarding test below.
    localStorage.setItem('aditzak:lang:v1', 'en')
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    generateQuestionsCalls.verbIds = []
    generateQuestionsCalls.rounds = []
  })

  describe('match-pairs question', () => {
    beforeEach(() => {
      matchPairsMock.enabled = true
    })

    afterEach(() => {
      matchPairsMock.enabled = false
      matchPairsMock.withFollowup = false
    })

    async function startMatchPairsLesson(user) {
      // `createExerciseState` now shuffles the real match-pairs question in
      // alongside the (possibly mocked) `generateQuestions` output, so
      // pinning `Math.random` keeps that shuffle a no-op — without it, the
      // followup-question test below would be flaky: the followup and the
      // match-pairs question could land in either order.
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      render(<App />)
      await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))
      await user.click(screen.getByRole('button', { name: 'Start' }))
    }

    it('advances the lesson and counts the question correct once every pair is matched correctly', async () => {
      const user = userEvent.setup()
      await startMatchPairsLesson(user)

      await user.click(screen.getByRole('button', { name: 'ni' }))
      await user.click(screen.getByRole('button', { name: 'naiz' }))
      await user.click(screen.getByRole('button', { name: 'zu' }))
      await user.click(screen.getByRole('button', { name: 'zara' }))
      await user.click(screen.getByRole('button', { name: 'hura' }))
      await user.click(screen.getByRole('button', { name: 'da' }))

      await user.click(await screen.findByRole('button', { name: 'Finish' }))
      expect(screen.getByText(/1\/1/)).toBeInTheDocument()
    })

    it('still counts the question incorrect if any pair was mismatched first, even though the board ends up fully matched', async () => {
      const user = userEvent.setup()
      await startMatchPairsLesson(user)

      // Mismatch "I" against "zara" (zu's form) first.
      await user.click(screen.getByRole('button', { name: 'ni' }))
      await user.click(screen.getByRole('button', { name: 'zara' }))
      await waitFor(() => expect(screen.getByRole('button', { name: 'ni' })).not.toBeDisabled())

      // Then match every pair correctly — the board still ends up fully matched.
      await user.click(screen.getByRole('button', { name: 'ni' }))
      await user.click(screen.getByRole('button', { name: 'naiz' }))
      await user.click(screen.getByRole('button', { name: 'zu' }))
      await user.click(screen.getByRole('button', { name: 'zara' }))
      await user.click(screen.getByRole('button', { name: 'hura' }))
      await user.click(screen.getByRole('button', { name: 'da' }))

      expect(await screen.findByText("Not quite — you'll see this one again.")).toBeInTheDocument()
    })

    it('treats tapping an already-locked tile as a no-op', async () => {
      const user = userEvent.setup()
      await startMatchPairsLesson(user)

      await user.click(screen.getByRole('button', { name: 'ni' }))
      await user.click(screen.getByRole('button', { name: 'naiz' }))
      const lockedTile = screen.getByRole('button', { name: 'ni' })
      expect(lockedTile).toBeDisabled()

      await user.click(lockedTile)
      expect(lockedTile).toBeDisabled()

      // The earlier no-op tap shouldn't have left a stray selection behind —
      // finishing the remaining pairs correctly still scores the question as
      // correct.
      await user.click(screen.getByRole('button', { name: 'zu' }))
      await user.click(screen.getByRole('button', { name: 'zara' }))
      await user.click(screen.getByRole('button', { name: 'hura' }))
      await user.click(screen.getByRole('button', { name: 'da' }))

      await user.click(await screen.findByRole('button', { name: 'Finish' }))
      expect(screen.getByText(/1\/1/)).toBeInTheDocument()
    })

    it('gives a retried match-pairs question a fresh board instead of reusing the frozen, fully-matched one', async () => {
      // `createExerciseState` appends the real match-pairs question after the
      // lesson's normal questions, so with one followup question injected it
      // comes first, and the match-pairs question is both last and (once the
      // followup is done) the queue's sole remaining item — letting a
      // same-slot retry happen with no further question needed.
      matchPairsMock.withFollowup = true
      const user = userEvent.setup()
      await startMatchPairsLesson(user)

      await user.click(screen.getByRole('button', { name: 'gara' }))
      await user.click(await screen.findByRole('button', { name: 'Continue' }))

      // Mismatch first, then match every pair correctly — the board still
      // ends up fully matched, but counts as incorrect.
      await user.click(screen.getByRole('button', { name: 'ni' }))
      await user.click(screen.getByRole('button', { name: 'zara' }))
      await waitFor(() => expect(screen.getByRole('button', { name: 'ni' })).not.toBeDisabled())
      await user.click(screen.getByRole('button', { name: 'ni' }))
      await user.click(screen.getByRole('button', { name: 'naiz' }))
      await user.click(screen.getByRole('button', { name: 'zu' }))
      await user.click(screen.getByRole('button', { name: 'zara' }))
      await user.click(screen.getByRole('button', { name: 'hura' }))
      await user.click(screen.getByRole('button', { name: 'da' }))
      await user.click(await screen.findByRole('button', { name: 'Continue' }))

      const retriedTile = await screen.findByRole('button', { name: 'ni' })
      expect(retriedTile).not.toBeDisabled()

      await user.click(retriedTile)
      await user.click(screen.getByRole('button', { name: 'naiz' }))
      await user.click(screen.getByRole('button', { name: 'zu' }))
      await user.click(screen.getByRole('button', { name: 'zara' }))
      await user.click(screen.getByRole('button', { name: 'hura' }))
      await user.click(screen.getByRole('button', { name: 'da' }))

      await user.click(await screen.findByRole('button', { name: 'Finish' }))
      expect(screen.getByText(/1\/2/)).toBeInTheDocument()
    })

    // #201: a NORK-agreement verb's match-pairs tiles must show the ergative
    // pronoun (`nik`/`zuk`/`hark`) `ukan`'s own `pronouns` map declines to,
    // not the bare absolutive `PERSON_LABEL_KEYS` text (`ni`/`zu`/`hura`) —
    // `dut`/`duzu`/`du` only make sense paired with the ergative subject.
    it('labels a NORK-agreement verb\'s tiles with its declined pronouns, not the bare absolutive ones', async () => {
      window.history.pushState({}, '', '/?dev=unlock-all')
      const user = userEvent.setup()
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      render(<App />)

      await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura ukan — to have/i }))
      await user.click(screen.getByRole('button', { name: 'Start' }))

      expect(screen.getByRole('button', { name: 'nik' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'zuk' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'hark' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'ni' })).not.toBeInTheDocument()
    })
  })

  // #330/#331: `unit-10-present` is a real fixture with far more sources
  // (52, after #331 collapsed the former `-2/-3/…`/`recognition` siblings
  // into this single canonical pool, and #440 folded in 7 more verbs from
  // the dissolved Unit 30) than `CARRIERS_PER_SESSION` (4) — proof
  // that `createExerciseState` samples rather than drilling every source
  // every play, the mechanism that lets a pool lesson grow past 4 carriers
  // without the session ballooning past `TARGET_EXERCISE_COUNT` (12) or
  // needing a `-2/-3/…` sibling lesson (#318's now-superseded approach).
  describe('carrier sampling for large pools (#330/#331)', () => {
    const POOL_VERB_IDS = [
      'jan', 'edan', 'erosi', 'ikusi', 'hartu', 'egin',
      'irakurri', 'idatzi', 'ikasi', 'entzun', 'utzi', 'aurkitu',
      'bilatu', 'galdu', 'jaso', 'saldu', 'itxaron',
      'eskatu', 'galdetu', 'adierazi', 'bukatu', 'amaitu', 'gainditu',
      'bereiztu', 'ezagutu', 'sentitu', 'pentsatu', 'sumatu', 'ulertu',
      'aztertu', 'ukatu', 'batu', 'planteatu',
      'hausnartu', 'argudiatu', 'ondorioztatu', 'gaitzetsi', 'aldarrikatu', 'plazaratu',
      'sustatu', 'bultzatu', 'bermatu', 'babestu', 'ziurtatu', 'borobildu',
      'hitz-egin', 'lan-egin', 'lo-egin', 'ahaleginak-egin',
      'parte-hartu', 'kontuan-hartu', 'arreta-eman',
    ]
    // `unit-10-present` and `unit-10-present-plural` share the same
    // sources/subtitle text, differing only in which persons they drill —
    // matching on the singular `ni/zu/hura` persons label too disambiguates
    // the singular lesson's button from its plural sibling. The subtitle
    // shows a collapsed "N verbs" label rather than joining all 52 names
    // (#343 — joining every name in a pool this large is unreadable).
    const poolButtonName = /ni\/zu\/hura[\s\S]*52 verbs/

    it('drills at most CARRIERS_PER_SESSION sources from a larger pool, keeping the session near TARGET_EXERCISE_COUNT', async () => {
      window.history.pushState({}, '', '/?dev=unlock-all')
      render(<App />)

      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: poolButtonName }))

      const sampledIds = [...new Set(generateQuestionsCalls.verbIds)]
      expect(sampledIds.length).toBe(4)
      sampledIds.forEach((id) => expect(POOL_VERB_IDS).toContain(id))

      // Each sampled source gets `rounds` such that rounds × persons (3 for
      // `PHASE_1_PERSONS`) lands at this session's even share of 12 —
      // confirms `targetPerSource` was computed off the sampled count (4),
      // not the full pool size (6), which is what keeps the session bounded.
      const totalQuestions = generateQuestionsCalls.rounds.reduce((sum, rounds) => sum + rounds * 3, 0)
      expect(totalQuestions).toBe(12)
    })

    it('samples a different subset of carriers across plays', { timeout: 45000 }, async () => {
      window.history.pushState({}, '', '/?dev=unlock-all')
      const user = userEvent.setup()
      render(<App />)

      // Sampling is random, so an occasional identical re-roll between two
      // plays is possible — replaying several times and checking for *any*
      // variation across the whole run avoids flaking on a single unlucky pair.
      // 10 full enter/exit cycles against the home screen's now-larger lesson
      // list (#425) push this past the previous 15s budget under CI timing.
      const poolButton = () => screen.getByRole('button', { name: poolButtonName })
      const sampledSets = []
      for (let i = 0; i < 10; i += 1) {
        generateQuestionsCalls.verbIds = []
        await user.click(poolButton())
        sampledSets.push([...new Set(generateQuestionsCalls.verbIds)].sort().join(','))
        await user.click(screen.getByRole('button', { name: 'Exit lesson' }))
      }

      expect(new Set(sampledSets).size).toBeGreaterThan(1)
    })
  })

  describe('word-order question', () => {
    afterEach(() => {
      wordOrderMock.enabled = false
      wordOrderMock.question = null
    })

    async function startWordOrderLesson(user, question) {
      wordOrderMock.enabled = true
      wordOrderMock.question = question
      // Pins the lesson's own queue shuffle (mixing in the real, eligible
      // match-pairs question after our mocked one) and `WordOrderBoard`'s
      // internal cloud shuffle to a no-op, same trick `startMatchPairsLesson`
      // above relies on — so the mocked word-order question stays first and
      // its tokens render in fixture order.
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      render(<App />)
      await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))
      await user.click(screen.getByRole('button', { name: 'Start' }))
      // Wait for the exercise screen to mount rather than assuming the click
      // above already flushed it — under CI's slower timing (the lesson list
      // has grown considerably, #425) the transition can still be pending.
      await screen.findByRole('button', { name: 'Check' })
    }

    const baseQuestion = {
      kind: 'word-order',
      verbId: 'izan',
      tense: 'present',
      person: 'ni',
      tokens: [
        { id: 0, text: 'Ni' },
        { id: 1, text: 'irakaslea' },
        { id: 2, text: 'naiz' },
      ],
      correct: 'Ni irakaslea naiz',
      punctuation: '.',
    }

    it('disables Check until every token has been tapped into the assembled row, then submits the joined sentence', async () => {
      const user = userEvent.setup()
      await startWordOrderLesson(user, baseQuestion)

      expect(screen.getByRole('button', { name: 'Check' })).toBeDisabled()

      await user.click(screen.getByRole('button', { name: 'Ni' }))
      await user.click(screen.getByRole('button', { name: 'irakaslea' }))
      expect(screen.getByRole('button', { name: 'Check' })).toBeDisabled()

      await user.click(screen.getByRole('button', { name: 'naiz' }))
      expect(screen.getByRole('button', { name: 'Check' })).not.toBeDisabled()

      await user.click(screen.getByRole('button', { name: 'Check' }))
      expect(await screen.findByText(/Bikain! Great job!/)).toBeInTheDocument()
    })

    it('marks the question incorrect when the assembled order is wrong', async () => {
      const user = userEvent.setup()
      await startWordOrderLesson(user, baseQuestion)

      await user.click(screen.getByRole('button', { name: 'irakaslea' }))
      await user.click(screen.getByRole('button', { name: 'Ni' }))
      await user.click(screen.getByRole('button', { name: 'naiz' }))
      await user.click(screen.getByRole('button', { name: 'Check' }))

      expect(await screen.findByText("Not quite — you'll see this one again.")).toBeInTheDocument()
    })

    it('tapping an assembled token returns it to the cloud instead of submitting', async () => {
      const user = userEvent.setup()
      await startWordOrderLesson(user, baseQuestion)

      await user.click(screen.getByRole('button', { name: 'Ni' }))
      await user.click(screen.getByRole('button', { name: 'irakaslea' }))
      // Undo "irakaslea" — it should return to the cloud, tappable again, and
      // Check should stay disabled since the cloud isn't empty anymore.
      await user.click(screen.getByRole('button', { name: 'irakaslea' }))
      expect(screen.getByRole('button', { name: 'Check' })).toBeDisabled()

      await user.click(screen.getByRole('button', { name: 'irakaslea' }))
      await user.click(screen.getByRole('button', { name: 'naiz' }))
      await user.click(screen.getByRole('button', { name: 'Check' }))

      expect(await screen.findByText(/Bikain! Great job!/)).toBeInTheDocument()
    })

    it('renders the trailing punctuation as a fixed mark, not a tappable token', async () => {
      const user = userEvent.setup()
      await startWordOrderLesson(user, baseQuestion)

      expect(screen.queryByRole('button', { name: '.' })).not.toBeInTheDocument()
      expect(screen.getByText('.')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Ni' }))
      await user.click(screen.getByRole('button', { name: 'irakaslea' }))
      await user.click(screen.getByRole('button', { name: 'naiz' }))
      await user.click(screen.getByRole('button', { name: 'Check' }))

      expect(await screen.findByText(/Bikain! Great job!/)).toBeInTheDocument()
    })
  })

  describe('review form question', () => {
    afterEach(() => {
      formQuestionMock.enabled = false
      formQuestionMock.byVerbId = {}
    })

    // [C1]/#228: a review's bare `kind: 'form'` question has no sentence to
    // anchor it, so unlike practice lessons (which hide the verb name when a
    // question's options could include a cross-verb distractor) it must show
    // the verb name — otherwise a player sees only a pronoun and four
    // conjugated forms with no way to tell which verb is under test.
    it('shows the verb name on a review’s bare form question', async () => {
      window.history.pushState({}, '', '/?dev=unlock-all')
      formQuestionMock.enabled = true
      formQuestionMock.byVerbId = {
        izan: { kind: 'form', verbId: 'izan', tense: 'present', person: 'haiek', correct: 'dira', options: ['dira', 'gara', 'naiz', 'zarete'] },
      }
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /izan & egon — mixed practice/i }))

      expect(await screen.findByText(/izan — to be/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'dira' })).toBeInTheDocument()
    })
  })

  describe('lure feedback ([C2]/#229)', () => {
    afterEach(() => {
      formQuestionMock.enabled = false
      formQuestionMock.byVerbId = {}
    })

    // Picking a tagged lure (here, `dut` — a case-frame lure from #141) shows
    // its "why this was wrong" explanation; a plain same-table distractor has
    // no `optionRationale` entry and shows none (no regression on existing
    // incorrect-answer feedback).
    it('shows the lure rationale when a learner picks a tagged lure distractor', async () => {
      // Keeps `shuffle`'s Fisher-Yates swaps a no-op (see the preview-screen
      // test above) so the mocked question — the only entry in `questions`,
      // ahead of the lesson's real match-pairs question in `createExerciseState`'s
      // queue-building order — stays first in the queue.
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      formQuestionMock.enabled = true
      formQuestionMock.byVerbId = {
        izan: {
          kind: 'sentence',
          verbId: 'izan',
          tense: 'present',
          person: 'ni',
          sentence: 'Ni irakaslea ___.',
          correct: 'naiz',
          options: ['naiz', 'zara', 'da', 'dut'],
          optionRationale: { dut: { errorType: 'case-frame', whyKey: 'lureRationaleCaseFrame' } },
        },
      }
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: /oraina · ni\/zu\/hura izan — to be/ }))
      await user.click(screen.getByRole('button', { name: 'Start' }))
      await user.click(screen.getByRole('button', { name: 'dut' }))

      expect(await screen.findByText(/marks a different subject case/)).toBeInTheDocument()
    })
  })
})
