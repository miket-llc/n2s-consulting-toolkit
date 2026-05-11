# Handoff — n2s-consulting-toolkit

**Cut at:** 2026-05-11 PM · `v0.2.0-pre-audit.1` · commit `28bca20` (HEAD of `main`)
**Stance:** B (real auth + DB + LLM behind AskPage; multi-user; mock-shape persistence)
**Pilot date target:** 2026-08-03 — **conditional on hosting funding landing by ~2026-07-25**
**Next gates:** 2026-05-13 EOD `main` UI-freeze · 2026-05-15 drift audit fires · 2026-05-18 Sprint B0 starts

---

## Paste this into a new session to pick up the work

> You are continuing work on **n2s-consulting-toolkit** at `/Users/mdt/dev/n2s-consulting-toolkit`. The repo is a hi-fi clickable prototype of an internal Ellucian Banner-SaaS consulting toolkit. Sprint A pre-audit hygiene shipped 2026-05-11 morning as `v0.2.0-pre-audit.1`. The afternoon brought a Stance pivot (A → B), a same-day shell redesign (`K3NKe3IuvfS03Mr6yWnkDw` tarball), and a hosting deferral. The drift audit fires 2026-05-15; Sprint B0 (post-audit cleanup) starts 2026-05-18.
>
> **Read these in order before doing anything (≈15 minutes):**
> 1. [`AGENTS.md`](../AGENTS.md) — the 10-agent team + the new `platform-engineer` and `ai-architect` recommended in the Stance B replan
> 2. [`README.md`](../README.md) — current state of the mounted v2 surface
> 3. [`docs/MVP-PILOT-PLAN.md`](MVP-PILOT-PLAN.md) §5–§14 — **the live plan** (Stance B). §1–§4 are historical; the Stance A recommendation in §1 is preserved as context but no longer applies
> 4. [`docs/audits/DRIFT-AUDIT-2026-05-15.md`](audits/DRIFT-AUDIT-2026-05-15.md) — pre-flight against re-anchored baseline `K3NKe3IuvfS03Mr6yWnkDw`
> 5. [`.claude/agent-memory/chief-architect/project_stance_b_replan_2026_05_11.md`](../.claude/agent-memory/chief-architect/project_stance_b_replan_2026_05_11.md) — full reasoning trace (~18 KB) behind every Stance B choice
> 6. [`CHANGELOG.md`](../CHANGELOG.md) — three Unreleased sections recording today's work (planning pivot · shell redesign · hosting deferral + CI)
> 7. [`BACKLOG.md`](../BACKLOG.md) — historical record + the resolved §2 questions. Not the live work list — that's the PLAN.
>
> **Where work lives** (in order of authority):
> - The live work list is `docs/MVP-PILOT-PLAN.md` §7 (sprint replan B0–B5). Update items in place as they land.
> - Per-agent memory at `.claude/agent-memory/<agent>/MEMORY.md` + typed `project_*.md` / `feedback_*.md` / `reference_*.md` / `user_*.md` files. Read the relevant agent's memory before doing their work; commit memory alongside code in the same change set.
> - The drift baseline is `K3NKe3IuvfS03Mr6yWnkDw` (extracted at `/tmp/design-K3NKe3Iu/n2s-consulting-toolkit/` if still present, otherwise refetch per `.claude/agent-memory/design-fidelity-guardian/reference_design_tarballs.md`).
>
> **The six §2 questions are RESOLVED.** Q5 (Vercel URL) flipped to **DEFERRED** — hosting waits for pilot funding. Stack choices in PLAN §5.1 still target Vercel-friendly defaults but each layer has a free dev-mode setup; do NOT run `vercel link` or any Vercel CLI commands. Six follow-up architectural sub-questions in PLAN §13 remain open (Q5 of §13 is MOOT until hosting; the other five live).
>
> **Run the toolkit** with `pnpm dev` — now binds to `127.0.0.1:4321` by default (was `localhost:3000`; collides with sibling projects). `pnpm smoke` is the local gate; GitHub Actions runs the same smoke on push/PR. Both must stay green at every commit.
>
> **When in doubt, route through `chief-architect`.** Disputes between agents converge there. For new server-side work (Drizzle / API routes / Clerk wiring), `platform-engineer` is the owner — chief-architect drafts that agent's spec when first invoked.

---

## Status snapshot at the cut

**Mounted v2 surface** (`components/v2/{shell,practice,home,pages,detail,icons}.tsx` + `app/styles/{tokens,v2,detail}.css`) is the live UI.

- **Eleven hash routes** + two sub-routes (`#capabilities/<capId>`, `#guides/<ocId>`).
- **Hash-routed**, no backend, no auth, `localStorage`-only persistence.
- **New shell** (TopBar 44px violet gradient + `ProjectContextBar` strip + passive `ProjectIdentityChip` on non-project routes) landed today from design tarball `K3NKe3IuvfS03Mr6yWnkDw`. The audit baseline re-anchored to this tarball.

**Sprint A complete (2026-05-11):**
- Banner schema corrected (`NBRPSN`→`NBAPOSN`, `FTVVEND`→`FTMVEND`, PoT cols, `FINDING_INDEX` labels, DRC-4 OC ref, `is-6` Inner Source rewrite)
- `bastardLoopState` → `deliveryStage`
- `GANTT_TODAY` runtime-computed
- Error boundary + 404 + loading routes
- Pre-paint theme script (no light→dark flash)
- AskPage honest "Coming soon" stub
- Autopilot dead buttons → `notImplemented()`
- Settings amber "Demo data — not connected" pill
- `lib/school-brands.ts` committed
- `0.1.0` → `0.2.0-pre-audit.1`

**Sprint 1 features (also 2026-05-11 morning):** MyWork Buckets|Board view toggle, Schedule 12-month gantt, Configuration Guide config-fields with two-state review (SOATERM populated). All three flagged as toolkit-original additions in design-fidelity-guardian's memory.

**Three afternoon checkpoints:**
1. Stance B replan landed (`f6d68c8`). chief-architect produced PLAN §5–§14 covering architecture (Clerk + Neon + Drizzle + Vercel AI SDK + pgvector), data model, six-sprint sequence (B0→B5), pilot date 2026-08-03, risk register, six open sub-questions. Reasoning trace in chief-architect memory.
2. Design K3NKe3Iu shell slice (`5257598`). Three-agent parallel critique (ux-visionary spec / product-manager scope / product-owner Janet reaction) → implementation. PO's required tweak (passive identity chip on non-project routes) included.
3. Vercel deferred + CI live (`28bca20`). PLAN §2 Q5 flipped DEFERRED; §5.1 grew dev-mode column. `.github/workflows/ci.yml` runs smoke on push/PR (39s end-to-end on first run). `package.json` pinned: `pnpm@10.30.3`, Node ≥20; `pnpm dev` now binds to `127.0.0.1:4321`.

**Build:** green. **Smoke:** green (local + CI). **Dev server:** running on `http://127.0.0.1:4321` (PID at session-cut was 95200 in this workspace's terminal log; check with `lsof -nP -iTCP:4321 -sTCP:LISTEN`).

**Repo state:**
- `main` at `28bca20`. Pushed to `origin` (GitHub) AND `bitbucket` (`git.ellucian.com/scm/aafm/n2s-consulting-toolkit`).
- Tag `v0.2.0-pre-audit.1` on both remotes.
- Branch protection on `origin/main` via `gh api`: linear history required, no force pushes, no deletions, dismiss stale reviews, PR-required count 0 (single contributor; bump when collaborators land). No equivalent on Bitbucket — set via Ellucian's repo settings UI when needed.
- GitHub Actions CI green; no equivalent on Bitbucket (would be Pipelines / Jenkins config — separate work).

---

## Calendar — what happens when

```
2026-05-11 (today PM)  Replan + shell slice + hosting deferral landed. CI live.
2026-05-12             Quiet. Optional: methodology-guru OC body work locally; nothing UI-affecting.
2026-05-13 EOD         Freeze main. UI-only freeze; doc/memory/CI changes still ok. Tag v0.2.0-pre-audit at audit-input SHA if anything has moved.
2026-05-14             design-fidelity-guardian finalizes DRIFT-AUDIT-2026-05-15.md against current HEAD.
2026-05-15             Drift audit fires. Audit report posted; classification of any drift since pre-flight.
2026-05-16–17          Weekend.
2026-05-18 → 05-22     Sprint B0 — post-audit cleanup. Surviving Stance A items: v1 archive cull (~3,841 lines), dead lib/data.ts exports (~96 lines), drift fixes from audit, focus-visible pass, CSS cull, Playwright bootstrap. CI gate ALREADY DONE (B0-6 closed early in 28bca20).
2026-05-25 → 06-05     Sprint B1 — data layer foundation. Drizzle + Neon dev branch + schema + seed + read-only API routes. UI doesn't change yet.
2026-06-08 → 06-19     Sprint B2 — auth + engagement scoping (Clerk dev keys, R8 closed).
2026-06-22 → 07-03     Sprint B3 — mutations + cutover. v2 stops importing lib/data.ts; localStorage migration runs once.
2026-07-06 → 07-17     Sprint B4 — AskPage RAG (pgvector, streaming chat, rate limits).
2026-07-20 → 07-31     Sprint B5 — content (5 OCs) + 2nd engagement + Decision/Workshop detail + ⌘K + USER_GUIDE + rehearsal.
~2026-07-25            DEPLOY-FUNDING DEADLINE. If Vercel hosting is funded by here, the pilot still hits 8/3. Otherwise the build proceeds locally and the pilot itself slips.
2026-08-03             PILOT (conditional). Janet drives; stakeholders watch.
2026-08-04+            Observe. Post-pilot replan based on feedback signal.
```

---

## What's next — the immediate horizon

### Through May 15 (audit window)

The repo is **UI-frozen for everything except the K3NKe3Iu shell slice that already landed**. Permitted in this window:

- Doc / memory / CHANGELOG updates
- CI / scripts / tooling
- Methodology-guru OC body authoring in `lib/data.ts` (data only, no UI shape change)
- Banner schema corrections
- design-fidelity-guardian re-baselining work

NOT permitted (would invalidate audit baseline mid-flight):

- Any change to mounted `components/v2/*.tsx`
- Any change to `app/styles/{tokens,v2,detail}.css` that affects layout/visuals
- Any new mounted surface
- Any change to `app/page.tsx` route mapping

### Sprint B0 (May 18 → 22) — post-audit cleanup

Per PLAN §7. **lead-developer** primary, **ux-visionary** + **release-manager** + **test-engineer** co-own:

- B0-1: cull v1 archive in one commit (~3,841 lines)
- B0-2: cull dead `lib/data.ts` exports (~96 lines)
- B0-3: drift fixes from May 15 audit
- B0-4: focus-visible pass
- B0-5: duplicate CSS cull
- ~~B0-6: GitHub Actions CI~~ ✓ DONE EARLY in `28bca20`
- B0-7: Playwright bootstrap (1 spec hitting all 11 routes)

### Sprint B1 (May 25 → June 5) — data layer foundation

The first Stance B sprint. **platform-engineer** primary (this agent doesn't have a `.claude/agents/<name>.md` spec yet — chief-architect drafts that as B1 starts). Acceptance bar: an authenticated test user hits `/api/engagements/nsu` and gets the same shape `lib/data.ts` exports today, served from Postgres on a Neon dev branch.

Dev-mode setup order (per PLAN §5.3):
1. Neon dev branch → `DATABASE_URL` in `.env.local`
2. (Optional) local Docker postgres for offline work
3. `pnpm add @clerk/nextjs drizzle-orm drizzle-kit @neondatabase/serverless @ai-sdk/anthropic ai`
4. Add `.env.example` (committed, no secrets)

NO `vercel link`, NO Marketplace install, NO production env vars. The dev keys go in `.env.local` (gitignored).

---

## Where to start each kind of work

| If you want to… | Read this first | Then invoke |
|---|---|---|
| Add or change a screen | Relevant `components/v2/*.tsx` + design tarball at `/tmp/design-K3NKe3Iu/n2s-consulting-toolkit/project/v2/*.jsx` | `lead-developer` |
| Fix a render bug or crash | The error boundary first (`app/error.tsx`); reproduce via `pnpm dev` on `:4321` | `lead-developer` |
| Adjust visuals, fix theme parity, fix a11y | `app/styles/tokens.css` for tokens; `v2.css` + `detail.css` for selectors | `ux-visionary` |
| Validate against source design | `docs/audits/DRIFT-AUDIT-2026-05-15.md` + `K3NKe3IuvfS03Mr6yWnkDw` tarball | `design-fidelity-guardian` |
| Fix Banner / Ellucian content accuracy | `lib/data.ts` + `.claude/agent-memory/methodology-guru/project_mvp_pilot_review.md` | `methodology-guru` |
| Server-side work (DB, API routes, auth, secrets, audit log) | `chief-architect/project_stance_b_replan_2026_05_11.md` §3 (data model) | `platform-engineer` (NEW; chief-architect drafts spec on first invoke) |
| LLM RFC (model, prompt, refusal, rate limit, FERPA) | PLAN §13 Q2 + chief-architect replan trace §2 | `ai-architect` |
| Scope, cut, or sequence work | `docs/MVP-PILOT-PLAN.md` §7 + §13 | `product-manager` |
| Sanity-check the user experience as Janet | Click the surface; speak as Janet | `product-owner` |
| CI, version bumps, branch settings, releases | This file + `release-manager` memory | `release-manager` |
| Write tests | `scripts/smoke.sh` + `.github/workflows/ci.yml`; Playwright bootstrap is B0-7 | `test-engineer` |
| Update README / ADRs / changelogs / USER_GUIDE | The doc itself + `docs-leader` memory | `docs-leader` |
| Cross-cutting calls, agent disputes, replan triggers | Everything above | `chief-architect` |

---

## Communication contracts

- **`docs/MVP-PILOT-PLAN.md` is the live work list.** Update items in place as they land. New items go under the right sprint with owner + size. The Stance A historical context in §1–§4 is preserved deliberately — do not delete unless the user asks.
- **`BACKLOG.md` is the historical record + open scope questions.** Update when items ship or questions resolve. Not the live work list.
- **`CHANGELOG.md` is the user-facing release log.** Update on every commit landing in `main`. Versioning: `0.2.0-pre-audit.1` is current; next tags per Stance B replan are `0.3.0-beta.1` (end of B3 cutover) → `1.0.0-pilot.1` (end of B5).
- **`.claude/agent-memory/<agent>/MEMORY.md`** indexes that agent's memory. New facts go in typed files (`feedback_*.md`, `project_*.md`, `reference_*.md`, `user_*.md`) and get linked from MEMORY.md. Commit memory alongside code in the same change set.
- **Drift audit reports** live at `docs/audits/DRIFT-AUDIT-YYYY-MM-DD.md`.
- **Design tarball log** at `.claude/agent-memory/design-fidelity-guardian/reference_design_tarballs.md` — three baselines logged so far (`40V7…`, `CgM4C5b7…`, current `K3NKe3Iu…`).

---

## Running locally

```bash
# Dev (HMR, default port 4321 — set in package.json):
pnpm dev

# Smoke gate (build + curl + v2 marker assertions — must stay green at every commit):
pnpm smoke

# Production-like preview:
pnpm build && pnpm start
# (also serves on 4321 per package.json)
```

CI runs `pnpm smoke` on push to `main` and PRs targeting `main`. See [`.github/workflows/ci.yml`](../.github/workflows/ci.yml). Bitbucket has the same tree but no equivalent CI runner — set up Pipelines / Jenkins separately if Ellucian-side gating is needed.

**Port hygiene:** `3001` / `3002` / `3003` belong to sibling projects (`n2s-heear-editor`, `n2s-active-playbook`); `3001` is also smoke's port. Macs claim `5000` for AirPlay. **`4321` is this toolkit's safe port.** Don't bind to `0.0.0.0` unless explicitly demoing on the LAN.

---

## Hosting / deployment

**Deferred until pilot funding lands.** No Vercel project linked, no preview/prod deploys. Local dev + CI smoke is the contract.

The Stance B stack still targets Vercel-friendly defaults so eventual deploy is a config flip, not a rewrite (see PLAN §5.1 "Pilot-time path" column). When funding arrives, the dev-mode `.env.local` keys swap for Marketplace-auto-populated equivalents in a single one-day "deploy preflight": Vercel link → Neon Marketplace → Clerk Marketplace → AI Gateway → push.

Until then: **do not run `vercel link`, `vercel`, or `vercel --prod`.** Sharing the prototype = screen-share or screenshot, not a hosted URL.

---

## Open architectural sub-questions for the user (PLAN §13)

These are calls chief-architect deliberately surfaced rather than defaulted. Defaults will be applied if no override lands; the cost of overriding is documented in PLAN §13.

| Q | Question | Default | Override cost |
|---|---|---|---|
| 1 | Persistence scope: mock-shape vs real Banner/Jira/Smartsheet integration | mock-shape | +3 sprints, pilot slips ~Oct 12 |
| 2 | LLM blast radius: read-only chat vs action-taking agent | chat (RAG) | +1 sprint + tool-use safety RFC |
| 3 | Pilot date: 2026-08-03 vs 2026-07-20 aggressive | 8/3 | 7/20 cuts SPAIDEN/NBAPOSN/PTREARN populates + Decision/Workshop detail + rehearsal buffer |
| 4 | RAG corpus scope: populated OCs only vs all 12 | populated only | "indexed-stub" disclaimer in prompt template |
| 5 | Pilot user cap | ~~25 in Clerk allowlist~~ | **MOOT until hosting** |
| 6 | AskPage rate limit | 100 soft / 200 hard per user/day | cost ↔ frustration trade |

Q1, Q2, Q3 materially shift the build. The others are tunings.

---

## Tone for the next session

- Prototype, not product. Don't over-engineer. Stance B adds backend depth, not new screens.
- Demo-safe: every interaction must do something visible (toast, navigate, render). No silent dead buttons. Same standard as Sprint A.
- Honest: never claim live data when it's mock; under Stance B persistence the "Demo data" pill becomes "Your engagement data" in B3-6, not before.
- Multi-user is in scope. The single-user "Janet" framing of Stance A no longer applies — engagement-scoped isolation is the R-AUTH risk's mitigation.
- Hand-authored CSS keyed to tokens. No frameworks (no Tailwind, no UI kit). No state library; React 19 hooks only.
- Talk like a consultant when writing copy. `methodology-guru` is the voice authority; check before shipping new domain content.
- Tests: smoke is the gate today. Playwright bootstraps in B0-7. Vitest deferred until algorithmic logic lands.

When you finish a slice: run `pnpm smoke`, commit in clean chunks with the imperative style this repo uses (`git log -5 --format=%s` for the convention), and push to BOTH `origin` and `bitbucket`.

---

## Honest scope reminder

Stance B is **prototype with a real backend** — auth, persistence, LLM-behind-AskPage. It is NOT real Banner/Jira/Smartsheet integration (per Q1 default), NOT an action-taking AI agent (per Q2 default), and NOT a multi-tenant platform (single Ellucian-org-of-consultants in Clerk for the pilot). If the user starts asking for any of those, surface the question to `chief-architect` before doing the work — each one shifts the timeline by weeks.

The pilot exists to learn whether the UX shape is right when consultants can actually use it on a real engagement (with their own state, on a real LLM). That's the success criterion. The product proof is "did consultants come back the second day."
