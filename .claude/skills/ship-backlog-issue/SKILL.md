---
name: ship-backlog-issue
description: Pick an open issue from the GitHub backlog, implement it, open a PR, merge it, and close the issue. Runs the same checks CI runs (lint, test, build) locally first so we don't push something CI would reject and then sit waiting on a red check. Use when asked to "work the backlog", "pick up an issue", "ship issue #N", or similar.
---

You're working through this repo's GitHub issue backlog end to end: pick → implement → verify → PR → merge → close. The goal is to never push something that CI would fail — run CI's own steps locally first.

**Tool choice:** if the `gh` CLI is available and authenticated, use it. Otherwise use the `mcp__github__*` GitHub MCP tools (`list_issues`, `create_pull_request`, `merge_pull_request`, `issue_write`, etc. — use `ToolSearch` to load their schemas). Don't mix the two within one run.

## 1. Pick an issue

- List open issues (`gh issue list --state open` or `mcp__github__list_issues`). If the user named a specific issue (`ship issue #N`, a pasted URL, or a title), use that one directly — skip to step 2.
- Otherwise, prefer issues labeled for backlog/ready work if such a label exists in this repo; otherwise just show the open issue list.
- If more than one candidate issue exists and the user didn't specify one, use `AskUserQuestion` to let the user pick rather than guessing priority.
- Read the full issue body and comments before starting — don't implement off the title alone.

## 2. Branch

- Create a branch off the latest default branch: `issue-<number>-<short-slug>`.
- If the repo's CLAUDE.md or another skill names a different branch convention, follow that instead.

## 3. Implement

- Read `CLAUDE.md` and `docs/DECISIONS.md` first — this repo expects settled architectural decisions to be respected, not relitigated.
- Make the smallest correct change that resolves the issue. Follow the project's existing patterns (e.g. `JOURNEY`/`LESSONS`/`VERBS` conventions for journey changes — see CLAUDE.md's "Working on the learning journey" section).
- If the change is a notable/non-obvious decision, add a dated entry to `docs/DECISIONS.md` (or `docs/academic/LANGUAGE_DECISIONS.md` for conjugation-data calls), per the project's own logging convention.

## 4. Run the same checks CI runs — before pushing

Check `.github/workflows/ci.yml` for the current step list (don't assume it hasn't changed). As of writing, CI runs, in order:

```
npm ci
npm run lint
npm test
npm run build
```

Run exactly these locally and fix everything before moving on. Do not push, open a PR, or ask for review while any of these are failing — the whole point of this skill is to never wait on a CI run that was predictable. If `journey.js`, `lessons.js`, or `verbs.js` changed, `npm test` already covers `journey.test.js`'s cross-checks — don't skip it.

## 5. Commit, push, open the PR

- Commit with a message describing why, not just what (repo convention — see CLAUDE.md tone).
- Push the branch and open a PR that references the issue (`Closes #N` in the body so GitHub auto-links it).
- Keep the PR description short: summary + test plan, matching this project's existing PR style if visible in recent merged PRs.

## 6. Confirm before merging

Before merging, show the user: the PR link, a one-line summary of the change, and confirmation that lint/test/build all passed locally. Get an explicit go-ahead unless the user's original request already authorized full automation (e.g. they said "merge it yourself" or "no need to ask") — merging into the default branch is shared, hard-to-fully-undo state, so don't skip this silently.

- Also check actual CI status on the PR once pushed (`gh pr checks` / `mcp__github__pull_request_read`) — local checks should already match, but confirm before merging rather than assuming.

## 7. Merge and close

- Merge the PR (squash unless the repo's history shows a different convention).
- If `Closes #N` was in the PR body, GitHub closes the issue automatically on merge — verify it actually closed. If it didn't (e.g. squash merge sometimes needs the keyword in the final commit message too), close the issue explicitly and link the merged PR in the closing comment.
- Report back: issue number, PR link, what changed, and that it's merged and closed.
