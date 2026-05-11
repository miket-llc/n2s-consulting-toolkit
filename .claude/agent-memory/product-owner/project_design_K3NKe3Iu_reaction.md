---
name: Design K3NKe3Iu — topbar + ProjectContextBar reaction
description: Janet's reaction to the narrow topbar + project-context-bar relocation design. Endorsed with one required tweak.
type: project
---

# Design K3NKe3Iu — TopBar + ProjectContextBar

**Date:** 2026-05-11 | **Context:** New shell design — narrow brand topbar, ProjectContextBar on project-scoped routes only.

## The change

- TopBar gets narrow, brand-focused. Project selector removed from it.
- ProjectContextBar appears ONLY on project-scoped routes (project, capabilities, guides, decisions, workshops, schedule). Contains: ← Portfolio back link, ProjectSwitcher, Phase·Sprint pill, Next Go-Live pill.
- On Portfolio, MyWork, Methodology, Ask, Autopilot, Settings: no context bar, no project selector visible.
- Decisions count chip stays in topbar universally.

## Reaction

**Orientation across route transitions:** Works. Context bar appearing on Project entry is a clear signal — "you're inside an engagement." Losing it on Portfolio is correct. Not jarring.

**The hidden-selector problem:** This is the real gap. When I'm on My Work and need to confirm which project is "active" before navigating into a guide or decision, there is no indicator. I have to click to Project Home to verify. Multiple times a day on a real engagement, that's friction. The fix: a read-only passive indicator (school logo tile + project short name, no dropdown) persists in the topbar on ALL routes. Full switcher lives only in the context bar as designed.

**← Portfolio back link:** Noise for me (I use the rail). Not harmful. Leave it.

**Phase·Sprint + Next Go-Live pills:** Genuinely useful. Deep navigation (guides, decisions list) loses Project Home context. The pills in the context bar restore it persistently. Keep them.

## Verdict

**Yes with one required tweak:** Endorse the design. Require a passive project identity indicator (logo + short name, non-interactive) in the topbar on non-project routes. Without it, MyWork is disorienting during fast context-switches.

## Tweak spec (for lead-developer)

In the topbar, on routes where ProjectContextBar is NOT shown, render a small read-only chip:
- School logo tile (22px, rounded-sm) + project short name in muted text
- Not clickable — no dropdown
- Tapping/clicking navigates to the project route (optional improvement)
- Visually lighter than the full switcher (no chevron, no product/tier metadata)
