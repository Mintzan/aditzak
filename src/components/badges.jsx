import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { AGREEMENT_META, DIALECT_LABELS, PERSON_LABEL_KEYS, TYPE_META } from '../data/verbs'
import { getFixedArgument, getHeartsRegenRemainingMs, MAX_HEARTS } from '../lessonLogic'
import { HeartIcon } from './icons'

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

// `showCountdown` controls whether the "next heart in Xh Ym" line renders
// below the count — used compactly (count only) in `HomeScreen`'s header
// pill row, and with the countdown in the Profile tab's dedicated hearts
// card. The countdown ticks down live via a plain interval that only ever
// re-renders this component — it never touches `hearts` itself (that stays
// exactly the lazily-recomputed value `App.jsx` passed in), so this is
// purely cosmetic and doesn't fight the "no background regen timer" design
// (see `docs/HEART_ECONOMY_ANALYSIS.md`).
//
// `onClick`, when given, renders the pill as a button (e.g. the header usage
// links through to the Profile tab's full hearts card) instead of a static
// `div` — the Profile tab's own `showCountdown` usage passes no `onClick`
// since it's already the destination.
export function HeartsBadge({ hearts, showCountdown = false, onClick }) {
  const { t } = useLanguage()
  const currentHearts = hearts?.currentHearts ?? MAX_HEARTS
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!showCountdown || currentHearts >= MAX_HEARTS) return
    const interval = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(interval)
  }, [showCountdown, currentHearts])

  const remainingMs = showCountdown ? getHeartsRegenRemainingMs(hearts, now) : 0
  const hours = Math.floor(remainingMs / (60 * 60 * 1000))
  const minutes = Math.ceil((remainingMs % (60 * 60 * 1000)) / 60000)
  const Wrapper = onClick ? 'button' : 'div'

  return (
    <div className="flex flex-col items-end gap-0.5">
      <Wrapper
        {...(onClick ? { type: 'button', onClick } : {})}
        className={`flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1.5 text-sm font-bold text-rose-600 ${
          onClick ? 'transition active:scale-95' : ''
        }`}
        aria-label={t('heartsLabel', { count: currentHearts, max: MAX_HEARTS })}
      >
        <HeartIcon className="h-4 w-4" />
        <span>
          {currentHearts}
          <span className="font-normal text-rose-400">/{MAX_HEARTS}</span>
        </span>
      </Wrapper>
      {showCountdown && currentHearts < MAX_HEARTS && <span className="text-xs text-gray-400">{t('heartsNextIn', { hours, minutes })}</span>}
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
