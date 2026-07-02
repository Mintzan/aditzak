import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { trackEvent } from '../analytics'
import { getShareUrl, shareContent } from '../shareUtils'
import { LESSONS } from '../data/lessons'
import { BONUS_LESSON_IDS, GATE_LESSON_IDS, JOURNEY } from '../journey'
import {
  canBuyHeart,
  canRepairStreak,
  getActiveStreak,
  getLocalDateString,
  getPointsBalance,
  getUnlockedLessonIds,
  HEART_COST_POINTS,
  isLockedByGateScore,
  isLockedOut,
  MAX_HEARTS,
  STREAK_REPAIR_COST,
} from '../lessonLogic'
import { describeLesson, journeyText } from '../lessonDisplay'
import { FixedArgumentBadge, HeartsBadge, Stars } from '../components/badges'
import { MascotAvatar } from '../components/mascot'
import { FEEDBACK_API_URL, FEEDBACK_EMAIL_MAX_LENGTH, FEEDBACK_MESSAGE_MAX_LENGTH, SYNC_API_URL } from '../api'
import {
  BonusIcon,
  CheckIcon,
  CloudIcon,
  EnvelopeIcon,
  GateIcon,
  HeartBrokenIcon,
  HomeIcon,
  LockIcon,
  PointsIcon,
  ProfileIcon,
  ProgressIcon,
  RepeatIcon,
  StreakIcon,
  TrophyIcon,
} from '../components/icons'

// `heartLocked` is a *depletion-only* restriction layered on top of `locked`
// (the existing progression/gate lock) — it only ever applies to a lesson
// `locked` already says is otherwise available, per
// `docs/HEART_ECONOMY_ANALYSIS.md`'s "Resolved" point 1. A `locked` lesson
// keeps its existing (disabled, unclickable) treatment regardless of hearts;
// only a heart-locked-but-otherwise-unlocked lesson stays clickable so tapping
// it can surface `onHeartLocked`'s nudge instead of silently doing nothing.
function LessonNode({ lesson, locked, heartLocked, needsGateScore, stars, onSelect, onHeartLocked }) {
  const { t, language } = useLanguage()
  const { icon, title, subtitle, recognitionOnly, fixedArgument } = describeLesson(lesson, t, language)
  const unavailable = locked || heartLocked
  return (
    <button
      type="button"
      id={`lesson-${lesson.id}`}
      disabled={locked}
      onClick={() => (heartLocked ? onHeartLocked() : onSelect(lesson.id))}
      style={{ minHeight: 48 }}
      className={`flex w-full scroll-mt-20 items-center gap-4 rounded-2xl border-2 p-4 text-left transition active:scale-[0.98] ${
        unavailable
          ? 'cursor-not-allowed border-neutral-800 bg-gray-100 opacity-60'
          : 'border-neutral-800 bg-white hover:border-green-400 hover:shadow-md'
      }`}
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-extrabold ${
          unavailable ? 'bg-neutral-400 text-neutral-600' : 'bg-brand-forest text-white'
        }`}
        aria-hidden="true"
      >
        {locked ? (
          needsGateScore ? (
            <GateIcon className="h-6 w-6" />
          ) : (
            <LockIcon className="h-6 w-6" />
          )
        ) : heartLocked ? (
          <HeartBrokenIcon className="h-6 w-6" />
        ) : lesson.review ? (
          <RepeatIcon className="h-6 w-6" />
        ) : (
          <span className="text-xl">{icon}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">
          {title.main} <span className="font-normal text-gray-400">· {title.secondary}</span>
        </p>
        <p className="truncate text-sm text-gray-500">
          {subtitle.main} — {subtitle.secondary}
        </p>
        {recognitionOnly && <p className="mt-1 text-sm font-semibold text-neutral-600">{t('recognitionOnly')}</p>}
        {needsGateScore && <p className="mt-1 text-sm font-semibold text-semantic-warning">{t('gateNeedsScore')}</p>}
        {heartLocked && <p className="mt-1 text-sm font-semibold text-rose-600">{t('heartsLockedHint')}</p>}
        {fixedArgument && (
          <div className="mt-1">
            <FixedArgumentBadge fixedArgument={fixedArgument} />
          </div>
        )}
      </div>
      <Stars count={stars} />
    </button>
  )
}

function LessonList({ lessons, progress, unlockedIds, hearts, onSelect, onHeartLocked }) {
  return (
    <div className="flex flex-col gap-3">
      {lessons.map((lesson) => {
        const locked = !unlockedIds.has(lesson.id)
        return (
          <LessonNode
            key={lesson.id}
            lesson={lesson}
            locked={locked}
            heartLocked={!locked && isLockedOut(hearts, lesson.id, progress)}
            needsGateScore={isLockedByGateScore(LESSONS, progress, GATE_LESSON_IDS, lesson.id)}
            stars={progress[lesson.id]?.bestStars ?? 0}
            onSelect={onSelect}
            onHeartLocked={onHeartLocked}
          />
        )
      })}
    </div>
  )
}

// A pending unit isn't playable yet, so it renders as a locked roadmap card
// instead of a `LessonNode` — title/focus/payload from `journey.js` give a
// preview of what's coming, with a "Coming soon" badge in place of stars.
// Refresh Gate units (`unit.gate`) get a shield icon instead of a lock to set
// them apart as checkpoints rather than ordinary lessons.
function PendingUnitCard({ unit }) {
  const { t, language } = useLanguage()
  const title = journeyText('units', unit.number, 'title', language, unit.title)
  const focus = journeyText('units', unit.number, 'focus', language, unit.focus)
  const payload = unit.payload ? journeyText('units', unit.number, 'payload', language, unit.payload) : null
  return (
    <div className="flex items-start gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 opacity-70">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-400"
        aria-hidden="true"
      >
        {unit.gate ? <GateIcon className="h-6 w-6" /> : <LockIcon className="h-6 w-6" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-700">
          {t('unitLabel', { number: unit.number })} <span className="font-normal text-gray-400">· {title}</span>
        </p>
        <p className="mt-0.5 text-sm text-gray-500 break-words">{focus}</p>
        {payload && <p className="mt-1 text-sm text-gray-400 italic break-words">{payload}</p>}
        <span className="mt-2 inline-block rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-500">{t('comingSoon')}</span>
      </div>
    </div>
  )
}

// An available unit's `lessonIds` point at entries in `LESSONS` — render each
// as a `LessonNode`, with the unit's title/focus from `journey.js` as a label
// above them.
function UnitLessons({ unit, progress, unlockedIds, hearts, onSelect, onHeartLocked }) {
  const { t, language } = useLanguage()
  const lessons = unit.lessonIds.map((id) => LESSONS.find((lesson) => lesson.id === id))
  const title = journeyText('units', unit.number, 'title', language, unit.title)
  const focus = journeyText('units', unit.number, 'focus', language, unit.focus)
  return (
    <div>
      <p className="font-semibold text-gray-900">
        {t('unitLabel', { number: unit.number })} <span className="font-normal text-gray-400">· {title}</span>
        {unit.bonus && (
          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-brand-txakoli-tint px-2 py-0.5 align-middle text-xs font-semibold text-brand-txakoli-text">
            <BonusIcon className="h-3 w-3" /> {t('bonusLabel')}
          </span>
        )}
      </p>
      <p className="mt-0.5 mb-2 text-sm text-gray-500 break-words">{focus}</p>
      <LessonList lessons={lessons} progress={progress} unlockedIds={unlockedIds} hearts={hearts} onSelect={onSelect} onHeartLocked={onHeartLocked} />
    </div>
  )
}

function StageSection({ stage, progress, unlockedIds, hearts, onSelect, onHeartLocked }) {
  const { language } = useLanguage()
  const title = journeyText('stages', stage.id, 'title', language, stage.title)
  return (
    <section className="mb-6">
      <h3 className="mb-3 text-sm font-bold tracking-wide text-gray-400 uppercase">{title}</h3>
      <div className="flex flex-col gap-4">
        {stage.units.map((unit) =>
          unit.status === 'available' ? (
            <UnitLessons
              key={unit.number}
              unit={unit}
              progress={progress}
              unlockedIds={unlockedIds}
              hearts={hearts}
              onSelect={onSelect}
              onHeartLocked={onHeartLocked}
            />
          ) : (
            <PendingUnitCard key={unit.number} unit={unit} />
          ),
        )}
      </div>
    </section>
  )
}

function PhaseSection({ phase, progress, unlockedIds, hearts, onSelect, onHeartLocked }) {
  const { language } = useLanguage()
  const title = journeyText('phases', phase.id, 'title', language, phase.title)
  const subtitle = journeyText('phases', phase.id, 'subtitle', language, phase.subtitle)
  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      {phase.stages.map((stage) => (
        <StageSection
          key={stage.id}
          stage={stage}
          progress={progress}
          unlockedIds={unlockedIds}
          hearts={hearts}
          onSelect={onSelect}
          onHeartLocked={onHeartLocked}
        />
      ))}
    </section>
  )
}

// The home tab's lesson list is now driven by `JOURNEY` (`journey.js`) rather
// than `LESSONS` directly: it walks phases → stages → units so the full
// curriculum roadmap is visible, with available units rendering their
// `LessonNode`s and pending units rendering locked `PendingUnitCard`s.
function JourneyTab({ progress, hearts, onSelectLesson, onHeartLocked }) {
  const { t } = useLanguage()
  const unlockedIds = useMemo(() => getUnlockedLessonIds(LESSONS, progress, undefined, GATE_LESSON_IDS, BONUS_LESSON_IDS), [progress])

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <MascotAvatar />
        <p className="text-sm text-gray-500">{t('homeIntro')}</p>
      </div>
      {JOURNEY.map((phase) => (
        <PhaseSection
          key={phase.id}
          phase={phase}
          progress={progress}
          unlockedIds={unlockedIds}
          hearts={hearts}
          onSelect={onSelectLesson}
          onHeartLocked={onHeartLocked}
        />
      ))}
    </div>
  )
}

function ProgressTab({ progress }) {
  const { t, tCount, language } = useLanguage()
  // The header's stars pill only shows the bare current count (narrow
  // screens don't have room for "/max" — see docs/DECISIONS.md) and links
  // here, so this is now the only place the full "X of Y" curriculum-wide
  // total lives.
  const totalStars = LESSONS.reduce((sum, lesson) => sum + (progress[lesson.id]?.bestStars ?? 0), 0)
  const maxStars = LESSONS.length * 3
  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-gray-900">{t('progressTitle')}</h2>
      <p className="mb-4 text-sm text-gray-500">{t('progressStarsSummary', { total: totalStars, max: maxStars })}</p>
      <div className="flex flex-col gap-3">
        {LESSONS.map((lesson) => {
          const { heading } = describeLesson(lesson, t, language)
          const entry = progress[lesson.id]
          const needsGateScore = isLockedByGateScore(LESSONS, progress, GATE_LESSON_IDS, lesson.id)
          return (
            <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{heading}</p>
                <p className="truncate text-sm text-gray-500">
                  {entry
                    ? `${t('progressBest', { best: entry.bestScore, total: entry.totalQuestions })} · ${tCount('attempt', entry.attempts)}`
                    : t('progressNotStarted')}
                </p>
                {needsGateScore && <p className="mt-1 text-sm font-semibold text-semantic-warning">{t('gateNeedsScore')}</p>}
              </div>
              <Stars count={entry?.bestStars ?? 0} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FeedbackModal({ onClose }) {
  const { t } = useLanguage()
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorDetail, setErrorDetail] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (!message.trim() || status === 'sending') return
    setStatus('sending')
    setErrorDetail('')
    try {
      const response = await fetch(FEEDBACK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), email: email.trim(), context: 'profile' }),
      })
      if (!response.ok) {
        let detail = `HTTP ${response.status} ${response.statusText} for ${response.url}`
        try {
          const data = await response.json()
          if (data?.error) detail += ` — ${data.error}`
        } catch {
          // response body wasn't JSON; keep the status-only detail
        }
        throw new Error(detail)
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorDetail(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id="feedback-title" className="text-lg font-bold text-gray-900">
            {t('feedbackTitle')}
          </h2>
          <button type="button" onClick={onClose} aria-label={t('feedbackClose')} className="text-2xl leading-none text-gray-400">
            ×
          </button>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckIcon className="h-10 w-10 text-green-600" />
            <p className="text-sm text-gray-700">{t('feedbackSuccess')}</p>
            <button
              type="button"
              onClick={onClose}
              style={{ minHeight: 48 }}
              className="w-full rounded-xl bg-brand-forest text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98]"
            >
              {t('feedbackClose')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="feedback-message" className="mb-1 block text-sm font-semibold text-gray-700">
                {t('feedbackMessageLabel')}
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t('feedbackMessagePlaceholder')}
                maxLength={FEEDBACK_MESSAGE_MAX_LENGTH}
                rows={4}
                required
                className="w-full rounded-2xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="feedback-email" className="mb-1 block text-sm font-semibold text-gray-700">
                {t('feedbackEmailLabel')}
              </label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('feedbackEmailPlaceholder')}
                maxLength={FEEDBACK_EMAIL_MAX_LENGTH}
                className="w-full rounded-2xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-green-500 focus:outline-none"
              />
            </div>
            {status === 'error' && (
              <div className="text-sm text-red-500">
                <p>{t('feedbackError')}</p>
                {errorDetail && <p className="mt-1 font-mono text-xs break-all text-red-400">{errorDetail}</p>}
              </div>
            )}
            <button
              type="submit"
              disabled={status === 'sending' || !message.trim()}
              style={{ minHeight: 48 }}
              className="rounded-xl bg-brand-forest text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98] disabled:opacity-50"
            >
              {status === 'sending' ? t('feedbackSending') : t('feedbackSubmit')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// Sign-in bottom sheet, wired to sync-worker's magic-link endpoints (see
// docs/CLOUDFLARE_SYNC_WORKER.md). Submitting the email step calls
// `POST /auth/request-link`; the actual session is created out-of-band when
// the learner clicks the emailed link (handled by `AppShell` on load), so
// this modal's job ends at "check your email".
function AccountModal({ onClose }) {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [step, setStep] = useState('email') // email | sent
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [errorKey, setErrorKey] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail || status === 'sending') return
    setStatus('sending')
    setErrorKey('')
    try {
      const response = await fetch(`${SYNC_API_URL}/auth/request-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      })
      if (response.status === 429) {
        setStatus('error')
        setErrorKey('accountErrorRateLimited')
        return
      }
      if (response.status === 400) {
        setStatus('error')
        setErrorKey('accountErrorInvalidEmail')
        return
      }
      if (!response.ok) {
        setStatus('error')
        setErrorKey('accountErrorNetwork')
        return
      }
      setStatus('idle')
      setStep('sent')
    } catch {
      setStatus('error')
      setErrorKey('accountErrorNetwork')
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-title"
        className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id="account-title" className="text-lg font-bold text-gray-900">
            {t('accountSignInTitle')}
          </h2>
          <button type="button" onClick={onClose} aria-label={t('accountClose')} className="text-2xl leading-none text-gray-400">
            ×
          </button>
        </div>

        {step === 'email' && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="account-email" className="mb-1 block text-sm font-semibold text-gray-700">
                {t('accountEmailLabel')}
              </label>
              <input
                id="account-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('accountEmailPlaceholder')}
                required
                className="w-full rounded-2xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-green-500 focus:outline-none"
              />
            </div>
            {status === 'error' && <p className="text-sm text-red-500">{t(errorKey)}</p>}
            <button
              type="submit"
              disabled={!email.trim() || status === 'sending'}
              style={{ minHeight: 48 }}
              className="rounded-xl bg-brand-forest text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98] disabled:opacity-50"
            >
              {status === 'sending' ? t('accountSending') : t('accountSendLink')}
            </button>
          </form>
        )}

        {step === 'sent' && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <EnvelopeIcon className="h-10 w-10 text-gray-400" />
            <p className="text-sm font-bold text-gray-900">{t('accountLinkSentTitle')}</p>
            <p className="text-sm text-gray-500">{t('accountLinkSentBody', { email: email.trim() })}</p>
            <p className="text-xs text-gray-400">{t('accountLinkSentWaiting')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// "Synced just now" / "Synced Xm ago" / "Syncing…" / "Sync failed, will
// retry" — see `AppShell`'s `syncStatus`/`lastSyncedAt`.
function syncStatusText(syncStatus, lastSyncedAt, t, tCount) {
  if (syncStatus === 'syncing') return t('accountSyncing')
  if (syncStatus === 'error') return t('accountSyncFailed')
  if (lastSyncedAt) {
    const minutes = Math.floor((Date.now() - lastSyncedAt) / 60000)
    if (minutes >= 1) return tCount('accountSyncedMinutesAgo', minutes)
  }
  return t('accountSyncedJustNow')
}

// Card shown in the Profile tab — purely presentational, driven by the
// `account`/`syncStatus`/`lastSyncedAt` state held in `AppShell` (restored
// from/persisted to `aditzak:session:v1`).
function AccountSection({ account, syncStatus, lastSyncedAt, onOpenSignIn, onSignOut }) {
  const { t, tCount } = useLanguage()
  if (account) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left">
        <div className="flex items-center gap-3">
          <CloudIcon className="h-8 w-8 shrink-0 text-sky-500" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-700">{account.email}</p>
            <p className="text-xs text-gray-400">{syncStatusText(syncStatus, lastSyncedAt, t, tCount)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          style={{ minHeight: 48 }}
          className="mt-3 w-full rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-500 transition hover:border-red-300 hover:text-red-500"
        >
          {t('accountSignOut')}
        </button>
      </div>
    )
  }
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left">
      <div className="flex items-center gap-3">
        <CloudIcon className="h-8 w-8 shrink-0 text-sky-500" />
        <div>
          <p className="text-sm font-semibold text-gray-700">{t('accountTitle')}</p>
          <p className="text-xs text-gray-400">{t('accountSignedOutHint')}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onOpenSignIn}
        style={{ minHeight: 48 }}
        className="mt-3 w-full rounded-xl bg-brand-forest text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98]"
      >
        {t('accountSignIn')}
      </button>
      <p className="mt-2 text-center text-xs text-gray-400">{t('accountSignedOutNote')}</p>
    </div>
  )
}

// Shown once, right after a magic-link sign-in, when this device already had
// local progress *and* the account already has cloud data from another
// device — the three `ACCOUNT_MERGE_OPTIONS` choices from the 2026-06-12
// prototype, now wired to real merge logic in `AppShell.handleResolveMerge`
// (see `mergeSyncPayload` in `lessonLogic.js` for `keepBest`). Not
// dismissible without choosing — there's no safe default that doesn't risk
// silently discarding one side's progress.
export function MergeModal({ applying, onChoose }) {
  const { t } = useLanguage()
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center">
      <div role="dialog" aria-modal="true" aria-labelledby="merge-title" className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl">
        <h2 id="merge-title" className="mb-1 text-lg font-bold text-gray-900">
          {t('accountMergeTitle')}
        </h2>
        <p className="mb-4 text-sm text-gray-500">{t('accountMergeBody')}</p>
        {applying ? (
          <p className="py-4 text-center text-sm font-semibold text-gray-500">{t('accountSyncing')}</p>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onChoose('keepBest')}
              style={{ minHeight: 48 }}
              className="rounded-xl bg-brand-forest text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98]"
            >
              {t('accountMergeKeepBest')}
            </button>
            <button
              type="button"
              onClick={() => onChoose('useDevice')}
              style={{ minHeight: 48 }}
              className="rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-700 transition hover:border-green-300 hover:text-green-600"
            >
              {t('accountMergeUseDevice')}
            </button>
            <button
              type="button"
              onClick={() => onChoose('useAccount')}
              style={{ minHeight: 48 }}
              className="rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-700 transition hover:border-green-300 hover:text-green-600"
            >
              {t('accountMergeUseAccount')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Shown when tapping a heart-locked lesson (see `LessonNode`'s
// `onHeartLocked`) — purely informational for now (no purchase affordance
// yet, that's a separate follow-up), so the learner gets an explicit "why
// can't I start this" answer instead of the tap silently doing nothing.
function HeartsLockedModal({ onClose }) {
  const { t } = useLanguage()
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hearts-locked-title"
        className="w-full max-w-md rounded-t-3xl bg-white p-5 text-center sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-2 flex justify-center">
          <HeartBrokenIcon className="h-10 w-10 text-rose-400" />
        </div>
        <h2 id="hearts-locked-title" className="mb-1 text-lg font-bold text-gray-900">
          {t('heartsLockedTitle')}
        </h2>
        <p className="mb-4 text-sm text-gray-500">{t('heartsLockedBody')}</p>
        <button
          type="button"
          onClick={onClose}
          style={{ minHeight: 48 }}
          className="w-full rounded-xl bg-brand-forest text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-brand-forest-hover active:scale-[0.98]"
        >
          {t('heartsLockedClose')}
        </button>
      </div>
    </div>
  )
}

function ProfileTab({
  streak,
  points,
  hearts,
  account,
  syncStatus,
  lastSyncedAt,
  onOpenSignIn,
  onSignOut,
  onResetProgress,
  onRepairStreak,
  onOpenFeedback,
  onBuyHeart,
}) {
  const { t, tCount, language, setLanguage, languages } = useLanguage()
  const today = getLocalDateString()
  const currentStreak = getActiveStreak(streak, today)
  const longestStreak = streak?.longestStreak ?? 0
  const balance = getPointsBalance(points)
  const canRepair = canRepairStreak(streak, points, today)
  const currentHearts = hearts?.currentHearts ?? MAX_HEARTS
  const canBuy = canBuyHeart(hearts, points)

  // Briefly swaps the "Invite a friend" button's label for `shareCopied`
  // after a clipboard-fallback share (see `shareContent`) — there's no toast
  // system in the app, so this inline revert-after-2s is the confirmation.
  const [shareCopied, setShareCopied] = useState(false)
  const shareCopiedTimeoutRef = useRef(null)
  useEffect(() => () => clearTimeout(shareCopiedTimeoutRef.current), [])

  async function handleShareApp() {
    const result = await shareContent({ title: t('shareGenericTitle'), text: t('shareGenericText'), url: getShareUrl() })
    trackEvent('share_app', { variant: 'generic', result })
    if (result === 'copied') {
      setShareCopied(true)
      clearTimeout(shareCopiedTimeoutRef.current)
      shareCopiedTimeoutRef.current = setTimeout(() => setShareCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <MascotAvatar size="h-20 w-20" />
      <div>
        <h2 className="text-lg font-bold text-gray-900">{t('profileGreeting')}</h2>
        <p className="text-sm text-gray-500">{t('profileAchievements')}</p>
      </div>
      <div className="flex w-full gap-3">
        <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl border border-gray-200 bg-white p-4">
          <StreakIcon className="h-6 w-6 text-brand-clay" />
          <span className="text-lg font-bold text-gray-900">{tCount('streakDays', currentStreak)}</span>
          <span className="text-xs text-gray-500">{t('streakCurrent')}</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl border border-gray-200 bg-white p-4">
          <TrophyIcon className="h-6 w-6 text-brand-clay" />
          <span className="text-lg font-bold text-gray-900">{tCount('streakDays', longestStreak)}</span>
          <span className="text-xs text-gray-500">{t('streakLongest')}</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl border border-gray-200 bg-white p-4">
          <PointsIcon className="h-6 w-6 text-brand-txakoli-text" />
          <span className="text-lg font-bold text-gray-900">{balance}</span>
          <span className="text-xs text-gray-500">{t('pointsBalance')}</span>
        </div>
      </div>
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-700">{t('heartsBalance')}</p>
          <HeartsBadge hearts={hearts} showCountdown />
        </div>
        {currentHearts < MAX_HEARTS && (
          <button
            type="button"
            onClick={onBuyHeart}
            disabled={!canBuy}
            style={{ minHeight: 48 }}
            className="mt-3 w-full rounded-2xl bg-rose-500 text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-rose-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {t('heartsBuyButton', { cost: HEART_COST_POINTS })}
          </button>
        )}
      </div>
      {canRepair && (
        <div className="w-full rounded-2xl border-2 border-dashed border-semantic-warning bg-semantic-warning-tint p-4">
          <p className="text-sm font-bold text-semantic-warning">{t('streakRepairTitle')}</p>
          <p className="mt-1 text-xs text-semantic-warning">{t('streakRepairDescription', { cost: STREAK_REPAIR_COST })}</p>
          <button
            type="button"
            onClick={onRepairStreak}
            style={{ minHeight: 48 }}
            className="mt-3 w-full rounded-xl bg-semantic-warning text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-semantic-warning-hover active:scale-[0.98]"
          >
            {t('streakRepairButton', { cost: STREAK_REPAIR_COST })}
          </button>
        </div>
      )}
      <AccountSection
        account={account}
        syncStatus={syncStatus}
        lastSyncedAt={lastSyncedAt}
        onOpenSignIn={onOpenSignIn}
        onSignOut={onSignOut}
      />
      <div className="w-full">
        <p className="mb-1 text-sm font-semibold text-gray-700">{t('profileLanguage')}</p>
        <p className="mb-2 text-xs text-gray-400">{t('profileLanguageHint')}</p>
        <div className="flex justify-center gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              style={{ minHeight: 48 }}
              className={`flex-1 rounded-xl border-2 px-3 text-sm font-bold transition ${
                language === lang.code
                  ? 'border-brand-forest bg-brand-forest-tint text-brand-forest'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={handleShareApp}
        style={{ minHeight: 48 }}
        className="w-full rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-700 transition hover:border-green-300 hover:text-green-600"
      >
        {shareCopied ? t('shareCopied') : t('shareInviteButton')}
      </button>
      <button
        type="button"
        onClick={onOpenFeedback}
        style={{ minHeight: 48 }}
        className="w-full rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-700 transition hover:border-green-300 hover:text-green-600"
      >
        {t('profileFeedback')}
      </button>
      <button
        type="button"
        onClick={onResetProgress}
        style={{ minHeight: 48 }}
        className="rounded-2xl border-2 border-gray-200 px-5 text-sm font-bold text-gray-500 transition hover:border-red-300 hover:text-red-500"
      >
        {t('profileResetProgress')}
      </button>
    </div>
  )
}

const NAV_ITEMS = [
  { id: 'home', labelKey: 'navLearn', Icon: HomeIcon },
  { id: 'progress', labelKey: 'navProgress', Icon: ProgressIcon },
  { id: 'profile', labelKey: 'navProfile', Icon: ProfileIcon },
]

function BottomNav({ active, onSelect }) {
  const { t } = useLanguage()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-md border-t border-gray-200 bg-white">
      {NAV_ITEMS.map(({ id, labelKey, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          style={{ minHeight: 56 }}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-semibold transition ${
            active === id ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          <Icon className="h-5 w-5" />
          {t(labelKey)}
        </button>
      ))}
    </nav>
  )
}

export function HomeScreen({
  progress,
  streak,
  points,
  hearts,
  account,
  syncStatus,
  lastSyncedAt,
  onSignOut,
  tab,
  onChangeTab,
  onSelectLesson,
  onResetProgress,
  onRepairStreak,
  onBuyHeart,
  scrollTarget,
}) {
  const { t } = useLanguage()
  const totalStars = LESSONS.reduce((sum, lesson) => sum + (progress[lesson.id]?.bestStars ?? 0), 0)
  const currentStreak = getActiveStreak(streak, getLocalDateString())
  const balance = getPointsBalance(points)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showHeartsLocked, setShowHeartsLocked] = useState(false)

  // Restores the scroll position the learner had before starting an exercise,
  // or — on the very first load — jumps straight to the last lesson they
  // completed, so returning learners don't land back at the top of the whole
  // journey. Runs once per mount (HomeScreen unmounts while an exercise is
  // active), using whichever `scrollTarget` was current at mount time. The
  // `requestAnimationFrame` defers until after layout, since the lesson list
  // isn't at its final height yet on the same tick as the initial commit.
  useEffect(() => {
    if (!scrollTarget) return
    requestAnimationFrame(() => {
      if (scrollTarget.type === 'restore') {
        window.scrollTo(0, scrollTarget.y)
      } else if (scrollTarget.type === 'lastLesson') {
        // `block: 'start'` (with the `scroll-mt-20` on `LessonNode` clearing the
        // sticky header) leaves the rest of the viewport free to show the
        // upcoming lessons below, rather than centering and hiding them.
        document.getElementById(`lesson-${scrollTarget.lessonId}`)?.scrollIntoView?.({ block: 'start' })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/90 px-5 py-4 backdrop-blur">
        <h1 className="text-xl font-extrabold tracking-tight text-gray-900">Aditzak</h1>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChangeTab('profile')}
            className="flex items-center gap-1 rounded-full bg-brand-clay-tint px-2.5 py-1.5 text-sm font-bold text-brand-clay transition active:scale-95"
            aria-label={t('streakLabel', { count: currentStreak })}
          >
            <StreakIcon className="h-4 w-4" />
            <span>{currentStreak}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('progress')}
            className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1.5 text-sm font-bold text-amber-700 transition active:scale-95"
            aria-label={t('totalStarsLabel', { count: totalStars })}
          >
            <span aria-hidden="true">★</span>
            <span>{totalStars}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('profile')}
            className="flex items-center gap-1 rounded-full bg-brand-txakoli-tint px-2.5 py-1.5 text-sm font-bold text-brand-txakoli-text transition active:scale-95"
            aria-label={t('pointsLabel', { count: balance })}
          >
            <PointsIcon className="h-4 w-4" />
            <span>{balance}</span>
          </button>
          <HeartsBadge hearts={hearts} onClick={() => onChangeTab('profile')} />
        </div>
      </header>

      <main className="flex-1 px-5 pt-5 pb-28">
        {tab === 'home' && (
          <JourneyTab
            progress={progress}
            hearts={hearts}
            onSelectLesson={onSelectLesson}
            onHeartLocked={() => setShowHeartsLocked(true)}
          />
        )}
        {tab === 'progress' && <ProgressTab progress={progress} />}
        {tab === 'profile' && (
          <ProfileTab
            streak={streak}
            points={points}
            hearts={hearts}
            account={account}
            syncStatus={syncStatus}
            lastSyncedAt={lastSyncedAt}
            onOpenSignIn={() => setShowAccountModal(true)}
            onSignOut={onSignOut}
            onResetProgress={onResetProgress}
            onRepairStreak={onRepairStreak}
            onOpenFeedback={() => setShowFeedback(true)}
            onBuyHeart={onBuyHeart}
          />
        )}
      </main>

      <BottomNav active={tab} onSelect={onChangeTab} />

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      {showAccountModal && <AccountModal onClose={() => setShowAccountModal(false)} />}
      {showHeartsLocked && <HeartsLockedModal onClose={() => setShowHeartsLocked(false)} />}
    </div>
  )
}
