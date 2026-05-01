# Drift Baseline — 2026-05-01

Source: prototype delivered via Claude Design as `public/proto/*` (was never committed to git in this repo; recovered for this walk from prior session tool-output, `/tmp/proto-src/`).
Implementation: current `main` (`70dfbef`).
Walked by: design-fidelity-guardian.

## Note on source recovery

The instructions assumed the prototype was committed at `92a1b6f` and removed at `976b329`. That isn't what happened in this repo: `92a1b6f` is the bare `create-next-app` initial commit (no `public/proto/`), and `976b329` is the port itself, which added `app/`, `components/`, `lib/data.ts` directly without an intermediate proto-commit. `git fsck`, `--reflog`, stashes, branches and tags all show no orphan or lost objects containing the proto files.

The proto files were however still recoverable: a previous `design-fidelity-guardian` subagent in the same Claude Code session had `Read`-tool'd them before they were deleted from disk, so their full text survives in `~/.claude/projects/.../subagents/agent-a6ca4257eb1c5ad47.jsonl`. Those captures (`/tmp/proto-src/*.jsx`, `*.js`, `*.html`) were used as source-of-truth for this walk. Line counts match the port within a few lines per file (TS imports + types account for the deltas).

`public/proto/styles.css` and `public/proto/tokens.css` are the one gap: only the first 9 lines of `styles.css` survived in the session log; `tokens.css` not at all. This walk verifies those 9 lines match `app/styles/styles.css` byte-for-byte, and the port commit message states "every CSS class name and string literal preserved" — so CSS deltas are believed to be zero, but cannot be 100% verified file-by-file from this side. Flagged as a known coverage gap below, not as drift.

## Summary

- Total deltas: 0
- fix-now: 0
- accept: 0
- defer: 0

The port walks clean. Every view/shell/tweaks/icons file is structurally and copy-identical to its proto source, modulo:
1. The two **intentional** prop-name deviations on `TweakSection` (label/title) and `TweakToggle` (value/checked) — explicitly excluded by the audit brief.
2. JS→TS plumbing (imports replacing `window.*`, type annotations, `as` casts, defensive `if (typeof window !== 'undefined')` in `tweaks-panel`, `defaultValue` added to controlled `<select>` elements where proto had bare `<select>` to silence React warnings).
3. Removal of three demonstrably dead bindings the proto declared but never read: `milestones` array in `views-1.tsx::Schedule`, `fillPct` in same function, `layout` prop on `OCSection`. None changes a rendered string, class, or DOM node.

None of (2) or (3) changes pixel output, copy, or DOM.

## By route

### `my-work` (`components/views/views-1.tsx`)
No drift. `MyWork` exports the same JSX, same group order (today / tomorrow / this-week / later), same copy, same callout strip, same task rows. `TaskRow` identical.

### `smart-queue` (`components/views/views-new.tsx`)
No drift. `SmartQueue` identical, including the "Re-rank now / Tune weights" controls, the Copilot why-card, and the explained-pinning behaviour on first item.

### `project-home` (`components/views/views-1.tsx`)
No drift. Member avatars (first 5), Open Sprint 1 button, four go-live cards, sprint card with Sparkline, top-risks/recent-activity grid — all match proto exactly.

### `schedule` (`components/views/views-1.tsx`)
No drift. Same go-live legend, same gantt header (12 month columns starting May'26), same 11 capability lanes, same goLive→colour map, same per-go-live drill-down cards. Port drops the unused `milestones` array and unused `fillPct` local; neither was read by JSX.

### `capabilities` (`components/views/views-2.tsx`)
No drift. Same area filter chips (Student / HR / Finance / Cross), same `CapCard` layout, same active-OC link affordance.

### `tasks` (`components/views/views-2.tsx`)
No drift. Kanban columns (To do / In progress / Needs review / Done), Jira-sync chip, sparkline, member strip — identical.

### `pathfinder` (`components/views/views-new.tsx`)
No drift. `PathfinderIndex` exports same OC card grid, same "New OC" CTA, same owner avatar treatment.

### `autopilot` (`components/views/views-3.tsx`)
No drift. `AUTOPILOT_RUNS` table, baseline / on-commit buttons, recent-runs list — identical.

### `documents` (`components/views/views-new.tsx`)
No drift. Folder tree on left, doc list, doc preview pane, AI-generated chip, OC/Sprint/Owner footer links — all identical. Note: `Documents` in proto declares a `tweaks` prop but never reads it; port preserves it as `_props: { tweaks?: unknown }` to keep `<Documents tweaks={tweaks}/>` callsite stable. Not drift.

### `methodology` (`components/views/views-new.tsx`)
No drift. Same six phases, same card grid, same drawer (with Inner-source insight callout and "Apply to Northern State" CTA).

### `innersource` (`components/views/views-3.tsx`)
No drift. `InnerSource` list, contributor avatar, "Use pattern" tiny button — identical.

### `cockpit` (`components/views/views-3.tsx`)
No drift. Portfolio grid, four-engagement layout — identical.

### `components` (`components/views/views-meta.tsx`)
No drift. `ComponentsLib` design-system reference page renders the same buttons, callouts, and sparkline samples.

### `navspec` (`components/views/views-meta.tsx`)
No drift. Narrative documentation paragraphs and section titles match.

### `navigator` route + overlay (`components/views/views-new.tsx`)
No drift. Same indexer (`OC → Capability → Task → Document → Person → Pattern → Engagement` order in `navigatorIndex`), same group rendering, same recent + suggested fallbacks when query is empty, same `NavRow` markup.

### Overlay: OC Guide (`components/views/views-oc.tsx`)
No drift in any of the three layouts (`long-scroll`, `sidebar-toc`, `two-pane`). Header, TOC, section list, AI test-gen modal all identical. Port drops the dead `layout` prop on `OCSection` (never read inside it). Adds `defaultValue` to four `<select>` elements (controlled-component fix); the visible option text is unchanged.

### Overlay: Capability detail (`components/views/views-new.tsx`)
No drift. Back chevron, eyebrow, OC list card, Dependencies card, Linked test cases card, RAID card — identical.

### Overlay: Pattern detail (`components/views/views-new.tsx`)
No drift. Overview, Code & config, Prerequisites, Who's using it, Version history, Fork CTA — identical.

### Overlay: Shortcuts cheatsheet (`components/views/views-new.tsx`)
No drift.

### Overlay: External drawer / Mock Jira / Mock Smartsheet (`components/views/views-new.tsx`)
No drift. Loading → loaded transition preserved, both mock panes' table layouts and seed data match.

## Global / cross-cutting

### `app/page.tsx` vs proto `index.html` App component
No drift. `TWEAK_DEFAULTS` matches (`theme: "light"`, `ocLayout: "sidebar-toc"`, `showAIFab: true`, `density: "comfortable"`). Hash routing, ⌘K/?/t/[/]/g-prefix keymap, `__open_external` postMessage handler, all 14 route strings, the entire Tweaks panel jump list (16 buttons including `Mock · Jira ticket` / `Mock · Smartsheet plan` / `Read nav spec` / `Components library`), and `TaskDetail` modal — all identical, copy-for-copy.

The proto also declared a `function Stub({ label })` that was never rendered; port omits it. Not drift.

### `components/shell.tsx` (TopBar / Rail / AIAssistant / Sparkline / Avatar / ProjectSwitcher / ScheduleDrawer)
No drift. Rail nav order: top items (My Work, Smart Queue) → "Northern State University" eyebrow → 7 project items (Overview … Documents) → Sprints accordion (with `s1` open by default) → bottom items (Methodology, Inner Source, Practice Cockpit, Navigator) → footer Components / Nav Spec. Counts identical (`9`, `3`, `12`, `38`, `284`).

`TopBar` and `ProjectSwitcher` each receive props the proto's body never read (`route`/`onNav` on TopBar, `currentId` on ProjectSwitcher); port keeps them optional in the type signature so the proto's call sites compile unchanged. Not drift.

### `components/tweaks-panel.tsx`
No drift beyond the **two intentional deviations** (`label`||`title` on `TweakSection`; `value`||`checked` on `TweakToggle`) and TS conversion. Same `__TWEAKS_STYLE` injected stylesheet, same drag/dock behaviour, same postMessage edit-mode protocol, same control set (`useTweaks`, `TweaksPanel`, `TweakSection/Row/Slider/Toggle/Radio/Select/Text/Number/Color/Button`). `window.parent.postMessage` calls are wrapped in `if (typeof window !== "undefined" && window.parent)` guards — required for SSR safety in Next.js, no runtime behavioural change in the browser.

### `components/icons.tsx`
No drift. All 55 named icons (`IconChevR` … `IconAt`) preserved with byte-identical SVG path data. Proto had an unused `const I = (path, vb) => ...` factory at the top; port drops it.

### `lib/data.ts` (← `public/proto/data.js` + `data-extra.js`)
No drift. All 17 exports present (`ENGAGEMENT`, `GO_LIVES`, `SPRINTS`, `ACTIVE_SPRINT`, `BUSINESS_CAPABILITIES`, `OC_DATA`, `TASKS`, `AUTOPILOT_RUNS`, `SPRINT_PLAN_BACKLOG`, `INNER_SOURCE`, `PORTFOLIO`, `OC_INDEX`, `DOC_TREE`, `DOCUMENTS`, `SMART_QUEUE`, `METHODOLOGY_PHASES`, `METHODOLOGY_CARDS`). Spot-checked records (engagement members, go-live dates/days/readiness, OC_DATA sections, METHODOLOGY_CARDS m1) all byte-identical. Type annotations (`Member`) added; values untouched.

### `app/styles/styles.css` and `app/styles/tokens.css`
**Coverage gap (not drift).** The proto CSS files were not preserved in any session-log Read with sufficient depth (one Read of `styles.css` with `limit: 10` survived; `tokens.css` not at all). The 9 captured lines of proto `styles.css` are byte-identical to `app/styles/styles.css:1-9`. Port commit `976b329`'s message asserts "every CSS class name and string literal preserved." Combined with verbatim-match views/shell calling those classes, CSS drift is believed to be zero. If a fresh copy of the proto CSS becomes available, this gap is the one place a re-walk could uncover drift.

## Routes / surfaces with no drift

All of them. Listed explicitly: `my-work`, `smart-queue`, `project-home`, `schedule`, `capabilities`, `tasks`, `pathfinder`, `autopilot`, `documents`, `methodology`, `innersource`, `cockpit`, `components`, `navspec`, `navigator` (route + overlay), OC Guide overlay (3 layouts), capability detail overlay, pattern detail overlay, shortcuts cheatsheet, external drawer (Jira / Smartsheet / generic mocks), task-detail modal, AI test-gen modal.

## Punt list (deferred — for v2 design brief)

None from this walk. The brief's prime constraint was "fidelity to source design" and the audit found nothing to fix or accept. Items the product-owner / product-manager flagged as missing-but-wanted in `BACKLOG.md` (inert controls to be wired, light-mode regressions, dev-rail gating) are explicitly out of scope for this audit and remain in their separate Tier-0 / Tier-1 tracks.
