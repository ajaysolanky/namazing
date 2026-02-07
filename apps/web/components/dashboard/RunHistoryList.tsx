"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RunCard } from "./RunCard";
import posthog from "posthog-js";

interface RunHistoryListProps {
  runs: Array<{
    id: string;
    brief: any;
    mode: string;
    status: string;
    created_at: string;
    completed_at: string | null;
    run_results?: any;
  }>;
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function RunHistoryList({ runs }: RunHistoryListProps) {
  if (runs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <Card variant="celebration" padding="xl" className="text-center relative overflow-hidden">
          {/* Floating sparkles */}
          <motion.span
            animate={{ opacity: [0, 1, 0], y: [-5, -15, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-6 left-1/4 text-studio-terracotta/25 text-lg pointer-events-none"
          >
            ✦
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0], y: [-5, -15, -5] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
            className="absolute top-10 right-1/4 text-studio-rose/30 text-sm pointer-events-none"
          >
            ✦
          </motion.span>

          <div className="relative z-10">
            <h3 className="font-display text-2xl text-studio-ink mb-2">
              Your naming journey begins here
            </h3>
            <p className="text-sm text-studio-ink/50 mb-8 max-w-sm mx-auto">
              Start your first consultation and discover names chosen just for your family.
            </p>

            {/* Sample name preview cards */}
            <div className="flex justify-center gap-3 mb-8">
              {["Aria", "Rowan", "Seren"].map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="px-4 py-2 rounded-xl bg-white/80 shadow-soft border border-studio-ink/5"
                >
                  <span className="font-display text-lg text-studio-ink/30">{name}</span>
                </motion.div>
              ))}
            </div>

            <Link href="/intake" onClick={() => posthog.capture("cta_clicked", { cta: "dashboard_empty", label: "Start consultation" })}>
              <Button variant="terracotta" size="md">
                Start consultation
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-sm text-studio-ink/40 mb-4"
      >
        {runs.length} consultation{runs.length !== 1 ? "s" : ""}
      </motion.p>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {runs.map((run) => (
          <motion.div key={run.id} variants={itemVariants}>
            <RunCard run={run} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
