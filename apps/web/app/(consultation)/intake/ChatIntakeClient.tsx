"use client";

import { useEffect, useState } from "react";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { ChatIntake } from "@/components/chat/ChatIntake";
import { IntakeWizard } from "@/components/intake/IntakeWizard";

const ENV_OVERRIDE = process.env.NEXT_PUBLIC_INTAKE_MODE; // "chat" | "control" — for local dev

export default function ChatIntakeClient() {
  const flagVariant = useFeatureFlagVariantKey("intake-mode");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until after mount to avoid hydration mismatch
  // (PostHog feature flags resolve differently on server vs client)
  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-studio-ink/20 border-t-studio-ink rounded-full animate-spin" />
      </div>
    );
  }

  // 1. Env var override (local dev)
  // 2. PostHog feature flag (production A/B test)
  // 3. Default to "chat"
  const variant = ENV_OVERRIDE || flagVariant || "chat";

  return variant === "control" ? <IntakeWizard /> : <ChatIntake />;
}
