# Sync worker (Cloudflare Workers + D1)

`sync-worker/` is a standalone Cloudflare Worker, backed by
[Cloudflare D1](https://developers.cloudflare.com/d1/), that will back the
Profile tab's account/sync feature: magic-link auth and cross-device
progress sync (see issue #86 and its sub-issues). This doc covers
provisioning D1, running migrations, and deploying the worker. The `/sync`
endpoints land in a follow-up issue.

## How it works (so far)

`GET /healthz` → `200 { "ok": true }`.

### Magic-link auth

- `POST /auth/request-link {email}` — validates `email`, rate limits (1/min
  and 5/hour, per email and per IP — `429` if exceeded), creates a
  single-use token (only its SHA-256 hash is stored, ~15 min expiry in
  `magic_links`), and emails a sign-in link
  (`${APP_URL}?authToken=<token>`) via Resend. Returns `200 { "ok": true }`.
- `POST /auth/verify {token}` — looks up the token by hash; `400` if
  unknown, already used, or expired. On success, marks it used,
  finds-or-creates the `users` row by email, issues a new session token
  (~60 day expiry, stored hashed in `sessions`), and returns
  `{ sessionToken, email, hasCloudData }` — `hasCloudData` is `true` if a
  `progress_snapshots` row already exists for this user.
- `POST /auth/signout` (bearer-authenticated) — deletes the caller's
  `sessions` row. Returns `401` without a valid, unexpired bearer token.

Every other authenticated endpoint reuses `src/session.js`'s
`authenticateSession` helper: validates `Authorization: Bearer <token>`
against `sessions` (hash lookup + expiry check) and bumps `last_seen_at`.
Returns `401` without a valid, unexpired bearer token.

### Progress sync

- `GET /sync` (bearer-authenticated) — returns
  `{ payload, schemaVersion, updatedAt }` from `progress_snapshots` for the
  caller's user, or `404 { "payload": null }` if no snapshot exists yet (new
  account).
- `PUT /sync {payload, schemaVersion}` (bearer-authenticated) — upserts the
  caller's `progress_snapshots` row (`updated_at` set to now) and returns
  `200 { ok, updatedAt }`. `payload` mirrors the four `localStorage` shapes
  from `src/App.jsx` (`progress`, `dailyStreak`, `points`, `errorStats`);
  `schemaVersion` follows the `:v1`-suffix convention `CLAUDE.md` describes
  for those storage keys, so the backend can flag payloads from an
  older/newer client schema. Payloads over 256KB (`MAX_PAYLOAD_BYTES` in
  `src/routes/sync.js`) are rejected with `413` without writing to D1.

This endpoint only stores/retrieves the whole-blob snapshot — merging local
and cloud data is the frontend's responsibility (see the "first-sync merge +
background sync" follow-up issue).

Everything else → `404`.

CORS is locked to a single origin via the `ALLOWED_ORIGIN` var, same pattern
as `worker/` (the feedback worker) — requests from other origins won't
receive `Access-Control-Allow-Origin` and will be blocked by the browser.

## 1. Create the D1 database

```sh
cd sync-worker
npx wrangler login        # one-time, opens a browser to authorize Cloudflare
npx wrangler d1 create aditzak-sync
```

This prints a `database_id`. Copy it into `sync-worker/wrangler.toml`'s
`[[d1_databases]]` block, replacing the `00000000-...` placeholder.

## 2. Run migrations

Migration files live in `sync-worker/migrations/`:

- `0001_init.sql` — `users`/`magic_links`/`sessions`/`progress_snapshots`.
- `0002_rate_limits.sql` — `rate_limits` (fixed-window counters for
  `/auth/request-link`).

```sh
# Local D1 (used by `wrangler dev`)
npx wrangler d1 migrations apply aditzak-sync --local

# Remote D1 (production)
npx wrangler d1 migrations apply aditzak-sync --remote
```

The GitHub Actions deploy workflow (below) applies remote migrations
automatically on every deploy, so a manual `--remote` run is normally only
needed right after creating the database for the first time.

## 3. Configure `sync-worker/wrangler.toml`

Non-secret config lives in `[vars]`:

- `ALLOWED_ORIGIN` — the app's origin (e.g. `https://mintzan.github.io` for
  the current GitHub Pages deploy). No trailing slash/path.
- `APP_URL` — base URL of the deployed app; the magic-link email points here
  with `?authToken=<token>` appended.
- `AUTH_FROM_EMAIL` — Resend "from" address for sign-in emails
  (`onboarding@resend.dev` for testing, or an address on your verified
  domain).

### Set the Resend API key as a secret

Same pattern as the feedback worker (`docs/CLOUDFLARE_FEEDBACK_WORKER.md`):

```sh
cd sync-worker
npx wrangler secret put RESEND_API_KEY
```

Or run the "Set sync worker secret" GitHub Actions workflow
(`.github/workflows/set-sync-worker-secret.yml`, `workflow_dispatch`), which
puts the repo's `RESEND_API_KEY` secret onto the sync-worker the same way.

This worker has its **own** `RESEND_API_KEY` secret — separate from
`worker/`'s, even if both use the same Resend account/key value, since each
worker's secrets are independent. **Without this secret set, `/auth/request-link`
returns HTTP 502** (Resend rejects the unauthenticated request), which the
sign-in form currently can't distinguish from other server errors except by
its generic "Something went wrong" message.

## 4. Develop and deploy locally

```sh
cd sync-worker
npm install
npm run dev      # local dev server (wrangler dev), using local D1
npm run deploy   # publish to Cloudflare (uses `wrangler login` auth)
```

`wrangler dev` prints a local URL (e.g. `http://localhost:8787`) —
`curl http://localhost:8787/healthz` should return `{"ok":true}`.

`wrangler deploy` prints the worker's URL
(`https://aditzak-sync.<your-subdomain>.workers.dev`).

## 5. Automatic deploys via GitHub Actions

`.github/workflows/deploy-sync-worker.yml` runs `wrangler d1 migrations
apply aditzak-sync --remote` followed by `wrangler deploy` (via
[`cloudflare/wrangler-action`](https://github.com/cloudflare/wrangler-action))
whenever `sync-worker/**` changes on `main`, or on manual dispatch. It needs
the same two **repository secrets** as the feedback worker (**Settings →
Secrets and variables → Actions → Secrets**):

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

If these are already set up for `worker/` (see
`docs/CLOUDFLARE_FEEDBACK_WORKER.md`), the same token/account work here too —
just make sure the API token's permissions also cover **Account → D1 →
Edit** (the "Edit Cloudflare Workers" template doesn't include D1 by
default; use a custom token with both **Workers Scripts: Edit** and **D1:
Edit**).

## Next steps (not yet done)

- Frontend wiring (`AccountModal`/`AccountSection`, background sync) —
  separate follow-up issues.
