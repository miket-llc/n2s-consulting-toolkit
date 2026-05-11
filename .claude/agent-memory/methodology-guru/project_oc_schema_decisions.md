---
name: OC Schema Decisions — SFARCTL and SPAIDEN authoring (2026-05-11)
description: Banner schema choices made when authoring SFARCTL and SPAIDEN OC bodies. Prevents regression on table/column names.
type: project
---

# OC Schema Decisions — SFARCTL and SPAIDEN

Authored 2026-05-11 (Sprint B5-1 + B5-2 pull-forward). lib/data.ts only; OC_DATA transformed
from flat single-OC object to `Record<string, OCDefinition>`. New exported types: `OCSection`,
`OCDefinition`. Legacy views-oc.tsx updated to use `OC_DATA["soaterm"]` and import `OCSection`.

---

## SFARCTL — Registration Window Control (OC-2.4.2)

### Banner table / column decisions

| What | Decision | Rationale |
|---|---|---|
| Primary underlying table | `SFRRGCL` | Registration Control records — confirmed by existing SOATERM SQL |
| Form-to-table relationship | SFARCTL form → SFRRGCL records | Consistent with SQL already in SOATERM reg-windows section |
| Part-of-term records | Live on `SOBPTRM`, NOT on SFARCTL | SFARCTL window rows reference SOBPTRM via SFRRGCL_PTRM_CODE FK |
| Cohort priority ordering | Via `SFRRGCL_LEVL_CODE` + `SFRRGCL_STYP_CODE` | Level-first (GR before UG), then STVSTYP for UG class standing |
| Individual overrides | `SFRRGCL_PIDM` not NULL | PIDM-level row overrides cohort-level row for same term |
| STVSTYP codes | Institution-defined validation table | NSU convention: S/J/SO/FR/N for Senior/Junior/Sophomore/Freshman/Nondegree |
| Web/add-drop flags | On SOATERM master switch, refined at cohort level in SFARCTL | SOATERM gates; SFARCTL refines — deliberately kept imprecise on exact column names (not verified) |

### What was deliberately left blank (insufficient confidence)
- Exact column names for add/drop/audit flags at cohort level — these may be on SOATERM rather
  than SFARCTL itself. The section (05 "Registration flags") describes behavior without citing
  specific column names. Better an honest gap than a fabricated field.
- Fee-assessment timing (SFARGFE-related) — deliberately omitted; this is a separate Banner
  form from SFARCTL. Including it would have required fabricating SFARGFE column details.

### Sections authored
6 sections: overview (no steps), cohorts (2 steps + SQL), pot-scope (no steps), individual-overrides
(no steps), registration-flags (no steps), validation (no steps).
CONFIG_FIELDS: 4 fields across cohorts (3) and pot-scope (1). Skipped overview (no clean field-level
entry without fabricating) and registration-flags (column names unverified).

---

## SPAIDEN — Person Identification (OC-3.1.1)

### Banner table / column decisions

| What | Decision | Rationale |
|---|---|---|
| Primary table | `SPRIDEN` | Person identification — PIDM, ID, name, entity indicator |
| Supplemental demographics | `SPBPERS` | One-row-per-PIDM: birth date, SSN, gender, citizenship, ethnicity |
| Address table | `SPRADDR` | FK to SPRIDEN PIDM; address type from STVATYP |
| Telephone table | `SPRTELE` | FK to SPRIDEN PIDM; phone type from STVTELE |
| Email table | `GOREMAL` | GOREMAL (Global email) — not SPREMAL; confirmed Banner convention |
| Name type table | `GTVNTYP` | Name type validation table — institution-controlled |
| SPRIDEN_NTYP_CODE | Correct column name for name type on SPRIDEN | Used SPRIDEN_NTYP_CODE (not SFRIDEN_NTYP_CODE — caught typo) |
| SPBPERS_SEX values | M/F/N/U | N=Non-binary available in Banner; U=Unknown; institution must confirm N activation |
| SPBPERS_BIRTH_DATE | Real column, FERPA-sensitive | TC-7 in autopilot run #282 directly references this — linked the finding explicitly |
| SPRIDEN_SEARCH_LAST_NAME | Soundex-normalized for duplicate detection | Standard Banner duplicate-detection behavior |
| LEGACY-PIDM continuity | One-way door — always preserve unless change-control-approved | Most critical config decision for SaaS migrations |

### What was deliberately left blank (insufficient confidence)
- GUAIDEN ID sequence configuration details — referenced as the place to configure starting
  sequence value but not walked step-by-step (form navigation details vary by Banner version)
- GORRACE ↔ IPEDS mapping specifics — described the constraint (don't break the mapping)
  without citing specific GORRACE column names
- SSB preferred-name display configuration — mentioned as a config action but not walked
  step-by-step (SSB config is outside the SPAIDEN OC scope)

### Sections authored
6 sections: overview (no steps), id-strategy (1 step + 3 fields), name-types (1 step + 3 fields),
address-telephone (1 step + 3 fields), demographics (1 step + 4 fields), validation (no steps).
CONFIG_FIELDS: 6 fields across id-strategy (2), name-types (1), address-telephone (1), demographics (3).

---

## OC_DATA structural change

- Transformed from single flat export `{ code, title, sections }` to
  `Record<string, OCDefinition>` keyed by ocId.
- Exported `OCSection` and `OCDefinition` types from lib/data.ts.
- Updated `detail.tsx` (v2): single line change from hardcoded `ocId === "soaterm"` check
  to `OC_DATA[ocId] ?? null` — now resolves any populated OC.
- Updated `views-oc.tsx` (v1 legacy): `OC_DATA["soaterm"]` direct key access;
  imports `OCSection` type instead of deriving from `typeof OC_DATA.sections`.

## Build status
pnpm next build: ✓ green
pnpm smoke: ✓ green
