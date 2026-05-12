---
name: Toolkit-original additions (not in source tarball)
description: Eleven surfaces / behaviours shipped before the 2026-05-15 drift audit are net-new toolkit-originals with no counterpart in the design tarball. The audit classifies them as intentional additions, not drift. Items 1-3 added 2026-05-11 AM. Items 4-6 formalized in the CgM4C5b7 audit pass on 2026-05-15. Items 7-8 added in the K3NKe3Iu re-pass on 2026-05-11 PM (shell redesign slice). Items 9-11 added in the freeze-override slice on 2026-05-12 PM (B0-8 Work Products UI pulled forward from post-audit). Item 8 was historically the only "tweak beyond literal design"; that lock-in was retired 2026-05-12 — beyond-design additions are now catalogued like any other toolkit-original.
type: project
---

**Last updated:** 2026-05-12 PM (freeze-override slice — B0-8 Work Products surface)
**Active tarball baseline:** `K3NKe3IuvfS03Mr6yWnkDw` (re-anchored from `CgM4C5b7mEU63Y2RQISWcw`)
**Linked reference:** [reference_design_tarballs.md](reference_design_tarballs.md)

## Catalogue

| # | Surface | Added | Tarball baseline at add-time | Mounted in |
|---|---|---|---|---|
| 1 | MyWork kanban toggle (Buckets \| Board) + 5-column board | 2026-05-11 AM | `CgM4C5b7mEU63Y2RQISWcw` | `pages.tsx` MyWorkPage |
| 2 | Schedule 12-month gantt + go-live readiness band | 2026-05-11 AM | `CgM4C5b7mEU63Y2RQISWcw` | `pages.tsx` SchedulePage |
| 3 | Configuration Guide config-fields table (two-state review, SOATERM populated only) | 2026-05-11 AM | `CgM4C5b7mEU63Y2RQISWcw` | `detail.tsx` ConfigFieldsTable |
| 4 | `notImplemented()` + `ToastHost` toast system | Sprint A | `CgM4C5b7mEU63Y2RQISWcw` | `shell.tsx` |
| 5 | ⌘K / Ctrl-K search-focus shortcut | Sprint A | `CgM4C5b7mEU63Y2RQISWcw` | `shell.tsx` TopBar |
| 6 | Top-level render-error boundary + 404 + loading skeleton | Sprint A | `CgM4C5b7mEU63Y2RQISWcw` | `app/error.tsx`, `app/not-found.tsx`, `app/loading.tsx` |
| 7 | `v2-shell.has-projctx` layout modifier + CSS rules that correctly subtract `--projctx-height` from `.v2-body` `min-height` and `.v2-rail` `top` / `height` | 2026-05-11 PM | `K3NKe3IuvfS03Mr6yWnkDw` | `shell.tsx` `PageShell`, `v2.css` lines 179-181, 613-616 |
| 8 | Passive `ProjectIdentityChip` in TopBar on non-project-scoped routes | 2026-05-11 PM | `K3NKe3IuvfS03Mr6yWnkDw` | `shell.tsx` `ProjectIdentityChip` + `TopBar` showIdentityChip gate, `v2.css` `.v2-projidchip*` lines 263-280 |
| 9 | **WorkProductsKanbanPage** — `#workproducts` portfolio route, 5-lane state kanban (`Not Started` / `In Progress` / `Needs Review` / `Signed` / `Blocked`), filter row (phase + engagement + owner) persisted to `localStorage["v2.workproducts.filters"]` | 2026-05-12 PM | `K3NKe3IuvfS03Mr6yWnkDw` | `components/v2/workproducts.tsx` `WorkProductsKanbanPage`, `app/styles/workproducts.css`, `app/page.tsx` route handler, `shell.tsx` `RAIL_TOP` entry |
| 10 | **WorkProductDetailPage** — `#workproducts/<id>` route, 10 sections (phase + state header, purpose & scope, DoD, RACI grid, prerequisites/feeds_into, linked OCs, linked DRCs, capability scope, applies_to chips, state-change controls firing `notImplemented` toast) | 2026-05-12 PM | `K3NKe3IuvfS03Mr6yWnkDw` | `components/v2/workproducts.tsx` `WorkProductDetailPage`, `app/styles/workproducts.css`, `app/page.tsx` route handler |
| 11 | **WorkProductsTab on CapabilityDetailPage** — new leftmost tab (default), groups WPs for this cap + engagement by phase with state badges, owner avatars, due dates, linked-OC/DRC counts | 2026-05-12 PM | `K3NKe3IuvfS03Mr6yWnkDw` | `components/v2/detail.tsx` CapabilityDetailPage tab table + new `WorkProductsTab` function |

## Why each one is intentional

The original three (1–3) shipped on 2026-05-11 AM. The four shell-redesign-related (4–8) are formalized in the drift audit passes — see [project_mvp_pilot_review.md](project_mvp_pilot_review.md) and the audit document itself for full provenance. Items 9–11 (B0-8 Work Products surface) landed in the freeze-override slice 2026-05-12 PM — see the audit doc addendum "Freeze-override slice (2026-05-12)" and `.claude/agent-memory/lead-developer/project_b08_workproducts_views.md` for full implementation provenance.

**Containment policy retired 2026-05-12.** Item 8 was historically tagged as the **only** "tweak beyond literal design"; user retired that lock-in in the four-call sign-off. Beyond-design additions are now classified as toolkit-originals and catalogued in this memo without requiring per-item user authorization. The chip's own containment rules (passive, hidden on project routes, no extra metadata) remain in force for that specific item.

### 1. MyWork kanban toggle (`#mywork`)

### 1. MyWork kanban toggle (`#mywork`)

- **Where it lives:** `components/v2/pages.tsx` · `MyWorkPage` + new `MyWorkBoard`.
- **Toggle pill:** `.v2-mywork-viewtoggle` (Buckets | Board), persists view choice to `localStorage["v2.mywork.view"]`.
- **Board layout:** 5 columns, one per `TASK_STATUSES` value (`Backlog | Ready | In Progress | Needs Review | Done`).
- **No DnD.** Cards are click-through to `notImplemented()` toast — same pattern as existing rows.
- **What the tarball has:** only the due-date bucket view. The five-column board has no counterpart in `project/v2/pages.jsx`.

### 2. Schedule gantt (`#schedule`)

- **Where it lives:** `components/v2/pages.tsx` · `SchedulePage` (replaces the stub list of go-lives).
- **Layout:** Top band of 4 go-live readiness cards; below, a 12-month swimlane gantt — rows = go-lives, columns = months, dots = `MILESTONES` positioned by `monthCol` / `dayInMonth` and colored by `MILESTONE_TYPES[m.type].token`.
- **Today marker:** `GANTT_TODAY` vertical line on column 0.
- **Click behavior:** workshop dots navigate to `#workshops`; other dots fire a `notImplemented()` toast naming the milestone.
- **What the tarball has:** the underlying data (`MILESTONES`, `GANTT_TODAY`, `MILESTONE_TYPES`) is present in `project/data-v2.js` and was already mirrored in `lib/data.ts`. **No JSX in `project/v2/*.jsx` consumes that data.** The gantt UI is a toolkit-original synthesis from existing data.

### 3. Configuration Guide config-tasks (`#guides/<ocId>`)

- **Where it lives:** `components/v2/detail.tsx` · `ConfigFieldsTable` rendered inside each active section card, below intro/steps and above section nav.
- **Data:** `CONFIG_FIELDS_BY_OC` in `lib/data.ts`. Only **SOATERM** populated (9 rows across 6 sections). All other OCs render an empty-state pill ("No config fields captured yet for this section.").
- **Review state:** two-state (unreviewed / confirmed), persisted to `localStorage["v2.cfg.${engagementId}.${ocId}.${fieldId}"]`.
- **Heear-editor analogue:** This is a *lightweight* reflection of `ConfigItemsTable` / `ContentBlock` from `n2s-heear-editor`. We deliberately **drop** the three-state review (flagged + flag notes), the drag-reorder, and the server-backed audit log. Two states only.
- **What the tarball has:** nothing. The brief at `project/scratch/capability-and-guide-brief.md` does not call for this surface; it's an extension informed by `n2s-heear-editor`.

### 7. `has-projctx` layout modifier (K3NKe3Iu shell slice)

- **Where it lives:** `components/v2/shell.tsx` `PageShell` adds `has-projctx` to the shell root when `isProjectScopedRoute(route)` is true; `app/styles/v2.css` carries paired rules at lines 179-181 (`.v2-shell.has-projctx .v2-body { min-height: calc(100vh - var(--topbar-height) - var(--projctx-height)); }`) and 613-616 (`.v2-shell.has-projctx .v2-rail { top: calc(var(--topbar-height) + var(--projctx-height)); height: calc(100vh - var(--topbar-height) - var(--projctx-height)); }`).
- **What the tarball has:** `<ProjectContextBar/>` is mounted but the rail and body min-height calc rules still subtract only the topbar height (and the tarball's calc still references a stale 56px from before the topbar shrink — see audit §2.9 port-leads-tarball corrections). The K3NKe3Iu tarball would let the projctx strip eat into the rail's visual top and into `.v2-body min-height`.
- **Why ported:** clean layout — the projctx is a sticky 44px element, the rail should sit below it not behind it. This is a port-leads layout improvement that the tarball doesn't yet do.
- **Audit classification:** O (toolkit-original layout enhancement), paired with port-leads-tarball correction on the stale 56px values.

### 8. Passive `ProjectIdentityChip` in TopBar — the one product-owner-required tweak

- **Where it lives:** `components/v2/shell.tsx` `ProjectIdentityChip` component (lines 374-389); `TopBar` gates it on `showIdentityChip = !PROJECT_SCOPED_ROUTES.has(top)` (line 407, rendered at 428); `app/styles/v2.css` `.v2-projidchip` + `.v2-projidchip-name` rules (lines 263-280).
- **What it does:** On non-project-scoped routes (Portfolio, MyWork, Methodology/library, AskPage/ai, Autopilot, Settings), the TopBar surfaces a passive pill with the current engagement's SchoolLogo + short name. Clicking it navigates to `#project` (Project home). It does **NOT** open the project switcher menu — the full switcher lives only in the ProjectContextBar on project-scoped routes.
- **What the tarball has:** Nothing. The K3NKe3Iu shell deliberately removes the project selector from non-project routes — the user is "in the practice, not in a project" on those routes, so the design says the project context shouldn't be top-of-mind.
- **Why ported:** Product-owner critique on K3NKe3Iu shell-slice review (per `.claude/agent-memory/product-manager/project_design_K3NKe3Iu_scope_check.md` Option (a)): "Janet still needs to know which engagement is current when she's in MyWork / Methodology / Settings — she's working a portfolio of 8 schools, not just one. Strip the project selector entirely and she'll wonder which school's tasks she's seeing on the MyWork board."
- **Audit classification:** **O — explicit toolkit-tweak beyond the literal design.** This is the **only** item in this catalogue that adds a UI element to a tarball surface (the TopBar) rather than filling a tarball gap. User-authorized.
- **Containment rules** (so this doesn't grow into a parallel project selector):
  - The chip is passive — clicking it navigates, it does NOT open a menu.
  - It only renders on non-project-scoped routes. It is hidden on `project`, `capabilities`, `guides`, `decisions`, `workshops`, `schedule`.
  - It cannot grow extra metadata (no phase, no sprint, no nextGL — those belong in the projctx pills on project routes).
  - If the user removes the constraint, this is the only place to relax. Anywhere else, the answer is "use the ProjectContextBar."

### 9–11. B0-8 Work Products UI surface (freeze-override slice)

- **Where it lives:** `components/v2/workproducts.tsx` (~330 lines, both kanban + detail pages); `app/styles/workproducts.css` (~240 lines); `components/v2/detail.tsx` (`WorkProductsTab` function + leftmost tab on `CapabilityDetailPage`, +95 lines); `app/page.tsx` (two new route handlers for `workproducts` and `workproducts/<id>`); `components/v2/shell.tsx` (rail entry); `components/v2/icons.tsx` (new icon).
- **What it does:** Materializes the typed `WorkProduct` entity (landed 2026-05-12 AM, seeded with 17 entries by methodology-guru) as three coordinated UI surfaces — a portfolio-level state kanban, a per-WP deliverable detail, and a per-capability tab roll-up.
- **What the tarball has:** Nothing. The K3NKe3Iu tarball ships task-level surfaces (MyWork, Capability Delivery tab) but no work-product-level entity, kanban, or deliverable detail. Source of inspiration is the sibling `n2s-active-playbook` project's `KanbanBoard.tsx` / `StageProgressView.tsx` / acceptance-criteria-tab shape, but the toolkit's implementation is its own (Path B — toolkit stays independent, copies the WP schema field-for-field but builds its own mock world).
- **Why ported:** User's repeated "STILL no view at the capability or work product level" complaint (2026-05-11 PM). Resolved 2026-05-12 AM with Path B decision; pulled forward from Sprint B0 (post-audit) into the pre-audit window 2026-05-12 PM in the user's four-call sign-off.
- **Audit classification:** O × 3 (toolkit-originals). User authorized the freeze override; no parity claim possible against tarball for these surfaces.
- **Known shipping debt:**
  - Drag-to-change-state and real state mutations deferred to Stance B Sprint B1 (state writes need Drizzle).
  - State-change buttons on the WP detail page fire `notImplemented` toast with explicit "Stance B B1" messaging.
  - DRC deep-links land at `#decisions` inbox (no per-DRC route today).

## Drift-audit posture (May 15)

When the audit runs:

- **Do not** report any of the eleven surfaces above as missing-vs-tarball drift. They are intentional toolkit-originals.
- **Do** still check that the existing ported surfaces (Practice home, Project home, Capability detail Delivery tab, Configuration guide walk-step body, secondary pages, the K3NKe3Iu TopBar + ProjectContextBar) match the tarball at `K3NKe3IuvfS03Mr6yWnkDw`.
- **Do** report the §3 "Toolkit-original additions" section in the audit document listing all eleven items with one-line scope per item — separates intentional from accidental drift.
- **The "item 8 is the only product-owner-required tweak" containment language is retired** as of the 2026-05-12 sign-off. Future audits classify beyond-design additions as toolkit-originals rather than treating them as audit blockers; the chip's own internal containment rules (passive, hidden on project routes, no extra metadata) remain in force.

## Files added/changed in this slice

- `lib/data.ts` — `TaskStatus` union, `TASK_STATUSES` const, `ConfigField` type, `CONFIG_FIELDS_BY_OC` (SOATERM populated).
- `components/v2/pages.tsx` — `MyWorkPage` extended with toggle + `MyWorkBoard`; `SchedulePage` replaced with `ScheduleGantt`.
- `components/v2/detail.tsx` — `ConfigFieldsTable` added; `ConfigurationGuidePage` wires it under each section.
- `app/styles/v2.css` — appended `.v2-mywork-viewtoggle`, `.v2-board-*`, `.v2-gantt-*`. No new tokens.
- `app/styles/detail.css` — appended `.d-configtable-*`. No new tokens.
- `app/page.tsx` — **unchanged** (no new routes).
- `components/views/*` (v1 archive) — **unchanged**.

## Explicit non-goals (deferred)

- Drag-and-drop kanban
- Three-state review on config fields (no flag + notes)
- Active-playbook-style capability roadmap card view
- Editable gantt / config fields
- Real-time event source for activity feed
- `xlsxRowIds`, `bastardLoopState`, DRC `signedBy` / `hash` schema additions
- Serif-font resurrection (Source Serif 4 / Newsreader)
- Test framework bootstrap
