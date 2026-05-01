# BACKLOG

## State of play

We are a 3-commit greenfield port of a Claude Design prototype to Next.js 16. Build is green; no Vercel project, no tests, no CI, README still describes the deleted `public/proto/` setup. Prime constraint is pixel parity with the source design; the only hard gate is the **May 15 drift audit at 9am ET** — anything that adds a new design surface before then is a liability.

## Tier 0 — Wire up what's already in the design

Existing UI wired only halfway. No new surfaces, no drift cost.

1. **Capabilities filter buttons** — `views-2.tsx:19,36–38` sets `filter` state but never applies it to `grouped`. Owner: `lead-developer`. **S**. Control renders, doesn't work.
2. **Cockpit rows clickable** — `views-3.tsx:283` has `cursor: pointer` and copy says "click to drill in" but no `onClick`. Owner: `lead-developer`. **S**. False affordance.
3. **Schedule lanes clickable** — `views-1.tsx:292` copy says "click any lane" but lanes have no handler. Owner: `lead-developer`. **S**. Same pattern.
4. **"Open in Jira" / "Open in Smartsheet" buttons → ExternalDrawer** — `views-1.tsx:297`, `views-new.tsx:575`. Drawer is wired from Tweaks; in-page buttons are inert. Owner: `lead-developer`. **S**. Resolves Janet's real-vs-mock ambiguity.
5. **Bell popover** — `shell.tsx:172` renders badge "3" with no panel. Owner: `lead-developer`. **S**. Minimal popover with three items mirroring `lib/data.ts` (DRCs, smart queue, autopilot finding).
6. **Today line on Gantt** — `views-1.tsx:324` has the comment + empty wrapper. Owner: `lead-developer`. **S**. One absolutely-positioned div.
7. **OC layout toggle in OC bar** — control exists in Tweaks (`page.tsx:175–181`); duplicate as a segmented control on the OC guide header. Owner: `lead-developer` w/ `design-fidelity-guardian` review. **S**. Tweaks is dev scaffolding; layout toggle is user-facing per the design's three-layout intent.

## Tier 1 — Pre-audit hygiene (must land before May 15)

8. **README rewrite** — currently describes `public/proto/index.html` redirect that no longer exists. Owner: `docs-leader`. **M**. No design dependency. Highest priority — the repo currently misleads anyone landing on it.
9. **Drift baseline pass** — `design-fidelity-guardian` walks every route against the source design, files a single tracked-issues list of visual deltas. Owner: `design-fidelity-guardian`. **M**. Gives the audit a known-state to diff against; surfaces fixes worth landing pre-audit.
10. **Light-mode polish on rendered surfaces** — light theme is wired (`page.tsx:53`); confirm tokens don't regress. No new surfaces. Owner: `design-fidelity-guardian` flags, `lead-developer` fixes. **S–M**. Only fix what #9 flags.
11. **Hide dev-only rail entries behind a flag** — `components`, `navspec` are meta routes. Add a `?dev=1` query gate so the audit doesn't treat them as primary. Owner: `lead-developer`. **S**.

## Tier 2 — Cuts and de-prioritizations

- **Tweaks panel as user-facing surface** — *project decision, not a deletion*. Keep as design-time tool, gate visibility behind `?tweaks=1`. Janet is right consultants shouldn't see it; we still need it for demos and design QA.
- **Methodology library top-rail entry** — *defer*. "Move under Resources" is a nav restructure; nav structure comes from the design. Bundle into v2 brief.
- **Components / NavSpec rail entries** — *gate, don't delete* (Tier 1 #11).
- **Recent Activity card on Project Home** — *leave*. Filler but pixel-faithful filler. Removing creates drift; replacing with real data is feature-ahead-of-design. v2.
- **Duplicate sparkline** — *leave*. Header pill + sprint card is intentional and in design.

## Out of scope here — design-tool requests

Verified absent from `components/views/*`, so these are net-new features, not implementation gaps. Each is a real consulting need per Janet, but the right shop is `claude.ai/design` for a v2 design pass — not this team building ahead of spec.

- **DRC inbox as first-class rail item.** DRC data exists scattered in `lib/data.ts`; no aggregated view. Convincing v2 ask.
- **"You are here" presentation mode.** Hide Jira IDs, sync timestamps, internal chips for client screen-shares. Real need; net-new global mode needing design treatment.
- **Workshop / session prep page.** Aggregator over DRCs, OC sections, test cases, attendees. Whole new page with new IA.
- **Drift-vs-baseline diff view inside OC guide.** Autopilot finding → highlighted field in live preview. Significant new visualization.
- **Gantt milestone markers, Autopilot drift-trend, OC cross-ref linking, DRC linkage in Documents, needs-my-signature filter, version history.** Bundle.

Action: `product-manager` drafts a single v2 design brief packaging these with Janet's justification; `ux-visionary` takes it into Claude Design.

## Sequenced execution plan

Run in order. **‖** = parallel with the line above.

1. `docs-leader` — rewrite README (Tier 1 #8). M. No deps. **Start here.**
2. `design-fidelity-guardian` — drift baseline walk (Tier 1 #9). M. ‖ with #1.
3. `lead-developer` — Capabilities filter (Tier 0 #1). S. ‖ with #1, #2.
4. `lead-developer` — Cockpit + Schedule row clickability (Tier 0 #2, #3). S.
5. `lead-developer` — External-drawer button wiring (Tier 0 #4). S.
6. `lead-developer` — Bell popover (Tier 0 #5). S.
7. `lead-developer` — Today line on Gantt (Tier 0 #6). S.
8. `design-fidelity-guardian` then `lead-developer` — OC layout toggle in OC bar (Tier 0 #7). S. After #2.
9. `lead-developer` — dev-rail flag gate (Tier 1 #11). S. ‖ with #8.
10. `lead-developer` — light-mode fixes from #2 list (Tier 1 #10). S–M. After #2.
11. `product-manager` + `ux-visionary` — package v2 design brief. Async, doesn't block code.
12. `release-manager` — May 14 pre-audit dry run.

## Acceptance criteria for the next two items

### Item 1 — Rewrite README (`docs-leader`)

**Done when:**
- README no longer mentions `public/proto/`, Babel-standalone, or `next.config.ts redirects`.
- Run instructions accurate: `pnpm install && pnpm dev`, app served from `app/page.tsx`.
- "What's in here" reflects actual structure: `app/`, `components/{views,shell,icons,tweaks-panel}`, `lib/data.ts`.
- Keyboard shortcuts verified against `app/page.tsx:84–123`.
- Mock engagement section retained verbatim — accurate.

**Out of scope:** architecture diagrams, contributing guide, deployment instructions.

### Item 2 — Drift baseline walk (`design-fidelity-guardian`)

**Done when:**
- A single file (`docs/drift-baseline-2026-05-01.md`) lists every visual delta, route by route, between the source design and the running implementation.
- Each delta classified: `fix-now`, `accept` (design moved, we match newer intent), `defer`.
- For each `fix-now`, the file/line is named.
- Output is consumable by `lead-developer` without re-interpretation.

**Out of scope:** light-mode regressions (Tier 1 #10 follow-up); new-feature recommendations (v2 brief); any change introducing a design surface not in the source.

## What you're explicitly not doing

We are not building a DRC inbox, presentation mode, workshop-prep page, drift-diff view, milestone markers, or any of Janet's other "to add" items this iteration — each is net-new design surface and the prime constraint is parity with the source before May 15. We are not deleting the Tweaks panel, Recent Activity card, duplicate sparkline, or Methodology rail entry — they're in the design and removing them creates drift we can't justify. We are not setting up Vercel, CI, or tests this sprint — none of that closes drift or unblocks the audit. Janet's signal is good and most of it lands in a v2 design brief; this sprint closes the gap between what the design says and what the implementation does.
