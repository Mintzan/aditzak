import { describe, expect, it } from 'vitest'
import { pickResultVibrationPattern } from './hapticsUtils'

describe('pickResultVibrationPattern', () => {
  it('returns a non-empty pattern for every star band', () => {
    ;[0, 1, 2, 3].forEach((stars) => {
      const pattern = pickResultVibrationPattern(stars)
      expect(Array.isArray(pattern)).toBe(true)
      expect(pattern.length).toBeGreaterThan(0)
      pattern.forEach((duration) => expect(duration).toBeGreaterThan(0))
    })
  })

  it('wraps the variant index so any integer is safe', () => {
    const pattern = pickResultVibrationPattern(3, 100)
    expect(Array.isArray(pattern)).toBe(true)
  })

  it('falls back to the 0-star pattern for unknown star counts', () => {
    expect(pickResultVibrationPattern(4)).toEqual(pickResultVibrationPattern(0))
  })
})
