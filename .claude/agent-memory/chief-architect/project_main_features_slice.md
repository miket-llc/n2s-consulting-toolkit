---
name: Main-features slice — kanban, capability working surface, project gantt
description: 2026-05-11 architectural decisions for the three user-requested features. Captures the off-design risk and the per-feature surface call.
type: project
---

**Date:** 2026-05-11

**Context:** User asked for (1) a kanban for task management, (2) a capability working surface modeled on `n2s-heear-editor` capability pages, (3) project timelines modeled on `n2s-active-playbook`. Invoked chief-architect + product-manager together for shape + sequencing.

**Central risk (carry this forward):** Both the kanban and the 12-month gantt are **off-design** — neither appears in the design tarball (`CgM4C5b7`, May 2026 drop). The tarball ships `MILESTONES` data with `monthCol`/`dayInMonth` but no gantt render; MyWork is due-date buckets, not a status board. The capability detail page is the only one of the three asks that has design coverage.

This means:
- The 2026-05-15 drift-audit mapping table does NOT cover these surfaces.
- `design-fidelity-guardian` cannot adjudicate "matches the source" because there is no source for kanban/gantt.
- We must document these as **toolkit-original** in the audit baseline before merge.
- Any later design drop covering these areas may force a redo. Accepted deliberately on user request.

**Decisions:**

1. **Kanban → MyWorkPage rewrite, not new route, not per-capability board.**
   - Cross-engagement board for Janet's queue. Single source of truth.
   - Columns: `Backlog · Ready · In progress · Needs review · Done` (5).
   - Today/this-week stays as a filter chip strip above the columns, not the primary axis.
   - "Blocked" is NOT a column — blockers are DRCs surfaced on Decisions inbox; render as a card pill via optional `blockedBy?: string[]` on Task.
   - Persistence: localStorage `v2.taskStatus.<id>` overlay. No backend.
   - DnD deferred.

2. **Capability working surface → extend `ConfigurationGuidePage`, NOT add a Delivery sibling tab.**
   - Lift from heear-editor: `ConfigItemsTable` sortable-row-with-inline-expand pattern (without sort/drag); `ContentBlock` review state (TWO states only: `unreviewed/confirmed`); `WorkflowStepsEditor` as a read-only checklist rail.
   - Drop from heear-editor: three-state review, comment threads, server-backed authoring, Region tab, History tab.
   - Persistence: localStorage `v2.fieldReview.<ocId>.<fieldId>`, `v2.stepDone.<ocId>.<stepId>`.
   - This is the only one of the three asks where we extend a design-covered surface — needs ux-visionary pass and explicit handoff note to design-fidelity-guardian.

3. **Project timelines → 12-month milestone gantt on `#schedule`, capability roadmap deferred.**
   - `MILESTONES` data already typed and complete — render as month-grid swimlanes grouped by goLive.
   - Today cursor at `GANTT_TODAY` (May 1, 2026).
   - Existing `SchedulePage` readiness list becomes the band above the gantt.
   - Active-playbook-style capability roadmap cards deferred until gantt usage tells us what's missing.

**Data deltas (additive to `lib/data.ts`):**
- `TaskStatus` union + `TASK_STATUS_LABELS` map; widen `Task` with `status: TaskStatus`, `order: number`, optional `blockedBy?: string[]`. Canonicalize existing TASKS rows (e.g. `"In Progress"` → `"in-progress"`).
- New `ConfigField` type + `OC_STEPS` sibling map (keep `OC_INDEX` shape stable for the audit).
- **No additions** for the gantt — `MILESTONES` / `GANTT_TODAY` / `MILESTONE_TYPES` / `GO_LIVES` already sufficient.

**File impact:**
- `components/v2/pages.tsx` — MyWorkPage rewrite, SchedulePage rewrite. Other pages untouched.
- `components/v2/detail.tsx` — extend `ConfigurationGuidePage` with `ConfigFieldRow` + `WorkflowStepsRail` sub-components. Delivery tab task list unchanged.
- `app/styles/v2.css` — new `.v2-kb-*` (kanban) and `.v2-gantt-*` (gantt) blocks.
- `app/styles/detail.css` — new `.d-field-*` rules.
- `app/page.tsx` — no new routes.

**Sequencing recommended to product-manager:**
1. Data canonicalization (TaskStatus widening, no UI risk).
2. Kanban MyWork rewrite.
3. Gantt schedule.
4. Config-field review surface (needs ux-visionary handoff first; touches a design-covered surface).

Lead-developer owns 1–3. UX-visionary must weigh in before 4.

**Explicit non-goals for this slice:** DnD reordering, three-state review, persistence beyond localStorage, editable gantt, capability roadmap cards (active-playbook style), per-capability kanban board, `xlsxRowIds` wiring, `FINDING_INDEX` wiring, tests, CI.

**Pre-existing follow-ups still NOT closed:** see `project_detail_surfaces.md` — `xlsxRowIds`, real activity event source, optional schema additions on `BUSINESS_CAPABILITIES`/`DRC`.

---

## Shipped (2026-05-11)

User approved the all-three-before-May-15 path. Implemented per the plan at `.cursor/plans/main-features-pre-audit_ce57d140.plan.md` with two minor deviations:

1. **Kanban placement** landed as a **Buckets | Board toggle inside MyWork** (per user clarification in the scoping ask-question), not a full MyWork rewrite. Bucket view preserved verbatim; `MyWorkBoard` is a sibling renderer. Toggle persists to `localStorage["v2.mywork.view"]`. Defaults to Buckets.
2. **TaskStatus canonicalization** uses the existing string values (`"Backlog" | "Ready" | "In Progress" | "Needs Review" | "Done"`) — no kebab-case rewrite. `TASKS[].status` already aligned 1:1; only `TASK_STATUSES` const + `TaskStatus` type added. No existing rows mutated.
3. **WorkflowStepsRail not built** — the existing TOC + `markComplete()` walk on `ConfigurationGuidePage` already covers walk-step completion. Only `ConfigFieldsTable` was added; it sits inside the active section card, below intro/steps, above the AI-draft slot.

Final file footprint:
- `lib/data.ts` — `TaskStatus`, `TASK_STATUSES`, `ConfigField`, `CONFIG_FIELDS_BY_OC` (SOATERM only, 9 rows across 6 sections).
- `components/v2/pages.tsx` — added `useMyWorkView`, `MyWorkBuckets`, `MyWorkBoard`; replaced `SchedulePage` with readiness band + 12-month gantt (`GANTT_MONTHS` const, milestone dots with type-toned legend).
- `components/v2/detail.tsx` — added `ConfigFieldsTable` (engagement-scoped review state); `ConfigurationGuidePage` now imports `useApp` for `currentProject?.id`.
- `app/styles/v2.css` — appended `.v2-mywork-viewtoggle`, `.v2-board-*`, `.v2-gantt-*` (readiness band + swimlane + legend). No new tokens.
- `app/styles/detail.css` — appended `.d-configtable-*`. No new tokens.
- `app/page.tsx` — unchanged. `components/views/*` (v1 archive) unchanged.

Drift posture documented at `.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md` — design-fidelity-guardian will classify these three surfaces as intentional additions, not drift, when the May 15 audit fires.
