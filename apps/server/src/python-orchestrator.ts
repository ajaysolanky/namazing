import { spawn, type ChildProcessWithoutNullStreams } from "child_process";
import path from "path";
import { EventEmitter } from "eventemitter3";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";
import { createRun, saveRun, saveRunResult, updateRunStatus } from "./storage.js";
import { supabase } from "./supabase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RunContext {
  id: string;
  brief: string;
  process: ChildProcessWithoutNullStreams;
  events: any[];
  emitter: EventEmitter;
  result: any | null;
  status: "pending" | "running" | "completed" | "failed";
  mode: "serial" | "parallel";
}

export class PythonOrchestrator {
  private runs = new Map<string, RunContext>();
  private pythonPath: string;
  private cwd: string;

  constructor() {
    let rootDir = process.cwd();
    if (rootDir.endsWith("apps/server")) {
      rootDir = path.resolve(rootDir, "../..");
    }

    this.cwd = path.resolve(rootDir, "namazing-py");
    this.pythonPath = path.resolve(this.cwd, ".venv/bin/python");
  }

  async startRun(brief: string, mode: "serial" | "parallel", userId?: string): Promise<RunContext> {
    let id: string;

    // Use Supabase-generated ID if authenticated, else fallback
    if (userId && supabase) {
      id = await createRun(userId, brief, mode);
    } else {
      id = uuid();
    }

    const emitter = new EventEmitter();
    const startTime = Date.now();

    console.log(`[PythonOrchestrator] Spawning run ${id}: ${this.pythonPath} -m namazing.cli.app run ... (mode=${mode})`);

    const child = spawn(
      this.pythonPath,
      [
        "-m", "namazing.cli.app", "run",
        brief,
        "--mode", mode,
        "--format", "json-stream",
        "--no-stubs"
      ],
      {
        cwd: this.cwd,
        env: {
            ...process.env,
            PYTHONPATH: path.resolve(this.cwd, "src")
        }
      }
    );

    const run: RunContext = {
      id,
      brief,
      process: child,
      events: [],
      emitter,
      result: null,
      status: "running",
      mode
    };

    this.runs.set(id, run);

    let buffer = "";

    child.stdout.on("data", (data) => {
      buffer += data.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const event = JSON.parse(line);

          if (event.t === "run-complete") {
             run.result = event.result;
             run.status = "completed";
             const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
             console.log(`[PythonOrchestrator] Run ${id} completed in ${elapsed}s`);
             // Save to Supabase if available
             if (supabase && userId) {
               saveRunResult(id, event.result).catch((err) => {
                 console.error("[PythonOrchestrator] Failed to save result:", err);
               });
               updateRunStatus(id, "completed").catch((err) => {
                 console.error("[PythonOrchestrator] Failed to update status:", err);
               });
             } else {
               const { process: _proc, emitter: _em, ...serializable } = run;
               saveRun(serializable as any).catch((err) => {
                 console.error("[PythonOrchestrator] Failed to save run:", err);
               });
             }
             continue;
          }

          run.events.push(event);
          run.emitter.emit("event", event);

        } catch (e) {
          console.error("[PythonOrchestrator] Failed to parse JSON:", line);
        }
      }
    });

    child.stderr.on("data", (data) => {
      console.error(`[PythonOrchestrator] stderr: ${data}`);
    });

    child.on("close", (code) => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[PythonOrchestrator] Process for run ${id} exited with code ${code} after ${elapsed}s (${run.events.length} events)`);

      if (buffer.trim()) {
        try {
          const event = JSON.parse(buffer);
          if (event.t === "run-complete") {
            run.result = event.result;
            run.status = "completed";
            console.log(`[PythonOrchestrator] Captured run-complete from buffer for run ${id}`);
          } else {
            run.events.push(event);
            run.emitter.emit("event", event);
          }
        } catch (e) {
          console.error("[PythonOrchestrator] Failed to parse buffered JSON:", buffer);
        }
      }

      if (code !== 0 && run.status !== "completed") {
        run.status = "failed";
        run.emitter.emit("event", { t: "error", msg: `Process exited with code ${code}` });
        if (supabase && userId) {
          updateRunStatus(id, "failed").catch((err) => {
            console.error(`[PythonOrchestrator] Failed to update status to failed for run ${id}:`, err);
          });
        }
      }

      // Final save for legacy file storage
      if (!supabase || !userId) {
        const { process: _proc, emitter: _em, ...serializable } = run;
        saveRun(serializable as any).catch((err) => {
          console.error("[PythonOrchestrator] Failed to save run:", err);
        });
      }
    });

    return run;
  }

  getRun(id: string) {
    return this.runs.get(id);
  }

  subscribe(id: string, callback: (event: any) => void) {
    const run = this.runs.get(id);
    if (!run) throw new Error("Run not found");
    run.emitter.on("event", callback);
    return () => run.emitter.off("event", callback);
  }
}

export const pythonOrchestrator = new PythonOrchestrator();
