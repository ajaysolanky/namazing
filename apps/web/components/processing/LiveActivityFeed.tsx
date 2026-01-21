"use client";

import { useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ActivityEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LiveActivityFeedProps {
  events: ActivityEvent[];
  maxItems?: number;
}

// Human-readable agent labels
const agentLabels: Record<string, string> = {
  "brief-parser": "Understanding",
  generator: "Explorer",
  researcher: "Researcher",
  "expert-selector": "Curator",
  "report-composer": "Composer",
};

// Human-readable message transforms
function humanizeMessage(event: ActivityEvent): string {
  const agent = event.agent;

  if (event.t === "activity") {
    // Make messages more conversational
    let msg = event.msg;
    msg = msg.replace(/^Parsing/, "Reading");
    msg = msg.replace(/^Generating/, "Finding");
    msg = msg.replace(/^Researching/, "Learning about");
    msg = msg.replace(/^Selecting/, "Choosing");
    msg = msg.replace(/^Composing/, "Writing");
    return msg;
  }

  if (event.t === "start") {
    if (agent === "brief-parser") return "Starting to understand your preferences...";
    if (agent === "generator") return event.name ? `Looking into ${event.name}...` : "Exploring name ideas...";
    if (agent === "researcher") return event.name ? `Researching ${event.name}...` : "Diving deeper...";
    if (agent === "expert-selector") return "Curating your shortlist...";
    if (agent === "report-composer") return "Preparing your personalized report...";
    return event.name ? `Working on ${event.name}...` : "Working...";
  }

  if (event.t === "done") {
    if (agent === "brief-parser") return "Got it!";
    if (agent === "generator") return event.name ? `Found ${event.name}` : "Found some great options";
    if (agent === "researcher") return event.name ? `Finished researching ${event.name}` : "Research complete";
    if (agent === "expert-selector") return "Shortlist ready";
    if (agent === "report-composer") return "Report complete!";
    return event.name ? `Finished ${event.name}` : "Done";
  }

  if (event.t === "log") {
    return event.msg;
  }

  return "";
}

export function LiveActivityFeed({ events, maxItems = 15 }: LiveActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const entries = useMemo(() => {
    return events
      .filter(
        (event) =>
          event.t === "activity" ||
          event.t === "start" ||
          event.t === "done" ||
          event.t === "log"
      )
      .slice(-maxItems)
      .map((event, index) => {
        const key = `${event.t}-${event.agent}-${index}-${Date.now()}`;
        const agent = agentLabels[event.agent] || event.agent;
        const message = humanizeMessage(event);
        let type: "info" | "start" | "done" | "activity" = "info";

        if (event.t === "activity") type = "activity";
        else if (event.t === "start") type = "start";
        else if (event.t === "done") type = "done";
        else if (event.t === "log") type = "info";

        return { key, agent, message, type };
      })
      .filter((e) => e.message); // Filter out empty messages
  }, [events, maxItems]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries.length]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-studio-ink/40">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-studio-ink/10 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-studio-ink/40 rounded-full animate-spin" />
        </div>
        <p className="text-sm mt-4">Getting everything ready...</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="space-y-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin"
    >
      <AnimatePresence initial={false}>
        {entries.map((entry) => (
          <motion.div
            key={entry.key}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl",
              entry.type === "done" && "bg-studio-sage/20",
              entry.type === "start" && "bg-white/80",
              entry.type === "activity" && "bg-white/60",
              entry.type === "info" && "bg-white/40"
            )}
          >
            {/* Status icon */}
            <div
              className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
                entry.type === "done" && "bg-studio-sage",
                entry.type === "start" && "bg-studio-rose",
                (entry.type === "activity" || entry.type === "info") && "bg-studio-ink/10"
              )}
            >
              {entry.type === "done" ? (
                <svg className="w-3.5 h-3.5 text-studio-ink/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : entry.type === "start" ? (
                <div className="w-2 h-2 bg-studio-ink/40 rounded-full animate-pulse" />
              ) : (
                <div className="w-1.5 h-1.5 bg-studio-ink/30 rounded-full" />
              )}
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm",
                entry.type === "done" ? "text-studio-ink/70" : "text-studio-ink/60"
              )}>
                {entry.message}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
