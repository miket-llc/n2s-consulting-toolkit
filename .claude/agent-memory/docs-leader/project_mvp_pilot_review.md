---
name: MVP Pilot Docs Review — 2026-05-11
description: Full doc audit and pilot doc plan for production-pilot readiness review
type: project
---

# Docs Audit + Pilot Plan — 2026-05-11

## 1. Current-State Findings

### README.md (~108 lines)

| Section | Status | Detail |
|---|---|---|
| Routes table — `#schedule` | **LIE** | Described as "Go-lives ahead" (a list). Actual: 12-month milestone Gantt with today-line and milestone type markers. |
| Routes table — `#mywork` | **STALE** | Described as "My work — cross-engagement queue". Actual: tabbed kanban with buckets/board toggle. |
| Routes table — sub-routes | **MISSING** | `#guides/<ocId>` (ConfigurationGuidePage) and `#capabilities/<capId>` (CapabilityDetailPage) exist in the router but are not in the table. |
| File structure — `components/v2/` | **MISSING** | `detail.tsx` is not listed; it is untracked but live (imported by `app/page.tsx`). |
| File structure — `app/styles/` | **MISSING** | `detail.css` is not listed; it is untracked but live. |
| Interactions section | **STALE** | No mention of the MyWork kanban toggle (buckets ↔ board). |
| Legacy v1 / drift-audit tarball URL | **STALE reference** | URL hardcodes `fIMotZmRLqVfGyaje-CA1g`; shared context says the current baseline tarball is `CgM4C5b7mEU63Y2RQISWcw`. Wrong tarball ID in public-facing README. |
| All other content | OK | Run commands, smoke gate, mock engagement, tech stack — accurate. |

### AGENTS.md (~50 lines)

| Item | Status | Detail |
|---|---|---|
| Agent count | OK | "ten specialized agents" — 10 files in `.claude/agents/`, 10 rows in table. Match. |
| ai-architect / deployment-expert / etc. | N/A | Those are Cursor subagent_types, not local agents. Not AGENTS.md's concern. |
| All agent scope lines | OK | Accurate as of this review. |
| Smoke gate section | OK | `pnpm smoke` description matches `scripts/smoke.sh`. |

### CLAUDE.md

| Item | Status | Detail |
|---|---|---|
| Content | OK | Single `@AGENTS.md` pointer. Correct. |

### BACKLOG.md

| Item | Status | Detail |
|---|---|---|
| Header date | **STALE** | "State of play (2026-05-04)" — a week behind. |
| Shipped items | **MISSING** | MyWork kanban toggle, Schedule Gantt (today-line + milestones), Configuration Guide detail (`detail.tsx`) all shipped 2026-05-11 but not recorded. |
| Open questions | PARTIALLY STALE | Question #1 (drift-audit baseline) is still open — tarball `CgM4C5b7mEU63Y2RQISWcw` available but v2 re-export not done. Still valid. |
| Tier 0 items | PARTIALLY STALE | Gantt milestone markers were Tier-deferred; they shipped. Needs a line item moved to "shipped". |

### docs/drift-baseline-2026-05-01.md

| Item | Status | Detail |
|---|---|---|
| Content | OK | Accurate v1 parity audit. Anchored to the right baseline for v1. |
| Applicability to v2 | N/A | This doc covers the v1 surface only; README Legacy v1 section correctly describes this. |

### docs/v2-design-brief.md

| Item | Status | Detail |
|---|---|---|
| Content | PARTIALLY STALE | Some items in "Core asks" (Schedule Gantt milestones, MyWork kanban) appear to have shipped. The brief is a design input document — it doesn't need updating on ship; but a reader would be confused about what's done vs pending. |
| Presence in docs/ | OK | Appropriate location. |

### docs/NN Ellucian Student Banner Signature Project Plan (1).xlsx

| Item | Status | Detail |
|---|---|---|
| Git tracking | **UNTRACKED** (intentional?) | Binary, spaces in filename, ~unclear provenance. |

## 2. Extraneous / Culling Recommendations

- **The .xlsx**: Do NOT commit. Add `docs/*.xlsx` to `.gitignore`. If the file is a source-of-truth reference for methodology-guru content, link it from BACKLOG.md or a reference note. Binary files in git are a maintenance tax — this one adds no code value.
- **docs/drift-baseline-2026-05-01.md**: Keep. It is the v1 parity record and will be needed for the May 15 audit decision. Move it to `docs/audits/` only if the docs/ folder grows (not worth the churn today).
- **docs/v2-design-brief.md**: Keep. It is the design intent doc for v2 features. No cull.
- **BACKLOG.md**: Keep, but update the header date and move shipped items. It is the sprint-to-sprint working doc.

## 3. MVP Scope for Pilot

### Must-have (pilot breaks without these)
- **README route table corrected** — a pilot user will try #schedule expecting a go-live list; they'll be confused.
- **README file structure updated** — `detail.tsx` and `detail.css` listed.
- **README interactions section updated** — kanban toggle is a primary MyWork affordance.
- **BACKLOG.md date + shipped items updated** — internal hygiene; a contributor using the backlog will mis-prioritize if shipped items look open.
- **Tarball ID corrected in README Legacy v1 section** — `fIMotZmRLqVfGyaje-CA1g` → `CgM4C5b7mEU63Y2RQISWcw` (or just remove the URL from README; it's an internal agent reference, not user-facing).

### Should-have (hurts a real pilot user without, but not a hard blocker)
- **Short USER_GUIDE.md or in-app onboarding path** — if real consultants are dropped into the app with no briefing, the first-time experience relies entirely on the UI affording itself. The UI has Coming placeholders and toast stubs; a half-page "here's what works today" is the minimum support layer.
- **ADR: MyWork kanban model** — the buckets/board toggle represents a genuine scope decision (two different mental models of the same queue). Worth a one-paragraph ADR noting the trade-off and which Janet-side workflow each serves.
- **ADR: v2 audit baseline decision** — the drift audit baseline is an open blocker. Recording the decision (once made) in an ADR protects future agents from re-litigating it.

### Could-have (nice, not for pilot)
- **Demo script** — a walk-through for the pilot facilitator covering NSU mock engagement, which flows to demo, what to skip. Useful for a structured pilot; skip if pilot is self-serve.
- **CHANGELOG.md** — version history. Useful when the user is tracking what changed between pilot sessions. Not needed for a first pilot.
- **ADRs for design choices** (no Tailwind, no state library, no UI kit, 1:1 v1/v2 mapping) — worth capturing eventually; not urgent for pilot.
- **docs/audits/** subfolder — makes sense once there are multiple drift-audit reports. Premature to create today.

## 4. Concrete Work Items (sequenced, sized)

| # | Item | Size | Owner |
|---|---|---|---|
| 1 | Fix README routes table (3 cells wrong/missing) | S | docs-leader |
| 2 | Add `detail.tsx` + `detail.css` to README file structure | S | docs-leader |
| 3 | Add MyWork kanban toggle to README interactions section | S | docs-leader |
| 4 | Fix README Legacy v1 tarball ID | S | docs-leader |
| 5 | Update BACKLOG.md: header date, move shipped items | S | docs-leader |
| 6 | Add `docs/*.xlsx` to `.gitignore` | S | docs-leader |
| 7 | Decide: write USER_GUIDE.md or in-app onboarding? | M | user decision → docs-leader |
| 8 | ADR: MyWork kanban model | S | docs-leader (when asked) |
| 9 | ADR: v2 drift-audit baseline (after decision in Q1) | S | docs-leader (after user decides) |

Items 1–6 are low-risk, self-contained, zero code. Can be done in one pass.
Items 7–9 block on user decisions or are low urgency.

## 5. Risks

- **Onboarding friction**: If pilot consultants arrive without a briefing, they'll see Coming placeholders and toasts for half the rail items. Without a USER_GUIDE or facilitated walkthrough, drop-off is high. The README is written for developers, not consultants.
- **BACKLOG drift compounds**: If shipped items stay listed as open in BACKLOG.md, future agents (product-manager, lead-developer) will double-work or prioritize incorrectly. This is already happening — the gantt/kanban work is listed as deferred.
- **Tarball ID in README**: If anyone uses the hardcoded URL (`fIMotZmRLqVfGyaje-CA1g`) for the May 15 audit, they'll baseline against the wrong design. Real risk.
- **docs/v2-design-brief.md confusion**: A new contributor reading the brief won't know which "Core asks" have shipped and which are still pending. No status markers exist. Not urgent for pilot, but creates support questions.
- **Binary xlsx in git**: If accidentally committed, it bloats the repo and is hard to remove cleanly. `.gitignore` first.

## 6. Open Questions for the User

1. **User-facing docs for the pilot**: Is the pilot facilitated (the user walks consultants through it) or self-serve? Self-serve requires a USER_GUIDE or in-app onboarding. Facilitated can skip it.
2. **README vs USER_GUIDE**: Is README the internal source of truth for contributors only, and a separate `USER_GUIDE.md` covers the consultant experience? Or does README serve both audiences?
3. **The .xlsx**: Is "NN Ellucian Student Banner Signature Project Plan (1).xlsx" source material for methodology-guru content (Banner project plan structure), or a stray file? Should it be `.gitignore`'d and referenced only in notes, or does it belong somewhere versioned (like a shared drive)?
4. **BACKLOG.md ownership model**: Should BACKLOG.md be updated after every ship (making it a rolling ledger), or is it a sprint-planning artifact that gets replaced each sprint? Current state mixes both — it records shipped items and open questions in the same doc.
5. **ADR policy**: Should every significant feature decision (kanban model, gantt milestone schema, config-fields detail surface) generate an ADR, or are ADRs reserved for architectural decisions (no Tailwind, hash routing, v1/v2 split)?
6. **Pilot doc deliverables for clients**: Does the pilot include doc deliverables the client (the consulting practice) would receive? E.g., a onepager describing what the toolkit does? This is out of scope for this audit but needs an answer before the pilot brief.
