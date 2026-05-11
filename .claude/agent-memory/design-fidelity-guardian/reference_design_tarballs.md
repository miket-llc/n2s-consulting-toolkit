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

Tarball layout (40V7…): `n2s-consulting-toolkit/project/{v2/,v1-archive/, data.js, …}` — i.e. v2 is the active surface, the original `views-*.jsx` set lives under `v1-archive/`. The port's mounted surface (`components/v2/*`) maps to `project/v2/*`; the legacy port (`components/views/*`) maps to `project/v1-archive/*`.

How to rebuild a baseline:
```
curl -L -o /tmp/design.tar.gz https://api.anthropic.com/v1/design/h/{HASH}
mkdir -p /tmp/design-source && tar -xzf /tmp/design.tar.gz -C /tmp/design-source
```
