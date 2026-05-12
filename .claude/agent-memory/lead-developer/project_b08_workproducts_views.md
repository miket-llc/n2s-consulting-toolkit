---
name: B0-8 Work Products UI surface
description: Files added/changed, CSS classes, judgment calls, known debt, and toolkit-originals for B0-8
type: project
---

## Sprint B0-8 — Work Products UI surface

**Date landed:** 2026-05-12

---

## Files added / changed

| File | Lines (approx) | Change type |
|---|---|---|
| `app/styles/workproducts.css` | ~240 | Added (new) |
| `components/v2/workproducts.tsx` | ~330 | Added (new) |
| `components/v2/detail.tsx` | +90 | Edited — new tab + WorkProductsTab fn |
| `app/page.tsx` | +5 | Edited — 2 new routes |
| `components/v2/icons.tsx` | +2 | Edited — "workproducts" icon added |
| `components/v2/shell.tsx` | +1 | Edited — RAIL_TOP entry added |
| `app/styles/v2.css` | +1 | Edited — @import workproducts.css |

---

## New CSS classes introduced (`.v2-wp-*`)

All in `app/styles/workproducts.css`:

- `.v2-wp-board` — 5-col kanban grid (mirrors `.v2-board` pattern)
- `.v2-wp-filterbar` — sticky filter strip above kanban
- `.v2-wp-filtergroup` — horizontal chip row within filter bar
- `.v2-wp-filterlabel` — mono label prefix for each filter row
- `.v2-wp-chip` / `.v2-wp-chip.is-active` — multi-select toggle chip
- `.v2-wp-col` / `.v2-wp-colhead` / `.v2-wp-collabel` / `.v2-wp-colcount` — lane primitives
- `.v2-wp-empty` — subdued "—" empty lane placeholder
- `.v2-wp-card` / `.v2-wp-cardtitle` / `.v2-wp-cardmeta` — kanban cards
- `.v2-wp-engchip` — engagement chip (school short name + SchoolLogo)
- `.v2-wp-detail` — max-width wrapper for detail page (760px)
- `.v2-wp-header` / `.v2-wp-header-chips` / `.v2-wp-header-sub` — detail header region
- `.v2-wp-prose` — body text paragraphs
- `.v2-wp-raci` / `.v2-wp-raci-letter` — RACI 2-column table
- `.v2-wp-updown` — 2-col prerequisites/feeds-into grid
- `.v2-wp-linklist` / `.v2-wp-link` — link list items (OC, DRC, WP cross-links)
- `.v2-wp-state-ctrl` / `.v2-wp-state-ctrl-label` / `.v2-wp-state-ctrl-actions` — state footer
- `.v2-wp-tabphase` — phase group header row in cap tab
- `.v2-wp-tabrow` / `.v2-wp-tabtitle` / `.v2-wp-tablinks` — WP rows in cap detail tab

---

## Judgment calls

1. **Work Products tab as new default.** Changed `CapabilityDetailPage` tab default from
   `"delivery"` to `"workproducts"`. Users with an existing stored tab preference keep
   their stored value; new sessions open to Work Products. Matches spec ("defaults to
   active when no `?tab=` is set").

2. **Filter persistence shape.** Persisted to `localStorage["v2.workproducts.filters"]`
   as `{ phases: string[], engagements: string[], owners: string[] }`. Empty arrays = all
   (no restriction). Matches toolkit convention (`v2.mywork.view`, `v2.workproducts.filters`).

3. **State button affordance.** Clicking any state transition button fires
   `notImplemented("Mark as … — state writes land in Stance B · Sprint B1")`.
   Buttons are visible and tabbable; they intentionally feel real without mutating data.
   Toast message explicitly names the Stance B sprint so the consultant isn't confused.

4. **Phase chip uses existing `.pill-*` token classes** — discover→cyan, design→violet,
   build→accent, validate→amber, deploy→emerald, stabilize→emerald. No new hex colors
   or CSS variables introduced. Same mapping used in both kanban cards and detail header.

5. **Engagement-wide WPs excluded from capability tab.** Per spec: WPs where
   `capability_id` is undefined (Engagement Charter, RAID Log) only appear in the
   portfolio kanban, not on the capability-scoped tab.

6. **Rail item added.** `workproducts` added to `RAIL_TOP` in `shell.tsx` so the surface
   is reachable from the nav. The spec called it a "practice-wide route like mywork"; mywork
   has a rail item, so this is implied.

7. **WorkProductsTab in detail.tsx, not workproducts.tsx.** Kept as a co-located local
   function in `detail.tsx` (same file as `CapabilityDetailPage`) to avoid a circular
   import chain (detail.tsx imports from data.ts; workproducts.tsx also imports from data.ts
   — fine. But having detail.tsx import from workproducts.tsx and workproducts.tsx import
   from shell.tsx which imports from data.ts is clean). The tab function is small (~70 lines)
   and doesn't justify a cross-file import for readability.

8. **RACI table uses surface-flat wrapper.** Applied `surface-flat` class from existing
   token set (bg-panel + border + border-radius) around the `<table>` element to give it
   a card appearance without adding new surface CSS.

---

## Known shipping debt

| Item | Deferred to | Notes |
|---|---|---|
| Drag-and-drop state change | Stance B · Sprint B1 | Needs persistent state write. Toast affordance in place. |
| Real state mutations | Stance B · Sprint B1 | State control buttons wire to `notImplemented`. |
| Per-DRC deep links from WP detail | Stance B · future | DRC links navigate to `#decisions` inbox; no per-DRC route exists today. |
| Acceptance criteria at OC level | Post-pilot | Not in B0-8 scope per chief-architect memory doc. |

---

## New toolkit-originals introduced

These surfaces are not in the K3NKe3Iu tarball; design-fidelity-guardian should catalog
them in `project_toolkit_original_additions.md` as toolkit-originals 9–11:

| # | Name | Route | Description |
|---|---|---|---|
| 9 | WorkProductsKanbanPage | `#workproducts` | Portfolio-wide 5-lane kanban of methodology deliverables |
| 10 | WorkProductDetailPage | `#workproducts/<id>` | Vertical-section detail for a single work product |
| 11 | WorkProductsTab (in CapabilityDetailPage) | `#capabilities/<capId>` tab | Leftmost tab on capability detail, phase-grouped WP list |
