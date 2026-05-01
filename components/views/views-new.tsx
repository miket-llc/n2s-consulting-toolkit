"use client";
// ============================================================================
// NEW VIEWS — Documents, Navigator, Methodology, Smart Queue, Pathfinder,
// Capability detail, Pattern detail, Shortcuts cheatsheet, Mock launcher
// ============================================================================

import * as React from "react";
import {
  IconBook, IconUpload, IconPlus, IconPaperclip, IconSparkles, IconArrowRight,
  IconActivity, IconUsers, IconSearch, IconRefresh, IconCog, IconChevL,
  IconJira, IconBeaker, IconAlert, IconClose, IconHash, IconLink,
  IconShield, IconGitFork, IconBranch, IconExternal,
} from "@/components/icons";
import { Avatar } from "@/components/shell";
import {
  DOC_TREE, DOCUMENTS, ENGAGEMENT, OC_INDEX, BUSINESS_CAPABILITIES, TASKS,
  INNER_SOURCE, PORTFOLIO, METHODOLOGY_PHASES, METHODOLOGY_CARDS, SMART_QUEUE,
} from "@/lib/data";

type Doc = (typeof DOCUMENTS)[number];
type Task = (typeof TASKS)[number];
type Capability = (typeof BUSINESS_CAPABILITIES)[number];
type MethodologyCard = (typeof METHODOLOGY_CARDS)[number];
type Phase = (typeof METHODOLOGY_PHASES)[number];

// ─── Documents ──────────────────────────────────────────────────────────────
export function Documents(_props: { tweaks?: unknown }) {
  const tree = DOC_TREE;
  const all = DOCUMENTS;
  const [folder, setFolder] = React.useState(tree[0].id);
  const [selected, setSelected] = React.useState<Doc | null>(null);
  const [chips, setChips] = React.useState<{ oc: boolean; sprint: boolean; status: string }>({ oc: false, sprint: false, status: "all" });

  let docs = all.filter(d => d.folder === folder);
  if (chips.status !== "all") docs = docs.filter(d => d.status === chips.status);
  if (chips.oc) docs = docs.filter(d => d.oc);
  if (chips.sprint) docs = docs.filter(d => d.sprint && d.sprint !== "—");
  const cur = selected || docs[0];

  React.useEffect(() => { setSelected(null); }, [folder]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 360px", height: "100%", minHeight: 0 }}>
      {/* Folder tree */}
      <aside style={{ borderRight: "1px solid var(--border)", background: "var(--bg-surface)", padding: "16px 10px", overflowY: "auto" }}>
        <div className="uppercase-eyebrow" style={{ padding: "0 8px 8px" }}>Repository</div>
        {tree.map(f => (
          <button key={f.id} className={`rail-row ${folder === f.id ? "active" : ""}`} style={{ marginBottom: 2 }} onClick={() => setFolder(f.id)}>
            <span className="ic"><IconBook size={14}/></span>
            <span className="label">{f.label}</span>
            <span className="count">{f.count}</span>
          </button>
        ))}
        <div className="divider-h" style={{ margin: "12px 6px" }}/>
        <button className="btn btn-tiny" style={{ margin: "4px 8px" }}><IconUpload/> Upload</button>
      </aside>

      {/* List */}
      <section style={{ display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px 8px", borderBottom: "1px solid var(--border)" }}>
          <div className="ph" style={{ marginBottom: 10 }}>
            <div>
              <div className="ph-eyebrow">Documents · {tree.find(t => t.id === folder)!.label} · {docs.length} files</div>
              <h1 className="ph-title">{tree.find(t => t.id === folder)!.label}</h1>
            </div>
            <div className="flex-row">
              <input className="search-inp" placeholder="search this folder…" style={{ minWidth: 200 }}/>
              <button className="btn"><IconPlus/> New</button>
            </div>
          </div>
          <div className="flex-row" style={{ flexWrap: "wrap" }}>
            <span className="muted" style={{ fontSize: 11 }}>Filter:</span>
            {["all", "approved", "in-review", "draft"].map(s => (
              <button key={s} className={`chip ${chips.status === s ? "chip-accent" : "chip-ghost"}`} style={{ cursor: "pointer", border: 0 }} onClick={() => setChips(c => ({ ...c, status: s }))}>{s}</button>
            ))}
            <button className={`chip ${chips.oc ? "chip-violet" : "chip-ghost"}`} style={{ cursor: "pointer", border: 0 }} onClick={() => setChips(c => ({ ...c, oc: !c.oc }))}>linked to OC</button>
            <button className={`chip ${chips.sprint ? "chip-violet" : "chip-ghost"}`} style={{ cursor: "pointer", border: 0 }} onClick={() => setChips(c => ({ ...c, sprint: !c.sprint }))}>in active sprint</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <table className="tbl">
            <thead>
              <tr><th>Name</th><th style={{ width: 90 }}>Type</th><th style={{ width: 110 }}>Owner</th><th style={{ width: 110 }}>Modified</th><th style={{ width: 110 }}>Status</th><th style={{ width: 200 }}>AI Summary</th></tr>
            </thead>
            <tbody>
              {docs.map(d => {
                const owner = ENGAGEMENT.members.find(m => m.id === d.owner);
                const isSel = cur && cur.id === d.id;
                return (
                  <tr key={d.id} className={isSel ? "active" : ""} style={{ cursor: "pointer" }} onClick={() => setSelected(d)}>
                    <td>
                      <div className="flex-row">
                        <IconPaperclip/>
                        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{d.name}</span>
                        {d.oc && <span className="chip chip-mono chip-violet" style={{ marginLeft: 6 }}>OC</span>}
                      </div>
                    </td>
                    <td><span className="chip-form">{d.type}</span></td>
                    <td>
                      <div className="flex-row">
                        {owner && <Avatar m={owner} size="sm"/>}
                        <span style={{ fontSize: 11 }}>{owner?.name.split(" ")[0]}</span>
                      </div>
                    </td>
                    <td className="mono" style={{ fontSize: 11 }}>{d.modified}</td>
                    <td><span className={`chip chip-mono ${d.status === "approved" ? "chip-emerald" : d.status === "in-review" ? "chip-amber" : "chip-ghost"}`}>{d.status}</span></td>
                    <td>
                      <div className="flex-row" style={{ gap: 6 }}>
                        {d.aiGenerated && <span className="chip chip-accent" style={{ fontSize: 9, padding: "1px 6px" }}><IconSparkles size={9}/> AI</span>}
                        <span className="muted" style={{ fontSize: 11, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{d.aiSummary.slice(0, 60)}…</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {docs.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: "center" }} className="muted">No documents match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* Preview */}
      <aside style={{ borderLeft: "1px solid var(--border)", background: "var(--bg-surface)", padding: 18, overflowY: "auto" }}>
        {!cur ? <div className="muted" style={{ fontSize: 12 }}>Select a document to preview.</div> : <DocPreview d={cur}/>}
      </aside>
    </div>
  );
}

function DocPreview({ d }: { d: Doc }) {
  const owner = ENGAGEMENT.members.find(m => m.id === d.owner);
  return (
    <>
      <div className="flex-row" style={{ marginBottom: 10 }}>
        <span className="chip-form">{d.type}</span>
        <span className={`chip chip-mono ${d.status === "approved" ? "chip-emerald" : d.status === "in-review" ? "chip-amber" : "chip-ghost"}`}>{d.status}</span>
      </div>
      <h2 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, margin: "0 0 10px", color: "var(--text-primary)" }}>{d.name}</h2>
      <div className="flex-row" style={{ gap: 8, marginBottom: 14 }}>
        {owner && <Avatar m={owner} size="sm"/>}
        <div className="flex-col" style={{ gap: 0, lineHeight: 1.2 }}>
          <span style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 500 }}>{owner?.name}</span>
          <span className="muted mono" style={{ fontSize: 10 }}>last edit · {d.modified}</span>
        </div>
      </div>
      {d.aiGenerated && (
        <div className="oc-callout oc-callout-pattern">
          <div className="oc-callout-head"><IconSparkles size={11}/><span>Generated by AI</span></div>
          <p>Summary auto-drafted from document body and synced when content changes. Last regenerated 4m ago.</p>
        </div>
      )}
      <div className="uppercase-eyebrow" style={{ marginTop: 16, marginBottom: 6 }}>AI summary</div>
      <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 14px" }}>{d.aiSummary}</p>

      <div className="uppercase-eyebrow" style={{ marginBottom: 6 }}>Linked</div>
      <div className="flex-col" style={{ gap: 6, marginBottom: 14 }}>
        {d.oc && <div className="oc-task-link"><IconBook size={12}/><span style={{ fontSize: 11 }}>OC · {d.oc.toUpperCase()}</span><IconArrowRight/></div>}
        {d.sprint && d.sprint !== "—" && <div className="oc-task-link"><IconActivity size={12}/><span style={{ fontSize: 11 }}>Sprint {d.sprint}</span></div>}
        <div className="oc-task-link"><IconUsers size={12}/><span style={{ fontSize: 11 }}>{owner?.name}</span></div>
      </div>

      <div className="uppercase-eyebrow" style={{ marginBottom: 6 }}>Document body</div>
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, fontSize: 11, lineHeight: 1.6, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
        <div style={{ height: 6, background: "var(--bg-hover)", borderRadius: 3, width: "70%", marginBottom: 6 }}/>
        <div style={{ height: 6, background: "var(--bg-hover)", borderRadius: 3, width: "92%", marginBottom: 6 }}/>
        <div style={{ height: 6, background: "var(--bg-hover)", borderRadius: 3, width: "84%", marginBottom: 6 }}/>
        <div style={{ height: 6, background: "var(--bg-hover)", borderRadius: 3, width: "60%", marginBottom: 14 }}/>
        <div style={{ height: 6, background: "var(--bg-hover)", borderRadius: 3, width: "78%", marginBottom: 6 }}/>
        <div style={{ height: 6, background: "var(--bg-hover)", borderRadius: 3, width: "65%" }}/>
      </div>

      <div className="flex-row" style={{ marginTop: 14 }}>
        <button className="btn btn-tiny btn-primary" style={{ flex: 1 }}>Open</button>
        <button className="btn btn-tiny" style={{ flex: 1 }}>Comment</button>
      </div>
    </>
  );
}

// ─── Navigator ──────────────────────────────────────────────────────────────

type NavItem = { kind: string; id: string; title: string; sub: string; route: string; payload: string };

function navigatorIndex(): NavItem[] {
  const out: NavItem[] = [];
  OC_INDEX.forEach(o => out.push({ kind: "OC", id: o.id, title: o.title, sub: `${o.code} · ${o.cap}`, route: "ocguide", payload: o.id }));
  BUSINESS_CAPABILITIES.forEach(c => out.push({ kind: "Capability", id: c.id, title: c.label, sub: `${c.area} · ${c.pct}% · ${c.goLive}`, route: "capability", payload: c.id }));
  TASKS.forEach(t => out.push({ kind: "Task", id: t.id, title: t.title, sub: `${t.jiraId} · ${t.priority} · ${t.due}`, route: "task", payload: t.id }));
  DOCUMENTS.forEach(d => out.push({ kind: "Document", id: d.id, title: d.name, sub: `${d.type} · ${d.status}`, route: "documents", payload: d.id }));
  ENGAGEMENT.members.forEach(m => out.push({ kind: "Person", id: m.id, title: m.name, sub: m.role, route: "person", payload: m.id }));
  INNER_SOURCE.forEach(p => out.push({ kind: "Pattern", id: p.id, title: p.title, sub: `${p.kind} · ${p.contributor}`, route: "pattern", payload: p.id }));
  PORTFOLIO.forEach(e => out.push({ kind: "Engagement", id: e.id, title: e.name, sub: `${e.product} · ${e.tier} · ${e.phase}`, route: "engagement", payload: e.id }));
  return out;
}

export function NavigatorOverlay({ open, onClose, onJump, fullPage }: { open: boolean; onClose: () => void; onJump: (it: NavItem) => void; fullPage?: boolean }) {
  const [q, setQ] = React.useState("");
  const idx = React.useMemo(() => navigatorIndex(), []);
  React.useEffect(() => { if (open) setQ(""); }, [open]);
  if (!open) return null;
  const filtered = q.trim()
    ? idx.filter(i => i.title.toLowerCase().includes(q.toLowerCase()) || i.sub.toLowerCase().includes(q.toLowerCase()))
    : [];
  const groups: Record<string, NavItem[]> = {};
  filtered.forEach(i => { (groups[i.kind] = groups[i.kind] || []).push(i); });

  const recent = idx.filter(i => ["soaterm", "spaiden", "bc-curriculum", "is-2"].includes(i.payload || i.id)).slice(0, 4);
  const suggested = idx.filter(i => i.kind === "OC").slice(0, 3);

  if (fullPage) {
    return (
      <div className="page page-narrow" style={{ maxWidth: 880 }}>
        <div className="ph">
          <div>
            <div className="ph-eyebrow">Navigator · jump anywhere · {idx.length} items indexed</div>
            <h1 className="ph-title">Navigator</h1>
          </div>
          <span className="kbd">⌘K</span>
        </div>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "center" }}>
            <IconSearch size={16}/>
            <input autoFocus className="search-inp" placeholder="Engagements, OCs, capabilities, tasks, documents, people, patterns…" value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1, border: 0, padding: 0, background: "transparent", fontSize: 14 }}/>
          </div>
          <div style={{ padding: 16, maxHeight: "60vh", overflowY: "auto" }}>
            <NavResults q={q} groups={groups} recent={recent} suggested={suggested} onJump={(it) => onJump(it)}/>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="modal-backdrop" onClick={onClose} style={{ alignItems: "flex-start", paddingTop: "10vh" }}>
      <div className="modal-shell" onClick={e => e.stopPropagation()} style={{ width: 720 }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "center" }}>
          <IconSearch size={16}/>
          <input autoFocus className="search-inp" placeholder="Type to search… everything." value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1, border: 0, padding: 0, background: "transparent", fontSize: 14 }}/>
          <span className="kbd">esc</span>
        </div>
        <div style={{ padding: 14, maxHeight: 440, overflowY: "auto" }}>
          <NavResults q={q} groups={groups} recent={recent} suggested={suggested} onJump={(it) => { onClose(); onJump(it); }}/>
        </div>
      </div>
    </div>
  );
}

function NavResults({ q, groups, recent, suggested, onJump }: { q: string; groups: Record<string, NavItem[]>; recent: NavItem[]; suggested: NavItem[]; onJump: (it: NavItem) => void }) {
  if (!q.trim()) {
    return (
      <>
        <div className="uppercase-eyebrow" style={{ marginBottom: 6 }}>Recent</div>
        <div className="flex-col" style={{ gap: 4, marginBottom: 16 }}>
          {recent.map(i => <NavRow key={i.kind + i.id} it={i} onJump={onJump}/>)}
        </div>
        <div className="uppercase-eyebrow" style={{ marginBottom: 6 }}>Suggested · active in this sprint</div>
        <div className="flex-col" style={{ gap: 4 }}>
          {suggested.map(i => <NavRow key={i.kind + i.id} it={i} onJump={onJump}/>)}
        </div>
      </>
    );
  }
  if (Object.keys(groups).length === 0) return <div className="muted" style={{ fontSize: 12, padding: 20, textAlign: "center" }}>No matches.</div>;
  return (
    <>
      {Object.entries(groups).map(([k, items]) => (
        <div key={k} style={{ marginBottom: 14 }}>
          <div className="uppercase-eyebrow" style={{ marginBottom: 6 }}>{k} · {items.length}</div>
          <div className="flex-col" style={{ gap: 4 }}>
            {items.slice(0, 6).map(i => <NavRow key={i.kind + i.id} it={i} onJump={onJump}/>)}
          </div>
        </div>
      ))}
    </>
  );
}

function NavRow({ it, onJump }: { it: NavItem; onJump: (it: NavItem) => void }) {
  return (
    <button className="oc-task-link" style={{ width: "100%", textAlign: "left", border: 0, background: "transparent", cursor: "pointer" }} onClick={() => onJump(it)}>
      <span className="chip chip-mono chip-ghost" style={{ minWidth: 78, justifyContent: "center" }}>{it.kind}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.title}</div>
        <div className="muted mono" style={{ fontSize: 10, marginTop: 1 }}>{it.sub}</div>
      </div>
      <IconArrowRight/>
    </button>
  );
}

// ─── Methodology Library ────────────────────────────────────────────────────
export function Methodology({ density }: { density?: string }) {
  const phases = METHODOLOGY_PHASES;
  const cards = METHODOLOGY_CARDS;
  const [phase, setPhase] = React.useState("all");
  const [open, setOpen] = React.useState<MethodologyCard | null>(null);
  const filtered = phase === "all" ? cards : cards.filter(c => c.phase === phase);

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Methodology · 6 phases · {cards.length} artifacts, ceremonies, RACI templates & gates</div>
          <h1 className="ph-title">Methodology Library</h1>
          <p className="ph-sub">The prescribed implementation method — Discover → Stabilize. Each card is a reusable artifact, ceremony, RACI template, or quality gate. Apply directly to this engagement to seed templates and sprint rituals.</p>
        </div>
      </div>

      {/* Phase timeline */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${phases.length}, 1fr)`, gap: 0, position: "relative" }}>
          {phases.map((p, i) => (
            <button key={p.id} onClick={() => setPhase(p.id)} style={{ background: "transparent", border: 0, cursor: "pointer", padding: "8px 10px", borderTop: `3px solid ${p.color}`, color: phase === p.id || phase === "all" ? "var(--text-primary)" : "var(--text-muted)", textAlign: "left", borderLeft: i > 0 ? "1px solid var(--border-subtle)" : "0" }}>
              <div className="flex-row" style={{ marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: p.color }}/>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{p.label}</span>
              </div>
              <div className="muted mono" style={{ fontSize: 10 }}>{p.weeks}</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 6, lineHeight: 1.4 }}>{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-row" style={{ marginBottom: 14 }}>
        <button className={`btn ${phase === "all" ? "btn-primary" : ""}`} onClick={() => setPhase("all")}>All phases</button>
        {phases.map(p => <button key={p.id} className={`btn ${phase === p.id ? "btn-primary" : ""}`} onClick={() => setPhase(p.id)}>{p.label}</button>)}
        <span className="muted mono" style={{ fontSize: 11, marginLeft: "auto" }}>{filtered.length} of {cards.length}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: density === "compact" ? "repeat(4, 1fr)" : "repeat(3, 1fr)", gap: 12 }}>
        {filtered.map(c => {
          const ph = phases.find(p => p.id === c.phase)!;
          return (
            <div key={c.id} className="card" style={{ cursor: "pointer", borderLeft: `3px solid ${ph.color}` }} onClick={() => setOpen(c)}>
              <div className="flex-row" style={{ marginBottom: 6 }}>
                <span className="chip chip-mono chip-ghost">{c.kind}</span>
                <span className="muted mono" style={{ fontSize: 10, marginLeft: "auto" }}>{c.when}</span>
              </div>
              <div style={{ fontSize: density === "compact" ? 13 : 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 }}>{c.title}</div>
              <p className="muted" style={{ fontSize: 11, lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: density === "compact" ? 2 : 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.desc}</p>
              <div className="flex-row" style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
                <span className="muted mono" style={{ fontSize: 10 }}>{c.linked.length} templates</span>
                <IconArrowRight/>
              </div>
            </div>
          );
        })}
      </div>

      {open && <MethodologyDrawer card={open} phase={phases.find(p => p.id === open.phase)!} onClose={() => setOpen(null)}/>}
    </div>
  );
}

function MethodologyDrawer({ card, phase, onClose }: { card: MethodologyCard; phase: Phase; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose} style={{ justifyContent: "flex-end", padding: 0 }}>
      <div className="modal-shell" onClick={e => e.stopPropagation()} style={{ width: 520, height: "100vh", maxHeight: "100vh", borderRadius: 0, borderRight: 0, borderTop: 0, borderBottom: 0 }}>
        <div className="modal-head">
          <div className="flex-row">
            <span className="chip chip-mono chip-ghost">{card.kind}</span>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: phase.color }}/>
            <span className="muted mono" style={{ fontSize: 11 }}>{phase.label} · {card.when}</span>
          </div>
          <button className="tb-ic" onClick={onClose}><IconClose size={14}/></button>
        </div>
        <div className="modal-body">
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 12px", letterSpacing: -0.3, color: "var(--text-primary)" }}>{card.title}</h2>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)", margin: "0 0 18px" }}>{card.desc}</p>

          <div className="uppercase-eyebrow" style={{ marginBottom: 6 }}>When to use</div>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 16px" }}>Run during <strong>{phase.label}</strong> ({card.when}). Outputs feed the {phase.label === "Stabilize" ? "retrospective and Inner Source promotion" : "next-phase gate"}.</p>

          <div className="uppercase-eyebrow" style={{ marginBottom: 6 }}>Linked templates</div>
          <div className="flex-col" style={{ gap: 6, marginBottom: 18 }}>
            {card.linked.map((l, i) => (
              <div key={i} className="oc-task-link">
                <IconPaperclip size={12}/>
                <span style={{ fontSize: 12, flex: 1 }}>{l}</span>
                <span className="chip chip-mono chip-ghost" style={{ fontSize: 9 }}>tpl</span>
              </div>
            ))}
          </div>

          <div className="oc-callout oc-callout-best-practice">
            <div className="oc-callout-head"><IconShield size={12}/><span>Inner-source insight</span></div>
            <p>Used in 47 engagements over the last 18 months. Median time-to-completion: 3 days. Highest-rated template: {card.linked[0]}.</p>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn">Preview templates</button>
          <button className="btn btn-primary">Apply to Northern State <IconArrowRight/></button>
        </div>
      </div>
    </div>
  );
}

// ─── Smart Queue (distinct from My Work) ────────────────────────────────────
export function SmartQueue({ onOpenTask }: { onOpenTask: (t: Task) => void }) {
  const items = SMART_QUEUE;
  const taskById = (id: string) => TASKS.find(t => t.id === id);
  const [explained, setExplained] = React.useState<string | null>(items[0]?.id);

  return (
    <div className="page page-narrow">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Cross-engagement · AI-ranked · refreshes every 5m · across 4 engagements</div>
          <h1 className="ph-title">Smart Queue</h1>
          <p className="ph-sub">A single ordered list of what Janet should work on next, regardless of engagement. Ranking factors: go-live proximity, blocking-status of dependents, capability criticality, and recent activity. Different from My Work — there's no per-engagement tab; this is the merged stream.</p>
        </div>
        <div className="flex-row">
          <button className="btn"><IconRefresh/> Re-rank now</button>
          <button className="btn"><IconCog/> Tune weights</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14, background: "linear-gradient(135deg, rgba(147,51,234,0.10), rgba(62,207,255,0.04))", borderColor: "var(--accent-border)" }}>
        <div className="flex-row" style={{ gap: 18 }}>
          <IconSparkles/>
          <div className="flex-col" style={{ gap: 2, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Today's focus, in order</div>
            <div className="muted" style={{ fontSize: 11 }}>The top 3 unblock NSU's HR go-live (May 24). After that, it shifts to Student Phase 1 prep and a WIU FA cycle item that's getting close.</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="uppercase-eyebrow">Total est.</div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>4h 20m</div>
          </div>
        </div>
      </div>

      <div className="flex-col" style={{ gap: 8 }}>
        {items.map(sq => {
          const t = taskById(sq.task);
          if (!t) return null;
          const owner = ENGAGEMENT.members.find(m => m.id === t.assignee);
          const isOpen = explained === sq.id;
          return (
            <div key={sq.id} className="card card-tight" style={{ padding: 0, overflow: "hidden", cursor: "pointer", borderColor: isOpen ? "var(--accent)" : "var(--border)" }} onClick={() => setExplained(isOpen ? null : sq.id)}>
              <div style={{ display: "grid", gridTemplateColumns: "44px 60px 1fr auto", alignItems: "center", padding: "12px 14px", gap: 12 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: sq.rank <= 3 ? "var(--accent-bright)" : "var(--text-ghost)", lineHeight: 1 }}>#{sq.rank}</div>
                <div style={{ textAlign: "center" }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 600 }}>{sq.score}</div>
                  <div className="muted mono" style={{ fontSize: 9 }}>score</div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="flex-row" style={{ marginBottom: 4 }}>
                    <span className="chip chip-mono chip-accent" style={{ fontSize: 9 }}>{sq.project}</span>
                    <span className="id-pill">{t.jiraId}</span>
                    <span className={`chip chip-mono ${t.priority === "P1" ? "chip-rose" : t.priority === "P2" ? "chip-amber" : "chip-ghost"}`}>{t.priority}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", marginBottom: 6 }}>{t.title}</div>
                  <div className="flex-row" style={{ flexWrap: "wrap" }}>
                    {sq.reasons.map((r, i) => <span key={i} className="chip chip-violet" style={{ fontSize: 10 }}>{r}</span>)}
                  </div>
                </div>
                <div className="flex-row" style={{ gap: 8 }}>
                  {owner && <Avatar m={owner} size="sm"/>}
                  <button className="btn btn-tiny btn-primary" onClick={(e) => { e.stopPropagation(); onOpenTask(t); }}>Open</button>
                </div>
              </div>
              {isOpen && (
                <div style={{ padding: "0 14px 14px", borderTop: "1px solid var(--border-subtle)", marginTop: -2 }}>
                  <div className="uppercase-eyebrow" style={{ paddingTop: 12, marginBottom: 8 }}>Why this rank</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {[
                      { l: "Go-live proximity", v: sq.rank <= 3 ? "high" : "med", tone: sq.rank <= 3 ? "rose" : "amber" },
                      { l: "Dependents", v: sq.reasons.length, tone: "ghost" },
                      { l: "Owner load", v: "63%", tone: "ghost" },
                      { l: "Last activity", v: t.lastSync, tone: "ghost" },
                    ].map((s, i) => (
                      <div key={i} style={{ padding: "8px 10px", background: "var(--bg-panel)", borderRadius: 6, border: "1px solid var(--border)" }}>
                        <div className="uppercase-eyebrow" style={{ fontSize: 9 }}>{s.l}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginTop: 2 }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Pathfinder Index ───────────────────────────────────────────────────────
export function PathfinderIndex({ onOpenOC }: { onOpenOC: (id: string) => void }) {
  const idx = OC_INDEX;
  const [q, setQ] = React.useState("");
  const [cap, setCap] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const caps = ["all", ...new Set(idx.map(o => o.cap))];
  const statuses = ["all", "draft", "in-review", "in-progress", "approved"];
  const filtered = idx.filter(o => (cap === "all" || o.cap === cap) && (status === "all" || o.status === status) && (q === "" || o.title.toLowerCase().includes(q.toLowerCase()) || o.code.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Pathfinder · {idx.length} OCs · Northern State University · Banner SaaS · Select</div>
          <h1 className="ph-title">Pathfinder</h1>
          <p className="ph-sub">All Operational Components in scope for this engagement. Each OC is a per-form configuration guide that drives the Configuration Autopilot baseline. Open any OC to see the full guide; status reflects review state, not configuration progress.</p>
        </div>
        <div className="flex-row">
          <input className="search-inp" placeholder="search OC code or title…" value={q} onChange={e => setQ(e.target.value)}/>
          <button className="btn btn-primary"><IconPlus/> New OC</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12, padding: "10px 14px" }}>
        <div className="flex-row" style={{ flexWrap: "wrap" }}>
          <span className="uppercase-eyebrow">Capability:</span>
          {caps.slice(0, 8).map(c => <button key={c} className={`chip ${cap === c ? "chip-accent" : "chip-ghost"}`} style={{ cursor: "pointer", border: 0 }} onClick={() => setCap(c)}>{c === "all" ? "all" : c}</button>)}
          <span className="uppercase-eyebrow" style={{ marginLeft: 16 }}>Status:</span>
          {statuses.map(s => <button key={s} className={`chip ${status === s ? "chip-accent" : "chip-ghost"}`} style={{ cursor: "pointer", border: 0 }} onClick={() => setStatus(s)}>{s}</button>)}
          <span className="muted mono" style={{ fontSize: 11, marginLeft: "auto" }}>{filtered.length} of {idx.length}</span>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 160px 110px 120px 120px 100px", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          {["OC code", "Title", "Capability", "Owner", "Status", "Updated", ""].map(h => <div key={h} className="uppercase-eyebrow">{h}</div>)}
        </div>
        {filtered.map(o => {
          const owner = ENGAGEMENT.members.find(m => m.id === o.owner);
          return (
            <div key={o.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr 160px 110px 120px 120px 100px", padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", alignItems: "center", cursor: "pointer" }} onClick={() => onOpenOC(o.id)}>
              <div className="id-pill">{o.code}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{o.title}</div>
                {o.linkedTasks > 0 && <div className="muted mono" style={{ fontSize: 10, marginTop: 2 }}>{o.linkedTasks} linked task{o.linkedTasks > 1 ? "s" : ""}</div>}
              </div>
              <div><span className="chip chip-mono chip-violet">{o.cap}</span></div>
              <div className="flex-row">
                {owner && <Avatar m={owner} size="sm"/>}
                <span style={{ fontSize: 11 }}>{owner?.name.split(" ")[0]}</span>
              </div>
              <div><span className={`chip chip-mono ${o.status === "approved" ? "chip-emerald" : o.status === "in-progress" ? "chip-accent" : o.status === "in-review" ? "chip-amber" : "chip-ghost"}`}>{o.status}</span></div>
              <div className="muted mono" style={{ fontSize: 11 }}>{o.updated}</div>
              <button className="btn btn-tiny" onClick={(e) => { e.stopPropagation(); onOpenOC(o.id); }}>Open <IconArrowRight/></button>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center" }} className="muted">No OCs match these filters.</div>}
      </div>
    </div>
  );
}

// ─── Capability Detail ──────────────────────────────────────────────────────
export function CapabilityDetail({ id, onBack, onOpenOC }: { id: string; onBack: () => void; onOpenOC: (id: string) => void }) {
  const bc = BUSINESS_CAPABILITIES.find(b => b.id === id) as Capability | undefined;
  if (!bc) return <div className="page"><div className="muted">Capability not found.</div></div>;
  const ocs = OC_INDEX.filter(o => o.cap.toLowerCase() === bc.id.toLowerCase());
  const tone = bc.status === "active" ? "accent" : bc.status === "blocked" ? "rose" : "ghost";

  return (
    <div className="page">
      <div className="flex-row" style={{ marginBottom: 14 }}>
        <button className="btn btn-tiny" onClick={onBack}><IconChevL size={11}/> Back to Capabilities</button>
        <span className="muted mono" style={{ fontSize: 11 }}>/ {bc.area} / {bc.id}</span>
      </div>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Capability · {bc.area} · go-live: {bc.goLive}</div>
          <h1 className="ph-title">{bc.label}</h1>
          <p className="ph-sub">{bc.tagline}</p>
        </div>
        <div className="flex-row">
          <span className={`chip chip-${tone}`}>{bc.status}</span>
          <button className="btn"><IconJira/> Open in Jira</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
        {[
          { l: "Progress", v: `${bc.pct}%`, sub: `${bc.ocsDone}/${bc.ocsTotal} OCs done` },
          { l: "Business Processes", v: bc.bpCount, sub: "scoped" },
          { l: "Owning sprint", v: bc.sprint || "—", sub: bc.sprint ? "active" : "not assigned" },
          { l: "Risk score", v: bc.status === "blocked" ? "high" : "low", sub: "based on RAID", tone: bc.status === "blocked" ? "rose" : "" },
        ].map(k => (
          <div key={k.l} className="card">
            <div className="uppercase-eyebrow" style={{ marginBottom: 4 }}>{k.l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: k.tone === "rose" ? "var(--rose)" : "var(--text-primary)" }}>{k.v}</div>
            <div className="muted mono" style={{ fontSize: 11, marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 18 }}>
        <div className="card">
          <div className="card-head"><IconBook/><span className="ttl">Operational Components</span><span className="muted mono" style={{ fontSize: 11, marginLeft: "auto" }}>{ocs.length} OCs</span></div>
          <div className="flex-col" style={{ gap: 6 }}>
            {ocs.length === 0 && <div className="muted" style={{ fontSize: 12 }}>No OCs scoped yet for this capability.</div>}
            {ocs.map(o => (
              <div key={o.id} className="ent-row" style={{ gridTemplateColumns: "80px 1fr auto" }} onClick={() => onOpenOC(o.id)}>
                <div className="id-pill">{o.code}</div>
                <div>
                  <div className="label">{o.title}</div>
                  <div className="sub">{o.linkedTasks > 0 ? `${o.linkedTasks} linked task${o.linkedTasks > 1 ? "s" : ""}` : "no open tasks"}</div>
                </div>
                <div className="flex-row">
                  <span className={`chip chip-mono ${o.status === "approved" ? "chip-emerald" : o.status === "in-progress" ? "chip-accent" : o.status === "in-review" ? "chip-amber" : "chip-ghost"}`}>{o.status}</span>
                  <IconArrowRight/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><IconLink/><span className="ttl">Dependencies</span></div>
          <div className="flex-col" style={{ gap: 8 }}>
            {[
              { dir: "blocks", label: bc.area === "HR" ? "Position-control completion → Payroll calc" : "Term setup → Section build → Registration", tone: "rose" },
              { dir: "blocked-by", label: bc.area === "Student" ? "FA office DRC-3 (graduate window separation)" : "GL chart-of-accounts approval", tone: "amber" },
              { dir: "feeds", label: "Configuration Autopilot baseline · 24 OC checks", tone: "accent" },
              { dir: "feeds", label: "RAID log · 2 risks, 1 issue", tone: "ghost" },
            ].map((d, i) => (
              <div key={i} className="flex-row" style={{ padding: "8px 10px", background: "var(--bg-panel)", borderRadius: 6, border: "1px solid var(--border)" }}>
                <span className={`chip chip-${d.tone}`} style={{ minWidth: 76, justifyContent: "center" }}>{d.dir}</span>
                <span style={{ fontSize: 12, flex: 1 }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="card">
          <div className="card-head"><IconBeaker/><span className="ttl">Linked test cases</span><span className="muted mono" style={{ fontSize: 11, marginLeft: "auto" }}>62 + 18 NSU-specific</span></div>
          <div className="flex-col" style={{ gap: 6 }}>
            {[
              { id: "TC-024", text: "Term code follows YYYYMM convention", status: "pass" },
              { id: "TC-025", text: "Parts-of-term sum to master term window", status: "pass" },
              { id: "TC-026", text: "PoT census date independent of master", status: "pending" },
              { id: "TC-031", text: "Reg window start before term start date", status: "pass" },
              { id: "TC-038", text: "FA proc-year aligns to acad-year", status: "pending" },
            ].map(tc => (
              <div key={tc.id} className="oc-tc">
                <span className={`oc-tc-dot ${tc.status}`}/>
                <span className="id-pill">{tc.id}</span>
                <span style={{ fontSize: 12, flex: 1 }}>{tc.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><IconAlert/><span className="ttl">RAID for this capability</span></div>
          <div className="flex-col" style={{ gap: 6 }}>
            {[
              { kind: "Risk",       sev: "high", text: "Registrar's office availability for May workshops is uncertain." },
              { kind: "Issue",      sev: "med",  text: "12 priority-group conflicts pending sign-off." },
              { kind: "Decision",   sev: "high", text: "DRC-3: GR vs UG window separation — owners pending." },
              { kind: "Dependency", sev: "low",  text: "Banner ↔ Workday identity bridge contract due." },
            ].map((r, i) => (
              <div key={i} className="flex-row" style={{ padding: "8px 10px", background: "var(--bg-panel)", borderRadius: 6, borderLeft: `3px solid ${r.sev === "high" ? "var(--rose)" : r.sev === "med" ? "var(--amber)" : "var(--text-ghost)"}` }}>
                <span className="chip chip-mono chip-ghost" style={{ minWidth: 80, justifyContent: "center" }}>{r.kind}</span>
                <span style={{ fontSize: 12, flex: 1 }}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pattern Detail ─────────────────────────────────────────────────────────
export function PatternDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const p = INNER_SOURCE.find(x => x.id === id);
  if (!p) return <div className="page"><div className="muted">Pattern not found.</div></div>;
  const adopters = PORTFOLIO.slice(0, 5);

  return (
    <div className="page page-narrow">
      <div className="flex-row" style={{ marginBottom: 14 }}>
        <button className="btn btn-tiny" onClick={onBack}><IconChevL size={11}/> Back to Inner Source</button>
        <span className="muted mono" style={{ fontSize: 11 }}>/ {p.kind.toLowerCase()} / {p.id}</span>
      </div>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">{p.kind} · contributed by {p.contributor} · {p.engagement}</div>
          <h1 className="ph-title">{p.title}</h1>
          <p className="ph-sub">{p.desc}</p>
        </div>
        <div className="flex-row">
          <span className="muted mono" style={{ fontSize: 12 }}>★ {p.stars} · used {p.used}×</span>
          <button className="btn"><IconGitFork size={12}/> Fork</button>
          <button className="btn btn-primary">Apply to Northern State <IconArrowRight/></button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
        <div className="flex-col" style={{ gap: 14 }}>
          <div className="card">
            <div className="card-head"><IconBook/><span className="ttl">Overview</span></div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)", margin: 0 }}>{p.desc} Originally promoted after a successful go-live retro; vetted by the Inner Source review board before promotion.</p>
            <div className="flex-row" style={{ marginTop: 14, flexWrap: "wrap" }}>
              {p.tags.map(t => <span key={t} className="chip chip-ghost">{t}</span>)}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><IconHash/><span className="ttl">Code & config</span></div>
            <div className="oc-code-head">
              <span className="muted mono" style={{ fontSize: 10 }}>main.sql · v1.4.0</span>
              <span className="muted mono" style={{ fontSize: 10, marginLeft: "auto" }}>updated 6d ago</span>
            </div>
            <pre className="oc-code" style={{ maxHeight: 220, overflow: "auto", fontSize: 11 }}>
{`-- ${p.title}
-- Idempotent: safe to re-run within the same term window.
DECLARE
  v_term_in   STVTERM.STVTERM_CODE%TYPE := '202610';
  v_term_out  STVTERM.STVTERM_CODE%TYPE := '202710';
BEGIN
  INSERT INTO sturlrcv (sturlrcv_term_in, sturlrcv_term_out)
       VALUES (v_term_in, v_term_out)
   ON CONFLICT DO NOTHING;
  rollover_pot   (v_term_in, v_term_out);
  rollover_sfar  (v_term_in, v_term_out);
  rollover_cohort(v_term_in, v_term_out);
END;`}
            </pre>
          </div>

          <div className="card">
            <div className="card-head"><IconShield/><span className="ttl">Prerequisites</span></div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              <li>Banner Saas Select tier with Term Code Configuration OC approved.</li>
              <li>STVTERM, SFARCTL, and parts-of-term tables writable from staging schema.</li>
              <li>SOATERM target term must already exist (created via OC-2.4.1).</li>
              <li>Audit user (sturlrcv_user) provisioned in service account directory.</li>
            </ul>
          </div>
        </div>

        <div className="flex-col" style={{ gap: 14 }}>
          <div className="card">
            <div className="card-head"><IconUsers/><span className="ttl">Who's using it</span><span className="muted mono" style={{ fontSize: 11, marginLeft: "auto" }}>{p.used} engagements</span></div>
            <div className="flex-col" style={{ gap: 6 }}>
              {adopters.map(e => (
                <div key={e.id} className="flex-row" style={{ padding: "8px 10px", background: "var(--bg-panel)", borderRadius: 6 }}>
                  <span className="chip chip-mono chip-ghost" style={{ fontSize: 9 }}>{e.tier}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{e.name}</div>
                    <div className="muted mono" style={{ fontSize: 10 }}>{e.product} · {e.phase}</div>
                  </div>
                  <span className={`chip chip-mono ${e.health === "green" ? "chip-emerald" : "chip-amber"}`}>{e.health}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><IconBranch/><span className="ttl">Version history</span></div>
            <div className="flex-col" style={{ gap: 0 }}>
              {[
                { v: "1.4.0", when: "6d ago",    note: "Idempotency guards; safe re-run in same window." },
                { v: "1.3.2", when: "Mar 2026",  note: "Added cohort-rollover for graduate priority groups." },
                { v: "1.3.0", when: "Jan 2026",  note: "Audit-user requirement; emits sturlrcv events." },
                { v: "1.0.0", when: "Q4 2024",   note: "Initial promotion from WIU 2024 retro." },
              ].map(v => (
                <div key={v.v} style={{ padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <div className="flex-row"><span className="id-pill">v{v.v}</span><span className="muted mono" style={{ fontSize: 10, marginLeft: "auto" }}>{v.when}</span></div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5 }}>{v.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.10), transparent)", borderColor: "var(--accent-border)" }}>
            <div className="flex-row" style={{ marginBottom: 8 }}>
              <IconGitFork/>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Fork into engagement</span>
            </div>
            <p className="muted" style={{ fontSize: 12, lineHeight: 1.6, margin: "0 0 12px" }}>Fork creates an engagement-local copy you can edit. Upstream updates can be pulled later. Telemetry (uses, results) flows back to the practice.</p>
            <button className="btn btn-primary" style={{ width: "100%" }}>Fork into Northern State <IconArrowRight/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shortcuts cheatsheet ───────────────────────────────────────────────────
export function ShortcutsCheatsheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const groups = [
    { name: "Navigate", items: [
      ["? ", "Open this cheatsheet"],
      ["⌘ K", "Open Navigator"],
      ["/", "Open Navigator (overlay)"],
      ["g h", "Project Home"],
      ["g m", "My Work"],
      ["g s", "Smart Queue"],
      ["g o", "OC Guide (SOATERM)"],
      ["g a", "Configuration Autopilot"],
      ["g c", "Capabilities"],
      ["g d", "Documents"],
      ["g i", "Inner Source"],
      ["g x", "Practice Cockpit"],
    ]},
    { name: "Theme & UI", items: [
      ["t", "Toggle dark/light theme"],
      ["[", "Compact density"],
      ["]", "Comfortable density"],
      ["esc", "Close overlays / drawers"],
    ]},
  ];
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-shell" onClick={e => e.stopPropagation()} style={{ width: 640 }}>
        <div className="modal-head">
          <div className="flex-row"><IconHash size={12}/><span style={{ fontWeight: 600, fontSize: 13 }}>Keyboard shortcuts</span></div>
          <button className="tb-ic" onClick={onClose}><IconClose size={14}/></button>
        </div>
        <div className="modal-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {groups.map(g => (
              <div key={g.name}>
                <div className="uppercase-eyebrow" style={{ marginBottom: 8 }}>{g.name}</div>
                <div className="flex-col" style={{ gap: 6 }}>
                  {g.items.map(([k, l], i) => (
                    <div key={i} className="flex-row" style={{ padding: "5px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                      <span className="kbd" style={{ minWidth: 56, textAlign: "center" }}>{k}</span>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-foot"><span className="muted mono" style={{ fontSize: 10, marginRight: "auto" }}>Press <span className="kbd">esc</span> to close</span></div>
      </div>
    </div>
  );
}

// ─── External-tool mock drawer (Jira / Smartsheet / etc.) ───────────────────
export function ExternalDrawer({ open, target, onClose }: { open: boolean; target: { system: string; title: string; key?: string } | null; onClose: () => void }) {
  const [phase, setPhase] = React.useState<"loading" | "loaded">("loading");
  React.useEffect(() => {
    if (!open) return;
    setPhase("loading");
    const t = setTimeout(() => setPhase("loaded"), 700);
    return () => clearTimeout(t);
  }, [open, target]);
  if (!open || !target) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ justifyContent: "flex-end", padding: 0 }}>
      <div className="modal-shell" onClick={e => e.stopPropagation()} style={{ width: 580, height: "100vh", maxHeight: "100vh", borderRadius: 0 }}>
        <div className="modal-head">
          <div className="flex-row">
            <span className="chip chip-mono chip-ghost" style={{ textTransform: "uppercase" }}>{target.system}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{target.title}</span>
          </div>
          <button className="tb-ic" onClick={onClose}><IconClose size={14}/></button>
        </div>
        <div className="modal-body" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {phase === "loading" && (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, border: "3px solid var(--accent-dim)", borderTopColor: "var(--accent)", animation: "ai-pulse 1s linear infinite" }}/>
              <div className="muted mono" style={{ fontSize: 11 }}>Launching {target.system} · read-only mock pane…</div>
            </div>
          )}
          {phase === "loaded" && (
            <div style={{ flex: 1, overflow: "auto", padding: 18 }}>
              <div className="oc-callout oc-callout-pattern">
                <div className="oc-callout-head"><IconExternal size={11}/><span>Read-only mock pane</span></div>
                <p>This is an embedded preview of {target.system} for demo purposes. In production, this opens in a new tab with deep-link to the live record.</p>
              </div>
              <div className="uppercase-eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>{target.system === "Jira" ? "Issue" : target.system === "Smartsheet" ? "Sheet · row" : "Record"} · {target.title}</div>
              <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
                {target.system === "Jira" ? <MockJira ticket={target}/> : target.system === "Smartsheet" ? <MockSmartsheet/> : <MockGeneric/>}
              </div>
            </div>
          )}
        </div>
        <div className="modal-foot">
          <span className="muted mono" style={{ fontSize: 10, marginRight: "auto" }}>Mock pane · last sync 2m ago</span>
          <button className="btn">Open in new tab <IconExternal size={11}/></button>
        </div>
      </div>
    </div>
  );
}

function MockJira({ ticket }: { ticket: { title: string; key?: string } }) {
  const key = ticket.key || "NSU-184";
  return (
    <>
      <div className="flex-row" style={{ marginBottom: 12 }}>
        <span className="id-pill">{key}</span>
        <span className="chip chip-mono chip-rose">P1</span>
        <span className="chip chip-accent">In Progress</span>
        <span className="muted mono" style={{ fontSize: 10, marginLeft: "auto" }}>Sprint 1 · 4d</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{ticket.title}</div>
      <div className="flex-col" style={{ gap: 8 }}>
        {[
          ["Status", "In Progress"],
          ["Assignee", "Janet Hawkins"],
          ["Reporter", "Cara Stein"],
          ["Story points", "5"],
          ["Linked", "blocks NSU-220, blocks NSU-225"],
          ["Epic", "Curriculum Mgmt — Term Setup"],
        ].map(([k, v]) => (
          <div key={k} className="spread" style={{ padding: "6px 0", borderBottom: "1px solid var(--border-subtle)", fontSize: 12 }}>
            <span className="muted mono" style={{ fontSize: 10 }}>{k}</span>
            <span style={{ color: "var(--text-primary)" }}>{v}</span>
          </div>
        ))}
      </div>
      <div className="uppercase-eyebrow" style={{ marginTop: 14, marginBottom: 8 }}>Activity</div>
      <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.7, fontFamily: "var(--font-mono)" }}>
        <div>· Janet H. transitioned to In Progress (12m ago)</div>
        <div>· Cara S. set priority to P1 (1h ago)</div>
        <div>· Created from Toolkit · OC-2.4.1 (Yesterday)</div>
      </div>
    </>
  );
}

function MockSmartsheet() {
  return (
    <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
      <thead><tr style={{ background: "var(--bg-panel)" }}>{["Task", "Owner", "Start", "Finish", "% Done", "Pred"].map(h => <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: 0.4 }}>{h}</th>)}</tr></thead>
      <tbody>
        {[
          ["Sprint 1 · Curriculum & Records", "JH", "Apr 22", "May 9", 58, ""],
          ["  SOATERM Term Setup", "JH", "Apr 22", "Apr 30", 100, ""],
          ["  Parts-of-Term Confirmation", "JH", "Apr 28", "May 2", 75, "1.1"],
          ["  Reg Window DRC-3", "JH", "Apr 30", "May 5", 30, "1.2"],
          ["  SSASECT Section Build", "MT", "May 1", "May 9", 10, "1.3"],
          ["Sprint 2 · HR Cutover Prep", "DL", "May 12", "May 23", 0, "1"],
        ].map((row, i) => (
          <tr key={i} style={{ background: i === 0 ? "var(--bg-panel)" : "transparent", fontWeight: i === 0 ? 600 : 400 }}>
            {row.map((c, j) => <td key={j} style={{ padding: "6px 8px", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontFamily: j === 4 || j === 5 ? "var(--font-mono)" : "inherit" }}>{j === 4 ? `${c}%` : c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MockGeneric() {
  return <div className="muted" style={{ fontSize: 12 }}>External record preview.</div>;
}
