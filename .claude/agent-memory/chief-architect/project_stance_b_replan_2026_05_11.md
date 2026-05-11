---
name: Stance B replan reasoning trace
description: 2026-05-11 afternoon — full reasoning behind the Stance B replan that replaces docs/MVP-PILOT-PLAN.md §5–§13. Choices, trade-offs, agent ownership shifts, sub-question recommendations, calendar derivation. Source of truth for "why" behind the live PLAN.md.
type: project
---

**Date:** 2026-05-11 (afternoon)
**Trigger:** User answered the six load-bearing questions in PLAN §2. Q1 → Stance B; Q3 → >5 self-serve users; Q6 → real LLM behind AskPage. Cluster moves the project from a hosted-mock SPA into a real auth + DB + LLM build.
**Output:** PLAN.md §5–§13 (with §14 as the file directory). This memory holds the reasoning that the live doc compresses.

---

## 1. Why Stance A would have been right (and why I lost the argument cleanly)

Stance A (hosted hi-fi demo on `lib/data.ts`) is the right pilot if the goal is to learn whether the UX shape matches the consultant's daily rhythm. We learn that fastest from a clickable that real consultants react to — not from auth, persistence, or LLM plumbing. That was the chief-architect recommendation in `project_mvp_pilot_review.md` and is still my actual technical preference.

User overruled with Stance B for two reasons I should respect:
1. >5 self-serve users (Q3) means engagement-scoped isolation isn't a "document the constraint" item — it's a hard requirement. localStorage on a shared `*.vercel.app` URL fails the test the moment a second consultant logs in. So either we kill the second-user use case or we build auth + scoping. User picked the latter.
2. Real LLM behind AskPage (Q6) means the "honest coming-soon stub" we shipped Sprint A is no longer the pilot endpoint. AskPage as a stub saves trust; AskPage with a real LLM creates a new trust surface (hallucination, cost, FERPA exposure). Either way, AskPage has to be a real product decision before pilot.

Both of those are reasonable from a business-outcomes lens (the pilot is a product proof, not a UX-shape probe). I'm replanning, not relitigating.

## 2. Stack choices — why I picked what I picked

The whole stack collapses around the Vercel platform constraint (Q5: `*.vercel.app`). Marketplace add-ons are the path of least resistance for every load-bearing piece.

### Auth — Clerk

Considered: Clerk, Auth0, NextAuth (now Auth.js), Vercel-native (waitlist).

- **Clerk wins** because: Vercel Marketplace native (one-click install, env vars auto-populate, no copy-paste), best React/Next.js DX in 2026, hosted sign-in/sign-up means we don't write auth UI, free tier covers 10K MAU (way past pilot need), supports SAML/OIDC for when an Ellucian client wants SSO post-pilot.
- **Auth0** is heavier (price tier kicks in at 7K MAU, dashboard is dense, Marketplace integration is less polished). Better for B2E with strict compliance; overkill for a 25-user pilot.
- **NextAuth/Auth.js** is the "we control everything" path; we'd write more code, manage more secrets, and own the upgrade treadmill. Doesn't earn the complexity.
- **Vercel-native** is for Pro/Enterprise tiers; not on the table.
- **Override flip:** if user wants org-managed RBAC out of the box for Ellucian's internal IDM, Auth0 is the call. Would shift Sprint B2 by a few days for the heavier setup but doesn't move the pilot date.

### Database — Neon Postgres

Considered: Neon, Supabase, Vercel Postgres (now powered by Neon), raw Postgres on Render or Railway.

- **Neon wins** because: Vercel-native default since the Marketplace consolidation in 2026, true Postgres semantics (no Supabase-style opinionated SDK we don't need), branching means each preview deploy gets its own DB branch (huge for migration discipline), `@neondatabase/serverless` HTTP driver is friction-free in Vercel Functions cold-start.
- **Supabase** ships an opinionated client (auth + storage + functions + realtime) we don't need; we already picked Clerk for auth. Doubling up would be wasteful, and the Supabase REST/PostgREST surface is less ergonomic than Drizzle.
- **Raw on Render** trades the Marketplace integration for a separate billing surface and zero branching story. Not earned.
- **Override flip:** if Marketplace pricing balloons (post-pilot success), we can lift to Postgres on Render or AWS RDS — Drizzle is portable, only the connection string changes.

### ORM — Drizzle

Considered: Drizzle, Prisma, Kysely, raw `pg`.

- **Drizzle wins** because: TypeScript-first (matches our strict-mode discipline), schema-as-code so migrations are git-tracked Postgres SQL, ~7 KB runtime vs Prisma's ~10 MB binary + generated client (matters for serverless cold start), edge-runtime compatible if we ever need it, no separate "generate after every schema change" step.
- **Prisma** has the best dev UX (Prisma Studio, generated types) but the binary weight + cold-start tax + edge story (still rough) tip the call. If migrations get gnarly enough that we want a GUI, we can flip mid-build — Drizzle's schema files are mechanically Prisma-translatable.
- **Kysely** is a fine alternative; Drizzle's schema-defines-everything model is slightly nicer for migrations, which is the discipline I care most about for Stance B.
- **Raw pg** is too undisciplined for a 4-person prototype-becoming-product; the team will produce inconsistent query patterns.

### LLM — Vercel AI SDK + AI Gateway, default model Claude Sonnet 4.5

Considered: Vercel AI SDK, LangChain.js, custom Anthropic SDK calls, OpenAI SDK direct.

- **Vercel AI SDK + Gateway wins** because: platform-native (no extra vendor onboarding), Gateway gives us model routing + cost tracking + provider failover for free, streaming React primitives ship with the SDK (`useChat`, `streamText`), model swaps are config changes (not code rewrites). This is exactly the pilot RAG shape.
- **LangChain.js** would only earn its weight if we needed agent loops or complex chains. We don't — RAG-over-OC-content is a single retrieval + single generation step.
- **Direct Anthropic SDK** is fine but loses Gateway benefits. Not earned.
- **Default model:** Claude Sonnet 4.5 (or current Anthropic flagship) — best long-context grounded answers, exactly what RAG-over-OC-content needs. OpenAI gpt-4o is the failover for latency or rate-limit issues.
- **Override flip:** if Gateway pricing or latency is unacceptable in a real demo, we go direct to Anthropic and lose the failover convenience.

### Vector store — Neon `pgvector`

Considered: pgvector, Pinecone, Vercel/Vercel KV with custom similarity, Turbopuffer.

- **pgvector wins** because: same DB, no second vendor, pilot-corpus scale (<10 MB embeddings) is trivial for it, single backup/migration story.
- **Pinecone** earns its weight at >100K chunks; we have hundreds.
- **Override flip:** if corpus growth (real Ellucian OC catalog has thousands of forms) outpaces pgvector, lift to Pinecone post-pilot.

### Persistence scope — mock-shape, not real integration

This is the biggest single decision in the replan and I surfaced it as Q1 in §13.

- **Real Banner/Jira/Smartsheet integration** is months of OAuth + per-institution schema reconciliation. Each vendor has its own auth dance, rate limits, schema drift, and Ellucian Engineering has to provision sandbox access per institution.
- **Mock-shape persistence** is weeks: auth + Postgres + a dozen API routes seeded from `lib/data.ts`. Mock data still seeds the DB, but mutations land. The prototype's perceived continuity is preserved.
- The pilot's job is to validate the UX-shape against working consultants. Mock-shape persistence does that. Real integrations are a separate scope question (for the post-pilot replan).
- If user overrides → ~3 sprints added (B-int1 Banner read, B-int2 Jira sync, B-int3 Smartsheet), pilot moves to ~Oct 12. I'd advise against unless there's a concrete client commitment.

### LLM blast radius — read-only chat, not action-taking

Surfaced as Q2.

- **Read-only chat (RAG)** is one API route, rate limit, retrieval, generation, citation chips in the UI. Trust surface is bounded: assistant can lie about facts but can't mutate state.
- **Action-taking** (LLM signs DRCs, drafts field-reviews, files Jira tickets) requires tool-use safety, prompt-injection hardening, undo/audit trail, per-action confirmation UX, and an LLM-author attribution column on every audit log row. It's a different product.
- For a pilot, read-only chat is enough to test "does the assistant answer Banner config questions usefully?" Action-taking is a v2 of Stance B.

## 3. Data model derivation — one rule per table

Walked `lib/data.ts` end to end. Three classifications:

1. **Catalog (static, seeded once):** `oc_definitions` (was OC_INDEX + OC_DATA), `config_fields` (was CONFIG_FIELDS_BY_OC), `methodology_phases`, `methodology_cards`, `inner_source`, engagement metadata that's true for the school regardless of consultant work (logo, domain, brand color).
2. **Per-engagement mutable:** `capabilities` (was BUSINESS_CAPABILITIES; per-engagement because pct/ocsDone/sprint/activeOC vary), `tasks` (was TASKS), `drcs`, `drc_signoffs`, `workshops`, `milestones`, `autopilot_runs`, `go_lives`. Each carries `engagement_id` and is gated by `engagement_members`.
3. **Per-user mutable:** `field_reviews` (was localStorage `v2.cfg.*`), `user_prefs` (was `v2.theme`/`v2.defaultLanding`/`v2.mywork.view`/`v2.currentProject`), `ai_conversations`, `ai_messages`.

Engagement scoping (R8 fix) goes through a single Drizzle helper `withEngagementAccess(userId, query)` so there's one audit point, not N. No row-level security at the Postgres layer for v1; if Clerk org/SAML lands, revisit.

The seed flow (`pnpm db:seed`) reads `lib/data.ts` and writes every table. First user account auto-joins every seeded engagement to preserve the prototype's continuity feel. New engagements (created post-seed) seed catalog refs + zero per-engagement rows.

## 4. Sprint sequencing — capacity dictates slices not parallel streams

Capacity is user + agent sessions. No new engineers. That's the most important constraint in the whole replan. Slices, not parallel streams.

Six post-audit sprints (B0 → B5):

- **B0** post-audit cleanup (1 wk): folds the Stance A surviving items (v1 cull, dead exports, drift fixes from May 15 audit, focus pass, CSS cull) + the now-MUST-have CI gate + Playwright bootstrap. Sprint A items that already shipped don't need replanning.
- **B1** data layer (2 wk): plumbing only. Neon, Drizzle, schema, seed, read-only API routes. UI doesn't change. Acceptance: API returns same shape as `lib/data.ts`.
- **B2** auth + scoping (2 wk): Clerk, membership, gating. R8 closed. Janet hardcoding replaced by Clerk session.
- **B3** mutations + cutover (2 wk): v2 surface stops importing from `lib/data.ts` and starts fetching from API. localStorage migration runs once on first authenticated load.
- **B4** AskPage RAG (2 wk): AI Gateway, pgvector, streaming chat UI, rate limits.
- **B5** content + polish + rehearsal (2 wk): SFARCTL/SPAIDEN/NBAPOSN/PTREARN populate, second engagement (WIU), Decision/Workshop detail surfaces, ⌘K, telemetry, USER_GUIDE, pilot rehearsal.

That's 11 weeks of build + 1 week of cleanup = 12 calendar weeks. Honest middle of the briefing's 6–10 estimate adjusted for our solo-with-agents reality.

## 5. Calendar derivation — pilot date 2026-08-03

```
2026-05-11   today
2026-05-13   UI freeze (Sprint A close)
2026-05-15   drift audit fires
2026-05-18   Sprint B0 starts
2026-05-22   B0 close
2026-05-25   B1 starts (Memorial Day Mon → 4-day open week)
2026-06-05   B1 close
2026-06-08   B2 starts
2026-06-19   B2 close
2026-06-22   B3 starts
2026-07-03   B3 close (Jul 4 fri-eve → ok)
2026-07-06   B4 starts
2026-07-17   B4 close
2026-07-20   B5 starts
2026-07-31   B5 close + rehearsal
2026-08-03   PILOT
```

US holidays factored: Memorial Day (May 25), Independence Day (Jul 4 — falls Sat in 2026 so observed Fri Jul 3, end of B3). No collisions on sprint boundaries.

Aggressive alternative pilot date 2026-07-20 (cuts B5 content sprint to 3 days; Decision/Workshop detail post-pilot; SPAIDEN/NBAPOSN/PTREARN remain stubs). Surfaced as Q3 in §13.

## 6. Risk register reshape

**Dropped from Stance A:**
- R1 (pilot scope drift to B/C) — moot, we're in B
- R8 (localStorage cross-user leakage) — replaced by R-AUTH

**Added for Stance B:**
- R-AUTH (auth misconfig) HIGH
- R-MIG (DB schema drift) HIGH
- R-LLM-COST (runaway LLM bill) HIGH
- R-LLM-HALL (LLM hallucinates Banner config) HIGH
- R-COLD (Vercel Functions cold-start ruins demo) MEDIUM
- R-SECRETS (key leak via Vercel Project Settings) HIGH
- R-FERPA (consultant pastes real student data into AskPage) HIGH
- R-LOCK (Clerk + Neon vendor lock-in) MEDIUM
- R-INVITE (institutional email blocking on `.edu` magic links) MEDIUM
- R-PARITY (detail.tsx touch-risk during B3 cutover) MEDIUM (was the touch-risk in old R3, kept under different id)

The FERPA risk is the one I want the user to actively acknowledge. Even pilot data could include real student names/ids if a consultant pastes them into AskPage. We need a banner + USER_GUIDE.md disclaimer + 30-day retention cap on `ai_messages`. methodology-guru should also do an OC-content sweep before B4 to make sure no real PII slipped into the mock data.

## 7. New agent — platform-engineer

Stance B has 5 sprints of server-side work that doesn't fit cleanly into any existing agent's scope:

- **lead-developer** owns TSX/React. The API surface is Vercel Functions + Drizzle + Postgres — different language community, different debugging tools, different deployment model.
- **release-manager** owns deploys, version cuts, CI, Marketplace installs. The implementation of API routes / migration files / Clerk session helpers is one level deeper.
- **chief-architect** can do it but at the cost of orchestrator capacity I need for cross-cutting calls.

**platform-engineer** owns: Drizzle schema + migrations, API route shape, Clerk wiring, Neon connection management, Vercel Functions runtime config, AI SDK + Gateway integration, secrets/env discipline, audit-log instrumentation. One agent, one server-side surface, clear handoff to lead-developer for UI integration.

Also formally adding **ai-architect** to the roster — already in the available registry, brought in for B4 RFC (model choice, prompt template, retrieval rules, refusal/safety behavior, rate-limit policy, FERPA-aware UX language). ai-architect doesn't write code; writes the spec that platform-engineer + lead-developer implement.

docs-leader needs to update AGENTS.md to include both new agents in the roster table. chief-architect (me) will draft the platform-engineer system prompt for the .claude/agents/ directory.

## 8. Six open sub-questions surfaced to user — recommendations

| Q | Question | Recommendation | Override cost |
|---|---|---|---|
| Q1 | Persistence scope: mock-shape vs real integration | mock-shape | +3 sprints, pilot moves to ~Oct 12 |
| Q2 | LLM blast radius: chat vs action-taking | chat (RAG) | +1 sprint, tool-use safety RFC, mutation routes grow assistant_initiated flags |
| Q3 | Pilot date: 2026-08-03 vs 2026-07-20 aggressive | Aug 3 | Jul 20 means SPAIDEN/NBAPOSN/PTREARN stay stubs, no Decision/Workshop detail, no rehearsal buffer |
| Q4 | RAG corpus scope: populated OCs only vs all 12 | populated only | indexed-stub disclaimer in prompt template |
| Q5 | Pilot user cap: hard 25 in Clerk allowlist | yes, 25 | upgrade to paid tier (~$25 + $19/mo) |
| Q6 | AskPage rate limit per user per day | 100 soft / 200 hard | cost vs frustration trade |

Q1, Q2, Q3 are the three that materially shift the build. The others are tunings.

## 9. Items from old §5–§11 that survive unchanged

- B1 (cull v1 archive ~3,841 lines) → folded into B0-1
- B2 (cull dead `lib/data.ts` exports) → B0-2
- B3 (`OC_INDEX_FALLBACK` cull) → B0-2
- B11 (`--surface-1`/`--surface-2` tokens), B12 (`.theme-light .d-code` override), B13 (focus-visible), B14 (gantt dot contrast), B15 (`prefers-reduced-motion`), B16 (duplicate CSS cull) → B0-3, B0-4, B0-5 (some folded into the audit-drift fixes)
- B17 (GitHub Actions CI) → B0-6 (now MUST-have not should-have, because DB migrations need a CI gate)
- B18 (Playwright bootstrap) → B0-7 (now MUST-have)
- B19 (USER_GUIDE.md) → B5-12 (rescoped: now also covers auth flow + your-data + AskPage scope + FERPA disclaimer)
- B20 (ADRs) → distributed across B1-8, B2-8, B4-10
- C1 (NBAPOSN populate), C2 (PTREARN populate), C3 (tag empty OCs), C4 (second engagement) → B5-3, B5-4, B5-5, B5-6
- C6 (⌘K wiring), C7 (Decision detail), C8 (Workshop detail), C9 (Vercel Web Analytics) → B5-10, B5-8, B5-9, B5-11
- C12, C13 (Playwright specs) → distributed across B0-7, B3-8, B5 specs

## 10. Items from old §5–§11 that are obsolete

- A13's amber "Demo data" pill → B3-6 replaces it with "Your engagement data" once auth + persistence land
- C5 (consultant name field in Settings) → obsolete; consultant identity comes from Clerk (B2-6)
- C10 (custom pilot subdomain) → obsolete; Q5 picked `*.vercel.app`
- C11 (drop pre-audit suffix on version bump) → obsolete; we're past 0.2.0 versioning under Stance B (0.3.0-beta.1 in B3, 1.0.0-pilot.1 in B5)
- C16 (pilot rehearsal late-May) → obsolete; rehearsal is B5-14 in late July
- D1–D6 post-pilot items in old plan → folded into the post-pilot replan (separate doc, triggered by pilot signal)

## 11. What I deliberately did NOT decide for the user

- **Real integrations vs mock-shape (Q1)**: I have a strong recommendation but the cost gap is months. Surfacing.
- **LLM action-taking (Q2)**: Same — strong recommendation, but the user might want it for pilot demo flash. Surfacing.
- **Pilot date 8/3 vs 7/20 (Q3)**: I have a default but the trade is real (content vs speed). Surfacing.
- **Banner-only vs Banner + Colleague (secondary question §2)**: Lafayette is Colleague in PORTFOLIO. Defer to post-pilot per §12 NOT-doing list, but flag if user disagrees.

Everything else (auth provider, DB, ORM, LLM client, vector store) I committed and put in §5.1 with a one-line rationale + override flip cost. The user delegated those calls per the briefing.

## 12. Open follow-ups for next time this agent is invoked

- After user reviews PLAN.md and answers §13 sub-questions: chief-architect updates §5–§13 in-place to remove resolved sub-questions and lock the calendar.
- Draft platform-engineer system prompt for `.claude/agents/platform-engineer.md` (mirror the lead-developer / release-manager file shape).
- Coordinate with docs-leader to update AGENTS.md roster table.
- Coordinate with release-manager to sequence Marketplace installs (B1 Neon → B2 Clerk → B4 Gateway).
- After Sprint A closes (May 13 EOD freeze), revisit BACKLOG.md to fold the Stance A historical record properly.
