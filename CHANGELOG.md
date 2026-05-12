# Changelog

All notable changes to the n2s-consulting-toolkit prototype are recorded here.
Format roughly follows [Keep a Changelog](https://keepachangelog.com).
Versions are semver-ish for a prototype (`0.x` is pre-pilot; `1.0` will be the first stable pilot cut).

## [Unreleased] — 2026-05-12 (morning)

Work Products entity landed (data shape only — freeze-safe). User answered the architecture fork: **Path B — toolkit stays independent**. Sibling-project tour (`n2s-active-playbook`, `n2s-heear-editor`) confirmed both already model work products as first-class typed entities with kanban + stage-progress UI. Toolkit copies active-playbook's `WorkProductSchema` field names verbatim so a future bridge to canonical data is a swap, not a refactor. Three views (per-capability tab, portfolio kanban, per-WP detail) added to Sprint B0 as B0-8; deferred past audit per UI freeze.

### Added
- `lib/data.ts` — new `WorkProduct` type + `WorkProductPhase`, `WorkProductState`, `RaciRole`, `CapabilityRef` types, plus `WORK_PRODUCT_STATES` / `WORK_PRODUCT_STATE_LABELS` helpers. Methodology-side fields (`id`, `title`, `phase`, `stage`, `order`, `raci`, `purpose_and_scope`, `definition_of_done`, `exemptions`, `owner`, `prerequisites`, `feeds_into`, `capability_refs`, `applies_to`) match active-playbook's `WorkProductSchema` verbatim. Runtime fields (`engagement_id`, `capability_id`, `state`, `due`, `linked_oc_ids`, `linked_drc_ids`) are toolkit-specific (active-playbook puts these on `Task`, but this prototype's frame is engagement-centric so they materialize on the WP). State machine: `not-started → in-progress → needs-review → signed`, with `blocked` as an off-ladder state.
- `lib/data.ts` `WORK_PRODUCTS` — methodology-guru seeded 17 entries across NSU (12), WIU (3), CSU EB (2). State distribution: 5 `signed` / 5 `in-progress` / 2 `needs-review` / 4 `not-started` / 1 `blocked`. All references resolve to existing OC_INDEX / DRCS / BUSINESS_CAPABILITIES / ENGAGEMENT.members ids — no invented ids. Decision log at `.claude/agent-memory/methodology-guru/project_workproducts_seed_decisions.md`.
- `docs/MVP-PILOT-PLAN.md` Sprint B0 — new item **B0-8** (lead-developer, M) for the Work Products UI surface: seed authoring by methodology-guru, per-capability tab on `CapabilityDetailPage`, `#workproducts` portfolio kanban (5 lanes, mirrors active-playbook's `KanbanBoard.tsx`), `#workproducts/<id>` detail route. Acceptance bar updated to require WP surface mounted.
- `.claude/agent-memory/chief-architect/project_workproducts_path_b_decision_2026_05_12.md` — full decision log: the architecture fork, why Path B won (8/3 pilot holds, no re-keying SFARCTL/SPAIDEN, no integration dependencies on two sibling projects), the trade-off accepted (data divergence from canonical hierarchy is now permanent unless bridged later).

### Changed
- `lib/data.ts` `PORTFOLIO` — flipped engagement ids from sequential codes (`p1` ... `p8`) to slugs (`nsu`, `wiu`, `csu-eb`, `usc`, `uvm`, `lafayette`, `oakland`, `coastline-cc`). Closes the long-standing id-space incoherence between `ENGAGEMENT.id` (already a slug), `PORTFOLIO[].id` (was a code), and `WORK_PRODUCTS[].engagement_id` (now a slug). Data-only; rendered surface unchanged (logos/names/sprints/etc. all identical). `shell.tsx` reads `v2.currentProject` from localStorage with an existing guard that falls back to `portfolio[0].id` when no match, so stored `p1...p8` values gracefully recover to NSU on next page load. Repo-wide grep verified no other hardcoded references to `p1...p8`.
- `lib/data.ts` `WORK_PRODUCTS` — restored methodology-guru's original slug-based `engagement_id` values (`nsu / wiu / csu-eb`) — they were temporarily re-keyed to `p1/p2/p3` to match the old PORTFOLIO convention, but now everything lines up.
- `BACKLOG.md` — note appended to "Recently shipped" capturing the Path B fork resolution and the WP entity landing.



Hosting deferral + dev-experience push. User clarified Vercel deploys are deferred until pilot is funded ("that's not free"). Focus shifts to dev experience: devs being able to work on this locally + CI catching breakage on push/PR.

### Added
- `.github/workflows/ci.yml` — runs `pnpm smoke` (build + start + curl + v2 marker assertions) on push to `main` and PRs targeting `main`. pnpm 10.30.3 + Node 22 LTS pinned, frozen-lockfile install, in-flight concurrency cancellation, 10-minute timeout. Closes Stance B sprint item B0-6 (CI gate) early.

### Changed
- `package.json` — added `packageManager: pnpm@10.30.3` and `engines: { node: ">=20" }`. `dev` script now binds to `127.0.0.1:4321` (was Next default `:3000` which collides with sibling projects); `start` script now uses `:4321` to match. New devs running `pnpm dev` land on the right port without checking the handoff.
- `README.md` — fixed stale `localhost:3000` → `127.0.0.1:4321` in Run-it block; updated Tech section (pnpm pin + Node version + CI link); flipped tarball ID to the re-anchored `K3NKe3IuvfS03Mr6yWnkDw`; updated Legacy v1 section to reference Sprint B0 cull and the new design slice; added explicit "Hosting / deploy: deferred" note.
- `docs/MVP-PILOT-PLAN.md` — added second §1 UPDATE banner for the hosting deferral; flipped §2 Q5 from "Vercel subdomain" to **DEFERRED**; rewrote §5.1 stack table to add a "Dev mode (free, no Vercel)" column alongside "Pilot-time path (when funded)" + override flips; replaced §5.3 "Marketplace install order" with "Local dev setup order" (Neon dev branch / Clerk dev instance / Anthropic key / `.env.local` / `.env.example`); added "Hosting deferral note" banner above §7 sprint replan flagging Vercel-dependent items as deferred; marked §13 Q5 (user cap) **MOOT until hosting**.
- `docs/HANDOFF.md` — added a new "Hosting clarification" line to the status banner; added a "Repo state cheat sheet" section noting current tags / branch protection / CI / no Vercel project. Flagged the original "Deployment (when you're ready)" section as not applying.
- `BACKLOG.md` — Stance B replan section updated with a "Vercel hosting — DEFERRED" sub-section. Stack line dropped "AI Gateway" mention (not used in dev mode).

## [Unreleased] — 2026-05-11 (late afternoon)

Shell redesign + drift-audit baseline re-anchor to design tarball `K3NKe3IuvfS03Mr6yWnkDw`. New narrow violet TopBar (HEEAR-style) and relocated `ProjectSwitcher` per user direction in design `chat7.md`. Pre-audit UI change explicitly authorized by user; the May 13 EOD freeze still applies to all OTHER UI work.

### Added
- `components/v2/shell.tsx` — new `ProjectContextBar` component. Appears between `TopBar` and body on project-scoped routes only (`project`, `capabilities`, `guides`, `decisions`, `workshops`, `schedule`). Contains a "← Portfolio" back-link, the relocated `ProjectSwitcher`, and meta pills (phase·sprint, nextGL) for orientation when deep in a guide or decisions list. Practice-wide routes (`""`, `mywork`, `library`, `ai`, `autopilot`, `settings`) skip this strip.
- `components/v2/shell.tsx` — new `ProjectIdentityChip` component (one tweak beyond the literal design, per `product-owner` critique). Surfaces the current engagement (school logo + short name, non-interactive) in the topbar on non-project routes so MyWork etc. stay oriented during fast context-switches. Clicking it navigates to the Project home; it does NOT open the switcher menu.
- `components/v2/shell.tsx` — `isProjectScopedRoute()` exported helper + `PROJECT_SCOPED_ROUTES` set.
- `components/v2/icons.tsx` — `chevron-left` icon for the back-to-Portfolio link.
- `app/styles/tokens.css` — `--topbar-height: 44px`, `--projctx-height: 44px`, `--gradient-topbar-dark` (deeper violet for dark mode).
- `app/styles/v2.css` — `.v2-topbar` (violet gradient sticky strip with white-tinted controls + `.theme-dark` override), `.v2-brand` (white wordmark via `filter: brightness(0) invert(1)`), `.v2-projidchip*`, `.v2-projctx*` (the new sub-strip with back-link, switcher seat, meta pills), `.v2-projmenu-detect` (restored "Logos auto-detected · Override" footer), `.v2-shell.has-projctx` rail/body offset adjustments.
- `.claude/agent-memory/{ux-visionary,product-manager,product-owner}/project_design_K3NKe3Iu_*.md` — three parallel critiques (delta spec, scope check, Janet reaction).
- `docs/audits/DRIFT-AUDIT-2026-05-15.md` — baseline re-anchor banner explaining the pivot and the closed Stance-A drift items (C6, C8); C7 remains for B0-3.

### Changed
- `components/v2/shell.tsx` `TopBar` — slimmed: brand wordmark + (passive identity chip on non-project routes) + search + decisions chip + theme toggle + avatar. `ProjectSwitcher` removed. White-tinted controls on the violet gradient (28px controls). Decisions chip routes to `decisions` (the design's `project/decisions` is unhandled in the router; corrected per `ux-visionary`).
- `components/v2/shell.tsx` `ProjectSwitcher` — restored per-row `SchoolLogo` (32px, rounded-sm) in the dropdown menu (closes prior audit drift item C6); restored "Logos auto-detected · Override" footer linking to Settings.
- `components/v2/shell.tsx` `PageShell` — renders `ProjectContextBar` between `TopBar` and `.v2-body`; toggles `has-projctx` class on `.v2-shell` to drive the rail / body offset (44px without context bar, 88px with).
- `app/styles/v2.css` — `.v2-topbar` (56→44px, flat panel → violet gradient), `.v2-topbar-inner` (240px-grid → flex with 20px padding), `.v2-brand` (no border/padding; white text via inverted-img filter), `.v2-topbar-right` (margin-auto, gap 10px, white-tinted children), `.v2-projmenu-item` grid (`8px 1fr auto` → `auto 8px 1fr auto` for the new SchoolLogo column), `.v2-rail` (top + height now use `var(--topbar-height)`; `.v2-shell.has-projctx .v2-rail` adds the projctx offset).
- `docs/audits/DRIFT-AUDIT-2026-05-15.md` — baseline pivoted from `CgM4C5b7mEU63Y2RQISWcw` → `K3NKe3IuvfS03Mr6yWnkDw`. Methodology note adds the new chats/ bundle.
- `.claude/agent-memory/design-fidelity-guardian/reference_design_tarballs.md` — new tarball entry; pointer to chat-transcript convention.

### Deploy / repo state
- Pushed `f6d68c8` (Stance B replan) to `origin/main`.
- Set branch protection on `main` via `gh api`: linear history required, no force-pushes, no deletions, dismiss stale reviews. PR-required count is 0 (single-contributor repo for now; bump when more collaborators land).
- Tag `v0.2.0-pre-audit.1` already on origin (no new tag for this slice; stays pre-audit).

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
