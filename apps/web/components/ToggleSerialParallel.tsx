'use client';

import type { RunMode } from "../lib/types";

interface ToggleProps {
  mode: RunMode;
  onChange: (mode: RunMode) => void;
}

export function ToggleSerialParallel({ mode, onChange }: ToggleProps) {
  return (
    <div className="inline-flex rounded-full bg-white p-1 shadow-inner">
      {(["serial", "parallel"] as RunMode[]).map((option) => {
        const active = option === mode;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-4 py-1 text-sm font-semibold transition ${
              active
                ? "bg-studio-ink text-white rounded-full"
                : "text-studio-ink/70 hover:text-studio-ink"
            }`}
          >
            {option === "serial" ? "Serial" : "Parallel"}
          </button>
        );
      })}
    </div>
  );
}
