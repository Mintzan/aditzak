import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  addPoints,
  agreementsCompatible,
  buildFlagDiagnostics,
  buildTaggedOptions,
  canRepairStreak,
  computeLessonPoints,
  CASE_MIXER_QUESTION_COUNT,
  computeStars,
  CROSS_VERB_QUESTION_COUNT,
  EXTRA_REVIEW_EXERCISES,
  exerciseReducer,
  generateCaseMixerQuestions,
  generateCrossVerbQuestions,
  generateMatchPairsQuestions,
  generateQuestions,
  generateReadingQuestions,
  getActiveStreak,
  getCaseFrameLure,
  getCaseFramePronounLure,
  getCrossTenseLure,
  getDativeOvergenerationLure,
  getComposedTable,
  getCrossVerbCandidates,
  getEncouragement,
  getExplanation,
  getFixedArgument,
  getIntroducedSources,
  getLocalDateString,
  getLureRationale,
  getObjectNumberLure,
  getPointsBalance,
  getProgressiveBaseLure,
  getRecencyContrastLure,
  getStreakEncouragement,
  getUnlockedLessonIds,
  getWeakSpotQuestions,
  isAnswerCorrect,
  isLockedByGateScore,
  MATCH_PAIRS_QUESTION_COUNT,
  mergeDailyStreak,
  mergeErrorStats,
  mergePoints,
  mergeProgress,
  mergeSyncPayload,
  filterExtraCandidates,
  normalizeSentence,
  pickEncouragementVariantIndex,
  recordDailyStreak,
  recordErrors,
  recordResult,
  repairStreak,
  resolveObjectAxisTable,
  shuffle,
  STREAK_REPAIR_COST,
  WORD_ORDER_MAX_WORDS,
  WORD_ORDER_MIN_WORDS,
} from './lessonLogic'
import { LESSONS } from './data/lessons'
import { VERBS } from './data/verbs'
import { READING_ITEMS } from './data/readingItems'

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
  it('adds to an empty points map under the current device', () => {
    expect(addPoints({}, 10, 'device-a')).toEqual({ earned: { 'device-a': 10 }, spent: {} })
  })

  it('accumulates onto this device’s earned counter without mutating the input or other devices’ counters', () => {
    const points = { earned: { 'device-a': 20, 'device-b': 5 }, spent: { 'device-b': 2 } }

    expect(addPoints(points, 5, 'device-a')).toEqual({
      earned: { 'device-a': 25, 'device-b': 5 },
      spent: { 'device-b': 2 },
    })
    expect(points).toEqual({ earned: { 'device-a': 20, 'device-b': 5 }, spent: { 'device-b': 2 } })
  })
})

describe('getPointsBalance', () => {
  it('is 0 for an empty points map', () => {
    expect(getPointsBalance({})).toBe(0)
    expect(getPointsBalance(undefined)).toBe(0)
  })

  it('sums earned across devices and subtracts spent across devices', () => {
    const points = { earned: { 'device-a': 30, 'device-b': 15 }, spent: { 'device-a': 10 } }

    expect(getPointsBalance(points)).toBe(35)
  })
})

describe('canRepairStreak', () => {
  const points = { earned: { 'device-a': STREAK_REPAIR_COST }, spent: {} }

  it('is false when the streak is still alive', () => {
    const streak = { currentStreak: 4, longestStreak: 4, lastActiveDate: '2026-06-10' }

    expect(canRepairStreak(streak, points, '2026-06-11')).toBe(false)
  })

  it('is false when the streak is broken but there are no points to repair it', () => {
    const streak = { currentStreak: 4, longestStreak: 4, lastActiveDate: '2026-06-10' }
    const lowPoints = { earned: { 'device-a': STREAK_REPAIR_COST - 1 }, spent: {} }

    expect(canRepairStreak(streak, lowPoints, '2026-06-12')).toBe(false)
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
  it('backdates lastActiveDate to yesterday and deducts the cost from this device’s spent counter, preserving the streak counts', () => {
    const streak = { currentStreak: 4, longestStreak: 4, lastActiveDate: '2026-06-10' }
    const points = { earned: { 'device-a': STREAK_REPAIR_COST + 50 }, spent: {} }

    const result = repairStreak(streak, points, '2026-06-12', 'device-a')

    expect(result.streak).toEqual({ currentStreak: 4, longestStreak: 4, lastActiveDate: '2026-06-11' })
    expect(result.points).toEqual({ earned: { 'device-a': STREAK_REPAIR_COST + 50 }, spent: { 'device-a': STREAK_REPAIR_COST } })
    expect(getPointsBalance(result.points)).toBe(50)
    expect(getActiveStreak(result.streak, '2026-06-12')).toBe(4)
  })
})

describe('mergeProgress', () => {
  it('returns the other side unchanged when one side is empty', () => {
    const progress = { 'izan-present': { attempts: 1, bestScore: 3, totalQuestions: 3, bestStars: 3, lastPlayed: '2026-06-10T00:00:00.000Z' } }

    expect(mergeProgress({}, progress)).toEqual(progress)
    expect(mergeProgress(progress, {})).toEqual(progress)
  })

  it('takes the max of each field per lesson, and the more recent lastPlayed', () => {
    const local = {
      'izan-present': { attempts: 2, bestScore: 3, totalQuestions: 3, bestStars: 3, lastPlayed: '2026-06-10T00:00:00.000Z' },
    }
    const cloud = {
      'izan-present': { attempts: 5, bestScore: 2, totalQuestions: 3, bestStars: 1, lastPlayed: '2026-06-12T00:00:00.000Z' },
    }

    expect(mergeProgress(local, cloud)).toEqual({
      'izan-present': { attempts: 5, bestScore: 3, totalQuestions: 3, bestStars: 3, lastPlayed: '2026-06-12T00:00:00.000Z' },
    })
  })

  it('keeps lessons that only exist on one side', () => {
    const local = { 'izan-present': { attempts: 1, bestScore: 3, totalQuestions: 3, bestStars: 3, lastPlayed: '2026-06-10T00:00:00.000Z' } }
    const cloud = { 'egon-present': { attempts: 2, bestScore: 3, totalQuestions: 3, bestStars: 3, lastPlayed: '2026-06-11T00:00:00.000Z' } }

    expect(mergeProgress(local, cloud)).toEqual({ ...local, ...cloud })
  })
})

describe('mergeDailyStreak', () => {
  it('returns the other side unchanged when one side is empty', () => {
    const streak = { currentStreak: 3, longestStreak: 5, lastActiveDate: '2026-06-12' }

    expect(mergeDailyStreak({}, streak)).toEqual(streak)
    expect(mergeDailyStreak(streak, {})).toEqual(streak)
  })

  it('takes currentStreak/lastActiveDate from the more recently active side, but maxes longestStreak', () => {
    const local = { currentStreak: 1, longestStreak: 5, lastActiveDate: '2026-06-13' }
    const cloud = { currentStreak: 7, longestStreak: 7, lastActiveDate: '2026-06-10' }

    expect(mergeDailyStreak(local, cloud)).toEqual({ currentStreak: 1, longestStreak: 7, lastActiveDate: '2026-06-13' })
  })
})

describe('mergeErrorStats', () => {
  it('unions entries that only exist on one side', () => {
    const local = { 'izan-present:oraina:ni': { verbId: 'izan', tense: 'oraina', person: 'ni', count: 2, lastMissed: '2026-06-10T00:00:00.000Z' } }
    const cloud = { 'egon-present:oraina:hi': { verbId: 'egon', tense: 'oraina', person: 'hi', count: 1, lastMissed: '2026-06-09T00:00:00.000Z' } }

    expect(mergeErrorStats(local, cloud)).toEqual({ ...local, ...cloud })
  })

  it('takes the higher count and more recent lastMissed for overlapping entries', () => {
    const key = 'izan-present:oraina:ni'
    const local = { [key]: { verbId: 'izan', tense: 'oraina', person: 'ni', count: 1, lastMissed: '2026-06-12T00:00:00.000Z' } }
    const cloud = { [key]: { verbId: 'izan', tense: 'oraina', person: 'ni', count: 3, lastMissed: '2026-06-10T00:00:00.000Z' } }

    expect(mergeErrorStats(local, cloud)).toEqual({
      [key]: { verbId: 'izan', tense: 'oraina', person: 'ni', count: 3, lastMissed: '2026-06-12T00:00:00.000Z' },
    })
  })
})

describe('mergePoints', () => {
  it('unions deviceIds and takes the max per counter per device, independent of merge order', () => {
    const local = { earned: { 'device-a': 30, 'device-b': 5 }, spent: { 'device-a': 10 } }
    const cloud = { earned: { 'device-a': 20, 'device-c': 8 }, spent: { 'device-a': 10, 'device-c': 0 } }

    const expected = {
      earned: { 'device-a': 30, 'device-b': 5, 'device-c': 8 },
      spent: { 'device-a': 10, 'device-c': 0 },
    }
    expect(mergePoints(local, cloud)).toEqual(expected)
    expect(mergePoints(cloud, local)).toEqual(expected)
  })

  it('produces the correct summed balance with no loss across overlapping and disjoint deviceIds', () => {
    const local = { earned: { 'device-a': 50 }, spent: { 'device-a': 10 } }
    const cloud = { earned: { 'device-a': 30, 'device-b': 20 }, spent: { 'device-a': 10, 'device-b': 5 } }

    const merged = mergePoints(local, cloud)
    expect(getPointsBalance(merged)).toBe(50 - 10 + 20 - 5)
  })

  it('handles an empty input on either side', () => {
    const points = { earned: { 'device-a': 10 }, spent: { 'device-a': 2 } }

    expect(mergePoints({}, points)).toEqual({ earned: { 'device-a': 10 }, spent: { 'device-a': 2 } })
    expect(mergePoints(points, {})).toEqual({ earned: { 'device-a': 10 }, spent: { 'device-a': 2 } })
  })
})

describe('mergeSyncPayload', () => {
  it('merges all four fields per their own rules', () => {
    const local = {
      progress: { 'izan-present': { attempts: 1, bestScore: 2, totalQuestions: 3, bestStars: 1, lastPlayed: '2026-06-10T00:00:00.000Z' } },
      dailyStreak: { currentStreak: 1, longestStreak: 1, lastActiveDate: '2026-06-13' },
      points: { earned: { 'device-a': 10 }, spent: {} },
      errorStats: {},
    }
    const cloud = {
      progress: { 'izan-present': { attempts: 3, bestScore: 3, totalQuestions: 3, bestStars: 3, lastPlayed: '2026-06-11T00:00:00.000Z' } },
      dailyStreak: { currentStreak: 5, longestStreak: 5, lastActiveDate: '2026-06-11' },
      points: { earned: { 'device-b': 20 }, spent: {} },
      errorStats: { 'egon-present:oraina:hi': { verbId: 'egon', tense: 'oraina', person: 'hi', count: 1, lastMissed: '2026-06-09T00:00:00.000Z' } },
    }

    expect(mergeSyncPayload(local, cloud)).toEqual({
      progress: { 'izan-present': { attempts: 3, bestScore: 3, totalQuestions: 3, bestStars: 3, lastPlayed: '2026-06-11T00:00:00.000Z' } },
      dailyStreak: { currentStreak: 1, longestStreak: 5, lastActiveDate: '2026-06-13' },
      points: { earned: { 'device-a': 10, 'device-b': 20 }, spent: {} },
      errorStats: cloud.errorStats,
    })
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

  it('unlocks every lesson when `?dev=unlock-all` is present, regardless of progress', () => {
    expect(getUnlockedLessonIds(lessons, {}, '?dev=unlock-all')).toEqual(new Set(['a', 'b', 'c']))
  })

  it('ignores unrelated query params', () => {
    expect(getUnlockedLessonIds(lessons, {}, '?dev=something-else')).toEqual(new Set(['a']))
  })

  describe('with a gate lesson', () => {
    // `b` is the final lesson of a `gate: true` unit — `c` requires
    // `bestStars >= GATE_PASS_STARS` on `b`, not just an attempt.
    const gateLessonIds = new Set(['b'])

    it('keeps the lesson after a gate locked until the gate is passed', () => {
      const progress = { a: { attempts: 1 }, b: { attempts: 1, bestStars: 1 } }

      expect(getUnlockedLessonIds(lessons, progress, '', gateLessonIds)).toEqual(new Set(['a', 'b']))
    })

    it('unlocks the lesson after a gate once bestStars reaches GATE_PASS_STARS', () => {
      const progress = { a: { attempts: 1 }, b: { attempts: 1, bestStars: 2 } }

      expect(getUnlockedLessonIds(lessons, progress, '', gateLessonIds)).toEqual(new Set(['a', 'b', 'c']))
    })

    it('does not affect non-gate progression', () => {
      const progress = { a: { attempts: 1 } }

      expect(getUnlockedLessonIds(lessons, progress, '', gateLessonIds)).toEqual(new Set(['a', 'b']))
    })
  })
})

describe('isLockedByGateScore', () => {
  const lessons = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
  const gateLessonIds = new Set(['b'])

  it('is false for the first lesson', () => {
    expect(isLockedByGateScore(lessons, {}, gateLessonIds, 'a')).toBe(false)
  })

  it('is false when the previous lesson is not a gate', () => {
    expect(isLockedByGateScore(lessons, { a: { attempts: 1, bestStars: 0 } }, gateLessonIds, 'b')).toBe(false)
  })

  it('is false when the gate has not been attempted yet', () => {
    expect(isLockedByGateScore(lessons, {}, gateLessonIds, 'c')).toBe(false)
  })

  it('is true when the gate was attempted but scored below GATE_PASS_STARS', () => {
    const progress = { b: { attempts: 1, bestStars: 1 } }

    expect(isLockedByGateScore(lessons, progress, gateLessonIds, 'c')).toBe(true)
  })

  it('is false once the gate reaches GATE_PASS_STARS', () => {
    const progress = { b: { attempts: 1, bestStars: 2 } }

    expect(isLockedByGateScore(lessons, progress, gateLessonIds, 'c')).toBe(false)
  })
})

describe('getIntroducedSources', () => {
  const lessons = [
    { id: 'izan-present', verbId: 'izan', tense: 'present' },
    { id: 'egon-present', verbId: 'egon', tense: 'present' },
    { id: 'unit-1-review', review: true, sources: [{ verbId: 'izan', tense: 'present' }, { verbId: 'egon', tense: 'present' }] },
    { id: 'izan-past', verbId: 'izan', tense: 'past' },
  ]

  it('returns every practice lesson before the given lesson, in order', () => {
    expect(getIntroducedSources(lessons, 'unit-1-review')).toEqual([
      { verbId: 'izan', tense: 'present' },
      { verbId: 'egon', tense: 'present' },
    ])
  })

  it('does not surface a verb/tense introduced only after the given lesson (no spoilers)', () => {
    const sources = getIntroducedSources(lessons, 'unit-1-review')

    expect(sources).not.toContainEqual({ verbId: 'izan', tense: 'past' })
  })

  it('skips review lessons, which have no verbId/tense of their own', () => {
    expect(getIntroducedSources(lessons, 'izan-past')).toEqual([
      { verbId: 'izan', tense: 'present' },
      { verbId: 'egon', tense: 'present' },
    ])
  })

  it('returns an empty array for the first lesson', () => {
    expect(getIntroducedSources(lessons, 'izan-present')).toEqual([])
  })

  it('returns every practice lesson when the given id is not found', () => {
    expect(getIntroducedSources(lessons, 'does-not-exist')).toEqual([
      { verbId: 'izan', tense: 'present' },
      { verbId: 'egon', tense: 'present' },
      { verbId: 'izan', tense: 'past' },
    ])
  })

  it('skips "pool" lessons (non-review, but no verbId/tense of their own) without producing undefined entries', () => {
    // e.g. `unit-10-present`/`izan-past-pool` in src/data/lessons.js: shaped like a review
    // (`{ id, persons, sources }`) but `review` isn't set, so the old `!lesson.review` filter
    // let them through and produced bogus `{ verbId: undefined, tense: undefined }` entries.
    const lessonsWithPool = [
      ...lessons,
      { id: 'some-pool', persons: ['ni'], sources: [{ verbId: 'izan', tense: 'past' }] },
      { id: 'after-pool', verbId: 'egon', tense: 'past' },
    ]

    const sources = getIntroducedSources(lessonsWithPool, 'after-pool')

    expect(sources).not.toContainEqual({ verbId: undefined, tense: undefined })
    expect(sources).toEqual([
      { verbId: 'izan', tense: 'present' },
      { verbId: 'egon', tense: 'present' },
      { verbId: 'izan', tense: 'past' },
    ])
  })
})

describe('buildTaggedOptions', () => {
  it('tags same-table, sibling, and lure candidates by their source', () => {
    // A two-person table plus exactly one extra and one priority candidate
    // fills the 3-distractor cap exactly, so every candidate is guaranteed
    // to land in `distractors` regardless of shuffle order.
    const twoPersonTable = { ni: 'naiz', hi: 'haiz' }
    const { distractors } = buildTaggedOptions(twoPersonTable, ['ni', 'hi'], 'ni', ['nago'], [], [{ form: 'dut', errorType: 'case-frame' }])
    expect(distractors).toHaveLength(3)
    expect(distractors).toContainEqual({ form: 'dut', source: 'lure', errorType: 'case-frame' })
    expect(distractors).toContainEqual({ form: 'nago', source: 'sibling' })
    expect(distractors).toContainEqual({ form: 'haiz', source: 'same-table' })
  })

  it('tags borrowed (last-resort) candidates as sibling', () => {
    const threePersonTable = { ni: 'naiz', hi: 'haiz', hura: 'da' }
    const { distractors } = buildTaggedOptions(threePersonTable, ['ni', 'hi', 'hura'], 'ni', [], ['gara', 'zarete', 'dira'])
    expect(distractors.length).toBe(3)
    expect(distractors.filter((candidate) => candidate.source === 'sibling').length).toBeGreaterThan(0)
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

  it('restricts questions and distractors to the `persons` filter when given', () => {
    const filtered = ['ni', 'zu', 'hura']
    const questions = generateQuestions({ ...verb, conjugations: { present: { ...verb.conjugations.present, zu: 'zara' } } }, 'present', { persons: filtered })

    expect(questions).toHaveLength(filtered.length)
    expect(questions.map((q) => q.person).sort()).toEqual([...filtered].sort())
    questions.forEach((question) => {
      question.options.forEach((option) => {
        expect(Object.values({ ni: 'naiz', zu: 'zara', hura: 'da' })).toContain(option)
      })
    })
  })

  it('tags every question with the verb and tense it was generated from', () => {
    generateQuestions(verb, 'present').forEach((question) => {
      expect(question).toMatchObject({ verbId: verb.id, tense: 'present', fixedArgument: null })
    })
  })

  it('resolves fixedArgument from a recipient/agent verb (#142)', () => {
    const recipientVerb = { ...verb, recipient: 'hura' }
    generateQuestions(recipientVerb, 'present').forEach((question) => {
      expect(question.fixedArgument).toEqual({ role: 'nori', person: 'hura' })
    })

    const agentVerb = { ...verb, agent: 'ni' }
    generateQuestions(agentVerb, 'present').forEach((question) => {
      expect(question.fixedArgument).toEqual({ role: 'nork', person: 'ni' })
    })
  })

  // #346: a verb opted into a real 2D NOR-NORK table (`{ [nork]: { [nor]:
  // form } }`) instead of the usual flat `[person]: form` — `objectAxis`
  // tells `generateQuestions` which axis to drill before anything else runs.
  describe('objectAxis (#346)', () => {
    const table2D = {
      ni: { hura: 'dut', zu: 'zaitut', zuek: 'zaituztet', haiek: 'ditut' },
      hura: { ni: 'nau', hura: 'du', gu: 'gaitu', zu: 'zaitu', zuek: 'zaituzte', haiek: 'ditu' },
      gu: { hura: 'dugu', zu: 'zaitugu', zuek: 'zaituztegu', haiek: 'ditugu' },
      zu: { ni: 'nauzu', hura: 'duzu', gu: 'gaituzu', haiek: 'dituzu' },
      zuek: { ni: 'nauzue', hura: 'duzue', gu: 'gaituzue', haiek: 'dituzue' },
      haiek: { ni: 'naute', hura: 'dute', gu: 'gaituzte', zu: 'zaituzte', zuek: 'zaituztete', haiek: 'dituzte' },
    }
    const objectAxisVerb = { id: 'object-axis-verb', agreement: ['nor', 'nork'], conjugations: { presentByObject: table2D } }

    it('resolveObjectAxisTable drills the object (nor) with nork fixed', () => {
      expect(resolveObjectAxisTable(table2D, { vary: 'nor', fixed: 'ni' })).toEqual(table2D.ni)
    })

    it('resolveObjectAxisTable drills the subject (nork) with nor fixed', () => {
      expect(resolveObjectAxisTable(table2D, { vary: 'nork', fixed: 'hura' })).toEqual({
        ni: 'dut',
        hura: 'du',
        gu: 'dugu',
        zu: 'duzu',
        zuek: 'duzue',
        haiek: 'dute',
      })
    })

    it('resolveObjectAxisTable omits gaps (a missing cell, e.g. a reflexive person) rather than crashing', () => {
      expect(resolveObjectAxisTable(table2D, { vary: 'nor', fixed: 'ni' })).not.toHaveProperty('ni')
      expect(resolveObjectAxisTable(table2D, { vary: 'nork', fixed: 'ni' })).not.toHaveProperty('ni')
    })

    it('generateQuestions resolves the 2D table to a flat one before building questions', () => {
      const objectPersons = Object.keys(table2D.ni)
      const questions = generateQuestions(objectAxisVerb, 'presentByObject', { objectAxis: { vary: 'nor', fixed: 'ni' } })

      expect(questions).toHaveLength(objectPersons.length)
      questions.forEach((question) => {
        expect(question.correct).toBe(table2D.ni[question.person])
        expect(question.options).toContain(question.correct)
      })
    })

    it('overrides fixedArgument to describe the pinned axis instead of getFixedArgument(verb)', () => {
      generateQuestions(objectAxisVerb, 'presentByObject', { objectAxis: { vary: 'nor', fixed: 'ni' } }).forEach((question) => {
        expect(question.fixedArgument).toEqual({ role: 'nork', person: 'ni' })
      })

      generateQuestions(objectAxisVerb, 'presentByObject', { objectAxis: { vary: 'nork', fixed: 'hura' } }).forEach((question) => {
        expect(question.fixedArgument).toEqual({ role: 'nor', person: 'hura' })
      })
    })

    it("matches ukan's existing single-axis `present` table for the citation (nor: 'hura') column", () => {
      const ukan = VERBS.find((v) => v.id === 'ukan')
      const presentByObject = getComposedTable(ukan, 'presentByObject')
      for (const nork of Object.keys(ukan.conjugations.present)) {
        if (!(nork in presentByObject)) continue
        expect(presentByObject[nork].hura).toBe(ukan.conjugations.present[nork])
      }
    })

    // #347: `past`'s sibling 2D table, same cross-check as `presentByObject`.
    it("matches ukan's existing single-axis `past` table for the citation (nor: 'hura') column", () => {
      const ukan = VERBS.find((v) => v.id === 'ukan')
      const pastByObject = getComposedTable(ukan, 'pastByObject')
      for (const nork of Object.keys(ukan.conjugations.past)) {
        if (!(nork in pastByObject)) continue
        expect(pastByObject[nork].hura).toBe(ukan.conjugations.past[nork])
      }
    })

    // #347: smoke test exercising the real `ukan` data (not the synthetic
    // fixture above) end to end through `generateQuestions`, confirming the
    // "zaitut-type forms" payoff the issue is named for actually surfaces.
    it("generates real zaitut-type questions from ukan's presentByObject/pastByObject (#347)", () => {
      const ukan = VERBS.find((v) => v.id === 'ukan')

      const presentQuestions = generateQuestions(ukan, 'presentByObject', { objectAxis: { vary: 'nor', fixed: 'ni' } })
      expect(presentQuestions.map((q) => q.correct)).toEqual(expect.arrayContaining(['zaitut', 'zaituztet', 'ditut']))
      presentQuestions.forEach((question) => {
        expect(question.fixedArgument).toEqual({ role: 'nork', person: 'ni' })
        expect(question.options).toContain(question.correct)
      })

      const pastQuestions = generateQuestions(ukan, 'pastByObject', { objectAxis: { vary: 'nor', fixed: 'ni' } })
      expect(pastQuestions.map((q) => q.correct)).toEqual(expect.arrayContaining(['zintudan', 'zintuztedan', 'nituen']))
      pastQuestions.forEach((question) => {
        expect(question.fixedArgument).toEqual({ role: 'nork', person: 'ni' })
        expect(question.options).toContain(question.correct)
      })
    })

    // #348: every cell of `maite`'s object-axis tables is `'maite '` plus
    // `ukan`'s matching cell, by construction — including the headline
    // "Maite zaitut" payoff (`presentByObject.ni.zu`).
    it("rides ukan's presentByObject/pastByObject with a 'maite ' prefix (#348)", () => {
      const ukan = VERBS.find((v) => v.id === 'ukan')
      const maite = VERBS.find((v) => v.id === 'maite')
      const ukanPresentByObject = getComposedTable(ukan, 'presentByObject')
      const ukanPastByObject = getComposedTable(ukan, 'pastByObject')
      const maitePresentByObject = getComposedTable(maite, 'presentByObject')
      const maitePastByObject = getComposedTable(maite, 'pastByObject')

      for (const nork of Object.keys(ukanPresentByObject)) {
        for (const nor of Object.keys(ukanPresentByObject[nork])) {
          expect(maitePresentByObject[nork][nor]).toBe(`maite ${ukanPresentByObject[nork][nor]}`)
        }
      }
      for (const nork of Object.keys(ukanPastByObject)) {
        for (const nor of Object.keys(ukanPastByObject[nork])) {
          expect(maitePastByObject[nork][nor]).toBe(`maite ${ukanPastByObject[nork][nor]}`)
        }
      }
      expect(maitePresentByObject.ni.zu).toBe('maite zaitut')
    })

    // #348: `generateQuestions` resolves the same way for `maite` as it does
    // for `ukan` (#347's test above) — forcing `Math.random` to `0` pins
    // `rollQuestionKind` to the bare `'form'` kind, so `correct` is always
    // the resolved table's value rather than a rendered sentence.
    it("generates real maite-zaitut-type questions from maite's presentByObject/pastByObject (#348)", () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const maite = VERBS.find((v) => v.id === 'maite')

      const presentQuestions = generateQuestions(maite, 'presentByObject', { objectAxis: { vary: 'nor', fixed: 'ni' } })
      expect(presentQuestions.map((q) => q.correct)).toEqual(
        expect.arrayContaining(['maite zaitut', 'maite zaituztet', 'maite ditut']),
      )
      presentQuestions.forEach((question) => {
        expect(question.fixedArgument).toEqual({ role: 'nork', person: 'ni' })
        expect(question.options).toContain(question.correct)
      })

      const pastQuestions = generateQuestions(maite, 'pastByObject', { objectAxis: { vary: 'nor', fixed: 'ni' } })
      expect(pastQuestions.map((q) => q.correct)).toEqual(
        expect.arrayContaining(['maite zintudan', 'maite zintuztedan', 'maite nituen']),
      )
      pastQuestions.forEach((question) => {
        expect(question.fixedArgument).toEqual({ role: 'nork', person: 'ni' })
        expect(question.options).toContain(question.correct)
      })
    })

    // #378: same `'ikusten '`/`'ikusi '`-prefix-of-ukan convention as
    // `maite`'s `'maite '` prefix (#348), except `ikusi` has two distinct
    // prefixes (present's imperfective `-ten` marker vs. past's bare
    // participle) instead of one shared prefix across both tenses.
    it("rides ukan's presentByObject/pastByObject with ikusi's own prefixes (#378)", () => {
      const ukan = VERBS.find((v) => v.id === 'ukan')
      const ikusi = VERBS.find((v) => v.id === 'ikusi')
      const ukanPresentByObject = getComposedTable(ukan, 'presentByObject')
      const ukanPastByObject = getComposedTable(ukan, 'pastByObject')
      const ikusiPresentByObject = getComposedTable(ikusi, 'presentByObject')
      const ikusiPastByObject = getComposedTable(ikusi, 'pastByObject')

      for (const nork of Object.keys(ukanPresentByObject)) {
        for (const nor of Object.keys(ukanPresentByObject[nork])) {
          expect(ikusiPresentByObject[nork][nor]).toBe(`ikusten ${ukanPresentByObject[nork][nor]}`)
        }
      }
      for (const nork of Object.keys(ukanPastByObject)) {
        for (const nor of Object.keys(ukanPastByObject[nork])) {
          expect(ikusiPastByObject[nork][nor]).toBe(`ikusi ${ukanPastByObject[nork][nor]}`)
        }
      }
      expect(ikusiPresentByObject.ni.zu).toBe('ikusten zaitut')
    })

    // #378: citation (nor: 'hura') column matches ikusi's existing flat
    // present/past tables, same cross-check #346/#347 already run for ukan.
    it("matches ikusi's existing single-axis present/past tables for the citation (nor: 'hura') column", () => {
      const ikusi = VERBS.find((v) => v.id === 'ikusi')
      const presentByObject = getComposedTable(ikusi, 'presentByObject')
      const pastByObject = getComposedTable(ikusi, 'pastByObject')
      for (const nork of Object.keys(ikusi.conjugations.present)) {
        if (!(nork in presentByObject)) continue
        expect(presentByObject[nork].hura).toBe(ikusi.conjugations.present[nork])
      }
      for (const nork of Object.keys(ikusi.conjugations.past)) {
        if (!(nork in pastByObject)) continue
        expect(pastByObject[nork].hura).toBe(ikusi.conjugations.past[nork])
      }
    })

    it("generates real ikusten-zaitut-type questions from ikusi's presentByObject/pastByObject (#378)", () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const ikusi = VERBS.find((v) => v.id === 'ikusi')

      const presentQuestions = generateQuestions(ikusi, 'presentByObject', { objectAxis: { vary: 'nor', fixed: 'ni' } })
      expect(presentQuestions.map((q) => q.correct)).toEqual(
        expect.arrayContaining(['ikusten zaitut', 'ikusten zaituztet', 'ikusten ditut']),
      )
      presentQuestions.forEach((question) => {
        expect(question.fixedArgument).toEqual({ role: 'nork', person: 'ni' })
        expect(question.options).toContain(question.correct)
      })

      const pastQuestions = generateQuestions(ikusi, 'pastByObject', { objectAxis: { vary: 'nor', fixed: 'ni' } })
      expect(pastQuestions.map((q) => q.correct)).toEqual(
        expect.arrayContaining(['ikusi zintudan', 'ikusi zintuztedan', 'ikusi nituen']),
      )
      pastQuestions.forEach((question) => {
        expect(question.fixedArgument).toEqual({ role: 'nork', person: 'ni' })
        expect(question.options).toContain(question.correct)
      })
    })

    // #379: same prefix-of-ukan convention extended to four more verbs
    // (jan/edan/erosi/hartu), each with its own present/past prefix pair
    // read off its existing flat present/past tables, same as #378's ikusi.
    it.each([
      ['jan', 'jaten ', 'jan '],
      ['edan', 'edaten ', 'edan '],
      ['erosi', 'erosten ', 'erosi '],
      ['hartu', 'hartzen ', 'hartu '],
    ])("rides ukan's presentByObject/pastByObject with %s's own prefixes (#379)", (verbId, presentPrefix, pastPrefix) => {
      const ukan = VERBS.find((v) => v.id === 'ukan')
      const verb = VERBS.find((v) => v.id === verbId)
      const ukanPresentByObject = getComposedTable(ukan, 'presentByObject')
      const ukanPastByObject = getComposedTable(ukan, 'pastByObject')
      const verbPresentByObject = getComposedTable(verb, 'presentByObject')
      const verbPastByObject = getComposedTable(verb, 'pastByObject')

      for (const nork of Object.keys(ukanPresentByObject)) {
        for (const nor of Object.keys(ukanPresentByObject[nork])) {
          expect(verbPresentByObject[nork][nor]).toBe(`${presentPrefix}${ukanPresentByObject[nork][nor]}`)
        }
      }
      for (const nork of Object.keys(ukanPastByObject)) {
        for (const nor of Object.keys(ukanPastByObject[nork])) {
          expect(verbPastByObject[nork][nor]).toBe(`${pastPrefix}${ukanPastByObject[nork][nor]}`)
        }
      }
    })

    // #379: citation (nor: 'hura') column matches each verb's existing flat
    // present/past tables, same cross-check #378 ran for ikusi.
    it.each(['jan', 'edan', 'erosi', 'hartu'])(
      "matches %s's existing single-axis present/past tables for the citation (nor: 'hura') column",
      (verbId) => {
        const verb = VERBS.find((v) => v.id === verbId)
        const presentByObject = getComposedTable(verb, 'presentByObject')
        const pastByObject = getComposedTable(verb, 'pastByObject')
        for (const nork of Object.keys(verb.conjugations.present)) {
          if (!(nork in presentByObject)) continue
          expect(presentByObject[nork].hura).toBe(verb.conjugations.present[nork])
        }
        for (const nork of Object.keys(verb.conjugations.past)) {
          if (!(nork in pastByObject)) continue
          expect(pastByObject[nork].hura).toBe(verb.conjugations.past[nork])
        }
      },
    )

    it.each([
      ['jan', 'jaten zaitut', 'jaten zaituztet', 'jaten ditut', 'jan zintudan', 'jan zintuztedan', 'jan nituen'],
      ['edan', 'edaten zaitut', 'edaten zaituztet', 'edaten ditut', 'edan zintudan', 'edan zintuztedan', 'edan nituen'],
      ['erosi', 'erosten zaitut', 'erosten zaituztet', 'erosten ditut', 'erosi zintudan', 'erosi zintuztedan', 'erosi nituen'],
      ['hartu', 'hartzen zaitut', 'hartzen zaituztet', 'hartzen ditut', 'hartu zintudan', 'hartu zintuztedan', 'hartu nituen'],
    ])(
      "generates real questions from %s's presentByObject/pastByObject (#379)",
      (verbId, presentZu, presentZuek, presentHaiek, pastZu, pastZuek, pastHaiek) => {
        vi.spyOn(Math, 'random').mockReturnValue(0)
        const verb = VERBS.find((v) => v.id === verbId)

        const presentQuestions = generateQuestions(verb, 'presentByObject', { objectAxis: { vary: 'nor', fixed: 'ni' } })
        expect(presentQuestions.map((q) => q.correct)).toEqual(
          expect.arrayContaining([presentZu, presentZuek, presentHaiek]),
        )
        presentQuestions.forEach((question) => {
          expect(question.fixedArgument).toEqual({ role: 'nork', person: 'ni' })
          expect(question.options).toContain(question.correct)
        })

        const pastQuestions = generateQuestions(verb, 'pastByObject', { objectAxis: { vary: 'nor', fixed: 'ni' } })
        expect(pastQuestions.map((q) => q.correct)).toEqual(
          expect.arrayContaining([pastZu, pastZuek, pastHaiek]),
        )
        pastQuestions.forEach((question) => {
          expect(question.fixedArgument).toEqual({ role: 'nork', person: 'ni' })
          expect(question.options).toContain(question.correct)
        })
      },
    )

    // #350: `hasAmbiguousTypedForm` (called from `buildQuestion` whenever
    // `verbs` is passed, exactly as `createExerciseState` does in real app
    // usage) used to look up `verb.conjugations[tense][person]` directly —
    // for an `objectAxis` lesson that's a 2D table, so the lookup returned a
    // nested object instead of a string and crashed on `.includes(' ')`.
    // Earlier objectAxis tests above never caught this because none of them
    // pass `verbs`. This pins the real `createExerciseState` path: `verbs:
    // VERBS` alongside `objectAxis`.
    it('does not crash when verbs (sibling list) is passed alongside objectAxis (#350)', () => {
      const candidates = ['ukan', 'maite', 'ikusi', 'jan', 'edan', 'erosi', 'hartu'].map((id) =>
        VERBS.find((v) => v.id === id),
      )

      for (const candidate of candidates) {
        for (const tense of ['presentByObject', 'pastByObject']) {
          expect(() =>
            generateQuestions(candidate, tense, { objectAxis: { vary: 'nor', fixed: 'ni' }, verbs: VERBS }),
          ).not.toThrow()
        }
      }
    })
  })

  // #358: the NOR-NORI mirror of #346/#347/#348's NOR-NORK `objectAxis` work
  // — `gustatu`/`iruditu`/`ahaztu` opt a real 2D table (`{ [nori]: { [nor]:
  // form } }`) into the same `resolveObjectAxisTable` machinery. The reason
  // this needed an engine change (not just data): `generateQuestions`'s
  // `fixedArgument` role used to be hardcoded to `'nork'`/`'nor'` only, which
  // would have mis-badged these verbs' fixed argument as NORK instead of
  // NORI. These tests pin both the data and that fix.
  describe('objectAxis on a NOR-NORI verb (#358)', () => {
    it.each(['gustatu', 'iruditu', 'ahaztu'])(
      "generates real natzaizu-type questions from %s's presentByNor/pastByNor, with fixedArgument.role 'nori' not 'nork'",
      (id) => {
        const candidate = VERBS.find((v) => v.id === id)
        expect(candidate.agreement).toEqual(['nor', 'nori'])

        // vary: 'nor', fixed: 'zu' pins NORI at 'zu' (the outer key) and
        // varies NOR (the inner key) — same outer/inner convention as
        // ukan's presentByObject, just with the roles swapped.
        const presentQuestions = generateQuestions(candidate, 'presentByNor', { objectAxis: { vary: 'nor', fixed: 'zu' } })
        expect(presentQuestions.length).toBeGreaterThan(0)
        presentQuestions.forEach((question) => {
          expect(question.correct).toBe(candidate.conjugations.presentByNor.zu[question.person])
          expect(question.options).toContain(question.correct)
          expect(question.fixedArgument).toEqual({ role: 'nori', person: 'zu' })
        })

        const pastQuestions = generateQuestions(candidate, 'pastByNor', { objectAxis: { vary: 'nor', fixed: 'zu' } })
        expect(pastQuestions.length).toBeGreaterThan(0)
        pastQuestions.forEach((question) => {
          expect(question.correct).toBe(candidate.conjugations.pastByNor.zu[question.person])
          expect(question.options).toContain(question.correct)
          expect(question.fixedArgument).toEqual({ role: 'nori', person: 'zu' })
        })
      },
    )

    it("resolveObjectAxisTable drills gustatu's presentByNor the same way it drills ukan's presentByObject", () => {
      const gustatu = VERBS.find((v) => v.id === 'gustatu')
      expect(resolveObjectAxisTable(gustatu.conjugations.presentByNor, { vary: 'nor', fixed: 'zu' })).toEqual(
        gustatu.conjugations.presentByNor.zu,
      )
      expect(resolveObjectAxisTable(gustatu.conjugations.presentByNor, { vary: 'nor', fixed: 'zu' })).toEqual({
        ni: 'gustatzen natzaizu',
        gu: 'gustatzen gatzaizkizu',
        zuek: 'gustatzen zatzaizkizu',
      })
    })

    it('overrides fixedArgument.role to nori (not the previously-hardcoded nork) for a NOR-NORI objectAxis verb', () => {
      const gustatu = VERBS.find((v) => v.id === 'gustatu')
      generateQuestions(gustatu, 'presentByNor', { objectAxis: { vary: 'nor', fixed: 'hura' } }).forEach((question) => {
        expect(question.fixedArgument).toEqual({ role: 'nori', person: 'hura' })
      })
    })

    it('does not crash when verbs (sibling list) is passed alongside a NOR-NORI objectAxis (#350-style regression)', () => {
      const gustatu = VERBS.find((v) => v.id === 'gustatu')
      for (const tense of ['presentByNor', 'pastByNor']) {
        expect(() =>
          generateQuestions(gustatu, tense, { objectAxis: { vary: 'nor', fixed: 'zu' }, verbs: VERBS }),
        ).not.toThrow()
      }
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

  describe('with extraCandidates', () => {
    it('can surface an extra candidate as a distractor without breaking option invariants', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const extraCandidates = { ni: ['nago'], hi: ['hago'], hura: ['dago'], gu: ['gaude'], zuek: ['zaudete'], haiek: ['daude'] }
      const questions = generateQuestions(verb, 'present', { extraCandidates })

      questions.forEach((question) => {
        expect(question.options).toContain(question.correct)
        expect(new Set(question.options).size).toBe(question.options.length)
        expect(question.options.length).toBeLessThanOrEqual(4)
      })
    })

    it('never duplicates an option when an extra candidate matches an existing distractor', () => {
      // `naiz`/`da` are already present as `verb.conjugations.present` forms
      // for `ni`/`hura` — offering them again as "extra" candidates for other
      // persons must not produce duplicate options.
      const extraCandidates = { hi: ['naiz', 'da'], gu: ['naiz'], zuek: ['da'], haiek: ['naiz'] }
      const questions = generateQuestions(verb, 'present', { extraCandidates })

      questions.forEach((question) => {
        expect(new Set(question.options).size).toBe(question.options.length)
        expect(question.options).toContain(question.correct)
      })
    })

    it('never includes a cross-verb candidate in kind: "form" questions', () => {
      // `verb` has no sentences, so every question is `kind: 'form'` — a bare
      // "which form is correct?" question with no sentence to make a sibling
      // verb's same-person form (e.g. `egon`'s `gaude`/`dago`) read as wrong.
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const extraCandidates = { ni: ['nago'], hi: ['hago'], hura: ['dago'], gu: ['gaude'], zuek: ['zaudete'], haiek: ['daude'] }
      const questions = generateQuestions(verb, 'present', { extraCandidates })

      questions.forEach((question) => {
        expect(question.kind).toBe('form')
        question.options.forEach((option) => {
          expect(Object.values(verb.conjugations.present)).toContain(option)
        })
      })
    })

    it('ignores extra candidates for pronoun questions', () => {
      const verbWithPronouns = {
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
      // [0, 0.75) / 5 kinds ('sentence','type-verb','spot-error','pronoun','type-pronoun')
      // -> slice 3 (0.45-0.6) is 'pronoun'.
      vi.spyOn(Math, 'random').mockReturnValue(0.5)

      const extraCandidates = { ni: ['nago'], hi: ['hago'], hura: ['dago'], gu: ['gaude'], zuek: ['zaudete'], haiek: ['daude'] }
      generateQuestions(verbWithPronouns, 'present', { extraCandidates }).forEach((question) => {
        if (question.kind === 'pronoun') {
          question.options.forEach((option) => {
            expect(Object.values(verbWithPronouns.pronouns)).toContain(option)
          })
        }
      })
    })
  })

  describe('extraCandidates filtering by a sentence\'s validFor (docs/SENTENCE_FRAMES.md)', () => {
    // `Math.random` mocked to 0: with `availableKinds = ['sentence', 'type-verb']`
    // (or `['negative', 'type-negative']` for the includeNegation cases), the
    // first roll always lands on `sentence`/`negative` — see `rollQuestionKind`.
    // With `persons: ['ni']`, `ni` is the only person in the table, so the
    // extra candidate (`egon`'s `nago`) is the *only* possible distractor —
    // whether it appears is fully determined by `filterExtraCandidates`, not
    // by chance.
    const extraCandidates = { ni: [{ verbId: 'egon', form: 'nago' }] }

    it('validFor: [] (vetted) lets the extra candidate appear as a distractor', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const verbWithSentence = { ...verb, sentences: { present: { ni: { text: 'Ni irakaslea ___.', validFor: [] } } } }

      const [question] = generateQuestions(verbWithSentence, 'present', { extraCandidates, persons: ['ni'] })

      expect(question.kind).toBe('sentence')
      expect(question.options).toContain('nago')
    })

    it('validFor listing the sibling excludes it from the distractor pool', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const verbWithSentence = { ...verb, sentences: { present: { ni: { text: 'Ni irakaslea ___.', validFor: ['egon'] } } } }

      const [question] = generateQuestions(verbWithSentence, 'present', { extraCandidates, persons: ['ni'] })

      expect(question.kind).toBe('sentence')
      expect(question.options).not.toContain('nago')
    })

    it('an untagged (bare string) sentence excludes the extra candidate (safe default)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const verbWithSentence = { ...verb, sentences: { present: { ni: 'Ni irakaslea ___.' } } }

      const [question] = generateQuestions(verbWithSentence, 'present', { extraCandidates, persons: ['ni'] })

      expect(question.kind).toBe('sentence')
      expect(question.options).not.toContain('nago')
    })

    it('validFor: [] (vetted) lets the extra candidate appear as a distractor for `negative` questions', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const verbWithNegative = { ...verb, negativeSentences: { present: { ni: { text: 'Ni ez ___ irakaslea.', validFor: [] } } } }

      const [question] = generateQuestions(verbWithNegative, 'present', { extraCandidates, persons: ['ni'], includeNegation: true })

      expect(question.kind).toBe('negative')
      expect(question.options).toContain('nago')
    })

    it('validFor listing the sibling excludes it from `negative` questions\' distractor pool', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const verbWithNegative = { ...verb, negativeSentences: { present: { ni: { text: 'Ni ez ___ irakaslea.', validFor: ['egon'] } } } }

      const [question] = generateQuestions(verbWithNegative, 'present', { extraCandidates, persons: ['ni'], includeNegation: true })

      expect(question.kind).toBe('negative')
      expect(question.options).not.toContain('nago')
    })

    it('an untagged (bare string) `negative` sentence excludes the extra candidate (safe default)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const verbWithNegative = { ...verb, negativeSentences: { present: { ni: 'Ni ez ___ irakaslea.' } } }

      const [question] = generateQuestions(verbWithNegative, 'present', { extraCandidates, persons: ['ni'], includeNegation: true })

      expect(question.kind).toBe('negative')
      expect(question.options).not.toContain('nago')
    })
  })

  describe('with verbs (ambiguous typed forms)', () => {
    // Mirrors `nahi`/`ukan`: `nahi dut` rides `ukan`'s `dut` for `ni`, so
    // "Nik liburu bat ___." could be typed as either "nahi dut" (intended) or
    // "dut" (a different but equally grammatical sentence, "I have a book").
    const compoundVerb = {
      id: 'compound',
      agreement: ['nor', 'nork'],
      conjugations: {
        present: { ni: 'nahi dut', zu: 'nahi duzu', hura: 'nahi du' },
      },
      sentences: {
        present: {
          ni: 'Nik liburu bat ___.',
          zu: 'Zuk liburu bat ___?',
          hura: 'Hark liburu bat ___.',
        },
      },
      negativeSentences: {
        present: {
          ni: 'Nik ez ___ liburu bat.',
        },
      },
    }
    const auxiliaryVerb = {
      id: 'auxiliary',
      agreement: ['nor', 'nork'],
      conjugations: {
        present: { ni: 'dut', zu: 'duzu', hura: 'du' },
      },
    }
    const incompatibleVerb = {
      id: 'incompatible',
      agreement: ['nor'],
      conjugations: {
        present: { ni: 'naiz', zu: 'zara', hura: 'da' },
      },
    }

    it('never offers type-verb for a person whose compound form\'s trailing word matches an agreement-compatible verb', () => {
      const verbs = [compoundVerb, auxiliaryVerb]
      for (let roll = 0; roll < 1; roll += 0.05) {
        vi.spyOn(Math, 'random').mockReturnValue(roll)
        generateQuestions(compoundVerb, 'present', { verbs }).forEach((question) => {
          expect(question.kind).not.toBe('type-verb')
        })
        vi.restoreAllMocks()
      }
    })

    it('never offers type-negative for an ambiguous person, even with includeNegation', () => {
      const verbs = [compoundVerb, auxiliaryVerb]
      for (let roll = 0; roll < 1; roll += 0.05) {
        vi.spyOn(Math, 'random').mockReturnValue(roll)
        generateQuestions(compoundVerb, 'present', { verbs, includeNegation: true }).forEach((question) => {
          expect(question.kind).not.toBe('type-negative')
        })
        vi.restoreAllMocks()
      }
    })

    it('still allows type-verb when the trailing word only matches an agreement-incompatible verb', () => {
      // [0, 0.75) / 3 kinds ('sentence', 'type-verb', 'word-order') -> slice 1 (0.25-0.5) is 'type-verb'.
      vi.spyOn(Math, 'random').mockReturnValue(0.3)

      const questions = generateQuestions(compoundVerb, 'present', { verbs: [compoundVerb, incompatibleVerb] })

      expect(questions.some((question) => question.kind === 'type-verb')).toBe(true)
    })

    it('still allows type-verb when verbs is not provided (default, unaffected)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.3)

      const questions = generateQuestions(compoundVerb, 'present')

      expect(questions.some((question) => question.kind === 'type-verb')).toBe(true)
    })

    // Regression test for the real `nahi`/`ukan` collision: `nahi`'s present
    // forms (`nahi dut`/`nahi duzu`/`nahi du`) are `'nahi ' + ukan`'s present
    // forms (`dut`/`duzu`/`du`), so e.g. "Nik liburu bat ___." can be typed as
    // either "nahi dut" (intended, "I want a book") or "dut" (also correct
    // Basque, but "I have a book") — a `type-verb` question there has no way
    // to tell the learner which is wanted.
    it('never offers type-verb for nahi-present when generated with the real VERBS list', () => {
      const nahi = VERBS.find((v) => v.id === 'nahi')
      for (let roll = 0; roll < 1; roll += 0.05) {
        vi.spyOn(Math, 'random').mockReturnValue(roll)
        generateQuestions(nahi, 'present', { verbs: VERBS, rounds: 2 }).forEach((question) => {
          expect(question.kind).not.toBe('type-verb')
        })
        vi.restoreAllMocks()
      }
    })
  })

  describe('with verbs (small-table distractor/spot-error borrowing, #139)', () => {
    // Mirrors `nahi`/`jakin`: a 3-person present table can't supply 3
    // distractors from its own persons alone (`buildOptions`'s own-table
    // pool is just the other 2 persons' forms). `siblingVerb` is
    // `agreementsCompatible` (both `nor-nork`) and has a 4th person (`gu`)
    // beyond `smallVerb`'s `ni`/`zu`/`hura`, so it can top up both the
    // distractor pool (`getBorrowedDistractors`) and, via its own sentenced
    // `gu`, the spot-error slot pool (`getBorrowedSpotErrorSlots`).
    // #227/[B2]: borrowed forms are now also narrowed by `validFor` (see
    // `filterExtraCandidates`), and an untagged (plain-string) sentence's
    // implicit `validFor: undefined` excludes *every* sibling, including
    // borrowed ones — these sentences are explicitly tagged `validFor: []`
    // (vetted, excludes nothing) so this describe block still exercises
    // #139's borrowing behaviour rather than #227's exclusion-by-default.
    const smallVerb = {
      id: 'small',
      agreement: ['nor', 'nork'],
      conjugations: {
        present: { ni: 'dut', zu: 'duzu', hura: 'du' },
      },
      sentences: {
        present: {
          ni: { text: 'Nik liburua ___.', validFor: [] },
          zu: { text: 'Zuk liburua ___.', validFor: [] },
          hura: { text: 'Hark liburua ___.', validFor: [] },
        },
      },
    }
    const siblingVerb = {
      id: 'sibling',
      agreement: ['nor', 'nork'],
      conjugations: {
        present: { ni: 'dakit', zu: 'dakizu', hura: 'daki', gu: 'dakigu' },
      },
      sentences: {
        present: {
          ni: { text: 'Nik egia ___.', validFor: [] },
          gu: { text: 'Guk egia ___.', validFor: [] },
        },
      },
    }
    // `agreement: ['nor', 'nori']` (rather than plain `['nor']`) makes this
    // sibling genuinely unrelated to `smallVerb` (`['nor', 'nork']`) on both
    // axes — neither `agreementsCompatible` (the `nork` axis differs) nor
    // #141's case-frame-inverse (the `nori` axis also differs), so it can't
    // surface via either the general borrowing here or the case-frame lure.
    const incompatibleSibling = {
      id: 'incompatible',
      agreement: ['nor', 'nori'],
      conjugations: {
        present: { ni: 'naiz', zu: 'zara', hura: 'da', gu: 'gara' },
      },
      sentences: {
        present: {
          ni: 'Ni irakaslea ___.',
          gu: 'Gu lagunak ___.',
        },
      },
    }

    it('falls back to 3 options for a 3-person table without verbs', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      generateQuestions(smallVerb, 'present').forEach((question) => {
        expect(question.kind).toBe('sentence')
        expect(question.options).toHaveLength(3)
        expect(question.options).toContain(question.correct)
      })
    })

    it('borrows a 4th distractor from an agreement-compatible sibling', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const questions = generateQuestions(smallVerb, 'present', { verbs: [smallVerb, siblingVerb] })

      questions.forEach((question) => {
        expect(question.kind).toBe('sentence')
        expect(question.options).toHaveLength(4)
        expect(new Set(question.options).size).toBe(4)
        expect(question.options).toContain(question.correct)

        const ownForms = Object.values(smallVerb.conjugations.present)
        const borrowed = question.options.filter((option) => !ownForms.includes(option))
        expect(borrowed).toEqual([siblingVerb.conjugations.present[question.person]])
      })
    })

    it('never borrows from an agreement-incompatible sibling', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const questions = generateQuestions(smallVerb, 'present', { verbs: [smallVerb, incompatibleSibling] })

      questions.forEach((question) => {
        expect(question.options).toHaveLength(3)
        question.options.forEach((option) => {
          expect(Object.values(incompatibleSibling.conjugations.present)).not.toContain(option)
        })
      })
    })

    it('does not qualify for spot-error with only its own 3 sentenced persons', () => {
      for (let roll = 0; roll < 1; roll += 0.05) {
        vi.spyOn(Math, 'random').mockReturnValue(roll)
        generateQuestions(smallVerb, 'present').forEach((question) => {
          expect(question.kind).not.toBe('spot-error')
        })
        vi.restoreAllMocks()
      }
    })

    it('still does not qualify for spot-error against an agreement-incompatible sibling', () => {
      for (let roll = 0; roll < 1; roll += 0.05) {
        vi.spyOn(Math, 'random').mockReturnValue(roll)
        generateQuestions(smallVerb, 'present', { verbs: [smallVerb, incompatibleSibling] }).forEach((question) => {
          expect(question.kind).not.toBe('spot-error')
        })
        vi.restoreAllMocks()
      }
    })

    it('qualifies for spot-error by borrowing a sentenced person from a compatible sibling', () => {
      // availableKinds = ['sentence', 'type-verb', 'spot-error'] (no pronouns)
      // -> [0, 0.75) / 3 -> slice 2, [0.5, 0.75), is 'spot-error'.
      vi.spyOn(Math, 'random').mockReturnValue(0.6)

      const questions = generateQuestions(smallVerb, 'present', { verbs: [smallVerb, siblingVerb] })

      questions.forEach((question) => {
        expect(question.kind).toBe('spot-error')
        expect(question.items).toHaveLength(4)

        const persons = question.items.map((item) => item.person)
        expect(new Set(persons).size).toBe(persons.length)
        expect(persons).toContain('gu')

        const guItem = question.items.find((item) => item.person === 'gu')
        expect(guItem.sentence.startsWith('Guk egia ')).toBe(true)
      })
    })
  })

  describe('with the real VERBS list (#139 regression)', () => {
    // `nahi`/`jakin`'s present tables only have 3 persons (`ni`/`zu`/`hura`),
    // so before #139 their `sentence`/`form` questions had only 3 options
    // (correct + 2 distractors) instead of the usual 4 — borrowing from a
    // compatible sibling (`ukan`'s `dut`/`dakit`-family forms) fills the 4th.
    it('gives nahi (3-person present table) a 4th option by borrowing from a compatible sibling', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const nahi = VERBS.find((v) => v.id === 'nahi')
      generateQuestions(nahi, 'present', { verbs: VERBS }).forEach((question) => {
        expect(question.kind).toBe('sentence')
        expect(question.options).toHaveLength(4)
        expect(new Set(question.options).size).toBe(4)
        expect(question.options).toContain(question.correct)
      })
    })

    it('gives jakin (3-person present table) a 4th option by borrowing from a compatible sibling', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const jakin = VERBS.find((v) => v.id === 'jakin')
      // #167 added `hi-m`/`hi-f` to this table (no sentence data for them,
      // since they're covered by their own dedicated review lesson) —
      // restrict to the original 3 persons this test is about.
      generateQuestions(jakin, 'present', { verbs: VERBS, persons: ['ni', 'zu', 'hura'] }).forEach((question) => {
        expect(question.kind).toBe('sentence')
        expect(question.options).toHaveLength(4)
        expect(new Set(question.options).size).toBe(4)
        expect(question.options).toContain(question.correct)
      })
    })
  })

  describe('the grounding invariant for kind: "form" questions (#174/#200/#203, unified by [B2]/#227)', () => {
    // `smallVerb` has no sentences, so every question is `kind: 'form'` — a
    // bare "which form is correct?" question with no sentence to make a
    // sibling verb's same-person form read as wrong. `sibling` shares
    // `smallVerb`'s gloss closely enough (both "to be") that surfacing its
    // form would make the question genuinely ambiguous, exactly like the
    // `izan`/`egon` repro in #174. #227 retired the old `sources`/`review`-
    // based scoping in favour of one rule: a `kind: 'form'` question is
    // never grounded (no sentence, no visible verb name), so it never
    // borrows another verb's form at all, regardless of `sources`/`review`.
    const smallVerb = {
      id: 'small',
      agreement: ['nor'],
      conjugations: { present: { ni: 'naiz', zu: 'zara', hura: 'da' } },
    }
    const sibling = {
      id: 'sibling',
      agreement: ['nor'],
      conjugations: { present: { ni: 'nago', zu: 'zaude', hura: 'dago', gu: 'gaude', zuek: 'zaudete', haiek: 'daude' } },
    }
    const otherSibling = {
      id: 'other-sibling',
      agreement: ['nor'],
      conjugations: { present: { ni: 'noa', zu: 'zoaz', hura: 'doa', gu: 'goaz', zuek: 'zoazte', haiek: 'doaz' } },
    }

    it('never borrows for `kind: "form"`, even with no `sources`/`review` at all (#139\'s small-table top-up no longer applies to bare form questions)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const questions = generateQuestions(smallVerb, 'present', { verbs: [smallVerb, sibling] })

      questions.forEach((question) => {
        expect(question.kind).toBe('form')
        expect(question.options.length).toBe(Object.values(smallVerb.conjugations.present).length)
        question.options.forEach((option) => {
          expect(Object.values(sibling.conjugations.present)).not.toContain(option)
        })
      })
    })

    it('never borrows for `kind: "form"`, even from a sibling that is one of the 2+ declared `sources` (#200)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const questions = generateQuestions(smallVerb, 'present', {
        verbs: [smallVerb, sibling, otherSibling],
        sources: [
          { verbId: 'small', tense: 'present' },
          { verbId: 'sibling', tense: 'present' },
        ],
      })

      questions.forEach((question) => {
        expect(question.kind).toBe('form')
        expect(question.options.length).toBe(Object.values(smallVerb.conjugations.present).length)
        question.options.forEach((option) => {
          expect(Object.values(sibling.conjugations.present)).not.toContain(option)
          expect(Object.values(otherSibling.conjugations.present)).not.toContain(option)
        })
      })
    })

    it('never leaks an unanchored case-frame lure into a single-source review\'s bare `kind: "form"` question (#203)', () => {
      // Mirrors the `ikusi-present-plural-review` repro: a NOR-NORK verb's
      // case-frame lure (a NOR sibling's same-person form, normally a safe
      // "wrong subject case" distractor when a sentence shows the marking)
      // must not leak into a bare `form` question with no sentence to make
      // it read as wrong.
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const norSibling = {
        id: 'nor-sibling',
        agreement: ['nor'],
        conjugations: { present: { ni: 'naiz', zu: 'zara', hura: 'da', gu: 'gara', zuek: 'zarete', haiek: 'dira' } },
      }
      const norNorkVerb = {
        id: 'nor-nork-verb',
        agreement: ['nor', 'nork'],
        conjugations: {
          present: { ni: 'dut-form', zu: 'duzu-form', hura: 'du-form', gu: 'dugu-form', zuek: 'duzue-form', haiek: 'dute-form' },
        },
      }

      const questions = generateQuestions(norNorkVerb, 'present', {
        verbs: [norSibling, norNorkVerb],
        sources: [{ verbId: 'nor-nork-verb', tense: 'present' }],
        review: true,
      })

      questions.forEach((question) => {
        expect(question.kind).toBe('form')
        question.options.forEach((option) => {
          expect(Object.values(norSibling.conjugations.present)).not.toContain(option)
        })
      })
    })

    it('`buildTaggedOptions` with `grounded: false` never includes a sibling or lure form', () => {
      const threePersonTable = { ni: 'naiz', hi: 'haiz', hura: 'da' }
      const { distractors } = buildTaggedOptions(threePersonTable, ['ni', 'hi', 'hura'], 'ni', ['nago'], ['dut'], ['gara'], false)
      expect(distractors.every((candidate) => candidate.source === 'same-table')).toBe(true)
    })
  })

  describe('the `validFor` grounding rule applies to borrowed forms too ([B2]/#227)', () => {
    // Before #227, a `sentence`/`negative` question's `borrowed` pool
    // (`getBorrowedDistractors`) bypassed `validFor` filtering entirely —
    // only `extraCandidates` was narrowed by `filterExtraCandidates`. A
    // sibling whose form is borrowed *and* also genuinely fits the sentence
    // (i.e. is listed in the sentence's `validFor`) must still be excluded.
    const verbWithSentence = {
      id: 'host',
      agreement: ['nor'],
      conjugations: { present: { ni: 'naiz', zu: 'zara', hura: 'da' } },
      sentences: { present: { ni: { text: 'Ni ___.', validFor: ['sibling'] } } },
    }
    const groundingSibling = {
      id: 'sibling',
      agreement: ['nor'],
      conjugations: { present: { ni: 'sibling-form', zu: 'sibling-zu', hura: 'sibling-hura' } },
    }

    it('excludes a borrowed sibling form once that sibling is listed in the sentence\'s `validFor`', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const questions = generateQuestions(verbWithSentence, 'present', {
        verbs: [verbWithSentence, groundingSibling],
      })

      questions.forEach((question) => {
        if (question.kind !== 'sentence') return
        expect(question.options).not.toContain('sibling-form')
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
      // ['negative', 'type-negative', 'word-order'] split [0, 0.75) into three
      // slices of 0.25 — 0.3 lands in the second one: 'type-negative'.
      vi.spyOn(Math, 'random').mockReturnValue(0.3)

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

    it('only offers negative, type-negative, or word-order for a person with negativeSentences data, never the usual mix', () => {
      ;[0, 0.2, 0.5, 0.7].forEach((roll) => {
        vi.spyOn(Math, 'random').mockReturnValue(roll)

        generateQuestions(verbWithNegation, 'present', { includeNegation: true }).forEach((question) => {
          if (negated[question.person]) {
            expect(['negative', 'type-negative', 'word-order']).toContain(question.kind)
          }
        })
      })
    })

    it('excludes type-negative when noTyping is set, even on rolls that would otherwise favour it', () => {
      // word-order stays available under noTyping — it's tap-based, not typed.
      ;[0, 0.5, 0.7].forEach((roll) => {
        vi.spyOn(Math, 'random').mockReturnValue(roll)

        generateQuestions(verbWithNegation, 'present', { includeNegation: true, noTyping: true }).forEach((question) => {
          expect(question.kind).not.toBe('type-negative')
          if (negated[question.person] && question.kind !== 'form') {
            expect(['negative', 'word-order']).toContain(question.kind)
          }
        })
      })
    })

    it('excludes type-negative when mode is "recognition", even on rolls that would otherwise favour it (#140)', () => {
      // word-order stays available under recognition mode — it's tap-based, not typed.
      ;[0, 0.5, 0.7].forEach((roll) => {
        vi.spyOn(Math, 'random').mockReturnValue(roll)

        generateQuestions(verbWithNegation, 'present', { includeNegation: true, mode: 'recognition' }).forEach((question) => {
          expect(question.kind).not.toBe('type-negative')
          if (negated[question.person] && question.kind !== 'form') {
            expect(['negative', 'word-order']).toContain(question.kind)
          }
        })
      })
    })

    it('never produces negative, type-negative, or word-order questions without includeNegation, even with negativeSentences data present', () => {
      ;[0, 0.2, 0.5, 0.7, 0.99].forEach((roll) => {
        vi.spyOn(Math, 'random').mockReturnValue(roll)

        generateQuestions(verbWithNegation, 'present').forEach((question) => {
          expect(['negative', 'type-negative', 'word-order']).not.toContain(question.kind)
        })
      })
    })

    it('never falls back to "form" on a repeat roll for a person with negativeSentences data, even across rounds (#200)', () => {
      // A pinned roll of 0 always lands on the first availableKinds slice
      // ('negative'), so the second round's repeat-roll fallback kicks in for
      // every person with negativeSentences data. Pre-#200, that fallback
      // unconditionally re-added 'form' to the candidate pool, letting a bare
      // form question bypass includeNegation's intended negative framing.
      vi.spyOn(Math, 'random').mockReturnValue(0)

      generateQuestions(verbWithNegation, 'present', { includeNegation: true, rounds: 2 }).forEach((question) => {
        if (negated[question.person]) {
          expect(['negative', 'type-negative', 'word-order']).toContain(question.kind)
        }
      })
    })
  })

  describe('word-order questions', () => {
    const wordOrderVerb = {
      ...verb,
      sentences: {
        present: { ni: 'Ni gaur hemen ___.' },
      },
    }
    const duplicateWordVerb = {
      ...verb,
      sentences: {
        present: { ni: 'Ni oso oso ___.' },
      },
    }
    const tooShortVerb = {
      ...verb,
      sentences: {
        present: { ni: 'Ni irakaslea ___.' },
      },
    }
    const wordOrderNegationVerb = {
      ...verb,
      negativeSentences: {
        present: { ni: 'Ni ez ___ irakaslea.' },
      },
    }
    const wordOrderQuestionVerb = {
      ...verb,
      sentences: {
        present: { ni: 'Ni gaur hemen ___?' },
      },
    }

    it('builds a token cloud with one token per word, in shuffled (not necessarily source) order', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.6)

      const [question] = generateQuestions(wordOrderVerb, 'present', { persons: ['ni'] })

      expect(question.kind).toBe('word-order')
      expect(question.tokens).toHaveLength(4)
      expect(question.tokens.map((token) => token.text).sort()).toEqual(['Ni', 'gaur', 'hemen', 'naiz'].sort())
      expect(question.punctuation).toBe('.')
    })

    it('strips a trailing "?" the same way as "." and exposes it as `punctuation`', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.6)

      const [question] = generateQuestions(wordOrderQuestionVerb, 'present', { persons: ['ni'] })

      expect(question.kind).toBe('word-order')
      expect(question.tokens.map((token) => token.text).sort()).toEqual(['Ni', 'gaur', 'hemen', 'naiz'].sort())
      expect(question.correct).toBe('Ni gaur hemen naiz')
      expect(question.punctuation).toBe('?')
    })

    it('keeps duplicate-word tokens distinguishable via a stable, unique id', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.6)

      const [question] = generateQuestions(duplicateWordVerb, 'present', { persons: ['ni'] })

      expect(question.kind).toBe('word-order')
      const ids = question.tokens.map((token) => token.id)
      expect(new Set(ids).size).toBe(ids.length)
      const reassembled = [...question.tokens].sort((a, b) => a.id - b.id).map((token) => token.text)
      expect(reassembled.join(' ')).toBe(question.correct)
    })

    it('sets `correct` to the exact filled sentence text', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.6)

      const [question] = generateQuestions(wordOrderVerb, 'present', { persons: ['ni'] })

      expect(question.correct).toBe('Ni gaur hemen naiz')
    })

    it('builds a word-order question from a negative sentence, with the fronted auxiliary in the right slot', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.6)

      const [question] = generateQuestions(wordOrderNegationVerb, 'present', { includeNegation: true, persons: ['ni'] })

      expect(question.kind).toBe('word-order')
      expect(question.correct).toBe('Ni ez naiz irakaslea')
      const reassembled = [...question.tokens].sort((a, b) => a.id - b.id).map((token) => token.text)
      expect(reassembled).toEqual(['Ni', 'ez', 'naiz', 'irakaslea'])
    })

    it(`never offers word-order for a sentence below the ${WORD_ORDER_MIN_WORDS}-word minimum, regardless of roll`, () => {
      for (let roll = 0; roll < 1; roll += 0.05) {
        vi.spyOn(Math, 'random').mockReturnValue(roll)
        generateQuestions(tooShortVerb, 'present', { persons: ['ni'] }).forEach((question) => {
          expect(question.kind).not.toBe('word-order')
        })
        vi.restoreAllMocks()
      }
    })

    it(`never offers word-order for a sentence above the ${WORD_ORDER_MAX_WORDS}-word maximum, regardless of roll (#315)`, () => {
      const tooLongVerb = {
        ...verb,
        sentences: {
          present: { ni: 'Ni gaur goizean lagunekin oinez joan nintzen herriko plazara ___.' },
        },
      }
      for (let roll = 0; roll < 1; roll += 0.05) {
        vi.spyOn(Math, 'random').mockReturnValue(roll)
        generateQuestions(tooLongVerb, 'present', { persons: ['ni'] }).forEach((question) => {
          expect(question.kind).not.toBe('word-order')
        })
        vi.restoreAllMocks()
      }
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

  describe('with mode: "recognition" (#140)', () => {
    // `verbWithBoth` (defined above) has all five special framings on offer
    // — `['sentence', 'type-verb', 'spot-error', 'pronoun', 'type-pronoun']`
    // — without `mode`, so it's the clearest fixture for checking which of
    // those `mode: 'recognition'` drops.
    it('never produces a typed/production framing, on any roll', () => {
      for (let roll = 0; roll < 1; roll += 0.05) {
        vi.spyOn(Math, 'random').mockReturnValue(roll)

        generateQuestions(verbWithBoth, 'present', { mode: 'recognition' }).forEach((question) => {
          expect(['type-verb', 'type-pronoun', 'type-negative']).not.toContain(question.kind)
        })
        vi.restoreAllMocks()
      }
    })

    it('still allows spot-error, unlike noTyping', () => {
      // With `type-verb`/`type-pronoun` excluded, availableKinds becomes
      // ['sentence', 'spot-error', 'pronoun'] -> [0, 0.75) / 3 -> slice 1,
      // [0.25, 0.5), is 'spot-error'.
      vi.spyOn(Math, 'random').mockReturnValue(0.3)

      const kinds = generateQuestions(verbWithBoth, 'present', { mode: 'recognition' }).map((q) => q.kind)

      expect(kinds).toContain('spot-error')
    })

    it('still produces sentence/pronoun multiple-choice framings, not just the bare form', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const questions = generateQuestions(verbWithBoth, 'present', { mode: 'recognition' })

      expect(questions.map((q) => q.kind)).toContain('sentence')
      questions.forEach((question) => {
        expect(['form', 'sentence', 'spot-error', 'pronoun']).toContain(question.kind)
        if (question.kind !== 'form' && question.kind !== 'spot-error') expect(question).toHaveProperty('options')
      })
    })

    it('produces the same kinds as the default when left unset (regression)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.6)

      const withoutMode = generateQuestions(verbWithBoth, 'present').map((q) => q.kind)
      vi.spyOn(Math, 'random').mockReturnValue(0.6)
      const withUndefinedMode = generateQuestions(verbWithBoth, 'present', { mode: undefined }).map((q) => q.kind)

      expect(withUndefinedMode).toEqual(withoutMode)
      expect(withoutMode).toContain('type-pronoun')
    })
  })

  describe('with verb.recognitionOnly (#330)', () => {
    // A per-carrier flag for a rare verb sampled into an otherwise-typed
    // conjugation pool (see `CARRIERS_PER_SESSION` in `App.jsx`) — unlike
    // lesson-level `mode: 'recognition'` (which still allows `spot-error`,
    // tested above), a `recognitionOnly` carrier gets no production-adjacent
    // framing at all, since there's no per-lesson "recognition tier" left for
    // it to belong to once it's just one carrier among others.
    const recognitionOnlyVerb = { ...verbWithBoth, recognitionOnly: true }

    it('never produces a typed/production framing, on any roll', () => {
      for (let roll = 0; roll < 1; roll += 0.05) {
        vi.spyOn(Math, 'random').mockReturnValue(roll)

        generateQuestions(recognitionOnlyVerb, 'present').forEach((question) => {
          expect(['type-verb', 'type-pronoun', 'type-negative']).not.toContain(question.kind)
        })
        vi.restoreAllMocks()
      }
    })

    it('never produces spot-error either, unlike mode: "recognition"', () => {
      // Same roll `verbWithBoth` lands on 'spot-error' with at line ~1765.
      vi.spyOn(Math, 'random').mockReturnValue(0.3)

      const kinds = generateQuestions(recognitionOnlyVerb, 'present').map((q) => q.kind)

      expect(kinds).not.toContain('spot-error')
    })

    it('still produces sentence/pronoun multiple-choice framings, not just the bare form', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const questions = generateQuestions(recognitionOnlyVerb, 'present')

      expect(questions.map((q) => q.kind)).toContain('sentence')
      questions.forEach((question) => {
        expect(['form', 'sentence', 'pronoun']).toContain(question.kind)
      })
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

  describe('#141 case-frame/cross-tense lures', () => {
    const izan = VERBS.find((v) => v.id === 'izan')
    const ukan = VERBS.find((v) => v.id === 'ukan')
    const etorri = VERBS.find((v) => v.id === 'etorri')

    describe('getCaseFrameLure/getCaseFramePronounLure/getCrossTenseLure', () => {
      it('finds the case-frame-inverse sibling\'s same-person form (izan <-> ukan)', () => {
        expect(getCaseFrameLure(VERBS, ukan, 'present', 'ni')).toBe('naiz')
        expect(getCaseFrameLure(VERBS, izan, 'present', 'ni')).toBe('dut')
        expect(getCaseFrameLure(VERBS, izan, 'past', 'ni')).toBe('nuen')
      })

      it('finds the case-frame-inverse sibling\'s declined pronoun', () => {
        expect(getCaseFramePronounLure(VERBS, izan, 'ni')).toBe('Nik')
        expect(getCaseFramePronounLure(VERBS, ukan, 'ni')).toBe('Ni')
      })

      it('returns undefined without a `verbs` list', () => {
        expect(getCaseFrameLure(undefined, izan, 'present', 'ni')).toBeUndefined()
      })

      // #165: generalized beyond izan/ukan — a NOR-NORI verb's case-frame-
      // inverse sibling is the first NOR-NORI-NORK verb (same `nori` status,
      // opposite `nork` status), and vice versa.
      it('finds the case-frame-inverse sibling across NOR-NORI <-> NOR-NORI-NORK (gustatu <-> esan)', () => {
        const gustatu = VERBS.find((v) => v.id === 'gustatu')
        const esan = VERBS.find((v) => v.id === 'esan')
        expect(getCaseFrameLure(VERBS, gustatu, 'present', 'ni')).toBe('esaten diot')
        expect(getCaseFrameLure(VERBS, esan, 'present', 'ni')).toBe('gustatzen zait')
      })

      it('returns the verb\'s own present-tense form for past tense, and undefined otherwise', () => {
        expect(getCrossTenseLure(izan, 'past', 'ni')).toBe('naiz')
        expect(getCrossTenseLure(izan, 'present', 'ni')).toBeUndefined()
      })

      it('returns the verb\'s own plural-object form for the same tense/person, or undefined with no such table', () => {
        const gustatu = VERBS.find((v) => v.id === 'gustatu')
        const esan = VERBS.find((v) => v.id === 'esan')
        expect(getObjectNumberLure(gustatu, 'present', 'ni')).toBe('gustatzen zaizkit')
        expect(getObjectNumberLure(esan, 'present', 'ni')).toBe('esaten dizkiot')
        expect(getObjectNumberLure(izan, 'present', 'ni')).toBeUndefined()
      })
    })

    // #283: the present-perfect <-> simple-past "recency contrast" lure
    // (`etorri naiz` vs. `etorri nintzen`) — distinct from `getCrossTenseLure`
    // above, which only covers past <-> present.
    describe('getRecencyContrastLure', () => {
      const etorri = VERBS.find((v) => v.id === 'etorri')
      const ikusi = VERBS.find((v) => v.id === 'ikusi')

      it('returns the past form for a presentPerfect question, and vice versa', () => {
        expect(getRecencyContrastLure(etorri, 'presentPerfect', 'ni')).toBe(etorri.conjugations.past.ni)
        expect(getRecencyContrastLure(etorri, 'past', 'ni')).toBe(etorri.conjugations.presentPerfect.ni)
        expect(getRecencyContrastLure(ikusi, 'presentPerfect', 'hura')).toBe(ikusi.conjugations.past.hura)
        expect(getRecencyContrastLure(ikusi, 'past', 'hura')).toBe(ikusi.conjugations.presentPerfect.hura)
        expect(getRecencyContrastLure(izan, 'past', 'ni')).toBe(izan.conjugations.presentPerfect.ni)
      })

      it('returns undefined for any tense but presentPerfect/past, or without a table for the other tense', () => {
        expect(getRecencyContrastLure(etorri, 'present', 'ni')).toBeUndefined()
        const ukan = VERBS.find((v) => v.id === 'ukan')
        expect(getRecencyContrastLure(ukan, 'past', 'ni')).toBeUndefined()
      })
    })

    // #293: the "dative overgeneration" lure — a `dativeOvergeneration`-flagged
    // NOR-NORK verb's own participle paired with a NOR-NORI-NORK sibling's
    // auxiliary (`eramango diot` alongside the correct `eramango dut`).
    describe('getDativeOvergenerationLure', () => {
      const eraman = VERBS.find((v) => v.id === 'eraman')
      const jan = VERBS.find((v) => v.id === 'jan')

      it('swaps the participle\'s own auxiliary for the NOR-NORI-NORK sibling\'s (eraman -> esan)', () => {
        expect(getDativeOvergenerationLure(VERBS, eraman, 'future', 'ni')).toBe('eramango diot')
        expect(getDativeOvergenerationLure(VERBS, eraman, 'future', 'haiek')).toBe('eramango diote')
      })

      it('returns undefined for a synthetic (non-periphrastic) form', () => {
        expect(getDativeOvergenerationLure(VERBS, eraman, 'present', 'ni')).toBeUndefined()
      })

      it('returns undefined for a verb not flagged dativeOvergeneration', () => {
        expect(jan.dativeOvergeneration).toBeUndefined()
        expect(getDativeOvergenerationLure(VERBS, jan, 'future', 'ni')).toBeUndefined()
      })

      it('returns undefined without a `verbs` list', () => {
        expect(getDativeOvergenerationLure(undefined, eraman, 'future', 'ni')).toBeUndefined()
      })
    })

    it('offers the case-frame-inverse sibling\'s present form as a NOR-NORK distractor (`naiz` for `dut`)', () => {
      // #227/[B2]: `formLures` (incl. the case-frame lure) are only grounded
      // for kinds with a sentence/verb name to anchor them — a bare `form`
      // question never gets one (see the grounding-invariant describe block
      // below), so this now exercises the `sentence` kind instead.
      vi.spyOn(Math, 'random').mockReturnValue(0) // -> 'sentence' (first available kind)

      const question = generateQuestions(ukan, 'present', { verbs: VERBS }).find((q) => q.person === 'ni')

      expect(question.kind).toBe('sentence')
      expect(question.options).toContain('naiz')
      // [C2]/#229: the lure carries its `errorType` through to `optionRationale`
      // so it can be explained after the fact if picked.
      expect(question.optionRationale.naiz).toEqual({ errorType: 'case-frame', whyKey: 'lureRationaleCaseFrame' })
    })

    it('offers cross-pool aux and own-present-tense forms as past-tense distractors (`nuen`/`naiz` for `nintzen`)', () => {
      // No verb currently has past-tense `sentences`, so this lure can't be
      // exercised through real data's `past` tense (#227/[B2]: it would
      // never reach a learner there anyway, since an ungrounded `form`
      // question can't show it) — a small synthetic verb pair with past
      // sentence data stands in instead.
      vi.spyOn(Math, 'random').mockReturnValue(0) // -> 'sentence' (first available kind)

      const norVerb = {
        id: 'past-nor',
        agreement: ['nor'],
        conjugations: { present: { ni: 'a-present' }, past: { ni: 'a-past' } },
        sentences: { past: { ni: { text: 'Nor past ___.', validFor: [] } } },
      }
      const norNorkVerb = {
        id: 'past-nor-nork',
        agreement: ['nor', 'nork'],
        conjugations: { past: { ni: 'b-past' } },
      }

      const question = generateQuestions(norVerb, 'past', { verbs: [norVerb, norNorkVerb], persons: ['ni'] }).find((q) => q.person === 'ni')

      expect(question.kind).toBe('sentence')
      expect(question.correct).toBe('a-past')
      expect(question.options).toContain('b-past')
      expect(question.options).toContain('a-present')
    })

    // #283: Unit 11's recency-contrast lure — `etorri`/`ikusi` both have real
    // `presentPerfect` *and* `past` sentence data (gaur/atzo framed, see
    // verbs.js), so this exercises `getRecencyContrastLure` end-to-end rather
    // than through a synthetic verb pair.
    it('offers the past-tense sibling form as a presentPerfect distractor, and vice versa (`etorri zen`/`etorri da`)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0) // -> 'sentence' (first available kind)

      const presentPerfectQuestion = generateQuestions(etorri, 'presentPerfect', { verbs: VERBS, persons: ['ni'] }).find(
        (q) => q.person === 'ni',
      )
      expect(presentPerfectQuestion.kind).toBe('sentence')
      expect(presentPerfectQuestion.correct).toBe(etorri.conjugations.presentPerfect.ni)
      expect(presentPerfectQuestion.options).toContain(etorri.conjugations.past.ni)
      expect(presentPerfectQuestion.optionRationale[etorri.conjugations.past.ni]).toEqual({
        errorType: 'tense',
        whyKey: 'lureRationaleTense',
      })

      const pastQuestion = generateQuestions(etorri, 'past', { verbs: VERBS, persons: ['ni'] }).find((q) => q.person === 'ni')
      expect(pastQuestion.kind).toBe('sentence')
      expect(pastQuestion.correct).toBe(etorri.conjugations.past.ni)
      expect(pastQuestion.options).toContain(etorri.conjugations.presentPerfect.ni)
    })

    it('offers the case-frame-inverse sibling\'s pronoun as a distractor (`Nik` for `Ni`)', () => {
      // [0, 0.75) / 5 kinds ('sentence','type-verb','spot-error','pronoun','type-pronoun')
      // -> slice 3 (0.45-0.6) is 'pronoun'.
      vi.spyOn(Math, 'random').mockReturnValue(0.5)

      const question = generateQuestions(izan, 'present', { verbs: VERBS }).find((q) => q.person === 'ni')

      expect(question.kind).toBe('pronoun')
      expect(question.options).toContain('Nik')
    })

    it('does not add a case-frame lure for NOR present (no `nork`, present tense)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99) // -> 'form' (no special framing)

      const question = generateQuestions(izan, 'present', { verbs: VERBS }).find((q) => q.person === 'ni')

      expect(question.kind).toBe('form')
      expect(question.options).not.toContain('dut')
    })
  })

  // #165: extends #141's matrix to NOR-NORI (gustatu/iruditu/ahaztu) and
  // NOR-NORI-NORK (esan/eman) using #164/#162's plural-object fodder — the
  // case-frame lure generalizes to this pair (`gustatzen zait` <->
  // `esaten diot`), and a new `getObjectNumberLure` offers each verb's own
  // plural-object form as a "wrong object number" distractor.
  describe('#165 NOR-NORI/NOR-NORI-NORK distractor matrix rows', () => {
    const gustatu = VERBS.find((v) => v.id === 'gustatu')
    const esan = VERBS.find((v) => v.id === 'esan')
    const eman = VERBS.find((v) => v.id === 'eman')

    it('offers the case-frame-inverse sibling\'s present form as a NOR-NORI distractor (`esaten diot` for `gustatzen zait`)', () => {
      // #227/[B2]: ungrounded `form` questions never show `formLures`
      // anymore — this now exercises the `sentence` kind instead.
      vi.spyOn(Math, 'random').mockReturnValue(0) // -> 'sentence' (first available kind)

      const question = generateQuestions(gustatu, 'present', { verbs: VERBS }).find((q) => q.person === 'ni')

      expect(question.kind).toBe('sentence')
      expect(question.correct).toBe('gustatzen zait')
      expect(question.options).toContain('esaten diot')
    })

    it('offers the case-frame-inverse sibling\'s present form as a NOR-NORI-NORK distractor (`gustatzen zait` for `esaten diot`)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const question = generateQuestions(esan, 'present', { verbs: VERBS }).find((q) => q.person === 'ni')

      expect(question.kind).toBe('sentence')
      expect(question.correct).toBe('esaten diot')
      expect(question.options).toContain('gustatzen zait')
    })

    it('offers the verb\'s own plural-object form as a "wrong object number" distractor (gustatu, esan, eman)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const gustatuQuestion = generateQuestions(gustatu, 'present', { verbs: VERBS }).find((q) => q.person === 'ni')
      expect(gustatuQuestion.kind).toBe('sentence')
      expect(gustatuQuestion.options).toContain('gustatzen zaizkit')

      const esanQuestion = generateQuestions(esan, 'present', { verbs: VERBS }).find((q) => q.person === 'ni')
      expect(esanQuestion.kind).toBe('sentence')
      expect(esanQuestion.options).toContain('esaten dizkiot')

      const emanQuestion = generateQuestions(eman, 'present', { verbs: VERBS }).find((q) => q.person === 'zu')
      expect(emanQuestion.kind).toBe('sentence')
      expect(emanQuestion.options).toContain('ematen dizkizut')
    })
  })

  // #144 added `hi` as a new, ungendered person to izan/egon/joan/etorri's
  // present and past tables (Unit 32, "Meet hi" — no allocutivity yet, see
  // docs/DECISIONS.md). With no `sentences`/`pronounSentences` for `hi`,
  // `availableKinds` is always empty, so `hi` questions are always `kind:
  // 'form'` regardless of `Math.random`. #227/[B2]: a `kind: 'form'`
  // question is never grounded, so `hi`-restricted questions (own-table
  // candidates filtered out by the `persons: ['hi']` restriction itself)
  // get no distractors from borrowing or lures either — just the bare
  // correct answer.
  describe('#144 `hi` as a new person (izan/egon/joan/etorri)', () => {
    const izan = VERBS.find((v) => v.id === 'izan')
    const joan = VERBS.find((v) => v.id === 'joan')
    const etorri = VERBS.find((v) => v.id === 'etorri')

    it('drills `hi` present with no distractors, since an ungrounded `form` question never borrows', () => {
      const question = generateQuestions(izan, 'present', { persons: ['hi'], verbs: VERBS })[0]

      expect(question.kind).toBe('form')
      expect(question.correct).toBe('haiz')
      expect(question.options).toEqual(['haiz'])
    })

    it('drills `hi` past with no #141 cross-tense lure, since an ungrounded `form` question never gets one', () => {
      const question = generateQuestions(izan, 'past', { persons: ['hi'], verbs: VERBS })[0]

      expect(question.kind).toBe('form')
      expect(question.correct).toBe('hintzen')
      expect(question.options).not.toContain('haiz')
    })

    it('gives joan/etorri a periphrastic `hi` past, matching their existing `ni`/`zu`/... shape', () => {
      expect(joan.conjugations.past.hi).toBe('joan hintzen')
      expect(etorri.conjugations.past.hi).toBe('etorri hintzen')
    })
  })

  describe('#167 toka/noka and hi-as-NORK gender split', () => {
    const izan = VERBS.find((v) => v.id === 'izan')
    const ukan = VERBS.find((v) => v.id === 'ukan')
    const jakin = VERBS.find((v) => v.id === 'jakin')

    it('gives izan/ukan 2-person toka/noka tables (hura/haiek only)', () => {
      expect(izan.conjugations.presentToka).toEqual({ hura: 'duk', haiek: 'dituk' })
      expect(izan.conjugations.presentNoka).toEqual({ hura: 'dun', haiek: 'ditun' })
      expect(izan.conjugations.pastToka).toEqual({ hura: 'zuan', haiek: 'zituan' })
      expect(izan.conjugations.pastNoka).toEqual({ hura: 'zunan', haiek: 'zitunan' })

      expect(ukan.conjugations.presentToka).toEqual({ hura: 'dik', haiek: 'ditek' })
      expect(ukan.conjugations.presentNoka).toEqual({ hura: 'din', haiek: 'diten' })
      expect(ukan.conjugations.pastToka).toEqual({ hura: 'zian', haiek: 'zitean' })
      expect(ukan.conjugations.pastNoka).toEqual({ hura: 'zinan', haiek: 'zitenan' })
    })

    it('drills toka as a binary (2-option) choice between hura/haiek', () => {
      const question = generateQuestions(izan, 'presentToka', { verbs: VERBS })[0]

      expect(question.options).toHaveLength(2)
      expect(question.options).toEqual(expect.arrayContaining(['duk', 'dituk']))
    })

    it('keeps ukan\'s hi-as-NORK present (duk/dun) distinct from its own presentToka/presentNoka (dik/din)', () => {
      expect(ukan.conjugations.present['hi-m']).toBe('duk')
      expect(ukan.conjugations.present['hi-f']).toBe('dun')
      expect(ukan.conjugations.presentToka.hura).toBe('dik')
      expect(ukan.conjugations.presentNoka.hura).toBe('din')
    })

    it('gives jakin a hi-as-NORK present gender split (dakik/dakin), unsplit past (hekien, #245)', () => {
      expect(jakin.conjugations.present['hi-m']).toBe('dakik')
      expect(jakin.conjugations.present['hi-f']).toBe('dakin')
      expect(jakin.conjugations.past.hi).toBe('hekien')
    })

    it('keeps ukan\'s past hi unsplit (huen), unlike its present hi-m/hi-f', () => {
      expect(ukan.conjugations.past.hi).toBe('huen')
    })

    it('drills ukan/jakin hi-m/hi-f present pooled, with real cross-verb borrowing (agreementsCompatible)', () => {
      const sources = [
        { verbId: 'ukan', tense: 'present' },
        { verbId: 'jakin', tense: 'present' },
      ]
      const candidates = getCrossVerbCandidates(ukan, 'present', sources, VERBS)

      expect(candidates['hi-m']).toEqual(expect.arrayContaining([{ verbId: 'jakin', form: 'dakik' }]))
      expect(candidates['hi-f']).toEqual(expect.arrayContaining([{ verbId: 'jakin', form: 'dakin' }]))
    })
  })

  describe('#171 imperative (agintera)', () => {
    const izan = VERBS.find((v) => v.id === 'izan')
    const ukan = VERBS.find((v) => v.id === 'ukan')

    it('gives izan a second-person-only imperative table, hi unsplit (no allocutive-style gender split)', () => {
      expect(izan.conjugations.imperative).toEqual({ hi: 'hadi', zu: 'zaitez', zuek: 'zaitezte' })
    })

    it('gives ukan a hi-m/hi-f imperative split (ezak/ezan), since hi is the grammatical NORK subject', () => {
      expect(ukan.conjugations.imperative).toEqual({
        'hi-m': 'ezak',
        'hi-f': 'ezan',
        zu: 'ezazu',
        zuek: 'ezazue',
        hura: 'beza',
        gu: 'dezagun',
        haiek: 'bezate',
      })
    })

    it('drills izan imperative as multiple-choice over its 3-person table', () => {
      // #413 gave izan's imperative its own sentences, so `generateQuestions`
      // can now roll `type-verb`/`word-order` kinds for a given person too —
      // those are typed/reordering questions with no `options` at all. Pull
      // enough rounds to reliably land a multiple-choice kind (`form`/
      // `sentence`) rather than asserting on whichever kind the first roll
      // happens to produce (#415 CI flake).
      const questions = generateQuestions(izan, 'imperative', { verbs: VERBS, rounds: 20 })
      const question = questions.find((candidate) => candidate.options?.includes('hadi'))

      expect(question.options).toEqual(expect.arrayContaining(['hadi', 'zaitez', 'zaitezte']))
      expect(question.options).toContain(question.correct)
    })
  })

  describe('#230 progressive-vs-plain lure (ari <-> baseVerb)', () => {
    const jan = VERBS.find((v) => v.id === 'jan')
    const ari = VERBS.find((v) => v.id === 'ari')

    it('getProgressiveBaseLure resolves a base verb id to its present-tense form for that person', () => {
      expect(getProgressiveBaseLure(VERBS, 'jan', 'ni')).toBe('jaten dut')
      expect(getProgressiveBaseLure(VERBS, 'jan', 'hura')).toBe('jaten du')
    })

    it('getProgressiveBaseLure returns undefined without a baseVerbId, or for an unknown verb id', () => {
      expect(getProgressiveBaseLure(VERBS, undefined, 'ni')).toBeUndefined()
      expect(getProgressiveBaseLure(VERBS, 'not-a-real-verb', 'ni')).toBeUndefined()
    })

    it('offers jan\'s plain present as a distractor for an ari sentence question tagged with baseVerb: jan', () => {
      // `pickVariant`/`rollQuestionKind` are randomized, and the tagged "Ni
      // jaten ___." sentence is only 1 of 4 `ni` variants — generating a
      // large round count makes hitting it (and the `sentence`-kind roll)
      // overwhelmingly likely without pinning exact `Math.random` call
      // indices, which depend on how many other verbs' borrowed-slot
      // candidates happen to consume random calls first.
      const questions = generateQuestions(ari, 'present', { verbs: VERBS, persons: ['ni'], rounds: 300 })
      const sentenceQuestion = questions.find((q) => q.kind === 'sentence' && q.sentence === 'Ni jaten ___.')

      expect(sentenceQuestion).toBeDefined()
      expect(sentenceQuestion.options).toContain(jan.conjugations.present.ni)
    })
  })
})

describe('getCrossVerbCandidates', () => {
  const izan = {
    id: 'izan',
    agreement: ['nor'],
    conjugations: { present: { ni: 'naiz', zu: 'zara', hura: 'da' } },
  }
  const egon = {
    id: 'egon',
    agreement: ['nor'],
    conjugations: { present: { ni: 'nago', zu: 'zaude', hura: 'dago' } },
  }
  const ukan = {
    id: 'ukan',
    agreement: ['nor', 'nork'],
    conjugations: { present: { ni: 'dut', zu: 'duzu', hura: 'du' } },
  }
  const verbs = [izan, egon, ukan]

  it('collects same-person forms from other sources with compatible agreement', () => {
    const sources = [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'egon', tense: 'present' },
    ]

    expect(getCrossVerbCandidates(izan, 'present', sources, verbs)).toEqual({
      ni: [{ verbId: 'egon', form: 'nago' }],
      zu: [{ verbId: 'egon', form: 'zaude' }],
      hura: [{ verbId: 'egon', form: 'dago' }],
    })
  })

  it('excludes sources with incompatible agreement (nor vs nor-nork)', () => {
    const sources = [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'ukan', tense: 'present' },
    ]

    expect(getCrossVerbCandidates(izan, 'present', sources, verbs)).toEqual({})
  })

  it('excludes the verb itself even if it appears again under a different tense', () => {
    const sources = [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'izan', tense: 'past' },
    ]

    expect(getCrossVerbCandidates({ ...izan, conjugations: { ...izan.conjugations, past: { ni: 'nintzen' } } }, 'present', sources, verbs)).toEqual({})
  })

  it('returns an empty object when there are no compatible siblings', () => {
    const sources = [{ verbId: 'izan', tense: 'present' }]

    expect(getCrossVerbCandidates(izan, 'present', sources, verbs)).toEqual({})
  })

  it('falls back to extraSources when the review has too few sources of its own', () => {
    const sources = [{ verbId: 'izan', tense: 'present' }]
    const extraSources = [{ verbId: 'egon', tense: 'present' }]

    expect(getCrossVerbCandidates(izan, 'present', sources, verbs, extraSources)).toEqual({
      ni: [{ verbId: 'egon', form: 'nago' }],
      zu: [{ verbId: 'egon', form: 'zaude' }],
      hura: [{ verbId: 'egon', form: 'dago' }],
    })
  })

  it('ignores extraSources with incompatible agreement or a different tense', () => {
    const sources = [{ verbId: 'izan', tense: 'present' }]
    const extraSources = [
      { verbId: 'ukan', tense: 'present' },
      { verbId: 'egon', tense: 'past' },
    ]

    expect(getCrossVerbCandidates(izan, 'present', sources, verbs, extraSources)).toEqual({})
  })

  it('does not duplicate a source already present in sources when also passed as an extraSource', () => {
    const sources = [
      { verbId: 'izan', tense: 'present' },
      { verbId: 'egon', tense: 'present' },
    ]
    const extraSources = [{ verbId: 'egon', tense: 'present' }]

    expect(getCrossVerbCandidates(izan, 'present', sources, verbs, extraSources)).toEqual({
      ni: [{ verbId: 'egon', form: 'nago' }],
      zu: [{ verbId: 'egon', form: 'zaude' }],
      hura: [{ verbId: 'egon', form: 'dago' }],
    })
  })
})

describe('normalizeSentence', () => {
  it('returns undefined for undefined (no sentence for this person)', () => {
    expect(normalizeSentence(undefined)).toBeUndefined()
  })

  it('wraps a bare string with validFor: undefined (untagged, not yet vetted)', () => {
    expect(normalizeSentence('Ni irakaslea ___.')).toEqual({ text: 'Ni irakaslea ___.' })
    expect(normalizeSentence('Ni irakaslea ___.').validFor).toBeUndefined()
  })

  it('passes a { text, validFor } object through unchanged', () => {
    const sentence = { text: 'Ni irakaslea ___.', validFor: ['egon'] }

    expect(normalizeSentence(sentence)).toBe(sentence)
  })
})

describe('filterExtraCandidates', () => {
  const candidates = [
    { verbId: 'egon', form: 'nago' },
    { verbId: 'ukan', form: 'dut' },
  ]

  it('returns [] when candidates is undefined', () => {
    expect(filterExtraCandidates(undefined, [])).toEqual([])
  })

  it('returns [] when validFor is absent (untagged, the safe default)', () => {
    expect(filterExtraCandidates(candidates, undefined)).toEqual([])
  })

  it('returns every candidate\'s form when validFor: [] (vetted, excludes nothing)', () => {
    expect(filterExtraCandidates(candidates, [])).toEqual(['nago', 'dut'])
  })

  it('excludes only the candidates whose verbId is listed in validFor', () => {
    expect(filterExtraCandidates(candidates, ['egon'])).toEqual(['dut'])
    expect(filterExtraCandidates(candidates, ['egon', 'ukan'])).toEqual([])
  })
})

describe('generateCrossVerbQuestions', () => {
  const izan = {
    id: 'izan',
    verb: 'izan',
    agreement: ['nor'],
    conjugations: { present: { ni: 'naiz', zu: 'zara', hura: 'da' } },
    sentences: {
      present: {
        ni: { text: 'Ni irakaslea ___.', validFor: [] },
        zu: { text: 'Zu irakaslea ___.', validFor: [] },
        hura: { text: 'Hura irakaslea ___.', validFor: [] },
      },
    },
  }
  const egon = {
    id: 'egon',
    verb: 'egon',
    agreement: ['nor'],
    conjugations: { present: { ni: 'nago', zu: 'zaude', hura: 'dago' } },
    sentences: {
      present: {
        ni: { text: 'Ni etxean ___.', validFor: [] },
        zu: { text: 'Zu etxean ___.', validFor: [] },
        hura: { text: 'Hura etxean ___.', validFor: [] },
      },
    },
  }
  const ukan = {
    id: 'ukan',
    verb: 'ukan',
    agreement: ['nor', 'nork'],
    conjugations: { present: { ni: 'dut', zu: 'duzu', hura: 'du' } },
    sentences: {
      present: {
        ni: { text: 'Nik liburua ___.', validFor: [] },
        zu: { text: 'Zuk liburua ___.', validFor: [] },
        hura: { text: 'Hark liburua ___.', validFor: [] },
      },
    },
  }

  it('produces verb-choice questions whose options always include the correct form, with no duplicates', () => {
    const sources = [
      { verb: izan, tense: 'present' },
      { verb: egon, tense: 'present' },
    ]

    const questions = generateCrossVerbQuestions(sources, { count: 10 })

    expect(questions.length).toBeGreaterThan(0)
    questions.forEach((question) => {
      expect(question.kind).toBe('verb-choice')
      expect(question.options).toContain(question.correct)
      expect(new Set(question.options).size).toBe(question.options.length)
      expect(question.options.length).toBe(2)
      expect(question.sentence).toContain('___')
    })
  })

  it('caps the number of returned questions at `count`', () => {
    const sources = [
      { verb: izan, tense: 'present' },
      { verb: egon, tense: 'present' },
    ]

    expect(generateCrossVerbQuestions(sources, { count: 1 })).toHaveLength(1)
    expect(generateCrossVerbQuestions(sources)).toHaveLength(CROSS_VERB_QUESTION_COUNT)
  })

  it('returns nothing for a single-source review with no siblings to choose between', () => {
    const sources = [{ verb: izan, tense: 'present' }]

    expect(generateCrossVerbQuestions(sources)).toEqual([])
  })

  it('excludes agreement-incompatible sources (nor vs nor-nork) from the options pool', () => {
    const sources = [
      { verb: izan, tense: 'present' },
      { verb: ukan, tense: 'present' },
    ]

    expect(generateCrossVerbQuestions(sources)).toEqual([])
  })

  it('restricts questions to the given persons when `persons` is provided', () => {
    const sources = [
      { verb: izan, tense: 'present' },
      { verb: egon, tense: 'present' },
    ]

    const questions = generateCrossVerbQuestions(sources, { persons: ['ni'], count: 10 })

    expect(questions.length).toBeGreaterThan(0)
    questions.forEach((question) => expect(question.person).toBe('ni'))
  })

  it('uses extraSiblingSources to produce questions for a single-source review', () => {
    const sources = [{ verb: izan, tense: 'present' }]
    const extraSiblingSources = [{ verb: egon, tense: 'present' }]

    const questions = generateCrossVerbQuestions(sources, { count: 10, extraSiblingSources })

    expect(questions.length).toBeGreaterThan(0)
    questions.forEach((question) => {
      expect(question.kind).toBe('verb-choice')
      expect(question.options).toContain(question.correct)
      expect(question.options.length).toBe(2)
    })
  })

  it('ignores an extraSiblingSource that duplicates one of the review\'s own sources', () => {
    const sources = [
      { verb: izan, tense: 'present' },
      { verb: egon, tense: 'present' },
    ]
    const extraSiblingSources = [{ verb: egon, tense: 'present' }]

    const withExtra = generateCrossVerbQuestions(sources, { count: 10, extraSiblingSources })
    const withoutExtra = generateCrossVerbQuestions(sources, { count: 10 })

    withExtra.forEach((question) => expect(question.options.length).toBe(2))
    expect(withExtra.length).toBe(withoutExtra.length)
  })

  it('tops up degenerate 2-option questions with a `verbs`-sourced distractor (#202)', () => {
    // A review with only one compatible sibling in its own `sources` (and no
    // `extraSiblingSources`) is a real, recurring shape — e.g.
    // `jakin-suffix-family-review`, where the only other in-scope sibling for
    // a given sentence gets excluded by `validFor`, leaving a 2-option coin
    // flip. Passing the full `VERBS` list as `verbs` lets a third,
    // unrelated-but-compatible verb top the options up to 3.
    const beste = {
      id: 'beste',
      verb: 'beste',
      agreement: ['nor'],
      conjugations: { present: { ni: 'bestenaiz', zu: 'bestezara', hura: 'besteda' } },
    }
    const sources = [
      { verb: izan, tense: 'present' },
      { verb: egon, tense: 'present' },
    ]

    const withoutVerbs = generateCrossVerbQuestions(sources, { count: 10 })
    const withVerbs = generateCrossVerbQuestions(sources, { count: 10, verbs: [izan, egon, beste] })

    withoutVerbs.forEach((question) => expect(question.options.length).toBe(2))
    expect(withVerbs.length).toBeGreaterThan(0)
    withVerbs.forEach((question) => {
      expect(question.options).toContain(question.correct)
      expect(new Set(question.options).size).toBe(question.options.length)
      expect(question.options.length).toBe(3)
    })
  })

  it('pools two objectAxis verbs together (#380), mixing their resolved presentByObject forms with no sentence', () => {
    const ukan = VERBS.find((v) => v.id === 'ukan')
    const maite = VERBS.find((v) => v.id === 'maite')
    const sources = [
      { verb: ukan, tense: 'present' },
      { verb: maite, tense: 'present' },
    ]
    const objectAxis = { vary: 'nor', fixed: 'ni' }

    const questions = generateCrossVerbQuestions(sources, { count: 10, objectAxis })

    expect(questions.length).toBeGreaterThan(0)
    questions.forEach((question) => {
      expect(question.kind).toBe('verb-choice')
      expect(question.sentence).toBeUndefined()
      expect(question.fixedArgument).toEqual({ role: 'nork', person: 'ni' })
      expect(question.options).toContain(question.correct)
      expect(new Set(question.options).size).toBe(question.options.length)
    })
    const verbIds = new Set()
    questions.forEach((question) => {
      const ukanForm = resolveObjectAxisTable(ukan.conjugations.present, objectAxis)[question.person]
      const maiteForm = resolveObjectAxisTable(maite.conjugations.present, objectAxis)[question.person]
      if (question.options.includes(ukanForm)) verbIds.add('ukan')
      if (question.options.includes(maiteForm)) verbIds.add('maite')
    })
    expect(verbIds.size).toBe(2)
  })
})

describe('generateCaseMixerQuestions', () => {
  const izan = {
    id: 'izan',
    verb: 'izan',
    agreement: ['nor'],
    conjugations: { present: { ni: 'naiz', zu: 'zara', hura: 'da' } },
    sentences: {
      present: {
        ni: { text: 'Ni irakaslea ___.', validFor: [] },
        zu: { text: 'Zu irakaslea ___.', validFor: [] },
        hura: { text: 'Hura irakaslea ___.', validFor: [] },
      },
    },
  }
  const egon = {
    id: 'egon',
    verb: 'egon',
    agreement: ['nor'],
    conjugations: { present: { ni: 'nago', zu: 'zaude', hura: 'dago' } },
    sentences: {
      present: {
        ni: { text: 'Ni etxean ___.', validFor: [] },
        zu: { text: 'Zu etxean ___.', validFor: [] },
        hura: { text: 'Hura etxean ___.', validFor: [] },
      },
    },
  }
  const ukan = {
    id: 'ukan',
    verb: 'ukan',
    agreement: ['nor', 'nork'],
    conjugations: { present: { ni: 'dut', zu: 'duzu', hura: 'du' } },
    sentences: {
      present: {
        ni: { text: 'Nik liburua ___.', validFor: [] },
        zu: { text: 'Zuk liburua ___.', validFor: [] },
        hura: { text: 'Hark liburua ___.', validFor: [] },
      },
    },
  }

  it('produces case-mixer questions pairing nor and nor-nork sources, with the correct form always among the options', () => {
    const sources = [
      { verb: izan, tense: 'present' },
      { verb: ukan, tense: 'present' },
    ]

    const questions = generateCaseMixerQuestions(sources, { count: 10 })

    expect(questions.length).toBeGreaterThan(0)
    questions.forEach((question) => {
      expect(question.kind).toBe('case-mixer')
      expect(question.options).toContain(question.correct)
      expect(new Set(question.options).size).toBe(question.options.length)
      expect(question.options.length).toBe(2)
      expect(question.sentence).toContain('___')
    })
  })

  it('caps the number of returned questions at `count`', () => {
    const sources = [
      { verb: izan, tense: 'present' },
      { verb: ukan, tense: 'present' },
    ]

    expect(generateCaseMixerQuestions(sources, { count: 1 })).toHaveLength(1)
    expect(generateCaseMixerQuestions(sources)).toHaveLength(CASE_MIXER_QUESTION_COUNT)
  })

  it('returns nothing when every source shares the same agreement (no nor/nor-nork mix)', () => {
    const sources = [
      { verb: izan, tense: 'present' },
      { verb: egon, tense: 'present' },
    ]

    expect(generateCaseMixerQuestions(sources)).toEqual([])
  })

  it('returns nothing for a single-source review', () => {
    expect(generateCaseMixerQuestions([{ verb: izan, tense: 'present' }])).toEqual([])
  })

  it('restricts questions to the given persons when `persons` is provided', () => {
    const sources = [
      { verb: izan, tense: 'present' },
      { verb: ukan, tense: 'present' },
    ]

    const questions = generateCaseMixerQuestions(sources, { persons: ['ni'], count: 10 })

    expect(questions.length).toBeGreaterThan(0)
    questions.forEach((question) => expect(question.person).toBe('ni'))
  })

  it('uses extraSiblingSources to produce a case-mixer question for a single-agreement review', () => {
    const sources = [{ verb: izan, tense: 'present' }]
    const extraSiblingSources = [{ verb: ukan, tense: 'present' }]

    const questions = generateCaseMixerQuestions(sources, { count: 10, extraSiblingSources })

    expect(questions.length).toBeGreaterThan(0)
    questions.forEach((question) => {
      expect(question.kind).toBe('case-mixer')
      expect(question.options).toContain(question.correct)
      expect(question.options.length).toBe(2)
    })
  })
})

describe('generateMatchPairsQuestions', () => {
  const izan = {
    id: 'izan',
    verb: 'izan',
    agreement: ['nor'],
    conjugations: { present: { ni: 'naiz', zu: 'zara', hura: 'da', gu: 'gara', zuek: 'zarete', haiek: 'dira' } },
  }
  const ariToka = {
    id: 'ari-toka',
    verb: 'ari',
    agreement: ['nor'],
    conjugations: { present: { hi: 'ari haiz', zu: 'ari zara' } },
  }
  const repeated = {
    id: 'repeated',
    verb: 'repeated',
    agreement: ['nor'],
    conjugations: { present: { ni: 'bera', zu: 'bera', hura: 'bera' } },
  }

  it('produces one match-pairs question with every in-scope person paired to its form', () => {
    const sources = [{ verb: izan, tense: 'present' }]

    const questions = generateMatchPairsQuestions(sources, { count: 10 })

    expect(questions).toHaveLength(1)
    expect(questions[0].kind).toBe('match-pairs')
    expect(questions[0].verbId).toBe('izan')
    expect(questions[0].correct).toBe('complete')
    expect(questions[0].pairs).toEqual(
      expect.arrayContaining([{ person: 'ni', form: 'naiz' }, { person: 'zu', form: 'zara' }, { person: 'hura', form: 'da' }]),
    )
  })

  it('yields no question for a source with fewer than 3 in-scope persons', () => {
    const sources = [{ verb: ariToka, tense: 'present' }]

    expect(generateMatchPairsQuestions(sources)).toEqual([])
  })

  it('yields no question for a source whose in-scope forms are not all distinct', () => {
    const sources = [{ verb: repeated, tense: 'present' }]

    expect(generateMatchPairsQuestions(sources)).toEqual([])
  })

  it('respects a `persons` filter', () => {
    const sources = [{ verb: izan, tense: 'present' }]

    const questions = generateMatchPairsQuestions(sources, { persons: ['ni', 'zu', 'hura'] })

    expect(questions[0].pairs).toHaveLength(3)
  })

  it('caps the number of returned questions at `count`', () => {
    const sources = [
      { verb: izan, tense: 'present' },
      { verb: { ...izan, id: 'izan2' }, tense: 'present' },
    ]

    expect(generateMatchPairsQuestions(sources, { count: 1 })).toHaveLength(1)
    expect(generateMatchPairsQuestions(sources)).toHaveLength(MATCH_PAIRS_QUESTION_COUNT)
  })
})

// Coverage for collectCrossSourceCandidates' validFor filtering
// (docs/SENTENCE_FRAMES.md), shared by generateCrossVerbQuestions and
// generateCaseMixerQuestions: a source's example sentence's `validFor` tag
// governs which compatible siblings' forms may appear as "wrong verb"
// options for that sentence.
describe('validFor filtering in verb-choice/case-mixer candidates', () => {
  const izan = {
    id: 'izan',
    verb: 'izan',
    agreement: ['nor'],
    conjugations: { present: { ni: 'naiz', zu: 'zara' } },
  }
  const egon = {
    id: 'egon',
    verb: 'egon',
    agreement: ['nor'],
    conjugations: { present: { ni: 'nago', zu: 'zaude' } },
  }
  const ukan = {
    id: 'ukan',
    verb: 'ukan',
    agreement: ['nor', 'nork'],
    conjugations: { present: { ni: 'dut', zu: 'duzu' } },
  }

  it('validFor: [] (vetted) admits a compatible sibling\'s form as a verb-choice option', () => {
    const izanWithSentence = { ...izan, sentences: { present: { ni: { text: 'Ni irakaslea ___.', validFor: [] } } } }
    const sources = [
      { verb: izanWithSentence, tense: 'present' },
      { verb: egon, tense: 'present' },
    ]

    const questions = generateCrossVerbQuestions(sources, { persons: ['ni'], count: 10 })

    expect(questions.length).toBeGreaterThan(0)
    questions.forEach((question) => {
      expect(question.options).toContain('naiz')
      expect(question.options).toContain('nago')
    })
  })

  it('a sibling listed in validFor is excluded from verb-choice options', () => {
    const izanExcludingEgon = { ...izan, sentences: { present: { ni: { text: 'Ni irakaslea ___.', validFor: ['egon'] } } } }
    const sources = [
      { verb: izanExcludingEgon, tense: 'present' },
      { verb: egon, tense: 'present' },
    ]

    expect(generateCrossVerbQuestions(sources, { persons: ['ni'], count: 10 })).toEqual([])
  })

  it('an untagged (bare string) sentence excludes every sibling (safe default)', () => {
    const izanUntagged = { ...izan, sentences: { present: { ni: 'Ni irakaslea ___.' } } }
    const sources = [
      { verb: izanUntagged, tense: 'present' },
      { verb: egon, tense: 'present' },
    ]

    expect(generateCrossVerbQuestions(sources, { persons: ['ni'], count: 10 })).toEqual([])
  })

  it('validFor: [] (vetted) admits a case-mismatched sibling\'s form as a case-mixer option', () => {
    const izanWithSentence = { ...izan, sentences: { present: { ni: { text: 'Ni irakaslea ___.', validFor: [] } } } }
    const sources = [
      { verb: izanWithSentence, tense: 'present' },
      { verb: ukan, tense: 'present' },
    ]

    const questions = generateCaseMixerQuestions(sources, { persons: ['ni'], count: 10 })

    expect(questions.length).toBeGreaterThan(0)
    questions.forEach((question) => {
      expect(question.options).toContain('naiz')
      expect(question.options).toContain('dut')
    })
  })

  it('a sibling listed in validFor is excluded from case-mixer options', () => {
    const izanExcludingUkan = { ...izan, sentences: { present: { ni: { text: 'Ni irakaslea ___.', validFor: ['ukan'] } } } }
    const sources = [
      { verb: izanExcludingUkan, tense: 'present' },
      { verb: ukan, tense: 'present' },
    ]

    expect(generateCaseMixerQuestions(sources, { persons: ['ni'], count: 10 })).toEqual([])
  })

  it('case-mixer requires agreement mismatch in addition to validFor permitting the sibling', () => {
    const izanWithSentence = { ...izan, sentences: { present: { ni: { text: 'Ni irakaslea ___.', validFor: [] } } } }
    const sources = [
      { verb: izanWithSentence, tense: 'present' },
      { verb: egon, tense: 'present' },
    ]

    expect(generateCaseMixerQuestions(sources, { persons: ['ni'], count: 10 })).toEqual([])
  })
})

describe('getIntroducedSources + cross-verb question generation (real LESSONS/VERBS)', () => {
  // Reviews with < 3 sources fall back to getIntroducedSources for extraSiblingSources
  // (mirrors src/App.jsx's createExerciseState). Before getIntroducedSources excluded
  // "pool" lessons (e.g. unit-10-present, izan-past-pool — shaped like a review but not
  // `review: true`, so they have no verbId/tense), these reviews crashed
  // generateCrossVerbQuestions/generateCaseMixerQuestions on `sibling.verb.id` of an
  // undefined `verb`.
  const reviewsWithFewSources = LESSONS.filter((lesson) => lesson.review && lesson.sources && lesson.sources.length < 3)

  it('returns only well-formed {verbId, tense} entries for every review with fewer than 3 sources', () => {
    expect(reviewsWithFewSources.length).toBeGreaterThan(0)

    for (const lesson of reviewsWithFewSources) {
      for (const source of getIntroducedSources(LESSONS, lesson.id)) {
        expect(source.verbId).toBeTypeOf('string')
        expect(source.tense).toBeTypeOf('string')
      }
    }
  })

  it('does not crash generateCrossVerbQuestions/generateCaseMixerQuestions for reviews relying on the getIntroducedSources fallback', () => {
    for (const lesson of reviewsWithFewSources) {
      const resolvedSources = lesson.sources.map(({ verbId, tense }) => ({ verb: VERBS.find((v) => v.id === verbId), tense }))
      const extraSiblingSources = getIntroducedSources(LESSONS, lesson.id).map(({ verbId, tense }) => ({
        verb: VERBS.find((v) => v.id === verbId),
        tense,
      }))

      expect(() => generateCrossVerbQuestions(resolvedSources, { persons: lesson.persons, extraSiblingSources })).not.toThrow()
      expect(() => generateCaseMixerQuestions(resolvedSources, { persons: lesson.persons, extraSiblingSources })).not.toThrow()
    }
  })
})

// #381: Unit 15's two new pooled reviews (object-axis-present-review,
// object-axis-past-review) span all seven objectAxis verbs (ukan/maite/
// ikusi/jan/edan/erosi/hartu); generateCrossVerbQuestions should pool
// distractors across more than just a pair of them, per #380's design.
describe.each(['object-axis-present-review', 'object-axis-past-review'])('%s (real LESSONS/VERBS, #381)', (lessonId) => {
  it('produces verb-choice questions with no sentence, drawing distractors from more than two verbs', () => {
    const lesson = LESSONS.find((l) => l.id === lessonId)
    const resolvedSources = lesson.sources.map(({ verbId, tense }) => ({ verb: VERBS.find((v) => v.id === verbId), tense }))

    const questions = generateCrossVerbQuestions(resolvedSources, {
      persons: lesson.persons,
      count: 20,
      verbs: VERBS,
      objectAxis: lesson.objectAxis,
    })

    expect(questions.length).toBeGreaterThan(0)
    const verbIdsSeen = new Set()
    questions.forEach((question) => {
      expect(question.kind).toBe('verb-choice')
      expect(question.sentence).toBeUndefined()
      expect(question.fixedArgument).toEqual({ role: 'nork', person: 'ni' })
      expect(question.options).toContain(question.correct)
      expect(new Set(question.options).size).toBe(question.options.length)
      resolvedSources.forEach(({ verb, tense }) => {
        const table = resolveObjectAxisTable(getComposedTable(verb, tense), lesson.objectAxis)
        if (question.options.includes(table[question.person])) verbIdsSeen.add(verb.id)
      })
    })
    expect(verbIdsSeen.size).toBeGreaterThan(2)
  })
})

// #124/#315: every cultural-bank-epic (#310) `nor-nork` verb's
// `sentences`/`negativeSentences` variant, in any tense, has an explicit
// `validFor` decision (docs/SENTENCE_FRAMES.md) — even `validFor: []` counts
// as "decided"; a bare string or an object with no `validFor` key is the
// pre-#124 "not yet vetted" state and fails this test. Originally scoped to
// just `sentences.present` across every `nor-nork` verb (#124); widened to
// every tense and to `negativeSentences` too (#315), since the cultural-bank
// adoption (#311-314) gives verbs their own hand-written `sentences.past` (no
// longer just a by-reference reuse of `present` — see the reuse loops at the
// bottom of `src/data/verbs.js`).
//
// Deliberately an explicit allowlist, not every `agreement.includes('nork')`
// verb: a separate, unrelated vocabulary-expansion effort (`egin`, `irakurri`,
// `saldu`, `bultzatu`, ~35 others) already ships hand-written
// `sentences.past` with no `validFor` tagging at all, predating #310 and out
// of this epic's scope to retroactively audit. This list is exactly
// #312/#313's already-adopted or in-scope `nor-nork` verbs (`nahi`/`ari` are
// `nor`/intransitive-only and `gustatu`/`iruditu`/`ahaztu` are `nor-nori`, so
// they're covered by a future, separately-scoped pass once #312/#313 land
// their data, per the comment above).
describe('validFor coverage for the nor-nork cluster (docs/SENTENCE_FRAMES.md, #124/#315)', () => {
  const CULTURAL_BANK_NOR_NORK_VERBS = ['ukan', 'jakin', 'eraman', 'ekarri', 'jan', 'edan', 'erosi', 'hartu', 'ikusi', 'eduki', 'esan', 'eman', 'behar']
  const norNorkVerbs = VERBS.filter((verb) => CULTURAL_BANK_NOR_NORK_VERBS.includes(verb.id))

  it('covers more than one verb', () => {
    expect(norNorkVerbs.length).toBeGreaterThan(1)
  })

  const expectCoverage = (sentencesByTense, label) => {
    for (const [tense, sentences] of Object.entries(sentencesByTense ?? {})) {
      for (const [person, value] of Object.entries(sentences ?? {})) {
        const variants = Array.isArray(value) ? value : [value]
        for (const variant of variants) {
          expect(variant, `${label}.${tense}.${person}`).toEqual(expect.objectContaining({ validFor: expect.any(Array) }))
        }
      }
    }
  }

  for (const verb of norNorkVerbs) {
    describe(verb.id, () => {
      it('every sentences variant, in every tense, has an explicit validFor array', () => {
        expectCoverage(verb.sentences, `${verb.id}.sentences`)
      })

      it('every negativeSentences variant, in every tense, has an explicit validFor array', () => {
        expectCoverage(verb.negativeSentences, `${verb.id}.negativeSentences`)
      })
    })
  }
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

  it('explains verb-choice questions with the correct verb and form', () => {
    const question = { kind: 'verb-choice', tense: 'present', person: 'ni', correct: 'naiz' }

    expect(getExplanation(verbAbsolutive, question, t)).toBe('explanationVerbChoice:{"verb":"izan","form":"naiz"}')
  })

  it('explains case-mixer questions differently depending on whether the verb takes an ergative subject', () => {
    const question = { kind: 'case-mixer', tense: 'present', person: 'ni', correct: 'naiz' }

    expect(getExplanation(verbAbsolutive, question, t)).toBe('explanationCaseMixerAbsolutive:{"verb":"izan","form":"naiz"}')
    expect(getExplanation(verbErgative, { ...question, correct: 'dut' }, t)).toBe('explanationCaseMixerErgative:{"verb":"ukan","form":"dut"}')
  })
})

describe('getLureRationale ([C2]/#229)', () => {
  const t = (key, vars) => `${key}:${JSON.stringify(vars)}`
  const question = {
    kind: 'sentence',
    correct: 'dut',
    optionRationale: { naiz: { errorType: 'case-frame', whyKey: 'lureRationaleCaseFrame' } },
  }

  it('explains a selected lure option using its tagged whyKey', () => {
    expect(getLureRationale(question, 'naiz', t)).toBe('lureRationaleCaseFrame:{"form":"naiz","correct":"dut"}')
  })

  it('returns null for a same-table distractor with no rationale entry', () => {
    expect(getLureRationale(question, 'duzu', t)).toBeNull()
  })

  it('returns null when the question has no optionRationale at all (e.g. a bare `form` question)', () => {
    expect(getLureRationale({ kind: 'form', correct: 'naiz' }, 'da', t)).toBeNull()
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
  const questionA = { verbId: 'izan', tense: 'present', person: 'ni', correct: 'naiz', options: ['naiz', 'haiz', 'da', 'gara'] }
  const questionB = { verbId: 'izan', tense: 'present', person: 'hi', correct: 'haiz', options: ['naiz', 'haiz', 'da', 'gara'] }
  const baseState = {
    queue: [questionA, questionB],
    total: 2,
    selected: null,
    status: 'active',
    correctCount: 0,
    streak: 0,
    misses: [],
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

  it('records a first-attempt miss with the verb/tense/person of the missed question', () => {
    const next = exerciseReducer(baseState, { type: 'answer', option: 'haiz' })

    expect(next.misses).toEqual([{ verbId: 'izan', tense: 'present', person: 'ni' }])
  })

  it('does not record a miss for a correct answer', () => {
    const next = exerciseReducer(baseState, { type: 'answer', option: 'naiz' })

    expect(next.misses).toEqual([])
  })

  it('does not record another miss for a requeued question missed again on retry', () => {
    const retryState = { ...baseState, queue: [{ ...questionA, retry: true }], total: 1, misses: [{ verbId: 'izan', tense: 'present', person: 'ni' }] }
    const next = exerciseReducer(retryState, { type: 'answer', option: 'haiz' })

    expect(next.misses).toEqual([{ verbId: 'izan', tense: 'present', person: 'ni' }])
  })

  it('does not add a malformed entry to misses for a missed match-pairs question (no `person`)', () => {
    const matchPairsQuestion = { verbId: 'izan', tense: 'present', kind: 'match-pairs', correct: 'complete' }
    const state = { ...baseState, queue: [matchPairsQuestion] }
    const next = exerciseReducer(state, { type: 'answer', option: 'incomplete' })

    expect(next.misses).toEqual([])
  })

  it('increments `attempt` on each retry instead of just setting `retry: true` once', () => {
    const state = { ...baseState, queue: [questionA], total: 1 }
    const answered = exerciseReducer(state, { type: 'answer', option: 'haiz' })
    const firstRetry = exerciseReducer(answered, { type: 'next' })
    expect(firstRetry.queue[0]).toMatchObject({ person: 'ni', retry: true, attempt: 2 })

    const answeredAgain = exerciseReducer(firstRetry, { type: 'answer', option: 'haiz' })
    const secondRetry = exerciseReducer(answeredAgain, { type: 'next' })
    expect(secondRetry.queue[0]).toMatchObject({ person: 'ni', retry: true, attempt: 3 })
  })
})

describe('buildFlagDiagnostics', () => {
  const lesson = { id: 'unit-1-izan-present', verbId: 'izan', tense: 'present' }
  const reviewLesson = { id: 'unit-5-review-1', review: true, sources: [{ verbId: 'izan', tense: 'present' }] }

  it('includes the lesson, question, and answer context', () => {
    const question = { verbId: 'izan', tense: 'present', person: 'ni', kind: 'form', correct: 'naiz', options: ['naiz', 'haiz', 'da', 'gara'] }

    const diagnostics = buildFlagDiagnostics({ lesson, question, selected: 'haiz', status: 'incorrect', language: 'en' })

    expect(diagnostics).toMatchObject({
      lessonId: 'unit-1-izan-present',
      review: false,
      verbId: 'izan',
      tense: 'present',
      person: 'ni',
      kind: 'form',
      correct: 'naiz',
      userAnswer: 'haiz',
      outcome: 'incorrect',
      language: 'en',
      question: { options: ['naiz', 'haiz', 'da', 'gara'] },
    })
    expect(diagnostics.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('marks review lessons as such', () => {
    const question = { verbId: 'izan', tense: 'present', person: 'ni', kind: 'form', correct: 'naiz', options: ['naiz', 'haiz', 'da', 'gara'] }

    const diagnostics = buildFlagDiagnostics({ lesson: reviewLesson, question, selected: 'naiz', status: 'correct', language: 'es' })

    expect(diagnostics.review).toBe(true)
    expect(diagnostics.lessonId).toBe('unit-5-review-1')
  })

  it('includes the sentence for a sentence question', () => {
    const question = { verbId: 'izan', tense: 'present', person: 'ni', kind: 'sentence', sentence: 'Ni irakaslea ___.', correct: 'naiz', options: ['naiz', 'haiz', 'da', 'gara'] }

    const diagnostics = buildFlagDiagnostics({ lesson, question, selected: 'naiz', status: 'correct', language: 'eu' })

    expect(diagnostics.question).toMatchObject({ sentence: 'Ni irakaslea ___.', options: ['naiz', 'haiz', 'da', 'gara'] })
  })

  it('omits options for a typed question', () => {
    const question = { verbId: 'izan', tense: 'present', person: 'ni', kind: 'type-verb', sentence: 'Ni irakaslea ___.', correct: 'naiz' }

    const diagnostics = buildFlagDiagnostics({ lesson, question, selected: 'naiz', status: 'correct', language: 'en' })

    expect(diagnostics.question).toEqual({ sentence: 'Ni irakaslea ___.' })
  })

  it('includes the pronoun sentence for a pronoun question', () => {
    const question = { verbId: 'izan', tense: 'present', person: 'ni', kind: 'pronoun', sentence: '___ irakaslea naiz.', correct: 'Ni', options: ['Ni', 'Hi', 'Hura', 'Gu'] }

    const diagnostics = buildFlagDiagnostics({ lesson, question, selected: 'Hi', status: 'incorrect', language: 'en' })

    expect(diagnostics.question).toMatchObject({ sentence: '___ irakaslea naiz.', options: ['Ni', 'Hi', 'Hura', 'Gu'] })
  })

  it('omits sentence/options for a typed pronoun question', () => {
    const question = { verbId: 'izan', tense: 'present', person: 'ni', kind: 'type-pronoun', sentence: '___ irakaslea naiz.', correct: 'Ni' }

    const diagnostics = buildFlagDiagnostics({ lesson, question, selected: 'ni', status: 'correct', language: 'en' })

    expect(diagnostics.question).toEqual({ sentence: '___ irakaslea naiz.' })
  })

  it('includes the negative sentence for a negative question', () => {
    const question = { verbId: 'izan', tense: 'present', person: 'ni', kind: 'negative', sentence: 'Ni ez ___ irakaslea.', correct: 'naiz', options: ['naiz', 'haiz', 'da', 'gara'] }

    const diagnostics = buildFlagDiagnostics({ lesson, question, selected: 'naiz', status: 'correct', language: 'en' })

    expect(diagnostics.question).toMatchObject({ sentence: 'Ni ez ___ irakaslea.', options: ['naiz', 'haiz', 'da', 'gara'] })
  })

  it('omits options for a typed negative question', () => {
    const question = { verbId: 'izan', tense: 'present', person: 'ni', kind: 'type-negative', sentence: 'Ni ez ___ irakaslea.', correct: 'naiz' }

    const diagnostics = buildFlagDiagnostics({ lesson, question, selected: 'naiz', status: 'correct', language: 'en' })

    expect(diagnostics.question).toEqual({ sentence: 'Ni ez ___ irakaslea.' })
  })

  it('includes the items for a spot-error question', () => {
    const items = [
      { person: 'ni', sentence: 'Ni irakaslea naiz.' },
      { person: 'hi', sentence: 'Hi irakaslea naiz.' },
    ]
    const question = { verbId: 'izan', tense: 'present', person: 'ni', kind: 'spot-error', items, options: items.map((item) => item.sentence), correct: items[1].sentence }

    const diagnostics = buildFlagDiagnostics({ lesson: reviewLesson, question, selected: items[0].sentence, status: 'incorrect', language: 'en' })

    expect(diagnostics.question).toMatchObject({ items, options: items.map((item) => item.sentence) })
  })

  it('includes the sentence and options for a verb-choice question', () => {
    const question = { verbId: 'izan', tense: 'present', person: 'ni', kind: 'verb-choice', sentence: 'Ni irakaslea ___.', correct: 'naiz', options: ['naiz', 'dut'] }

    const diagnostics = buildFlagDiagnostics({ lesson: reviewLesson, question, selected: 'dut', status: 'incorrect', language: 'en' })

    expect(diagnostics.question).toMatchObject({ sentence: 'Ni irakaslea ___.', options: ['naiz', 'dut'] })
  })

  it('includes the sentence and options for a case-mixer question', () => {
    const question = { verbId: 'izan', tense: 'present', person: 'ni', kind: 'case-mixer', sentence: 'Ni irakaslea ___.', correct: 'naiz', options: ['naiz', 'dut'] }

    const diagnostics = buildFlagDiagnostics({ lesson: reviewLesson, question, selected: 'naiz', status: 'correct', language: 'en' })

    expect(diagnostics.question).toMatchObject({ sentence: 'Ni irakaslea ___.', options: ['naiz', 'dut'] })
  })

  it('includes the source sentence and options for a reading question (#145)', () => {
    const question = {
      kind: 'reading',
      itemId: 'reading-nor-shift-ireki',
      source: 'Nik atea ireki dut.',
      gloss: { en: 'I opened the door.', es: 'Yo abrí la puerta.', eu: 'Nik atea ireki dut.' },
      prompt: { en: 'Which sentence says the same thing without naming who did it?' },
      correct: 'Atea ireki da.',
      options: ['Atea ireki da.', 'Nik atea ireki dut.'],
    }

    const diagnostics = buildFlagDiagnostics({ lesson: { id: 'unit-36-reading', review: true, kind: 'reading' }, question, selected: 'Atea ireki da.', status: 'correct', language: 'en' })

    expect(diagnostics.question).toMatchObject({ source: 'Nik atea ireki dut.', options: ['Atea ireki da.', 'Nik atea ireki dut.'] })
    expect(diagnostics.verbId).toBeUndefined()
  })

  it('includes the tokens and punctuation for a word-order question', () => {
    const tokens = [{ id: 0, text: 'Ni' }, { id: 1, text: 'irakaslea' }, { id: 2, text: 'naiz' }]
    const question = { verbId: 'izan', tense: 'present', person: 'ni', kind: 'word-order', tokens, correct: 'Ni irakaslea naiz', punctuation: '.' }

    const diagnostics = buildFlagDiagnostics({ lesson, question, selected: 'Ni irakaslea naiz', status: 'correct', language: 'en' })

    expect(diagnostics.question).toMatchObject({ tokens, punctuation: '.' })
  })

  it('includes the pairs and omits person for a match-pairs question (#434)', () => {
    const pairs = [{ person: 'ni', form: 'naiz' }, { person: 'hi', form: 'haiz' }, { person: 'hura', form: 'da' }]
    const question = { verbId: 'izan', tense: 'present', kind: 'match-pairs', pairs, correct: 'complete' }

    const diagnostics = buildFlagDiagnostics({ lesson: reviewLesson, question, selected: 'complete', status: 'correct', language: 'en' })

    expect(diagnostics.question).toMatchObject({ pairs })
    expect(diagnostics.person).toBeUndefined()
  })

})

describe('recordErrors', () => {
  it('returns the same stats object when there are no misses', () => {
    const stats = { 'izan:present:ni': { verbId: 'izan', tense: 'present', person: 'ni', count: 1, lastMissed: '2026-01-01T00:00:00.000Z' } }

    expect(recordErrors(stats, [])).toBe(stats)
  })

  it('adds a new entry for a verb/tense/person missed for the first time', () => {
    const next = recordErrors({}, [{ verbId: 'izan', tense: 'present', person: 'ni' }])

    expect(next['izan:present:ni']).toMatchObject({ verbId: 'izan', tense: 'present', person: 'ni', count: 1 })
    expect(next['izan:present:ni'].lastMissed).toBeTypeOf('string')
  })

  it('increments the count for a verb/tense/person missed again', () => {
    const stats = { 'izan:present:ni': { verbId: 'izan', tense: 'present', person: 'ni', count: 2, lastMissed: '2026-01-01T00:00:00.000Z' } }
    const next = recordErrors(stats, [{ verbId: 'izan', tense: 'present', person: 'ni' }])

    expect(next['izan:present:ni'].count).toBe(3)
  })

  it('tracks multiple misses from the same lesson independently', () => {
    const next = recordErrors({}, [
      { verbId: 'izan', tense: 'present', person: 'ni' },
      { verbId: 'izan', tense: 'present', person: 'hura' },
    ])

    expect(Object.keys(next).sort()).toEqual(['izan:present:hura', 'izan:present:ni'])
  })
})

describe('getWeakSpotQuestions', () => {
  const verbA = {
    id: 'izan',
    conjugations: { present: { ni: 'naiz', zu: 'zara', hura: 'da' } },
  }
  const verbB = {
    id: 'egon',
    conjugations: { present: { ni: 'nago', zu: 'zaude', hura: 'dago' } },
  }
  const verbs = [verbA, verbB]
  const sources = [{ verbId: 'izan', tense: 'present' }]

  it('returns no questions when there are no recorded errors', () => {
    expect(getWeakSpotQuestions({}, sources, verbs)).toEqual([])
  })

  it('generates a question for the missed person, sourced from the right verb/tense', () => {
    const stats = { 'izan:present:hura': { verbId: 'izan', tense: 'present', person: 'hura', count: 1, lastMissed: '2026-01-01T00:00:00.000Z' } }
    const [question] = getWeakSpotQuestions(stats, sources, verbs)

    expect(question).toMatchObject({ verbId: 'izan', tense: 'present', person: 'hura' })
  })

  it('ignores errors from verbs/tenses outside this lesson\'s sources', () => {
    const stats = { 'egon:present:ni': { verbId: 'egon', tense: 'present', person: 'ni', count: 5, lastMissed: '2026-01-01T00:00:00.000Z' } }

    expect(getWeakSpotQuestions(stats, sources, verbs)).toEqual([])
  })

  it('ignores errors for a person no longer present in the verb\'s table', () => {
    const stats = { 'izan:present:hi': { verbId: 'izan', tense: 'present', person: 'hi', count: 5, lastMissed: '2026-01-01T00:00:00.000Z' } }

    expect(getWeakSpotQuestions(stats, sources, verbs)).toEqual([])
  })

  it('caps the number of questions at EXTRA_REVIEW_EXERCISES, favoring the most-missed spots', () => {
    const stats = {
      'izan:present:ni': { verbId: 'izan', tense: 'present', person: 'ni', count: 1, lastMissed: '2026-01-01T00:00:00.000Z' },
      'izan:present:zu': { verbId: 'izan', tense: 'present', person: 'zu', count: 5, lastMissed: '2026-01-01T00:00:00.000Z' },
      'izan:present:hura': { verbId: 'izan', tense: 'present', person: 'hura', count: 3, lastMissed: '2026-01-01T00:00:00.000Z' },
    }
    const questions = getWeakSpotQuestions(stats, sources, verbs, 2)

    expect(questions).toHaveLength(2)
    expect(questions.map((q) => q.person)).toEqual(['zu', 'hura'])
  })

  it('exports EXTRA_REVIEW_EXERCISES as the default cap', () => {
    expect(EXTRA_REVIEW_EXERCISES).toBe(4)
  })
})

describe('getFixedArgument', () => {
  it('returns null for a verb with neither recipient nor agent', () => {
    expect(getFixedArgument({ id: 'izan', agreement: ['nor'] })).toBeNull()
  })

  it('resolves recipient into a nori-fixed argument (#142)', () => {
    expect(getFixedArgument({ id: 'esan', agreement: ['nor', 'nori', 'nork'], recipient: 'hura' })).toEqual({
      role: 'nori',
      person: 'hura',
    })
  })

  it('resolves agent into a nork-fixed argument (#142)', () => {
    expect(getFixedArgument({ id: 'eman', agreement: ['nor', 'nori', 'nork'], agent: 'ni' })).toEqual({
      role: 'nork',
      person: 'ni',
    })
  })

  it('prefers recipient when both are set', () => {
    expect(getFixedArgument({ id: 'both', recipient: 'hura', agent: 'ni' })).toEqual({ role: 'nori', person: 'hura' })
  })
})

describe('agreementsCompatible', () => {
  it('treats two nor-only verbs as compatible', () => {
    expect(agreementsCompatible(['nor'], ['nor'])).toBe(true)
  })

  it('treats two nor-nork verbs as compatible', () => {
    expect(agreementsCompatible(['nor', 'nork'], ['nor', 'nork'])).toBe(true)
  })

  it('treats nor and nor-nork verbs as incompatible', () => {
    expect(agreementsCompatible(['nor'], ['nor', 'nork'])).toBe(false)
  })

  it('treats nor-nork and nor-nori-nork verbs as incompatible (#142)', () => {
    expect(agreementsCompatible(['nor', 'nork'], ['nor', 'nori', 'nork'])).toBe(false)
  })

  it('treats two nor-nori-nork verbs as compatible (#142)', () => {
    expect(agreementsCompatible(['nor', 'nori', 'nork'], ['nor', 'nori', 'nork'])).toBe(true)
  })
})

describe('ditransitive (NOR-NORI-NORK) verb metadata (#142)', () => {
  const PERSONS = ['ni', 'hi', 'zu', 'hura', 'gu', 'zuek', 'haiek']

  it('gives every ditransitive verb exactly one resolvable fixed argument', () => {
    VERBS.filter((verb) => verb.agreement.includes('nori') && verb.agreement.includes('nork')).forEach((verb) => {
      const fixedArgument = getFixedArgument(verb)
      expect(fixedArgument).not.toBeNull()
      expect(['nori', 'nork']).toContain(fixedArgument.role)
      expect(PERSONS).toContain(fixedArgument.person)
      expect(verb.recipient && verb.agent).toBeFalsy()
    })
  })
})

describe('generateReadingQuestions (#145)', () => {
  const items = [
    { id: 'a', source: 'Nik atea ireki dut.', gloss: { en: 'I opened the door.' }, prompt: { en: 'Which sentence says the same thing without naming who did it?' }, options: ['Atea ireki da.', 'Nik atea ireki dut.', 'Atea ireki dute.', 'Atea irekitzen da.'], answer: 'Atea ireki da.' },
    { id: 'b', source: 'Haurrak leihoa hautsi du.', gloss: { en: 'The child broke the window.' }, prompt: { en: 'Which sentence says the same thing without naming who did it?' }, options: ['Leihoa hautsi da.', 'Haurrak leihoa hautsi du.', 'Leihoa hausten du.', 'Leihoak haurra hautsi du.'], answer: 'Leihoa hautsi da.' },
  ]

  it('produces one `kind: \'reading\'` question per item by default, carrying through source/gloss/prompt/correct', () => {
    const questions = generateReadingQuestions(items)

    expect(questions).toHaveLength(items.length)
    questions.forEach((question) => {
      const item = items.find((candidate) => candidate.id === question.itemId)
      expect(question.kind).toBe('reading')
      expect(question.source).toBe(item.source)
      expect(question.gloss).toBe(item.gloss)
      expect(question.prompt).toBe(item.prompt)
      expect(question.correct).toBe(item.answer)
    })
  })

  it('keeps every item\'s options intact (same set, correct answer included) but possibly reordered', () => {
    const questions = generateReadingQuestions(items)

    questions.forEach((question) => {
      const item = items.find((candidate) => candidate.id === question.itemId)
      expect(question.options).toContain(question.correct)
      expect(new Set(question.options)).toEqual(new Set(item.options))
    })
  })

  it('repeats and reshuffles the item set for `rounds > 1`', () => {
    const questions = generateReadingQuestions(items, { rounds: 3 })

    expect(questions).toHaveLength(items.length * 3)
    for (const item of items) {
      expect(questions.filter((question) => question.itemId === item.id)).toHaveLength(3)
    }
  })

  it('produces well-formed questions for every item in READING_ITEMS', () => {
    const questions = generateReadingQuestions(READING_ITEMS)

    expect(questions).toHaveLength(READING_ITEMS.length)
    questions.forEach((question) => {
      expect(question.options).toContain(question.correct)
      expect(new Set(question.options).size).toBe(question.options.length)
      expect(question.gloss.en).toBeTruthy()
      expect(question.prompt.en).toBeTruthy()
    })
  })
})
