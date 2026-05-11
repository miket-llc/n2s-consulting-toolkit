---
name: MVP pilot review — May 2026
description: Full product owner walkthrough of v2 surface for production pilot readiness. Janet's seat.
type: project
---

# MVP Pilot Review — n2s-consulting-toolkit v2
**Date:** 2026-05-11 | **Reviewer:** Janet Hawkins (PO lens) | **Sprint:** NSU Build S1 D4/10

---

## 1. Current-State Findings — Per Route

### Practice Home (#home)
**Works.** This is the screen I'd open every morning.

- The brief ("8 engagements · 3 need attention · 6 open decisions") gives me situational awareness in 10 seconds. I don't have that anywhere right now without opening Jira, Smartsheet, and checking Slack.
- ThreeThings: FA cohort cutover / CSU East Bay slipping / NSU Sprint 1 demo prep — accurate and actionable. "Blocking 4 sprint stories" is the phrase that matters. Good.
- Portfolio cards sorted by health (red → amber → green) then readiness: exactly how I'd sort them myself. CSU East Bay at 31% against 60% target = the card I'd click first.
- "Jump into Northern" primary action is right. The button should always be the engagement that needs me most, not a fixed link.
- "Today across everything" working list at the bottom: borderline redundant with My Work, but I'll tolerate it as a preview. It doesn't add friction.

**Friction:** The default landing toggle ("Open here on launch" vs "Default: project view") is in the hero but I'd never look for settings there. It's fine for now but confusing placement.

### Project Home (#project)
**Works well, one miss.**

- "You are here · Sprint 1 · Day 4/10 · Demo Fri May 9" = the one line I need before standup. If this number is wrong, everything else is wrong.
- Stats row (12 capabilities / 8 open decisions / 4 configs in flight / 5 workshops next 14d / 10 sprint commitment): this is the standup brief. I'd read it out loud in a PM sync. It works.
- DRC blocker banner: "8 client decisions are holding back this stage. Top blocker: FA Cohort Cutover — owned by C. Reyes, holds 7 tasks." This is the most valuable thing in the entire tool. No other tool surfaces this in one line. **Keep it. Protect it.**
- Capability cards in the Build stage section: clicking them navigates to `#capabilities` (the list) instead of `#capabilities/bc-curriculum`. I want to go straight to the detail. This is broken for daily use.
- Calendar toggle: I tried it. It's a week-grouped event list. It's fine. I'd use the timeline 95% of the time — calendar is for briefing a project manager who doesn't know the methodology. Worth keeping but not primary.

**Miss:** The brief footer says "Pulled from Jira, Smartsheet, the autopilot run feed, and standup notes." In a pilot this is a claim that isn't true. Either label it "demo data" or remove the source attribution. If a real consultant reads this and tries to reconcile against Jira, you've lost their trust.

### My Work (#mywork)
**Buckets view is correct. Board view is noise.**

Buckets (Today / Tomorrow / This week / Later) maps exactly to how I organize my day. I look at Today, maybe Tomorrow, and that's it. The "Later" bucket is a parking lot.

Board view with 5 status columns (Backlog / Ready / In Progress / Needs Review / Done): I already have this in Jira. This is a duplicate I didn't ask for. Every consultant on a real engagement has Jira open in a tab. A second board view in a different tool means two places to check status — which means one of them will always be wrong. This is actively harmful.

**Missing:** A count line in the page hero — "10 items today: 2 urgent, 3 in review, 5 active." I want to know the number before I read the list. Currently I have to scroll to count.

Clicking a task fires "Would open NSU-191 in Jira" toast. That's fine for a prototype. For pilot, the expectation should be clear: this is a read layer on top of Jira, not a Jira replacement.

### Decisions (#decisions)
**Works. One broken link.**

Impact-sorted list (stale days × blocked count) = right algorithm. "DRC-2 · 6 days open · blocks 4 · owned by C. Reyes · due May 12" is everything I need to chase a decision.

The list click fires `notImplemented("Would open DRC-2 · OC-2.4.1 SOATERM")`. For a pilot, this needs to navigate to the correct OC guide section, not toast. This is the most important navigation fix in the tool. The DRC is only useful if I can click through to the context that generated it.

Status coloring (rose for 7+ days, amber for 5+, accent otherwise) is the right gradient. I can scan the list and know immediately which ones need a call today.

**Missing:** A "Send a nudge" action from the list — even just a `notImplemented` stub. The most common thing I do with a stale DRC is send the owner a message. If the tool can help me do that in one click, it saves 5 minutes per DRC per day.

### Configuration Guides (Index: #guides)
**Good list. Terrible when you click past SOATERM.**

The index is clean. Status pills (Approved / In review / In progress) map to how I track OC completion. Clicking SOATERM opens a full, real guide. I'll talk about that below.

Clicking anything else (SFARCTL, SSASECT, SHACATQ, SHACATQ, SPAIDEN) opens a guide with three placeholder sections: "Section body to be populated from OC_DATA when available — this guide is wired but the content port for OC-2.4.2 is pending."

This is the single biggest pilot risk. There are 12 OCs in scope. ONE has real content. The other 11 show an empty stub with a "content pending" pill. A real consultant will open SFARCTL — the registration windows form we work on constantly in a Build sprint — find nothing, and close the tab. You've lost them.

For a pilot, 11 empty OC guides is not a content gap, it's a credibility gap.

### SOATERM Guide (#guides/soaterm)
**The best thing in the tool. This is the reason to build this.**

Walking through it as Janet on a Tuesday morning:

1. Open guide. Status bar: "Janet Hawkins · updated 8m ago · 2 open DRC · 4 tasks · 1/3 sections complete." That's my standing in 3 seconds.
2. TOC walk-steps on the left rail. I click "Field reference." Content loads: field codes, recommended values, reasons. I can read this to a client or compare against what's in the form.
3. ConfigFieldsTable: `TERM_CODE_STYLE`, `PTRM_CODE`, `ACYR_CODE` with recommended values and "Mark confirmed" toggles. **This is exactly what I do in Excel today.** I have a spreadsheet with a column for each field, a recommended value, and a checkbox. This replaces that spreadsheet. This is the feature I'd pay for.
4. DRC right rail: DRC-1 and DRC-2 visible, "Capture sign-off" inline. No DocuSign round-trip. I click, enter the signer's name, add a note, click "Confirm." Done. **This saves 20 minutes per decision in a high-frequency sprint.**
5. Tests rail: 11 pass, 1 fail, 1 skip. I can see "Concurrent-term billing: fail" and know to add it to my backlog.
6. AI draft buttons (Generate test cases / Draft a DRC / Explain to client): I'd use "Explain to client" before every workshop. Takes a technical config step and makes it readable. The draft output is credible.
7. Section navigation (← / →, keyboard shortcuts): works cleanly.

**Friction:** Version button ("v3.2" with chevron) does nothing. Minor but consultants notice dead affordances.

### Capability Detail (#capabilities/bc-curriculum)
**Good for the two that have data. Hollow for the other 10.**

bc-curriculum detail is excellent:
- Metrics row: configuration %, OCs done/total, open decisions (with "stuck 5+ days" sub), days to go-live, loop state (configure → validate → demo → sign-off). This row took me 5 seconds to read.
- Budget tab: burn vs. plan by OC × task-type (Config / Validate / Insights / Experience Card). **I currently reconcile this in the project plan xlsx.** Having it here as a read view is immediately useful even if it's read-only.
- Activity feed: autopilot run #284, DRC-2 moved to waiting-on-client, Janet uploaded pre-read, DRC-1 signed. This is the context I have to pull from 4 different places right now. Consolidated here = daily value.

bc-records: empty activity feed, no budget rows. "—" for client owner and consultant. This is the stub problem again — less severe than guides, but same trust issue.

Everything else: click through to bc-finance, bc-financial-aid, any of the 10 others, and you get `DETAIL_BY_CAP["bc-finance"] = undefined` → default fallback with dashes. For a pilot, any capability a consultant clicks that has no data is a failed interaction.

### Workshops (#workshops)
**List is fine. No detail = broken for any real use.**

The cards show title, focus, date, location, decisions × configs. That's the right data at a glance.

Clicking fires `notImplemented("Would open workshop")`. For a pilot, a consultant who clicks a workshop card expects to see the agenda, the DRCs targeted, and the config walks scoped. Not a toast. This is a dead screen for any real prep work.

**Missing:** Pre-read doc links inside the workshop record. Two days before every workshop I'm hunting for the pre-read doc. If the tool can surface "Workshop pre-read · uploaded 2d ago by Janet H." I'd come here instead of SharePoint.

### Schedule (#schedule)
**The gantt is presentable. I'd show it to a client.**

Go-live readiness cards (4 go-lives, sorted by proximity, with progress bars and status pills): clean, scannable. "NSU Student Phase 1 · Jul 11 · at-risk · 71% ready" is what I need in a portfolio review.

The 12-month milestone gantt: I can orient myself in 10 seconds with the today-line and the legend. Workshop / Go-live / Freeze / Training / Change-Control abbreviations are readable once you've seen the legend once.

Clicking milestone dots fires notImplemented. For a pilot, clicking a Workshop dot should navigate to `#workshops`. That one routing fix would make the gantt interactive without much work.

**Annoyance:** The gantt is NSU-only. For a portfolio-level schedule I'd want to see all 8 engagements. That's a later feature but worth noting.

### Autopilot (#autopilot)
**The run log is a developer artifact. The findings list is the user artifact.**

Drift score (82%) + "Open findings: 12 (3 high · 5 med · 4 low)" = this is the screen I check after a configuration commit. One number tells me how bad it is.

The findings list with sev / code / text is exactly right. I can scan it and know which ones to put in tomorrow's standup.

The stage-by-stage build log is technically impressive and completely irrelevant to my daily work. I'd never read it. But it builds confidence that something real is happening — so I'd leave it, but collapsed by default.

"Re-run baseline" and "Run on commit" buttons both do nothing. For a pilot these need to be clearly labeled as "not yet connected" or removed. A consultant who clicks "Re-run" and nothing happens will think the tool is broken.

### Methodology (#library)
**Reference layer, not a daily driver. Wrong position in the nav.**

I don't open this. When I need methodology context I look it up in a Confluence page or ask a colleague. Having 17 methodology cards filtered by phase is useful when onboarding a new consultant who doesn't know Pathfinder — not for daily use on an active engagement.

The phase filter and cards work fine. But this should not be a primary nav item. It should be a footnote reference accessible from the OC guides and the project home phase ribbon — not a top-level destination.

### Ask (#ai)
**A dead end. Don't ship it in this state.**

The textarea with suggestions is the right UX skeleton. The four suggested questions are exactly the questions I'd ask: "What's blocking the NSU Sprint 1 demo?", "Summarize all open client decisions older than 5 days."

But clicking Ask does nothing. There's no response. The button is disabled unless there's text, which correctly implies something will happen — but it doesn't.

A consultant on a pilot will type a question, click Ask, wait, see nothing, and never open this page again. That's worse than not having the feature. Either wire a stubbed response ("Here are the 2 open DRCs older than 5 days...") or remove the page from the pilot nav entirely.

### Settings (#settings)
**Fine. One misleading line.**

Theme toggle + launch screen preference: adequate. I'd set these once and forget them.

"Connected sources: Jira · Smartsheet · Autopilot · Standup notes — All connected" with a green pill: **this is a lie in the prototype context.** If a consultant sees this on a pilot, they will expect the data to be live. When they discover it's not, the trust hit is larger than if you'd just said "demo data" upfront. Fix this.

---

## 2. What to Cull

- **Board view in My Work.** Consultants have Jira. Two boards means double maintenance. Keep Buckets, hide the toggle or remove the Board tab entirely.
- **Ask page (#ai) from primary nav.** Placeholder without backend = active trust risk. Remove from nav, keep the route behind a flag or label it "Preview — not yet connected."
- **Methodology library from top-nav.** Demote to a link inside the OC guide right rail and the Project Home phase description. Not a primary destination.
- **Calendar view toggle on Project Home.** Fine feature but not the daily view. Default to Timeline-only for pilot. Add Calendar back as a labeled alternate when the feature is more polished.
- **"All connected" in Settings.** Replace with "Demo data — not connected to live systems" or remove the connected-sources row.
- **Build log (Autopilot) expanded by default.** Collapse it. The findings list is the user artifact; the log is the developer artifact.

---

## 3. MVP Scope for Pilot

### Must (can't go to pilot without these)
- At least 3–4 OC guides with real content. SOATERM is done. SFARCTL (registration windows) and SSASECT (section build) are the next two I'd use every day in a Build sprint. Minimum: those three plus one HR form.
- Capability card → capability detail navigation fixed (currently routes to list, not detail).
- DRC row → OC guide navigation working (from the Decisions list, clicking a DRC should land on the right guide section, not toast).
- Stub labels on anything unimplemented: not a toast that says "Would open X" but a clear "Not yet available" state that doesn't break the flow.
- Settings "connected sources" row labeled as demo data.

### Should (consultants will notice the gap but tolerate it)
- Workshop detail view — at minimum show the agenda, the DRCs targeted, the OCs walked. Even a static read-only view beats notImplemented.
- Cross-capability stub reduction — at least bc-records and one Finance/HR capability with real detail data (even partial).
- Autopilot "Re-run" / "Run on commit" buttons labeled as "Not connected in this build" instead of silently failing.
- My Work hero count line — "10 items: 2 today, 1 urgent" before the list.

### Could (won't block pilot adoption)
- Ask page with stubbed AI responses (could do without an LLM — just pattern-match on the suggestions and return canned responses that look real).
- More capabilities populated in detail data.
- Portfolio-level schedule gantt (all 8 engagements).
- Gantt milestone dots routing to the relevant detail page.

---

## 4. Concrete Work Items

| Item | What | Size |
|---|---|---|
| **Route fix: cap cards → cap detail** | Project Home capability cards navigate to `#capabilities`, not `#capabilities/bc-curriculum`. One-line hash change. | S |
| **Route fix: DRC → OC guide section** | Decisions list and DRC rows should navigate to `#guides/soaterm#section-id`. Requires anchor routing in the guide page. | S |
| **3 more OC guides with real content** | SFARCTL + SSASECT + one HR form (e.g. NBAJOBS). Each needs: sections, intro text, callouts, field steps, at least one DRC, ConfigFieldsTable rows. | L each |
| **Workshop detail view** | Static read view: title, date, location, DRCs targeted (linked), OCs walked (linked), facilitator. No editing required for pilot. | M |
| **Stub state polish** | Replace all `notImplemented("...")` toasts with a tasteful "Not available in this build" inline state that doesn't break the user's sense of progress. | S |
| **Settings: demo data label** | Remove "All connected" green pill. Replace with "Demo data — connects to Jira and Smartsheet in production." | S |
| **My Work hero count** | Add "N items · M urgent" to the PageHero sub line. | S |
| **Remove Board tab from My Work** | Hide or disable the Board toggle. One less thing to explain. | S |
| **Autopilot: label inactive buttons** | "Re-run baseline" → "Re-run (not connected)" — grayed, tooltip explaining it requires production integration. | S |
| **Demote Methodology in nav** | Move from primary rail to a "Reference" group or remove entirely, add as a link in the OC guide TOC cross-references section. | S |
| **2 more capability detail records** | bc-records and bc-financial-aid at minimum — clientOwner, consultantOwner, activity feed stub, budget rows. | M |

---

## 5. Risks — What Would Make Janet Quit and Go Back to Jira

**Risk 1: The OC guide content gap.**
A consultant opens SFARCTL — the most common Student form in a Build sprint — finds a placeholder, and decides the tool isn't ready. They go back to the shared drive. This is a Day 1 abandonment risk. There is no workaround. The content has to be there.

**Risk 2: Dead actions destroy trust.**
A consultant clicks "Re-run baseline," nothing happens. They click "Send a nudge" on a stale DRC, nothing happens. They click a DRC to open the OC context, get a toast, shrug. Three dead-end interactions in one session = "this thing doesn't work." Each `notImplemented` that behaves like a feature is a trust withdrawal. The fix is honest empty states, not silent failures.

**Risk 3: The "All connected" lie in Settings.**
If a consultant does a proper onboarding with a peer and discovers the data isn't live, and the settings page claimed it was, you have a credibility problem that's hard to recover from. Fix before any pilot.

**Risk 4: Only one consultant's engagement data is represented.**
The mock engagement is NSU / Janet's lens. If you give this to Derek Liu on the Lafayette engagement, every screen says "NSU," every brief references Janet's sprint, every decision is about FA Cohort Cutover. The data has to be either clearly fictional (labeled "sample engagement") or the tool has to have enough real multitenancy that a different consultant can see their own context.

**Risk 5: Board view creates confusion about Jira sync.**
A consultant sees the Board tab and asks "do I need to update this AND Jira?" That question kills 15 minutes in a team standup. Remove the Board tab.

**Risk 6: The brief says "refreshes hourly" / "pulled from Jira."**
If a consultant notices the data is stale relative to Jira, they lose confidence in everything else on the page — including the DRC counts and the sprint commitment numbers. For pilot, all dynamic-looking language about data freshness must be removed or qualified.

---

## 6. Open Questions for the User

1. **How many OC guides are we committing to for pilot?** I need at least 3 real ones (SOATERM + 2 more) before I'd show this to a colleague. What's the content bandwidth?

2. **Who is the pilot audience?** If it's just me (Janet, lead consultant on NSU), the current mock data is enough. If it's 3–5 consultants on different engagements, we need either multi-tenant data or a clear "this is demo data for the NSU engagement" framing.

3. **What does "pilot" mean operationally?** Do consultants use this alongside their existing tools (Jira, Smartsheet, shared drive) and report on overlap? Or does someone actually try to replace their Excel OC tracker with the ConfigFieldsTable? The success criteria change dramatically.

4. **Is the DRC sign-off capture production-aspiration or pilot-feature?** If it's aspiration, we should label it "captured in-toolkit only — not synced to Jira." If we're positioning it as a real artifact, we need a clear answer on where the sign-off hash lives and whether it has legal standing.

5. **What's the Autopilot connection story for the pilot?** Right now the autopilot runs are mock. Is there a real Banner SaaS tenant we can point this at, or is the pilot entirely on mock data? If mock, we need to be upfront with participants.

6. **Is the May 15 drift audit blocking pilot prep?** If the design-fidelity-guardian is doing a full audit on May 15, we shouldn't be shipping new OC guide content the same week. What's the staging sequence?

---

## Summary

The toolkit has a real core: the SOATERM guide, the DRC sign-off capture, the ConfigFieldsTable, and the Autopilot findings list. These four things together represent genuine daily-use value that doesn't exist anywhere else. The Project Home DRC banner is the best single feature — one line that tells you the top blocker and how bad it is.

The pilot risk is not the design. It's content depth. Eleven empty OC guides make the tool look unfinished to anyone who doesn't happen to work on SOATERM that week. The other risks (dead actions, misleading connected-sources claims, Board tab confusion) are fixable in a day each.

**Three things I'd demand before letting a colleague use this on Monday:**
1. SFARCTL and SSASECT guides with real content, matching the SOATERM model.
2. All `notImplemented` toasts replaced with honest "not available" states.
3. Settings "All connected" pill removed or relabeled as demo data.
