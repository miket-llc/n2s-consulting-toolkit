# Chief Architect — Memory Index

This is the agent's persistent memory across sessions. Add memory entries as separate `.md` files in this directory and link them here.

## Conventions
- `feedback_*.md` — guidance the user has given that should persist (corrections + validations)
- `project_*.md` — facts about ongoing work, goals, decisions (with **Why:** + **How to apply:**)
- `reference_*.md` — pointers to external resources (Linear, Slack, dashboards, design tarballs)
- `user_*.md` — user role / preferences / collaboration style

## Entries
- [Capability detail + Configuration guide ported](project_detail_surfaces.md) — 2026-05-07: tarball `1RfZ75xy` ported, two new surfaces and routes shipping; brief §11 follow-ups recorded.
- [Main-features slice — kanban, capability working surface, project gantt](project_main_features_slice.md) — 2026-05-11: architectural shape decisions for three user-requested features. Central risk: kanban + gantt are off-design — must be documented as toolkit-original before the 2026-05-15 drift audit.
- [MVP pilot review — Chief Architect](project_mvp_pilot_review.md) — 2026-05-11: full pilot assessment. Recommended **Stance A (hosted hi-fi demo)**. Cull list (3,841 legacy v1 lines + ~150 dead data exports + dead patterns), 4-sprint sequenced work plan (A→D), 9 risks, 6 open questions. Synthesis input for cross-team plan.
