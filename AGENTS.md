<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Agent Team

This repo ships with a team of ten specialized agents in `.claude/agents/`. Each one owns a specific surface of the prototype. Invoke an agent through the Agent tool with the matching `subagent_type`.

| Agent                        | Owns                                                       | Invoke for                                                                                |
| ---------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **chief-architect**          | Cross-cutting decisions, orchestration, release-readiness  | Architecture calls, scope, "what should we do here", or anything without a clearer owner  |
| **product-manager**          | Scope, sequencing, prioritization, acceptance criteria     | "What next, in what order, and why" — backlog calls, sprint shaping, build-vs-don't-build |
| **product-owner**            | Voice of the user (a working Ellucian consultant — Janet)  | Visceral reaction to a screen/flow, user-side scope vetoes, narrative acceptance          |
| **lead-developer**           | TSX implementation, refactors, bug fixes                   | Building or fixing a screen, wiring components, removing dead code                        |
| **ux-visionary**             | Visual quality, design tokens, themes, accessibility       | Hover/focus states, theme parity, chip/badge variants, density, type, color               |
| **design-fidelity-guardian** | Pixel + copy parity vs the source design tarball           | Drift audits, new-component parity reviews, the May 15 scheduled audit                    |
| **methodology-guru**         | Domain-content accuracy in `lib/data.ts` and view copy     | Banner/Ellucian voice, OC names, DRC framing, methodology phase plausibility              |
| **test-engineer**            | Test stack and authorship                                  | Bootstrapping the test layer (none today), adding smoke/E2E tests                         |
| **docs-leader**              | README, AGENTS.md, ADRs (when warranted)                   | Doc audits, fixing stale README, consolidating duplicates                                 |
| **release-manager**          | Vercel deploys, version bumps, GitHub releases             | First-time linking, preview/prod deploys, release cuts, drift-audit pre-flight            |

The flow for a typical change: **product-owner** reacts → **product-manager** scopes & sequences → **chief-architect** ratifies → **lead-developer** implements → **ux-visionary** polishes → **design-fidelity-guardian** audits → **release-manager** ships. Skip steps when the change is small.

## How to invoke

Use the Agent tool with `subagent_type` set to the agent's name. Example: `subagent_type: "lead-developer"`.

If you're unsure which agent to call, default to **chief-architect** — it's the orchestrator and will delegate.

## Memory

Each agent has a memory directory at `.claude/agent-memory/<agent-name>/`. Inside is a `MEMORY.md` index plus typed memory files (`feedback_*.md`, `project_*.md`, `reference_*.md`). Memory persists across sessions and is committed with the repo.

## Settings

Bash and tool permissions live in `.claude/settings.local.json`.

## Where the code lives (current sprint)

The mounted surface is `components/v2/*` — `shell.tsx`, `practice.tsx`, `home.tsx`, `pages.tsx`, `icons.tsx` — wired from `app/page.tsx`. Styles in `app/styles/v2.css` (imports `tokens.css`).

The legacy v1 surface (`components/views/*`, root-level `components/{shell,icons,tweaks-panel}.tsx`, `app/styles/styles.css`) is still in tree but **not mounted**. It is preserved as the parity reference for the May 15 drift audit, since the source-design tarball maps 1:1 to the legacy `views-*.jsx` files. The audit baseline for v2 is an open question — see README "Legacy v1" for context.

## Smoke gate

`pnpm smoke` runs `scripts/smoke.sh`: build + start + curl + assert key v2 markers in the rendered HTML. Use it as the local "is it broken" check; it is not a real test framework (no Vitest, no Playwright yet).
