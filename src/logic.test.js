import { describe, expect, it } from 'vitest'
import {
  computeStars,
  exerciseReducer,
  generateQuestions,
  getEncouragement,
  getStreakEncouragement,
  getUnlockedLessonIds,
  recordResult,
  shuffle,
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

  it('always returns a non-empty icon, headline and message', () => {
    ;[
      [0, 0],
      [0, 5],
      [5, 5],
    ].forEach(([correctCount, total]) => {
      const { icon, headline, message } = getEncouragement(correctCount, total)
      expect(icon).toBeTruthy()
      expect(headline).toBeTruthy()
      expect(message).toBeTruthy()
    })
  })
})

describe('getStreakEncouragement', () => {
  it('returns nothing for streaks that are not a milestone', () => {
    ;[0, 1, 4, 6, 9, 11, 19, 21].forEach((streak) => {
      expect(getStreakEncouragement(streak)).toBeNull()
    })
  })

  it('returns a non-empty icon, headline and message exactly on milestone streaks', () => {
    ;[5, 10, 20].forEach((streak) => {
      const { icon, headline, message } = getStreakEncouragement(streak)
      expect(icon).toBeTruthy()
      expect(headline).toBeTruthy()
      expect(message).toBeTruthy()
    })
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
})

describe('generateQuestions', () => {
  const verb = {
    conjugations: {
      present: { ni: 'naiz', hi: 'haiz', hura: 'da', gu: 'gara', zuek: 'zarete', haiek: 'dira' },
    },
  }
  const persons = Object.keys(verb.conjugations.present)

  it('produces exactly one question per grammatical person', () => {
    const questions = generateQuestions(verb, 'present')

    expect(questions).toHaveLength(persons.length)
    expect(questions.map((q) => q.person).sort()).toEqual([...persons].sort())
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
