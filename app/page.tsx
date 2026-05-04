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
  const top = route.split("/")[0].split("?")[0].split("#")[0];

  if (!top || top === "home") return <PracticeHome/>;
  if (top === "project") return <ProjectHome/>;

  switch (top) {
    case "mywork":       return <MyWorkPage/>;
    case "decisions":    return <DecisionsPage/>;
    case "guides":       return <GuidesPage/>;
    case "capabilities": return <CapabilitiesPage/>;
    case "schedule":     return <SchedulePage/>;
    case "workshops":    return <WorkshopsPage/>;
    case "library":      return <MethodologyPage/>;
    case "ai":           return <AskPage/>;
    case "autopilot":    return <AutopilotPage/>;
    case "settings":     return <SettingsPage/>;
    default:             return <Coming name={LABELS[top] || top}/>;
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
