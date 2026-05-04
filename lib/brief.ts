// Brief composer — time- and scope-aware narrative summary.
// Two scopes: "practice" (across all engagements) and "project" (one engagement).
// Three time modes: morning (before 12), afternoon (12–18), week-wrap (Fri after 14).

import { PORTFOLIO, TASKS, DRCS } from "./data";

export type BriefFragment = { text: string; em?: "warn" | "good" | "bad" | "accent" | "strong" | "quiet" };

export type Brief = {
  time: string;
  date: string;
  mode: "morning" | "afternoon" | "wrap" | "evening";
  fragments: BriefFragment[];
  stats: Record<string, number | string>;
  project?: typeof PORTFOLIO[number];
};

function fmtTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes();
  const ap = h >= 12 ? "pm" : "am";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${m < 10 ? "0" : ""}${m}${ap}`;
}

function fmtDate(d: Date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

function timeMode(d: Date): Brief["mode"] {
  const dow = d.getDay();
  const h = d.getHours();
  if (dow === 5 && h >= 14) return "wrap";
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

function practiceBrief(now: Date): Brief {
  const mode = timeMode(now);
  const myProjects = PORTFOLIO.slice(0, 3);
  const amber = myProjects.filter(p => p.health === "amber");

  const myTasks = TASKS.filter(t => t.assignee === "jh" || !t.assignee);
  const dueToday = myTasks.filter(t => /today|by today|EOD/i.test(t.due || ""));

  const openDrcs = DRCS.filter(d => d.status !== "resolved");
  const stuckDrcs = openDrcs.filter(d => (d.daysStale || 0) >= 5);

  const greeting = mode === "morning" ? "Good morning, Janet."
    : mode === "afternoon" ? "Hi Janet — here's what's left."
    : mode === "wrap" ? "Friday wrap, Janet."
    : "Hi Janet.";

  const frags: BriefFragment[] = [];
  frags.push({ text: greeting + " " });

  if (mode === "wrap") {
    frags.push({ text: "Across your " });
    frags.push({ text: `${myProjects.length} engagements`, em: "strong" });
    frags.push({ text: ", this week was steady — " });
    if (amber.length === 0) {
      frags.push({ text: "no health changes", em: "good" });
    } else {
      frags.push({ text: `${amber[0].name} stayed amber`, em: "warn" });
    }
    frags.push({ text: ". You closed " });
    frags.push({ text: "11 tasks", em: "strong" });
    frags.push({ text: " and resolved " });
    frags.push({ text: "3 client decisions", em: "good" });
    frags.push({ text: ". Heading into Monday: " });
    frags.push({ text: `${stuckDrcs.length || 2} decisions still open`, em: "warn" });
    frags.push({ text: " and the " });
    frags.push({ text: "NSU Sprint 1 demo Tuesday at 10am", em: "accent" });
    frags.push({ text: ". Have a good weekend." });
  } else if (mode === "afternoon") {
    frags.push({ text: "You've cleared " });
    frags.push({ text: "6 of 9 tasks", em: "good" });
    frags.push({ text: " on today's list. Still on the table: " });
    if (dueToday.length > 0) {
      frags.push({ text: `${dueToday.length} EOD items`, em: "warn" });
    } else {
      frags.push({ text: "the registrar email", em: "warn" });
    }
    frags.push({ text: " for " });
    frags.push({ text: amber[0]?.name || "NSU", em: "strong" });
    frags.push({ text: " and the " });
    frags.push({ text: "OC-3.2 review", em: "accent" });
    frags.push({ text: " — both should land before 5." });
  } else {
    const leadProj = myProjects.find(p => p.health === "green") || myProjects[0];
    const ambProj = amber[0];

    frags.push({ text: "Across your " });
    frags.push({ text: `${myProjects.length} active engagements`, em: "strong" });
    frags.push({ text: ", " });
    frags.push({ text: `${leadProj.name}`, em: "strong" });
    frags.push({ text: " is on pace" });
    if (ambProj) {
      frags.push({ text: ", but " });
      frags.push({ text: `${ambProj.name} is amber`, em: "warn" });
      frags.push({ text: " and slipping on " });
      frags.push({ text: "Finance configuration", em: "warn" });
    }
    frags.push({ text: ". You've got " });
    frags.push({ text: `${stuckDrcs.length || 2} client decisions to chase`, em: "warn" });
    frags.push({ text: " — both " });
    frags.push({ text: "5+ days open", em: "bad" });
    frags.push({ text: ". Your day is mostly the " });
    frags.push({ text: "Sprint 1 demo prep", em: "accent" });
    frags.push({ text: " for Tuesday." });
  }

  return {
    time: fmtTime(now),
    date: fmtDate(now),
    mode,
    fragments: frags,
    stats: {
      engagements: myProjects.length,
      attention: amber.length,
      decisions: openDrcs.length,
      stuck: stuckDrcs.length || 2,
    },
  };
}

function projectBrief(now: Date, projectId?: string): Brief {
  const mode = timeMode(now);
  const proj = PORTFOLIO.find(p => p.id === projectId) || PORTFOLIO[0];
  const drcs = DRCS;

  const greeting = mode === "morning" ? "Good morning."
    : mode === "afternoon" ? "Afternoon check-in."
    : mode === "wrap" ? "End of week, here's where we are."
    : "Quick update.";

  const frags: BriefFragment[] = [];
  frags.push({ text: greeting + " " });
  frags.push({ text: `${proj.name}`, em: "strong" });

  if (proj.health === "green") {
    frags.push({ text: " is " });
    frags.push({ text: "on pace", em: "good" });
  } else if (proj.health === "amber") {
    frags.push({ text: " is " });
    frags.push({ text: "amber", em: "warn" });
    frags.push({ text: " — " });
    frags.push({ text: "Finance configuration is the drag", em: "warn" });
  } else {
    frags.push({ text: " is " });
    frags.push({ text: "off-track", em: "bad" });
  }
  frags.push({ text: " at " });
  frags.push({ text: `${proj.readiness}% readiness`, em: "strong" });
  frags.push({ text: ", " });
  frags.push({ text: `${proj.sprint}`, em: "strong" });
  frags.push({ text: ". " });

  if (mode === "wrap") {
    frags.push({ text: "This week we cleared " });
    frags.push({ text: "11 stories", em: "good" });
    frags.push({ text: " and resolved " });
    frags.push({ text: "3 client decisions", em: "good" });
    frags.push({ text: ". Two are still open going into Monday — registrar comms and FA cohort cutover." });
  } else if (mode === "afternoon") {
    frags.push({ text: "Two of today's three priorities are done. The " });
    frags.push({ text: "registrar email", em: "warn" });
    frags.push({ text: " is the last item before EOD." });
  } else {
    const stuck = drcs.filter(d => (d.daysStale || 0) >= 5).length || 2;
    frags.push({ text: "You've got " });
    frags.push({ text: `${stuck} client decisions to chase`, em: "warn" });
    frags.push({ text: " before Thursday and the " });
    frags.push({ text: "Sprint 1 demo Tuesday at 10am", em: "accent" });
    frags.push({ text: " is the headline. " });
    frags.push({ text: "Everything else can wait.", em: "quiet" });
  }

  return {
    time: fmtTime(now),
    date: fmtDate(now),
    mode,
    project: proj,
    fragments: frags,
    stats: {
      readiness: proj.readiness,
      sprint: proj.sprint,
      health: proj.health,
      nextGL: proj.nextGL,
    },
  };
}

export function composeBrief(scope: "practice" | "project", opts?: { now?: Date; projectId?: string }): Brief {
  const now = opts?.now || new Date();
  if (scope === "practice") return practiceBrief(now);
  return projectBrief(now, opts?.projectId);
}
