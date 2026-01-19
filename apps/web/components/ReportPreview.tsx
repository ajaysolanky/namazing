'use client';

import type { RunResult } from "@namazing/schemas";

interface ReportPreviewProps {
  result?: RunResult;
}

export function ReportPreview({ result }: ReportPreviewProps) {
  if (!result) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="font-display text-xl">Client Report Preview</h2>
      <p className="mt-2 text-sm text-studio-ink/70">{result.report.summary}</p>
      {result.report.finalists.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-studio-ink/60">
            Finalists
          </h3>
          <ul className="mt-2 space-y-2 text-sm">
            {result.report.finalists.map((finalist) => (
              <li key={finalist.name}>
                <span className="font-semibold">{finalist.name}</span> — {finalist.why}
              </li>
            ))}
          </ul>
        </div>
      )}
      {result.report.tradeoffs && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-studio-ink/60">
            Tradeoffs & Pitfalls
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {result.report.tradeoffs.map((note, idx) => (
              <li key={idx}>• {note}</li>
            ))}
          </ul>
        </div>
      )}
      {result.report.tie_break_tips && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-studio-ink/60">
            Tie-break Tips
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {result.report.tie_break_tips.map((tip, idx) => (
              <li key={idx}>• {tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
