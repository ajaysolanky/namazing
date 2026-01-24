'use client';

import { useMemo } from "react";
import type { ActivityEvent } from "../lib/types";

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  const entries = useMemo(() => {
    return events
      .filter((event) => event.t === "activity" || event.t === "start" || event.t === "done")
      .map((event, index) => {
        // Use a combination of event properties and index to create a stable key
        // Include msg content hash for activity events to ensure uniqueness
        const msgHash = event.t === "activity" ? `-${event.msg.slice(0, 20).replace(/\s/g, '')}` : '';
        const nameHash = ('name' in event && event.name) ? `-${event.name}` : '';
        const key = `${event.t}-${event.agent}${nameHash}${msgHash}-${index}`;
        let label = "";
        if (event.t === "activity") {
          label = `${event.agent}: ${event.msg}`;
        } else if (event.t === "start") {
          label = `${event.agent} starting ${event.name ?? "task"}`;
        } else {
          label = `${event.agent} finished ${event.name ?? "task"}`;
        }
        return { key, label };
      });
  }, [events]);

  if (entries.length === 0) {
    return (
      <div className="rounded-xl bg-white/60 p-4 text-sm text-studio-ink/60">
        Activity timeline will appear once a run starts.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div key={entry.key} className="rounded-xl bg-white p-3 shadow-sm">
          <span className="text-sm font-medium text-studio-ink/80">{entry.label}</span>
        </div>
      ))}
    </div>
  );
}
