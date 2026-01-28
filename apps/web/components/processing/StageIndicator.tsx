"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ActivityEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    id: "brief-parser",
    label: "Understanding",
    description: "Learning your preferences",
    activeDescription: "Reading your brief...",
    doneDescription: "Got it!",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    activeIcon: (
      <motion.div
        className="w-5 h-5 relative"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <motion.div
          className="absolute inset-0 bg-yellow-300/50 rounded-full blur-md"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    ),
    gradient: "from-amber-400 to-yellow-300",
  },
  {
    id: "generator",
    label: "Exploring",
    description: "Finding name ideas",
    activeDescription: "Searching for names...",
    doneDescription: "Found great options!",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    activeIcon: (
      <motion.svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        animate={{ x: [-2, 2, -2], rotate: [-5, 5, -5] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </motion.svg>
    ),
    gradient: "from-sky-400 to-blue-400",
  },
  {
    id: "researcher",
    label: "Researching",
    description: "Diving into meanings",
    activeDescription: "Learning about each name...",
    doneDescription: "Research complete!",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    activeIcon: (
      <motion.div className="w-5 h-5 relative">
        <motion.div
          className="absolute inset-0"
          animate={{ rotateY: [0, 15, 0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </motion.div>
      </motion.div>
    ),
    gradient: "from-emerald-400 to-teal-400",
  },
  {
    id: "expert-selector",
    label: "Curating",
    description: "Picking the best",
    activeDescription: "Selecting top picks...",
    doneDescription: "Shortlist ready!",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    activeIcon: (
      <motion.svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </motion.svg>
    ),
    gradient: "from-violet-400 to-purple-400",
  },
  {
    id: "report-composer",
    label: "Composing",
    description: "Creating your report",
    activeDescription: "Writing your report...",
    doneDescription: "Report complete!",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    activeIcon: (
      <motion.div className="w-5 h-5 relative">
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <motion.div
          className="absolute bottom-1 right-1 w-2 h-2"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <svg viewBox="0 0 8 8" fill="currentColor">
            <circle cx="4" cy="4" r="2" />
          </svg>
        </motion.div>
      </motion.div>
    ),
    gradient: "from-rose-400 to-pink-400",
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

  const allDone = stages.every((s) => s.status === "done");

  return (
    <div className="w-full space-y-6">
      {/* Progress bar with gradient animation */}
      <div className="relative h-3 bg-studio-ink/5 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            allDone ? "bg-gradient-to-r from-studio-sage via-studio-rose to-studio-terracotta" : "progress-flow-bar"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Shimmer effect */}
        {!allDone && (
          <motion.div
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "500%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>

      {/* Stage cards - horizontal on desktop */}
      <div className="hidden sm:flex items-stretch justify-between gap-3">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={cn(
              "flex-1 relative p-5 rounded-2xl text-center transition-all duration-300 overflow-hidden",
              stage.status === "done" && "bg-gradient-to-br from-studio-sage/30 to-studio-mint/20",
              stage.status === "active" && "bg-white shadow-card ring-2 ring-studio-terracotta/30",
              stage.status === "pending" && "bg-white/50"
            )}
          >
            {/* Active indicator glow */}
            {stage.status === "active" && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-studio-terracotta/5 to-studio-gold/5"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Icon container */}
            <div className="relative mx-auto mb-3">
              <motion.div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                  stage.status === "done" && `bg-gradient-to-br ${stage.gradient} text-white shadow-soft`,
                  stage.status === "active" && "bg-gradient-to-br from-studio-terracotta to-studio-gold text-white shadow-glow-terracotta",
                  stage.status === "pending" && "bg-studio-sand/50 text-studio-ink/25"
                )}
                animate={stage.status === "active" ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.5, repeat: stage.status === "active" ? Infinity : 0 }}
              >
                <AnimatePresence mode="wait">
                  {stage.status === "done" ? (
                    <motion.svg
                      key="check"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.svg>
                  ) : stage.status === "active" ? (
                    <motion.div key="active">
                      {stage.activeIcon}
                    </motion.div>
                  ) : (
                    <motion.div key="pending">
                      {stage.icon}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Completion sparkles */}
              <AnimatePresence>
                {stage.status === "done" && index === completedCount - 1 && (
                  <>
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-studio-gold rounded-full"
                        style={{ top: "50%", left: "50%" }}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: Math.cos(i * 90 * Math.PI / 180) * 25,
                          y: Math.sin(i * 90 * Math.PI / 180) * 25,
                          opacity: [1, 1, 0],
                        }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Label */}
            <div
              className={cn(
                "font-semibold text-sm transition-colors mb-1",
                stage.status === "pending" ? "text-studio-ink/30" : "text-studio-ink"
              )}
            >
              {stage.label}
            </div>

            {/* Dynamic description */}
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.status}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={cn(
                  "text-xs transition-colors",
                  stage.status === "active" ? "text-studio-terracotta" :
                  stage.status === "done" ? "text-studio-ink/50" :
                  "text-studio-ink/20"
                )}
              >
                {stage.status === "active" ? stage.activeDescription :
                 stage.status === "done" ? stage.doneDescription :
                 stage.description}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Mobile: Focused current stage */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-4">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                stage.status === "done" && `bg-gradient-to-br ${stage.gradient} text-white`,
                stage.status === "active" && "bg-gradient-to-br from-studio-terracotta to-studio-gold text-white shadow-glow-terracotta",
                stage.status === "pending" && "bg-white/60 text-studio-ink/25"
              )}
              animate={stage.status === "active" ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1.5, repeat: stage.status === "active" ? Infinity : 0 }}
            >
              {stage.status === "done" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : stage.status === "active" ? (
                stage.activeIcon
              ) : (
                <span className="text-xs font-semibold">{index + 1}</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Current stage details */}
        {activeIndex >= 0 && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 bg-white rounded-2xl shadow-soft"
          >
            <div className="font-semibold text-studio-ink mb-1">
              {stages[activeIndex].label}
            </div>
            <div className="text-sm text-studio-terracotta">
              {stages[activeIndex].activeDescription}
            </div>
          </motion.div>
        )}

        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-4 bg-gradient-to-br from-studio-sage/30 to-studio-rose/20 rounded-2xl"
          >
            <div className="font-semibold text-studio-ink mb-1">
              All done!
            </div>
            <div className="text-sm text-studio-ink/60">
              Your consultation is ready
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
