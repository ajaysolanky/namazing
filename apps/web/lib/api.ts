import type { RunMode } from "./types";

function getApiBaseUrl() {
  // Always use the Next.js API layer so auth and ownership checks are enforced consistently.
  return process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

export async function startRun(brief: string, mode: RunMode) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ brief, mode }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    if (res.status === 429 && body?.dailyLimit) {
      const err = new Error(
        `You've reached your daily limit of ${body.dailyLimit} naming sessions. Please try again tomorrow.`
      );
      (err as any).code = "DAILY_LIMIT";
      throw err;
    }
    const err = new Error(body?.error || `Failed to start run: ${res.status}`);
    (err as any).status = res.status;
    throw err;
  }
  return (await res.json()) as { runId: string; mode: RunMode };
}

export async function fetchResult(runId: string) {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/result/${runId}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch result: ${res.status}`);
  }
  return res.json();
}
