"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface RunCardProps {
  run: {
    id: string;
    brief: { text?: string } | string;
    mode: string;
    status: string;
    created_at: string;
    completed_at: string | null;
    run_results?: Array<{ result: any }> | { result: any } | null;
  };
}

const statusBorder: Record<string, string> = {
  completed: "border-l-studio-sage",
  running: "border-l-studio-terracotta",
  pending: "border-l-studio-ink/20",
  failed: "border-l-red-400",
};

function relativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function RunCard({ run }: RunCardProps) {
  const briefText = typeof run.brief === "string" ? run.brief : run.brief?.text || "—";
  const truncatedBrief = briefText.length > 120 ? briefText.slice(0, 120) + "..." : briefText;

  const date = relativeDate(run.created_at);

  // Extract top finalist name from result
  const results = Array.isArray(run.run_results) ? run.run_results[0] : run.run_results;
  const result = results?.result;
  const topName = result?.selection?.finalists?.[0]?.name;

  const borderClass = statusBorder[run.status] || statusBorder.pending;

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card
        variant="elevated"
        padding="md"
        className={`border-l-4 ${borderClass}`}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-studio-ink/40">{date}</span>
            {/* Status dot indicator */}
            {run.status === "completed" && (
              <span className="flex items-center gap-1.5 text-xs text-studio-ink/50">
                <span className="w-2 h-2 rounded-full bg-studio-sage" />
                Complete
              </span>
            )}
            {run.status === "running" && (
              <span className="flex items-center gap-1.5 text-xs text-studio-ink/50">
                <span className="w-2 h-2 rounded-full bg-studio-terracotta animate-pulse" />
                Running
              </span>
            )}
            {run.status === "pending" && (
              <span className="flex items-center gap-1.5 text-xs text-studio-ink/50">
                <span className="w-2 h-2 rounded-full bg-studio-ink/20" />
                Pending
              </span>
            )}
            {run.status === "failed" && (
              <span className="flex items-center gap-1.5 text-xs text-red-500">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Failed
              </span>
            )}
          </div>
        </div>

        {topName && (
          <div className="mb-2">
            <span className="font-display text-xl text-studio-terracotta">{topName}</span>
          </div>
        )}

        <p className="text-sm text-studio-ink/60 mb-4 line-clamp-2">{truncatedBrief}</p>

        {run.status === "completed" && (
          <Link href={`/report/${run.id}`}>
            <Button variant="secondary" size="sm">
              View Report
            </Button>
          </Link>
        )}
      </Card>
    </motion.div>
  );
}
