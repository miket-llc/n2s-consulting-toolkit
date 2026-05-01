"use client";
// ============================================================================
// CAPABILITIES — Business Capabilities map
// SPRINT / TASKS — Kanban board synced with Jira
// ============================================================================

import * as React from "react";
import {
  IconArrowRight, IconJira, IconRefresh, IconPlus, IconMessage, IconSparkles,
} from "@/components/icons";
import { Avatar, Sparkline } from "@/components/shell";
import { BUSINESS_CAPABILITIES, TASKS, ENGAGEMENT, ACTIVE_SPRINT } from "@/lib/data";

type Capability = (typeof BUSINESS_CAPABILITIES)[number];
type Task = (typeof TASKS)[number];

export function Capabilities({ onOpenOC, onOpenCapability }: { onOpenOC: (oc: { id: string; label: string }) => void; onOpenCapability: (cap: Capability) => void }) {
  const BC = BUSINESS_CAPABILITIES;
  const [filter, setFilter] = React.useState("all");
  const grouped: Record<string, Capability[]> = {
    "Student": BC.filter(b => b.area === "Student"),
    "Finance": BC.filter(b => b.area === "Finance"),
    "HR": BC.filter(b => b.area === "HR"),
    "Cross-domain": BC.filter(b => b.area === "Cross"),
  };

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">12 capabilities · 64 business processes · 312 operational components</div>
          <h1 className="ph-title">Capabilities</h1>
          <p className="ph-sub">N2S layered model — every capability rolls up to a go-live; every business process holds a stack of operational components. Click an OC card to open the configuration guide.</p>
        </div>
        <div className="flex-row">
          {["all", "active", "blocked", "complete"].map(f => (
            <button key={f} className={`btn ${filter === f ? "btn-primary" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {Object.entries(grouped).map(([area, bcs]) => (
        <div key={area} style={{ marginBottom: 28 }}>
          <div className="spread" style={{ marginBottom: 12 }}>
            <div className="flex-row">
              <span className="uppercase-eyebrow" style={{ fontSize: 11 }}>{area}</span>
              <span className="muted mono" style={{ fontSize: 11 }}>{bcs.length} capabilities · {bcs.reduce((s, b) => s + b.bpCount, 0)} BPs</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {bcs.map(bc => <CapCard key={bc.id} bc={bc} onOpenOC={onOpenOC} onOpenCapability={onOpenCapability}/>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function CapCard({ bc, onOpenOC, onOpenCapability }: { bc: Capability; onOpenOC: (oc: { id: string; label: string }) => void; onOpenCapability?: (bc: Capability) => void }) {
  const tone = bc.status === "active" ? "accent" : bc.status === "blocked" ? "rose" : bc.status === "complete" ? "emerald" : "ghost";
  return (
    <div className="card" style={{ cursor: "pointer" }} onClick={() => onOpenCapability && onOpenCapability(bc)}>
      <div className="spread" style={{ marginBottom: 8 }}>
        <div className="flex-row">
          <span className="chip chip-mono chip-violet">{bc.id}</span>
          <span className={`chip chip-${tone}`}>{bc.status}</span>
        </div>
        <span className="muted mono" style={{ fontSize: 11 }}>{bc.goLive}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{bc.label}</div>
      <div className="muted" style={{ fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>{bc.tagline}</div>
      <div className="bar"><div className="fill" style={{ width: `${bc.pct}%` }}/></div>
      <div className="spread" style={{ marginTop: 6 }}>
        <span className="muted mono" style={{ fontSize: 10 }}>{bc.pct}% · {bc.ocsDone}/{bc.ocsTotal} OCs done</span>
        <span className="muted mono" style={{ fontSize: 10 }}>{bc.bpCount} BPs</span>
      </div>
      {bc.activeOC && (
        <div className="card-tight" style={{ marginTop: 12, background: "var(--bg-elevated)", padding: 10 }}>
          <div className="uppercase-eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>Currently configuring</div>
          <div className="spread">
            <span className="hov-link" style={{ fontSize: 12 }} onClick={(e) => { e.stopPropagation(); onOpenOC(bc.activeOC!); }}>{bc.activeOC.label}</span>
            <IconArrowRight/>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SPRINT / TASKS — Kanban board synced with Jira
// ============================================================================
export function SprintTasks({ onOpenTask }: { onOpenTask: (t: Task) => void }) {
  const T = TASKS;
  const cols = [
    { id: "backlog", label: "Backlog", tone: "ghost", tasks: T.filter(t => t.status === "Backlog") },
    { id: "ready", label: "Ready", tone: "ghost", tasks: T.filter(t => t.status === "Ready") },
    { id: "progress", label: "In Progress", tone: "accent", tasks: T.filter(t => t.status === "In Progress") },
    { id: "review", label: "Needs Review", tone: "amber", tasks: T.filter(t => t.status === "Needs Review") },
    { id: "done", label: "Done", tone: "emerald", tasks: T.filter(t => t.status === "Done") },
  ];

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Sprint 1 · Day 4 of 10 · 22/38 tasks complete · Synced with Jira every 5m</div>
          <h1 className="ph-title">Tasks & Sprints</h1>
          <p className="ph-sub">Each card is a Jira issue, mirrored from the project's Jira instance. Drag between columns to update status (writes back to Jira). Smartsheet plan rolls up automatically every 5 minutes.</p>
        </div>
        <div className="flex-row">
          <button className="btn"><IconJira/> Jira sync · 12s ago</button>
          <button className="btn"><IconRefresh/> Re-sync</button>
          <button className="btn btn-primary"><IconPlus/> New task</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14, padding: "12px 16px" }}>
        <div className="flex-row" style={{ gap: 24 }}>
          <div>
            <div className="uppercase-eyebrow">Sprint goal</div>
            <div style={{ fontSize: 13, marginTop: 2 }}>Lock parts-of-term, registration windows & section-build inputs for Fall 2026.</div>
          </div>
          <div style={{ width: 1, background: "var(--border)", alignSelf: "stretch" }}/>
          <div>
            <div className="uppercase-eyebrow">Burndown</div>
            <Sparkline data={ACTIVE_SPRINT.burndown} width={140} height={28} stroke="var(--accent-bright)"/>
          </div>
          <div>
            <div className="uppercase-eyebrow">Capacity</div>
            <div style={{ fontSize: 13 }} className="mono">142 / 168 hrs</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div className="uppercase-eyebrow">Team</div>
            <div className="av-stack" style={{ marginTop: 4 }}>
              {ENGAGEMENT.members.slice(0, 5).map(m => <Avatar key={m.id} m={m} size="sm"/>)}
            </div>
          </div>
        </div>
      </div>

      <div className="kanban">
        {cols.map(c => (
          <div key={c.id} className="kanban-col">
            <div className="kanban-head">
              <span className={`chip chip-${c.tone}`}>{c.tasks.length}</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{c.label}</span>
            </div>
            <div className="flex-col" style={{ gap: 8 }}>
              {c.tasks.map(t => <KanbanCard key={t.id} t={t} onClick={() => onOpenTask(t)}/>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanCard({ t, onClick }: { t: Task; onClick: () => void }) {
  const m = ENGAGEMENT.members.find(x => x.id === t.assignee);
  return (
    <div className="kanban-card" onClick={onClick}>
      <div className="flex-row" style={{ marginBottom: 6 }}>
        <span className="id-pill">{t.jiraId}</span>
        <span className={`chip chip-mono ${t.priority === "P1" ? "chip-rose" : t.priority === "P2" ? "chip-amber" : "chip-ghost"}`}>{t.priority}</span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.4 }}>{t.title}</div>
      <div className="flex-row" style={{ marginBottom: 8 }}>
        <span className="chip chip-mono chip-violet" style={{ fontSize: 10 }}>{t.capability}</span>
      </div>
      <div className="spread" style={{ fontSize: 10, color: "var(--text-muted)" }}>
        <span className="flex-row" style={{ gap: 6 }}>
          {t.commentCount > 0 && <span className="flex-row" style={{ gap: 3 }}><IconMessage/>{t.commentCount}</span>}
          {t.aiAssist && <span style={{ color: "var(--accent-bright)" }} className="flex-row"><IconSparkles size={10}/></span>}
        </span>
        <div className="flex-row" style={{ gap: 6 }}>
          <span className="mono">{t.due}</span>
          {m && <Avatar m={m} size="sm"/>}
        </div>
      </div>
    </div>
  );
}
