# Ellucian Consulting Toolkit

Hi-fi clickable prototype of an internal toolkit for Ellucian consultants running ERP migration and modernization engagements at higher-ed institutions.

The design was authored in [Claude Design](https://claude.ai/design) and exported as a self-contained React 18 + Babel-standalone SPA. This Next.js app hosts that prototype verbatim — see `public/proto/` — so the visual output matches the design pixel-for-pixel.

## Run it

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

`/` redirects to `/proto/index.html`, where the prototype mounts itself.

## What's in here

- `public/proto/` — the prototype: `index.html`, `styles.css`, `tokens.css`, mock data (`data.js`, `data-extra.js`), shared components (`icons.jsx`, `shell.jsx`, `tweaks-panel.jsx`), and per-route views (`views-*.jsx`).
- `app/page.tsx` — server-side fallback redirect to the prototype.
- `next.config.ts` — `redirects()` mapping `/` → `/proto/index.html`.

## Highlights of the design

- **Fixed three-tier left rail** — Cross-project (My Work · Smart Queue) → Project (Overview · Schedule · Capabilities · Tasks · Pathfinder · Configuration Autopilot · Documents) → Reference (Navigator · Methodology · Inner Source · Practice Cockpit).
- **Top bar** — Project switcher chip, sprint + next-go-live schedule pill with burndown sparkline, theme toggle.
- **OC Guide** with three switchable layouts (long scroll · sidebar TOC · two-pane).
- **Configuration Autopilot** — agent run list with stage timeline, drift findings, and embedded Banner-form emulation.
- **AI helpers** — N2S Copilot floating launcher, AI test-case generation, AI-summarized documents.
- **Navigator (⌘K)** — global jump-to-anything search across capabilities, OCs, tasks, BPs, patterns, methodology.
- **Tweaks panel** — runtime knobs for theme, density, OC layout, helper toggles, and quick-jump shortcuts.
- **Hash routing** for deep links and refresh-stable URLs.

## Keyboard shortcuts

- `⌘K` / `/` — Navigator
- `?` — Shortcuts cheatsheet
- `t` — Toggle theme
- `[` / `]` — Compact / comfortable density
- `g h` Project Home, `g m` My Work, `g s` Smart Queue, `g a` Autopilot, `g c` Capabilities, `g d` Documents, `g i` Inner Source, `g x` Cockpit, `g l` Methodology, `g o` SOATERM OC guide

## Mock engagement

Northern State University · Banner SaaS · Select tier · 4 go-lives (HR, Finance, Student Phase 1, Student Phase 2). All cross-screen entities share the same dataset.
