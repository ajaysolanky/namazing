"use client";

import Link from "next/link";

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

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  running: "bg-yellow-100 text-yellow-700",
  pending: "bg-gray-100 text-gray-600",
  failed: "bg-red-100 text-red-700",
};

export function RunCard({ run }: RunCardProps) {
  const briefText = typeof run.brief === "string" ? run.brief : run.brief?.text || "—";
  const truncatedBrief = briefText.length > 120 ? briefText.slice(0, 120) + "..." : briefText;

  const date = new Date(run.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Extract top finalist name from result
  const results = Array.isArray(run.run_results) ? run.run_results[0] : run.run_results;
  const result = results?.result;
  const topName = result?.selection?.finalists?.[0]?.name;

  const statusClass = statusColors[run.status] || statusColors.pending;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-studio-ink/5 hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-studio-ink/40">{date}</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusClass}`}>
            {run.status}
          </span>
        </div>
        <span className="text-xs text-studio-ink/30 uppercase">{run.mode}</span>
      </div>

      {topName && (
        <div className="mb-2">
          <span className="font-display text-xl text-studio-terracotta">{topName}</span>
        </div>
      )}

      <p className="text-sm text-studio-ink/60 mb-4 line-clamp-2">{truncatedBrief}</p>

      {run.status === "completed" && (
        <Link
          href={`/report/${run.id}`}
          className="text-sm font-medium text-studio-terracotta hover:underline"
        >
          View Report &rarr;
        </Link>
      )}
    </div>
  );
}
