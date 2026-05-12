# Drift Audit — 2026-05-15

**Audit baseline:** Source design tarball `K3NKe3IuvfS03Mr6yWnkDw` (re-anchored 2026-05-11 PM — see baseline-pivot note below)
**URL:** `https://api.anthropic.com/v1/design/h/K3NKe3IuvfS03Mr6yWnkDw`
**Extracted at:** `/tmp/design-K3NKe3Iu/n2s-consulting-toolkit/`
**SHA-256 (first 12):** `c19d0f5c0259`
**Port under audit:** this repo (`n2s-consulting-toolkit`)
**Audited by:** design-fidelity-guardian (with chief-architect for architectural scope, ux-visionary + product-manager + product-owner for the K3NKe3Iu shell-slice review)
**Audit window:** pre-flight 2026-05-13 EOD → fires 2026-05-15
**Frozen build:** tag `v0.2.0-pre-audit` (release-manager to cut at audit-input SHA)

> **Baseline re-anchor — 2026-05-11 PM.** A second design tarball (`K3NKe3IuvfS03Mr6yWnkDw`) landed mid-day with a redesigned shell — narrow violet TopBar (44px, HEEAR-style), `ProjectSwitcher` relocated out of the topbar into a new `ProjectContextBar` strip that renders only on project-scoped routes. User explicitly authorized implementation pre-audit (overriding the May 13 EOD UI freeze for this slice). Implementation landed in commit-pending and includes one product-owner-required tweak beyond the literal design (passive `ProjectIdentityChip` in the topbar on non-project routes so MyWork etc. stay oriented). Per `product-manager` Option (a) in `.claude/agent-memory/product-manager/project_design_K3NKe3Iu_scope_check.md`: re-anchor the baseline rather than auditing the implementation against a layout the user already rejected. The Stance A drift items from the prior baseline that this re-anchor closes: C6 (SchoolLogo restored in `ProjectSwitcher` menu), C8 (`.v2-projswitch` padding nudges, mooted by violet topbar). C7 (`PageHero.has-logo` rule) remains open, folded into Sprint B0-3.

---

## 1. Methodology

The tarball ships its active design surface under `project/v2/*.jsx` plus `project/Ellucian Consulting Toolkit.html` as the host. v2 here (`components/v2/*.tsx`) maps to `project/v2/*` 1:1 by file name. The tarball also preserves a `project/v1-archive/` set that mirrors this port's `components/views/*` and root-level `components/{shell,icons,tweaks-panel}.tsx`. The new `K3NKe3Iu` baseline additionally bundles 7 design-chat transcripts under `chats/*.md`; intent for the shell redesign lives in `chat7.md` (search "i feel like we abandoned"). The K3NKe3Iu tarball also adds `project/v2/deck-stage.js` and root-level `Toolkit Overview Deck.html` / `Feature Tour Slide.html` — these are standalone HTML deck materials, **not** part of the React app surface, and are out of scope for this audit.

**Tarball-to-tarball delta (CgM4C5b7 → K3NKe3Iu):** Only `shell.jsx` and `styles.css` changed. `home.jsx`, `pages.jsx`, `detail.jsx`, `detail.css`, `practice.jsx`, `icons.jsx`, `data-v2.js`, `school-brands.js` are byte-identical. The drift findings for the unchanged surfaces (§2.1–2.5, §2.7, §2.8, §2.10) therefore carry forward from the prior pass and have been spot-verified against HEAD `8902109`.

For each ported surface, every diff vs. tarball is classified into one of three buckets:

- **(I) Intentional** — TypeScript/Next.js conversion, route adaptation, prototype-hardening (notImplemented toasts, ⌘K wiring, theme persistence, error boundary), or **port-leads-tarball corrections** (port fixes a tarball bug, e.g. Banner-schema names, stale 56px topbar references, broken `project/<sub>` routes). Expected; not drift.
- **(D) Drift** — accidental deviation from tarball intent. Must fix.
- **(O) Toolkit-original** — surface or behaviour added in this port that does NOT exist in the tarball. Classified deliberately as intentional addition, recorded in `.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md`.

---

## 2. Audit summary — surface-by-surface

> Re-derived 2026-05-11 PM against `K3NKe3IuvfS03Mr6yWnkDw` at HEAD `8902109`. Rows marked `[K3NKe3Iu]` are new vs. the prior CgM4C5b7 pass. Rows without that mark were re-confirmed against the byte-identical tarball file.

### 2.1 `practice.tsx` — Practice home (Portfolio)

| Diff | Class | Note |
|---|---|---|
| TSX vs JSX, type annotations | I | conversion |
| `notImplemented()` toast vs `alert()` | I | demo-safety hardening |
| Brief footer copy: "Demo data — will pull from Jira…" | I | pilot-honesty fix (was a lie pre-Sprint A) |
| "Open My work →" uses `navigate()` not `window.location.hash` | I | Sprint A A9 |
| `SchoolLogo` resolution chain (curated → Clearbit → monogram) | I | per engagement-logos brief |

Verdict: **clean**.

### 2.2 `home.tsx` — Project home

| Diff | Class | Note |
|---|---|---|
| Phase ribbon + StageDetail + CalendarView | I | parity with tarball |
| Brief footer demo-honest copy | I | Sprint A A13 spill |
| **Capability cards collapse to `#capabilities` index instead of `#capabilities/<id>`** | **D** | **pending fix in Sprint B6** |
| Guide rows + workshop rows likewise collapse | D | Sprint B7 |
| `buildProgress = 33` hardcoded | I (low-risk) | demo-mode constant |

Verdict: **two known drift items, fix queued for Sprint B**. Audit reports as drift-acknowledged.

### 2.3 `detail.tsx` — Capability detail (`#capabilities/<capId>`)

| Diff | Class | Note |
|---|---|---|
| Delivery / Decisions / Budget tabs | I | matches tarball IA |
| InlineTaskRow + DRC sign-off lifecycle + Activity feed + Right rail | I | matches tarball |
| `bastardLoopState` → `deliveryStage` rename | I | Sprint A A7 |
| Inline `DETAIL_BY_CAP` / `BUDGET_BY_CAP` synthesized data | I | matches tarball pattern (single-file drop) |
| `OC_INDEX_FALLBACK` dead constant | D (cosmetic) | Sprint B cull |

### 2.4 `detail.tsx` — Configuration guide (`#guides/<ocId>`)

| Diff | Class | Note |
|---|---|---|
| TOC + walk-step body + DRC mini + Tests rail + AI draft | I | matches tarball |
| `ConfigFieldsTable` per active section + two-state review | **O** | **toolkit-original — flagged 2026-05-11** |
| `CONFIG_FIELDS_BY_OC` SOATERM + SFARCTL + SPAIDEN populated | O | toolkit-original content; SFARCTL/SPAIDEN body + fields authored 2026-05-11 PM (B5-1 + B5-2 pulled forward, post-guardian-pass — see §4 addendum). 4 + 6 = 10 new field rows; SOATERM unchanged. |
| `detail.css` token rewrite (`--surface→--bg-panel`, etc.) | I | port adaptation; user-acknowledged baseline |

### 2.5 `pages.tsx` — secondary pages

| Sub-surface | Diff | Class | Note |
|---|---|---|---|
| **MyWorkPage** | Buckets \| Board view toggle | **O** | **toolkit-original — flagged 2026-05-11** |
| **MyWorkBoard** | 5 status columns | O | toolkit-original |
| **SchedulePage** | go-live readiness band + 12-month gantt | **O** | **toolkit-original — flagged 2026-05-11** |
| WorkshopsPage | parity | I | clean |
| DecisionsPage | parity; row click toasts instead of navigating to OC | D | Sprint B5 fix |
| CapabilitiesPage | parity | I | clean |
| MethodologyPage | parity | I | clean |
| **AskPage** | rewritten as "Coming soon" stub | I | Sprint A A12; tarball had a non-functional textarea + disabled button, port now honest |
| AutopilotPage | parity | I | clean |
| SettingsPage | "Demo data" amber pill replaces "All connected" green pill | I | Sprint A A13; honesty fix |
| GuidesPage | parity | I | clean |

### 2.6 `shell.tsx` — top bar / project context bar / rail / shell `[K3NKe3Iu — re-derived]`

| Diff | Class | Note |
|---|---|---|
| `notImplemented()` + `ToastHost` system | O | toolkit-original #4 (Sprint A) |
| ⌘K / Ctrl-K wired to focus search input | O | toolkit-original #5 (Sprint A) |
| `[K3NKe3Iu]` New 44px violet `TopBar`: wordmark left, white-tinted search + Decisions attn + theme toggle + JH avatar right | I | parity with K3NKe3Iu shell redesign |
| `[K3NKe3Iu]` New `ProjectContextBar` mounted in `PageShell`, rendered only when `top` route ∈ `{project, capabilities, guides, decisions, workshops, schedule}` | I | parity |
| `[K3NKe3Iu]` Passive `ProjectIdentityChip` in topbar on non-project routes | **O** | **toolkit-original #8** — the one product-owner-required tweak beyond the literal design; orientation hint when ProjectContextBar is hidden |
| `[K3NKe3Iu]` `v2-shell.has-projctx` modifier class added to layout root when projctx renders; CSS uses it to subtract `--projctx-height` from `.v2-body` `min-height` and `.v2-rail` `top`/`height` | **O** | **toolkit-original #7** — layout enhancement (tarball doesn't do this; tarball still references hardcoded stale 56px values, see §2.9) |
| `[K3NKe3Iu]` `v2-attn` Decisions button: port navigates to `decisions`, tarball navigates to `project/decisions` (which tarball router does NOT resolve to DecisionsPage — it falls through to project home) | I | **port-leads** route IA correction |
| `[K3NKe3Iu]` `home.tsx` brief CTA + stage-banner: port navigates to `decisions`, tarball `project/decisions` | I | port-leads (same fix as topbar attn) |
| `icons.tsx` adds `chevron-left` SVG case (tarball `icons.jsx` omits it — would render `null` inside the new `ProjectContextBar` back button) | I | **port-leads** — render correctness fix |
| `isProjectScopedRoute()` exported helper | I | TS ergonomics; same logic, hoisted from `ProjectContextBar` |
| `PageHero` renders `{logo}` wrapped in `<div className="v2-hero-logo">`; tarball renders bare `{logo}` and conditionally applies `has-logo` modifier to the `<header>` | **D** | **C7 carries forward** — structural divergence breaks tarball's `.v2-hero.has-logo` rule (gap/align tweaks); see §2.9. Sprint B0-3 restore. |
| `Coming` back link `href="#/"` vs tarball `href="#"` | D (cosmetic) | Sprint B0-3 |
| Tarball-side `topbar.v2-search` size 15px, decisions icon 13px, theme icon 14px; port matches | — | parity |
| Tarball-side `ProjectSwitcher` includes per-row `SchoolLogo` + "Logos auto-detected · Override" footer; port matches | I | C6 retired by re-anchor |

### 2.7 `app/layout.tsx`

| Diff | Class | Note |
|---|---|---|
| Pre-paint theme script | I | Sprint A A10; prevents light→dark flash |
| `theme-light` default class kept (smoke gate relies on it) | I | rendered HTML still carries it |
| Font variables: Playfair / Roboto Slab / Oswald / Archivo Black (via next/font) | I | parity with tarball school-monogram font stack |

### 2.8 `app/error.tsx`, `app/not-found.tsx`, `app/loading.tsx`

| Diff | Class | Note |
|---|---|---|
| Top-level render-error boundary | **O** | **toolkit-original** — 6th to formally classify; pilot-hardening addition |
| 404 fallback | O | toolkit-original |
| Loading skeleton | O | toolkit-original |

These didn't exist in the tarball. The Next.js App Router convention is to provide them; the tarball is a static HTML host, so it has no analogue.

### 2.9 Styles `[K3NKe3Iu — re-derived for shell/topbar block]`

| File | Diff | Class | Note |
|---|---|---|---|
| `app/styles/tokens.css` | parity for color palette, type scale, motion, radii, shadows | I | clean |
| `app/styles/tokens.css` | `[K3NKe3Iu]` new tokens: `--topbar-height: 44px`, `--projctx-height: 44px`, `--gradient-topbar`, `--gradient-topbar-dark`, `--gradient-button`, `--gradient-login` | I | port adaptation — tarball inlines the gradient as a literal, port hoists it to a token. Same intent, cleaner. |
| `app/styles/tokens.css` | `[K3NKe3Iu]` `--gradient-topbar` angle = `135deg`; tarball uses `90deg`. Start stop = `#6d28d9 0%`, tarball `#6b2bd9 0%` (Δ ≈ 2 hex units). Middle stop = `40%`, tarball `38%`. End stop = `#9333ea 100%`, tarball `#8b5cf6 100%` (noticeably more saturated/warmer in port). | **D · MEDIUM** | **NEW — angle change is visible; user reads diagonal not horizontal. End-color saturation diff is noticeable side-by-side. Sprint B0-3 must-have.** |
| `app/styles/tokens.css` | `[K3NKe3Iu]` `--gradient-topbar-dark` same angle/percent drift; endpoint colors match tarball (`#4c1d95 → #5b21b6 → #6d28d9`) | D (cosmetic) | folds into same Sprint B0-3 fix |
| `app/styles/v2.css` | `[K3NKe3Iu]` `.v2-body min-height: calc(100vh - var(--topbar-height))` — tarball still references stale `calc(100vh - 56px)` (didn't propagate the 44px topbar shrink) | I | **port-leads** correctness fix |
| `app/styles/v2.css` | `[K3NKe3Iu]` `.v2-rail` `top: var(--topbar-height)`, `height: calc(100vh - var(--topbar-height))` — tarball still references stale `top: 56px` / `height: calc(100vh - 56px)` | I | **port-leads** correctness fix |
| `app/styles/v2.css` | `[K3NKe3Iu]` `.v2-shell.has-projctx .v2-body` + `.v2-shell.has-projctx .v2-rail` rules that subtract `--projctx-height` | O | toolkit-original layout enhancement (paired with the JSX `has-projctx` class — tarball lets the projctx eat into the rail/body min-height) |
| `app/styles/v2.css` | `[K3NKe3Iu]` `.v2-projidchip` + `.v2-projidchip-name` rules | O | toolkit-original (chip styling) |
| `app/styles/v2.css` | `[K3NKe3Iu]` `.v2-hero-logo` rule (flex: 0 0 auto; padding-top: 4px); tarball has `.v2-hero.has-logo { gap: 20px; align-items: center; }` + `.v2-hero.has-logo .v2-hero-text { padding-top: 0; }` — different mechanism, slightly different layout (port doesn't recenter or widen the gap when a logo is present) | **D · LOW** | C7 carries forward; cosmetic but visible on Project Home hero. Sprint B0-3 |
| `app/styles/v2.css` | `[K3NKe3Iu]` `.v2-projctx` block matches tarball except `.v2-projctx-meta` gap (port `10px`, tarball `12px`) and added focus-visible rules | D (cosmetic) | Sprint B0-3 |
| `app/styles/v2.css` | `[K3NKe3Iu]` Extra `:focus-visible` rules across topbar / projctx / brand controls | I | a11y hardening; no tarball regression |
| `app/styles/v2.css` | appended `.v2-mywork-viewtoggle`, `.v2-board-*`, `.v2-gantt-*` blocks | O | toolkit-original styles for toolkit-original surfaces |
| `app/styles/detail.css` | appended `.d-configtable-*` | O | toolkit-original |
| `app/styles/detail.css` | duplicates of `.row`, `.stack`, `.btn-link`, `.t-h3`, `.v2-hero-actions` | D | C1 — Sprint B0-3 cull |
| `app/styles/v2.css` | undefined `--surface-1` / `--surface-2` tokens used 7× (Autopilot pane visually broken in both themes) | **D · HIGH** | **D1 — pilot-blocking. Sprint B0-3 must-have. Re-confirmed at HEAD `8902109` (`v2.css` lines 1476, 1509, 1574, 1586, 1630, 1643, 1651).** |
| `app/styles/v2.css` | dead `.v2-main` second padding rule (line 187 — `.v2-main { padding: 20px 32px 60px; }` overrides line 183 immediately), dead `.v2-section`/-head rule pairs, `.internals*` no-ops | D (cosmetic) | C2, C3 — Sprint B0-3 cull |
| `app/styles/detail.css` | dark-only `.d-code` background (`#0b1018`) — unreadable in light mode | **D · HIGH** | **D2 — pilot-blocking. Sprint B0-3 must-have. Re-confirmed at HEAD `8902109` (`detail.css` line 522).** |

### 2.10 `lib/data.ts`

| Diff | Class | Note |
|---|---|---|
| `MILESTONES`, `GANTT_TODAY`, `MILESTONE_TYPES`, `FINDING_INDEX` data shapes | I | parity with tarball `data-v2.js` |
| `GANTT_TODAY` now computed at module load instead of hardcoded May 1 | I | Sprint A A14; runtime-honest replacement, no shape change |
| Banner schema fixes — `nbrpsn→nbaposn`, `ftvvend→ftmvend`, PoT cols → `SOBPTRM_*`, DRC-4 OC ref, FINDING_INDEX labels | I | Sprint A A17; correctness fix per `methodology-guru`. The tarball ships the **wrong** form codes; the port is more accurate. Audit calls this an intentional improvement. |
| `is-6` Inner Source rewrite (Vendor → FTMVEND + 1099) | I | Sprint A A18; correctness + attribution |
| `CONFIG_FIELDS_BY_OC` (new entity, SOATERM + SFARCTL + SPAIDEN populated) | O | toolkit-original; SFARCTL/SPAIDEN populated 2026-05-11 PM post-guardian-pass — see §4 addendum |
| `OC_DATA` reshape: flat `OCDefinition` → `Record<string, OCDefinition>` keyed by ocId; `OCSection` + `OCDefinition` types exported | O | toolkit-original; structural change required to dispatch real content for non-SOATERM OCs. Paired with 1-line type-narrowing fix in `detail.tsx` `ConfigurationGuidePage` (rendering-neutral on SOATERM path) and 3-line legacy fix in unmounted `views/views-oc.tsx`. See §4 addendum. |
| `TaskStatus` union + `TASK_STATUSES` const | O | toolkit-original for kanban |
| Dead exports: `ENGAGEMENT`, `SPRINTS`, `ACTIVE_SPRINT`, `SPRINT_PLAN_BACKLOG`, `DOC_TREE`, `DOCUMENTS`, `SMART_QUEUE` | D (cosmetic) | Sprint B2 cull |

---

## 3. Toolkit-original additions — formal classification

Eight surfaces / behaviours in this port have no tarball counterpart and are recorded as **intentional toolkit-originals**. The audit does NOT report these as drift.

| # | Surface | Where | Classified at |
|---|---|---|---|
| 1 | MyWork kanban toggle (Buckets \| Board) | `pages.tsx` MyWorkPage | 2026-05-11 AM |
| 2 | Schedule 12-month gantt | `pages.tsx` SchedulePage | 2026-05-11 AM |
| 3 | Configuration Guide config-fields table | `detail.tsx` ConfigFieldsTable | 2026-05-11 AM |
| 4 | `notImplemented()` + `ToastHost` toast system | `shell.tsx` | 2026-05-15 audit (CgM4C5b7 pass) |
| 5 | ⌘K / Ctrl-K search-focus shortcut | `shell.tsx` | 2026-05-15 audit (CgM4C5b7 pass) |
| 6 | Top-level render-error boundary (`app/error.tsx`, `not-found.tsx`, `loading.tsx`) | `app/` | 2026-05-15 audit (CgM4C5b7 pass) |
| 7 | `v2-shell.has-projctx` layout modifier + paired `.has-projctx .v2-body` / `.v2-rail` CSS rules that correctly subtract `--projctx-height` from min-height/top/height | `shell.tsx`, `v2.css` | **2026-05-15 audit (K3NKe3Iu re-pass)** |
| 8 | Passive `ProjectIdentityChip` (topbar pill on non-project-scoped routes; navigates to Project home; does NOT open switcher menu) | `shell.tsx`, `v2.css` `.v2-projidchip*` | **2026-05-15 audit (K3NKe3Iu re-pass) — product-owner-required tweak beyond the literal design** |
| 9 | **WorkProductsKanbanPage** — `#workproducts` portfolio route, 5-lane state kanban (`Not Started` / `In Progress` / `Needs Review` / `Signed` / `Blocked`), filter row (phase + engagement + owner) persisted to `localStorage["v2.workproducts.filters"]`. Tarball does not ship a work-products surface. | `workproducts.tsx`, `workproducts.css`, `app/page.tsx` route handler, `shell.tsx` RAIL_TOP entry | **2026-05-15 audit (freeze-override pull-forward 2026-05-12)** |
| 10 | **WorkProductDetailPage** — `#workproducts/<id>` route with 10 sections (phase + state header, purpose & scope, DoD, RACI grid, prerequisites/feeds_into, linked OCs, linked DRCs, capability scope, applies_to chips, state-change controls firing `notImplemented` toast). Tarball does not ship this view. | `workproducts.tsx`, `workproducts.css`, `app/page.tsx` route handler | **2026-05-15 audit (freeze-override pull-forward 2026-05-12)** |
| 11 | **WorkProductsTab on CapabilityDetailPage** — new leftmost tab (default when no `?tab=` set), groups WPs for this cap + engagement by phase with state badges, owner avatars, due dates, linked-OC/DRC counts. Tarball capability detail does not ship a Work Products tab; "Delivery" was the prior default and remains as second tab. | `detail.tsx` CapabilityDetailPage (tab table + new `WorkProductsTab` function) | **2026-05-15 audit (freeze-override pull-forward 2026-05-12)** |

Items 7 and 8 land with the K3NKe3Iu re-anchor. Items 9–11 land with the **freeze-override pull-forward 2026-05-12 PM** — user explicitly authorized pulling B0-8 (Work Products UI surface) from Sprint B0 (post-audit) into the pre-audit window. Same precedent as the K3NKe3Iu shell redesign override (2026-05-11 PM). The audit catalogs these as toolkit-originals rather than re-baselining a third time; chief-architect note in `.claude/agent-memory/chief-architect/project_workproducts_path_b_decision_2026_05_12.md`.

The prior "**item 8 is the only allowed toolkit-tweak beyond the literal K3NKe3Iu design**" lock-in language is **retired 2026-05-12** — user confirmed "allow more beyond-design tweaks" in the sign-off call. Beyond-design additions are now classified as toolkit-originals (catalogued in the toolkit-originals memo) rather than treated as audit blockers. The chip remains in the catalog as item 8; items 9–11 join it.

`.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md` is updated this audit pass to include items 4–11.

---

## 4. Drift findings — what blocks pilot vs. cosmetic

> Re-derived 2026-05-11 PM against `K3NKe3IuvfS03Mr6yWnkDw` at HEAD `8902109`. D1–D4 retained from prior pass with re-confirmation lines. D5 added by this re-pass. C-numbering preserved across passes for traceability.

### Pilot-blocking drift (HIGH)

| ID | Where | Drift | Re-confirmed | Fix in |
|---|---|---|---|---|
| D1 | `v2.css` lines 1476, 1509, 1574, 1586, 1630, 1643, 1651 | undefined `--surface-1` / `--surface-2` tokens → Autopilot pane visually broken in both themes | ✓ HEAD `8902109` | Sprint B0-3 |
| D2 | `detail.css` line 522 | dark-only `.d-code` background (`#0b1018`) → Configuration Guide code blocks unreadable in light mode | ✓ HEAD `8902109` | Sprint B0-3 |
| D3 | `home.tsx` lines 250, 281, 311, 317 | capability/guide/workshop rows collapse to `#capabilities` / `#workshops` / `#guides` index instead of deep-linking to `<id>` | ✓ HEAD `8902109` | Sprint B0-3 |
| D4 | `pages.tsx` line 205 (DecisionsPage) | DRC row fires `notImplemented(…)` toast instead of navigating to the linked OC section | ✓ HEAD `8902109` | Sprint B0-3 |

### Pilot-tolerable but visible drift (MEDIUM)

| ID | Where | Drift | Notes | Fix in |
|---|---|---|---|---|
| ~~**D5**~~ | ~~`tokens.css` line 74 (`--gradient-topbar`)~~ | ~~**NEW from K3NKe3Iu pass.** Port gradient differs from tarball on three axes: (a) **angle** 135deg (diagonal) vs 90deg (horizontal); (b) light-mode end-stop color `#9333ea` vs tarball `#8b5cf6`; (c) start-stop hex `#6d28d9` vs `#6b2bd9` and middle-stop position `40%` vs `38%`.~~ | **RESOLVED 2026-05-12** — user escalated to HIGH in the sign-off call and authorized pre-audit fix. `tokens.css` now ships `linear-gradient(90deg, #6b2bd9 0%, #7c3aed 38%, #8b5cf6 100%)` per tarball spec; dark variant angle synced to 90deg for theme coherence (dark colors unchanged — audit did not flag those). Build + smoke green at fix SHA. See addendum "Freeze-override slice (2026-05-12)". | ✓ DONE |

### Cosmetic drift (LOW) — defer or fix in Sprint B0-3

| ID | Where | Drift | Re-confirmed |
|---|---|---|---|
| C1 | `detail.css` | duplicate `.row`, `.stack`, `.btn-link`, `.t-h3`, `.v2-hero-actions` rules | ✓ |
| C2 | `v2.css` lines 183 + 187 | duplicate `.v2-main { padding: … }` (second rule overrides first immediately); other dead `.v2-section` / `.v2-section-head` pairs | ✓ |
| C3 | `v2.css` | `.internals*` no-op rules | ✓ |
| C4 | `detail.tsx` | `OC_INDEX_FALLBACK` dead constant | ✓ |
| C5 | `lib/data.ts` | 7 dead exports (~96 lines: `ENGAGEMENT`, `SPRINTS`, `ACTIVE_SPRINT`, `SPRINT_PLAN_BACKLOG`, `DOC_TREE`, `DOCUMENTS`, `SMART_QUEUE`) | ✓ |
| ~~C6~~ | ~~`shell.tsx`~~ | ~~ProjectSwitcher menu lost per-row SchoolLogo + "auto-detected · Override" footer~~ | **RETIRED by K3NKe3Iu re-anchor** — switcher is now inside `ProjectContextBar`; port matches tarball |
| C7 | `shell.tsx` PageHero + `v2.css` `.v2-hero-logo` | port wraps `{logo}` in `<div className="v2-hero-logo">`; tarball uses `.v2-hero.has-logo` modifier on the header with `align-items: center; gap: 20px;` + `.v2-hero-text { padding-top: 0; }`. Visible on Project Home hero where logo is rendered at 56px. | ✓ (carries forward — different mechanism, slightly different render) |
| ~~C8~~ | ~~`v2.css` `.v2-projswitch`~~ | ~~top-bar pill padding nudged~~ | **MOOTED by K3NKe3Iu re-anchor** — projswitch lives inside `.v2-projctx`, both port and tarball override the same padding (`4px 6px 4px 4px`) at that scope |
| C9 | `pages.tsx` AskPage textarea bg subtly different | mooted — AskPage is now a "Coming soon" stub (Sprint A) |
| C10 | `pages.tsx` Autopilot eyebrow padding | ✓ |
| C11 | `pages.tsx` Methodology filter list transparency | ✓ |
| **C12** | `shell.tsx` Coming back link | **NEW.** Port `href="#/"`, tarball `href="#"`. Trivial — different empty-route normalization, both work. |
| **C13** | `v2.css` `.v2-projctx-meta` gap | **NEW from K3NKe3Iu pass.** Port `10px`, tarball `12px`. Sub-pixel; pilot-irrelevant. |

### Addendum — content land after the parity pass (commit `2cc9a46`)

The parity pass above ran at HEAD `8902109`. Commit `2cc9a46` landed 2026-05-11 PM (15:30 ET) and populates SFARCTL + SPAIDEN OC bodies (Sprint B5-1 + B5-2 pulled forward into the pre-audit window because the freeze permits data-only changes). It also reshaped `OC_DATA` from a single flat object to a `Record<string, OCDefinition>` keyed by `ocId`. Three source files moved:

- **`lib/data.ts`** — content fill (480 insertions, 103 deletions). Two new OC bodies (6 sections each), 10 new `CONFIG_FIELDS_BY_OC` rows (4 SFARCTL + 6 SPAIDEN), exported `OCSection` + `OCDefinition` types. Banner-schema-correct throughout (SFRRGCL, SPRIDEN, GTVNTYP, STVATYP, SPBPERS); methodology-guru's schema decisions logged at `.claude/agent-memory/methodology-guru/project_oc_schema_decisions.md`.
- **`components/v2/detail.tsx`** — 1 line. `ConfigurationGuidePage` now dispatches by `ocId` (`OC_DATA[ocId] ?? null`) instead of the prior hardcoded SOATERM-only check. **SOATERM render path byte-identical**; SFARCTL/SPAIDEN routes change from stub fallback to real content. Strictly inside the freeze zone but **rendering-neutral on the audited surface** — no parity claim broken (the K3NKe3Iu tarball doesn't ship SFARCTL/SPAIDEN bodies either).
- **`components/views/views-oc.tsx`** — 3 lines. Type narrowing on the unmounted legacy v1 `OCGuide` component, required because `OC_DATA`'s shape changed. No render impact (file is not mounted by anything).

Verification: `pnpm build` + `pnpm smoke` both green at `2cc9a46` (run by methodology-guru).

This addendum exists so the audit reviewer sees the post-pass content land without thinking the §2.4 / §2.10 rows are stale. The audit verdict in §6 is unchanged: HEAD is audit-clean for the 2026-05-15 firing.

### Addendum — freeze-override slice (2026-05-12 AM, PM)

User reviewed the four pending guardian-flagged calls on 2026-05-12 AM and took the aggressive disposition on all four (vs the guardian's conservative recommendations). This addendum documents what changed, why, and what it means for the audit. **The K3NKe3Iu baseline is NOT re-anchored** — the audit catalogs additions as toolkit-originals and documents the D5 fix as resolved drift.

**1. D5 fix — escalated to HIGH and resolved.**
- User escalated D5 (topbar gradient drift) from MEDIUM to HIGH in the sign-off call and authorized pre-audit fix. Guardian's MEDIUM classification noted the strip still read violet and wordmark was legible; user's HIGH call read that pixel parity on the brand strip matters for an audit narrative.
- `tokens.css` `--gradient-topbar` updated to `linear-gradient(90deg, #6b2bd9 0%, #7c3aed 38%, #8b5cf6 100%)` matching the K3NKe3Iu tarball spec on all three flagged axes (angle, light-mode end-stop, start-stop hex + mid-stop position). `--gradient-topbar-dark` angle synced to 90deg for theme coherence; dark colors unchanged (audit did not flag them).
- D5 row in §4 above marked struck-through + RESOLVED.

**2. v1-archive cull — pulled forward from Sprint B0-1.**
- User pulled forward the v1-archive deletion from post-audit (Sprint B0-1, 5/18+) into the pre-audit window. Rationale: archive is not mounted by any production code path, so deletion is freeze-tolerable (no rendered surface change). Removes 3,842 lines from the audit subject.
- Deleted: `components/views/views-{1,2,3,meta,new,oc}.tsx`, `components/{shell,icons,tweaks-panel}.tsx` (root-level legacy), `app/styles/styles.css`. `components/views/` directory auto-removed when empty.
- Verification: build + smoke green post-cull. Zero mounted-file imports referenced any of the deleted paths (verified by repo-wide grep prior to deletion).
- **Audit implication:** the §2 surface-by-surface table rows that referenced the legacy v1 files (the "port-leads-tarball" cells citing `styles.css` lines 244–246) point to a now-deleted file. They remain in the audit doc as historical context for the design-tarball-shipped values that the port corrected; they are not stale findings, they are pre-cull observations.

**3. B0-8 Work Products UI surface — pulled forward from post-audit.**
- User pulled forward Sprint B0 item B0-8 from post-audit (5/18+) into the pre-audit window with explicit freeze override (same shape as the K3NKe3Iu shell redesign override 2026-05-11 PM).
- Three new view surfaces shipped: WorkProductsKanbanPage (`#workproducts`), WorkProductDetailPage (`#workproducts/<id>`), and the new leftmost WorkProductsTab on CapabilityDetailPage. Catalogued as toolkit-originals **#9, #10, #11** in §3 above.
- Files added: `components/v2/workproducts.tsx` (~330 lines), `app/styles/workproducts.css` (~240 lines), `.claude/agent-memory/lead-developer/project_b08_workproducts_views.md` (memory entry).
- Files modified: `components/v2/detail.tsx` (+95 lines for the tab + `WorkProductsTab` component), `app/page.tsx` (+6 lines for two new route handlers), `components/v2/icons.tsx` (+2 lines for the workproducts icon), `components/v2/shell.tsx` (+1 line for the RAIL_TOP entry), `app/styles/v2.css` (+1 line for the @import).
- Known shipping debt: drag-to-change-state and real state mutations deferred to Stance B Sprint B1 (state writes need Drizzle); state-change controls fire `notImplemented` toast with explicit "Stance B B1" messaging. DRC deep-links land at `#decisions` inbox (no per-DRC route today).
- Verification: `pnpm build` + `pnpm smoke` green; both `.theme-light` and `.theme-dark` render correctly on the new surfaces; existing routes (`#mywork`, `#capabilities/<capId>`, `#guides/<ocId>`) unaffected.

**4. ProjectIdentityChip uniqueness — lock-in retired.**
- User retired the prior "item 8 is the **only** allowed toolkit-tweak beyond the literal K3NKe3Iu design" lock-in language. Beyond-design additions are now classified as toolkit-originals and catalogued in the originals memo rather than treated as audit blockers.
- Items 9–11 land under this relaxed policy. Future additions follow the same path: catalogue them in `.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md`, surface in the audit doc, no special user-authorization step required.

**Audit posture under this slice.**

The K3NKe3Iu baseline stays. The audit firing on 2026-05-15 documents:
- 11 catalogued toolkit-originals (was 8; items 9–11 from this slice).
- D5 RESOLVED (was MEDIUM; now strike-through in §4).
- v1-archive removed from subject (deleted, no parity claim possible against deleted files).
- D1–D4 still HIGH, still queued for Sprint B0-3 (not pulled forward in this slice; they're true drift requiring more careful fixes).
- C1–C5, C7, C10–C13 still LOW, still deferred to Sprint B0-3.

The audit narrative shifts slightly: it is no longer "did the port match the design?" but "did the port match the design plus document the deliberate additions?" The toolkit-originals memo carries the narrative weight for items beyond the literal design.

### Port-leads-tarball corrections (NOT drift — port is more accurate than tarball)

These are cases where the K3NKe3Iu tarball ships a bug or stale value, and the port quietly fixes it. The audit calls these intentional improvements, not drift.

| Where | Tarball value | Port value | Why port leads |
|---|---|---|---|
| `lib/data.ts` Banner form codes | `NBRPSN`, `FTVVEND`, `STVTERM_POT_*` | `NBAPOSN`, `FTMVEND`, `SOBPTRM_*` | Per methodology-guru: tarball values are Banner-schema incorrect (NBRPSN is a table not a form, FTVVEND has the wrong prefix, PoT lives on SOBPTRM not STVTERM) |
| `styles.css` `.v2-body min-height` | `calc(100vh - 56px)` | `calc(100vh - var(--topbar-height))` = `calc(100vh - 44px)` | Tarball didn't propagate the 56→44px topbar shrink |
| `styles.css` `.v2-rail` top + height | `top: 56px`, `height: calc(100vh - 56px)` | `top: var(--topbar-height)`, `height: calc(100vh - var(--topbar-height))` | Same stale-56px issue as above |
| `shell.jsx` `v2-attn` Decisions onClick | `navigate("project/decisions")` (does NOT resolve in tarball router — falls through to project home) | `navigate("decisions")` | Port matches the actual route IA |
| `home.jsx` brief / stage-banner / row navigations | `navigate("project/decisions")`, `navigate(\`project/capabilities/${id}\`)`, `navigate(\`project/workshops/${id}\`)`, `navigate(\`project/guides/${id}\`)` | top-level routes (`decisions`, `capabilities`, `workshops`, `guides`) — though without the `<id>` suffix, see D3 | Port lands on the correct route shape; the per-id deep-link drop is the D3 drift, separate concern |
| `icons.jsx` chevron-left | omitted — would render `null` inside the new `ProjectContextBar` back button | added as proper SVG case | Renders the back-arrow correctly; otherwise the new K3NKe3Iu projctx-back button has an invisible glyph |

---

## 5. Pre-audit changes — confirmed via smoke (Sprint A)

All the following landed before this audit fires. Smoke passed at the audit-input SHA.

- Banner schema corrections in `lib/data.ts` (NBRPSN→NBAPOSN, FTVVEND→FTMVEND, PoT cols, DRC-4 OC ref, FINDING_INDEX labels, is-6 rewrite)
- `bastardLoopState` → `deliveryStage` rename
- `GANTT_TODAY` runtime computation
- `app/error.tsx`, `app/not-found.tsx`, `app/loading.tsx` added
- `app/layout.tsx` pre-paint theme script
- `practice.tsx` `window.location.hash` → `navigate()`
- Autopilot dead buttons wired to `notImplemented()`
- AskPage rewritten as honest "Coming soon" state
- Settings "All connected" → "Demo data — not connected to live systems"
- Project Home brief footer demo-honesty copy
- README + BACKLOG updated (no more lies)
- `.gitignore` + `.vercelignore` configured

---

## 6. Sign-off

| Role | Sign-off | Note |
|---|---|---|
| design-fidelity-guardian | ✓ (K3NKe3Iu re-pass, 2026-05-11 PM) | §2.6 + §2.9 re-derived against `K3NKe3IuvfS03Mr6yWnkDw`. D1–D4 re-confirmed at HEAD `8902109`. D5 added (violet topbar gradient; **resolved 2026-05-12**, see addendum). C6 retired, C8 mooted. Items 7–11 added to toolkit-originals memo. |
| chief-architect | ✓ (2026-05-12 AM) | Architectural classifications confirmed for new shell slice + freeze-override slice. Path B decision logged at `.claude/agent-memory/chief-architect/project_workproducts_path_b_decision_2026_05_12.md`. |
| user | ✓ (2026-05-12 AM) | Four-call sign-off: (a) D5 escalated to HIGH and fixed pre-audit; (b) ProjectIdentityChip uniqueness lock-in **retired** — beyond-design additions classified as toolkit-originals going forward; (c) v1-archive cull **pulled forward** out of audit subject; (d) B0-8 Work Products surface **pulled forward** with freeze override, lands as toolkit-originals 9–11 with no re-baseline. See addendum "Freeze-override slice (2026-05-12)". |

### 6.1 Audit-readiness verdict for the 2026-05-15 firing

**HEAD is AUDIT-CLEAN at the K3NKe3Iu baseline** with caveats:

- All HIGH drift D1–D4 is **acknowledged and queued for Sprint B0-3**, not a blocker for the audit firing — an audit that acknowledges its own drift is honest, not failing.
- D5 was the only MEDIUM and is **RESOLVED** as of 2026-05-12 (see addendum). Gradient now matches tarball spec on all three flagged axes.
- v1-archive (~3,842 legacy lines in `components/views/*`, root-level legacy components, `app/styles/styles.css`) is **deleted** as of 2026-05-12. Removed from audit subject.
- 11 toolkit-originals catalogued (was 8; items 9–11 added 2026-05-12 from the B0-8 Work Products surface pull-forward). The originals memo carries the narrative for beyond-design additions; no per-item user authorization required going forward.
- No regressions vs. the prior `CgM4C5b7` pass. Shell-redesign implementation is sound. New WP surfaces verified on `pnpm build` + `pnpm smoke` in both themes.
- No new architecturally-significant drift surfaced by the new tarball or the freeze-override slice — the structural additions (shell redesign, Work Products surface) are user-authorized and catalogued.

### 6.2 `v0.2.0-pre-audit` tag readiness for the 2026-05-13 EOD freeze SHA

`release-manager` may cut `v0.2.0-pre-audit` at the SHA frozen 2026-05-13 EOD with the following caveats explicitly named in the tag annotation:

- The tag carries D1–D4 (pilot-blocking, queued for Sprint B0-3) as **known drift**, not regressions. D5 is RESOLVED.
- The tag carries 11 catalogued toolkit-originals (items 1–11 in §3). Items 9–11 are the B0-8 Work Products surface pulled forward from post-audit per the 2026-05-12 freeze-override slice.
- v1-archive is deleted; the tag SHA does not contain the legacy v1 files.
- The tag is the audit-input artifact, not a pilot-ready release. Sprint B0-3 closes D1–D4 + C1–C5 + C7 + C10–C13 before the pilot tag.

**No issues identified that should block either the 2026-05-15 audit firing or the `v0.2.0-pre-audit` tag.**

---

## 7. Files cited

- Current baseline tarball: `/tmp/design-K3NKe3Iu/n2s-consulting-toolkit/project/v2/{shell,practice,home,pages,detail,icons}.jsx` + `styles.css` + `detail.css`
- Prior baseline (re-anchored from): `/tmp/design-CgM4C5b7/n2s-consulting-toolkit/project/v2/*` — preserved on disk for diff-tracing only
- Port: [components/v2/{shell,practice,home,pages,detail,icons}.tsx](../../components/v2)
- Styles: [app/styles/{tokens,v2,detail}.css](../../app/styles)
- Mock data: [lib/data.ts](../../lib/data.ts)
- Pre-flight plan: [docs/MVP-PILOT-PLAN.md](../MVP-PILOT-PLAN.md)
- Toolkit-originals memo: [.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md](../../.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md)
- Tarball-hash log: [.claude/agent-memory/design-fidelity-guardian/reference_design_tarballs.md](../../.claude/agent-memory/design-fidelity-guardian/reference_design_tarballs.md)
- K3NKe3Iu scope check (product-manager): [.claude/agent-memory/product-manager/project_design_K3NKe3Iu_scope_check.md](../../.claude/agent-memory/product-manager/project_design_K3NKe3Iu_scope_check.md)
