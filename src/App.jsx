import { useCallback, useEffect, useRef, useState } from 'react'
import {
  addPoints,
  applyHeartRegen,
  buyHeart,
  computeLessonPoints,
  computeStars,
  deductHeart,
  getLastPlayedLessonId,
  getLocalDateString,
  mergeSyncPayload,
  randomStreakNudgeCooldown,
  recordDailyStreak,
  recordErrors,
  recordResult,
  repairStreak,
  STREAK_REPAIR_COST,
} from './lessonLogic'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import { trackEvent } from './analytics'
import { LESSONS } from './data/lessons'
import {
  progressStorage,
  streakStorage,
  errorStorage,
  heartsStorage,
  getDeviceId,
  pointsStorage,
  accountSessionStorage,
  SESSION_TTL_MS,
} from './storage'
import {
  buildSyncPayload,
  fetchSyncSnapshot,
  pushSyncSnapshot,
  hasLocalSyncData,
  SYNC_API_URL,
  SYNC_PUSH_DEBOUNCE_MS,
} from './api'
import { HomeScreen, MergeModal } from './screens/HomeScreen'
import { ExerciseScreen } from './screens/ExerciseScreen'
import { MascotAvatar } from './components/mascot'

// Shown once, before anything else, when no source language has been chosen
// yet (`hasChosenLanguage` is false — see `LanguageContext`) — a "fancy"
// full-screen selector so a first-time visitor picks the language they
// already know before seeing any lesson content. Euskara is listed first
// (per `LANGUAGES`) and flagged as recommended, since most Aditzak users
// already have some grounding in Basque. Picking a language calls
// `setLanguage`, which persists the choice and flips `hasChosenLanguage`, so
// this screen doesn't render again.
function LanguageOnboardingScreen() {
  const { t, setLanguage, languages } = useLanguage()
  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col items-center justify-center gap-8 bg-gradient-to-b from-green-50 to-white px-6 text-center">
      <MascotAvatar size="h-20 w-20" />
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{t('onboardingTitle')}</h1>
        <p className="mt-2 text-gray-500">{t('onboardingSubtitle')}</p>
      </div>
      <div className="flex w-full flex-col gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            style={{ minHeight: 64 }}
            className={`flex items-center justify-between rounded-xl border-2 px-5 text-left text-lg font-bold transition active:scale-[0.98] ${
              lang.code === 'eu'
                ? 'border-brand-forest bg-brand-forest-tint text-brand-forest'
                : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {lang.name}
            {lang.code === 'eu' && (
              <span className="rounded-full bg-brand-forest px-2.5 py-1 text-xs font-bold text-white">{t('onboardingRecommended')}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function AppShell() {
  const { t, hasChosenLanguage } = useLanguage()
  const [progress, setProgress] = useState(progressStorage.load)
  const [dailyStreak, setDailyStreak] = useState(streakStorage.load)
  const [points, setPoints] = useState(pointsStorage.load)
  const [errorStats, setErrorStats] = useState(errorStorage.load)
  // Regen is recomputed against `Date.now()` right at load (not just stored
  // raw) so a session that was closed for a while already shows any hearts
  // regenerated while the app was shut, without waiting for the
  // `visibilitychange` effect below to fire.
  const [hearts, setHearts] = useState(() => applyHeartRegen(heartsStorage.load(), Date.now()))
  const [deviceId] = useState(getDeviceId)
  const [tab, setTab] = useState('home')
  const [activeLessonId, setActiveLessonId] = useState(null)
  const [account, setAccount] = useState(() => {
    const session = accountSessionStorage.load()
    return session ? { email: session.email } : null
  })
  // Sync status for `AccountSection` — 'idle' before the first sync attempt
  // this session, then 'syncing'/'synced'/'error' as `PUT`/`GET /sync` calls
  // resolve. `lastSyncedAt` is a `Date.now()` timestamp, turned into "synced
  // Xm ago" by `syncStatusText`.
  const [syncStatus, setSyncStatus] = useState(() => {
    if (typeof window === 'undefined') return 'idle'
    const url = new URL(window.location.href)
    if (url.searchParams.get('authToken')) return 'syncing'
    return accountSessionStorage.load()?.token ? 'syncing' : 'idle'
  })
  const [lastSyncedAt, setLastSyncedAt] = useState(null)
  // Set right after a magic-link sign-in when this device *and* the account
  // both already have data to reconcile — `{ cloud }` holds the cloud
  // snapshot fetched for `MergeModal`'s three choices (`null` = no merge
  // pending).
  const [pendingMerge, setPendingMerge] = useState(null)
  const [mergeApplying, setMergeApplying] = useState(false)
  // Session-level gate for the mid-lesson streak nudge: counts down once a
  // nudge has been shown, so the next one waits a few lessons rather than
  // popping up again the moment another milestone streak comes around.
  const [streakNudgeCooldown, setStreakNudgeCooldown] = useState(0)
  // Where the home screen should scroll to the next time it mounts: the last
  // lesson the learner completed on initial load, or the scroll position they
  // had before starting an exercise when they return from one.
  const [homeScrollTarget, setHomeScrollTarget] = useState(() => {
    const lastLessonId = getLastPlayedLessonId(progressStorage.load())
    return lastLessonId ? { type: 'lastLesson', lessonId: lastLessonId } : null
  })
  const scrollBeforeLessonRef = useRef(null)
  // Mirrors `progress`/`dailyStreak`/`points`/`errorStats`/`hearts` for the
  // async sync handlers below, which need the *current* values at the time a
  // network call resolves rather than whatever was current when the handler
  // was created. (`hearts` isn't part of the sync payload yet — that's a
  // separate follow-up — but is kept here so that follow-up doesn't need to
  // touch this ref again.)
  const dataRef = useRef({ progress, dailyStreak, points, errorStats, hearts })
  // Background `PUT /sync` debounce timer (ongoing sync, see below).
  const syncTimeoutRef = useRef(null)
  // Guards the background-sync effect until the initial reconcile (push/pull/
  // merge, in the `authToken` effect below) has run — otherwise it would push
  // this device's pre-merge data to the cloud before the merge choice (or
  // pull-merge) has a chance to run.
  const skipNextPushRef = useRef(true)

  useEffect(() => {
    dataRef.current = { progress, dailyStreak, points, errorStats, hearts }
  })

  useEffect(() => {
    progressStorage.save(progress)
  }, [progress])

  useEffect(() => {
    streakStorage.save(dailyStreak)
  }, [dailyStreak])

  useEffect(() => {
    pointsStorage.save(points)
  }, [points])

  useEffect(() => {
    errorStorage.save(errorStats)
  }, [errorStats])

  useEffect(() => {
    heartsStorage.save(hearts)
  }, [hearts])

  // No background regen timer by design (see `docs/HEART_ECONOMY_ANALYSIS.md`)
  // — instead, recompute the lazy catch-up formula whenever the tab regains
  // focus, so a session left open across a regen boundary catches up without
  // needing a reload.
  useEffect(() => {
    if (typeof document === 'undefined') return
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        setHearts((previous) => applyHeartRegen(previous, Date.now()))
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const pushSnapshot = useCallback((token) => {
    setSyncStatus('syncing')
    return pushSyncSnapshot(token, buildSyncPayload(dataRef.current))
      .then(() => {
        setSyncStatus('synced')
        setLastSyncedAt(Date.now())
      })
      .catch(() => {
        setSyncStatus('error')
      })
  }, [])

  // Runs once on mount. Two cases:
  //
  // - URL has `?authToken=...` (the learner just clicked the emailed link):
  //   exchange it for a session via `/auth/verify`, persist it, and strip the
  //   token from the URL either way so it isn't left in the address bar or
  //   re-submitted on refresh. Then reconcile this device's local data with
  //   the account's cloud data — see the three branches below.
  // - Otherwise, if a session is already stored (returning signed-in
  //   learner): pull the cloud snapshot and merge it with local data
  //   (`mergeSyncPayload`, same rules as `keepBest`), so edits made on
  //   another device since the last visit aren't lost or overwritten.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    const authToken = url.searchParams.get('authToken')

    if (!authToken) {
      const session = accountSessionStorage.load()
      if (!session?.token) {
        skipNextPushRef.current = false
        return
      }
      fetchSyncSnapshot(session.token)
        .then((snapshot) => {
          if (!snapshot?.payload) return pushSyncSnapshot(session.token, buildSyncPayload(dataRef.current))
          const merged = mergeSyncPayload(dataRef.current, snapshot.payload)
          setProgress(merged.progress)
          setDailyStreak(merged.dailyStreak)
          setPoints(merged.points)
          setErrorStats(merged.errorStats)
          setHearts(merged.hearts)
          dataRef.current = merged
          return pushSyncSnapshot(session.token, buildSyncPayload(merged))
        })
        .then(() => {
          setSyncStatus('synced')
          setLastSyncedAt(Date.now())
        })
        .catch(() => setSyncStatus('error'))
        .finally(() => {
          skipNextPushRef.current = false
        })
      return
    }

    url.searchParams.delete('authToken')
    window.history.replaceState({}, '', url.toString())

    fetch(`${SYNC_API_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: authToken }),
    })
      .then(async (response) => {
        if (!response.ok) {
          skipNextPushRef.current = false
          return
        }
        const { sessionToken, email, hasCloudData } = await response.json()
        accountSessionStorage.save({ token: sessionToken, email, expiresAt: Date.now() + SESSION_TTL_MS })
        setAccount({ email, hasCloudData })

        if (!hasCloudData) {
          // New account, or first device on this account: nothing to merge —
          // push this device's local data so it becomes the cloud copy.
          await pushSnapshot(sessionToken)
          skipNextPushRef.current = false
          return
        }

        const snapshot = await fetchSyncSnapshot(sessionToken).catch(() => null)
        if (!hasLocalSyncData(dataRef.current)) {
          // Existing account, fresh device with nothing of its own yet:
          // adopt the cloud copy wholesale.
          if (snapshot?.payload) {
            setProgress(snapshot.payload.progress ?? {})
            setDailyStreak(snapshot.payload.dailyStreak ?? {})
            setPoints(snapshot.payload.points ?? {})
            setErrorStats(snapshot.payload.errorStats ?? {})
            setHearts(snapshot.payload.hearts ?? {})
          }
          setSyncStatus('synced')
          setLastSyncedAt(Date.now())
          skipNextPushRef.current = false
          return
        }

        // Both sides have data — ask the learner how to reconcile them
        // (see `MergeModal`/`handleResolveMerge`).
        setPendingMerge({ cloud: snapshot?.payload ?? {} })
      })
      .catch(() => {
        skipNextPushRef.current = false
      })
  }, [pushSnapshot])

  // Ongoing background sync: after any of the five storage saves above, while
  // signed in, debounce a `PUT /sync` of the latest data. If it fails, local
  // data stays the source of truth and the next save (or the next app load's
  // pull-merge) retries.
  useEffect(() => {
    if (!account || skipNextPushRef.current) return
    const session = accountSessionStorage.load()
    if (!session?.token) return
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
    syncTimeoutRef.current = setTimeout(() => {
      pushSnapshot(session.token)
    }, SYNC_PUSH_DEBOUNCE_MS)
    return () => clearTimeout(syncTimeoutRef.current)
  }, [account, progress, dailyStreak, points, errorStats, hearts, pushSnapshot])

  // Applies the learner's `MergeModal` choice and clears `pendingMerge`.
  const handleResolveMerge = useCallback(
    async (choice) => {
      const session = accountSessionStorage.load()
      const cloud = pendingMerge?.cloud ?? {}
      if (!session?.token) {
        setPendingMerge(null)
        skipNextPushRef.current = false
        return
      }
      setMergeApplying(true)
      setSyncStatus('syncing')
      try {
        if (choice === 'useDevice') {
          await pushSyncSnapshot(session.token, buildSyncPayload(dataRef.current))
        } else if (choice === 'useAccount') {
          setProgress(cloud.progress ?? {})
          setDailyStreak(cloud.dailyStreak ?? {})
          setPoints(cloud.points ?? {})
          setErrorStats(cloud.errorStats ?? {})
          setHearts(cloud.hearts ?? {})
        } else {
          const merged = mergeSyncPayload(dataRef.current, cloud)
          setProgress(merged.progress)
          setDailyStreak(merged.dailyStreak)
          setPoints(merged.points)
          setErrorStats(merged.errorStats)
          setHearts(merged.hearts)
          dataRef.current = merged
          await pushSyncSnapshot(session.token, buildSyncPayload(merged))
        }
        setSyncStatus('synced')
        setLastSyncedAt(Date.now())
      } catch {
        setSyncStatus('error')
      } finally {
        setMergeApplying(false)
        setPendingMerge(null)
        skipNextPushRef.current = false
      }
    },
    [pendingMerge],
  )

  const handleSignOut = useCallback(async () => {
    const session = accountSessionStorage.load()
    accountSessionStorage.save(null)
    setAccount(null)
    setSyncStatus('idle')
    setLastSyncedAt(null)
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
    if (!session?.token) return
    try {
      await fetch(`${SYNC_API_URL}/auth/signout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
      })
    } catch {
      // Best-effort — the local session is already cleared above.
    }
  }, [])

  const handleStreakNudgeShown = useCallback(() => {
    setStreakNudgeCooldown(randomStreakNudgeCooldown())
  }, [])

  function handleResetProgress() {
    if (typeof window !== 'undefined' && !window.confirm(t('profileResetConfirm'))) {
      return
    }
    setProgress({})
    setDailyStreak({})
    setPoints({})
    setErrorStats({})
    setHearts({})
  }

  function handleRepairStreak() {
    if (typeof window !== 'undefined' && !window.confirm(t('streakRepairConfirm', { cost: STREAK_REPAIR_COST }))) {
      return
    }
    const { streak, points: nextPoints } = repairStreak(dailyStreak, points, getLocalDateString(), deviceId)
    setDailyStreak(streak)
    setPoints(nextPoints)
  }

  // No confirm dialog, unlike `handleRepairStreak` — this is only ever
  // reachable from `OutOfHeartsOverlay`'s already-explicit "buy" button
  // (`ExerciseScreen`), not a passive profile-tab action.
  function handleBuyHeart() {
    const { hearts: nextHearts, points: nextPoints } = buyHeart(hearts, points, deviceId, Date.now())
    setHearts(nextHearts)
    setPoints(nextPoints)
  }

  function handleSelectLesson(lessonId) {
    scrollBeforeLessonRef.current = window.scrollY
    setActiveLessonId(lessonId)
  }

  function handleReturnToHome() {
    setHomeScrollTarget(
      scrollBeforeLessonRef.current !== null ? { type: 'restore', y: scrollBeforeLessonRef.current } : null,
    )
    scrollBeforeLessonRef.current = null
    setActiveLessonId(null)
  }

  if (!hasChosenLanguage) {
    return <LanguageOnboardingScreen />
  }

  if (activeLessonId) {
    const lesson = LESSONS.find((l) => l.id === activeLessonId)
    return (
      <ExerciseScreen
        key={lesson.id}
        lesson={lesson}
        attempts={progress[lesson.id]?.attempts ?? 0}
        errorStats={errorStats}
        hearts={hearts}
        points={points}
        onExit={handleReturnToHome}
        canShowStreakNudge={streakNudgeCooldown === 0}
        onStreakNudgeShown={handleStreakNudgeShown}
        onWrongAnswer={() => setHearts((previous) => deductHeart(previous, Date.now()))}
        onBuyHeart={handleBuyHeart}
        onComplete={(result) => {
          const isRepeat = (progress[lesson.id]?.attempts ?? 0) > 0
          const pointsEarned = computeLessonPoints(result.correctCount, result.total, isRepeat)
          trackEvent('lesson_completed', {
            lessonId: lesson.id,
            review: Boolean(lesson.review),
            correctCount: result.correctCount,
            total: result.total,
            stars: computeStars(result.correctCount, result.total),
            isRepeat,
            pointsEarned,
          })
          setProgress((previous) => recordResult(previous, lesson.id, result))
          setDailyStreak((previous) => recordDailyStreak(previous, getLocalDateString()))
          setPoints((previous) => addPoints(previous, pointsEarned, deviceId))
          setErrorStats((previous) => recordErrors(previous, result.misses))
          setStreakNudgeCooldown((cooldown) => Math.max(0, cooldown - 1))
          handleReturnToHome()
        }}
      />
    )
  }

  return (
    <>
      <HomeScreen
        progress={progress}
        errorStats={errorStats}
        streak={dailyStreak}
        points={points}
        hearts={hearts}
        account={account}
        syncStatus={syncStatus}
        lastSyncedAt={lastSyncedAt}
        onSignOut={handleSignOut}
        tab={tab}
        onChangeTab={setTab}
        onSelectLesson={handleSelectLesson}
        onResetProgress={handleResetProgress}
        onRepairStreak={handleRepairStreak}
        onBuyHeart={handleBuyHeart}
        scrollTarget={homeScrollTarget}
      />
      {pendingMerge && <MergeModal applying={mergeApplying} onChoose={handleResolveMerge} />}
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  )
}
