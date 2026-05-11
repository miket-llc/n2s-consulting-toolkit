---
name: Toolkit-original additions (not in source tarball)
description: Three surfaces shipped on 2026-05-11 are net-new toolkit-originals with no counterpart in the design tarball. The May 15 drift audit will see them and should classify them as intentional additions, not drift.
type: project
---

**Date:** 2026-05-11
**Tarball baseline at time of ship:** `CgM4C5b7mEU63Y2RQISWcw`

## What is intentionally off-design

Three surfaces landed before the 2026-05-15 drift audit. Each is a net-new toolkit-original surface — the source design tarball does **not** cover them. They should be classified as **intentional additions**, not drift findings.

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

## Drift-audit posture (May 15)

When the audit runs:

- **Do not** report the above three surfaces as missing-vs-tarball drift. They are intentional toolkit-originals.
- **Do** still check that the existing ported surfaces (Practice home, Project home, Capability detail, Configuration guide walk-step body, secondary pages) match the tarball at `CgM4C5b7mEU63Y2RQISWcw`.
- A useful audit deliverable: a section in the report titled "Toolkit-original additions" listing these three with one-line scope per item — separates intentional from accidental drift.

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
