import { describe, expect, it } from 'vitest'
import { buildFlagDiagnostics } from './lessonLogic.js'
import { isValidDiagnostics } from '../worker/src/index.js'

// Regression test for #434: the feedback worker's `isValidDiagnostics`
// (worker/src/index.js) must accept every shape `buildFlagDiagnostics` can
// produce, across every question kind — the two drifted out of sync once
// before (word-order/match-pairs/reading/verb-choice/case-mixer all 400'd).
// One fixture question per kind, run through the same path the app uses
// (`buildFlagDiagnostics` then the worker's validator), so a future kind
// added to one side without the other fails fast here instead of in
// production.
describe('feedback worker diagnostics validation (#434)', () => {
  const lesson = { id: 'unit-1-izan-present', verbId: 'izan', tense: 'present' }
  const reviewLesson = { id: 'unit-5-review-1', review: true, sources: [{ verbId: 'izan', tense: 'present' }] }

  const questionsByKind = {
    form: { verbId: 'izan', tense: 'present', person: 'ni', kind: 'form', correct: 'naiz', options: ['naiz', 'haiz', 'da', 'gara'] },
    sentence: { verbId: 'izan', tense: 'present', person: 'ni', kind: 'sentence', sentence: 'Ni irakaslea ___.', correct: 'naiz', options: ['naiz', 'haiz', 'da', 'gara'] },
    'type-verb': { verbId: 'izan', tense: 'present', person: 'ni', kind: 'type-verb', sentence: 'Ni irakaslea ___.', correct: 'naiz' },
    pronoun: { verbId: 'izan', tense: 'present', person: 'ni', kind: 'pronoun', sentence: '___ irakaslea naiz.', correct: 'Ni', options: ['Ni', 'Hi', 'Hura', 'Gu'] },
    'type-pronoun': { verbId: 'izan', tense: 'present', person: 'ni', kind: 'type-pronoun', sentence: '___ irakaslea naiz.', correct: 'Ni' },
    negative: { verbId: 'izan', tense: 'present', person: 'ni', kind: 'negative', sentence: 'Ni ez ___ irakaslea.', correct: 'naiz', options: ['naiz', 'haiz', 'da', 'gara'] },
    'type-negative': { verbId: 'izan', tense: 'present', person: 'ni', kind: 'type-negative', sentence: 'Ni ez ___ irakaslea.', correct: 'naiz' },
    'spot-error': {
      verbId: 'izan',
      tense: 'present',
      person: 'ni',
      kind: 'spot-error',
      items: [
        { person: 'ni', sentence: 'Ni irakaslea naiz.' },
        { person: 'hi', sentence: 'Hi irakaslea naiz.' },
      ],
      options: ['Ni irakaslea naiz.', 'Hi irakaslea naiz.'],
      correct: 'Hi irakaslea naiz.',
    },
    'word-order': {
      verbId: 'izan',
      tense: 'present',
      person: 'ni',
      kind: 'word-order',
      tokens: [{ id: 0, text: 'Ni' }, { id: 1, text: 'irakaslea' }, { id: 2, text: 'naiz' }],
      correct: 'Ni irakaslea naiz',
      punctuation: '.',
    },
    'verb-choice': { verbId: 'izan', tense: 'present', person: 'ni', kind: 'verb-choice', sentence: 'Ni irakaslea ___.', correct: 'naiz', options: ['naiz', 'dut'] },
    'case-mixer': { verbId: 'izan', tense: 'present', person: 'ni', kind: 'case-mixer', sentence: 'Ni irakaslea ___.', correct: 'naiz', options: ['naiz', 'dut'] },
    'match-pairs': {
      verbId: 'izan',
      tense: 'present',
      kind: 'match-pairs',
      pairs: [{ person: 'ni', form: 'naiz' }, { person: 'hi', form: 'haiz' }, { person: 'hura', form: 'da' }],
      correct: 'complete',
    },
    'suffix-choice': { verbId: 'erosi', tense: 'future', kind: 'suffix-choice', infinitive: 'erosi', correct: '-ko', options: ['-ko', '-go'] },
    reading: {
      kind: 'reading',
      itemId: 'reading-nor-shift-ireki',
      source: 'Nik atea ireki dut.',
      gloss: { en: 'I opened the door.', es: 'Yo abrí la puerta.', eu: 'Nik atea ireki dut.' },
      prompt: { en: 'Which sentence says the same thing without naming who did it?' },
      correct: 'Atea ireki da.',
      options: ['Atea ireki da.', 'Nik atea ireki dut.'],
    },
  }

  it.each(Object.keys(questionsByKind))('accepts a %s question', (kind) => {
    const question = questionsByKind[kind]
    const diagnostics = buildFlagDiagnostics({ lesson: kind === 'reading' ? reviewLesson : lesson, question, selected: question.correct, status: 'correct', language: 'en' })

    expect(isValidDiagnostics(diagnostics)).toBe(true)
  })

  it('also accepts a null userAnswer (unanswered question flagged before submitting)', () => {
    const diagnostics = buildFlagDiagnostics({ lesson, question: questionsByKind.form, selected: null, status: 'active', language: 'en' })

    expect(isValidDiagnostics(diagnostics)).toBe(true)
  })
})
