---
name: MVP Pilot Review — 2026-05-11
description: Full code-level audit of v2 surface for production-pilot readiness. Findings, cull list, MVP scope, work items, risks.
type: project
---

# v2 Surface — Pilot Readiness Audit (2026-05-11)

## Files reviewed
- `app/page.tsx` (70 lines) — Router, App
- `app/layout.tsx` (59 lines) — fonts, metadata, SSR
- `components/v2/shell.tsx` (585 lines) — hooks, context, shell primitives
- `components/v2/practice.tsx` (227 lines) — Portfolio/practice home
- `components/v2/home.tsx` (581 lines) — Project home, phases, calendar
- `components/v2/pages.tsx` (858 lines) — MyWork, Decisions, Workshops, Schedule, Capabilities, Methodology, Ask, Autopilot, Settings, Guides
- `components/v2/detail.tsx` (1594 lines) — Capability detail + Configuration guide
- `components/v2/icons.tsx` (74 lines)
- `lib/data.ts` (711 lines)
- `lib/school-brands.ts` (122 lines) — UNTRACKED (build-breaking if not committed)
- `lib/brief.ts` — Brief composer
- `app/styles/v2.css` (1917 lines), `app/styles/detail.css` (716 lines)

---

## 1. Current-state findings

### What's good
- TypeScript strict — zero `any` in v2 components
- SSR/hydration handled correctly: `suppressHydrationWarning` on `<html>`/`<body>`, all localStorage reads deferred to post-mount `useEffect` + `hydrated` flag in AppProvider
- Hash routing survives hard reload — `useHash` inits from `window.location.hash.slice(1)` on first render
- ⌘K shortcut wired globally (`window.addEventListener("keydown", ...)`) — works on every route
- localStorage values are validated before use: AppProvider checks union types, `useMyWorkView` uses try/catch, config fields key uses structured namespace `v2.cfg.{engagementId}.{ocId}.{fieldId}`
- `SchoolLogo` has proper 2.5s timeout + `Image` preload fallback chain (curated → Clearbit → monogram)
- `ToastHost` uses `aria-live="polite"` — accessible feedback
- `notImplemented()` via CustomEvent — no broken interactions, no `alert()` calls
- `detail.css` imported via `@import` in `v2.css` — clean cascade
- All 10 routes are wired and functional; `Coming` fallback for unknown hashes

### What's broken / missing for pilot

**P0 — Blocking**
1. **`lib/school-brands.ts` is UNTRACKED** — it's imported by `shell.tsx`. Fresh `git clone` → `pnpm build` fails immediately. Must commit.
2. **No error boundary** — zero `ErrorBoundary` components in v2. Any render error = full blank screen. Single component crash takes down the entire app.

**P1 — High embarrassment / data integrity risk**
3. **`bastardLoopState` field name** — `detail.tsx:90` defines this as a `DetailData` type field (actually "where in delivery loop this capability is"). Renders in the capability detail UI (line 753 — `is-done`, `is-now` classes). A pilot consultant will see this in dev tools / code. Rename to `deliveryStage`.
4. **`dangerouslySetInnerHTML` at detail.tsx:1349, 1369** — renders `OC_DATA.sections[].intro` and `step.body` which contain `<em>` / `<strong>` HTML tags. Source is internal mock data only (low XSS risk now), but needs DOMPurify or plain-text port before real OC content pipelines are plugged in.
5. **Hard-coded constants visible to pilot users:**
   - `const buildProgress = 33;` at `home.tsx:518` — hardcoded phase progress bar
   - `parseSprint` fallback `demo: "Fri May 9"` at `home.tsx:99`
   - "Build → Validate gate" at `home.tsx:504-514` with hardcoded `daysOut: 21`

**P2 — Code quality**
6. **`DETAIL_BY_CAP` and `BUDGET_BY_CAP` live in `detail.tsx:133-194`** — ~60 lines of mock data hardcoded inside a 1594-line component. Breaks the "data in `lib/data.ts`" convention. Should migrate.
7. **`OC_INDEX_FALLBACK` at `detail.tsx:204-211`** — duplicates data from `lib/data.ts` OC_INDEX. Confirmed dead: `ocIndex()` helper at line 217 will always use `OC_INDEX` since it's always populated.
8. **Duplicate toast system** — `detail.tsx:285-297` defines a local `Toast`/`useToast` alongside `shell.tsx`'s `ToastHost`/`notImplemented`. The detail-local one is used for "Snippet copied" etc., while the shell one is for `notImplemented()`. They don't conflict but it's redundant infrastructure.
9. **`index` as React `key`** in multiple places: callouts and steps in `detail.tsx`; gantt months, autopilot stages/findings in `pages.tsx`; calendar weeks in `home.tsx`; BriefBody fragments in `shell.tsx`. Not currently broken (no reordering), but fragile for future animated/sorted lists.
10. **AskPage textarea has all inline styles** at `pages.tsx:536-546` — should be a CSS class.
11. **Duplicate toggle component classes** — `v2-mode-toggle` (Settings page) and `v2-viewtoggle` (Project home) implement the same visual pattern with different CSS classes.
12. **`navigate("capabilities")` without capId** at `home.tsx:250` — capability cards in the Project Stage Detail navigate to the capabilities list, not the capability detail. Behavior is likely intentional (user goes to list to pick) but the UX implication should be confirmed.
13. **`window.location.hash = "mywork"` directly** at `practice.tsx:222` — bypasses the `navigate` function from `useHash`. Works (hashchange fires) but inconsistent.
14. **`docs/NN Ellucian Student Banner Signature Project Plan (1).xlsx` is tracked in git** — a 3rd-party xlsx binary with spaces and parens in the filename. Should be in `.gitignore` or moved out.

---

## 2. Extraneous code to cull

### v1 archive — confirmed NOT mounted by v2, safe to delete in one commit
| File | Lines |
|---|---|
| `components/views/views-1.tsx` | ~370 |
| `components/views/views-2.tsx` | ~380 |
| `components/views/views-3.tsx` | ~350 |
| `components/views/views-meta.tsx` | ~200 |
| `components/views/views-new.tsx` | ~956 |
| `components/views/views-oc.tsx` | ~590 |
| `components/shell.tsx` | 337 |
| `components/icons.tsx` | 176 |
| `components/tweaks-panel.tsx` | 403 |
| `app/styles/styles.css` | 532 |
| **Total v1 archive** | **~4,294 lines** |

### Unused `lib/data.ts` exports — not imported by any v2 component
| Export | Lines | Notes |
|---|---|---|
| `ENGAGEMENT` | ~15 | Prototype concept; portfolio uses PORTFOLIO instead |
| `SPRINTS` / `ACTIVE_SPRINT` | ~12 | Not imported anywhere in v2 |
| `SMART_QUEUE` | ~12 | Smart Queue view not yet ported to v2 |
| `FINDING_INDEX` | ~10 | Cross-ref table; no consumer in v2 |
| `DOC_TREE` | ~12 | Documents view not yet ported to v2 |
| `DOCUMENTS` | ~20 | Same |
| `SPRINT_PLAN_BACKLOG` | ~15 | Not imported anywhere in v2 |
| **Total** | **~96 lines** | |

### Dead code inside detail.tsx
- `OC_INDEX_FALLBACK` at lines 204–211 — ~10 lines (dead; OC_INDEX always populated)

---

## 3. MVP scope for pilot

### Must-have (blocking pilot launch)
1. **Commit `lib/school-brands.ts`** — build breaks without it
2. **Add error boundary** around `<Router>` in `app/page.tsx` — recoverable crash UI
3. **Rename `bastardLoopState` → `deliveryStage`** in `detail.tsx` type and all references (~4 occurrences)
4. **Smoke test** passes (`pnpm smoke`) — must stay green

### Should-have (before handing to consultants)
5. **Document or sanitize `dangerouslySetInnerHTML`** — comment explaining source is internal, add sanitizer shim placeholder
6. **Cull v1 archive** — reduces `git clone` size and confusion for non-dev pilot participants browsing code
7. **Remove unused lib/data.ts exports** — ENGAGEMENT, SPRINTS, ACTIVE_SPRINT, SMART_QUEUE, FINDING_INDEX, DOC_TREE, DOCUMENTS, SPRINT_PLAN_BACKLOG (~96 lines)
8. **Migrate `DETAIL_BY_CAP`/`BUDGET_BY_CAP` to lib/data.ts** — consistency
9. **Remove `OC_INDEX_FALLBACK`** from detail.tsx (dead code)
10. **Move docs/*.xlsx out of git** — `.gitignore docs/*.xlsx`

### Could-have (polish for pilot quality)
11. Replace `index`-as-key with stable keys where data has IDs (callouts, steps)
12. Extract AskPage textarea to CSS class
13. Unify `v2-mode-toggle` and `v2-viewtoggle` into one CSS component
14. Fix `window.location.hash = "mywork"` → `navigate("mywork")` in practice.tsx:222
15. Replace hardcoded `buildProgress = 33` with derived value from SPRINTS data

---

## 4. Concrete work items (sequenced)

| # | Item | Size | File(s) | Notes |
|---|---|---|---|---|
| 1 | Commit `lib/school-brands.ts` (git add + commit) | XS | `lib/school-brands.ts` | Unblocks fresh clone |
| 2 | Add `ErrorBoundary` class component; wrap `<Router>` in `page.tsx` | S | `app/page.tsx` | New component, ~30 lines |
| 3 | Rename `bastardLoopState` → `deliveryStage` | XS | `components/v2/detail.tsx` | 4 occurrences |
| 4 | Delete v1 archive in one commit | S | `components/views/`, `components/shell.tsx`, `components/icons.tsx`, `components/tweaks-panel.tsx`, `app/styles/styles.css` | Confirm no stray import first |
| 5 | Cull unused data exports from `lib/data.ts` | S | `lib/data.ts` | 8 exports, ~96 lines |
| 6 | Remove `OC_INDEX_FALLBACK`; migrate `DETAIL_BY_CAP`/`BUDGET_BY_CAP` to `lib/data.ts` | M | `components/v2/detail.tsx`, `lib/data.ts` | Update imports in detail.tsx |
| 7 | Add `.gitignore docs/*.xlsx` + remove tracked xlsx | XS | `.gitignore`, `docs/` | `git rm --cached` |
| 8 | Add sanitizer comment on `dangerouslySetInnerHTML` | XS | `components/v2/detail.tsx:1349,1369` | Note source + add TODO |
| 9 | Fix `window.location.hash = "mywork"` → `navigate` | XS | `components/v2/practice.tsx:222` | Consistency only |
| 10 | Replace index-as-key with stable keys | S | `detail.tsx`, `pages.tsx`, `home.tsx`, `shell.tsx` | Where data has `.id` fields |

---

## 5. Risks

1. **`lib/school-brands.ts` untracked** — immediate build-break on fresh clone. HIGH.
2. **No error boundary** — one render error = blank screen for every pilot user. HIGH.
3. **`bastardLoopState` in production code** — high embarrassment for a customer-facing pilot review. MED.
4. **dangerouslySetInnerHTML** — acceptable for internal mock data; becomes HIGH risk when real OC content (from a CMS or database) is plugged in without sanitization.
5. **Hard-coded dates/constants** — `buildProgress: 33`, `demo: "Fri May 9"`, gate `daysOut: 21`. Pilot consultants comparing the tool to reality will notice these are wrong immediately.
6. **Duplicate toast infrastructure** — low risk now; medium risk when someone patches one but not the other.
7. **docs/*.xlsx in git** — binary in repo; inflates clone size; filename with spaces/parens causes CI issues on some systems.
8. **localStorage key accumulation** — `v2.cfg.{engagementId}.{ocId}.{fieldId}` keys for config field review state are never cleaned up when an engagement changes. Will accumulate over long sessions. Low risk now (pilot is single-engagement), needs a clear/reset mechanism for multi-engagement use.
9. **Clearbit logo fetch** — `SchoolLogo` fetches external logos (clearbit.com) in the browser. If a pilot happens in an air-gapped or restricted network, all logos will fall through to monograms. Acceptable degradation.

---

## 6. Open questions for user

1. **Is the drift audit baseline for v2 decided?** The v1 surface is preserved as the parity reference, but v2 has no clear audit target yet. The design-fidelity-guardian's May 15 audit will need a scope call before firing.
2. **Should `SMART_QUEUE`, `DOC_TREE`, `DOCUMENTS` exports be culled immediately, or is a Documents/SmartQueue v2 port planned for the pilot window?** If planned, don't cull — they're ready data.
3. **Is the `docs/NN Ellucian Student Banner Signature Project Plan (1).xlsx` a checked-in reference document deliberately?** If yes, it should be tracked but in `.gitignore` for future. If accidental, `git rm` it.
4. **Confirm `bastardLoopState` rename** — `deliveryStage`? `loopStage`? The field label in the UI is not exposed directly but the type name leaks.
5. **Error boundary UX** — what should pilot consultants see when a page crashes? Full reset button, or just "something went wrong" + link back to portfolio?
