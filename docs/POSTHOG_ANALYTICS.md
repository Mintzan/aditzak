# PostHog analytics setup

The app reports pageviews/clicks (via PostHog's autocapture) and a few
custom lesson-funnel events to [PostHog](https://posthog.com/) — `lesson_started`
and `lesson_completed` (see "Custom events" below).

A project API key for this app's site is already baked into `src/analytics.js`
(`DEFAULT_POSTHOG_KEY`, EU cloud), so analytics work out of the box on the
deployed site with no configuration needed. The rest of this doc explains
where that key came from and how to point a fork/different deployment at a
different PostHog project instead.

## 1. Create a PostHog project

1. Sign up / log in at [PostHog](https://posthog.com/) (EU or US cloud — pick
   a region when creating your account/organization).
2. Create a project for this app's site.
3. **Project settings → Project API key** — copy the key (starts with `phc_`).
4. Note the API host for your region:
   - EU cloud: `https://eu.i.posthog.com`
   - US cloud: `https://us.i.posthog.com`

## 2. Configure the key

`src/analytics.js` falls back to `DEFAULT_POSTHOG_KEY`/`DEFAULT_POSTHOG_HOST`,
which are already set to this app's EU project. This is fine to commit: the
key ends up in the publicly-served HTML/JS anyway — PostHog project API keys
are write-only (they can only send events to that project, not read data
back out).

To point a fork or alternate deployment at a *different* PostHog project
(rather than editing the defaults in source), set the `VITE_POSTHOG_KEY` (and
optionally `VITE_POSTHOG_HOST`, if not EU cloud) environment variables, which
take precedence:

- **GitHub Pages deploy:** `.github/workflows/deploy.yml`'s build step passes
  through `POSTHOG_KEY`/`POSTHOG_HOST` repository variables (**Settings →
  Secrets and variables → Actions → Variables**) as `VITE_POSTHOG_KEY`/
  `VITE_POSTHOG_HOST`.
- **Local development:** copy `.env.example` to `.env.local` and fill in
  `VITE_POSTHOG_KEY`/`VITE_POSTHOG_HOST` (`.env.local` is gitignored).

## 3. Custom events

`src/analytics.js` exports `trackEvent(name, properties)`, a thin wrapper
around `posthog.capture` that no-ops until `initAnalytics` has run (so it's
safe to call from components under test, which render without the app's
entry point).

Currently tracked:

- **`lesson_started`** — fired once a learner starts answering questions for
  a lesson (after dismissing the preview, for a first attempt). Properties:
  `lessonId`, `review` (bool), `attemptNumber`, and for non-review lessons
  `verbId`/`tense`.
- **`lesson_completed`** — fired when a learner dismisses the results screen.
  Properties: `lessonId`, `review` (bool), `correctCount`, `total`, `stars`,
  `isRepeat`, `pointsEarned`.

## 4. Verify

After a deploy with the key configured, open the live site and play through a
lesson, then check **Activity → Events** in the PostHog dashboard for that
project — `$pageview`, `lesson_started`, and `lesson_completed` events should
appear within a minute or two.

## 5. Suggested dashboard

Once events are flowing, create a dashboard (**Dashboards → New dashboard**)
and pin these insights — each is built via **Insights → New insight**, then
**Add to dashboard**:

1. **Start → completion funnel** — Funnel, steps `lesson_started` →
   `lesson_completed` (1-day conversion window). Overall % of learners who
   finish a lesson once they start it.
2. **Funnel by lesson** — same funnel, breakdown by `lessonId`. Surfaces
   individual lessons with unusually low completion (too long, too hard, or
   confusing).
3. **Difficulty by lesson** — Trends on `lesson_completed`, formula `A / B`
   where A = sum of `correctCount` and B = sum of `total`, broken down by
   `lessonId`. Low values flag tenses/verbs that may need more practice
   content or an earlier review lesson.
4. **Star distribution** — Trends on `lesson_completed`, breakdown by
   `stars`, shown as a bar chart. How many 0/1/2/3-star results overall or
   per lesson.
5. **Replay rate** — Trends on `lesson_completed` filtered to `isRepeat =
   true`, as a percentage of all `lesson_completed` events. How often
   learners repeat a lesson (a proxy for "wants more practice" vs.
   "frustrated").
6. **Funnel by tense** — `lesson_started` → `lesson_completed`, broken down
   by `tense`. Which grammatical tenses learners abandon most.
7. **Attempts before completion** — Trends on `lesson_started`, breakdown by
   `attemptNumber`. Distribution of first-try vs. retry starts.
8. **Active learners** — Trends, unique users on `$pageview`, daily and
   weekly. Basic engagement volume (works without `posthog.identify()` since
   PostHog persists an anonymous distinct ID per browser).
9. **Retention** — Retention insight based on `lesson_completed`. % of
   learners returning on subsequent days/weeks.
10. **Points earned** — Trends, sum of `pointsEarned` from
    `lesson_completed`, daily. Overall progression/engagement trend.
