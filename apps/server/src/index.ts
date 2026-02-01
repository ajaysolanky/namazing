import cors from "cors";
import express, { type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import { pythonOrchestrator } from "./python-orchestrator.js";
import { saveRun, getRun, deleteRun } from "./storage.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Rate limiting: stricter for expensive operations (run creation)
const runRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // max 10 runs per minute per IP
  message: { error: "Too many run requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting: more lenient for read operations
const readRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 100, // max 100 reads per minute per IP
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/healthz", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/api/run", runRateLimiter, async (req: Request, res: Response) => {
  const { brief, mode, userId } = req.body || {};
  if (!brief || typeof brief !== "string") {
    return res.status(400).json({ error: "brief is required" });
  }

  try {
    const runMode = mode === "parallel" ? "parallel" : "serial";
    console.log(`[API] Starting new run (mode: ${runMode}, userId: ${userId || "anonymous"})`);
    const run = await pythonOrchestrator.startRun(brief, runMode, userId);

    // Save to disk for legacy fallback (exclude process object)
    if (!userId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { process: _proc, ...serializable } = run;
      await saveRun(serializable as any);
    }

    console.log(`[API] Run created: ${run.id}`);

    res.json({ runId: run.id, mode: run.mode });
  } catch (error) {
    console.error("[API] Failed to start run:", error);
    res.status(500).json({ error: "Failed to start run" });
  }
});

app.get("/api/events/:runId", readRateLimiter, async (req: Request, res: Response) => {
  const { runId } = req.params;
  // Try in-memory first (has live events), fall back to disk
  const memoryRun = pythonOrchestrator.getRun(runId);
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
  // @ts-ignore
  run.events.forEach(sendEvent);

  // Subscribe to new events (only works for in-memory runs)
  if (memoryRun) {
    const unsubscribe = pythonOrchestrator.subscribe(runId, (event) => {
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

app.get("/api/result/:runId", readRateLimiter, async (req: Request, res: Response) => {
  const { runId } = req.params;
  // Try in-memory first, fall back to disk
  const memoryRun = pythonOrchestrator.getRun(runId);
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
