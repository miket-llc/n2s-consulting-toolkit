---
name: MVP pilot readiness — UX/visual audit (2026-05-11)
description: Full UX, a11y, and CSS audit of v2 surface for production pilot readiness
type: project
---

# UX Pilot Readiness Audit — 2026-05-11

Routes audited: all 11 v2 hash routes (home, project, mywork, decisions, timeline, schedule, oc-guide, configuration guide, autopilot, inner-source, cockpit).
CSS files: `app/styles/tokens.css` (161 lines), `app/styles/v2.css` (~1918 lines), `app/styles/detail.css` (717 lines).
Three new surfaces: kanban board (MyWork), gantt (Schedule), config-table (Configuration Guide).

---

## 1. Current-State Findings

### Polished / On-system
- Token discipline is strong in v2.css core (shell, rail, hero, cards, timeline ribbon). Color, spacing, radius almost entirely CSS vars.
- Chip/pill system (`pill-*`) covers all semantic tones with dim backgrounds. Consistent.
- Hover states on all core list rows (`.v2-row`, `.v2-dec`, `.v2-cap-card`, `.v2-rail-item`) use `--bg-hover` + border-color upgrade — correct and consistent.
- `.v2-ribbon-cell:focus-visible` is correct and the only properly-specified focus ring in the codebase.
- Toast system is clean: `v2-toast-host` is accessible (`aria-live="polite" aria-atomic="true"`).
- Theme-light surfaces (`--bg-panel`, `--bg-elevated`, border) are all properly mapped. Core navigation reads well in both themes.
- Kanban board: responsive breakpoints at 1100px and 720px are correct. Column header, count badge, card layout are structurally sound.
- Gantt readiness cards: correct border-color hover. Progress bars populated.

### Rough / Inconsistent Across Themes

**Critical (broken):**
- `--surface-1` and `--surface-2` are used 7× in the Autopilot pane (v2.css lines 1329, 1362, 1427, 1439, 1483, 1496, 1504) but are NOT defined anywhere in tokens.css or v2.css. In all themes they resolve to `initial` (transparent or no background). The entire Autopilot surface is visually broken — backgrounds missing on panes, stage rows, and finding cards.
- `.d-code` block (detail.css:522) uses hardcoded `background: #0b1018; color: #d6dbe5`. In light mode, code blocks in the Configuration Guide render with a nearly-black background but white text reversed against a white page. The code block header uses `rgba(255,255,255,0.04)` and `rgba(255,255,255,0.08)` — invisible in light mode.

**Serious:**
- Gantt dot text contrast: `color: white` (v2.css:1865) on `.tone-cyan` (dark: `#3ecfff` → 2.1:1), `.tone-rose` (dark: `#ff7a90` → 2.7:1), and `.tone-ghost` (`#6b7190` → 3.4:1) all fail WCAG AA (need 4.5:1 for small text). `.tone-violet` and `.tone-amber` correctly override to `color: var(--bg-panel)` but cyan/rose/ghost do not.
- In light mode `.tone-cyan` background becomes `#0891b2` → white text at 2.9:1. Still failing. `.tone-rose` in light is `#e11d48` → white ~4.6:1 (just passes). `.tone-ghost` in light is `#9ca3af` → white at 2.5:1.

**Theme-parity gaps:**
- `.v2-attn-count` uses `rgba(255,255,255,0.5)` in dark, correctly overridden for `.theme-light` (line 438). Good catch — intentional and done right.
- `.d-configtable-row.is-confirmed { border-color: var(--emerald) }` — dark emerald is `#3ee8a8` (neon/saturated), light is `#059669` (muted green). The neon border in dark is acceptable for a "confirmed" state but feels louder than intended.

---

## 2. Extraneous Styling to Cull

### Dead files
- `app/styles/styles.css` — 532 lines, v1 legacy. Not imported anywhere in the v2 surface (`app/layout.tsx`, `app/page.tsx`, all `components/v2/*.tsx`). Confirmed zero imports. Safe to delete or archive.

### Duplicate rules within v2.css
- Line 179–183: `.v2-main { padding: 32px 48px 80px }` — overridden by line 184 `.v2-main { padding: 20px 32px 60px }`. Line 179 block is dead.
- Line 662: `.v2-section { margin-bottom: 36px }` — overridden by line 668 `.v2-section { margin-bottom: 24px }`.
- Lines 663–667: `.v2-section-head { ... gap: 24px; margin-bottom: 16px }` — overridden by line 669 `.v2-section-head { margin-bottom: 12px }`. The gap from line 663 survives (line 669 only sets margin).
- Lines 51–53: `.internals`, `.internals-flex`, `.internals-inline` no-op rules. Comment explains they're kept as hooks. Safe to delete unless specifically needed.

### Duplicate rules in detail.css conflicting with v2.css
- Lines 598–603: `.row { display: flex }`, `.row.gap-2`, `.row.gap-1`, `.row.items-center`, `.flex-1` — all already defined in v2.css. Creates potential specificity conflicts.
- Lines 603–606: `.stack { display: flex; flex-direction: column }`, `.stack.gap-1`, `.stack.gap-2` — already in v2.css.
- Lines 607–612: `.btn-link` — already in v2.css with slightly different definition (v2.css has `padding: 0; font-weight: 500; font-size: var(--fs-small)` plus hover; detail.css omits padding and font-size). Detail.css version will override inside the detail import chain.
- Line 492: `.t-h3 { font: 600 15px var(--font-sans) }` — conflicts with v2.css `.t-h3 { font-size: var(--fs-h3); font-weight: 600 }`. v2.css fs-h3 = 14px after density override; detail.css bakes 15px. Since detail.css is @import'd inside v2.css (line 9), detail's rule loads first, then v2.css `.t-h3` rule comes after → v2.css wins. But it's confusing and misleading.
- Line 615: `.v2-hero-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center }` — already defined in v2.css line 533. The detail version adds `flex-wrap: wrap; align-items: center` overrides.

---

## 3. MVP Scope for Pilot

### Must-have (client meeting blocking)
1. **Fix `--surface-1`/`--surface-2`** — Autopilot route is visually broken today. Map: `--surface-1 → var(--bg-panel)`, `--surface-2 → var(--bg-elevated)`. Either add to tokens.css or replace inline. [S]
2. **Focus-visible on all interactive elements** — keyboard-only navigation is currently unusable except on the ribbon. At minimum: `.v2-board-card`, `.v2-row`, `.v2-dec`, `.v2-rail-item`, `.v2-cap-card`, `.v2-gantt-dot`, `.d-configtable-review`, `.v2-mywork-viewtoggle button`, `.v2-viewtoggle button`. Pattern to use: `outline: 2px solid var(--border-focus); outline-offset: 2px;` (same as ribbon). [M]
3. **Fix `.d-code` for light mode** — code blocks in the Configuration Guide must not be pitch-black in light mode. Options: (a) use `var(--bg-void)` background + `var(--text-primary)` text in dark, a light-safe dark alternative; or (b) add a `.theme-light .d-code` override using a light gray `--bg-elevated` bg with `--text-primary`. [S]

### Should-have (not client-blocking but expected at pilot fidelity)
4. **Gantt dot contrast** — `.tone-cyan`, `.tone-rose`, `.tone-ghost` dots need `color: var(--bg-panel)` instead of `color: white` to achieve WCAG AA in dark mode. [S]
5. **`prefers-reduced-motion` media query** — add a single `@media (prefers-reduced-motion: reduce)` block disabling `transform` hover lifts (`.v2-three-item`, `.v2-mini`, `.v2-projcard`, `.v2-board-card`, `.v2-gantt-dot`) and `translateY` animations. [S]
6. **Cull duplicate detail.css utilities** — remove lines 598–615 from detail.css (duplicate `.row`, `.stack`, `.flex-1`, `.btn-link`, `.t-h3`, `.v2-hero-actions`). [S]
7. **Normalize transitions to tokens** — `.v2-board-card`, `.v2-gantt-readinesscard`, `.v2-mywork-viewtoggle button`, `.v2-ap-run` all use raw `120ms` without easing. Replace with `var(--transition-fast)`. [S]
8. **Delete `app/styles/styles.css`** or move to `legacy/`. [S]

### Could-have (polish, not pilot-blocking)
9. `.v2-board-card { border-radius: 8px }` → `var(--radius-md)` (10px). [XS]
10. `.v2-gantt-readinessbarfill` add `border-radius: 4px` (all other bar fills have it). [XS]
11. `.btn-primary { color: #fff }` → `color: var(--text-inverse)`. [XS]
12. Remove dead `.v2-main` and `.v2-section` duplicate rules from v2.css. [XS]
13. Token for `--surface-code-bg` if code blocks are a recurring pattern (they are). [S]

---

## 4. Concrete Work Items (Sequenced, T-shirt Sized)

| # | Work item | File | Size | Notes |
|---|-----------|------|------|-------|
| 1 | Fix `--surface-1`/`--surface-2` | tokens.css OR v2.css L1329 etc. | S | Add two aliases to tokens.css or find-replace in v2.css. Both themes. |
| 2 | Focus-visible pass — all interactive elements | v2.css + detail.css | M | One `@scope` or per-selector pass. Pattern: `outline: 2px solid var(--border-focus); outline-offset: 2px`. |
| 3 | Fix `.d-code` light mode | detail.css L522–531 | S | Add `.theme-light .d-code` override: bg=`--bg-elevated`, text=`--text-primary`, head borders in `--border`. |
| 4 | Gantt dot text contrast | v2.css L1872–1877, L1907–1911 | S | `.tone-cyan`, `.tone-rose`, `.tone-ghost` → `color: var(--bg-panel)`. Both dot and legend swatch. |
| 5 | `prefers-reduced-motion` block | v2.css (append) | S | Disable transform lifts + scale transitions. One `@media` block at end of file. |
| 6 | Cull detail.css duplicates | detail.css L492, L598–615 | S | Remove `.row`, `.stack`, `.flex-1`, `.btn-link`, `.t-h3`, `.v2-hero-actions`. |
| 7 | Normalize transitions | v2.css L1597, 1679, 1753, 1388 | S | Replace `120ms` with `var(--transition-fast)` (0.15s cubic). |
| 8 | Delete/archive styles.css | app/styles/styles.css | S | Confirm no imports, delete. |
| 9 | Cull dead v2.css duplicate rules | v2.css L179, 662–667 | XS | Remove dead first-instance overrides. |
| 10 | Fix border-radius + color tokens | v2.css L1671, 126 | XS | Board card → `var(--radius-md)`; btn-primary → `var(--text-inverse)`. |
| 11 | Add `--surface-code-bg` token | tokens.css | S | Dark: `#0b1018`; Light: `var(--bg-elevated)`. Makes code block dark-only coloring legit. |

**Token additions needed:**
- `--surface-1`: alias for `--bg-panel` (or new name). Needed to fix Autopilot.
- `--surface-2`: alias for `--bg-elevated`. Same.
- `--surface-code-bg` / `.theme-light --surface-code-bg`: resolves the code block theme bifurcation properly.

---

## 5. Risks

- **Autopilot pane is demo-broken today.** If any consultant clicks "Autopilot" in the rail at a 9am client meeting, they see a transparent/unstyled pane. This is the single highest-priority fix.
- **Keyboard navigation failure.** A consultant demoing with keyboard-only (or screen-reader-curious client) reveals the a11y gap immediately. The pilot audience likely won't surface this, but it's technically WCAG non-compliant.
- **Light mode is the default.** The code block bug in Configuration Guide is visible in the default experience. Any demo walk-through of the config steps will hit it.
- **Gantt dot contrast is marginal.** On a projector or cheap monitor (common in conference rooms), the white-on-cyan / white-on-ghost dots will be unreadable.
- **`styles.css` is dead weight but not harmful** — zero risk to leave it, zero benefit to keep it.
- **detail.css duplicates create specificity volatility.** Any future edit to `.btn-link` or `.t-h3` in v2.css may not take effect inside detail views because detail.css overrides. Could cause hard-to-debug styling issues mid-sprint.
- **No `prefers-reduced-motion`.** Accessibility concern. Low likelihood of being triggered during a pilot but relevant for WCAG AA.

---

## 6. Open Questions

1. **Code blocks in dark mode**: should they stay near-black (`#0b1018`) or use `--bg-void`? The current dark color is intentional (terminal aesthetic) — do we keep it dark-only and fix light mode as an override, or move to a token so it's theme-aware?
2. **Kanban board hover shadow**: `.v2-board-card` lacks `box-shadow` on hover (unlike `.v2-three-item`, `.v2-projcard`). Intentional (board cards are denser) or oversight?
3. **Gantt dot click state**: `.v2-gantt-dot:hover` scales up but there's no `:active` or selected state. For a pilot, is "click fires toast" sufficient or should the dot get a selected ring?
4. **Config-table confirmed state**: the `--emerald` border in dark mode is quite saturated (`#3ee8a8`). Should `.is-confirmed` use `border-color: var(--emerald-dim)` (subtler) or keep the vivid green for clarity?
5. **`v2-attn-count` `rgba(255,255,255,0.5)`** background in dark — confirmed intentional white-tinted badge? The light-mode override exists but the dark value is unusual. Works visually but worth noting.
6. **Density knob via Tweaks panel**: the v2 surface doesn't currently expose a density toggle (it's not implemented in v2 shell). Is the single density level (v2.css `:root` override of type tokens) the only intended density, or will compact/comfortable modes ship before pilot?

---

## Decision Log (UX authority calls)

- **`--surface-1` / `--surface-2` resolution**: map to `--bg-panel` / `--bg-elevated` until a formal refactor.
- **Gantt dot text**: `.tone-cyan`, `.tone-rose`, `.tone-ghost` → `color: var(--bg-panel)` for contrast compliance.
- **Code block light mode**: add `.theme-light .d-code` override; do NOT change the dark aesthetic.
- **`prefers-reduced-motion`**: add at end of v2.css, disabling `transform: translateY(...)` and `scale(...)` transitions globally.
