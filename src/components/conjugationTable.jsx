import { useLanguage } from '../i18n/LanguageContext'
import { PERSON_LABEL_KEYS } from '../data/verbs'
import { getComposedTable, resolveObjectAxisTable } from '../lessonLogic'

// The full person-by-person conjugation grid for one verb/tense — shown as a
// reference both on `LessonPreviewScreen` (before a learner's first attempt
// at a lesson) and in `UnitOverviewModal` (a unit's "what's coming" preview).
// Always shows every person `getComposedTable` returns, even when the
// lesson(s) drilling this verb/tense restrict practice to a subset (e.g.
// `PHASE_1_PERSONS`) — the full paradigm is a useful reference regardless of
// how much of it gets quizzed yet.
//
// `objectAxis` (optional) must be passed for any `*ByObject`/`*ByNor` tense
// (e.g. Unit 16's `presentByObject`) — `getComposedTable` returns those as a
// 2D `{ [outer]: { [inner]: form } }` grid, not the flat `{ [person]: form }`
// shape this component renders, so without resolving through it first,
// `form` below would be a nested object instead of a string.
export function ConjugationTable({ verb, tense, objectAxis }) {
  const { t } = useLanguage()
  const composed = getComposedTable(verb, tense)
  const table = objectAxis ? resolveObjectAxisTable(composed, objectAxis) : composed
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200">
      {Object.entries(table).map(([person, form], index) => (
        <div key={person} className={`flex items-center justify-between px-4 py-3 ${index > 0 ? 'border-t border-gray-100' : ''}`}>
          <div>
            <p className="font-semibold text-gray-800">{(verb.pronouns?.[person] ?? person).toLowerCase()}</p>
            <p className="text-xs text-gray-400">{t(PERSON_LABEL_KEYS[person])}</p>
          </div>
          <p className="text-xl font-extrabold text-gray-900">{form}</p>
        </div>
      ))}
    </div>
  )
}
