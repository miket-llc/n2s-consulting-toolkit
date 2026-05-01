"use client";
// ============================================================================
// MY WORK — Cross-project task queue, smart-ranked
// PROJECT HOME (Overview)
// SCHEDULE / ROADMAP — multi go-live with capability swimlanes
// ============================================================================

import * as React from "react";
import {
  IconFilter, IconUser, IconPlus, IconBolt, IconClock, IconBranch, IconMessage,
  IconArrowRight, IconCalendar, IconActivity, IconAlert, IconSmartsheet,
  IconExternal,
} from "@/components/icons";
import { Avatar, Sparkline } from "@/components/shell";
import { TASKS, ENGAGEMENT, GO_LIVES, ACTIVE_SPRINT, BUSINESS_CAPABILITIES } from "@/lib/data";

type Task = (typeof TASKS)[number];

export function MyWork({ onOpenTask }: { onNav?: (id: string) => void; onOpenTask: (t: Task) => void }) {
  const T = TASKS;
  const groups = [
    { id: "today", label: "Due Today", tone: "rose", tasks: T.filter(t => t.dueRel === "today") },
    { id: "tomorrow", label: "Due Tomorrow", tone: "amber", tasks: T.filter(t => t.dueRel === "tomorrow") },
    { id: "week", label: "This Week", tone: "cyan", tasks: T.filter(t => t.dueRel === "this-week") },
    { id: "later", label: "Later", tone: "ghost", tasks: T.filter(t => t.dueRel === "later") },
  ];

  return (
    <div className="page page-narrow">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Cross-project · {T.length} tasks · 4 engagements</div>
          <h1 className="ph-title">My Work</h1>
          <p className="ph-sub">Janet, Tuesday May 1. The smart queue ranks by go-live proximity, blocker status, and capability dependency. Three NSU items are top — they all unblock the HR go-live in 23 days.</p>
        </div>
        <div className="flex-row">
          <button className="btn"><IconFilter/> All projects</button>
          <button className="btn"><IconUser/> Assigned to me</button>
          <button className="btn btn-primary"><IconPlus/> New task</button>
        </div>
      </div>

      {/* Smart Queue strip */}
      <div className="card" style={{ marginBottom: 22, background: "linear-gradient(135deg, rgba(147,51,234,0.10), rgba(62,207,255,0.04))", borderColor: "var(--accent-border)" }}>
        <div className="spread" style={{ marginBottom: 10 }}>
          <div className="flex-row">
            <IconBolt/>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Smart Queue · What to work on next</span>
          </div>
          <span className="muted mono" style={{ fontSize: 11 }}>Re-ranked 2m ago</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {T.slice(0, 3).map((t, i) => (
            <div key={t.id} className="card card-tight" style={{ cursor: "pointer", borderColor: i === 0 ? "var(--accent)" : "var(--border)" }} onClick={() => onOpenTask(t)}>
              <div className="flex-row" style={{ marginBottom: 6 }}>
                <span className="chip chip-mono chip-rose">P1</span>
                <span className="id-pill">{t.jiraId}</span>
                <span className="muted mono" style={{ fontSize: 10, marginLeft: "auto" }}>#{i + 1}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: 8 }}>{t.title}</div>
              <div className="flex-row" style={{ fontSize: 10, color: "var(--text-muted)" }}>
                <IconClock/>{t.due}
              </div>
            </div>
          ))}
        </div>
      </div>

      {groups.map(g => (
        <div key={g.id} style={{ marginBottom: 22 }}>
          <div className="spread" style={{ marginBottom: 10 }}>
            <div className="flex-row">
              <span className={`chip chip-${g.tone}`}>{g.tasks.length}</span>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--text-secondary)" }}>{g.label}</span>
            </div>
          </div>
          <div className="flex-col" style={{ gap: 6 }}>
            {g.tasks.map(t => <TaskRow key={t.id} t={t} onClick={() => onOpenTask(t)}/>)}
            {g.tasks.length === 0 && <div className="muted" style={{ fontSize: 12, padding: "8px 14px" }}>Nothing here.</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskRow({ t, onClick }: { t: Task; onClick: () => void }) {
  const cls = t.urgent ? "urgent" : t.status === "In Progress" ? "in-progress" : t.status === "Needs Review" ? "review" : "";
  const m = ENGAGEMENT.members.find(x => x.id === t.assignee);
  return (
    <div className={`task-row ${cls}`} onClick={onClick}>
      <div className="check"></div>
      <div className="body">
        <div className="ttl">{t.title}</div>
        <div className="meta">
          <span className="chip chip-mono chip-accent">{t.project}</span>
          <span className="dot-sep">·</span>
          <span className="id-pill">{t.jiraId}</span>
          <span className="dot-sep">·</span>
          <span className="flex-row" style={{ gap: 4 }}><IconBranch/>{t.capability}</span>
          {t.commentCount > 0 && <><span className="dot-sep">·</span><span className="flex-row" style={{ gap: 4 }}><IconMessage/>{t.commentCount}</span></>}
          <span className="dot-sep">·</span>
          <span style={{ color: "var(--text-ghost)", fontFamily: "var(--font-mono)", fontSize: 10 }}>Synced from Jira · {t.lastSync}</span>
        </div>
      </div>
      <div className="right">
        <span className={`chip chip-mono ${t.priority === "P1" ? "chip-rose" : t.priority === "P2" ? "chip-amber" : "chip-ghost"}`}>{t.priority}</span>
        <span className={`chip ${t.status === "In Progress" ? "chip-accent" : t.status === "Needs Review" ? "chip-amber" : "chip-ghost"}`} style={{ minWidth: 80, justifyContent: "center" }}>{t.status}</span>
        <span className="muted mono" style={{ fontSize: 11, minWidth: 70, textAlign: "right" }}>{t.due}</span>
        {m && <Avatar m={m} size="sm"/>}
      </div>
    </div>
  );
}

// ============================================================================
// PROJECT HOME (Overview)
// ============================================================================
export function ProjectHome({ onNav }: { onNav: (id: string) => void }) {
  const gls = GO_LIVES;
  const sp = ACTIVE_SPRINT;
  const E = ENGAGEMENT;
  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Engagement Overview · Banner SaaS · Select tier</div>
          <h1 className="ph-title">Northern State University</h1>
          <p className="ph-sub">Build phase, Sprint 1 of 4. Four go-lives in scope: HR, Finance, Student Phase 1, Student Phase 2. Currently lighting up <span className="hov-link" onClick={() => onNav("capabilities")}>Curriculum Mgmt</span> and <span className="hov-link" onClick={() => onNav("capabilities")}>Student Records</span> — the registrar workshops are on Thursday.</p>
        </div>
        <div className="flex-row">
          <div className="av-stack">
            {E.members.slice(0, 5).map(m => <Avatar key={m.id} m={m} size="sm"/>)}
            <div className="av-sm" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontFamily: "var(--font-mono)", border: "2px solid var(--bg-elevated)" }}>+1</div>
          </div>
          <button className="btn btn-primary"><IconArrowRight/> Open Sprint 1</button>
        </div>
      </div>

      {/* Quick KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Active Sprint", value: "S1 · Day 4", sub: `${sp.tasks.done}/${sp.tasks.total} tasks done` },
          { label: "Next Go-Live", value: "HR · 23d", sub: "May 24, 2026 · 78% ready" },
          { label: "Capabilities Active", value: "5 / 12", sub: "7 in backlog" },
          { label: "Open Risks", value: "8", sub: "2 high · 6 medium", tone: "rose" },
        ].map(k => (
          <div key={k.label} className="card">
            <div className="uppercase-eyebrow" style={{ marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: k.tone === "rose" ? "var(--rose)" : "var(--text-primary)" }}>{k.value}</div>
            <div className="muted mono" style={{ fontSize: 11, marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Go-live readiness */}
      <div className="card" style={{ marginBottom: 22 }}>
        <div className="card-head">
          <IconCalendar/>
          <span className="ttl">Go-Live Readiness</span>
          <span className="muted mono" style={{ fontSize: 11, marginLeft: "auto" }}>4 events · 2025-09 → 2027-03</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {gls.map(gl => {
            const tone = gl.status === "at-risk" ? "rose" : gl.status === "scoping" ? "ghost" : "emerald";
            return (
              <div key={gl.id} className="card card-tight" style={{ background: "var(--bg-panel)" }}>
                <div className="spread" style={{ marginBottom: 8 }}>
                  <div className="flex-row">
                    <span className={`chip chip-mono chip-${tone}`}>{gl.status}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{gl.label}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 12, color: "var(--text-secondary)" }}>{gl.daysOut}d</span>
                </div>
                <div className="muted mono" style={{ fontSize: 10, marginBottom: 8 }}>{gl.product} · {gl.date} · {gl.scope.length} capabilities</div>
                <div className="bar"><div className="fill" style={{ width: `${gl.readiness}%`, background: tone === "rose" ? "var(--rose)" : tone === "ghost" ? "var(--text-ghost)" : "var(--accent)" }}/></div>
                <div className="spread" style={{ marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
                  <span>{gl.readiness}% ready</span>
                  <span className="hov-link" style={{ fontSize: 11 }}>Open roadmap →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        {/* Sprint snapshot */}
        <div className="card">
          <div className="card-head">
            <IconActivity/>
            <span className="ttl">Sprint 1 — Enrollment & Curriculum</span>
            <span className="chip chip-accent" style={{ marginLeft: "auto" }}>Day 4 of 10</span>
          </div>
          <div className="flex-row" style={{ gap: 18, marginBottom: 14 }}>
            <div>
              <div className="uppercase-eyebrow">Burndown</div>
              <Sparkline data={sp.burndown} width={220} height={48} stroke="var(--accent-bright)"/>
            </div>
            <div className="flex-col" style={{ flex: 1 }}>
              <div className="spread"><span className="muted" style={{ fontSize: 12 }}>Done</span><span className="mono" style={{ fontSize: 12 }}>{sp.tasks.done} / {sp.tasks.total}</span></div>
              <div className="bar fill-emerald"><div className="fill" style={{ width: `${(sp.tasks.done / sp.tasks.total) * 100}%` }}/></div>
              <div className="muted mono" style={{ fontSize: 11, marginTop: 6 }}>{sp.pct}% on burndown · pace 92%</div>
            </div>
          </div>
          <div className="uppercase-eyebrow" style={{ marginBottom: 8 }}>Capabilities in this sprint</div>
          <div className="flex-col" style={{ gap: 6 }}>
            {BUSINESS_CAPABILITIES.filter(c => c.sprint === "s1").map(bc => (
              <div key={bc.id} className="spread" style={{ padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8 }}>
                <div className="flex-row">
                  <span className="chip chip-mono chip-violet">{bc.id}</span>
                  <span style={{ fontSize: 13 }}>{bc.label}</span>
                </div>
                <div className="flex-row" style={{ gap: 8 }}>
                  <div style={{ width: 80 }} className="bar"><div className="fill" style={{ width: `${bc.pct}%` }}/></div>
                  <span className="muted mono" style={{ fontSize: 11, minWidth: 28, textAlign: "right" }}>{bc.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity / risks */}
        <div className="flex-col" style={{ gap: 14 }}>
          <div className="card">
            <div className="card-head"><IconAlert/><span className="ttl">Top Risks</span><span className="chip chip-rose" style={{ marginLeft: "auto" }}>8 open</span></div>
            <div className="flex-col" style={{ gap: 8 }}>
              {[
                { sev: "high", text: "FA award-year ↔ term mapping blocked on FA office config session." },
                { sev: "high", text: "R2T4 feeder OC scoping incomplete; impacts Student Phase 1." },
                { sev: "med", text: "Section building has 12 priority-group conflicts pending sign-off." },
              ].map((r, i) => (
                <div key={i} className="flex-row" style={{ padding: "8px 10px", borderLeft: `3px solid ${r.sev === "high" ? "var(--rose)" : "var(--amber)"}`, background: "var(--bg-panel)", borderRadius: "0 6px 6px 0", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {r.text}
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><IconClock/><span className="ttl">Recent Activity</span></div>
            <div className="flex-col" style={{ gap: 10 }}>
              {[
                { who: "Raj K.", when: "12m ago", what: "synced 14 Jira updates → Smartsheet" },
                { who: "Marisol T.", when: "1h ago", what: "uploaded NSU-Term-Rollover.sh to Inner Source" },
                { who: "Janet H.", when: "2h ago", what: "completed DRC-2: parts-of-term confirmed" },
              ].map((a, i) => (
                <div key={i} className="flex-row" style={{ fontSize: 12 }}>
                  <Avatar m={{ initials: a.who.split(" ").map(s => s[0]).join(""), color: ["#3ee8a8", "#b49cff", "#3ecfff"][i] }} size="sm"/>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{a.who}</span>
                    <span className="muted"> {a.what}</span>
                  </div>
                  <span className="muted mono" style={{ fontSize: 10 }}>{a.when}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SCHEDULE / ROADMAP — multi go-live with capability swimlanes
// ============================================================================
export function Schedule() {
  const gls = GO_LIVES;
  const months = ["May'26", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan'27", "Feb", "Mar", "Apr"];
  const lanes = [
    { id: "bc-hr-core", label: "HR Core & Position", goLive: "gl-hr", from: 0, to: 1, pct: 92, owner: "DL" },
    { id: "bc-payroll", label: "Payroll", goLive: "gl-hr", from: 0, to: 1, pct: 84, owner: "DL" },
    { id: "bc-gl", label: "General Ledger", goLive: "gl-fin", from: 0, to: 4, pct: 18, owner: "RK" },
    { id: "bc-ap", label: "Accounts Payable", goLive: "gl-fin", from: 1, to: 4, pct: 8, owner: "RK" },
    { id: "bc-ar", label: "AR & Collections", goLive: "gl-fin", from: 1, to: 4, pct: 0, owner: "MT" },
    { id: "bc-curriculum", label: "Curriculum Mgmt", goLive: "gl-s1", from: 0, to: 7, pct: 56, owner: "JH" },
    { id: "bc-records", label: "Student Records", goLive: "gl-s1", from: 0, to: 7, pct: 38, owner: "JH" },
    { id: "bc-faa", label: "Financial Aid Admin", goLive: "gl-s1", from: 1, to: 7, pct: 12, owner: "RK" },
    { id: "bc-billing", label: "Student Billing", goLive: "gl-s2", from: 4, to: 11, pct: 0, owner: "MT" },
    { id: "bc-advising", label: "Advising", goLive: "gl-s2", from: 5, to: 11, pct: 0, owner: "—" },
    { id: "bc-housing", label: "Housing & Residence", goLive: "gl-s2", from: 5, to: 11, pct: 0, owner: "—" },
  ];
  const colW = `1fr`;
  const goLiveColors: Record<string, string> = { "gl-hr": "#3ee8a8", "gl-fin": "#3ecfff", "gl-s1": "#a855f7", "gl-s2": "#ffc94d" };

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Plan: Smartsheet · 12 capabilities · 4 go-lives</div>
          <h1 className="ph-title">Schedule & Roadmap</h1>
          <p className="ph-sub">Capability-led timeline. Each lane is a Business Capability; ramp ends at its assigned go-live. Click any lane to drill into capability state.</p>
        </div>
        <div className="flex-row">
          <button className="btn"><IconFilter/> Filter: Select tier</button>
          <button className="btn"><IconCalendar/> Quarterly</button>
          <button className="btn"><IconSmartsheet/> Open in Smartsheet <IconExternal/></button>
        </div>
      </div>

      {/* Go-live legend */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="flex-row" style={{ gap: 24, flexWrap: "wrap" }}>
          {gls.map(gl => (
            <div key={gl.id} className="flex-row" style={{ gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: goLiveColors[gl.id] }}/>
              <div className="flex-col" style={{ gap: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{gl.label}</span>
                <span className="muted mono" style={{ fontSize: 10 }}>{gl.date} · {gl.daysOut}d · {gl.readiness}% ready</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gantt-ish timeline */}
      <div className="card" style={{ overflow: "hidden" }}>
        {/* Month header */}
        <div style={{ display: "grid", gridTemplateColumns: `220px repeat(12, ${colW})`, borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
          <div className="uppercase-eyebrow">Capability</div>
          {months.map((m, i) => <div key={i} className="uppercase-eyebrow" style={{ textAlign: "center", fontSize: 9, color: i === 0 ? "var(--accent-bright)" : "var(--text-ghost)" }}>{m}</div>)}
        </div>

        {/* Today line */}
        <div style={{ position: "relative" }}>
          {lanes.map((l, idx) => {
            return (
              <div key={l.id} style={{ display: "grid", gridTemplateColumns: `220px repeat(12, ${colW})`, alignItems: "center", padding: "10px 0", borderBottom: idx === lanes.length - 1 ? "none" : "1px solid var(--border-subtle)" }}>
                <div className="flex-col" style={{ gap: 3 }}>
                  <div className="flex-row" style={{ gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: goLiveColors[l.goLive] }}/>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{l.label}</span>
                  </div>
                  <div className="muted mono" style={{ fontSize: 10, paddingLeft: 14 }}>{l.id} · {l.owner}</div>
                </div>
                {months.map((_, i) => {
                  const inRange = i >= l.from && i <= l.to;
                  const completedTo = l.from + ((l.to - l.from + 1) * (l.pct / 100));
                  const isCompleted = i < completedTo && inRange;
                  return (
                    <div key={i} style={{ height: 22, padding: "0 1px", position: "relative" }}>
                      {inRange && (
                        <div style={{ height: "100%", background: isCompleted ? goLiveColors[l.goLive] : `${goLiveColors[l.goLive]}33`, borderRadius: i === l.from ? "4px 0 0 4px" : i === l.to ? "0 4px 4px 0" : 0, opacity: isCompleted ? 0.85 : 0.5 }}/>
                      )}
                      {i === l.to && inRange && (
                        <div style={{ position: "absolute", right: -2, top: -4, color: goLiveColors[l.goLive], fontSize: 14 }}>◆</div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-go-live cards */}
      <div className="ph" style={{ marginTop: 24 }}>
        <div>
          <div className="ph-eyebrow">Per go-live readiness</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Each go-live, scoped</div>
        </div>
      </div>
      {gls.map(gl => (
        <div key={gl.id} className="card" style={{ marginBottom: 12, borderLeft: `3px solid ${goLiveColors[gl.id]}` }}>
          <div className="spread" style={{ marginBottom: 12 }}>
            <div>
              <div className="flex-row">
                <span className="chip chip-mono" style={{ background: `${goLiveColors[gl.id]}22`, color: goLiveColors[gl.id], borderColor: `${goLiveColors[gl.id]}44` }}>{gl.product}</span>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{gl.label}</span>
              </div>
              <div className="muted mono" style={{ fontSize: 11, marginTop: 4 }}>Target: {gl.date} · in {gl.daysOut} days</div>
            </div>
            <div className="flex-row">
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: goLiveColors[gl.id], fontFamily: "var(--font-mono)" }}>{gl.readiness}%</div>
                <div className="muted" style={{ fontSize: 10 }}>readiness</div>
              </div>
              <button className="btn btn-tiny">Open scope</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${gl.scope.length}, 1fr)`, gap: 8 }}>
            {gl.scope.map(scId => {
              const bc = BUSINESS_CAPABILITIES.find(b => b.id === scId);
              if (!bc) return null;
              return (
                <div key={scId} style={{ padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg-panel)" }}>
                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{bc.label}</div>
                  <div className="bar"><div className="fill" style={{ width: `${bc.pct}%`, background: goLiveColors[gl.id] }}/></div>
                  <div className="muted mono" style={{ fontSize: 10, marginTop: 4 }}>{bc.pct}% · {bc.bpCount} BPs</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
