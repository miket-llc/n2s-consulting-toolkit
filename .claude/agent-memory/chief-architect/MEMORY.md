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
- [MVP pilot review — Chief Architect](project_mvp_pilot_review.md) — 2026-05-11: full pilot assessment. Recommended **Stance A (hosted hi-fi demo)**. Cull list (3,841 legacy v1 lines + ~150 dead data exports + dead patterns), 4-sprint sequenced work plan (A→D), 9 risks, 6 open questions. Synthesis input for cross-team plan. **Superseded by the Stance B replan below.**
- [Stance B replan reasoning trace](project_stance_b_replan_2026_05_11.md) — 2026-05-11 (afternoon): user overrode Stance A → picked Stance B (real auth + DB + LLM behind AskPage). Full reasoning behind PLAN.md §5–§13: stack choices (Clerk/Neon/Drizzle/AI SDK + Gateway with overrides), data model (catalog/per-engagement/per-user split + R8 scoping), six-sprint calendar (B0 cleanup → B5 polish + rehearsal, pilot 2026-08-03), risk reshape (R-AUTH/R-MIG/R-LLM-COST/R-LLM-HALL/R-FERPA/R-COLD/R-SECRETS/R-LOCK/R-INVITE), six open sub-questions surfaced, new **platform-engineer** agent recommended + **ai-architect** added to roster, docs-leader to update AGENTS.md.
