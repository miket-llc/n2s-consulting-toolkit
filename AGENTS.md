<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Agent Team

This repo ships with a team of **twelve** specialized agents. Eleven have local specs in `.claude/agents/`; one (`ai-architect`) is sourced from the available subagent registry (no local file, called via the Task tool with that `subagent_type`). Each one owns a specific surface of the prototype. Invoke an agent through the Agent tool with the matching `subagent_type`.

| Agent                        | Owns                                                                   | Invoke for                                                                                |
| ---------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **chief-architect**          | Cross-cutting decisions, orchestration, release-readiness              | Architecture calls, scope, "what should we do here", or anything without a clearer owner  |
| **product-manager**          | Scope, sequencing, prioritization, acceptance criteria                 | "What next, in what order, and why" — backlog calls, sprint shaping, build-vs-don't-build |
| **product-owner**            | Voice of the user (a working Ellucian consultant — Janet)              | Visceral reaction to a screen/flow, user-side scope vetoes, narrative acceptance          |
| **lead-developer**           | TSX implementation, refactors, bug fixes                               | Building or fixing a screen, wiring components, removing dead code                        |
| **platform-engineer**        | Server-side surface: Drizzle, API routes, Clerk, Neon, AI SDK, secrets | Stance B sprints B1–B4: data layer, auth, mutations, AskPage server plumbing              |
| **ai-architect**             | LLM RFC: model, prompt, retrieval, refusal, rate limits, FERPA UX      | Sprint B4 AskPage spec; brought in before platform-engineer writes `/api/ask`             |
| **ux-visionary**             | Visual quality, design tokens, themes, accessibility                   | Hover/focus states, theme parity, chip/badge variants, density, type, color               |
| **design-fidelity-guardian** | Pixel + copy parity vs the source design tarball                       | Drift audits, new-component parity reviews, the May 15 scheduled audit                    |
| **methodology-guru**         | Domain-content accuracy in `lib/data.ts` and view copy                 | Banner/Ellucian voice, OC names, DRC framing, methodology phase plausibility              |
| **test-engineer**            | Test stack and authorship                                              | Bootstrapping the test layer (Playwright at B0-7), adding smoke/E2E tests                 |
| **docs-leader**              | README, AGENTS.md, ADRs (when warranted)                               | Doc audits, fixing stale README, consolidating duplicates                                 |
| **release-manager**          | Version bumps, CI gate, GitHub releases, deploy preflight (when funded)| Release cuts, drift-audit pre-flight, CI tuning; deploys deferred until pilot funded      |

**Typical flows.** Stance A (UI work): **product-owner** reacts → **product-manager** scopes → **chief-architect** ratifies → **lead-developer** implements → **ux-visionary** polishes → **design-fidelity-guardian** audits → **release-manager** ships. Stance B (server work): **chief-architect** scopes → **platform-engineer** plumbs schema/API/auth → **lead-developer** consumes contract from the UI → **test-engineer** writes Playwright → **release-manager** cuts the version. For Sprint B4 specifically: **ai-architect** writes the RFC before **platform-engineer** implements `/api/ask`. Skip steps when the change is small. See `docs/MVP-PILOT-PLAN.md` §11 for the full Stance B ownership matrix.

## How to invoke

Use the Agent tool with `subagent_type` set to the agent's name. Example: `subagent_type: "lead-developer"`.

If you're unsure which agent to call, default to **chief-architect** — it's the orchestrator and will delegate.

## Memory

Each agent has a memory directory at `.claude/agent-memory/<agent-name>/`. Inside is a `MEMORY.md` index plus typed memory files (`feedback_*.md`, `project_*.md`, `reference_*.md`). Memory persists across sessions and is committed with the repo.

## Settings

Bash and tool permissions live in `.claude/settings.local.json`.

## Where the code lives (current sprint)

The mounted surface is `components/v2/*` — `shell.tsx`, `practice.tsx`, `home.tsx`, `pages.tsx`, `detail.tsx`, `icons.tsx` — wired from `app/page.tsx`. Styles in `app/styles/v2.css` + `detail.css` (both import `tokens.css`).

The legacy v1 surface (`components/views/*`, root-level `components/{shell,icons,tweaks-panel}.tsx`, `app/styles/styles.css`) is still in tree but **not mounted**. The audit baseline is the v2 surface itself, anchored to source-design tarball `K3NKe3IuvfS03Mr6yWnkDw` (re-anchored 2026-05-11 PM after the shell redesign). The legacy v1 files are queued for cull in Sprint B0-1 (post-audit).

Under Stance B, the next directories to appear: `db/` (Drizzle schema + client), `app/api/*` (read + mutation routes), `middleware.ts` (Clerk gate), `.env.example`. Owner: **platform-engineer**. Timing: Sprint B1 starts 2026-05-25.

## Smoke gate

`pnpm smoke` runs `scripts/smoke.sh`: build + start + curl + assert key v2 markers in the rendered HTML. Use it as the local "is it broken" check. Wired into GitHub Actions on push to `main` and PRs targeting `main` (see `.github/workflows/ci.yml`). Playwright bootstraps in Sprint B0-7 (post-audit cleanup); Vitest stays deferred until algorithmic logic lands.

## Hosting

**Deferred** until pilot funding lands. No Vercel project linked, no preview/prod deploys. Stack choices target a Vercel-friendly path so eventual deploy is a config flip, not a rewrite — but until then it's local `pnpm dev` (port `127.0.0.1:4321`) + CI smoke. See `docs/MVP-PILOT-PLAN.md` §2 Q5 update and §5.1 "Dev mode (free)" column.
