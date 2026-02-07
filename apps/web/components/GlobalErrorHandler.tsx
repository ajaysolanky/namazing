"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function GlobalErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = event.reason instanceof Error ? event.reason.message : String(event.reason);
      console.error("[unhandled] Unhandled promise rejection:", message);
      posthog.capture("unhandled_error", { type: "unhandledrejection", message });
    };

    const handleError = (event: ErrorEvent) => {
      console.error("[unhandled] Uncaught error:", event.message);
      posthog.capture("unhandled_error", { type: "error", message: event.message, filename: event.filename });
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
