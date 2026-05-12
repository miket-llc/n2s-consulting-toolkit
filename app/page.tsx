"use client";

// Toolkit v2 — app entry. Practice home is default; Project home at #project.

import * as React from "react";
import { useEffect } from "react";
import { AppProvider, PageShell, useHash, Coming } from "@/components/v2/shell";
import { PracticeHome } from "@/components/v2/practice";
import { HomePage as ProjectHome } from "@/components/v2/home";
import {
  MyWorkPage, DecisionsPage, WorkshopsPage, SchedulePage, CapabilitiesPage,
  MethodologyPage, AskPage, AutopilotPage, SettingsPage, GuidesPage,
} from "@/components/v2/pages";
import { CapabilityDetailPage, ConfigurationGuidePage } from "@/components/v2/detail";
import { WorkProductsKanbanPage, WorkProductDetailPage } from "@/components/v2/workproducts";

const LABELS: Record<string, string> = {
  mywork: "My work",
  decisions: "Client decisions",
  guides: "Configuration guides",
  capabilities: "Capabilities",
  schedule: "Schedule & roadmap",
  workshops: "Workshops",
  library: "Methodology",
  ai: "Ask the assistant",
  autopilot: "Autopilot",
  settings: "Settings",
};

function Router() {
  const [route] = useHash();
  const parts = route.split("?")[0].split("#")[0].split("/");
  const top = parts[0];
  const sub = parts[1];

  if (!top || top === "home") return <PracticeHome/>;
  if (top === "project") return <ProjectHome/>;
  if (top === "capabilities" && sub)  return <CapabilityDetailPage capId={sub}/>;
  if (top === "guides" && sub)        return <ConfigurationGuidePage ocId={sub}/>;
  if (top === "workproducts" && sub)  return <WorkProductDetailPage wpId={sub}/>;

  switch (top) {
    case "mywork":        return <MyWorkPage/>;
    case "decisions":     return <DecisionsPage/>;
    case "guides":        return <GuidesPage/>;
    case "capabilities":  return <CapabilitiesPage/>;
    case "schedule":      return <SchedulePage/>;
    case "workshops":     return <WorkshopsPage/>;
    case "library":       return <MethodologyPage/>;
    case "ai":            return <AskPage/>;
    case "autopilot":     return <AutopilotPage/>;
    case "settings":      return <SettingsPage/>;
    case "workproducts":  return <WorkProductsKanbanPage/>;
    default:              return <Coming name={LABELS[top] || top}/>;
  }
}

export default function App() {
  // Honor default-landing preference on first paint of empty hash.
  useEffect(() => {
    if (window.location.hash) return;
    const def = localStorage.getItem("v2.defaultLanding") || "practice";
    if (def === "project") window.location.hash = "project";
  }, []);

  return (
    <AppProvider>
      <PageShell>
        <Router/>
      </PageShell>
    </AppProvider>
  );
}
