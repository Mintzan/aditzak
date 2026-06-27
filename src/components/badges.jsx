import { useLanguage } from '../i18n/LanguageContext'
import { AGREEMENT_META, DIALECT_LABELS, PERSON_LABEL_KEYS, TYPE_META } from '../data/verbs'
import { getFixedArgument } from '../lessonLogic'

export function TypeBadge({ type }) {
  const { t } = useLanguage()
  const meta = TYPE_META[type]
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.className}`}>
      {t(meta.labelKey)} · {meta.basqueLabel}
    </span>
  )
}

export function AgreementBadge({ role }) {
  const { t } = useLanguage()
  const meta = AGREEMENT_META[role]
  return (
    <span title={t(meta.titleKey)} className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.className}`}>
      {meta.label}
    </span>
  )
}

// For a NOR-NORI-NORK lesson (#142), shows which argument is fixed for this
// lesson/question — e.g. "NORI: hura" for `recipient: 'hura'` (every form
// means "... to him/her") or "NORK: ni" for `agent: 'ni'` (every form means
// "I ..."). `fixedArgument` is `getFixedArgument(verb)`'s `{ role, person }`
// result; renders nothing for the `null` every non-ditransitive verb returns.
export function FixedArgumentBadge({ fixedArgument }) {
  const { t } = useLanguage()
  if (!fixedArgument) return null
  const { role, person } = fixedArgument
  return (
    <span title={t('fixedArgumentTitle')} className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${AGREEMENT_META[role].className}`}>
      {AGREEMENT_META[role].label}: {t(PERSON_LABEL_KEYS[person])}
    </span>
  )
}

export function DialectBadge({ dialect }) {
  return (
    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-gray-500">
      {DIALECT_LABELS[dialect] ?? dialect}
    </span>
  )
}

export function VerbBadgeRow({ verb }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <TypeBadge type={verb.type} />
      {verb.agreement.map((role) => (
        <AgreementBadge key={role} role={role} />
      ))}
      <DialectBadge dialect={verb.dialect} />
      <FixedArgumentBadge fixedArgument={getFixedArgument(verb)} />
    </div>
  )
}

export function Stars({ count }) {
  const { t } = useLanguage()
  return (
    <div className="flex gap-0.5 text-base text-amber-400" aria-label={t('starsLabel', { count })}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < count ? 'opacity-100' : 'opacity-20'}>
          ★
        </span>
      ))}
    </div>
  )
}

export function ProgressBar({ value }) {
  const pct = Math.min(100, Math.max(0, value * 100))
  return (
    <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-gray-200">
      <div className="h-full rounded-full bg-green-500 transition-all duration-300 ease-out" style={{ width: `${pct}%` }} />
    </div>
  )
}
