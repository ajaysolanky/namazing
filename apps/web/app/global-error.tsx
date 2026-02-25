"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error.message, error.digest);
    posthog.capture("global_error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-studio-sand text-studio-ink">
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center max-w-[400px]">
            <h2 className="font-display text-2xl text-studio-ink mb-3">
              Something went wrong
            </h2>
            <p className="text-studio-ink/60 mb-6">
              We encountered an unexpected error. Please try again.
            </p>
            <button
              onClick={reset}
              className="bg-studio-ink text-white px-6 py-3 rounded-full border-0 cursor-pointer text-base hover:bg-studio-ink/90"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
