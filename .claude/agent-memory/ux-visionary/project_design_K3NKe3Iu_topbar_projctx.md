---
name: TopBar + ProjectContextBar delta spec (tarball K3NKe3Iu)
description: Design deltas and implementation spec for the new violet top-bar and project context bar from the May 11 design tarball.
type: project
---

# Tarball K3NKe3Iu — TopBar / ProjectContextBar spec
Date: 2026-05-11

## Key deltas identified

### TopBar
- Height: 56px → 44px
- Background: flat bg-panel → violet gradient (use --gradient-topbar token, 90deg not 135deg — minor; stay with token)
- Dark mode: deepen violet, not neutral. Use `.theme-dark .v2-topbar` with `linear-gradient(90deg, #4c1d95 0%, #5b21b6 38%, #6d28d9 100%)`
- Layout: grid (240px 1fr) → flex + `padding: 0 20px` (brand no longer rail-anchored)
- ProjectSwitcher removed from topbar; lives in ProjectContextBar
- All right-side chrome (search, attn, icon-btn, avatar) resized to 28px height on violet bg
- v2-body min-height updated: calc(100vh - 44px)

### ProjectContextBar
- Already mostly correct in port. Key delta: SchoolLogo (22px) present in v2-projswitch trigger (port's projmenu-item grid missing logo column: `auto 8px 1fr auto` vs port's `8px 1fr auto`)
- projmenu-detect footer (Clearbit logos note) present in design; port is missing it
- sticky top stays 44px (below topbar)

### Rail sticky offset
- Non-project routes: top: 44px
- Project-scoped routes: top: 88px (44 topbar + 44 context bar)
- Implement via: `.v2-shell.has-projctx .v2-rail { top: 88px; height: calc(100vh - 88px); }`
- lead-developer adds `has-projctx` class to `.v2-shell` when ProjectContextBar renders

### Decisions chip route
- Design uses `navigate("project/decisions")` — incorrect
- Correct: `navigate("decisions")` which hits PROJECT_SCOPED_ROUTES → shows ProjectContextBar
- "project/decisions" as a hash route is unhandled in the router

### Token additions needed
- `--topbar-height: 44px` (new; referenced by rail offset calc)
- `--gradient-topbar` already exists in tokens.css ✓
- No new color tokens needed; design's violet strip maps directly to existing tokens

## Resolved ambiguities
- Gradient direction: design uses 90deg, token uses 135deg. Decision: use token (135deg) — it's imperceptibly different at this element width and avoids token divergence.
- Light-mode topbar: violet gradient works in light mode because text/icons are explicitly white (rgba(255,255,255,0.92)) — not theme-dependent. Contrast is fine.
