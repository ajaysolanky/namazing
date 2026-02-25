import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { buildBriefFromProfile } from "@/lib/chat-utils";
import { startRun } from "@/lib/api";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import posthog from "posthog-js";

export function ChatIntake() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    messages,
    profile,
    summary,
    isStreaming,
    isLoaded,
    error,
    sendMessage,
    resetChat,
  } = useChat();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSend = useCallback(
    (content: string) => {
      posthog.capture("chat_message_sent", {
        message_number: messages.length + 1,
      });
      sendMessage(content);
    },
    [sendMessage, messages.length]
  );

  const handleConfirm = useCallback(async () => {
    // Auth gate
    if (authLoading) return;
    if (!user) {
      posthog.capture("auth_gate_shown", { source: "chat_confirm" });
      router.push("/sign-up?next=/intake" as any);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const brief = buildBriefFromProfile(profile);
      const { runId } = await startRun(brief, "parallel");
      posthog.capture("consultation_started", { run_id: runId, source: "chat" });
      router.push(`/processing/${runId}`);
      setTimeout(() => resetChat(), 500);
    } catch (err: any) {
      console.error("[chat] Failed to start run:", err);
      if (err?.code === "DAILY_LIMIT") {
        setSubmitError(err.message);
      } else if (err?.status === 401) {
        setSubmitError("Your session has expired. Redirecting to sign in...");
        setTimeout(() => router.push("/sign-in?next=/intake" as any), 1500);
      } else if (err?.status === 502) {
        setSubmitError("Unable to connect to the server. Please try again in a moment.");
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
    }
  }, [authLoading, user, profile, router, resetChat]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-studio-ink/20 border-t-studio-ink rounded-full animate-spin" />
      </div>
    );
  }

  // Submitting full-screen transition
  if (isSubmitting && !submitError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-studio-sage/30 border-t-studio-sage rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-studio-rose to-studio-sage rounded-full animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl text-studio-ink">
              Starting your consultation
            </h2>
            <p className="text-studio-ink/60">
              We&apos;re assembling your expert naming team...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-64px)]">
      {/* Messages area */}
      <ChatMessages
        messages={messages}
        summary={summary}
        isStreaming={isStreaming}
        isSubmitting={isSubmitting}
        onSendPrompt={handleSend}
        onConfirm={handleConfirm}
      />

      {/* Errors */}
      {(error || submitError) && (
        <div className="px-4 pb-2">
          <div className="max-w-2xl mx-auto p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
            {error || submitError}
          </div>
        </div>
      )}

      {/* Input bar */}
      <ChatInput
        onSend={handleSend}
        disabled={isStreaming}
      />
    </div>
  );
}
