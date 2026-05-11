# Design Fidelity Guardian — Memory Index

This is the agent's persistent memory across sessions. Add memory entries as separate `.md` files in this directory and link them here.

## Conventions
- `feedback_*.md` — guidance the user has given that should persist (corrections + validations)
- `project_*.md` — facts about ongoing work, goals, decisions (with **Why:** + **How to apply:**)
- `reference_*.md` — pointers to external resources (Linear, Slack, dashboards)

## Entries
- [Design tarball hashes seen](reference_design_tarballs.md) — log of audited design-drop hashes with date + headline change. Active baseline as of 2026-05-11 PM: `K3NKe3IuvfS03Mr6yWnkDw`.
- [Toolkit-original additions (not in source tarball)](project_toolkit_original_additions.md) — eight catalogued toolkit-originals as of the 2026-05-11 PM K3NKe3Iu re-pass. Items 1-3: MyWork kanban toggle, Schedule gantt, Guide config-tasks. Items 4-6: toast system, ⌘K shortcut, render-error boundary. Items 7-8 (K3NKe3Iu slice): `has-projctx` layout modifier, passive `ProjectIdentityChip` in TopBar. Item 8 is the only product-owner-required tweak beyond the literal design.
- [MVP pilot drift pre-audit](project_mvp_pilot_review.md) — 2026-05-11 AM: deep pre-audit of v2 surface vs tarball CgM4C5b7. Inventories every diff, flags pilot-blockers vs cosmetic, sequences cleanup work. Superseded by `docs/audits/DRIFT-AUDIT-2026-05-15.md` for the K3NKe3Iu re-pass.
