"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";

import { TopBar, Rail, AIAssistant, Avatar } from "@/components/shell";
import {
  IconClose, IconBolt, IconSparkles, IconArrowRight,
} from "@/components/icons";
import {
  useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakButton,
} from "@/components/tweaks-panel";
import { TASKS, ENGAGEMENT } from "@/lib/data";

import { MyWork, ProjectHome, Schedule } from "@/components/views/views-1";
import { Capabilities, SprintTasks } from "@/components/views/views-2";
import { Autopilot, InnerSource, Cockpit } from "@/components/views/views-3";
import { OCGuide } from "@/components/views/views-oc";
import { ComponentsLib, NavSpec } from "@/components/views/views-meta";
import {
  Documents, NavigatorOverlay, Methodology, SmartQueue, PathfinderIndex,
  CapabilityDetail, PatternDetail, ShortcutsCheatsheet, ExternalDrawer,
} from "@/components/views/views-new";

type Task = (typeof TASKS)[number];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "ocLayout": "sidebar-toc",
  "showAIFab": true,
  "density": "comfortable",
}/*EDITMODE-END*/;

export default function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS as Record<string, unknown>);
  const [route, setRoute] = useState<string>(() =>
    typeof window === "undefined"
      ? "project-home"
      : (window.location.hash || "#project-home").slice(1) || "project-home"
  );
  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [openOC, setOpenOC] = useState<string | null>(null);
  const [openCapability, setOpenCapability] = useState<string | null>(null);
  const [openPattern, setOpenPattern] = useState<string | null>(null);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [externalTarget, setExternalTarget] = useState<{ system: string; title: string; key?: string } | null>(null);

  // Apply theme + density to <html>
  useEffect(() => {
    document.documentElement.dataset.theme = tweaks.theme as string;
    document.documentElement.dataset.density = tweaks.density as string;
    document.documentElement.classList.toggle("theme-light", tweaks.theme === "light");
  }, [tweaks.theme, tweaks.density]);

  // Hash routing
  useEffect(() => {
    const h = "#" + route;
    if (location.hash !== h) history.replaceState(null, "", h);
  }, [route]);
  useEffect(() => {
    const onHash = () => { const r = location.hash.slice(1); if (r) setRoute(r); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const nav = useCallback((id: string) => {
    setOpenOC(null); setOpenCapability(null); setOpenPattern(null);
    setRoute(id);
  }, []);

  type JumpItem = { kind: string; payload: string };
  const onJump = useCallback((it: JumpItem) => {
    if (it.kind === "OC") { setOpenOC(it.payload); return; }
    if (it.kind === "Capability") { setOpenCapability(it.payload); setRoute("capabilities"); return; }
    if (it.kind === "Pattern") { setOpenPattern(it.payload); setRoute("innersource"); return; }
    if (it.kind === "Task") { const t = TASKS.find(x => x.id === it.payload); if (t) setOpenTask(t); return; }
    if (it.kind === "Document") { nav("documents"); return; }
    if (it.kind === "Engagement") { nav("cockpit"); return; }
    if (it.kind === "Person") { nav("project-home"); return; }
  }, [nav]);

  // Keyboard shortcuts
  useEffect(() => {
    let buf = "";
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        if (e.key === "Escape") { setNavigatorOpen(false); setShortcutsOpen(false); }
        return;
      }
      if (e.metaKey || e.ctrlKey) {
        if (e.key.toLowerCase() === "k") { e.preventDefault(); setNavigatorOpen(v => !v); return; }
      }
      if (e.key === "Escape") {
        setNavigatorOpen(false); setShortcutsOpen(false); setExternalTarget(null);
        setOpenTask(null);
        return;
      }
      if (e.key === "?") { setShortcutsOpen(v => !v); return; }
      if (e.key === "/") { e.preventDefault(); setNavigatorOpen(true); return; }
      if (e.key === "t") { setTweak("theme", tweaks.theme === "dark" ? "light" : "dark"); return; }
      if (e.key === "[") { setTweak("density", "compact"); return; }
      if (e.key === "]") { setTweak("density", "comfortable"); return; }
      // g-prefix sequences
      if (buf === "g") {
        const map: Record<string, string> = { h: "project-home", m: "my-work", s: "smart-queue", a: "autopilot", c: "capabilities", d: "documents", i: "innersource", x: "cockpit", l: "methodology" };
        if (e.key === "o") { setOpenOC("soaterm"); buf = ""; return; }
        if (map[e.key]) { nav(map[e.key]); buf = ""; return; }
        buf = "";
      }
      if (e.key === "g") {
        buf = "g";
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => { buf = ""; }, 900);
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tweaks.theme, nav, setTweak]);

  // Listen for external-launch events posted by views (Jira/Smartsheet links)
  useEffect(() => {
    const onMsg = (ev: MessageEvent) => {
      if (ev.data?.type === "__open_external") setExternalTarget(ev.data.target);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <div className="app-shell">
      <TopBar route={route} onNav={nav} theme={tweaks.theme as string} setTheme={(t) => setTweak("theme", t)} projectActive={true} hasNotif={true} onOpenNavigator={() => setNavigatorOpen(true)} onOpenShortcuts={() => setShortcutsOpen(true)}/>
      <div className="app-body">
        <Rail route={route} onNav={nav} projectActive={true}/>
        <main className="app-main">
          {openOC && <OCGuide ocId={openOC} layout={tweaks.ocLayout as string} onBack={() => setOpenOC(null)} onOpenTask={(t) => setOpenTask(t as unknown as Task)}/>}
          {!openOC && openCapability && <CapabilityDetail id={openCapability} onBack={() => setOpenCapability(null)} onOpenOC={(id) => { setOpenCapability(null); setOpenOC(id); }}/>}
          {!openOC && openPattern && <PatternDetail id={openPattern} onBack={() => setOpenPattern(null)}/>}
          {!openOC && !openCapability && !openPattern && (
            <>
              {route === "my-work" && <MyWork onNav={nav} onOpenTask={setOpenTask}/>}
              {route === "smart-queue" && <SmartQueue onOpenTask={setOpenTask}/>}
              {route === "navigator" && <NavigatorOverlay open={true} fullPage={true} onClose={() => {}} onJump={onJump}/>}
              {route === "project-home" && <ProjectHome onNav={nav}/>}
              {route === "schedule" && <Schedule/>}
              {route === "capabilities" && <Capabilities onOpenOC={(oc) => setOpenOC(oc.id)} onOpenCapability={(cap) => setOpenCapability(cap.id)}/>}
              {route === "tasks" && <SprintTasks onOpenTask={setOpenTask}/>}
              {route === "pathfinder" && <PathfinderIndex onOpenOC={(id) => setOpenOC(id)}/>}
              {route === "autopilot" && <Autopilot/>}
              {route === "documents" && <Documents tweaks={tweaks}/>}
              {route === "methodology" && <Methodology density={tweaks.density as string}/>}
              {route === "innersource" && <InnerSource onOpenPattern={(p) => setOpenPattern(p.id)}/>}
              {route === "cockpit" && <Cockpit/>}
              {route === "components" && <ComponentsLib/>}
              {route === "navspec" && <NavSpec/>}
            </>
          )}
        </main>
      </div>
      {(tweaks.showAIFab as boolean) && <AIAssistant context={openOC ? "OC: SOATERM · Term Code Configuration" : null}/>}

      <NavigatorOverlay open={navigatorOpen && route !== "navigator"} onClose={() => setNavigatorOpen(false)} onJump={onJump}/>
      <ShortcutsCheatsheet open={shortcutsOpen} onClose={() => setShortcutsOpen(false)}/>
      <ExternalDrawer open={!!externalTarget} target={externalTarget} onClose={() => setExternalTarget(null)}/>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Theme">
          <TweakRadio label="Mode" value={tweaks.theme as string} onChange={v => setTweak("theme", v)} options={[{value: "dark", label: "Dark"}, {value: "light", label: "Light"}]}/>
          <TweakRadio label="Density" value={tweaks.density as string} onChange={v => setTweak("density", v)} options={[{value: "comfortable", label: "Comfortable"}, {value: "compact", label: "Compact"}]}/>
        </TweakSection>
        <TweakSection title="OC Guide layout">
          <TweakRadio label="Layout" value={tweaks.ocLayout as string} onChange={v => setTweak("ocLayout", v)} options={[
            {value: "long-scroll", label: "Long scroll"},
            {value: "sidebar-toc", label: "Sidebar TOC"},
            {value: "two-pane", label: "Two-pane"},
          ]}/>
        </TweakSection>
        <TweakSection title="Helpers">
          <TweakToggle label="N2S Copilot launcher" checked={tweaks.showAIFab as boolean} onChange={v => setTweak("showAIFab", v)}/>
        </TweakSection>
        <TweakSection title="Jump to">
          <TweakButton label="⌘K · Navigator" onClick={() => setNavigatorOpen(true)}/>
          <TweakButton label="? · Keyboard shortcuts" onClick={() => setShortcutsOpen(true)}/>
          <TweakButton label="SOATERM OC guide" onClick={() => { setOpenOC("soaterm"); }}/>
          <TweakButton label="Pathfinder index" onClick={() => nav("pathfinder")}/>
          <TweakButton label="Capabilities" onClick={() => nav("capabilities")}/>
          <TweakButton label="Capability detail · Curriculum" onClick={() => { nav("capabilities"); setOpenCapability("bc-curriculum"); }}/>
          <TweakButton label="Smart Queue" onClick={() => nav("smart-queue")}/>
          <TweakButton label="Documents" onClick={() => nav("documents")}/>
          <TweakButton label="Methodology library" onClick={() => nav("methodology")}/>
          <TweakButton label="Inner Source" onClick={() => nav("innersource")}/>
          <TweakButton label="Pattern detail · WIU PoT" onClick={() => { nav("innersource"); setOpenPattern("is-2"); }}/>
          <TweakButton label="Autopilot" onClick={() => nav("autopilot")}/>
          <TweakButton label="Practice Cockpit" onClick={() => nav("cockpit")}/>
          <TweakButton label="Mock · Jira ticket" onClick={() => setExternalTarget({ system: "Jira", title: "NSU-184 · Confirm parts-of-term split", key: "NSU-184" })}/>
          <TweakButton label="Mock · Smartsheet plan" onClick={() => setExternalTarget({ system: "Smartsheet", title: "NSU · Master Schedule (Sprint 1)" })}/>
          <TweakButton label="Read nav spec" onClick={() => nav("navspec")}/>
          <TweakButton label="Components library" onClick={() => nav("components")}/>
        </TweakSection>
      </TweaksPanel>

      {openTask && <TaskDetail t={openTask} onClose={() => setOpenTask(null)}/>}
    </div>
  );
}

function TaskDetail({ t, onClose }: { t: Task; onClose: () => void }) {
  const m = ENGAGEMENT.members.find(x => x.id === t.assignee);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-shell" onClick={e => e.stopPropagation()} style={{ width: 640 }}>
        <div className="modal-head">
          <div className="flex-row">
            <span className="id-pill">{t.jiraId}</span>
            <span className={`chip chip-mono ${t.priority === "P1" ? "chip-rose" : t.priority === "P2" ? "chip-amber" : "chip-ghost"}`}>{t.priority}</span>
            <span className={`chip ${t.status === "In Progress" ? "chip-accent" : t.status === "Needs Review" ? "chip-amber" : "chip-ghost"}`}>{t.status}</span>
          </div>
          <button className="tb-ic" onClick={onClose}><IconClose size={14}/></button>
        </div>
        <div className="modal-body">
          <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 0, marginBottom: 12, color: "var(--text-primary)" }}>{t.title}</h2>
          <div className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
            Synced from Jira {t.lastSync} · capability <strong>{t.capability}</strong> · due {t.due}
          </div>
          <div className="oc-callout oc-callout-pattern">
            <div className="oc-callout-head"><IconBolt size={12}/><span>Linked to OC</span></div>
            <p>This task is tracked under the SOATERM Term Code Configuration guide, section 03 (Parts-of-term). Resolving it unblocks downstream Sprint 2 work on SFARCTL.</p>
          </div>
          <div className="divider-h" style={{ margin: "16px 0" }}/>
          <div className="uppercase-eyebrow" style={{ marginBottom: 8 }}>Activity</div>
          <div className="flex-col" style={{ gap: 10 }}>
            {[
              { who: "Janet H.", when: "12m ago", text: "Pinged registrar's office; expecting confirmation by EOD." },
              { who: "Marisol T.", when: "1h ago", text: "Pulled the WIU 2024 PoT pattern as reference. Looks applicable." },
              { who: "Copilot", when: "2h ago", text: "Drafted 8 acceptance-criteria scenarios. Open the OC to review.", ai: true },
            ].map((a, i) => (
              <div key={i} className="flex-row" style={{ alignItems: "flex-start" }}>
                {a.ai ? (
                  <div style={{ width: 24, height: 24, borderRadius: 12, background: "var(--gradient-button)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}><IconSparkles size={12}/></div>
                ) : (
                  <Avatar m={{ initials: a.who.split(" ").map(s => s[0]).join(""), color: "#3ee8a8" }} size="sm"/>
                )}
                <div style={{ flex: 1 }}>
                  <div className="flex-row" style={{ marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{a.who}</span>
                    <span className="muted mono" style={{ fontSize: 10 }}>· {a.when}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{a.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn">Open in Jira</button>
          <button className="btn btn-primary">Open OC guide <IconArrowRight/></button>
        </div>
      </div>
    </div>
  );
}
