"use client";

import { useEffect, useState } from "react";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { ChatIntake } from "@/components/chat/ChatIntake";
import { IntakeWizard } from "@/components/intake/IntakeWizard";

const ENV_OVERRIDE = process.env.NEXT_PUBLIC_INTAKE_MODE; // "chat" | "control" — for local dev

export default function ChatIntakeClient() {
  const flagVariant = useFeatureFlagVariantKey("intake-mode");
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    // If PostHog flags don't resolve within 1.5s (e.g. localhost, ad blocker),
    // fall through to the default variant
    const timer = setTimeout(() => setTimedOut(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // 1. Env var override (local dev)
  // 2. PostHog feature flag (production A/B test)
  // 3. Timeout fallback → default to "chat"
  const variant = ENV_OVERRIDE || flagVariant || (timedOut ? "chat" : null);

  if (!variant) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-studio-ink/20 border-t-studio-ink rounded-full animate-spin" />
      </div>
    );
  }

  return variant === "control" ? <IntakeWizard /> : <ChatIntake />;
}
