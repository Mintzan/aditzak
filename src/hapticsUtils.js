// Tiny wrapper around the Vibration API for answer feedback. `navigator.vibrate`
// is unsupported on iOS Safari and some embedded webviews, so `?.` makes every
// call a silent no-op there rather than throwing.

const CORRECT_PATTERN = 15
const INCORRECT_PATTERN = [60, 50, 60]

export function vibrateCorrect() {
  navigator.vibrate?.(CORRECT_PATTERN)
}

export function vibrateIncorrect() {
  navigator.vibrate?.(INCORRECT_PATTERN)
}

// End-of-lesson celebration patterns, keyed by star count (see
// `computeStars`). Each band has a few interchangeable patterns so finishing
// with the same score twice in a row doesn't always feel identical — same
// idea as `ENCOURAGEMENT_VARIANTS` in lessonLogic.js. 3-star patterns build to
// a long final buzz to match the confetti/fireworks; 0-star is a single
// gentle pulse, just enough to mark "done" without feeling like a punishment.
const RESULT_PATTERNS = {
  3: [
    [40, 60, 40, 60, 40, 60, 160],
    [30, 30, 30, 30, 30, 30, 30, 30, 200],
    [100, 80, 100, 80, 250],
  ],
  2: [
    [50, 60, 90],
    [40, 50, 40, 50, 80],
  ],
  1: [[50, 80, 50]],
  0: [[80]],
}

export function pickResultVibrationPattern(stars, variantIndex = 0) {
  const patterns = RESULT_PATTERNS[stars] ?? RESULT_PATTERNS[0]
  return patterns[variantIndex % patterns.length]
}

export function vibrateResult(stars) {
  const patterns = RESULT_PATTERNS[stars] ?? RESULT_PATTERNS[0]
  const variantIndex = Math.floor(Math.random() * patterns.length)
  navigator.vibrate?.(pickResultVibrationPattern(stars, variantIndex))
}
