import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { supabase } from "./supabase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fallback file-based storage when Supabase is not configured
const STORAGE_DIR = path.resolve(__dirname, "..", "runs");

interface RunRecord {
  id: string;
  [key: string]: unknown;
}

async function ensureStorageDir() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  } catch (error) {
    console.error(`Failed to create storage directory: ${error}`);
  }
}

// ---------------------------------------------------------------------------
// Supabase-backed storage
// ---------------------------------------------------------------------------

export async function createRun(
  userId: string,
  brief: string,
  mode: string
): Promise<string> {
  if (supabase) {
    const { data, error } = await supabase
      .from("runs")
      .insert({ user_id: userId, brief: { text: brief }, mode, status: "running" })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  }
  // Fallback: caller generates ID
  throw new Error("Supabase not configured — use legacy saveRun instead");
}

export async function updateRunStatus(
  runId: string,
  status: string
): Promise<void> {
  if (supabase) {
    const update: Record<string, unknown> = { status };
    if (status === "completed") update.completed_at = new Date().toISOString();
    const { error } = await supabase.from("runs").update(update).eq("id", runId);
    if (error) console.error("[storage] updateRunStatus error:", error);
    return;
  }
}

export async function saveRunResult(
  runId: string,
  result: unknown,
  markdown?: string
): Promise<void> {
  if (supabase) {
    const { error } = await supabase
      .from("run_results")
      .upsert({ run_id: runId, result, report_markdown: markdown ?? null });
    if (error) console.error("[storage] saveRunResult error:", error);
    return;
  }
}

export async function getRun(runId: string): Promise<RunRecord | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("runs")
      .select("*, run_results(*)")
      .eq("id", runId)
      .single();
    if (error || !data) return null;
    // Flatten: attach result from run_results if present
    const result = data.run_results?.[0]?.result ?? data.run_results?.result ?? null;
    return { ...data, result };
  }
  // Fallback to file
  const filePath = path.join(STORAGE_DIR, `${runId}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as RunRecord;
  } catch {
    return null;
  }
}

export async function deleteRun(runId: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from("runs").delete().eq("id", runId);
    if (error) console.error("[storage] deleteRun error:", error);
    return;
  }
  // Fallback to file
  const filePath = path.join(STORAGE_DIR, `${runId}.json`);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete run ${runId}: ${error}`);
  }
}

// Legacy file-based save (used when Supabase is not configured)
export async function saveRun(run: RunRecord): Promise<void> {
  await ensureStorageDir();
  const filePath = path.join(STORAGE_DIR, `${run.id}.json`);
  const { emitter, ...serializable } = run;
  await fs.writeFile(filePath, JSON.stringify(serializable, null, 2));
}
