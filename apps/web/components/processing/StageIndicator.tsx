"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { ActivityEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    id: "brief-parser",
    label: "Understanding",
    description: "Learning your preferences",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: "generator",
    label: "Exploring",
    description: "Finding name ideas",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: "researcher",
    label: "Researching",
    description: "Diving into meanings",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: "expert-selector",
    label: "Curating",
    description: "Picking the best",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    id: "report-composer",
    label: "Composing",
    description: "Creating your report",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
] as const;

interface StageIndicatorProps {
  events: ActivityEvent[];
}

export function StageIndicator({ events }: StageIndicatorProps) {
  const stages = useMemo(() => {
    return STAGES.map((stage) => {
      const hasActivity = events.some(
        (event) =>
          event.agent === stage.id &&
          ["activity", "start", "partial", "result"].includes(event.t)
      );
      const isDone = events.some(
        (event) =>
          event.agent === stage.id &&
          (event.t === "done" || (event.t === "result" && !!event.payload))
      );
      const status = isDone ? "done" : hasActivity ? "active" : "pending";
      return { ...stage, status } as const;
    });
  }, [events]);

  const activeIndex = stages.findIndex((s) => s.status === "active");
  const completedCount = stages.filter((s) => s.status === "done").length;
  const progress = stages.every((s) => s.status === "done")
    ? 100
    : activeIndex >= 0
    ? ((activeIndex + 0.5) / stages.length) * 100
    : (completedCount / stages.length) * 100;

  return (
    <div className="w-full space-y-6">
      {/* Progress bar */}
      <div className="relative h-2 bg-studio-ink/5 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-studio-sage via-studio-rose to-studio-sage rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Stage cards - horizontal on desktop, vertical on mobile */}
      <div className="hidden sm:flex items-start justify-between gap-2">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={cn(
              "flex-1 relative p-4 rounded-xl text-center transition-all duration-300",
              stage.status === "done" && "bg-studio-sage/20",
              stage.status === "active" && "bg-studio-rose/20",
              stage.status === "pending" && "bg-white/30"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all",
                stage.status === "done" && "bg-studio-sage text-studio-ink/70",
                stage.status === "active" && "bg-studio-rose text-studio-ink/70 animate-pulse-soft",
                stage.status === "pending" && "bg-white/60 text-studio-ink/30"
              )}
            >
              {stage.status === "done" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                stage.icon
              )}
            </div>

            {/* Label */}
            <div
              className={cn(
                "font-medium text-sm transition-colors",
                stage.status === "pending" ? "text-studio-ink/30" : "text-studio-ink"
              )}
            >
              {stage.label}
            </div>

            {/* Description */}
            <div
              className={cn(
                "text-xs mt-0.5 transition-colors",
                stage.status === "pending" ? "text-studio-ink/20" : "text-studio-ink/50"
              )}
            >
              {stage.description}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile: Compact horizontal */}
      <div className="sm:hidden flex items-center justify-between">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                stage.status === "done" && "bg-studio-sage text-studio-ink/70",
                stage.status === "active" && "bg-studio-rose text-studio-ink/70 animate-pulse-soft",
                stage.status === "pending" && "bg-white/60 text-studio-ink/30"
              )}
            >
              {stage.status === "done" ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>
            <span
              className={cn(
                "text-xs mt-1",
                stage.status === "pending" ? "text-studio-ink/30" : "text-studio-ink/60"
              )}
            >
              {stage.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
