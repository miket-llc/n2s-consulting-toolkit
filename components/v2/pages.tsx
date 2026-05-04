"use client";

// Toolkit v2 — secondary destinations.

import * as React from "react";
import { useState } from "react";
import { Icon } from "./icons";
import {
  useApp, useHash, PageHero, Section, notImplemented,
} from "./shell";
import {
  TASKS, DRCS, WORKSHOPS, GO_LIVES, BUSINESS_CAPABILITIES,
  METHODOLOGY_PHASES, METHODOLOGY_CARDS, OC_INDEX, AUTOPILOT_RUNS,
} from "@/lib/data";

// ── MY WORK ──────────────────────────────────────────────────────────────
export function MyWorkPage() {
  const [, navigate] = useHash();
  const tasks = TASKS.filter(t => t.assignee === "jh" || !t.assignee);

  const buckets = [
    { id: "today",     label: "Today",        match: (t: typeof TASKS[number]) => t.dueRel === "today" },
    { id: "tomorrow",  label: "Tomorrow",     match: (t: typeof TASKS[number]) => t.dueRel === "tomorrow" },
    { id: "this-week", label: "This week",    match: (t: typeof TASKS[number]) => t.dueRel === "this-week" },
    { id: "later",     label: "Later",        match: (t: typeof TASKS[number]) => t.dueRel === "later" || !t.dueRel },
  ];

  return (
    <>
      <PageHero
        eyebrow="My work"
        headline="Your queue across every engagement"
        sub="Smart-ranked: P1 + urgent first, then by due date. Cross-engagement; click any row to open the source ticket."
        actions={
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("")}>
            <Icon name="grid" size={13}/>
            <span>Portfolio</span>
          </button>
        }
      />

      {buckets.map(b => {
        const items = tasks.filter(b.match);
        if (items.length === 0) return null;
        return (
          <Section key={b.id} eyebrow={b.label} title={`${items.length} ${items.length === 1 ? "item" : "items"}`}>
            <div className="v2-list">
              {items.map(t => {
                const tone = t.urgent ? "rose" : t.status === "Needs Review" ? "amber" : "accent";
                return (
                  <button key={t.id} className="v2-row" onClick={() => notImplemented(`Would open ${t.jiraId} in Jira`)}>
                    <span className={`v2-row-marker ${tone}`}/>
                    <div style={{ minWidth: 0 }}>
                      <div className="v2-row-title">{t.title}</div>
                      <div className="v2-row-sub">
                        <span>{t.project}</span>
                        <span> · </span>
                        <span>{t.status}</span>
                        <span className="v2-row-code"> · </span>
                        <span className="v2-row-code t-mono">{t.jiraId}</span>
                        <span className="v2-row-code"> · </span>
                        <span className="v2-row-code">{t.priority}</span>
                      </div>
                    </div>
                    <span className="v2-row-meta">{t.due}</span>
                    <Icon name="chevron-right" size={14} style={{ color: "var(--text-ghost)" }}/>
                  </button>
                );
              })}
            </div>
          </Section>
        );
      })}
    </>
  );
}

// ── DECISIONS ────────────────────────────────────────────────────────────
export function DecisionsPage() {
  const [, navigate] = useHash();
  const { currentProject } = useApp();
  const drcs = DRCS.filter(d => d.status !== "resolved" && d.status !== "closed");
  const sorted = [...drcs].sort((a, b) => {
    const aScore = (a.blockedCount || 0) * Math.max(a.daysStale || 1, 1);
    const bScore = (b.blockedCount || 0) * Math.max(b.daysStale || 1, 1);
    return bScore - aScore;
  });
  const stuck = sorted.filter(d => (d.daysStale || 0) >= 5).length;

  return (
    <>
      <PageHero
        eyebrow={`Project · ${currentProject?.name || "All"}`}
        headline="Client decisions"
        sub={`${sorted.length} open · ${stuck} stuck 5+ days · highest-impact at top. Each decision links to its OC guide section.`}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("project")}>
            <Icon name="home" size={13}/>
            <span>Project</span>
          </button>
        }
      />

      <div className="v2-list">
        {sorted.map(d => {
          const tone = (d.daysStale || 0) >= 7 ? "rose" : (d.daysStale || 0) >= 5 ? "amber" : "accent";
          const sevPill = d.severity === "high" ? "rose" : d.severity === "med" ? "amber" : "neutral";
          return (
            <button key={d.id} className="v2-row" onClick={() => notImplemented(`Would open ${d.code} · ${d.ocCode} ${d.ocSection}`)}>
              <span className={`v2-row-marker ${tone}`}/>
              <div style={{ minWidth: 0 }}>
                <div className="v2-row-title">{d.title}</div>
                <div className="v2-row-sub">
                  <span>{d.capabilityLabel}</span>
                  <span> · </span>
                  <span>Owned by {d.ownerName?.replace(/ \(.+\)/, "") || "client"}</span>
                  <span className="v2-row-code"> · </span>
                  <span className="v2-row-code t-mono">{d.code}</span>
                  <span className="v2-row-code"> · </span>
                  <span className="v2-row-code">{d.ocCode}</span>
                  <span> · </span>
                  <span>{d.daysStale}d open · blocks {d.blockedCount}</span>
                </div>
              </div>
              <span className={`pill pill-${sevPill}`}>{d.severity}</span>
              <span className="v2-row-meta">Due {d.dueBy}</span>
              <Icon name="chevron-right" size={14} style={{ color: "var(--text-ghost)" }}/>
            </button>
          );
        })}
      </div>
    </>
  );
}

// ── WORKSHOPS ────────────────────────────────────────────────────────────
export function WorkshopsPage() {
  const all = WORKSHOPS;
  const upcoming = all.filter(w => w.daysOut >= 0).sort((a, b) => a.daysOut - b.daysOut);
  const past = all.filter(w => w.daysOut < 0);

  type W = typeof WORKSHOPS[number];
  const Card = ({ w }: { w: W }) => (
    <button className="v2-cap-card" onClick={() => notImplemented(`Would open workshop · ${w.title}`)} style={{ textAlign: "left" }}>
      <div className="v2-cap-head">
        <span className="v2-cap-name">{w.title}</span>
        <span className="v2-cap-area">{w.focus}</span>
      </div>
      <div className="v2-cap-tag">{w.when}</div>
      <div className="v2-cap-foot">
        <span>{w.location}</span>
        <span>
          {w.scope?.drcs?.length || 0} decisions · {w.scope?.ocs?.length || 0} configs
        </span>
      </div>
    </button>
  );

  return (
    <>
      <PageHero
        eyebrow="Workshops"
        headline="Where decisions get made"
        sub="Each workshop targets a capability and resolves a set of decisions and config walks. Past sessions remain readable for replay."
      />

      {upcoming.length > 0 && (
        <Section eyebrow="Upcoming" title={`${upcoming.length} scheduled`}>
          <div className="v2-cap-grid">
            {upcoming.map(w => <Card key={w.id} w={w}/>)}
          </div>
        </Section>
      )}

      {past.length > 0 && (
        <Section eyebrow="Past" title={`${past.length} completed`}>
          <div className="v2-cap-grid">
            {past.map(w => <Card key={w.id} w={w}/>)}
          </div>
        </Section>
      )}
    </>
  );
}

// ── SCHEDULE ─────────────────────────────────────────────────────────────
export function SchedulePage() {
  const gls = [...GO_LIVES].sort((a, b) => a.daysOut - b.daysOut);

  return (
    <>
      <PageHero
        eyebrow="Schedule"
        headline="Go-lives ahead"
        sub="Each milestone shows readiness against scope. Click into a go-live to see the capability swimlanes."
      />

      <div className="stack gap-3">
        {gls.map(gl => {
          const tone = gl.status === "at-risk" ? "rose" : gl.status === "scoping" ? "amber" : "accent";
          const cls = ["v2-projcard",
            gl.status === "at-risk" ? "v2-projcard-bad" : "",
            gl.status === "scoping" ? "v2-projcard-attn" : ""].filter(Boolean).join(" ");
          return (
            <button key={gl.id} className={cls} onClick={() => notImplemented(`Would open go-live · ${gl.label}`)}>
              <div style={{ minWidth: 0 }}>
                <div className="v2-projcard-name">{gl.label}</div>
                <div className="v2-projcard-meta">
                  <span>{gl.product}</span>
                  <span>·</span>
                  <span>{gl.date}</span>
                  <span>·</span>
                  <span>in {gl.daysOut} days</span>
                  <span>·</span>
                  <span>covers {gl.scope.length} capabilities</span>
                </div>
                <div className="v2-projcard-line" style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", height: 6, background: "var(--bg-elevated)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      width: `${gl.readiness}%`,
                      background: gl.status === "at-risk" ? "var(--rose)" : gl.status === "scoping" ? "var(--amber)" : "var(--accent)",
                    }}/>
                  </div>
                </div>
              </div>
              <div className="v2-projcard-stat">
                <span className={`pill pill-${tone === "rose" ? "rose" : tone === "amber" ? "amber" : "neutral"} pill-dot`}>
                  {gl.status === "on-track" ? "On track" : gl.status === "at-risk" ? "At risk" : "Scoping"}
                </span>
                <div className="v2-projcard-readiness">{gl.readiness}%</div>
                <div className="t-meta">{`Next: ${gl.date}`}</div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

// ── CAPABILITIES ─────────────────────────────────────────────────────────
export function CapabilitiesPage() {
  const caps = BUSINESS_CAPABILITIES;
  const areas = ["Student", "Finance", "HR", "Cross"];

  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        headline="What we're configuring"
        sub="Each card shows configuration completion and the assigned go-live. Active capabilities are this sprint's focus."
      />

      {areas.map(area => {
        const items = caps.filter(c => c.area === area);
        if (items.length === 0) return null;
        return (
          <Section key={area} eyebrow={area} title={`${items.length} capabilities`}>
            <div className="v2-cap-grid">
              {items.map(bc => (
                <button key={bc.id} className="v2-cap-card" onClick={() => notImplemented(`Would open capability · ${bc.label}`)}>
                  <div className="v2-cap-head">
                    <span className="v2-cap-name">{bc.label}</span>
                    <span className="v2-cap-area">{bc.goLive}</span>
                  </div>
                  <div className="v2-cap-tag">{bc.tagline}</div>
                  <div className="v2-cap-bar">
                    <div className="v2-cap-bar-fill" style={{ width: `${bc.pct}%` }}/>
                  </div>
                  <div className="v2-cap-foot">
                    <span className="v2-cap-foot-counts">{bc.ocsDone}/{bc.ocsTotal} configs</span>
                    <span>{bc.pct}% · {bc.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </Section>
        );
      })}
    </>
  );
}

// ── METHODOLOGY ──────────────────────────────────────────────────────────
export function MethodologyPage() {
  const phases = METHODOLOGY_PHASES;
  const cards = METHODOLOGY_CARDS;
  const [filter, setFilter] = useState("all");

  const visible = filter === "all" ? cards : cards.filter(c => c.phase === filter);

  return (
    <>
      <PageHero
        eyebrow="Methodology · Pathfinder"
        headline="How we run an engagement"
        sub="Pathfinder methodology: ceremonies, artifacts, and gates by phase. Each card opens its template."
      />

      <div className="v2-list" style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, background: "transparent", border: "none" }}>
        <button className={`btn ${filter === "all" ? "btn-primary" : "btn-ghost"} btn-sm`} onClick={() => setFilter("all")}>All phases</button>
        {phases.map(p => (
          <button key={p.id} className={`btn ${filter === p.id ? "btn-primary" : "btn-ghost"} btn-sm`} onClick={() => setFilter(p.id)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="v2-cap-grid" style={{ marginTop: 16 }}>
        {visible.map(c => (
          <div key={c.id} className="v2-cap-card" style={{ cursor: "default" }}>
            <div className="v2-cap-head">
              <span className="v2-cap-name">{c.title}</span>
              <span className="v2-cap-area">{c.kind}</span>
            </div>
            <div className="v2-cap-tag">{c.desc}</div>
            <div className="v2-cap-foot">
              <span>{c.when || phases.find(p => p.id === c.phase)?.label}</span>
              <span>{c.linked?.length || 0} templates</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── ASK THE ASSISTANT ────────────────────────────────────────────────────
export function AskPage() {
  const [q, setQ] = useState("");
  const suggestions = [
    "What's blocking the NSU Sprint 1 demo?",
    "Summarize all open client decisions older than 5 days.",
    "Which capabilities are behind their target go-live?",
    "What changed in CSU East Bay this week?",
  ];

  return (
    <>
      <PageHero
        eyebrow="Assistant"
        headline="Ask anything about your portfolio"
        sub="Grounded in your live engagement data — Jira, Smartsheet, autopilot runs, and standup notes."
      />
      <div className="v2-brief">
        <div style={{ flex: 1 }}>
          <textarea
            placeholder="e.g. Which decisions should I chase today?"
            value={q}
            onChange={e => setQ(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: 14,
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontFamily: "inherit",
              fontSize: "var(--fs-body)",
              resize: "vertical",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
            }}
          />
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="t-eyebrow">Try</div>
            {suggestions.map(s => (
              <button key={s} className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }} onClick={() => setQ(s)}>
                <Icon name="ai" size={13}/>
                <span>{s}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="v2-brief-aside">
          <button className="btn btn-primary" disabled={!q}>
            <Icon name="ai" size={14}/>
            <span>Ask</span>
          </button>
          <div className="v2-brief-asidefoot">replies cite source records</div>
        </div>
      </div>
    </>
  );
}

// ── AUTOPILOT ────────────────────────────────────────────────────────────
type Run = typeof AUTOPILOT_RUNS[number];

function buildLogFor(r: Run) {
  const t0 = "[15:42:08]";
  const lines: string[] = [];
  lines.push(`${t0} autopilot: starting build #${r.build} · ${r.title}`);
  lines.push(`${t0} autopilot: trigger = ${r.trigger}`);
  r.stages.forEach((s, i) => {
    const mark = s.state === "ok" ? "✓" : s.state === "warn" ? "⚠" : s.state === "fail" ? "✗" : "·";
    lines.push(`${t0}   ${mark} stage ${i + 1}/${r.stages.length} · ${s.label.padEnd(28)} ${s.dur.padStart(6)}  ${s.detail}`);
  });
  if (r.findings && r.findings.length) {
    lines.push(`${t0} findings:`);
    r.findings.forEach(f => lines.push(`${t0}   [${f.sev.toUpperCase()}] ${f.code} — ${f.text}`));
  }
  const status = r.status.toUpperCase();
  lines.push(`${t0} complete: ${status} in ${r.duration}`);
  return lines.join("\n");
}

export function AutopilotPage() {
  const runs = AUTOPILOT_RUNS;
  const [selId, setSelId] = useState(runs[0]?.id);
  const selected = runs.find(r => r.id === selId) || runs[0];

  if (!selected) {
    return (
      <PageHero
        eyebrow="Autopilot"
        headline="No runs yet"
        sub="Autopilot will populate once the first config commit lands."
      />
    );
  }

  const stateTone = (s: string) => {
    if (s === "passed") return { pill: "emerald", label: "Passed" };
    if (s === "failed") return { pill: "rose",    label: "Failed" };
    if (s === "warned") return { pill: "amber",   label: "Warnings" };
    return { pill: "neutral", label: s };
  };

  const sevTone = (s: string) => s === "high" ? "rose" : s === "med" ? "amber" : "neutral";

  const high = runs.flatMap(r => r.findings || []).filter(f => f.sev === "high").length;
  const med  = runs.flatMap(r => r.findings || []).filter(f => f.sev === "med").length;
  const low  = runs.flatMap(r => r.findings || []).filter(f => f.sev === "low").length;
  const driftScore = Math.max(0, Math.min(100, Math.round(100 - (high * 6 + med * 2 + low * 0.5))));

  return (
    <>
      <PageHero
        eyebrow="Autopilot · Banner SaaS · Select tier"
        headline="Configuration Autopilot"
        sub="Continuous validation of NSU's Banner instance against N2S baselines and assigned inner-source patterns. Each saved-form commit triggers a build — snapshot, compare, match, test, report. Drift, regressions, and best-practice gaps surface as findings."
        actions={
          <>
            <button className="btn btn-secondary btn-sm">
              <Icon name="refresh" size={13}/>
              <span>Re-run baseline</span>
            </button>
            <button className="btn btn-primary btn-sm">
              <Icon name="bolt" size={13}/>
              <span>Run on commit</span>
            </button>
          </>
        }
      />

      <div className="v2-ap-stats">
        {[
          { l: "Last run",      v: stateTone(selected.status).label, sub: `${selected.when} · build #${selected.build}`, tone: stateTone(selected.status).pill },
          { l: "Drift score",   v: `${driftScore}%`,                  sub: "vs N2S baseline",                              tone: driftScore > 90 ? "emerald" : driftScore > 75 ? "amber" : "rose" },
          { l: "Open findings", v: `${high + med + low}`,             sub: `${high} high · ${med} med · ${low} low`,       tone: high ? "rose" : med ? "amber" : "neutral" },
          { l: "Coverage",      v: "76%",                              sub: "of 312 OCs validated",                         tone: "neutral" },
          { l: "Cadence",       v: "every commit",                     sub: "+ nightly @ 02:00",                            tone: "neutral" },
        ].map(k => (
          <div key={k.l} className="v2-ap-stat">
            <div className="t-eyebrow">{k.l}</div>
            <div className={`v2-ap-stat-v tone-${k.tone}`}>{k.v}</div>
            <div className="v2-ap-stat-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="v2-ap-grid">
        <div className="v2-ap-pane">
          <div className="v2-ap-pane-head">
            <span className="t-eyebrow">Recent runs</span>
            <span className="v2-ap-pane-headmeta">{runs.length} builds</span>
          </div>
          <div className="v2-ap-runs">
            {runs.map(r => {
              const t = stateTone(r.status);
              return (
                <button key={r.id} className={`v2-ap-run ${selected.id === r.id ? "is-active" : ""}`} onClick={() => setSelId(r.id)}>
                  <span className={`v2-ap-rundot tone-${t.pill}`}/>
                  <div style={{ minWidth: 0, flex: 1, textAlign: "left" }}>
                    <div className="v2-ap-runtitle">{r.title}</div>
                    <div className="v2-ap-runmeta">
                      <span className="t-mono">#{r.build}</span>
                      <span> · </span>
                      <span>{r.trigger}</span>
                      <span> · </span>
                      <span>{r.when}</span>
                    </div>
                  </div>
                  <span className={`pill pill-${t.pill}`}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="v2-ap-pane">
          <div className="v2-ap-pane-head">
            <div style={{ minWidth: 0 }}>
              <div className="t-eyebrow">{`Build #${selected.build}`}</div>
              <div className="v2-ap-runtitle" style={{ fontSize: 15, marginTop: 2 }}>{selected.title}</div>
              <div className="v2-ap-runmeta" style={{ marginTop: 4 }}>
                Trigger: {selected.trigger} · {selected.duration}
              </div>
            </div>
            <span className={`pill pill-${stateTone(selected.status).pill}`}>{stateTone(selected.status).label}</span>
          </div>

          <div className="v2-ap-stages">
            {selected.stages.map((s, i) => (
              <div key={i} className={`v2-ap-stage tone-${s.state === "ok" ? "ok" : s.state === "warn" ? "warn" : s.state === "fail" ? "fail" : "skip"}`}>
                <span className="v2-ap-stagenum">{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="v2-ap-stagerow">
                    <span className="v2-ap-stagelabel">{s.label}</span>
                    <span className="v2-ap-stagedur">{s.dur}</span>
                  </div>
                  <div className="v2-ap-stagedetail">{s.detail}</div>
                </div>
                <span className={`v2-ap-stageicon tone-${s.state === "ok" ? "ok" : s.state === "warn" ? "warn" : s.state === "fail" ? "fail" : "skip"}`}>
                  {s.state === "ok"   && <Icon name="check"  size={12}/>}
                  {s.state === "warn" && <Icon name="alert"  size={12}/>}
                  {s.state === "fail" && <Icon name="x"      size={12}/>}
                  {s.state === "skip" && <Icon name="minus"  size={12}/>}
                </span>
              </div>
            ))}
          </div>

          {selected.findings && selected.findings.length > 0 && (
            <>
              <div className="v2-ap-divider"/>
              <div className="t-eyebrow" style={{ marginBottom: 10, paddingLeft: 18, paddingTop: 16 }}>Findings</div>
              <div className="stack gap-2">
                {selected.findings.map((f, i) => (
                  <div key={i} className="v2-ap-finding">
                    <span className={`pill pill-${sevTone(f.sev)}`}>{f.sev}</span>
                    <span className="t-mono v2-ap-findingcode">{f.code}</span>
                    <span className="v2-ap-findingtext">{f.text}</span>
                    <button className="btn btn-ghost btn-sm">
                      <span>Open</span>
                      <Icon name="chevron-right" size={12}/>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {selected.findings && selected.findings.length === 0 && (
            <>
              <div className="v2-ap-divider"/>
              <div className="v2-ap-clean">
                <Icon name="check" size={14}/>
                <span>No findings — configuration matches baseline and all linked tests passed.</span>
              </div>
            </>
          )}

          <div className="v2-ap-divider"/>
          <div className="t-eyebrow" style={{ marginBottom: 10, paddingLeft: 18, paddingTop: 16 }}>Build log</div>
          <pre className="v2-ap-log">
            <code>{buildLogFor(selected)}</code>
          </pre>
        </div>
      </div>
    </>
  );
}

// ── SETTINGS ─────────────────────────────────────────────────────────────
export function SettingsPage() {
  const { theme, setTheme, defaultLanding, setDefaultLanding } = useApp();

  return (
    <>
      <PageHero
        eyebrow="Settings"
        headline="Preferences"
        sub="Per-user toolkit settings. Stored locally."
      />

      <Section eyebrow="View" title="Theme and launch screen">
        <div className="v2-list">
          <div className="v2-row" style={{ cursor: "default" }}>
            <span className="v2-row-marker accent"/>
            <div style={{ minWidth: 0 }}>
              <div className="v2-row-title">Theme</div>
              <div className="v2-row-sub">Currently {theme}.</div>
            </div>
            <div className="v2-mode-toggle">
              <button className={theme === "light" ? "active" : ""} onClick={() => setTheme("light")}>Light</button>
              <button className={theme === "dark" ? "active" : ""} onClick={() => setTheme("dark")}>Dark</button>
            </div>
          </div>
          <div className="v2-row" style={{ cursor: "default" }}>
            <span className="v2-row-marker accent"/>
            <div style={{ minWidth: 0 }}>
              <div className="v2-row-title">Launch screen</div>
              <div className="v2-row-sub">What opens when you start the toolkit.</div>
            </div>
            <div className="v2-mode-toggle">
              <button className={defaultLanding === "practice" ? "active" : ""} onClick={() => setDefaultLanding("practice")}>Portfolio</button>
              <button className={defaultLanding === "project" ? "active" : ""} onClick={() => setDefaultLanding("project")}>Project</button>
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="Account" title="Janet Hawkins · Lead Consultant">
        <div className="v2-list">
          <div className="v2-row" style={{ cursor: "default" }}>
            <span className="v2-row-marker accent"/>
            <div style={{ minWidth: 0 }}>
              <div className="v2-row-title">Connected sources</div>
              <div className="v2-row-sub">Jira · Smartsheet · Autopilot · Standup notes</div>
            </div>
            <span className="pill pill-neutral pill-dot">All connected</span>
          </div>
        </div>
      </Section>
    </>
  );
}

// ── GUIDES ───────────────────────────────────────────────────────────────
export function GuidesPage() {
  const ocs = OC_INDEX;

  const status = (s: string) => {
    if (s === "approved") return { tone: "emerald", label: "Approved" };
    if (s === "in-review") return { tone: "amber", label: "In review" };
    if (s === "in-progress") return { tone: "neutral", label: "In progress" };
    return { tone: "neutral", label: s };
  };

  return (
    <>
      <PageHero
        eyebrow="Guides"
        headline="Configuration guides"
        sub="Per-form OC guides. Each one walks the build, captures the decisions made, and links its DRCs."
      />

      <div className="v2-list">
        {ocs.map(oc => {
          const s = status(oc.status);
          return (
            <button key={oc.id} className="v2-row" onClick={() => notImplemented(`Would open OC · ${oc.code} ${oc.title}`)}>
              <span className={`v2-row-marker ${s.tone === "emerald" ? "accent" : s.tone}`}/>
              <div style={{ minWidth: 0 }}>
                <div className="v2-row-title">{oc.title}</div>
                <div className="v2-row-sub">
                  <span>{oc.cap}</span>
                  <span className="v2-row-code"> · </span>
                  <span className="v2-row-code t-mono">{oc.code}</span>
                  <span> · </span>
                  <span>updated {oc.updated}</span>
                </div>
              </div>
              <span className={`pill pill-${s.tone}`}>{s.label}</span>
              <Icon name="chevron-right" size={14} style={{ color: "var(--text-ghost)" }}/>
            </button>
          );
        })}
      </div>
    </>
  );
}
