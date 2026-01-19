'use client';

import type { ExpertSelection } from "@namazing/schemas";

interface ShortlistPanelProps {
  selection?: ExpertSelection;
}

export function ShortlistPanel({ selection }: ShortlistPanelProps) {
  if (!selection) {
    return (
      <div className="rounded-2xl bg-white/70 p-6 text-sm text-studio-ink/60">
        Finalists will appear once the Expert Selector finishes its pass.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl">Shortlist</h2>
        <p className="text-sm text-studio-ink/60">Curated by the Expert Selector.</p>
      </div>
      <ul className="space-y-3">
        {selection.finalists.map((finalist) => (
          <li key={finalist.name} className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-lg font-semibold text-studio-ink">{finalist.name}</p>
            <p className="text-sm text-studio-ink/70">{finalist.why}</p>
            {finalist.combo && (
              <p className="mt-2 text-sm text-studio-ink/70">
                Favorite combo: <span className="font-medium">{finalist.combo.first} {finalist.combo.middle}</span> — {finalist.combo.why}
              </p>
            )}
          </li>
        ))}
      </ul>
      <div className="rounded-xl bg-white/80 p-4">
        <h3 className="text-sm font-semibold text-studio-ink/70">Near Misses</h3>
        <ul className="mt-2 space-y-1 text-sm text-studio-ink/70">
          {selection.near_misses.map((miss) => (
            <li key={miss.name}>
              <span className="font-medium">{miss.name}</span> — {miss.reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
