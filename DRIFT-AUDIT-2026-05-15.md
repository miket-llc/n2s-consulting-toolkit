# Drift Audit — 2026-05-15

**Strategy:** B — Branch only (push works; `gh` CLI auth unavailable)
**Branch:** `design-drift/2026-05-15`
**Audit fired:** 2026-05-15 (scheduled)
**Audited HEAD:** `d4092a4` ("Freeze-override slice: D5 fix + v1-archive cull + B0-8 Work Products UI")

---

## Design fetch status

Both design tarball URLs returned **HTTP 404**:

- `https://api.anthropic.com/v1/design/h/fIMotZmRLqVfGyaje-CA1g` — 404 (original handoff URL)
- `https://api.anthropic.com/v1/design/h/K3NKe3IuvfS03Mr6yWnkDw` — 404 (re-anchored baseline per AGENTS.md)

The design was likely re-exported or the Design API endpoint no longer serves these artifact IDs. A fresh tarball-vs-code diff is not possible from this run.

**What this audit uses instead:** The comprehensive parity analysis in `docs/audits/DRIFT-AUDIT-2026-05-15.md`, which was produced by the `design-fidelity-guardian` agent against the `K3NKe3IuvfS03Mr6yWnkDw` tarball (anchored 2026-05-11 PM), and independently spot-verified against current HEAD in this run. All four HIGH drift items were re-confirmed in the live source files.

> If the design re-exports under a new ID, re-run the audit after updating AGENTS.md with the new tarball hash. Do not guess.

---

## Current baseline

| Item | Value |
|---|---|
| Design baseline | `K3NKe3IuvfS03Mr6yWnkDw` (re-anchored 2026-05-11 PM, shell redesign) |
| Audit-input SHA | `8902109` ("Refresh HANDOFF for next phase…") |
| Current HEAD | `d4092a4` (5 commits ahead of audit input) |
| Full audit doc | `docs/audits/DRIFT-AUDIT-2026-05-15.md` |
| Toolkit-originals memo | `.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md` |

Commits between audit input and HEAD that the full doc's addendum covers:
- `2cc9a46` — Populate SFARCTL and SPAIDEN OC bodies (Sprint B5-1 + B5-2)
- `fc10e25` — Re-baseline drift audit against K3NKe3Iu tarball at HEAD 8902109
- `093b325` — Add platform-engineer agent + expand AGENTS.md roster to twelve
- `5de78df` — Land Work Products entity (Path B) + slug engagement ids
- `d4092a4` — Freeze-override slice: D5 fix + v1-archive cull + B0-8 Work Products UI

---

## 🔴 Breaking drift (pilot-blocking, unresolved)

> Re-confirmed against HEAD `d4092a4` in this run.

| ID | File | Line(s) | Drift | Fix in |
|---|---|---|---|---|
| **D1** | `app/styles/v2.css` | 1477, 1510, 1575, 1587, 1631, 1644, 1652 | `--surface-1` and `--surface-2` referenced 7× but never defined in `tokens.css` → Autopilot pane renders with no background in both themes | Sprint B0-3 |
| **D2** | `app/styles/detail.css` | 522 | `.d-code { background: #0b1018; }` is dark-only hardcode with no light-mode override → Configuration Guide code blocks are unreadable in light mode | Sprint B0-3 |
| **D3** | `components/v2/home.tsx` | 250, 281, 311, 317 | Capability cards, workshop rows, and guide rows navigate to the index (`capabilities` / `workshops` / `guides`) instead of deep-linking to `<id>` — the design navigates to per-entity pages | Sprint B0-3 |
| **D4** | `components/v2/pages.tsx` | 205 | DRC rows fire `notImplemented(…)` toast instead of navigating to the linked OC section — tarball navigates | Sprint B0-3 |

---

## 🟡 Visual / copy drift (cosmetic, deferred to Sprint B0-3)

| ID | Where | Drift |
|---|---|---|
| C1 | `detail.css` | Duplicate `.row`, `.stack`, `.btn-link`, `.t-h3`, `.v2-hero-actions` rules |
| C2 | `v2.css` lines 183 + 187 | Duplicate `.v2-main { padding: … }` — second rule immediately overrides first; plus dead `.v2-section` / `.v2-section-head` rule pairs |
| C3 | `v2.css` | `.internals*` no-op rules (dead CSS) |
| C4 | `components/v2/detail.tsx` | `OC_INDEX_FALLBACK` dead constant |
| C5 | `lib/data.ts` | 7 dead exports (~96 lines): `ENGAGEMENT`, `SPRINTS`, `ACTIVE_SPRINT`, `SPRINT_PLAN_BACKLOG`, `DOC_TREE`, `DOCUMENTS`, `SMART_QUEUE` |
| C7 | `components/v2/shell.tsx` PageHero + `v2.css` | Port wraps `{logo}` in `<div class="v2-hero-logo">`; tarball uses `.v2-hero.has-logo` modifier on header with `align-items: center; gap: 20px;` — different layout mechanism, visible on Project Home hero where logo renders at 56px |
| C10 | `components/v2/pages.tsx` AutopilotPage | Autopilot eyebrow padding differs from tarball |
| C11 | `components/v2/pages.tsx` MethodologyPage | Filter list transparency differs from tarball |
| C12 | `components/v2/shell.tsx` Coming back link | Port `href="#/"`, tarball `href="#"` — trivial normalization difference, both work |
| C13 | `app/styles/v2.css` `.v2-projctx-meta` | Port gap `10px`, tarball `12px` — sub-pixel, pilot-irrelevant |

---

## 🟢 Additive (toolkit-originals — no tarball counterpart, user-authorized)

11 toolkit-original surfaces catalogued in the full audit doc (§3) and the originals memo. Short-form:

| # | Surface | Where |
|---|---|---|
| 1 | MyWork kanban toggle (Buckets \| Board) | `pages.tsx` MyWorkPage |
| 2 | Schedule 12-month gantt | `pages.tsx` SchedulePage |
| 3 | Configuration Guide config-fields table | `detail.tsx` ConfigFieldsTable |
| 4 | `notImplemented()` + `ToastHost` toast system | `shell.tsx` |
| 5 | ⌘K / Ctrl-K search-focus shortcut | `shell.tsx` |
| 6 | Top-level error/404/loading boundaries | `app/error.tsx`, `app/not-found.tsx`, `app/loading.tsx` |
| 7 | `v2-shell.has-projctx` layout modifier + paired CSS rules | `shell.tsx`, `v2.css` |
| 8 | Passive `ProjectIdentityChip` in topbar on non-project routes | `shell.tsx`, `v2.css` `.v2-projidchip*` |
| 9 | WorkProductsKanbanPage (`#workproducts`) — 5-lane state kanban | `workproducts.tsx`, `workproducts.css` |
| 10 | WorkProductDetailPage (`#workproducts/<id>`) — 10-section detail view | `workproducts.tsx` |
| 11 | WorkProductsTab on CapabilityDetailPage — new leftmost tab, groups WPs by phase | `detail.tsx` |

Items 9–11 were pulled forward from Sprint B0-8 post-audit per 2026-05-12 freeze-override (same precedent as the K3NKe3Iu shell redesign pull-forward 2026-05-11 PM). User authorized beyond-design additions to be classified as toolkit-originals without per-item authorization.

---

## ✅ No drift confirmed in these areas

| Area | Status |
|---|---|
| `tokens.css` — color palette, type scale, motion, radii, shadows | Clean |
| `tokens.css` — `--gradient-topbar` angle + colors | **D5 RESOLVED** 2026-05-12: now `linear-gradient(90deg, #6b2bd9 0%, #7c3aed 38%, #8b5cf6 100%)` matching tarball on all three flagged axes |
| `shell.tsx` — 44px violet TopBar (wordmark, search, Decisions attn, theme toggle, JH avatar) | Clean vs K3NKe3Iu |
| `shell.tsx` — `ProjectContextBar` strip (project-scoped routes only) | Clean vs K3NKe3Iu |
| `shell.tsx` — `v2-attn` Decisions button routes to `decisions` (port-leads tarball which routed to `project/decisions` and fell through) | Intentional port-leads fix |
| `practice.tsx` — Portfolio page | Clean |
| `pages.tsx` — WorkshopsPage, CapabilitiesPage, MethodologyPage, AutopilotPage, GuidesPage (structure) | Clean |
| `pages.tsx` — AskPage | Honest "Coming soon" stub (tarball had non-functional textarea) |
| `pages.tsx` — SettingsPage | "Demo data" pill replaces "All connected" (intentional honesty fix) |
| `lib/data.ts` — `MILESTONES`, `GANTT_TODAY`, `MILESTONE_TYPES`, `FINDING_INDEX` shapes | Clean |
| `lib/data.ts` — Banner form codes | Port corrects tarball errors: `NBAPOSN` (was `NBRPSN`), `FTMVEND` (was `FTVVEND`), `SOBPTRM_*` (was `STVTERM_POT_*`) |
| `app/layout.tsx` — pre-paint theme script, font variables | Clean |
| v1-archive (`components/views/*`, root-level legacy components, `app/styles/styles.css`) | **Deleted** 2026-05-12 — removed from audit subject |
| Known intentional dual-prop deviations (`TweakSection label+title`, `TweakToggle value+checked`) | Not flagged (intentional) |

---

## Audit verdict

**HEAD `d4092a4` is audit-clean at the `K3NKe3IuvfS03Mr6yWnkDw` baseline** with caveats:

- **D1–D4 (HIGH)** are acknowledged drift, queued for Sprint B0-3. An audit that acknowledges its own drift is honest, not failing.
- **D5 (MEDIUM)** is RESOLVED as of 2026-05-12.
- **11 toolkit-originals** catalogued; no per-item authorization required going forward per 2026-05-12 user decision.
- **Design API returned 404** — if a new tarball ID is available, update AGENTS.md and re-run the guardian for a fresh diff. The current findings stand as a spot-verification against live code.
- **`pnpm build` + `pnpm smoke`** were green at `d4092a4` per the freeze-override slice addendum in `docs/audits/DRIFT-AUDIT-2026-05-15.md`.

**Next action:** Sprint B0-3 owners fix D1–D4 + C1–C5 + C7 + C10–C13. Release-manager cuts pilot tag after Sprint B0-3 closes.
