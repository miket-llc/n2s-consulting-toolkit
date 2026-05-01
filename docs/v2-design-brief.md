# v2 Design Brief — Ellucian Consulting Toolkit

Author: product-manager + ux-visionary, on behalf of the consulting team
Date: 2026-05-01
v1 source: https://api.anthropic.com/v1/design/h/fIMotZmRLqVfGyaje-CA1g?open_file=Ellucian+Consulting+Toolkit.html
Status: ready for design pass

## Context

The Ellucian Consulting Toolkit is the internal cockpit for consultants running ERP migration and modernization engagements at higher-ed institutions on Banner SaaS. The mock engagement is Northern State University — Select tier, four go-lives (HR/Payroll, Finance, Student Phase 1, Student Phase 2). v1 shipped IA, palette, type system, and a working OC Guide, Configuration Autopilot, and Schedule Gantt. We walked v1 with Janet Hawkins (Lead Consultant, NSU, Sprint 1 day 4) and surfaced five workflow gaps grounded in real engagement rhythm. **The v2 ask is purely additive — the v1 IA, Coolnight-adjacent palette, type system, and component vocabulary remain canonical.**

## Constraints (read first)

- Visual system stays: Ellucian purple `#9333ea` accent, cyan secondary, deep-purple-navy surface hierarchy, existing type ramp.
- No IA reshuffles. The three-tier rail (Cross-project / Project / Reference) keeps its grouping and order.
- Dark theme primary; light theme keeps parity. Density modes (compact/comfortable) keep parity.
- Hash routing, keyboard shortcut grammar (g-prefix, ⌘K, ?, t, [/]), and TopBar slot order are stable.
- Reuse existing component vocabulary (rail items, cards, RAID blocks, drift-finding rows, schedule swimlanes). Do not invent a new card style.

## What's explicitly NOT being asked for

- TopBar layout, project switcher, schedule pill, theme toggle, AI Copilot launcher placement.
- Rail structure, the three-tier grouping, or existing rail labels.
- OC Guide's three switchable layouts (long-scroll, sidebar TOC, two-pane preview) — reuse, don't redesign.
- Configuration Autopilot dashboard, run list, or stage timeline.
- Tweaks panel.
- Palette additions or new font weights.

## Core asks

### 1. DRC inbox

**Janet's words:** "On a real engagement I'm tracking 15–25 open DRCs at any time. I shouldn't have to remember which OC each one lives under."

**Scenario:** Janet opens the toolkit Monday morning and needs to know which client decisions are blocking sprint work. Today she opens Project Home, doesn't see DRCs, opens Capabilities, drills into Curriculum Mgmt, finds DRC-3 in a RAID block, then has to open the SOATERM OC guide to reach the actual decision form. Three clicks, two views, one decision.

**User goal:** See every open client decision in one place; act on the oldest/most-blocking ones first.

**What success looks like:**
- A first-class "DRCs" rail item aggregates open decisions across all capabilities.
- Each row shows: owner, days-stale, downstream-blocked count, due-by-date, originating OC.
- One click jumps to the OC section where the decision is captured (deep link, preserves OC layout state).
- Sort + filter by owner, capability, due-by, blocked count.
- Project Home gains a "DRCs at risk this week" card surfacing the top 3–5.

**IA / placement hint:** Likely top of the Project section of the rail (it's project-scoped, not cross-project). Reachable via `g d`.

**Data:** DRCs already exist in `lib/data.ts` keyed to capabilities and OCs. New fields likely needed: `daysStale` (derived), `blockedCount` (derived from dependent tasks/DRCs), `dueBy`.

**Out of scope:** Creating new DRCs, editing decision content, threaded discussion, email notifications.

### 2. Presentation mode

**Janet's words:** "I share my screen with clients half the day. Right now I'd flinch."

**Scenario:** Janet is in a Thursday Registrar workshop, sharing her screen. The Jira IDs (`NSU-184`), `Synced 12s ago` timestamps, internal status pills (`scoping`, `in-progress`), and the pulsing AI Copilot FAB are all noise — and worse, they're internal scaffolding the client shouldn't see.

**User goal:** Flip the toolkit into a client-safe view in one click without losing engagement context.

**What success looks like:**
- A toggle in the TopBar adjacent to the theme toggle, with a recognizable on/off state.
- When on: hide Jira IDs, sync timestamps, internal status pills, dev-rail entries (Components, NavSpec), and the Tweaks panel entry point.
- Body typography expands ~+1pt; line-height eases.
- AI Copilot FAB dims and de-emphasizes (does not disappear — Janet still uses it silently).
- Engagement identity, schedule pill, OC content, DRCs, Workshops remain visible — those are what she walks clients through.
- State is a runtime mode, not a route. Persists per browser; resets on a new project switch (see open question).

**IA / placement hint:** TopBar, left of theme toggle. Keyboard `t` is taken; suggest `Shift+P`.

**Data:** No schema changes. Components consume a `presentationMode` flag.

**Out of scope:** A separate "client portal" view, redacting OC body content, reauthoring copy.

### 3. Workshops / Sessions

**Janet's words:** "Thursday 9am Registrar Workshop — I want one page that aggregates: open DRCs in scope, OC sections to walk, test cases to demo, last meeting notes, attendees. I build this in OneNote today."

**Scenario:** Every workshop has a focus area (registrar, finance, HR, FA), 30–60 minutes of meeting time, a question set, and 5–15 minutes of prep. Janet currently assembles this manually from Banner docs, the engagement OneNote, the calendar invite, and her own notes.

**User goal:** Walk into each workshop with a single prep page that pulls from the engagement's own data.

**What success looks like:**
- New rail item "Workshops" in the Project section.
- Index view: cards-per-workshop, sorted by date, showing focus area, time, attendee count, prep status.
- Detail view aggregates: in-scope capabilities/OCs/DRCs, linked pre-reads (Documents), test cases to demo, attendees + roles, last related meeting notes, "Send agenda" action.
- Each surfaced item links back to its source view (OC, DRC, document).

**IA / placement hint:** Project section, between Schedule and Capabilities. `g w`.

**Data:** Most entities exist in `lib/data.ts` (DRCs, OCs, documents, members). New entity: `workshops` with focus area, datetime, attendee refs, scope refs (capability/OC/DRC ids), notes ref. Calendar/invite integration is mock-only.

**Out of scope:** Live calendar sync, email send (mock the button), in-meeting note-taking UI, recordings.

### 4. Drift-vs-baseline diff lens in OC Guide

**Janet's words:** "When Autopilot says 'SOATERM part-of-term flag NULL,' I want to click straight to the OC section *and* see the offending field highlighted in the live preview pane."

**Scenario:** Configuration Autopilot reports drift on SOATERM. Janet clicks the finding, lands on the SOATERM OC, then has to mentally map "part-of-term flag" to the field in the preview pane. The connection is implied but invisible.

**User goal:** See the drifting field in context, fix or defer it, ack the finding.

**What success looks like:**
- OC Guide accepts a `?finding=<id>` context.
- The relevant field in the two-pane preview is highlighted; the section containing it auto-scrolls into view.
- A small "Drift: 1 field" chip appears in the OC bar with the finding ID.
- A "Mark resolved" action acks the finding back to Autopilot and clears the lens.
- Highlight uses an existing semantic color token (warning/alert), not a new one.

**IA / placement hint:** Lives entirely inside the existing OC Guide two-pane layout — no new route.

**Data:** Findings already key to `oc` + `section` + `field`. Add `fieldSelector` if not present.

**Out of scope:** Inline field editing, multi-finding diff (one finding at a time is fine for v2), drift history per field.

### 5. Schedule Gantt: today line + milestone markers

**Janet's words:** "There's no today line on the Gantt. No way to mark a milestone — workshops, training, cutovers, freeze dates. Without these, the roadmap is decorative."

**Scenario:** Janet opens Schedule to brief a stakeholder on engagement rhythm. The swimlanes show capability work per go-live but nothing temporal beyond the go-live dates themselves. The roadmap reads as decorative.

**User goal:** Glance at Schedule and see what's happening this week and what's coming.

**What success looks like:**
- A vertical "today" line spans all swimlanes; updates daily.
- Pinned milestone markers for: workshops (per capability), training events (per cohort), cutover weekends, code/data freezes, change-control submission deadlines.
- Marker types are visually distinct (icon + semantic color) but reuse existing tokens.
- Hover/click reveals marker detail (date, owner, linked workshop or document).
- Markers respect go-live grouping (a milestone belongs to a go-live).

**IA / placement hint:** Inside the existing Schedule view, no new route. A legend/filter for marker types lives in the view's header.

**Data:** New entity `milestones` keyed to go-live, with `type`, `date`, `label`, optional refs to workshop or document.

**Out of scope:** Drag-to-reschedule, dependency arrows between milestones, critical path computation.

## Bundle (low-priority adds — design only if v2 budget allows)

- **Autopilot drift trend** — sparkline of drift score per run on the Autopilot dashboard. "94% today" is meaningless without the prior 10 runs.
- **Inner Source pattern → "Apply to which OC?"** — when applying a pattern, pick a target OC to fork into.
- **OC cross-references clickable** — references like `SSASECT`, `SFARCTL`, `SHACATQ` in OC body copy link to those OCs' guides.
- **Documents: "Needs my signature/review" filter chip** — alongside existing filters; most common entry reason.
- **Documents: version history pane** — opens in the right side-panel when a doc is selected.
- **Documents: link to DRC** — show which DRC a document supports/blocks.
- **My Work: "Blocked by client" bucket** — half of Janet's queue is waiting on the client.
- **Methodology: "You are here" marker** — pin NSU's current phase position on the methodology timeline.

## Open design questions

1. Does presentation mode persist across sessions, or reset on reload / project switch?
2. Where does the DRC inbox sit in the rail — top of Project section, or before Pathfinder?
3. Should milestone markers also surface as dots inside the TopBar schedule pill, or only on the Schedule view?
4. Does the drift lens chip in the OC bar persist while the user navigates within that OC, or clear on first scroll?
5. For Workshops: does the prep page own its own notes field, or always defer to the linked Documents/meeting-notes entity?

## Acceptance for v2 export

- HTML+JSX modules matching v1 export structure.
- New screens: DRC inbox (index + Project Home card), Workshops (index + detail).
- Modified screens: TopBar (presentation toggle), OC Guide (drift lens state), Schedule (today line + milestone markers), Project Home (DRCs-at-risk card).
- Updated mock data in `data.js` / `data-extra.js`: DRC derived fields, `workshops`, `milestones`, finding `fieldSelector`.
- Light + dark parity for every new state.
- Compact + comfortable density parity.
- Chat transcript optional but welcome for the design rationale on rail placement and presentation-mode scope.

## Anti-patterns to avoid

- Don't introduce new colors for milestone markers, drift highlight, or DRC severity — reuse existing semantic tokens.
- Don't make presentation mode a route. It's a state.
- Don't redesign the OC Guide two-pane layout to accommodate the drift lens — overlay state on the existing layout.
- Don't add a new top-level rail tier for Workshops or DRCs. They are project-scoped; they sit inside the existing Project group.
- Don't replace the AI Copilot FAB with a new launcher in presentation mode — dim it, don't relocate it.
