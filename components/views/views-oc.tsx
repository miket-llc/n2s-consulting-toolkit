"use client";
// ============================================================================
// OC GUIDE — Configuration guide for SOATERM (Term Code Configuration)
// Three layouts: long-scroll, two-pane, sidebar-toc — selected via Tweaks
// ============================================================================

import * as React from "react";
import {
  IconChevR, IconBranch, IconBox, IconSparkles, IconAlert, IconCheck,
  IconUser, IconClock, IconCalendar, IconShield, IconBolt, IconClose,
  IconJira, IconActivity,
} from "@/components/icons";
import { OC_DATA } from "@/lib/data";
import type { OCSection } from "@/lib/data";

type OcSection = OCSection;
type OcTask = NonNullable<OcSection["tasks"]>[number];

export function OCGuide({ layout = "two-pane", onBack, onOpenTask }: { ocId?: string; layout?: string; onBack: () => void; onOpenTask: (t: OcTask) => void }) {
  const oc = OC_DATA["soaterm"];
  const sections = oc.sections;
  const [activeId, setActiveId] = React.useState(sections[0].id);
  const [showAI, setShowAI] = React.useState(false);
  const scrollRef = React.useRef<HTMLElement | null>(null);

  // Track scroll position to highlight active TOC entry
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const containers = sections.map(s => document.getElementById(`sec-${s.id}`)).filter(Boolean) as HTMLElement[];
      let current = sections[0].id;
      const top = el.getBoundingClientRect().top + 80;
      for (const c of containers) {
        if (c.getBoundingClientRect().top < top + 100) current = c.id.replace("sec-", "");
      }
      setActiveId(current);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(`sec-${id}`);
    if (el && scrollRef.current) {
      scrollRef.current.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
    }
    setActiveId(id);
  };

  return (
    <div className={`oc-shell oc-${layout}`}>
      {/* Header bar */}
      <div className="oc-bar">
        <button className="btn btn-tiny" onClick={onBack}><IconChevR style={{ transform: "rotate(180deg)" }}/> Capabilities</button>
        <div className="oc-crumbs">
          <span className="muted">Curriculum Mgmt</span>
          <span className="sep">/</span>
          <span className="muted">Term Setup</span>
          <span className="sep">/</span>
          <span className="active">{oc.title}</span>
        </div>
        <span className="chip chip-mono chip-violet" style={{ marginLeft: 12 }}>{oc.code}</span>
        <span className="chip chip-accent">{oc.product}</span>
        <span className="chip chip-emerald">In Progress</span>
        <div style={{ flex: 1 }}/>
        <div className="flex-row" style={{ gap: 8 }}>
          <button className="btn btn-tiny"><IconBranch/> v3.2</button>
          <button className="btn btn-tiny"><IconBox/> Inner Source</button>
          <button className="btn btn-tiny btn-primary" onClick={() => setShowAI(true)}><IconSparkles/> Generate test cases</button>
        </div>
      </div>

      <div className="oc-body">
        {/* TOC sidebar (visible in sidebar-toc and two-pane layouts) */}
        {(layout === "sidebar-toc" || layout === "two-pane") && (
          <aside className="oc-toc">
            <div className="uppercase-eyebrow" style={{ padding: "0 4px 8px" }}>Configuration</div>
            <div className="flex-col" style={{ gap: 1 }}>
              {sections.map(s => (
                <button key={s.id} className={`oc-toc-row ${activeId === s.id ? "active" : ""}`} onClick={() => scrollTo(s.id)}>
                  <span className="num">{s.num}</span>
                  <span className="lbl">{s.title}</span>
                  {s.complete && <span className="check"><IconCheck size={10}/></span>}
                </button>
              ))}
            </div>
            <div className="divider-h" style={{ margin: "16px 4px" }}/>
            <div className="uppercase-eyebrow" style={{ padding: "0 4px 8px" }}>Cross-references</div>
            <div className="flex-col" style={{ gap: 4, padding: "0 4px" }}>
              <a className="oc-toc-link">SSASECT · Section Building</a>
              <a className="oc-toc-link">SFARCTL · Reg Controls</a>
              <a className="oc-toc-link">SHACATQ · Catalog</a>
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className="oc-main" ref={scrollRef as React.RefObject<HTMLElement>}>
          <div className="oc-content">
            {/* Title block */}
            <div className="oc-title-block">
              <div className="uppercase-eyebrow">Operational Component · Term & Calendar</div>
              <h1 className="oc-title">{oc.title}</h1>
              <p className="oc-sub">{oc.summary}</p>
              <div className="oc-meta">
                <span><IconUser size={11}/> Owner: <strong>Janet H.</strong></span>
                <span className="dot-sep">·</span>
                <span><IconClock size={11}/> Updated 2h ago</span>
                <span className="dot-sep">·</span>
                <span><IconBox size={11}/> 4 inner-source variants</span>
                <span className="dot-sep">·</span>
                <span><IconCalendar size={11}/> Tied to <span className="hov-link">HR Go-Live · 23d</span></span>
              </div>
            </div>

            {/* DRC banner — Decision Required */}
            <div className="drc">
              <div className="flex-row" style={{ marginBottom: 6 }}>
                <IconAlert/>
                <span style={{ fontWeight: 600, fontSize: 13 }}>2 decisions required from client</span>
                <span className="chip chip-amber" style={{ marginLeft: "auto" }}>NSU input pending</span>
              </div>
              <div className="muted" style={{ fontSize: 12, lineHeight: 1.6 }}>
                Parts-of-term structure (full-term vs split-term) and graduate-vs-undergrad registration window separation. Both block SFARCTL configuration downstream.
              </div>
              <div className="flex-row" style={{ marginTop: 10 }}>
                <button className="btn btn-tiny btn-primary">Open DRC form</button>
                <button className="btn btn-tiny">Schedule client session</button>
              </div>
            </div>

            {/* Sections */}
            {sections.map(s => <OCSection key={s.id} s={s} onOpenTask={onOpenTask}/>)}

            <div style={{ height: 200 }}/>
          </div>

          {/* Two-pane right rail: live config preview */}
          {layout === "two-pane" && (
            <aside className="oc-pane">
              <div className="oc-pane-head">
                <IconActivity/>
                <span className="ttl">Live preview · NSU instance</span>
                <span className="chip chip-emerald">connected</span>
              </div>
              <div className="oc-pane-body">
                <div className="oc-form">
                  <div className="oc-form-row">
                    <label>Term Code</label>
                    <input value="202610" readOnly/>
                  </div>
                  <div className="oc-form-row">
                    <label>Description</label>
                    <input value="Fall 2026" readOnly/>
                  </div>
                  <div className="oc-form-row">
                    <label>Term Start</label>
                    <input value="2026-08-24" readOnly/>
                  </div>
                  <div className="oc-form-row">
                    <label>Term End</label>
                    <input value="2026-12-18" readOnly/>
                  </div>
                  <div className="oc-form-row">
                    <label>Acad Year</label>
                    <input value="2627" readOnly/>
                  </div>
                  <div className="oc-form-row">
                    <label>FA Proc Year</label>
                    <input value="2627" readOnly/>
                  </div>
                  <div className="oc-form-row">
                    <label>Housing Term</label>
                    <select defaultValue="Y · Active for housing"><option>Y · Active for housing</option></select>
                  </div>
                  <div className="oc-form-row">
                    <label>System Required</label>
                    <select defaultValue="Census enrollment counts"><option>Census enrollment counts</option></select>
                  </div>
                </div>
                <div className="divider-h" style={{ margin: "16px 0" }}/>
                <div className="uppercase-eyebrow" style={{ marginBottom: 8 }}>Test cases · 12 generated</div>
                <div className="flex-col" style={{ gap: 6 }}>
                  {[
                    { id: "TC-1", text: "Term-code rollover handles year-end correctly", state: "pass" },
                    { id: "TC-2", text: "Part-of-term split honors census date", state: "pass" },
                    { id: "TC-3", text: "Reg window UG ≠ GR enforces shopping cart split", state: "fail" },
                    { id: "TC-4", text: "Housing-term flag triggers room-assignment job", state: "pass" },
                    { id: "TC-5", text: "FA proc-year mismatch surfaces validation error", state: "pending" },
                  ].map(tc => (
                    <div key={tc.id} className="oc-tc">
                      <span className={`oc-tc-dot ${tc.state}`}></span>
                      <span className="id-pill">{tc.id}</span>
                      <span style={{ fontSize: 11, color: "var(--text-secondary)", flex: 1, lineHeight: 1.4 }}>{tc.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </main>
      </div>

      {showAI && <AITestGenModal onClose={() => setShowAI(false)}/>}
    </div>
  );
}

function OCSection({ s, onOpenTask }: { s: OcSection; onOpenTask: (t: OcTask) => void }) {
  return (
    <section id={`sec-${s.id}`} className="oc-section">
      <div className="oc-section-head">
        <span className="num">{s.num}</span>
        <h2>{s.title}</h2>
        {s.complete && <span className="chip chip-emerald" style={{ marginLeft: "auto" }}><IconCheck size={10}/> Complete</span>}
        {!s.complete && s.tasks && s.tasks.length > 0 && <span className="chip chip-amber" style={{ marginLeft: "auto" }}>{s.tasks.length} open task</span>}
      </div>
      <div className="oc-section-body">
        {s.intro && <p className="oc-p">{s.intro}</p>}

        {s.callouts?.map((c, i) => (
          <div key={i} className={`oc-callout oc-callout-${c.kind}`}>
            <div className="oc-callout-head">
              {c.kind === "best-practice" ? <IconShield size={12}/> : c.kind === "watchout" ? <IconAlert size={12}/> : <IconBolt size={12}/>}
              <span>{c.kind === "best-practice" ? "Best practice" : c.kind === "watchout" ? "Watch-out" : "Pattern"}</span>
              {c.from && <span className="muted mono" style={{ fontSize: 10, marginLeft: "auto" }}>{c.from}</span>}
            </div>
            <p>{c.text}</p>
          </div>
        ))}

        {s.steps?.map((step, i) => (
          <div key={i} className="oc-step">
            <span className="oc-step-num">{step.num || i + 1}</span>
            <div className="oc-step-body">
              <div className="oc-step-title">{step.title}</div>
              {step.body && <p className="oc-p" dangerouslySetInnerHTML={{ __html: step.body }}/>}
              {step.code && (
                <pre className="oc-code">
                  <div className="oc-code-head">
                    <span className="muted mono" style={{ fontSize: 10 }}>{step.codeLang || "sql"}</span>
                    <span className="muted mono" style={{ fontSize: 10, marginLeft: "auto" }}>Inner-source · NSU-Term-2025</span>
                  </div>
                  <code>{step.code}</code>
                </pre>
              )}
              {step.fields && (
                <table className="oc-table">
                  <thead><tr><th>Field</th><th>Value</th><th>Why</th></tr></thead>
                  <tbody>
                    {step.fields.map((f, j) => (
                      <tr key={j}>
                        <td className="mono" style={{ color: "var(--accent-bright)" }}>{f.field}</td>
                        <td className="mono">{f.value}</td>
                        <td className="muted">{f.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ))}

        {s.tasks && s.tasks.length > 0 && (
          <div className="oc-tasks-block">
            <div className="uppercase-eyebrow" style={{ marginBottom: 6 }}>Linked Jira tasks</div>
            <div className="flex-col" style={{ gap: 4 }}>
              {s.tasks.map(t => (
                <div key={t.id} className="oc-task-link" onClick={() => onOpenTask?.(t)}>
                  <span className="id-pill">{t.id}</span>
                  <span style={{ fontSize: 12, flex: 1 }}>{t.title}</span>
                  <span className={`chip chip-mono ${t.priority === "P1" ? "chip-rose" : "chip-ghost"}`}>{t.priority}</span>
                  <span className="muted mono" style={{ fontSize: 10 }}>{t.due}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// AI Test-case Generation Modal
// ============================================================================
export function AITestGenModal({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = React.useState<"intro" | "streaming" | "done">("intro");
  const [generated, setGenerated] = React.useState<Array<{ id: string; title: string; coverage: string; priority: string }>>([]);

  React.useEffect(() => {
    if (stage === "streaming") {
      const cases = [
        { id: "TC-Gen-1", title: "Term-code creation honors fiscal year boundary", coverage: "happy-path", priority: "P1" },
        { id: "TC-Gen-2", title: "Part-of-term split with overlapping census dates", coverage: "edge", priority: "P1" },
        { id: "TC-Gen-3", title: "Reg-window UG vs GR cohort separation enforced", coverage: "edge", priority: "P1" },
        { id: "TC-Gen-4", title: "Housing-term inactivation propagates to SLBRMAP", coverage: "integration", priority: "P2" },
        { id: "TC-Gen-5", title: "FA proc-year ≠ acad-year raises validation error", coverage: "edge", priority: "P1" },
        { id: "TC-Gen-6", title: "Invalid date sequence (start > end) blocks save", coverage: "negative", priority: "P2" },
        { id: "TC-Gen-7", title: "Census-date rollback unlocks enrollment edits", coverage: "edge", priority: "P3" },
        { id: "TC-Gen-8", title: "Concurrent-term scenario with summer mini-session", coverage: "integration", priority: "P2" },
      ];
      let i = 0;
      const t = setInterval(() => {
        if (i >= cases.length) { clearInterval(t); setStage("done"); return; }
        setGenerated(g => [...g, cases[i]]);
        i++;
      }, 240);
      return () => clearInterval(t);
    }
  }, [stage]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-shell" onClick={e => e.stopPropagation()} style={{ width: 720 }}>
        <div className="modal-head">
          <div className="flex-row">
            <IconSparkles/>
            <span style={{ fontWeight: 600 }}>Generate Test Cases · SOATERM</span>
          </div>
          <button className="tb-ic" onClick={onClose}><IconClose size={14}/></button>
        </div>
        <div className="modal-body">
          {stage === "intro" && (
            <>
              <p className="muted" style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                Copilot will read this OC's configuration steps, the inner-source NSU-Term-2025 patterns, and the linked DRC inputs (parts-of-term, reg windows). It generates acceptance criteria and runnable test scaffolds for the specified product variant.
              </p>
              <div className="oc-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="oc-form-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
                  <label>Product variant</label>
                  <select defaultValue="Banner SaaS · Select tier"><option>Banner SaaS · Select tier</option></select>
                </div>
                <div className="oc-form-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
                  <label>Coverage profile</label>
                  <select defaultValue="Happy + Edge + Negative"><option>Happy + Edge + Negative</option></select>
                </div>
                <div className="oc-form-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
                  <label>Output format</label>
                  <select defaultValue="Gherkin (.feature) + Jira"><option>Gherkin (.feature) + Jira</option></select>
                </div>
                <div className="oc-form-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
                  <label>Sample size</label>
                  <select defaultValue="8 cases (recommended)"><option>8 cases (recommended)</option></select>
                </div>
              </div>
              <div className="oc-callout oc-callout-pattern" style={{ marginTop: 16 }}>
                <div className="oc-callout-head"><IconBox size={12}/><span>Inner-source seed</span></div>
                <p>Will reuse 4 patterns from <strong>NSU-Term-2025</strong> and 2 from <strong>WIU-Term-Rollover-2024</strong>.</p>
              </div>
            </>
          )}
          {(stage === "streaming" || stage === "done") && (
            <>
              <div className="flex-row" style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 13 }}>{stage === "done" ? "Generated 8 test cases" : `Streaming… ${generated.length}/8`}</span>
                {stage === "streaming" && <span className="muted mono" style={{ fontSize: 11, marginLeft: "auto" }}>using haiku-4.5</span>}
              </div>
              <div className="flex-col" style={{ gap: 6, maxHeight: 360, overflow: "auto" }}>
                {generated.map(tc => (
                  <div key={tc.id} className="oc-tc" style={{ padding: "10px 12px" }}>
                    <span className="oc-tc-dot pending"></span>
                    <span className="id-pill">{tc.id}</span>
                    <span style={{ fontSize: 12, flex: 1, color: "var(--text-primary)", lineHeight: 1.4 }}>{tc.title}</span>
                    <span className="chip chip-ghost" style={{ fontSize: 9 }}>{tc.coverage}</span>
                    <span className={`chip chip-mono ${tc.priority === "P1" ? "chip-rose" : "chip-ghost"}`}>{tc.priority}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="modal-foot">
          {stage === "intro" && (<>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={() => setStage("streaming")}><IconSparkles/> Generate</button>
          </>)}
          {stage === "streaming" && <button className="btn">Streaming…</button>}
          {stage === "done" && (<>
            <button className="btn" onClick={onClose}>Discard</button>
            <button className="btn btn-primary"><IconJira/> Push to Jira</button>
          </>)}
        </div>
      </div>
    </div>
  );
}
