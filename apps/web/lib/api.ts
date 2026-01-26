import type { RunMode } from "./types";

// Determine base URL at runtime
function getApiBaseUrl() {
  // Server-side: go directly to backend
  if (typeof window === "undefined") {
    return process.env.BACKEND_URL || "http://localhost:4000";
  }
  // Client-side: use same-origin proxy
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
    throw new Error(`Failed to start run: ${res.status}`);
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
