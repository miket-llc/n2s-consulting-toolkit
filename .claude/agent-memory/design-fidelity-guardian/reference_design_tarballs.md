---
name: Design tarball hashes seen
description: Log of design-tarball hashes I've audited, with date + headline change, so future audits can diff against the right baseline.
type: reference
---

Source-of-truth URL pattern:
`https://api.anthropic.com/v1/design/h/{HASH}`

| Date       | Hash                     | SHA-256 (first 12)  | Headline                                                                  |
|------------|--------------------------|---------------------|---------------------------------------------------------------------------|
| 2026-05-04 | `40V7rluFXZJHiRCn8G26dw` | `f05d76bb5a2a`      | New `v2/school-brands.js` + `SchoolLogo` in `v2/shell.jsx`; PORTFOLIO in `data.js` gains `domain`/`logoUrl`/`logoColor`/`initials`/`short`; 4 of 8 pilot schools renamed (p4, p6, p7) — net-new engagement-logos surface, never ported. |
| 2026-05-08 | `CgM4C5b7mEU63Y2RQISWcw` | (not hashed)        | Active baseline through 2026-05-11 morning. Source for May 15 drift audit pre-flight (`docs/audits/DRIFT-AUDIT-2026-05-15.md`). |
| 2026-05-11 | `K3NKe3IuvfS03Mr6yWnkDw` | `c19d0f5c0259`      | **Current baseline.** New TopBar (44px, violet gradient `#6b2bd9→#7c3aed→#8b5cf6`, inverted-white Ellucian wordmark, white-tinted search/attn/avatar controls), narrowed brand block. NEW `ProjectContextBar` (44px, `--bg-panel`, sticky below topbar) appears only on project-scoped routes (`project`, `capabilities`, `guides`, `decisions`, `workshops`, `schedule`); contains "← Portfolio" back link + relocated `ProjectSwitcher` + meta pills (phase·sprint, nextGL). User-explicit re-baseline pre-audit. Rail composition unchanged. |

Tarball layout (40V7…, CgM4…): `n2s-consulting-toolkit/project/{v2/,v1-archive/, data.js, …}` — i.e. v2 is the active surface, the original `views-*.jsx` set lives under `v1-archive/`. The port's mounted surface (`components/v2/*`) maps to `project/v2/*`; the legacy port (`components/views/*`) maps to `project/v1-archive/*`.

Tarball layout (K3NKe3Iu…): same shape — `project/v2/*.jsx` is the active surface, `project/v1-archive/*` is the older v1 reference. New tarball additionally bundles 7 design-chat transcripts under `project/chats/*.md` per the new claude.ai/design export shape (read these first per `README.md`; intent lives in the chat).

How to rebuild a baseline:
```
curl -L -o /tmp/design.tar.gz https://api.anthropic.com/v1/design/h/{HASH}
mkdir -p /tmp/design-source && tar -xzf /tmp/design.tar.gz -C /tmp/design-source
```
