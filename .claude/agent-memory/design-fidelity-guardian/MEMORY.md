# Design Fidelity Guardian — Memory Index

This is the agent's persistent memory across sessions. Add memory entries as separate `.md` files in this directory and link them here.

## Conventions
- `feedback_*.md` — guidance the user has given that should persist (corrections + validations)
- `project_*.md` — facts about ongoing work, goals, decisions (with **Why:** + **How to apply:**)
- `reference_*.md` — pointers to external resources (Linear, Slack, dashboards)

## Entries
- [Design tarball hashes seen](reference_design_tarballs.md) — log of audited design-drop hashes with date + headline change
- [Toolkit-original additions (not in source tarball)](project_toolkit_original_additions.md) — 2026-05-11: three surfaces shipped pre-audit (MyWork kanban toggle, Schedule gantt, Guide config-tasks). Classify as intentional additions, not drift.
- [MVP pilot drift pre-audit](project_mvp_pilot_review.md) — 2026-05-11: deep pre-audit of v2 surface vs tarball CgM4C5b7. Inventories every diff, flags pilot-blockers vs cosmetic, sequences cleanup work, lists 6 open questions for the user. Two new toolkit-originals to classify after user confirms: (a) toast system + notImplemented, (b) ⌘K search focus.
