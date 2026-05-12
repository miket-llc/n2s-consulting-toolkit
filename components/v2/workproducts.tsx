"use client";

// Toolkit v2 — Work Products surface (B0-8).
// Toolkit-originals not in K3NKe3Iu tarball; catalogued by design-fidelity-guardian.
// Routes:
//   #workproducts        → portfolio kanban (practice-wide, like mywork)
//   #workproducts/<id>   → WP detail (vertical sections)

import * as React from "react";
import { useState, useEffect } from "react";
import { Icon } from "./icons";
import { useHash, PageHero, Section, notImplemented, SchoolLogo } from "./shell";
import {
  WORK_PRODUCTS, WORK_PRODUCT_STATES, WORK_PRODUCT_STATE_LABELS,
  METHODOLOGY_PHASES, PORTFOLIO, ENGAGEMENT, BUSINESS_CAPABILITIES,
  OC_INDEX, DRCS,
} from "@/lib/data";
import type { WorkProduct, WorkProductState, WorkProductPhase } from "@/lib/data";

// ── Tone maps ──────────────────────────────────────────────────────────────

const PHASE_TONE: Record<WorkProductPhase, string> = {
  discover:   "cyan",
  design:     "violet",
  build:      "accent",
  validate:   "amber",
  deploy:     "emerald",
  stabilize:  "emerald",
};

const STATE_TONE: Record<WorkProductState, string> = {
  "not-started":  "neutral",
  "in-progress":  "accent",
  "needs-review": "amber",
  "signed":       "emerald",
  "blocked":      "rose",
};

const PHASE_ORDER: WorkProductPhase[] = [
  "discover", "design", "build", "validate", "deploy", "stabilize",
];

// ── Primitives ─────────────────────────────────────────────────────────────

function PhaseChip({ phase }: { phase: WorkProductPhase }) {
  const label = METHODOLOGY_PHASES.find(m => m.id === phase)?.label || phase;
  return <span className={`pill pill-${PHASE_TONE[phase]}`}>{label}</span>;
}

function StateBadge({ state }: { state: WorkProductState }) {
  return (
    <span className={`pill pill-${STATE_TONE[state]}`}>
      {WORK_PRODUCT_STATE_LABELS[state]}
    </span>
  );
}

function OwnerAvatar({ ownerId, size = 20 }: { ownerId?: string; size?: number }) {
  const member = ENGAGEMENT.members.find(m => m.id === ownerId);
  if (!member) return null;
  return (
    <span
      title={`${member.name} · ${member.role}`}
      style={{
        display: "inline-grid", placeItems: "center",
        width: size, height: size, borderRadius: "50%",
        background: member.color + "22",
        color: member.color,
        fontSize: 9, fontWeight: 700,
        flexShrink: 0,
        border: `1px solid ${member.color}44`,
      }}
    >
      {member.initials}
    </span>
  );
}

function EngagementChip({ engagementId }: { engagementId: string }) {
  const proj = PORTFOLIO.find(p => p.id === engagementId);
  if (!proj) return <span className="t-mono">{engagementId}</span>;
  return (
    <span className="v2-wp-engchip">
      <SchoolLogo project={proj} size={14} rounded="sm"/>
      <span>{proj.short}</span>
    </span>
  );
}

// ── OC / DRC resolve helpers ───────────────────────────────────────────────

type OcMin  = { id: string; code: string; title: string };
type DrcMin = { code: string; title: string };

const resolveOc  = (ocId: string):    OcMin | undefined  => (OC_INDEX  as OcMin[]).find(o => o.id   === ocId);
const resolveDrc = (drcCode: string): DrcMin | undefined => (DRCS      as DrcMin[]).find(d => d.code === drcCode);

// ── Filter state ───────────────────────────────────────────────────────────

type WPFilters = { phases: WorkProductPhase[]; engagements: string[]; owners: string[] };
const EMPTY_FILTERS: WPFilters = { phases: [], engagements: [], owners: [] };

function useWPFilters(): [WPFilters, (f: WPFilters) => void] {
  const [filters, setFiltersState] = useState<WPFilters>(EMPTY_FILTERS);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("v2.workproducts.filters");
      if (stored) setFiltersState(JSON.parse(stored) as WPFilters);
    } catch { /* noop */ }
  }, []);
  const setFilters = (f: WPFilters) => {
    setFiltersState(f);
    try { localStorage.setItem("v2.workproducts.filters", JSON.stringify(f)); } catch { /* noop */ }
  };
  return [filters, setFilters];
}

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
}

// ═══════════════════════════════════════════════════════════════════════════
// PORTFOLIO KANBAN  ·  #workproducts
// ═══════════════════════════════════════════════════════════════════════════

export function WorkProductsKanbanPage() {
  const [, navigate] = useHash();
  const [filters, setFilters] = useWPFilters();

  // Distinct engagement slugs present in WORK_PRODUCTS
  const engagementIds = [...new Set(WORK_PRODUCTS.map(w => w.engagement_id))];
  // Distinct owner ids present in WORK_PRODUCTS (same consultant team across engagements)
  const ownerIds = [...new Set(
    WORK_PRODUCTS.map(w => w.owner).filter((o): o is string => Boolean(o))
  )];

  // Apply filters (empty set = all)
  const visible = WORK_PRODUCTS.filter(wp => {
    if (filters.phases.length > 0 && !filters.phases.includes(wp.phase)) return false;
    if (filters.engagements.length > 0 && !filters.engagements.includes(wp.engagement_id)) return false;
    if (filters.owners.length > 0 && !filters.owners.includes(wp.owner || "")) return false;
    return true;
  });

  const engLabel =
    filters.engagements.length === 1
      ? PORTFOLIO.find(p => p.id === filters.engagements[0])?.short || filters.engagements[0]
      : "Across your engagements";

  const togglePhase = (p: WorkProductPhase) =>
    setFilters({ ...filters, phases: toggleItem(filters.phases, p) });
  const toggleEng = (e: string) =>
    setFilters({ ...filters, engagements: toggleItem(filters.engagements, e) });
  const toggleOwner = (o: string) =>
    setFilters({ ...filters, owners: toggleItem(filters.owners, o) });

  return (
    <>
      <PageHero
        eyebrow="Work Products · Practice-wide"
        headline="Work Products"
        sub={engLabel}
        actions={
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("")}>
            <Icon name="chevron-right" size={13} style={{ transform: "rotate(180deg)" }}/>
            <span>Portfolio</span>
          </button>
        }
      />

      {/* Filter bar */}
      <div className="v2-wp-filterbar" role="search" aria-label="Filter work products">
        <div className="v2-wp-filtergroup">
          <span className="v2-wp-filterlabel">Phase</span>
          {PHASE_ORDER.map(p => {
            const label = METHODOLOGY_PHASES.find(m => m.id === p)?.label || p;
            return (
              <button
                key={p}
                className={`v2-wp-chip ${filters.phases.includes(p) ? "is-active" : ""}`}
                onClick={() => togglePhase(p)}
                aria-pressed={filters.phases.includes(p)}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="v2-wp-filtergroup">
          <span className="v2-wp-filterlabel">Engagement</span>
          {engagementIds.map(eid => {
            const proj = PORTFOLIO.find(p => p.id === eid);
            return (
              <button
                key={eid}
                className={`v2-wp-chip ${filters.engagements.includes(eid) ? "is-active" : ""}`}
                onClick={() => toggleEng(eid)}
                aria-pressed={filters.engagements.includes(eid)}
              >
                {proj?.short || eid}
              </button>
            );
          })}
        </div>

        <div className="v2-wp-filtergroup">
          <span className="v2-wp-filterlabel">Owner</span>
          {ownerIds.map(oid => {
            const member = ENGAGEMENT.members.find(m => m.id === oid);
            return (
              <button
                key={oid}
                className={`v2-wp-chip ${filters.owners.includes(oid) ? "is-active" : ""}`}
                onClick={() => toggleOwner(oid)}
                aria-pressed={filters.owners.includes(oid)}
              >
                {member ? `${member.initials} · ${member.name.split(" ")[0]}` : oid.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Kanban */}
      <div className="v2-wp-board" role="list" aria-label="Work products by state">
        {WORK_PRODUCT_STATES.map(state => {
          const items = visible.filter(w => w.state === state);
          const colLabelClass =
            state === "blocked"      ? "v2-wp-collabel t-rose" :
            state === "needs-review" ? "v2-wp-collabel t-amber" :
            "v2-wp-collabel";
          return (
            <div key={state} className="v2-wp-col" role="listitem">
              <div className="v2-wp-colhead">
                <span className={colLabelClass}>{WORK_PRODUCT_STATE_LABELS[state]}</span>
                <span className="v2-wp-colcount">{items.length}</span>
              </div>

              {items.length === 0 ? (
                <div className="v2-wp-empty" aria-label="No items in this lane">—</div>
              ) : (
                <div className="v2-board-cards">
                  {items.map(wp => {
                    const markerTone =
                      wp.state === "blocked"      ? "rose" :
                      wp.state === "needs-review" ? "amber" : "accent";
                    return (
                      <button
                        key={wp.id}
                        className="v2-wp-card"
                        onClick={() => navigate(`workproducts/${wp.id}`)}
                        aria-label={`${wp.title} · ${WORK_PRODUCT_STATE_LABELS[wp.state]}`}
                      >
                        <div className="v2-wp-cardmeta">
                          <span className={`v2-board-cardmarker ${markerTone}`}/>
                          <PhaseChip phase={wp.phase}/>
                        </div>
                        <div className="v2-wp-cardtitle">{wp.title}</div>
                        <div className="v2-wp-cardmeta">
                          <OwnerAvatar ownerId={wp.owner} size={18}/>
                          <EngagementChip engagementId={wp.engagement_id}/>
                          {wp.due && (
                            <span className="t-mono" style={{ marginLeft: "auto", fontSize: 10 }}>
                              {wp.due}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STATE CHANGE CONTROL — footer block with deferred-write affordance
// ═══════════════════════════════════════════════════════════════════════════

function StateControl({ wp }: { wp: WorkProduct }) {
  const others = WORK_PRODUCT_STATES.filter(s => s !== wp.state);
  return (
    <div className="v2-wp-state-ctrl">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="v2-wp-state-ctrl-label">Current state</span>
        <StateBadge state={wp.state}/>
      </div>
      <div className="v2-wp-state-ctrl-actions">
        {others.map(s => (
          <button
            key={s}
            className="btn btn-secondary btn-sm"
            onClick={() => notImplemented(
              `Mark as "${WORK_PRODUCT_STATE_LABELS[s]}" — state writes land in Stance B · Sprint B1`
            )}
          >
            {WORK_PRODUCT_STATE_LABELS[s]}
          </button>
        ))}
      </div>
      <span className="t-meta">State transitions persist after Stance B (Sprint B1).</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WP DETAIL  ·  #workproducts/<id>
// ═══════════════════════════════════════════════════════════════════════════

export function WorkProductDetailPage({ wpId }: { wpId: string }) {
  const [, navigate] = useHash();
  const wp = WORK_PRODUCTS.find(w => w.id === wpId);

  // Redirect on bad id — hook must run unconditionally.
  useEffect(() => {
    if (!wp) {
      notImplemented(`Unknown work product "${wpId}" — back to Work Products`);
      window.location.hash = "workproducts";
    }
  }, [wpId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!wp) return null;

  const cap  = wp.capability_id ? BUSINESS_CAPABILITIES.find(c => c.id === wp.capability_id) : null;
  const proj = PORTFOLIO.find(p => p.id === wp.engagement_id);
  const ownerMember = wp.owner ? ENGAGEMENT.members.find(m => m.id === wp.owner) : null;

  const hasUpstream   = (wp.prerequisites?.length  ?? 0) > 0;
  const hasDownstream = (wp.feeds_into?.length      ?? 0) > 0;
  const hasOcs        = (wp.linked_oc_ids?.length   ?? 0) > 0;
  const hasDrcs       = (wp.linked_drc_ids?.length  ?? 0) > 0;
  const hasProducts   = (wp.applies_to?.products?.length ?? 0) > 0;

  return (
    <>
      <PageHero
        eyebrow={[
          METHODOLOGY_PHASES.find(m => m.id === wp.phase)?.label || wp.phase,
          proj?.short || wp.engagement_id,
        ].join(" · ")}
        headline={wp.title}
        sub={`Stage: ${wp.stage} · Order ${wp.order}`}
        actions={
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("workproducts")}>
            <Icon name="chevron-right" size={13} style={{ transform: "rotate(180deg)" }}/>
            <span>Work Products</span>
          </button>
        }
      />

      <div className="v2-wp-detail">

        {/* §1 — Header chips + owner + engagement */}
        <div className="v2-wp-header">
          <div className="v2-wp-header-chips">
            <PhaseChip phase={wp.phase}/>
            <StateBadge state={wp.state}/>
            {wp.due && (
              <span className="pill pill-neutral">
                <Icon name="clock" size={11}/>
                Due {wp.due}
              </span>
            )}
          </div>
          <div className="v2-wp-header-sub">
            <OwnerAvatar ownerId={wp.owner} size={22}/>
            {ownerMember && <span>{ownerMember.name} · {ownerMember.role}</span>}
            {proj && (
              <>
                <span className="t-muted" aria-hidden>·</span>
                <EngagementChip engagementId={wp.engagement_id}/>
              </>
            )}
          </div>
        </div>

        {/* §2 — Purpose & scope */}
        {wp.purpose_and_scope && (
          <Section eyebrow="Purpose & scope">
            <p className="v2-wp-prose">{wp.purpose_and_scope}</p>
          </Section>
        )}

        {/* §3 — Definition of done */}
        {wp.definition_of_done && (
          <Section eyebrow="Definition of done">
            <p className="v2-wp-prose">{wp.definition_of_done}</p>
          </Section>
        )}

        {/* §4 — RACI grid */}
        {wp.raci && Object.keys(wp.raci).length > 0 && (
          <Section eyebrow="RACI">
            <div className="surface-flat" style={{ overflow: "hidden", borderRadius: "var(--radius-md)" }}>
              <table className="v2-wp-raci" aria-label="RACI responsibility matrix">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(wp.raci).map(([role, letter]) => (
                    <tr key={role}>
                      <td>{role}</td>
                      <td className="v2-wp-raci-letter">{letter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* §5 — Prerequisites / Feeds into */}
        {(hasUpstream || hasDownstream) && (
          <Section eyebrow="Dependencies">
            <div className="v2-wp-updown">
              {hasUpstream && (
                <div>
                  <div className="t-eyebrow" style={{ marginBottom: 8 }}>Prerequisites</div>
                  <div className="v2-wp-linklist">
                    {(wp.prerequisites || []).map(preId => {
                      const pre = WORK_PRODUCTS.find(w => w.id === preId);
                      return pre ? (
                        <button
                          key={preId}
                          className="v2-wp-link"
                          onClick={() => navigate(`workproducts/${preId}`)}
                        >
                          <Icon name="arrow-up-right" size={12}/>
                          <span>{pre.title}</span>
                        </button>
                      ) : (
                        <span key={preId} className="t-mono">{preId}</span>
                      );
                    })}
                  </div>
                </div>
              )}
              {hasDownstream && (
                <div>
                  <div className="t-eyebrow" style={{ marginBottom: 8 }}>Feeds into</div>
                  <div className="v2-wp-linklist">
                    {(wp.feeds_into || []).map(downId => {
                      const down = WORK_PRODUCTS.find(w => w.id === downId);
                      return down ? (
                        <button
                          key={downId}
                          className="v2-wp-link"
                          onClick={() => navigate(`workproducts/${downId}`)}
                        >
                          <Icon name="arrow-right" size={12}/>
                          <span>{down.title}</span>
                        </button>
                      ) : (
                        <span key={downId} className="t-mono">{downId}</span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* §6 — Linked OCs */}
        {hasOcs && (
          <Section eyebrow="Linked configuration guides">
            <div className="v2-wp-linklist">
              {(wp.linked_oc_ids || []).map(ocId => {
                const oc = resolveOc(ocId);
                return oc ? (
                  <button
                    key={ocId}
                    className="v2-wp-link"
                    onClick={() => navigate(`guides/${ocId}`)}
                  >
                    <Icon name="guides" size={12}/>
                    <span className="t-mono">{oc.code}</span>
                    <span aria-hidden>·</span>
                    <span>{oc.title.split(" · ").slice(1).join(" · ") || oc.title}</span>
                  </button>
                ) : (
                  <span key={ocId} className="v2-wp-link" style={{ cursor: "default" }}>
                    <Icon name="guides" size={12}/>
                    <span className="t-mono">{ocId}</span>
                  </span>
                );
              })}
            </div>
          </Section>
        )}

        {/* §7 — Linked DRCs */}
        {hasDrcs && (
          <Section eyebrow="Linked decisions">
            <div className="v2-wp-linklist">
              {(wp.linked_drc_ids || []).map(drcCode => {
                const drc = resolveDrc(drcCode);
                return (
                  <button
                    key={drcCode}
                    className="v2-wp-link"
                    onClick={() => navigate("decisions")}
                    title="Opens Decisions inbox — per-DRC deep links arrive in Stance B"
                  >
                    <Icon name="decisions" size={12}/>
                    <span className="t-mono">{drcCode}</span>
                    {drc && <><span aria-hidden>·</span><span>{drc.title}</span></>}
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* §8 — Capability scope */}
        <Section eyebrow="Capability scope">
          {cap ? (
            <button
              className="v2-wp-link"
              onClick={() => navigate(`capabilities/${cap.id}`)}
            >
              <Icon name="capabilities" size={12}/>
              <span>Scoped to {cap.label}</span>
            </button>
          ) : (
            <p className="v2-wp-prose">Engagement-wide</p>
          )}
        </Section>

        {/* §9 — Applies to */}
        {hasProducts && (
          <Section eyebrow="Applies to">
            <div className="row gap-2 flex-wrap">
              {wp.applies_to!.products.map(p => (
                <span key={p} className="pill pill-neutral">{p}</span>
              ))}
            </div>
          </Section>
        )}

        {/* §10 — State change control */}
        <StateControl wp={wp}/>

      </div>
    </>
  );
}
