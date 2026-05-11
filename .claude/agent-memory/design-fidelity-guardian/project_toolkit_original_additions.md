---
name: Toolkit-original additions (not in source tarball)
description: Eight surfaces / behaviours shipped before the 2026-05-15 drift audit are net-new toolkit-originals with no counterpart in the design tarball. The audit classifies them as intentional additions, not drift. Items 1-3 added 2026-05-11 AM. Items 4-6 formalized in the CgM4C5b7 audit pass on 2026-05-15. Items 7-8 added in the K3NKe3Iu re-pass on 2026-05-11 PM (shell redesign slice). Item 8 is the only one that is a product-owner-required tweak beyond the literal design — all others are scoped to surfaces the tarball doesn't cover.
type: project
---

**Last updated:** 2026-05-11 PM (K3NKe3Iu re-pass)
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
| **8** | **Passive `ProjectIdentityChip` in TopBar on non-project-scoped routes** | **2026-05-11 PM** | **`K3NKe3IuvfS03Mr6yWnkDw`** | **`shell.tsx` `ProjectIdentityChip` + `TopBar` showIdentityChip gate, `v2.css` `.v2-projidchip*` lines 263-280** |

## Why each one is intentional

The original three (1–3) shipped on 2026-05-11 AM. The four shell-redesign-related (4-8) are formalized in the drift audit passes — see [project_mvp_pilot_review.md](project_mvp_pilot_review.md) and the audit document itself for full provenance.

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

## Drift-audit posture (May 15)

When the audit runs:

- **Do not** report any of the eight surfaces above as missing-vs-tarball drift. They are intentional toolkit-originals.
- **Do** still check that the existing ported surfaces (Practice home, Project home, Capability detail, Configuration guide walk-step body, secondary pages, the new K3NKe3Iu TopBar + ProjectContextBar) match the tarball at `K3NKe3IuvfS03Mr6yWnkDw`.
- **Do** report the §3 "Toolkit-original additions" section in the audit document listing all eight items with one-line scope per item — separates intentional from accidental drift.
- **Specifically for item 8:** the audit should explicitly call out that it is the only product-owner-required tweak beyond the literal design, so future audits know not to "fix" it as drift.

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
