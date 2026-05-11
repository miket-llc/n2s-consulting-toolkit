---
name: design K3NKe3Iu shell slice — scope check
description: Scope/audit memo for new design tarball K3NKe3Iu: top-bar narrow + project selector relocation
type: project
---

# Design K3NKe3Iu Shell Slice — Scope Check (2026-05-11)

**Design tarball:** `K3NKe3IuvfS03Mr6yWnkDw`
**Old audit baseline:** `CgM4C5b7mEU63Y2RQISWcw`
**Scope verdict:** APPROVED — Sprint A tail (target EOD May 13); bump to B0 if lead-developer saturated.

---

## 1. Audit implications

**Recommendation: Option (a) — implement pre-audit and re-anchor baseline to K3NKe3Iu.**

The old baseline (CgM4C5b7) already had three shell drift items pending (C6 SchoolLogo in menu, C7 PageHero.has-logo, C8 projswitch padding). The new design supersedes those — the user explicitly rejected the old topbar layout in chat7.md and the designer responded with the K3NKe3Iu changes. Auditing against a layout the user already rejected produces noise, not signal.

**Why (a) over (b):** Options (b) (keep old baseline, accept noisy audit) and (c) (delay audit) are inferior. The audit's value is creating a documented parity baseline — it should reflect the design the team is actually building to. Re-anchoring to K3NKe3Iu makes the May 15 audit meaningful again.

**Contingency:** If the slice doesn't land by EOD May 13, the audit fires against CgM4C5b7 as scheduled. The topbar layout differences get classified as drift-acknowledged (intentional design evolution, not regression) and the baseline re-anchors in B0. Noisy but not blocking.

---

## 2. Scope of the shell slice

### In scope (minimum to deliver the user's ask)

1. **`TopBar` rework**: remove `<ProjectSwitcher/>` and `flex-1` spacer. TopBar becomes: brand · search · decisions button · theme toggle · avatar.
2. **New `ProjectContextBar` component**: ← Portfolio back-link | ProjectSwitcher | health/sprint/GL pills. Renders only when `route.split("/")[0]` is in `PROJECT_SCOPED_ROUTES = { "project", "capabilities", "guides", "decisions", "workshops", "schedule" }`.
3. **`PageShell` update**: add `<ProjectContextBar/>` between `<TopBar/>` and `<div className="v2-body">`.
4. **CSS**: new `.v2-projctx` strip (narrow, ~40px, existing palette tokens). Narrow `.v2-topbar` height to match new design density.
5. **SchoolLogo restore in ProjectSwitcher menu** (per-row): in scope because (a) it's in the new design's ProjectSwitcher and (b) it closes existing drift item C6 from the old audit.
6. **"Logos auto-detected · Override" footer in projmenu**: 3-line addition, matches new design, closes C6 remainder.
7. **Decisions attention button routing fix**: `navigate("decisions")` → `navigate("project/decisions")` to match new design routing.
8. **DRIFT-AUDIT-2026-05-15.md baseline update**: change `CgM4C5b7mEU63Y2RQISWcw` → `K3NKe3IuvfS03Mr6yWnkDw` in the audit header. Design-fidelity-guardian to re-classify C6-C8 as resolved.

### Explicitly out of scope for this slice

- Rail composition: new design has the SAME rail (Portfolio, Project, My work | Methodology, AI, Autopilot, Settings). No changes.
- Font/serif changes: ux-visionary ticket; not part of shell layout.
- Detail surface, pages, home: unrelated.
- New CSS tokens beyond `.v2-projctx` strip.
- PageHero.has-logo drift item (C7): CSS-only, fold into Sprint B16 cull unless trivial.

---

## 3. Sequencing impact on Stance B

**Recommendation: Sprint A tail. Target EOD May 13.**

Cost estimate: M (2–4 hours lead-developer). Well-specified: new design is the spec, no ambiguity. The component decomposition is clean: one new component, one modified component, CSS additions.

If lead-developer is already at capacity on A19/A20 audit pre-flight, bump to B0 (May 18). Don't force it and break the smoke gate before the audit.

---

## 4. What to cut (UX-visionary and product-owner proposals to resist)

- "Let's keep a subtle project chip in the topbar even on Portfolio" — NO. The user's explicit ask was to relocate it; the design's answer is correct. The global topbar doesn't need a project context on cross-engagement views.
- "Let's change the rail while we're in here" — NO. Rail is unchanged between old and new design. Separate ticket if ever.
- "Let's polish the projctx strip height / colors further" — ux-visionary can propose post-implementation, not during. Implement to spec first.
- "Project selector should also appear on MyWork" — see §5.

---

## 5. What to add / watch

**My Work and currentProject state (flag for lead-developer):**  
The new design hides `ProjectContextBar` (and therefore the project switcher) on the `mywork` route. This is deliberate: MyWork is framed as practice-wide / cross-engagement ("your work"). But the existing `TASKS` data is filtered by `project: "nsu"` which maps to `currentProject`. If Janet switches to WIU from a project view and then goes to MyWork, she'll see WIU tasks with no visible indication of which engagement is current or how to change it.

This is a UX gap the new design introduces. The acceptance criteria must include an explicit call-out so lead-developer doesn't make a silent assumption. Options are: (a) make MyWork truly cross-engagement (aggregate tasks from all portfolio members) — correct but more data work; (b) show a subtle "Viewing: [project name]" label in the MyWork page hero — minimal but honest; (c) accept the implicit behavior (context follows last-selected project) and document it.

**Recommendation:** Lead-developer should implement (b) as a one-line addition to the MyWork hero's eyebrow — "NSU · Northern State University" — so the current engagement context is visible even without the switcher. Small, safe, correct.

---

## Why: and How to apply

**Why:** The user explicitly flagged the topbar and project selector in chat7 as a regression from earlier HEEAR-editor branding. The designer addressed it directly in K3NKe3Iu. This is a design correction, not scope creep.

**How to apply:** For any future scope call touching the shell: the K3NKe3Iu design is now the authoritative spec for the top-bar/context-bar/rail split. Don't pull the project switcher back into the topbar. Don't add items to the rail without a tarball change.
