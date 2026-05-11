---
name: MVP pilot review — Chief Architect
description: 2026-05-11 architectural assessment for a "production pilot" of the consulting toolkit. Pilot stance, current-state findings, cull list, sequenced work items, risks, open questions. Synthesis input for the cross-team plan.
type: project
---

**Date:** 2026-05-11
**Asker:** user
**Lens:** Chief Architect — cross-cutting architecture, file layout, route shape, persistence model, agent-team adjustments, final-authority calls.
**Companion docs:** `project_main_features_slice.md` (just shipped), `project_detail_surfaces.md` (2026-05-07 port).

---

## 0. Recommended pilot stance

**Pick one and hold it.** "Production pilot" can mean three things; the cost gap between them is months.

| Stance | What it is | Effort | Risk |
| --- | --- | --- | --- |
| **A — Hosted hi-fi demo** | Vercel deploy of the current SPA, single-tenant on NSU mock data. Each consultant clicks through it on their laptop. localStorage rationalized to be either session-scoped or namespaced. **No backend.** | days | low — we already have it |
| **B — Prototype + thin backend** | Postgres or Vercel Postgres for shared state, Clerk for identity, a few API routes for writes (DRC sign-off, field-review confirm, task status). Engagement-scoped data isolation. | weeks | medium — pulls focus from feedback gathering to plumbing |
| **C — Real product** | Auth, multi-tenant, real Jira/Smartsheet/autopilot integrations, observability, RBAC, audit log. | months | high — this is no longer a pilot, it's a platform build |

**My call: Stance A.** A pilot exists to learn whether the product idea is right. We learn that fastest from a hosted clickable that real consultants can react to. Persistence and multi-user collaboration are the second pilot, not the first. This stance also matches the AGENTS.md "simplicity over abstraction" guardrail.

If the user wants Stance B, that's a real architectural pivot — recommend pausing the May 15 drift audit and replanning the May–June sprint.

---

## 1. Current-state findings (chief-architect lens)

### What's good

- **Composition is clean:** `AppProvider → PageShell → Router` is two layers, both honest. Hash routing in `app/page.tsx` is 70 lines and obvious.
- **Single typed dataset:** `lib/data.ts` is the source of truth; `brief.ts` is a clean abstraction over it. Cross-screen entities (DRCs, workshops, OCs) reuse the same rows.
- **Type-safe under strict.** Build is green; no `any` leakage in v2.
- **Toast model works.** `notImplemented(msg)` + `ToastHost` replaces every `alert()`; demo-safe.
- **Theme system works.** `tokens.css` covers light + dark; `theme-light` toggles via `<html>` class; persists to localStorage.
- **Smoke gate exists.** `pnpm smoke` is the only test-shaped artifact and it actually catches build/render breakage at the v2-marker level.
- **The just-shipped slice (kanban + gantt + config-fields) is internally coherent** — same vocabulary, same primitives, same persistence pattern.

### What's broken or missing for a pilot

1. **No error boundaries.** No `app/error.tsx`, no `app/not-found.tsx`, no `app/loading.tsx`. A single render exception in any v2 component blanks the entire SPA. Highest-leverage single fix.
2. **No data isolation per engagement.** `PORTFOLIO` has 8 schools but `TASKS`/`DRCS`/`WORKSHOPS`/`MILESTONES`/`OC_DATA`/`AUTOPILOT_RUNS` are all NSU-flavored globals. A consultant who switches the project switcher to Western Illinois sees the same NSU decisions. `TASKS` does carry a `project` string on a few rows; nothing else does. Caught by even a 30-second click-through.
3. **No persistence layer worth the name.** localStorage is per-browser/per-device and not shared. Two consultants on the same Vercel URL see different state. A consultant + a client sharing a screen mid-session means client browser may persist consultant review flags.
4. **localStorage keys are inconsistently namespaced.** Today's keys: `v2.theme`, `v2.currentProject`, `v2.defaultLanding`, `v2.mywork.view`, `v2.cfg.<engagement>.<oc>.<field>`, `v2.capability.<capId>.tab`. The `project_main_features_slice.md` plan called for `v2.fieldReview.*`/`v2.stepDone.*`; what shipped is `v2.cfg.*` and there is no step-done write. Fine for now; document in shell.tsx and lock the schema before pilot.
5. **Theme flash.** `app/layout.tsx` hardcodes `className="theme-light"` for SSR. `AppProvider` reads `localStorage` post-mount and applies the user's saved dark theme. Dark-mode users see a one-frame light flash on every page load. Standard fix is an inline script in layout.tsx; not done.
6. **No auth, no identity.** "Janet Hawkins"/"JH" is hardcoded in `shell.tsx` (avatar), `brief.ts` (greeting "Janet"), `data.ts` (members), `detail.tsx` (assignee defaults). If pilot has a second user, the prototype lies. Pilot stance must explicitly be "Janet's seat" or this is a real gap.
7. **Search lies.** ⌘K focuses the input; the input is a placeholder; typing matches nothing. Visible to every demo viewer.
8. **`detail.tsx` is 1,594 lines** — over the 300-line guideline by 5×. Two screens (`CapabilityDetailPage` + `ConfigurationGuidePage`) plus shared primitives plus inline data plus the `ConfigFieldsTable` add. Not a pilot blocker; touching it for any non-trivial pilot work is a parity-risking change.
9. **No telemetry.** Zero observability — we won't know what Janet actually clicks, whether the gantt or the kanban gets used, whether the brief is read. Vercel Web Analytics is one-line on; not done.
10. **No security headers.** `next.config.ts` is empty. No CSP, no X-Frame-Options, no Permissions-Policy. Pilot URL will be linkable.
11. **No CI** beyond what Vercel infers on deploy. Smoke gate is local-only.
12. **README still references `public/proto/`** that does not exist. Misleading for a new contributor.
13. **Heuristic data joins.** `detail.tsx::drcsForCap` (lines 220–229) string-matches three different fields to find DRCs for a capability; `home.tsx::parseSprint` parses `"S2 · D8/10"` with regex. Both are fragile; both should become explicit typed fields once we touch `lib/data.ts` again.
14. **Connected-sources lie.** `pages.tsx::SettingsPage` shows "Jira · Smartsheet · Autopilot · Standup notes — All connected." Nothing is connected. Replace with a `lib/integrations.ts` constant labeled "demo · not wired" or remove.
15. **Drift-audit posture is documented but not signed.** `project_main_features_slice.md` says design-fidelity-guardian will classify the three new surfaces as intentional-additions when the May 15 audit fires. The audit fires in 4 days. No explicit pre-flight on the calendar.

---

## 2. Code to cull

### 2A. Legacy v1 archive (~3,841 lines, post-audit cull only)

Until the May 15 drift audit settles whether it audits v1 or v2, do **not** delete legacy. Once settled, single commit:

- `components/views/views-1.tsx` (399 lines)
- `components/views/views-2.tsx` (183 lines)
- `components/views/views-3.tsx` (301 lines)
- `components/views/views-meta.tsx` (166 lines)
- `components/views/views-new.tsx` (956 lines)
- `components/views/views-oc.tsx` (388 lines)
- `components/shell.tsx` (337 lines, root-level legacy — distinct from `components/v2/shell.tsx`)
- `components/icons.tsx` (176 lines, root-level legacy — distinct from `components/v2/icons.tsx`)
- `components/tweaks-panel.tsx` (403 lines)
- `app/styles/styles.css` (532 lines)

Sanity: `lib/data.ts`, `app/styles/v2.css`, `components/v2/*` and `app/styles/{tokens,detail}.css` stay. Verified via grep that no v2-mounted file imports from `components/views/*` or root-level `components/{shell,icons,tweaks-panel}`.

### 2B. Dead exports in `lib/data.ts` (~150 lines, pilot-safe to drop now)

Confirmed unreferenced by anything in `app/`, `lib/`, or `components/v2/`:

- `Member` type (lines 5–11) — only used inside `ENGAGEMENT`
- `ENGAGEMENT` const (lines 13–27)
- `SPRINTS` (lines 36–41) — only `ACTIVE_SPRINT` references it
- `ACTIVE_SPRINT` (lines 43–46)
- `SPRINT_PLAN_BACKLOG` (lines 233–244)
- `DOC_TREE` (lines 276–287)
- `DOCUMENTS` (lines 289–306)
- `SMART_QUEUE` (lines 337–347)
- `FINDING_INDEX` (lines 623–629)

Caveats: `AUTOPILOT_RUNS` IS used (`pages.tsx::AutopilotPage`). `INNER_SOURCE` IS used (`detail.tsx`). `OC_DATA` IS used (`detail.tsx`). Don't drop those.

If the cull happens, also drop the legacy v1 files first — several of these exports (DOCUMENTS, SMART_QUEUE, DOC_TREE) ARE referenced by `components/views/views-*.tsx`, and dropping them while v1 still builds will break the typecheck.

### 2C. Dead patterns in mounted v2

- **`OC_INDEX_FALLBACK` in `detail.tsx` (lines 204–211)** — `ocIndex()` returns it only if `OC_INDEX` is empty/undefined; `OC_INDEX` always has 12 rows. Unreachable.
- **`void cap;` (`detail.tsx:899`) and `void dense;` (`detail.tsx:322`)** — explicit unused-prop suppressions. Not real dead code; ugly but intentional. Remove the props instead, or leave.
- **Hardcoded demo date `"Fri May 9"` in `home.tsx::parseSprint` fallback (line 99 + 107)** — was timely on 2026-05-04, stale today. Move to a `MOCK_NOW`/`DEMO_DATES` const or compute from `currentProject.sprint`.
- **`buildLogFor` in `pages.tsx:573–589`** — generates fake autopilot log lines from RUNS. Fine, but the timestamp `"[15:42:08]"` is hardcoded to a single value across every line. Visible in the autopilot pane. Cosmetic; replace or remove.

---

## 3. MVP scope for pilot (chief-architect lens)

### Must-have (Stance A)

1. Vercel preview + production deploy. Pilot URL the user can share.
2. Error boundary (`app/error.tsx`) + 404 (`app/not-found.tsx`) + loading (`app/loading.tsx`).
3. Theme-flash fix (inline script in layout.tsx that applies `theme-light` from localStorage before first paint).
4. Security headers in `next.config.ts` (CSP report-only, X-Frame-Options DENY, Permissions-Policy minimal).
5. Stale-README fix (drop `public/proto/` references; `docs-leader` owns).
6. Pre-audit drift sign-off — design-fidelity-guardian explicitly classifies the three new surfaces (kanban, gantt, config-fields table) as toolkit-original before May 15.
7. Locked localStorage schema, documented in `shell.tsx`. Decide once whether review-state is per-engagement or global; today it's per-engagement for `v2.cfg.*`, global for `v2.theme`/`v2.mywork.view`.
8. Drop the 9 dead exports in `lib/data.ts` (depends on legacy v1 archive being culled first, see §2B).

### Should-have

9. Wire ⌘K search to actually filter PORTFOLIO + DRCS + OC_INDEX + WORKSHOPS in-memory.
10. Decision detail surface (#decisions/<id>). Single biggest user-side gap per BACKLOG and product-owner.
11. Replace "Connected sources: All connected" lie with honest "Demo · not wired" pill.
12. Vercel Web Analytics + a tiny route-change ping (no PII).
13. Make second engagement (Western Illinois OR CSU East Bay) at least believable — even one capability + one DRC + one OC indexed, so the project switcher stops lying.

### Could-have

14. Real keyboard shortcuts (`g h`, `g d`, `g w`, `?` cheatsheet) on top of v2 routes.
15. Test-engineer's bootstrap: vitest + a single Playwright spec for the kanban toggle and gantt render.
16. Engagement-scoped data isolation — `lib/data/<engagementId>/` runtime selector. (This is L; only if pilot signal demands multi-engagement honesty.)
17. Split `detail.tsx` into 3-4 files. Post-audit only.

### Explicitly NOT pilot

- Auth, real persistence, real Jira/Smartsheet/autopilot integrations, RBAC.
- Tailwind, UI kits, state libraries, animation libraries.
- Active-playbook-style capability roadmap.
- DnD reordering on the kanban.
- Three-state DRC review.

---

## 4. Concrete work items, sequenced

### Sprint A — pre-pilot hygiene · 2026-05-11 → 05-15

| ID | Owner | Size | Bucket | Item |
|---|---|---|---|---|
| A1 | release-manager | S | must | `vercel link` + first preview deploy + production URL |
| A2 | lead-developer | S | must | Add `app/error.tsx`, `app/not-found.tsx`, `app/loading.tsx` (minimal, themed) |
| A3 | docs-leader | S | must | README fix (drop `public/proto/`; reflect detail.css + new surfaces) |
| A4 | design-fidelity-guardian | M | must | May 15 audit pre-flight — explicit toolkit-original classification of kanban / gantt / config-fields |
| A5 | lead-developer | S | must | Theme-flash fix (inline script in layout.tsx) |

### Sprint B — pilot must-have · 2026-05-18 → 05-22

| ID | Owner | Size | Bucket | Item |
|---|---|---|---|---|
| B1 | release-manager | S | must | Security headers in `next.config.ts` (CSP report-only, X-Frame-Options, Permissions-Policy) |
| B2 | lead-developer | S | must | Lock + document localStorage key schema in shell.tsx; rename `v2.cfg.*` to match the planned `v2.fieldReview.*` if we want consistency, or vice versa |
| B3 | lead-developer | S | must | Cull confirmed-dead `lib/data.ts` exports (after legacy v1 archive cull, A6) |
| B4 | release-manager | S | must | (A6) Cull legacy v1 archive — `components/views/*`, `components/{shell,icons,tweaks-panel}.tsx`, `app/styles/styles.css` (~3,841 lines). Single commit. Post-audit. |

### Sprint C — pilot should-have · 2026-05-25 onward

| ID | Owner | Size | Bucket | Item |
|---|---|---|---|---|
| C1 | lead-developer | M | should | Wire ⌘K search to in-memory filter (PORTFOLIO + DRCS + OC_INDEX + WORKSHOPS) |
| C2 | lead-developer | M | should | Decision detail surface — `#decisions/<id>` route + side-panel or page |
| C3 | methodology-guru | S | should | Honest "demo · not wired" pill on Settings · Connected sources |
| C4 | lead-developer | S | should | Vercel Web Analytics on; route-change ping (event = `route`, no PII) |
| C5 | methodology-guru | M | should | Populate one second-engagement (WIU OR CSU) with believable BC + DRC + OC + WORKSHOP data so the switcher stops lying |
| C6 | methodology-guru | S | should | Replace heuristic `drcsForCap` joins with explicit `capabilityId` field on DRCS rows; same for `parseSprint` → typed sprint fields on PORTFOLIO |

### Sprint D — pilot could-have · post-pilot signal

| ID | Owner | Size | Bucket | Item |
|---|---|---|---|---|
| D1 | lead-developer | S | could | g-prefix keyboard shortcuts + `?` cheatsheet overlay |
| D2 | test-engineer | L | could | vitest + Playwright bootstrap; smoke spec for kanban toggle + gantt render + theme toggle |
| D3 | lead-developer | M | could | Split `detail.tsx` (1,594 lines) into 3-4 files: capability page, guide page, primitives, types |
| D4 | release-manager | S | could | GitHub Action: typecheck + smoke on push (pre-merge) |
| D5 | chief-architect | L | could | Engagement-scoped data isolation (`lib/data/<engagementId>/`) — only if pilot signal demands multi-engagement honesty |

---

## 5. Risks the team should know

| ID | Risk | Severity | Mitigation owner |
|---|---|---|---|
| R1 | **Pilot scope drift to "real product."** Janet asking for "real persistence" or "let me share with my client" pulls Stance A → Stance B/C. Months of work. Hold the line. | high | chief-architect + product-manager |
| R2 | **localStorage cross-user / cross-session leakage** on a shared pilot URL. If a consultant + a client share a browser, review flags persist. | medium | lead-developer (move review state to sessionStorage, OR document explicitly) |
| R3 | **`detail.tsx` at 1,594 lines** — touching it for pilot work risks parity bugs. Treat as frozen until post-audit cull. | medium | lead-developer + design-fidelity-guardian |
| R4 | **May 15 drift audit fires in 4 days** with three new toolkit-original surfaces. Without explicit classification, audit produces noise that obscures real drift. | high | design-fidelity-guardian |
| R5 | **No error boundary.** A single render exception blanks the SPA mid-demo. | high | lead-developer (A2) |
| R6 | **Hardcoded "Janet Hawkins"/"JH" in 7+ places.** Pilot must explicitly be "Janet's seat" — not "any consultant's seat" — or this lies. | low | product-manager (decide stance), lead-developer (consolidate to a single CURRENT_USER const if needed) |
| R7 | **8 PORTFOLIO engagements but only NSU has data.** Switcher works; data behind it doesn't. | medium | methodology-guru (C5) |
| R8 | **No CI gate on push.** Local-only smoke. Easy to land a typecheck regression mid-pilot. | low | release-manager (D4) |
| R9 | **Hardcoded demo dates** (`"Fri May 9"` in home.tsx; `"15:42:08]"` in autopilot logs; `GANTT_TODAY = May 1`) will read stale during the pilot window. | low | lead-developer (small cleanup) |

---

## 6. Open questions for the user

1. **What does "production pilot" mean concretely?**
   - (a) Hosted Vercel demo, single-tenant NSU mock data, real consultants click and react.
   - (b) Prototype with a thin real backend (DB + auth) so multi-user shared state works.
   - (c) Something between.
   I recommend **(a)**. If the user wants (b), this is a real architectural pivot — pause May 15 audit, replan May–June.

2. **How many consultants will use it during the pilot?** One (Janet only) → Stance A is fine. Five (a delivery team) → still A but R6 becomes real. Twenty+ → Stance A breaks down on the lying-data problem; need at minimum (b).

3. **Single engagement (NSU) or multi-engagement (the 8 in PORTFOLIO)?** Drives whether C5 ("populate a second engagement") is must-have or nice-to-have.

4. **Is the May 15 drift audit still firing as scheduled, given the three new toolkit-original surfaces shipped today?** If yes, design-fidelity-guardian needs explicit pre-flight today/tomorrow (A4). If we're punting the audit because of the toolkit-original additions, that needs to be a deliberate call.

5. **Vercel deploy — preview only or production?** Preview = per-commit URLs. Production = stable URL for sharing. Pilot wants stable. Recommend production from the first deploy.

6. **Is there a real Ellucian-side timeline for pilot start?** "Ready for pilot" means very different things if the user means "by end of May" vs "by end of Q3."

---

**Synthesis hooks for cross-team plan**

When the other agents' inputs land, expect convergence on:

- **A1 (Vercel deploy)** is universal — release-manager, product-manager, design-fidelity-guardian all need it.
- **A2 (error boundary)** will appear from lead-developer and test-engineer.
- **B1 (security headers)** from release-manager + ai-architect/deployment-expert if they're in the team.
- **C2 (decision detail surface)** from product-owner and product-manager — biggest user-side gap.
- **C5 (second engagement data)** from methodology-guru + product-owner.

Expect conflict on:

- **detail.tsx split (D3) vs. parity freeze.** lead-developer will want to refactor; design-fidelity-guardian will want to freeze. My call: post-audit only.
- **Test bootstrap (D2) vs. simplicity guardrail.** test-engineer will push hard; chief-architect call is "could-have" for pilot.
- **Pilot stance (Q1).** product-owner will push for (b) ("Janet wants persistence"); chief-architect holds at (a) until pilot signal earns the next stance.
