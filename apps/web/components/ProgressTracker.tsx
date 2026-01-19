'use client';

import type { ActivityEvent } from "../lib/types";

const STEPS = [
  { id: "brief-parser", label: "Parser" },
  { id: "generator", label: "Generator" },
  { id: "researcher", label: "Research" },
  { id: "expert-selector", label: "Selector" },
  { id: "report-composer", label: "Report" },
] as const;

export function ProgressTracker({ events }: { events: ActivityEvent[] }) {
  const statuses = STEPS.map((step) => {
    const hasActivity = events.some(
      (event) => event.agent === step.id && ["activity", "start", "partial", "result"].includes(event.t)
    );
    const isDone = events.some(
      (event) => event.agent === step.id && (event.t === "done" || (event.t === "result" && !!event.payload))
    );
    const status = isDone ? "done" : hasActivity ? "active" : "pending";
    return { ...step, status } as const;
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {statuses.map((step) => (
        <div
          key={step.id}
          className="flex min-w-[64px] flex-col items-center text-xs uppercase tracking-wide text-studio-ink/60"
        >
          <div
            className={`mb-1 h-3 w-3 rounded-full transition ${
              step.status === "done"
                ? "bg-studio-sage"
                : step.status === "active"
                ? "bg-studio-rose"
                : "bg-white border border-studio-ink/20"
            }`}
          />
          {step.label}
        </div>
      ))}
    </div>
  );
}
