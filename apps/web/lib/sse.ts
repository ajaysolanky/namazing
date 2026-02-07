'use client';

import type { ActivityEvent } from "./types";
import { SSE_BASE_URL } from "./config";

export function subscribeToRun(
  runId: string,
  onEvent: (event: ActivityEvent) => void,
  onError?: () => void
) {
  const source = new EventSource(`${SSE_BASE_URL}/api/events/${runId}`);
  source.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as ActivityEvent;
      onEvent(data);
    } catch (error) {
      console.error("[sse] Failed to parse event", error);
    }
  };
  source.onerror = (error) => {
    console.error("[sse] Connection error", error);
    source.close();
    onError?.();
  };
  return () => source.close();
}
