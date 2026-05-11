---
name: Sprint 1 — three main features scoped and sequenced
description: Timeline / Kanban / Config-tasks scope call with rationale, acceptance criteria, and drift-audit posture.
type: project
---

**Date:** 2026-05-11

**What was scoped:** User asked to begin implementing three features: kanban task board, capability config-tasks surface (heear-editor flavored), project timelines (gantt / active-playbook roadmap).

**Sequencing decision:** Timeline first → Kanban second → Config-tasks third.

**Why:**
- Timeline: data 100% ready (MILESTONES, GANTT_TODAY, GO_LIVES); SchedulePage is a stub today; S-M cost; no schema changes.
- Kanban: TASKS has correct status values; view transformation of existing data; M cost; high user-facing value.
- Config-tasks: requires new inline entity model (not just TASKS filtered); schema TBD; M-L cost; hold until post-audit.

**Drift-audit posture (May 15):**
- None of the three features are in tarball CgM4C5b7mEU63Y2RQISWcw.
- Hold kanban and config-tasks until post-audit.
- Timeline upgrade may land pre-audit ONLY if clean by May 13 and flagged as "intentional addition / no tarball reference."

**Key deferrals:**
- Drag-and-drop kanban (click-to-advance sufficient)
- Live Gantt bars with duration (data is point-events only)
- Multi-engagement timeline aggregation (single-project only)
- heear-editor 3-state review → simplified 4-state enum

**Open questions before implementation (E-risks):**
1. Kanban = replaces MyWork or new /board route?
2. Config-tasks = TASKS filtered by capability OR separate entity (heear-style)?
3. Timeline = point-events (doable now) or duration bars (needs schema)?
4. Demo deadline before May 15? If yes, kanban jumps to slot 1.

**How to apply:** If user follows up on any of these three features, use this as the accepted scope baseline. Revisit only if user explicitly changes the brief or a demo deadline surfaces.
