---
name: MVP Pilot Test Review — 2026-05-11
description: Test-engineer lens on production-pilot readiness. Zero tests today; this is the bootstrap plan.
type: project
---

# Test-Engineer MVP Pilot Review
**Date:** 2026-05-11  
**Context:** Three net-new surfaces shipped (MyWork kanban toggle, Schedule gantt, Configuration Guide config-fields). Audit May 15. Production pilot targeting real Ellucian consultants on a live engagement.

---

## 1. Current-State Findings

### What exists
- `scripts/smoke.sh` (`pnpm smoke`) — the entire test layer.
  - Runs `pnpm next build` → starts `pnpm next start --port 3001` → curls `/` once.
  - Asserts 8 HTML text markers: `v2-shell`, `v2-topbar`, `v2-rail`, `v2-hero`, `Ellucian`, `Consulting Toolkit`, `Across your engagements`, `theme-light`.
  - One negative assertion: `next-devtools` absent from production HTML.
- TypeScript strict (`tsc --noEmit` via `next build`) — catches type errors, not behavior.

### What is NOT tested
- **Hash routing** — none of the 11 routes (`#mywork`, `#decisions`, `#guides`, `#capabilities`, `#schedule`, `#workshops`, `#library`, `#ai`, `#autopilot`, `#settings`, plus detail sub-routes `#capabilities/<id>`, `#guides/<id>`) are exercised. Curl hits `/` and reads SSR-rendered HTML only.
- **Three new surfaces** — MyWork kanban toggle, Schedule gantt, Configuration Guide config-fields: zero coverage.
- **localStorage state** — `v2.theme`, `v2.currentProject`, `v2.defaultLanding`, `v2.mywork.view` — untestable from curl.
- **Theme toggle** — no verification that clicking the button changes `data-theme` attribute or CSS variables.
- **Keyboard shortcuts** — ⌘K search focus, and any rail shortcuts: zero coverage.
- **Client hydration** — smoke.sh reads SSR HTML. React hydration errors, hook crashes, and client-only state errors are invisible to it.

### Extraneous / Cleanup
- **.next is correctly gitignored** — not committed. No issue.
- **No `console.log` / debug output** found in any `components/v2/*.tsx`, `lib/*.ts`, or `app/page.tsx`. Clean.
- **`/coverage` gitignored** — already present in `.gitignore`. Good.

---

## 2. Proposed Stack

**Recommendation: Playwright only, for now. No Vitest, no React Testing Library.**

Reasoning:
- The app is a fully client-side SPA with hash routing and localStorage state. The user-visible contract is wiring: route → view, hash → state, button → localStorage. E2E tests have maximum signal here.
- There is no business logic in the runtime: `lib/data.ts` is typed mock content; `lib/brief.ts` is static. Unit tests would re-test what TypeScript already guarantees.
- No network layer. MSW is not justified.
- React Testing Library without a running browser can't exercise the hash routing or localStorage state — the things most likely to regress.

Counter-argument considered: RTL + Vitest for isolated component rendering (does `MyWorkPage` render without throwing?). Decision: this is covered by the build passing + a Playwright smoke nav. RTL adds install complexity and fragile component-mount tests for little extra signal on a prototype.

**When to add Vitest:** when business logic lands (e.g., a scoring algorithm, a data transformer, a utility function with branches). Not yet.

---

## 3. MVP Scope for Pilot

### Must-have (blocking pilot)
- [ ] **Playwright installed and configured** — `playwright.config.ts` targeting `http://localhost:3001` (built app), or `pnpm dev` for speed.
- [ ] **Build smoke** — current `smoke.sh` build step is the right gate; keep it.
- [ ] **Full route navigation smoke** — one Playwright spec that visits all 11 top-level routes and asserts the page renders without a JS error and the rail active-state changes. ~15 min to write; catches broken imports, missing component exports.
- [ ] **Three new surface render contracts** — one it() each:
  - `#mywork` → kanban toggle button present (`v2-mywork-viewtoggle`); click → list/board class changes; `localStorage.getItem('v2.mywork.view')` reflects the toggle.
  - `#schedule` → gantt grid present (`[role=grid]`, `aria-label="Milestones by go-live and month"`); today column marker visible.
  - `#guides/<oc-id>` → ConfigurationGuidePage renders; config-fields section present.
- [ ] **Theme toggle** — click sun/moon button → `document.documentElement.dataset.theme` flips between `light` and `dark`; localStorage `v2.theme` updated.

### Should-have (ship before pilot, not blocking)
- [ ] **`smoke.sh` marker expansion** — add `v2-rail`, `v2-mywork-viewtoggle`, `v2-gantt` HTML markers (these render in SSR partial output). Adds 3 lines, catches catastrophic route-component deletion.
- [ ] **localStorage persistence test** — Playwright: set `v2.mywork.view = 'board'`, navigate away, navigate back, assert board view is still active.
- [ ] **Direct-load hash routing** — Playwright: `page.goto('http://localhost:3001/#schedule')` → asserts schedule page headline is visible. Catches SSR→hydration mismatch on direct URL load.

### Could-have (post-pilot)
- [ ] Keyboard shortcut E2E (⌘K focuses search input)
- [ ] CI integration (`pnpm smoke` in a GitHub Actions matrix)
- [ ] Visual regression (only relevant once CI exists; defer to design-fidelity-guardian)

---

## 4. Concrete Work Items (Sequenced)

| # | Item | Size | Notes |
|---|------|------|-------|
| 1 | `pnpm add -D @playwright/test` + `npx playwright install chromium` | **S** | ~5 min. Adds 1 dep, downloads one browser binary. |
| 2 | `playwright.config.ts` — baseURL, 1 project (chromium), webServer block pointing at `pnpm start --port 3001` | **S** | Config only; no tests yet. |
| 3 | Add `"test": "playwright test"` to `package.json` scripts | **S** | One-liner. |
| 4 | `tests/smoke.spec.ts` — full route nav (all 11 routes, no-error assertion) | **M** | ~1h. This is the highest-ROI single test. |
| 5 | `tests/new-surfaces.spec.ts` — MyWork kanban toggle + localStorage, Schedule gantt render, Guide config-fields render | **M** | ~1.5h. Requires Playwright `evaluate()` for localStorage reads. |
| 6 | `tests/theme.spec.ts` — theme toggle changes `data-theme` attribute + localStorage | **S** | ~30 min. Simple click → attribute assertion. |
| 7 | Expand `smoke.sh` marker set (3 new HTML markers for new surfaces) | **S** | ~10 min. Low-value but zero-cost to add. |
| 8 | `tests/hash-routing.spec.ts` — direct `page.goto('#schedule')` etc. | **M** | ~1h. Covers 4-5 most important deep routes. |

**Order dependency:** 1 → 2 → 3 (must install before writing tests), then 4-8 can parallelize.

---

## 5. Risks

- **localStorage is invisible to smoke.sh** — current CI-equivalent gate cannot catch state persistence bugs. Items 5 and 8 above close this.
- **No CI** — smoke.sh is run manually. Any regression caught only when someone remembers to run `pnpm smoke`. Without CI gating PRs, tests are advisory only. *This is release-manager's call once Vercel is linked.*
- **Single Playwright browser target** — chromium only. Janet may use Safari/Edge. For internal pilot, acceptable. Flag for external pilots.
- **Playwright `webServer` block adds ~3min to test run** (build + start). Accept for now; use `pnpm dev` (`next dev`) in watch mode for local development iteration.
- **Three new surfaces shipped without any test coverage** — they are regression-blind until items 4-5 above are complete. If the May 15 audit includes a live demo, a silent JS crash in `SchedulePage` or `ConfigurationGuidePage` is the highest-probability failure mode.
- **Hash routing direct-load untested** — SSR/hydration mismatch on `#schedule` or `#guides/<id>` would be invisible until a user pastes a URL. Item 8 covers this.

---

## 6. Open Questions for the User

1. **Is the pilot internally hosted (Ellucian intranet) or external (client-facing URL)?** External = higher bar; need HTTPS, domain, and ideally CI gating before any deploy.
2. **Does the team want CI gating before merge to main?** If yes, `release-manager` needs to wire a GitHub Actions workflow that runs `pnpm smoke` (and eventually `pnpm test`) on every PR. That's a separate task from this bootstrap.
3. **Coverage % target?** None is appropriate for a prototype. Instead: "every route loads" + "three new surfaces have a render contract" is a reasonable pilot bar. Percentage targets are meaningless at zero tests.
4. **Who runs the tests?** If it's just the dev team before demo, `pnpm smoke` + `pnpm test` (Playwright) in a local terminal is fine. If it needs to be part of an automated gate, CI is prerequisite.
5. **Browser targets for pilot users?** Chromium covers ~70% of users; if Janet's team uses Safari, add webkit to the Playwright projects config. One-line addition.

---

## localStorage Key Reference (for tests)

| Key | Values | Set by |
|-----|--------|--------|
| `v2.theme` | `"light"` / `"dark"` | Shell theme toggle |
| `v2.currentProject` | project id string | ProjectSwitcher |
| `v2.defaultLanding` | `"practice"` / `"project"` | Settings? |
| `v2.mywork.view` | `"list"` / `"board"` | MyWork kanban toggle |

---

## Route Map (for test coverage matrix)

| Hash | Component | Tested by smoke.sh? | New surface? |
|------|-----------|---------------------|--------------|
| `#` / `#home` | PracticeHome | Partial (HTML markers) | |
| `#project` | ProjectHome | No | |
| `#mywork` | MyWorkPage | No | Kanban toggle (NEW) |
| `#decisions` | DecisionsPage | No | |
| `#guides` | GuidesPage | No | |
| `#guides/<id>` | ConfigurationGuidePage | No | Config-fields (NEW) |
| `#capabilities` | CapabilitiesPage | No | |
| `#capabilities/<id>` | CapabilityDetailPage | No | |
| `#schedule` | SchedulePage | No | Gantt (NEW) |
| `#workshops` | WorkshopsPage | No | |
| `#library` | MethodologyPage | No | |
| `#ai` | AskPage | No | |
| `#autopilot` | AutopilotPage | No | |
| `#settings` | SettingsPage | No | |

11 of 14 routes (counting sub-routes) are **completely untested** beyond the TypeScript compile.
