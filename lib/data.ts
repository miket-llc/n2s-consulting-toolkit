// Mock data for the N2S Consulting Toolkit prototype.
// Ported verbatim from public/proto/data.js + data-extra.js — strings, ids,
// numbers preserved. Types are intentionally loose to keep churn low.

export type Member = {
  id: string;
  initials: string;
  name: string;
  role: string;
  color: string;
};

export const ENGAGEMENT = {
  id: "nsu",
  name: "Northern State University",
  product: "Banner SaaS",
  tier: "Select",
  phase: "Build · Sprint 1 of 4",
  members: [
    { id: "jh", initials: "JH", name: "Janet Hawkins", role: "Lead Consultant", color: "#3ecfff" },
    { id: "rk", initials: "RK", name: "Raj Kapoor", role: "Functional · Finance", color: "#b49cff" },
    { id: "mt", initials: "MT", name: "Marisol Tovar", role: "Functional · Student", color: "#3ee8a8" },
    { id: "dl", initials: "DL", name: "Derek Liu", role: "Technical · HR/Payroll", color: "#ffc94d" },
    { id: "cs", initials: "CS", name: "Cara Stein", role: "PM", color: "#ff86a8" },
    { id: "be", initials: "BE", name: "Ben Esposito", role: "Inner Source Lead", color: "#7be0c2" },
  ] as Member[],
};

export const GO_LIVES = [
  { id: "gl-hr",  product: "HR/Payroll",      label: "HR Go-Live",          date: "May 24, 2026", daysOut: 23,  readiness: 78, status: "on-track", scope: ["bc-hr-core", "bc-payroll"] },
  { id: "gl-fin", product: "Finance",         label: "Finance Go-Live",     date: "Aug 18, 2026", daysOut: 109, readiness: 22, status: "scoping",  scope: ["bc-gl", "bc-ap", "bc-ar"] },
  { id: "gl-s1",  product: "Student Phase 1", label: "Student Phase 1 GL",  date: "Nov 30, 2026", daysOut: 213, readiness: 41, status: "on-track", scope: ["bc-curriculum", "bc-records", "bc-faa"] },
  { id: "gl-s2",  product: "Student Phase 2", label: "Student Phase 2 GL",  date: "Mar 15, 2027", daysOut: 318, readiness: 8,  status: "at-risk",  scope: ["bc-billing", "bc-advising", "bc-housing"] },
];

export const SPRINTS = [
  { id: "s1", name: "Sprint 1 · Enrollment & Curriculum", status: "Active",  pct: 58, tasks: { done: 22, total: 38 } },
  { id: "s2", name: "Sprint 2 · Reg Windows & Section",   status: "Planned", pct: 0,  tasks: { done: 0, total: 0 } },
  { id: "s3", name: "Sprint 3 · HR Cutover Prep",         status: "Planned", pct: 0,  tasks: { done: 0, total: 0 } },
  { id: "s0", name: "Sprint 0 · Mobilization",            status: "Done",    pct: 100, tasks: { done: 28, total: 28 } },
];

export const ACTIVE_SPRINT = {
  ...SPRINTS[0],
  burndown: [38, 36, 33, 31, 28, 26, 24, 22],
};

export const BUSINESS_CAPABILITIES = [
  { id: "bc-curriculum", area: "Student", label: "Curriculum Management",     tagline: "Catalog, programs, courses, parts of term.", goLive: "Student P1", pct: 56, ocsDone: 14, ocsTotal: 25, bpCount: 6, status: "active",   sprint: "s1", activeOC: { id: "soaterm", label: "SOATERM · Term Code Configuration" } },
  { id: "bc-records",    area: "Student", label: "Student Records",           tagline: "Demographics, holds, attributes, cohorts.",   goLive: "Student P1", pct: 38, ocsDone: 10, ocsTotal: 26, bpCount: 7, status: "active",   sprint: "s1", activeOC: { id: "spaiden", label: "SPAIDEN · Person Identification" } },
  { id: "bc-faa",        area: "Student", label: "Financial Aid Admin",       tagline: "Award packaging, R2T4, ISIR ingest.",         goLive: "Student P1", pct: 12, ocsDone: 3,  ocsTotal: 25, bpCount: 5, status: "blocked",  sprint: "s2" },
  { id: "bc-billing",    area: "Student", label: "Student Billing",           tagline: "AR detail codes, refunds, payment plans.",    goLive: "Student P2", pct: 0,  ocsDone: 0,  ocsTotal: 22, bpCount: 5, status: "scoping",  sprint: "s3" },
  { id: "bc-advising",   area: "Student", label: "Advising",                  tagline: "DegreeWorks, advisor assignment, holds.",     goLive: "Student P2", pct: 0,  ocsDone: 0,  ocsTotal: 18, bpCount: 4, status: "scoping" },
  { id: "bc-housing",    area: "Student", label: "Housing & Residence",       tagline: "Room mapping, term activation, billing tie.", goLive: "Student P2", pct: 0,  ocsDone: 0,  ocsTotal: 14, bpCount: 3, status: "scoping" },
  { id: "bc-gl",         area: "Finance", label: "General Ledger",            tagline: "Chart of accounts, fund balance, periods.",   goLive: "Finance",    pct: 18, ocsDone: 5,  ocsTotal: 28, bpCount: 6, status: "active",   sprint: "s2" },
  { id: "bc-ap",         area: "Finance", label: "Accounts Payable",          tagline: "Vendor onboarding, invoice flow, 1099.",      goLive: "Finance",    pct: 8,  ocsDone: 2,  ocsTotal: 24, bpCount: 5, status: "active" },
  { id: "bc-ar",         area: "Finance", label: "AR & Collections",          tagline: "Detail codes, deposits, agency feeds.",       goLive: "Finance",    pct: 0,  ocsDone: 0,  ocsTotal: 19, bpCount: 4, status: "scoping" },
  { id: "bc-hr-core",    area: "HR",      label: "HR Core & Position",        tagline: "Employee classes, position control, ECLS.",   goLive: "HR/Payroll", pct: 92, ocsDone: 24, ocsTotal: 26, bpCount: 6, status: "active",   sprint: "s1" },
  { id: "bc-payroll",    area: "HR",      label: "Payroll",                   tagline: "Earn codes, tax setup, deductions, calc.",    goLive: "HR/Payroll", pct: 84, ocsDone: 22, ocsTotal: 26, bpCount: 5, status: "active" },
  { id: "bc-integrations", area: "Cross", label: "Integrations & Identity",   tagline: "Banner ↔ SSO, ELM, Workday, mid-tier APIs.",  goLive: "All",        pct: 64, ocsDone: 18, ocsTotal: 28, bpCount: 6, status: "active" },
];

export const TASKS = [
  { id: "t1",  jiraId: "NSU-184", project: "NSU",  capability: "BC-CURRICULUM", title: "Confirm part-of-term split for Fall 2026 with registrar",                  status: "In Progress", priority: "P1", due: "Today 5:00pm", dueRel: "today",     assignee: "jh", commentCount: 4, urgent: true,  lastSync: "2m ago", aiAssist: true },
  { id: "t2",  jiraId: "NSU-187", project: "NSU",  capability: "BC-RECORDS",    title: "Resolve DRC-3: graduate vs undergrad reg-window separation",                status: "In Progress", priority: "P1", due: "Today",        dueRel: "today",     assignee: "jh", commentCount: 7, urgent: true,  lastSync: "2m ago" },
  { id: "t3",  jiraId: "NSU-191", project: "NSU",  capability: "BC-CURRICULUM", title: "Generate test cases for SOATERM v3.2",                                      status: "Needs Review", priority: "P2", due: "Today",        dueRel: "today",     assignee: "jh", commentCount: 2, urgent: false, lastSync: "8m ago", aiAssist: true },
  { id: "t4",  jiraId: "NSU-156", project: "NSU",  capability: "BC-HR-CORE",    title: "Validate position-control hierarchy for HR cutover",                        status: "Ready",       priority: "P2", due: "Tomorrow",     dueRel: "tomorrow",  assignee: "dl", commentCount: 1, lastSync: "12m ago" },
  { id: "t5",  jiraId: "WIU-44",  project: "WIU",  capability: "BC-FAA",        title: "Review WIU R2T4 retro before applying to NSU",                              status: "Ready",       priority: "P3", due: "Tomorrow",     dueRel: "tomorrow",  assignee: "jh", commentCount: 0, lastSync: "1h ago" },
  { id: "t6",  jiraId: "NSU-168", project: "NSU",  capability: "BC-PAYROLL",    title: "Approve earn-code mapping draft from Derek",                                status: "Needs Review", priority: "P2", due: "Tomorrow",     dueRel: "tomorrow",  assignee: "jh", commentCount: 3, lastSync: "20m ago" },
  { id: "t7",  jiraId: "NSU-201", project: "NSU",  capability: "BC-CURRICULUM", title: "SSASECT priority-group conflicts — get registrar sign-off on 12 items",     status: "Backlog",     priority: "P2", due: "Fri",          dueRel: "this-week", assignee: "mt", commentCount: 0, lastSync: "1h ago" },
  { id: "t8",  jiraId: "NSU-203", project: "NSU",  capability: "BC-INTEGRATIONS", title: "Banner ↔ Workday: identity payload mapping spike",                       status: "Backlog",     priority: "P3", due: "Fri",          dueRel: "this-week", assignee: "be", commentCount: 1, lastSync: "1h ago" },
  { id: "t9",  jiraId: "CSU-12",  project: "CSU EB", capability: "BC-GL",       title: "CSU East Bay: end-of-month period-close test",                              status: "Done",        priority: "P3", due: "Mon",          dueRel: "this-week", assignee: "rk", commentCount: 2, lastSync: "1h ago" },
  { id: "t10", jiraId: "NSU-220", project: "NSU",  capability: "BC-AR",         title: "Define detail-code taxonomy for graduate fees",                             status: "Backlog",     priority: "P3", due: "Next week",    dueRel: "later",     assignee: "rk", commentCount: 0, lastSync: "1h ago" },
];

export const OC_DATA = {
  code: "OC-2.4.1",
  product: "Banner SaaS",
  title: "SOATERM · Term Code Configuration",
  summary: "Establish each academic term as a discrete code with full calendar, parts-of-term, registration windows, and downstream activation flags. SOATERM is foundational — every section, registration, billing rule, and FA award-year tie-in keys off it.",
  sections: [
    {
      id: "overview", num: "01", title: "Overview & decisions", complete: true,
      intro: "Term codes follow Banner's YYYYMM convention where MM encodes the season (10=Fall, 20=Spring, 30=Summer). Northern State University will continue using its long-standing 6-digit convention; reuse is preferred for FA history continuity. Two key decisions drive this OC: parts-of-term structure and registration-window separation.",
      callouts: [
        { kind: "best-practice", from: "Inner-source · 142 engagements", text: "Stick to YYYYMM unless the institution has a documented prefixing scheme. Custom term-code formats fragment integration tooling and break ~60% of pre-built reports." },
        { kind: "watchout", text: "Once SOATERM is saved with a term code, the code itself cannot be changed without a destructive migration. Treat term-code creation as a one-way door." },
      ],
    },
    {
      id: "create", num: "02", title: "Create the term code", complete: true,
      intro: "Open SOATERM in form mode. Enter the new term code (e.g. 202610 for Fall 2026), tab to begin a fresh record, and complete the basic identity fields before moving to calendar.",
      steps: [
        {
          num: 1, title: "Enter term identity",
          body: "Term description should be the canonical academic-calendar phrasing. The acad-year and FA proc-year are <em>almost always equal</em> but split intentionally for institutions whose FA cycle leads or lags.",
          fields: [
            { field: "STVTERM_CODE",       value: "202610",     why: "Convention: YYYYMM · Fall 2026" },
            { field: "STVTERM_DESC",       value: "Fall 2026",  why: "Shows on student record, transcripts" },
            { field: "STVTERM_START_DATE", value: "2026-08-24", why: "Class day 1 — drives census" },
            { field: "STVTERM_END_DATE",   value: "2026-12-18", why: "Last final, last billable day" },
            { field: "STVTERM_ACYR_CODE",  value: "2627",       why: "Academic year FY27" },
            { field: "STVTERM_FA_PROC_YR", value: "2627",       why: "Aligns with packaging cycle" },
          ],
        },
      ],
    },
    {
      id: "pot", num: "03", title: "Parts-of-term structure",
      intro: "Parts-of-term split the master term into mini-sessions with their own start/end dates, drop deadlines, and refund schedules. NSU has historically run a single full-term and a 1-week mini in January; a working group recommended adding a half-A / half-B split for online undergrad to align with peer institutions.",
      callouts: [
        { kind: "watchout", text: "Census date per part-of-term is independent of the master term census. If you forget to set per-PoT census, enrollment counts roll up only to the term-level census, which can mis-state IPEDS reporting." },
        { kind: "pattern", from: "NSU-Term-2025 inner source", text: "WIU and South Methodist both adopted a 4-PoT layout (Full / Half-A / Half-B / Late-start) and saw 22% drop in registration support tickets in the first year. Pattern is reusable here as 'pot-4-block-v2'." },
      ],
      steps: [
        {
          num: 2, title: "Add parts-of-term records",
          body: "Use the SOATERM Parts of Term tab. Each row needs a unique sub-code, start/end dates that fall <strong>within</strong> the master term's window, and a census date. Save after each row to surface validation errors before they cascade.",
          fields: [
            { field: "STVTERM_POT_CODE", value: "1",   why: "Standard full-term" },
            { field: "POT 1 · weeks",    value: "16",  why: "Aug 24 – Dec 18" },
            { field: "STVTERM_POT_CODE", value: "HA",  why: "Half-A mini-session" },
            { field: "POT HA · weeks",   value: "8",   why: "Aug 24 – Oct 17" },
            { field: "STVTERM_POT_CODE", value: "HB",  why: "Half-B mini-session" },
            { field: "POT HB · weeks",   value: "8",   why: "Oct 19 – Dec 18" },
          ],
        },
      ],
      tasks: [
        { id: "NSU-184", title: "Confirm PoT split for Fall 2026 with registrar", priority: "P1", due: "Today" },
      ],
    },
    {
      id: "reg-windows", num: "04", title: "Registration windows",
      intro: "Registration windows control when student cohorts can begin enrolling. Cohorts are typically priority-grouped (graduate, senior, junior, sophomore, freshman, non-degree) with staggered open dates. NSU is debating a single-window vs split UG/GR approach — DRC-3 is open.",
      steps: [
        {
          num: 3, title: "Configure window dates",
          body: "Build registration windows in SFARCTL after SOATERM is saved. For each cohort, set begin and end dates and the part-of-term they apply to. Sequence matters — Banner enforces the priority order at the cohort level.",
          code: `-- Inner-source: NSU-Term-2025 / reg-window-pattern
-- Generates SFARCTL records from a STVTERM input
INSERT INTO sfrrgcl (sfrrgcl_term_code, sfrrgcl_levl_code,
                    sfrrgcl_styp_code, sfrrgcl_begin_date,
                    sfrrgcl_end_date, sfrrgcl_pidm)
SELECT '202610', 'GR', NULL,
       TO_DATE('2026-04-01 09:00','YYYY-MM-DD HH24:MI'),
       TO_DATE('2026-08-23 23:59','YYYY-MM-DD HH24:MI'),
       NULL FROM dual;`,
          codeLang: "sql",
        },
      ],
      tasks: [
        { id: "NSU-187", title: "Resolve DRC-3: graduate vs undergrad window separation", priority: "P1", due: "Today" },
      ],
    },
    {
      id: "downstream", num: "05", title: "Downstream activation",
      intro: "SOATERM has 14 downstream system flags. Three matter most for go-live: housing-term flag (drives SLBRMAP), enrollment-counts flag (drives IPEDS), and FA proc-year (must equal acad-year unless cycle is offset).",
      callouts: [
        { kind: "best-practice", text: "Activate the housing-term flag last — only after housing assignments are confirmed. Activating it early opens room-billing detail codes prematurely." },
      ],
    },
    {
      id: "validation", num: "06", title: "Validation & sign-off",
      intro: "Run the autopilot baseline check after every save. Validation surfaces the exact rows that drift from the N2S baseline and the Inner-source pattern you've chosen. The OC is signed off only when all linked Jira tasks resolve and the registrar e-signs the calendar.",
    },
  ] as Array<{
    id: string;
    num: string;
    title: string;
    complete?: boolean;
    intro?: string;
    callouts?: Array<{ kind: string; from?: string; text: string }>;
    steps?: Array<{
      num: number;
      title: string;
      body?: string;
      fields?: Array<{ field: string; value: string; why: string }>;
      code?: string;
      codeLang?: string;
    }>;
    tasks?: Array<{ id: string; title: string; priority: string; due: string }>;
  }>,
};

export const AUTOPILOT_RUNS = [
  { id: "r284", build: 284, title: "SOATERM commit · 78f3a2c", trigger: "Janet H. saved SOATERM",      when: "8m ago",  duration: "47s",  status: "passed",  stages: [
    { label: "Pull config snapshot", state: "ok", dur: "11s", detail: "stage-nsu-svc · 1,847 records" },
    { label: "Compare to N2S baseline", state: "ok", dur: "8s", detail: "n2s-banner-saas-select v3.2" },
    { label: "Match inner-source patterns", state: "ok", dur: "5s", detail: "matched 4 of NSU-Term-2025" },
    { label: "Run linked test cases", state: "ok", dur: "21s", detail: "12 cases · 11 pass · 1 skip" },
    { label: "Publish report", state: "ok", dur: "2s", detail: "report posted to engagement feed" },
  ], findings: [
    { sev: "high", code: "DRC-2", text: "SOATERM 202610 part-of-term flag still NULL — DRC unresolved" },
    { sev: "med",  code: "STVMAJR", text: "47 records drift from baseline — 2 are NSU-specific majors (expected)" },
    { sev: "low",  code: "STVRESD", text: "Display-order column unset on 4 rows" },
  ]},
  { id: "r283", build: 283, title: "SFARCTL · scheduled nightly", trigger: "cron · 02:00",            when: "14h ago", duration: "1m 12s", status: "passed",  stages: [
    { label: "Pull config snapshot", state: "ok", dur: "12s", detail: "stage-nsu-svc · 1,841 records" },
    { label: "Compare to N2S baseline", state: "ok", dur: "9s", detail: "no drift" },
    { label: "Match inner-source patterns", state: "ok", dur: "6s", detail: "matched 3 patterns" },
    { label: "Run linked test cases", state: "ok", dur: "42s", detail: "14 cases · 14 pass" },
    { label: "Publish report", state: "ok", dur: "3s", detail: "report posted" },
  ], findings: [] },
  { id: "r282", build: 282, title: "SPAIDEN · Marisol commit",   trigger: "Marisol T. saved SPAIDEN", when: "Yesterday", duration: "33s", status: "warned",  stages: [
    { label: "Pull config snapshot", state: "ok", dur: "10s", detail: "stage-nsu-svc · 1,829 records" },
    { label: "Compare to N2S baseline", state: "warn", dur: "11s", detail: "3 drift items in STVATTR (review needed)" },
    { label: "Match inner-source patterns", state: "ok", dur: "5s", detail: "matched 2 patterns" },
    { label: "Run linked test cases", state: "warn", dur: "5s", detail: "8 pass · 1 fail · 1 skip" },
    { label: "Publish report", state: "ok", dur: "2s", detail: "report posted" },
  ], findings: [
    { sev: "med", code: "STVATTR", text: "3 drift items detected — verify they are NSU-intended customizations" },
    { sev: "low", code: "TC-7",   text: "test case TC-7 failed: birth-date-redaction in legacy export" },
  ]},
  { id: "r281", build: 281, title: "Engagement baseline rebuild", trigger: "Manual · Janet H.",       when: "2d ago",   duration: "3m 04s", status: "passed",  stages: [
    { label: "Pull config snapshot", state: "ok", dur: "14s", detail: "full snapshot · 1,824 records" },
    { label: "Compare to N2S baseline", state: "ok", dur: "44s", detail: "drift recorded as new baseline" },
    { label: "Match inner-source patterns", state: "ok", dur: "12s", detail: "matched 18 patterns" },
    { label: "Run linked test cases", state: "ok", dur: "1m 51s", detail: "82 cases · 78 pass · 4 skip" },
    { label: "Publish report", state: "ok", dur: "3s", detail: "report posted" },
  ], findings: [] },
  { id: "r280", build: 280, title: "SHACATQ · Catalog import",    trigger: "Marisol T. saved SHACATQ", when: "3d ago",   duration: "29s", status: "failed", stages: [
    { label: "Pull config snapshot", state: "ok", dur: "8s", detail: "stage-nsu-svc · 1,820 records" },
    { label: "Compare to N2S baseline", state: "fail", dur: "12s", detail: "course-attribute STVATTR refs missing" },
    { label: "Match inner-source patterns", state: "skip", dur: "0s", detail: "skipped — baseline failed" },
    { label: "Run linked test cases", state: "skip", dur: "0s", detail: "skipped" },
    { label: "Publish report", state: "ok", dur: "9s", detail: "report posted" },
  ], findings: [
    { sev: "high", code: "STVATTR", text: "Course attributes ATT-INTL and ATT-HONORS referenced but not defined" },
  ]},
];

export const SPRINT_PLAN_BACKLOG = [
  { id: "NSU-204", rank: 1,  cap: "BC-CURRICULUM", title: "SSASECT — section build automation for fall priority groups",        h: 14, priority: "P1", reason: "blocks Student P1 GL · 213d" },
  { id: "NSU-208", rank: 2,  cap: "BC-RECORDS",    title: "Cohort assignment job — graduate students by program",                h: 8,  priority: "P1", reason: "blocks Student P1 GL" },
  { id: "NSU-211", rank: 3,  cap: "BC-INTEGRATIONS", title: "Workday → Banner identity payload — first 3 mappings",              h: 16, priority: "P1", reason: "Workday team waiting" },
  { id: "NSU-213", rank: 4,  cap: "BC-HR-CORE",    title: "Position-control hierarchy validation pass 2",                         h: 12, priority: "P2", reason: "HR GL in 23d" },
  { id: "NSU-215", rank: 5,  cap: "BC-PAYROLL",    title: "Earn-code mapping — graduate-assistant variants",                      h: 6,  priority: "P2", reason: "HR GL · DL ready" },
  { id: "NSU-217", rank: 6,  cap: "BC-CURRICULUM", title: "STVATTR cleanup — 47 drift items review",                              h: 4,  priority: "P3", reason: "found in autopilot run #284" },
  { id: "NSU-219", rank: 7,  cap: "BC-FAA",        title: "ISIR ingest pilot — 100 record dry-run",                               h: 18, priority: "P2", reason: "FAA blocked · unblocks DRC" },
  { id: "NSU-221", rank: 8,  cap: "BC-GL",         title: "Chart of accounts — sub-account reconciliation",                       h: 20, priority: "P2", reason: "Finance GL · 109d" },
  { id: "NSU-187", rank: 9,  cap: "BC-RECORDS",    title: "DRC-3: GR vs UG window separation — convene client",                   h: 6,  priority: "P1", reason: "AT-RISK · drop suggested" },
  { id: "NSU-225", rank: 10, cap: "BC-CURRICULUM", title: "SHACATQ catalog refresh after STVATTR fix",                            h: 6,  priority: "P3", reason: "depends on NSU-217" },
];

export const INNER_SOURCE = [
  { id: "is-1", kind: "Pattern",  title: "NSU-Term-2025 · 4-PoT block layout",          desc: "Reusable parts-of-term structure (Full / Half-A / Half-B / Late-start) with census-date templates and refund schedules pre-tuned. Originally promoted from WIU 2024 retro.", tags: ["soaterm", "parts-of-term", "registrar"], stars: 84, used: 32, contributor: "Ben Esposito",   engagement: "WIU · Promoted Q4 2024" },
  { id: "is-2", kind: "Script",   title: "term-rollover.sh · idempotent year-roll",     desc: "Shell + SQL bundle that rolls forward STVTERM, SFARCTL, parts-of-term, and registration-window cohorts in one run. Idempotent — safe to re-run.",                              tags: ["banner", "shell", "rollover"],            stars: 142, used: 67, contributor: "Marisol Tovar",  engagement: "NSU · Active" },
  { id: "is-3", kind: "DRC",      title: "FA Award-Year DRC template",                  desc: "Pre-filled decision-required-from-client template for institutions whose FA processing year leads or lags acad-year. Used in 11 engagements, 100% acceptance.",                tags: ["faa", "drc", "template"],                 stars: 56,  used: 28, contributor: "Raj Kapoor",     engagement: "CSU EB · Promoted 2025" },
  { id: "is-4", kind: "Pattern",  title: "Position-control hierarchy v3",               desc: "Banner HR position-control structure adapted for SaaS Select tier — position-class and ECLS combinations validated against 18 institutions.",                                tags: ["hr", "position-control", "ecls"],         stars: 71,  used: 41, contributor: "Derek Liu",      engagement: "Multiple · Q1 2026" },
  { id: "is-5", kind: "Test pack", title: "SOATERM · Gherkin acceptance pack",          desc: "62 Gherkin-style acceptance criteria for term setup including edge cases (concurrent terms, summer minis, fiscal-year crossover). Drop-in for any Banner Select.",            tags: ["soaterm", "test", "gherkin"],             stars: 109, used: 54, contributor: "Janet Hawkins",  engagement: "NSU · In progress" },
  { id: "is-6", kind: "Pattern",  title: "Vendor onboarding checklist",                 desc: "20-item AP onboarding checklist with Banner-specific vendor-class mapping and 1099 readiness. Promoted from Texas State 2025.",                                              tags: ["ap", "vendor", "1099"],                   stars: 38,  used: 19, contributor: "Cara Stein",     engagement: "TX State · Promoted 2025" },
];

export const PORTFOLIO = [
  { id: "p1",  name: "Northern State University",         product: "Banner SaaS",  tier: "Select",     phase: "Build",   nextGL: "May 24",  readiness: 78, sprint: "S1 · D4/10", health: "green" },
  { id: "p2",  name: "Western Illinois University",       product: "Banner SaaS",  tier: "Select",     phase: "Stabilize", nextGL: "Aug 1",  readiness: 92, sprint: "S6 · D7/10", health: "green" },
  { id: "p3",  name: "CSU East Bay",                      product: "Banner SaaS",  tier: "Essentials", phase: "Build",   nextGL: "Jun 15",  readiness: 41, sprint: "S3 · D2/10", health: "amber" },
  { id: "p4",  name: "Southwest Methodist",               product: "Banner SaaS",  tier: "Advantage",  phase: "Discover", nextGL: "Sep 30", readiness: 18, sprint: "S0 · plan",  health: "green" },
  { id: "p5",  name: "University of Vermont",             product: "Banner SaaS",  tier: "Select",     phase: "Build",   nextGL: "Jun 1",   readiness: 36, sprint: "S2 · D8/10", health: "amber" },
  { id: "p6",  name: "Brewer College",                    product: "Colleague",    tier: "Select",     phase: "Build",   nextGL: "Jul 20",  readiness: 64, sprint: "S4 · D3/10", health: "green" },
  { id: "p7",  name: "St. Augustine State",               product: "Banner SaaS",  tier: "Essentials", phase: "Stabilize", nextGL: "May 10", readiness: 88, sprint: "S5 · D9/10", health: "green" },
  { id: "p8",  name: "Coastline Community College",       product: "Banner SaaS",  tier: "Select",     phase: "Build",   nextGL: "Aug 25",  readiness: 52, sprint: "S2 · D5/10", health: "green" },
];

// ── data-extra ─────────────────────────────────────────────────────────────

export const DOC_TREE = [
  { id: "f-charters", label: "Charters", count: 4 },
  { id: "f-sows", label: "Statements of Work", count: 6 },
  { id: "f-bp", label: "Business Blueprints", count: 14 },
  { id: "f-fns", label: "Functional Specs", count: 28 },
  { id: "f-tch", label: "Technical Specs", count: 19 },
  { id: "f-test", label: "Test Plans", count: 11 },
  { id: "f-cut", label: "Cutover", count: 7 },
  { id: "f-hyp", label: "Hypercare", count: 3 },
  { id: "f-meet", label: "Meeting Notes", count: 47 },
  { id: "f-raid", label: "RAID Log", count: 1 },
];

export const DOCUMENTS = [
  { id: "d1",  folder: "f-charters", name: "NSU · Engagement Charter v3.docx",                type: "docx", owner: "cs", oc: null,         sprint: "—",  status: "approved",   modified: "Apr 18", aiSummary: "Banner SaaS Select tier · 4 go-lives · 14-month engagement window · Janet Hawkins lead consultant.", phase: "discover" },
  { id: "d2",  folder: "f-sows",     name: "SOW · Build Phase Statement of Work.pdf",         type: "pdf",  owner: "cs", oc: null,         sprint: "—",  status: "approved",   modified: "Mar 02", aiSummary: "$3.2M fixed-fee build phase · 4 sprints · Sprint 0 mobilization through Sprint 3 cutover prep.", phase: "discover" },
  { id: "d3",  folder: "f-bp",       name: "BP · Curriculum Management Blueprint.docx",       type: "docx", owner: "mt", oc: "soaterm",     sprint: "S1", status: "in-review",  modified: "8m ago", aiSummary: "16 OCs scoped including SOATERM, SCACRSE, SHACATQ. Calls out 4-PoT block layout from Inner Source.", phase: "design", aiGenerated: true },
  { id: "d4",  folder: "f-bp",       name: "BP · Student Records Blueprint.docx",             type: "docx", owner: "jh", oc: "spaiden",    sprint: "S1", status: "in-review",  modified: "1h ago", aiSummary: "Demographics, holds, attributes, cohorts. Open question on graduate cohort separation drives DRC-3.", phase: "design", aiGenerated: true },
  { id: "d5",  folder: "f-bp",       name: "BP · HR Core & Position Blueprint.docx",          type: "docx", owner: "dl", oc: null,         sprint: "S1", status: "approved",   modified: "Apr 22", aiSummary: "Position-control hierarchy v3 from Inner Source applied. ECLS combinations validated.", phase: "design", aiGenerated: true },
  { id: "d6",  folder: "f-fns",      name: "FS · SOATERM Term Code Configuration.md",         type: "md",   owner: "jh", oc: "soaterm",     sprint: "S1", status: "approved",   modified: "2h ago", aiSummary: "Mirrors OC-2.4.1. YYYYMM convention, 4-PoT split, registration window logic.", phase: "build" },
  { id: "d7",  folder: "f-fns",      name: "FS · SFARCTL Registration Windows.md",            type: "md",   owner: "mt", oc: null,         sprint: "S1", status: "draft",      modified: "Apr 28", aiSummary: "Cohort-based windows with priority-group ordering. DRC-3 blocking finalization.", phase: "build" },
  { id: "d8",  folder: "f-fns",      name: "FS · STVATTR Course Attributes.md",               type: "md",   owner: "mt", oc: null,         sprint: "S2", status: "draft",      modified: "Apr 14", aiSummary: "47 drift items in baseline; 2 are NSU-intended (ATT-INTL, ATT-HONORS).", phase: "build" },
  { id: "d9",  folder: "f-tch",      name: "TS · Banner ↔ Workday Identity Mapping.md",       type: "md",   owner: "be", oc: null,         sprint: "S2", status: "in-review",  modified: "Apr 25", aiSummary: "Mid-tier API contract for identity payload, 14 attributes, OAuth2 client-credentials.", phase: "build" },
  { id: "d10", folder: "f-tch",      name: "TS · ELM ↔ Banner Course Catalog Sync.md",        type: "md",   owner: "be", oc: null,         sprint: "S2", status: "draft",      modified: "Apr 21", aiSummary: "Nightly batch · IPEDS-aligned course attributes mapped from ELM payload.", phase: "build" },
  { id: "d11", folder: "f-test",     name: "TP · Curriculum Test Plan v2.xlsx",               type: "xlsx", owner: "jh", oc: "soaterm",     sprint: "S1", status: "in-review",  modified: "12m ago", aiSummary: "62 acceptance criteria from SOATERM Inner Source Gherkin pack + 18 NSU-specific cases.", phase: "validate", aiGenerated: true },
  { id: "d12", folder: "f-test",     name: "TP · HR Cutover Test Plan.xlsx",                  type: "xlsx", owner: "dl", oc: null,         sprint: "S3", status: "draft",      modified: "Apr 19", aiSummary: "Position-control validation, payroll calc dry-run, retro pay scenarios.", phase: "validate" },
  { id: "d13", folder: "f-cut",      name: "Cutover · HR Go-Live Runbook.docx",               type: "docx", owner: "dl", oc: null,         sprint: "S3", status: "draft",      modified: "Apr 30", aiSummary: "May 22-24 weekend window. 38 steps, 14h estimated. Last revised after position-control v3 retro.", phase: "deploy" },
  { id: "d14", folder: "f-hyp",      name: "Hypercare · Stabilization Playbook.docx",         type: "docx", owner: "cs", oc: null,         sprint: "—",  status: "draft",      modified: "Apr 10", aiSummary: "30/60/90-day post-GL response model. Severity tiers, escalation paths, knowledge transfer.", phase: "stabilize" },
  { id: "d15", folder: "f-meet",     name: "Registrar workshop · 2026-04-30.md",              type: "md",   owner: "jh", oc: "soaterm",     sprint: "S1", status: "approved",   modified: "Yesterday", aiSummary: "Confirmed 4-PoT split. Open: GR vs UG window separation, escalated as DRC-3.", phase: "build", aiGenerated: true },
  { id: "d16", folder: "f-raid",     name: "NSU RAID Log (live).xlsx",                        type: "xlsx", owner: "cs", oc: null,         sprint: "—",  status: "in-review",  modified: "5m ago", aiSummary: "8 risks open · 3 high. 12 issues · 2 escalated. 4 DRCs unresolved. 14 dependencies tracked.", phase: "all" },
];

export const METHODOLOGY_PHASES = [
  { id: "discover",  label: "Discover",   weeks: "Wk 0–4",   color: "#3ecfff", desc: "Charter, scope, governance, current-state lens." },
  { id: "design",    label: "Design",     weeks: "Wk 4–10",  color: "#b49cff", desc: "Business blueprints, capability mapping, fit-gap." },
  { id: "build",     label: "Build",      weeks: "Wk 10–22", color: "#a855f7", desc: "Configuration, integration, conversions, OCs." },
  { id: "validate",  label: "Validate",   weeks: "Wk 22–28", color: "#ffc94d", desc: "UAT, parallel runs, sign-offs, cutover dress rehearsals." },
  { id: "deploy",    label: "Deploy",     weeks: "Wk 28–30", color: "#3ee8a8", desc: "Cutover weekend, go-live, day-1 stabilization." },
  { id: "stabilize", label: "Stabilize",  weeks: "Wk 30–42", color: "#7be0c2", desc: "Hypercare, knowledge transfer, retro & promotion." },
];

export const METHODOLOGY_CARDS = [
  { id: "m1",  phase: "discover", kind: "Artifact",  title: "Engagement Charter",                  desc: "Two-page scope/sponsor/objectives charter ratified by exec sponsor and consulting principal at kickoff.",         when: "Day 1–10", linked: ["Charter template", "Sponsor RACI", "Decision log starter"] },
  { id: "m2",  phase: "discover", kind: "Ceremony",  title: "Capability Discovery Workshop",       desc: "1-day per business area workshop (Finance / HR / Student) to map current vs target capabilities.",                 when: "Wk 1–3",  linked: ["Capability map template", "Workshop agenda"] },
  { id: "m3",  phase: "discover", kind: "RACI",      title: "Governance & Steering RACI",          desc: "Roles for steering committee, working groups, change-control board, and consulting team responsibilities.",         when: "Wk 0–2",  linked: ["RACI matrix", "Steering pack"] },
  { id: "m4",  phase: "discover", kind: "Gate",      title: "Build Readiness Gate",                desc: "Exit-Discover gate. Charter signed, governance live, baseline RAID, sprint-0 mobilization staffed.",                when: "End wk 4", linked: ["Gate checklist"] },
  { id: "m5",  phase: "design",   kind: "Artifact",  title: "Business Blueprint",                  desc: "Per-capability blueprint capturing in-scope OCs, decisions, integration touch-points, and reporting needs.",          when: "Wk 4–10", linked: ["Blueprint template", "OC scoping checklist"] },
  { id: "m6",  phase: "design",   kind: "Ceremony",  title: "Fit-Gap Sessions",                    desc: "Workshops per BP to confirm baseline matches institution practice; flag gaps as DRCs or change requests.",          when: "Wk 5–9",  linked: ["Fit-gap log", "DRC template"] },
  { id: "m7",  phase: "design",   kind: "Gate",      title: "Design Approval Gate",                desc: "All blueprints signed; OC list locked; integration contracts agreed with counterparty teams.",                      when: "End wk 10", linked: ["Sign-off package"] },
  { id: "m8",  phase: "build",    kind: "Artifact",  title: "Operational Component (OC)",          desc: "Per-form / per-config configuration guide. Lives in the Pathfinder. Drives Configuration Autopilot baseline.",       when: "Wk 10–22", linked: ["OC template", "Pathfinder index"] },
  { id: "m9",  phase: "build",    kind: "Ceremony",  title: "Sprint Cadence",                      desc: "2-week sprints. Sprint planning, mid-sprint sync, demo, retro. Backlog refined weekly with capability owners.",       when: "Bi-weekly", linked: ["Sprint plan template", "Retro guide"] },
  { id: "m10", phase: "build",    kind: "RACI",      title: "Configuration RACI",                  desc: "Who configures, who reviews, who signs off per OC. Default A=consultant, R=client functional, C=tech, I=PM.",         when: "Per OC",  linked: ["Per-OC RACI"] },
  { id: "m11", phase: "validate", kind: "Artifact",  title: "Test Plan",                            desc: "Capability-level test plan with cases drawn from Inner Source Gherkin packs + institution-specific scenarios.",      when: "Wk 22–28", linked: ["Test plan template", "Gherkin packs"] },
  { id: "m12", phase: "validate", kind: "Ceremony",  title: "UAT Cycle",                            desc: "Two-week UAT with named client testers per capability. Defect triage daily; entry/exit criteria gated.",          when: "Wk 24–26", linked: ["UAT charter", "Defect taxonomy"] },
  { id: "m13", phase: "validate", kind: "Gate",      title: "Cutover Readiness Gate",               desc: "All test cases pass or have approved waivers; cutover runbook rehearsed; rollback plan validated.",                when: "End wk 28", linked: ["Gate checklist"] },
  { id: "m14", phase: "deploy",   kind: "Artifact",  title: "Cutover Runbook",                     desc: "Hour-by-hour script for the cutover weekend. Parallel-tracked across functional, technical, and infra streams.",     when: "Wk 28",   linked: ["Runbook template", "Comms cadence"] },
  { id: "m15", phase: "deploy",   kind: "Ceremony",  title: "Go-Live War Room",                    desc: "Cutover weekend bridge. Hourly status, decision log, rollback decision points, exec broadcast cadence.",           when: "GL weekend", linked: ["War-room script"] },
  { id: "m16", phase: "stabilize", kind: "Artifact", title: "Hypercare Playbook",                  desc: "30/60/90-day stabilization model. Severity tiers, escalation paths, daily-then-weekly cadence to client BAU.",      when: "Wk 30–42", linked: ["Hypercare playbook"] },
  { id: "m17", phase: "stabilize", kind: "Ceremony", title: "Go-Live Retro & Promotion",           desc: "Run a retro inside two weeks of stabilization. Promote reusable patterns to Inner Source.",                       when: "Wk 32",   linked: ["Retro guide", "Promotion checklist"] },
];

export const SMART_QUEUE = [
  { id: "sq1",  task: "t1",  rank: 1, score: 98, project: "Northern State",  reasons: ["blocks HR GL · 23d", "registrar waiting", "P1"] },
  { id: "sq2",  task: "t2",  rank: 2, score: 96, project: "Northern State",  reasons: ["blocks Student P1 GL", "DRC unresolved · 4d", "3 dependents"] },
  { id: "sq3",  task: "t6",  rank: 3, score: 88, project: "Northern State",  reasons: ["payroll cutover · 23d", "Derek waiting on review"] },
  { id: "sq4",  task: "t3",  rank: 4, score: 82, project: "Northern State",  reasons: ["AI-drafted · ready to review", "test coverage gap"] },
  { id: "sq5",  task: "t5",  rank: 5, score: 74, project: "WIU",             reasons: ["FA cycle starts in 3d", "WIU retro applies"] },
  { id: "sq6",  task: "t4",  rank: 6, score: 71, project: "Northern State",  reasons: ["HR GL · 23d", "Derek owns"] },
  { id: "sq7",  task: "t7",  rank: 7, score: 58, project: "Northern State",  reasons: ["12 priority-group conflicts · planning input"] },
  { id: "sq8",  task: "t8",  rank: 8, score: 51, project: "Northern State",  reasons: ["Workday team request", "spike · low risk"] },
  { id: "sq9",  task: "t10", rank: 9, score: 32, project: "Northern State",  reasons: ["Finance GL · 109d", "no dependents"] },
];

export const OC_INDEX = [
  { id: "soaterm",  cap: "BC-CURRICULUM",   product: "Banner SaaS", code: "OC-2.4.1", title: "SOATERM · Term Code Configuration",       owner: "jh", status: "in-progress", updated: "12m ago", linkedTasks: 2 },
  { id: "spaiden",  cap: "BC-RECORDS",      product: "Banner SaaS", code: "OC-3.1.1", title: "SPAIDEN · Person Identification",          owner: "jh", status: "in-progress", updated: "1h ago",  linkedTasks: 1 },
  { id: "sfarctl",  cap: "BC-CURRICULUM",   product: "Banner SaaS", code: "OC-2.4.2", title: "SFARCTL · Registration Window Control",    owner: "mt", status: "draft",       updated: "Yesterday", linkedTasks: 1 },
  { id: "shacatq",  cap: "BC-CURRICULUM",   product: "Banner SaaS", code: "OC-2.4.3", title: "SHACATQ · Catalog Course Query",           owner: "mt", status: "in-review",   updated: "3d ago",  linkedTasks: 0 },
  { id: "ssasect",  cap: "BC-CURRICULUM",   product: "Banner SaaS", code: "OC-2.4.4", title: "SSASECT · Section Build & Cross-list",     owner: "mt", status: "draft",       updated: "Apr 28",  linkedTasks: 1 },
  { id: "stvattr",  cap: "BC-CURRICULUM",   product: "Banner SaaS", code: "OC-2.4.5", title: "STVATTR · Course Attributes",              owner: "mt", status: "approved",    updated: "Apr 22",  linkedTasks: 0 },
  { id: "shrnpsn",  cap: "BC-HR-CORE",      product: "Banner SaaS", code: "OC-5.1.2", title: "NBRPSN · Position Definition",             owner: "dl", status: "approved",    updated: "Apr 18",  linkedTasks: 0 },
  { id: "ptrearn",  cap: "BC-PAYROLL",      product: "Banner SaaS", code: "OC-5.2.1", title: "PTREARN · Earn Code Setup",                owner: "dl", status: "in-review",   updated: "20m ago", linkedTasks: 1 },
  { id: "fgrgl",    cap: "BC-GL",           product: "Banner SaaS", code: "OC-4.1.1", title: "FGRGL · GL Account Structure",             owner: "rk", status: "draft",       updated: "Apr 25",  linkedTasks: 0 },
  { id: "ftvvend",  cap: "BC-AP",           product: "Banner SaaS", code: "OC-4.2.1", title: "FTVVEND · Vendor Onboarding",              owner: "rk", status: "draft",       updated: "Apr 20",  linkedTasks: 0 },
  { id: "rorprio",  cap: "BC-FAA",          product: "Banner SaaS", code: "OC-3.4.1", title: "RORPRIO · Award Priority Setup",           owner: "rk", status: "draft",       updated: "Apr 24",  linkedTasks: 1 },
  { id: "wdintegr", cap: "BC-INTEGRATIONS", product: "Banner SaaS", code: "OC-9.1.1", title: "Banner ↔ Workday Identity Bridge",         owner: "be", status: "draft",       updated: "Apr 25",  linkedTasks: 1 },
];
