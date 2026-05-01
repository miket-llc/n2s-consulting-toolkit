"use client";
// ============================================================================
// SHELL — Topbar, Project switcher, Schedule pill drawer, Left rail
// ============================================================================

import * as React from "react";
import {
  IconArrowSwitch, IconList, IconChevD, IconSearch, IconHash, IconBell,
  IconSun, IconMoon, IconHome, IconBolt, IconLayout, IconActivity, IconBox,
  IconShield, IconCalendar, IconKanban, IconBook, IconRobot, IconPaperclip,
  IconChevR, IconCog, IconSparkles, IconClose, IconSend,
} from "@/components/icons";
import { ENGAGEMENT, ACTIVE_SPRINT, GO_LIVES, SPRINTS } from "@/lib/data";

export function Sparkline({ data, width = 64, height = 18, stroke = "#fff" }: { data: number[]; width?: number; height?: number; stroke?: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 2) - 1}`).join(" ");
  return (
    <svg className="spark" width={width} height={height}>
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"/>
    </svg>
  );
}

export function Avatar({ m, size = "md" }: { m: { initials: string; color: string }; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "av-sm" : "av-md";
  return (
    <div className={`avatar ${cls}`} style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}aa)`, color: "#0c0e2b" }}>
      {m.initials}
    </div>
  );
}

function ProjectSwitcher({ open, onClose, onPick }: { open: boolean; onClose: () => void; currentId?: string; onPick: (id: string) => void }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 39 }}/>
      <div className="proj-dropdown">
        <div className="pd-eyebrow">Active project</div>
        <div className="pd-row active">
          <div className="dot" style={{ width: 6, height: 6, borderRadius: 3, background: "#3ee8a8", boxShadow: "0 0 6px rgba(62,232,168,0.6)" }}/>
          <div className="pd-name">Northern State University</div>
          <div className="pd-meta">Banner SaaS · Select</div>
        </div>
        <hr/>
        <div className="pd-eyebrow">Recent</div>
        {[
          { name: "Western Illinois University", meta: "Banner · Select" },
          { name: "CSU East Bay", meta: "Banner · Essentials" },
          { name: "Southwest Methodist", meta: "Banner · Advantage" },
          { name: "University of Vermont", meta: "Banner · Select" },
        ].map(p => (
          <div className="pd-row" key={p.name} onClick={onClose}>
            <div className="dot" style={{ width: 6, height: 6, borderRadius: 3, background: "var(--text-ghost)" }}/>
            <div className="pd-name">{p.name}</div>
            <div className="pd-meta">{p.meta}</div>
          </div>
        ))}
        <hr/>
        <div className="pd-row" style={{ color: "var(--text-muted)" }} onClick={() => { onPick("none"); onClose(); }}>
          <IconArrowSwitch/>
          <div className="pd-name" style={{ color: "var(--text-muted)" }}>Exit project · Cross-project mode</div>
        </div>
        <div className="pd-row" style={{ color: "var(--text-muted)" }}>
          <IconList/>
          <div className="pd-name" style={{ color: "var(--text-muted)" }}>All projects (12) →</div>
        </div>
      </div>
    </>
  );
}

function ScheduleDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const sp = ACTIVE_SPRINT;
  const gls = GO_LIVES;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 39 }}/>
      <div className="sched-drawer">
        <div className="spread" style={{ marginBottom: 14 }}>
          <div>
            <div className="uppercase-eyebrow">Sprint 1 · Active</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>Enrollment & Curriculum</div>
            <div className="muted mono" style={{ fontSize: 11, marginTop: 4 }}>Apr 22 → May 09 · Day 4 of 10</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="uppercase-eyebrow">Burndown</div>
            <Sparkline data={sp.burndown} width={140} height={32} stroke="var(--accent-bright)"/>
            <div className="muted mono" style={{ fontSize: 10, marginTop: 4 }}>{sp.tasks.done}/{sp.tasks.total} tasks complete</div>
          </div>
        </div>
        <div className="divider-h"/>
        <div className="uppercase-eyebrow" style={{ marginBottom: 8 }}>Upcoming go-lives</div>
        <div className="flex-col" style={{ gap: 8 }}>
          {gls.map(gl => (
            <div key={gl.id} className="spread" style={{ padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--bg-elevated)" }}>
              <div className="flex-row" style={{ gap: 12 }}>
                <span className={`chip chip-mono ${gl.status === "at-risk" ? "chip-rose" : gl.status === "scoping" ? "chip-ghost" : "chip-emerald"}`}>{gl.status}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{gl.label}</div>
                  <div className="muted mono" style={{ fontSize: 10, marginTop: 2 }}>{gl.product} · {gl.date}</div>
                </div>
              </div>
              <div className="flex-row" style={{ gap: 16 }}>
                <div style={{ width: 100 }}>
                  <div className="bar"><div className="fill" style={{ width: `${gl.readiness}%`, background: gl.status === "at-risk" ? "var(--rose)" : "var(--accent)" }}/></div>
                  <div className="muted mono" style={{ fontSize: 10, marginTop: 3 }}>{gl.readiness}% ready</div>
                </div>
                <div className="mono" style={{ fontSize: 12, color: "var(--text-primary)", minWidth: 60, textAlign: "right" }}>{gl.daysOut}d</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function TopBar({ theme, setTheme, projectActive, hasNotif, onOpenNavigator, onOpenShortcuts }: { route?: string; onNav?: (id: string) => void; theme: string; setTheme: (t: string) => void; projectActive: boolean; hasNotif: boolean; onOpenNavigator: () => void; onOpenShortcuts: () => void }) {
  const [showSwitch, setShowSwitch] = React.useState(false);
  const [showSched, setShowSched] = React.useState(false);
  return (
    <header className="tb">
      <div className="tb-logo">
        <span style={{ fontWeight: 700 }}>Ellucian</span>
        <span className="sep">|</span>
        <span className="sub">Consulting Toolkit</span>
      </div>
      <div className="tb-divider"/>
      {projectActive && (
        <div className="tb-projswitch" onClick={() => setShowSwitch(s => !s)}>
          <span className="dot"/>
          <span className="lbl">Northern State</span>
          <span className="meta">· Banner · Select</span>
          <IconChevD size={12}/>
        </div>
      )}
      <ProjectSwitcher open={showSwitch} onClose={() => setShowSwitch(false)} currentId="nsu" onPick={() => {}}/>

      <div className="tb-spacer"/>

      {projectActive && (
        <div className="tb-schedpill" onClick={() => setShowSched(s => !s)}>
          <div className="col">
            <span className="lbl-sm">Sprint</span>
            <span className="val">S1 · Day 4/10</span>
          </div>
          <Sparkline data={ACTIVE_SPRINT.burndown} width={56} height={16} stroke="#fff"/>
          <div className="col">
            <span className="lbl-sm">Next GL</span>
            <span className="val" style={{ color: "#ffe39a" }}>HR · 23d</span>
          </div>
        </div>
      )}
      <ScheduleDrawer open={showSched} onClose={() => setShowSched(false)}/>

      <div className="tb-spacer"/>

      <button className="tb-ic" title="Navigator (⌘K)" onClick={onOpenNavigator}>
        <IconSearch size={15}/>
      </button>
      <button className="tb-ic" title="Keyboard shortcuts (?)" onClick={onOpenShortcuts}>
        <IconHash size={15}/>
      </button>
      <button className="tb-ic" title="Notifications">
        <IconBell size={15}/>
        {hasNotif && <span className="badge">3</span>}
      </button>
      <button className="tb-ic" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme">
        {theme === "dark" ? <IconSun size={15}/> : <IconMoon size={15}/>}
      </button>
      <div className="tb-profile">
        <Avatar m={ENGAGEMENT.members[0]} size="sm"/>
        <span style={{ fontSize: 11, color: "#fff", fontWeight: 500 }}>Janet H.</span>
      </div>
    </header>
  );
}

// ============================================================================
// LEFT RAIL — never mutates; project section swaps content (not chrome)
// ============================================================================

export function Rail({ route, onNav, projectActive }: { route: string; onNav: (id: string) => void; projectActive: boolean }) {
  const [sprintOpen, setSprintOpen] = React.useState<Record<string, boolean>>({ s1: true });
  const items = [
    { id: "my-work", label: "My Work", icon: <IconHome size={15}/>, count: "9" },
    { id: "smart-queue", label: "Smart Queue", icon: <IconBolt size={15}/>, count: "3" },
  ];
  const refItems = [
    { id: "navigator", label: "Navigator", icon: <IconLayout size={15}/> },
    { id: "methodology", label: "Methodology", icon: <IconActivity size={15}/> },
    { id: "innersource", label: "Inner Source", icon: <IconBox size={15}/>, count: "284" },
    { id: "cockpit", label: "Practice Cockpit", icon: <IconShield size={15}/> },
  ];
  const projItems = [
    { id: "project-home", label: "Overview", icon: <IconHome size={15}/> },
    { id: "schedule", label: "Schedule & Roadmap", icon: <IconCalendar size={14}/> },
    { id: "capabilities", label: "Capabilities", icon: <IconLayout size={15}/>, count: "12" },
    { id: "tasks", label: "Tasks & Sprints", icon: <IconKanban size={15}/>, count: "38" },
    { id: "pathfinder", label: "Pathfinder", icon: <IconBook size={15}/> },
    { id: "autopilot", label: "Configuration Autopilot", icon: <IconRobot size={15}/> },
    { id: "documents", label: "Documents", icon: <IconPaperclip size={14}/> },
  ];

  return (
    <aside className="rail">
      <div className="rail-section">
        <div className="rail-eyebrow first">Cross-project</div>
        {items.map(it => (
          <button key={it.id} className={`rail-row ${route === it.id ? "active" : ""}`} onClick={() => onNav(it.id)}>
            <span className="ic">{it.icon}</span>
            <span className="label">{it.label}</span>
            <span className="count">{it.count}</span>
          </button>
        ))}

        {projectActive && <>
          <div className="rail-eyebrow">Project</div>
          {projItems.map(it => (
            <button key={it.id} className={`rail-row ${route === it.id ? "active" : ""}`} onClick={() => onNav(it.id)}>
              <span className="ic">{it.icon}</span>
              <span className="label">{it.label}</span>
              {it.count && <span className="count">{it.count}</span>}
            </button>
          ))}

          <div style={{ padding: "8px 6px 4px" }}>
            <div className="uppercase-eyebrow" style={{ fontSize: 9, padding: "4px 8px", color: "var(--text-ghost)" }}>Sprints</div>
            {SPRINTS.map(sp => (
              <div key={sp.id}>
                <button className={`rail-sprint ${sp.status === "Active" ? "active" : ""}`} onClick={() => { setSprintOpen(o => ({ ...o, [sp.id]: !o[sp.id] })); onNav("tasks"); }}>
                  <IconChevR size={10} className="chev" style={{ transform: sprintOpen[sp.id] ? "rotate(90deg)" : "none", transition: "transform 150ms" }}/>
                  <span className="name">{sp.name.replace(/Sprint \d+ · /, "")}</span>
                  <span className={`pill ${sp.status === "Active" ? "pill-active" : sp.status === "Done" ? "pill-done" : "pill-planned"}`}>{sp.status === "Active" ? "Now" : sp.status === "Done" ? "Done" : "Plan"}</span>
                </button>
                {sprintOpen[sp.id] && sp.status === "Active" && (
                  <div className="rail-sprint-detail">
                    <div className="rail-sprint-bar"><div className="fill" style={{ width: `${sp.pct}%` }}/></div>
                    <div className="rail-sprint-meta">
                      <span>Day 4/10</span><span>{sp.tasks.done}/{sp.tasks.total} tasks</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>}

        <div className="rail-eyebrow">Reference</div>
        {refItems.map(it => (
          <button key={it.id} className={`rail-row ${route === it.id ? "active" : ""}`} onClick={() => onNav(it.id)}>
            <span className="ic">{it.icon}</span>
            <span className="label">{it.label}</span>
            {it.count && <span className="count">{it.count}</span>}
          </button>
        ))}
      </div>

      <div className="rail-spacer"/>

      <div className="rail-section">
        <div className="divider-h" style={{ margin: "8px 6px" }}/>
        <button className={`rail-row ${route === "components" ? "active" : ""}`} onClick={() => onNav("components")}>
          <span className="ic"><IconHash size={15}/></span>
          <span className="label">Components</span>
        </button>
        <button className={`rail-row ${route === "navspec" ? "active" : ""}`} onClick={() => onNav("navspec")}>
          <span className="ic"><IconBook size={15}/></span>
          <span className="label">Nav Spec</span>
        </button>
        <button className={`rail-row`}>
          <span className="ic"><IconCog size={15}/></span>
          <span className="label">Settings</span>
        </button>
      </div>
    </aside>
  );
}

// ============================================================================
// AI Floating launcher + overlay
// ============================================================================

export function AIAssistant({ context }: { context?: string | null }) {
  const [open, setOpen] = React.useState(false);
  const [msgs, setMsgs] = React.useState<Array<{ role: "assistant" | "user"; text: string }>>([
    { role: "assistant", text: "I can see you're configuring SOATERM in the Northern State engagement. Want help drafting the part-of-term DRC narrative, or generating test cases for the registration window logic?" },
  ]);
  const [draft, setDraft] = React.useState("");
  const send = () => {
    if (!draft.trim()) return;
    setMsgs(m => [...m, { role: "user", text: draft }]);
    setDraft("");
    setTimeout(() => setMsgs(m => [...m, { role: "assistant", text: "Drafted three acceptance-criteria scenarios for SFARCTL registration windows. Open the test-case panel to review and accept." }]), 400);
  };
  return <>
    {open && (
      <div className="ai-overlay">
        <div className="ai-head">
          <IconSparkles/>
          <div className="flex-col" style={{ gap: 1, lineHeight: 1.2 }}>
            <span className="name">N2S Copilot</span>
            <span className="ctx">{context || "OC: Term Code Configuration"}</span>
          </div>
          <button className="tb-ic" style={{ marginLeft: "auto" }} onClick={() => setOpen(false)}><IconClose size={14}/></button>
        </div>
        <div className="ai-msgs">
          {msgs.map((m, i) => (
            <div key={i} className={`ai-msg ${m.role}`}>
              {m.role === "assistant" && <div style={{ width: 22, height: 22, borderRadius: 11, background: "var(--gradient-button)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}><IconSparkles size={12}/></div>}
              <div className="bubble">{m.text}</div>
            </div>
          ))}
        </div>
        <div className="ai-suggest">
          <button>Generate test cases</button>
          <button>Summarize this OC</button>
          <button>Find inner source</button>
        </div>
        <div className="ai-input">
          <input placeholder="Ask Copilot…" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}/>
          <button className="btn btn-primary btn-icon" onClick={send}><IconSend size={13}/></button>
        </div>
      </div>
    )}
    <button className="ai-fab" onClick={() => setOpen(o => !o)} title="N2S Copilot">
      {open ? <IconClose size={18}/> : <IconSparkles size={18}/>}
    </button>
  </>;
}
