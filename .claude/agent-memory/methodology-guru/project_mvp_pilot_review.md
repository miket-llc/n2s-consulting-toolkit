---
name: MVP Pilot Domain Review — 2026-05-11
description: Full domain-accuracy review of lib/data.ts for pilot readiness. Hard errors, soft flags, culling recommendations, work items, risks.
type: project
---

# MVP Pilot Domain Review — 2026-05-11

Reviewer: methodology-guru  
Context: Production-pilot readiness assessment across all domain entities in lib/data.ts.

---

## 1. Current-State Findings by Entity

### BUSINESS_CAPABILITIES (12 entries)
All 12 capability labels and taglines read correctly for Banner/Ellucian context.

**Specific reads:**
- All area labels (Student / Finance / HR / Cross) and tagline vocabulary (R2T4, ISIR, ECLS, DegreeWorks, detail codes, TGRFEED, chart-of-accounts) are Banner-idiomatic. No issues.
- "AR & Collections" tagline — "Detail codes, deposits, agency feeds" reads as student AR, not corporate AR. That is appropriate for Banner. Fine.
- "Housing & Residence" tagline — "Room mapping, term activation, billing tie" is slightly vague vs. Banner's `SLBTERM` / `SLBRDEF` vocabulary. Minor.

**Rating: PASSES**

---

### OC_INDEX — Form Names

| OC ID | Title | Status |
|---|---|---|
| SOATERM | ✓ Real Banner form | OK |
| SPAIDEN | ✓ Real Banner form | OK |
| SFARCTL | ⚠ Unverified — registration windows; SQL uses `SFRRGCL` table which has `SFR-` prefix while form has `SFA-` prefix. Likely fabricated. The correct form for reg priority windows is `SFARGFE` or `SFAREGQ`. | FLAG |
| SHACATQ | ⚠ Unverified — SHA prefix is Academic History; catalog queries use `SCACRSE` family. `SHACATQ` does not match known Banner forms. | FLAG |
| SSASECT | ✓ Real Banner form (Section query/build) | OK |
| STVATTR | ✓ Real Banner validation table | OK |
| NBRPSN | ⚠ Wrong type — `NBRPSN` is the database *table*; the Banner *form* for Position Definition is `NBAPOSN`. OC titles should reference form names, not table names. | HARD ERROR |
| PTREARN | ✓ Real Banner form / earn code setup | OK |
| FGRGL | ⚠ Unverified — GL account structure forms are `FTMCOAS`, `FTMFUND`, `FTMACCT`. `FGRGL` does not match. | FLAG |
| FTVVEND | ✗ Wrong prefix — `FTV` = Finance Table Validation (e.g., `FTVACCT`, `FTVFUND`). Vendor maintenance form is `FTMVEND`. `FTVVEND` implies a validation-type record, not vendor setup. | HARD ERROR |
| RORPRIO | ⚠ Unverified — Banner FA forms are `RNAAWRD`, `RFRMGMT`, `RJRRULP`. `RORPRIO` (ROR = Reg/Override Rule?) is not in standard Banner FA form vocabulary. | FLAG |
| wdintegr | ✓ Acknowledged as a custom integration OC, not a Banner form. ID convention (lowercase) distinguishes it from Banner form codes. | OK (with note) |

**Hard errors: 2** (NBRPSN, FTVVEND)  
**Soft flags: 4** (SFARCTL, SHACATQ, FGRGL, RORPRIO)

#### Proposed corrections:
- `NBRPSN → NBAPOSN · Position Definition`
- `FTVVEND → FTMVEND · Vendor Onboarding`

---

### CONFIG_FIELDS_BY_OC — SOATERM Field Codes

| Field Code | Status |
|---|---|
| `STVTERM_CODE` | ✓ Real column on STVTERM table |
| `STVTERM_DESC` | ✓ Real column |
| `STVTERM_START_DATE` | ✓ Real column |
| `STVTERM_END_DATE` | ✓ Real column |
| `STVTERM_ACYR_CODE` | ✓ Real column (academic-year code) |
| `STVTERM_FA_PROC_YR` | ✓ Plausible (FA processing year); verify exact column name vs. `STVTERM_FA_PROC_YR` |
| `STVTERM_POT_CODE` | ✗ Wrong — PoT records live on `SOBPTRM` table (one row per part-of-term), not as a column on `STVTERM`. The PoT code validation table is `STVPTRM`. `STVTERM_POT_CODE` doesn't exist. | HARD ERROR |
| `STVTERM_POT_CENSUS_IND` | ✗ Wrong — same issue. Census flag per PoT is a column on `SOBPTRM`, not on `STVTERM`. | HARD ERROR |
| `SFRRGCL_LEVL_CODE` | ✓ Plausible — `SFRRGCL` table column for level code in reg control. SQL in OC_DATA is consistent. |
| `STVTERM_HOUSING_IND` | ⚠ Unverified — housing activation may be via `SLBTERM`, not a flag on STVTERM. Needs verification. | FLAG |
| `STVTERM_FA_PROC_IND` | ⚠ Plausible but verify. Could be `STVTERM_FA_PROC_IND` or field on a related table. | FLAG |
| `STVTERM_CODE.format` | ⚠ Not a real column name — dot notation breaks the Banner column-name pattern. This is a meta/convention note. Should be labeled as such (e.g., label: "Term-code naming convention", fieldCode blank or a distinct meta-type). | SOFT FLAG |
| `AUTOPILOT_BASELINE` | ⚠ Not a Banner column — clearly a toolkit synthetic entry. Fine as UI, but should be visually differentiated from real Banner fields (e.g., a different row type or prefix). | SOFT FLAG |

**Hard errors: 2** (STVTERM_POT_CODE, STVTERM_POT_CENSUS_IND)  
**Soft flags: 4**

#### Proposed corrections for PoT fields:
```
// Replace STVTERM_POT_CODE with:
{ fieldCode: "SOBPTRM_PTRM_CODE", label: "Part-of-term code", ... }
// SOBPTRM_PTRM_CODE is the part-of-term code on the SOBPTRM record

// Replace STVTERM_POT_CENSUS_IND with:
{ fieldCode: "SOBPTRM_CENSUS_DATE", label: "Per-PoT census date", ... }
```

---

### DRCS (8 entries)

Overall framing is strong — consultant-voice, form-specific, binary-choice framed with downstream impact noted.

**One structural issue:**

- **DRC-4** (`FA proc-year offset`) is mapped to `RORPRIO` (OC-3.4.1, Award Priority Setup). However, the FA proc-year is a field on **SOATERM** (`STVTERM_FA_PROC_YR`). DRC-4 is a SOATERM decision, not an award-priority decision. The `ocCode`, `ocTitle`, and `ocSection` should reference SOATERM / OC-2.4.1 / `create` section.

**Minor framing notes:**
- DRC-5: "STVATTR — keep ATT-INTL and ATT-HONORS as NSU-intended customizations" reads more like an autopilot confirmation than a client decision. A real DRC needs a consequence statement: "If confirmed, baseline will be updated and drift will clear from autopilot; if not confirmed, these attributes will be removed, affecting ~14 courses tagged ATT-INTL."

All other DRC titles and summaries: **PASS**

---

### METHODOLOGY_PHASES

| Phase | Weeks | Assessment |
|---|---|---|
| Discover | Wk 0–4 (4 wks) | ✓ Tight but correct for Select; banner institutions have existing state |
| Design | Wk 4–10 (6 wks) | ✓ 3 BPs per area × 2 weeks = plausible |
| Build | Wk 10–22 (12 wks) | ✓ Main OC sprint cadence; 4×2wk = 8 sprints in 12 weeks feels right |
| Validate | Wk 22–28 (6 wks) | ✓ UAT + parallel + dress rehearsal; slightly compressed |
| Deploy | Wk 28–30 (2 wks) | ✓ Cutover weekend + day-1 + early stabilization |
| Stabilize | Wk 30–42 (12 wks) | ✓ 30/60/90 hypercare; 12 weeks matches standard hypercare + KT |

**Structural issue:** The phases describe a single ~10.5-month cycle (42 weeks). The NSU engagement has 4 sequential go-lives over 14 months (HR May '26, Finance Aug '26, Student P1 Nov '26, Student P2 Mar '27). The phase model doesn't show overlapping GL cycles. In reality, Build for GL-2 overlaps Validate for GL-1. This is architecturally missing but may be acceptable as a "generic engagement backbone" in the prototype.

**Rating: PASSES for generic illustration; add a note in the UI that phases repeat/overlap per go-live.**

---

### INNER_SOURCE (6 patterns)

| ID | Title | Assessment |
|---|---|---|
| is-1 | "NSU-Term-2025 · 4-PoT block layout" | ✓ Specific, sourced, reuse-count plausible |
| is-2 | "term-rollover.sh · idempotent year-roll" | ✓ Correct technical framing; "idempotent" is normal consultant/dev vocabulary |
| is-3 | "FA Award-Year DRC template" | ✓ Clear artifact type |
| is-4 | "Position-control hierarchy v3" | ✓ Versioned, validated against named count — authoritative |
| is-5 | "SOATERM · Gherkin acceptance pack" | ✓ Gherkin for Banner OCs is realistic; 62 criteria is a believable count |
| is-6 | "Vendor onboarding checklist" | ⚠ Two issues: (1) name is too generic vs. others; (2) contributor is Cara Stein (PM) — Finance patterns should be attributed to Raj Kapoor or a Finance consultant |

**Proposed fix for is-6:**
- Title: `"FTMVEND setup + 1099 readiness checklist"` (or `"AP vendor-class + 1099 readiness · 20-item pack"`)
- Contributor: `"Raj Kapoor"`, Engagement: `"TX State · Promoted Q4 2025"`

**Rating: 5/6 strong; is-6 needs a rewrite**

---

### FINDING_INDEX — Mapping Errors

Two entries have mismatched selectors and labels:

| Key | Problem |
|---|---|
| `STVMAJR` | `fieldSelector: "#fld-stvterm-housing"`, `label: "Housing-term flag"` — but STVMAJR is major codes, not housing. Field/label should reflect drift in major-code validation, not the housing flag. |
| `STVRESD` | `fieldSelector: "#fld-stvterm-fa"`, `label: "FA proc-year"` — but STVRESD is a residency validation table. Display-order column being unset has nothing to do with FA proc-year. |

These would be visible to a consultant clicking through to the OC from an Autopilot finding. **Hard errors.**

#### Proposed corrections:
```typescript
"STVMAJR": { oc: "soaterm", section: "downstream",  fieldSelector: null,  label: "Major code validation (STVMAJR)", text: "47 records drift..." },
"STVRESD": { oc: "spaiden", section: "overview",    fieldSelector: null,  label: "Residency code display order (STVRESD)", text: "Display-order column unset on 4 rows" },
```
Note: STVRESD drift is more naturally a SPAIDEN concern than SOATERM.

---

### DOCUMENTS & DOC_TREE

All document naming conventions read correctly:
- BP (Business Blueprint) ✓
- FS (Functional Specification) ✓ — some Ellucian practices use "FNS" but "FS" is widely accepted
- TS (Technical Specification) ✓
- TP (Test Plan) ✓
- Cutover Runbook ✓ — "Runbook" is standard
- Hypercare Playbook ✓ — Ellucian-idiomatic
- RAID Log ✓ — standard consulting artifact

No domain errors in document names.

---

### SPRINT NAMES

All four sprint names are plausible and Banner-domain-specific. **PASSES.**

---

## 2. Extraneous Content to Cull for Pilot

- **`STVTERM_CODE.format` and `AUTOPILOT_BASELINE`** in CONFIG_FIELDS_BY_OC: These are synthetic meta-entries. Either give them a distinct UI type (not rendered as field-code rows) or remove them. A consultant opening the config table will expect to see Banner column names, not meta-entries mixed in.
- **`wdintegr` in OC_INDEX for pilot**: The Workday integration is the most complex and least Banner-form-like OC. Remove from the pilot OC index or clearly label it as a custom integration (not a Banner form OC). Leaving it in the list suggests pilot can show Banner form-level detail for integrations, which it cannot.
- **FGRGL, FTVVEND (post-correction: FTMVEND), RORPRIO** stub OCs: Finance GL and FA are in early scoping. Including empty-state OCs for Finance/FA in the pilot OC index weakens the demo. For the pilot cut, either populate 2+ sections or remove from the index.

---

## 3. MVP Scope for Pilot

### Minimum believable OC_DATA population

| OC | Priority | Reason |
|---|---|---|
| **SOATERM** | ✓ Done | Full 6 sections + CONFIG_FIELDS; drives all reg conversations |
| **SFARCTL** (or corrected form name) | Must-have | DRC-3 is open, reg-windows directly linked; SOATERM's downstream form |
| **SPAIDEN** | Must-have | Active sprint, "in-progress" status, DRC-free but critical for demo flow |
| **NBAPOSN** (corrected from NBRPSN) | Should-have | HR goes live in 13 days; partner OC to PTREARN |
| **PTREARN** | Should-have | HR GL in 13 days; DRC-7 is open; earn-code walk is compelling |
| **STVATTR** | Could-have | Simple validation table; short OC body; demonstrates "simple OC" pattern |
| **SSASECT** | Could-have | Section build is high-activity in Sprint 1 |
| **SHACATQ** | Could-have | Low priority; only needed if catalog workflow is demoed |
| FGRGL, FTMVEND, RORPRIO | Remove from pilot index | Finance/FA not far enough in engagement |
| wdintegr | Remove or clearly differentiate | Not a Banner form OC; breaks the pilot pattern |

### Minimum CONFIG_FIELDS_BY_OC population

For SOATERM (done): fix the 2 hard errors (STVTERM_POT_CODE → SOBPTRM_PTRM_CODE, STVTERM_POT_CENSUS_IND → SOBPTRM_CENSUS_DATE).

For SFARCTL: 4–6 fields covering term_code, level_code, begin_date, end_date, priority_order.

For SPAIDEN: 5–7 fields covering name fields, SSN handling, birth date, citizenship, ID type.

Other OCs: empty-state is acceptable IF removed from pilot index; if shown, must have at least 3 fields per section.

### Critical DRCs for pilot authenticity

DRC-1 through DRC-7 are all plausible and well-framed. DRC-4's OC mapping must be corrected (to SOATERM, not RORPRIO). For a pilot demo, DRC-2 and DRC-3 (both open, blocking) are the most compelling to show in action.

---

## 4. Concrete Work Items

| Item | Severity | Size | Owner |
|---|---|---|---|
| Fix `NBRPSN → NBAPOSN` in OC_INDEX and all references | Hard error | S | lead-developer |
| Fix `FTVVEND → FTMVEND` in OC_INDEX, DRCS, DOCUMENTS, WORKSHOPS | Hard error | S | lead-developer |
| Fix `FINDING_INDEX` STVMAJR and STVRESD field selectors + labels | Hard error | S | lead-developer |
| Fix DRC-4 OC reference: change to SOATERM / OC-2.4.1 / create section | Hard error | S | lead-developer |
| Fix CONFIG_FIELDS STVTERM_POT_CODE → SOBPTRM_PTRM_CODE | Hard error | S | lead-developer |
| Fix CONFIG_FIELDS STVTERM_POT_CENSUS_IND → SOBPTRM_CENSUS_DATE | Hard error | S | lead-developer |
| Rewrite is-6 title + re-attribute contributor | Soft | S | lead-developer |
| Populate OC_DATA for SFARCTL (6-section body, ~4 config fields) | Must-have pilot content | L | methodology-guru authoring → lead-developer lands |
| Populate OC_DATA for SPAIDEN (6-section body, ~5 config fields) | Must-have pilot content | L | methodology-guru authoring → lead-developer lands |
| Populate OC_DATA for NBAPOSN (4-section body, ~4 config fields) | Should-have pilot content | M | methodology-guru authoring → lead-developer lands |
| Populate OC_DATA for PTREARN (4-section body, ~3 config fields) | Should-have pilot content | M | methodology-guru authoring → lead-developer lands |
| Remove or clearly-differentiate wdintegr from OC_INDEX pilot cut | Cull | S | lead-developer |
| Remove FGRGL, FTMVEND, RORPRIO from pilot OC_INDEX or keep as clearly-empty stubs | Cull | S | lead-developer |
| Add consequence clause to DRC-5 summary | Soft | S | lead-developer |
| Fix methodology phase note: clarify phases repeat/overlap per go-live | Soft | S | lead-developer / ux-visionary |
| Verify SFARCTL vs. SFARGFE (correct form for reg windows) | Verification | S | methodology-guru |
| Verify RORPRIO vs. RJRRULP (correct FA award priority form) | Verification | S | methodology-guru |
| Differentiate STVTERM_CODE.format + AUTOPILOT_BASELINE as meta-type in CONFIG_FIELDS | Soft | S | lead-developer |

---

## 5. Risks — Domain Credibility

1. **NBRPSN / FTVVEND hard errors**: If a Banner consultant opens the OC index and sees `NBRPSN` as a form name, they will immediately know it's a table name. Same with `FTVVEND`. These break trust fast.
2. **CONFIG_FIELDS PoT columns**: `STVTERM_POT_CODE` is definitively wrong — PoT records are a separate table (`SOBPTRM`). This is a visible column in the UI; a consultant who has configured SOATERM PoT will catch it immediately.
3. **FINDING_INDEX mismatches**: If the autopilot "Click to jump to field" navigation lands on the wrong form section, a consultant testing the tool will lose confidence in the whole Autopilot feature.
4. **11 empty OC stubs**: The most common pilot failure mode is showing a list of 12 OCs where 11 are empty. Pilot users will immediately click through all 12. Remove the empties before piloting.
5. **DRC-4 OC mismatch**: A consultant who knows Banner knows FA proc-year lives on SOATERM. Finding it mapped to the award-priority form is a non-sequitur.
6. **Methodology phase coverage gap**: If the pilot is with a consultant who just finished a 4-GL engagement, they will notice the single-cycle phase model doesn't show the overlapping GL cycle reality.

---

## 6. Open Questions for the User

1. **What is the pilot product target?** Banner only, or does the PORTFOLIO (which includes Lafayette College on Colleague) imply multi-product coverage? Colleague has completely different form names. If Colleague is in scope, OC data must be product-gated.
2. **Internal demo or real client?** If consultants are using this on a live engagement, the stub OCs (SFARCTL, SPAIDEN, NBAPOSN, PTREARN) must be populated with accurate content before the pilot date. If it's an internal demo to a steering committee, stubs can be left out of the index.
3. **Is HR Go-Live (May 24, 13 days out) the pilot anchor moment?** If yes, NBAPOSN and PTREARN content is urgently needed.
4. **Who authors the stub OC bodies?** This is M-L sized writing work per OC (form overview, field table, best practices, DRC callouts). Does the user want methodology-guru to draft these in-session?
5. **Is `SFARCTL` the intended form name, or should it be corrected to `SFARGFE` / `SFAREGQ`?** This needs a Banner-source verification before the OC body is written.
