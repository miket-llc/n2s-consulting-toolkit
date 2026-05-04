"use client";

// Project Home — timeline-first.

import * as React from "react";
import { useState, useMemo } from "react";
import { Icon, IconName } from "./icons";
import {
  useApp, useHash, PageHero, BriefBody, Section,
} from "./shell";
import { composeBrief } from "@/lib/brief";
import {
  METHODOLOGY_PHASES, METHODOLOGY_CARDS, BUSINESS_CAPABILITIES, OC_INDEX,
  WORKSHOPS, DRCS, TASKS, GO_LIVES,
} from "@/lib/data";

type Phase = typeof METHODOLOGY_PHASES[number];

function ProjectBrief() {
  const { currentProject } = useApp();
  const [, navigate] = useHash();
  const brief = composeBrief("project", { now: new Date(), projectId: currentProject?.id });

  return (
    <div className="v2-brief">
      <div>
        <div className="v2-brief-eyebrow">
          <Icon name="ai" size={13}/>
          <span>The brief · {currentProject?.name}</span>
        </div>
        <p className="v2-brief-body">
          <BriefBody fragments={brief.fragments}/>
        </p>
        <div className="v2-brief-meta">
          <span>Composed {brief.time} · {brief.date}</span>
          <span>·</span>
          <span>Pulled from Jira, Smartsheet, the autopilot run feed, and standup notes.</span>
        </div>
      </div>
      <div className="v2-brief-aside">
        <button className="btn btn-primary" onClick={() => navigate("decisions")}>
          <Icon name="decisions" size={14}/>
          <span>See open decisions</span>
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("ai")}>
          <Icon name="ai" size={13}/>
          <span>Ask a follow-up</span>
        </button>
        <div className="v2-brief-asidefoot">refreshes hourly</div>
      </div>
    </div>
  );
}

function PhaseRibbon({ phases, projectPhaseId, focusedId, onFocus, progressPct }: {
  phases: Phase[]; projectPhaseId: string; focusedId: string;
  onFocus: (id: string) => void; progressPct: number;
}) {
  const focusedIndex = phases.findIndex(p => p.id === focusedId);
  const currentIndex = phases.findIndex(p => p.id === projectPhaseId);

  return (
    <div className="v2-ribbon" role="tablist" aria-label="Methodology phases">
      {phases.map((p, i) => {
        const isPast    = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isFuture  = i > currentIndex;
        const isFocused = i === focusedIndex;
        const cls = [
          "v2-ribbon-cell",
          isPast    ? "is-past"    : "",
          isCurrent ? "is-current" : "",
          isFuture  ? "is-future"  : "",
          isFocused ? "is-active"  : "",
        ].filter(Boolean).join(" ");
        const status = isPast ? "Done" : isCurrent ? "Active" : "Upcoming";
        return (
          <button key={p.id} className={cls} onClick={() => onFocus(p.id)} role="tab" aria-selected={isFocused}>
            <span className="v2-ribbon-num">Phase {i + 1}</span>
            <span className="v2-ribbon-name">{p.label}</span>
            <span className="v2-ribbon-meta">
              <span className="v2-ribbon-pill">{status}</span>
              <span>·</span>
              <span>{p.weeks}</span>
            </span>
            {isCurrent && (
              <span className="v2-ribbon-progress" style={{ width: `${progressPct}%` }}/>
            )}
          </button>
        );
      })}
    </div>
  );
}

type Sprint = { label: string; day: number; length: number; demo: string };

function parseSprint(s: string | undefined): Sprint {
  const fallback: Sprint = { label: "Sprint 1", day: 1, length: 10, demo: "Fri May 9" };
  if (!s) return fallback;
  const sm = s.match(/S(\d+)/i);
  const dm = s.match(/D(\d+)\s*\/\s*(\d+)/i);
  return {
    label: sm ? `Sprint ${sm[1]}` : s,
    day: dm ? parseInt(dm[1], 10) : 1,
    length: dm ? parseInt(dm[2], 10) : 10,
    demo: "Fri May 9",
  };
}

type ProjectData = {
  capabilities: typeof BUSINESS_CAPABILITIES;
  workshopsInPhase: typeof WORKSHOPS;
  drcsInPhase: typeof DRCS;
  configsInPhase: typeof OC_INDEX;
  sprintTasks: typeof TASKS;
  sprint: Sprint;
};

function PhaseArtifacts({ phase }: { phase: Phase }) {
  const cards = METHODOLOGY_CARDS.filter(c => c.phase === phase.id);
  if (cards.length === 0) {
    return <div style={{ color: "var(--text-muted)", fontSize: "var(--fs-meta)" }}>No artifacts indexed for this phase yet.</div>;
  }
  return (
    <div className="v2-cap-grid">
      {cards.map(c => (
        <div key={c.id} className="v2-cap-card" style={{ cursor: "default" }}>
          <div className="v2-cap-head">
            <span className="v2-cap-name">{c.title}</span>
            <span className="v2-cap-area">{c.kind}</span>
          </div>
          <div className="v2-cap-tag">{c.desc}</div>
          <div className="v2-cap-foot">
            <span>{c.when}</span>
            <span>{c.linked?.length || 0} templates</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function StageDetail({ phase, isCurrent, projectData }: {
  phase: Phase; isCurrent: boolean; projectData: ProjectData;
}) {
  const [, navigate] = useHash();
  const { capabilities, workshopsInPhase, drcsInPhase, configsInPhase, sprintTasks, sprint } = projectData;

  if (!isCurrent) {
    return (
      <div className="v2-stage">
        <div className="v2-stage-head">
          <div>
            <div className="v2-stage-eyebrow">
              <Icon name="schedule" size={12}/>
              <span>Phase preview</span>
            </div>
            <h2 className="v2-stage-name">{phase.label}</h2>
            <p className="v2-stage-desc">{phase.desc}</p>
          </div>
          <div style={{ textAlign: "right", color: "var(--text-muted)", fontSize: "var(--fs-meta)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-small)", color: "var(--text-primary)", fontWeight: 600 }}>{phase.weeks}</div>
            <div style={{ marginTop: 4 }}>{phase.id === "discover" || phase.id === "design" ? "Completed" : "Upcoming"}</div>
          </div>
        </div>
        <div className="v2-stage-body">
          <div className="v2-stage-sec">
            <div className="v2-stage-sec-head">
              <div>
                <div className="v2-stage-sec-title">What happens here</div>
                <div className="v2-stage-sec-sub">From the Pathfinder methodology — see the methodology library for full ceremony, artifact and gate definitions.</div>
              </div>
              <button className="btn-link" onClick={() => navigate(`library#${phase.id}`)}>Open in Methodology →</button>
            </div>
            <PhaseArtifacts phase={phase}/>
          </div>
        </div>
      </div>
    );
  }

  const topDrc = drcsInPhase[0];

  return (
    <div className="v2-stage">
      <div className="v2-stage-head">
        <div>
          <div className="v2-stage-eyebrow">
            <Icon name="play" size={12}/>
            <span>You are here · {sprint.label}</span>
          </div>
          <h2 className="v2-stage-name">{phase.label} · {phase.weeks}</h2>
          <p className="v2-stage-desc">{phase.desc}</p>
        </div>
        <div style={{ textAlign: "right", color: "var(--text-muted)", fontSize: "var(--fs-meta)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-small)", color: "var(--text-primary)", fontWeight: 600 }}>Day {sprint.day}/{sprint.length}</div>
          <div style={{ marginTop: 4 }}>Demo {sprint.demo}</div>
        </div>
      </div>

      <div className="v2-stage-stats">
        <div className="v2-stage-stat">
          <span className="v2-stage-stat-label">Capabilities in build</span>
          <span className="v2-stage-stat-value">{capabilities.length}</span>
        </div>
        <div className="v2-stage-stat">
          <span className="v2-stage-stat-label">Open decisions</span>
          <span className={`v2-stage-stat-value ${drcsInPhase.length > 0 ? "warn" : "good"}`}>{drcsInPhase.length}</span>
        </div>
        <div className="v2-stage-stat">
          <span className="v2-stage-stat-label">Configs in flight</span>
          <span className="v2-stage-stat-value">{configsInPhase.length}</span>
        </div>
        <div className="v2-stage-stat">
          <span className="v2-stage-stat-label">Workshops next 14d</span>
          <span className="v2-stage-stat-value">{workshopsInPhase.length}</span>
        </div>
        <div className="v2-stage-stat">
          <span className="v2-stage-stat-label">Sprint commitment</span>
          <span className="v2-stage-stat-value">{sprintTasks.length}</span>
        </div>
      </div>

      {topDrc && (
        <button className="v2-stage-banner" onClick={() => navigate("decisions")} style={{ width: "100%", textAlign: "left", cursor: "pointer" }}>
          <div className="v2-stage-banner-icon">
            <Icon name="decisions" size={15}/>
          </div>
          <div className="v2-stage-banner-text">
            <strong>{drcsInPhase.length} client decisions</strong> are holding back this stage. Top blocker: <strong>{topDrc.title}</strong> — owned by {topDrc.ownerName?.replace(/ \(.+\)/, "")}, holds {topDrc.blockedCount || 0} tasks.
          </div>
          <Icon name="chevron-right" size={14} style={{ color: "var(--text-muted)" }}/>
        </button>
      )}

      <div className="v2-stage-body">
        <div className="v2-stage-sec">
          <div className="v2-stage-sec-head">
            <div>
              <div className="v2-stage-sec-title">
                Capabilities in this stage
                <span className="v2-stage-sec-count">{capabilities.length}</span>
              </div>
              <div className="v2-stage-sec-sub">Business capabilities being configured this sprint. Each tracks toward its assigned go-live.</div>
            </div>
          </div>
          <div className="v2-cap-grid">
            {capabilities.map(bc => (
              <button key={bc.id} className="v2-cap-card" onClick={() => navigate(`capabilities`)}>
                <div className="v2-cap-head">
                  <span className="v2-cap-name">{bc.label}</span>
                  <span className="v2-cap-area">{bc.area}</span>
                </div>
                <div className="v2-cap-tag">{bc.tagline}</div>
                <div className="v2-cap-bar">
                  <div className="v2-cap-bar-fill" style={{ width: `${bc.pct}%` }}/>
                </div>
                <div className="v2-cap-foot">
                  <span className="v2-cap-foot-counts">{bc.ocsDone}/{bc.ocsTotal} configs</span>
                  <span>{bc.pct}% · {bc.goLive}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {workshopsInPhase.length > 0 && (
          <div className="v2-stage-sec">
            <div className="v2-stage-sec-head">
              <div>
                <div className="v2-stage-sec-title">
                  Workshops scheduled
                  <span className="v2-stage-sec-count">{workshopsInPhase.length}</span>
                </div>
                <div className="v2-stage-sec-sub">Decisions get made in workshops. Each one drives configs and resolves DRCs.</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {workshopsInPhase.map(w => (
                <button key={w.id} className="v2-row" onClick={() => navigate("workshops")}>
                  <span className="v2-row-marker accent"/>
                  <div style={{ minWidth: 0 }}>
                    <div className="v2-row-title">{w.title}</div>
                    <div className="v2-row-sub">
                      <span>{w.when}</span>
                      <span> · </span>
                      <span>{w.scope?.drcs?.length || 0} decisions to make</span>
                      <span> · </span>
                      <span>{w.scope?.ocs?.length || 0} configs walked</span>
                    </div>
                  </div>
                  <span className="v2-row-meta">{w.daysOut > 0 ? `in ${w.daysOut}d` : "today"}</span>
                  <Icon name="chevron-right" size={14} style={{ color: "var(--text-ghost)" }}/>
                </button>
              ))}
            </div>
          </div>
        )}

        {configsInPhase.length > 0 && (
          <div className="v2-stage-sec">
            <div className="v2-stage-sec-head">
              <div>
                <div className="v2-stage-sec-title">
                  Configuration guides in progress
                  <span className="v2-stage-sec-count">{configsInPhase.length}</span>
                </div>
                <div className="v2-stage-sec-sub">Per-form guides — the artifact this stage produces.</div>
              </div>
              <button className="btn-link" onClick={() => navigate("guides")}>See all guides →</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {configsInPhase.slice(0, 4).map(oc => {
                const tone = oc.status === "approved" ? "emerald" : oc.status === "in-review" ? "amber" : oc.status === "in-progress" ? "accent" : "neutral";
                return (
                  <button key={oc.id} className="v2-row" onClick={() => navigate("guides")}>
                    <span className={`v2-row-marker ${tone}`}/>
                    <div style={{ minWidth: 0 }}>
                      <div className="v2-row-title">{oc.title}</div>
                      <div className="v2-row-sub">
                        <span className="v2-row-code t-mono">{oc.code}</span>
                        <span className="v2-row-code"> · </span>
                        <span>{oc.status}</span>
                        <span> · </span>
                        <span>updated {oc.updated}</span>
                      </div>
                    </div>
                    <Icon name="chevron-right" size={14} style={{ color: "var(--text-ghost)" }}/>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="v2-stage-sec">
          <div className="v2-stage-sec-head">
            <div>
              <div className="v2-stage-sec-title">
                Your sprint commitment
                <span className="v2-stage-sec-count">{sprintTasks.length}</span>
              </div>
              <div className="v2-stage-sec-sub">Today and tomorrow on Janet&apos;s plate. Full sprint board lives in My work.</div>
            </div>
            <button className="btn-link" onClick={() => navigate("mywork")}>Open My work →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {sprintTasks.slice(0, 5).map(t => (
              <button key={t.id} className="v2-row" onClick={() => navigate("mywork")}>
                <span className={`v2-row-marker ${t.urgent ? "rose" : "accent"}`}/>
                <div style={{ minWidth: 0 }}>
                  <div className="v2-row-title">{t.title}</div>
                  <div className="v2-row-sub">
                    <span>{t.status}</span>
                    <span className="v2-row-code"> · </span>
                    <span className="v2-row-code t-mono">{t.jiraId}</span>
                    <span> · </span>
                    <span>{t.commentCount || 0} comments</span>
                  </div>
                </div>
                <span className="v2-row-meta">{t.due}</span>
                <Icon name="chevron-right" size={14} style={{ color: "var(--text-ghost)" }}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type CalEvent = {
  id: string; daysOut: number; dayNum: number; dayMonth: string;
  title: string; sub: string; kind: "workshop" | "training" | "gate" | "milestone" | "demo";
  icon: IconName; route?: string;
};

function CalendarView({ events }: { events: CalEvent[] }) {
  const [, navigate] = useHash();
  const weeks = useMemo(() => {
    const out: Array<{ wk: number; label: string; range: string; events: CalEvent[] }> = [];
    const sorted = [...events].sort((a, b) => a.daysOut - b.daysOut);
    let currentWeek: typeof out[number] | null = null;
    for (const e of sorted) {
      const wk = Math.floor(e.daysOut / 7);
      if (!currentWeek || currentWeek.wk !== wk) {
        currentWeek = { wk, label: wk === 0 ? "This week" : wk === 1 ? "Next week" : `In ${wk} weeks`, range: weekRange(wk), events: [] };
        out.push(currentWeek);
      }
      currentWeek.events.push(e);
    }
    return out;
  }, [events]);

  return (
    <div className="v2-cal">
      {weeks.map((w, i) => (
        <div key={i} className="v2-cal-week">
          <div className="v2-cal-week-head">
            <strong>{w.label}</strong>
            <span>{w.range}</span>
          </div>
          {w.events.map(e => (
            <button key={e.id} className="v2-cal-event" onClick={() => e.route && navigate(e.route)}>
              <span className="v2-cal-event-date">
                <strong>{e.dayNum}</strong>
                <span>{e.dayMonth}</span>
              </span>
              <div>
                <div className="v2-cal-event-title">{e.title}</div>
                <div className="v2-cal-event-sub">{e.sub}</div>
              </div>
              <span className={`v2-cal-event-icon ${e.kind}`}>
                <Icon name={e.icon} size={13}/>
              </span>
              <Icon name="chevron-right" size={14} style={{ color: "var(--text-ghost)" }}/>
            </button>
          ))}
        </div>
      ))}
      {weeks.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: "var(--fs-small)" }}>
          Nothing scheduled in this view.
        </div>
      )}
    </div>
  );
}

function weekRange(wk: number) {
  const start = new Date();
  start.setDate(start.getDate() + wk * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function HomePage() {
  const [, navigate] = useHash();
  const { currentProject } = useApp();

  const phases = METHODOLOGY_PHASES;
  const projectPhaseId = (currentProject?.phase || "Build").toLowerCase();
  const [focusedPhase, setFocusedPhase] = useState(projectPhaseId);
  const [viewMode, setViewMode] = useState<"timeline" | "calendar">("timeline");

  const focused = phases.find(p => p.id === focusedPhase) || phases[2];
  const isCurrent = focused.id === projectPhaseId;

  const projectData: ProjectData = useMemo(() => {
    const capabilities = BUSINESS_CAPABILITIES.filter(c => c.status === "active" && c.sprint === "s1");
    const workshopsInPhase = WORKSHOPS.filter(w => w.daysOut >= 0 && w.daysOut <= 14);
    const drcsInPhase = [...DRCS]
      .filter(d => d.status !== "resolved")
      .map(d => ({ ...d, _score: (d.blockedCount || 0) * Math.max(d.daysStale || 1, 1) }))
      .sort((a, b) => b._score - a._score);
    const configsInPhase = OC_INDEX.filter(oc => oc.status === "in-progress" || oc.status === "in-review");
    const sprintTasks = TASKS.filter(t => t.assignee === "jh" && (t.dueRel === "today" || t.dueRel === "tomorrow"));

    return {
      capabilities,
      workshopsInPhase,
      drcsInPhase,
      configsInPhase,
      sprintTasks,
      sprint: parseSprint(currentProject?.sprint),
    };
  }, [currentProject?.id, currentProject?.sprint]);

  const calendarEvents = useMemo(() => {
    const out: CalEvent[] = [];
    WORKSHOPS.forEach(w => {
      if (w.daysOut < 0 || w.daysOut > 60) return;
      const d = new Date(); d.setDate(d.getDate() + w.daysOut);
      out.push({
        id: w.id,
        daysOut: w.daysOut,
        dayNum: d.getDate(),
        dayMonth: d.toLocaleDateString(undefined, { month: "short" }),
        title: w.title,
        sub: `${w.duration} · ${w.scope?.drcs?.length || 0} decisions · ${w.scope?.ocs?.length || 0} configs`,
        kind: "workshop",
        icon: "workshops",
        route: "workshops",
      });
    });
    GO_LIVES.forEach(gl => {
      if (gl.daysOut < 0) return;
      const d = new Date(); d.setDate(d.getDate() + gl.daysOut);
      out.push({
        id: gl.id,
        daysOut: gl.daysOut,
        dayNum: d.getDate(),
        dayMonth: d.toLocaleDateString(undefined, { month: "short" }),
        title: gl.label,
        sub: `${gl.product} · ${gl.readiness}% ready · ${gl.daysOut} days out`,
        kind: "milestone",
        icon: "schedule",
        route: "schedule",
      });
    });
    out.push({
      id: "gate-build",
      daysOut: 21,
      dayNum: new Date(Date.now() + 21 * 86400000).getDate(),
      dayMonth: new Date(Date.now() + 21 * 86400000).toLocaleDateString(undefined, { month: "short" }),
      title: "Build → Validate gate",
      sub: "All HR/Payroll OCs locked · UAT entry checklist signed",
      kind: "gate",
      icon: "guides",
      route: "library",
    });
    return out.sort((a, b) => a.daysOut - b.daysOut);
  }, []);

  const buildProgress = 33;

  return (
    <>
      <PageHero
        eyebrow={`Project · ${currentProject?.product || "Banner SaaS"} · ${currentProject?.tier || ""}`}
        headline={currentProject?.name || "Project"}
        sub={`${currentProject?.phase || "Build"} phase · ${currentProject?.sprint || "Sprint 1"} · ${currentProject?.readiness || 78}% ready · next go-live ${currentProject?.nextGL || ""}`}
        actions={
          <>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("")}>
              <Icon name="grid" size={13}/>
              <span>Back to portfolio</span>
            </button>
            <div className="v2-viewtoggle">
              <button
                className={viewMode === "timeline" ? "active" : ""}
                onClick={() => setViewMode("timeline")}
              >
                <Icon name="schedule" size={12}/>
                <span>Timeline</span>
              </button>
              <button
                className={viewMode === "calendar" ? "active" : ""}
                onClick={() => setViewMode("calendar")}
              >
                <Icon name="workshops" size={12}/>
                <span>Calendar</span>
              </button>
            </div>
          </>
        }
      />

      <ProjectBrief/>

      {viewMode === "timeline" ? (
        <>
          <PhaseRibbon
            phases={phases}
            projectPhaseId={projectPhaseId}
            focusedId={focusedPhase}
            onFocus={setFocusedPhase}
            progressPct={buildProgress}
          />
          <StageDetail
            phase={focused}
            isCurrent={isCurrent}
            projectData={projectData}
          />
        </>
      ) : (
        <Section
          eyebrow="What's coming"
          title="Calendar · workshops, go-lives, gates"
          sub="The same data as the timeline view, pivoted to dates."
        >
          <CalendarView events={calendarEvents}/>
        </Section>
      )}
    </>
  );
}
