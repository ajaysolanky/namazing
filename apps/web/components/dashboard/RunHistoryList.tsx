"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RunCard } from "./RunCard";

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

export function RunHistoryList({ runs }: RunHistoryListProps) {
  if (runs.length === 0) {
    return (
      <div className="text-center py-16 bg-white/60 rounded-3xl border border-studio-ink/5">
        <div className="text-4xl mb-4">{"\u2728"}</div>
        <h3 className="font-display text-xl text-studio-ink mb-2">No consultations yet</h3>
        <p className="text-sm text-studio-ink/50 mb-6 max-w-xs mx-auto">
          Start your first AI-powered baby name consultation.
        </p>
        <Link href="/intake">
          <Button variant="terracotta" size="md">
            Start consultation
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {runs.map((run) => (
        <RunCard key={run.id} run={run} />
      ))}
    </div>
  );
}
