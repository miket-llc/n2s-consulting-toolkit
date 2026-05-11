# Changelog

All notable changes to the n2s-consulting-toolkit prototype are recorded here.
Format roughly follows [Keep a Changelog](https://keepachangelog.com).
Versions are semver-ish for a prototype (`0.x` is pre-pilot; `1.0` will be the first stable pilot cut).

## [Unreleased] — 2026-05-11 (afternoon)

Planning pivot. Doc-only; no UI changes (audit-safe). User answered the six load-bearing questions in `docs/MVP-PILOT-PLAN.md` §2; three answers (Q1 → Stance B, Q3 → >5 self-serve users, Q6 → real LLM behind AskPage before pilot) cluster into a Stance A → Stance B pivot. `chief-architect` produced a replan that replaces PLAN §5–§14.

### Added
- `docs/MVP-PILOT-PLAN.md` §5–§14 — Stance B replan: locked stack (Clerk + Neon Postgres + Drizzle + Vercel AI SDK + AI Gateway + pgvector, all via Vercel Marketplace), Postgres data model (catalog / per-engagement / per-user split), six-sprint sequence (B0 cleanup → B5 content + rehearsal), pilot date 2026-08-03, Stance B risk register (R-AUTH, R-MIG, R-LLM-COST, R-LLM-HALL, R-COLD, R-SECRETS, R-FERPA, R-LOCK, R-INVITE, R-PARITY, R-EMPTY-OC, R-CONTENT-DRIFT, R-XSS), updated cull catalog, updated agent ownership matrix, six open architectural sub-questions for the user.
- `.claude/agent-memory/chief-architect/project_stance_b_replan_2026_05_11.md` — full reasoning trace (~18 KB) behind every choice in PLAN §5–§14: why each stack pick, sprint-sequencing logic for solo+agents capacity, calendar derivation honoring US holidays, sub-question recommendations.
- New agents recommended for the roster: `platform-engineer` (NEW; owns server-side surface — Drizzle schema + migrations, API routes, Clerk wiring, Neon connection, AI Gateway integration, secrets, audit log) and `ai-architect` (already in available registry; formally added to roster for B4 RFC). `docs-leader` to update `AGENTS.md`; `chief-architect` to draft platform-engineer spec.

### Changed
- `docs/MVP-PILOT-PLAN.md` §1–§2 + status banner — Stance A recommendation preserved as historical context with a Stance-B-pivot UPDATE callout. §2 rewritten as RESOLVED with the answers table and Stance-B-specific secondary questions.
- `docs/MVP-PILOT-PLAN.md` §5 banner — old Stance A §5 (3-sprint plan with rows A1–A20, B1–B20, C1–C16) replaced; surviving items (B1 v1 cull, B2 dead-export cull, audit-drift fixes, focus pass, CSS cull, CI gate, Playwright bootstrap) folded into the new B0 sprint.
- `BACKLOG.md` — State of play notes the pivot; "Open questions" rewritten as RESOLVED; "Stance B replan" section now LANDED with headline summary; old Sprint B/C marked OBSOLETE; Tier 2 + Out-of-scope rewritten so multi-user / persistence / LLM are no longer described as deferred.
- `docs/HANDOFF.md` — pivot banner at top so any fresh session pasted from this handoff sees the update before acting on Stance A guidance.
- `.claude/agent-memory/chief-architect/MEMORY.md` — new entry indexes the Stance B replan trace; prior `project_mvp_pilot_review.md` flagged as superseded.

### Versioning note
Per the Stance B replan, the next release tags are `0.3.0-beta.1` at end of Sprint B3 (mutations + cutover) and `1.0.0-pilot.1` at end of Sprint B5 (content + rehearsal). The Stance A `0.2.0` (final, drop pre-audit suffix) version is now obsolete and skipped.

## [0.2.0-pre-audit.1] — 2026-05-11

Sprint A — pre-audit hygiene. All landed UI-safe changes ahead of the 2026-05-15 drift audit. See [docs/MVP-PILOT-PLAN.md](docs/MVP-PILOT-PLAN.md) and [docs/audits/DRIFT-AUDIT-2026-05-15.md](docs/audits/DRIFT-AUDIT-2026-05-15.md).

### Added
- `app/error.tsx`, `app/not-found.tsx`, `app/loading.tsx` — top-level render-error boundary, 404 fallback, and loading skeleton. A render exception elsewhere in the SPA no longer blanks the whole page.
- Pre-paint inline `<script>` in `app/layout.tsx` — flips `<html>` class to `theme-dark` before React hydrates for dark-mode users, eliminating the light→dark flash on cold load.
- `docs/MVP-PILOT-PLAN.md` — unified three-sprint MVP-for-pilot plan synthesized from 10 parallel agent reviews.
- `docs/audits/DRIFT-AUDIT-2026-05-15.md` — pre-flight audit report against tarball `CgM4C5b7mEU63Y2RQISWcw`.
- `.vercelignore` — excludes `docs/*.xlsx`, `.claude/`, `scripts/` from deploys.
- Six surfaces formally classified as toolkit-original (no tarball counterpart): MyWork kanban toggle, Schedule gantt, Configuration Guide config-fields, `notImplemented()` toast system, ⌘K shortcut, top-level error boundary.

### Changed
- **Banner schema accuracy** in `lib/data.ts`:
  - `NBRPSN → NBAPOSN` (NBRPSN is a table; NBAPOSN is the Position Definition form).
  - `FTVVEND → FTMVEND` (FTV- is the Finance validation prefix; FTMVEND is the vendor maintenance form).
  - `STVTERM_POT_CODE` → `SOBPTRM_PTRM_CODE`, `STVTERM_POT_CENSUS_IND` → `SOBPTRM_CENSUS_DATE` (PoT records live on SOBPTRM, not STVTERM).
  - `FINDING_INDEX` STVMAJR/STVRESD labels corrected; misleading selectors cleared.
  - `DRC-4` OC reference moved from `RORPRIO` to `SOATERM`/`OC-2.4.1`/`create` (FA proc-year is a SOATERM field, not Award Priority).
- `is-6` Inner Source pattern rewritten as "FTMVEND setup + 1099 readiness checklist"; re-attributed to Raj Kapoor (Finance lead).
- `bastardLoopState` field renamed to `deliveryStage` (was visible in dev tools / type names).
- `GANTT_TODAY` now computed from `new Date()` at module load instead of hardcoded to May 1 (was 10+ days stale).
- `practice.tsx` "Open My work" — uses `useHash`'s `navigate()` instead of `window.location.hash` direct write.
- `AskPage` rewritten as an honest "Coming soon" state. Removed the textarea + disabled-Ask button (trust-killer per product-owner).
- Autopilot "Re-run baseline" / "Run on commit" buttons wired to `notImplemented()` toasts (were silent dead affordances).
- Settings "All connected" green pill → "Demo data — not connected to live systems" amber pill.
- Project Home brief footer — "Demo data — will pull from Jira, Smartsheet, the autopilot feed, and standup notes when wired" replaces the implicit live-data claim.
- README route table, file structure, interactions, and Legacy v1 section updated (6 stale claims corrected; tarball ID fixed from `fIMotZmRLqVfGyaje-CA1g` to `CgM4C5b7mEU63Y2RQISWcw`).
- BACKLOG.md updated for 2026-05-11; shipped items moved out of "Open questions" / "Tier 0".
- Version bumped from `0.1.0` to `0.2.0-pre-audit.1`.

### Fixed
- Untracked `lib/school-brands.ts` is now committed (was an unstaged file that broke fresh-clone builds).

## [0.2.0-sprint1] — 2026-05-11 (earlier same day)

Pre-Sprint-A sprint that shipped the three main features.

### Added
- **MyWork kanban toggle** — Buckets | Board view switcher in `#mywork` with 5 status columns (Backlog / Ready / In Progress / Needs Review / Done). View choice persists to `localStorage["v2.mywork.view"]`.
- **Schedule 12-month gantt** — Replaces `#schedule` stub list with go-live readiness band + swimlane gantt. Rows = go-lives, columns = months, dots = milestones colored by type. Today marker on column 0.
- **Configuration Guide config-fields** — Per-section `ConfigFieldsTable` in `ConfigurationGuidePage`. Two-state review (unreviewed / confirmed) persisted to `localStorage["v2.cfg.<engagementId>.<ocId>.<fieldId>"]`. SOATERM populated with 9 rows across 6 sections; other OCs render empty-state pill.
- New `TaskStatus` union + `TASK_STATUSES` const + `ConfigField` type + `CONFIG_FIELDS_BY_OC` map in `lib/data.ts`.
- CSS: `.v2-mywork-viewtoggle`, `.v2-board-*`, `.v2-gantt-*` in `v2.css`; `.d-configtable-*` in `detail.css`.

## [0.1.x] — earlier sprints

- 2026-05-07: Capability detail (`#capabilities/<capId>`) + Configuration guide (`#guides/<ocId>`) ported from tarball `1RfZ75xyWLRCReEBkJ25nw`. `components/v2/detail.tsx` + `app/styles/detail.css`.
- 2026-05-04: Engagement-logos / SchoolLogo with curated → Clearbit → monogram fallback. `lib/school-brands.ts`.
- Earlier: 7 `alert()` dialogs → `notImplemented()` toast helper. ⌘K wired. Search input got `aria-label`. `scripts/smoke.sh` bootstrapped. README + AGENTS.md rewrites.
- v2 surface initial port from design tarball, mounted under `components/v2/*`. Legacy `components/views/*` + root-level `components/{shell,icons,tweaks-panel}.tsx` preserved as drift-audit reference.

## Versioning notes

- `0.1.x` — initial v2 port, hardening, alert→toast cleanup.
- `0.2.0-pre-audit.1` — Sprint A pre-audit hygiene (this release). Vercel-deployable.
- `0.2.0` — final pilot-ready cut. Lands at Sprint C close.
- `1.0.0-pilot.1` — first live pilot session.
