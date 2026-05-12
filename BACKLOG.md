# BACKLOG

## State of play (2026-05-11, afternoon)

The repo mounts the **v2 surface** (`components/v2/{shell,practice,home,pages,detail,icons}.tsx`, styled by `app/styles/{v2,detail}.css`). The legacy `components/views/*` and root-level `components/{shell,icons,tweaks-panel}.tsx` files remain in tree but are not imported anywhere mounted — they are preserved as the source-design `v1-archive` parity reference until the May 15 drift-audit baseline is re-anchored (user confirmed yes, post-audit, in PLAN §2 Q4).

Build is green (`pnpm next build`). Smoke test passes (`pnpm smoke`).

**Stance pivot 2026-05-11 PM.** User chose Stance B (prototype + real backend) over the recommended Stance A. `chief-architect` produced the Stance B replan; **PLAN.md §5–§14 is now the live plan** (architecture, data model, six-sprint sequence B0→B5, calendar with pilot date 2026-08-03, risk register, agent ownership, six open sub-questions for user). Sprint A items already shipped + the May 15 drift audit are unaffected.

**This BACKLOG is the historical record + open questions; PLAN.md is the live work list.** When an item lands, update both.

## Recently shipped

**2026-05-12 — Work Products entity (Path B fork resolved):**
- User answered the architecture fork: **Path B — toolkit stays independent** of `n2s-heear-editor` (read API) and `n2s-active-playbook` (work-product markdown source). Rationale: 8/3 pilot date holds, no re-keying of methodology-guru's just-shipped SFARCTL/SPAIDEN content, no two-project integration dependency. Trade-off accepted: toolkit's mock world diverges permanently from canonical taxonomy unless someone bridges later. Decision log at `.claude/agent-memory/chief-architect/project_workproducts_path_b_decision_2026_05_12.md`.
- `lib/data.ts` — added `WorkProduct` type (+ `WorkProductPhase`, `WorkProductState`, `RaciRole`, `CapabilityRef` types and `WORK_PRODUCT_STATES` / `WORK_PRODUCT_STATE_LABELS` helpers). Methodology-side fields mirror active-playbook's `schemas/work-product.js` verbatim; runtime fields (engagement scope + state + due + linked-OC/DRC) are toolkit-specific. **`WORK_PRODUCTS` seeded by methodology-guru with 17 entries** spanning NSU + WIU + CSU EB across all 6 phases (5 signed / 5 in-progress / 2 needs-review / 4 not-started / 1 blocked).
- **Engagement id-space coherence** (chief-architect's recommendation, ratified by user 2026-05-12 AM): flipped `PORTFOLIO[].id` from sequential codes (`p1...p8`) to slugs (`nsu`, `wiu`, `csu-eb`, `usc`, `uvm`, `lafayette`, `oakland`, `coastline-cc`); restored slug-based `engagement_id` values in `WORK_PRODUCTS`. `ENGAGEMENT.id`, `PORTFOLIO[].id`, and `WORK_PRODUCTS[].engagement_id` now share one convention. Build + smoke green. Only residual: `TASKS[].project` is free-text display labels ("NSU", "WIU", "CSU EB") — not joinable; platform-engineer to treat as `engagements.display_short` in B1 rather than as ids.
- Sprint B0 gained item **B0-8** (post-audit, lead-developer): WP seed + per-capability tab on `CapabilityDetailPage` + `#workproducts` portfolio kanban (5-lane, active-playbook shape) + `#workproducts/<id>` detail route. Closes the long-standing "STILL no view at the capability or work product level" gap.

**2026-05-11 — Sprint A (pre-audit hygiene, in progress):**
- Banner schema accuracy in `lib/data.ts` — `NBRPSN`→`NBAPOSN`, `FTVVEND`→`FTMVEND`, `STVTERM_POT_CODE`/`STVTERM_POT_CENSUS_IND` → `SOBPTRM_PTRM_CODE`/`SOBPTRM_CENSUS_DATE` (per `methodology-guru` review).
- `FINDING_INDEX` STVMAJR/STVRESD labels corrected; selectors cleared (they were pointing to the wrong SOATERM section).
- DRC-4 OC reference moved from RORPRIO to SOATERM/create section (per `methodology-guru` — FA proc-year is a SOATERM field).
- `is-6` Inner Source pattern rewritten as "FTMVEND setup + 1099 readiness checklist"; re-attributed to Raj Kapoor.
- `bastardLoopState` field renamed to `deliveryStage` (was visible in dev tools / type names; embarrassment risk for pilot).
- `GANTT_TODAY` now computed from `new Date()` at module load (was hardcoded to May 1, 10+ days stale).
- `app/error.tsx`, `app/not-found.tsx`, `app/loading.tsx` — top-level boundary so a render exception no longer blanks the SPA.
- `app/layout.tsx` pre-paint script — flips html class to `theme-dark` before React hydrates for dark-mode users (no more flash).
- `practice.tsx` "Open My work" — uses `navigate()` instead of `window.location.hash`.
- AskPage rewritten as an honest "Coming soon" state (was a textarea with a disabled Ask button — trust-killer per `product-owner`).
- Autopilot "Re-run baseline" / "Run on commit" buttons wired to `notImplemented()` toast (were silent dead affordances).
- Settings "All connected" green pill replaced with "Demo data — not connected to live systems" amber pill (was a lie per `product-owner`).
- Project Home brief footer copy — "Demo data — will pull from Jira, Smartsheet…" replaces the implicit live-data claim.
- README route table, file structure, interactions, and Legacy v1 section updated (was 6 stale claims including wrong tarball ID).
- `.gitignore` excludes `docs/*.xlsx` (planning binary, kept local).

**2026-05-11 — Sprint 1 (just before this Sprint A):**
- MyWork kanban toggle (Buckets | Board, 5 status columns, persisted to `localStorage["v2.mywork.view"]`).
- Schedule 12-month milestone gantt (replaces stub list of go-lives; readiness band on top, swimlane below).
- Configuration Guide ConfigFieldsTable (per-section, two-state review; SOATERM populated with 9 rows).
- All three flagged as intentional toolkit-original additions in `.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md` so the May 15 audit classifies them correctly.

**2026-05-07 — Capability detail + Configuration guide port:**
- `components/v2/detail.tsx` (`#capabilities/<capId>` + `#guides/<ocId>`) and `app/styles/detail.css`.
- Routing in `app/page.tsx` parses sub-paths.

**Earlier:**
- 7 `alert()` dialogs replaced with `notImplemented(message)` toast helper. Prototype is demo-safe.
- ⌘K / Ctrl-K wired to focus the topbar search input.
- Search input got `aria-label` + `type="search"`.
- `Coming` placeholder's "Back to home" anchor fixed (was `href="#"`, now `href="#/"`).
- `scripts/smoke.sh` + `pnpm smoke` script.
- README rewrite for the v2 surface; AGENTS.md refresh.

## Open questions — RESOLVED 2026-05-11

User answered all six load-bearing questions. **Three answers (Q1, Q3, Q6) cluster into a Stance A → Stance B pivot.** PLAN.md §5 onward is obsolete pending chief-architect's Stance B replan; this BACKLOG is updated as the replan lands.

1. **Pilot stance** — **B (prototype + real backend).** Recommended Stance A overruled.
2. **Pilot date** — after May 15. Late-May / early-June calendar from PLAN §11 no longer realistic under Stance B; new calendar TBD.
3. **Pilot users** — **>5 self-serve users.** Engagement-scoped isolation moves from "document the constraint" to must-have; auth + per-user persistence are in scope.
4. **Re-anchor drift baseline** — yes, delete v1 archive post-audit. Sprint B1 survives the replan.
5. **Pilot URL** — `n2s-consulting-toolkit.vercel.app`. Vercel platform stays; Marketplace add-ons (Postgres, auth, AI Gateway) cover the new requirements.
6. **AskPage future** — **real LLM before pilot.** Stub is no longer the pilot endpoint. lead-developer + ai-architect own the integration.

## Stance B replan — LANDED 2026-05-11 (afternoon)

chief-architect produced the replan; **`docs/MVP-PILOT-PLAN.md` §5–§14 is the live plan**. Headlines:

- **Stack:** Clerk (auth) + Neon Postgres (DB) + Drizzle (ORM) + Vercel AI SDK (LLM) + pgvector (RAG corpus). Each layer has a free dev-mode setup (no Vercel link required).
- **Six sprints:** B0 cleanup (5/18) → B1 data layer (5/25) → B2 auth+scoping (6/8) → B3 mutations+cutover (6/22) → B4 AskPage RAG (7/6) → B5 content+rehearsal (7/20). **Pilot 2026-08-03 — IF hosting funding lands by ~2026-07-25; otherwise pilot slips while build proceeds locally.**
- **Surviving Stance A items** (folded into B0): v1 archive cull, dead-export cull, drift fixes, focus pass, CSS cull, CI gate (now live via `.github/workflows/ci.yml`), Playwright bootstrap.
- **Six open sub-questions** for user to answer (PLAN §13): persistence scope (mock vs real integration), LLM blast radius (chat vs action-taking), pilot date (8/3 default vs 7/20 aggressive), RAG corpus scope, ~~user cap~~ (Q5 now MOOT until hosting), rate limits.
- **New agents recommended:** `platform-engineer` (NEW; owns Drizzle/API/Clerk/secrets/audit), `ai-architect` (formal addition to roster). docs-leader to update AGENTS.md.
- **Reasoning trace** preserved in `.claude/agent-memory/chief-architect/project_stance_b_replan_2026_05_11.md`.

### Vercel hosting — DEFERRED 2026-05-11 (late afternoon)

User clarified Vercel deploys are deferred ("that's not free"). Focus until further notice is dev experience. Implications:

- **No Vercel project linked, no preview/prod deploys.** Local `pnpm dev` (port 4321) + `pnpm smoke` + GitHub Actions CI is the contract.
- **Stack still targets Vercel-friendly defaults** so deploy is a config flip, not a rewrite — see PLAN §5.1 "Pilot-time path" column.
- **Marketplace install path** (Neon/Clerk/AI Gateway one-click) flips from Sprint A/B1/B2/B4 work into a single one-day "deploy preflight" when funding lands.
- **PLAN §13 Q5 (user cap)** is moot until hosting exists.
- **Pilot date 2026-08-03** holds only if hosting funds by ~2026-07-25.

## Sprint B (post-audit, May 18+) — OBSOLETE under Stance B

Per the original Stance A plan, the big items were: delete v1 archive (~3,800 lines), cull ~96 lines of dead exports from `lib/data.ts`, populate SFARCTL + SPAIDEN OC bodies, define `--surface-1`/`--surface-2` tokens, focus-visible rings, GitHub Actions CI, Playwright bootstrap. **B1 + B2 + the audit + CI + tests survive the replan; the rest is reordered or rescoped.**

## Sprint C (pilot polish, May 25+) — OBSOLETE under Stance B

Original Stance A items: NBAPOSN + PTREARN OC bodies, second engagement populated, Decision detail surface, Workshop detail surface, ⌘K to in-memory search, Vercel Analytics, pilot rehearsal. Most of these still make sense as features but the sequencing is dominated by the auth + DB + LLM build under Stance B.

## Tier 2 — explicitly deferred (post-pilot)

- **Vitest** — Playwright covers the test bar for this pilot (per test-engineer); add Vitest when algorithmic logic lands.
- **OC body content for the other 6 OCs** (STVATTR, SHACATQ, SSASECT, FGRGL, FTMVEND, RORPRIO) — could-have; SOATERM + SFARCTL + SPAIDEN + NBAPOSN + PTREARN is the pilot bar.
- **Inner Source surface** — `INNER_SOURCE` exports referenced in CapabilityDetail right rail; no standalone view. Defer dedicated surface until v2 design pass.
- **Confirmed-dead exports in `lib/data.ts`** (`ENGAGEMENT`, `SPRINTS`, `ACTIVE_SPRINT`, `SPRINT_PLAN_BACKLOG`, `DOC_TREE`, `DOCUMENTS`, `SMART_QUEUE`, `FINDING_INDEX`) — cull in Sprint B after v1 archive is gone. ~96 lines.
- **`detail.tsx` split** (1,594 lines) — frozen until post-pilot; touch-risk during audit.
- **Three-state DRC review, DnD kanban** — Janet veto / pilot-signal items, still deferred under Stance B.
- **Real persistence, multi-engagement isolation, auth, real LLM backend** — **now scoped IN under Stance B.** Old "Stance B territory" framing is obsolete; `chief-architect`'s replan sequences these.

## Out of scope this pilot — UPDATED for Stance B

- **Real Banner / Jira / Smartsheet integration** — likely deferred (months of work, OAuth dances per vendor); chief-architect to confirm in replan. Per-user persistence of the existing mock-data shape is the more likely v1-of-Stance-B scope.
- **Action-taking AskPage** (LLM that can mutate state — sign off DRCs, file Jira tickets) — likely deferred; chief-architect to confirm. Chat-scope LLM (RAG over OC content) is the more likely v1.
- **New design surfaces beyond what already exists in v2** — would create more drift than the May 15 audit can absorb. The Stance B replan adds backend depth, not new screens.
