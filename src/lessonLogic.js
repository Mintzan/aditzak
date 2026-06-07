// Pure lesson/exercise logic, kept separate from App.jsx so it can be unit
// tested directly and so react-refresh only has to reason about components
// in App.jsx (it warns when a component file also exports plain functions).

export function computeStars(score, total) {
  if (total === 0) return 0
  const ratio = score / total
  if (ratio >= 1) return 3
  if (ratio >= 0.8) return 2
  if (ratio >= 0.5) return 1
  return 0
}

// Encouraging copy for the end-of-lesson screen, picked from the same
// score-ratio bands as `computeStars` so the message always matches the stars
// shown alongside it.
export function getEncouragement(correctCount, total) {
  const stars = computeStars(correctCount, total)
  switch (stars) {
    case 3:
      return {
        icon: '🎉',
        headline: 'Bikain!',
        message: 'Perfect score — every answer right. You really know this one!',
      }
    case 2:
      return {
        icon: '👏',
        headline: 'Oso ondo!',
        message: 'Great job — only a couple slipped by. One more round and you’ll have it nailed.',
      }
    case 1:
      return {
        icon: '💪',
        headline: 'Ondo!',
        message: 'Solid progress. Keep practicing this lesson and the forms will start to click.',
      }
    default:
      return {
        icon: '🌱',
        headline: 'Ez etsi!',
        message: 'Don’t give up — conjugation sinks in with repetition. Try this lesson again, you’ve got this.',
      }
  }
}

// Mid-lesson momentum nudges: shown in the feedback bar exactly when a streak
// of consecutive correct answers *lands* on one of these milestones — not on
// every answer past it — so the message appears once per streak rather than
// repeating itself each turn.
const STREAK_MILESTONES = [
  { streak: 5, icon: '🔥', headline: 'Zoragarria!', message: 'Five in a row — you’re finding your rhythm.' },
  { streak: 10, icon: '⚡', headline: 'Itzela!', message: 'Ten in a row — you’re really on fire.' },
  { streak: 20, icon: '🚀', headline: 'Ikaragarria!', message: 'Twenty in a row — pure mastery.' },
]

export function getStreakEncouragement(streak) {
  return STREAK_MILESTONES.find((milestone) => milestone.streak === streak) ?? null
}

export function recordResult(progress, lessonId, result) {
  const previous = progress[lessonId]
  const stars = computeStars(result.correctCount, result.total)
  return {
    ...progress,
    [lessonId]: {
      attempts: (previous?.attempts ?? 0) + 1,
      bestScore: Math.max(result.correctCount, previous?.bestScore ?? 0),
      totalQuestions: result.total,
      bestStars: Math.max(stars, previous?.bestStars ?? 0),
      lastPlayed: new Date().toISOString(),
    },
  }
}

// A lesson unlocks once the lesson before it has been attempted at least once.
export function getUnlockedLessonIds(lessons, progress) {
  const unlocked = new Set()
  lessons.forEach((lesson, index) => {
    const previous = lessons[index - 1]
    if (index === 0 || (progress[previous.id]?.attempts ?? 0) > 0) {
      unlocked.add(lesson.id)
    }
  })
  return unlocked
}

export function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Chance that a person with an example sentence gets framed as a
// "complete the sentence" question rather than a bare-form one — rolled once
// per question so a lesson ends up with a mix of both styles rather than
// being uniformly one or the other.
const SENTENCE_QUESTION_CHANCE = 0.5

function rollQuestionKind(hasSentence) {
  return hasSentence && Math.random() < SENTENCE_QUESTION_CHANCE ? 'sentence' : 'form'
}

// One question per grammatical person; the three distractors are always the
// other conjugated forms from that same table, so every option is a plausible
// Basque verb form regardless of question style.
//
// Where the verb carries an example sentence for that person/tense
// (`verb.sentences`), the question is sometimes framed as filling in the `___`
// blank in that sentence (`kind: 'sentence'`) instead of recognising the bare
// form (`kind: 'form'`) — purely for variety in how the same recall is
// exercised; persons without a sentence always fall back to the bare form.
export function generateQuestions(verb, tense) {
  const table = verb.conjugations[tense]
  const sentences = verb.sentences?.[tense] ?? {}
  const persons = Object.keys(table)
  return shuffle(persons).map((person) => {
    const correct = table[person]
    const distractors = shuffle(persons.filter((candidate) => candidate !== person).map((candidate) => table[candidate])).slice(0, 3)
    const options = shuffle([correct, ...distractors])
    const sentence = sentences[person]
    return rollQuestionKind(Boolean(sentence)) === 'sentence'
      ? { kind: 'sentence', person, sentence, correct, options }
      : { kind: 'form', person, correct, options }
  })
}

// The exercise works through a queue rather than a fixed list: a question
// answered correctly is dropped, one answered incorrectly is pushed to the
// back (marked `retry`) so it resurfaces later in the same session — the
// lesson isn't done until the queue is empty, i.e. every question has
// eventually been answered correctly. `correctCount` only credits *first*
// attempts, so the final score (and star rating) reflects how many forms the
// learner actually knew rather than how many they eventually got via retries.
export function exerciseReducer(state, action) {
  switch (action.type) {
    case 'answer': {
      if (state.status !== 'active') return state
      const question = state.queue[0]
      const isCorrect = action.option === question.correct
      const countsTowardScore = isCorrect && !question.retry
      return {
        ...state,
        selected: action.option,
        status: isCorrect ? 'correct' : 'incorrect',
        correctCount: state.correctCount + (countsTowardScore ? 1 : 0),
        streak: isCorrect ? state.streak + 1 : 0,
      }
    }
    case 'next': {
      const [current, ...rest] = state.queue
      const queue = state.status === 'correct' ? rest : [...rest, { ...current, retry: true }]
      return { ...state, queue, selected: null, status: 'active' }
    }
    default:
      return state
  }
}
