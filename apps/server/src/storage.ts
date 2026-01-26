import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store runs in apps/server/runs directory
const STORAGE_DIR = path.resolve(__dirname, "..", "runs");

// Using a simple type instead of importing to avoid circular deps
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

export async function saveRun(run: RunRecord): Promise<void> {
  await ensureStorageDir();
  const filePath = path.join(STORAGE_DIR, `${run.id}.json`);
  // Exclude emitter from serialization - EventEmitter can't be JSON-serialized
  const { emitter, ...serializable } = run;
  await fs.writeFile(filePath, JSON.stringify(serializable, null, 2));
}

export async function getRun(runId: string): Promise<RunRecord | null> {
  const filePath = path.join(STORAGE_DIR, `${runId}.json`);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as RunRecord;
  } catch (error) {
    return null;
  }
}

export async function deleteRun(runId: string): Promise<void> {
  const filePath = path.join(STORAGE_DIR, `${runId}.json`);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete run ${runId}: ${error}`);
  }
}
