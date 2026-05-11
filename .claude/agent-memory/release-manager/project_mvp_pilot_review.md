---
name: MVP Pilot Release Review
description: Release-manager assessment for production pilot readiness as of 2026-05-11
type: project
---

# MVP Pilot Release Review — 2026-05-11

## 1. Current-State Findings (release readiness today)

- **Version:** `0.1.0` in `package.json`. No git tags exist. No CHANGELOG.md.
- **Vercel:** NOT linked. No `vercel.json`, no `.vercelignore`. First deploy requires `vercel link`.
- **CI/CD:** No `.github/` directory. No GitHub Actions. No pre-commit hooks (no lint-staged, no husky config).
- **Build gate:** `pnpm next build` (Next.js 16.2 Turbopack static prerender). No known-broken state; not verified in this session yet.
- **Smoke gate:** `scripts/smoke.sh` exists — build + start + curl + HTML marker assertions. Sound script but not wired to any CI.
- **Uncommitted work:** 11 modified files + 9 untracked files as of 2026-05-11 session. Today's features (MyWork kanban, Schedule gantt, Configuration Guide config-fields) are unstaged.
- **Untracked files of note:**
  - `lib/school-brands.ts` — likely needed by committed code; verify before build.
  - `docs/NN Ellucian Student Banner Signature Project Plan (1).xlsx` — binary asset; should evaluate `.gitignore` treatment.
  - `.claude/agent-memory/*` new files — should commit with session.
  - `app/styles/detail.css`, `components/v2/detail.tsx` — new v2 surface; must commit before deploy.
- **Remotes:** `origin` → GitHub (`miket-llc/n2s-consulting-toolkit`), `bitbucket` → Ellucian internal (`git.ellucian.com`). Dual-remote; clarify which is the Vercel source-of-truth remote.
- **Branch protection on main:** none (no GitHub Actions, no repo rules visible from local).
- **Env vars:** zero required today (pure static SPA, no backend, no analytics, no API keys).
- **Rollback:** none — no prior tagged release, no prior Vercel deployment to roll back to.

## 2. Extraneous (release angle)

- Nothing to prune. No stale branches, CI configs, or release artifacts exist yet. Pipeline is empty.
- The `.xlsx` doc in `docs/` is binary and large — consider `.gitignore`-ing or LFS-ing it; it doesn't belong in a Vercel deploy.

## 3. MVP Scope for Pilot

### Must-Have (release-side)
- [ ] Commit all today's work (staged + untracked) as a clean commit
- [ ] `vercel link` to `miket-llc` org (or user account)
- [ ] First preview deploy (`vercel`) — confirm static export serves correctly
- [ ] Verify `pnpm next build` passes on clean tree before every deploy
- [ ] Production promote (`vercel --prod`) — gives shareable `.vercel.app` URL for pilot users
- [ ] Git tag `v0.2.0` (or chosen version) at the production deploy SHA
- [ ] CHANGELOG.md — minimal entry for the pilot cut

### Should-Have
- [ ] GitHub Actions workflow: on push to `main`, run `pnpm next build` (blocks merge if broken)
- [ ] Smoke step in GHA (reuse `scripts/smoke.sh`)
- [ ] Branch protection on `main` (require status checks to pass)
- [ ] Custom subdomain for pilot (e.g. `pilot.n2s-consulting-toolkit.com` or `toolkit.ellucian-n2s.com`) — depends on user/org domain ownership
- [ ] `.vercelignore` to exclude `docs/*.xlsx`, `.claude/`, `scripts/`

### Could-Have
- [ ] Vercel Analytics (no env vars needed — just `@vercel/analytics` package + `<Analytics />` component)
- [ ] Vercel Speed Insights
- [ ] Slack webhook for deploy notifications
- [ ] `CODEOWNERS` file for PR review routing

## 4. Concrete Work Items (sequenced, sized)

| # | Task | Size | Notes |
|---|------|------|-------|
| 1 | Commit today's session work (staged + untracked v2 files) | S | Prerequisite for all below |
| 2 | `vercel link` (connect repo to Vercel project) | S | ~5 min; one-time |
| 3 | Add `.vercelignore` (exclude docs/*.xlsx, .claude/, scripts/) | S | Clean deploy artifact |
| 4 | `pnpm next build` verification on clean tree | S | Gate before deploy |
| 5 | First preview deploy (`vercel`) | S | Confirms Vercel config works |
| 6 | Production promote (`vercel --prod`) | S | Gives shareable URL; requires clean build |
| 7 | Version bump to `0.2.0` in package.json | S | Reflects "pilot" milestone |
| 8 | Create CHANGELOG.md with pilot entry | S | dated, bullet list of shipped features |
| 9 | `git tag v0.2.0` + push tag to origin | S | Release artifact |
| 10 | GitHub Actions CI workflow (build + smoke on push/PR) | M | `.github/workflows/ci.yml` |
| 11 | Branch protection on `main` (require CI pass) | S | GitHub repo settings |
| 12 | Custom pilot subdomain (DNS + Vercel domain config) | M | Blocked on domain decision |
| 13 | Vercel Analytics integration | S | Package install + one component |

## 5. Risks

- **No rollback target:** First deploy is also the only deploy. If the first production promote is broken, there is no prior good deployment to roll back to. Mitigation: verify preview deploy fully before promoting to prod.
- **Dual remotes (GitHub + Bitbucket):** Vercel should connect to exactly one. GitHub (`origin`) is the natural choice. Divergence between remotes after linking could cause confusion; clarify push discipline.
- **Uncommitted binary doc:** `docs/NN Ellucian ... .xlsx` — if accidentally deployed, it increases bundle/deploy artifact size. Add to `.vercelignore` before first deploy.
- **No CI today:** A bad push can break main silently. Until GHA CI is wired (work item #10), the build is only as reliable as the developer's local discipline.
- **school-brands.ts untracked:** If any committed code imports it (likely, given the naming convention), a build on a clean clone would fail. Must verify and commit.
- **Drift audit 2026-05-15:** Only 4 days out. If the audit baseline requires a clean tree + passing build + deployed preview, we have a hard deadline on items 1–9 above.
- **Static SPA on Vercel:** Next.js 16 static prerender should work out of the box, but hash routing (`#/schedule`, etc.) must be tested post-deploy — Vercel's CDN won't 404 on hash routes, but client-side routing needs a `vercel.json` rewrite if the app uses real URL paths instead of hashes.

## 6. Open Questions for User

1. **Pilot URL/branding:** Is `n2s-consulting-toolkit.vercel.app` acceptable for the pilot, or do we need an Ellucian/N2S branded domain (e.g. `toolkit.n2s-group.com`)? Domain provisioning adds lead time.
2. **Vercel account:** Deploy to `miket-llc` personal org or a team/org account? Team account needed if multiple consultants need Vercel dashboard access.
3. **Bitbucket vs GitHub as Vercel source:** Confirm GitHub (`origin`) is the Vercel-connected remote. Should Bitbucket receive pushes independently?
4. **Pilot user count:** How many consultants in the pilot? Affects whether free Vercel tier is sufficient (Hobby: 100GB bandwidth/mo; Pro: unlimited team members, 1TB).
5. **Analytics/feedback:** Do pilot users need a way to submit feedback? If yes, that's a new env var story (e.g. a form-backend like Tally or Formspree — but this is product scope, not release scope).
6. **Pre-audit freeze:** Should `main` be frozen after the pre-audit commit (2026-05-13 EOD recommended) to give the drift audit a stable subject? Or is rolling churn acceptable?
7. **Version scheme:** `0.2.0` (semver minor for "pilot milestone") vs `1.0.0-pilot.1` (pre-release tag signaling production intent)? The latter communicates "this is deliberate pilot quality" more clearly to stakeholders.

## Drift Audit Pre-flight (2026-05-15)

**Recommended sequence:**
1. **Today (2026-05-11):** Commit session work → `vercel link` → preview deploy → verify smoke → tag `v0.2.0-pre-audit`.
2. **2026-05-12:** GHA CI workflow if time allows; otherwise manual smoke discipline.
3. **2026-05-13 EOD:** Freeze `main`. No new feature commits. Any fixes only via hotfix PR.
4. **2026-05-14:** Run `pnpm smoke` locally. Confirm preview deploy URL is stable. `design-fidelity-guardian` runs audit against the frozen tree.
5. **2026-05-15:** Audit fires against clean state. Release-manager confirms build green and deploy live.

**Audit subject:** the preview deploy URL from step 1 (or a dedicated `vercel --prod` if the user wants the audit against production).

**Version for audit:** `v0.2.0-pre-audit` tag (lightweight) pointing at the frozen commit. If audit passes, retag as `v0.2.0`.
