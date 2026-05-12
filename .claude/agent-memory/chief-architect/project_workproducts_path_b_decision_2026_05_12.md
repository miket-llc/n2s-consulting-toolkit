# Work Products entity — Path B decision

**Date:** 2026-05-12 (morning, ET)
**Trigger:** User: "jfhc why do i STILL not have a view of at the capability or work product level. what am i not communicating, team?" (2026-05-11 PM). Resolved 2026-05-12 AM.

## What the user was actually asking for

A view at the **work product** level — not the task level. Active-playbook's `KanbanBoard.tsx` + `StageProgressView.tsx` + `acceptance-criteria-tab.tsx` are the reference shape, and `n2s-heear-editor` is the canonical content authority that active-playbook consumes. User confirmed: "yes, that and the n2s-heear-editor". The consulting toolkit had **no work-product entity in `lib/data.ts`** — only tasks, capabilities, OCs, DRCs, and reference cards (`METHODOLOGY_CARDS`). The Capability detail page's "Delivery" tab was task-focused.

## The fork

Sibling-project tour (delegated 2026-05-11 PM, returned 2026-05-12 AM) confirmed two production-grade implementations of the missing concept already exist:

- **`n2s-active-playbook`** types work products in `schemas/work-product.js` with `id, title, phase, stage, order, raci, purpose_and_scope, definition_of_done, prerequisites[], feeds_into[], capability_refs[], applies_to.products[]`. Bodies live as markdown in `content/work-products/`. UI: methodology-gap kanban (4 lanes: open / in_progress / resolved / wont_fix), project-task kanban (5 statuses: Not Started / In Progress / Needs Review / Done / Blocked), publish timeline, health sidebar, assignee focus table, BCDetail with methodology-mapping rollup.
- **`n2s-heear-editor`** owns the **HEEAR 3.0 Unified Capability Model** — VS → BC → OC → BP → CI/DRC/S&O/IP. Already exposes `/api/v1/capabilities` with API-key auth, explicitly built for downstream consumption ("The downstream consumer is the N2S Active Playbook").

Two paths surfaced to the user:

- **Path A** — Toolkit consumes both APIs. Becomes third UX surface over canonical content. Stance B Drizzle schema shrinks to toolkit-specific tables only (`users`, `engagement_members`, `field_reviews`, `user_prefs`, `ai_conversations`, `ai_messages`); everything else read-through. Real entity ids replace toolkit's mock taxonomy. Two-project integration dependency. 8/3 pilot slips ~3-4 weeks; methodology-guru's just-shipped SFARCTL/SPAIDEN OCs need re-keying to canonical OC ids.
- **Path A-lite** — Mirror active-playbook's WP shape in `lib/data.ts` field-for-field NOW so future swap is a connection change. Stance B as planned but B1 schema uses canonical field names. 8/3 holds.
- **Path B** — Stay independent. Copy the *shape*, not the *data*. Build own mock world. Toolkit's BC ids stay (`bc-curriculum`, `bc-records`, etc.). SFARCTL/SPAIDEN stay as toolkit ids. 8/3 holds. Permanent divergence from canonical taxonomy unless bridged later.

## User decision: Path B

Selected via `AskQuestion` 2026-05-12 AM. Read: pilot date is non-negotiable, methodology-guru's content stays, no two-project integration dependency. Trade-off accepted: toolkit's mock world is now permanently divergent from canonical taxonomy unless someone explicitly bridges them in a post-pilot effort.

## What this means for the team

### Data layer
- `lib/data.ts` got a new `WorkProduct` type + `WORK_PRODUCTS: WorkProduct[] = []` empty array (landed 2026-05-12 AM, freeze-safe). Type definition mirrors `n2s-active-playbook/schemas/work-product.js` **field-for-field** for methodology-side fields. Runtime fields (`engagement_id, capability_id, state, due, linked_oc_ids, linked_drc_ids`) are toolkit-specific because the prototype's frame is engagement-centric (active-playbook puts these on `Task` instead).
- State machine: `not-started → in-progress → needs-review → signed`, with `blocked` as an off-ladder state.
- Phase vocabulary uses the toolkit's existing 6-phase model (discover / design / build / validate / deploy / stabilize) from `METHODOLOGY_PHASES`, **not** active-playbook's (build / optimize). Methodology-guru owns plausibility.

### Stance B implications
- **B1 unchanged in approach but adopts the canonical field names.** When platform-engineer mirrors `lib/data.ts` into Postgres, the `work_products` table uses these column names (`purpose_and_scope, definition_of_done, prerequisites, feeds_into, capability_refs, applies_to`). If a future Path-A-style bridge to active-playbook gets greenlit, the table is already shaped right.
- **No new tables beyond what PLAN.md §6.1 already lists.** Add `work_products` to "per-engagement mutable" alongside `tasks`, `drcs`, `workshops`, `milestones`.
- **Ownership of state transitions:** all consultants assigned to the engagement (membership-based, gated by `withEngagementAccess`).

### Sprint B0 — new item B0-8 (post-audit)
- **Owner:** lead-developer (M)
- **(a)** Methodology-guru seeds `WORK_PRODUCTS` with ~15-18 entries spanning NSU + WIU + CSU EB engagements. Engagement Charter + Business Blueprint per active capability (Curriculum, Records, Payroll, FAA, GL, AR, HR-Core, Integrations); Test Plan per active capability; Cutover Runbook for HR (nearest GL); Hypercare Playbook stubs. Linked OCs/DRCs point at existing toolkit ids. **Methodology-guru deliverable.**
- **(b)** New leftmost "Work Products" tab on `CapabilityDetailPage` showing WPs for this capability + current engagement, grouped by phase, with state badge / owner / due / linked-OC count. Click → opens detail route.
- **(c)** New `#workproducts` portfolio kanban at the Practice level. Five lanes (`Not Started / In Progress / Needs Review / Signed / Blocked`). Filter by phase, engagement, owner. Drag-to-change-state. Shape mirrors active-playbook's `KanbanBoard.tsx`.
- **(d)** New `#workproducts/<id>` detail route: purpose_and_scope, definition_of_done, RACI grid, prerequisites/feeds_into as upstream/downstream WP links, linked OCs (deep-link to `#guides/<ocId>`), linked DRCs (deep-link to `#decisions`), state-change control.

### What the toolkit consciously does NOT copy from active-playbook
- **Methodology-gap kanban** (`open / in_progress / resolved / wont_fix`) — that's editorial work on the methodology *content*, not project execution. Out of scope.
- **Health score + snapshots + publish timeline** — toolkit's content is hand-curated mocks, not a CI-published artifact. Out of scope.
- **Acceptance criteria at OC level** with pass/fail/skip — interesting, deferrable; not pilot-critical. Punt to a post-pilot decision.

### What this does NOT solve
- The data divergence is real and now permanent. If a future product decision converges these three apps onto one taxonomy, this WP shape's field names give a head start, but the **id space** (BC, OC, DRC) needs translation.
- The toolkit's `BUSINESS_CAPABILITIES` (12 BCs, Banner-flavored) still doesn't match heear-editor's 28 BCs or active-playbook's 62 BCs. WP `capability_refs.capabilities` will reference toolkit BC ids, not canonical ones.
- Acceptance criteria authoring (pass/fail/skip on OC-linked criteria) is not in B0-8. If methodology-guru wants this for pilot demo plausibility, it's a separate decision.

## Risks logged

- **R-WP-DRIFT (NEW, Low).** Toolkit's WP entity drifts further from active-playbook's as both projects evolve. Mitigation: methodology-guru tracks canonical field-name changes in active-playbook's `schemas/work-product.js`; quarterly sync.
- **R-WP-CONTENT (NEW, Medium).** Seed entries need to be Banner/HEEAR-plausible to a working consultant. Mitigation: methodology-guru authors against the same heuristics they used for OCs (real form names, real product scope, real sequencing). Product-owner sanity-checks before B0 lands.

## Seed landed — 2026-05-12 AM (methodology-guru, freeze-safe, data-only)

**17 entries** across NSU (12), WIU (3), CSU EB (2). State distribution: 5 `signed` / 5 `in-progress` / 2 `needs-review` / 4 `not-started` / 1 `blocked`. All references use existing toolkit ids (OC_INDEX, DRCS, BUSINESS_CAPABILITIES, ENGAGEMENT.members). Decision log: `.claude/agent-memory/methodology-guru/project_workproducts_seed_decisions.md`. Build + smoke green.

### Two flags surfaced by methodology-guru (chief-architect dispositions):

**Flag 1 — engagement_id space — RESOLVED 2026-05-12 AM.** Methodology-guru initially keyed `engagement_id` to semantic slugs (`nsu / wiu / csu-eb`), which matches `ENGAGEMENT.id = "nsu"` but **not** `PORTFOLIO[].id` (which used `p1...p8`). First-pass disposition: re-keyed seed to `p1 / p2 / p3` to align with PORTFOLIO. User then ratified the slug-based recommendation ("fix it with your recommendation"). **Resolution:** flipped PORTFOLIO ids from `p1...p8` to slugs (`nsu`, `wiu`, `csu-eb`, `usc`, `uvm`, `lafayette`, `oakland`, `coastline-cc`) and restored methodology-guru's original slug-based `engagement_id` values in `WORK_PRODUCTS`. The toolkit's engagement id-space is now coherent: `ENGAGEMENT.id`, `PORTFOLIO[].id`, and `WORK_PRODUCTS[].engagement_id` all use the same slug convention.

**Scope of the change.** Data-only in `lib/data.ts` — no UI files touched. `shell.tsx` reads `v2.currentProject` from localStorage with a guard (`portfolio.some(p => p.id === storedProject)`) that falls back to `portfolio[0].id` when no match — so any existing localStorage value of `p1...p8` lands the user on NSU on next page load, then subsequent writes store the slug. No user-visible breakage. No other code hardcoded `p1...p8` (verified by repo-wide grep). Build + smoke green.

**Residual coherence note.** `TASKS[].project` still uses free-text display labels (`"NSU"`, `"WIU"`, `"CSU EB"`) — these are not foreign keys, they're column-display strings in MyWork. Left as-is; they'd be a UI-visible change to touch. Platform-engineer should treat them as display labels in B1 (`engagements.display_short` or similar) rather than as joinable identifiers.

**Flag 2 — WIU phase tension.** PORTFOLIO shows WIU as Stabilize phase (S6 · D7/10), but methodology-guru authored WIU FAA Blueprint as `in-progress`. Read: FAA is a new capability wave being onboarded during a stabilization sprint (consistent with TASK `t5` "Review WIU R2T4 retro before applying to NSU"). Disposition: accept as-authored. Plausible for a working consultant — WIU's stabilization is on other capabilities, FAA is a follow-on wave. No action.

## Why (one sentence)

User has a non-negotiable 8/3 pilot, three product surfaces in flight that solve overlapping problems with different data models, and the consulting toolkit's missing entity is the smallest thing on the critical path — Path B closes the gap in one sprint without pulling 8/3 forward to a multi-month integration scope.

## How to apply

- **lead-developer:** B0-8 is yours post-audit (5/18+). The type is landed; the views are the work. Don't displace B0-4 (focus-visible) without product-manager sign-off.
- **methodology-guru:** Seed ~15-18 entries when the freeze lifts. Use real Banner work-product titles (Engagement Charter, Business Blueprint, Test Plan, Cutover Runbook, Hypercare Playbook, RAID Log). Link to existing OC/DRC ids in `lib/data.ts` — don't invent new ones.
- **product-manager:** Adjust B0 sequencing to fit B0-8. B5 polish lane is the relief valve if anything in B0 displaces.
- **platform-engineer:** When you mirror `lib/data.ts` in B1-2, use the canonical field names (snake_case in Postgres, camelCase in TS). The Drizzle column for `purpose_and_scope` is `purposeAndScope` in the TS schema; SQL column stays snake.
- **ux-visionary:** The portfolio kanban is your `KanbanBoard.tsx` parity reference. Sample at `n2s-active-playbook/n2s-platform/apps/web/src/components/workbench/KanbanBoard.tsx`. Active-playbook uses 4 lanes for gaps; toolkit uses 5 lanes for project state.
- **design-fidelity-guardian:** `#workproducts` is a toolkit-original surface — not in the K3NKe3Iu tarball. Document as such in `project_toolkit_original_additions.md` when B0-8 lands, same containment language as kanban + gantt.
