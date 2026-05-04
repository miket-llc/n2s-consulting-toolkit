# Ellucian Consulting Toolkit

Hi-fi clickable prototype of an internal toolkit for Ellucian consultants running ERP migration and modernization engagements at higher-ed institutions.

State: prototype only. No backend, no auth, no persistence (beyond `localStorage` for theme + project-switcher state). All mock data lives in `lib/data.ts`.

## Run it

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

Other scripts:

- `pnpm build` — production build (TypeScript strict + static prerender of `/`).
- `pnpm start` — serve a built app on `:3000`.
- `pnpm smoke` — run `scripts/smoke.sh`: build, start on `:3001`, curl the root URL, assert key v2 surface markers render. No browser, no test framework.

## What's running today (the v2 surface)

`app/page.tsx` is a single client component that hash-routes between v2 pages. The default route lands on the **Practice home** (across-engagements view); `#project` lands on the **Project home** for the currently-selected engagement.

```text
app/
  page.tsx             — root client component; hash routing + default-landing
  layout.tsx           — root HTML, font import, theme-light default class
  styles/
    tokens.css         — design tokens: light + dark Ellucian palette, type scale
    styles.css         — legacy v1 stylesheet (kept; unused by v2)
    v2.css             — v2 surface styles (imports tokens.css)
components/
  v2/                  — the live surface (mounted by app/page.tsx)
    shell.tsx          — TopBar, ProjectSwitcher, Rail, PageShell, hooks (useHash, useApp), notImplemented + ToastHost, PageHero, BriefBody, Section, ThreeThings, Coming
    practice.tsx       — Practice home (Portfolio): brief, three-things, project cards, today-across
    home.tsx           — Project home: phase ribbon, stage detail, calendar view
    pages.tsx          — secondary pages: MyWork, Decisions, Workshops, Schedule, Capabilities, Methodology, Ask, Autopilot, Settings, Guides
    icons.tsx          — inline SVG icon set (~50 icons, 1.25–1.5px stroke)
  views/               — legacy v1 surface (NOT mounted; see "Legacy v1" below)
  shell.tsx            — legacy v1 shell (not mounted)
  icons.tsx            — legacy v1 icons (not mounted)
  tweaks-panel.tsx     — legacy v1 design-time tweaks panel (not mounted)
lib/
  data.ts              — single mock dataset (engagement, portfolio, capabilities,
                         OCs, DRCs, workshops, milestones, autopilot runs, methodology)
  brief.ts             — time- and scope-aware brief composer (practice + project, morning/afternoon/wrap)
public/
  ellucian-wordmark.png
scripts/
  smoke.sh             — build + start + curl smoke test (run via `pnpm smoke`)
```

## Routes (v2)

Hash-routed in `app/page.tsx`. All routes mount v2 components.

| Hash             | Page                                     |
| ---------------- | ---------------------------------------- |
| `` (empty hash)  | Practice home (`PracticeHome`)           |
| `#project`       | Project home for current engagement      |
| `#mywork`        | My work — cross-engagement queue         |
| `#decisions`     | Client decisions (DRCs)                  |
| `#guides`        | Configuration guides (OC index)          |
| `#capabilities`  | Capabilities by area                     |
| `#schedule`      | Go-lives ahead                           |
| `#workshops`     | Workshops · upcoming + past              |
| `#library`       | Methodology · Pathfinder phases          |
| `#ai`            | Ask the assistant                        |
| `#autopilot`     | Configuration Autopilot                  |
| `#settings`      | Preferences (theme + launch screen)      |
| anything else    | `Coming` placeholder                     |

### Default landing

The toolkit honours a `v2.defaultLanding` localStorage preference (`practice` or `project`) and lands the user there on a fresh load with no hash. Toggle from Settings or from the secondary action on Practice home.

## Interactions

- **Theme toggle** in the top bar (sun/moon). Persists to `localStorage` as `v2.theme`.
- **Project switcher** in the top bar (left of search). Selecting an engagement persists to `localStorage` and navigates to `#project`.
- **⌘K / Ctrl-K** focuses the toolkit search input. The input is currently a placeholder — search is not wired to data.
- **Decisions attention chip** appears top-right when there are open DRCs; "stuck 5+ days" gets a rose-tinted dot.
- **Toast feedback (`notImplemented`)**: every secondary destination that does not yet have a real detail view (open Jira ticket, open OC guide section, open workshop, etc.) flashes a bottom-right toast describing what would happen. Replaces alert() dialogs so the prototype is demo-safe.

## Mock engagement

Northern State University · Banner SaaS · Select tier · 4 go-lives (HR, Finance, Student Phase 1, Student Phase 2). All cross-screen entities (DRCs, workshops, capabilities, autopilot runs, OC guides) share the same dataset in `lib/data.ts`.

The portfolio in `PORTFOLIO` includes 8 engagements; NSU is the default. Other engagements (CSU East Bay, Western Illinois, Vermont, etc.) are switchable from the project switcher.

## Legacy v1 (still in tree, not mounted)

Earlier sprint built a different surface under `components/views/*`, `components/shell.tsx`, `components/icons.tsx`, and `components/tweaks-panel.tsx`. v2 replaced it. The legacy files are kept in tree because:

1. The May 15 drift-audit (`design-fidelity-guardian`) maps the source design tarball at `https://api.anthropic.com/v1/design/h/fIMotZmRLqVfGyaje-CA1g` 1:1 to the legacy `views-*.jsx` files. v2 has no source-tarball counterpart yet.
2. Until the user re-anchors the audit baseline (either re-export v2 from Claude Design, or accept that the audit runs against v1), the legacy code is the only thing the audit can compare against.

When the audit baseline is settled, the legacy files can be removed in one commit. Until then, treat them as reference-only — do not import them from anywhere v2-mounted.

## Tech

- Next.js 16.2 App Router with Turbopack.
- React 19, TypeScript 5 strict.
- pnpm. Vercel-ready (no project linked yet).
- No CSS framework (no Tailwind, no UI kit). All styling is hand-authored CSS keyed to tokens in `tokens.css`.
- No state library — `useState`, `useEffect`, `useContext` only.
