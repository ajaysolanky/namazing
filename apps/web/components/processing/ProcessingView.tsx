"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { StageIndicator } from "./StageIndicator";
import { LiveActivityFeed } from "./LiveActivityFeed";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { subscribeToRun } from "@/lib/sse";
import { fetchResult } from "@/lib/api";
import type { ActivityEvent, NameCard } from "@/lib/types";
import { cn } from "@/lib/utils";

// Soft color palette for naming themes — cycled by index
const THEME_COLORS = [
  { bg: "bg-sky-50", border: "border-sky-200", dot: "bg-sky-400" },
  { bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-400" },
  { bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-400" },
  { bg: "bg-violet-50", border: "border-violet-200", dot: "bg-violet-400" },
  { bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-400" },
  { bg: "bg-teal-50", border: "border-teal-200", dot: "bg-teal-400" },
  { bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-400" },
] as const;

function getThemeColor(theme: string, allThemes: string[]) {
  const index = allThemes.indexOf(theme);
  return THEME_COLORS[index >= 0 ? index % THEME_COLORS.length : 0];
}

interface ProcessingViewProps {
  runId: string;
}

export function ProcessingView({ runId }: ProcessingViewProps) {
  const router = useRouter();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [discoveredNames, setDiscoveredNames] = useState<NameCard[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topNames, setTopNames] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [nameThemeMap, setNameThemeMap] = useState<Record<string, string>>({});
  const [isNavigating, setIsNavigating] = useState(false);

  const handleEvent = useCallback((event: ActivityEvent) => {
    setEvents((prev) => [...prev, event]);

    // Extract unique themes and name→theme mapping from generator partial events
    if (event.t === "partial" && event.agent === "generator" && event.field === "candidates") {
      const candidates = event.value as Array<{ name?: string; theme?: string }> | undefined;
      if (Array.isArray(candidates)) {
        const uniqueThemes = [...new Set(
          candidates.map((c) => c.theme).filter((t): t is string => !!t && t !== "user-favorite")
        )];
        setThemes(uniqueThemes);

        const mapping: Record<string, string> = {};
        for (const c of candidates) {
          if (c.name && c.theme) mapping[c.name] = c.theme;
        }
        setNameThemeMap(mapping);
      }
    }

    // Handle result and partial events
    if (event.t === "result" || event.t === "partial") {
      // Researcher emits "partial" events with name cards
      if (event.agent === "researcher") {
        const card = (event.t === "result" ? event.payload : event.value) as NameCard | undefined;
        if (card && card.name) {
          setDiscoveredNames((prev) => {
            const existing = prev.find((n) => n.name === card.name);
            if (existing) {
              return prev.map((n) => (n.name === card.name ? card : n));
            }
            return [...prev, card];
          });
        }
      }

      // Capture top names from expert selector
      if (event.t === "result" && event.agent === "expert-selector" && event.payload) {
        const selection = event.payload as { finalists?: { name: string }[] };
        if (selection.finalists) {
          setTopNames(selection.finalists.slice(0, 3).map((f) => f.name));
        }
      }
    }

    // Handle completion
    if (event.t === "done" && event.agent === "report-composer") {
      setIsComplete(true);
    }

    // Handle errors
    if (event.t === "error") {
      setError(event.msg);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToRun(runId, handleEvent);
    return () => unsubscribe();
  }, [runId, handleEvent]);

  const handleViewResults = () => {
    setIsNavigating(true);
    router.push(`/report/${runId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Container size="lg" className="flex-1 py-8 sm:py-12">
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <AnimatePresence mode="wait">
              {isComplete ? (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 relative"
                >
                  {/* Celebration particles */}
                  <div className="absolute inset-0 pointer-events-none overflow-visible">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          left: `${50 + (Math.random() - 0.5) * 60}%`,
                          top: "50%",
                          background: i % 3 === 0 ? "#f8d4d8" : i % 3 === 1 ? "#d7e3d4" : "#c4704b",
                        }}
                        initial={{ y: 0, scale: 0, opacity: 1 }}
                        animate={{
                          y: [0, -100 - Math.random() * 100],
                          x: [(Math.random() - 0.5) * 200],
                          scale: [0, 1, 0.5],
                          opacity: [0, 1, 0],
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.05,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-studio-sage/40 to-studio-rose/40 rounded-full text-sm text-studio-ink/80 shadow-soft"
                  >
                    <svg className="w-5 h-5 text-studio-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Consultation complete
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-display text-4xl sm:text-5xl text-studio-ink"
                  >
                    We found some{" "}
                    <span className="text-gradient-terracotta">beautiful names</span>
                  </motion.h1>

                  {topNames.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-wrap justify-center gap-3"
                    >
                      {topNames.slice(0, 3).map((name, i) => (
                        <motion.span
                          key={name}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          className="px-5 py-2 bg-white rounded-full shadow-soft font-display text-xl text-studio-ink"
                        >
                          {name}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <h1 className="font-display text-3xl sm:text-4xl text-studio-ink">
                    Finding your perfect names...
                  </h1>
                  <p className="text-studio-ink/60 max-w-lg mx-auto">
                    Our naming experts are researching personalized recommendations for your family.
                    This usually takes 2-3 minutes.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stage indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="cream" padding="lg">
              <StageIndicator events={events} themes={themes} />
            </Card>
          </motion.div>

          {/* Main content grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Activity feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="default" padding="md" className="h-full">
                <h2 className="font-display text-xl text-studio-ink mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-studio-rose rounded-full animate-pulse" />
                  Live updates
                </h2>
                <LiveActivityFeed events={events} />
              </Card>
            </motion.div>

            {/* Discovered names */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="default" padding="md" className="h-full">
                <h2 className="font-display text-xl text-studio-ink mb-4">
                  Names discovered
                  {discoveredNames.length > 0 && (
                    <span className="ml-2 text-sm font-body font-normal text-studio-ink/40">
                      ({discoveredNames.length})
                    </span>
                  )}
                </h2>

                {/* Theme color legend */}
                {themes.length > 0 && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
                    {themes.map((theme) => {
                      const color = getThemeColor(theme, themes);
                      return (
                        <div key={theme} className="flex items-center gap-1.5">
                          <span className={cn("w-2.5 h-2.5 rounded-full", color.dot)} />
                          <span className="text-xs text-studio-ink/60 capitalize">{theme}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {discoveredNames.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-studio-ink/40">
                    <p className="text-sm">Names will appear here as they&apos;re discovered...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                    <AnimatePresence>
                      {discoveredNames.map((card, index) => {
                        const cardTheme = nameThemeMap[card.name];
                        const color = cardTheme ? getThemeColor(cardTheme, themes) : null;
                        return (
                          <motion.div
                            key={card.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03, duration: 0.2 }}
                            className={cn(
                              "p-3 rounded-xl border-l-[3px] transition-all",
                              color
                                ? `${color.bg} ${color.border}`
                                : "bg-studio-sand/30 border-transparent"
                            )}
                          >
                            <div className="font-display text-lg text-studio-ink">
                              {card.name}
                            </div>
                            {card.meaning && (
                              <div className="text-xs text-studio-ink/50 mt-1 line-clamp-2">
                                {card.meaning}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="outline" padding="md" className="border-red-200 bg-red-50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-red-800">Something went wrong</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Completion actions */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <Button
                  variant="terracotta"
                  size="xl"
                  shimmer
                  onClick={handleViewResults}
                  disabled={isNavigating}
                >
                  {isNavigating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Preparing your report…
                    </>
                  ) : (
                    "View your personalized report"
                  )}
                </Button>
                {!isNavigating && (
                  <p className="text-sm text-studio-ink/40">
                    Your curated shortlist with detailed insights awaits
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}
