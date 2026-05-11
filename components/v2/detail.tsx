"use client";

// ============================================================================
// Toolkit v2 — Capability detail + Configuration guide.
// Two surfaces, one schema. Both reuse v2 shell vocabulary (v2-row, v2-cap-card,
// pill, t-eyebrow, t-mono). Hash routes:
//   #capabilities/<capId>
//   #guides/<ocId>
// Ships against the canonical brief in scratch/capability-and-guide-brief.md.
// ============================================================================

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Icon } from "./icons";
import { useApp, useHash, PageHero, Section, notImplemented } from "./shell";
import {
  BUSINESS_CAPABILITIES, TASKS, DRCS, GO_LIVES, WORKSHOPS,
  INNER_SOURCE, OC_INDEX, OC_DATA,
  CONFIG_FIELDS_BY_OC,
} from "@/lib/data";
import type { ConfigField } from "@/lib/data";

// ── Local types ──────────────────────────────────────────────────────────────

type DrcData = {
  id?: string;
  code: string;
  title: string;
  ocCode?: string;
  ocSection?: string;
  daysStale?: number;
  blockedCount?: number;
  ownerName?: string;
  severity?: string;
  dueBy?: string;
  status?: string;
  summary?: string;
  recommendation?: string;
  overrideCost?: string;
  blastRadius?: string;
  signedBy?: { name: string; role: string; at: string; note?: string };
  hash?: string;
  resolution?: string;
  resolutionReason?: string;
  capabilityId?: string;
  capabilityLabel?: string;
  capability?: string;
  cap?: string;
  ocId?: string;
  oc?: string;
};

type TaskData = {
  id: string;
  jiraId: string;
  title: string;
  status: string;
  priority: string;
  due: string;
  urgent?: boolean;
  commentCount?: number;
  assignee?: string;
  dueRel?: string;
  capability?: string;
};

type OcEntry = {
  id: string;
  code: string;
  title: string;
  cap: string;
  status: string;
  updated: string;
  owner: string;
  openDrcs?: number;
};

type ActivityItem = {
  id: string;
  kind: string;
  ts: string;
  actor: string;
  text: string;
};

type DetailData = {
  clientOwnerName: string;
  consultantOwnerName: string;
  consultantInitials: string;
  deliveryStage: string;
  hoursPlan: number;
  hoursSpent: number;
  xlsxRows: string[];
  innerSourcePatternIds: string[];
  recentActivity: ActivityItem[];
};

type BudgetCell = { kind: string; role: string; hPlan: number; hSpent: number; yn: string };
type BudgetRow = { ocCode: string; ocId: string; ocLabel: string; cells: BudgetCell[] };

type StepField = { field: string; value: string; why: string };
type StepTask = { id: string; title: string; priority: string; due: string };
type Callout = { kind: string; from?: string; text: string };
type StepData = {
  num: number;
  title: string;
  body?: string;
  fields?: StepField[];
  code?: string;
  codeLang?: string;
  tasks?: StepTask[];
};
type GuideSection = {
  id: string;
  num: string;
  title: string;
  complete?: boolean;
  intro?: string;
  callouts?: Callout[];
  steps?: StepData[];
  tasks?: StepTask[];
};

type AIDraftData = { kind: "tests" | "drc" | "explain"; section: string };

type CapData = typeof BUSINESS_CAPABILITIES[number];

// ────────────────────────────────────────────────────────────────────────────
// Synthesized side-data — additive, brief-spec types collapsed inline.
// In production these live alongside data.ts. Kept here so the drop is a
// single self-contained file the port team can split later.
// ────────────────────────────────────────────────────────────────────────────
const DETAIL_BY_CAP: Record<string, DetailData> = {
  "bc-curriculum": {
    clientOwnerName: "C. Reyes (Registrar)",
    consultantOwnerName: "Janet Hawkins",
    consultantInitials: "JH",
    deliveryStage: "validate",
    hoursPlan: 612, hoursSpent: 348,
    xlsxRows: ["NN-S0-CUR-3", "NN-CORE-CUR-1", "NN-CORE-CUR-2"],
    innerSourcePatternIds: ["is-1", "is-5", "is-2"],
    recentActivity: [
      { id: "a1", kind: "drift",   ts: "8m ago",    actor: "system",    text: "Autopilot run #284 — 1 high (DRC-2 unresolved), 47 STVMAJR drift items" },
      { id: "a2", kind: "drc",     ts: "2h ago",    actor: "C. Reyes",  text: "DRC-2 moved to waiting-on-client — registrar wants pre-read by Thu" },
      { id: "a3", kind: "task",    ts: "Yesterday", actor: "Janet H.",  text: "NSU-191 — Generate test cases for SOATERM v3.2 (Needs Review)" },
      { id: "a4", kind: "doc",     ts: "Yesterday", actor: "Janet H.",  text: "Workshop pre-read uploaded — PoT scenarios with peer benchmarks" },
      { id: "a5", kind: "signoff", ts: "2d ago",    actor: "client",    text: "DRC-1 signed by C. Reyes — STVTERM convention confirmed (YYYYMM)" },
    ],
  },
  "bc-records": {
    clientOwnerName: "M. Wynn (Registrar Ops)",
    consultantOwnerName: "Marisol Tovar",
    consultantInitials: "MT",
    deliveryStage: "configure",
    hoursPlan: 540, hoursSpent: 188,
    xlsxRows: ["NN-CORE-REC-1", "NN-CORE-REC-2"],
    innerSourcePatternIds: ["is-2"],
    recentActivity: [],
  },
};

// ── 4-task budget pattern (formal NN plan) ────────────────────────────────
const BUDGET_BY_CAP: Record<string, BudgetRow[]> = {
  "bc-curriculum": [
    { ocCode: "OC-2.4.1", ocId: "soaterm",  ocLabel: "SOATERM · Term Code Configuration",
      cells: [
        { kind: "config",   role: "Functional",     hPlan: 32, hSpent: 28, yn: "Y" },
        { kind: "validate", role: "Lead Consultant", hPlan: 18, hSpent: 12, yn: "Y" },
        { kind: "insights", role: "Technical",       hPlan: 10, hSpent: 0,  yn: "—" },
        { kind: "exp-card", role: "Lead Consultant", hPlan: 8,  hSpent: 0,  yn: "N" },
      ] },
    { ocCode: "OC-2.4.2", ocId: "sfarctl",  ocLabel: "SFARCTL · Registration Windows",
      cells: [
        { kind: "config",   role: "Functional",     hPlan: 28, hSpent: 14, yn: "—" },
        { kind: "validate", role: "Lead Consultant", hPlan: 16, hSpent: 4,  yn: "—" },
        { kind: "insights", role: "Technical",       hPlan: 10, hSpent: 0,  yn: "—" },
        { kind: "exp-card", role: "Lead Consultant", hPlan: 8,  hSpent: 0,  yn: "—" },
      ] },
    { ocCode: "OC-2.5.1", ocId: "ssasect",  ocLabel: "SSASECT · Section Build",
      cells: [
        { kind: "config",   role: "Functional",     hPlan: 64, hSpent: 30, yn: "—" },
        { kind: "validate", role: "Lead Consultant", hPlan: 24, hSpent: 8,  yn: "—" },
        { kind: "insights", role: "Technical",       hPlan: 18, hSpent: 0,  yn: "—" },
        { kind: "exp-card", role: "Lead Consultant", hPlan: 12, hSpent: 0,  yn: "—" },
      ] },
    { ocCode: "OC-2.5.2", ocId: "shacatq",  ocLabel: "SHACATQ · Catalog Hierarchy",
      cells: [
        { kind: "config",   role: "Functional",     hPlan: 24, hSpent: 12, yn: "—" },
        { kind: "validate", role: "Lead Consultant", hPlan: 12, hSpent: 0,  yn: "—" },
        { kind: "insights", role: "Technical",       hPlan: 8,  hSpent: 0,  yn: "—" },
        { kind: "exp-card", role: "Lead Consultant", hPlan: 6,  hSpent: 0,  yn: "—" },
      ] },
  ],
};

const KIND_LABEL: Record<string, string> = {
  "config":   "Banner Config & Training",
  "validate": "BPS Validation",
  "insights": "Insights Reports",
  "exp-card": "Experience Card",
};

// ── OC index extended for Capability cards ──────────────────────────────────
const OC_INDEX_FALLBACK: OcEntry[] = [
  { id: "soaterm", code: "OC-2.4.1", title: "SOATERM · Term Code Configuration",   cap: "bc-curriculum", status: "in-review",   updated: "8m ago",    owner: "JH", openDrcs: 2 },
  { id: "sfarctl", code: "OC-2.4.2", title: "SFARCTL · Registration Windows",      cap: "bc-curriculum", status: "in-progress", updated: "2h ago",    owner: "JH", openDrcs: 1 },
  { id: "ssasect", code: "OC-2.5.1", title: "SSASECT · Section Build",             cap: "bc-curriculum", status: "in-progress", updated: "Yesterday", owner: "MT", openDrcs: 0 },
  { id: "shacatq", code: "OC-2.5.2", title: "SHACATQ · Catalog Hierarchy",         cap: "bc-curriculum", status: "in-progress", updated: "3d ago",    owner: "MT", openDrcs: 1 },
  { id: "stvattr", code: "OC-2.5.3", title: "STVATTR · Course Attributes",         cap: "bc-curriculum", status: "approved",    updated: "1w ago",    owner: "MT", openDrcs: 0 },
  { id: "spaiden", code: "OC-3.1.1", title: "SPAIDEN · Person Identification",     cap: "bc-records",    status: "in-progress", updated: "Yesterday", owner: "MT", openDrcs: 0 },
];

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

const ocIndex = (): OcEntry[] =>
  (OC_INDEX && OC_INDEX.length ? OC_INDEX : OC_INDEX_FALLBACK) as OcEntry[];

const drcsForCap = (capId: string): DrcData[] => {
  const all = DRCS as DrcData[];
  const code = capId.replace(/^bc-/, "").toUpperCase();
  return all.filter(d =>
    (d.capabilityId === capId) ||
    (d.capabilityLabel || "").toLowerCase().includes(capId.replace(/^bc-/, "").replace(/-/g, " ")) ||
    (d.capability || "").toUpperCase() === code ||
    (d.cap || "").toUpperCase() === code
  );
};

const drcsForOc = (ocId: string): DrcData[] =>
  (DRCS as DrcData[]).filter(d =>
    (d.ocId === ocId) || (d.oc === ocId) ||
    (d.ocCode || "").toLowerCase() === ocId
  );

const tasksForCap = (capId: string): TaskData[] => {
  const code = capId.replace(/^bc-/, "").toUpperCase();
  return (TASKS as TaskData[]).filter(t =>
    (t.capability || "").toUpperCase() === "BC-" + code ||
    (t.capability || "").toUpperCase() === code
  );
};

const goLiveForCap = (cap: CapData) => {
  const gls = GO_LIVES;
  return gls.find(gl => (gl.scope || []).includes(cap.id))
    || gls.find(gl => (gl.label || "").toLowerCase().includes((cap.goLive || "").toLowerCase().split(" ")[0]));
};

// ────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ────────────────────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = 22, title }: {
  initials: string; color?: string; size?: number; title?: string;
}) {
  return (
    <span title={title} style={{
      display: "inline-grid", placeItems: "center",
      width: size, height: size, borderRadius: "50%",
      background: color || "var(--accent-dim)", color: "var(--accent)",
      fontSize: 10, fontWeight: 700, letterSpacing: 0.04, flexShrink: 0,
    }}>{initials}</span>
  );
}

const SegTabs = ({ tabs, value, onChange }: {
  tabs: Array<{ id: string; label: string; count?: number }>;
  value: string;
  onChange: (id: string) => void;
}) => (
  <div className="d-segtabs">
    {tabs.map(t => (
      <button key={t.id}
        className={`d-segtab ${value === t.id ? "is-active" : ""}`}
        onClick={() => onChange(t.id)}>
        <span>{t.label}</span>
        {t.count != null && <span className="d-segtab-count">{t.count}</span>}
      </button>
    ))}
  </div>
);

const Toast = ({ msg }: { msg: string | null }) =>
  msg ? <div className="d-toast" role="status">{msg}</div> : null;

function useToast(): [string | null, (s: string) => void] {
  const [m, setM] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = (s: string) => {
    setM(s);
    if (t.current !== null) clearTimeout(t.current);
    t.current = setTimeout(() => setM(null), 2400);
  };
  return [m, show];
}

// ── Status pill helpers ───────────────────────────────────────────────────
const drcSeverityTone = (sev?: string) =>
  sev === "high" ? "rose" : sev === "med" ? "amber" : "neutral";

const ocStatusTone = (s: string) =>
  s === "approved"    ? { tone: "emerald", label: "Approved" } :
  s === "in-review"   ? { tone: "amber",   label: "In review" } :
  s === "in-progress" ? { tone: "neutral", label: "In progress" } :
  { tone: "neutral", label: s };

const taskStatusTone = (s: string) =>
  s === "Done"         ? "emerald" :
  s === "Needs Review" ? "amber" :
  s === "In Progress"  ? "accent" : "neutral";

// ────────────────────────────────────────────────────────────────────────────
// Inline task editor — row-expand (no modal). Auto-saves on blur.
// ────────────────────────────────────────────────────────────────────────────
function InlineTaskRow({ task, onSaved, dense }: {
  task: TaskData;
  onSaved?: (t: TaskData) => void;
  dense?: boolean;
}) {
  void dense;
  const [open, setOpen] = useState(false);
  const [t, setT] = useState<TaskData>(task);
  const STATUSES = ["Backlog", "Ready", "In Progress", "Needs Review", "Done"];
  const PRIORITIES = ["P1", "P2", "P3"];

  const persist = (patch: Partial<TaskData>) => {
    const next = { ...t, ...patch };
    setT(next);
    onSaved && onSaved(next);
  };

  return (
    <div className={`d-task ${open ? "is-open" : ""}`}>
      <button className="d-task-row" onClick={() => setOpen(o => !o)}>
        <span className={`v2-row-marker ${t.urgent ? "rose" : t.status === "Needs Review" ? "amber" : "accent"}`}/>
        <div style={{ minWidth: 0 }}>
          <div className="v2-row-title">{t.title}</div>
          <div className="v2-row-sub">
            <span className="t-mono">{t.jiraId}</span>
            <span> · </span>
            <span>{t.priority}</span>
            <span> · </span>
            <span>{t.status}</span>
            {(t.commentCount ?? 0) > 0 && (
              <><span> · </span><span>{t.commentCount} comment{t.commentCount === 1 ? "" : "s"}</span></>
            )}
          </div>
        </div>
        <span className={`pill pill-${taskStatusTone(t.status)}`}>{t.status}</span>
        <span className="v2-row-meta">{t.due}</span>
        <Icon name={open ? "chevron-down" : "chevron-right"} size={14} style={{ color: "var(--text-ghost)" }}/>
      </button>
      {open && (
        <div className="d-task-edit">
          <div className="d-task-grid">
            <label className="d-field">
              <span className="d-field-label">Title</span>
              <input className="d-input" defaultValue={t.title}
                onBlur={(e) => persist({ title: e.target.value })}/>
            </label>
            <label className="d-field">
              <span className="d-field-label">Status</span>
              <select className="d-input" value={t.status} onChange={(e) => persist({ status: e.target.value })}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="d-field">
              <span className="d-field-label">Priority</span>
              <select className="d-input" value={t.priority} onChange={(e) => persist({ priority: e.target.value })}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label className="d-field">
              <span className="d-field-label">Assignee</span>
              <select className="d-input" defaultValue={t.assignee || "jh"} onBlur={(e) => persist({ assignee: e.target.value })}>
                <option value="jh">Janet Hawkins (JH)</option>
                <option value="mt">Marisol Tovar (MT)</option>
                <option value="dl">Derek Liu (DL)</option>
                <option value="rk">Raj Kapoor (RK)</option>
                <option value="be">Ben Esposito (BE)</option>
              </select>
            </label>
            <label className="d-field">
              <span className="d-field-label">Due</span>
              <input className="d-input" defaultValue={t.due} onBlur={(e) => persist({ due: e.target.value })}/>
            </label>
            <div className="d-field">
              <span className="d-field-label">Source</span>
              <div className="d-source">
                <span className="t-mono">{t.jiraId}</span>
                <button className="btn btn-ghost btn-sm d-kebab" title="Open in Jira (reference only)">
                  <Icon name="more" size={14}/>
                </button>
              </div>
            </div>
          </div>
          <div className="d-comments">
            <div className="t-eyebrow">Comments · {t.commentCount || 0}</div>
            {(t.commentCount || 0) > 0 && (
              <div className="d-comment">
                <Avatar initials="CR" size={20} color="var(--cyan-dim)"/>
                <div>
                  <div className="d-comment-head"><strong>C. Reyes</strong> <span className="t-mono">2h ago</span></div>
                  <div className="d-comment-body">"Working group is leaning 4-PoT. Let's confirm Thursday."</div>
                </div>
              </div>
            )}
            <div className="d-comment-compose">
              <Avatar initials="JH" size={20}/>
              <input className="d-input" placeholder="Reply…"/>
              <button className="btn btn-ghost btn-sm">Send</button>
            </div>
          </div>
          <div className="d-task-foot t-meta">Auto-saves on blur · changes mirror to {t.jiraId} as reference only.</div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// DRC sign-off — inline lifecycle. Draft → propose → sign-off → resolved.
// ────────────────────────────────────────────────────────────────────────────
function DrcSignoffPanel({ drc, onResolved, onClose, toast }: {
  drc: DrcData;
  onResolved?: (d: DrcData) => void;
  onClose?: () => void;
  toast?: (s: string) => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState(drc.ownerName || "");
  const [note, setNote] = useState("");
  const [resolution, setResolution] = useState("accepted");
  const [reason, setReason] = useState("");
  const canSign = name.trim().length > 1 && (resolution !== "overridden" || reason.trim().length > 3);

  const sign = () => {
    if (!canSign) return;
    const hash = "0x" + Math.random().toString(16).slice(2, 10);
    const resolved: DrcData = {
      ...drc,
      status: "resolved",
      resolution,
      resolutionReason: resolution === "overridden" ? reason : undefined,
      signedBy: { name, role, at: "Just now", note },
      hash,
    };
    onResolved && onResolved(resolved);
    toast && toast(`${drc.code} signed off — recorded in-toolkit (hash ${hash})`);
    onClose && onClose();
  };

  return (
    <div className="d-sign">
      <div className="d-sign-head">
        <div>
          <div className="t-eyebrow">Capture sign-off · in-toolkit</div>
          <div className="d-sign-title">{drc.title}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
      </div>

      <div className="d-sign-grid">
        <label className="d-field">
          <span className="d-field-label">Resolution</span>
          <div className="d-segchip">
            {[
              { id: "accepted",  label: "Accept as recommended" },
              { id: "overridden", label: "Override" },
              { id: "deferred",  label: "Defer" },
            ].map(o => (
              <button key={o.id}
                className={`d-segchip-opt ${resolution === o.id ? "is-on" : ""}`}
                onClick={() => setResolution(o.id)}>{o.label}</button>
            ))}
          </div>
        </label>

        {resolution === "overridden" && (
          <label className="d-field d-field-wide">
            <span className="d-field-label">Override reason <span className="t-rose">required</span></span>
            <textarea className="d-input" rows={2} value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="Why are we overriding the recommendation? Estimated schedule impact?"/>
          </label>
        )}

        <label className="d-field">
          <span className="d-field-label">Signer name</span>
          <input className="d-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="C. Reyes"/>
        </label>
        <label className="d-field">
          <span className="d-field-label">Role</span>
          <input className="d-input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Registrar"/>
        </label>
        <label className="d-field d-field-wide">
          <span className="d-field-label">Note <span className="t-muted">optional</span></span>
          <input className="d-input" value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Confirmed 4-PoT split for Fall 2026 — see workshop minutes."/>
        </label>
      </div>

      <div className="d-sign-foot">
        <span className="t-meta">No DocuSign, no email round-trip. Sign-off is captured here with a tamper-evident hash and stamped onto the OC section.</span>
        <div className="row gap-2">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" disabled={!canSign} onClick={sign}>
            <Icon name="check" size={13}/>
            <span>Confirm sign-off</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// DRC row — collapsed/expanded states. Drives the loop inline.
// ────────────────────────────────────────────────────────────────────────────
function DrcRow({ drc, onResolved, toast, defaultOpen }: {
  drc: DrcData;
  onResolved?: (d: DrcData) => void;
  toast?: (s: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const [signing, setSigning] = useState(false);
  const tone = drcSeverityTone(drc.severity);
  const lifecycle = ["draft", "proposed", "in-discussion", "waiting-on-client", "sign-off", "resolved"];
  const stageIdx = Math.max(0, lifecycle.indexOf(drc.status || "proposed"));

  return (
    <div className={`d-drc ${open ? "is-open" : ""}`}>
      <button className="d-drc-row" onClick={() => setOpen(o => !o)}>
        <span className="v2-dec-num">{drc.code}</span>
        <div style={{ minWidth: 0 }}>
          <div className="v2-row-title">{drc.title}</div>
          <div className="v2-row-sub">
            <span>{drc.ocCode || drc.ocSection || "OC ref"}</span>
            <span> · </span>
            <span>{(drc.daysStale || 0)}d open</span>
            <span> · </span>
            <span>blocks {drc.blockedCount || 0}</span>
            <span> · </span>
            <span>Owner: {drc.ownerName || "client"}</span>
          </div>
        </div>
        <span className={`pill pill-${tone}`}>{drc.severity || "med"}</span>
        <span className="v2-row-meta">Due {drc.dueBy || "—"}</span>
        <Icon name={open ? "chevron-down" : "chevron-right"} size={14} style={{ color: "var(--text-ghost)" }}/>
      </button>

      {open && (
        <div className="d-drc-body">
          <div className="d-drc-life">
            {lifecycle.map((s, i) => (
              <div key={s} className={`d-drc-step ${i <= stageIdx ? "is-done" : ""} ${i === stageIdx ? "is-now" : ""}`}>
                <span className="d-drc-stepdot"/>
                <span className="d-drc-steplabel">{s.replace(/-/g, " ")}</span>
              </div>
            ))}
          </div>

          <div className="d-drc-slots">
            <div>
              <div className="t-eyebrow">What we recommend</div>
              <p className="t-body-sm">{drc.recommendation || drc.summary || "Adopt the 4-part-of-term layout (Full / Half-A / Half-B / Late-start) used in 32 prior engagements."}</p>
            </div>
            <div>
              <div className="t-eyebrow">What overriding would cost</div>
              <p className="t-body-sm">{drc.overrideCost || "Custom PoT structure breaks ~60% of pre-built reports and forces a non-pattern SFARCTL config; +12h technical effort and +1 sprint of regression."}</p>
            </div>
            <div>
              <div className="t-eyebrow">Blast radius if delayed</div>
              <p className="t-body-sm">{drc.blastRadius || `${drc.blockedCount || 7} downstream tasks blocked. SFARCTL window config can't proceed; Fall registration timeline at risk.`}</p>
            </div>
          </div>

          {drc.status === "resolved" ? (
            <div className="d-drc-resolved">
              <Icon name="check" size={14}/>
              <span>Decision made — signed by <strong>{drc.signedBy?.name}</strong> ({drc.signedBy?.role}) {drc.signedBy?.at}. Hash <span className="t-mono">{drc.hash}</span>.</span>
            </div>
          ) : signing ? (
            <DrcSignoffPanel
              drc={drc}
              onResolved={(d) => onResolved && onResolved(d)}
              onClose={() => setSigning(false)}
              toast={toast}
            />
          ) : (
            <div className="d-drc-actions">
              <button className="btn btn-secondary btn-sm">
                <Icon name="users" size={13}/>
                <span>Move to discussion</span>
              </button>
              <button className="btn btn-secondary btn-sm">
                <Icon name="clock" size={13}/>
                <span>Wait on client</span>
              </button>
              <div className="flex-1"/>
              <span className="t-meta">Cross-ref: {drc.code} · in-toolkit only</span>
              <button className="btn btn-primary btn-sm" onClick={() => setSigning(true)}>
                <Icon name="check" size={13}/>
                <span>Capture sign-off</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Right-rail card primitive — used by both surfaces.
// ────────────────────────────────────────────────────────────────────────────
const RailCard = ({ eyebrow, title, action, children, accent }: {
  eyebrow: string;
  title?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  accent?: boolean;
}) => (
  <section className={`d-rail-card ${accent ? "is-accent" : ""}`}>
    <header className="d-rail-cardhead">
      <div>
        <div className="t-eyebrow">{eyebrow}</div>
        {title && <div className="d-rail-cardtitle">{title}</div>}
      </div>
      {action}
    </header>
    <div className="d-rail-cardbody">{children}</div>
  </section>
);

// ════════════════════════════════════════════════════════════════════════════
// CAPABILITY DETAIL  ·  #capabilities/<capId>
// ════════════════════════════════════════════════════════════════════════════
export function CapabilityDetailPage({ capId }: { capId: string }) {
  const [, navigate] = useHash();
  const cap = BUSINESS_CAPABILITIES.find(c => c.id === capId);

  // All hooks must run before any conditional return.
  const detail: DetailData = DETAIL_BY_CAP[capId] ?? {
    clientOwnerName: "—", consultantOwnerName: "—", consultantInitials: "??",
    deliveryStage: "configure", hoursPlan: 0, hoursSpent: 0,
    xlsxRows: [], innerSourcePatternIds: [], recentActivity: [],
  };

  const allDrcs = drcsForCap(capId);
  const [drcs, setDrcs] = useState<DrcData[]>(allDrcs);
  const [toastMsg, showToast] = useToast();

  const tabKey = `v2.capability.${capId}.tab`;
  const [tab, setTabState] = useState<string>(() => {
    try { return localStorage.getItem(tabKey) || "delivery"; } catch { return "delivery"; }
  });

  // Redirect on bad id.
  useEffect(() => {
    if (!cap) {
      notImplemented(`Unknown capability "${capId}" — back to capabilities`);
      window.location.hash = "capabilities";
    }
  }, [capId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!cap) return null;

  // Derived (no more hooks past this point).
  const setTab = (id: string) => {
    setTabState(id);
    try { localStorage.setItem(tabKey, id); } catch { /* noop */ }
  };

  const gl = goLiveForCap(cap);
  const allOcs = ocIndex().filter(o => o.cap.toLowerCase() === capId.toLowerCase());
  const allTasks = tasksForCap(capId);
  const sprintTasks = allTasks.filter(t =>
    t.dueRel === "today" || t.dueRel === "tomorrow" || t.dueRel === "this-week"
  ).slice(0, 3);
  const openDrcs = drcs.filter(d => d.status !== "resolved");

  const workshops = WORKSHOPS.filter(w =>
    (w.scope?.ocs || []).some(oid => allOcs.some(o => o.id === oid))
  );
  const innerSrc = INNER_SOURCE.filter(p => detail.innerSourcePatternIds.includes(p.id));

  const onDrcResolved = (next: DrcData) => {
    setDrcs(prev => prev.map(d => d.code === next.code ? next : d));
  };

  const burnPct = detail.hoursPlan ? Math.round((detail.hoursSpent / detail.hoursPlan) * 100) : 0;
  const burnTone = burnPct > 95 ? "rose" : burnPct > 80 ? "amber" : "emerald";
  const loopOrder = ["configure", "validate", "demo", "signed-off"];

  return (
    <>
      <Toast msg={toastMsg}/>

      <PageHero
        eyebrow={`Capability · ${cap.area} · Tied to ${cap.goLive}`}
        headline={cap.label}
        sub={cap.tagline}
        actions={(
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("capabilities")}>
              <Icon name="chevron-right" size={13} style={{ transform: "rotate(180deg)" }}/>
              <span>Capabilities</span>
            </button>
            <button className="btn btn-secondary btn-sm">
              <Icon name="schedule" size={13}/>
              <span>Schedule a workshop</span>
            </button>
            {cap.activeOC && (
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`guides/${cap.activeOC?.id}`)}>
                <Icon name="guides" size={13}/>
                <span>Open active OC</span>
              </button>
            )}
          </>
        )}
      />

      {/* Hero metrics row */}
      <div className="d-metrics">
        <div className="d-metric">
          <div className="t-eyebrow">Configuration</div>
          <div className="d-metric-v">{cap.pct}<small>%</small></div>
          <div className="d-metric-bar"><div className="d-metric-bar-fill" style={{ width: `${cap.pct}%` }}/></div>
        </div>
        <div className="d-metric">
          <div className="t-eyebrow">OCs in scope</div>
          <div className="d-metric-v">{cap.ocsDone}<small>/{cap.ocsTotal}</small></div>
          <div className="d-metric-sub">{cap.ocsTotal - cap.ocsDone} remaining</div>
        </div>
        <div className="d-metric">
          <div className="t-eyebrow">Open decisions</div>
          <div className={`d-metric-v ${openDrcs.length ? "tone-amber" : "tone-emerald"}`}>{openDrcs.length}</div>
          <div className="d-metric-sub">{openDrcs.filter(d => (d.daysStale || 0) >= 5).length} stuck 5+ days</div>
        </div>
        <div className="d-metric">
          <div className="t-eyebrow">Days to {gl?.product || cap.goLive}</div>
          <div className="d-metric-v">{gl?.daysOut ?? "—"}</div>
          <div className="d-metric-sub">{gl?.date || "TBD"}</div>
        </div>
        <div className="d-metric">
          <div className="t-eyebrow">Loop</div>
          <div className="d-loop">
            {loopOrder.map((s, i) => (
              <span key={s}
                className={`d-loop-step ${loopOrder.indexOf(detail.deliveryStage) >= i ? "is-done" : ""} ${detail.deliveryStage === s ? "is-now" : ""}`}
                title={s}>
                {s === "configure" ? "Cfg" : s === "validate" ? "Val" : s === "demo" ? "Demo" : "✓"}
              </span>
            ))}
          </div>
          <div className="d-metric-sub">configure → validate → demo</div>
        </div>
      </div>

      {/* Tabs */}
      <SegTabs
        tabs={[
          { id: "delivery",  label: "Delivery" },
          { id: "decisions", label: "Decisions", count: openDrcs.length },
          { id: "budget",    label: "Budget" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {/* Two-column layout: main + rail */}
      <div className="d-twocol">
        <div className="d-main">
          {tab === "delivery" && (
            <DeliveryTab
              cap={cap} ocs={allOcs}
              sprintTasks={sprintTasks}
              drcs={openDrcs.slice(0, 3)}
              activity={detail.recentActivity}
              navigate={navigate}
              onDrcResolved={onDrcResolved}
              toast={showToast}
            />
          )}
          {tab === "decisions" && (
            <DecisionsTab drcs={drcs} onResolved={onDrcResolved} toast={showToast}/>
          )}
          {tab === "budget" && (
            <BudgetTab capId={capId} detail={detail}/>
          )}
        </div>

        <aside className="d-rail">
          <RailCard eyebrow="Capability at a glance" title={cap.label}>
            <div className="d-glance">
              <div className="d-glance-bar">
                <div className="d-glance-bar-fill" style={{ width: `${cap.pct}%` }}/>
              </div>
              <div className="d-glance-row"><span className="t-muted">OCs</span><span className="t-mono">{cap.ocsDone}/{cap.ocsTotal}</span></div>
              <div className="d-glance-row"><span className="t-muted">Best practices</span><span className="t-mono">{cap.bpCount}</span></div>
              <div className="d-glance-row"><span className="t-muted">Status</span><span className="pill pill-neutral">{cap.status}</span></div>
              <div className="d-glance-row"><span className="t-muted">Client owner</span><span>{detail.clientOwnerName}</span></div>
              <div className="d-glance-row">
                <span className="t-muted">Consultant</span>
                <span className="row gap-2 items-center">
                  <Avatar initials={detail.consultantInitials} size={18}/>
                  <span>{detail.consultantOwnerName}</span>
                </span>
              </div>
            </div>
          </RailCard>

          {gl && (
            <RailCard eyebrow="Next milestone" title={gl.label}>
              <div className="d-glance-row"><span className="t-muted">Date</span><span className="t-mono">{gl.date}</span></div>
              <div className="d-glance-row"><span className="t-muted">In</span><span className="t-mono">{gl.daysOut} days</span></div>
              <div className="d-glance-row"><span className="t-muted">Readiness</span><span className="t-mono">{gl.readiness}%</span></div>
              <div className="d-glance-row">
                <span className="t-muted">Status</span>
                <span className={`pill pill-${gl.status === "at-risk" ? "rose" : gl.status === "scoping" ? "amber" : "emerald"}`}>
                  {gl.status === "on-track" ? "On track" : gl.status === "at-risk" ? "At risk" : "Scoping"}
                </span>
              </div>
              {workshops[0] && (
                <div className="d-rail-link">
                  <Icon name="workshops" size={12}/>
                  <span>{workshops[0].title} · {workshops[0].when}</span>
                </div>
              )}
            </RailCard>
          )}

          <RailCard eyebrow="Hours" title="Burn vs plan"
            action={<button className="btn btn-link" onClick={() => setTab("budget")}>Budget tab →</button>}>
            <div className="d-burn">
              <div className="d-burn-bar">
                <div className={`d-burn-bar-fill tone-${burnTone}`} style={{ width: `${Math.min(burnPct, 100)}%` }}/>
              </div>
              <div className="d-burn-row">
                <span className="t-mono">{detail.hoursSpent}<span className="t-muted">/{detail.hoursPlan}h</span></span>
                <span className={`t-${burnTone}`}>{burnPct}% used</span>
              </div>
              <div className="t-meta">{cap.pct}% configured · {burnPct - cap.pct > 0 ? `+${burnPct - cap.pct}pt over plan` : `${cap.pct - burnPct}pt under plan`}</div>
            </div>
          </RailCard>

          {workshops.length > 0 && (
            <RailCard eyebrow="Linked workshops">
              <div className="stack gap-2">
                {workshops.slice(0, 3).map(w => (
                  <button key={w.id} className="d-rail-row">
                    <Icon name="workshops" size={12} style={{ color: "var(--cyan)" }}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="d-rail-row-title">{w.title}</div>
                      <div className="t-meta">{w.when} · {w.location}</div>
                    </div>
                  </button>
                ))}
              </div>
            </RailCard>
          )}

          {innerSrc.length > 0 && (
            <RailCard eyebrow="Inner-source patterns">
              <div className="stack gap-2">
                {innerSrc.slice(0, 3).map(p => (
                  <div key={p.id} className="d-rail-row">
                    <Icon name="spark" size={12} style={{ color: "var(--accent)" }}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="d-rail-row-title">{p.title}</div>
                      <div className="t-meta">{p.kind} · {p.used} engagements · {p.stars}★</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="t-meta" style={{ marginTop: 8 }}>Context, not a CTA. Apply from the guide.</div>
            </RailCard>
          )}
        </aside>
      </div>
    </>
  );
}

// ── Delivery tab ───────────────────────────────────────────────────────────
function DeliveryTab({ cap, ocs, sprintTasks, drcs, activity, navigate, onDrcResolved, toast }: {
  cap: CapData;
  ocs: OcEntry[];
  sprintTasks: TaskData[];
  drcs: DrcData[];
  activity: ActivityItem[];
  navigate: (h: string) => void;
  onDrcResolved: (d: DrcData) => void;
  toast: (s: string) => void;
}) {
  void cap;
  return (
    <>
      <Section
        eyebrow="This sprint"
        title={`${sprintTasks.length} task${sprintTasks.length === 1 ? "" : "s"} for this capability`}
        action={<button className="btn btn-link" onClick={() => navigate("mywork")}>See all sprint tasks →</button>}>
        <div className="d-tasklist">
          {sprintTasks.length === 0 ? (
            <div className="d-empty">No sprint tasks scoped to this capability.</div>
          ) : sprintTasks.map(t => (
            <InlineTaskRow key={t.id} task={t}/>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Configurations in flight"
        title={`${ocs.length} OC${ocs.length === 1 ? "" : "s"} in scope`}>
        <div className="v2-cap-grid d-occgrid">
          {ocs.map(oc => {
            const s = ocStatusTone(oc.status);
            return (
              <button key={oc.id} className="v2-cap-card d-occ" onClick={() => navigate(`guides/${oc.id}`)}>
                <div className="v2-cap-head">
                  <span className="v2-cap-name">{oc.title}</span>
                  <span className="v2-cap-area">{oc.code}</span>
                </div>
                <div className="d-occ-meta">
                  <span className={`pill pill-${s.tone}`}>{s.label}</span>
                  {(oc.openDrcs ?? 0) > 0 && <span className="pill pill-amber">{oc.openDrcs} DRC</span>}
                  <span className="t-meta">Updated {oc.updated}</span>
                </div>
                <div className="v2-cap-foot">
                  <span>Owner: {oc.owner}</span>
                  <span>Open guide →</span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section
        eyebrow="Decisions blocking us"
        title={`Top ${drcs.length} open`}>
        <div className="d-drclist">
          {drcs.length === 0 ? (
            <div className="d-empty d-empty-good">
              <Icon name="check" size={14}/>
              <span>No decisions blocking this capability.</span>
            </div>
          ) : drcs.map(d => (
            <DrcRow key={d.code} drc={d} onResolved={onDrcResolved} toast={toast}/>
          ))}
        </div>
      </Section>

      {activity.length > 0 && (
        <Section eyebrow="Recent activity">
          <ol className="d-feed">
            {activity.map(a => (
              <li key={a.id} className="d-feed-row">
                <span className={`d-feed-dot kind-${a.kind}`}/>
                <span className="d-feed-ts t-mono">{a.ts}</span>
                <span className="d-feed-text">{a.text}</span>
                <span className="t-meta">— {a.actor}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}
    </>
  );
}

// ── Decisions tab ──────────────────────────────────────────────────────────
function DecisionsTab({ drcs, onResolved, toast }: {
  drcs: DrcData[];
  onResolved: (d: DrcData) => void;
  toast: (s: string) => void;
}) {
  const [filter, setFilter] = useState("open");
  const filtered =
    filter === "all"      ? drcs :
    filter === "open"     ? drcs.filter(d => d.status !== "resolved") :
    drcs.filter(d => d.status === "resolved");

  return (
    <>
      <div className="d-filterbar">
        <SegTabs
          tabs={[
            { id: "open",     label: "Open",     count: drcs.filter(d => d.status !== "resolved").length },
            { id: "resolved", label: "Resolved", count: drcs.filter(d => d.status === "resolved").length },
            { id: "all",      label: "All",      count: drcs.length },
          ]}
          value={filter} onChange={setFilter}/>
        <span className="t-meta">Sign-off captured in-toolkit · cross-references the global Decisions inbox</span>
      </div>
      <div className="d-drclist">
        {filtered.map(d => <DrcRow key={d.code} drc={d} onResolved={onResolved} toast={toast}/>)}
        {filtered.length === 0 && <div className="d-empty">No decisions in this filter.</div>}
      </div>
    </>
  );
}

// ── Budget tab ────────────────────────────────────────────────────────────
function BudgetTab({ capId, detail }: { capId: string; detail: DetailData }) {
  const rows = BUDGET_BY_CAP[capId] || [];
  const kinds = ["config", "validate", "insights", "exp-card"];

  const totalsByKind = kinds.map(k => {
    const cells = rows.flatMap(r => r.cells.filter(c => c.kind === k));
    return {
      kind: k,
      hPlan:  cells.reduce((a, c) => a + c.hPlan,  0),
      hSpent: cells.reduce((a, c) => a + c.hSpent, 0),
    };
  });
  const totalPlan  = totalsByKind.reduce((a, c) => a + c.hPlan,  0);
  const totalSpent = totalsByKind.reduce((a, c) => a + c.hSpent, 0);

  return (
    <>
      <div className="d-budget-note">
        <Icon name="info" size={13}/>
        <span>Reflection of the formal NN plan. Read-only — the xlsx is the source of truth. Reconciles {detail.xlsxRows.length} plan rows.</span>
      </div>

      <div className="d-budget">
        <table className="d-budget-table">
          <thead>
            <tr>
              <th className="d-budget-oc">OC</th>
              {kinds.map(k => (
                <th key={k} className="d-budget-kind">
                  <div className="t-eyebrow">{KIND_LABEL[k]}</div>
                  <div className="t-meta">spent / plan · role · Y/N</div>
                </th>
              ))}
              <th className="d-budget-total">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const rowPlan  = r.cells.reduce((a, c) => a + c.hPlan,  0);
              const rowSpent = r.cells.reduce((a, c) => a + c.hSpent, 0);
              return (
                <tr key={r.ocId}>
                  <td className="d-budget-oc">
                    <div className="t-mono">{r.ocCode}</div>
                    <div className="d-budget-oclabel">{r.ocLabel}</div>
                  </td>
                  {kinds.map(k => {
                    const c = r.cells.find(cell => cell.kind === k);
                    if (!c) return <td key={k} className="d-budget-cell">—</td>;
                    return (
                      <td key={k} className="d-budget-cell">
                        <div className="d-budget-h">
                          <span className="t-mono">{c.hSpent}</span>
                          <span className="t-muted t-mono">/{c.hPlan}h</span>
                        </div>
                        <div className="t-meta">{c.role}</div>
                        <div className={`d-budget-yn yn-${c.yn === "Y" ? "y" : c.yn === "N" ? "n" : "x"}`}>{c.yn}</div>
                      </td>
                    );
                  })}
                  <td className="d-budget-total">
                    <div className="t-mono">{rowSpent}<span className="t-muted">/{rowPlan}h</span></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td className="d-budget-oc"><strong>Totals</strong></td>
              {totalsByKind.map(t => (
                <td key={t.kind} className="d-budget-cell">
                  <div className="d-budget-h">
                    <span className="t-mono"><strong>{t.hSpent}</strong></span>
                    <span className="t-muted t-mono">/{t.hPlan}h</span>
                  </div>
                </td>
              ))}
              <td className="d-budget-total">
                <div className="t-mono"><strong>{totalSpent}</strong><span className="t-muted">/{totalPlan}h</span></div>
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="d-budget-foot t-meta">
          Source: <span className="t-mono">NN Ellucian Student Banner Signature Project Plan (1).xlsx</span> ·
          sheet=CORE / Recruiting / Student Aid · last reconciled 2026-05-04 · rows {detail.xlsxRows.join(", ") || "—"}.
        </div>
      </div>
    </>
  );
}

// ── ConfigFieldsTable (toolkit-original) ─────────────────────────────────
// Per-section config-field rows with two-state review (unreviewed / confirmed),
// localStorage-backed per engagement+OC+field. Renders an empty-state pill
// for sections without populated fields (everything except SOATERM today).

function ConfigFieldsTable({ engagementId, ocId, sectionId }: {
  engagementId: string;
  ocId: string;
  sectionId: string;
}) {
  const fields: ConfigField[] = CONFIG_FIELDS_BY_OC[ocId]?.[sectionId] || [];
  const keyFor = (fieldId: string) => `v2.cfg.${engagementId}.${ocId}.${fieldId}`;

  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const next: Record<string, boolean> = {};
    fields.forEach(f => {
      try {
        if (localStorage.getItem(keyFor(f.id)) === "confirmed") next[f.id] = true;
      } catch {}
    });
    setConfirmed(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementId, ocId, sectionId]);

  const toggle = (f: ConfigField) => {
    setConfirmed(c => {
      const nextState = !c[f.id];
      try {
        if (nextState) localStorage.setItem(keyFor(f.id), "confirmed");
        else localStorage.removeItem(keyFor(f.id));
      } catch {}
      return { ...c, [f.id]: nextState };
    });
  };

  const doneCount = Object.values(confirmed).filter(Boolean).length;

  return (
    <div className="d-configtable">
      <div className="d-configtable-head">
        <span className="t-eyebrow">Config fields</span>
        {fields.length > 0 && (
          <span className="t-meta">{doneCount} of {fields.length} confirmed</span>
        )}
      </div>
      {fields.length === 0 ? (
        <div className="d-configtable-empty">
          <span className="pill pill-neutral">No config fields captured yet for this section.</span>
        </div>
      ) : (
        <div className="d-configtable-rows">
          {fields.map(f => {
            const ok = !!confirmed[f.id];
            return (
              <div key={f.id} className={`d-configtable-row ${ok ? "is-confirmed" : ""}`}>
                <div className="d-configtable-field">
                  <span className="t-mono d-configtable-fieldcode">{f.fieldCode}</span>
                  <span className="d-configtable-label">{f.label}</span>
                </div>
                <div className="d-configtable-value">
                  <span className="t-mono d-configtable-recommended">{f.recommendedValue}</span>
                  {f.notes && <span className="d-configtable-notes">{f.notes}</span>}
                </div>
                <button
                  type="button"
                  className={`d-configtable-review ${ok ? "is-confirmed" : "is-unreviewed"}`}
                  onClick={() => toggle(f)}
                  aria-label={ok ? `Mark ${f.label} unreviewed` : `Confirm ${f.label}`}
                  aria-pressed={ok}
                >
                  {ok ? <Icon name="check" size={11}/> : <span className="d-configtable-circle"/>}
                  <span>{ok ? "Confirmed" : "Mark confirmed"}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CONFIGURATION GUIDE  ·  #guides/<ocId>
// ════════════════════════════════════════════════════════════════════════════
export function ConfigurationGuidePage({ ocId }: { ocId: string }) {
  const [, navigate] = useHash();
  const { currentProject } = useApp();
  const oc = ocIndex().find(o => o.id === ocId);
  const data = ocId ? (OC_DATA[ocId] ?? null) : (OC_DATA["soaterm"] ?? null);

  // Sections: prefer OC_DATA. Fallback to a stub for non-SOATERM OCs.
  const sections: GuideSection[] = (data?.sections as GuideSection[] | undefined) || [
    { id: "overview", num: "01", title: "Overview", complete: false,
      intro: `${oc?.title || ocId} configuration walk. Section content will populate from OC_DATA when available — this guide is wired but the content port for ${oc?.code || ocId} is pending.`,
      callouts: [], steps: [] },
    { id: "fields",   num: "02", title: "Field reference",      complete: false, intro: "Field-by-field walk pending content port.", steps: [] },
    { id: "validate", num: "03", title: "Validation & sign-off", complete: false, intro: "Run autopilot baseline · capture sign-off.", steps: [] },
  ];

  // All hooks before any conditional return.
  const firstIncomplete = sections.findIndex(s => !s.complete);
  const [activeId, setActive] = useState<string>(
    sections[firstIncomplete >= 0 ? firstIncomplete : 0].id
  );
  const [completed, setCompleted] = useState<Record<string, boolean>>(
    () => Object.fromEntries(sections.map(s => [s.id, !!s.complete]))
  );
  const [toastMsg, showToast] = useToast();
  const [aiDraft, setAiDraft] = useState<AIDraftData | null>(null);
  const [drcState, setDrcState] = useState<DrcData[]>(() => {
    const byOc = drcsForOc(ocId);
    return byOc.length ? byOc : (DRCS as DrcData[]).slice(0, 2);
  });

  const idx = sections.findIndex(s => s.id === activeId);

  // Keyboard nav ← / →.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof Element && e.target.matches("input, textarea, select")) return;
      if (e.key === "ArrowRight" && idx < sections.length - 1) setActive(sections[idx + 1].id);
      if (e.key === "ArrowLeft"  && idx > 0)                   setActive(sections[idx - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, sections]);

  // Redirect on bad id.
  useEffect(() => {
    if (!oc) {
      notImplemented(`Unknown guide "${ocId}" — back to guides`);
      window.location.hash = "guides";
    }
  }, [ocId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!oc) return null;

  // Derived (no more hooks).
  const current = sections[idx];

  const markComplete = () => {
    setCompleted(c => ({ ...c, [current.id]: true }));
    if (idx < sections.length - 1) setActive(sections[idx + 1].id);
  };

  const ocTasks = (TASKS as TaskData[]).filter(t =>
    (t.title || "").toLowerCase().includes("soaterm") ||
    (t.capability || "").toUpperCase() === "BC-CURRICULUM"
  ).slice(0, 4);

  const cap = BUSINESS_CAPABILITIES.find(c => c.id === oc.cap.toLowerCase()) ??
              BUSINESS_CAPABILITIES.find(c => c.id.toLowerCase() === oc.cap.toLowerCase());

  const innerSrc = INNER_SOURCE.filter(p => (p.tags || []).some(tag =>
    tag === oc.id || (oc.code || "").toLowerCase().includes(tag)
  )).slice(0, 3);

  const totalSections = sections.length;
  const doneCount = sections.filter(s => completed[s.id]).length;

  return (
    <>
      <Toast msg={toastMsg}/>

      <PageHero
        eyebrow={`Guide · ${cap?.label || "Capability"} · ${data?.product || "Banner SaaS"}`}
        headline={`${oc.code} · ${oc.title.split(" · ").slice(1).join(" · ") || oc.title}`}
        sub={(data as { summary?: string } | null)?.summary || `Configuration walk for ${oc.title}. Captures the decisions made and tracks the build to sign-off.`}
        actions={(
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => cap ? navigate(`capabilities/${cap.id}`) : navigate("guides")}>
              <Icon name="chevron-right" size={13} style={{ transform: "rotate(180deg)" }}/>
              <span>Capability</span>
            </button>
            <button className="btn btn-secondary btn-sm">
              <Icon name="spark" size={13}/>
              <span>Inner-source</span>
            </button>
            <button className="btn btn-secondary btn-sm">
              <span>v3.2</span>
              <Icon name="chevron-down" size={12}/>
            </button>
            <button className="btn btn-primary btn-sm">
              <Icon name="ai" size={13}/>
              <span>AI assist</span>
            </button>
          </>
        )}
      />

      {/* Status row */}
      <div className="d-guide-status">
        <span className="row gap-2 items-center">
          <Avatar initials={oc.owner || "JH"} size={20}/>
          <span className="t-body-sm">{oc.owner === "MT" ? "Marisol Tovar" : "Janet Hawkins"}</span>
        </span>
        <span className="t-meta">Updated {oc.updated}</span>
        <span className="t-meta">·</span>
        <span className="t-meta">{drcState.filter(d => d.status !== "resolved").length} open DRC · {ocTasks.length} tasks · {doneCount}/{totalSections} sections complete</span>
        <div className="flex-1"/>
        <span className={`pill pill-${ocStatusTone(oc.status).tone}`}>{ocStatusTone(oc.status).label}</span>
      </div>

      <div className="d-guide">
        {/* TOC rail */}
        <nav className="d-toc" aria-label="Sections">
          <div className="t-eyebrow d-toc-eye">Walk-steps</div>
          {sections.map(s => (
            <button key={s.id}
              className={`d-toc-item ${activeId === s.id ? "is-active" : ""} ${completed[s.id] ? "is-done" : ""}`}
              onClick={() => setActive(s.id)}>
              <span className="d-toc-num">{s.num}</span>
              <span className="d-toc-title">{s.title}</span>
              <span className="d-toc-state">
                {completed[s.id]
                  ? <Icon name="check" size={11}/>
                  : activeId === s.id ? <span className="d-toc-dot"/> : <span className="d-toc-circle"/>}
              </span>
            </button>
          ))}
          <div className="d-toc-divider"/>
          <div className="t-eyebrow d-toc-eye">Cross-references</div>
          <button className="d-toc-item d-toc-x"><Icon name="capabilities" size={11}/><span>Related OCs · 4</span></button>
          <button className="d-toc-item d-toc-x"><Icon name="decisions" size={11}/><span>DRCs · {drcState.length}</span></button>
          <button className="d-toc-item d-toc-x"><Icon name="library" size={11}/><span>Documents · 6</span></button>
        </nav>

        {/* Body */}
        <article className="d-body">
          {current && (
            <section key={current.id} className="d-section">
              <header className="d-section-head">
                <div>
                  <div className="t-eyebrow">Section {current.num}</div>
                  <h2 className="t-h1">{current.title}</h2>
                </div>
                {!completed[current.id] && (
                  <button className="btn btn-secondary btn-sm" onClick={markComplete}>
                    <Icon name="check" size={13}/>
                    <span>Mark step complete</span>
                  </button>
                )}
              </header>

              {current.intro && (
                <p className="d-section-intro" dangerouslySetInnerHTML={{ __html: current.intro }}/>
              )}

              {(current.callouts || []).map((c, i) => (
                <aside key={i} className={`d-callout kind-${c.kind}`}>
                  <span className="d-callout-tag">
                    {c.kind === "best-practice" ? "BEST PRACTICE" : c.kind === "watchout" ? "WATCH OUT" : "PATTERN"}
                  </span>
                  <p className="d-callout-text">{c.text}</p>
                  {c.from && <div className="t-meta">— {c.from}</div>}
                </aside>
              ))}

              {(current.steps || []).map((step, i) => (
                <div key={i} className="d-step">
                  <div className="d-step-head">
                    <span className="d-step-num">{step.num}</span>
                    <h3 className="t-h3">{step.title}</h3>
                  </div>
                  {step.body && (
                    <p className="d-section-intro" dangerouslySetInnerHTML={{ __html: step.body }}/>
                  )}

                  {step.fields && step.fields.length > 0 && (
                    <div className="d-fields">
                      <div className="d-fields-head">
                        <span>Field</span><span>Value</span><span>Why</span>
                      </div>
                      {step.fields.map((f, j) => (
                        <div key={j} id={`fld-${oc.id}-${(f.field || "").toLowerCase()}`} className="d-fields-row">
                          <span className="t-mono">{f.field}</span>
                          <span className="t-mono d-fields-val">{f.value}</span>
                          <span className="t-body-sm">{f.why}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {step.code && (
                    <div className="d-code">
                      <div className="d-code-head">
                        <span className="t-eyebrow">Snippet</span>
                        <span className="d-code-lang">{step.codeLang || "sql"}</span>
                        <button className="btn btn-ghost btn-sm"
                          onClick={() => { navigator.clipboard?.writeText(step.code!); showToast("Snippet copied"); }}>
                          <Icon name="external" size={12}/><span>Copy</span>
                        </button>
                      </div>
                      <pre><code>{step.code}</code></pre>
                    </div>
                  )}

                  <div className="d-step-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => setAiDraft({ kind: "tests", section: current.title })}>
                      <Icon name="ai" size={12}/><span>Generate test cases</span>
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setAiDraft({ kind: "drc", section: current.title })}>
                      <Icon name="ai" size={12}/><span>Draft a DRC from this</span>
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setAiDraft({ kind: "explain", section: current.title })}>
                      <Icon name="ai" size={12}/><span>Explain to client</span>
                    </button>
                  </div>

                  {(step.tasks || []).length > 0 && (
                    <div className="d-step-tasks">
                      <div className="t-eyebrow">Tasks linked to this step</div>
                      {(step.tasks || []).map(t => {
                        const full = (TASKS as TaskData[]).find(x => x.jiraId === t.id) || {
                          id: t.id, jiraId: t.id, title: t.title, status: "Ready",
                          priority: t.priority, due: t.due, commentCount: 0,
                        };
                        return <InlineTaskRow key={t.id} task={full} dense/>;
                      })}
                    </div>
                  )}
                </div>
              ))}

              {(!current.callouts?.length && !current.steps?.length) && (
                <div className="d-empty">Section body to be populated from <span className="t-mono">OC_DATA.{current.id}</span>.</div>
              )}

              <ConfigFieldsTable
                engagementId={currentProject?.id || "default"}
                ocId={oc.id}
                sectionId={current.id}
              />

              {aiDraft && aiDraft.section === current.title && (
                <AIDraft
                  draft={aiDraft}
                  onClose={() => setAiDraft(null)}
                  onAccept={() => {
                    setAiDraft(null);
                    showToast(`Draft accepted — added to ${aiDraft.kind === "tests" ? "Tests rail" : aiDraft.kind === "drc" ? "Decisions tab" : "guide body"}.`);
                  }}
                />
              )}
            </section>
          )}

          {/* prev/next */}
          <div className="d-section-nav">
            <button className="btn btn-secondary btn-sm" disabled={idx === 0} onClick={() => setActive(sections[idx - 1].id)}>
              <Icon name="chevron-right" size={13} style={{ transform: "rotate(180deg)" }}/>
              <span>{idx > 0 ? sections[idx - 1].title : "Start"}</span>
            </button>
            <span className="t-meta">←/→ to navigate</span>
            <button className="btn btn-primary btn-sm" disabled={idx === sections.length - 1} onClick={() => setActive(sections[idx + 1].id)}>
              <span>{idx < sections.length - 1 ? sections[idx + 1].title : "End"}</span>
              <Icon name="chevron-right" size={13}/>
            </button>
          </div>
        </article>

        {/* Right rail */}
        <aside className="d-rail d-rail-guide">
          <RailCard eyebrow="Decisions on this OC"
            action={drcState.filter(d => d.status !== "resolved").length > 0
              ? <span className="pill pill-amber">{drcState.filter(d => d.status !== "resolved").length}</span>
              : undefined}>
            <div className="stack gap-2">
              {drcState.slice(0, 3).map(d => (
                <DrcMini key={d.code} drc={d}
                  onResolved={(next) => setDrcState(s => s.map(x => x.code === next.code ? next : x))}
                  toast={showToast}/>
              ))}
            </div>
            <button className="btn btn-link" style={{ marginTop: 8 }}>+ Raise decision from current step</button>
          </RailCard>

          <RailCard eyebrow="Tests" action={<span className="t-mono">12 cases</span>}>
            <div className="d-tests">
              <div className="d-test"><span className="d-test-dot pass"/><span>Term-code uniqueness</span><span className="t-meta">pass</span></div>
              <div className="d-test"><span className="d-test-dot pass"/><span>PoT date-range coverage</span><span className="t-meta">pass</span></div>
              <div className="d-test"><span className="d-test-dot pass"/><span>SFARCTL prereq linkage</span><span className="t-meta">pass</span></div>
              <div className="d-test"><span className="d-test-dot pass"/><span>FA proc-year alignment</span><span className="t-meta">pass</span></div>
              <div className="d-test"><span className="d-test-dot skip"/><span>Cross-term IPEDS roll-up</span><span className="t-meta">skip</span></div>
              <div className="d-test"><span className="d-test-dot fail"/><span>Concurrent-term billing</span><span className="t-meta">fail</span></div>
            </div>
            <div className="t-meta" style={{ marginTop: 6 }}>11 pass · 1 fail · 1 skip · last run 8m ago</div>
          </RailCard>

          <RailCard eyebrow="Tasks (this OC)" action={<span className="t-mono">{ocTasks.length}</span>}>
            <div className="stack gap-1">
              {ocTasks.map(t => (
                <div key={t.id} className="d-mini-task">
                  <span className={`v2-row-marker ${t.urgent ? "rose" : t.status === "Needs Review" ? "amber" : "accent"}`}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="d-mini-task-title">{t.title}</div>
                    <div className="t-meta">{t.jiraId} · {t.due}</div>
                  </div>
                </div>
              ))}
            </div>
          </RailCard>

          {innerSrc.length > 0 && (
            <RailCard eyebrow="Inner-source matches">
              <div className="stack gap-2">
                {innerSrc.map(p => (
                  <div key={p.id} className="d-rail-row">
                    <Icon name="spark" size={12} style={{ color: "var(--accent)" }}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="d-rail-row-title">{p.title}</div>
                      <div className="t-meta">{p.kind} · {p.used} eng. · {p.stars}★</div>
                    </div>
                    <button className="btn btn-link">Apply →</button>
                  </div>
                ))}
              </div>
            </RailCard>
          )}
        </aside>
      </div>
    </>
  );
}

// ── DRC mini (right-rail variant) ─────────────────────────────────────────
function DrcMini({ drc, onResolved, toast }: {
  drc: DrcData;
  onResolved?: (d: DrcData) => void;
  toast?: (s: string) => void;
}) {
  const [signing, setSigning] = useState(false);
  if (drc.status === "resolved") {
    return (
      <div className="d-drc-mini d-drc-mini-resolved">
        <Icon name="check" size={11}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="d-drc-mini-title">{drc.code} — resolved by {drc.signedBy?.name}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="d-drc-mini">
      <span className="v2-dec-num">{drc.code}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="d-drc-mini-title">{drc.title}</div>
        <div className="t-meta">{(drc.daysStale || 0)}d open · blocks {drc.blockedCount || 0}</div>
      </div>
      <button className="btn btn-link" onClick={() => setSigning(s => !s)}>
        {signing ? "Cancel" : "Sign-off"}
      </button>
      {signing && (
        <div style={{ flexBasis: "100%" }}>
          <DrcSignoffPanel drc={drc} onResolved={onResolved} onClose={() => setSigning(false)} toast={toast}/>
        </div>
      )}
    </div>
  );
}

// ── AI draft (visible draft, no chat panel) ──────────────────────────────
function AIDraft({ draft, onClose, onAccept }: {
  draft: AIDraftData;
  onClose: () => void;
  onAccept: () => void;
}) {
  const body =
    draft.kind === "tests"
      ? "Suggested test cases:\n  · TC-PoT-1 · Half-A start = master start\n  · TC-PoT-2 · Half-B end = master end\n  · TC-PoT-3 · No date overlap between Half-A and Half-B\n  · TC-PoT-4 · Each PoT has census date set\n  · TC-PoT-5 · Refund schedule attached per PoT"
      : draft.kind === "drc"
      ? "Draft DRC: Adopt the 4-PoT block layout (Full / Half-A / Half-B / Late-start) for Fall 2026 and forward. Recommendation aligned with NSU-Term-2025 inner-source pattern. Override cost: ~12h technical effort + 1 sprint regression. Blast radius if delayed: SFARCTL window config + 7 dependent tasks blocked."
      : "Plain-English summary for the client: 'Parts of term' are mini-sessions inside a master term. NSU has historically used one full term plus a 1-week mini in January. The recommendation is to add Half-A and Half-B (8-week splits) so online undergrad cohorts can register on a calendar that mirrors peer institutions. We'll keep the existing full-term as default — the new options are additive.";

  return (
    <div className="d-aidraft">
      <div className="d-aidraft-head">
        <div className="t-eyebrow">AI · drafted from current section</div>
        <span className="d-aidraft-tag">{draft.kind === "tests" ? "Tests" : draft.kind === "drc" ? "DRC" : "Client-facing copy"}</span>
      </div>
      <pre className="d-aidraft-body">{body}</pre>
      <div className="d-aidraft-actions">
        <button className="btn btn-ghost btn-sm" onClick={onClose}>Dismiss</button>
        <button className="btn btn-secondary btn-sm">Edit</button>
        <button className="btn btn-primary btn-sm" onClick={onAccept}>
          <Icon name="check" size={13}/><span>Accept</span>
        </button>
      </div>
    </div>
  );
}
