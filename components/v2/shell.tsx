"use client";

// Toolkit v2 — Shell, top bar, project switcher, rail, hooks, page primitives.
// All visual values come from tokens.css. Hash-based routing.

import * as React from "react";
import { useState, useEffect, useRef, useCallback, useContext, createContext } from "react";
import { Icon, IconName } from "./icons";
import { PORTFOLIO, DRCS } from "@/lib/data";
import { SCHOOL_BRANDS, SCHOOL_BRAND_FONT_STACK } from "@/lib/school-brands";
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

  // SSR and first client render must agree, so initial state is the deterministic
  // default. localStorage is read post-mount in the effect below.
  const [currentProjectId, setCurrentProjectIdState] = useState<string>(portfolio[0].id);
  const [defaultLanding, setDefaultLandingState] = useState<DefaultLanding>("practice");
  const [theme, setThemeState] = useState<Theme>("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedProject = localStorage.getItem("v2.currentProject");
    if (storedProject && portfolio.some(p => p.id === storedProject)) {
      setCurrentProjectIdState(storedProject);
    }
    const storedLanding = localStorage.getItem("v2.defaultLanding") as DefaultLanding | null;
    if (storedLanding === "practice" || storedLanding === "project") {
      setDefaultLandingState(storedLanding);
    }
    const storedTheme = localStorage.getItem("v2.theme") as Theme | null;
    if (storedTheme === "light" || storedTheme === "dark") {
      setThemeState(storedTheme);
    }
    setHydrated(true);
  }, [portfolio]);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-light", theme === "light");
    if (hydrated) localStorage.setItem("v2.theme", theme);
  }, [theme, hydrated]);

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

// ── SchoolLogo ────────────────────────────────────────────────────────────────
// Visual anchor for an engagement. Resolution order:
//   1. project.logoUrl — curated override, always wins.
//   2. Clearbit Logo API (via project.domain) — 2.5s timeout before fallback.
//   3. Monogram — initials in school-specific brand font + color.
//
// Outer box is always the same size so there is no layout shift between layers.

type SchoolLogoProps = {
  project: Project;
  size: number;
  rounded?: "sm" | "md" | "lg";
};

export function SchoolLogo({ project, size, rounded = "md" }: SchoolLogoProps) {
  // null = pending Clearbit load, true = loaded, false = failed/timed out
  const [clearbitState, setClearbitState] = useState<boolean | null>(
    project.logoUrl ? null : false
  );

  useEffect(() => {
    if (!project.logoUrl) return;
    // Reset state when project changes
    setClearbitState(null);

    const img = new Image();
    const timer = window.setTimeout(() => {
      setClearbitState(prev => (prev === null ? false : prev));
    }, 2500);

    img.onload = () => {
      window.clearTimeout(timer);
      setClearbitState(true);
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      setClearbitState(false);
    };
    img.src = project.logoUrl;

    return () => {
      window.clearTimeout(timer);
    };
  }, [project.logoUrl]);

  const borderRadius =
    rounded === "lg" ? Math.round(size * 0.22) + "px" :
    rounded === "sm" ? "4px" : "6px";

  const brand = SCHOOL_BRANDS[project.id] ?? null;
  const fontStack = brand
    ? (SCHOOL_BRAND_FONT_STACK[brand.font] ?? "var(--font-sans)")
    : "var(--font-sans)";
  const isItalic = brand?.font === "serif-italic";
  const isSerif  = brand?.font === "serif" || brand?.font === "serif-italic" || brand?.font === "slab";
  const monoBg   = brand?.bg ?? project.logoColor ?? "var(--accent)";
  const monoFg   = brand?.fg ?? "#ffffff";
  const monoWeight   = brand?.weight   ?? 800;
  const monoTracking = brand?.tracking ?? "-0.04em";

  // Derive initials: prefer project.initials, else auto from short/name.
  const init = (
    project.initials ||
    (project.short || project.name || "?")
      .split(/\s+/)
      .map((w: string) => w[0])
      .join("")
      .slice(0, 3)
  ).toUpperCase();

  // Font size scales with char count and serif/sans distinction.
  const sizeMul =
    init.length >= 3 ? (isSerif ? 0.40 : 0.38) :
    init.length === 2 ? (isSerif ? 0.54 : 0.52) :
    0.62;
  const fontSize = Math.max(10, Math.round(size * sizeMul));

  const showClearbit = project.logoUrl && clearbitState === true;
  const showMonogram = !showClearbit;

  const boxStyle: React.CSSProperties = {
    position: "relative",
    width: size,
    height: size,
    borderRadius,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 auto",
    overflow: "hidden",
    background: showMonogram ? monoBg : "var(--bg-elevated)",
    border: showMonogram ? "none" : "1px solid var(--border-subtle)",
    color: monoFg,
    fontWeight: monoWeight,
    fontStyle: isItalic ? "italic" : "normal",
    fontSize,
    letterSpacing: monoTracking,
    fontFamily: fontStack,
    lineHeight: 1,
  };

  return (
    <span className="v2-schoollogo" style={boxStyle} aria-label={project.name} title={project.name}>
      {showClearbit ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.logoUrl}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", padding: Math.round(size * 0.08) }}
          loading="lazy"
        />
      ) : (
        <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", lineHeight: 1 }}>
          {init}
        </span>
      )}
    </span>
  );
}

// ── Project switcher ──────────────────────────────────────────────────────
// Lives in ProjectContextBar (project-scoped routes only). The dropdown menu
// surfaces every engagement Janet has access to with school-logo + health dot
// + readiness + nextGL. Footer notes the Clearbit auto-detect mechanic and
// links to Settings for per-project overrides.
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
        <SchoolLogo project={currentProject} size={22} rounded="sm"/>
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
                <SchoolLogo project={p} size={32} rounded="sm"/>
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
            <div className="v2-projmenu-detect" title="Logos resolved via Clearbit Logo API. Override per project in Settings.">
              <Icon name="check" size={11}/>
              <span>Logos auto-detected · </span>
              <button
                className="btn-link"
                onClick={(e) => { e.stopPropagation(); setOpen(false); navigate("settings"); }}
              >Override</button>
            </div>
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

// ── Project identity chip (passive) ───────────────────────────────────────
// Per product-owner critique: when the ProjectContextBar is hidden (Portfolio,
// MyWork, Methodology, AskPage, Autopilot, Settings), Janet still needs to
// know which engagement is "current" without leaving the page. This is a
// non-interactive identity hint — clicking it navigates to the Project home,
// but it does NOT open the switcher menu (the full switcher lives in the
// context bar on project-scoped routes only).
function ProjectIdentityChip() {
  const { currentProject } = useApp();
  const [, navigate] = useHash();
  if (!currentProject) return null;
  return (
    <button
      className="v2-projidchip"
      onClick={() => navigate("project")}
      title={`Current engagement: ${currentProject.name} · jump to Project home`}
      aria-label={`Current engagement: ${currentProject.name}`}
    >
      <SchoolLogo project={currentProject} size={22} rounded="sm"/>
      <span className="v2-projidchip-name">{currentProject.short || currentProject.name}</span>
    </button>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────
// Narrow brand-focused strip per design tarball K3NKe3IuvfS03Mr6yWnkDw.
// 44px tall, violet gradient, white-tinted controls. The full ProjectSwitcher
// lives in the ProjectContextBar (project-scoped routes only); a passive
// ProjectIdentityChip surfaces the current engagement on non-project routes
// so MyWork etc. stay oriented (per product-owner critique).
function TopBar() {
  const [route, navigate] = useHash();
  const { theme, setTheme, defaultLanding } = useApp();
  const searchRef = useRef<HTMLInputElement>(null);

  const drcs = DRCS.filter(d => d.status !== "resolved");
  const stuck = drcs.filter(d => (d.daysStale || 0) >= 5).length;

  // Show passive identity chip everywhere the ProjectContextBar is hidden.
  const top = route.split("?")[0].split("#")[0].split("/")[0];
  const showIdentityChip = !PROJECT_SCOPED_ROUTES.has(top);

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
        {showIdentityChip && <ProjectIdentityChip/>}
        <div className="v2-topbar-right">
          <div className="v2-search">
            <Icon name="search" size={14}/>
            <input ref={searchRef} placeholder="Search the toolkit…" aria-label="Search the toolkit" type="search"/>
            <span className="v2-kbd">⌘K</span>
          </div>
          {drcs.length > 0 && (
            <button
              className="v2-attn"
              title={`${drcs.length} open client decisions${stuck ? ` · ${stuck} stuck 5+ days` : ""}`}
              onClick={() => navigate("decisions")}
            >
              <Icon name="decisions" size={13}/>
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
            <Icon name={theme === "dark" ? "sun" : "moon"} size={14}/>
          </button>
          <div className="v2-avatar" title="Janet Hawkins · Lead Consultant">JH</div>
        </div>
      </div>
    </header>
  );
}

// ── Project context bar ───────────────────────────────────────────────────
// Appears between the topbar and the body, but only on project-scoped routes
// (the project view itself + the destinations that live inside an engagement:
// capabilities, guides, decisions, workshops, schedule). Practice-wide routes
// (Portfolio "", MyWork, Methodology "library", AskPage "ai", Autopilot,
// Settings) skip this strip — the project selector isn't relevant there.
const PROJECT_SCOPED_ROUTES = new Set<string>([
  "project", "capabilities", "guides", "decisions", "workshops", "schedule",
]);

export function isProjectScopedRoute(route: string): boolean {
  const top = route.split("?")[0].split("#")[0].split("/")[0];
  return PROJECT_SCOPED_ROUTES.has(top);
}

function ProjectContextBar() {
  const [route, navigate] = useHash();
  const { currentProject } = useApp();
  if (!isProjectScopedRoute(route) || !currentProject) return null;
  const health = currentProject.health || "green";
  const phase = currentProject.phase || "Build";
  const sprint = currentProject.sprint != null ? String(currentProject.sprint) : "1";
  const nextGL = currentProject.nextGL || "";
  return (
    <div className="v2-projctx" role="navigation" aria-label="Project context">
      <button className="v2-projctx-back" onClick={() => navigate("")} title="Back to portfolio">
        <Icon name="chevron-left" size={13}/>
        <span>Portfolio</span>
      </button>
      <span className="v2-projctx-sep" aria-hidden/>
      <ProjectSwitcher/>
      <div className="v2-projctx-meta">
        <span className="v2-projctx-pill">
          <span className={`dot ${health}`}/>
          <span>{phase} · Sprint {sprint}</span>
        </span>
        {nextGL && (
          <span className="v2-projctx-pill">
            <span>{nextGL}</span>
          </span>
        )}
      </div>
    </div>
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
  const [route] = useHash();
  const projctx = isProjectScopedRoute(route);
  return (
    <div className={`v2-shell${projctx ? " has-projctx" : ""}`}>
      <TopBar/>
      <ProjectContextBar/>
      <div className="v2-body">
        <Rail/>
        <main className="v2-main">{children}</main>
      </div>
      <ToastHost/>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────
export function PageHero({ eyebrow, headline, sub, actions, logo }: {
  eyebrow?: React.ReactNode; headline: React.ReactNode; sub?: React.ReactNode;
  actions?: React.ReactNode; logo?: React.ReactNode;
}) {
  return (
    <header className="v2-hero">
      {logo && <div className="v2-hero-logo">{logo}</div>}
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
