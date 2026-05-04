# BACKLOG

## State of play (2026-05-04)

The repo has moved past the original Tier-0 BACKLOG. `app/page.tsx` now mounts the **v2 surface** (`components/v2/{shell,practice,home,pages,icons}.tsx`, styled by `app/styles/v2.css`). The legacy `components/views/*` and root-level `components/{shell,icons,tweaks-panel}.tsx` files remain in tree but are not imported anywhere mounted — they are preserved as the source-design parity reference until the May 15 drift-audit baseline is settled.

Build is green (`pnpm next build`), dev server starts clean, smoke test passes (`pnpm smoke`).

This sprint's review→fix→test cycle landed:

- Replaced 7 `alert()` dialogs with a `notImplemented(message)` toast helper (`components/v2/shell.tsx`). Toast styled via new `.v2-toast-host` / `.v2-toast` rules in `v2.css`. The prototype is now demo-safe — no flinch on a client-shared screen.
- Wired ⌘K / Ctrl-K to focus the topbar search input (was a kbd-hint lying about behaviour).
- Fixed `OC_INDEX[*].id` and downstream references: `shrnpsn` → `nbrpsn` (matches the Banner form code, was a domain inconsistency `methodology-guru` flagged).
- Added `aria-label` + `type="search"` to the search input.
- Fixed the `Coming` placeholder's "Back to home" anchor (was `href="#"`, now `href="#/"`).
- Bootstrapped a smoke gate: `scripts/smoke.sh` + `pnpm smoke` script.
- Rewrote README to describe the v2 surface; refreshed AGENTS.md.

## Open questions (need user signal)

1. **May 15 drift-audit baseline.** The source-design tarball at `https://api.anthropic.com/v1/design/h/fIMotZmRLqVfGyaje-CA1g` maps 1:1 to the legacy `views-*.jsx` files. v2 has no source counterpart. Either re-export v2 from Claude Design and re-anchor the audit to the new baseline, or run the audit against legacy v1 (acknowledging that what runs is not what's audited). `chief-architect` recommends: re-export v2 first, then audit. Blocker is at the user's seat.
2. **Legacy code removal.** Once the audit baseline is settled (per #1), `components/views/*`, `components/shell.tsx`, `components/icons.tsx`, `components/tweaks-panel.tsx`, `app/styles/styles.css` can be deleted in one commit (~2,400 lines). Don't delete pre-emptively.

## Tier 0 — small, immediately useful

1. **Wire the search input to data.** Today ⌘K focuses, but typing matches nothing. A simple in-memory match against PORTFOLIO + DRCS + OC_INDEX + WORKSHOPS would close the loop. **S–M**. Owner: `lead-developer`.
2. **Real keyboard shortcuts.** Janet's v1 muscle memory was `g h`, `g d`, `g m`, etc. Re-introduce on top of v2 routes (`g p` → project, `g d` → decisions, `g w` → workshops, etc.). Add `?` to open a cheatsheet overlay. **S**. Owner: `lead-developer`.
3. **DRC detail surface.** Today clicking a DRC shows a toast that "would open" it. The single biggest Janet-side gap (per `product-owner` review) is no per-decision context view. Could be a side drawer or a `#decisions/<id>` route. **M**. Owner: `lead-developer`, after `product-manager` scopes the IA.

## Tier 1 — pre-audit hygiene

1. **Decide v2 vs v1 audit baseline** (see Open question #1). Blocks `design-fidelity-guardian`. Owner: user.
2. **Vercel preview deploy.** No project linked. `release-manager` runs `vercel link` + first preview deploy so the user can share a URL. **S**.
3. **Light-mode walk on v2.** Tokens cover both themes; visual walk needed. Owner: `ux-visionary` then `lead-developer` for any deltas. **S**.

## Tier 2 — explicitly deferred

- **Vitest + Playwright** — not now. The smoke script (`pnpm smoke`) covers build + boot + render; framework install pends v2 stability and a real coverage target.
- **OC Guide replacement in v2.** The legacy v1 had `OCGuide` (long-scroll / sidebar-TOC / two-pane). v2 has `Coming`-placeholders for it. This is the daily-tool gap Janet flagged but it is a v2-design surface that does not exist in the source tarball — needs a Claude Design pass before implementation. Owner: `ux-visionary` + `product-manager` to package as a v2 design brief.
- **Inner Source surface.** `lib/data.ts` exports `INNER_SOURCE` (six patterns) but v2 doesn't render them. Either bring back a surface or drop the data. Defer to v2 design pass.
- **`OC_DATA`, `SMART_QUEUE`, `DOC_TREE`, `DOCUMENTS`, `MILESTONES`, `GANTT_TODAY`, `MILESTONE_TYPES`, `FINDING_INDEX`, `ENGAGEMENT`, `ACTIVE_SPRINT`, `SPRINT_PLAN_BACKLOG`** — exported from `lib/data.ts`, unused by v2. Keep for now (zero runtime cost; possible reuse when v2 grows). Drop at the same time legacy code is removed if still unused.

## Out of scope this sprint

- New features: workshop prep aggregator, "you-are-here" presentation mode, drift-vs-baseline diff view inside an OC guide, Gantt milestone markers. All net-new design surface; route to v2 design brief.
- Auth, persistence, real Jira/Smartsheet integration. Prototype-only.
