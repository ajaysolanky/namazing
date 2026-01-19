import type { RunMode } from "./types";
import { API_BASE_URL } from "./config";

export async function startRun(brief: string, mode: RunMode) {
  const res = await fetch(`${API_BASE_URL}/api/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ brief, mode }),
  });
  if (!res.ok) {
    throw new Error(`Failed to start run: ${res.status}`);
  }
  return (await res.json()) as { runId: string; mode: RunMode };
}

export async function fetchResult(runId: string) {
  const res = await fetch(`${API_BASE_URL}/api/result/${runId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch result: ${res.status}`);
  }
  return res.json();
}
