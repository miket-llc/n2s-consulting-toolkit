# BACKLOG

## State of play (2026-05-11)

The repo mounts the **v2 surface** (`components/v2/{shell,practice,home,pages,detail,icons}.tsx`, styled by `app/styles/{v2,detail}.css`). The legacy `components/views/*` and root-level `components/{shell,icons,tweaks-panel}.tsx` files remain in tree but are not imported anywhere mounted — they are preserved as the source-design `v1-archive` parity reference until the May 15 drift-audit baseline is re-anchored (default per the MVP-PILOT-PLAN is yes, post-audit).

Build is green (`pnpm next build`). Smoke test passes (`pnpm smoke`).

The active plan is at [docs/MVP-PILOT-PLAN.md](docs/MVP-PILOT-PLAN.md) — three sprints (A pre-audit → B post-audit cleanup → C pilot polish) plus post-pilot. **This BACKLOG is the historical record + open questions; the PLAN is the live work list.** When an item lands, update both.

## Recently shipped

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

## Open questions (need user signal)

These are the load-bearing questions in [docs/MVP-PILOT-PLAN.md](docs/MVP-PILOT-PLAN.md) §2. Defaults are applied when no signal lands.

1. **Pilot stance (A / B / C)** — A (hosted demo) recommended. Stance B (+ backend) is weeks; Stance C (real product) is months.
2. **Pilot date** — before or after May 15? Default: after.
3. **Pilot users** — count + format (facilitated demo vs self-serve).
4. **Re-anchor drift baseline** — delete v1 archive entirely post-audit? Default: yes.
5. **Pilot URL** — `*.vercel.app` or custom Ellucian domain? Default: vercel subdomain.
6. **AskPage future** — real LLM or "coming soon" forever? Default: coming soon for this pilot.

## Sprint B (post-audit, May 18+) — see PLAN for full list

The big items: delete v1 archive in one commit (~3,800 lines), cull ~96 lines of dead exports from `lib/data.ts`, populate SFARCTL + SPAIDEN OC bodies, define `--surface-1`/`--surface-2` tokens (Autopilot is visually broken without them), add focus-visible rings, GitHub Actions CI, Playwright bootstrap.

## Sprint C (pilot polish, May 25+) — see PLAN

NBAPOSN + PTREARN OC bodies. Second engagement (WIU or CSU) populated so project-switcher doesn't lie. Decision detail surface (`#decisions/<id>`). Workshop detail surface. ⌘K wired to in-memory search. Vercel Analytics. Pilot rehearsal.

## Tier 2 — explicitly deferred (post-pilot)

- **Vitest** — Playwright covers the test bar for this pilot (per test-engineer); add Vitest when algorithmic logic lands.
- **OC body content for the other 6 OCs** (STVATTR, SHACATQ, SSASECT, FGRGL, FTMVEND, RORPRIO) — could-have; SOATERM + SFARCTL + SPAIDEN + NBAPOSN + PTREARN is the pilot bar.
- **Inner Source surface** — `INNER_SOURCE` exports referenced in CapabilityDetail right rail; no standalone view. Defer dedicated surface until v2 design pass.
- **Confirmed-dead exports in `lib/data.ts`** (`ENGAGEMENT`, `SPRINTS`, `ACTIVE_SPRINT`, `SPRINT_PLAN_BACKLOG`, `DOC_TREE`, `DOCUMENTS`, `SMART_QUEUE`, `FINDING_INDEX`) — cull in Sprint B after v1 archive is gone. ~96 lines.
- **`detail.tsx` split** (1,594 lines) — frozen until post-pilot; touch-risk during audit.
- **Three-state DRC review, DnD kanban, real persistence, multi-engagement isolation** — Stance B territory.

## Out of scope this pilot

- Auth, real Jira/Smartsheet integration, real LLM backend — Stance B.
- New design surfaces beyond the ones already shipped — would create more drift than the audit can absorb.
