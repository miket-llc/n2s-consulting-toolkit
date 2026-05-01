# Ellucian Consulting Toolkit

Hi-fi clickable prototype of an internal toolkit for Ellucian consultants running ERP migration and modernization engagements at higher-ed institutions.

State: prototype only. No backend, no auth, no persistence. Mock data lives in `lib/data.ts`.

## Run it

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

The app mounts at `app/page.tsx` (client component, hash-routed). Default route is `#project-home`.

Other scripts: `pnpm build`, `pnpm start`.

## What's in here

- `app/page.tsx` — root client component. Owns route state (hash-routed), keyboard shortcuts, modal state (task / OC / capability / pattern / navigator / shortcuts / external-system drawer), and the Tweaks panel wiring.
- `app/layout.tsx` — root layout, fonts, global styles.
- `app/styles/` — global CSS (`styles.css`, tokens).
- `components/shell.tsx` — `TopBar`, `Rail` (left nav), `AIAssistant` floating launcher, `Avatar`, `Sparkline`.
- `components/views/` — per-route views, split across files:
  - `views-1.tsx` — `MyWork`, `ProjectHome`, `Schedule`
  - `views-2.tsx` — `Capabilities`, `SprintTasks`
  - `views-3.tsx` — `Autopilot`, `InnerSource`, `Cockpit`
  - `views-oc.tsx` — `OCGuide` (long-scroll / sidebar-TOC / two-pane layouts)
  - `views-new.tsx` — `Documents`, `NavigatorOverlay`, `Methodology`, `SmartQueue`, `PathfinderIndex`, `CapabilityDetail`, `PatternDetail`, `ShortcutsCheatsheet`, `ExternalDrawer`
  - `views-meta.tsx` — `ComponentsLib`, `NavSpec`
- `components/icons.tsx` — inline SVG icon set.
- `components/tweaks-panel.tsx` — runtime tweak knobs (`useTweaks` hook + `TweaksPanel`, `TweakSection`, `TweakRadio`, `TweakToggle`, `TweakButton`, etc.).
- `lib/data.ts` — single mock dataset (engagement, members, sprints, tasks, OC content, capabilities, autopilot runs, documents, methodology, smart queue, etc.). All views read from here.

## Routes

Hash-routed via `app/page.tsx`. Routes: `project-home`, `my-work`, `smart-queue`, `navigator`, `schedule`, `capabilities`, `tasks`, `pathfinder`, `autopilot`, `documents`, `methodology`, `innersource`, `cockpit`, `components`, `navspec`. OC guides, capability detail, and pattern detail are overlay states on top of a route, not routes themselves.

## Keyboard shortcuts

Verified against `app/page.tsx:84–123`.

- `⌘K` / `Ctrl-K` — toggle Navigator
- `/` — open Navigator
- `?` — toggle Shortcuts cheatsheet
- `Esc` — close any open overlay (navigator, shortcuts, task, external drawer)
- `t` — toggle theme (light / dark)
- `[` — compact density
- `]` — comfortable density
- `g` then: `h` Project Home · `m` My Work · `s` Smart Queue · `a` Autopilot · `c` Capabilities · `d` Documents · `i` Inner Source · `x` Cockpit · `l` Methodology · `o` SOATERM OC guide

Shortcuts are suppressed while typing in inputs / textareas / contenteditable, except `Esc`.

## Mock engagement

Northern State University · Banner SaaS · Select tier · 4 go-lives (HR, Finance, Student Phase 1, Student Phase 2). All cross-screen entities share the same dataset.
