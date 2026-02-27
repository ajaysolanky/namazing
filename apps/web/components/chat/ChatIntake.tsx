import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import {
  buildBriefFromProfile,
  buildReadySummaryFromProfile,
  computeConsultationReadiness,
  getConsultationGaps,
} from "@/lib/chat-utils";
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
    setLocalSummary,
    resetChat,
  } = useChat();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const readiness = computeConsultationReadiness(messages, profile, summary);
  const consultationGaps = getConsultationGaps(messages, profile);
  const userMessageCount = messages.filter((message) => message.role === "user").length;

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
    };
  }, []);

  const handleSend = useCallback(
    (content: string) => {
      posthog.capture("chat_message_sent", {
        message_number: messages.length + 1,
      });
      sendMessage(content);
    },
    [sendMessage, messages.length]
  );

  useEffect(() => {
    if (summary || isStreaming || isSubmitting) {
      return;
    }

    if (userMessageCount >= 6 && consultationGaps.length === 0 && profile.narrative) {
      setLocalSummary(buildReadySummaryFromProfile(profile));
    }
  }, [
    consultationGaps.length,
    isStreaming,
    isSubmitting,
    profile,
    setLocalSummary,
    summary,
    userMessageCount,
  ]);

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

  const handleResetConversation = useCallback(() => {
    if (!window.confirm("Reset this conversation? This will clear all chat history and progress.")) {
      return;
    }
    resetChat();
    setDraft("");
    setSubmitError(null);
  }, [resetChat]);

  const handleInsertPrompt = useCallback((prompt: string) => {
    setDraft(prompt);
    const textarea = document.querySelector("textarea[placeholder='Tell us about your family...']") as HTMLTextAreaElement | null;
    if (textarea) textarea.focus();
  }, []);

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
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Messages area */}
      <ChatMessages
        messages={messages}
        readiness={readiness}
        summary={summary}
        isStreaming={isStreaming}
        isSubmitting={isSubmitting}
        consultationGaps={consultationGaps}
        onInsertPrompt={handleInsertPrompt}
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
      <div className="px-4 pb-2 shrink-0">
        <div className="max-w-2xl mx-auto flex justify-end">
          <button
            type="button"
            onClick={handleResetConversation}
            disabled={isStreaming || isSubmitting}
            className="text-xs sm:text-sm text-studio-ink/55 hover:text-studio-ink underline underline-offset-2 disabled:opacity-40"
          >
            Reset conversation
          </button>
        </div>
      </div>

      <ChatInput
        value={draft}
        onChange={setDraft}
        onSend={handleSend}
        disabled={isStreaming}
      />
    </div>
  );
}
