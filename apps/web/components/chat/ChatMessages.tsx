import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { ChatMessage } from "@/lib/chat-utils";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { ProfileSummaryCard } from "./ProfileSummaryCard";
import type { ConsultationGap } from "@/lib/chat-utils";

interface ChatMessagesProps {
  messages: ChatMessage[];
  readiness: number;
  summary: string | null;
  isStreaming: boolean;
  isSubmitting: boolean;
  consultationGaps: ConsultationGap[];
  onInsertPrompt: (prompt: string) => void;
  onConfirm: () => void;
}

export function ChatMessages({
  messages,
  readiness,
  summary,
  isStreaming,
  isSubmitting,
  consultationGaps,
  onInsertPrompt,
  onConfirm,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming, summary]);

  const userMessageCount = messages.filter((message) => message.role === "user").length;
  const showPromptSet = userMessageCount === 0 && !isStreaming;
  const showReadiness = userMessageCount > 0 && !summary;

  return (
    <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain">
      <div className="min-h-full max-w-2xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-end">
        <div className="space-y-4">
        {showReadiness && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-3 z-10"
          >
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-studio-border shadow-soft px-4 py-3">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-xs sm:text-sm font-medium text-studio-ink/75">
                  Consultation readiness
                </p>
                <p className="text-xs sm:text-sm font-semibold text-studio-ink">{readiness}%</p>
              </div>
              <div className="h-2 rounded-full bg-studio-ink/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-studio-sage via-studio-rose to-studio-terracotta"
                  initial={{ width: 0 }}
                  animate={{ width: `${readiness}%` }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              </div>
              <p className="mt-2 text-xs text-studio-ink/55">
                You can keep chatting as long as you want. Generate the report only when you feel ready.
              </p>
            </div>
          </motion.div>
        )}

        {/* Messages */}
        {messages.map((message, index) => (
          <MessageBubble
            key={`${message.id}-${index}`}
            message={message}
            emphasize={index === 0 && message.role === "assistant" && userMessageCount === 0}
          />
        ))}

        {/* Warm starter CTA */}
        {showPromptSet && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <p className="text-center text-sm text-studio-ink/60">
              Pick a starter or type your own response below
            </p>
            <p className="text-center text-xs text-studio-ink/50">
              Tap a starter to insert it into the text box, then edit as needed.
            </p>
            <SuggestedPrompts onSelect={onInsertPrompt} />
          </motion.div>
        )}

        {/* Typing indicator */}
        {isStreaming && <TypingIndicator />}

        {/* Summary card */}
        {summary && !isStreaming && (
          <ProfileSummaryCard
            summary={summary}
            readiness={readiness}
            onConfirm={onConfirm}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
