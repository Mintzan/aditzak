import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  addPoints,
  canRepairStreak,
  computeLessonPoints,
  computeStars,
  exerciseReducer,
  generateQuestions,
  getActiveStreak,
  getEncouragement,
  getExplanation,
  getLocalDateString,
  getStreakEncouragement,
  getUnlockedLessonIds,
  isAnswerCorrect,
  pickEncouragementVariantIndex,
  recordDailyStreak,
  recordResult,
  repairStreak,
  shuffle,
  STREAK_REPAIR_COST,
} from './lessonLogic'

describe('computeStars', () => {
  it('returns 0 when there are no questions', () => {
    expect(computeStars(0, 0)).toBe(0)
  })

  it('awards 3 stars for a perfect score', () => {
    expect(computeStars(5, 5)).toBe(3)
  })

  it('awards 2 stars at 80% or better', () => {
    expect(computeStars(4, 5)).toBe(2)
  })

  it('awards 1 star at 50% or better', () => {
    expect(computeStars(3, 6)).toBe(1)
  })

  it('awards 0 stars below 50%', () => {
    expect(computeStars(2, 6)).toBe(0)
  })
})

describe('getEncouragement', () => {
  it('matches the headline tone to the star band, in step with computeStars', () => {
    expect(getEncouragement(5, 5).headline).toBe('Bikain!')
    expect(getEncouragement(4, 5).headline).toBe('Oso ondo!')
    expect(getEncouragement(3, 6).headline).toBe('Ondo!')
    expect(getEncouragement(2, 6).headline).toBe('Ez etsi!')
  })

  it('always returns a non-empty icon, headline and messageKey', () => {
    ;[
      [0, 0],
      [0, 5],
      [5, 5],
    ].forEach(([correctCount, total]) => {
      const { icon, headline, messageKey } = getEncouragement(correctCount, total)
      expect(icon).toBeTruthy()
      expect(headline).toBeTruthy()
      expect(messageKey).toBeTruthy()
    })
  })

  it('cycles through alternate variants for the same star band', () => {
    const variants = [0, 1, 2].map((variantIndex) => getEncouragement(5, 5, variantIndex))
    const headlines = new Set(variants.map((v) => v.headline))
    const messageKeys = new Set(variants.map((v) => v.messageKey))
    expect(headlines.size).toBe(3)
    expect(messageKeys.size).toBe(3)
  })

  it('wraps out-of-range variant indexes', () => {
    expect(getEncouragement(5, 5, 3)).toEqual(getEncouragement(5, 5, 0))
  })
})

describe('pickEncouragementVariantIndex', () => {
  it('returns a valid variant index for every star band', () => {
    ;[
      [0, 0],
      [2, 6],
      [4, 5],
      [5, 5],
    ].forEach(([correctCount, total]) => {
      const index = pickEncouragementVariantIndex(correctCount, total)
      expect(index).toBeGreaterThanOrEqual(0)
      expect(() => getEncouragement(correctCount, total, index)).not.toThrow()
    })
  })
})

describe('getStreakEncouragement', () => {
  it('returns nothing for streaks that are not a milestone', () => {
    ;[0, 1, 4, 6, 9, 11, 19, 21].forEach((streak) => {
      expect(getStreakEncouragement(streak)).toBeNull()
    })
  })

  it('returns a non-empty icon, headline and messageKey exactly on milestone streaks', () => {
    ;[5, 10, 20].forEach((streak) => {
      const { icon, headline, messageKey } = getStreakEncouragement(streak)
      expect(icon).toBeTruthy()
      expect(headline).toBeTruthy()
      expect(messageKey).toBeTruthy()
    })
  })
})

describe('isAnswerCorrect', () => {
  it('matches an exactly equal submission', () => {
    expect(isAnswerCorrect('dut', 'dut')).toBe(true)
  })

  it('ignores case and surrounding whitespace, so typed answers are not marked wrong over those', () => {
    expect(isAnswerCorrect('  Dut ', 'dut')).toBe(true)
    expect(isAnswerCorrect('hark', 'Hark')).toBe(true)
  })

  it('rejects a different form even if it is plausible', () => {
    expect(isAnswerCorrect('duk', 'dut')).toBe(false)
  })
})

describe('recordResult', () => {
  it('creates a fresh entry on the first attempt', () => {
    const progress = recordResult({}, 'izan-present', { correctCount: 5, total: 5 })

    expect(progress['izan-present']).toMatchObject({
      attempts: 1,
      bestScore: 5,
      totalQuestions: 5,
      bestStars: 3,
    })
  })

  it('increments attempts but keeps the best score and stars across runs', () => {
    const afterFirst = recordResult({}, 'izan-present', { correctCount: 2, total: 6 })
    const afterSecond = recordResult(afterFirst, 'izan-present', { correctCount: 6, total: 6 })
    const afterThird = recordResult(afterSecond, 'izan-present', { correctCount: 1, total: 6 })

    expect(afterThird['izan-present']).toMatchObject({
      attempts: 3,
      bestScore: 6,
      bestStars: 3,
      totalQuestions: 6,
    })
  })

  it('does not mutate the previous progress map', () => {
    const original = { 'izan-present': { attempts: 1, bestScore: 1, totalQuestions: 6, bestStars: 0 } }

    recordResult(original, 'izan-present', { correctCount: 6, total: 6 })

    expect(original['izan-present']).toMatchObject({ attempts: 1, bestScore: 1 })
  })
})

describe('getLocalDateString', () => {
  it('formats a date as YYYY-MM-DD using local fields, zero-padded', () => {
    expect(getLocalDateString(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(getLocalDateString(new Date(2026, 11, 31))).toBe('2026-12-31')
  })
})

describe('recordDailyStreak', () => {
  it('starts a streak of 1 on the first completed lesson', () => {
    const streak = recordDailyStreak({}, '2026-06-10')

    expect(streak).toEqual({ currentStreak: 1, longestStreak: 1, lastActiveDate: '2026-06-10' })
  })

  it('does not change the streak for a second lesson on the same day', () => {
    const first = recordDailyStreak({}, '2026-06-10')
    const second = recordDailyStreak(first, '2026-06-10')

    expect(second).toEqual(first)
  })

  it('extends the streak on the very next day', () => {
    const day1 = recordDailyStreak({}, '2026-06-10')
    const day2 = recordDailyStreak(day1, '2026-06-11')

    expect(day2).toEqual({ currentStreak: 2, longestStreak: 2, lastActiveDate: '2026-06-11' })
  })

  it('resets to 1 after a missed day, but keeps the longest streak record', () => {
    const day1 = recordDailyStreak({}, '2026-06-10')
    const day2 = recordDailyStreak(day1, '2026-06-11')
    const afterGap = recordDailyStreak(day2, '2026-06-13')

    expect(afterGap).toEqual({ currentStreak: 1, longestStreak: 2, lastActiveDate: '2026-06-13' })
  })
})

describe('getActiveStreak', () => {
  it('returns 0 when there is no recorded activity', () => {
    expect(getActiveStreak({}, '2026-06-10')).toBe(0)
  })

  it('returns the current streak when last active today', () => {
    const streak = { currentStreak: 4, longestStreak: 4, lastActiveDate: '2026-06-10' }

    expect(getActiveStreak(streak, '2026-06-10')).toBe(4)
  })

  it('still counts the streak as alive the day after, before it lapses', () => {
    const streak = { currentStreak: 4, longestStreak: 4, lastActiveDate: '2026-06-10' }

    expect(getActiveStreak(streak, '2026-06-11')).toBe(4)
  })

  it('reads as broken (0) once more than a day has passed', () => {
    const streak = { currentStreak: 4, longestStreak: 4, lastActiveDate: '2026-06-10' }

    expect(getActiveStreak(streak, '2026-06-12')).toBe(0)
  })
})

describe('computeLessonPoints', () => {
  it('awards up to 10 points on a first attempt, scaled by accuracy', () => {
    expect(computeLessonPoints(6, 6, false)).toBe(10)
    expect(computeLessonPoints(3, 6, false)).toBe(5)
    expect(computeLessonPoints(0, 6, false)).toBe(0)
  })

  it('awards half as many points on a repeat attempt', () => {
    expect(computeLessonPoints(6, 6, true)).toBe(5)
    expect(computeLessonPoints(3, 6, true)).toBe(3)
  })

  it('returns 0 when there are no questions', () => {
    expect(computeLessonPoints(0, 0, false)).toBe(0)
  })
})

describe('addPoints', () => {
  it('adds to an empty balance', () => {
    expect(addPoints({}, 10)).toEqual({ balance: 10 })
  })

  it('accumulates onto an existing balance without mutating it', () => {
    const points = { balance: 20 }

    expect(addPoints(points, 5)).toEqual({ balance: 25 })
    expect(points).toEqual({ balance: 20 })
  })
})

describe('canRepairStreak', () => {
  const points = { balance: STREAK_REPAIR_COST }

  it('is false when the streak is still alive', () => {
    const streak = { currentStreak: 4, longestStreak: 4, lastActiveDate: '2026-06-10' }

    expect(canRepairStreak(streak, points, '2026-06-11')).toBe(false)
  })

  it('is false when the streak is broken but there are no points to repair it', () => {
    const streak = { currentStreak: 4, longestStreak: 4, lastActiveDate: '2026-06-10' }

    expect(canRepairStreak(streak, { balance: STREAK_REPAIR_COST - 1 }, '2026-06-12')).toBe(false)
  })

  it('is false when there is no streak to repair', () => {
    expect(canRepairStreak({}, points, '2026-06-12')).toBe(false)
  })

  it('is true when the streak is broken and there are enough points', () => {
    const streak = { currentStreak: 4, longestStreak: 4, lastActiveDate: '2026-06-10' }

    expect(canRepairStreak(streak, points, '2026-06-12')).toBe(true)
  })
})

describe('repairStreak', () => {
  it('backdates lastActiveDate to yesterday and deducts the cost, preserving the streak counts', () => {
    const streak = { currentStreak: 4, longestStreak: 4, lastActiveDate: '2026-06-10' }
    const points = { balance: STREAK_REPAIR_COST + 50 }

    const result = repairStreak(streak, points, '2026-06-12')

    expect(result.streak).toEqual({ currentStreak: 4, longestStreak: 4, lastActiveDate: '2026-06-11' })
    expect(result.points).toEqual({ balance: 50 })
    expect(getActiveStreak(result.streak, '2026-06-12')).toBe(4)
  })
})

describe('getUnlockedLessonIds', () => {
  const lessons = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]

  it('always unlocks the first lesson', () => {
    expect(getUnlockedLessonIds(lessons, {})).toEqual(new Set(['a']))
  })

  it('unlocks a lesson once the previous one has been attempted', () => {
    const progress = { a: { attempts: 1 } }

    expect(getUnlockedLessonIds(lessons, progress)).toEqual(new Set(['a', 'b']))
  })

  it('does not skip ahead when a lesson has not been attempted yet', () => {
    const progress = { a: { attempts: 1 }, b: { attempts: 0 } }

    expect(getUnlockedLessonIds(lessons, progress)).toEqual(new Set(['a', 'b']))
  })

  it('keeps an already-attempted lesson unlocked even if its predecessor has not been attempted', () => {
    // e.g. a new lesson was inserted before a lesson the learner already completed
    const progress = { a: { attempts: 1 }, c: { attempts: 1 } }

    expect(getUnlockedLessonIds(lessons, progress)).toEqual(new Set(['a', 'b', 'c']))
  })
})

describe('generateQuestions', () => {
  const verb = {
    id: 'verb',
    conjugations: {
      present: { ni: 'naiz', hi: 'haiz', hura: 'da', gu: 'gara', zuek: 'zarete', haiek: 'dira' },
    },
  }
  const persons = Object.keys(verb.conjugations.present)

  // Both `sentences` (for all six persons — enough to also qualify for
  // `spot-error`) and `pronouns`/`pronounSentences` present, so
  // `availableKinds` always has all five special framings —
  // `['sentence', 'type-verb', 'spot-error', 'pronoun', 'type-pronoun']` —
  // and a fixed roll deterministically lands on whichever index it maps to.
  // Shared by the typed-framing and `noTyping` specs below, which both
  // need a verb where every special framing is available to roll into.
  const verbWithBoth = {
    ...verb,
    sentences: {
      present: {
        ni: 'Ni irakaslea ___.',
        hi: 'Hi ikaslea ___.',
        hura: 'Hura medikua ___.',
        gu: 'Gu lagunak ___.',
        zuek: 'Zuek azkarrak ___.',
        haiek: 'Haiek euskaldunak ___.',
      },
    },
    pronouns: { ni: 'Nik', hi: 'Hik', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
    pronounSentences: {
      present: {
        ni: '___ liburu bat dut.',
        hi: '___ auto bat duk.',
        hura: '___ etxe bat du.',
        gu: '___ denbora dugu.',
        zuek: '___ arazo bat duzue.',
        haiek: '___ aukera bat dute.',
      },
    },
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('produces exactly one question per grammatical person', () => {
    const questions = generateQuestions(verb, 'present')

    expect(questions).toHaveLength(persons.length)
    expect(questions.map((q) => q.person).sort()).toEqual([...persons].sort())
  })

  it('tags every question with the verb and tense it was generated from', () => {
    generateQuestions(verb, 'present').forEach((question) => {
      expect(question).toMatchObject({ verbId: verb.id, tense: 'present' })
    })
  })

  it('always includes the correct answer among unique options', () => {
    const questions = generateQuestions(verb, 'present')

    questions.forEach((question) => {
      expect(question.correct).toBe(verb.conjugations.present[question.person])
      expect(question.options).toContain(question.correct)
      expect(new Set(question.options).size).toBe(question.options.length)
      expect(question.options.length).toBeLessThanOrEqual(4)
    })
  })

  it('falls back to bare-form questions when the verb has no example sentences', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    generateQuestions(verb, 'present').forEach((question) => {
      expect(question.kind).toBe('form')
      expect(question).not.toHaveProperty('sentence')
    })
  })

  describe('with example sentences', () => {
    const verbWithSentences = {
      ...verb,
      sentences: {
        present: {
          ni: 'Ni irakaslea ___.',
          hi: 'Hi ikaslea ___.',
          hura: 'Hura medikua ___.',
        },
      },
    }
    const sentenced = verbWithSentences.sentences.present

    it('frames a question as completing the sentence when the roll favours it', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const questions = generateQuestions(verbWithSentences, 'present')

      questions.forEach((question) => {
        if (sentenced[question.person]) {
          expect(question).toMatchObject({ kind: 'sentence', sentence: sentenced[question.person] })
          expect(question.sentence).toContain('___')
          expect(question.options).toContain(question.correct)
        } else {
          expect(question.kind).toBe('form')
        }
      })
    })

    it('falls back to the bare form when the roll does not favour a sentence, even with sentences available', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99)

      generateQuestions(verbWithSentences, 'present').forEach((question) => {
        expect(question.kind).toBe('form')
        expect(question).not.toHaveProperty('sentence')
      })
    })

    it('never offers spot-error when fewer than four persons have example sentences', () => {
      // Roll low enough to favour a special framing whenever one is on offer —
      // with only `ni`/`hi`/`hura` sentenced, `spot-error` never qualifies
      // (it needs at least four), so this should only ever yield `sentence`,
      // `type-verb`, or — for the unsentenced persons — the bare-form fallback.
      vi.spyOn(Math, 'random').mockReturnValue(0.1)

      generateQuestions(verbWithSentences, 'present').forEach((question) => {
        expect(question.kind).not.toBe('spot-error')
      })
    })
  })

  describe('spot-error questions', () => {
    const verbWithManySentences = {
      ...verb,
      sentences: {
        present: {
          ni: 'Ni irakaslea ___.',
          hi: 'Hi ikaslea ___.',
          hura: 'Hura medikua ___.',
          gu: 'Gu lagunak ___.',
          zuek: 'Zuek azkarrak ___.',
          haiek: 'Haiek euskaldunak ___.',
        },
      },
    }
    const sentenced = verbWithManySentences.sentences.present
    const table = verbWithManySentences.conjugations.present

    it('picks exactly one of four distinct, fully-filled sentences as the wrong one when the roll favours it', () => {
      // No `pronouns`, so with all six persons sentenced `availableKinds` is
      // `['sentence', 'type-verb', 'spot-error']` — [0, 0.75) splits into
      // three slices of 0.25, and 0.6 lands in the last one: 'spot-error'.
      vi.spyOn(Math, 'random').mockReturnValue(0.6)

      generateQuestions(verbWithManySentences, 'present').forEach((question) => {
        expect(question).toMatchObject({ kind: 'spot-error', verbId: verbWithManySentences.id, tense: 'present' })
        expect(question.items).toHaveLength(4)

        const persons = question.items.map((item) => item.person)
        expect(new Set(persons).size).toBe(persons.length)
        question.items.forEach((item) => {
          expect(sentenced).toHaveProperty(item.person)
          expect(item.sentence).not.toContain('___')
        })

        // Exactly one item's filled-in form doesn't match its own person's
        // correct conjugation — that's the one `correct`/`options` point to.
        const correctlyFilled = (item) => sentenced[item.person].replace('___', table[item.person])
        const mismatched = question.items.filter((item) => item.sentence !== correctlyFilled(item))
        expect(mismatched).toHaveLength(1)
        expect(question.correct).toBe(mismatched[0].sentence)
        expect(question.options).toEqual(question.items.map((item) => item.sentence))
        expect(question.options).toContain(question.correct)
        expect(new Set(question.options).size).toBe(question.options.length)
      })
    })
  })

  describe('with declined pronouns', () => {
    const verbWithPronouns = {
      ...verb,
      pronouns: { ni: 'Nik', hi: 'Hik', hura: 'Hark', gu: 'Guk', zuek: 'Zuek', haiek: 'Haiek' },
      pronounSentences: {
        present: {
          ni: '___ liburu bat dut.',
          hi: '___ auto bat duk.',
          hura: '___ etxe bat du.',
        },
      },
    }
    const pronounSentenced = verbWithPronouns.pronounSentences.present

    it('frames a question as filling in the declined pronoun when the roll favours it', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const questions = generateQuestions(verbWithPronouns, 'present')

      questions.forEach((question) => {
        if (pronounSentenced[question.person]) {
          expect(question).toMatchObject({
            kind: 'pronoun',
            sentence: pronounSentenced[question.person],
            correct: verbWithPronouns.pronouns[question.person],
          })
          expect(question.sentence).toContain('___')
          expect(question.options).toContain(question.correct)
        } else {
          expect(question.kind).toBe('form')
        }
      })
    })

    it('only offers other declined pronouns as distractors, never conjugated verb forms', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      generateQuestions(verbWithPronouns, 'present')
        .filter((question) => question.kind === 'pronoun')
        .forEach((question) => {
          question.options.forEach((option) => {
            expect(Object.values(verbWithPronouns.pronouns)).toContain(option)
          })
        })
    })

    it('falls back to the bare form when the roll does not favour a pronoun, even with pronoun data available', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99)

      generateQuestions(verbWithPronouns, 'present').forEach((question) => {
        expect(question.kind).toBe('form')
        expect(question).not.toHaveProperty('sentence')
      })
    })
  })

  describe('with negation', () => {
    const verbWithNegation = {
      ...verb,
      negativeSentences: {
        present: {
          ni: 'Ni ez ___ irakaslea.',
          hi: 'Hi ez ___ ikaslea.',
          hura: 'Hura ez ___ medikua.',
        },
      },
    }
    const negated = verbWithNegation.negativeSentences.present

    it('frames a question as filling the negative sentence when includeNegation is set and the roll favours it', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      generateQuestions(verbWithNegation, 'present', { includeNegation: true }).forEach((question) => {
        if (negated[question.person]) {
          expect(question).toMatchObject({
            kind: 'negative',
            sentence: negated[question.person],
            correct: verbWithNegation.conjugations.present[question.person],
          })
          expect(question.sentence).toContain('___')
          expect(question.options).toContain(question.correct)
        } else {
          expect(question.kind).toBe('form')
        }
      })
    })

    it('frames a question as typing the verb into the negative-sentence blank when the roll favours it', () => {
      // ['negative', 'type-negative'] split [0, 0.75) into two slices of
      // 0.375 — 0.5 lands in the second one: 'type-negative'.
      vi.spyOn(Math, 'random').mockReturnValue(0.5)

      generateQuestions(verbWithNegation, 'present', { includeNegation: true }).forEach((question) => {
        if (negated[question.person]) {
          expect(question).toMatchObject({
            kind: 'type-negative',
            sentence: negated[question.person],
            correct: verbWithNegation.conjugations.present[question.person],
          })
          expect(question.sentence).toContain('___')
          expect(question).not.toHaveProperty('options')
        }
      })
    })

    it('only offers negative or type-negative for a person with negativeSentences data, never the usual mix', () => {
      ;[0, 0.2, 0.5, 0.7].forEach((roll) => {
        vi.spyOn(Math, 'random').mockReturnValue(roll)

        generateQuestions(verbWithNegation, 'present', { includeNegation: true }).forEach((question) => {
          if (negated[question.person]) {
            expect(['negative', 'type-negative']).toContain(question.kind)
          }
        })
      })
    })

    it('excludes type-negative when noTyping is set, even on rolls that would otherwise favour it', () => {
      ;[0, 0.5, 0.7].forEach((roll) => {
        vi.spyOn(Math, 'random').mockReturnValue(roll)

        generateQuestions(verbWithNegation, 'present', { includeNegation: true, noTyping: true }).forEach((question) => {
          expect(question.kind).not.toBe('type-negative')
          if (negated[question.person] && question.kind !== 'form') {
            expect(question.kind).toBe('negative')
          }
        })
      })
    })

    it('never produces negative or type-negative questions without includeNegation, even with negativeSentences data present', () => {
      ;[0, 0.2, 0.5, 0.7, 0.99].forEach((roll) => {
        vi.spyOn(Math, 'random').mockReturnValue(roll)

        generateQuestions(verbWithNegation, 'present').forEach((question) => {
          expect(['negative', 'type-negative']).not.toContain(question.kind)
        })
      })
    })
  })

  describe('with typed-answer framings', () => {
    const sentenced = verbWithBoth.sentences.present
    const pronounSentenced = verbWithBoth.pronounSentences.present

    it('frames a question as typing the verb form into the sentence blank when the roll favours it', () => {
      // [0, 0.75) split into five equal slices of 0.15 — 0.2 lands in the
      // second one, i.e. index 1 of the available-kinds list: 'type-verb'.
      vi.spyOn(Math, 'random').mockReturnValue(0.2)

      generateQuestions(verbWithBoth, 'present').forEach((question) => {
        expect(question).toMatchObject({
          kind: 'type-verb',
          sentence: sentenced[question.person],
          correct: verbWithBoth.conjugations.present[question.person],
        })
        expect(question.sentence).toContain('___')
        expect(question).not.toHaveProperty('options')
      })
    })

    it('frames a question as typing the declined pronoun into the sentence blank when the roll favours it', () => {
      // [0, 0.75) split into five equal slices of 0.15 — 0.65 lands in the
      // last one, i.e. index 4 of the available-kinds list: 'type-pronoun'.
      vi.spyOn(Math, 'random').mockReturnValue(0.65)

      generateQuestions(verbWithBoth, 'present').forEach((question) => {
        expect(question).toMatchObject({
          kind: 'type-pronoun',
          sentence: pronounSentenced[question.person],
          correct: verbWithBoth.pronouns[question.person],
        })
        expect(question.sentence).toContain('___')
        expect(question).not.toHaveProperty('options')
      })
    })

    it('falls back to the bare form when the roll does not favour a special framing', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99)

      generateQuestions(verbWithBoth, 'present').forEach((question) => {
        expect(question.kind).toBe('form')
        expect(question).not.toHaveProperty('sentence')
        expect(question.options).toContain(question.correct)
      })
    })
  })

  describe('with noTyping', () => {
    it('still produces sentence/pronoun multiple-choice framings, not just the bare form', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const questions = generateQuestions(verbWithBoth, 'present', { noTyping: true })

      expect(questions.map((q) => q.kind)).toContain('sentence')
      questions.forEach((question) => {
        expect(['form', 'sentence', 'pronoun']).toContain(question.kind)
        if (question.kind !== 'form') expect(question).toHaveProperty('options')
      })
    })

    it('excludes typed and spot-error framings even on rolls that would otherwise favour them', () => {
      // 0.2, 0.4, and 0.65 each select 'type-verb', 'spot-error', and
      // 'type-pronoun' respectively in the full five-kind mix (see the typed-
      // framing specs above) — with `noTyping`, only `['sentence', 'pronoun']`
      // are on offer, so every roll below SPECIAL_QUESTION_CHANCE lands on one
      // of those two instead.
      ;[0, 0.2, 0.4, 0.65, 0.74].forEach((roll) => {
        vi.spyOn(Math, 'random').mockReturnValue(roll)

        generateQuestions(verbWithBoth, 'present', { noTyping: true }).forEach((question) => {
          expect(['sentence', 'pronoun']).toContain(question.kind)
        })
      })
    })

    it('still produces the full mix of framings when left at its default', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const kinds = generateQuestions(verbWithBoth, 'present').map((q) => q.kind)

      expect(kinds).toContain('sentence')
    })
  })

  describe('with sentence variants', () => {
    const verbWithVariants = {
      ...verb,
      sentences: {
        present: {
          ni: ['Ni irakaslea ___.', 'Ni ikaslea ___.', 'Ni aita ___.'],
          hi: 'Hi ikaslea ___.',
          hura: 'Hura medikua ___.',
          gu: 'Gu lagunak ___.',
          zuek: 'Zuek azkarrak ___.',
          haiek: 'Haiek euskaldunak ___.',
        },
      },
    }
    const variants = verbWithVariants.sentences.present.ni

    it('picks one of the variants for a sentence-framed question', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const question = generateQuestions(verbWithVariants, 'present').find((q) => q.person === 'ni')

      expect(question.kind).toBe('sentence')
      expect(variants).toContain(question.sentence)
    })

    it('can land on different variants across separate generations', () => {
      const seen = new Set()
      for (let i = 0; i < 50; i += 1) {
        const question = generateQuestions(verbWithVariants, 'present').find((q) => q.person === 'ni')
        if (question.kind === 'sentence' || question.kind === 'type-verb') {
          seen.add(question.sentence)
        }
      }

      expect(seen.size).toBeGreaterThan(1)
    })

    it('fills the blank with one of the variants in a spot-error question too', () => {
      // As above: with all six persons sentenced, 0.6 lands on 'spot-error'.
      vi.spyOn(Math, 'random').mockReturnValue(0.6)

      const question = generateQuestions(verbWithVariants, 'present').find((q) => q.kind === 'spot-error' && q.person === 'ni')
      const niItem = question.items.find((item) => item.person === 'ni')

      const prefixes = variants.map((variant) => variant.split('___')[0])
      expect(prefixes.some((prefix) => niItem.sentence.startsWith(prefix))).toBe(true)
    })
  })

  describe('rounds', () => {
    it('repeats one question per person for each round', () => {
      const questions = generateQuestions(verb, 'present', { rounds: 3 })

      expect(questions).toHaveLength(persons.length * 3)
      persons.forEach((person) => {
        expect(questions.filter((q) => q.person === person)).toHaveLength(3)
      })
    })

    it('defaults to a single round', () => {
      expect(generateQuestions(verb, 'present')).toHaveLength(persons.length)
    })

    it('cycles through every available framing for a person before repeating one', () => {
      const verbWithFramings = {
        ...verb,
        conjugations: { present: { ni: 'naiz', zu: 'zara', hura: 'da' } },
        sentences: {
          present: {
            ni: 'Ni irakaslea ___.',
            zu: 'Zu ikaslea ___.',
            hura: 'Hura medikua ___.',
          },
        },
        pronouns: { ni: 'Ni', zu: 'Zu', hura: 'Hura' },
        pronounSentences: {
          present: {
            ni: '___ irakaslea naiz.',
            zu: '___ ikaslea zara.',
            hura: '___ medikua da.',
          },
        },
      }
      const personsHere = Object.keys(verbWithFramings.conjugations.present)

      // With `noTyping`, each person has exactly three framings on offer —
      // `form`, `sentence`, `pronoun` — matching `rounds: 3`, so every person
      // should see one of each with no repeats, regardless of how the
      // underlying rolls land.
      const questions = generateQuestions(verbWithFramings, 'present', { noTyping: true, rounds: 3 })

      personsHere.forEach((person) => {
        const kinds = questions.filter((q) => q.person === person).map((q) => q.kind)
        expect(kinds).toHaveLength(3)
        expect(new Set(kinds)).toEqual(new Set(['form', 'sentence', 'pronoun']))
      })
    })
  })
})

describe('getExplanation', () => {
  const verbAbsolutive = {
    id: 'verb',
    verb: 'izan',
    agreement: ['nor'],
    conjugations: {
      present: { ni: 'naiz', hura: 'da' },
    },
  }
  const verbErgative = {
    id: 'verb-ergative',
    verb: 'ukan',
    agreement: ['nor', 'nork'],
    conjugations: {
      present: { ni: 'dut', hura: 'du' },
    },
  }
  const t = (key, vars) => `${key}:${JSON.stringify(vars)}`

  it('explains negative and type-negative questions with the conjugated form', () => {
    const negative = getExplanation(verbAbsolutive, { kind: 'negative', tense: 'present', person: 'ni' }, t)
    const typeNegative = getExplanation(verbAbsolutive, { kind: 'type-negative', tense: 'present', person: 'hura' }, t)

    expect(negative).toBe('explanationNegation:{"form":"naiz"}')
    expect(typeNegative).toBe('explanationNegation:{"form":"da"}')
  })

  it('explains pronoun questions differently depending on whether the verb takes an ergative subject', () => {
    const question = { kind: 'pronoun', tense: 'present', person: 'ni', correct: 'Nik' }

    expect(getExplanation(verbAbsolutive, question, t)).toBe(
      'explanationPronounAbsolutive:{"pronoun":"Nik","verb":"izan","form":"naiz"}',
    )
    expect(getExplanation(verbErgative, { ...question, correct: 'Nik' }, t)).toBe(
      'explanationPronounErgative:{"pronoun":"Nik","verb":"ukan","form":"dut"}',
    )
  })

  it('uses a different explanation key for negation than for pronoun questions', () => {
    const negative = getExplanation(verbAbsolutive, { kind: 'negative', tense: 'present', person: 'ni' }, t)
    const pronoun = getExplanation(verbAbsolutive, { kind: 'pronoun', tense: 'present', person: 'ni', correct: 'Nik' }, t)

    expect(negative).not.toBe(pronoun)
  })

  it('returns null for kinds with no explanation', () => {
    ;['form', 'sentence', 'type-verb', 'spot-error'].forEach((kind) => {
      expect(getExplanation(verbAbsolutive, { kind, tense: 'present', person: 'ni' }, t)).toBeNull()
    })
  })
})

describe('shuffle', () => {
  it('returns a permutation of the input without mutating the original', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)

    expect(result).not.toBe(input)
    expect(input).toEqual([1, 2, 3, 4, 5])
    expect([...result].sort()).toEqual([...input].sort())
  })
})

describe('exerciseReducer', () => {
  const questionA = { person: 'ni', correct: 'naiz', options: ['naiz', 'haiz', 'da', 'gara'] }
  const questionB = { person: 'hi', correct: 'haiz', options: ['naiz', 'haiz', 'da', 'gara'] }
  const baseState = {
    queue: [questionA, questionB],
    total: 2,
    selected: null,
    status: 'active',
    correctCount: 0,
    streak: 0,
  }

  it('marks a correct answer, increments the score, and extends the streak', () => {
    const next = exerciseReducer(baseState, { type: 'answer', option: 'naiz' })

    expect(next).toMatchObject({ status: 'correct', selected: 'naiz', correctCount: 1, streak: 1 })
  })

  it('marks a typed answer correct regardless of case or surrounding whitespace', () => {
    const next = exerciseReducer(baseState, { type: 'answer', option: '  Naiz ' })

    expect(next).toMatchObject({ status: 'correct', correctCount: 1, streak: 1 })
  })

  it('marks an incorrect answer, awards no score, and resets the streak', () => {
    const onAStreak = { ...baseState, streak: 3 }
    const next = exerciseReducer(onAStreak, { type: 'answer', option: 'haiz' })

    expect(next).toMatchObject({ status: 'incorrect', selected: 'haiz', correctCount: 0, streak: 0 })
  })

  it('ignores further answers once the question has already been answered', () => {
    const answered = exerciseReducer(baseState, { type: 'answer', option: 'naiz' })
    const ignored = exerciseReducer(answered, { type: 'answer', option: 'haiz' })

    expect(ignored).toBe(answered)
  })

  it('drops a correctly-answered question from the queue and resets selection and status', () => {
    const answered = exerciseReducer(baseState, { type: 'answer', option: 'naiz' })
    const next = exerciseReducer(answered, { type: 'next' })

    expect(next.queue).toEqual([questionB])
    expect(next).toMatchObject({ selected: null, status: 'active', correctCount: 1 })
  })

  it('requeues an incorrectly-answered question at the back, marked for retry', () => {
    const answered = exerciseReducer(baseState, { type: 'answer', option: 'haiz' })
    const next = exerciseReducer(answered, { type: 'next' })

    expect(next.queue).toHaveLength(2)
    expect(next.queue[0]).toBe(questionB)
    expect(next.queue[1]).toMatchObject({ person: 'ni', correct: 'naiz', retry: true })
    expect(next).toMatchObject({ selected: null, status: 'active', correctCount: 0 })
  })

  it('does not award score for getting a requeued question right on retry', () => {
    const retryState = { ...baseState, queue: [{ ...questionA, retry: true }], total: 1 }
    const next = exerciseReducer(retryState, { type: 'answer', option: 'naiz' })

    expect(next).toMatchObject({ status: 'correct', correctCount: 0 })
  })
})
