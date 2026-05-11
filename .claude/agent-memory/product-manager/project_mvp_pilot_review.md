---
name: MVP pilot review — production pilot scope call
description: Full PM scope, sequencing, cull, and open-questions analysis for taking the v2 prototype to a production pilot.
type: project
---

**Date:** 2026-05-11

---

## 1. Current-state findings

**What's good:**
- 14 routes wired; v2 shell, navigation, and theme toggle work cleanly.
- Practice home (portfolio brief) is genuinely useful — cross-engagement awareness at a glance.
- MyWork buckets/board toggle (Sprint 1 just shipped) is the most "consultant-daily-driver" surface.
- Decision tracker renders priority/severity/staleness correctly; the sort logic is sound.
- SOATERM OC guide is the standout screen — config fields, DRC links, section nav, Autopilot findings panel all work.
- Schedule gantt (Sprint 1) renders milestone types, go-live swim lanes, today marker — presentable.
- Settings (theme + launch screen via localStorage) works and is small-scope.

**What's broken/missing for a real pilot:**
- Only 1 of 12 OC guides (SOATERM) has config field data. The other 11 render an empty-state table — this breaks the core value prop if any guide besides SOATERM is visited.
- AI page (`#ai`) is a textarea + disabled "Ask" button. It does nothing. A pilot user who clicks it will lose trust in the whole product.
- Autopilot page (`#autopilot`) is 100% mock data with no real integration path. "Run on commit" and "Re-run baseline" buttons do nothing (they have no `onClick` handler beyond UI rendering).
- Every DRC row, task row, and workshop card fires `notImplemented()` toast on click — pilot users can't drill into anything.
- Vercel is NOT linked. There is no stable URL to share with pilot users. This is a showstopper.
- NSU mock data is hardcoded in `lib/data.ts`. There is no mechanism for a real consultant to point this at their engagement. This limits the pilot to a structured demo, not independent use.
- `GANTT_TODAY` is hardcoded as May 1 — will drift relative to real date during pilot.
- No error boundaries. A bad hash or missing `capId`/`ocId` likely renders a blank area, not a graceful fallback.

---

## 2. Extraneous code to cull

**Legacy v1 surface (keep through May 15 drift audit; cull after):**
- `components/views/views-1.tsx`
- `components/views/views-2.tsx`
- `components/views/views-3.tsx`
- `components/views/views-new.tsx`
- `components/views/views-oc.tsx`
- `components/views/views-meta.tsx`
- `components/shell.tsx` (root-level, v1 version)
- `components/icons.tsx` (root-level, v1 version)
- `components/tweaks-panel.tsx`
- `app/styles/styles.css`
- None of these are imported by any mounted surface. Together they are ~2,000+ lines of dead code. Do NOT remove before May 15 — the drift audit uses them as the parity baseline.

**In lib/data.ts:**
- `FINDING_INDEX` (lines 623–629) is used only in `detail.tsx` for autopilot finding → guide anchor link logic. Keep for now — it's small and wired.
- No other obvious dead exports. `school-brands.ts` is used in shell.tsx for the project switcher logos — keep.

**In mounted v2:**
- `AskPage` (`pages.tsx` lines 513–567): the disabled-button textarea is actively misleading. Either replace with a "coming soon" state or gate behind a feature flag before any pilot user session.
- `AutopilotPage` buttons "Re-run baseline" and "Run on commit" have no `onClick` on the button elements (just render). They are dead affordances. Either wire them to `notImplemented()` or remove.

---

## 3. MVP scope for pilot

**Constraint clarification (open question — see §6):** The answer depends on whether "pilot" means:
- (A) A structured walkthrough/demo for a stakeholder using NSU mock data, OR
- (B) Real consultants using the tool independently on their actual engagement.

Case A raises the bar by ~20%. Case B raises it by ~300% (data portability becomes a must). This analysis assumes Case A (demo-ready with real consultants watching, not self-serve).

### Must-have (pilot cannot start without these)

| # | Item | Why |
|---|------|-----|
| M1 | Vercel deploy — stable preview URL | No URL = no pilot |
| M2 | AI page → honest "coming soon" state | Disabled textarea is trust-negative; replace with a clear "not yet" |
| M3 | Error boundary for `#guides/:ocId` and `#capabilities/:capId` | Missing IDs currently render nothing |
| M4 | At least 2 additional OCs with config fields (SPAIDEN minimum; one Finance OC) | If demo touches any OC besides SOATERM, the guide is empty — kills the core value prop |

### Should-have (embarrassing to ship without)

| # | Item | Why |
|---|------|-----|
| S1 | DRC rows: link to the relevant guide for DRCs with known `ocId` | The product promises this link; currently it's a toast |
| S2 | `GANTT_TODAY` driven by `new Date()` (computed, not hardcoded) | Hardcoded May 1 is already wrong today |
| S3 | Autopilot "Run on commit" / "Re-run baseline" → `notImplemented()` toast | Dead affordances confuse; a toast signals prototype |
| S4 | README updated with pilot onboarding (what it is, what it's not, how to navigate) | Pilot users should have written context |

### Could-have (nice, cuttable)

| # | Item | Why |
|---|------|-----|
| C1 | All 12 OC guides with config fields | Big effort (methodology-guru + lead-developer); SOATERM + 2–3 more is sufficient for a first pass |
| C2 | Workshop detail: inline expansion instead of toast | Useful but workshops is a secondary surface |
| C3 | Capability detail: DRC drawer or modal for DRC rows | Currently toasts; could inline-expand |
| C4 | Settings: consultant name / engagement label (localStorage) | Small personal touch; makes demo feel real-use |

### Out of scope (post-pilot, explicitly)

- Real AI integration (`#ai` route)
- Real Autopilot integration (live Banner instance, commit triggers)
- Data portability (swapping NSU for a real engagement)
- Multi-user state, persistence beyond localStorage
- Drag-and-drop kanban
- Server-side rendering of OC guide content
- Playwright or Vitest test suite (smoke gate is sufficient pre-pilot)

### Route survival decision

| Route | Verdict | Rationale |
|-------|---------|-----------|
| `#home` / practice | **Must** | Primary daily-driver surface |
| `#project` | **Must** | NSU project detail, sprint status, team |
| `#mywork` | **Must** | Core Janet workflow; just shipped buckets+board |
| `#decisions` | **Must** | DRC tracker is a key value prop |
| `#guides` | **Must** | OC index |
| `#guides/:ocId` | **Must** | SOATERM is the showcase; 2–3 more needed |
| `#capabilities` | **Must** | Grid of 12 capabilities; navigation hub |
| `#capabilities/:capId` | **Should** | Detail with OC links; SOATERM is solid |
| `#schedule` | **Should** | Gantt just shipped; visible and presentable |
| `#workshops` | **Should** | Context for upcoming sessions |
| `#library` | **Could** | Methodology cards; no interaction needed |
| `#settings` | **Could** | Theme + launch; small and working |
| `#ai` | **Must-replace** | Replace stub with honest "coming soon" |
| `#autopilot` | **Post-pilot** | Visually impressive but 100% fake; demote or gate |

---

## 4. Concrete work items (sequenced)

Gate: May 15 drift audit is 4 days away. Only M1 (Vercel) is safe to start now; all UI changes should wait until post-audit unless they are isolated non-visual fixes.

### Pre-audit window (now → May 14)

| Item | Size | Owner | Bucket |
|------|------|-------|--------|
| Vercel link + preview deploy | S | release-manager | Must |
| `GANTT_TODAY` → computed from `new Date()` | S | lead-developer | Should |
| Autopilot dead buttons → `notImplemented()` | S | lead-developer | Should |

### Post-audit sprint (May 15+)

| # | Item | Size | Owner | Bucket |
|---|------|------|-------|--------|
| 1 | AI page → "coming soon" state (honest, with expected timeline copy) | S | lead-developer | Must |
| 2 | Error boundary for `#guides/:ocId` and `#capabilities/:capId` | S | lead-developer | Must |
| 3 | SPAIDEN OC guide: config fields + section data | M | methodology-guru → lead-developer | Must |
| 4 | One Finance OC (FGAC or FTMTITLE) with config fields | M | methodology-guru → lead-developer | Must |
| 5 | DRC rows: navigate to `#guides/:ocId` for resolved `ocId` mappings | S | lead-developer | Should |
| 6 | README: pilot onboarding section | S | docs-leader | Should |
| 7 | v1 legacy cull: remove `components/views/`, root-level `components/shell.tsx`, `components/icons.tsx`, `components/tweaks-panel.tsx`, `app/styles/styles.css` | S | lead-developer | Could (post-audit housekeeping) |
| 8 | 3–4 more OC config field tables (complete the 12-OC set) | L | methodology-guru → lead-developer | Could |
| 9 | Autopilot: demote in nav (add "(preview)" label or move to bottom) | S | lead-developer | Could |

---

## 5. Risks

1. **Pilot date is unknown.** If the pilot is before May 15, the drift audit and code improvements are in direct conflict. Need a date now.
2. **OC guide hollowness.** SOATERM is 1 of 12. If a pilot user navigates to any other guide, they see an empty table. This will happen. Plan for at least 2–3 populated guides before any pilot session.
3. **AI stub trust-kill.** A prototype that shows an "Ask" button that does nothing trains users not to trust the tool. Fix this before the first pilot session — even a static mock response is better than a dead button.
4. **Mock data lock-in.** If "production pilot" means self-serve by a consultant on their own engagement (not NSU), this prototype cannot serve that use case at all. No data layer, no API, no portability. This must be surfaced and decided now.
5. **Vercel not linked.** No deploy URL means pilot participants must run the prototype locally. That is not a pilot — that is developer access. Vercel deploy is the first task.
6. **Post-audit cull window.** Legacy v1 in tree is ~2,000 lines of unmounted dead code. It is a maintenance cost and a distraction during active development. Remove immediately post-audit.
7. **GANTT_TODAY is hardcoded to May 1.** It is now May 11. The "today" marker on the gantt is wrong. Pilot users will notice.

---

## 6. Open questions for the user

1. **What is the pilot format?** Structured demo (Janet drives, stakeholders watch NSU mock data) or self-serve (real consultants point it at their real engagement)?
2. **When is the pilot?** Before May 15 (drift audit) or after? This controls whether UI changes can land.
3. **Who are the pilot users?** How many consultants, which practice (ERP/SaaS/on-prem), what engagement tier?
4. **Is the AI assistant real?** Is there a real LLM behind `#ai`, or is this feature post-pilot? If post-pilot, the stub needs an honest "coming soon" treatment.
5. **Is Autopilot real?** Does a live Banner validation pipeline exist (e.g., via n2s-heear-editor), or is it a future-state concept? Pilot participants will ask.
6. **Real or mock data?** If real data, data portability is a must-have — currently impossible without a rebuild. If mock data, which engagement scenario do pilot participants use?
7. **Success criteria for the pilot?** What does the team need to learn — does the tool help Janet, which screens are used, what's missing?

---

## Why/How to apply

- If pilot date surfaces as pre-May-15: freeze UI; ship only Vercel + GANTT_TODAY fix.
- If pilot date surfaces as post-May-15: execute post-audit sprint items 1–6 in order.
- If pilot is revealed to be self-serve with real data: escalate to chief-architect immediately — data portability is an L/XL architectural problem, not a sprint item.
- Use this doc as the baseline for any pilot-readiness conversation. Revisit only if pilot format, date, or user definition changes.
