# MVP Pilot Plan — n2s-consulting-toolkit

**Date:** 2026-05-11
**Audit gate:** 2026-05-15 (T-4 days) — fires regardless of stance
**Status:** **STANCE B REPLAN IN PROGRESS.** User resolved §2 questions on 2026-05-11; Q1 + Q3 + Q6 cluster moves project from Stance A → Stance B and invalidates §5–§11 of this document. chief-architect is producing the replan. Sprint A items already shipped and the May 15 drift audit are unaffected.
**Synthesis source:** ten parallel agent reviews — full deliverables in `.claude/agent-memory/<agent>/project_mvp_pilot_review.md` for each of chief-architect, product-manager, product-owner, lead-developer, ux-visionary, design-fidelity-guardian, methodology-guru, test-engineer, docs-leader, release-manager.

---

## 1. Executive summary

The prototype has a real working core — Practice home, Project home, MyWork buckets, Decisions, SOATERM Configuration Guide with config-fields + DRC sign-off, Capability detail, and the just-shipped Schedule gantt. A real Banner consultant could use the SOATERM walkthrough on Monday and feel it.

The prototype is **not yet pilot-ready**. The blockers cluster into four buckets:

1. **Operational** — no Vercel link, no CI, no error boundary, `lib/school-brands.ts` untracked (build breaks on clean clone).
2. **Content** — 11 of 12 OC guides are stubs; six Banner schema/form-name errors in `lib/data.ts` would be caught by any working consultant in 30 seconds.
3. **Wiring** — Project Home capability cards land on the index instead of detail; DRC rows fire toasts instead of navigating to the section that raised them; AskPage and Autopilot have dead buttons.
4. **Polish** — undefined `--surface-1/-2` tokens break Autopilot in both themes; dark-only `.d-code` blocks make Configuration Guide unreadable in light mode (the default); no focus-visible rings.

None of these are large. Together they are roughly **two sprints of disciplined work** — Sprint A pre-audit (May 11–15), Sprint B post-audit (May 18–22), with a third sprint to populate two more OC guides and polish for the real pilot session.

**Recommended pilot stance (per chief-architect, endorsed by product-manager and product-owner):** **hosted hi-fi demo on Vercel with mock data**, single-tenant on the NSU engagement, single consultant driver (Janet) with stakeholders watching. Pilot is to learn whether the UX shape is right, not to replace live tooling. "Real persistence" or "multi-engagement isolation" is a separate pivot (months of work) — flag if user actually wants that, because it changes everything.

> **UPDATE 2026-05-11 (afternoon).** User overrode the recommendation and chose **Stance B** (prototype + real backend), with **>5 self-serve users** (engagement-scoped isolation now must-have) and **real LLM behind AskPage before pilot**. The recommendation in the paragraph above is preserved as historical context. §5 onward is obsolete pending chief-architect's Stance B replan. Sprint A pre-audit hygiene + the May 15 drift audit hold regardless of stance.

> **UPDATE 2026-05-11 (late afternoon).** User clarified that **Vercel hosting is deferred — "that's not free"**. Focus until further notice is **dev experience** (devs being able to work on this locally + CI). The Stance B sprint sequence still proceeds (Drizzle + Neon + Clerk + AI SDK can all be developed against locally with free dev-tier accounts), but the Vercel Marketplace install path is gated behind future pilot funding. Q5 in §2 flips from "Vercel subdomain" to "deferred". The pilot date in §10 (2026-08-03) presumes hosting lands by then; if funding doesn't arrive, the pilot itself slips. See §5.1 / §5.3 / §13 below for stack and sequencing implications.

---

## 2. Open questions — RESOLVED 2026-05-11

User answered all six load-bearing questions on 2026-05-11 (afternoon). **Three answers (Q1, Q3, Q6) move the project from Stance A to Stance B and invalidate §5–§11 of this document.** A Stance B replan is in progress — see banner at the top of §5.

| # | Question | Answer | Plan impact |
|---|---|---|---|
| Q1 | Pilot stance | **B — prototype + real backend** | §5 onward obsolete. chief-architect replanning. |
| Q2 | Pilot date | After May 15 | Audit fires on schedule. Late-May / early-June pilot date no longer realistic under Stance B; chief-architect to propose new calendar. |
| Q3 | Pilot users | **>5 self-serve users** | Engagement-scoped isolation is now must-have (was R8 "document the constraint"). Auth + per-user persistence are in scope. |
| Q4 | Re-anchor drift baseline | Yes — delete v1 archive post-audit | Sprint B1 (cull v1 archive ~3,841 lines) survives the replan. |
| Q5 | Pilot URL | ~~`n2s-consulting-toolkit.vercel.app`~~ → **DEFERRED** (2026-05-11 PM, "that's not free") | No Vercel project linked, no preview/prod deploys until pilot is funded. Stack choices in §5.1 still target Vercel-friendly stack (Marketplace install is the easy on-ramp once funded). Local dev + CI smoke is the contract for now. |
| Q6 | AskPage future | **Real LLM before pilot** | AskPage stub is no longer the pilot endpoint. lead-developer + ai-architect own the integration. Vercel AI SDK + AI Gateway are on the table. |

Secondary questions still open — chief-architect to surface during replan:

- Banner-only or Banner + Colleague? `PORTFOLIO` includes Lafayette (Colleague) — methodology-guru flags this materially affects OC content.
- HR go-live (May 24) was a candidate pilot anchor under Stance A. Under Stance B the pilot is likely past May 24, mooting the anchor; confirm before NBAPOSN/PTREARN sequencing changes.
- Demo data label — already shipped Sprint A as amber pill on Settings. Under Stance B with real persistence the wording changes (e.g. "Your engagement data" rather than "Demo data") once auth + per-user storage land.
- New for Stance B: real Banner / Jira / Smartsheet *integration*, or per-user *persistence of the existing mock data shape*? The first is months; the second is weeks. chief-architect must surface this to the user.
- New for Stance B: AskPage as RAG-over-OC-content (chat scope), or as an action-taking agent that mutates the toolkit (DRC sign-off, config-field review drafting)? Defines LLM blast radius.

---

## 3. Convergent findings (≥3 agents agreed)

| # | Finding | Agents |
|---|---|---|
| C1 | No Vercel deploy URL — pilot can't exist without one | release-manager, chief-architect, product-manager |
| C2 | No error boundary — single render exception blanks the SPA | chief-architect, lead-developer, product-manager, ux-visionary (less directly) |
| C3 | `lib/school-brands.ts` untracked — build breaks on clean clone | lead-developer, release-manager |
| C4 | 11 of 12 OC guides empty — demo-fatal | product-owner, product-manager, methodology-guru, design-fidelity-guardian |
| C5 | Cull v1 legacy archive (~3,800–4,300 lines) | chief-architect, lead-developer, design-fidelity-guardian, product-manager (timing disputed) |
| C6 | Dead exports in `lib/data.ts` (~96–150 lines) | chief-architect, lead-developer |
| C7 | README stale — 6 concrete inaccuracies including wrong tarball ID | docs-leader, chief-architect |
| C8 | AskPage is a trust-killer (textarea + disabled button) | product-owner, product-manager |
| C9 | Project Home capability cards collapse to index instead of detail | design-fidelity-guardian, product-owner |
| C10 | DRC rows toast instead of navigating to OC section | product-owner, design-fidelity-guardian |
| C11 | Drift audit fires May 15 — three new toolkit-originals need formal classification | design-fidelity-guardian, chief-architect |
| C12 | Three new surfaces shipped with zero test coverage | test-engineer (alone, but unanimously endorsed elsewhere) |
| C13 | Banner schema/form-name errors in `lib/data.ts` — 6 hard, ~10 soft | methodology-guru (sole authority; others defer) |
| C14 | Undefined `--surface-1`/`--surface-2` tokens — Autopilot visually broken | ux-visionary (sole authority; product-owner endorses Autopilot dead-buttons separately) |
| C15 | Hardcoded `bastardLoopState` field name visible in dev tools | lead-developer (sole authority, P1 embarrassment) |

---

## 4. Pilot stance — recommended definition

Per chief-architect (Stance A), endorsed by product-manager and product-owner. If the user picks B or C, **stop and replan**; this document is invalid for those.

### Stance A — hosted hi-fi demo
- **Where:** Vercel, single static SPA, `*.vercel.app` subdomain (or branded domain post-pilot).
- **Data:** Mock data in `lib/data.ts`, single-tenant on NSU. WIU or CSU populated as a secondary engagement so the project-switcher doesn't lie (per chief-architect C5).
- **Persistence:** localStorage only. Shared URL → per-browser state. Acceptable; document the constraint.
- **Auth:** none. Pilot URL is link-gated, not access-controlled.
- **Telemetry:** Vercel Web Analytics + route-change pings (chief-architect C4).
- **Feedback:** in-app toast → maps to a feedback form (manual collection out of scope; could be a Google Form linked from Settings).
- **What it tests:** does the UX shape match the working consultant's daily rhythm? Are the OC guide + DRC sign-off + ConfigFieldsTable actually faster than the Excel + Jira + DocuSign chain they replace?

### Out of scope for this pilot (would be Stance B+)
- Real Banner / Jira / Smartsheet integration
- Multi-engagement data isolation per pilot user
- Auth (Clerk / SSO)
- Real LLM behind AskPage
- Real autopilot pipeline
- DRC hash legal weight / external decision log
- Persistence across users / sessions / browsers

---

## 5. Architecture — Stance B

> **REPLAN LANDED 2026-05-11 (afternoon).** §5–§13 below replace the obsolete Stance A plan. The Sprint A items already shipped, **B1** (cull v1 archive), **B2** (cull dead exports), and the May 15 drift audit (A19/A20) survive — they are folded into the Stance B sprint sequence below. Everything else is rescoped or replaced.

The user picked: real backend, >5 self-serve users, real LLM behind AskPage. That collapses the architectural design space hard. The choices below are committed unless the user overrides; rationale is intentionally short.

### 5.1 Stack choices (committed)

> **Hosting note (2026-05-11 PM).** Vercel deploys are deferred per Q5 update. The stack choices below still target a Vercel-friendly path (so the eventual pilot deploy is a config flip, not a rewrite), but every layer now has a **dev-mode setup** that requires no Vercel link and no paid services. Marketplace integration moves to a future sprint gated on pilot funding. The "Dev mode (free)" column is what we use until then.

| Layer | Choice | Dev mode (free, no Vercel) | Pilot-time path (when funded) | Override flips |
|---|---|---|---|---|
| **Auth** | Clerk | `@clerk/nextjs` with Clerk dev-instance keys (free tier, 10K MAU). Local dev sign-in works; sessions live in cookies. | Vercel Marketplace install auto-populates `CLERK_*` env vars; SAML/OIDC available for Ellucian SSO. | Auth0 (heavier) or NextAuth/Auth.js (own everything) — both still work in dev mode without Vercel. |
| **DB** | Neon Postgres | Neon dev branch via `@neondatabase/serverless` HTTP driver and `DATABASE_URL` from Neon free tier (0.5 GB), OR local Docker postgres for offline work. | Vercel Marketplace install + branch-per-preview-deploy. | Supabase or raw Postgres on Render — same Drizzle schema, only the connection string changes. |
| **ORM** | Drizzle | `drizzle-orm` + `drizzle-kit`; `pnpm db:migrate` + `pnpm db:seed` run locally against any Postgres URL. | Same. CI gates migrations. | Prisma if migrations get GUI-worthy. |
| **LLM client** | Vercel AI SDK | `ai` + `@ai-sdk/anthropic` calling Anthropic API directly with a personal `ANTHROPIC_API_KEY`. No Gateway in dev mode → no failover, no cost dashboard, but functionally identical streaming. | AI Gateway flips on; provider failover + cost tracking arrive without code change (model swap is a config). | LangChain.js if we ever need agent loops. |
| **LLM model (default)** | Claude Sonnet 4.5 (or current Anthropic flagship) | Direct Anthropic API. | Gateway-routed; OpenAI gpt-4o as failover. | OpenAI direct if Gateway latency hurts demo. |
| **Vector store** | Neon `pgvector` | Same DB extension; works on Neon free tier and local Docker postgres. | Same. | Pinecone only if corpus grows past ~100 K chunks. |
| **Deploy** | ~~Vercel~~ → **deferred** | Local `pnpm dev` (port 4321) + `pnpm smoke` + GitHub Actions CI on push/PR. Share via screen-share or screenshot. | Vercel Functions for API routes + Marketplace add-ons for Neon/Clerk/AI Gateway. Pilot funding gates this. | Render / Fly / Railway / self-host all work with the same Drizzle + Next.js shape if Vercel pricing shifts. |
| **Secrets** | env vars | `.env.local` (gitignored). One vendor per key: Anthropic, Clerk, Neon. | Vercel project env vars with Marketplace auto-populate. | — |
| **Persistence scope (this pilot)** | Per-user persistence of the existing `lib/data.ts` mock-data shape | Same. | Same. | Real integrations adds ~3 sprints — see §13 Q1. |
| **AskPage scope (this pilot)** | RAG over OC content (read-only chat) | Same. | Same. | Action-taking adds ~1 sprint + safety RFC — see §13 Q2. |

### 5.2 Runtime shape

- **Auth-aware Server Components** for every route except marketing surfaces (none today). `app/page.tsx` becomes a Server Component shell that awaits the Clerk session and routes the user to a sign-in view if unauthenticated. The current client-only hash router becomes a hybrid: Server Component data fetch → Client Component (`use client` for the existing v2 surface) for interaction.
- **API routes** under `app/api/*` run on Node runtime (Drizzle + pg are not edge-clean). In dev mode they run via `pnpm dev`; pilot-time they become Vercel Functions. Auth-gated via Clerk middleware in either case.
- **Hash routing stays.** It works, the v2 surface is built around it, and changing it is unrelated to the Stance B pivot. Auth state lives in Clerk's session cookie, not in the URL.
- **`lib/data.ts` becomes a seed file**, not a runtime source. Read paths go through API routes that query Postgres. Mock data is the seed for new engagements; static catalogs (methodology, capabilities, OC index, inner-source patterns) are seeded once and never user-mutated.

### 5.3 Local dev setup order (replaces Marketplace install order while Vercel is deferred)

1. **CI gate live** ✓ — `.github/workflows/ci.yml` runs `pnpm smoke` on push/PR. Branch protection on `main` requires linear history.
2. Provision a **Neon dev branch** (free tier) → drop `DATABASE_URL` into `.env.local`. Optional: local Docker postgres for offline work — `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=dev postgres:16-alpine`.
3. Provision a **Clerk dev instance** (free tier) → drop `CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` into `.env.local`. Add `localhost:4321` to allowed origins.
4. Provision an **Anthropic API key** (or OpenAI key for failover) → drop into `.env.local` as `ANTHROPIC_API_KEY`.
5. `pnpm add @clerk/nextjs drizzle-orm drizzle-kit @neondatabase/serverless @ai-sdk/anthropic ai`.
6. Add `.env.example` (committed, no secrets) so onboarding is one `cp .env.example .env.local` + paste.

**Pilot-time deploy** (when funded): re-instate the §5.3-prior install order — Vercel link → Neon Marketplace → Clerk Marketplace → AI Gateway → push. The dev-mode `.env.local` keys are simply replaced by Marketplace-auto-populated equivalents.

---

## 6. Data model

The Postgres schema below is implied by the existing `lib/data.ts` shape, with engagement-scoping (R8 fix) layered over every per-engagement entity. **Catalog tables** are global and read-only at runtime (managed via seed scripts + migrations). **Per-engagement tables** carry `engagement_id` and are gated by membership. **Per-user tables** carry `user_id` for personal state.

### 6.1 Tables

#### Identity (managed mostly by Clerk; we mirror minimally)

```text
users
  id            text   pk          -- Clerk user id
  email         text   unique
  display_name  text
  initials      text                -- "JH" — was Member.initials
  created_at    timestamptz
```

#### Engagements + membership (engagement-scoping foundation)

```text
engagements
  id           text   pk            -- "nsu", "wiu", ... (was PORTFOLIO[].id)
  name         text                  -- "Northern State University"
  short        text
  product      text                  -- "Banner SaaS" | "Colleague"
  tier         text                  -- "Select" | "Essentials" | "Advantage"
  phase        text                  -- "Discover" | ... | "Stabilize"
  domain       text
  logo_url     text
  logo_color   text
  initials     text
  created_at   timestamptz

engagement_members
  engagement_id  text references engagements(id)
  user_id        text references users(id)
  role           text                -- "consultant-lead" | "consultant" | "client" | "observer"
  primary key    (engagement_id, user_id)
```

#### Per-engagement mutable entities (was lib/data.ts globals)

```text
capabilities         (was BUSINESS_CAPABILITIES; per-engagement because pct/ocsDone/sprint/activeOC vary)
  id, engagement_id, area, label, tagline, go_live, pct, ocs_done, ocs_total,
  bp_count, status, sprint, active_oc_id

go_lives             (was GO_LIVES)
  id, engagement_id, product, label, date, days_out, readiness, status, scope (text[])

tasks                (was TASKS; "project" string becomes engagement_id FK)
  id, engagement_id, jira_id, capability_id, title, status, priority,
  due, due_rel, assignee_user_id, comment_count, urgent, last_sync, ai_assist

drcs                 (was DRCS; everything per-engagement)
  id, engagement_id, code, title, capability_id, oc_id, oc_section, field_selector,
  owner, owner_name, owner_side, raised, due_by, days_stale, blocked_count,
  severity, status, summary

drc_signoffs         (NEW; was implied by future feature)
  drc_id, engagement_id, signed_by_user_id, signed_at, hash, notes
  primary key (drc_id, engagement_id)

workshops            (was WORKSHOPS)
  id, engagement_id, focus, title, when, date, days_out, duration, location,
  prep_status, capability_id, go_live_id, agenda jsonb, scope jsonb,
  attendees jsonb, last_notes jsonb

milestones           (was MILESTONES)
  id, engagement_id, go_live_id, type, month_col, day_in_month, date,
  label, link_workshop_id, owner

autopilot_runs       (was AUTOPILOT_RUNS)
  id, engagement_id, build, title, trigger, when, duration, status,
  stages jsonb, findings jsonb
```

#### Per-user-per-engagement state (was localStorage `v2.cfg.*`, etc.)

```text
field_reviews        (was localStorage v2.cfg.<engagement>.<oc>.<field>)
  user_id, engagement_id, oc_id, field_id, status, reviewed_at
  primary key (user_id, engagement_id, oc_id, field_id)

user_prefs           (was v2.theme, v2.defaultLanding, v2.mywork.view, v2.currentProject)
  user_id pk, theme, default_landing, mywork_view, current_engagement_id
```

#### Catalog / static (seeded once, never user-mutated)

```text
oc_definitions       (was OC_INDEX + OC_DATA)
  id pk, code, title, product, capability_area, summary, sections jsonb

config_fields        (was CONFIG_FIELDS_BY_OC)
  id pk, oc_id, section_id, field_code, label, recommended_value, notes

methodology_phases   (was METHODOLOGY_PHASES)
methodology_cards    (was METHODOLOGY_CARDS)
inner_source         (was INNER_SOURCE)
finding_index        (was FINDING_INDEX)  -- if revived; currently dead export
```

#### AskPage RAG corpus + chat history

```text
oc_chunks            (NEW; chunked OC bodies + callouts + config-field rows for retrieval)
  id pk, oc_id, section_id, chunk_text, chunk_kind ("intro" | "step" | "callout" | "field"),
  embedding vector(1536)

ai_conversations     (NEW)
  id pk, user_id, engagement_id, started_at

ai_messages          (NEW)
  id pk, conversation_id, role ("user" | "assistant"), content text,
  retrieved_chunk_ids text[], created_at
```

### 6.2 Static vs per-user-mutable rules

| Static (catalog, seeded) | Per-engagement mutable | Per-user mutable |
|---|---|---|
| `oc_definitions`, `config_fields`, `methodology_phases`, `methodology_cards`, `inner_source`, engagement metadata for known schools (logo, domain, brand color) | `capabilities`, `tasks`, `drcs`, `drc_signoffs`, `workshops`, `milestones`, `autopilot_runs`, `go_lives` | `field_reviews`, `user_prefs`, `ai_conversations`, `ai_messages` |

### 6.3 Engagement scoping (R8 fix)

Every per-engagement query is gated by membership: `WHERE engagement_id IN (SELECT engagement_id FROM engagement_members WHERE user_id = $auth_user)`. Implemented as a Drizzle helper `withEngagementAccess(userId, query)` so every API route uses one shape and there's a single audit point. No row-level security in Postgres for v1; if a Clerk org/SAML story lands, we revisit.

### 6.4 Seeding from `lib/data.ts`

- `lib/data.ts` becomes the seed script's input. A `pnpm db:seed` task reads the existing typed exports and writes them into Postgres. The first user account created (consultant) is auto-added as a member of every seeded engagement so the prototype's perceived continuity is preserved during the cutover.
- For new engagements created post-seed (a real consultant onboarding their second school), a "blank engagement" template seeds catalog references + zero per-engagement rows.
- The pilot rehearsal account uses a mirror of the seed so we can demo against deterministic data.

---

## 7. Sprint replan

Capacity reality: user + agent sessions, no new engineers. That dominates sequencing. Slices, not parallel streams. Six post-audit sprints (B0 → B5) after the in-flight Sprint A.

Sizes XS / S / M / L. Owners use existing agents plus the new **platform-engineer** (see §11) and **ai-architect** (already in the available registry, formally added to roster in §11). `[shipped]` items are folded in from the obsolete Stance A plan and survive without scope change.

> **Hosting deferral note (2026-05-11 PM).** Per Q5 update, every sprint item that requires "Install X from Vercel Marketplace", "Vercel link", "production preview URL", "AI Gateway provision", or "rehearsal on hosted URL" is **deferred until pilot is funded**. The equivalent dev-mode work (free-tier accounts → `.env.local` → local `pnpm dev`) proceeds on schedule per §5.1 / §5.3. When funding lands, those deferred items become a single one-day "deploy preflight" that flips Marketplace add-ons on and replaces the dev keys. The pilot date in §10 (2026-08-03) still holds **only if funding lands by ~2026-07-25**; otherwise the pilot itself slips while build work continues.

### Sprint A — pre-audit hygiene · 2026-05-11 → 2026-05-15 (in-flight)

Unchanged from the obsolete plan. UI freeze 2026-05-13 EOD; audit fires 2026-05-15. Nothing in this Stance B replan is allowed to touch the v2 surface before audit. See `BACKLOG.md` "Recently shipped" + `docs/audits/DRIFT-AUDIT-2026-05-15.md` for the audit subject.

### Sprint B0 — post-audit cleanup · 2026-05-18 → 2026-05-22

Surgical, no Stance B infrastructure yet. Closes the obsolete plan's surviving items + the audit drift fixes so the v2 surface is clean before we build under it.

| # | Owner | Size | Item | Source |
|---|---|---|---|---|
| B0-1 | lead-developer | S | Cull v1 archive — single commit, ~3,841 lines (`components/views/*`, root-level `components/{shell,icons,tweaks-panel}.tsx`, `app/styles/styles.css`) | survives from Stance A B1 |
| B0-2 | lead-developer | S | Cull dead `lib/data.ts` exports (`Member`, `ENGAGEMENT`, `SPRINTS`, `ACTIVE_SPRINT`, `SPRINT_PLAN_BACKLOG`, `DOC_TREE`, `DOCUMENTS`, `SMART_QUEUE`, `FINDING_INDEX`) | survives from Stance A B2 |
| B0-3 | lead-developer | M | Drift fixes from May 15 audit: D1 (`--surface-1/--surface-2` tokens), D2 (`.theme-light .d-code` override), D3 (Project Home capability/guide/workshop deep-links), D4 (DRC row → OC navigation) | DRIFT-AUDIT-2026-05-15.md §4 |
| B0-4 | ux-visionary | S | Focus-visible pass (carry-over from Stance A B13) | ux-visionary §3 |
| B0-5 | ux-visionary | S | Cull duplicate CSS (carry-over from Stance A B16) | DRIFT-AUDIT-2026-05-15.md C1–C3 |
| B0-6 | release-manager | M | GitHub Actions: `pnpm next build` + `pnpm smoke` on push/PR; branch protection on `main` | now MUST-have under Stance B (DB migrations need a CI gate) |
| B0-7 | test-engineer | M | Bootstrap Playwright + 1 smoke spec hitting all 11 routes asserting no JS crash (carry-over) | now MUST-have under Stance B |
| B0-8 | lead-developer | M | **Work Products surface (Path B).** (a) `WORK_PRODUCTS` seed populated by methodology-guru (~15-18 entries for NSU + WIU + CSU EB across capabilities). (b) New leftmost "Work Products" tab on `CapabilityDetailPage` grouping the engagement's WPs for this capability by phase, with state badge / owner / due / linked-OC count. (c) New `#workproducts` portfolio kanban — 5 lanes (`Not Started / In Progress / Needs Review / Signed / Blocked`), filter by phase + engagement + owner, shape mirrors active-playbook's `KanbanBoard.tsx`. (d) New `#workproducts/<id>` detail route showing purpose_and_scope, definition_of_done, RACI grid, prerequisites/feeds_into as upstream/downstream links, linked OCs (deep-link to guides), linked DRCs (deep-link to decisions). | Path B fork resolved 2026-05-12; data shape landed 2026-05-12 (freeze-safe, type-only); views deferred to post-audit per UI freeze |

**Acceptance:** v1 archive deleted, dead exports gone, both themes work, focus rings everywhere, CI gates `main`, Playwright runs in CI. Work Products surface mounted at `#workproducts`, capability detail surfaces deliverables not just tasks. `pnpm smoke` green at every commit.

### Sprint B1 — data layer foundation · 2026-05-25 → 2026-06-05 (2 wk · US Memorial Day Mon May 25 reduces to 9 working days)

The first Stance B sprint. No UI changes that the user sees; everything is plumbing. The acceptance bar: an authenticated test user can hit `/api/engagements/nsu` and get the same data shape that `lib/data.ts` exports today, served from Postgres.

| # | Owner | Size | Item |
|---|---|---|---|
| B1-1 | release-manager | S | Install Neon Postgres from Vercel Marketplace; pull `DATABASE_URL` into local + preview + prod environments |
| B1-2 | platform-engineer | M | Drizzle + drizzle-kit setup (`db/schema.ts`, `db/index.ts`, `drizzle.config.ts`); first migration creates §6.1 tables (auth-related deferred to B2) |
| B1-3 | platform-engineer | M | `pnpm db:seed` script reading `lib/data.ts` and writing every catalog + per-engagement table; idempotent so we can re-run on any branch |
| B1-4 | platform-engineer | M | API routes (no auth yet): `app/api/engagements/[id]/route.ts`, `.../capabilities`, `.../tasks`, `.../drcs`, `.../workshops`, `.../milestones`, `.../autopilot-runs`. Each returns the existing `lib/data.ts` shape. |
| B1-5 | platform-engineer | S | API routes for catalog: `app/api/oc-definitions`, `app/api/methodology`, `app/api/inner-source` |
| B1-6 | platform-engineer | S | `withEngagementAccess()` Drizzle helper stub (returns "no auth, allow all" for B1; auth-gated in B2) |
| B1-7 | release-manager | S | Add `pnpm db:migrate` to CI; Neon branching for preview deploys |
| B1-8 | docs-leader | S | ADR: data layer architecture (Drizzle + Neon, why not Prisma + Supabase) |
| B1-9 | test-engineer | S | Playwright spec: hit each API route, assert shape parity with `lib/data.ts` exports |

**Acceptance:** every read path that the v2 surface uses is available as an authenticated-able API route returning the same shape as `lib/data.ts`. UI still reads from `lib/data.ts` (cutover is B3). Migrations + seed run on every preview branch.

### Sprint B2 — auth + engagement scoping · 2026-06-08 → 2026-06-19 (2 wk)

| # | Owner | Size | Item |
|---|---|---|---|
| B2-1 | release-manager | S | Install Clerk from Vercel Marketplace; pull `CLERK_*` keys |
| B2-2 | platform-engineer | M | Clerk middleware + session helpers; sign-up + sign-in pages (Clerk's hosted views — keep our v2 surface untouched); custom claim mapping for `display_name`, `initials` |
| B2-3 | platform-engineer | M | `users` + `engagement_members` Drizzle tables + migration; on first sign-in, mirror Clerk profile to `users` and seed membership for the demo engagements (so existing pilot users see continuity) |
| B2-4 | platform-engineer | M | `withEngagementAccess()` enforces real membership; every per-engagement API route gates on it; 403 on non-member access |
| B2-5 | platform-engineer | S | Engagement-create flow (consultant signs up → creates an engagement → becomes its lead member) |
| B2-6 | lead-developer | M | `app/page.tsx` becomes auth-aware: unauthenticated → Clerk sign-in; authenticated → existing v2 SPA. Hardcoded "Janet Hawkins"/"JH" in `shell.tsx`, `brief.ts`, `detail.tsx` replaced by Clerk session profile. |
| B2-7 | lead-developer | S | Project switcher reads from `/api/engagements?membership=mine` instead of static `PORTFOLIO`; consultants see only their engagements |
| B2-8 | docs-leader | S | ADR: engagement-scoping model (membership over Clerk orgs, why) |
| B2-9 | test-engineer | M | Playwright: sign up → sign in → see only my engagements; 403 on a non-member's engagement URL |

**Acceptance:** R8 closed. Two test users can co-exist on the same Vercel URL with disjoint data. The v2 SPA reads consultant identity from Clerk, not from a hardcoded const.

### Sprint B3 — mutations + cutover · 2026-06-22 → 2026-07-03 (2 wk)

The v2 surface stops reading from `lib/data.ts` and starts reading from the API. Mutations land for the writes the prototype already implies (DRC sign-off, field-review confirm, task status, theme/landing prefs).

| # | Owner | Size | Item |
|---|---|---|---|
| B3-1 | platform-engineer | M | Mutation API routes: `POST /api/drcs/[id]/signoff`, `POST /api/field-reviews/[id]`, `PATCH /api/tasks/[id]/status`, `PATCH /api/user-prefs` |
| B3-2 | lead-developer | L | v2 surface read-cutover: every `import { ... } from "@/lib/data"` in `components/v2/*` replaced with a SWR/`use cache`-wrapped fetch (Next 16 Cache Components — see `next-cache-components` skill); `lib/data.ts` retained as seed-only, marked `@internal` |
| B3-3 | lead-developer | M | Field-review write-cutover: `localStorage v2.cfg.*` reads/writes replaced with `/api/field-reviews/*`; one-time migration: on first authenticated load, push localStorage values up |
| B3-4 | lead-developer | S | DRC sign-off button wired to `POST /api/drcs/[id]/signoff`; sign-off appears in audit trail |
| B3-5 | lead-developer | S | User prefs (theme, landing, mywork view) cutover: writes go to `/api/user-prefs`, server-rendered into the document on next load (kills theme flash for authenticated users — pre-paint script remains as fallback) |
| B3-6 | lead-developer | S | Settings page: amber "Demo data" pill replaced with "Your engagement data" pill; copy edits per Q4 sub-resolution |
| B3-7 | platform-engineer | S | Audit log table + API write-side instrumentation (who signed which DRC when) |
| B3-8 | test-engineer | M | Playwright: full mutation cycle (sign in → confirm a field → reload → still confirmed; sign in as a different user → not confirmed) |
| B3-9 | release-manager | S | Cut `0.3.0-beta.1` tag at end of sprint; production preview URL refreshed |

**Acceptance:** v2 SPA is fully API-backed. `lib/data.ts` is dev-time seed only. Two consultants on the same browser see different state after sign-in. DRC sign-off persists across sessions and devices. `pnpm smoke` green; `pnpm test` green.

### Sprint B4 — AskPage RAG · 2026-07-06 → 2026-07-17 (2 wk)

ai-architect leads the model + framework call; platform-engineer + lead-developer implement.

| # | Owner | Size | Item |
|---|---|---|---|
| B4-1 | ai-architect | S | RFC: model choice (Claude Sonnet 4.5 default + OpenAI gpt-4o failover via Gateway), prompt template, retrieval rules, refusal behavior, rate limits |
| B4-2 | release-manager | S | Enable AI Gateway; configure default + failover; pull `AI_GATEWAY_*` keys |
| B4-3 | platform-engineer | M | `oc_chunks` table + `pgvector` migration; chunking script reads `oc_definitions.sections` (intro, steps, callouts, fields) into ~512-token chunks with embeddings (OpenAI `text-embedding-3-small` via Gateway) |
| B4-4 | platform-engineer | M | `POST /api/ask` route: Vercel AI SDK streaming response, retrieves top-k from `oc_chunks` for the asked engagement's OC corpus + the catalog, passes as system context |
| B4-5 | lead-developer | M | AskPage rewrite: replaces "coming soon" stub with chat UI (Vercel AI SDK `useChat` hook), conversation list in left rail, streaming markdown response, citation chips that link `#guides/<ocId>` |
| B4-6 | platform-engineer | S | Per-user-per-day rate limit (default 100 messages, hard cap 200; toast warning at 80) backed by Neon counter table |
| B4-7 | methodology-guru | M | Index quality pass: spot-check retrieval against 20 representative consultant questions ("What is the SOATERM PoT layout we recommended?"), tune chunk size + retrieval k |
| B4-8 | platform-engineer | S | Cost dashboard via Vercel AI Gateway analytics; alert on any user > $5/day |
| B4-9 | test-engineer | M | Playwright: sign in → ask SOATERM PoT question → assert citation includes `#guides/soaterm`; rate-limit hard cap returns 429 |
| B4-10 | docs-leader | S | ADR: LLM scope is read-only chat (no action-taking); FERPA disclaimer language for AskPage |

**Acceptance:** AskPage answers consultant questions about populated OCs (SOATERM + whichever others have shipped) with grounded citations. Rate-limited. Streaming. No mutations from the LLM.

### Sprint B5 — content + polish + rehearsal · 2026-07-20 → 2026-07-31 (2 wk)

Everything left to be Janet-credible.

| # | Owner | Size | Item |
|---|---|---|---|
| B5-1 | methodology-guru → lead-developer | L | SFARCTL OC body populate (carry-over from Stance A B9) |
| B5-2 | methodology-guru → lead-developer | L | SPAIDEN OC body populate (carry-over from Stance A B10) |
| B5-3 | methodology-guru → lead-developer | M | NBAPOSN OC body populate (carry-over from Stance A C1) |
| B5-4 | methodology-guru → lead-developer | M | PTREARN OC body populate (carry-over from Stance A C2) |
| B5-5 | methodology-guru | S | Tag remaining empty OCs as "Not in pilot scope" (carry-over from Stance A C3) |
| B5-6 | methodology-guru | M | Populate WIU as second engagement (carry-over from Stance A C4); seed runs as part of `pnpm db:seed` |
| B5-7 | platform-engineer + lead-developer | M | After OC populates, regenerate `oc_chunks` embeddings for new OCs |
| B5-8 | lead-developer | M | Decision detail surface — `#decisions/<id>` (carry-over from Stance A C7) |
| B5-9 | lead-developer | M | Workshop detail surface — `#workshops/<id>` (carry-over from Stance A C8) |
| B5-10 | lead-developer | M | Wire ⌘K to in-memory filter across the API-fetched dataset (carry-over from Stance A C6) |
| B5-11 | lead-developer | S | Vercel Web Analytics + route-change pings (carry-over from Stance A C9) |
| B5-12 | docs-leader | M | USER_GUIDE.md — auth flow, engagement create, AskPage scope + FERPA disclaimer, your-data pill (replaces Stance A USER_GUIDE) |
| B5-13 | release-manager | S | Cut `1.0.0-pilot.1` at end of sprint |
| B5-14 | product-owner | M | Pilot rehearsal — Janet-eyes walk-through; sign off or veto per route |

**Acceptance:** five OCs populated (SOATERM + SFARCTL + SPAIDEN + NBAPOSN + PTREARN). Two engagements have credible data. Decision + Workshop detail surfaces live. ⌘K works. AskPage answers grounded questions across all five OCs. Pilot user can walk the demo end-to-end.

### Pilot week — 2026-08-03

Pilot session. Real consultants, real auth, real persistence, real LLM behind AskPage. Janet drives; stakeholders watch.

### Post-pilot

Folded into a separate post-pilot replan. Headline candidates: real Banner/Jira/Smartsheet integration (Q1 trigger), AskPage action-taking (Q2 trigger), Colleague OC modeling (Lafayette + secondary-question trigger), `detail.tsx` split (frozen until post-pilot), three-state DRC review, DnD kanban — all earned by pilot signal.

---

## 8. Risk register — Stance B edition

Dropped: R1 (pilot scope drift to Stance B/C) — moot, we're in Stance B. R8 (localStorage cross-user leakage) — replaced by R-AUTH below.

| # | Risk | Severity | Mitigated by |
|---|---|---|---|
| R-AUTH | Auth misconfiguration → consultant sees another engagement's data | **HIGH** | B2-4 single-helper enforcement; B2-9 Playwright cross-user test; quarterly access audit |
| R-MIG | DB schema migration drift between branches → broken prod migration | HIGH | B0-6 CI gate; B1-7 Neon branch-per-preview; migrations are append-only after `0.3.0` |
| R-LLM-COST | LLM cost spike (runaway user, prompt-injection abuse) | HIGH | B4-6 hard rate limit; B4-8 Gateway dashboard + alert |
| R-LLM-HALL | LLM hallucinates Banner config → consultant relies on a wrong answer in front of a client | HIGH | B4-1 prompt template requires citation; B4-5 UI surfaces citation chips; B4-7 retrieval-quality pass; B4-10 FERPA + "verify before acting" disclaimer |
| R-COLD | Vercel Functions cold-start (esp. Neon connect) ruins demo first-impression | MEDIUM | Use `@neondatabase/serverless` HTTP driver (no pool warm-up needed); pre-warm the demo path before pilot session via cron ping |
| R-SECRETS | Clerk + Neon + AI Gateway keys leak via Vercel project settings access or git mishap | HIGH | All keys auto-populated by Marketplace (no copy-paste); Vercel project access limited to release-manager + chief-architect; pre-commit hook to reject `.env*` files |
| R-FERPA | Consultant pastes a real student name/id into AskPage → stored in `ai_messages` | HIGH | Banner + warning on AskPage ("do not paste live student data"); `ai_messages` retention capped at 30 days; redaction policy documented in USER_GUIDE.md |
| R-LOCK | Vendor lock-in (Clerk + Neon + Gateway are load-bearing) | MEDIUM | Drizzle is portable; `@clerk/nextjs` is replaceable with NextAuth in 1–2 sprints; Neon → other Postgres is a connection-string change. Acknowledge cost; revisit if pilot succeeds. |
| R-INVITE | Pilot user invite flow fails on real higher-ed audience (institutional email blocking, Clerk magic link in spam) | MEDIUM | Pilot accounts pre-provisioned by release-manager via Clerk dashboard before session; magic-link tested with `*.edu` addresses in B2 |
| R-AUDIT | May 15 drift audit fires against an unsigned baseline | HIGH | A19, A20 (unchanged from Stance A) |
| R-EMPTY-OC | 11 of 12 OCs still stubs → demo-fatal | HIGH (was R5) | B5-1 → B5-5 populate five; remaining stubs visibly tagged "Not in pilot scope" |
| R-CONTENT-DRIFT | Banner schema accuracy regression in seed | MEDIUM | methodology-guru reviews `lib/data.ts` diffs in every PR that touches it |
| R-PARITY | `detail.tsx` (1,594 lines) touch-risk during B3 read-cutover | MEDIUM | Cutover is mechanical (find/replace `import` → fetch hook), not refactor; design-fidelity-guardian smoke-reviews B3-2 |
| R-FOCUS | Focus-visible / theme drift carry-over | MEDIUM | B0-3, B0-4 in cleanup sprint |
| R-NEW-SURFACE-COVERAGE | Three new toolkit-original surfaces (kanban, gantt, config-fields) still under-tested | MEDIUM | B0-7 Playwright bootstrap + B3-8 + B5 specs grow coverage |
| R-DATE-DRIFT | Hardcoded demo dates (workshop dates, milestone dates) stale by pilot | LOW | methodology-guru does a date sweep in B5 rehearsal week |
| R-XSS | `dangerouslySetInnerHTML` on OC body strings — risk grows when OC bodies become DB-sourced | MEDIUM (was LOW under Stance A) | B3-2 wraps OC body render in DOMPurify; sanitize on read |
| R-INDEX-KEYS | `index` as React key in maps | LOW | post-pilot |

---

## 9. Cull catalog — Stance B edition

### Survives unchanged from Stance A
- v1 archive cull (~3,841 lines) — now Sprint B0-1
- Dead `lib/data.ts` exports (`Member`, `ENGAGEMENT`, `SPRINTS`, `ACTIVE_SPRINT`, `SPRINT_PLAN_BACKLOG`, `DOC_TREE`, `DOCUMENTS`, `SMART_QUEUE`, `FINDING_INDEX`) — Sprint B0-2
- `OC_INDEX_FALLBACK` dead constant in `detail.tsx` — Sprint B0-2 (folded in)
- Duplicate CSS in `detail.css` (`.row`, `.stack`, `.btn-link`, `.t-h3`, `.v2-hero-actions`) — Sprint B0-5
- Dead CSS in `v2.css` (`.v2-main`, `.v2-section`, `.internals*`) — Sprint B0-5

### Changes scope under Stance B
- **Stance A polish items (Sprint B11–B16, C5, C15):** rescoped into Sprint B0 (drift fixes), B0-4/B0-5 (focus + CSS cull). Same fixes, different sprint label.
- **`lib/data.ts` itself:** does NOT get culled. It becomes the seed input for `pnpm db:seed`. Gets a `@internal — seed only, do not import from components/v2/*` JSDoc banner in B3-2; lint rule could enforce later.
- **Stance A USER_GUIDE.md (B19):** rescoped to cover auth + your-data + AskPage scope (was facilitator handoff); now B5-12.

### Now obsolete under Stance B
- **Stance A Settings amber "Demo data" pill (A13):** shipped in Sprint A as honest interim copy. Under Stance B with real persistence, Settings gets a "Your engagement data" pill instead — B3-6.
- **Stance A "Demo data — will pull from Jira/Smartsheet" brief footer copy:** still honest because the pilot still does NOT pull from Jira/Smartsheet (per §13 Q1 default). Keep as-is unless user picks real-integration sub-stance.
- **Stance A C5 (consultant name field in Settings):** obsolete — consultant identity comes from Clerk in B2-6.
- **Stance A C10 (custom pilot subdomain):** obsolete — Q5 picked `*.vercel.app`.
- **Stance A C16 (pilot rehearsal — late-May):** obsolete — pilot moves to August; rehearsal is B5-14.

---

## 10. Calendar

```
2026-05-11 (today)  Replan landed. Sprint A in flight.
2026-05-13 EOD      Freeze main. Tag v0.2.0-pre-audit. UI freeze.
2026-05-15          Drift audit fires. design-fidelity-guardian posts report.
2026-05-16–17       Weekend.
2026-05-18 → 05-22  Sprint B0 — post-audit cleanup (v1 cull, dead exports, drift fixes, CI, Playwright bootstrap).
2026-05-25          Memorial Day (US holiday). Sprint B1 starts that week with a 4-day open.
2026-05-25 → 06-05  Sprint B1 — data layer foundation (Neon, Drizzle, schema, seed, read-only API routes).
2026-06-08 → 06-19  Sprint B2 — auth + engagement scoping (Clerk, membership, R8 closed).
2026-06-22 → 07-03  Sprint B3 — mutations + cutover (v2 surface stops reading lib/data.ts; localStorage migration).
2026-07-04          US Independence Day.
2026-07-06 → 07-17  Sprint B4 — AskPage RAG (AI Gateway, pgvector, streaming chat, rate limits).
2026-07-20 → 07-31  Sprint B5 — content (5 OCs) + 2nd engagement + Decision/Workshop detail + ⌘K + telemetry + USER_GUIDE + rehearsal.
2026-08-03          PILOT SESSION (Janet driving; stakeholders watching).
2026-08-04+         Observe. Post-pilot replan triggered by signal.
```

**Headline pilot date: Monday 2026-08-03.** Roughly 12 calendar weeks from today. The briefing's 6–10-weeks estimate was for "focused work"; this calendar adds the post-audit cleanup sprint, the OC-content gap that Stance A also had, and a rehearsal buffer. Capacity assumption: user + agent sessions (no new engineers).

**Aggressive alternative pilot date: Monday 2026-07-20.** Cuts B5 content sprint to 3 days (only SFARCTL populates; SPAIDEN/NBAPOSN/PTREARN remain stubs) and pushes Decision/Workshop detail surfaces post-pilot. Surface this to the user — see §13 Q5.

---

## 11. Agent ownership matrix — Stance B edition

### New to the roster
- **`platform-engineer`** (NEW — chief-architect recommends adding to AGENTS.md). Owns server-side surface: Drizzle schema + migrations, API route shape, Clerk wiring, Neon connection management, Vercel Functions runtime config, AI Gateway integration, secrets/env discipline, audit-log instrumentation. Distinct from `lead-developer` (TSX/React) and `release-manager` (deploys, version cuts, CI). The Stance B build has 5 sprints of server-side work; without an owner this drifts.
- **`ai-architect`** (already in the available registry; formally added to roster). Owns AskPage LLM model + framework choice, prompt template, retrieval rules, refusal/safety behavior, rate-limit policy, FERPA-aware UX language. Brought in for Sprint B4. Doesn't write code; writes the RFC that `platform-engineer` + `lead-developer` implement.

### Updated ownership (under Stance B)

| Item | Primary owner | Backstop |
|---|---|---|
| Auth wiring (Clerk middleware, sign-in/sign-up routes, session helpers) | platform-engineer | release-manager (Marketplace install) |
| Data model + migrations + seed | platform-engineer | chief-architect (schema review) |
| API routes (read + write) | platform-engineer | lead-developer (consumer side) |
| AskPage LLM integration | ai-architect (RFC) → platform-engineer (server) + lead-developer (UI) | chief-architect (scope/safety call) |
| Engagement-scoping correctness (R-AUTH) | platform-engineer | chief-architect (audit) |
| Vercel Marketplace installs (Neon, Clerk, AI Gateway) | release-manager | platform-engineer (config) |
| TSX/CSS implementation (UI cutover, mutation wiring) | lead-developer | ux-visionary (style), platform-engineer (API contract) |
| Visual quality, theme parity, a11y (carry-over) | ux-visionary | lead-developer |
| Drift audit (May 15 + future audits) | design-fidelity-guardian | chief-architect |
| Banner/Ellucian content accuracy + RAG corpus quality | methodology-guru | ai-architect (retrieval-quality lens) |
| Test stack, CI gating, integration tests | test-engineer | release-manager |
| README, USER_GUIDE.md, ADRs | docs-leader | chief-architect |
| Scope, sequencing, "is this MVP?" | product-manager | chief-architect |
| User-side veto/endorsement (Janet voice) | product-owner | product-manager |
| Cross-cutting calls, agent disputes, final authority | chief-architect | — |

### Action: docs-leader to update AGENTS.md
Add `platform-engineer` and `ai-architect` to the roster table. Both should ship with `.claude/agents/<name>.md` definition files (chief-architect will draft the platform-engineer spec; ai-architect already has a registry entry to mirror).

---

## 12. What we are deliberately NOT doing for this pilot — Stance B edition

| Item | Why deferred | Re-eval trigger |
|---|---|---|
| Real Banner / Jira / Smartsheet integration | Months of OAuth + per-institution schema reconciliation. Pilot validates UX-shape; integration is post-pilot. | §13 Q1 flip; pilot feedback demanding it |
| LLM action-taking (sign DRCs, file Jira, draft config-field reviews via assistant) | Separate trust + auditability problem. Earned post-pilot. | §13 Q2 flip; pilot signal |
| Multi-org Clerk model (each higher-ed institution = a Clerk org) | Single Ellucian-org-of-consultants is sufficient for a 5–25 user pilot. Multi-org = real platform build. | Pilot grows past one consulting org |
| Colleague OCs (Lafayette is a Colleague engagement in PORTFOLIO) | Single ERP family for pilot; engagement-create flow can mark Colleague but OC content is Banner-only | Pilot signal demands cross-product modeling |
| Real autopilot pipeline | Mock data is sufficient to test UX shape; integration replaces it | Pilot signal |
| DRC tamper-evident hash with legal weight | Mock hash placeholder; real legal weight needs an external audit log + vendor | Stance C |
| DnD kanban | Janet veto stands (Jira already does this) | Pilot signal |
| Three-state DRC review | Two states sufficient | Pilot signal |
| Density toggle / Tweaks panel | Single density acceptable | Pilot signal |
| Active-playbook capability roadmap card view | Gantt is enough | Post-pilot |
| Per-capability kanban inside Delivery tab | MyWork cross-engagement kanban covers the queue need | Pilot signal |
| `detail.tsx` split (1,594 lines → ~3 files) | Touch-risk during B3 cutover; post-pilot refactor | Post-pilot |
| Vitest unit tests | Playwright + TS strict cover the pilot bar | When algorithmic logic lands |
| `xlsxRowIds` on capabilities for budget reconciliation | Mock budget tab works without it | Real xlsx-source plumbing |
| Mobile-responsive layout | Consultant desktop tool | Never (per brief) |
| Email notifications | Out of scope | Post-pilot |
| Audit-log UI surface | DB-side audit only via B3-7; UI is post-pilot | Pilot signal |
| Custom domain (e.g. `toolkit.ellucian.com`) | Q5 picked `*.vercel.app` | User flips Q5 |
| Inner-Source dedicated surface | Right-rail in CapabilityDetail covers it | Post-pilot |
| OC body content for OCs 6–11 (STVATTR, SHACATQ, SSASECT, FGRGL, FTMVEND, RORPRIO) | Five-OC bar (SOATERM + SFARCTL + SPAIDEN + NBAPOSN + PTREARN) sufficient for pilot | Post-pilot priority |

---

## 13. Open architectural sub-questions for the user

These are the calls I deliberately surfaced rather than defaulted. Each has a recommendation I will execute on if no override lands; the column "what flips if user overrides" tells you the cost of saying yes to the alternative.

### Q1. Persistence scope under Stance B — mock-shape vs real integration?
**Why it matters:** Real Banner/Jira/Smartsheet integration is months of OAuth + per-institution schema reconciliation. Mock-shape persistence (the seed flow in §6.4) is the entire data layer in Sprint B1 + B3.
**Recommendation:** **Per-user persistence of the existing `lib/data.ts` mock-data shape for v1 of Stance B.** Real integrations are post-pilot — they're a separate scope question with separate vendor escalations.
**What flips if user overrides:** Add ~3 sprints (B-int1 Banner read, B-int2 Jira sync, B-int3 Smartsheet) before pilot. Pilot date moves from 2026-08-03 to ~2026-10-12. Need vendor-API access provisioned by Ellucian Engineering.

### Q2. AskPage LLM blast radius — read-only chat vs action-taking agent?
**Why it matters:** Read-only chat (RAG) is a single API route with rate limits and retrieval. Action-taking (LLM signs DRCs, drafts field-reviews, files Jira tickets) requires tool-use safety, prompt-injection hardening, undo/audit, and per-action confirmation UX.
**Recommendation:** **Read-only chat for v1 of Stance B.** Action-taking is earned post-pilot when we know what consultants actually ask the assistant for.
**What flips if user overrides:** B4 expands by ~1 sprint; ai-architect writes a tool-use safety RFC; every mutation API route grows an `assistant_initiated` flag with 2-step user confirmation; audit log gains LLM-author attribution.

### Q3. Pilot date — 2026-08-03 default vs 2026-07-20 aggressive?
**Why it matters:** Default leaves room for five OCs populated, two engagements, Decision/Workshop detail, ⌘K, telemetry, rehearsal. Aggressive cuts B5 content to 3 days — only SFARCTL populates beyond what Stance A shipped, no Decision/Workshop detail.
**Recommendation:** **2026-08-03.** The pilot's job is to validate UX-shape against working consultants, not to ship fast. A demo with three populated OCs (Stance A bar) instead of five risks a thin demo signal.
**What flips if user overrides:** Pilot moves to 2026-07-20. B5 shrinks; SPAIDEN/NBAPOSN/PTREARN remain stubs; Decision/Workshop detail post-pilot; USER_GUIDE.md slimmer; no rehearsal buffer.

### Q4. AskPage RAG corpus scope — populated OCs only vs all 12 OCs?
**Why it matters:** Indexing only the populated OCs (SOATERM at start, growing to 5 by B5) keeps retrieval honest — the assistant only answers about OCs with real content. Indexing all 12 means the assistant might answer about an OC whose body is a stub, which lies.
**Recommendation:** **Populated OCs only.** Re-index after each OC populate (B5-7 covers this).
**What flips if user overrides:** ai-architect adds a "this OC has no detailed content yet — answer is from the OC index entry only" disclaimer in the prompt template. No extra sprint cost; honesty cost.

### Q5. Pilot user cap — hard limit in Clerk?
**Status:** **MOOT until hosting is funded** (see §2 Q5 update — Vercel deferred). Re-evaluate when pilot URL exists.
**Why it matters (when applicable):** Clerk free tier is 10K MAU; Neon free is 0.5 GB storage. Pilot is intended for >5 self-serve users (per Q3 answer). Without a cap, a pilot link forwarded to an enthusiast list could blow past free tier and rack up cost.
**Recommendation:** **Hard-cap at 25 users** in Clerk's allowlist for the pilot window. Add via Clerk dashboard; release-manager provisions.
**What flips if user overrides:** Higher cap → upgrade Clerk + Neon to paid tiers (~$25 + $19/mo each); product-manager owns the cost call.

### Q6. AskPage rate limit per user per day?
**Why it matters:** No rate limit means a runaway script (or prompt-injection attack) bills us linearly. Soft cap with toast warning at 80, hard cap at 200, both per-user-per-day, is industry default for pilot RAG.
**Recommendation:** **100 messages/user/day soft, 200 hard, configurable in `lib/limits.ts`.** chief-architect call; user can override in either direction.
**What flips if user overrides:** Higher → cost risk; lower → consultant frustration in a long demo session.

---

## 14. Where this plan lives

- **This document:** [docs/MVP-PILOT-PLAN.md](docs/MVP-PILOT-PLAN.md)
- **Stance B replan reasoning trace:** [.claude/agent-memory/chief-architect/project_stance_b_replan_2026_05_11.md](.claude/agent-memory/chief-architect/project_stance_b_replan_2026_05_11.md) — full chief-architect reasoning behind the choices in §5–§13.
- **Per-agent Stance A deliverables (historical, pre-pivot):** `.claude/agent-memory/<agent>/project_mvp_pilot_review.md` for each of: chief-architect, product-manager, product-owner, lead-developer, ux-visionary, design-fidelity-guardian, methodology-guru, test-engineer, docs-leader, release-manager.
- **Stance A plan as it stood pre-pivot:** preserved in git history; BACKLOG.md `## Sprint B/C — OBSOLETE under Stance B` sections summarize.
- **Drift-baseline reference:** [.claude/agent-memory/design-fidelity-guardian/reference_design_tarballs.md](.claude/agent-memory/design-fidelity-guardian/reference_design_tarballs.md) — tarball `CgM4C5b7mEU63Y2RQISWcw` is the current audit baseline.
- **Toolkit-original additions note:** [.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md](.claude/agent-memory/design-fidelity-guardian/project_toolkit_original_additions.md).
- **May 15 audit subject:** [docs/audits/DRIFT-AUDIT-2026-05-15.md](audits/DRIFT-AUDIT-2026-05-15.md).

This document is **the plan**. Update it as decisions land. When a sprint closes, mark its items done in-place and capture deltas. The Stance A historical context in §1–§4 is intentionally preserved; do not delete unless the user asks.
