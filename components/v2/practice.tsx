"use client";

// Portfolio — across-engagements landing.

import * as React from "react";
import { Icon } from "./icons";
import {
  useApp, useHash, PageHero, BriefBody, Section, ThreeThings, notImplemented, SchoolLogo,
} from "./shell";
import { composeBrief } from "@/lib/brief";
import { TASKS } from "@/lib/data";

function PracticeBrief() {
  const { currentProject } = useApp();
  const [, navigate] = useHash();
  const brief = composeBrief("practice", { now: new Date() });

  return (
    <div className="v2-brief">
      <div>
        <div className="v2-brief-eyebrow">
          <Icon name="ai" size={13}/>
          <span>The brief · across your engagements</span>
        </div>
        <p className="v2-brief-body">
          <BriefBody fragments={brief.fragments}/>
        </p>
        <div className="v2-brief-meta">
          <span>Composed {brief.time} · {brief.date}</span>
          <span>·</span>
          <span>{brief.stats.engagements} engagements · {brief.stats.attention} need attention · {brief.stats.decisions} open decisions</span>
        </div>
      </div>
      <div className="v2-brief-aside">
        <button
          className="btn btn-primary"
          onClick={() => navigate("project")}
          title="Open the project that needs attention first"
        >
          <Icon name="arrow-right" size={14}/>
          <span>Jump into {currentProject?.name?.split(" ")[0]}</span>
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate("mywork")}>
          <Icon name="inbox" size={13}/>
          <span>My work today</span>
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => notImplemented("Recompose — would re-run the LLM pass")}>
          <Icon name="sparkle" size={13}/>
          <span>Recompose</span>
        </button>
        <div className="v2-brief-asidefoot">summarized from live data</div>
      </div>
    </div>
  );
}

function PracticeThreeThings() {
  const [, navigate] = useHash();
  return (
    <ThreeThings items={[
      {
        tone: "warn", icon: "decisions",
        eyebrow: "Chase today",
        title: "FA cohort cutover · NSU",
        sub: "Open 6 days · blocking 4 sprint stories",
        onClick: () => navigate("decisions"),
      },
      {
        tone: "bad", icon: "warn",
        eyebrow: "CSU East Bay slipping",
        title: "Finance configuration is the drag",
        sub: "Vendor onboarding 31% · target was 60% by end of Sprint 3",
      },
      {
        tone: "accent", icon: "play",
        eyebrow: "Tuesday 10am",
        title: "NSU Sprint 1 demo prep",
        sub: "3 stories pending review · runbook needs a final pass",
        onClick: () => navigate("workshops"),
      },
    ]}/>
  );
}

function ProjectCards() {
  const { portfolio, currentProjectId, setCurrentProjectId } = useApp();
  const [, navigate] = useHash();

  const sorted = [...portfolio].sort((a, b) => {
    const order: Record<string, number> = { rose: 0, amber: 1, green: 2 };
    if (order[a.health] !== order[b.health]) return order[a.health] - order[b.health];
    return a.readiness - b.readiness;
  });

  type Seg = string | { em: "warn" | "good" | "bad"; text: string };
  const lines: Record<string, Seg[]> = {
    "Northern State University":   ["You're lead. Sprint 1 at ", { em: "good", text: "58%" }, ". Two ", { em: "warn", text: "client decisions to chase" }, " for Tuesday's demo."],
    "Western Illinois University": ["Stabilization, week 3. ", { em: "good", text: "Quiet" }, " — only 2 backlog tickets, both low severity."],
    "CSU East Bay":                [{ em: "warn", text: "Amber" }, ". Finance configuration ", { em: "warn", text: "31%" }, " against ", { em: "warn", text: "60% target" }, ". Vendor onboarding is the bottleneck."],
    "University of South Carolina": ["Discovery week 2. Workshops scheduled, no fires. Read-only — Cara is lead."],
    "University of Vermont":        [{ em: "warn", text: "Amber" }, ". Cross-functional review pending — read-only."],
    "Lafayette College":            ["Read-only — Derek is lead."],
    "Oakland University":           ["Stabilization, ", { em: "good", text: "go-live in 6 days" }, ". On the watch list."],
    "Coastline Community College":  ["Build phase. Standard cadence. Read-only."],
  };

  return (
    <div className="stack gap-3">
      {sorted.map(p => {
        const line = lines[p.name] || ["Standard cadence."];
        const isCurrent = p.id === currentProjectId;
        const cls = ["v2-projcard",
          p.health === "amber" ? "v2-projcard-attn" : "",
          p.health === "rose" ? "v2-projcard-bad" : "",
          isCurrent ? "v2-projcard-pinned" : ""].filter(Boolean).join(" ");

        return (
          <button key={p.id} className={cls} onClick={() => { setCurrentProjectId(p.id); navigate("project"); }}>
            <SchoolLogo project={p} size={44} rounded="md"/>
            <div style={{ minWidth: 0 }}>
              <div className="v2-projcard-name">
                {p.name}
                {isCurrent && (
                  <span className="v2-projcard-pin"><Icon name="check" size={11}/> current</span>
                )}
              </div>
              <div className="v2-projcard-meta">
                <span>{p.product}</span>
                <span>·</span>
                <span>{p.tier}</span>
                <span>·</span>
                <span>{p.phase}</span>
                <span className="internals-inline">·</span>
                <span className="internals t-mono">{p.sprint}</span>
              </div>
              <div className="v2-projcard-line">
                {line.map((seg, i) => typeof seg === "string"
                  ? <span key={i}>{seg}</span>
                  : <span key={i} className={`em-${seg.em}`}>{seg.text}</span>
                )}
              </div>
            </div>
            <div className="v2-projcard-stat">
              <span className={`pill pill-${p.health === "green" ? "emerald" : p.health === "amber" ? "amber" : "rose"} pill-dot`}>
                {p.health === "green" ? "On pace" : p.health === "amber" ? "Amber" : "Off-track"}
              </span>
              <div className="v2-projcard-readiness">{p.readiness}%</div>
              <div className="t-meta">Next: {p.nextGL}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function TodayAcross() {
  const tasks = TASKS.slice(0, 6);
  const [, navigate] = useHash();

  return (
    <div className="v2-list">
      {tasks.map(t => {
        const tone = t.status === "Needs Review" ? "amber" : "accent";
        return (
          <button key={t.id} className="v2-row" onClick={() => navigate("mywork")}>
            <span className={`v2-row-marker ${tone}`}/>
            <div style={{ minWidth: 0 }}>
              <div className="v2-row-title">{t.title}</div>
              <div className="v2-row-sub">
                <span>{t.project}</span>
                <span> · </span>
                <span>{t.due || "this week"}</span>
                <span className="internals-inline"> · </span>
                <span className="internals t-mono">{t.jiraId}</span>
              </div>
            </div>
            <span className={`pill pill-${t.status === "Needs Review" ? "amber" : "neutral"}`}>
              {t.status === "Needs Review" ? "In review" : "Active"}
            </span>
            <Icon name="chevron-right" size={14} style={{ color: "var(--text-ghost)" }}/>
          </button>
        );
      })}
    </div>
  );
}

export function PracticeHome() {
  const { defaultLanding, setDefaultLanding } = useApp();
  const [, navigate] = useHash();
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        headline="Across your engagements"
        sub="Everything you're touching this week, summarized across all your engagements. Click into a project for the same brief, scoped to that engagement."
        actions={
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setDefaultLanding(defaultLanding === "practice" ? "project" : "practice")}
            title="Set what opens when you launch the toolkit"
          >
            <Icon name="settings" size={13}/>
            <span>{defaultLanding === "practice" ? "Open here on launch" : "Default: project view"}</span>
          </button>
        }
      />
      <PracticeBrief/>
      <PracticeThreeThings/>

      <Section
        eyebrow="Your engagements"
        title="Eight active · sorted by attention"
      >
        <ProjectCards/>
      </Section>

      <Section
        eyebrow="Today, across everything"
        title="Working list"
        action={<button className="btn-link" onClick={() => navigate("mywork")}>Open My work →</button>}
      >
        <TodayAcross/>
      </Section>
    </>
  );
}
