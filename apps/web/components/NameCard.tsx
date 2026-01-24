'use client';

import { useState } from "react";
import type { NameCard as NameCardType } from "@namazing/schemas";

interface NameCardProps {
  card: NameCardType;
}

export function NameCard({ card }: NameCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <div>
          <h3 className="font-display text-2xl text-studio-ink">{card.name}</h3>
          <p className="text-sm text-studio-ink/60">{card.ipa}</p>
        </div>
        <span className="text-sm text-studio-ink/50">{card.syllables} syllables</span>
      </div>
      {card.meaning && (
        <p className="mt-3 text-sm text-studio-ink/80">{card.meaning}</p>
      )}
      {card.combo_suggestions && card.combo_suggestions.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {card.combo_suggestions.slice(0, 2).map((combo) => (
            <li key={`${combo.first}-${combo.middle}`} className="rounded-lg bg-studio-sage/40 px-3 py-2 text-studio-ink/80">
              <span className="font-medium">{combo.first} {combo.middle}</span>
              <span className="block text-xs text-studio-ink/60">{combo.why}</span>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="mt-auto pt-4 text-sm font-semibold text-studio-ink/70 hover:text-studio-ink"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide research log" : "Show research log"}
      </button>
      {open && card.research_log && (
        <ul className="mt-2 space-y-1 rounded-lg bg-studio-ink/5 p-3 text-xs text-studio-ink/70">
          {card.research_log.map((entry) => (
            <li key={entry}>• {entry}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
