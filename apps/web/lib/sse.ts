'use client';

import type { ActivityEvent } from "./types";
import { API_BASE_URL } from "./config";

export function subscribeToRun(
  runId: string,
  onEvent: (event: ActivityEvent) => void
) {
  const source = new EventSource(`${API_BASE_URL}/api/events/${runId}`);
  source.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as ActivityEvent;
      onEvent(data);
    } catch (error) {
      console.error("Failed to parse SSE event", error);
    }
  };
  source.onerror = (error) => {
    console.error("SSE connection error", error);
    source.close();
  };
  return () => source.close();
}
