import cors from "cors";
import express, { type Request, type Response } from "express";
import { orchestratorService } from "@namazing/orchestrator";
import type { RunMode } from "@namazing/orchestrator";
import { saveRun, getRun, deleteRun } from "./storage";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/healthz", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/api/run", async (req: Request, res: Response) => {
  const { brief, mode } = req.body || {};
  if (!brief || typeof brief !== "string") {
    return res.status(400).json({ error: "brief is required" });
  }

  try {
    const runMode: RunMode = mode === "parallel" ? "parallel" : "serial";
    console.log(`[API] Starting new run (mode: ${runMode})`);
    const run = orchestratorService.startRun(brief, runMode);
    await saveRun(run);
    console.log(`[API] Run created: ${run.id}`);

    res.json({ runId: run.id, mode: run.mode });
  } catch (error) {
    console.error("[API] Failed to start run:", error);
    res.status(500).json({ error: "Failed to start run" });
  }
});

app.get("/api/events/:runId", async (req: Request, res: Response) => {
  const { runId } = req.params;
  // Try in-memory first (has live events), fall back to disk
  const memoryRun = orchestratorService.getRun(runId);
  const diskRun = await getRun(runId);
  const run = memoryRun || diskRun;

  if (!run) {
    res.status(404).end();
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (event: unknown) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  // Send all existing events from the in-memory run
  run.events.forEach(sendEvent);

  // Subscribe to new events (only works for in-memory runs)
  if (memoryRun) {
    const unsubscribe = orchestratorService.subscribe(runId, (event) => {
      sendEvent(event);
    });

    req.on("close", () => {
      unsubscribe();
      res.end();
    });
  } else {
    // Run is from disk (completed), no live updates
    req.on("close", () => {
      res.end();
    });
  }
});

app.get("/api/result/:runId", async (req: Request, res: Response) => {
  const { runId } = req.params;
  // Try in-memory first, fall back to disk
  const memoryRun = orchestratorService.getRun(runId);
  const diskRun = await getRun(runId);
  const run = memoryRun || diskRun;

  if (!run) {
    res.status(404).json({ error: "run not found" });
    return;
  }

  // Prevent caching
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");

  if (!run.result) {
    res.status(202).json({ status: run.status });
    return;
  }
  res.json(run.result);
});

app.delete("/api/run/:runId", async (req: Request, res: Response) => {
  const { runId } = req.params;
  await deleteRun(runId);
  res.status(204).end();
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server listening on http://0.0.0.0:${PORT}`);
});
