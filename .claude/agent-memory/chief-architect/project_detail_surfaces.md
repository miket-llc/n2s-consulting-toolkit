---
name: Capability detail + Configuration guide ported
description: Tarball 1RfZ75xy (2026-05-05) added detail.tsx/detail.css covering two new routes. Self-contained synthesized inline data, brief at §11 flags follow-ups.
type: project
---

**Date:** 2026-05-07

**What:** Ported `v2/detail.jsx` + `v2/detail.css` from design tarball `1RfZ75xyWLRCReEBkJ25nw` (drop dated 2026-05-05).

- `components/v2/detail.tsx` (1,501 lines) — `CapabilityDetailPage` (`#capabilities/<capId>`) and `ConfigurationGuidePage` (`#guides/<ocId>`).
- `app/styles/detail.css` (615 lines) — `.d-*` prefixed; imported by `v2.css`. Token remap applied: `--surface→--bg-panel`, `--surface-alt→--bg-elevated`, `--text→--text-primary`, `--text-soft→--text-secondary`, `--radius-2→--radius-md`. Other tokens unchanged.
- Routing in `app/page.tsx` parses sub-paths; index routes still served by existing pages.
- Synthesized inline data (`DETAIL_BY_CAP`, `BUDGET_BY_CAP`, `OC_INDEX_FALLBACK`) deliberately kept inline per source intent.

**Why this matters for drift audits:** The 2026-05-15 audit baseline now includes these two surfaces. The `--font-display` fallback was stripped (we don't ship a display font token). All hardcoded color fallbacks in `detail.css` (e.g. `var(--emerald, #15795a)`) are unreachable in practice but technically inaccurate vs. our `--emerald: #3ee8a8` (dark) / `#059669` (light). Flag as cosmetic-only at audit time; not worth fixing.

**Open follow-ups (per brief §11):**
1. Sprint 0 / AAW → Workshops surface — separate brief pending.
2. Activity feed — synthesized today; real event source TBD.
3. Capability inventory — keep curated 12 + xlsx mapping rather than expand to ~30.
4. Optional schema additions on `BUSINESS_CAPABILITIES` / `DRC` (`xlsxRowIds`, `bastardLoopState`, `signedBy`, `hash`, `recommendation`, etc.) — not yet added to `lib/data.ts`; ports synthesize them inline. Fold into typed data once real values arrive.

**Chat7 leftover:** User asked for serif-font resurrection (Source Serif 4 / Newsreader for editorial moments — Practice home brief, OC headlines on detail pages). Chat got cut mid-implementation; not implemented. Reopen with ux-visionary if the user follows up.
