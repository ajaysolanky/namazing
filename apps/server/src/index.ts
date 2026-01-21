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

  const runMode: RunMode = mode === "parallel" ? "parallel" : "serial";
  const run = orchestratorService.startRun(brief, runMode);
  await saveRun(run);

  res.json({ runId: run.id, mode: run.mode });
});

app.get("/api/events/:runId", async (req: Request, res: Response) => {
  const { runId } = req.params;
  const run = await getRun(runId);
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

  run.events.forEach(sendEvent);

  const unsubscribe = orchestratorService.subscribe(runId, (event) => {
    sendEvent(event);
  });

  req.on("close", () => {
    unsubscribe();
    res.end();
  });
});

app.get("/api/result/:runId", async (req: Request, res: Response) => {
  const { runId } = req.params;
  const run = await getRun(runId);
  if (!run) {
    res.status(404).json({ error: "run not found" });
    return;
  }
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
