"use client";
// ============================================================================
// AUTOPILOT — Configuration Autopilot
// SPRINT PLANNING
// INNER SOURCE — Pattern library across engagements
// PRACTICE COCKPIT — Cross-engagement portfolio view
// ============================================================================

import * as React from "react";
import {
  IconRefresh, IconBolt, IconActivity, IconSparkles, IconCalendar, IconCheck,
  IconShield, IconPlus, IconArrowRight,
} from "@/components/icons";
import { Avatar } from "@/components/shell";
import { AUTOPILOT_RUNS, SPRINT_PLAN_BACKLOG, INNER_SOURCE, PORTFOLIO } from "@/lib/data";

type Pattern = (typeof INNER_SOURCE)[number];

export function Autopilot() {
  const runs = AUTOPILOT_RUNS;
  const [selected, setSelected] = React.useState(runs[0]);
  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Configuration Autopilot · Banner SaaS · Select tier</div>
          <h1 className="ph-title">Configuration Autopilot</h1>
          <p className="ph-sub">Continuous validation of NSU's Banner instance against N2S baselines and the assigned inner-source patterns. Drift, regressions, and best-practice gaps surfaced as runs — like CI for configuration. Last build pulled config snapshot from <span className="hov-link">stage-nsu-svc</span>.</p>
        </div>
        <div className="flex-row">
          <button className="btn"><IconRefresh/> Re-run baseline</button>
          <button className="btn btn-primary"><IconBolt/> Run on commit</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
          {[
            { l: "Last run", v: "passed", sub: "8m ago · build #284", tone: "emerald" },
            { l: "Drift score", v: "94%", sub: "+2% vs last week", tone: "emerald" },
            { l: "Open issues", v: "12", sub: "3 high · 9 low", tone: "amber" },
            { l: "Coverage", v: "76%", sub: "of 312 OCs validated" },
            { l: "Schedule", v: "every commit", sub: "+ nightly" },
          ].map(k => (
            <div key={k.l}>
              <div className="uppercase-eyebrow" style={{ marginBottom: 4 }}>{k.l}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: k.tone === "emerald" ? "var(--emerald)" : k.tone === "amber" ? "var(--amber)" : "var(--text-primary)" }}>{k.v}</div>
              <div className="muted mono" style={{ fontSize: 10, marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 14 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="card-head" style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}><IconActivity/><span className="ttl">Recent Runs</span></div>
          <div className="flex-col" style={{ gap: 0 }}>
            {runs.map(r => (
              <button key={r.id} className={`ap-run ${selected.id === r.id ? "active" : ""}`} onClick={() => setSelected(r)}>
                <span className={`ap-dot ${r.status}`}></span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div className="flex-row">
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{r.title}</span>
                    <span className="id-pill">#{r.build}</span>
                  </div>
                  <div className="muted mono" style={{ fontSize: 10, marginTop: 2 }}>{r.trigger} · {r.when} · {r.duration}</div>
                </div>
                <span className={`chip chip-mono ${r.status === "passed" ? "chip-emerald" : r.status === "failed" ? "chip-rose" : "chip-amber"}`}>{r.status}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="spread" style={{ marginBottom: 12 }}>
            <div>
              <div className="uppercase-eyebrow">Run #{selected.build} · {selected.title}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>Trigger: {selected.trigger} · {selected.duration}</div>
            </div>
            <span className={`chip chip-mono ${selected.status === "passed" ? "chip-emerald" : selected.status === "failed" ? "chip-rose" : "chip-amber"}`}>{selected.status}</span>
          </div>

          <div className="ap-stages">
            {selected.stages.map((s, i) => (
              <div key={i} className={`ap-stage ${s.state}`}>
                <span className="ap-stage-num">{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div className="spread">
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</span>
                    <span className="muted mono" style={{ fontSize: 10 }}>{s.dur}</span>
                  </div>
                  <div className="muted mono" style={{ fontSize: 10, marginTop: 2 }}>{s.detail}</div>
                </div>
                <span className={`ap-stage-dot ${s.state}`}></span>
              </div>
            ))}
          </div>

          <div className="divider-h" style={{ margin: "16px 0" }}/>
          <div className="uppercase-eyebrow" style={{ marginBottom: 8 }}>Findings</div>
          <div className="flex-col" style={{ gap: 6 }}>
            {selected.findings.map((f, i) => (
              <div key={i} className="ap-finding">
                <span className={`chip chip-mono ${f.sev === "high" ? "chip-rose" : f.sev === "med" ? "chip-amber" : "chip-ghost"}`}>{f.sev}</span>
                <span className="id-pill">{f.code}</span>
                <span style={{ fontSize: 12, color: "var(--text-primary)", flex: 1 }}>{f.text}</span>
                <button className="btn btn-tiny">Open OC</button>
              </div>
            ))}
          </div>

          <div className="divider-h" style={{ margin: "16px 0" }}/>
          <div className="uppercase-eyebrow" style={{ marginBottom: 8 }}>Build log</div>
          <pre className="oc-code" style={{ maxHeight: 200, overflow: "auto", fontSize: 11 }}>
            <code>{`[15:42:08] autopilot: pulling config snapshot from stage-nsu-svc
[15:42:11] autopilot: snapshot @ 78f3a2c · 1,847 records
[15:42:12] baseline: comparing against n2s-banner-saas-select v3.2
[15:42:14]   ✓ STVTERM (12 records)        match
[15:42:14]   ✓ STVRESD (24 records)        match
[15:42:15]   ✓ STVATTR (18 records)        match
[15:42:15]   ⚠ STVMAJR (47 records)        2 drift items (NSU-specific)
[15:42:16]   ✗ SOATERM (1 record · 202610) part-of-term flag NULL — DRC-2 unresolved
[15:42:17]   ✓ SFARCTL (1 record)          OK
[15:42:17] inner-source: scanning for matching patterns
[15:42:18]   matched 4 patterns from NSU-Term-2025
[15:42:18] complete: 1 high · 2 med · 9 low · 76% coverage`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SPRINT PLANNING — Drag-style backlog refinement w/ AI ranking
// ============================================================================
export function SprintPlanning() {
  const next = SPRINT_PLAN_BACKLOG;
  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Sprint 2 planning · May 12–23</div>
          <h1 className="ph-title">Sprint Planning</h1>
          <p className="ph-sub">Capacity-aware ranking. Copilot pre-ranks the backlog by go-live proximity, capability dependency, and historical velocity. You confirm — or override — and commit. The plan writes back to Smartsheet.</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="card">
          <div className="card-head"><IconSparkles/><span className="ttl">AI-ranked backlog</span><span className="muted mono" style={{ fontSize: 10, marginLeft: "auto" }}>104 items · 312h</span></div>
          <div className="flex-col" style={{ gap: 6, maxHeight: 540, overflow: "auto" }}>
            {next.map(t => (
              <div key={t.id} className="kanban-card" style={{ cursor: "grab" }}>
                <div className="flex-row" style={{ marginBottom: 4 }}>
                  <span className="id-pill">{t.id}</span>
                  <span className="chip chip-mono chip-violet">{t.cap}</span>
                  <span className="muted mono" style={{ fontSize: 10, marginLeft: "auto" }}>rank #{t.rank}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>{t.title}</div>
                <div className="flex-row" style={{ fontSize: 10 }}>
                  <span className="muted mono">{t.h}h · {t.priority}</span>
                  <span className="muted mono" style={{ marginLeft: "auto" }}>{t.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ background: "linear-gradient(180deg, rgba(147,51,234,0.06), transparent)" }}>
          <div className="card-head"><IconCalendar/><span className="ttl">Sprint 2 commit</span><span className="chip chip-accent" style={{ marginLeft: "auto" }}>14 selected · 142h / 168h</span></div>
          <div className="bar fill-emerald" style={{ marginBottom: 14 }}><div className="fill" style={{ width: "85%" }}/></div>
          <div className="flex-col" style={{ gap: 6 }}>
            {next.slice(0, 8).map(t => (
              <div key={t.id} className="oc-task-link" style={{ background: "var(--bg-elevated)" }}>
                <IconCheck size={12}/>
                <span className="id-pill">{t.id}</span>
                <span style={{ fontSize: 12, flex: 1 }}>{t.title}</span>
                <span className="muted mono" style={{ fontSize: 10 }}>{t.h}h</span>
              </div>
            ))}
          </div>
          <div className="divider-h" style={{ margin: "14px 0" }}/>
          <div className="oc-callout oc-callout-best-practice">
            <div className="oc-callout-head"><IconShield size={12}/><span>Copilot recommendation</span></div>
            <p>Drop NSU-187 to S3 — depends on FA office DRC unresolved this week. Pulls 14h that buys you flex for the SFARCTL spike.</p>
          </div>
          <div className="flex-row" style={{ marginTop: 16, justifyContent: "flex-end" }}>
            <button className="btn">Save draft</button>
            <button className="btn btn-primary">Commit · push to Jira & Smartsheet</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INNER SOURCE — Pattern library across engagements
// ============================================================================
export function InnerSource({ onOpenPattern }: { onOpenPattern?: (p: Pattern) => void }) {
  const items = INNER_SOURCE;
  const [q, setQ] = React.useState("");
  const filtered = items.filter(i => i.title.toLowerCase().includes(q.toLowerCase()) || i.tags.some(t => t.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">284 patterns · 47 engagements · 12 product lines</div>
          <h1 className="ph-title">Inner Source</h1>
          <p className="ph-sub">Reusable configuration patterns, scripts, and DRC templates contributed by consultants across the practice. Search by capability, product, or institution profile. Promote a pattern from your engagement after the go-live retro.</p>
        </div>
        <div className="flex-row">
          <input className="search-inp" placeholder="search · e.g. 'term rollover'" value={q} onChange={e => setQ(e.target.value)}/>
          <button className="btn btn-primary"><IconPlus/> Contribute</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {filtered.map(it => (
          <div key={it.id} className="card" style={{ cursor: "pointer" }} onClick={() => onOpenPattern && onOpenPattern(it)}>
            <div className="spread" style={{ marginBottom: 10 }}>
              <div className="flex-row">
                <span className="chip chip-mono chip-violet">{it.kind}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{it.title}</span>
              </div>
              <div className="flex-row" style={{ gap: 6 }}>
                <span className="muted mono" style={{ fontSize: 11 }}>★ {it.stars}</span>
                <span className="muted mono" style={{ fontSize: 11 }}>· used {it.used}×</span>
              </div>
            </div>
            <p className="muted" style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{it.desc}</p>
            <div className="flex-row" style={{ gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
              {it.tags.map(t => <span key={t} className="chip chip-ghost">{t}</span>)}
            </div>
            <div className="spread" style={{ paddingTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
              <div className="flex-row">
                <Avatar m={{ initials: it.contributor.split(" ").map(s => s[0]).join(""), color: "#3ee8a8" }} size="sm"/>
                <div className="flex-col" style={{ gap: 0, lineHeight: 1.2 }}>
                  <span style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 500 }}>{it.contributor}</span>
                  <span className="muted mono" style={{ fontSize: 9 }}>{it.engagement}</span>
                </div>
              </div>
              <button className="btn btn-tiny" onClick={(e) => { e.stopPropagation(); onOpenPattern && onOpenPattern(it); }}>Use pattern <IconArrowRight/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// PRACTICE COCKPIT — Cross-engagement portfolio view
// ============================================================================
export function Cockpit() {
  const eng = PORTFOLIO;
  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Practice Cockpit · 12 active engagements · $14.8M ARR</div>
          <h1 className="ph-title">Practice Cockpit</h1>
          <p className="ph-sub">Practice leader view across all of Janet's engagements. Same primitives — go-lives, capabilities, sprint health — rolled up to portfolio level. Click any engagement to drill in.</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { l: "Engagements", v: "12", sub: "9 build · 3 plan", tone: "" },
          { l: "On-track", v: "9", sub: "75% green", tone: "emerald" },
          { l: "At-risk", v: "2", sub: "CSU EB · UVM", tone: "amber" },
          { l: "Net velocity", v: "+8%", sub: "vs last quarter", tone: "emerald" },
        ].map(k => (
          <div key={k.l} className="card">
            <div className="uppercase-eyebrow" style={{ marginBottom: 4 }}>{k.l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: k.tone === "emerald" ? "var(--emerald)" : k.tone === "amber" ? "var(--amber)" : "var(--text-primary)" }}>{k.v}</div>
            <div className="muted mono" style={{ fontSize: 11, marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          {["Engagement", "Phase", "Next GL", "Readiness", "Sprint", "Health"].map(h => <div key={h} className="uppercase-eyebrow">{h}</div>)}
        </div>
        {eng.map(e => (
          <div key={e.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)", alignItems: "center", cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{e.name}</div>
              <div className="muted mono" style={{ fontSize: 10, marginTop: 2 }}>{e.product} · {e.tier}</div>
            </div>
            <div><span className="chip chip-ghost">{e.phase}</span></div>
            <div className="mono" style={{ fontSize: 12 }}>{e.nextGL}</div>
            <div>
              <div className="bar"><div className="fill" style={{ width: `${e.readiness}%`, background: e.readiness > 70 ? "var(--accent)" : e.readiness > 40 ? "var(--amber)" : "var(--rose)" }}/></div>
              <div className="muted mono" style={{ fontSize: 10, marginTop: 3 }}>{e.readiness}%</div>
            </div>
            <div className="mono" style={{ fontSize: 12 }}>{e.sprint}</div>
            <div><span className={`chip chip-mono ${e.health === "green" ? "chip-emerald" : e.health === "amber" ? "chip-amber" : "chip-rose"}`}>{e.health}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
