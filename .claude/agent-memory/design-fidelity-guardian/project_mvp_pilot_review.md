---
name: MVP pilot review — drift pre-audit
description: 2026-05-11 deep drift pre-audit of v2 surface vs tarball CgM4C5b7 ahead of (a) production pilot scoping and (b) the May 15 drift audit. Inventories every diff per ported surface with verdict, calls out toolkit-originals, ranks pilot-blockers vs cosmetic, and gives sequenced cleanup work.
type: project
---

**Date:** 2026-05-11
**Tarball baseline:** `CgM4C5b7mEU63Y2RQISWcw` extracted at `/tmp/design-CgM4C5b7/n2s-consulting-toolkit/project/`
**Active surface (port):** `components/v2/{shell,practice,home,pages,detail,icons}.tsx` + `lib/{data,school-brands,brief}.ts` + `app/styles/{tokens,v2,detail}.css`
**Active surface (tarball):** `project/v2/*.{jsx,css}` + `project/{data,data-extra,data-v2}.js` + `project/v2/{brief,school-brands}.js` + `project/tokens.css`

# 1. Current-state findings — drift per surface

Tags: **[E]** expected (TS/Next.js conversion), **[I]** intentional toolkit-original (in memory), **[A]** accidental drift (fix before audit), **[F]** port fix vs broken source, **[Q]** open question for user.

## 1a. `components/v2/icons.tsx` ↔ `project/v2/icons.jsx`
- **[E]** ESM/TS conversion; `IconName` exported union; `window.V2Icon` global removed.
- **[E]** `warn`/`alert` and `spark`/`sparkle` collapsed via fall-through cases — produces identical SVG output. No drift.
- **No user-visible drift.**

## 1b. `components/v2/shell.tsx` ↔ `project/v2/shell.jsx`
- **[E]** TS, hooks imports, no `window.X` globals.
- **[I-NEW]** **Toast system** added (`ToastHost`, `notImplemented`, `.v2-toast*` styles). Replaces browser `alert()` with non-blocking bottom-right pill. Not in tarball. **Add to memory** as a fourth toolkit-original.
- **[I-NEW]** ⌘K/Ctrl-K binds focus to top-bar search input. Not in tarball. Small ergonomic add.
- **[A] PageHero `has-logo` rule lost.** Tarball: `<header className={\`v2-hero ${logo ? "has-logo" : ""}\`}>` with CSS `gap: 20px; align-items: center;`. Port: drops the conditional class, wraps logo in `.v2-hero-logo` with `padding-top: 4px`. **Visual drift on Project Home hero** (only screen that passes `logo`). Hero text/logo alignment is slightly off vs tarball.
- **[A] ProjectSwitcher menu — `SchoolLogo` removed per row.** Tarball renders 32px monogram next to each engagement; port deleted it. Grid template went from `auto 8px 1fr auto` to `8px 1fr auto`. **User-visible regression** — picker is now identity-poor.
- **[A] ProjectSwitcher footer — "Logos auto-detected · Override" line removed.** Tarball includes it linked to settings; port deleted both JSX and CSS (`.v2-projmenu-detect`). Cosmetic but it was a deliberate trust signal.
- **[A] `.v2-projswitch` (top-bar pill) padding** changed `5px 12px 5px 6px` → `7px 12px 7px 14px`. Slight cosmetic drift. No reason given.

## 1c. `components/v2/practice.tsx` ↔ `project/v2/practice.jsx`
- **[E]** TS, ESM, `alert()` → `notImplemented()`.
- **[F] TodayAcross schema fix.** Tarball reads `t.state` (`"blocked" | "in-review" | …`) — but `TASKS` data uses `t.status` with new vocabulary (`"In Progress" | "Needs Review" | "Backlog" | "Ready" | "Done"`). **Tarball is internally inconsistent**; port consumes the new field correctly. Acceptable.
- **No user-visible drift** beyond the schema fix.

## 1d. `components/v2/home.tsx` ↔ `project/v2/home.jsx`
- **[E]** TS conversions, `useApp/useHash` ESM imports.
- **[A] Loss of deep-link navigation.** Tarball routes:
  - capability card → `project/capabilities/${bc.id}`
  - workshop row → `project/workshops/${w.id}`
  - in-flight guide row → `project/guides/${oc.id}`
  - sprint task row → `mywork/${t.id}`
  Port collapsed all four to `capabilities` / `workshops` / `guides` / `mywork` (index pages). Even where detail pages exist (`#capabilities/<id>`, `#guides/<id>` are wired in `app/page.tsx`), the project home no longer deep-links to them. **Actual UX regression.** Note: tarball `project/capabilities/<id>` etc. routes are themselves broken in the tarball (its `app.jsx` only wires flat `capabilities/<id>` and `guides/<id>`), so this is more "port over-corrected" than "tarball worked and we broke it."
- Pre-existing minor: tarball uses `drcsInPhase[0].title || drcsInPhase[0].label` for top blocker; port uses `topDrc.title` only. Functionally equivalent against current data.

## 1e. `components/v2/pages.tsx` ↔ `project/v2/pages.jsx`
- **[E]** TS, ESM, `alert()` → `notImplemented()`, `D_Icon`/`PIcon` → `Icon`.
- **[I] MyWorkPage kanban toggle** (memory item #1). 5-column board. ✓
- **[I] SchedulePage gantt** (memory item #2). 12-month swimlane with today marker, milestone dots, legend. ✓
- **[A] AskPage textarea** lost class `v2-ai-input` and changed inline `background: var(--surface-1)` → `var(--bg-elevated)`. `--surface-1` is undefined in tokens.css, so the change is effectively a port fix that picks a defined token — but it does change the rendered background slightly vs tarball-as-rendered. **Cosmetic drift**, defensible.
- **[A] AutopilotPage** Findings + Build log eyebrow gained inline `paddingLeft: 18, paddingTop: 16`. Likely a layout fix during port, not in tarball. Cosmetic.
- **[E]** `MethodologyPage` filter list inline `background: transparent, border: none` added — also a port-time visual nudge; minor cosmetic.

## 1f. `components/v2/detail.tsx` ↔ `project/v2/detail.jsx`
- **[E]** TS, ESM, `useDState` → `useState`, `useDEffect` → `useEffect`, `D_Icon` → `Icon`, type annotations on `DETAIL_BY_CAP`, `BUDGET_BY_CAP`, `OC_INDEX_FALLBACK`, `DrcSignoffPanel`, `DrcRow`, `InlineTaskRow`, etc.
- **[I] `ConfigFieldsTable`** (memory item #3). Mounted under each section. Two-state confirm, localStorage-backed. ✓
- **[F]** `oc.cap.toLowerCase()` lookup added — tarball compared `oc.cap === "bc-curriculum"` directly; port handles uppercase variants. Robustness fix.
- **[F]** Replaced `window.__v2Toast` global with shell-provided `notImplemented` (toast system). Cleaner, same UX.
- Body content (intros, headers, copy, callout text, code snippets, all OC walk steps) **matches tarball verbatim** for SOATERM (the only fully-populated guide).

## 1g. `lib/data.ts` ↔ `project/{data,data-extra,data-v2}.js`
- **[E]** Single TS file collapsing three tarball JS files; window-globals → ESM exports; types on `Member`, `Project`, `MILESTONE_TYPES`, `FINDING_INDEX`.
- **[I]** `TaskStatus` / `TASK_STATUSES` (kanban — memory item #1).
- **[I]** `ConfigField` / `CONFIG_FIELDS_BY_OC` (config-tasks — memory item #3, only SOATERM populated).
- **Spot-checked PORTFOLIO** (`p1`-`p8`): values byte-identical except whitespace. ✓

## 1h. `lib/school-brands.ts` ↔ `project/v2/school-brands.js`
- **[E]** TS types, `next/font` CSS-variable references in `SCHOOL_BRAND_FONT_STACK` (`var(--font-playfair)` instead of `'Playfair Display'`).
- **[F]** `accent` field removed per project. The tarball defines `accent: { kind: 'bar-bottom', color: '...' }` for each school but **no consumer uses it** — `shell.jsx`'s `SchoolLogo` says verbatim "No decorative accents. Identity = typeface + color." Port pruned dead data; behavior identical.
- **[F]** Dropped unused `'script'` font key (no school references it).
- **No user-visible drift.**

## 1i. `lib/brief.ts` ↔ `project/v2/brief.js`
- **[E]** TS conversion. Wrapping `(function(){…})()` removed; named exports. Whitespace re-flowed. Strings/fragments byte-identical.
- **No drift.**

## 1j. `app/styles/v2.css` ↔ `project/v2/styles.css`
- **[I]** `.v2-mywork-viewtoggle`, `.v2-board-*`, `.v2-gantt-*`, `.v2-toast*` — toolkit-originals appended.
- **[A]** `.v2-projswitch` padding & `.v2-projmenu-item` grid template — drift listed in 1b.
- **[A]** `.v2-projmenu-detect` block deleted — drift listed in 1b.
- **[A]** `.v2-hero.has-logo` rules deleted, replaced by `.v2-hero-logo` — drift listed in 1b.
- **[E]** `@import url("./tokens.css")` and `@import url("./detail.css")` added at top — Next.js requires explicit imports (host HTML in tarball loads them via `<link>`).

## 1k. `app/styles/detail.css` ↔ `project/v2/detail.css`
- **[F] Wholesale token rename.** Tarball detail.css uses `--surface`, `--surface-alt`, `--text`, `--text-soft`, `--radius-2`, `--font-display` — **none defined in `project/tokens.css`**. The tarball detail surface renders against undefined custom properties; the port rewrote to `--bg-panel`, `--bg-elevated`, `--text-primary`, `--text-secondary`, `--radius-md`, `--font-sans` (all defined). **Port renders correctly; tarball-as-shipped does not.** Net: this is a port correctness fix that breaks byte-parity. **[Q]** Confirm with user that the rewrite stands and the tarball's broken tokens are not the parity baseline.
- **[I]** `.d-configtable-*` block appended for ConfigFieldsTable.

## 1l. `app/styles/tokens.css` ↔ `project/tokens.css`
- **No diff.** Identical.

## 1m. Routing — `app/page.tsx` ↔ `project/v2/app.jsx`
- **[E]** Next.js conversion (`AppProvider`, `PageShell`, ESM, `useEffect` for default-landing).
- Both wire only flat `capabilities/<id>` and `guides/<id>` detail routes. Mywork/workshops/decisions stay as index pages on both sides.

# 2. Extraneous — what to remove for a clean audit baseline

| Item | Status | Recommendation |
|---|---|---|
| `components/views/*` (legacy v1 ports) | Mirrors `project/v1-archive/*.jsx` in tarball | **Keep for now.** Tarball still ships v1-archive, so deleting the port-side mirror creates a one-sided gap. Pilot doesn't ship the v1 surface (not mounted in `app/page.tsx`). **[Q]** Ask user whether to drop both sides at once (tarball can't drop, only ours) — i.e. accept the asymmetry and delete v1 in port. Recommendation: **delete v1 port now**, since v2 is the audit baseline and v1 is dead weight. Saves audit time and reduces "what does the audit care about" ambiguity. |
| `components/{shell,icons,tweaks-panel}.tsx` (root, v1) | Mirrors `project/{shell,icons,tweaks-panel}.jsx` | Same call as above — delete with v1 surface. |
| `app/styles/styles.css` | Mirrors `project/styles.css` (v1 styles) | Delete with v1 surface. |
| `docs/NN Ellucian Student Banner Signature Project Plan (1).xlsx` | Untracked, referenced by `detail.tsx` foot copy | Keep (it's the consultant-facing source of truth referenced in copy), but **add `.gitignore` entry or commit deliberately** — currently untracked and ambiguous. **[Q]** Decide. |
| `/tmp/design-CgM4C5b7/` extracted tarball | Audit working dir | Don't commit. Already conventionally `/tmp/` only. ✓ |

# 3. MVP scope for pilot — drift posture

A "production pilot" = real Ellucian consultants on a real engagement. Bar is "the prototype reads as a faithful, working tool" — not "the prototype matches the design pixel-for-pixel."

## Must-have (pilot blocker if unresolved)
- **Project Home deep-links** (1d). On a real engagement, clicking a sprint task on the Project Home and landing in My Work index instead of the task is friction. Same for capability cards → capability detail. Detail pages exist; just wire the ids.
- **ConfigFieldsTable populated for at least 2 more OCs** beyond SOATERM. Pilot consultants will open SPAIDEN, SFARCTL, SSASECT — currently they hit the empty-state pill on every section. Either populate or move the empty-state copy from "No config fields captured yet" to "Config-fields capture is coming next sprint." Methodology-guru and lead-developer should split this; not your call.
- **Detail.css token sanity** (1k). Already fixed in port; confirm the user is OK with this fix (open question Q).

## Should-have (pilot will function but rough edges)
- **PageHero `has-logo` parity** (1b). Project Home hero alignment is slightly off vs tarball.
- **ProjectSwitcher menu logos** (1b). Pickers without identity are forgettable; we already invested in `SchoolLogo` — use it here.
- **ProjectSwitcher menu "Logos auto-detected" footer** (1b). Less critical, but it telegraphed trust.

## Could-have (cosmetic — fine for pilot, fix before audit)
- `.v2-projswitch` padding nudge (1b).
- AskPage textarea bg (1e).
- AutopilotPage eyebrow inline padding (1e).
- MethodologyPage filter list inline transparency (1e).

# 4. Concrete work items — sequenced

**Before pilot ship (S = ≤30 min, M = ≤2hr, L = ≥half-day):**

1. **[S]** Wire Project Home deep-links: capability card → `capabilities/${bc.id}`, guide row → `guides/${oc.id}`. Workshops/mywork stay as index until those detail routes exist. Owner: lead-developer.
2. **[S]** Restore `SchoolLogo` per-row in ProjectSwitcher menu and re-apply tarball CSS grid template `auto 8px 1fr auto`. Owner: lead-developer.
3. **[S]** Restore `.v2-projmenu-detect` footer in ProjectSwitcher (or formally drop it — get user call). Owner: lead-developer + ux-visionary.
4. **[S]** Re-apply `.v2-hero.has-logo` CSS (from tarball) to fix Project Home hero alignment. Owner: ux-visionary.
5. **[S]** Restore `.v2-projswitch` padding to `5px 12px 5px 6px`. Owner: ux-visionary.
6. **[M]** Decide on legacy v1 deletion (open question Q, see §6). If yes, delete `components/views/*`, `components/{shell,icons,tweaks-panel}.tsx`, `app/styles/styles.css`. Owner: chief-architect call → lead-developer.
7. **[M]** Brief §11 follow-ups — pilot positions:
   - **Sprint 0 / AAW workshops** — for pilot, `WORKSHOPS` already covers a representative AAW pattern; do not block pilot on AAW pre-population. **Audit position: defer to post-pilot.** Owner: methodology-guru to confirm.
   - **Activity feed source** — current synthesized `recentActivity` array on `bc-curriculum` is the only populated one. Other capabilities show empty. **Audit position for pilot: pre-populate `recentActivity` for at least 2 more capabilities from existing TASKS+DRCS+AUTOPILOT_RUNS** so consultants don't see dead surface. Synthesis-on-read is post-pilot. Owner: methodology-guru + lead-developer.
   - **Capability inventory expansion** — brief recommends staying at curated 12. **Audit position: agree, ship 12 for pilot.** Owner: methodology-guru.
8. **[L]** Populate `CONFIG_FIELDS_BY_OC` for SPAIDEN, SFARCTL, SSASECT minimum (the three OCs most likely to be opened on pilot). Owner: methodology-guru.

**Before May 15 audit (post-pilot or alongside):**

9. **[S]** Write the actual `DRIFT-AUDIT-2026-05-15.md` once the above critical items are closed. Format per agent file standard. Owner: design-fidelity-guardian (me).
10. **[S]** Update `MEMORY.md` to add the toast/⌘K toolkit-originals (5th + 6th items) once user confirms classification. Owner: me.

# 5. Risks

- **R1 — Legacy v1 deletion vs audit baseline.** If we delete `components/views/*` and the user later re-anchors the audit baseline to include `project/v1-archive/`, we have a one-sided drift. Mitigated by getting an explicit user call (Q1).
- **R2 — Detail.css token drift is a documented port-fix.** If the May 15 audit was meant to compare detail.css byte-for-byte vs `project/v2/detail.css`, we *will* show drift on every rule. The audit needs a written rule that "tarball uses undefined tokens; port uses the defined-token equivalents and that is the new baseline." Mitigated by §6 Q2.
- **R3 — Configuration Guide content gap on non-SOATERM OCs.** A pilot consultant opens SPAIDEN, sees "config field capture is coming next sprint" everywhere — risks framing the entire surface as half-built. Mitigated by populating 2-3 more OCs (work item §4.8).
- **R4 — Project Home loses deep-links.** Real consultants click hard. The current "click a task → land on My Work index → re-find the task" is the kind of friction that gets the toolkit tuned out. **The single highest-leverage pilot fix.**
- **R5 — Tarball drift cadence.** Tarball was refreshed once already (40V7… → CgM4C5b7…). If it refreshes again before May 15 we'll need a delta-only audit. Mitigated by re-fetching at audit time and updating `reference_design_tarballs.md`.

# 6. Open questions for the user

1. **Re-anchor audit baseline?** Right now the port carries `components/views/*` (v1) which mirrors `project/v1-archive/*` (tarball). Do you want to:
   - (a) **Delete v1 from port** and declare v2 the only audit baseline, or
   - (b) **Keep v1** and have the May 15 audit cover both v2 and v1-archive, or
   - (c) Keep v1 in tree but explicitly out-of-scope for the audit?
   Recommendation: (a). v1 is dead weight; the tarball's v1-archive will keep existing if anyone ever needs to reconstruct it.

2. **Detail.css token rewrite.** Tarball `project/v2/detail.css` references `--surface`, `--surface-alt`, `--text`, `--text-soft`, `--radius-2`, `--font-display` — none defined in `project/tokens.css`. Port rewrote every rule to use the defined token vocabulary (`--bg-panel`, `--bg-elevated`, `--text-primary`, `--text-secondary`, `--radius-md`, `--font-sans`). Confirm: this stands as the port's permanent baseline (and the tarball's broken tokens are not parity)? Recommendation: yes — record as a 4th confirmed intentional deviation.

3. **Toast / ⌘K shell additions.** Port adds (a) `notImplemented()` toast (replaces all `alert()`) and (b) ⌘K binds top-bar search focus. Neither is in the tarball. Classify as toolkit-originals (intentional adds) and move on, or revert to match tarball? Recommendation: keep both; classify as the 4th and 5th confirmed toolkit-originals.

4. **`docs/NN Ellucian Student Banner Signature Project Plan (1).xlsx` (untracked).** Commit it (it's referenced by detail-page copy as the source of truth) or formally `.gitignore` it as a working artifact?

5. **ProjectSwitcher footer "Logos auto-detected · Override".** Restore the line per tarball, or leave deleted and treat as a deliberate trim? It pointed to a settings page that today shows mostly stub content.

6. **Pilot scope vs audit scope.** Is "production pilot" the same gate as the May 15 audit, or two distinct gates? If two, which fixes block which? My read is pilot blocks on §3 must-haves only; audit blocks on §3 must-haves + should-haves. Confirm.
