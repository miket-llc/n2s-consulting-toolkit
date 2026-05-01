"use client";
// ============================================================================
// COMPONENTS — design system reference
// NAV SPEC — narrative documentation
// ============================================================================

import * as React from "react";
import {
  IconSparkles, IconBolt, IconRefresh, IconShield, IconAlert,
} from "@/components/icons";
import { Sparkline } from "@/components/shell";

export function ComponentsLib() {
  return (
    <div className="page page-narrow">
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Design system reference</div>
          <h1 className="ph-title">Components</h1>
          <p className="ph-sub">Living reference. Every component shown here is what the rest of the app uses — same code paths, no decorative re-implementations.</p>
        </div>
      </div>

      <Section title="Brand" sub="Tokens, type, palette">
        <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
          {[
            { n: "Primary", c: "#9333ea" }, { n: "Accent", c: "#8b5cf6" }, { n: "Bright", c: "#3ecfff" },
            { n: "Emerald", c: "#3ee8a8" }, { n: "Amber", c: "#ffc94d" }, { n: "Rose", c: "#ff86a8" },
          ].map(s => (
            <div key={s.n}>
              <div style={{ height: 56, borderRadius: 8, background: s.c, border: "1px solid var(--border)" }}/>
              <div className="muted mono" style={{ fontSize: 10, marginTop: 4 }}>{s.n} · {s.c}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type" sub="Inter Tight + IBM Plex Mono">
        <div className="card">
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>The configuration is the deliverable.</div>
          <div style={{ fontSize: 16, marginTop: 8, color: "var(--text-secondary)" }}>Body — used for callouts and section sub-copy.</div>
          <div className="muted mono" style={{ fontSize: 12, marginTop: 6 }}>SOATERM · STVTERM_CODE · 202610</div>
        </div>
      </Section>

      <Section title="Chips" sub="Status, priority, identifier">
        <div className="card flex-row" style={{ flexWrap: "wrap" }}>
          {["chip-accent", "chip-emerald", "chip-amber", "chip-rose", "chip-violet", "chip-ghost"].map(c => <span key={c} className={`chip ${c}`}>{c.replace("chip-", "")}</span>)}
          {["P1", "P2", "P3"].map(p => <span key={p} className={`chip chip-mono ${p === "P1" ? "chip-rose" : p === "P2" ? "chip-amber" : "chip-ghost"}`}>{p}</span>)}
          <span className="id-pill">NSU-184</span>
          <span className="id-pill">OC-2.4.1</span>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="card flex-row" style={{ flexWrap: "wrap" }}>
          <button className="btn">Default</button>
          <button className="btn btn-primary"><IconSparkles/> Primary</button>
          <button className="btn btn-tiny">Tiny</button>
          <button className="btn btn-tiny btn-primary"><IconBolt/> Tiny + primary</button>
          <button className="btn btn-icon"><IconRefresh/></button>
        </div>
      </Section>

      <Section title="Callouts" sub="Best practice, watch-out, pattern">
        <div className="card">
          <div className="oc-callout oc-callout-best-practice">
            <div className="oc-callout-head"><IconShield size={12}/><span>Best practice</span></div>
            <p>Stick to YYYYMM. Custom term-code formats fragment integration tooling.</p>
          </div>
          <div style={{ height: 8 }}/>
          <div className="oc-callout oc-callout-watchout">
            <div className="oc-callout-head"><IconAlert size={12}/><span>Watch-out</span></div>
            <p>Once SOATERM is saved with a term code, the code itself cannot be changed without a destructive migration.</p>
          </div>
          <div style={{ height: 8 }}/>
          <div className="oc-callout oc-callout-pattern">
            <div className="oc-callout-head"><IconBolt size={12}/><span>Pattern</span></div>
            <p>WIU and South Methodist both adopted the 4-PoT layout — pattern reusable as 'pot-4-block-v2'.</p>
          </div>
        </div>
      </Section>

      <Section title="Progress">
        <div className="card">
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Bar — accent</div>
          <div className="bar"><div className="fill" style={{ width: "62%" }}/></div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, marginTop: 14 }}>Bar — emerald</div>
          <div className="bar fill-emerald"><div className="fill" style={{ width: "84%" }}/></div>
        </div>
      </Section>

      <Section title="Sparkline">
        <div className="card flex-row" style={{ gap: 24 }}>
          <Sparkline data={[38, 36, 33, 31, 28, 26, 24, 22]} width={180} height={42} stroke="var(--accent-bright)"/>
          <Sparkline data={[10, 14, 12, 18, 22, 20, 24, 28]} width={180} height={42} stroke="var(--emerald)"/>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{title}</div>
        {sub && <div className="muted" style={{ fontSize: 11 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

// ============================================================================
// NAV SPEC — narrative documentation
// ============================================================================
export function NavSpec() {
  return (
    <div className="page page-narrow" style={{ maxWidth: 880 }}>
      <div className="ph">
        <div>
          <div className="ph-eyebrow">Information architecture · narrative spec</div>
          <h1 className="ph-title">Navigation Spec</h1>
          <p className="ph-sub">How this app's nav is constructed, why each level exists, and the unsolved tradeoffs that need a call.</p>
        </div>
      </div>

      <div className="card" style={{ lineHeight: 1.7, fontSize: 14, color: "var(--text-secondary)" }}>
        <h2 style={{ fontSize: 18, color: "var(--text-primary)", marginTop: 0, marginBottom: 14 }}>The three-tier model</h2>
        <p>The toolkit is for an Ellucian consultant in the middle of a multi-go-live engagement. The mental model has three rings: <strong>cross-project</strong> (their day starts here, across all engagements), <strong>project</strong> (the engagement they're configuring right now), and <strong>reference</strong> (methodology, navigator, inner source — context they pull from, never push to).</p>

        <p>The left rail mirrors that model. The top section is cross-project (My Work, Smart Queue). The middle expands when a project is active and shows the project's content (Overview, Schedule, Capabilities, Tasks). The bottom is reference, always available, identical regardless of which project you're in.</p>

        <h2 style={{ fontSize: 18, color: "var(--text-primary)", marginTop: 24, marginBottom: 14 }}>Why a project-aware top bar</h2>
        <p>The top bar is the engagement context. It carries three things the consultant looks at every minute: which project they're in (left), where they are in time (the schedule pill — sprint progress and next go-live), and personal/global utilities (right). Switching projects is one click on the project chip; a dropdown shows the recents.</p>

        <p>The schedule pill is more than ornamentation. The consultant's life is paced by go-lives — May 24 HR cutover, Aug 18 Finance, Nov 30 Student. Putting <em>days-to-next-GL</em> in the chrome makes that pace impossible to ignore.</p>

        <h2 style={{ fontSize: 18, color: "var(--text-primary)", marginTop: 24, marginBottom: 14 }}>The capability → BP → OC ladder</h2>
        <p>N2S is built around a hierarchy: <strong>Business Capability</strong> (e.g. Curriculum Mgmt) → <strong>Business Process</strong> (Term Setup) → <strong>Operational Component</strong> (SOATERM · Term Code Configuration). The product nav follows that ladder — Capabilities is the index, click any card to walk down to the BP, then to the OC guide.</p>

        <p>Each go-live in the schedule is just a date with a set of capabilities tagged to it. That tag is the ground-truth scoping mechanism — adding a capability to a go-live commits a chain of BPs and OCs, all visible at every level.</p>

        <h2 style={{ fontSize: 18, color: "var(--text-primary)", marginTop: 24, marginBottom: 14 }}>The OC guide is the deepest thing</h2>
        <p>OC guides are where 70% of the consulting hours go. They're long, structured, multi-step, and they need to host the <em>action</em> as well as the documentation — the linked Jira tasks, the AI-generated test cases, and the live config preview.</p>

        <p>Three layouts are offered (toggle via Tweaks): <strong>Long-scroll</strong> (single column, narrative-first — best for reading and onboarding), <strong>Sidebar TOC</strong> (left rail of sections, content stays single-column), and <strong>Two-pane</strong> (TOC + content + live preview pane — best for active configuration). Each has its time and place; the two-pane is the default during active work.</p>

        <h2 style={{ fontSize: 18, color: "var(--text-primary)", marginTop: 24, marginBottom: 14 }}>What's intentionally missing</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li><strong>No second-level nav inside a project.</strong> Sub-pages are reachable from cards or via the OC guide breadcrumbs. Nesting two levels deep in the rail loses people.</li>
          <li><strong>No global notifications inbox.</strong> Notifications are inline (the Smart Queue, the autopilot run feed). A separate inbox just adds another place to check.</li>
          <li><strong>No standalone reports.</strong> Every dashboard is a view of live data; "reports" are exports of those views.</li>
        </ul>

        <h2 style={{ fontSize: 18, color: "var(--text-primary)", marginTop: 24, marginBottom: 14 }}>Open questions</h2>
        <ul style={{ paddingLeft: 18 }}>
          <li>Should "Practice Cockpit" be its own top-level (current) or nested under My Work as a "Portfolio" tab?</li>
          <li>How does a consultant handle <em>two engagements at the same client</em> (e.g. NSU is also doing a CRM Recruit project)? Do they share a project chip, or two?</li>
          <li>Inner Source is reference-tier today. Should contributing-from-OC be promoted into the OC guide chrome itself?</li>
        </ul>
      </div>
    </div>
  );
}
