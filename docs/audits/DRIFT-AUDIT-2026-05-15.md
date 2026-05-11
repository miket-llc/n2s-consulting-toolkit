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

The tarball ships its active design surface under `project/v2/*.jsx` plus `project/Ellucian Consulting Toolkit.html` as the host. v2 here (`components/v2/*.tsx`) maps to `project/v2/*` 1:1 by file name. The tarball also preserves a `project/v1-archive/` set that mirrors this port's `components/views/*` and root-level `components/{shell,icons,tweaks-panel}.tsx`. The new `K3NKe3Iu` baseline additionally bundles 7 design-chat transcripts under `project/chats/*.md`; intent for the shell redesign lives in `chat7.md` (search "i feel like we abandoned").

For each ported surface, every diff vs. tarball is classified into one of three buckets:

- **(I) Intentional** — TypeScript/Next.js conversion, route adaptation, prototype-hardening (notImplemented toasts, ⌘K wiring, theme persistence, error boundary). Expected; not drift.
- **(D) Drift** — accidental deviation from tarball intent. Must fix.
- **(O) Toolkit-original** — surface or behaviour added in this port that does NOT exist in the tarball. Classified deliberately as intentional addition, recorded in `.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md`.

---

## 2. Audit summary — surface-by-surface

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
| `CONFIG_FIELDS_BY_OC` only SOATERM populated | O | acceptable for pilot; SFARCTL + SPAIDEN queued Sprint B |
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

### 2.6 `shell.tsx` — top bar / rail / shell

| Diff | Class | Note |
|---|---|---|
| `notImplemented()` + `ToastHost` system | **O** | **toolkit-original** — 4th to formally classify; flag now |
| ⌘K / Ctrl-K wired to focus search input | **O** | **toolkit-original** — 5th to formally classify; flag now |
| ProjectSwitcher lost per-row `SchoolLogo` + "auto-detected · Override" footer | D | Sprint B (should-have) — restore monogram in switcher menu |
| `PageHero.has-logo` rule lost | D | Sprint B should-have |
| `.v2-projswitch` top-bar pill padding nudged | D (cosmetic) | Sprint B |

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

### 2.9 Styles

| File | Diff | Class | Note |
|---|---|---|---|
| `app/styles/tokens.css` | parity | I | clean |
| `app/styles/v2.css` | appended `.v2-mywork-viewtoggle`, `.v2-board-*`, `.v2-gantt-*` blocks | O | toolkit-original styles for toolkit-original surfaces |
| `app/styles/detail.css` | appended `.d-configtable-*` | O | toolkit-original |
| `app/styles/detail.css` | duplicates of `.row`, `.stack`, `.btn-link`, `.t-h3`, `.v2-hero-actions` | D | Sprint B16 cull |
| `app/styles/v2.css` | undefined `--surface-1` / `--surface-2` tokens used 7× (Autopilot pane visually broken in both themes) | **D · HIGH** | **Sprint B11 must-have** |
| `app/styles/v2.css` | dead `.v2-main` padding (179–183), dead `.v2-section`/-head (662–667), `.internals*` no-ops (51–53) | D (cosmetic) | Sprint B16 cull |
| `app/styles/detail.css` | dark-only `.d-code` background (`#0b1018`) — broken in light mode | **D · HIGH** | **Sprint B12 must-have** |

### 2.10 `lib/data.ts`

| Diff | Class | Note |
|---|---|---|
| `MILESTONES`, `GANTT_TODAY`, `MILESTONE_TYPES`, `FINDING_INDEX` data shapes | I | parity with tarball `data-v2.js` |
| `GANTT_TODAY` now computed at module load instead of hardcoded May 1 | I | Sprint A A14; runtime-honest replacement, no shape change |
| Banner schema fixes — `nbrpsn→nbaposn`, `ftvvend→ftmvend`, PoT cols → `SOBPTRM_*`, DRC-4 OC ref, FINDING_INDEX labels | I | Sprint A A17; correctness fix per `methodology-guru`. The tarball ships the **wrong** form codes; the port is more accurate. Audit calls this an intentional improvement. |
| `is-6` Inner Source rewrite (Vendor → FTMVEND + 1099) | I | Sprint A A18; correctness + attribution |
| `CONFIG_FIELDS_BY_OC` (new entity, SOATERM only) | O | toolkit-original |
| `TaskStatus` union + `TASK_STATUSES` const | O | toolkit-original for kanban |
| Dead exports: `ENGAGEMENT`, `SPRINTS`, `ACTIVE_SPRINT`, `SPRINT_PLAN_BACKLOG`, `DOC_TREE`, `DOCUMENTS`, `SMART_QUEUE` | D (cosmetic) | Sprint B2 cull |

---

## 3. Toolkit-original additions — formal classification

Six surfaces / behaviours in this port have no tarball counterpart and are recorded as **intentional toolkit-originals**. The audit does NOT report these as drift.

| # | Surface | Where | Classified at |
|---|---|---|---|
| 1 | MyWork kanban toggle (Buckets \| Board) | `pages.tsx` MyWorkPage | 2026-05-11 (this slice) |
| 2 | Schedule 12-month gantt | `pages.tsx` SchedulePage | 2026-05-11 |
| 3 | Configuration Guide config-fields table | `detail.tsx` ConfigFieldsTable | 2026-05-11 |
| 4 | `notImplemented()` + `ToastHost` toast system | `shell.tsx` | 2026-05-15 (this audit) |
| 5 | ⌘K / Ctrl-K search-focus shortcut | `shell.tsx` | 2026-05-15 (this audit) |
| 6 | Top-level render-error boundary (`app/error.tsx`, `not-found.tsx`, `loading.tsx`) | `app/` | 2026-05-15 (this audit) |

Update `.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md` after this audit fires to include the new items 4-6.

---

## 4. Drift findings — what blocks pilot vs. cosmetic

### Pilot-blocking drift (HIGH)

| ID | Where | Drift | Fix in |
|---|---|---|---|
| D1 | `v2.css` | undefined `--surface-1` / `--surface-2` tokens → Autopilot visually broken | Sprint B11 |
| D2 | `detail.css` | dark-only `.d-code` background → Configuration Guide code blocks unreadable in light mode | Sprint B12 |
| D3 | `home.tsx` | capability/guide/workshop rows lost deep-link target | Sprint B6, B7 |
| D4 | `pages.tsx` DecisionsPage | DRC row toasts instead of navigating to OC section | Sprint B5 |

### Cosmetic drift (MEDIUM/LOW) — defer or fix in Sprint B16

| ID | Where | Drift |
|---|---|---|
| C1 | `detail.css` | duplicate `.row`, `.stack`, `.btn-link`, `.t-h3`, `.v2-hero-actions` rules |
| C2 | `v2.css` | dead `.v2-main` / `.v2-section` rule pairs |
| C3 | `v2.css` | `.internals*` no-op rules |
| C4 | `detail.tsx` | `OC_INDEX_FALLBACK` dead constant |
| C5 | `lib/data.ts` | 7 dead exports (~96 lines) |
| C6 | `shell.tsx` | ProjectSwitcher menu lost per-row SchoolLogo + "auto-detected · Override" footer |
| C7 | `shell.tsx` | `PageHero.has-logo` rule lost |
| C8 | `v2.css` | `.v2-projswitch` top-bar padding nudged |
| C9 | `pages.tsx` AskPage textarea bg subtly different (now stub, mooted) |
| C10 | `pages.tsx` Autopilot eyebrow padding |
| C11 | `pages.tsx` Methodology filter list transparency |

### Banner-schema corrections (NOT drift — port more accurate than tarball)

The tarball ships `NBRPSN`, `FTVVEND`, `STVTERM_POT_CODE`, `STVTERM_POT_CENSUS_IND`. Per methodology-guru, all four are **Banner-schema incorrect** (NBRPSN is a table not a form, FTVVEND has the wrong prefix, PoT records live on SOBPTRM not STVTERM). The port now ships the correct names. The tarball is wrong here; the port leads.

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
| design-fidelity-guardian | ✓ | This audit. Drift items D1–D4 acknowledged; fix queued for Sprint B. |
| chief-architect | pending user approval | Architectural classifications confirmed |
| user | pending | Confirm: re-anchor baseline to v2-only post-audit (delete `components/views/*` + root-level v1) → Sprint B1 |

Audit complete. Sprint B may proceed when `main` is unfrozen post-2026-05-15.

---

## 7. Files cited

- Tarball baseline: `/tmp/design-CgM4C5b7/n2s-consulting-toolkit/project/v2/{shell,practice,home,pages,detail,icons}.jsx` + `styles.css` + `detail.css`
- Port: [components/v2/{shell,practice,home,pages,detail,icons}.tsx](../components/v2)
- Styles: [app/styles/{tokens,v2,detail}.css](../app/styles)
- Mock data: [lib/data.ts](../lib/data.ts)
- Pre-flight plan: [docs/MVP-PILOT-PLAN.md](../docs/MVP-PILOT-PLAN.md)
- Toolkit-originals memo: [.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md](../.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md)
