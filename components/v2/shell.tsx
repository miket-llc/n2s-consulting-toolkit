"use client";

// Toolkit v2 — Shell, top bar, project switcher, rail, hooks, page primitives.
// All visual values come from tokens.css. Hash-based routing.

import * as React from "react";
import { useState, useEffect, useRef, useCallback, useContext, createContext } from "react";
import { Icon, IconName } from "./icons";
import { PORTFOLIO, DRCS } from "@/lib/data";
import type { BriefFragment } from "@/lib/brief";

// ── Toast (prototype-stub feedback, replaces alert dialogs) ──────────────
type ToastDetail = { message: string };

export function notImplemented(message: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastDetail>("v2-toast", { detail: { message } }));
}

function ToastHost() {
  const [items, setItems] = useState<Array<{ id: number; message: string }>>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<ToastDetail>).detail;
      const id = ++idRef.current;
      setItems(prev => [...prev, { id, message: detail.message }]);
      window.setTimeout(() => {
        setItems(prev => prev.filter(t => t.id !== id));
      }, 2400);
    };
    window.addEventListener("v2-toast", onToast as EventListener);
    return () => window.removeEventListener("v2-toast", onToast as EventListener);
  }, []);

  if (items.length === 0) return null;
  return (
    <div className="v2-toast-host" aria-live="polite" aria-atomic="true">
      {items.map(t => (
        <div key={t.id} className="v2-toast">{t.message}</div>
      ))}
    </div>
  );
}

// ── Hash routing ──────────────────────────────────────────────────────────
export function useHash(): [string, (h: string) => void] {
  const [hash, setHash] = useState<string>(() =>
    typeof window === "undefined" ? "" : window.location.hash.slice(1) || ""
  );
  useEffect(() => {
    const onHash = () => setHash(window.location.hash.slice(1) || "");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = useCallback((h: string) => {
    window.location.hash = h;
  }, []);
  return [hash, navigate];
}

// ── App context ───────────────────────────────────────────────────────────
type Theme = "light" | "dark";
type DefaultLanding = "practice" | "project";

type Project = typeof PORTFOLIO[number];

type AppCtx = {
  portfolio: Project[];
  currentProject: Project;
  currentProjectId: string;
  setCurrentProjectId: (id: string) => void;
  defaultLanding: DefaultLanding;
  setDefaultLanding: (v: DefaultLanding) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const AppContext = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const portfolio = PORTFOLIO;

  const [currentProjectId, setCurrentProjectIdState] = useState<string>(() => {
    if (typeof window === "undefined") return portfolio[0].id;
    return localStorage.getItem("v2.currentProject") || portfolio[0].id;
  });
  const [defaultLanding, setDefaultLandingState] = useState<DefaultLanding>(() => {
    if (typeof window === "undefined") return "practice";
    return (localStorage.getItem("v2.defaultLanding") as DefaultLanding) || "practice";
  });
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("v2.theme") as Theme) || "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("theme-light", theme === "light");
    localStorage.setItem("v2.theme", theme);
  }, [theme]);

  const setCurrentProjectId = useCallback((id: string) => {
    setCurrentProjectIdState(id);
    localStorage.setItem("v2.currentProject", id);
  }, []);
  const setDefaultLanding = useCallback((v: DefaultLanding) => {
    setDefaultLandingState(v);
    localStorage.setItem("v2.defaultLanding", v);
  }, []);
  const setTheme = useCallback((t: Theme) => setThemeState(t), []);

  const currentProject = portfolio.find(p => p.id === currentProjectId) || portfolio[0];

  const value: AppCtx = {
    portfolio, currentProject, currentProjectId, setCurrentProjectId,
    defaultLanding, setDefaultLanding,
    theme, setTheme,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppCtx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

// ── Acronym chip ──────────────────────────────────────────────────────────
export function Acro({ short, full }: { short: string; full: string }) {
  return <span className="acro" title={full}>{short}</span>;
}

// ── Wordmark ──────────────────────────────────────────────────────────────
function EllucianWordmark() {
  return (
    <span className="v2-wordmark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/ellucian-wordmark.png" alt="Ellucian" className="v2-wordmark-img" draggable={false}/>
      <span className="v2-wordmark-divider" aria-hidden/>
      <span className="v2-wordmark-tag">Consulting Toolkit</span>
    </span>
  );
}

// ── Project switcher ──────────────────────────────────────────────────────
function ProjectSwitcher() {
  const { portfolio, currentProject, setCurrentProjectId } = useApp();
  const [, navigate] = useHash();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const sorted = [...portfolio].sort((a, b) => {
    const order: Record<string, number> = { rose: 0, amber: 1, green: 2 };
    return (order[a.health] ?? 9) - (order[b.health] ?? 9);
  });

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className={`v2-projswitch ${open ? "is-open" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Switch engagement"
      >
        <span className="v2-projswitch-context">Project</span>
        <span className="v2-projswitch-name">{currentProject.name}</span>
        <span className="v2-projswitch-meta internals-inline">
          {currentProject.product} · {currentProject.tier}
        </span>
        <Icon name="chevron-down" size={14} style={{ color: "var(--text-muted)" }}/>
      </button>
      {open && (
        <div className="v2-projmenu" role="listbox">
          <div className="v2-projmenu-head">
            <span className="t-eyebrow">Your engagements</span>
            <span className="t-meta">{portfolio.length} active</span>
          </div>
          <div className="v2-projmenu-list">
            {sorted.map(p => (
              <button
                key={p.id}
                className={`v2-projmenu-item ${p.id === currentProject.id ? "active" : ""}`}
                onClick={() => { setCurrentProjectId(p.id); setOpen(false); navigate("project"); }}
                role="option"
                aria-selected={p.id === currentProject.id}
              >
                <span className={`v2-projmenu-dot ${p.health}`}/>
                <div className="stack" style={{ minWidth: 0 }}>
                  <div className="v2-projmenu-name">{p.name}</div>
                  <div className="v2-projmenu-sub">{p.product} · {p.tier} · {p.phase}</div>
                </div>
                <div className="v2-projmenu-meta">
                  <div>{p.readiness}%</div>
                  <div style={{ marginTop: 2 }}>{p.nextGL}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="v2-projmenu-foot">
            <button className="v2-projmenu-allbtn" onClick={() => { setOpen(false); navigate(""); }}>
              <Icon name="grid" size={14}/>
              <span>See all engagements (Portfolio)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────
function TopBar() {
  const [, navigate] = useHash();
  const { theme, setTheme, defaultLanding } = useApp();
  const searchRef = useRef<HTMLInputElement>(null);

  const drcs = DRCS.filter(d => d.status !== "resolved");
  const stuck = drcs.filter(d => (d.daysStale || 0) >= 5).length;

  // ⌘K / Ctrl-K focuses the toolkit search input.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="v2-topbar">
      <div className="v2-topbar-inner">
        <a className="v2-brand" href="#" onClick={(e) => { e.preventDefault(); navigate(defaultLanding === "project" ? "project" : ""); }}>
          <EllucianWordmark/>
        </a>
        <div className="v2-topbar-right">
          <ProjectSwitcher/>
          <div className="flex-1"/>
          <div className="v2-search">
            <Icon name="search" size={15}/>
            <input ref={searchRef} placeholder="Search the toolkit…" aria-label="Search the toolkit" type="search"/>
            <span className="v2-kbd">⌘K</span>
          </div>
          {drcs.length > 0 && (
            <button
              className="v2-attn"
              title={`${drcs.length} open client decisions${stuck ? ` · ${stuck} stuck 5+ days` : ""}`}
              onClick={() => navigate("decisions")}
            >
              <Icon name="decisions" size={14}/>
              <span className="v2-attn-label">Decisions</span>
              <span className={`v2-attn-count ${stuck ? "stuck" : ""}`}>{drcs.length}</span>
              {stuck > 0 && <span className="v2-attn-dot" aria-label={`${stuck} stuck`}/>}
            </button>
          )}
          <button
            className="v2-icon-btn"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={15}/>
          </button>
          <div className="v2-avatar" title="Janet Hawkins · Lead Consultant">JH</div>
        </div>
      </div>
    </header>
  );
}

// ── Side rail ────────────────────────────────────────────────────────────
type RailEntry = {
  id: string;
  label: string;
  icon: IconName;
  count?: number;
  attention?: number;
  short?: string;
  full?: string;
};

const RAIL_TOP: RailEntry[] = [
  { id: "",        label: "Portfolio", icon: "grid" },
  { id: "project", label: "Project",   icon: "home" },
  { id: "mywork",  label: "My work",   icon: "inbox", count: 5 },
];

const RAIL_BOTTOM: RailEntry[] = [
  { id: "library", label: "Methodology",       icon: "library", short: "Pathfinder", full: "Ellucian's delivery methodology" },
  { id: "ai",      label: "Ask the assistant", icon: "ai" },
];

function Rail() {
  const [route, navigate] = useHash();
  const active = (id: string) => {
    if (id === "") return route === "" || route === "home";
    return route === id || route.startsWith(id + "/") || route.startsWith(id + "?");
  };

  const Item = ({ entry }: { entry: RailEntry }) => (
    <button
      className={`v2-rail-item ${active(entry.id) ? "active" : ""}`}
      onClick={() => navigate(entry.id)}
      title={entry.full ? `${entry.label} · ${entry.full}` : entry.label}
    >
      <span className="v2-rail-icon"><Icon name={entry.icon} size={16}/></span>
      <span className="v2-rail-label">{entry.label}</span>
      {entry.short ? <span className="v2-rail-acro" aria-hidden>{entry.short}</span> : <span/>}
      {entry.count != null ? (
        <span className={`v2-rail-count ${entry.attention ? "attn" : ""}`}>
          {entry.count}{entry.attention ? <span className="v2-rail-attn-dot" aria-label={`${entry.attention} need attention`}/> : null}
        </span>
      ) : <span/>}
    </button>
  );

  return (
    <nav className="v2-rail" aria-label="Primary">
      <div className="v2-rail-section">
        {RAIL_TOP.map(e => <Item key={e.id || "home"} entry={e}/>)}
      </div>
      <div className="v2-rail-spacer"/>
      <div className="v2-rail-section">
        {RAIL_BOTTOM.map(e => <Item key={e.id} entry={e}/>)}
        <Item entry={{ id: "autopilot", label: "Autopilot", icon: "play" }}/>
        <Item entry={{ id: "settings",  label: "Settings",  icon: "settings" }}/>
      </div>
    </nav>
  );
}

// ── Page shell ────────────────────────────────────────────────────────────
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="v2-shell">
      <TopBar/>
      <div className="v2-body">
        <Rail/>
        <main className="v2-main">{children}</main>
      </div>
      <ToastHost/>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────
export function PageHero({ eyebrow, headline, sub, actions }: {
  eyebrow?: React.ReactNode; headline: React.ReactNode; sub?: React.ReactNode; actions?: React.ReactNode;
}) {
  return (
    <header className="v2-hero">
      <div className="v2-hero-text">
        {eyebrow && <div className="t-eyebrow v2-hero-eyebrow">{eyebrow}</div>}
        <h1 className="t-h1">{headline}</h1>
        {sub && <p className="v2-hero-sub">{sub}</p>}
      </div>
      {actions && <div className="v2-hero-actions">{actions}</div>}
    </header>
  );
}

// ── Brief body ────────────────────────────────────────────────────────────
export function BriefBody({ fragments }: { fragments: BriefFragment[] }) {
  return (
    <span>
      {fragments.map((f, i) => f.em
        ? <span key={i} className={`em-${f.em}`}>{f.text}</span>
        : <span key={i}>{f.text}</span>
      )}
    </span>
  );
}

// ── Section ───────────────────────────────────────────────────────────────
export function Section({ eyebrow, title, sub, action, className, children }: {
  eyebrow?: React.ReactNode; title?: React.ReactNode; sub?: React.ReactNode;
  action?: React.ReactNode; className?: string; children?: React.ReactNode;
}) {
  return (
    <section className={`v2-section${className ? ` ${className}` : ""}`}>
      {(eyebrow || title || action) && (
        <div className="v2-section-head">
          <div className="stack gap-1">
            {eyebrow && <div className="t-eyebrow">{eyebrow}</div>}
            {title && <h2 className="t-h2">{title}</h2>}
            {sub && <p className="t-body-sm t-muted">{sub}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// ── Three things ──────────────────────────────────────────────────────────
export type ThreeThingItem = {
  tone?: "warn" | "bad" | "good" | "accent" | "neutral";
  icon?: IconName;
  eyebrow: string;
  title: string;
  sub?: string;
  onClick?: () => void;
};

export function ThreeThings({ items }: { items: ThreeThingItem[] }) {
  return (
    <div className="v2-three">
      {items.map((it, i) => (
        <button key={i} className={`v2-three-item v2-three-${it.tone || "neutral"}`} onClick={it.onClick}>
          <div className="v2-three-icon">
            <Icon name={it.icon || "arrow-right"} size={18}/>
          </div>
          <div className="v2-three-text">
            <div className="v2-three-eyebrow">{it.eyebrow}</div>
            <div className="v2-three-title">{it.title}</div>
            {it.sub && <div className="v2-three-sub">{it.sub}</div>}
          </div>
          <Icon name="chevron-right" size={14} style={{ color: "var(--text-ghost)" }}/>
        </button>
      ))}
    </div>
  );
}

// ── Coming soon ───────────────────────────────────────────────────────────
export function Coming({ name }: { name: string }) {
  return (
    <div className="v2-coming">
      <div className="v2-coming-icon"><Icon name="sparkle" size={26}/></div>
      <h2 className="t-h1">{name}</h2>
      <p className="t-body" style={{ maxWidth: 480, textAlign: "center" }}>
        This page is on the rebuild list. Phase 1 ships the new shell, the Portfolio view, and the Project view — once those feel right, the rest follow the same vocabulary and rhythm.
      </p>
      <a className="btn btn-secondary" href="#/">Back to home</a>
    </div>
  );
}
