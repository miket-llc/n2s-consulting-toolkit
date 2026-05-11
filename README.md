# Ellucian Consulting Toolkit

Hi-fi clickable prototype of an internal toolkit for Ellucian consultants running ERP migration and modernization engagements at higher-ed institutions.

State: prototype only. No backend, no auth, no persistence (beyond `localStorage` for theme + project-switcher state). All mock data lives in `lib/data.ts`.

## Run it

```bash
pnpm install
pnpm dev
# open http://127.0.0.1:4321
```

`pnpm dev` binds to `127.0.0.1:4321` deliberately — port `3000` collides with sibling projects (`n2s-heear-editor`, `n2s-active-playbook`) and `0.0.0.0` would expose the dev server on the LAN. Use a different port only with the `--port` override and check the terminals/ folder for any colliding instance first.

Other scripts:

- `pnpm build` — production build (TypeScript strict + static prerender of `/`).
- `pnpm start` — serve a built app on `:4321`.
- `pnpm smoke` — run `scripts/smoke.sh`: build, start on `:3001`, curl the root URL, assert key v2 surface markers render. No browser, no test framework. Wired into GitHub Actions on push/PR — see [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## What's running today (the v2 surface)

`app/page.tsx` is a single client component that hash-routes between v2 pages. The default route lands on the **Practice home** (across-engagements view); `#project` lands on the **Project home** for the currently-selected engagement.

```text
app/
  page.tsx             — root client component; hash routing + default-landing
  layout.tsx           — root HTML, font imports, pre-paint theme script
  error.tsx            — top-level render-error boundary
  not-found.tsx        — 404 fallback
  loading.tsx          — loading skeleton
  styles/
    tokens.css         — design tokens: light + dark Ellucian palette, type scale
    styles.css         — legacy v1 stylesheet (kept; unused by v2; slated for cull post-audit)
    v2.css             — v2 surface styles (imports tokens.css + detail.css)
    detail.css         — Capability detail + Configuration guide styles
components/
  v2/                  — the live surface (mounted by app/page.tsx)
    shell.tsx          — TopBar, ProjectSwitcher, Rail, PageShell, hooks (useHash, useApp), notImplemented + ToastHost, PageHero, BriefBody, Section, ThreeThings, Coming, SchoolLogo
    practice.tsx       — Practice home (Portfolio): brief, three-things, project cards, today-across
    home.tsx           — Project home: phase ribbon, stage detail, calendar view
    pages.tsx          — secondary pages: MyWork (Buckets|Board toggle), Decisions, Workshops, Schedule (12-month gantt), Capabilities, Methodology, Ask (coming-soon stub), Autopilot, Settings, Guides
    detail.tsx         — Capability detail (#capabilities/<capId>) + Configuration guide (#guides/<ocId>) with per-section ConfigFieldsTable
    icons.tsx          — inline SVG icon set (~50 icons, 1.25–1.5px stroke)
  views/               — legacy v1 surface (NOT mounted; see "Legacy v1" below)
  shell.tsx            — legacy v1 shell (not mounted)
  icons.tsx            — legacy v1 icons (not mounted)
  tweaks-panel.tsx     — legacy v1 design-time tweaks panel (not mounted)
lib/
  data.ts              — single typed mock dataset (engagement, portfolio, capabilities, OCs, DRCs, workshops, milestones, autopilot runs, methodology, config fields)
  brief.ts             — time- and scope-aware brief composer (practice + project, morning/afternoon/wrap)
  school-brands.ts     — per-school monogram styling (font, color) for SchoolLogo fallback
public/
  ellucian-wordmark.png
scripts/
  smoke.sh             — build + start + curl smoke test (run via `pnpm smoke`)
docs/
  MVP-PILOT-PLAN.md    — current sprint plan (Sprint A → C, with calendar + risk register)
  audits/              — drift-audit reports (DRIFT-AUDIT-YYYY-MM-DD.md)
```

## Routes (v2)

Hash-routed in `app/page.tsx`. All routes mount v2 components.

| Hash                            | Page                                                                      |
| ------------------------------- | ------------------------------------------------------------------------- |
| `` (empty hash)                 | Practice home (`PracticeHome`)                                            |
| `#project`                      | Project home for current engagement                                       |
| `#mywork`                       | My work — cross-engagement queue with Buckets \| Board view toggle        |
| `#decisions`                    | Client decisions (DRCs)                                                   |
| `#guides`                       | Configuration guides (OC index)                                           |
| `#guides/<ocId>`                | Configuration guide detail — walk-steps + per-section ConfigFieldsTable   |
| `#capabilities`                 | Capabilities by area                                                      |
| `#capabilities/<capId>`         | Capability detail — Delivery / Decisions / Budget tabs                    |
| `#schedule`                     | Go-live readiness band + 12-month milestone gantt                         |
| `#workshops`                    | Workshops · upcoming + past                                               |
| `#library`                      | Methodology · Pathfinder phases                                           |
| `#ai`                           | Ask the assistant (coming-soon stub for current pilot)                    |
| `#autopilot`                    | Configuration Autopilot                                                   |
| `#settings`                     | Preferences (theme + launch screen)                                       |
| anything else                   | `Coming` placeholder                                                      |

### Default landing

The toolkit honours a `v2.defaultLanding` localStorage preference (`practice` or `project`) and lands the user there on a fresh load with no hash. Toggle from Settings or from the secondary action on Practice home.

## Interactions

- **Theme toggle** in the top bar (sun/moon). Persists to `localStorage` as `v2.theme`. A pre-paint script in `app/layout.tsx` flips the html class before React hydrates, so dark-mode users don't see a light flash on cold load.
- **Project switcher** in the top bar (left of search). Selecting an engagement persists to `localStorage` and navigates to `#project`.
- **⌘K / Ctrl-K** focuses the toolkit search input. The input is currently a placeholder — search is not wired to data yet.
- **MyWork view toggle**: Buckets (Today / Tomorrow / This week / Later) or Board (5 status columns: Backlog / Ready / In Progress / Needs Review / Done). Choice persists to `localStorage` as `v2.mywork.view`.
- **Configuration Guide review state**: per-field two-state review (unreviewed / confirmed) on the ConfigFieldsTable inside `#guides/<ocId>`. Persists to `localStorage` as `v2.cfg.<engagementId>.<ocId>.<fieldId>`.
- **Decisions attention chip** appears top-right when there are open DRCs; "stuck 5+ days" gets a rose-tinted dot.
- **Toast feedback (`notImplemented`)**: every secondary destination that does not yet have a real detail view (open Jira ticket, open OC guide section, open workshop, etc.) flashes a bottom-right toast describing what would happen. Replaces alert() dialogs so the prototype is demo-safe.

## Mock engagement

Northern State University · Banner SaaS · Select tier · 4 go-lives (HR, Finance, Student Phase 1, Student Phase 2). All cross-screen entities (DRCs, workshops, capabilities, autopilot runs, OC guides) share the same dataset in `lib/data.ts`.

The portfolio in `PORTFOLIO` includes 8 engagements; NSU is the default. Other engagements (CSU East Bay, Western Illinois, Vermont, etc.) are switchable from the project switcher.

## Legacy v1 (still in tree, not mounted)

Earlier sprint built a different surface under `components/views/*`, `components/shell.tsx`, `components/icons.tsx`, and `components/tweaks-panel.tsx`. v2 replaced it. The legacy files are kept in tree because:

1. The May 15 drift-audit baseline is the design tarball at `https://api.anthropic.com/v1/design/h/K3NKe3IuvfS03Mr6yWnkDw` (re-anchored 2026-05-11 PM from prior baseline `CgM4C5b7mEU63Y2RQISWcw`). It ships `v2/*.jsx` as the active design; v2 in this port maps to `project/v2/*` in the tarball, and the legacy `views-*.jsx` set under `project/v1-archive/` corresponds to the unmounted `components/views/*` here.
2. Three surfaces shipped 2026-05-11 — MyWork kanban toggle, Schedule 12-month gantt, Configuration Guide config-fields table — plus the new `ProjectContextBar` + `ProjectIdentityChip` (2026-05-11 PM design slice) are intentional toolkit-original / design-driven additions. They are documented at `.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md` and `reference_design_tarballs.md` so the audit classifies them correctly.

The legacy files (`components/views/*`, root-level `components/{shell,icons,tweaks-panel}.tsx`, `app/styles/styles.css` — ~3,800 lines total) are queued for cull in Sprint B0 (post-audit). Until then, treat them as reference-only — do not import them from anywhere v2-mounted.

## Tech

- Next.js 16.2 App Router with Turbopack.
- React 19, TypeScript 5 strict.
- pnpm 10.30 (pinned via `packageManager`). Node ≥20 (CI uses 22 LTS — see [`.github/workflows/ci.yml`](.github/workflows/ci.yml)).
- No CSS framework (no Tailwind, no UI kit). All styling is hand-authored CSS keyed to tokens in [`app/styles/tokens.css`](app/styles/tokens.css).
- No state library — `useState`, `useEffect`, `useContext` only.
- **Hosting / deploy: deferred.** No Vercel project linked, no preview/prod deploys until pilot is funded — see [`docs/MVP-PILOT-PLAN.md`](docs/MVP-PILOT-PLAN.md) §2 Q5 update. Local dev + CI smoke is the contract for now; share via screen-share or screenshot, not a hosted URL.
