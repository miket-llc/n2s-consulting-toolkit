---
name: WORK_PRODUCTS seed decisions
description: Authoring decisions for the initial 17 WorkProduct entries in lib/data.ts (2026-05-12)
type: project
---

## Context

Seeded `WORK_PRODUCTS: WorkProduct[]` per Path B decision (2026-05-12). Type mirrors active-playbook's `WorkProductSchema` field-for-field; data is toolkit-specific mock world. Views not yet wired (B0-8 post-audit).

## Entry count and state distribution

**17 entries total.**

| State | Count | Entries |
|---|---|---|
| `signed` | 5 | wp-nsu-charter, wp-nsu-bb-hr-core, wp-nsu-config-raci-curriculum, wp-wiu-charter, wp-csu-charter |
| `in-progress` | 5 | wp-nsu-raid-log, wp-nsu-bb-payroll, wp-nsu-test-plan-curriculum, wp-nsu-cutover-hr, wp-wiu-bb-faa |
| `needs-review` | 2 | wp-nsu-bb-curriculum, wp-csu-test-plan-gl |
| `not-started` | 4 | wp-nsu-bb-gl, wp-nsu-test-plan-hr-core, wp-nsu-hypercare-hr, wp-wiu-test-plan-faa |
| `blocked` | 1 | wp-nsu-bb-records |

## Engagement breakdown

- **NSU (12 entries):** Primary engagement mid-Sprint 1. Full lifecycle represented: 2 discover-phase engagement-wide WPs, 6 design-phase blueprints/RACI, 2 validate-phase test plans, 1 deploy-phase cutover runbook, 1 stabilize-phase hypercare stub.
- **WIU (3 entries):** FA-flavored. Charter signed; BB FAA in-progress (DRC-4 pending); Test Plan not-started.
- **CSU EB (2 entries):** GL-focused. Charter signed; GL Test Plan needs-review (feeds from CSU-12 task).

## Artifact naming conventions adopted

- Use the full consulting-document names that practitioners use: "Business Blueprint", "Cutover Runbook", "Hypercare Playbook", "Configuration RACI", "Test Plan", "RAID Log", "Engagement Charter". Not generic SaaS labels.
- Title pattern for capability-scoped WPs: `{Artifact Type} · {Capability Label}` (e.g. "Business Blueprint · HR Core & Position").
- `stage` slugs follow `{phase}-{activity}` format: `discover-charter`, `design-blueprint`, `validate-uat`, `deploy-cutover`, `stabilize-hypercare`. Kept short and consistent across all entries in the same stage.

## Owner assignment decisions

- `cs` (Cara Stein, PM) owns engagement-wide administrative WPs: Engagement Charter, RAID Log, Hypercare Playbook. Rationale: these are PM-driven in real consulting engagements; Lead Consultant is Accountable, PM is Responsible.
- `dl` (Derek Liu, Technical · HR/Payroll) owns HR Core Blueprint, Payroll Blueprint, HR/Payroll Cutover Runbook, HR Core Test Plan. All are in his domain.
- `jh` (Janet Hawkins, Lead Consultant) owns Student Records Blueprint, Curriculum Test Plan, WIU charter and FAA Blueprint, CSU charter. Janet is lead on cross-engagement items.
- `mt` (Marisol Tovar, Functional · Student) owns Curriculum Blueprint — she's the functional author.
- `rk` (Raj Kapoor, Functional · Finance) owns GL Blueprint (NSU), CSU GL Test Plan.
- For non-NSU engagements, `jh` is default lead per task brief.

## RACI patterns

- Engagement Charter: Lead Consultant = A, PM = R, Functional Lead = C, Sponsor = I.
- Business Blueprint: Functional Lead = R, Lead Consultant = A, PM = C, Sponsor = I.
- Configuration RACI: Lead Consultant = A, Functional Lead = R, Tech Lead = C, PM = I.
- Test Plan: Lead Consultant = A, Functional Lead = R, PM = C, Sponsor = I.
- Cutover Runbook: Functional Lead = R, Lead Consultant = A, Tech Lead = C, PM = C, Sponsor = I.
- RAID Log: PM = R, Lead Consultant = A, Functional Lead = C, Sponsor = I.
- Hypercare Playbook: PM = R, Lead Consultant = A, Sponsor = C, Functional Lead = I.

## DRC linkages

- `wp-nsu-bb-records` → `blocked` on DRC-3 (grad/undergrad window separation). Directly blocks cohort definitions in bc-records.
- `wp-nsu-bb-curriculum` → `needs-review` with DRC-1 (term-code prefix), DRC-2 (PoT split), DRC-5 (STVATTR) linked. DRC-2 is the hard blocker; the blueprint is in review pending that resolution.
- `wp-nsu-bb-payroll` → `in-progress` with DRC-7 (GA earn-code variants) linked. All other earn-code categories confirmed.
- `wp-nsu-bb-hr-core` → `signed` with DRC-6 (position-class taxonomy) linked — DRC-6 is in-discussion but low-severity; blueprint was signed anyway with adopt-as-is recommendation noted.
- `wp-wiu-bb-faa` → `in-progress` with DRC-4 (FA proc-year offset) linked.

## Deliberate omissions

- No `bc-ap`, `bc-ar`, `bc-billing`, `bc-advising`, `bc-housing`, or `bc-integrations` BPs authored. These capabilities are either scoping or later-phase; adding stub WPs would just inflate the not-started count without adding pilot demo value.
- Cutover Runbook only for HR/Payroll (closest go-live May 24). Finance and Student cutover runbooks are not yet in scope.
- Only 1 `blocked` entry. The task brief said 1-2; a second blocked entry would likely be `wp-nsu-bb-curriculum` but that BP is close enough to review that `needs-review` is more accurate (DRC-2 is stale but the BP content is substantially done).
- No `capability_id` on Cutover Runbook or Hypercare Playbook — these span bc-hr-core + bc-payroll, so `capability_refs` carries the domain link instead.

## Build/smoke status

- `pnpm next build` confirmed clean after seed was written (2026-05-12).
- `pnpm smoke` confirmed rendering surface unchanged (views don't read WORK_PRODUCTS yet).

## Flags for chief-architect / product-owner review

1. **engagement_id for WIU and CSU EB** are freestanding strings (`"wiu"`, `"csu-eb"`). No PORTFOLIO entry uses those as `.id` — PORTFOLIO uses `p1`, `p2`, `p3`. The task brief specified these strings explicitly; confirm that the B1 Drizzle schema will use these same engagement slug ids, or that a mapping table will bridge to PORTFOLIO ids.
2. **WIU phase contradiction**: PORTFOLIO shows WIU as "Stabilize" phase (S6), but WIU WPs authored here show design-phase Blueprint as `in-progress`. This is intentional — WIU is FA-flavored and FAA may be a new capability wave being onboarded during a stabilization sprint. If that read is wrong, the WIU BP and Test Plan states should be revised.
3. **`wp-nsu-cutover-hr` due May 22** — this is 10 days from seed authoring date. If the kanban view lands before then, the cutover runbook will appear as imminently due / overdue quickly. Consider adjusting the date to May 22 on B0-8 landing if the view ships post-audit.
