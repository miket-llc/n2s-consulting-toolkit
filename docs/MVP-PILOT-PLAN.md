# MVP Pilot Plan — n2s-consulting-toolkit

**Date:** 2026-05-11
**Audit gate:** 2026-05-15 (T-4 days)
**Status:** awaiting user decisions on six load-bearing questions (see §2)
**Synthesis source:** ten parallel agent reviews — full deliverables in `.claude/agent-memory/<agent>/project_mvp_pilot_review.md` for each of chief-architect, product-manager, product-owner, lead-developer, ux-visionary, design-fidelity-guardian, methodology-guru, test-engineer, docs-leader, release-manager.

---

## 1. Executive summary

The prototype has a real working core — Practice home, Project home, MyWork buckets, Decisions, SOATERM Configuration Guide with config-fields + DRC sign-off, Capability detail, and the just-shipped Schedule gantt. A real Banner consultant could use the SOATERM walkthrough on Monday and feel it.

The prototype is **not yet pilot-ready**. The blockers cluster into four buckets:

1. **Operational** — no Vercel link, no CI, no error boundary, `lib/school-brands.ts` untracked (build breaks on clean clone).
2. **Content** — 11 of 12 OC guides are stubs; six Banner schema/form-name errors in `lib/data.ts` would be caught by any working consultant in 30 seconds.
3. **Wiring** — Project Home capability cards land on the index instead of detail; DRC rows fire toasts instead of navigating to the section that raised them; AskPage and Autopilot have dead buttons.
4. **Polish** — undefined `--surface-1/-2` tokens break Autopilot in both themes; dark-only `.d-code` blocks make Configuration Guide unreadable in light mode (the default); no focus-visible rings.

None of these are large. Together they are roughly **two sprints of disciplined work** — Sprint A pre-audit (May 11–15), Sprint B post-audit (May 18–22), with a third sprint to populate two more OC guides and polish for the real pilot session.

**Recommended pilot stance (per chief-architect, endorsed by product-manager and product-owner):** **hosted hi-fi demo on Vercel with mock data**, single-tenant on the NSU engagement, single consultant driver (Janet) with stakeholders watching. Pilot is to learn whether the UX shape is right, not to replace live tooling. "Real persistence" or "multi-engagement isolation" is a separate pivot (months of work) — flag if user actually wants that, because it changes everything.

---

## 2. Open questions the user must answer before sprint A can finalize

These are the questions that flip the plan. Resolve before Sprint A close (May 15) at the latest.

| # | Question | Why it flips the plan | Default if no answer |
|---|---|---|---|
| Q1 | **Pilot stance: A (hosted demo, mock data) / B (prototype + backend) / C (real product)?** | A is days; B is weeks; C is months. | A. |
| Q2 | **Pilot date.** Before or after May 15? | Before = freeze the audit until after pilot; after = audit fires as planned. | After May 15. |
| Q3 | **Pilot users.** One Janet-style demo? 3–5 consultants self-serving? More? | Drives whether engagement-scoped isolation (R8 in this doc) is must vs. nice. | 1 driver + ≤5 watchers, structured. |
| Q4 | **Re-anchor drift baseline?** Delete `components/views/*` + root-level v1 + `app/styles/styles.css` and treat v2 as the only baseline? | Removes 3,800–4,300 lines of dead weight; simplifies audit forever. | Yes, post-audit. |
| Q5 | **Pilot URL.** `n2s-consulting-toolkit.vercel.app` (free, immediate) or a custom Ellucian-branded domain (24–48h DNS)? | DNS lead-time blocks production promote. | Vercel subdomain. |
| Q6 | **AskPage future.** Real LLM backend coming or "coming soon" forever? | Determines whether AskPage is must-replace before pilot or just must-honestly-stub. | "Coming soon" stub for pilot. |

Secondary questions (each agent surfaced more — all logged in their memory files):

- Banner-only or Banner + Colleague? `PORTFOLIO` includes Lafayette (Colleague) — methodology-guru flags this materially affects OC content.
- HR go-live (May 24) the anchor for pilot? If yes, NBAPOSN + PTREARN content is urgent this week.
- Demo data label — explicit "Demo data · not connected to live systems" on Settings? Product-owner strongly requests.

---

## 3. Convergent findings (≥3 agents agreed)

| # | Finding | Agents |
|---|---|---|
| C1 | No Vercel deploy URL — pilot can't exist without one | release-manager, chief-architect, product-manager |
| C2 | No error boundary — single render exception blanks the SPA | chief-architect, lead-developer, product-manager, ux-visionary (less directly) |
| C3 | `lib/school-brands.ts` untracked — build breaks on clean clone | lead-developer, release-manager |
| C4 | 11 of 12 OC guides empty — demo-fatal | product-owner, product-manager, methodology-guru, design-fidelity-guardian |
| C5 | Cull v1 legacy archive (~3,800–4,300 lines) | chief-architect, lead-developer, design-fidelity-guardian, product-manager (timing disputed) |
| C6 | Dead exports in `lib/data.ts` (~96–150 lines) | chief-architect, lead-developer |
| C7 | README stale — 6 concrete inaccuracies including wrong tarball ID | docs-leader, chief-architect |
| C8 | AskPage is a trust-killer (textarea + disabled button) | product-owner, product-manager |
| C9 | Project Home capability cards collapse to index instead of detail | design-fidelity-guardian, product-owner |
| C10 | DRC rows toast instead of navigating to OC section | product-owner, design-fidelity-guardian |
| C11 | Drift audit fires May 15 — three new toolkit-originals need formal classification | design-fidelity-guardian, chief-architect |
| C12 | Three new surfaces shipped with zero test coverage | test-engineer (alone, but unanimously endorsed elsewhere) |
| C13 | Banner schema/form-name errors in `lib/data.ts` — 6 hard, ~10 soft | methodology-guru (sole authority; others defer) |
| C14 | Undefined `--surface-1`/`--surface-2` tokens — Autopilot visually broken | ux-visionary (sole authority; product-owner endorses Autopilot dead-buttons separately) |
| C15 | Hardcoded `bastardLoopState` field name visible in dev tools | lead-developer (sole authority, P1 embarrassment) |

---

## 4. Pilot stance — recommended definition

Per chief-architect (Stance A), endorsed by product-manager and product-owner. If the user picks B or C, **stop and replan**; this document is invalid for those.

### Stance A — hosted hi-fi demo
- **Where:** Vercel, single static SPA, `*.vercel.app` subdomain (or branded domain post-pilot).
- **Data:** Mock data in `lib/data.ts`, single-tenant on NSU. WIU or CSU populated as a secondary engagement so the project-switcher doesn't lie (per chief-architect C5).
- **Persistence:** localStorage only. Shared URL → per-browser state. Acceptable; document the constraint.
- **Auth:** none. Pilot URL is link-gated, not access-controlled.
- **Telemetry:** Vercel Web Analytics + route-change pings (chief-architect C4).
- **Feedback:** in-app toast → maps to a feedback form (manual collection out of scope; could be a Google Form linked from Settings).
- **What it tests:** does the UX shape match the working consultant's daily rhythm? Are the OC guide + DRC sign-off + ConfigFieldsTable actually faster than the Excel + Jira + DocuSign chain they replace?

### Out of scope for this pilot (would be Stance B+)
- Real Banner / Jira / Smartsheet integration
- Multi-engagement data isolation per pilot user
- Auth (Clerk / SSO)
- Real LLM behind AskPage
- Real autopilot pipeline
- DRC hash legal weight / external decision log
- Persistence across users / sessions / browsers

---

## 5. Plan — three sprints + post-pilot

Sprint owners are the existing agent roster. Sizes XS / S / M / L per industry shorthand. Work items reference each agent's full deliverable (`.claude/agent-memory/<agent>/project_mvp_pilot_review.md`) for full context.

### Sprint A — pre-audit hygiene (2026-05-11 → 2026-05-15) — UI-safe only

The drift audit fires May 15. Anything that materially changes a v2-mounted surface should land *after* audit, not before, to keep the audit clean. Sprint A is therefore restricted to: deploys, error boundaries, dead-button labeling, data corrections (no UI shape change), README, and the audit pre-flight itself.

| # | Owner | Size | Item | Source |
|---|---|---|---|---|
| A1 | release-manager | XS | Commit current session (all uncommitted v2 work, including `lib/school-brands.ts`) | release-manager §4#1, lead-developer #1 |
| A2 | release-manager | S | `vercel link` + first preview deploy | release-manager §4#2–5, chief-architect A1 |
| A3 | release-manager | S | `.vercelignore` excluding `docs/*.xlsx`, `.claude/`, `scripts/` | release-manager §4#3 |
| A4 | release-manager | S | Production promote (`vercel --prod`) → stable pilot URL | release-manager §4#6 |
| A5 | release-manager | S | Bump `package.json` to `0.2.0-pre-audit.1` + create `CHANGELOG.md` + tag | release-manager §4#7–9 |
| A6 | lead-developer | S | Add `app/error.tsx`, `app/not-found.tsx`, `app/loading.tsx` (error boundary + 404 + loading) | chief-architect A2, lead-developer #2, product-manager#5 |
| A7 | lead-developer | XS | Rename `bastardLoopState` → `deliveryStage` everywhere | lead-developer #3 |
| A8 | lead-developer | XS | `.gitignore docs/*.xlsx` and `git rm --cached` | lead-developer #7, docs-leader §2 |
| A9 | lead-developer | XS | `window.location.hash = "mywork"` → `navigate()` in [components/v2/practice.tsx](components/v2/practice.tsx) | lead-developer #9 |
| A10 | lead-developer | S | Theme-flash fix — inline pre-paint script in [app/layout.tsx](app/layout.tsx) reading `localStorage["v2.theme"]` before first render | chief-architect MVP-Must |
| A11 | lead-developer | S | Wire Autopilot dead buttons ("Run on commit" / "Re-run baseline") to `notImplemented()` | product-manager #3, product-owner Autopilot, design-fidelity-guardian |
| A12 | lead-developer | S | Replace AskPage submit button with explicit "Coming soon" state (no disabled button) | product-manager #4, product-owner Ask |
| A13 | lead-developer | S | Settings: replace "All connected" green pill with "Demo data — not connected to live systems" | product-owner Settings, methodology-guru |
| A14 | lead-developer | XS | `GANTT_TODAY` computed from `new Date()` instead of hardcoded May 1 | product-manager #2, lead-developer #5 |
| A15 | docs-leader | S | README fix — route table (3 cells), file structure (`detail.tsx`/`detail.css`), interactions (kanban toggle), tarball ID (`CgM4C5b7mEU63Y2RQISWcw`) | docs-leader §4#1–4, design-fidelity-guardian baseline |
| A16 | docs-leader | S | Update BACKLOG.md — date header, move shipped items out of deferred | docs-leader §4#5 |
| A17 | methodology-guru | S | Fix Banner schema errors in [lib/data.ts](lib/data.ts): `NBRPSN`→`NBAPOSN`, `FTVVEND`→`FTMVEND`, `FINDING_INDEX` STVMAJR/STVRESD selector+label mismatches, DRC-4 OC reference (`RORPRIO`→`SOATERM`/`OC-2.4.1`/`create`), `STVTERM_POT_CODE`/`STVTERM_POT_CENSUS_IND` → `SOBPTRM_PTRM_CODE`/`SOBPTRM_CENSUS_DATE` | methodology-guru §1 |
| A18 | methodology-guru | S | Rewrite `is-6` Inner Source title and re-attribute to Raj Kapoor (Finance lead) | methodology-guru §4 |
| A19 | design-fidelity-guardian | M | May 15 audit pre-flight — write DRIFT-AUDIT-2026-05-15.md classifying drift diffs as intentional/accidental/toolkit-original; gate any v2-mounted change after May 13 EOD | design-fidelity-guardian §1, release-manager §Pre-flight |
| A20 | release-manager | S | Freeze `main` 2026-05-13 EOD; tag `v0.2.0-pre-audit` at audit input SHA | release-manager §Pre-flight |

**Sprint A acceptance:** `pnpm smoke` green. Production URL live. No render exception blanks the app. README and BACKLOG honest. Banner schema accurate. Drift audit fires May 15 against a frozen, deployed, formally-classified baseline.

### Sprint B — post-audit cleanup + pilot-must (2026-05-18 → 2026-05-22)

The audit has fired; v1 archive is now safe to delete. Focus shifts to wiring fixes, dead-code cull, and the two additional OC guides product-owner identified as non-negotiable.

| # | Owner | Size | Item | Source |
|---|---|---|---|---|
| B1 | lead-developer | S | Delete v1 archive in one commit: `components/views/*`, `components/{shell,icons,tweaks-panel}.tsx` (root-level), `app/styles/styles.css` (~3,800–4,300 lines) | chief-architect B3, lead-developer #4, design-fidelity-guardian extraneous |
| B2 | lead-developer | S | Cull dead `lib/data.ts` exports: `Member`, `ENGAGEMENT`, `SPRINTS`, `ACTIVE_SPRINT`, `SPRINT_PLAN_BACKLOG`, `DOC_TREE`, `DOCUMENTS`, `SMART_QUEUE`, `FINDING_INDEX` (~96–150 lines) | chief-architect §2, lead-developer #5 |
| B3 | lead-developer | M | Remove `OC_INDEX_FALLBACK` in [components/v2/detail.tsx](components/v2/detail.tsx) (~10 lines); migrate inline `DETAIL_BY_CAP`/`BUDGET_BY_CAP` (~60 lines) to [lib/data.ts](lib/data.ts) | lead-developer #6 |
| B4 | lead-developer | S | Lock + document localStorage schema in [components/v2/shell.tsx](components/v2/shell.tsx); defensive parse on read | chief-architect B2, test-engineer |
| B5 | lead-developer | S | DRC list click → `#guides/<ocId>` navigation (at least for SOATERM-linked DRCs) | product-owner Decisions, design-fidelity-guardian, product-manager #8 |
| B6 | lead-developer | S | Project Home capability cards → `#capabilities/<id>` (re-wire lost deep-links from tarball comparison) | design-fidelity-guardian §1 pilot blockers, product-owner Project Home |
| B7 | lead-developer | S | Project Home guide rows → `#guides/<id>`; workshop rows → `#workshops/<id>` (toast acceptable for now if no detail route) | design-fidelity-guardian §1 |
| B8 | lead-developer | S | MyWork hero count line ("10 items · 2 urgent") above the toggle | product-owner My Work |
| B9 | methodology-guru → lead-developer | L | Populate SFARCTL OC body — full sections, callouts, fields, ConfigFieldsTable rows | product-owner SFARCTL, product-manager #6, methodology-guru §3 |
| B10 | methodology-guru → lead-developer | L | Populate SPAIDEN OC body — full sections, fields, ConfigFieldsTable rows | product-owner SPAIDEN, product-manager #6, methodology-guru §3 |
| B11 | ux-visionary | S | Define `--surface-1` / `--surface-2` tokens (alias `--bg-panel` / `--bg-elevated`) OR inline-replace 7× usages | ux-visionary §3 must-have |
| B12 | ux-visionary | S | `.theme-light .d-code` override (light-mode code-block background + text + head borders) | ux-visionary §3 must-have |
| B13 | ux-visionary | M | Focus-visible pass — all interactive elements get `outline: 2px solid var(--border-focus); outline-offset: 2px` | ux-visionary §3 must-have, #2 |
| B14 | ux-visionary | S | Gantt dot contrast — `.tone-cyan`/`.tone-rose`/`.tone-ghost` → `color: var(--bg-panel)` for WCAG AA | ux-visionary §3 should-have |
| B15 | ux-visionary | S | `prefers-reduced-motion` block at EOF of [app/styles/v2.css](app/styles/v2.css) | ux-visionary §3 should-have |
| B16 | ux-visionary | S | Cull duplicate rules in [app/styles/detail.css](app/styles/detail.css): `.row`, `.stack`, `.flex-1`, `.btn-link`, `.t-h3`, `.v2-hero-actions` (already in v2.css); dead `.v2-main`/`.v2-section` pairs in v2.css | ux-visionary §2 |
| B17 | release-manager | M | GitHub Actions: `pnpm next build` + `pnpm smoke` on push/PR; branch protection on `main` | release-manager §4#10–11, test-engineer §4#1–3 |
| B18 | test-engineer | M | Bootstrap Playwright: `pnpm add -D @playwright/test`; `playwright.config.ts` (chromium only); 1 smoke spec hitting all 11 routes asserting no JS crash | test-engineer §4#1–4 |
| B19 | docs-leader | M | Write USER_GUIDE.md (or facilitator handoff doc, per Q3 resolution) — what works, what's mock, what's coming | docs-leader §3 should-have |
| B20 | docs-leader | S | ADR: MyWork kanban model (Buckets vs Board, why both); ADR: v2-only drift-audit baseline (post-Q4 resolution) | docs-leader §4#8–9 |

**Sprint B acceptance:** Three OC guides populated (SOATERM + SFARCTL + SPAIDEN). v1 archive deleted. Banner schema clean. No dead code in `lib/data.ts`. UI works in both themes with proper focus rings. CI gates `main`. Playwright smoke passes on every push.

### Sprint C — pilot polish + content (2026-05-25 → 2026-05-31)

Pilot session is presumed for late May / early June. Sprint C closes the consultant-credibility gap.

| # | Owner | Size | Item | Source |
|---|---|---|---|---|
| C1 | methodology-guru → lead-developer | M | Populate NBAPOSN OC body (HR pre-cutover anchor) | methodology-guru §3 |
| C2 | methodology-guru → lead-developer | M | Populate PTREARN OC body | methodology-guru §3 |
| C3 | methodology-guru | S | Remove or visibly-stub Finance/FAA empty OCs from pilot index (FGRGL, FTMVEND, RORPRIO, SHACATQ, SSASECT, STVATTR) — at minimum tag them "Not in pilot scope" | methodology-guru §2, product-owner |
| C4 | methodology-guru | M | Populate WIU or CSU as second engagement (capabilities + DRCs + 1 OC + 1 workshop) so project-switcher doesn't lie | chief-architect C5 |
| C5 | lead-developer | S | Settings: consultant name field (localStorage) replacing hardcoded "Janet Hawkins" / "JH" in 7+ places | chief-architect MVP-Should, lead-developer #5 |
| C6 | lead-developer | M | Wire ⌘K search to in-memory filter (across TASKS/DRCS/OCs/capabilities/workshops/documents) | chief-architect C1, product-owner |
| C7 | lead-developer | M | Decision detail surface — `#decisions/<id>` so DRC rows have a destination | chief-architect C2, product-owner |
| C8 | lead-developer | M | Workshop detail surface — `#workshops/<id>` static read-only (agenda, scope, attendees, last notes) | product-owner Workshops should-have |
| C9 | lead-developer | S | Vercel Web Analytics integration + route-change pings | chief-architect C4, release-manager could-have |
| C10 | release-manager | S | Custom pilot subdomain (DNS + Vercel domain) if user chose branded URL in Q5 | release-manager §4#12 |
| C11 | release-manager | S | Version bump `0.2.0` → `0.2.0` final (drop pre-audit suffix), tag, CHANGELOG entry | release-manager §4 |
| C12 | test-engineer | M | Playwright specs for the three new surfaces: kanban toggle + localStorage, gantt grid, config-fields review-toggle persistence | test-engineer §4#5–6 |
| C13 | test-engineer | M | Hash-routing direct-load test — `page.goto('#schedule')`, `'#guides/soaterm'`, `'#capabilities/bc-curriculum'` | test-engineer §4#8 |
| C14 | docs-leader | S | Pilot demo script (if facilitated) — 15-min walk: Practice → Project → MyWork → SOATERM guide → DRC sign-off | docs-leader §3 could-have, product-owner |
| C15 | ux-visionary | XS | Board card `border-radius: 8px` → `var(--radius-md)`; `.v2-gantt-readinessbarfill` add `border-radius: 4px`; `.btn-primary { color: #fff }` → `var(--text-inverse)` | ux-visionary §3 could-have |
| C16 | product-owner (review) | M | Pilot rehearsal — Janet-eyes walk-through; sign off or veto per route | product-owner |

**Sprint C acceptance:** 5+ OCs populated. Two engagements have credible data. Decision + Workshop detail surfaces live. ⌘K works. Real consultant can walk the demo end-to-end without hitting an embarrassing stub or silent failure.

### Post-pilot — observe and iterate

| # | Owner | Item |
|---|---|---|
| D1 | product-manager | Collect feedback signal from pilot — what surfaces did consultants reach for, what was missed |
| D2 | chief-architect | Replan based on feedback. Earned-stance question: do we evolve to Stance B (real backend) or hold at hosted-demo? |
| D3 | lead-developer | Split [components/v2/detail.tsx](components/v2/detail.tsx) (1,594 lines) into surfaces if pilot signal supports further investment |
| D4 | test-engineer | Expand to unit tests for any algorithmic logic that emerges (brief composer, smart-queue ranking if revived) |
| D5 | methodology-guru | Continue OC body population per priority — STVATTR, SSASECT, the rest of Finance/FAA |
| D6 | ux-visionary | Density toggle if pilot consultants ask for it; serif-font resurrection per the chat7 leftover |

---

## 6. Cull catalog — consolidated

Files / exports / patterns to remove. Bundled by sprint so the cleanup commits read clean.

### Sprint A (pre-audit, surgical only)
- `lib/school-brands.ts` — **commit, don't delete** (lead-developer #1)
- `docs/NN Ellucian Student Banner Signature Project Plan (1).xlsx` — `.gitignore` + `git rm --cached` (lead-developer #7)

### Sprint B (post-audit, single commit)
- `components/views/views-1.tsx` (~399 lines)
- `components/views/views-2.tsx` (~183 lines)
- `components/views/views-3.tsx` (~301 lines)
- `components/views/views-meta.tsx` (~166 lines)
- `components/views/views-new.tsx` (~956 lines)
- `components/views/views-oc.tsx` (~388 lines)
- `components/shell.tsx` (root-level, ~337 lines)
- `components/icons.tsx` (root-level, ~176 lines)
- `components/tweaks-panel.tsx` (~403 lines)
- `app/styles/styles.css` (~532 lines)
- **Total: ~3,841 lines.** Single commit. Verified no v2 imports.

Dead exports in [lib/data.ts](lib/data.ts) (drop after the v1 commit):
- `Member` (5–11)
- `ENGAGEMENT` (13–27)
- `SPRINTS` (36–41)
- `ACTIVE_SPRINT` (43–46)
- `SPRINT_PLAN_BACKLOG` (233–244)
- `DOC_TREE` (276–287)
- `DOCUMENTS` (289–306)
- `SMART_QUEUE` (337–347)
- `FINDING_INDEX` (623–629)

Dead patterns in mounted v2:
- `OC_INDEX_FALLBACK` in [components/v2/detail.tsx](components/v2/detail.tsx) lines 204–211 — unreachable

Duplicate CSS rules in [app/styles/detail.css](app/styles/detail.css):
- `.row`, `.stack`, `.flex-1` (598–606) — already in v2.css
- `.btn-link` (607–612) — already in v2.css (different props → specificity fight)
- `.t-h3` (492) — conflicts with v2.css density value
- `.v2-hero-actions` (615) — already in v2.css

Dead CSS in [app/styles/v2.css](app/styles/v2.css):
- `.v2-main` padding block (179–183) — overridden line 184
- `.v2-section` + `.v2-section-head` (662–667) — overridden 668–669
- `.internals*` no-ops (51–53)

### Sprint C (content cull)
- Empty OCs from pilot index — see C3 above

---

## 7. Risk register — consolidated

| # | Risk | Severity | Mitigated by |
|---|---|---|---|
| R1 | Pilot scope drift to Stance B/C | HIGH | Q1 answered before Sprint A close |
| R2 | May 15 drift audit fires against unsigned baseline | HIGH | A19, A20 |
| R3 | No error boundary → blank app mid-demo | HIGH | A6 |
| R4 | Banner schema errors caught by any real consultant | HIGH | A17 |
| R5 | 11 empty OCs → Day-1 abandonment | HIGH | B9, B10, C1, C2, C3 |
| R6 | `lib/school-brands.ts` untracked → broken build on clone | HIGH | A1 |
| R7 | AskPage dead button → trust kill on first interaction | MEDIUM | A12 |
| R8 | localStorage cross-session/cross-user leakage on shared URL | MEDIUM | B4 documents; full fix is Stance B |
| R9 | Hardcoded "Janet Hawkins" / "JH" in 7+ places | MEDIUM | C5 |
| R10 | `bastardLoopState` field name in dev tools | MEDIUM | A7 |
| R11 | Light-mode `.d-code` blocks unreadable | MEDIUM | B12 |
| R12 | Undefined `--surface-1`/`--surface-2` tokens → Autopilot broken | MEDIUM | B11 |
| R13 | No focus-visible rings — WCAG AA fail | MEDIUM | B13 |
| R14 | Project Home capability cards lost deep-link | MEDIUM | B6 |
| R15 | Three new surfaces have zero test coverage | MEDIUM | B18, C12 |
| R16 | No rollback target on first deploy | MEDIUM | A2 (preview validation before A4 promote) |
| R17 | Hardcoded `GANTT_TODAY` = May 1 (already 10 days stale) | LOW | A14 |
| R18 | Inner-source pattern attribution mismatched | LOW | A18 |
| R19 | `dangerouslySetInnerHTML` on OC body strings (low risk now, high risk when real pipelines plug in) | LOW now / HIGH later | B (comment); post-pilot DOMPurify |
| R20 | Index-as-key in maps (callouts, steps, gantt months, etc.) | LOW | Post-pilot |

---

## 8. Agent ownership matrix

| Item bucket | Primary owner | Backstop |
|---|---|---|
| Deploys, version, CI, branching | release-manager | chief-architect |
| TSX/CSS/TS implementation | lead-developer | ux-visionary (style), methodology-guru (content) |
| Visual quality, theme parity, a11y | ux-visionary | lead-developer |
| Drift baseline, audit | design-fidelity-guardian | chief-architect |
| Banner/Ellucian content accuracy | methodology-guru | product-owner |
| Test stack, CI gating | test-engineer | release-manager |
| README, BACKLOG, ADRs, USER_GUIDE | docs-leader | chief-architect |
| Scope cuts, sequencing, "is this MVP?" | product-manager | chief-architect |
| User-side veto/endorsement | product-owner | product-manager |
| Cross-cutting calls, agent disputes | chief-architect | — (final authority) |

---

## 9. What we are deliberately NOT doing for this pilot

These have been raised, considered, and explicitly deferred. Each has an owner and a re-evaluation trigger.

| Item | Why deferred | Re-eval trigger |
|---|---|---|
| Drag-and-drop kanban | Janet veto — Jira already does this | Pilot signal |
| Three-state DRC review (flagged + flag notes) | Two states sufficient for pilot signal | Pilot signal |
| Real persistence / backend / auth | Stance B is months of work; pilot is to learn first | Q1 flip |
| Multi-engagement data isolation | Pilot is single-tenant on NSU + WIU/CSU | Q3 flip ≥ 5 self-serve users |
| Real LLM behind AskPage | "Coming soon" is honest; LLM is a separate product call | Q6 flip |
| Real autopilot pipeline | Mock is sufficient to test UX shape | Pilot signal |
| Active-playbook capability-roadmap card view | Gantt is enough for pilot timeline | Post-pilot if requested |
| Density toggle / Tweaks panel | Single density acceptable | Pilot signal |
| Serif-font resurrection (Source Serif 4) | Chat7 leftover; not pilot-critical | Post-pilot |
| Capability inventory expansion to ~30 | Brief §2 calls for curated 12 | Never (per brief) |
| `detail.tsx` split (1,594 lines → ~3 files) | Touch-risk during audit; post-pilot refactor | Post-pilot |
| Vitest unit tests | TypeScript catches the algorithmically-thin runtime; Playwright has all signal | When algorithmic logic lands |
| Per-capability kanban inside Delivery tab | Cross-engagement kanban in MyWork covers Janet's queue need | Pilot signal |
| `xlsxRowIds` on capabilities for budget reconciliation | Mock budget tab works without it | Real xlsx-source plumbing |
| DRC tamper-evident hash with legal weight | Mock hash is a UX placeholder | Stance B+ |

---

## 10. Synthesis hooks — known conflicts and how they resolve

The agents' deliverables converged on most items but disagreed on a few. Resolutions here are author-of-this-document calls; user can override on any.

| Conflict | Agents | Resolution |
|---|---|---|
| Cull v1 archive — when? | chief-architect (post-audit) vs lead-developer (pre) vs design-fidelity-guardian (pre as part of re-anchor) vs product-manager (post May 15) | **Post-audit** — Sprint B1. Removes 3,841 lines but only after the audit baseline is signed. Pending Q4. |
| Remove MyWork Board view? | product-owner (yes, "noise / duplicate of Jira") vs the just-shipped feature (no, user explicitly chose `toggle_in_mywork` 1h ago) | **Keep, defer veto.** Pilot signal decides. If Janet never clicks Board in pilot, cut post-pilot. |
| Pilot stance | All converge on A | A. Confirm with user. |
| Audit gate — same as pilot gate? | release-manager and design-fidelity-guardian both ask | **Different gates.** Audit fires May 15 against current state + classifications. Pilot ships post-audit on Sprint C cadence. |
| `detail.tsx` split | chief-architect (post-audit, post-pilot) vs lead-developer (low priority) | **Post-pilot.** D3. |
| Where lives the USER_GUIDE? | docs-leader floats both options | **Decide after Q3.** Self-serve pilot → USER_GUIDE.md; facilitated → demo script + brief facilitator notes. |

---

## 11. Calendar — what happens when

```
2026-05-11 (today)  Plan delivered. User answers Q1–Q6 by end of day or Sprint A starts on defaults.
2026-05-12          Sprint A starts. A1–A4 (deploy), A6 (error boundary), A17 (Banner schema fixes), A15 (README).
2026-05-13 EOD      Freeze main. Tag v0.2.0-pre-audit. No more v2-mounted changes.
2026-05-14          A19 — design-fidelity-guardian writes DRIFT-AUDIT-2026-05-15.md.
2026-05-15          Drift audit fires. Audit report posted.
2026-05-16–17       Weekend. Optional buffer.
2026-05-18          Sprint B starts. B1 (cull v1), B2 (cull dead exports), B9/B10 (SFARCTL + SPAIDEN populate).
2026-05-22          Sprint B close. Three OCs populated. CI gating live. Three new surfaces tested.
2026-05-25          Sprint C starts. NBAPOSN/PTREARN populate, second engagement, ⌘K, Decision detail.
2026-05-31          Sprint C close. Pilot rehearsal (product-owner review).
2026-06-01+         Pilot session. Stance A, hosted on Vercel, Janet driving, stakeholders watching.
2026-06-XX          Post-pilot replan (D1–D6) based on feedback signal.
```

---

## 12. Where this plan lives

- **This document:** [docs/MVP-PILOT-PLAN.md](docs/MVP-PILOT-PLAN.md)
- **Per-agent full deliverables:** `.claude/agent-memory/<agent>/project_mvp_pilot_review.md` for each of: chief-architect, product-manager, product-owner, lead-developer, ux-visionary, design-fidelity-guardian, methodology-guru, test-engineer, docs-leader, release-manager
- **Prior plan (just executed):** [.cursor/plans/main-features-pre-audit_ce57d140.plan.md](.cursor/plans/main-features-pre-audit_ce57d140.plan.md)
- **Drift-baseline reference:** [.claude/agent-memory/design-fidelity-guardian/reference_design_tarballs.md](.claude/agent-memory/design-fidelity-guardian/reference_design_tarballs.md) — tarball `CgM4C5b7mEU63Y2RQISWcw` is the current audit baseline
- **Toolkit-original additions note:** [.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md](.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md) — the three surfaces just shipped that have no tarball counterpart

This document is intended to be **the plan**. Update it as decisions land. When Sprint A closes, mark its items done in-place and capture deltas; same for B/C.
