# Handoff — n2s-consulting-toolkit

**Cut at:** 2026-05-11 · `v0.2.0-pre-audit.1` · commit `504179d` (HEAD of `main`)
**Next gate:** 2026-05-15 drift audit (T-4 days)
**Next pilot work starts:** 2026-05-18 (Sprint B)

---

> **STATUS UPDATE — 2026-05-11 PM (after this handoff was written).**
>
> User answered the six load-bearing questions in [`MVP-PILOT-PLAN.md`](MVP-PILOT-PLAN.md) §2. Three answers cluster into a Stance pivot:
> - **Q1 → Stance B** (prototype + real backend, NOT recommended Stance A)
> - **Q3 → >5 self-serve users** (engagement-scoped isolation now must-have)
> - **Q6 → Real LLM behind AskPage before pilot**
>
> The "Sprint B" / "Sprint C" / "Tone" / "Honest scope reminder" sections below describe the **obsolete Stance A plan**. They are preserved as historical context. **Do not act on them.** `chief-architect` produced the Stance B replan; **`docs/MVP-PILOT-PLAN.md` §5–§14 is now the live plan** (architecture, data model, six-sprint sequence B0→B5, pilot 2026-08-03, new `platform-engineer` agent recommended). Reasoning trace at `.claude/agent-memory/chief-architect/project_stance_b_replan_2026_05_11.md`. The May 15 drift audit + May 13 EOD freeze + Sprint A items already shipped are unaffected.
>
> **What still applies from this handoff:** the doc-reading order at the top of "Paste this into a new session"; the running-locally section (port 4321, smoke gate); the "What's left for the user" interactive items (Vercel link, preview, prod, push tag, branch protect — Vercel still the deploy platform per Q5).
>
> **What does NOT apply:** Sprint B/C tables (rescoped); the "Single user (Janet)" tone bullet (multi-user is now scoped in); the "Honest scope reminder" Stance A claim.

---

## Paste this into a new session to pick up the work

> You are continuing work on **n2s-consulting-toolkit** at `/Users/mdt/dev/n2s-consulting-toolkit`. The repo is a hi-fi clickable prototype of an internal Ellucian Banner-SaaS consulting toolkit, working toward a hosted production pilot. Sprint A pre-audit hygiene shipped today (2026-05-11) as `v0.2.0-pre-audit.1`. The drift audit fires 2026-05-15; Sprint B starts 2026-05-18.
>
> **Read these in order before doing anything (≈10 minutes):**
> 1. [`AGENTS.md`](../AGENTS.md) — the 10-agent team and how to invoke each
> 2. [`README.md`](../README.md) — current state of the mounted v2 surface
> 3. [`docs/MVP-PILOT-PLAN.md`](MVP-PILOT-PLAN.md) — three-sprint plan (A → B → C), risk register, cull catalog, agent ownership matrix, the six open user questions
> 4. [`docs/audits/DRIFT-AUDIT-2026-05-15.md`](audits/DRIFT-AUDIT-2026-05-15.md) — pre-flight classification of every diff vs source tarball
> 5. [`CHANGELOG.md`](../CHANGELOG.md) — what landed today
> 6. [`BACKLOG.md`](../BACKLOG.md) — historical record + open questions (NOT the live work list — that's the PLAN)
>
> **Where work lives** (in order of authority):
> - The live work list is `docs/MVP-PILOT-PLAN.md`. When an item lands, update it in place.
> - Per-agent memory at `.claude/agent-memory/<agent>/MEMORY.md` + typed `project_*.md` / `feedback_*.md` / `reference_*.md` files. Read the relevant agent's memory before doing their work.
> - The drift baseline is design tarball `CgM4C5b7mEU63Y2RQISWcw`, extracted at `/tmp/design-CgM4C5b7/n2s-consulting-toolkit/` if still present, otherwise refetch per `.claude/agent-memory/design-fidelity-guardian/reference_design_tarballs.md`.
>
> **Defaults are applied for the six load-bearing questions** (see PLAN §2). Override with the user before flipping the plan: pilot stance, pilot date, pilot users, re-anchor drift baseline, pilot URL, AskPage future.
>
> **Run the toolkit** with `pnpm next dev --port 4321 --hostname 127.0.0.1` (a stale instance on port 3000 was killed earlier today — Next refuses a second dev server in the same project dir, so stick to one). The smoke gate is `pnpm smoke` (build + curl + v2 marker assertions). It must stay green at every commit.
>
> **When in doubt, route through `chief-architect`.** Disputes between agents converge there.

---

## Status snapshot at the cut

**Mounted v2 surface** (`components/v2/{shell,practice,home,pages,detail,icons}.tsx` + `app/styles/{tokens,v2,detail}.css`) is the live UI. Eleven hash routes, two sub-routes (`#capabilities/<capId>`, `#guides/<ocId>`), no backend, no auth, `localStorage`-only persistence.

**Sprint A done** (17 of 20 items committed in 3 clean commits today):
- Banner schema corrected — `NBRPSN`→`NBAPOSN`, `FTVVEND`→`FTMVEND`, PoT columns `STVTERM_*`→`SOBPTRM_*`, `FINDING_INDEX` labels, DRC-4 OC ref → SOATERM, `is-6` Inner Source rewrite
- `bastardLoopState` → `deliveryStage` (dev-tools embarrassment fixed)
- `GANTT_TODAY` computed at module load (was hardcoded to May 1, ten days stale)
- Error boundary + 404 + loading routes (single render crash no longer blanks the SPA)
- Pre-paint theme script (no more light→dark flash for dark-mode users)
- AskPage rewritten as honest "Coming soon" (was a textarea + disabled-button trust kill)
- Autopilot dead buttons wired to `notImplemented()` toast
- Settings "All connected" → "Demo data — not connected to live systems" (amber)
- Project Home brief footer demo-honest
- `lib/school-brands.ts` committed (was untracked; broke clean-clone builds)
- README + BACKLOG + CHANGELOG refreshed
- `.gitignore` + `.vercelignore` configured
- `0.1.0` → `0.2.0-pre-audit.1`

**Sprint A leftovers** (interactive-only — see §"What's left for the user" below).

**Sprint 1 features** that shipped earlier today and were also in this push:
- MyWork Buckets | Board view toggle (`localStorage["v2.mywork.view"]`)
- Schedule 12-month milestone gantt
- Configuration Guide `ConfigFieldsTable` with two-state review (SOATERM populated, 11 other OCs render empty-state pill)

All three are toolkit-original additions not in the source tarball. Formal classification in `.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md`.

**Build:** green. **Smoke:** green. **Dev server:** running on `http://127.0.0.1:4321` (PID at session start was 95222; check with `lsof -nP -iTCP:4321 -sTCP:LISTEN`).

---

## What's left for the user (interactive only — can't be done from an agent session)

| Item | Command / action | Owner | When |
|---|---|---|---|
| **Vercel link** | `vercel link` (one-time auth) | release-manager | Today |
| **Preview deploy** | `vercel` | release-manager | Today |
| **Production promote** | `vercel --prod` (after preview validation) | release-manager | Today |
| **Push tag to remote** | `git push origin --tags` (tag already created at HEAD) | release-manager | Today |
| **Branch protect `main`** | GitHub repo settings → require PR + CI | release-manager | Before Sprint B |
| **Freeze `main`** | No new merges until 2026-05-15 audit closes | chief-architect | EOD 2026-05-13 |
| **Answer the six PLAN-§2 questions** | Confirm or override defaults | product-manager | EOD 2026-05-13 |

---

## What the team picks up next

### Sprint B (post-audit, 2026-05-18 → 2026-05-22)

Full list with owners + sizes in [`docs/MVP-PILOT-PLAN.md`](MVP-PILOT-PLAN.md) §5. The headline items:

- **B1 (lead-developer · S)** — delete v1 archive in one commit (~3,841 lines): `components/views/*`, root-level `components/{shell,icons,tweaks-panel}.tsx`, `app/styles/styles.css`
- **B2 (lead-developer · S)** — cull dead exports in `lib/data.ts` (~96 lines): `Member`, `ENGAGEMENT`, `SPRINTS`, `ACTIVE_SPRINT`, `SPRINT_PLAN_BACKLOG`, `DOC_TREE`, `DOCUMENTS`, `SMART_QUEUE`, `FINDING_INDEX`
- **B9, B10 (methodology-guru → lead-developer · L)** — populate SFARCTL and SPAIDEN OC bodies (the two most-likely-clicked guides beyond SOATERM)
- **B11 (ux-visionary · S)** — define `--surface-1` / `--surface-2` tokens (Autopilot pane is currently broken in both themes)
- **B12 (ux-visionary · S)** — light-mode `.d-code` override (Configuration Guide code blocks unreadable in default theme)
- **B13 (ux-visionary · M)** — focus-visible pass across all interactive elements (WCAG AA)
- **B17 (release-manager · M)** — GitHub Actions: `pnpm next build` + `pnpm smoke` on push/PR; branch protection on `main`
- **B18 (test-engineer · M)** — Playwright bootstrap: 1 smoke spec hitting all 11 routes asserting no JS crash
- **B5–B8** — wiring fixes (DRC click → guide section, Project Home capability/guide/workshop deep-links, MyWork hero count line)

### Sprint C (pilot polish, 2026-05-25 → 2026-05-31)

Per PLAN §5. Headline: NBAPOSN + PTREARN OC bodies; second engagement populated (WIU or CSU) so the project-switcher doesn't lie; `#decisions/<id>` + `#workshops/<id>` detail surfaces; ⌘K wired to in-memory search; Vercel Analytics; pilot rehearsal with `product-owner`.

### Post-pilot

PLAN §"D — Post-pilot signal" — replan based on real feedback. Earned-stance question: do we evolve to Stance B (real backend) or hold at hosted demo?

---

## Where to start each kind of work

| If you want to… | Read this first | Then invoke |
|---|---|---|
| Add or change a screen | Relevant `components/v2/*.tsx` + design tarball counterpart | `lead-developer` |
| Fix a render bug or crash | The error boundary first (`app/error.tsx`); reproduce in `pnpm dev` | `lead-developer` |
| Adjust visuals, fix theme parity, fix a11y | `app/styles/tokens.css` for tokens; `v2.css` + `detail.css` for selectors | `ux-visionary` |
| Validate against source design | `docs/audits/DRIFT-AUDIT-2026-05-15.md` + tarball | `design-fidelity-guardian` |
| Fix Banner / Ellucian content accuracy | `lib/data.ts` + `.claude/agent-memory/methodology-guru/project_mvp_pilot_review.md` | `methodology-guru` |
| Scope, cut, or sequence work | `docs/MVP-PILOT-PLAN.md` | `product-manager` |
| Sanity-check the user experience | Click the surface; speak as Janet | `product-owner` |
| Deploy, version, tag, CI | This file's "What's left for the user" + release-manager memory | `release-manager` |
| Update README / ADRs / changelogs | The doc itself + `docs-leader` memory | `docs-leader` |
| Write tests | None today beyond `scripts/smoke.sh` | `test-engineer` |
| Cross-cutting architectural calls | Everything above | `chief-architect` |

---

## Communication contracts

- **`docs/MVP-PILOT-PLAN.md` is the live work list.** Update items in place as they land. If a new item emerges, add it under the right sprint with owner + size.
- **`BACKLOG.md` is the historical record + open scope questions.** Not the live work list. Update when items ship or when questions resolve.
- **`CHANGELOG.md` is the user-facing release log.** Update on every commit that lands in `main` (per Keep-a-Changelog-ish). Versions: `0.x` is pre-pilot; `1.0` is first pilot session.
- **`.claude/agent-memory/<agent>/MEMORY.md`** indexes that agent's memory. New facts go in typed files (`feedback_*.md`, `project_*.md`, `reference_*.md`, `user_*.md`) and get linked from MEMORY.md. Commit memory alongside code in the same change set.
- **Drift audit reports** live at `docs/audits/DRIFT-AUDIT-YYYY-MM-DD.md`.

---

## Running locally

```bash
# Dev (HMR, currently running on 127.0.0.1:4321):
pnpm next dev --port 4321 --hostname 127.0.0.1

# Smoke gate (build + curl + v2 marker assertions — must stay green at every commit):
pnpm smoke

# Static prerender for production-like preview:
pnpm next build && pnpm next start --port 4321
```

**Port hygiene:** ports 3001 / 3002 / 3003 belong to sibling projects (`n2s-heear-editor`, `n2s-active-playbook`). Stay off them. 4321 is this toolkit's safe port. Macs claim 5000 for AirPlay. Don't bind to `0.0.0.0` unless explicitly demoing on the LAN.

---

## Deployment (when you're ready)

1. `vercel link` — once. Pick the GitHub remote, not Bitbucket. Vercel auto-builds on push.
2. `vercel` for a preview, `vercel --prod` for production.
3. Custom domain post-pilot if requested; default is `*.vercel.app`.
4. **No env vars needed** for the current static SPA.
5. **No telemetry yet** — Vercel Web Analytics lands in Sprint C9.

The `.vercelignore` excludes `docs/*.xlsx`, `.claude/`, `scripts/`, `/tmp/` from the deploy artifact.

---

## Tone for the next session

- Prototype, not product. Don't over-engineer.
- Demo-safe: every interaction must do something visible (toast, navigate, render). No silent dead buttons.
- Honest: never claim live-data when it's mock; the "Demo data — not connected" amber pill on Settings is the model.
- Single user (Janet). No multi-user, no auth, no real persistence.
- Hand-authored CSS keyed to tokens. No frameworks (no Tailwind, no UI kit). No state library.
- Tests come later (Sprint B). For now the smoke gate is the contract.
- Talk like a consultant when writing copy. `methodology-guru` is the voice authority; check before shipping new domain content.

When you're done with a slice, run `pnpm smoke` and commit in clean chunks with the imperative style this repo already uses (see `git log -5 --format=%s`).

---

## Honest scope reminder

This pilot is **Stance A — hosted hi-fi demo with mock data, single-tenant on NSU + (Sprint C) WIU or CSU**. It is not a backend, not multi-tenant, not auth-gated. If the user starts asking for "real persistence" or "share with my client live," surface the question to `chief-architect` before doing the work — it flips the plan from days to months.

The pilot exists to learn whether the UX shape is right. That's the success criterion.
