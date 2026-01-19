'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ExpertSelection,
  NameCard,
  RunResult,
} from "@namazing/schemas";
import { ActivityFeed } from "./ActivityFeed";
import { ToggleSerialParallel } from "./ToggleSerialParallel";
import { ProgressTracker } from "./ProgressTracker";
import { NameCard as NameCardComponent } from "./NameCard";
import { ShortlistPanel } from "./ShortlistPanel";
import { ReportPreview } from "./ReportPreview";
import { subscribeToRun } from "../lib/sse";
import { fetchResult, startRun } from "../lib/api";
import type { ActivityEvent, RunMode } from "../lib/types";

export function StudioApp() {
  const [brief, setBrief] = useState("");
  const [mode, setMode] = useState<RunMode>("serial");
  const [runId, setRunId] = useState<string | null>(null);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [cards, setCards] = useState<Record<string, NameCard>>({});
  const [selection, setSelection] = useState<ExpertSelection | undefined>();
  const [result, setResult] = useState<RunResult | undefined>();
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardList = useMemo(() => {
    return Object.values(cards);
  }, [cards]);

  useEffect(() => {
    if (!runId) return;
    const unsubscribe = subscribeToRun(runId, (event) => {
      setEvents((prev) => [...prev, event]);

      if (event.t === "partial" && event.field === "card" && event.value) {
        const card = event.value as NameCard;
        setCards((prev) => ({ ...prev, [card.name]: card }));
      }

      if (event.t === "result" && event.agent === "expert-selector" && event.payload) {
        setSelection(event.payload as ExpertSelection);
      }

      if (event.t === "result" && event.agent === "report-composer") {
        void fetchResult(runId)
          .then((payload) => {
            setResult(payload as RunResult);
            setIsRunning(false);
          })
          .catch((err) => {
            console.error("Failed to fetch result", err);
          });
      }

      if (event.t === "error") {
        setError(event.msg);
        setIsRunning(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [runId]);

  const handleStart = useCallback(async () => {
    if (!brief.trim()) {
      setError("Please paste a client brief to start.");
      return;
    }
    setError(null);
    setEvents([]);
    setCards({});
    setSelection(undefined);
    setResult(undefined);
    setIsRunning(true);
    try {
      const { runId: id } = await startRun(brief, mode);
      setRunId(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setIsRunning(false);
    }
  }, [brief, mode]);

  useEffect(() => {
    if (!runId) return;
    if (!events.some((event) => event.t === "result" && event.agent === "report-composer")) {
      return;
    }
    setIsRunning(false);
  }, [events, runId]);

  const handleDownload = useCallback(
    (format: "json" | "markdown") => {
      if (!result) return;
      if (format === "json") {
        const blob = new Blob([JSON.stringify(result, null, 2)], {
          type: "application/json",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `namazing-${result.profile.family?.surname ?? "run"}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        const lines: string[] = [];
        lines.push(`# Namazing — Consultation`);
        lines.push("");
        lines.push(result.report.summary);
        lines.push("");
        lines.push(`## Finalists`);
        result.report.finalists.forEach((finalist) => {
          lines.push(`- **${finalist.name}** — ${finalist.why}`);
        });
        if (result.report.combos?.length) {
          lines.push("");
          lines.push(`## Favorite First–Middle Combos`);
          result.report.combos.forEach((combo) => {
            lines.push(`- ${combo.first} ${combo.middle}: ${combo.why}`);
          });
        }
        if (result.report.tradeoffs?.length) {
          lines.push("");
          lines.push(`## Tradeoffs & Pitfalls`);
          result.report.tradeoffs.forEach((item) => lines.push(`- ${item}`));
        }
        if (result.report.tie_break_tips?.length) {
          lines.push("");
          lines.push(`## Tie-break Tips`);
          result.report.tie_break_tips.forEach((item) => lines.push(`- ${item}`));
        }
        const blob = new Blob([lines.join("\n")], {
          type: "text/markdown",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `namazing-${result.profile.family?.surname ?? "run"}.md`;
        link.click();
        URL.revokeObjectURL(link.href);
      }
    },
    [result]
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="font-display text-4xl text-studio-ink">Namazing</h1>
          <p className="mt-2 max-w-2xl text-sm text-studio-ink/70">
            An AI-powered baby-naming studio that turns a free-form family brief into a curated shortlist with live research updates.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <ToggleSerialParallel mode={mode} onChange={setMode} />
          <button
            type="button"
            onClick={handleStart}
            className="rounded-full bg-studio-ink px-5 py-2 text-sm font-semibold text-white shadow hover:bg-studio-ink/90"
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Start"}
          </button>
          {result && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-studio-ink shadow"
                onClick={() => handleDownload("json")}
              >
                Download JSON
              </button>
              <button
                type="button"
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-studio-ink shadow"
                onClick={() => handleDownload("markdown")}
              >
                Download Markdown
              </button>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </header>
      <main className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_320px]">
        <section className="space-y-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-studio-ink/60">
              Client Brief
            </h2>
            <textarea
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              rows={12}
              placeholder="Paste your client’s brief here..."
              className="mt-3 w-full resize-none rounded-xl border border-studio-ink/10 bg-studio-sand/40 p-3 text-sm text-studio-ink focus:border-studio-ink focus:outline-none"
            />
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-studio-ink/60">
              Progress
            </h2>
            <div className="mt-3">
              <ProgressTracker events={events} />
            </div>
          </div>
          <ActivityFeed events={events} />
        </section>
        <section className="space-y-4">
          <h2 className="font-display text-xl text-studio-ink/80">Live NameCards</h2>
          {cardList.length === 0 ? (
            <div className="rounded-2xl bg-white/70 p-6 text-sm text-studio-ink/60">
              As the studio researches names, cards will appear here with evidence and combo suggestions.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {cardList.map((card) => (
                <NameCardComponent key={card.name} card={card} />
              ))}
            </div>
          )}
        </section>
        <section className="space-y-4">
          <ShortlistPanel selection={selection} />
          <ReportPreview result={result} />
        </section>
      </main>
    </div>
  );
}
