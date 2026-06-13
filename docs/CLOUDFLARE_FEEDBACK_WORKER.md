# Feedback worker (Cloudflare Workers + Resend)

`worker/` contains a standalone Cloudflare Worker that accepts feedback
submissions from the app and emails them to the maintainer via
[Resend](https://resend.com/). It stores nothing — each submission is just
relayed as an email. This doc covers deploying and configuring the worker;
wiring a feedback form into the app's UI is a follow-up.

## How it works

The worker exposes a single endpoint that accepts `POST` requests with a JSON
body:

```json
{
  "message": "The feedback text (max 2000 chars). Required unless `diagnostics` is present.",
  "email": "Optional. Used as the email's reply-to address.",
  "context": "Optional. Free-form string, e.g. current screen/lesson (max 500 chars).",
  "diagnostics": "Optional. Structured snapshot of a flagged question (see below, max ~4000 chars serialized)."
}
```

`diagnostics`, when present, must match the shape produced by
`buildFlagDiagnostics` (`src/lessonLogic.js`) exactly — an object with only
these keys:

```json
{
  "lessonId": "string",
  "review": "boolean",
  "verbId": "string",
  "tense": "string",
  "person": "string",
  "kind": "string",
  "correct": "string",
  "userAnswer": "string or null",
  "outcome": "string",
  "language": "string",
  "timestamp": "string (ISO 8601)",
  "question": {
    "sentence": "string, optional",
    "options": "string[], optional",
    "items": "[{ person: string, sentence: string }], optional"
  }
}
```

Any unknown top-level/`question` key, wrong type, or an oversized
`diagnostics` (serialized JSON over ~4000 chars) is rejected with `400`. When
`diagnostics` is present, `message` is optional (an extra comment from the
reporter on top of the auto-attached diagnostics) but still capped at 2000
chars if provided. The relayed email gets a "--- Flagged question ---" block
formatted from `diagnostics`, and its subject becomes "Aditzak question flag"
instead of "Aditzak feedback".

Responses:

- `200 { "ok": true }` — email sent.
- `400 { "error": "..." }` — invalid/missing `message`, invalid `diagnostics`,
  or malformed JSON.
- `405` — method other than `POST`/`OPTIONS`.
- `502 { "error": "Failed to send feedback" }` — Resend API call failed
  (details logged via `console.error`, visible in `wrangler tail` /
  the Cloudflare dashboard).

CORS is locked to a single origin via the `ALLOWED_ORIGIN` var — requests
from other origins won't receive `Access-Control-Allow-Origin` and will be
blocked by the browser.

## 1. Create a Resend account and API key

1. Sign up at [resend.com](https://resend.com/) (free tier is plenty for
   feedback volume).
2. **API Keys** — create a key with "Sending access" only.
3. **Sending domain**: for real use, [verify a domain](https://resend.com/docs/dashboard/domains/introduction)
   you control and send from an address on it (e.g. `feedback@yourdomain.com`).
   Until then, Resend's shared `onboarding@resend.dev` sender works for
   testing, but **only delivers to the email address of the Resend account
   owner** — fine for a single-maintainer feedback inbox, not for a
   multi-recipient setup.

## 2. Configure `worker/wrangler.toml`

Non-secret config lives in `[vars]`:

- `ALLOWED_ORIGIN` — the app's origin (e.g. `https://mintzan.github.io` for
  the current GitHub Pages deploy). No trailing slash/path.
- `FEEDBACK_TO_EMAIL` — mailbox that receives feedback.
- `FEEDBACK_FROM_EMAIL` — Resend "from" address (`onboarding@resend.dev` or
  an address on your verified domain).

## 3. Set the Resend API key as a secret

From `worker/`:

```sh
npx wrangler login        # one-time, opens a browser to authorize Cloudflare
npx wrangler secret put RESEND_API_KEY
```

Paste the Resend API key when prompted. Secrets aren't stored in the repo or
`wrangler.toml`.

**No CLI access?** Add `RESEND_API_KEY` as a repo secret (**Settings → Secrets
and variables → Actions → New repository secret**), then run the
**Set feedback worker secret** workflow (**Actions → Set feedback worker
secret → Run workflow**). It's a one-time, manually-triggered job that runs
`wrangler secret put RESEND_API_KEY` using that secret plus the existing
`CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID`. You can delete the
`RESEND_API_KEY` repo secret afterwards — Cloudflare stores it on the worker
from then on, the workflow doesn't need it again unless the key is rotated.

## 4. Develop and deploy locally

```sh
cd worker
npm install
npm run dev      # local dev server (wrangler dev)
npm run deploy   # publish to Cloudflare (uses `wrangler login` auth)
```

`wrangler deploy` prints the worker's URL
(`https://aditzak-feedback.<your-subdomain>.workers.dev`). That URL is what
the frontend will call — see "Next steps".

## 5. Automatic deploys via GitHub Actions

`.github/workflows/deploy-worker.yml` runs `wrangler deploy` (via
[`cloudflare/wrangler-action`](https://github.com/cloudflare/wrangler-action))
whenever `worker/**` changes on `main`, or on manual dispatch. It needs two
**repository secrets** (**Settings → Secrets and variables → Actions →
Secrets**, not "Variables" — these must stay secret):

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Creating the API token

1. Cloudflare dashboard → **My Profile → API Tokens → Create Token**.
2. Use the **"Edit Cloudflare Workers"** template (or a custom token with
   **Account → Workers Scripts → Edit** permission).
3. Scope it to the account that will host this worker (no need for
   all-account access if you have multiple).
4. Create the token and copy it immediately — Cloudflare only shows it once.
5. Add it as the `CLOUDFLARE_API_TOKEN` repo secret.

### Finding the account ID

Cloudflare dashboard → any domain/**Workers & Pages** overview page — the
**Account ID** is shown in the right-hand sidebar. Add it as the
`CLOUDFLARE_ACCOUNT_ID` repo secret.

### Note on `RESEND_API_KEY`

This is a *Worker* secret (step 3 above), not a GitHub secret — it's stored
by Cloudflare and attached to the deployed worker, not read by the CI job.
`wrangler secret put` requires being authenticated as the same Cloudflare
account/token; you can run it locally after `wrangler login`, or
non-interactively with `CLOUDFLARE_API_TOKEN` set in your shell:

```sh
echo "$RESEND_API_KEY" | CLOUDFLARE_API_TOKEN=<token> npx wrangler secret put RESEND_API_KEY
```

It only needs to be set once (and again if the key is rotated) — it persists
across the redeploys the GitHub Action triggers.

## Frontend integration

The Profile tab has a "Send feedback" button opening a modal
(`FeedbackModal` in `src/App.jsx`) that `fetch()`s this worker's URL. Each
exercise question's result also has a 🚩 "report a problem" button
(`FeedbackBar` → `FlagQuestionModal`) that posts to the same endpoint with
`context: 'question-flag'` and a `diagnostics` snapshot built by
`buildFlagDiagnostics` (`src/lessonLogic.js`). The deployed worker's URL
(`https://aditzak-feedback.inakiibarrola.workers.dev`)
is hardcoded as the default in `src/App.jsx` — it isn't a secret, since the
worker's CORS is locked to `ALLOWED_ORIGIN` regardless of who knows the URL.
Override it with the `VITE_FEEDBACK_API_URL` env var (repo variable
`FEEDBACK_API_URL` in `.github/workflows/deploy.yml`, `.env.local` for dev)
if you deploy your own worker — e.g. for a fork, or to point at a local
`wrangler dev` instance.

## Next steps (not yet done)

- Consider adding [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
  if spam becomes an issue — not included in this lighter setup.
