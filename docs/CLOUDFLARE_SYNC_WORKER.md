# Sync worker (Cloudflare Workers + D1)

`sync-worker/` is a standalone Cloudflare Worker, backed by
[Cloudflare D1](https://developers.cloudflare.com/d1/), that will back the
Profile tab's account/sync feature: magic-link auth and cross-device
progress sync (see issue #86 and its sub-issues). This doc covers
provisioning D1, running migrations, and deploying the worker. The `/auth/*`
and `/sync` endpoints themselves are added by follow-up issues — for now the
worker only exposes a `GET /healthz` health check.

## How it works (so far)

`GET /healthz` → `200 { "ok": true }`. Everything else → `404`.

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

Migration files live in `sync-worker/migrations/` (currently just
`0001_init.sql`, creating the `users`/`magic_links`/`sessions`/
`progress_snapshots` tables).

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

Secrets (Resend API key for magic-link emails, etc.) are added by the
auth-endpoints follow-up issue, following the same `wrangler secret put`
pattern as `worker/` — see `docs/CLOUDFLARE_FEEDBACK_WORKER.md`.

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

- `/auth/request-link`, `/auth/verify`, `/auth/signout` (magic-link auth +
  rate limiting) — separate follow-up issue.
- `GET`/`PUT /sync` (progress snapshot storage) — separate follow-up issue.
- Frontend wiring (`AccountModal`/`AccountSection`, background sync) —
  separate follow-up issues.
